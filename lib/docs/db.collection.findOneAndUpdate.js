module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Update A Document\ndb.scores.findOneAndUpdate(\n  { \"name\" : \"R. Stiles\" },\n  { $inc: { \"points\" : 5 } }\n)\n\n// Sort And Update A Document\ndb.scores.findOneAndUpdate(\n  { \"name\" : \"A. MacDyver\" },\n  { $inc : { \"points\" : 5 } },\n  { sort : { \"points\" : 1 } }\n)\n\n// Project the Returned Document\ndb.scores.findOneAndUpdate(\n  { \"name\" : \"A. MacDyver\" },\n  { $inc : { \"points\" : 5 } },\n  { sort : { \"points\" : 1 }, projection: { \"assignment\" : 1, \"points\" : 1 } }\n)\n\n// Update Document with Time Limit\ndb.scores.findOneAndUpdate(\n  { \"name\" : \"A. MacDyver\" },\n  { $inc : { \"points\" : 5 } },\n  { sort: { \"points\" : 1 }, maxTimeMS : 5 };\n);\n\n// Update Document with Upsert\ndb.scores.findOneAndUpdate(\n  { \"name\" : \"A.B. Abracus\" },\n  { $set: { \"name\" : \"A.B. Abracus\", \"assignment\" : 5}, $inc : { \"points\" : 5 } },\n  { sort: { \"points\" : 1 }, upsert:true, returnNewDocument : true }\n);\n\n// Specify Collation\ndb.myColl.findOneAndUpdate(\n  { category: \"cafe\" },\n  { $set: { status: \"Updated\" } },\n  { collation: { locale: \"fr\", strength: 1 } }\n);"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"findOneAndUpdate\", \"value\": \"(filter, update, options) => {\", \"string\": \"findOneAndUpdate\"}"
    },
    {
      "type": "method",
      "string": "findOneAndUpdate"
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
      "string": "{object} update The update document.",
      "name": "update",
      "description": "The update document.",
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
    "full": "Updates a single document based on the filter and sort criteria.",
    "summary": "Updates a single document based on the filter and sort criteria.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 876,
  "codeStart": 933,
  "ctx": {
    "type": "property",
    "name": "findOneAndUpdate",
    "value": "(filter, update, options) => {",
    "string": "findOneAndUpdate"
  }
}