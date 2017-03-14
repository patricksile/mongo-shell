'use strict';
const falafel = require('falafel');
const assert = require('assert');
const {
  rewriteScript,
  inferCalleeType,
  TYPE_UNKNOWN,
  TYPE_DB,
  TYPE_COLLECTION,
  TYPE_CURSOR
} = require('../../lib/executor');


function describeEx(desc, fn, tests) {
  describe(desc, function() {
    tests.forEach(test => {
      (test.hasOwnProperty('only') && test.only ? it.only : it)(test.name, function() {
        let actual = fn(test.input);
        assert.equal(actual, test.expected);
      });
    });
  });
}

function rewriteScriptREPL(input) {
  return rewriteScript(input, { repl: true });
}

describe('Repl Rewrite Tests', function() {
  describeEx('async wrapping (for REPL)', rewriteScriptREPL, [
    {
      name: 'should wrap assignment with async operations with a wrapper for immediate execution',
      input: 'x = db.test.find(querySpec).count();',
      expected: 'x = (() => { async function _wrap() { return await db.test.find(querySpec).count(); } return _wrap(); })();'
    },
    {
      name: 'should wrap VariableAssignment expressions with async wrapper if they are assigned to async method results',
      input: 'var res = db.test.find({}).toArray();',
      expected: 'var res = (() => { async function _wrap() { return await db.test.find({}).toArray(); } return _wrap(); })();'
    },
    {
      name: 'should wrap async method args with a wrapper for imemdiate execution (1)',
      input: 'assert.writeOK(db.mycoll.insert({}));',
      expected: '(() => { async function _wrap() { return assert.writeOK(await db.mycoll.insert({})); } return _wrap(); })();'
    },
    {
      name: 'should wrap async method args with a wrapper for imemdiate execution (2)',
      input: 'assert.writeOK(10, db.mycoll.insert({}));',
      expected: '(() => { async function _wrap() { return assert.writeOK(10, await db.mycoll.insert({})); } return _wrap(); })();'
    },
    {
      name: 'should not wrap for-loop if loop contains async operation',
      input: 'for(var i = 0; i < 100; i++) db.basic_test_3.insertOne({a:i})',
      expected: 'for(var i = 0; i < 100; i++) (() => { async function _wrap() { return await db.basic_test_3.insertOne({a:i}); } return _wrap(); })();'
    },
    {
      name: 'should not wrap for-loop if loop contains async operation (block-statement)',
      input: 'for(var i = 0; i < 100; i++) { db.basic_test_3.insertOne({a:i}) }',
      expected: 'for(var i = 0; i < 100; i++) { (() => { async function _wrap() { return await db.basic_test_3.insertOne({a:i}); } return _wrap(); })(); }'
    },
    {
      name: 'should not wrap while-loop if loop contains async operation',
      input: 'while(true) db.basic_test_3.insertOne({a:i})',
      expected: 'while(true) (() => { async function _wrap() { return await db.basic_test_3.insertOne({a:i}); } return _wrap(); })();'
    },
    {
      name: 'should not wrap while-loop if loop contains async operation (block-statement)',
      input: 'while(true) { db.basic_test_3.insertOne({a:i}) }',
      expected: 'while(true) { (() => { async function _wrap() { return await db.basic_test_3.insertOne({a:i}); } return _wrap(); })(); }'
    },
    {
      name: 'should wrap variable declarations if assignment is an async operation',
      input: 'var a = assert.commandFailedWithCode(db.adminCommand())',
      expected: 'var a = (() => { async function _wrap() { return await assert.commandFailedWithCode(db.adminCommand()); } return _wrap(); })();'
    }
  ]);

  describeEx('async arguments', rewriteScript, [
    {
      name: 'should not prepend await to a sync method containing an async argument',
      input: "assert.eq(db.test.find({}).next(), {_id: 1, strs: ['2000', '60']});",
      expected: "assert.eq(await db.test.find({}).next(), {_id: 1, strs: ['2000', '60']});"
    },
    {
      name: 'should not prepend await to a sync method containing multiple async arguments',
      input: 'assert.eq(db.test.find({}).next(), db.test.find({}).next());',
      expected: 'assert.eq(await db.test.find({}).next(), await db.test.find({}).next());'
    }
  ]);

  describeEx('assertions', rewriteScript, [
    {
      name: 'should rewrite async methods in `assert.throws` to use async form',
      input: 'assert.throws(function() { db.test.find({$and: 4}).toArray(); });',
      expected: 'await assert.throws(async function() { await db.test.find({$and: 4}).toArray(); });'
    },
    {
      name: 'should rewrite async methods in `assert.throws` to use async form within a function',
      input: 'function check() { assert.throws(function() { db.test.find({$and: 4}).toArray(); }); }',
      expected: 'async function check() { await assert.throws(async function() { await db.test.find({$and: 4}).toArray(); }); }'
    },
    {
      name: 'should rewrite async methods in `assert.commandFailed` to use async form',
      input: 'assert.commandFailed(db.adminCommand());',
      expected: 'await assert.commandFailed(db.adminCommand());'
    },
    {
      name: 'should not rewrite async op inside async assertion method',
      input: 'assert.commandWorked(db.test.createIndex({x: 1}, {unique: true}));',
      expected: 'await assert.commandWorked(db.test.createIndex({x: 1}, {unique: true}));'
    },
    {
      name: 'should not rewrite async op inside async assertion method (within assignment)',
      input: 'var a = assert.commandFailedWithCode(db.adminCommand());',
      expected: 'var a = await assert.commandFailedWithCode(db.adminCommand());'
    }
  ]);

  describe('async call expression detection', function() {
    it('inferCalleeType', function() {
      // returns the last logical call expression
      function lastCallExpression(src) {
        let node;
        falafel(src, n => { if (n.type === 'CallExpression') node = n; });
        return node;
      }

      assert.equal(TYPE_CURSOR,
        inferCalleeType(lastCallExpression('db.basic_test_1.find({}).skip(5).limit(10).explain();')));
      assert.equal(TYPE_CURSOR, inferCalleeType(lastCallExpression('db.getCollection("test_db").find()')));
      assert.equal(TYPE_COLLECTION, inferCalleeType(lastCallExpression('db.getCollection("test")')));
      assert.equal(TYPE_COLLECTION, inferCalleeType(lastCallExpression('db.basic_test_1.explain();')));
      assert.equal(TYPE_DB, inferCalleeType(lastCallExpression('db.adminCommand()')));
      assert.equal(TYPE_UNKNOWN, inferCalleeType(lastCallExpression('testing.adminCommand()')));
      assert.equal(TYPE_DB, inferCalleeType(lastCallExpression('testing.adminCommand()'), { 'testing': TYPE_DB }));
    });

    it('assignment', function() {
      let typeCache = Object.create(null);
      rewriteScript('x = db.my_coll', { typeCache: typeCache });
      assert.equal(typeCache.x, TYPE_COLLECTION);

      typeCache = Object.create(null);
      rewriteScript('var y = db.adminCommand()', { typeCache: typeCache });
      assert(typeof typeCache.y === 'undefined');

      typeCache = Object.create(null);
      rewriteScript('z = db.my_coll.find({})', { typeCache: typeCache });
      assert.equal(typeCache.z, TYPE_CURSOR);

      typeCache = Object.create(null);
      rewriteScript('a = db', { typeCache: typeCache });
      assert.equal(typeCache.a, TYPE_DB);
    });

    it('should not infer type with basic expression', function() {
      assert.doesNotThrow(() => rewriteScript('arr = [2, 4, 4, 4, 5, 5, 7, 9];'));
    });
  });

  describeEx('basic', rewriteScript, [
    {
      name: 'should rewrite an async method to a generator with await',
      input: 'function test() { db.test.find(querySpec).sort(sortSpec).batchSize(1000).count(); }',
      expected: 'async function test() { await db.test.find(querySpec).sort(sortSpec).batchSize(1000).count(); }'
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
      input: 'assert(!db.test.find({}).hasNext());',
      expected: 'assert(!(await db.test.find({}).hasNext()));'
    },
    {
      name: 'should not add additional awaits to a term thats already been awaited',
      input: 'const results = db.test.find(options.query).toArray();',
      expected: 'const results = await db.test.find(options.query).toArray();'
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
      input: 'assert.eq(1, db.test.find({$where: "return this.a == 2"}).toArray().length, "B");',
      expected: 'assert.eq(1, (await db.test.find({$where: "return this.a == 2"}).toArray()).length, "B");'
    },
    {
      name: 'should properly wrap async methods when used with an `in` operator',
      input: "assert(!('zeroPad' in db.test.findOne({_id: result.insertedId})));",
      expected: "assert(!('zeroPad' in (await db.test.findOne({_id: result.insertedId}))));"
    },
    {
      name: 'should await async methods that are assigned to a variable',
      input: 'doTest = function() { db.test.findOne({}); }; doTest();',
      expected: 'doTest = async function() { await db.test.findOne({}); }; await doTest();'
    },
    {
      name: 'should wrap an async call with parens if subsequent calls on the object are not async',
      input: 'db.getCollectionNames().forEach(function(x) {});',
      expected: '(await db.getCollectionNames()).forEach(function(x) {});'
    },
    {
      name: 'should not wrap explain with async decorations when called on collection',
      input: 'db.basic_test_1.explain().find({});',
      expected: 'db.basic_test_1.explain().find({});'
    },
    {
      name: 'it should wrap explain with async decorations when called on cursor',
      input: 'db.basic_test_1.find({}).skip(5).limit(10).explain();',
      expected: 'await db.basic_test_1.find({}).skip(5).limit(10).explain();'
    },
    {
      name: 'it should wrap explain with async decorations when called on cursor (2)',
      input: 'var e = db.basic_test_1.find(query).hint({a: 1}).explain("executionStats");',
      expected: 'var e = await db.basic_test_1.find(query).hint({a: 1}).explain("executionStats");'
    }
  ]);
});
