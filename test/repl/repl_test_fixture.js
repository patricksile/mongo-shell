const MongoClient = require('mongodb').MongoClient,
      vm = require('vm'),
      REPL = require('../../lib/repl'),
      Db = require('../../lib/db');

class ReplTestFixture {
  constructor() {}

  databaseSetup() {
    // Connect to mongodb
    return MongoClient.connect('mongodb://localhost:27017/test_runner')
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

    this.context.db = Db.proxy(this.client.s.databaseName, this.client, this.context);

    // Create a repl instance
    let repl = new REPL(this.client, this.context, {
      prompt: ''
    });

    // Start the repl
    this.repl = repl.start();
  }
}

module.exports = ReplTestFixture;
