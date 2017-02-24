'use strict';
const Explainable = require('./explainable'),
      { Collection } = require('mongodb');

// save off for use below, before the mixin
const $drop = Collection.prototype.drop;

class LegacyCollection {
  static mixin(context, state) {
    const methods = Object.getOwnPropertyNames(LegacyCollection.prototype);
    for (let name of methods) {
      if (typeof LegacyCollection.prototype[name] === 'function' && name !== 'constructor') {
        context.prototype[name] = LegacyCollection.prototype[name];
      }
    }
  }

  async drop() {
    try {
      await $drop.call(this);
    } catch (e) {
      console.warn('WARN: ', e.message);
    }
  }

  /**
   * This is the user-facing method for creating an Explainable from a collection.
   */
  explain(verbosity) {
    return new Explainable(this, verbosity);
  }

  getIndexes() {
    return this.indexes();
  }

  getIndexKeys() {
    return this.indexes().then(indexes => indexes.map(i => i.key));
  }

  getName() { return this.collectionName; }
  getFullName() { return this.namespace; }

  async validate(full) {
    let cmd = { validate: this.collectionName };

    if (typeof(full) === 'object') {  // support arbitrary options here
      Object.assign(cmd, full);
    } else {
      cmd.full = full;
    }

    return this.s.db.command(cmd)
      .then(res => {
        if (typeof(res.valid) === 'undefined') {
          // old-style format just put everything in a string. Now using proper fields
          res.valid = false;

          let raw = res.result || res.raw;
          if (raw) {
            let str = '-' + JSON.stringify(raw);
            res.valid = !(str.match(/exception/) || str.match(/corrupt/));

            let p = /lastExtentSize:(\d+)/;
            let r = p.exec(str);
            if (r) {
              res.lastExtentSize = Number(r[1]);
            }
          }
        }

        return res;
      });
  }
}

module.exports = LegacyCollection;
