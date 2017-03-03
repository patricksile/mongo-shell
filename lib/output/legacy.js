const {
  fixBSONTypeOutput
} = require('../helpers');

const {
  colorize,
} = require('../colors');

const BSONTypes = ['Binary', 'Code', 'DBRef', 'Decimal128', 'Double',
  'Int32', 'Long', 'MaxKey', 'MinKey', 'ObjectID', 'BSONRegExp', 'Symbol', 'Timestamp'];
// Get the mongodb module
const mongodb = require('mongodb');
const toJSONMethods = {};

// Save toJSON render functions
for (const _type of BSONTypes) {
  if (mongodb[_type]) {
    toJSONMethods[_type] = mongodb[_type].prototype.toJSON;
  }
}

class LegacyWriter {
  constructor(module, options = {}) {
    this.options = options;

    for (const _type of BSONTypes) {
      if (module[_type]) {
        module[_type].prototype.toJSON = toJSONMethods[_type];
      }
    }

    module.ObjectId.prototype.toJSON = function() {
      return `ObjectId("${this.toHexString()}")`;
    };
  }

  write(line) {
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
}

module.exports = LegacyWriter;
