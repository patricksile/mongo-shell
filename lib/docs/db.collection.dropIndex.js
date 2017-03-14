module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Drop index using index name\ndb.pets.dropIndex( \"catIdx\" )\n\n// Drop index using index specification\ndb.pets.dropIndex( { \"cat\" : -1 } )"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"dropIndex\", \"value\": \"(index) => {\", \"string\": \"dropIndex\"}"
    },
    {
      "type": "method",
      "string": "dropIndex"
    },
    {
      "type": "param",
      "string": "{string|object} index Specifies the index to drop. You can specify the index either by the index name or by the index specification document.",
      "name": "index",
      "description": "Specifies the index to drop. You can specify the index either by the index name or by the index specification document.",
      "types": [
        "string",
        "object"
      ],
      "typesDescription": "<code>string</code>|<code>object</code>",
      "optional": false,
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
    "full": "Drops or removes the specified index from a collection. The db.collection.dropIndex() method provides a wrapper around the dropIndexes command.",
    "summary": "Drops or removes the specified index from a collection. The db.collection.dropIndex() method provides a wrapper around the dropIndexes command.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 560,
  "codeStart": 573,
  "ctx": {
    "type": "property",
    "name": "dropIndex",
    "value": "(index) => {",
    "string": "dropIndex"
  }
}