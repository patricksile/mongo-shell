const assert = require('assert');
const OdmGenerator = require('../');
const co = require('co');
const connect = require('mongodb');

describe('Mongo Shell Schema Plugin Hints', () => {
  describe('Hints', () => {
    it('should correctly retrieve the hint for schema.collection', function(done) {
      co(function*() {
        // Get the client
        const client = yield connect('mongodb://localhost:27017/schema_test');
        // Drop the database
        yield client.dropDatabase();
        // Add a bunch of documents
        yield client.collection('test1').insertMany([
          {a:1}, {b:'string'}, {c:3.54}, {a:3, c:3}
        ]);
        // Create an odm generator
        const odmGenerator = new OdmGenerator(client);
        // Create fake context
        const context = {};
        // Decorate the context
        yield odmGenerator.decorateContext(context);
        // Execute auto-hint
        const result = odmGenerator.autocomplete(['schema.collection', 'function']);
        assert.ok(result);

        done();
      }).catch(err => console.log(err));
    });
  });
});