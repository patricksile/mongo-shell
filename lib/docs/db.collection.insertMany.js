module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Insert Several Document without Specifying an _id Field\ndb.products.insertMany( [\n  { item: \"card\", qty: 15 },\n  { item: \"envelope\", qty: 20 },\n  { item: \"stamps\" , qty: 30 }\n] );\n\n// Insert Several Document Specifying an _id Field\ndb.products.insertMany( [\n  { _id: 10, item: \"large box\", qty: 20 },\n  { _id: 11, item: \"small box\", qty: 55 },\n  { _id: 12, item: \"medium box\", qty: 30 }\n] );\n\n// The following attempts to insert multiple documents with _id field and ordered: false. The array of documents contains two documents with duplicate _id fields\ndb.products.insertMany( [\n  { _id: 10, item: \"large box\", qty: 20 },\n  { _id: 11, item: \"small box\", qty: 55 },\n  { _id: 11, item: \"medium box\", qty: 30 },\n  { _id: 12, item: \"envelope\", qty: 100},\n  { _id: 13, item: \"stamps\", qty: 125 },\n  { _id: 13, item: \"tape\", qty: 20},\n  { _id: 14, item: \"bubble wrap\", qty: 30}\n], { ordered: false } );\n\n// Given a three member replica set, the following operation specifies a w of majority and wtimeout of 100.\ndb.products.insertMany([\n     { _id: 10, item: \"large box\", qty: 20 },\n     { _id: 11, item: \"small box\", qty: 55 },\n     { _id: 12, item: \"medium box\", qty: 30 }\n  ],\n  { w: \"majority\", wtimeout: 100 }\n);"
    },
    {
      "type": "method",
      "string": ""
    },
    {
      "type": "param",
      "string": "{object} document A document to insert into the collection.",
      "name": "document",
      "description": "A document to insert into the collection.",
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
      "string": "{object} [options.ordered=true] A boolean specifying whether the mongod instance should perform an ordered or unordered insert. Defaults to true.",
      "name": "[options.ordered=true]",
      "description": "A boolean specifying whether the mongod instance should perform an ordered or unordered insert. Defaults to true.",
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
    "full": "Inserts multiple documents into a collection.",
    "summary": "Inserts multiple documents into a collection.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 60,
  "codeStart": 104,
  "code": "insertMany: (coll, args, result) => {\n  return { insertedIds: result.insertedIds.map(id => renderObjectId(id)) };\n},",
  "ctx": {
    "type": "property",
    "name": "insertMany",
    "value": "(coll, args, result) => {",
    "string": "insertMany"
  }
}