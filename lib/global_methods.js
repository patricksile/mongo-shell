const { MongoClient } = require('mongodb');
const Db = require('./db');
const co = require('co');

class Methods {
  constructor(state) {
    this.state = state;
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
      console.log(err)
      throw err;
    });
  }
}

class GlobalMethods {
  constructor(state) {
    this.state = state;
  }

  decorate(context) {
    const methods = Object.getOwnPropertyNames(Methods.prototype);

    // Get the members
    for (var name of methods) {
      if (typeof Methods.prototype[name] === 'function' && name != 'constructor') {
        context[name] = Methods.prototype[name].bind({state: this.state});
      }
    }

    return context;
  }
}

module.exports = GlobalMethods;
