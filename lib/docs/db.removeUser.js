module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{string} username The database username.",
      "name": "username",
      "description": "The database username.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [writeConcern]",
      "name": "[writeConcern]",
      "description": "",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    }
  ],
  "description": {
    "full": "Removes the specified username from the database.",
    "summary": "Removes the specified username from the database.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 867,
  "codeStart": 873,
  "code": "removeUser(username, writeConcern) {\n  console.log('WARNING: db.removeUser has been deprecated, please use db.dropUser instead');\n  return this.dropUser(username, writeConcern);\n}",
  "ctx": {
    "type": "method",
    "name": "removeUser",
    "string": "removeUser()"
  }
}