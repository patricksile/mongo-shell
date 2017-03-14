module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Drop all indexes on the collection pets\ndb.pets.dropIndexes()"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"dropIndexes\", \"value\": \"() => {\", \"string\": \"dropIndexes\"}"
    },
    {
      "type": "method",
      "string": "dropIndexes"
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
  "line": 563,
  "codeStart": 572,
  "ctx": {
    "type": "property",
    "name": "dropIndexes",
    "value": "() => {",
    "string": "dropIndexes"
  }
}