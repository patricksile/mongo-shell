module.exports = {
  "tags": [],
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
  "line": 355,
  "codeStart": 358,
  "code": "dropDatabase() {\n  if (arguments.length) {\n    throw Error(\"dropDatabase doesn't take arguments\");\n  }\n\n  return this.runCommand({ dropDatabase: 1 });\n}",
  "ctx": {
    "type": "method",
    "name": "dropDatabase",
    "string": "dropDatabase()"
  }
}