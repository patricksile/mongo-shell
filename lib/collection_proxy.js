'use strict';
const util = require('util');

function createWriteConcern(coll, options) {
  // If writeConcern set, use it, else get from collection (which will inherit from db/mongo)
  options = options || {};
  let writeConcern = options.writeConcern || coll.writeConcern;
  let writeConcernOptions = ['w', 'wtimeout', 'j', 'fsync'];

  // Only merge in write concern options if at least one is specified in options
  if (options.w || options.wtimeout || options.j || options.fsync) {
    writeConcern = {};
    writeConcernOptions.forEach(wc => {
      if (options[wc]) writeConcern[wc] = options[wc];
    });
  }

  return writeConcern;
}

function renderObjectId(id) { return id.hasOwnProperty('_id') ? id._id : id; }

let renderMapping = {
  bulkWrite: (coll, args, result) => {
    return {
      deletedCount: result.deletedCount,
      insertedCount: result.insertedCount,
      matchedCount: result.matchedCount,
      upsertedCount: result.upsertedCount,
      insertedIds: result.insertedIds.map(id => renderObjectId(id)),
      upsertedIds: result.upsertedIds.map(id => renderObjectId(id))
    };
  },
  insertOne: (coll, args, result) => {
    return { insertedId: renderObjectId(result.insertedId) };
  },
  insertMany: (coll, args, result) => {
    return { insertedIds: result.insertedIds.map(id => renderObjectId(id)) };
  },
  deleteOne: (coll, args, result) => {
    return { deletedCount: result.deletedCount };
  },
  deleteMany: (coll, args, result) => {
    return { deletedCount: result.deletedCount };
  },
  replaceOne: (coll, args, result) => {
    let r = {
      matchedCount: result.matchedCount,
      modifiedCount: typeof result.modifiedCount !== 'undefined' ? result.modifiedCount : result.n
    };

    if (result.upsertedId) r.upsertedId = renderObjectId(result.upsertedId);
    return r;
  },
  updateOne: (coll, args, result) => {
    let r = {
      matchedCount: result.matchedCount,
      modifiedCount: typeof result.modifiedCount !== 'undefined' ? result.modifiedCount : result.n
    };

    if (result.upsertedId) r.upsertedId = renderObjectId(result.upsertedId);
    return r;
  },
  updateMany: (coll, args, result) => {
    let r = {
      matchedCount: result.matchedCount,
      modifiedCount: typeof result.modifiedCount !== 'undefined' ? result.modifiedCount : result.n
    };

    if (result.upsertedId) r.upsertedId = renderObjectId(result.upsertedId);
    return r;
  },
  ensureIndex: (coll, args, result) => {
    // ????: this needs to be fixed, the return from the node driver is _minimal_
    return { ok: 1 };
  },
  createIndex: (coll, args, result) => {
    // ????: this needs to be fixed, the return from the node driver is _minimal_
    return { ok: 1 };
  }
};

function isAcknowledged(wc) { return (wc && wc.w === 0) ? false : true; }
function renderResponse(method, target, args, response) {
  if (!renderMapping.hasOwnProperty(method)) {
    return response;
  }

  let wc = createWriteConcern(target, args.slice(-1)[0]);
  let result = { acknowledged: isAcknowledged(wc) };
  if (!result.acknowledged) return result;

  let rendered =  Object.assign(result, renderMapping[method](target, args, response));
  if (response.result) {
    Object.defineProperty(rendered, 'result', {
      enumerable: false,
      get: function() { return response.result; }
    });
  }

  return rendered;
}

const RENDER_METHODS = [
  'bulkWrite', 'insertOne', 'insertMany', 'deleteOne', 'deleteMany', 'replaceOne',
  'updateOne', 'updateMany', 'ensureIndex', 'createIndex'
];

let methodHandler = function(db) {
  return {
    get(target, key, receiver) {
      // special cases
      if (key === 'getDB') return function() { return db; };

      // all the rest
      if (typeof key !== 'string') return target[key];
      if (typeof key === 'string') {
        if (typeof target[key] === 'undefined') {
          const collectionName = `${target.collectionName}.${key}`;
          return new CollectionProxy(target.s.db.collection(collectionName), db);
        }

        // return the existing property if its not a function
        if (typeof target[key] !== 'function') {
          return target[key];
        }
      }

      if (RENDER_METHODS.indexOf(key) === -1) {
        return target[key];
      }

      // otherwise trap function call
      const $method = target[key];
      return function(...args) {
        let response = $method.apply(this, args);
        if (response instanceof Promise) {
          return response.then(r => renderResponse(key, target, args, r));
        }

        return renderResponse(key, target, args, response);
      };
    }
  };
};

function CollectionProxy(collection, db, options) {
  // Add our options to the collection instance
  collection.__options = options || { log: console.log };
  // Create a collection proxy
  return new Proxy(collection, methodHandler(db));
}

module.exports = CollectionProxy;
