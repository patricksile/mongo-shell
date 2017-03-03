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

  async arrayAccess(idx) {
    return (await this.toArray())[idx];
  }

  async countReturn() {
    let c = await this.count();

    if (this._skip) {
      c = c - this._skip;
    }

    if (this._limit > 0 && this._limit < c) {
      return this._limit;
    }

    return c;
  }

  async itcount() {
    let count = 0;
    while (await this.hasNext()) {
      count++;
      await this.next();
    }

    return count;
  }

  async length() {
    return (await this.toArray()).length;
  }

  objsLeftInBatch() {
    return (this.cursorState.documents.length - this.cursorState.cursorIndex);
  }

  async size() { return this.count(); }
}

module.exports = LegacyCursor;
