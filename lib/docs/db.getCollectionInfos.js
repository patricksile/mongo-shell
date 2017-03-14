module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following returns information for all collections in the example database\nuse example\ndb.getCollectionInfos()\n\n// To request collection information for a specific collection, specify the collection name when calling the method, as in the following\nuse example\ndb.getCollectionInfos( { name: \"restaurants\" } )"
    },
    {
      "type": "param",
      "string": "{object} [filter]  An optional filter specified to match only collections with certain metadata.",
      "name": "[filter]",
      "description": "An optional filter specified to match only collections with certain metadata.",
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
    "full": "Returns an array of documents with collection or view </core/views> information, such as name and options, for the current database.",
    "summary": "Returns an array of documents with collection or view </core/views> information, such as name and options, for the current database.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 669,
  "codeStart": 682,
  "code": "getCollectionInfos() {\n  return this.state.client.db(this.name).listCollections().toArray();\n}",
  "ctx": {
    "type": "method",
    "name": "getCollectionInfos",
    "string": "getCollectionInfos()"
  }
}