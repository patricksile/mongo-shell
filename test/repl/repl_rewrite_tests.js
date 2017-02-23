'use strict';
const assert = require('assert'),
      rewriteScript = require('../../lib/executor').rewriteScript;

describe('Repl Rewrite Tests', function() {
  it('should rewrite an async method to a generator with await', function() {
    let input = 'function test() { t.find(querySpec).sort(sortSpec).batchSize(1000).count(); }';
    let expected = 'async function test() { await t.find(querySpec).sort(sortSpec).batchSize(1000).count(); }';
    let actual = rewriteScript(input);
    assert.equal(actual, expected);
  });

  it('should rewrite an IIFE to await and accept a generator', function() {
    let input = '(function() { var coll = db.sort1; coll.findOne({}); })();';
    let expected = 'await (async function() { var coll = db.sort1; await coll.findOne({}); })();';
    let actual = rewriteScript(input);
    assert.equal(actual, expected);
  });

  it('should only prepend a single await for a function containing an async method (1)', function() {
    let input = '(function() { var coll = db.sort1; coll.findOne({}); coll.findOne({}); })();';
    let expected = 'await (async function() { var coll = db.sort1; await coll.findOne({}); await coll.findOne({}); })();';
    let actual = rewriteScript(input);
    assert.equal(actual, expected);
  });

  describe('async arguments', function() {
    it('should not prepend await to a sync method containing an async argument', function() {
      let input = "assert.eq(cursor.next(), {_id: 1, strs: ['2000', '60']});";
      let expected = "assert.eq(await cursor.next(), {_id: 1, strs: ['2000', '60']});";
      let actual = rewriteScript(input);
      assert.equal(actual, expected);
    });

    it('should not prepend await to a sync method containing multiple async arguments', function() {
      let input = 'assert.eq(cursor.next(), cursor.next());';
      let expected = 'assert.eq(await cursor.next(), await cursor.next());';
      let actual = rewriteScript(input);
      assert.equal(actual, expected);
    });
  });

  it('should wrap awaited methods beginning with `!`', function() {
    let input = 'assert(!cursor.hasNext());';
    let expected = 'assert(!(await cursor.hasNext()));';
    let actual = rewriteScript(input);
    assert.equal(actual, expected);
  });

  it('should not add additional awaits to a term thats already been awaited', function() {
    let input = 'const results = find(options.query).toArray();';
    let expected = 'const results = await find(options.query).toArray();';
    let actual = rewriteScript(input);
    assert.equal(actual, expected);
  });

  it('should await future references to converted async method', function() {
    let input = 'function test() { return db.coll.findOne({}); }; test();';
    let expected = 'async function test() { return await db.coll.findOne({}); }; await test();';
    let actual = rewriteScript(input);
    assert.equal(actual, expected);
  });

  it('should wrap awaited async methods when properties are accessed in the resulting value', function() {
    let input = 'function test() { return db.coll.findOne({}).x; };';
    let expected = 'async function test() { return (await db.coll.findOne({})).x; };';
    let actual = rewriteScript(input);
    assert.equal(actual, expected);
  });

  it('should wrap again better description', function() {
    let input = 'assert.eq(1, t.find({$where: "return this.a == 2"}).toArray().length, "B");';
    let expected = 'assert.eq(1, (await t.find({$where: "return this.a == 2"}).toArray()).length, "B");';
    let actual = rewriteScript(input);
    assert.equal(actual, expected);
  });

  it('should properly wrap async methods when used with an `in` operator', function() {
    let input = "assert(!('zeroPad' in col.findOne({_id: result.insertedId})));";
    let expected = "assert(!('zeroPad' in (await col.findOne({_id: result.insertedId}))));";
    let actual = rewriteScript(input);
    assert.equal(actual, expected);
  });

  it('should wrap `drop` operations in a try/catch to emulate legacy behavior', function() {
    let input = 't.drop();';
    let expected = "try { await t.drop(); } catch(err) { console.warn('WARN: ' + err.message); };";
    let actual = rewriteScript(input);
    assert.equal(actual, expected);
  });

  it('should await async methods that are assigned to a variable', function() {
    let input = 'doTest = function() { t.findOne({}); }; doTest();';
    let expected = 'doTest = async function() { await t.findOne({}); }; await doTest();';
    let actual = rewriteScript(input);
    assert.equal(actual, expected);
  });

  describe('assert.throws', function() {
    it('should rewrite async methods in `assert.throws` to use async form', function() {
      let input = 'assert.throws(function() { t.find({$and: 4}).toArray(); });';
      let expected = 'await assert.throws(async function() { await t.find({$and: 4}).toArray(); });';
      let actual = rewriteScript(input);
      assert.equal(actual, expected);
    });

    it('should rewrite async methods in `assert.throws` to use async form within a function', function() {
      let input = 'function check() { assert.throws(function() { t.find({$and: 4}).toArray(); }); }';
      let expected = 'async function check() { await assert.throws(async function() { await t.find({$and: 4}).toArray(); }); }';
      let actual = rewriteScript(input);
      assert.equal(actual, expected);
    });
  });

  it('should wrap an async call with parens if subsequent calls on the object are not async', function() {
    let input = 'db.getCollectionNames().forEach(function(x) {});';
    let expected = '(await db.getCollectionNames()).forEach(function(x) {});';
    let actual = rewriteScript(input);
    assert.equal(actual, expected);
  });
});
