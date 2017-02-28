const ReplTestFixture = require('../repl/repl_test_fixture'),
      assert = require('assert');

let test = new ReplTestFixture();
describe('LegacyCollection', function() {
  before(() => test.databaseSetup());
  after(() => test.databaseTeardown());
  beforeEach(() => test.setup());

  it('should return a new collection when subcollections access is attempted', function(done) {
    // Execute command
    test.repl.eval('x = db.some_coll.my_coll', test.context, '', function(err, result) {
      assert.equal(null, err);
      assert.ok(test.context.x);
      assert.equal(test.context.x.namespace, 'test_runner.some_coll.my_coll');
      done();
    });
  });
});
