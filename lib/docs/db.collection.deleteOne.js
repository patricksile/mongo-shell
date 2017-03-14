module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Delete a Single Document\ndb.orders.deleteOne( { \"_id\" : ObjectId(\"563237a41a4d68582c2509da\") } );\n\n// deleteOne() with Write Concern\ndb.orders.deleteOne(\n  { \"_id\" : ObjectId(\"563237a41a4d68582c2509da\") },\n  { w : \"majority\", wtimeout : 100 }\n);\n\n// Specify Collation\ndb.myColl.deleteOne(\n  { category: \"cafe\", status: \"A\" },\n  { collation: { locale: \"fr\", strength: 1 } }\n)"
    },
    {
      "type": "method",
      "string": ""
    },
    {
      "type": "param",
      "string": "{object} filter Specifies deletion criteria using query operators.",
      "name": "filter",
      "description": "Specifies deletion criteria using query operators.",
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
    "full": "Removes a single document from a collection.",
    "summary": "Removes a single document from a collection.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 108,
  "codeStart": 133,
  "code": "deleteOne: (coll, args, result) => {\n  return { deletedCount: result.deletedCount };\n},",
  "ctx": {
    "type": "property",
    "name": "deleteOne",
    "value": "(coll, args, result) => {",
    "string": "deleteOne"
  }
}