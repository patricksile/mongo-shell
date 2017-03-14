module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Remove All Documents from a Collection\ndb.bios.remove( { } )\n\n// Remove All Documents that Match a Condition\ndb.products.remove( { qty: { $gt: 20 } } )\n\n// Override Default Write Concern\ndb.products.remove(\n  { qty: { $gt: 20 } },\n  { writeConcern: { w: \"majority\", wtimeout: 5000 } })\n\n// Remove a Single Document that Matches a Condition\ndb.products.remove( { qty: { $gt: 20 } }, { justOne: true } )\n\n// Isolate Remove Operations\ndb.products.remove( { qty: { $gt: 20 }, $isolated: 1 } )"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"remove\", \"value\": \"(query, options) => {\", \"string\": \"remove\"}"
    },
    {
      "type": "method",
      "string": "remove"
    },
    {
      "type": "deprecated",
      "string": ""
    },
    {
      "type": "param",
      "string": "{object} query Specifies deletion criteria using query operators. To delete all documents in a collection, pass an empty document ({}).",
      "name": "query",
      "description": "Specifies deletion criteria using query operators. To delete all documents in a collection, pass an empty document ({}).",
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
      "string": "{boolean} [options.justOne] To limit the deletion to just one document, set to true. Omit to use the default value of false and delete all documents matching the deletion criteria.",
      "name": "[options.justOne]",
      "description": "To limit the deletion to just one document, set to true. Omit to use the default value of false and delete all documents matching the deletion criteria.",
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
    "full": "Removes documents from a collection.",
    "summary": "Removes documents from a collection.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1075,
  "codeStart": 1105,
  "ctx": {
    "type": "property",
    "name": "remove",
    "value": "(query, options) => {",
    "string": "remove"
  }
}