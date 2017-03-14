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
      "type": "example",
      "string": "// You can use db.getSiblingDB() as an alternative to the use <database> helper. This is particularly useful when writing scripts using the mongo shell where the use helper is not available. Consider the following sequence of operation\ndb = db.getSiblingDB('users')\ndb.active.count()"
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
  "line": 891,
  "codeStart": 899,
  "code": "getSiblingDB(database) {\n  return Db.proxy(database, this.state);\n}",
  "ctx": {
    "type": "method",
    "name": "getSiblingDB",
    "string": "getSiblingDB()"
  }
}