'use strict';

const REPL = require('repl');
const co = require('co');
const cliff = require('cliff');
const readline = require('readline');
const EventEmitter = require('events');
const StdIn = require('./stdin');
const Db = require('./db');
const Executor = require('./executor');
const rewriteScript = require('./executor').rewriteScript;
const Help = require('./help');
const Plugins = require('./plugins');
const Recoverable = REPL.Recoverable;
const { Collection, Cursor } = require('mongodb');
const vm = require('vm');
const debug = require('util').debuglog('translator');
const LegacyWriter = require('./output/legacy');
const ExtJSONWriter = require('./output/extjson');
const { palette } = require('./colors');
const { bytesToGBString } = require('./helpers');
const fs = require('fs');
const path = require('path');
const os = require('os');
const Interface = require('readline').Interface;
const CursorResult = require('./cursor_result');

function bailOnIllegalToken(parser) {
  return parser._literal === null &&
         !parser.blockComment &&
         !parser.regExpLiteral;
}

function isRecoverableError(e, replServer) {
  if (e && e.name === 'SyntaxError') {
    const message = e.message;
    if (message === 'Unterminated template literal' ||
        message === 'Missing } in template expression') {
      replServer._inTemplateLiteral = true;
      return true;
    }

    if (message.startsWith('Unexpected end of input') ||
        message.startsWith('missing ) after argument list') ||
        message.startsWith('Unexpected token')) {
      return true;
    }

    if (message === 'Invalid or unexpected token') {
      return !bailOnIllegalToken(replServer.lineParser);
    }
  }

  return false;
}

function preprocess(code) {
  let cmd = code;
  if (/^\s*\{/.test(cmd) && /\}\s*$/.test(cmd)) {
    // It's confusing for `{ a : 1 }` to be interpreted as a block
    // statement rather than an object literal.  So, we first try
    // to wrap it in parentheses, so that it will be interpreted as
    // an expression.
    cmd = `(${cmd})`;
  }
  // Append a \n so that it will be either
  // terminated, or continued onto the next expression if it's an
  // unexpected end of input.
  return `${cmd}\n`;
}

class MongoREPL extends EventEmitter {
  constructor(state, options = {}) {
    super();
    // Default Executor used for the shell
    this.executor = new Executor();
    // Apply default values
    this.options = Object.assign({
      prompt: 'mongodb> ',
      renderView: 'repl',
      useColors: false,
      history: true
    }, options);
    // Internal shell state
    this.state = state;
    // Set the current rendered
    this.state.writer = new LegacyWriter(require('mongodb'));
    // Add console.logger
    this.log = options.log || console.log;
    // node.js Repl instance
    this.repl = null;
    // Help module
    this.help = new Help(this.state, this.log);
    // Input stream wrapper
    this.input = options.input || new StdIn(process.stdin);
    this.output = options.output;
    // Render mode
    this.render = options.render || 'text';
    // Disable .exit trapping
    this.disableOnExit = options.disableOnExit || false;
  }

  // We have access to the context
  __completer(line, callback) {
    let self = this;

    co(function* () {
      // Do we have a db instance
      let parts = line.split('.');

      // Is the connection down
      if (!self.state.client.serverConfig.isConnected()) {
        try {
          yield self.state.client.open();
        } catch (err) {}
      }

      // DB level operations
      // Go the options for the db object
      if (parts[0] === 'db' && parts.length <= 2) {
        if (!self.state.client) {
          return callback(null, [[], line]);
        }

        let collections = [];
        // Select a db
        const selectedDb = self.state.client.db(self.state.context.db.name);
        // Get the cursor
        let cursor = selectedDb.listCollections();

        // Attempt to filter the collection
        if (parts.length !== 1) {
          try {
            cursor = selectedDb.listCollections({ name: new RegExp(`^${parts[1]}`) });
          } catch (err) {}
        }

        // Get all the collection objects, if failure just ignore (due to auth)
        try {
          collections = yield cursor.toArray();
        } catch (err) {
          self.log(err);
        }

        let hints = collections.map(entry => `db.${entry.name}`);

        // Db object methods
        const methods = Object.getOwnPropertyNames(Db.prototype)
          .filter(entry => entry !== 'constructor')
          .map(entry => `db.${entry}(`);

        // Now mix in the prototype methods
        try {
          hints = hints.concat(methods)
            .filter(entry => entry.match(new RegExp(`^db.${parts[1]}`))).sort();
        } catch (err) {}

        // Return hints
        self.help.autocomplete('db', hints);
        return callback(null, [hints, line]);
      } else if (parts[0] === 'db' && parts.length <= 3) {
        // Db object methods
        const hints = Object.getOwnPropertyNames(Collection.prototype)
          .filter(entry => entry !== 'constructor')
          .map(entry => `db.${parts[1]}.${entry}(`)
          .filter(entry => entry.startsWith(line));
        // Return hints
        self.help.autocomplete('db.collection', hints);
        return callback(null, [hints, line]);
      } else if (parts[0] !== 'db' && parts.length === 1) {
        // Add context names
        const contextNames = Object.keys(self.state.context);

        // Add all namespaces
        const namespaces = self.state.plugins.map(plugin => {
          return plugin.namespace();
        });

        // Filter the hint
        const hints = namespaces.concat(contextNames)
          .filter(entry => entry.startsWith(line));
        // Return hints
        return callback(null, [hints, line]);
      } else if (parts[0] !== 'db' && parts.length > 1 && self.state.context[parts[0]]) {
        let object = self.state.context;
        let validPath = [];
        // Attempt to introspect the path
        for (let i = 0; i < parts.length; i++) {
          if (object[parts[i]] && typeof object[parts[i]] === 'object') {
            object = object[parts[i]];
            validPath.push(parts[i]);
          }
        }

        // Db object methods
        const hints = Object.getOwnPropertyNames(Object.getPrototypeOf(object))
          .filter(entry => entry !== 'constructor')
          .map(entry => {
            return (typeof object[entry] === 'function') ?
              `${validPath.join('.')}.${entry}(` : `${validPath.join('.')}.${entry}`;
          })
          .filter(entry => entry.startsWith(line));

        // Delegate to the plugin
        self.help.autocomplete(parts[0], hints);

        // Return hints
        return callback(null, [hints, line]);
      }

      // No hints return nothing
      callback(null, [[], line]);
    }).catch(err => {
      self.log(err);
      callback(null, [[], line]);
    });
  }

  __writer(line) {
    return this.state.writer.write(line);
  }

  __eval(code, _context, filename, callback) {
    // console.log("_eval called :: " + code);

    // Remove trailing new line
    code = code.replace(/\n$/, '');
    code = preprocess(code);
    code = code.trim();

    // console.log("_eval --- 0")

    if (code === '\n' || code === '') {
      return callback(null);
    }

    // console.log("_eval --- 1")

    // now attempt execution
    const self = this;
    const cutoff = 20;
    const context = this.state.context;

    (async function() {
      try {
    // console.log("_eval --- 2")
        code = code.trim();
    // console.log("_eval --- 3")
    // console.log(self.state)

        // Check if we called a plugin
        for (const plugin of self.state.plugins) {
          if (plugin.namespace() === code && typeof context[code] === 'function') {
            const pluginResult = context[code]();
            
            if (pluginResult instanceof Promise && plugin.usesTerminal() == true) {
              // Pause the input for the current repl (in practice disabling it)
              self.input.pause();
              // Defer control to the plugin
              const result = await pluginResult;
              // Create new stdin wrapper
              self.input = new StdIn(process.stdin);
              // Create a new repl to force rest of terminal handler
              self.repl = REPL.start(Object.assign({
                input: self.input,
                output: self.output || process.stdout,
                prompt: self.options.prompt, ignoreUndefined: true,
                writer: self.__writer.bind(self),
                eval: self.__eval.bind(self),
                completer: self.__completer.bind(self)
              }, self.options));
              
              // Received .exit
              if(!self.disableOnExit) {
                self.repl.on('exit', () => {
                  process.exit(0);
                });
              }

              // Is the stdin pauses
              if (process.stdin.isPaused()) {
                process.stdin.resume();
              }

              if (!self.options.history) {
                return callback(null, result);
              }

              // Return any results
              self.repl.historySize = 1000;
              // Setup history support
              return setupHistory(self.repl, (err, repl) => {
                if (err) return callback(err);
                callback(null, result);
              });
            } else if (pluginResult instanceof Promise && !plugin.usesTerminal()) {
              return callback(null, await pluginResult);
            } else if (!(pluginResult instanceof Promise) && plugin.usesTerminal()) {
              return callback(new Error(`plugin ${plugin.namespace()} that uses the terminal does not return a promise`));
            }

            return callback(null, pluginResult);
          }
        }

        // console.log("_eval --- 4")

        // First attempt custom commands
        if (code === 'exit' || code === 'quit') {
          // console.log("_eval --- 4:0")
          process.exit(0);
        } else if (code === 'help' || code.startsWith('help ')) {
          // console.log("_eval --- 4:1")
          return callback(null, self.help.cmd(code));
        } else if (code === 'use') {
          // console.log("_eval --- 4:2")
          return callback(null, "use command requires format 'use <dbname:string>'");
        } else if (code === 'plugin' || code.startsWith('plugin ')) {
          // console.log("_eval --- 4:3")
          return callback(null, await Plugins.cmd(code, self.state));
        } else if (code === 'output' || code.startsWith('output ')) {
          // console.log("_eval --- 4:4")
          const parts = code.split(' ').map(x => x.trim());

          if (parts.length === 1 || (parts.length >= 2 && parts[1] === 'list')) {
            let outputs = [[palette.string.bold('Output'), palette.string.bold('Description')],
              [palette.string('shell'), 'Mongo Shell output format'],
              [palette.string('extjson'), 'Extended JSON output format']];
            return callback(null, cliff.stringifyRows(outputs, []));
          } else if (parts.length >= 2) {
            if (parts[1] === 'shell') {
              self.state.writer = new LegacyWriter(require('mongodb'));
            } else if (parts[1] === 'extjson') {
              self.state.writer = new ExtJSONWriter(require('mongodb'));
            }

            // Signal we switched the output mode
            return callback(null, `repl output mode switched to ${palette.string.bold(parts[1])}`);
          }

          // Illegal output writer selected
          return callback(new Error('illegal output writer'));
        } else if (code.indexOf('use ') === 0) {
          // console.log("_eval --- 4:5")
          let db = code.split(' ')[1].trim();
          // Set the context db
          context.db = Db.proxy(db, self.state);
          // Print that db changed
          return callback(null, `switched to db: ${db}`);
        } else if (code === 'show logs') {
          // console.log("_eval --- 4:6")
          let result = await self.state.client.db('admin').command({ getLog: '*'});
          return callback(null, result.names.map(x => palette.string.green(x)).join('\n'));
        } else if (code.startsWith('show log')) {
          // console.log("_eval --- 4:7")
          const parts = code.split(' ').map(x => x.trim());
          if (parts.length <= 2) return callback(new Error('illegal show log command must be like: show log <logname>'));
          let result = await self.state.client.db('admin').command({ getLog: parts.pop()});
          return callback(null, result.log.join('\n'));
        } else if (code === 'show roles') {
          // console.log("_eval --- 4:8")
          let roles = await context.db.getRoles({showBuiltinRoles: true});
          return callback(null, roles);
        } else if (code === 'show users') {
          // console.log("_eval --- 4:9")
          let roles = await context.db.getUsers();
          return callback(null, roles);
        } else if (code === 'show dbs' || code === 'show databases') {
          // console.log("_eval --- 4:10")
          let result = await self.state.client.db('admin').command({ listDatabases: true });
          if(self.render == 'json') return callback(null, result);

          let databases = [['Name', 'Size (GB)', 'Is Empty']
            .map(header => palette.string.bold(header))].concat(result.databases.map(database => {
              return [
                palette.string(database.name),
                palette.number(`${bytesToGBString(database.sizeOnDisk)}GB`),
                palette.boolean(database.empty)
              ];
            }));

          return callback(null, cliff.stringifyRows(databases, []));
        } else if (code === 'show collections') {
          // console.log("_eval --- 4:11")
          let collectionNames = await context.db.getCollectionNames();
          if(self.render == 'json') return callback(null, collectionNames);
          return callback(null, collectionNames.map(col => palette.string(col)).join('\n'));
        } else if (code === 'it') {
          // console.log("_eval --- 4:12")
          // if (context.__currentCursor instanceof Cursor && !context.__currentCursor.isClosed()) {
          if(context.__currentCursor 
            && context.__currentCursor.topology 
            && typeof context.__currentCursor.next == 'function'
            && !context.__currentCursor.isClosed()) {
            const documents = [];

            // Read the first 20 entries or until empty
            while (true) {
              let doc = await context.__currentCursor.next();
              // No more entries
              if (!doc) break;
              documents.push(doc);
              // Check if we reached the cutoff
              if (documents.length === cutoff) break;
            }

            // Return a cursor Result
            let hasMore = documents.length === cutoff && !context.__currentCursor.isClosed();
            if(self.render === 'json') return callback(null, new CursorResult(documents, hasMore));
            return callback(null, new CursorResult(documents, hasMore).render());
          }

          return callback(null, 'No active cursor');
        }

        // console.log("_eval --- 6")

        // first attempt to parse without rewriting
        let err;
        while (true) {
          try {
            vm.createScript(code, { filename: filename, displayErrors: false });
          } catch (e) {
            if (isRecoverableError(e, self.repl)) {
              err = new Recoverable(e);
            } else {
              err = e;
            }
          }
          break;
        }

        if (err) {
          callback(err, null);
          return;
        }

        // Otherwise attempt evaluation
        // @TODO: this does not support code that is _already_ in async form!
        code = rewriteScript(code, { repl: true }).toString().trim();

        debug('[EVAL] ' + code);

        // Is the connection down
        if (!self.state.client.serverConfig.isConnected()) {
          try {
            await self.state.client.open();
          } catch (e) {}
        }

        // Evaluate the script
        const script = new vm.Script(code, {});
        let result = await script.runInContext(context);

        // Check if the __result is Cursor instance (handle specially)
        // if (result instanceof Cursor && code !== 'it') {
        if(result && result.topology && typeof result.next == 'function' && code !== 'it') {
          // console.log("----- cursor 0")
          const documents = [];

          // Set the current context cursor
          context.__currentCursor = result;

          // console.log("----- cursor 1")
          // Read the first 20 entries or until empty
          while (true) {
            let doc = await result.next();
            // No more entries
            if (!doc) break;
            documents.push(doc);
            // Check if we reached the cutoff
            if (documents.length === cutoff) break;
          }

          // console.log("----- cursor 2")
          
          // Return a cursor Result
          let hasMore = documents.length === cutoff && !context.__currentCursor.isClosed();
          // console.log("----- cursor 3 :: " + self.render)

          result = self.render === 'json'
            ? new CursorResult(documents, hasMore)
            : new CursorResult(documents, hasMore).render();
        } else if (result instanceof Db) {
          result = result.name;
        } else if (result instanceof Collection) {
          result = result.namespace;
        } else if (typeof finalResult === 'function') {
          result = `${context.__namespace}.${result.name}`;
        }

        // Callback with the result
        callback(null, typeof result !== 'undefined' ? result : '');
      } catch (e) {
        if (isRecoverableError(e, self.repl)) {
          callback(new Recoverable(e), null);
          return;
        }

        // Check if we need to try to reconnect
        if (!self.state.client.serverConfig.isConnected()) {
          await self.state.client.open();
        }

        // Return an error
        callback(null, `ERROR: ${e.message || e}`);
      }
    })();
  }

  async start() {
    // console.log("!!!!!!!!!!!!!!!!!!!!! start 0")
    let self = this;
    // console.log("!!!!!!!!!!!!!!!!!!!!! start 1")
    let $setPrompt = readline.Interface.prototype.setPrompt;
    readline.Interface.prototype.setPrompt = function(prompt) {
    // console.log("!!!!!!!!!!!!!!!!!!!!! start 2:0")
      if (self.state.context.db) {
    // console.log("!!!!!!!!!!!!!!!!!!!!! start 2:1")
        // Get the last ismaster
        const ismaster = self.state.client.topology.lastIsMaster();
        const enterprise = typeof self.state.enterprise === 'boolean'
          ? self.state.enterprise : false;

    // console.log("!!!!!!!!!!!!!!!!!!!!! start 2:2")

        // Get the database name
        const dbName = self.state.context.db && self.state.context.db.name
          ? self.state.context.db.name
          : 'N/A';
    // console.log("!!!!!!!!!!!!!!!!!!!!! start 2:3")

        // Generate prompt start
        const promptStart = enterprise
          ? 'Mongodb Enterprise'
          : 'mongodb';
    // console.log("!!!!!!!!!!!!!!!!!!!!! start 2:3")

        // Render a custom prompt
        if (prompt && !prompt.match(/^\.\./)) {
          if (ismaster.hosts) {
            let serverType = null;

            if (ismaster.ismaster) {
              serverType = 'PRIMARY';
            } else if (ismaster.secondary) {
              serverType = 'SECONDARY';
            } else if (ismaster.arbiterOnly) {
              serverType = 'ARBITER';
            }

            const string = `${promptStart} [${palette.string.bold(dbName)}]:${serverType}> `;
            return $setPrompt.call(this, string, string.length);
          }

          const string = `${promptStart} [${palette.string.bold(dbName)}]> `;
          return $setPrompt.call(this, string, string.length);
        }
    // console.log("!!!!!!!!!!!!!!!!!!!!! start 2:4")
      }

      return $setPrompt.apply(this, arguments);
    };

    // console.log("!!!!!!!!!!!!!!!!!!!!! start 2")
    this.repl = REPL.start(Object.assign({
      input: this.input,
      output: process.stdout,
      prompt: this.options.prompt, ignoreUndefined: true,
      writer: this.__writer.bind(this),
      eval: this.__eval.bind(this),
      completer: this.__completer.bind(this)
    }, this.options));
    // console.log("!!!!!!!!!!!!!!!!!!!!! start 3")

    // Received .exit
    if(!self.disableOnExit) {
      this.repl.on('exit', () => {
        process.exit(0);
      });
    }

    if (!this.options.history) {
      return this.repl;
    }
    // console.log("!!!!!!!!!!!!!!!!!!!!! start 4")

    // support history
    return new Promise((resolve, reject) => {
    // console.log("!!!!!!!!!!!!!!!!!!!!! start 4")
      this.repl.historySize = 1000;
      setupHistory(this.repl, (err, repl) => {
    // console.log("!!!!!!!!!!!!!!!!!!!!! start 5")
        if (err) return reject(err);
        resolve(repl);
      });
    });
  }
}

const kDebounceHistoryMS = 15;
function setupHistory(repl, ready) {
  let historyPath;
  try {
    historyPath = path.join(os.homedir(), '.mongo_repl_history');
  } catch (err) {
    repl._writeToOutput('\n[ERROR]: Could not get the home directory.\n' +
                        'REPL session history will not be persisted.\n');
    repl._refreshLine();

    debug(err.stack);
    repl._historyPrev = _replHistoryMessage;
    return ready(null, repl);
  }

  let timer = null;
  let writing = false;
  let pending = false;
  repl.pause();

  // History files are conventionally not readable by others:
  // https://github.com/nodejs/node/issues/3392
  // https://github.com/nodejs/node/pull/3394
  fs.open(historyPath, 'a+', 0o0600, oninit);

  function oninit(err, hnd) {
    if (err) {
      // Cannot open history file.
      // Don't crash, just don't persist history.
      repl._writeToOutput('\nError: Could not open history file.\n' +
                          'REPL session history will not be persisted.\n');
      repl._refreshLine();
      debug(err.stack);

      repl._historyPrev = _replHistoryMessage;
      repl.resume();
      return ready(null, repl);
    }
    fs.close(hnd, onclose);
  }

  function onclose(err) {
    if (err) {
      return ready(err);
    }
    fs.readFile(historyPath, 'utf8', onread);
  }

  function onread(err, data) {
    if (err) {
      return ready(err);
    }

    if (data) {
      repl.history = data.split(/[\n\r]+/, repl.historySize);
    }

    fs.open(historyPath, 'w', onhandle);
  }

  function onhandle(err, hnd) {
    if (err) {
      return ready(err);
    }

    repl._historyHandle = hnd;
    repl.on('line', online);

    // reading the file data out erases it
    repl.once('flushHistory', function() {
      repl.resume();
      ready(null, repl);
    });

    flushHistory();
  }

  // ------ history listeners ------
  function online() {
    repl._flushing = true;

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(flushHistory, kDebounceHistoryMS);
  }

  function flushHistory() {
    timer = null;
    if (writing) {
      pending = true;
      return;
    }
    writing = true;
    const historyData = repl.history.join(os.EOL);
    fs.write(repl._historyHandle, historyData, 0, 'utf8', onwritten);
  }

  function onwritten(err, data) {
    writing = false;
    if (pending) {
      pending = false;
      online();
    } else {
      repl._flushing = Boolean(timer);
      if (!repl._flushing) {
        repl.emit('flushHistory');
      }
    }
  }
}

function _replHistoryMessage() {
  if (this.history.length === 0) {
    this._writeToOutput(
        '\nPersistent history support disabled. ' +
        'Set the NODE_REPL_HISTORY environment\nvariable to ' +
        'a valid, user-writable path to enable.\n'
    );
    this._refreshLine();
  }

  this._historyPrev = Interface.prototype._historyPrev;
  return this._historyPrev();
}

module.exports = MongoREPL;
