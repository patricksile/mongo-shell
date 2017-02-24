'use strict';

class LegacyCursor {
  static mixin(context, state) {
    const methods = Object.getOwnPropertyNames(LegacyCursor.prototype);
    for (let name of methods) {
      if (typeof LegacyCursor.prototype[name] === 'function' && name !== 'constructor') {
        context.prototype[name] = LegacyCursor.prototype[name];
      }
    }
  }

  async itcount() {
    let count = 0;
    while (await this.hasNext()) {
      count++;
      await this.next();
    }

    return count;
  }

  async arrayAccess(idx) {
    return (await this.toArray())[idx];
  }

  async length() {
    return (await this.toArray()).length;
  }
}

module.exports = LegacyCursor;
