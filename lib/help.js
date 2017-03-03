'use strict';

const docs = require('./docs');
const { Collection } = require('mongodb');
const columnify = require('columnify');
const Db = require('./db');
const { palette } = require('./colors');
const ReplicaSet = require('./rs');
const Plugins = require('./plugins');

const namespaces = [
  [ 'db', Db ],
  [ 'rs', ReplicaSet],
  [ 'db.collection', Collection ]
];

class Help {

  constructor(state, log = console.log) {
    this._state = state;
    this._attachHelpMethods();
    this._log = log;
  }

  autocomplete(context, hints) {
    if (hints.length !== 1) return;

    let hint = hints[0].trim();
    let functionName = hint.split('.').slice(-1)[0];
    // Get the function name, cleaned up
    functionName = functionName.endsWith('(') ? functionName.substring(0, functionName.length - 1) : functionName;
    // Get the associated function name space
    let namespace = this._getNamespace(context);

    // We have a namespace, autocomplete it
    if (namespace) {
      // Get the help method
      let help = this._getHelpMethod(namespace, functionName);

      // If we have help information render it
      if (typeof help !== 'undefined') {
        this._log();
        help(false, hint);
        this._log();
      }
    } else {
      // Might be a plugin, need to determine which one
      const parts = context.split(' ').map(x => x.trim());
      let plugin = null;

      // Go through the plugin
      for (const _plugin of this._state.plugins) {
        if (_plugin.namespace() === parts[0]) {
          plugin = _plugin;
          break;
        }
      }

      if (plugin) {
        // Return the result to render for auto complete
        const helpResult = plugin.autocomplete(hints.map(hint => {
          return hint.endsWith('(') ? [hint.substring(0, hint.length - 1), 'function'] : [hint, 'property'];
        })[0]);

        // Hardcode to full right now
        // let descriptionKey = full ? 'full' : 'summary';
        let descriptionKey = 'full';
        let line = hints[0];

        // Print out the help method
        this._log();
        logHelp(this._log, helpResult, true, '');
        this._log();
      }
    }
  }

  cmd(cmd) {
    this._log(`
------------------------
-- MongoDB Shell Help --
------------------------
`);
    cmd = cmd.trim();

    // Help columns
    const helpColumns = [
      [palette.string.green('help'), 'Full help.'],
      [palette.string.green('help db'), 'Database level help'],
      [palette.string.green('help collection'), 'Collection level help'],
      [palette.string.green('help plugin'), 'Plugin management help']
    ];

    // Add plugin help
    for (const _plugin of this._state.plugins) {
      helpColumns.push([palette.string.green(`help ${_plugin.namespace()}`), _plugin.description()])
    }

    if (cmd === 'help') {
      this._log(palette.string.yellow('Help supports:'));
      this._log(columnify(helpColumns, { showHeaders: false }));
    } else if (cmd === 'help db') {
      this._cmdDbHelp();
    } else if (cmd === 'help db') {
      this._cmdCollectionHelp();
    } else if (cmd.startsWith('help plugin')) {
      Plugins.help(cmd, this._log);
    } else {
      // Check if we have a plugin help command
      const parts = cmd.split(' ').map(x => x.trim());

      if (parts[0] === 'help' && parts.length == 2) {
        // Check if we have a plugin
        for (const _plugin of this._state.plugins) {
          if (_plugin.namespace() === parts[1]) {
            // Should be an array of arrays
            // [['method', 'description']]
            let entries = _plugin.help();
            // Log top level description
            this._log(palette.string.bold(`Plugin ${_plugin.namespace()} Help\n=============`));
            // Map the entries
            entries = entries.map(x => {
              return [palette.string.green(x[0]), x[1].trim()];
            })

            // Render the entries
            this._log(columnify(entries, { showHeaders: false, config: { 0: { minWidth: 25 }, 1: {maxWidth: 80} } }));
          }
        }
      } else {
        this._log(`${palette.string.bold('Unknown help command:')} '${palette.string(cmd)}'.`);
        this._log('Help supports:');
        this._log(columnify(helpColumns, { showHeaders: false }));
      }
    }

    this._log();
  }

  _cmdDbHelp() {
    this._log(palette.string.bold('Database Help\n============='));
    this._cmdGenerateHelp('db');
    this._log();
  }

  _cmdCollectionHelp() {
    this._log(palette.string.bold('Collection Help\n==============='));
    this._cmdGenerateHelp('db.collection');
    this._log();
  }

  _cmdGenerateHelp(helpContext) {
    let data = Object.keys(docs)
      .filter(key => {
        let keyContext = key.substr(0, key.lastIndexOf('.'));
        return keyContext === helpContext;
      }).sort().map(key => {
        let doc = docs[key];
        let name = doc.ctx.type === 'method' ? `${key}()` : key;
        return [palette.string.green(`${name}`), doc.description.summary.trim()];
      });
    this._log(columnify(data, { showHeaders: false, config: { 0: { minWidth: 25 }, 1: {maxWidth: 80} } }));
  }

  _getHelpMethod(namespace, functionName) {
    let func = namespace.prototype[functionName];
    if (typeof func === 'undefined') return func;
    return func.help;
  }

  _attachHelpMethods() {
    let self = this;

    Object.keys(docs).forEach(key => {
      let doc = docs[key];
      let namespace = this._getNamespace(key);
      let functionName = key.substr(key.lastIndexOf('.') + 1, key.length);
      let func = namespace.prototype[functionName];

      if (typeof func !== 'undefined') {
        func.help = function(full = false, line = '') {
          logHelp(self._log, doc, full, line);
        };
      }
    });
  }

  _getNamespace(key) {
    let namespace = undefined;
    namespaces.forEach(ns => { namespace = key.startsWith(ns[0]) ? ns[1] : namespace; });
    return namespace;
  }
}

function logHelp(log, doc, full = false, line = '') {
  let descriptionKey = full ? 'full' : 'summary';
  log(`${palette.string.green('\nMethod')}: ${palette.string.bold(doc.ctx.string.trim())}`);
  // Render the description for the method
  log(palette.string.white(`\n  ${doc.description[descriptionKey].trim()}`));

  // List all parameters if available
  const params = doc.tags.filter(x => x.type === 'param').map(param => {
    return  {
      buff: '',
      name: param.name,
      types: palette.string.bold(param.types.join('/')),
      description: param.description
    };
  });

  // Find the return tag
  const returnTags = doc.tags.filter(x => x.type === 'return').map(r => {
    return {
      types: r.types.join('/'),
      description: r.description
    }
  })

  // Log the parameters
  if (params.length > 0) {
    log(`${palette.string.green('\nParameters: \n\n')}${columnify(params, {
      showHeaders: false,
      config: { buff: {minWidth: 1}, name: { maxWidth: 25 }, types: {maxWidth: 15}, description: {maxWidth: 80} }
    })}`);
  }

  // Log the return type
  if (returnTags.length) {
    log(`${palette.string.green('\nReturn: \n\n')}  ${columnify(returnTags, {
      showHeaders: false,
      config: { types: {maxWidth: 15}, description: {maxWidth: 80} }
    })}`);
  }

  // Render the examples (if any)
  log(`${palette.string.green(`\nExamples: \n`)}${generateExample(doc, line)}`);
}

function generateExample(doc, line = '') {
  let params = doc.tags
    .filter(tag => tag.type === 'param')
    .map(tag => {
      let desc = ': ' + tag.description.replace(/  +/g, ' ');
      return `${tag.name}${palette.string.dim(desc)}`;
    });

  let examples = doc.tags
    .filter(tag => tag.type === 'example')
    .map(tag => tag.string.split('\n').map(x => `  ${x}`).join('\n'));

  // No examples, don't return anything
  if (examples.length == 0) return '';
  // For each example return
  return `\n${examples.join('\n')}`;
}

// const help = new Help();
module.exports = Help;
