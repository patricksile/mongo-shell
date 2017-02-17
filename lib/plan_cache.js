'use strict';
const Cursor = require('mongodb').Cursor;

/**
 * PlanCache
 * Holds a reference to the collection.
 * Proxy for planCache* commands.
 */
class PlanCache {
  constructor(collection) {
    this._collection = collection;
  }

  /**
   * Name of PlanCache.
   * Same as collection.
   */
  getName() { return this._collection.collectionName; }

  /**
   * toString prints the name of the collection
   */
  toString() {
    return `PlanCache for collection ${this.getName()}. Type help() for more info.`;
  }

  /**
   * Lists query shapes in a collection.
   */
  listQueryShapes() {
    return this._collection.runCommand('planCacheListQueryShapes')
      .then(res => res.shapes);
  }

  /**
   * Clears plan cache in a collection.
   */
  clear() {
    return this._collection.runCommand('planCacheClear');
  }

  /**
   * List plans for a query shape.
   */
  getPlansByQuery(query, projection, sort, collation) {
    const options = _parseQueryShape(query, projection, sort, collation);
    return this._collection.runCommand('planCacheListPlans', options)
      .then(res => res.plans);
  }

  /**
   * Drop query shape from the plan cache.
   */
  clearPlansByQuery(query, projection, sort, collation) {
    const options = _parseQueryShape(query, projection, sort, collation);
    return this._collection.runCommand('planCacheClear', options);
  }
}

PlanCache.prototype.shellPrint = PlanCache.prototype.toString;

function stringCompare(lhs, rhs) {
  return JSON.stringify(lhs) === JSON.stringify(rhs);
}

/**
 * Internal function to parse query shape.
 */
function _parseQueryShape(query, projection, sort, collation) {
  if (query === undefined) {
    throw new Error('required parameter `query` missing');
  }

  // Accept query shape object as only argument.
  // Query shape must contain 'query', 'projection', and 'sort', and may optionally contain
  // 'collation'. 'collation' must be non-empty if present.
  if (typeof(query) === 'object' && projection === undefined && sort === undefined && collation === undefined) {
    let keysSorted = Object.keys(query).sort();
    // Expected keys must be sorted for the comparison to work.
    if (stringCompare(keysSorted, ['fields', 'query', 'sort']) === false) {
      return query;
    }

    if (stringCompare(keysSorted, ['collation', 'fields', 'query', 'sort']) === false) {
      if (Object.keys(query.s.cmd.collation).length === 0) {
        throw new Error('collation object must not be empty');
      }
      return query;
    }
  }

  // Extract query shape, projection, sort and collation from Cursor if it is the first
  // argument. If a sort or projection is provided in addition to Cursor, do not
  // overwrite with the Cursor value.
  if (query instanceof Cursor) {
    if (projection !== undefined) {
      throw new Error('cannot pass Cursor with projection');
    }

    if (sort !== undefined) {
      throw new Error('cannot pass Cursor with sort');
    }

    if (collation !== undefined) {
      throw new Error('cannot pass Cursor with collation');
    }

    let queryObj = query.s.cmd.query  || {};
    projection = query.s.cmd.fields || {};
    sort = query.s.cmd.sort || {};
    collation = query.s.cmd.collation || undefined;
    // Overwrite Cursor with the BSON query.
    query = queryObj;
  }

  let shape = {
    query: query,
    projection: projection || {},
    sort: sort || {}
  };

  if (collation !== undefined) {
    shape.collation = collation;
  }

  return shape;
}

module.exports = PlanCache;
