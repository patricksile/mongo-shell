module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Update Multiple Documents\ndb.restaurant.updateMany(\n  { violations: { $gt: 4 } },\n  { $set: { \"Review\" : true } }\n);\n\n// Update Multiple Documents with Upsert\ndb.inspectors.updateMany(\n  { \"Sector\" : { $gt : 4 }, \"inspector\" : \"R. Coltrane\" },\n  { $set: { \"Patrolling\" : false } },\n  { upsert: true }\n);\n\n// Update with Write Concern\ndb.restaurant.updateMany(\n  { \"name\" : \"Pizza Rat's Pizzaria\" },\n  { $inc: { \"violations\" : 3}, $set: { \"Closed\" : true } },\n  { w: \"majority\", wtimeout: 100 }\n);\n\n// Specify Collation\ndb.myColl.updateMany(\n  { category: \"cafe\" },\n  { $set: { status: \"Updated\" } },\n  { collation: { locale: \"fr\", strength: 1 } }\n);"
    },
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
    "full": "Updates multiple documents within the collection based on the filter.",
    "summary": "Updates multiple documents within the collection based on the filter.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 264,
  "codeStart": 303,
  "code": "updateMany: (coll, args, result) => {\n  let r = {\n    matchedCount: result.matchedCount,\n    modifiedCount: typeof result.modifiedCount !== 'undefined' ? result.modifiedCount : result.n\n  };\n\n  if (result.upsertedId) r.upsertedId = renderObjectId(result.upsertedId);\n  return r;\n},",
  "ctx": {
    "type": "property",
    "name": "updateMany",
    "value": "(coll, args, result) => {",
    "string": "updateMany"
  }
}