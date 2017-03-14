module.exports = {
  "tags": [
    {
      "type": "method",
      "string": ""
    },
    {
      "type": "param",
      "string": "{object} filter The selection criteria for the update. The same query selectors as in the find() method are available.",
      "name": "filter",
      "description": "The selection criteria for the update. The same query selectors as in the find() method are available.",
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
      "string": "{object} update The modifications to apply.",
      "name": "update",
      "description": "The modifications to apply.",
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
      "string": "{boolean} [options.upsert=false] MongoDB will add the _id field to the replacement document if it is not specified in either the filter or replacement documents. If _id is present in both, the values must be equal.",
      "name": "[options.upsert=false]",
      "description": "MongoDB will add the _id field to the replacement document if it is not specified in either the filter or replacement documents. If _id is present in both, the values must be equal.",
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
      "string": "{object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
      "name": "[options.writeConcern]",
      "description": "The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
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
    "full": "Creates an index on the specified field if the index does not already exist. \nDeprecated since version 3.0.0: db.collection.ensureIndex() is now an alias for db.collection.createIndex().",
    "summary": "Creates an index on the specified field if the index does not already exist. \nDeprecated since version 3.0.0: db.collection.ensureIndex() is now an alias for db.collection.createIndex().",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 313,
  "codeStart": 326,
  "code": "ensureIndex: (coll, args, result) => {\n  // ????: this needs to be fixed, the return from the node driver is _minimal_\n  return { ok: 1 };\n},",
  "ctx": {
    "type": "property",
    "name": "ensureIndex",
    "value": "(coll, args, result) => {",
    "string": "ensureIndex"
  }
}