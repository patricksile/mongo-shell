module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Insert a Document without Specifying an _id Field\ndb.products.insert( { item: \"card\", qty: 15 } )\n\n// Insert a Document Specifying an _id Field\ndb.products.insert( { _id: 10, item: \"box\", qty: 20 } )\n\n// Insert Multiple Documents\ndb.products.insert([\n  { _id: 11, item: \"pencil\", qty: 50, type: \"no.2\" },\n  { item: \"pen\", qty: 20 },\n  { item: \"eraser\", qty: 25 }\n])\n\n// Perform an Unordered Insert\ndb.products.insert([\n  { _id: 20, item: \"lamp\", qty: 50, type: \"desk\" },\n  { _id: 21, item: \"lamp\", qty: 20, type: \"floor\" },\n  { _id: 22, item: \"bulk\", qty: 100 }\n], { ordered: false })\n\n// Override Default Write Concern\ndb.products.insert(\n  { item: \"envelopes\", qty : 100, type: \"Clasp\" },\n  { writeConcern: { w: \"majority\", wtimeout: 5000 } }\n)"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"insert\", \"value\": \"(document, options) => {\", \"string\": \"insert\"}"
    },
    {
      "type": "method",
      "string": "insert"
    },
    {
      "type": "deprecated",
      "string": ""
    },
    {
      "type": "param",
      "string": "{object|array} document A document or array of documents to insert into the collection.",
      "name": "document",
      "description": "A document or array of documents to insert into the collection.",
      "types": [
        "object",
        "array"
      ],
      "typesDescription": "<code>object</code>|<code>array</code>",
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
    "full": "Inserts a document or documents into a collection.",
    "summary": "Inserts a document or documents into a collection.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 997,
  "codeStart": 1035,
  "ctx": {
    "type": "property",
    "name": "insert",
    "value": "(document, options) => {",
    "string": "insert"
  }
}