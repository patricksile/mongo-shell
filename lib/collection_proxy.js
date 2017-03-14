'use strict';
const util = require('util');

// TODO copyTo
// TODO dataSize
// TODO getShardDistribution
// TODO getShardVersion
// TODO latencyStats
// TODO renameCollection
// TODO storageSize
// TODO totalSize
// TOTO totalIndexSize


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

  /**
   * Inserts a document into a collection.
   *
   * @example
   * // Insert a Document without Specifying an _id Field
   * db.products.insertOne( { item: "card", qty: 15 } );
   * 
   * // Insert a Document Specifying an _id Field
   * db.products.insertOne( { _id: 10, item: "box", qty: 20 } );
   * 
   * // Given a three member replica set, the following operation specifies a w of majority, wtimeout of 100
   * db.products.insertOne(
   *   { "item": "envelopes", "qty": 100, type: "Self-Sealing" },
   *   { writeConcern: { w : "majority", wtimeout : 100 } }
   * );
   * @method
   * @param {array} documents An array of documents to insert into the collection.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @return {Promise}
   */
  insertOne: (coll, args, result) => {
    return { insertedId: renderObjectId(result.insertedId) };
  },

  /**
   * Inserts multiple documents into a collection.
   *
   * @example
   * // Insert Several Document without Specifying an _id Field
   * db.products.insertMany( [
   *   { item: "card", qty: 15 },
   *   { item: "envelope", qty: 20 },
   *   { item: "stamps" , qty: 30 }
   * ] );
   * 
   * // Insert Several Document Specifying an _id Field
   * db.products.insertMany( [
   *   { _id: 10, item: "large box", qty: 20 },
   *   { _id: 11, item: "small box", qty: 55 },
   *   { _id: 12, item: "medium box", qty: 30 }
   * ] );
   * 
   * // The following attempts to insert multiple documents with _id field and ordered: false. The array of documents contains two documents with duplicate _id fields
   * db.products.insertMany( [
   *   { _id: 10, item: "large box", qty: 20 },
   *   { _id: 11, item: "small box", qty: 55 },
   *   { _id: 11, item: "medium box", qty: 30 },
   *   { _id: 12, item: "envelope", qty: 100},
   *   { _id: 13, item: "stamps", qty: 125 },
   *   { _id: 13, item: "tape", qty: 20},
   *   { _id: 14, item: "bubble wrap", qty: 30}
   * ], { ordered: false } );
   * 
   * // Given a three member replica set, the following operation specifies a w of majority and wtimeout of 100.
   * db.products.insertMany([
   *      { _id: 10, item: "large box", qty: 20 },
   *      { _id: 11, item: "small box", qty: 55 },
   *      { _id: 12, item: "medium box", qty: 30 }
   *   ],
   *   { w: "majority", wtimeout: 100 }
   * );
   * @method
   * @param {object} document A document to insert into the collection.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @param {object} [options.ordered=true] A boolean specifying whether the mongod instance should perform an ordered or unordered insert. Defaults to true.
   * @return {Promise}
   */
  insertMany: (coll, args, result) => {
    return { insertedIds: result.insertedIds.map(id => renderObjectId(id)) };
  },

  /**
   * Removes a single document from a collection.
   *
   * @example
   * // Delete a Single Document
   * db.orders.deleteOne( { "_id" : ObjectId("563237a41a4d68582c2509da") } );
   * 
   * // deleteOne() with Write Concern
   * db.orders.deleteOne(
   *   { "_id" : ObjectId("563237a41a4d68582c2509da") },
   *   { w : "majority", wtimeout : 100 }
   * );
   * 
   * // Specify Collation
   * db.myColl.deleteOne(
   *   { category: "cafe", status: "A" },
   *   { collation: { locale: "fr", strength: 1 } }
   * )
   * @method
   * @param {object} filter Specifies deletion criteria using query operators.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @param {object} [options.collation] Specifies the collation to use for the operation.
   * @return {Promise}
   */
  deleteOne: (coll, args, result) => {
    return { deletedCount: result.deletedCount };
  },

  /**
   * Removes all documents that match the filter from a collection.
   *
   * @example
   * // Delete Multiple Documents
   * db.orders.deleteMany( { "client" : "Crude Traders Inc." } );
   * 
   * // deleteOne() with Write Concern
   * db.orders.deleteMany(
   *   { "_id" : ObjectId("563237a41a4d68582c2509da") },
   *   { w : "majority", wtimeout : 100 }
   * );
   * 
   * // Specify Collation
   * db.myColl.deleteMany(
   *   { category: "cafe", status: "A" },
   *   { collation: { locale: "fr", strength: 1 } }
   * )
   * @method
   * @param {object} filter Specifies deletion criteria using query operators.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @param {object} [options.collation] Specifies the collation to use for the operation.
   * @return {Promise}
   */
  deleteMany: (coll, args, result) => {
    return { deletedCount: result.deletedCount };
  },

  /**
   * Replaces a single document within the collection based on the filter.
   *
   * @example
   * // Replace
   * db.restaurant.replaceOne(
   *   { "name" : "Central Perk Cafe" },
   *   { "name" : "Central Pork Cafe", "Borough" : "Manhattan" }
   * );
   * 
   * // Replace with Upsert
   * db.restaurant.replaceOne(
   *   { "name" : "Pizza Rat's Pizzaria" },
   *   { "_id": 4, "name" : "Pizza Rat's Pizzaria", "Borough" : "Manhattan", "violations" : 8 },
   *   { upsert: true }
   * );
   * 
   * // Replace with Write Concern
   * db.restaurant.replaceOne(
   *   { "name" : "Pizza Rat's Pizzaria" },
   *   { "name" : "Pizza Rat's Pub", "Borough" : "Manhattan", "violations" : 3 },
   *   { w: "majority", wtimeout: 100 }
   * );
   * 
   * // Specify Collation
   * db.myColl.replaceOne(
   *   { category: "cafe", status: "a" },
   *   { category: "cafÉ", status: "Replaced" },
   *   { collation: { locale: "fr", strength: 1 } }
   * );
   * @method
   * @param {object} filter The selection criteria for the update. The same query selectors as in the find() method are available.
   * @param {object} replacement The replacement document.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {boolean} [options.upsert=false] MongoDB will add the _id field to the replacement document if it is not specified in either the filter or replacement documents. If _id is present in both, the values must be equal.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @param {object} [options.collation] Specifies the collation to use for the operation.
   * @return {Promise}
   */
  replaceOne: (coll, args, result) => {
    let r = {
      matchedCount: result.matchedCount,
      modifiedCount: typeof result.modifiedCount !== 'undefined' ? result.modifiedCount : result.n
    };

    if (result.upsertedId) r.upsertedId = renderObjectId(result.upsertedId);
    return r;
  },

  /**
   * Updates a single document within the collection based on the filter.
   *
   * @example
   * // Update
   * db.restaurant.updateOne(
   *   { "name" : "Central Perk Cafe" },
   *   { $set: { "violations" : 3 } }
   * );
   * 
   * // Update with Upsert
   * db.restaurant.updateOne(
   *   { "name" : "Pizza Rat's Pizzaria" },
   *   { $set: {"_id" : 4, "violations" : 7, "borough" : "Manhattan" } },
   *   { upsert: true }
   * );
   * 
   * // Update with Write Concern
   * db.restaurant.updateOne(
   *   { "name" : "Pizza Rat's Pizzaria" },
   *   { $inc: { "violations" : 3}, $set: { "Closed" : true } },
   *   { w: "majority", wtimeout: 100 }
   * );
   * 
   * // Specify Collation
   * db.myColl.updateOne(
   *   { category: "cafe" },
   *   { $set: { status: "Updated" } },
   *   { collation: { locale: "fr", strength: 1 } }
   * );
   * @method
   * @param {object} filter The selection criteria for the update. The same query selectors as in the find() method are available.
   * @param {object} update The modifications to apply.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {boolean} [options.upsert=false] MongoDB will add the _id field to the replacement document if it is not specified in either the filter or replacement documents. If _id is present in both, the values must be equal.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @param {object} [options.collation] Specifies the collation to use for the operation.
   * @return {Promise}
   */
  updateOne: (coll, args, result) => {
    let r = {
      matchedCount: result.matchedCount,
      modifiedCount: typeof result.modifiedCount !== 'undefined' ? result.modifiedCount : result.n
    };

    if (result.upsertedId) r.upsertedId = renderObjectId(result.upsertedId);
    return r;
  },

  /**
   * Updates multiple documents within the collection based on the filter.
   *
   * @example
   * // Update Multiple Documents
   * db.restaurant.updateMany(
   *   { violations: { $gt: 4 } },
   *   { $set: { "Review" : true } }
   * );
   * 
   * // Update Multiple Documents with Upsert
   * db.inspectors.updateMany(
   *   { "Sector" : { $gt : 4 }, "inspector" : "R. Coltrane" },
   *   { $set: { "Patrolling" : false } },
   *   { upsert: true }
   * );
   * 
   * // Update with Write Concern
   * db.restaurant.updateMany(
   *   { "name" : "Pizza Rat's Pizzaria" },
   *   { $inc: { "violations" : 3}, $set: { "Closed" : true } },
   *   { w: "majority", wtimeout: 100 }
   * );
   * 
   * // Specify Collation
   * db.myColl.updateMany(
   *   { category: "cafe" },
   *   { $set: { status: "Updated" } },
   *   { collation: { locale: "fr", strength: 1 } }
   * );
   * @method
   * @param {object} filter The selection criteria for the update. The same query selectors as in the find() method are available.
   * @param {object} update The modifications to apply.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {boolean} [options.upsert=false] MongoDB will add the _id field to the replacement document if it is not specified in either the filter or replacement documents. If _id is present in both, the values must be equal.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @param {object} [options.collation] Specifies the collation to use for the operation.
   * @return {Promise}
   */
  updateMany: (coll, args, result) => {
    let r = {
      matchedCount: result.matchedCount,
      modifiedCount: typeof result.modifiedCount !== 'undefined' ? result.modifiedCount : result.n
    };

    if (result.upsertedId) r.upsertedId = renderObjectId(result.upsertedId);
    return r;
  },

  /**
   * Creates an index on the specified field if the index does not already exist. 
   * Deprecated since version 3.0.0: db.collection.ensureIndex() is now an alias for db.collection.createIndex().
   *
   * @method
   * @param {object} filter The selection criteria for the update. The same query selectors as in the find() method are available.
   * @param {object} update The modifications to apply.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {boolean} [options.upsert=false] MongoDB will add the _id field to the replacement document if it is not specified in either the filter or replacement documents. If _id is present in both, the values must be equal.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @param {object} [options.collation] Specifies the collation to use for the operation.
   * @return {Promise}
   */
  ensureIndex: (coll, args, result) => {
    // ????: this needs to be fixed, the return from the node driver is _minimal_
    return { ok: 1 };
  },

  /**
   * Creates indexes on collections.
   * @example
   * // Create an Ascending Index on a Single Field
   * db.collection.createIndex( { orderDate: 1 } )
   * 
   * // Create an Index on a Multiple Fields
   * db.collection.createIndex( { orderDate: 1, zipcode: -1 } )
   * 
   * // Create Indexes with Collation Specified
   * db.collection.createIndex(
   *   { category: 1 },
   *   { name: "category_fr", collation: { locale: "fr", strength: 2 } }
   * )
   * @method
   * @param {object} keys A document that contains the field and value pairs where the field is the index key and the value describes the type of index for that field. For an ascending index on a field, specify a value of 1; for descending index, specify a value of -1.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {boolean} [options.background=false] Builds the index in the background so that building an index does not block other database activities. Specify true to build in the background. The default value is false.
   * @param {boolean} [options.unique=false] Creates a unique index so that the collection will not accept insertion of documents where the index key or keys match an existing value in the index. Specify true to create a unique index. The default value is false.
   * @param {string} [options.name] The name of the index. If unspecified, MongoDB generates an index name by concatenating the names of the indexed fields and the sort order.
   * @param {object} [options.partialFilterExpression] If specified, the index only references documents that match the filter expression. See Partial Indexes for more information.
   * @param {boolean} [options.sparse] If true, the index only references documents with the specified field. These indexes use less space but behave differently in some situations (particularly sorts). The default value is false. See Sparse Indexes for more information.
   * @param {number} [options.expireAfterSeconds] Specifies a value, in seconds, as a TTL to control how long MongoDB retains documents in this collection. See Expire Data from Collections by Setting TTL for more information on this functionality. This applies only to TTL indexes.
   * @param {object} [options.storageEngine] Allows users to specify configuration to the storage engine on a per-index basis when creating an index. The value of the storageEngine option should take the following form: { <storage-engine-name>: <options> }.
   * @return {Promise}
   */
  createIndex: (coll, args, result) => {
    // ????: this needs to be fixed, the return from the node driver is _minimal_
    return { ok: 1 };
  }

  /**
   * Calculates aggregate values for the data in a collection.
   * @example
   * // Group by and Calculate a Sum
   * db.orders.aggregate([
   *   { $match: { status: "A" } },
   *   { $group: { _id: "$cust_id", total: { $sum: "$amount" } } },
   *   { $sort: { total: -1 } }
   * ])
   * 
   * // Return Information on Aggregation Pipeline Operation
   * db.orders.aggregate([
   *   { $match: { status: "A" } },
   *   { $group: { _id: "$cust_id", total: { $sum: "$amount" } } },
   *   { $sort: { total: -1 } }], {
   *     explain: true
   *  })
   * 
   * // Perform Large Sort Operation with External Sor
   * var results = db.stocks.aggregate([
   *   { $project : { cusip: 1, date: 1, price: 1, _id: 0 } },
   *   { $sort : { cusip : 1, date: 1 } }
   * ], {
   *   allowDiskUse: true
   * })
   * 
   * // Specify an Initial Batch Size
   * db.orders.aggregate([
   *   { $match: { status: "A" } },
   *   { $group: { _id: "$cust_id", total: { $sum: "$amount" } } },
   *   { $sort: { total: -1 } },
   *   { $limit: 2 }
   * ], {
   *   cursor: { batchSize: 0 }
   * })
   * 
   * // Specify a Collation
   * db.myColl.aggregate(
   *   [ { $match: { status: "A" } }, { $group: { _id: "$category", count: { $sum: 1 } } } ],
   *   { collation: { locale: "fr", strength: 1 } }
   * );
   * 
   * // Override readConcern
   * db.restaurants.aggregate(
   *  [ { $match: { rating: { $lt: 5 } } } ],
   *  { readConcern: { level: "majority" } })
   * @ctx { "type": "property", "name": "aggregate", "value": "(pipeline, options) => {", "string": "aggregate"}
   * @method aggregate
   * @param {array} pipeline A sequence of data aggregation operations or stages. See the aggregation pipeline operators for details.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {boolean} [options.explain] Specifies to return the information on the processing of the pipeline. See Return Information on Aggregation Pipeline Operation for an example.
   * @param {boolean} [options.allowDiskUse] Enables writing to temporary files. When set to true, aggregation operations can write data to the _tmp subdirectory in the dbPath directory. See Perform Large Sort Operation with External Sort for an example.
   * @param {object} [options.cursor] Specifies the initial batch size for the cursor. The value of the cursor field is a document with the field batchSize. See Specify an Initial Batch Size for syntax and example.
   * @param {boolean} [options.bypassDocumentValidation] Available only if you specify the $out aggregation operator.
   * @param {object} [options.readConcern] Specifies the read concern. The option has the following syntax:readConcern: { level: <value> }.
   * @param {object} [options.collation] Specifies the collation to use for the operation.
   * @return {Promise}
   */

  /**
   * Performs multiple write operations with controls for order of execution.
   * @example
   * // Bulk Write Operations
   * db.characters.bulkWrite([{ 
   *   insertOne : {
   *     "document" : {
   *       "_id" : 4, "char" : "Dithras", "class" : "barbarian", "lvl" : 4
   *     }
   *   }
   * }, { 
   *   insertOne : {
   *     "document" : {
   *       "_id" : 5, "char" : "Taeln", "class" : "fighter", "lvl" : 3
   *     }
   *   }
   * }, { 
   *   updateOne : {
   *     "filter" : { "char" : "Eldon" },
   *     "update" : { $set : { "status" : "Critical Injury" } }
   *   }
   * }, { 
   *   deleteOne : {
   *     "filter" : { "char" : "Brisbane"} 
   *   }
   * }, { 
   *   replaceOne : {
   *     "filter" : { "char" : "Meldane" },
   *     "replacement" : { "char" : "Tanys", "class" : "oracle", "lvl" : 4 }
   *   }
   * }]);
   * 
   * // Unordered Bulk Write with writeConcern
   * db.characters.bulkWrite([{ 
   *   insertOne : {
   *     "document" : {
   *       "_id" : 4, "char" : "Dithras", "class" : "barbarian", "lvl" : 4
   *     }
   *   }
   * }, { 
   *   insertOne : {
   *     "document" : {
   *       "_id" : 5, "char" : "Taeln", "class" : "fighter", "lvl" : 3
   *     }
   *   }
   * }, { 
   *   updateOne : {
   *     "filter" : { "char" : "Eldon" },
   *     "update" : { $set : { "status" : "Critical Injury" } }
   *   }
   * }, { 
   *   deleteOne : {
   *     "filter" : { "char" : "Brisbane"} 
   *   }
   * }, { 
   *   replaceOne : {
   *     "filter" : { "char" : "Meldane" },
   *     "replacement" : { "char" : "Tanys", "class" : "oracle", "lvl" : 4 }
   *   }
   * }], {
   *   ordered: false
   *   writeConcern : { w : "majority", wtimeout : 100 }
   * });
   * @ctx { "type": "property", "name": "bulkWrite", "value": "(operations, options) => {", "string": "bulkWrite"}
   * @method bulkWrite
   * @param {array} operations An array of bulkWrite() write operations.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @param {object} [options.ordered=true] A boolean specifying whether the mongod instance should perform an ordered or unordered insert. Defaults to true.
   * @return {Promise}
   */

  /**
   * Performs multiple write operations with controls for order of execution.
   * @example
   * // Count all Documents in a Collection
   * db.orders.count()
   * 
   * // Count all Documents that Match a Query
   * db.orders.count( { ord_dt: { $gt: new Date('01/01/2012') } } )
   * @ctx { "type": "property", "name": "count", "value": "(query, options) => {", "string": "count"}
   * @method count
   * @param {object} query The query selection criteria.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {number} [options.limit] The maximum number of documents to count.
   * @param {number} [options.skip] The number of documents to skip before counting.
   * @param {string|object} [options.hint] An index name hint or specification for the query.
   * @param {number} [options.maxTimeMS] The maximum amount of time to allow the query to run.
   * @param {string} [options.readConcern] Specifies the read concern. The default level is "local".
   * @return {Promise}
   */

  /**
   * Finds the distinct values for a specified field across a single collection and returns the results in an array.
   * @example
   * // Return Distinct Values for a Field
   * db.inventory.distinct( "dept" )
   * 
   * // Return Distinct Values for an Embedded Field
   * db.inventory.distinct( "item.sku" )
   * 
   * // Return Distinct Values for an Array Field
   * db.inventory.distinct( "sizes" )
   * 
   * // Specify Query with distinct
   * db.inventory.distinct( "item.sku", { dept: "A" } )
   * 
   * // Specify a Collation
   * db.myColl.distinct( "category", {}, { collation: { locale: "fr", strength: 1 } } )
   * @ctx { "type": "property", "name": "distinct", "value": "(field, query, options) => {", "string": "distinct"}
   * @method distinct
   * @param {string} field The field for which to return distinct values.
   * @param {object} query A query that specifies the documents from which to retrieve the distinct values.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.collation] Specifies the collation to use for the operation.
   * @return {Promise}
   */

  /**
   * Removes a collection or view from the database. The method also removes any indexes associated with the dropped collection. The method provides a wrapper around the drop command.
   * @example
   * // The following operation drops the students collection in the current database.
   * db.students.drop()
   * @ctx { "type": "property", "name": "drop", "value": "() => {", "string": "drop"}
   * @method drop
   * @return {Promise}
   */

  /**
   * Drops or removes the specified index from a collection. The db.collection.dropIndex() method provides a wrapper around the dropIndexes command.
   * @example
   * // Drop index using index name
   * db.pets.dropIndex( "catIdx" )
   * 
   * // Drop index using index specification
   * db.pets.dropIndex( { "cat" : -1 } )
   * @ctx { "type": "property", "name": "dropIndex", "value": "(index) => {", "string": "dropIndex"}
   * @method dropIndex
   * @param {string|object} index Specifies the index to drop. You can specify the index either by the index name or by the index specification document.
   * @return {Promise}
   */

  /**
   * Drops or removes the specified index from a collection. The db.collection.dropIndex() method provides a wrapper around the dropIndexes command.
   * @example
   * // Drop all indexes on the collection pets
   * db.pets.dropIndexes()
   * @ctx { "type": "property", "name": "dropIndexes", "value": "() => {", "string": "dropIndexes"}
   * @method dropIndexes
   * @return {Promise}
   */

  /**
   * Returns information on the query plan for the following operations: aggregate(); count(); distinct(); find(); group(); remove(); and update() methods.
   * @example
   * // queryPlanner Mode
   * db.products.explain().count( { quantity: { $gt: 50 } } )
   * 
   * // executionStats Mode
   * db.products.explain("executionStats").find(
   *   { quantity: { $gt: 50 }, category: "apparel" }
   * )
   * 
   * // allPlansExecution Mode
   * db.products.explain("allPlansExecution").update(
   *   { quantity: { $lt: 1000}, category: "apparel" },
   *   { $set: { reorder: true } }
   * )
   *
   * // Explain find() with Modifiers
   * db.products.explain("executionStats").find(
   *   { quantity: { $gt: 50 }, category: "apparel" }
   * ).sort( { quantity: -1 } ).hint( { category: 1, quantity: -1 } )
   * 
   * // Iterate the explain().find() Return Cursor
   * var explainResult = db.products.explain().find( { category: "apparel" } ).next();
   * @ctx { "type": "property", "name": "explain", "value": "(verbosity) => {", "string": "explain"}
   * @method explain
   * @param {string} verbosity Specifies the verbosity mode for the explain output. The mode affects the behavior of explain() and determines the amount of information to return. The possible modes are: "queryPlanner", "executionStats", and "allPlansExecution".
   * @return {Promise}
   */

  /**
   * Selects documents in a collection and returns a cursor to the selected documents.
   * @example
   * // Find All Documents in a Collection
   * db.bios.find()
   * 
   * // Find Documents that Match Query Criteria
   * db.products.find( { qty: { $gt: 25 } } )
   * 
   * // Query for Equality
   * db.bios.find( { _id: 5 } )
   * 
   * // Query Using Operators
   * db.bios.find({
   *   _id: { $in: [ 5,  ObjectId("507c35dd8fada716c89d0013") ] }
   * })
   * 
   * // Query for Ranges
   * db.collection.find( { field: { $gt: value1, $lt: value2 } } );
   * 
   * // Query a Field that Contains an Array
   * db.students.find( { score: { $gt: 0, $lt: 2 } } )
   * 
   * // Query for an Array Element
   * db.bios.find( { contribs: "UNIX" } )
   * 
   * // Query an Array of Documents
   * db.bios.find({
   *   awards: {
   *     $elemMatch: {
   *       award: "Turing Award",
   *       year: { $gt: 1980 }
   *     }
   *   }
   * })
   * 
   * // Query Exact Matches on Embedded Documents
   * db.bios.find({
   *   name: {
   *     first: "Yukihiro",
   *     last: "Matsumoto"
   *   }
   * })
   * 
   * // Specify the Fields to Return
   * db.products.find( { qty: { $gt: 25 } }, { item: 1, qty: 1 } )
   * 
   * // Explicitly Excluded Fields
   * db.bios.find({ contribs: 'OOP' }, { 'name.first': 0, birth: 0 })
   * @ctx { "type": "property", "name": "find", "value": "(query, projection) => {", "string": "find"}
   * @method find
   * @param {object} [query] Specifies selection filter using query operators. To return all documents in a collection, omit this parameter or pass an empty document ({}).
   * @param {object} [projection] Specifies the fields to return in the documents that match the query filter. To return all fields in the matching documents, omit this parameter. For details, see Projection.
   * @return {Promise}
   */

  /**
   * Modifies and returns a single document. By default, the returned document does not include the modifications made on the update. To return the document with the modifications made on the update, use the new option. The findAndModify() method is a shell helper around the findAndModify command.
   *
   * @example
   * // Update and Return
   * db.people.findAndModify({
   *   query: { name: "Tom", state: "active", rating: { $gt: 10 } },
   *   sort: { rating: 1 },
   *   update: { $inc: { score: 1 } }
   * })
   * 
   * // Upsert
   * db.people.findAndModify({
   *   query: { name: "Gus", state: "active", rating: 100 },
   *   sort: { rating: 1 },
   *    update: { $inc: { score: 1 } },
   *    upsert: true
   * })
   * 
   * // Return New Document
   * db.people.findAndModify({
   *   query: { name: "Pascal", state: "active", rating: 25 },
   *   sort: { rating: 1 },
   *   update: { $inc: { score: 1 } },
   *   upsert: true,
   *   new: true
   * })
   * 
   * // Sort and Remove
   * db.people.findAndModify({
   *   query: { state: "active" },
   *   sort: { rating: 1 },
   *   remove: true
   * })
   * 
   * // Specify Collation
   * db.myColl.findAndModify({
   *   query: { category: "cafe", status: "a" },
   *   sort: { category: 1 },
   *   update: { $set: { status: "Updated" } },
   *   collation: { locale: "fr", strength: 1 }
   * });
   * @ctx { "type": "property", "name": "findAndModify", "value": "(object) => {", "string": "findAndModify"}
   * @method findAndModify
   * @param {object} object The findAndModify operation object.
   * @param {object} [object.query] The selection criteria for the modification. The query field employs the same query selectors as used in the db.collection.find() method. Although the query may match multiple documents, findAndModify() will only select one document to modify.
   * @param {object} [object.sort]  Determines which document the operation modifies if the query selects multiple documents. findAndModify() modifies the first document in the sort order specified by this argument.
   * @param {boolean} object.remove=false Must specify either the remove or the update field. Removes the document specified in the query field. Set this to true to remove the selected document . The default is false.
   * @param {object} object.update Must specify either the remove or the update field. Performs an update of the selected document. The update field employs the same update operators or field: value specifications to modify the selected document.
   * @param {boolean} object.new=false When true, returns the modified document rather than the original. The findAndModify() method ignores the new option for remove operations. The default is false.
   * @param {object} [object.fields] A subset of fields to return. The fields document specifies an inclusion of a field with 1, as in: fields: { <field1>: 1, <field2>: 1, ... }
   * @param {boolean} [object.upsert=false] Used in conjuction with the update field.
   * @param {boolean} [object.bypassDocumentValidation] Enables db.collection.findAndModify to bypass document validation during the operation. This lets you update documents that do not meet the validation requirements.
   * @param {object} [object.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @param {number} [object.maxTimeMS] The maximum amount of time to allow the query to run.
   * @param {object} [object.collation] Specifies the collation to use for the operation.
   * @return {Promise}
   */

  /**
   * Returns one document that satisfies the specified query criteria. If multiple documents satisfy the query, this method returns the first document according to the natural order which reflects the order of documents on the disk. In capped collections, natural order is the same as insertion order. If no document satisfies the query, the method returns null.
   * @example
   * // Find First Document in a Collection
   * db.bios.findOne()
   * 
   * // Find First Document that Match Query Criteria
   * db.products.findOne( { qty: { $gt: 25 } } )
   * 
   * // Query for Equality
   * db.bios.findOne( { _id: 5 } )
   * 
   * // Query Using Operators
   * db.bios.findOne({
   *   _id: { $in: [ 5,  ObjectId("507c35dd8fada716c89d0013") ] }
   * })
   * 
   * // Query for Ranges
   * db.collection.findOne( { field: { $gt: value1, $lt: value2 } } );
   * 
   * // Query a Field that Contains an Array
   * db.students.findOne( { score: { $gt: 0, $lt: 2 } } )
   * 
   * // Query for an Array Element
   * db.bios.findOne( { contribs: "UNIX" } )
   * 
   * // Query an Array of Documents
   * db.bios.findOne({
   *   awards: {
   *     $elemMatch: {
   *       award: "Turing Award",
   *       year: { $gt: 1980 }
   *     }
   *   }
   * })
   * 
   * // Query Exact Matches on Embedded Documents
   * db.bios.findOne({
   *   name: {
   *     first: "Yukihiro",
   *     last: "Matsumoto"
   *   }
   * })
   * 
   * // Specify the Fields to Return
   * db.products.findOne( { qty: { $gt: 25 } }, { item: 1, qty: 1 } )
   * 
   * // Explicitly Excluded Fields
   * db.bios.findOne({ contribs: 'OOP' }, { 'name.first': 0, birth: 0 })
   * @ctx { "type": "property", "name": "findOne", "value": "(query, projection) => {", "string": "findOne"}
   * @method findOne
   * @param {object} [query] Specifies selection filter using query operators. To return all documents in a collection, omit this parameter or pass an empty document ({}).
   * @param {object} [projection] Specifies the fields to return in the documents that match the query filter. To return all fields in the matching documents, omit this parameter. For details, see Projection.
   * @return {Promise}
   */

  /**
   * Deletes a single document based on the filter and sort criteria, returning the deleted document.
   *
   * @example
   * // Delete A Document
   * db.scores.findOneAndDelete({ "name" : "M. Tagnum" })
   * 
   * // Sort And Delete A Document
   * db.scores.findOneAndDelete(
   *   { "name" : "A. MacDyver" },
   *   { sort : { "points" : 1 } })
   * 
   * // Projecting the Deleted Document
   * db.scores.findOneAndDelete(
   *   { "name" : "A. MacDyver" },
   *   { sort : { "points" : 1 }, projection: { "assignment" : 1 } })
   * 
   * // Update Document with Time Limit
   * db.scores.findOneAndDelete(
   *   { "name" : "A. MacDyver" },
   *   { sort : { "points" : 1 }, maxTimeMS : 5 };
   * );
   * @ctx { "type": "property", "name": "findOneAndDelete", "value": "(filter, options) => {", "string": "findOneAndDelete"}
   * @method findOneAndDelete
   * @param {object} filter The selection criteria for the update. The same query selectors as in the find() method are available.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.projection]  A subset of fields to return.
   * @param {object} [options.sort] Specifies a sorting order for the documents matched by the filter.
   * @param {number} [options.maxTimeMS] The maximum amount of time to allow the query to run.
   * @param {object} [options.collation] Specifies the collation to use for the operation.
   * @return {Promise}
   */

  /**
   * Deletes a single document based on the filter and sort criteria, returning the deleted document.
   *
   * @example
   * // Replace A Document
   * db.scores.findOneAndReplace(
   *   { "score" : { $lt : 20000 } },
   *   { "team" : "Observant Badgers", "score" : 20000 }
   * )
   * 
   * // Sort and Replace A Document
   * db.scores.findOneAndReplace(
   *   { "score" : { $lt : 20000 } },
   *   { "team" : "Observant Badgers", "score" : 20000 },
   *   { sort: { "score" : 1 } }
   * )
   * 
   * // Project the Returned Document
   * db.scores.findOneAndReplace(
   *   { "score" : { $lt : 22250 } },
   *   { "team" : "Therapeutic Hamsters", "score" : 22250 },
   *   { sort : { "score" : 1 }, project: { "_id" : 0, "team" : 1 } }
   * )
   * 
   * // Replace Document with Time Limit
   * db.scores.findOneAndReplace(
   *   { "score" : { $gt : 25000 } },
   *   { "team" : "Emphatic Rhinos", "score" : 25010 },
   *   { maxTimeMS: 5 }
   * );
   * 
   * // Replace Document with Upsert
   * db.scores.findOneAndReplace(
   *   { "team" : "Fortified Lobsters" },
   *   { "_id" : 6019, "team" : "Fortified Lobsters" , "score" : 32000},
   *   { upsert : true, returnNewDocument: true }
   * );
   * 
   * // Specify Collation
   * db.myColl.findOneAndReplace(
   *   { category: "cafe", status: "a" },
   *   { category: "cafÉ", status: "Replaced" },
   *   { collation: { locale: "fr", strength: 1 } }
   * );
   * @ctx { "type": "property", "name": "findOneAndReplace", "value": "(filter, replacement, options) => {", "string": "findOneAndReplace"}
   * @method findOneAndReplace
   * @param {object} filter The selection criteria for the update. The same query selectors as in the find() method are available.
   * @param {object} replacement The replacement document.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.projection]  A subset of fields to return.
   * @param {object} [options.sort] Specifies a sorting order for the documents matched by the filter.
   * @param {number} [options.maxTimeMS] The maximum amount of time to allow the query to run.
   * @param {boolean} [options.upsert=false] MongoDB will add the _id field to the replacement document if it is not specified in either the filter or replacement documents. If _id is present in both, the values must be equal.
   * @param {boolean} [options.returnNewDocument=false] When true, returns the replacement document instead of the original document.
   * @param {object} [options.collation] Specifies the collation to use for the operation.
   * @return {Promise}
   */

  /**
   * Updates a single document based on the filter and sort criteria.
   *
   * @example
   * // Update A Document
   * db.scores.findOneAndUpdate(
   *   { "name" : "R. Stiles" },
   *   { $inc: { "points" : 5 } }
   * )
   * 
   * // Sort And Update A Document
   * db.scores.findOneAndUpdate(
   *   { "name" : "A. MacDyver" },
   *   { $inc : { "points" : 5 } },
   *   { sort : { "points" : 1 } }
   * )
   * 
   * // Project the Returned Document
   * db.scores.findOneAndUpdate(
   *   { "name" : "A. MacDyver" },
   *   { $inc : { "points" : 5 } },
   *   { sort : { "points" : 1 }, projection: { "assignment" : 1, "points" : 1 } }
   * )
   * 
   * // Update Document with Time Limit
   * db.scores.findOneAndUpdate(
   *   { "name" : "A. MacDyver" },
   *   { $inc : { "points" : 5 } },
   *   { sort: { "points" : 1 }, maxTimeMS : 5 };
   * );
   * 
   * // Update Document with Upsert
   * db.scores.findOneAndUpdate(
   *   { "name" : "A.B. Abracus" },
   *   { $set: { "name" : "A.B. Abracus", "assignment" : 5}, $inc : { "points" : 5 } },
   *   { sort: { "points" : 1 }, upsert:true, returnNewDocument : true }
   * );
   * 
   * // Specify Collation
   * db.myColl.findOneAndUpdate(
   *   { category: "cafe" },
   *   { $set: { status: "Updated" } },
   *   { collation: { locale: "fr", strength: 1 } }
   * );
   * @ctx { "type": "property", "name": "findOneAndUpdate", "value": "(filter, update, options) => {", "string": "findOneAndUpdate"}
   * @method findOneAndUpdate
   * @param {object} filter The selection criteria for the update. The same query selectors as in the find() method are available.
   * @param {object} update The update document.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.projection]  A subset of fields to return.
   * @param {object} [options.sort] Specifies a sorting order for the documents matched by the filter.
   * @param {number} [options.maxTimeMS] The maximum amount of time to allow the query to run.
   * @param {boolean} [options.upsert=false] MongoDB will add the _id field to the replacement document if it is not specified in either the filter or replacement documents. If _id is present in both, the values must be equal.
   * @param {boolean} [options.returnNewDocument=false] When true, returns the replacement document instead of the original document.
   * @param {object} [options.collation] Specifies the collation to use for the operation.
   * @return {Promise}
   */

  /**
   * Returns an array that holds a list of documents that identify and describe the existing indexes on the collection. You must call db.collection.getIndexes() on a collection. For example:
   *
   * @example
   * @ctx { "type": "property", "name": "getIndexes", "value": "() => {", "string": "getIndexes"}
   * @method getIndexes
   * @return {Promise}
   */
  
  /**
   * Groups documents in a collection by the specified keys and performs simple aggregation functions such as computing counts and sums. The method is analogous to a SELECT <...> GROUP BY statement in SQL. The group() method returns an array.
   *
   * @example
   * // Group by Two Fields
   * db.orders.group({
   *  key: { ord_dt: 1, 'item.sku': 1 },
   *  cond: { ord_dt: { $gt: new Date( '01/01/2012' ) } },
   *  reduce: function ( curr, result ) { },
   *  initial: { }
   * })
   * 
   * // Calculate the Sum
   * db.orders.group({
   *   key: { ord_dt: 1, 'item.sku': 1 },
   *   cond: { ord_dt: { $gt: new Date( '01/01/2012' ) } },
   *   reduce: function( curr, result ) {
   *     result.total += curr.item.qty;
   *   },
   *   initial: { total : 0 }
   * })
   * 
   * // Calculate Sum, Count, and Average
   * db.orders.group({
   *   keyf: function(doc) {
   *     return { day_of_week: doc.ord_dt.getDay() };
   *   },
   *   cond: { ord_dt: { $gt: new Date( '01/01/2012' ) } },
   *   reduce: function( curr, result ) {
   *     result.total += curr.item.qty;
   *     result.count++;
   *   },
   *   initial: { total : 0, count: 0 },
   *   finalize: function(result) {
   *     var weekdays = ["Sunday", "Monday", "Tuesday",
   *                     "Wednesday", "Thursday",
   *                     "Friday", "Saturday"];
   *     result.day_of_week = weekdays[result.day_of_week];
   *     result.avg = Math.round(result.total / result.count);
   *   }
   * })
   * @ctx { "type": "property", "name": "group", "value": "(key, reduce, initial[, keyf] [, cond] [, finializer]) => {", "string": "group"}
   * @method group
   * @deprecated
   * @param {object} key The field or fields to group. Returns a “key object” for use as the grouping key.
   * @param {function} reduce An aggregation function that operates on the documents during the grouping operation. These functions may return a sum or a count. The function takes two arguments: the current document and an aggregation result document for that group.
   * @param {object} initial Initializes the aggregation result document.
   * @param {function} [keyf] Alternative to the key field. Specifies a function that creates a “key object” for use as the grouping key. Use keyf instead of key to group by calculated fields rather than existing document fields. 
   * @param {object} cond The selection criteria to determine which documents in the collection to process. If you omit the cond field, db.collection.group() processes all the documents in the collection for the group operation.
   * @param {function} [finalize] A function that runs each item in the result set before db.collection.group() returns the final value. This function can either modify the result document or replace the result document as a whole.
   * @param {object} [collation] Specifies the collation to use for the operation. 
   * @return {Promise}
   */  

  /**
   * Inserts a document or documents into a collection.
   *
   * @example
   * // Insert a Document without Specifying an _id Field
   * db.products.insert( { item: "card", qty: 15 } )
   * 
   * // Insert a Document Specifying an _id Field
   * db.products.insert( { _id: 10, item: "box", qty: 20 } )
   * 
   * // Insert Multiple Documents
   * db.products.insert([
   *   { _id: 11, item: "pencil", qty: 50, type: "no.2" },
   *   { item: "pen", qty: 20 },
   *   { item: "eraser", qty: 25 }
   * ])
   * 
   * // Perform an Unordered Insert
   * db.products.insert([
   *   { _id: 20, item: "lamp", qty: 50, type: "desk" },
   *   { _id: 21, item: "lamp", qty: 20, type: "floor" },
   *   { _id: 22, item: "bulk", qty: 100 }
   * ], { ordered: false })
   * 
   * // Override Default Write Concern
   * db.products.insert(
   *   { item: "envelopes", qty : 100, type: "Clasp" },
   *   { writeConcern: { w: "majority", wtimeout: 5000 } }
   * )
   * @ctx { "type": "property", "name": "insert", "value": "(document, options) => {", "string": "insert"}
   * @method insert
   * @deprecated
   * @param {object|array} document A document or array of documents to insert into the collection.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @param {object} [options.ordered=true] A boolean specifying whether the mongod instance should perform an ordered or unordered insert. Defaults to true.
   * @return {Promise}
   */

  /**
   * Returns true if the collection is a capped collection, otherwise returns false.
   *
   * @example
   * @ctx { "type": "property", "name": "isCapped", "value": "() => {", "string": "isCapped"}
   * @method isCapped
   * @return {Promise}
   */

  /**
   * The db.collection.mapReduce() method provides a wrapper around the mapReduce command.
   *
   * @example
   * Please see https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/
   * @ctx { "type": "property", "name": "mapReduce", "value": "(map, reduce, options) => {", "string": "mapReduce"}
   * @method mapReduce
   * @param {function} map A JavaScript function that associates or “maps” a value with a key and emits the key and value pair.
   * @param {function} reduce A JavaScript function that “reduces” to a single object all the values associated with a particular key.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {string|object} [options.out] Specifies the location of the result of the map-reduce operation. You can output to a collection, output to a collection with an action, or output inline. You may output to a collection when performing map reduce operations on the primary members of the set; on secondary members you may only use the inline output.
   * @param {object} [options.query] Specifies the selection criteria using query operators for determining the documents input to the map function. 
   * @param {object} [options.sort] Sorts the input documents. This option is useful for optimization. For example, specify the sort key to be the same as the emit key so that there are fewer reduce operations. The sort key must be in an existing index for this collection.
   * @param {number} [options.limit] Specifies a maximum number of documents for the input into the map function. 
   * @param {function} [options.finalize] Follows the reduce method and modifies the output.
   * @param {object} [options.scope] Specifies global variables that are accessible in the map, reduce and finalize functions.
   * @param {boolean} [options.jsMode] Specifies whether to convert intermediate data into BSON format between the execution of the map and reduce functions. Defaults to false. 
   * @param {boolean} [options.verbose] Specifies whether to include the timing information in the result information. The verbose defaults to true to include the timing information. 
   * @param {object} [options.collation] Specifies the collation to use for the operation. 
   * @return {Promise}
   */

  /**
   * The db.collection.reIndex() drops all indexes on a collection and recreates them. This operation may be expensive for collections that have a large amount of data and/or a large number of indexes.
   *
   * @ctx { "type": "property", "name": "reIndex", "value": "() => {", "string": "reIndex"}
   * @method reIndex
   * @return {Promise}
   */

  /**
   * Removes documents from a collection.
   *
   * @example
   * // Remove All Documents from a Collection
   * db.bios.remove( { } )
   * 
   * // Remove All Documents that Match a Condition
   * db.products.remove( { qty: { $gt: 20 } } )
   * 
   * // Override Default Write Concern
   * db.products.remove(
   *   { qty: { $gt: 20 } },
   *   { writeConcern: { w: "majority", wtimeout: 5000 } })
   * 
   * // Remove a Single Document that Matches a Condition
   * db.products.remove( { qty: { $gt: 20 } }, { justOne: true } )
   * 
   * // Isolate Remove Operations
   * db.products.remove( { qty: { $gt: 20 }, $isolated: 1 } )
   * @ctx { "type": "property", "name": "remove", "value": "(query, options) => {", "string": "remove"}
   * @method remove
   * @deprecated
   * @param {object} query Specifies deletion criteria using query operators. To delete all documents in a collection, pass an empty document ({}).
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {boolean} [options.justOne] To limit the deletion to just one document, set to true. Omit to use the default value of false and delete all documents matching the deletion criteria.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @param {object} [options.collation] Specifies the collation to use for the operation.
   * @return {Promise}
   */  

  /**
   * Updates an existing document or inserts a new document, depending on its document parameter.
   *
   * @example
   * // Save a New Document without Specifying an _id Field
   * db.products.save( { item: "book", qty: 40 } )
   * 
   * // Save a New Document Specifying an _id Field
   * db.products.save( { _id: 100, item: "water", qty: 30 } )
   * 
   * // Replace an Existing Document
   * db.products.save( { _id : 100, item : "juice" } )
   * 
   * // Override Default Write Concern
   * db.products.save(
   *   { item: "envelopes", qty : 100, type: "Clasp" },
   *   { writeConcern: { w: "majority", wtimeout: 5000 } })
   * @ctx { "type": "property", "name": "save", "value": "(document, options) => {", "string": "save"}
   * @method save
   * @param {object} document A document to save to the collection.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @return {Promise}
   */  

  /**
   * Returns statistics about the collection. The method includes the following parameters.
   *
   * @example
   * // Basic Stats Lookup
   * db.restaurants.stats()
   * 
   * // Stats Lookup With Scale
   * db.restaurants.stats( { scale : 1024 } )
   * 
   * // Statistics Lookup With Index Details
   * db.restaurant.stats( { indexDetails : true } )
   * 
   * // Statistics Lookup With Filtered Index Details
   * db.restaurants.stats({
   *   'indexDetails' : true,
   *   'indexDetailsKey' : {
   *     'borough' : 1,
   *     'cuisine' : 1
   *   }
   * })
   * @ctx { "type": "property", "name": "stats", "value": "(scale, options) => {", "string": "stats"}
   * @method stats
   * @param {number} [scale] The scale used in the output to display the sizes of items. By default, output displays sizes in bytes. To display kilobytes rather than bytes, specify a scale value of 1024.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {number} [options.scale] The scale used in the output to display the sizes of items. By default, output displays sizes in bytes. To display kilobytes rather than bytes, specify a scale value of 1024.
   * @param {boolean} [options.indexDetails] If true, db.collection.stats() returns index details in addition to the collection stats. 
   * @param {object} [options.indexDetailsKey] If indexDetails is true, you can use indexDetailsKey to filter index details by specifying the index key specification. Only the index that exactly matches indexDetailsKey will be returned.
   * @param {string} [options.indexDetailsName] If indexDetails is true, you can use indexDetailsName to filter index details by specifying the index name. Only the index name that exactly matches indexDetailsName will be returned. 
   * @return {Promise}
   */  

  /**
   * Modifies an existing document or documents in a collection. The method can modify specific fields of an existing document or documents or replace an existing document entirely, depending on the update parameter.
   *
   * @example
   * // Update Specific Fields
   * db.books.update(
   *   { _id: 1 }, {
   *     $inc: { stock: 5 },
   *     $set: {
   *       item: "ABC123",
   *       "info.publisher": "2222",
   *       tags: [ "software" ],
   *       "ratings.1": { by: "xyz", rating: 3 }
   *    }
   * })
   * 
   * // Remove Fields
   * db.books.update( { _id: 1 }, { $unset: { tags: 1 } } )
   * 
   * // Replace All Fields
   * db.books.update(
   *   { item: "XYZ123" }, {
   *     item: "XYZ123",
   *     stock: 10,
   *     info: { publisher: "2255", pages: 150 },
   *     tags: [ "baking", "cooking" ]
   *   })
   * 
   * // Insert a New Document if No Match Exists
   * db.books.update({ item: "ZZZ135" }, {
   *     item: "ZZZ135",
   *     stock: 5,
   *     tags: [ "database" ]
   * }, { upsert: true })
   * 
   * // Update Multiple Documents
   * db.books.update(
   *   { stock: { $lte: 10 } },
   *   { $set: { reorder: true } },
   *   { multi: true })
   * 
   * // Override Default Write Concern
   * db.books.update(
   *   { stock: { $lte: 10 } },
   *   { $set: { reorder: true } },
   *   {
   *     multi: true,
   *     writeConcern: { w: "majority", wtimeout: 5000 }
   * })
   * 
   * // Combine the upsert and multi Options
   * db.books.update(
   *   { item: "EFG222" },
   *   { $set: { reorder: false, tags: [ "literature", "translated" ] } },
   *   { upsert: true, multi: true })
   * @ctx { "type": "property", "name": "update", "value": "(filter, update, options) => {", "string": "update"}
   * @method update
   * @deprecated
   * @param {object} filter The selection criteria for the update. The same query selectors as in the find() method are available.
   * @param {object} update The modifications to apply.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {boolean} [options.upsert=false] MongoDB will add the _id field to the replacement document if it is not specified in either the filter or replacement documents. If _id is present in both, the values must be equal.
   * @param {boolean} [options.multi=false] If set to true, updates multiple documents that meet the query criteria. If set to false, updates one document. The default value is false. 
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @param {object} [options.collation] Specifies the collation to use for the operation.
   * @return {Promise}
   */

  /**
   * Validates a collection. The method scans a collection’s data structures for correctness and returns a single document that describes the relationship between the logical collection and the physical representation of the data.
   *
   * @example
   * @ctx { "type": "property", "validate": "stats", "value": "(full) => {", "string": "validate"}
   * @method validate
   * @param {boolean} [full] Specify true to enable a full validation and to return full statistics. MongoDB disables full validation by default because it is a potentially resource-intensive operation.
   * @return {Promise}
   */  
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
