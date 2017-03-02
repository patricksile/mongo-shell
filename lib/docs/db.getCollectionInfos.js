module.exports = {
  "tags": [
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
  "line": 480,
  "codeStart": 486,
  "code": "getCollectionInfos() {\n  return this.state.client.db(this.name).listCollections().toArray();\n}",
  "ctx": {
    "type": "method",
    "name": "getCollectionInfos",
    "string": "getCollectionInfos()"
  }
}