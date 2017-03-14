module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Update Specific Fields\ndb.books.update(\n  { _id: 1 }, {\n    $inc: { stock: 5 },\n    $set: {\n      item: \"ABC123\",\n      \"info.publisher\": \"2222\",\n      tags: [ \"software\" ],\n      \"ratings.1\": { by: \"xyz\", rating: 3 }\n   }\n})\n\n// Remove Fields\ndb.books.update( { _id: 1 }, { $unset: { tags: 1 } } )\n\n// Replace All Fields\ndb.books.update(\n  { item: \"XYZ123\" }, {\n    item: \"XYZ123\",\n    stock: 10,\n    info: { publisher: \"2255\", pages: 150 },\n    tags: [ \"baking\", \"cooking\" ]\n  })\n\n// Insert a New Document if No Match Exists\ndb.books.update({ item: \"ZZZ135\" }, {\n    item: \"ZZZ135\",\n    stock: 5,\n    tags: [ \"database\" ]\n}, { upsert: true })\n\n// Update Multiple Documents\ndb.books.update(\n  { stock: { $lte: 10 } },\n  { $set: { reorder: true } },\n  { multi: true })\n\n// Override Default Write Concern\ndb.books.update(\n  { stock: { $lte: 10 } },\n  { $set: { reorder: true } },\n  {\n    multi: true,\n    writeConcern: { w: \"majority\", wtimeout: 5000 }\n})\n\n// Combine the upsert and multi Options\ndb.books.update(\n  { item: \"EFG222\" },\n  { $set: { reorder: false, tags: [ \"literature\", \"translated\" ] } },\n  { upsert: true, multi: true })"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"update\", \"value\": \"(filter, update, options) => {\", \"string\": \"update\"}"
    },
    {
      "type": "method",
      "string": "update"
    },
    {
      "type": "deprecated",
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
      "string": "{boolean} [options.multi=false] If set to true, updates multiple documents that meet the query criteria. If set to false, updates one document. The default value is false. ",
      "name": "[options.multi=false]",
      "description": "If set to true, updates multiple documents that meet the query criteria. If set to false, updates one document. The default value is false.",
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
    "full": "Modifies an existing document or documents in a collection. The method can modify specific fields of an existing document or documents or replace an existing document entirely, depending on the update parameter.",
    "summary": "Modifies an existing document or documents in a collection. The method can modify specific fields of an existing document or documents or replace an existing document entirely, depending on the update parameter.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1163,
  "codeStart": 1230,
  "ctx": {
    "type": "property",
    "name": "update",
    "value": "(filter, update, options) => {",
    "string": "update"
  }
}