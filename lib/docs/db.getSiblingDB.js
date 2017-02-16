module.exports = {
  "tags": [
    {
      "type": "returns",
      "string": "A database object.",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false,
      "description": "A database object."
    },
    {
      "type": "param",
      "string": "{string} database The name of a MongoDB database.",
      "name": "database",
      "description": "The name of a MongoDB database.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    }
  ],
  "description": {
    "full": "",
    "summary": "",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 642,
  "codeStart": 647,
  "code": "getSiblingDB(database) {\n  return Db.proxy(database, this.client);\n}",
  "ctx": {
    "type": "method",
    "name": "getSiblingDB",
    "string": "getSiblingDB()"
  }
}