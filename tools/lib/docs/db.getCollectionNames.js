module.exports = {
  "tags": [],
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
  "line": 471,
  "codeStart": 474,
  "code": "getCollectionNames() {\n  return this.client.db(this.name).listCollections().toArray()\n    .then(collections => collections.map(c => c.name));\n}",
  "ctx": {
    "type": "method",
    "name": "getCollectionNames",
    "string": "getCollectionNames()"
  }
}