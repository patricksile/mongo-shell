module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Insert a Document without Specifying an _id Field\ndb.products.insertOne( { item: \"card\", qty: 15 } );\n\n// Insert a Document Specifying an _id Field\ndb.products.insertOne( { _id: 10, item: \"box\", qty: 20 } );\n\n// Given a three member replica set, the following operation specifies a w of majority, wtimeout of 100\ndb.products.insertOne(\n  { \"item\": \"envelopes\", \"qty\": 100, type: \"Self-Sealing\" },\n  { writeConcern: { w : \"majority\", wtimeout : 100 } }\n);"
    },
    {
      "type": "method",
      "string": ""
    },
    {
      "type": "param",
      "string": "{array} documents An array of documents to insert into the collection.",
      "name": "documents",
      "description": "An array of documents to insert into the collection.",
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
    "full": "Inserts a document into a collection.",
    "summary": "Inserts a document into a collection.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 35,
  "codeStart": 56,
  "code": "insertOne: (coll, args, result) => {\n  return { insertedId: renderObjectId(result.insertedId) };\n},",
  "ctx": {
    "type": "property",
    "name": "insertOne",
    "value": "(coll, args, result) => {",
    "string": "insertOne"
  }
}