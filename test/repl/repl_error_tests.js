const ReplTestFixture = require('./repl_test_fixture'),
      assert = require('assert');

let test = new ReplTestFixture();
before(() => test.databaseSetup());
after(() => test.databaseTeardown());

describe('Repl Error tests', () => {
  describe('parser error handling', () => {
    beforeEach(() => test.setup());
    afterEach(() => test.teardown());

    it('should correctly return sensible error on only providing db and collection', async function() {
      // Execute command
      let result = await test.executeRepl('db.tests2', test.context);
      assert.ok(result);
      assert.equal('test_runner.tests2', result);
    });

    // NOTE: Currently disabled because of the CollectionProxy, the name isn't actually returned!
    //       Investigate creating all the methods at runtime, dropping use of Proxy
    //
    // it('should correctly return sensible error on providing db and collection and legal function', function(done) {
    //   // Execute command
    //   test.repl.eval('db.tests2.find', test.context, '', function(err, result) {
    //     assert.equal(null, err);
    //     assert.equal('test_runner.tests2.find', result);

    //     done();
    //   });
    // });

    it('should correctly return nothing for undefined variable', async function() {
      // Execute command
      let result = await test.executeRepl('db.tests2.__', test.context);
      assert.ok(result);
    });
  });
});
