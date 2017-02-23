'use strict';
const Explainable = require('./explainable');

class LegacyCollection {
  static mixin(context, state) {
    const methods = Object.getOwnPropertyNames(LegacyCollection.prototype);
    for (let name of methods) {
      if (typeof LegacyCollection.prototype[name] === 'function' && name !== 'constructor') {
        context.prototype[name] = LegacyCollection.prototype[name];
      }
    }
  }

  getIndexKeys() {
    return this.indexes().then(indexes => indexes.map(i => i.key));
  }

  /**
   * This is the user-facing method for creating an Explainable from a collection.
   */
  explain(verbosity) {
    return new Explainable(this, verbosity);
  }
}

module.exports = LegacyCollection;
