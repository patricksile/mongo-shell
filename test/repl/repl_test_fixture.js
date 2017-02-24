const MongoClient = require('mongodb').MongoClient,
      vm = require('vm'),
      REPL = require('../../lib/repl'),
      ReplicaSet = require('../../lib/rs'),
      Configuration = require('../../lib/configuration'),
      Db = require('../../lib/db');

class ReplTestFixture {
  constructor() {}

  databaseSetup(options = {}) {
    // Connect to mongodb
    return MongoClient.connect(options.uri || 'mongodb://localhost:27017/test_runner')
      .then(client => {
        this.client = client;

        // Drop the database
        return this.client.dropDatabase();
      });
  }

  databaseTeardown() {
    if (this.client) return this.client.close();
  }

  setup() {
    // Init context
    const initContext = Object.assign({}, global, {});
    this.context = Object.assign(vm.createContext(initContext), {
      require: require
    });

    const state = {
      client: this.client,
      context: this.context,
      configuration: new Configuration(`${__dirname}/../../tmp/configuration.json`),
    };

    // Allow state to be accessed
    this.state = state;
    // Add the proxies
    this.context.db = Db.proxy(this.client.s.databaseName, state);
    this.context.rs = new ReplicaSet(state);

    // Create a repl instance
    let repl = new REPL(state, {
      prompt: ''
    });

    // Start the repl
    this.repl = repl.start();
  }
}

module.exports = ReplTestFixture;
