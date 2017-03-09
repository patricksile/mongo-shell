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
    afterEach(() => test.teardown());

    it('should correctly insert a single document using insertOne', async function() {
      // Execute command
      let result = await test.executeRepl('db.tests2.insertOne({ a: 1 })', test.context);
      assert.ok(result);
      assert.ok(result.insertedId);

      // Render the repl final text
      let string = test.repl.writer(result);
      let actual = parseResult(string);
      assert.deepEqual(actual, {
        acknowledged: true,  insertedId: result.insertedId.toString()
      });
    });

    it('should correctly insert multiple documents using insertMany', async function() {
      let result = await test.executeRepl('db.tests2.insertMany([{a:1}, {b:1}])', test.context);
      assert.ok(result);

      let string = test.repl.writer(result);
      let actual = parseResult(string);
      assert.deepEqual(actual, {
        acknowledged: true,
        insertedIds: [
          result.insertedIds[0].toString(),
          result.insertedIds[1].toString()
        ]
      });
    });
  });

  describe('update tests', () => {
    beforeEach(() => test.setup());
    afterEach(() => test.teardown());

    it('should correctly upsert a single document using updateOne', async function() {
      let result = await test.executeRepl('db.tests2.updateOne({ a1: 1 }, { a1: 1 }, { upsert: true })', test.context);
      assert.ok(result);
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
    });

    it('should correctly update a single document using updateOne', async function() {
      // Insert a test doc
      await test.client.collection('tests2').insertOne({ f2: 1 });

      // Execute command
      let result = await test.executeRepl('db.tests2.updateOne({ f2: 1 }, { $set: { f1: 2 } }, { upsert: true })', test.context);
      assert.ok(result);
      assert.equal(null, result.upsertedId);

      // Render the repl final text
      let string = test.repl.writer(result);
      let actual = parseResult(string);
      assert.deepEqual(actual, { acknowledged: true, matchedCount: 1, modifiedCount: 1 });
    });

    it('should correctly upsert a single document using updateMany', async function() {
      // Execute command
      let result = await test.executeRepl('db.tests2.updateMany({f3:1}, {$set: {f3:2}}, { upsert:true })', test.context);
      assert.ok(result);
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
    });

    it('should correctly update two documents using updateMany', async function() {
      // Insert a test doc
      await test.client.collection('tests2').insertMany([{ f4: 1 }, { f4: 1 }]);

      // Execute command
      let result = await test.executeRepl('db.tests2.updateMany({f4:1}, {$set: {f5:1}}, { upsert:true })', test.context);
      assert.ok(result);
      assert.equal(null, result.upsertedId);

      // Render the repl final text
      let string = test.repl.writer(result);
      let actual = parseResult(string);
      assert.deepEqual(actual, { acknowledged: true, matchedCount: 2, modifiedCount: 2 });
    });
  });

  describe('delete tests', () => {
    beforeEach(() => test.setup());
    afterEach(() => test.teardown());

    it('should correctly delete a single document using deleteOne', async function() {
      // Insert a test doc
      await test.client.collection('tests2').insertMany([{ g1: 1 }, { g1: 1 }]);

      // Execute command
      let result = await test.executeRepl('db.tests2.deleteOne({g1:1})', test.context);
      assert.ok(result);
      assert.equal(1, result.deletedCount);

      // Render the repl final text
      let string = test.repl.writer(result);
      let actual = parseResult(string);
      assert.deepEqual(actual, { acknowledged: true, deletedCount: 1 });
    });

    it('should correctly delete multiple documents using deleteMany', async function() {
      // Insert a test doc
      await test.client.collection('tests2').insertMany([{ g2: 1 }, { g2: 1 }]);

      // Execute command
      let result = await test.executeRepl('db.tests2.deleteMany({g2:1})', test.context);
      assert.ok(result);
      assert.equal(2, result.deletedCount);

      // Render the repl final text
      let string = test.repl.writer(result);
      let actual = parseResult(string);
      assert.deepEqual(actual, { acknowledged: true, deletedCount: 2 });
    });
  });
});
