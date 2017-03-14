module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "Please see https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"mapReduce\", \"value\": \"(map, reduce, options) => {\", \"string\": \"mapReduce\"}"
    },
    {
      "type": "method",
      "string": "mapReduce"
    },
    {
      "type": "param",
      "string": "{function} map A JavaScript function that associates or “maps” a value with a key and emits the key and value pair.",
      "name": "map",
      "description": "A JavaScript function that associates or “maps” a value with a key and emits the key and value pair.",
      "types": [
        "function"
      ],
      "typesDescription": "<code>function</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{function} reduce A JavaScript function that “reduces” to a single object all the values associated with a particular key.",
      "name": "reduce",
      "description": "A JavaScript function that “reduces” to a single object all the values associated with a particular key.",
      "types": [
        "function"
      ],
      "typesDescription": "<code>function</code>",
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
      "string": "{string|object} [options.out] Specifies the location of the result of the map-reduce operation. You can output to a collection, output to a collection with an action, or output inline. You may output to a collection when performing map reduce operations on the primary members of the set; on secondary members you may only use the inline output.",
      "name": "[options.out]",
      "description": "Specifies the location of the result of the map-reduce operation. You can output to a collection, output to a collection with an action, or output inline. You may output to a collection when performing map reduce operations on the primary members of the set; on secondary members you may only use the inline output.",
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
      "string": "{object} [options.query] Specifies the selection criteria using query operators for determining the documents input to the map function. ",
      "name": "[options.query]",
      "description": "Specifies the selection criteria using query operators for determining the documents input to the map function.",
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
      "string": "{object} [options.sort] Sorts the input documents. This option is useful for optimization. For example, specify the sort key to be the same as the emit key so that there are fewer reduce operations. The sort key must be in an existing index for this collection.",
      "name": "[options.sort]",
      "description": "Sorts the input documents. This option is useful for optimization. For example, specify the sort key to be the same as the emit key so that there are fewer reduce operations. The sort key must be in an existing index for this collection.",
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
      "string": "{number} [options.limit] Specifies a maximum number of documents for the input into the map function. ",
      "name": "[options.limit]",
      "description": "Specifies a maximum number of documents for the input into the map function.",
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
      "string": "{function} [options.finalize] Follows the reduce method and modifies the output.",
      "name": "[options.finalize]",
      "description": "Follows the reduce method and modifies the output.",
      "types": [
        "function"
      ],
      "typesDescription": "<code>function</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [options.scope] Specifies global variables that are accessible in the map, reduce and finalize functions.",
      "name": "[options.scope]",
      "description": "Specifies global variables that are accessible in the map, reduce and finalize functions.",
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
      "string": "{boolean} [options.jsMode] Specifies whether to convert intermediate data into BSON format between the execution of the map and reduce functions. Defaults to false. ",
      "name": "[options.jsMode]",
      "description": "Specifies whether to convert intermediate data into BSON format between the execution of the map and reduce functions. Defaults to false.",
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
      "string": "{boolean} [options.verbose] Specifies whether to include the timing information in the result information. The verbose defaults to true to include the timing information. ",
      "name": "[options.verbose]",
      "description": "Specifies whether to include the timing information in the result information. The verbose defaults to true to include the timing information.",
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
      "string": "{object} [options.collation] Specifies the collation to use for the operation. ",
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
    "full": "The db.collection.mapReduce() method provides a wrapper around the mapReduce command.",
    "summary": "The db.collection.mapReduce() method provides a wrapper around the mapReduce command.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1045,
  "codeStart": 1066,
  "ctx": {
    "type": "property",
    "name": "mapReduce",
    "value": "(map, reduce, options) => {",
    "string": "mapReduce"
  }
}