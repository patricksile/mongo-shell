module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Basic Stats Lookup\ndb.restaurants.stats()\n\n// Stats Lookup With Scale\ndb.restaurants.stats( { scale : 1024 } )\n\n// Statistics Lookup With Index Details\ndb.restaurant.stats( { indexDetails : true } )\n\n// Statistics Lookup With Filtered Index Details\ndb.restaurants.stats({\n  'indexDetails' : true,\n  'indexDetailsKey' : {\n    'borough' : 1,\n    'cuisine' : 1\n  }\n})"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"stats\", \"value\": \"(scale, options) => {\", \"string\": \"stats\"}"
    },
    {
      "type": "method",
      "string": "stats"
    },
    {
      "type": "param",
      "string": "{number} [scale] The scale used in the output to display the sizes of items. By default, output displays sizes in bytes. To display kilobytes rather than bytes, specify a scale value of 1024.",
      "name": "[scale]",
      "description": "The scale used in the output to display the sizes of items. By default, output displays sizes in bytes. To display kilobytes rather than bytes, specify a scale value of 1024.",
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
      "string": "{number} [options.scale] The scale used in the output to display the sizes of items. By default, output displays sizes in bytes. To display kilobytes rather than bytes, specify a scale value of 1024.",
      "name": "[options.scale]",
      "description": "The scale used in the output to display the sizes of items. By default, output displays sizes in bytes. To display kilobytes rather than bytes, specify a scale value of 1024.",
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
      "string": "{boolean} [options.indexDetails] If true, db.collection.stats() returns index details in addition to the collection stats. ",
      "name": "[options.indexDetails]",
      "description": "If true, db.collection.stats() returns index details in addition to the collection stats.",
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
      "string": "{object} [options.indexDetailsKey] If indexDetails is true, you can use indexDetailsKey to filter index details by specifying the index key specification. Only the index that exactly matches indexDetailsKey will be returned.",
      "name": "[options.indexDetailsKey]",
      "description": "If indexDetails is true, you can use indexDetailsKey to filter index details by specifying the index key specification. Only the index that exactly matches indexDetailsKey will be returned.",
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
      "string": "{string} [options.indexDetailsName] If indexDetails is true, you can use indexDetailsName to filter index details by specifying the index name. Only the index name that exactly matches indexDetailsName will be returned. ",
      "name": "[options.indexDetailsName]",
      "description": "If indexDetails is true, you can use indexDetailsName to filter index details by specifying the index name. Only the index name that exactly matches indexDetailsName will be returned.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
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
    "full": "Returns statistics about the collection. The method includes the following parameters.",
    "summary": "Returns statistics about the collection. The method includes the following parameters.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1131,
  "codeStart": 1162,
  "ctx": {
    "type": "property",
    "name": "stats",
    "value": "(scale, options) => {",
    "string": "stats"
  }
}