'use strict';

function createWriteConcern(coll, options) {
  // If writeConcern set, use it, else get from collection (which will inherit from db/mongo)
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
  return Object.assign(result, renderMapping[method](target, args, response));
}

let methodHandler = {
  get(target, key, receiver) {
    if (typeof target[key] !== 'function') return target[key];

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

function CollectionProxy(collection) {
  return new Proxy(collection, methodHandler);
}

module.exports = CollectionProxy;
