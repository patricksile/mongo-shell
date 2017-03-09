'use strict';
const { ObjectId, Binary, DBRef, Timestamp, Int32, Long } = require('mongodb');
const crypto = require('crypto');
const { ErrorCodes } = require('../error_codes');

// Array
Array.contains = function(a, x) {
  if (!Array.isArray(a)) {
    throw new Error('The first argument to Array.contains must be an array');
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] === x) return true;
  }

  return false;
};

Array.unique = function(a) {
  if (!Array.isArray(a)) {
    throw new Error('The first argument to Array.unique must be an array');
  }

  let u = [];
  for (let i = 0; i < a.length; i++) {
    let o = a[i];
    if (!Array.contains(u, o)) u.push(o);
  }

  return u;
};

/*
Array.shuffle = function(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('The first argument to Array.shuffle must be an array');
  }

  for (let i = 0; i < arr.length - 1; i++) {
    let pos = i + Random.randInt(arr.length - i);
    let save = arr[i];
    arr[i] = arr[pos];
    arr[pos] = save;
  }
  return arr;
};
*/

Array.fetchRefs = function(arr, coll) {
  if (!Array.isArray(arr)) {
    throw new Error('The first argument to Array.fetchRefs must be an array');
  }

  let n = [];
  for (let i = 0; i < arr.length; i++) {
    let z = arr[i];
    if (coll && coll !== z.getCollection()) {
      continue;
    }

    n.push(z.fetch());
  }

  return n;
};

Array.sum = function(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('The first argument to Array.sum must be an array');
  }

  if (arr.length === 0) {
    return null;
  }

  let s = arr[0];
  for (let i = 1; i < arr.length; i++) {
    s += arr[i];
  }

  return s;
};

Array.avg = function(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('The first argument to Array.avg must be an array');
  }

  if (arr.length === 0) {
    return null;
  }

  return Array.sum(arr) / arr.length;
};

Array.stdDev = function(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('The first argument to Array.stdDev must be an array');
  }

  let avg = Array.avg(arr);
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum += Math.pow(arr[i] - avg, 2);
  }

  return Math.sqrt(sum / arr.length);
};

// Object
Object.extend = Object.assign;
Object.merge = function(dst, src, deep) {
  let clone = Object.extend({}, dst, deep);
  return Object.extend(clone, src, deep);
};

Object.keySet = function(o) {
  let ret = new Array();
  for (let i in o) {
    if (!(i in o.__proto__ && o[i] === o.__proto__[i])) {  // eslint-disable-line
      ret.push(i);
    }
  }

  return ret;
};

function _rand() {
  let bytes = crypto.randomBytes(7);
  let position = 0;
  return (((((((
    bytes[position++] % 32) / 32 +
    bytes[position++]) / 256 +
    bytes[position++]) / 256 +
    bytes[position++]) / 256 +
    bytes[position++]) / 256 +
    bytes[position++]) / 256 +
    bytes[position]) / 256;
}

let Random = (function() {
  let initialized = false;
  let errorMsg =
      "The random number generator hasn't been seeded yet; " + 'call Random.setRandomSeed()';

  // Set the random generator seed.
  function srand(s) {
    initialized = true;
    return true;  // no-op
  }

  // Set the random generator seed & print the result.
  function setRandomSeed(s) {
    let seed = srand(s);
    console.log('setting random seed: ' + seed);
  }

  // Generate a random number 0 <= r < 1.
  function rand() {
    if (!initialized) {
      throw new Error(errorMsg);
    }

    return _rand();
  }

  // Generate a random integer 0 <= r < n.
  function randInt(n) {
    if (!initialized) {
      throw new Error(errorMsg);
    }

    return Math.floor(rand() * n);
  }

  // Generate a random value from the exponential distribution with the specified mean.
  function genExp(mean) {
    if (!initialized) {
      throw new Error(errorMsg);
    }

    let r = rand();
    if (r === 0) {
      r = rand();
      if (r === 0) {
        r = 0.000001;
      }
    }

    return -Math.log(r) * mean;
  }

  /**
   * Generate a random value from the normal distribution with specified 'mean' and
   * 'standardDeviation'.
   */
  function genNormal(mean, standardDeviation) {
    if (!initialized) {
      throw new Error(errorMsg);
    }

    // See http://en.wikipedia.org/wiki/Marsaglia_polar_method
    while (true) {
      let x = (2 * rand()) - 1;
      let y = (2 * rand()) - 1;
      let s = (x * x) + (y * y);

      if (s > 0 && s < 1) {
        let standardNormal = x * Math.sqrt(-2 * Math.log(s) / s);
        return mean + (standardDeviation * standardNormal);
      }
    }
  }

  return {
    genExp: genExp,
    genNormal: genNormal,
    rand: rand,
    randInt: randInt,
    setRandomSeed: setRandomSeed,
    srand: srand
  };
})();

Binary.prototype.subtype = function() { return this.sub_type; };
Binary.prototype.length = function() { return this.buffer.length; };

module.exports = {
  decorate: context => {
    context.ObjectId = ObjectId;
    context.Array = Array;
    context.Object = Object;
    context.Random = Random;
    context._rand = _rand;
    context.ErrorCodes = ErrorCodes;

    // bson types
    context.BinData = Binary;
    context.DBPointer = DBRef;
    context.DBRef = DBRef;
    context.Timestamp = Timestamp;
    context.NumberInt = Int32;
    context.NumberLong = Long;
  }
};
