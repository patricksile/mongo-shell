module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following returns the names of all collections in the records databas\nuse records\ndb.getCollectionNames()"
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
    "full": "Returns an array containing the names of all collections and views </core/views> in the current database.",
    "summary": "Returns an array containing the names of all collections and views </core/views> in the current database.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 686,
  "codeStart": 694,
  "code": "getCollectionNames() {\n  return this.state.client.db(this.name).listCollections().toArray()\n    .then(collections => collections.map(c => c.name));\n}",
  "ctx": {
    "type": "method",
    "name": "getCollectionNames",
    "string": "getCollectionNames()"
  }
}