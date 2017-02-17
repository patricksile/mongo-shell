const ReplTestFixture = require('../repl/repl_test_fixture'),
  GlobalMethods = require('../../lib/global_methods'),
  Sharded = require('./sharding_test_fixtures'),
  assert = require('assert'),
  co = require('co');

let test = new ReplTestFixture();

describe('Sharded tests', function() {
  this.timeout(900000);

  // Create a ReplSet maanger instance
  const manager = new Sharded();

  before(done => {
    co(function*() {
      yield manager.purge();
      yield manager.start();
      yield test.databaseSetup({uri: 'mongodb://localhost:51000,localhost:51000/test_runner'});
      done();
    }).catch(err => {
      console.log(err)
    });
  });

  after(done => {
    co(function*() {
      yield test.databaseTeardown();
      // yield manager.stop(9);
      done();
    }).catch(err => {
      console.log(err)
    });
  });

  describe('Status methods', () => {
    beforeEach(() => test.setup());

    it('should correctly call rs.status()', function(done) {
      // co(function*() {
      //   // Reconfigure setting priority
      //   let result = yield eval(test, 'rs.status()', test.context);
      //   assert.equal('rs', result.set);
      //
      //   // Render the repl final text
      //   let string = test.repl.writer(result);
      //   assert.ok(string.indexOf('"set": "rs"') != -1);
      //   done();
      // });
      done();
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
