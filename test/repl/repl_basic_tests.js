'use strict';
const ReplTestFixture = require('./repl_test_fixture'),
      assert = require('assert');

let test = new ReplTestFixture();
before(() => test.databaseSetup());
after(() => test.databaseTeardown());

describe('Repl Basic tests', function() {
  describe('basic operations', function() {
    beforeEach(() => test.setup());
    afterEach(() => test.teardown());

    it('should correctly return results for find()', async function() {
      await test.executeRepl('db.basic_test_1.insertOne({a:1})', test.context);
      let result = await test.executeRepl('db.basic_test_1.find({})', test.context);
      result = JSON.parse(result);
      assert.equal(1, result.a);
    });

    // NOTE: currently skipped because explain needs to be added through decorations currently only
    //       in the main mongo script
    it.skip('should correctly explain find()', async function() {
      await test.executeRepl('db.basic_test_2.insertOne({a:1})', test.context);
      let result = await test.executeRepl('db.basic_test_1.explain().find({})', test.context);
      console.log(result);
    });

    it('should correctly execute for loop with insertOne', async function() {
      let result = await test.executeRepl('for(var i = 0; i < 100; i++) db.basic_test_3.insertOne({a:i})', test.context);
      assert.ok(result.acknowledged);

      // // Get the document
      // result = yield executeRepl(test, 'db.basic_test_1.explain().find({})', test.context);
    });
  });
});
