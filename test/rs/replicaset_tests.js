const ReplTestFixture = require('../repl/repl_test_fixture'),
  GlobalMethods = require('../../lib/global_methods'),
  assert = require('assert'),
  co = require('co');

const {
  Server,
  ReplSet
} = require('mongodb-topology-manager');

let test = new ReplTestFixture();

describe('ReplicaSet tests', function() {
  this.timeout(900000);
  // The individual nodes
  var nodes = [{
    options: {
      bind_ip: 'localhost',
      port: 31000,
      dbpath: `${__dirname}/../../db/31000`,
    }
  }, {
    options: {
      bind_ip: 'localhost',
      port: 31001,
      dbpath: `${__dirname}/../../db/31001`,
    }
  }, {
    arbiter: true,
    options: {
      bind_ip: 'localhost',
      port: 31002,
      dbpath: `${__dirname}/../../db/31002`,
    }
  }];

  // Create a ReplSet maanger instance
  const manager = new ReplSet('mongod', nodes, {
    replSet: 'rs'
  });

  before(done => {
    co(function*() {
      yield manager.purge();
      yield manager.start();
      yield test.databaseSetup({uri: 'mongodb://localhost:31000,localhost:31001/test_runner?replicaSet=rs'});
      done();
    }).catch(err => {
      console.log(err)
    });
  });

  after(done => {
    co(function*() {
      yield test.databaseTeardown();
      yield manager.stop(9);
      done();
    }).catch(err => {
      console.log(err)
    });
  });

  describe('Status methods', () => {
    beforeEach(() => test.setup());

    it('should correctly call rs.status()', function(done) {
      co(function*() {
        // Reconfigure setting priority
        let result = yield eval(test, 'rs.status()', test.context);
        assert.equal('rs', result.set);

        // Render the repl final text
        let string = test.repl.writer(result);
        assert.ok(string.indexOf('"set": "rs"') != -1);
        done();
      });
    });

    it('should correctly call rs.config()', function(done) {
      co(function*() {
        // Reconfigure setting priority
        let result = yield eval(test, 'rs.config()', test.context);
        assert.equal('rs', result._id);

        // Render the repl final text
        let string = test.repl.writer(result);
        assert.ok(string.indexOf('"_id": "rs"') != -1);
        done();
      });
    });

    it('should correctly call rs.printSlaveReplicationInfo()', function(done) {
      co(function*() {
        let result = yield eval(test, 'rs.printSlaveReplicationInfo()', test.context);
        assert.ok(result.indexOf('source:') != -1);
        done();
      });
    });

    it('should correctly call rs.getReplicationInfo()', function(done) {
      co(function*() {
        let result = yield eval(test, 'rs.getReplicationInfo()', test.context);
        assert.ok(result.logSizeMB);
        done();
      });
    });

    it('should correctly call rs.printReplicationInfo()', function(done) {
      co(function*() {
        let result = yield eval(test, 'rs.printReplicationInfo()', test.context);
        assert.ok(result.indexOf('configured oplog size:') != -1);
        done();
      });
    });
  });

  describe('Replicaset configurations', () => {
    beforeEach(() => test.setup());

    it('should correctly manipulate the replicaset', function(done) {
      co(function*() {
        // Reconfigure setting priority
        let configuration = yield eval(test, 'rs.config()', test.context);

        // Set the priority
        // Reconfigure the replicaset
        configuration.members[0].priority = 20;
        let result = yield eval(test, 'rs.reconfig(config)', Object.assign(test.context, {config: configuration}));

        // Remove a member
        result = yield eval(test, 'rs.remove("localhost:31001")', test.context);

        // Add a member
        result = yield eval(test, 'rs.add("localhost:31001")', test.context);

        // Remove the arbiter and then re-add it
        result = yield eval(test, 'rs.remove("localhost:31002")', test.context);
        result = yield eval(test, 'rs.addArb("localhost:31002")', test.context);

        try {
          // Step down
          result = yield eval(test, 'rs.stepDown(11)', test.context);
        } catch(err) {}

        // Wait for 10 seconds
        yield sleep(10 * 1000);

        // Get configuration
        let status = yield eval(test, 'rs.status()', test.context);

        // Locate the secondary
        const members = status.members.filter(m => m.stateStr === 'SECONDARY');
        assert.equal(1, members.length);

        // Mix in the connect method
        GlobalMethods.decorate(test.state.context, test.state);

        // We need to connect to the secondary
        result = yield eval(test, `connect("mongodb://${members[0].name}")`, test.context);

        // Freeze the primary
        result = yield eval(test, 'rs.freeze(3)', test.context);

        // Sleep for 4 seconds
        yield sleep(4 * 1000);

        // Get configuration
        status = yield eval(test, 'rs.status()', test.context);
        const primaries = status.members.filter(m => m.stateStr === 'PRIMARY');
        assert.equal(1, primaries.length);

        // Set sync form
        result = yield eval(test, `rs.syncFrom("${primaries[0].name}")`, test.context);
        assert.equal(1, result.ok);

        done();
      }).catch(err => {
        console.log(err);
        throw err;
      })
    });
  });
});

function eval(test, string, context, filename='') {
  return new Promise((resolve, reject) => {
    test.repl.context = context;
    test.repl.eval(string, context, '', function(err, result) {
      if(err) return reject(err);
      resolve(result);
    });
  });
}

function sleep(milliseconds) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}
