module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Delete A Document\ndb.scores.findOneAndDelete({ \"name\" : \"M. Tagnum\" })\n\n// Sort And Delete A Document\ndb.scores.findOneAndDelete(\n  { \"name\" : \"A. MacDyver\" },\n  { sort : { \"points\" : 1 } })\n\n// Projecting the Deleted Document\ndb.scores.findOneAndDelete(\n  { \"name\" : \"A. MacDyver\" },\n  { sort : { \"points\" : 1 }, projection: { \"assignment\" : 1 } })\n\n// Update Document with Time Limit\ndb.scores.findOneAndDelete(\n  { \"name\" : \"A. MacDyver\" },\n  { sort : { \"points\" : 1 }, maxTimeMS : 5 };\n);"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"findOneAndDelete\", \"value\": \"(filter, options) => {\", \"string\": \"findOneAndDelete\"}"
    },
    {
      "type": "method",
      "string": "findOneAndDelete"
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
      "string": "{object} [options.projection]  A subset of fields to return.",
      "name": "[options.projection]",
      "description": "A subset of fields to return.",
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
      "string": "{object} [options.sort] Specifies a sorting order for the documents matched by the filter.",
      "name": "[options.sort]",
      "description": "Specifies a sorting order for the documents matched by the filter.",
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
      "string": "{number} [options.maxTimeMS] The maximum amount of time to allow the query to run.",
      "name": "[options.maxTimeMS]",
      "description": "The maximum amount of time to allow the query to run.",
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
    "full": "Deletes a single document based on the filter and sort criteria, returning the deleted document.",
    "summary": "Deletes a single document based on the filter and sort criteria, returning the deleted document.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 785,
  "codeStart": 817,
  "ctx": {
    "type": "property",
    "name": "findOneAndDelete",
    "value": "(filter, options) => {",
    "string": "findOneAndDelete"
  }
}