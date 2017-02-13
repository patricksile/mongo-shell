const ReplTestFixture = require('./repl_test_fixture'),
      assert = require('assert');

let test = new ReplTestFixture();
before(() => test.databaseSetup());
after(() => test.databaseTeardown());

function parseResult(str) {
  str = str.replace(/\n|\\n/g, '');
  str = str.replace(/ObjectId\(([^=\)]*)\)/g, '$1');
  return JSON.parse(str);
}

describe('Repl CRUD tests', () => {
  describe('insert tests', () => {
    beforeEach(() => test.setup());

    it('should correctly insert a single document using insertOne', function(done) {
      // Execute command
      test.repl.eval('db.tests2.insertOne({ a: 1 })', context, '', function(err, result) {
        assert.equal(null, err);
        assert(result.insertedId);

        // Render the repl final text
        let string = test.repl.writer(result);
        let actual = parseResult(string);
        assert.deepEqual(actual, {
          acknowledged: true,  insertedId: result.insertedId.toString()
        });

        done();
      });
    });

    it('should correctly insert multiple documents using insertMany', function(done) {
      test.repl.eval('db.tests2.insertMany([{a:1}, {b:1}])', context, '', function(err, result) {
        assert.equal(null, err);

        let string = test.repl.writer(result);
        let actual = parseResult(string);
        assert.deepEqual(actual, {
          acknowledged: true,
          insertedIds: [
            result.insertedIds[0].toString(),
            result.insertedIds[1].toString()
          ]
        });

        done();
      });
    });
  });

  describe('update tests', () => {
    beforeEach(() => test.setup());

    it('should correctly upsert a single document using updateOne', function(done) {
      test.repl.eval('db.tests2.updateOne({ a1: 1 }, { a1: 1 }, { upsert: true })', context, '', function(err, result) {
        assert.equal(null, err);
        assert.ok(result.upsertedId);

        // Render the repl final text
        let string = test.repl.writer(result);
        let actual = parseResult(string);
        assert.deepEqual(actual, {
          acknowledged: true,
          matchedCount: 0,
          modifiedCount: 0,
          upsertedId: result.upsertedId.toString()
        });

        done();
      });
    });

    it('should correctly update a single document using updateOne', function(done) {
      // Insert a test doc
      test.client.collection('tests2').insertOne({ f2: 1 })
        .then(() => {
          // Execute command
          test.repl.eval('db.tests2.updateOne({ f2: 1 }, { $set: { f1: 2 } }, { upsert: true })', context, '', function(err, result) {
            assert.equal(null, err);
            assert.equal(null, result.upsertedId);

            // Render the repl final text
            let string = test.repl.writer(result);
            let actual = parseResult(string);
            assert.deepEqual(actual, { acknowledged: true, matchedCount: 1, modifiedCount: 1 });

            done();
          });
        });
    });

    it('should correctly upsert a single document using updateMany', function(done) {
      // Execute command
      test.repl.eval('db.tests2.updateMany({f3:1}, {$set: {f3:2}}, { upsert:true })', context, '', function(err, result) {
        assert.equal(null, err);
        assert.ok(result.upsertedId);

        // Render the repl final text
        let string = test.repl.writer(result);
        let actual = parseResult(string);
        assert.deepEqual(actual, {
          acknowledged: true,
          matchedCount: 0,
          modifiedCount: 0,
          upsertedId: result.upsertedId.toString()
        });

        done();
      });
    });

    it('should correctly update two documents using updateMany', function(done) {
      // Insert a test doc
      test.client.collection('tests2').insertMany([{ f4: 1 }, { f4: 1 }])
        .then(() => {
          // Execute command
          test.repl.eval('db.tests2.updateMany({f4:1}, {$set: {f5:1}}, { upsert:true })', context, '', function(err, result) {
            assert.equal(null, err);
            assert.equal(null, result.upsertedId);

            // Render the repl final text
            let string = test.repl.writer(result);
            let actual = parseResult(string);
            assert.deepEqual(actual, { acknowledged: true, matchedCount: 2, modifiedCount: 2 });
            done();
          });
        });
    });
  });

  describe('delete tests', () => {
    beforeEach(() => test.setup());

    it('should correctly delete a single document using deleteOne', function(done) {
      // Insert a test doc
      test.client.collection('tests2').insertMany([{ g1: 1 }, { g1: 1 }])
        .then(() => {
          // Execute command
          test.repl.eval('db.tests2.deleteOne({g1:1})', context, '', function(err, result) {
            assert.equal(null, err);
            assert.equal(1, result.deletedCount);

            // Render the repl final text
            let string = test.repl.writer(result);
            let actual = parseResult(string);
            assert.deepEqual(actual, { acknowledged: true, deletedCount: 1 });

            done();
          });
        });
    });

    it('should correctly delete multiple documents using deleteMany', function(done) {
      // Insert a test doc
      test.client.collection('tests2').insertMany([{ g2: 1 }, { g2: 1 }])
        .then(() => {
          // Execute command
          test.repl.eval('db.tests2.deleteMany({g2:1})', context, '', function(err, result) {
            assert.equal(null, err);
            assert.equal(2, result.deletedCount);

            // Render the repl final text
            let string = test.repl.writer(result);
            let actual = parseResult(string);
            assert.deepEqual(actual, { acknowledged: true, deletedCount: 2 });

            done();
          });
        });
    });
  });
});
