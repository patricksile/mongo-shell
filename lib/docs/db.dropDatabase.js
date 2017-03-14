module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following example in the mongo shell uses the use <database> operation to switch the current database to the temp database and then uses the db.dropDatabase() method to drops the temp database\nuse temp\ndb.dropDatabase()"
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
    "full": "Removes the current database, deleting the associated data files.",
    "summary": "Removes the current database, deleting the associated data files.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 530,
  "codeStart": 538,
  "code": "dropDatabase() {\n  if (arguments.length) {\n    throw Error(\"dropDatabase doesn't take arguments\");\n  }\n\n  return this.runCommand({ dropDatabase: 1 });\n}",
  "ctx": {
    "type": "method",
    "name": "dropDatabase",
    "string": "dropDatabase()"
  }
}