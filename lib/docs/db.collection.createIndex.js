module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Create an Ascending Index on a Single Field\ndb.collection.createIndex( { orderDate: 1 } )\n\n// Create an Index on a Multiple Fields\ndb.collection.createIndex( { orderDate: 1, zipcode: -1 } )\n\n// Create Indexes with Collation Specified\ndb.collection.createIndex(\n  { category: 1 },\n  { name: \"category_fr\", collation: { locale: \"fr\", strength: 2 } }\n)"
    },
    {
      "type": "method",
      "string": ""
    },
    {
      "type": "param",
      "string": "{object} keys A document that contains the field and value pairs where the field is the index key and the value describes the type of index for that field. For an ascending index on a field, specify a value of 1; for descending index, specify a value of -1.",
      "name": "keys",
      "description": "A document that contains the field and value pairs where the field is the index key and the value describes the type of index for that field. For an ascending index on a field, specify a value of 1; for descending index, specify a value of -1.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
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
      "string": "{boolean} [options.background=false] Builds the index in the background so that building an index does not block other database activities. Specify true to build in the background. The default value is false.",
      "name": "[options.background=false]",
      "description": "Builds the index in the background so that building an index does not block other database activities. Specify true to build in the background. The default value is false.",
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
      "string": "{boolean} [options.unique=false] Creates a unique index so that the collection will not accept insertion of documents where the index key or keys match an existing value in the index. Specify true to create a unique index. The default value is false.",
      "name": "[options.unique=false]",
      "description": "Creates a unique index so that the collection will not accept insertion of documents where the index key or keys match an existing value in the index. Specify true to create a unique index. The default value is false.",
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
      "string": "{string} [options.name] The name of the index. If unspecified, MongoDB generates an index name by concatenating the names of the indexed fields and the sort order.",
      "name": "[options.name]",
      "description": "The name of the index. If unspecified, MongoDB generates an index name by concatenating the names of the indexed fields and the sort order.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [options.partialFilterExpression] If specified, the index only references documents that match the filter expression. See Partial Indexes for more information.",
      "name": "[options.partialFilterExpression]",
      "description": "If specified, the index only references documents that match the filter expression. See Partial Indexes for more information.",
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
      "string": "{boolean} [options.sparse] If true, the index only references documents with the specified field. These indexes use less space but behave differently in some situations (particularly sorts). The default value is false. See Sparse Indexes for more information.",
      "name": "[options.sparse]",
      "description": "If true, the index only references documents with the specified field. These indexes use less space but behave differently in some situations (particularly sorts). The default value is false. See Sparse Indexes for more information.",
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
      "string": "{number} [options.expireAfterSeconds] Specifies a value, in seconds, as a TTL to control how long MongoDB retains documents in this collection. See Expire Data from Collections by Setting TTL for more information on this functionality. This applies only to TTL indexes.",
      "name": "[options.expireAfterSeconds]",
      "description": "Specifies a value, in seconds, as a TTL to control how long MongoDB retains documents in this collection. See Expire Data from Collections by Setting TTL for more information on this functionality. This applies only to TTL indexes.",
      "types": [
        "number"
      ],
      "typesDescription": "<code>number</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [options.storageEngine] Allows users to specify configuration to the storage engine on a per-index basis when creating an index. The value of the storageEngine option should take the following form: { <storage-engine-name>: <options> }.",
      "name": "[options.storageEngine]",
      "description": "Allows users to specify configuration to the storage engine on a per-index basis when creating an index. The value of the storageEngine option should take the following form: { <storage-engine-name>: <options> }.",
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
    "full": "Creates indexes on collections.",
    "summary": "Creates indexes on collections.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 342,
  "codeStart": 368,
  "code": "createIndex: (coll, args, result) => {\n  // ????: this needs to be fixed, the return from the node driver is _minimal_\n  return { ok: 1 };\n}",
  "ctx": {
    "type": "property",
    "name": "createIndex",
    "value": "(coll, args, result) => {",
    "string": "createIndex"
  }
}