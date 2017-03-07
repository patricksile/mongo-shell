'use strict';
const assert = require('assert'),
      rewriteScript = require('../../lib/executor').rewriteScript,
      preprocess = require('../../lib/repl').preprocess;

function describeEx(desc, fn, tests) {
  describe(desc, function() {
    tests.forEach(test => {
      it(test.name, function() {
        let actual = fn(test.input);
        assert.equal(actual, test.expected);
      });
    });
  });
}

describe('Repl Rewrite Tests', function() {
  describeEx('preprocess', preprocess, [
    {
      name: 'should wrap async assignments with a wrapper for immediate execution',
      input: 'x = await t.find(querySpec).count();',
      expected: '(() => { async function _wrap() { return global.x = await t.find(querySpec).count(); } return _wrap(); })();'
    },
    {
      name: 'should wrap async method args with a wrapper for imemdiate execution (1)',
      input: 'assert.writeOK(await t.mycoll.insert({}));',
      expected: '(() => { async function _wrap() { return assert.writeOK(await t.mycoll.insert({})); } return _wrap(); })();'
    },
    {
      name: 'should wrap async method args with a wrapper for imemdiate execution (2)',
      input: 'assert.writeOK(10, await t.mycoll.insert({}));',
      expected: '(() => { async function _wrap() { return assert.writeOK(10, await t.mycoll.insert({})); } return _wrap(); })();'
    }
  ]);

  describeEx('async arguments', rewriteScript, [
    {
      name: 'should not prepend await to a sync method containing an async argument',
      input: "assert.eq(cursor.next(), {_id: 1, strs: ['2000', '60']});",
      expected: "assert.eq(await cursor.next(), {_id: 1, strs: ['2000', '60']});"
    },
    {
      name: 'should not prepend await to a sync method containing multiple async arguments',
      input: 'assert.eq(cursor.next(), cursor.next());',
      expected: 'assert.eq(await cursor.next(), await cursor.next());'
    }
  ]);

  describeEx('assert.throws', rewriteScript, [
    {
      name: 'should rewrite async methods in `assert.throws` to use async form',
      input: 'assert.throws(function() { t.find({$and: 4}).toArray(); });',
      expected: 'await assert.throws(async function() { await t.find({$and: 4}).toArray(); });'
    },
    {
      name: 'should rewrite async methods in `assert.throws` to use async form within a function',
      input: 'function check() { assert.throws(function() { t.find({$and: 4}).toArray(); }); }',
      expected: 'async function check() { await assert.throws(async function() { await t.find({$and: 4}).toArray(); }); }'
    }
  ]);

  describeEx('basic', rewriteScript, [
    {
      name: 'should rewrite an async method to a generator with await',
      input: 'function test() { t.find(querySpec).sort(sortSpec).batchSize(1000).count(); }',
      expected: 'async function test() { await t.find(querySpec).sort(sortSpec).batchSize(1000).count(); }'
    },
    {
      name: 'should rewrite an IIFE to await and accept a generator',
      input: '(function() { var coll = db.sort1; coll.findOne({}); })();',
      expected: 'await (async function() { var coll = db.sort1; await coll.findOne({}); })();'
    },
    {
      name: 'should only prepend a single await for a function containing an async method (1)',
      input: '(function() { var coll = db.sort1; coll.findOne({}); coll.findOne({}); })();',
      expected: 'await (async function() { var coll = db.sort1; await coll.findOne({}); await coll.findOne({}); })();'
    },
    {
      name: 'should wrap awaited methods beginning with `!`',
      input: 'assert(!cursor.hasNext());',
      expected: 'assert(!(await cursor.hasNext()));'
    },
    {
      name: 'should not add additional awaits to a term thats already been awaited',
      input: 'const results = find(options.query).toArray();',
      expected: 'const results = await find(options.query).toArray();'
    },
    {
      name: 'should await future references to converted async method',
      input: 'function test() { return db.coll.findOne({}); }; test();',
      expected: 'async function test() { return await db.coll.findOne({}); }; await test();'
    },
    {
      name: 'should wrap awaited async methods when properties are accessed in the resulting value',
      input: 'function test() { return db.coll.findOne({}).x; };',
      expected: 'async function test() { return (await db.coll.findOne({})).x; };'
    },
    {
      name: 'should wrap again better description',
      input: 'assert.eq(1, t.find({$where: "return this.a == 2"}).toArray().length, "B");',
      expected: 'assert.eq(1, (await t.find({$where: "return this.a == 2"}).toArray()).length, "B");'
    },
    {
      name: 'should properly wrap async methods when used with an `in` operator',
      input: "assert(!('zeroPad' in col.findOne({_id: result.insertedId})));",
      expected: "assert(!('zeroPad' in (await col.findOne({_id: result.insertedId}))));"
    },
    {
      name: 'should await async methods that are assigned to a variable',
      input: 'doTest = function() { t.findOne({}); }; doTest();',
      expected: 'doTest = async function() { await t.findOne({}); }; await doTest();'
    },
    {
      name: 'should wrap an async call with parens if subsequent calls on the object are not async',
      input: 'db.getCollectionNames().forEach(function(x) {});',
      expected: '(await db.getCollectionNames()).forEach(function(x) {});'
    },
    {
      name: 'should not wrap explain with async decorations',
      input: 'db.basic_test_1.explain().find({});',
      expected: 'db.basic_test_1.explain().find({});'
    }
  ]);
});
