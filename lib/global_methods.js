const { MongoClient } = require('mongodb');
const Db = require('./db');
const co = require('co');

class GlobalMethods {
  static decorate(context, state) {
    const methods = Object.getOwnPropertyNames(GlobalMethods.prototype);
    for (let name of methods) {
      if (typeof GlobalMethods.prototype[name] === 'function' && name !== 'constructor') {
        context[name] = GlobalMethods.prototype[name].bind({ state: state });
      }
    }

    return context;
  }

  connect(uri, options = {}) {
    const self = this;

    return co(function*() {
      // Attempt to connect to the db
      const client = yield MongoClient.connect(uri, options);
      // Update the state connect with the successful connection
      self.state.client = client;

      // Update context object
      self.state.context.db = Db.proxy(client.s.databaseName, self.state, self.state.context);
      // Return the successfull connection
      return `successfully connected to ${uri}`;
    }).catch(err => {
      console.log(err);
      throw err;
    });
  }

  /**
   * Prints an object out in a JSON string
   */
  tojson(obj) { return JSON.stringify(obj); }

  /**
   * Alias to console.log
   */
  print(...args) { console.log.apply(null, args); }
}

module.exports = GlobalMethods;
