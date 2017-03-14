module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Count all Documents in a Collection\ndb.orders.count()\n\n// Count all Documents that Match a Query\ndb.orders.count( { ord_dt: { $gt: new Date('01/01/2012') } } )"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"count\", \"value\": \"(query, options) => {\", \"string\": \"count\"}"
    },
    {
      "type": "method",
      "string": "count"
    },
    {
      "type": "param",
      "string": "{object} query The query selection criteria.",
      "name": "query",
      "description": "The query selection criteria.",
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
      "string": "{number} [options.limit] The maximum number of documents to count.",
      "name": "[options.limit]",
      "description": "The maximum number of documents to count.",
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
      "string": "{number} [options.skip] The number of documents to skip before counting.",
      "name": "[options.skip]",
      "description": "The number of documents to skip before counting.",
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
      "string": "{string|object} [options.hint] An index name hint or specification for the query.",
      "name": "[options.hint]",
      "description": "An index name hint or specification for the query.",
      "types": [
        "string",
        "object"
      ],
      "typesDescription": "<code>string</code>|<code>object</code>",
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
      "string": "{string} [options.readConcern] Specifies the read concern. The default level is \"local\".",
      "name": "[options.readConcern]",
      "description": "Specifies the read concern. The default level is \"local\".",
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
    "full": "Performs multiple write operations with controls for order of execution.",
    "summary": "Performs multiple write operations with controls for order of execution.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 504,
  "codeStart": 523,
  "ctx": {
    "type": "property",
    "name": "count",
    "value": "(query, options) => {",
    "string": "count"
  }
}