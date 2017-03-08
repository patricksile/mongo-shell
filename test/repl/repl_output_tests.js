const ReplTestFixture = require('./repl_test_fixture'),
      co = require('co'),
      assert = require('assert');

let test = new ReplTestFixture();
before(() => test.databaseSetup());
after(() => test.databaseTeardown());

describe('Repl Output tests', () => {
  describe('output change', () => {
    beforeEach(() => test.setup());
    afterEach(() => test.teardown());

    it('should correctly switch to extjson and then back to shell', function(done) {
      co(function*() {
        // Switch to extended json
        let result = yield executeRepl(test, 'output extjson', test.context);
        assert.ok(result.indexOf('repl output mode switched to') != -1);
        assert.ok(result.indexOf('extjson') != -1);

        // Insert a document
        result = yield executeRepl(test, 'db.output_test.insertOne({a:1})', test.context);

        // Get the document
        result = yield executeRepl(test, 'db.output_test.findOne({a:1})', test.context);
        result = test.repl.writer(result)
        assert.ok(result.indexOf('$oid') != -1);

        // Switch to shell
        result = yield executeRepl(test, 'output shell', test.context);
        assert.ok(result.indexOf('repl output mode switched to') != -1);
        assert.ok(result.indexOf('shell') != -1);

        // Get the document
        result = yield executeRepl(test, 'db.output_test.findOne({a:1})', test.context);
        result = test.repl.writer(result)
        assert.ok(result.indexOf('$oid') == -1);

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
