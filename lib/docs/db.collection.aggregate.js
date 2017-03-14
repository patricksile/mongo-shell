module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Group by and Calculate a Sum\ndb.orders.aggregate([\n  { $match: { status: \"A\" } },\n  { $group: { _id: \"$cust_id\", total: { $sum: \"$amount\" } } },\n  { $sort: { total: -1 } }\n])\n\n// Return Information on Aggregation Pipeline Operation\ndb.orders.aggregate([\n  { $match: { status: \"A\" } },\n  { $group: { _id: \"$cust_id\", total: { $sum: \"$amount\" } } },\n  { $sort: { total: -1 } }], {\n    explain: true\n })\n\n// Perform Large Sort Operation with External Sor\nvar results = db.stocks.aggregate([\n  { $project : { cusip: 1, date: 1, price: 1, _id: 0 } },\n  { $sort : { cusip : 1, date: 1 } }\n], {\n  allowDiskUse: true\n})\n\n// Specify an Initial Batch Size\ndb.orders.aggregate([\n  { $match: { status: \"A\" } },\n  { $group: { _id: \"$cust_id\", total: { $sum: \"$amount\" } } },\n  { $sort: { total: -1 } },\n  { $limit: 2 }\n], {\n  cursor: { batchSize: 0 }\n})\n\n// Specify a Collation\ndb.myColl.aggregate(\n  [ { $match: { status: \"A\" } }, { $group: { _id: \"$category\", count: { $sum: 1 } } } ],\n  { collation: { locale: \"fr\", strength: 1 } }\n);\n\n// Override readConcern\ndb.restaurants.aggregate(\n [ { $match: { rating: { $lt: 5 } } } ],\n { readConcern: { level: \"majority\" } })"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"aggregate\", \"value\": \"(pipeline, options) => {\", \"string\": \"aggregate\"}"
    },
    {
      "type": "method",
      "string": "aggregate"
    },
    {
      "type": "param",
      "string": "{array} pipeline A sequence of data aggregation operations or stages. See the aggregation pipeline operators for details.",
      "name": "pipeline",
      "description": "A sequence of data aggregation operations or stages. See the aggregation pipeline operators for details.",
      "types": [
        "array"
      ],
      "typesDescription": "<code>array</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [options] Additional options to pad to the command executor.",
      "name": "[options]",
      "description": "Additional options to pad to the command executor.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{boolean} [options.explain] Specifies to return the information on the processing of the pipeline. See Return Information on Aggregation Pipeline Operation for an example.",
      "name": "[options.explain]",
      "description": "Specifies to return the information on the processing of the pipeline. See Return Information on Aggregation Pipeline Operation for an example.",
      "types": [
        "boolean"
      ],
      "typesDescription": "<code>boolean</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{boolean} [options.allowDiskUse] Enables writing to temporary files. When set to true, aggregation operations can write data to the _tmp subdirectory in the dbPath directory. See Perform Large Sort Operation with External Sort for an example.",
      "name": "[options.allowDiskUse]",
      "description": "Enables writing to temporary files. When set to true, aggregation operations can write data to the _tmp subdirectory in the dbPath directory. See Perform Large Sort Operation with External Sort for an example.",
      "types": [
        "boolean"
      ],
      "typesDescription": "<code>boolean</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [options.cursor] Specifies the initial batch size for the cursor. The value of the cursor field is a document with the field batchSize. See Specify an Initial Batch Size for syntax and example.",
      "name": "[options.cursor]",
      "description": "Specifies the initial batch size for the cursor. The value of the cursor field is a document with the field batchSize. See Specify an Initial Batch Size for syntax and example.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{boolean} [options.bypassDocumentValidation] Available only if you specify the $out aggregation operator.",
      "name": "[options.bypassDocumentValidation]",
      "description": "Available only if you specify the $out aggregation operator.",
      "types": [
        "boolean"
      ],
      "typesDescription": "<code>boolean</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [options.readConcern] Specifies the read concern. The option has the following syntax:readConcern: { level: <value> }.",
      "name": "[options.readConcern]",
      "description": "Specifies the read concern. The option has the following syntax:readConcern: { level: <value> }.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [options.collation] Specifies the collation to use for the operation.",
      "name": "[options.collation]",
      "description": "Specifies the collation to use for the operation.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "return",
      "string": "{Promise}",
      "types": [
        "Promise"
      ],
      "typesDescription": "<a href=\"Promise.html\">Promise</a>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false,
      "description": ""
    }
  ],
  "description": {
    "full": "Calculates aggregate values for the data in a collection.",
    "summary": "Calculates aggregate values for the data in a collection.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 373,
  "codeStart": 431,
  "ctx": {
    "type": "property",
    "name": "aggregate",
    "value": "(pipeline, options) => {",
    "string": "aggregate"
  }
}