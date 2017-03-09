const ReplTestFixture = require('./repl_test_fixture'),
      assert = require('assert');

let test = new ReplTestFixture();
before(() => test.databaseSetup());
after(() => test.databaseTeardown());

describe('Repl Output tests', function() {
  describe('output change', function() {
    beforeEach(() => test.setup());
    afterEach(() => test.teardown());

    it('should correctly switch to extjson and then back to shell', async function() {
      // Switch to extended json
      let result = await test.executeRepl('output extjson', test.context);
      assert.ok(result.indexOf('repl output mode switched to') !== -1);
      assert.ok(result.indexOf('extjson') !== -1);

      // Insert a document
      result = await test.executeRepl('db.output_test.insertOne({a:1})', test.context);

      // Get the document
      result = await test.executeRepl('db.output_test.findOne({a:1})', test.context);
      result = test.repl.writer(result);
      assert.ok(result.indexOf('$oid') !== -1);

      // Switch to shell
      result = await test.executeRepl('output shell', test.context);
      assert.ok(result.indexOf('repl output mode switched to') !== -1);
      assert.ok(result.indexOf('shell') !== -1);

      // Get the document
      result = await test.executeRepl('db.output_test.findOne({a:1})', test.context);
      result = test.repl.writer(result);
      assert.ok(result.indexOf('$oid') === -1);
    });
  });
});
