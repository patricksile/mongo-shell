'use strict';

const repl = require('repl');
const co = require('co');
const cliff = require('cliff');
const readline = require('readline');
const EventEmitter = require('events');
const Db = require('./db');
const Executor = require('./executor');
const rewriteScript = require('./executor').rewriteScript;
const Help = require('./help');
const Recoverable = repl.Recoverable;
const { Collection, Cursor, ObjectId } = require('mongodb');
const vm = require('vm');

const {
  palette,
  colorize
} = require('./colors');

const {
  bytesToGBString,
  fixBSONTypeOutput
} = require('./helpers');

ObjectId.prototype.toJSON = function() {
  return `ObjectId("${this.toHexString()}")`;
};

function isRecoverableError(e, self) {
  if (e && e.name === 'SyntaxError') {
    let message = e.message;
    if (message.match(/^Unexpected token/)) {
      return true;
    }
  }

  return false;
}

function nodePreprocess(code) {
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

// credit: https://gist.github.com/princejwesley/a66d514d86ea174270210561c44b71ba
function preprocess(input) {
  const awaitMatcher = /^(?:\s*(?:(?:let|var|const)\s)?\s*([^=]+)=\s*|^\s*)(await\s[\s\S]*)/;
  const asyncWrapper = (code, binder) => {
    let assign = binder ? `global.${binder} = ` : '';
    return `(() => { async function _wrap() { return ${assign}${code} } return _wrap(); })();`;
  };

  // match & transform
  const match = input.match(awaitMatcher);
  return (match) ? `${asyncWrapper(match[2], match[1])}` : input;
}

function displayHelp(context, hints) {  // eslint-disable-line
  if (hints.length !== 1) return;

  let hint = hints[0].trim();
  let functionName = hint.split('.').slice(-1)[0];
  functionName = functionName.endsWith('(') ? functionName.substring(0, functionName.length - 1) : functionName;

  let namespace = context.startsWith('db') ? Db : Collection;
  let func = namespace.prototype[functionName];
  if (typeof func === 'undefined') return;

  let help = func.help;
  if (typeof help !== 'undefined') {
    console.log('');
    help(false, hint);
    console.log('');
  }
}

class CursorResult {
  constructor(documents, hasMore) {
    this.documents = documents;
    this.hasMore = hasMore;
  }

  render(options = {}) {
    let results = this.documents.map(doc => {
      return JSON.stringify(doc).replace(/,/g, ', ').replace(/:/g, ': ');
    });
    if (this.hasMore) {
      results.push('Type "it" for more');
    }
    return results.join('\n');
  }
}

class REPL extends EventEmitter {
  constructor(state, options = {}) {
    super();

    // Default Executor used for the shell
    this.executor = new Executor();
    // Apply default values
    this.options = Object.assign({
      prompt: 'mongodb []> ',
      renderView: 'repl',
      useColors: false
    }, options);
    // Internal shell state
    this.state = state;
    // The REPL context
    this.context = state.context;
    // Unwrap any plugins
    this.plugins = this.options.plugins || [];
    // node.js Repl instance
    this.repl = null;
  }

  // We have access to the context
  __completer(line, callback) {
    let self = this;

    co(function* () {
      // Do we have a db instance
      let parts = line.split('.');

      // DB level operations
      // Go the options for the db object
      if (parts[0] === 'db' && parts.length <= 2) {
        let collections = [];
        // Select a db
        const selectedDb = self.state.client.db(self.context.db.name);
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
          console.log(err);
        }

        let hints = collections.map(entry => `db.${entry.name}`);

        // Db object methods
        const methods = Object.getOwnPropertyNames(Db.prototype)
          .filter(entry => entry !== 'constructor')
          .map(entry => `db.${entry}(`);

        // Now mix in the prototype methods
        try {
          hints = hints.concat(methods)
            .filter(entry => entry.match(new RegExp(`^db.${parts[1]}`)));
        } catch (err) {}

        // Return hints
        Help.autocomplete('db', hints);
        return callback(null, [hints, line]);
      } else if (parts[0] === 'db' && parts.length <= 3) {
        // Db object methods
        const hints = Object.getOwnPropertyNames(Collection.prototype)
          .filter(entry => entry !== 'constructor')
          .map(entry => `db.${parts[1]}.${entry}(`)
          .filter(entry => entry.startsWith(line));
        // Return hints
        Help.autocomplete('db.collection', hints);
        return callback(null, [hints, line]);
      } else if (parts[0] !== 'db' && parts.length === 1) {
        // Add context names
        const contextNames = Object.keys(self.context);

        // Add all namespaces
        const namespaces = self.plugins.map(plugin => {
          return plugin.namespace();
        });

        // Filter the hint
        const hints = namespaces.concat(contextNames)
          .filter(entry => entry.startsWith(line));
        // Return hints
        return callback(null, [hints, line]);
      } else if (parts[0] !== 'db' && parts.length > 1 && self.context[parts[0]]) {
        let object = self.context;
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

        // Return hints
        return callback(null, [hints, line]);
      } else if (parts[0] !== 'db' && parts.length > 1 && self.context[parts[0]]) {
        let object = self.context;
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

        // Return hints
        Help.autocomplete('collection', hints);
        return callback(null, [hints, line]);
      }

      // No hints return nothing
      callback(null, [[], line]);
    }).catch(err => {
      console.log(err);
      callback(null, [[], line]);
    });
  }

  __writer(line) {
    if (Array.isArray(line)) return JSON.stringify(line, null, 2);
    // Serialize the object to JSON
    if (line && typeof line === 'object') {
      if (typeof line.render === 'function') {
        line = JSON.stringify(line.render(this.options.renderView), null, 2);
      } else {
        line = JSON.stringify(line, null, 2);
      }
    } else if (typeof line === 'number') {
      line = '' + line;
    }

    // Do some post processing for specal BSON values
    if (typeof line === 'string') {
      line = fixBSONTypeOutput(line, /\"ObjectId\(\\\"[0-9|a-f|A-F]*\\\"\)\"/);
    }

    // Return formated string
    return this.options.useColors ? colorize(line) : line;
  }

  __eval(code, _context, filename, callback) {
    // Remove trailing new line
    code = code.replace(/\n$/, '');
    code = nodePreprocess(code);
    code = code.trim();
    if (code === '\n' || code === '') {
      return callback(null);
    }

    const cutoff = 20;
    const context = this.context;

    (async function() {
      try {
        // First attempt custom commands
        if (code === 'exit' || code === 'quit') {
          process.exit(0);
        } else if (code === 'help' || code.startsWith('help ')) {
          return callback(null, Help.cmd(code));
        } else if (code === 'use') {
          return callback(null, "use command requires format 'use <dbname:string>'");
        } else if (code.indexOf('use ') === 0) {
          let db = code.split(' ')[1].trim();
          // Set the context db
          context.db = Db.proxy(db, this.state);
          // Print that db changed
          return callback(null, `switched to db: ${db}`);
        } else if (code === 'show dbs') {
          let result = await this.state.client.db('admin').command({ listDatabases: true });
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
          let collectionNames = await context.db.getCollectionNames();
          return callback(null, collectionNames.map(col => palette.string(col)).join('\n'));
        } else if (code === 'it') {
          if (context.__currentCursor instanceof Cursor && !context.__currentCursor.isClosed()) {
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
            return callback(null, new CursorResult(documents, hasMore).render());
          }

          return callback(null, 'No active cursor');
        }

        // Otherwise attempt evaluation
        // @TODO: this does not support code that is _already_ in async form!
        code = rewriteScript(code).toString().trim();
        code = preprocess(code);

        // Evaluate the script
        const script = new vm.Script(code, {});
        let result = await script.runInContext(context);

        // Did we receive an error
        if (context.__executingError) {
          return callback(`ERROR: ${context.__executingError.message}`);
        }

        // Check if the __result is Cursor instance (handle specially)
        if (context.__result instanceof Cursor && code !== 'it' /* && self.context.__result.cursor.s.state === 0 */) {
          const documents = [];

          // Set the current context cursor
          context.__currentCursor = context.__result;

          // Read the first 20 entries or until empty
          while (true) {
            let doc = await context.__result.next();
            // No more entries
            if (!doc) break;
            documents.push(doc);
            // Check if we reached the cutoff
            if (documents.length === cutoff) break;
          }
          // Return a cursor Result
          let hasMore = documents.length === cutoff && !context.__currentCursor.isClosed();
          result = new CursorResult(documents, hasMore).render();
        } else if (result instanceof Db) {
          result = result.name;
        } else if (result instanceof Collection) {
          result = result.namespace;
        } else if (typeof finalResult === 'function') {
          result = `${context.__namespace}.${result.name}`;
        }

        // Callback with the result
        callback(null, result ? result : '');
      } catch (err) {
        if (isRecoverableError(err)) {
          callback(new Recoverable(err), null);
          return;
        }

        callback(null, `ERROR: ${err.message}`);
      }
    })();
  }

  start() {
    let self = this;
    let $setPrompt = readline.Interface.prototype.setPrompt;
    readline.Interface.prototype.setPrompt = function(prompt) {
      if (self.context.db) {
        // Get the last ismaster
        // const ismaster = self.context.db.state.client.topology.lastIsMaster();
        const ismaster = self.state.client.topology.lastIsMaster();

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

            return $setPrompt.call(this, `mongodb [${palette.string.bold(self.context.db.name)}]:${serverType}> `, `mongodb [${self.context.db.name}]> `.length);
          }

          return $setPrompt.call(this, `mongodb [${palette.string.bold(self.context.db.name)}]> `, `mongodb [${self.context.db.name}]> `.length);
        }
      }

      return $setPrompt.apply(this, arguments);
    };

    this.repl = repl.start(Object.assign({
      prompt: this.options.prompt, ignoreUndefined: true,
      writer: this.__writer.bind(this),
      eval: this.__eval.bind(this),
      completer: this.__completer.bind(this)
    }, this.options));

    // Add replServer exit
    this.repl.on('exit', function() {
      self.emit('exit');
    });

    return this.repl;
  }
}

module.exports = REPL;
