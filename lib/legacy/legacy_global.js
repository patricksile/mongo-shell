'use strict';
const { ObjectId } = require('mongodb');

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

module.exports = {
  decorate: context => {
    context.ObjectId = ObjectId;
    context.Array = Array;
    context.Object = Object;
  }
};
