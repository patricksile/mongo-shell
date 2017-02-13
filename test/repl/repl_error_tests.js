const ReplTestFixture = require('./repl_test_fixture'),
      assert = require('assert');

let test = new ReplTestFixture();
before(() => test.databaseSetup());
after(() => test.databaseTeardown());

describe('Repl Error tests', () => {
  describe('parser error handling', () => {
    beforeEach(() => test.setup());

    it('should correctly return sensible error on only providing db and collection', function(done) {
      // Execute command
      test.repl.eval('db.tests2', context, '', function(err, result) {
        assert.equal(null, err);
        assert.equal('test_runner.tests2', result);

        done();
      });
    });

    // NOTE: Currently disabled because of the CollectionProxy, the name isn't actually returned!
    //       Investigate creating all the methods at runtime, dropping use of Proxy
    //
    // it('should correctly return sensible error on providing db and collection and legal function', function(done) {
    //   // Execute command
    //   test.repl.eval('db.tests2.find', context, '', function(err, result) {
    //     assert.equal(null, err);
    //     assert.equal('test_runner.tests2.find', result);

    //     done();
    //   });
    // });

    it('should correctly return nothing for undefined variable', function(done) {
      // Execute command
      test.repl.eval('db.tests2.__', context, '', function(err, result) {
        assert.equal(null, err);
        assert.equal('', result);

        done();
      });
    });
  });
});
