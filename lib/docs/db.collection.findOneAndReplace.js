module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Replace A Document\ndb.scores.findOneAndReplace(\n  { \"score\" : { $lt : 20000 } },\n  { \"team\" : \"Observant Badgers\", \"score\" : 20000 }\n)\n\n// Sort and Replace A Document\ndb.scores.findOneAndReplace(\n  { \"score\" : { $lt : 20000 } },\n  { \"team\" : \"Observant Badgers\", \"score\" : 20000 },\n  { sort: { \"score\" : 1 } }\n)\n\n// Project the Returned Document\ndb.scores.findOneAndReplace(\n  { \"score\" : { $lt : 22250 } },\n  { \"team\" : \"Therapeutic Hamsters\", \"score\" : 22250 },\n  { sort : { \"score\" : 1 }, project: { \"_id\" : 0, \"team\" : 1 } }\n)\n\n// Replace Document with Time Limit\ndb.scores.findOneAndReplace(\n  { \"score\" : { $gt : 25000 } },\n  { \"team\" : \"Emphatic Rhinos\", \"score\" : 25010 },\n  { maxTimeMS: 5 }\n);\n\n// Replace Document with Upsert\ndb.scores.findOneAndReplace(\n  { \"team\" : \"Fortified Lobsters\" },\n  { \"_id\" : 6019, \"team\" : \"Fortified Lobsters\" , \"score\" : 32000},\n  { upsert : true, returnNewDocument: true }\n);\n\n// Specify Collation\ndb.myColl.findOneAndReplace(\n  { category: \"cafe\", status: \"a\" },\n  { category: \"cafÉ\", status: \"Replaced\" },\n  { collation: { locale: \"fr\", strength: 1 } }\n);"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"findOneAndReplace\", \"value\": \"(filter, replacement, options) => {\", \"string\": \"findOneAndReplace\"}"
    },
    {
      "type": "method",
      "string": "findOneAndReplace"
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
      "string": "{object} replacement The replacement document.",
      "name": "replacement",
      "description": "The replacement document.",
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
      "string": "{boolean} [options.returnNewDocument=false] When true, returns the replacement document instead of the original document.",
      "name": "[options.returnNewDocument=false]",
      "description": "When true, returns the replacement document instead of the original document.",
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
  "line": 818,
  "codeStart": 875,
  "ctx": {
    "type": "property",
    "name": "findOneAndReplace",
    "value": "(filter, replacement, options) => {",
    "string": "findOneAndReplace"
  }
}