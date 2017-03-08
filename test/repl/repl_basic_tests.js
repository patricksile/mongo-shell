'use strict';
const ReplTestFixture = require('./repl_test_fixture'),
      assert = require('assert');

function executeRepl(test, string, context) {
  return new Promise((resolve, reject) => {
    test.repl.eval(string, context, '', (err, result) => {
      if (err) {
        return reject(new SyntaxError(err));
      }

      resolve(result);
    });
  });
}

let test = new ReplTestFixture();
before(() => test.databaseSetup());
after(() => test.databaseTeardown());

describe('Repl Basic tests', function() {
  describe('basic operations', function() {
    beforeEach(() => test.setup());
    afterEach(() => test.teardown());

    it('should correctly return results for find()', async function() {
      await executeRepl(test, 'db.basic_test_1.insertOne({a:1})', test.context);
      let result = await executeRepl(test, 'db.basic_test_1.find({})', test.context);
      result = JSON.parse(result);
      assert.equal(1, result.a);
    });

    it('should correctly explain find()', async function() {
      await executeRepl(test, 'db.basic_test_2.insertOne({a:1})', test.context);
      let result = await executeRepl(test, 'db.basic_test_1.explain().find({})', test.context);
      console.log(result);
    });

    it('should correctly execute for loop with insertOne', async function() {
      let result = await executeRepl(test, 'for(var i = 0; i < 100; i++) db.basic_test_3.insertOne({a:i})', test.context);
      console.log(result);

      // // Get the document
      // result = yield executeRepl(test, 'db.basic_test_1.explain().find({})', test.context);
    });
  });
});

