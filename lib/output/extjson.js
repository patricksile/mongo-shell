const ExtJSON = require('mongodb-extjson');

const {
  fixBSONTypeOutput
} = require('../helpers');

const {
  colorize,
} = require('../colors');

class ExtJSONWriter {
  constructor(module, options = {}) {
    this.options = options;
    // Extend the module
    module = ExtJSON.extend(module);
    // Create en instance of the extended json module
    this.extJSON = new ExtJSON(module);
  }

  write(line) {
    if (Array.isArray(line)) return this.extJSON.stringify(line, null, 2);
    // Serialize the object to JSON
    if (line && typeof line === 'object') {
      line = this.extJSON.stringify(line, null, 2);
    } else if (typeof line === 'number') {
      line = '' + line;
    }

    // Return formated string
    return this.options.useColors ? colorize(line) : line;
  }
}

module.exports = ExtJSONWriter;
