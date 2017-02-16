const ReplTestFixture = require('./repl_test_fixture'),
      assert = require('assert');

let test = new ReplTestFixture();
before(() => test.databaseSetup());
after(() => test.databaseTeardown());

describe('Repl JS Expressions tests', () => {
  describe('value setting', () => {
    beforeEach(() => test.setup());

    it('should correctly handle a global value expression expression [var a = 1]', function(done) {
      // Execute command
      test.repl.eval('var a = 1', test.context, '', function(err, result) {
        assert.equal(null, err);
        assert.equal(1, test.context.a);

        // Render the repl final text
        let string = test.repl.writer(result);
        string = string.replace(/\n|\\n/g, '');
        assert.equal(''.trim(), string.trim());
        done();
      });
    });

    it('should correctly handle a global value expression expression [a = 1 + 1]', function(done) {
      // Execute command
      test.repl.eval('a = 1 + 1', test.context, '', function(err, result) {
        assert.equal(null, err);
        assert.equal(2, result);

        // Render the repl final text
        let string = test.repl.writer(result);
        string = string.replace(/\n|\\n/g, '');

        assert.equal(
          '2'.trim(),
          string.trim());
        done();
      });
    });
  });
});
