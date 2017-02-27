'use strict';

const docs = require('./docs');
const { Collection } = require('mongodb');
const columnify = require('columnify');
const Db = require('./db');
const { palette } = require('./colors');
const log = console.log;
const ReplicaSet = require('./rs');
const Plugins = require('./plugins');

const namespaces = [
  [ 'db', Db ],
  [ 'rs', ReplicaSet],
  [ 'db.collection', Collection ]
];

class Help {

  constructor(state) {
    this._state = state;
    this._attachHelpMethods();
  }

  autocomplete(context, hints) {
    if (hints.length !== 1) return;

    let hint = hints[0].trim();
    let functionName = hint.split('.').slice(-1)[0];
    functionName = functionName.endsWith('(') ? functionName.substring(0, functionName.length - 1) : functionName;
    let namespace = this._getNamespace(context);
    let help = this._getHelpMethod(namespace, functionName);
    if (typeof help !== 'undefined') {
      log();
      help(false, hint);
      log();
    }
  }

  cmd(cmd) {
    log(`
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

    // console.log("============================== state")
    // console.log(this._state.plugins)

    // Add plugin help
    for (const _plugin of this._state.plugins) {
      helpColumns.push([palette.string.green(`help ${_plugin.namespace()}`), _plugin.help(cmd)])
    }

    if (cmd === 'help') {
      log(palette.string.yellow('Help supports:'));
      log(columnify(helpColumns, { showHeaders: false }));
      // this._cmdDbHelp();
      // this._cmdCollectionHelp();
    } else if (cmd === 'help db') {
      this._cmdDbHelp();
    } else if (cmd === 'help db') {
      this._cmdCollectionHelp();
    } else if (cmd.startsWith('help plugin')) {
      Plugins.help(cmd, log);
    } else {
      log(`${palette.string.bold('Unknown help command:')} '${palette.string(cmd)}'.`);
      log('Help supports:');
      log(columnify(helpColumns, { showHeaders: false }));
    }

    log();
  }

  _cmdDbHelp() {
    log(palette.string.bold('Database Help\n============='));
    this._cmdGenerateHelp('db');
    log();
  }

  _cmdCollectionHelp() {
    log(palette.string.bold('Collection Help\n==============='));
    this._cmdGenerateHelp('db.collection');
    log();
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
    log(columnify(data, { showHeaders: false, config: { 0: { minWidth: 25 }, 1: {maxWidth: 80} } }));
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
          let descriptionKey = full ? 'full' : 'summary';
          log(palette.string.green(`${doc.description[descriptionKey].trim()}`));
          log(palette.string.green(`Example: ${self._generateExample(doc, line)}`));
        };
      }
    });
  }

  _generateExample(doc, line = '') {
    let params = doc.tags
      .filter(tag => tag.type === 'param')
      .map(tag => {
        let desc = ': ' + tag.description.replace(/  +/g, ' ');
        return `${tag.name}${palette.string.dim(desc)}`;
      });

    let examples = doc.tags
      .filter(tag => tag.type === 'example')
      .map(tag => {
        let usage = tag.string;
        if (line.endsWith('(')) {
          return `${line}${usage.substring(usage.indexOf('(') + 1, usage.length)}`;
        }
        return usage;
      });
    let example = examples.length > 0 ? examples[0] : `${doc}(${params.join(', ')})`;

    let start = example.substring(0, example.indexOf('(') + 1);
    let middle = example.substring(start.length, example.lastIndexOf(')'));
    let end = example.substring(example.lastIndexOf(')'), example.length);
    let colourizedExample = end.length > 0 ? `${palette.string.bold(start)}${middle}${palette.string.bold(end)}` : example;
    return colourizedExample;
  }

  _getNamespace(key) {
    let namespace = undefined;
    namespaces.forEach(ns => { namespace = key.startsWith(ns[0]) ? ns[1] : namespace; });
    return namespace;
  }
}

// const help = new Help();
module.exports = Help;
