const ReplTestFixture = require('./repl_test_fixture'),
      assert = require('assert');

let test = new ReplTestFixture();
before(() => test.databaseSetup());
after(() => test.databaseTeardown());

describe('Repl Helper tests', () => {
  describe('Admin helpers', () => {
    beforeEach(() => test.setup());
    afterEach(() => test.teardown());

    it('should correctly call currentOp method', function(done) {
      // Execute command
      test.repl.eval('db.currentOp()', test.context, '', function(err, result) {
        assert.equal(null, err);
        assert.ok(result.inprog);
        done();
      });
    });

    it('should correctly call `eval` method', function(done) {
      // Execute command
      test.repl.eval('db.eval("return 1")', test.context, '', function(err, result) {
        // console.log("==============================================")
        // console.dir(err)
        // console.dir(result)
        assert.equal(null, err);
        assert.equal(1, result);
        done();
      });
    });
  });
});
