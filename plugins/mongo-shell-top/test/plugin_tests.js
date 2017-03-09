const assert = require('assert');
const Plugin = require('../');
const co = require('co');
const connect = require('mongodb');

describe('Mongo Shell Top Plugin', () => {
  it('should correctly initialize plugin', function(done) {
    co(function*() {
      // Get the client
      const client = yield connect('mongodb://localhost:27017/schema_test');
      // Create an odm generator
      const odmGenerator = new Plugin(client);
      // Create fake context
      const context = {};
      // Decorate the context
      yield odmGenerator.decorateContext(context);
      // // Get the collection and execute
      // const result = yield context.schema.collection('test1').schema();
      // assert.ok(result.fields);
      // assert.equal(4, result.fields.length);

      done();
    }).catch(err => console.log(err));
  });
});