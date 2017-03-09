const ReplTestFixture = require('./repl_test_fixture'),
      assert = require('assert');

let test = new ReplTestFixture();
before(() => test.databaseSetup());
after(() => test.databaseTeardown());

describe('Repl Helper tests', () => {
  describe('Admin helpers', () => {
    beforeEach(() => test.setup());
    afterEach(() => test.teardown());

    it('should correctly call currentOp method', async function() {
      // Execute command
      let result = await test.executeRepl('db.currentOp()', test.context);
      assert.ok(result);
      assert.ok(result.inprog);
    });

    it('should correctly call `eval` method', async function() {
      // Execute command
      let result = await test.executeRepl('db.eval("return 1")', test.context);
      assert.ok(result);
      assert.equal(1, result);
    });
  });
});
