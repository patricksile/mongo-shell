const assert = require('assert');
const OdmGenerator = require('../');
const co = require('co');
const connect = require('mongodb');

describe('Mongo Shell Schema Plugin', () => {
  describe('Collection', () => {
    it('should correctly retrieve the a collection schema', function(done) {
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
        // Get the collection and execute
        const result = yield context.schema.collection('test1').schema();
        assert.ok(result.fields);
        assert.equal(4, result.fields.length);

        done();
      }).catch(err => console.log(err));
    });

    it('should correctly retrieve a collection schema but limit schema sampling', function(done) {
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
        // Get the collection and execute
        const result = yield context.schema.collection('test1').schema({mode: 'sample', size: 3});
        assert.equal(3, result.count);
        done();
      }).catch(err => console.log(err));
    });

    it('should correctly retrieve a collection schema using a full query', function(done) {
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
        // Get the collection and execute
        const result = yield context.schema.collection('test1').schema({mode: 'full', size: 3});
        assert.equal(4, result.count);
        done();
      }).catch(err => console.log(err));
    });
  });

  describe('Db', () => {
    it('should correctly retrieve the db collection schemas', function(done) {
      co(function*() {
        // Get the client
        const client = yield connect('mongodb://localhost:27017/schema_test');
        // Drop the database
        yield client.dropDatabase();
        // Add a bunch of documents
        yield client.collection('test1').insertMany([
          {a:1}, {b:'string'}, {c:3.54}, {a:3, c:3}
        ]);

        // Add a bunch of documents
        yield client.collection('test2').insertMany([
          {a:1}, {b:'string'}, {c:3.54}, {a:3, c:3}
        ]);

        // Create an odm generator
        const odmGenerator = new OdmGenerator(client);
        // Create fake context
        const context = {};
        // Decorate the context
        yield odmGenerator.decorateContext(context);
        // Get the collection and execute
        const schemas = yield context.schema.schema({mode: 'sample', size: 2});
        assert.equal(2, Object.keys(schemas).length);
        assert.equal(2, schemas.test1.count);
        assert.equal(2, schemas.test2.count);
        done();
      }).catch(err => console.log(err));
    });
  });
});
