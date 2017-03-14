module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Save a New Document without Specifying an _id Field\ndb.products.save( { item: \"book\", qty: 40 } )\n\n// Save a New Document Specifying an _id Field\ndb.products.save( { _id: 100, item: \"water\", qty: 30 } )\n\n// Replace an Existing Document\ndb.products.save( { _id : 100, item : \"juice\" } )\n\n// Override Default Write Concern\ndb.products.save(\n  { item: \"envelopes\", qty : 100, type: \"Clasp\" },\n  { writeConcern: { w: \"majority\", wtimeout: 5000 } })"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"save\", \"value\": \"(document, options) => {\", \"string\": \"save\"}"
    },
    {
      "type": "method",
      "string": "save"
    },
    {
      "type": "param",
      "string": "{object} document A document to save to the collection.",
      "name": "document",
      "description": "A document to save to the collection.",
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
    "full": "Updates an existing document or inserts a new document, depending on its document parameter.",
    "summary": "Updates an existing document or inserts a new document, depending on its document parameter.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1106,
  "codeStart": 1130,
  "ctx": {
    "type": "property",
    "name": "save",
    "value": "(document, options) => {",
    "string": "save"
  }
}