const ReplTestFixture = require('./repl_test_fixture'),
      co = require('co'),
      rmdir = require('rmdir'),
      assert = require('assert');

let test = new ReplTestFixture();
before(() => test.databaseSetup());
after(() => test.databaseTeardown());

describe('Repl Basic tests', () => {
  describe('basic operations', () => {
    beforeEach(() => test.setup());

    it('should correctly return results for find()', function(done) {
      co(function*() {
        // Insert a document
        let result = yield executeRepl(test, 'db.basic_test_1.insertOne({a:1})', test.context);

        // Get the document
        result = JSON.parse(yield executeRepl(test, 'db.basic_test_1.find({})', test.context));
        assert.equal(1, result.a);
        done();
      }).catch(err => {
        console.log(err);
        throw err;
      });
    });

    it('should correctly explain find()', function(done) {
      co(function*() {
        // Insert a document
        let result = yield executeRepl(test, 'db.basic_test_2.insertOne({a:1})', test.context);

        // Get the document
        result = yield executeRepl(test, 'db.basic_test_1.explain().find({})', test.context);
        console.log(result)

        done();
      }).catch(err => {
        console.log(err);
        throw err;
      });
    });

    it('should correctly execute for loop with insertOne', function(done) {
      co(function*() {
        // Insert a document
        let result = yield executeRepl(test, 'for(var i = 0; i < 100; i++) db.basic_test_3.insertOne({a:i})', test.context);
        console.log(result)
        //
        // // Get the document
        // result = yield executeRepl(test, 'db.basic_test_1.explain().find({})', test.context);

        done();
      }).catch(err => {
        console.log(err);
        throw err;
      });
    });
  });
});

function executeRepl(test, string, context) {
  return new Promise((resolve, reject) => {
    // Execute command
    test.repl.eval(string, context, '', (err, result) => {
      if(err) return reject(err);
      resolve(result);
    });
  });
}
