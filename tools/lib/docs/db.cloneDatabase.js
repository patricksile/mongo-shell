module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{string} hostname The hostname of the database to copy.",
      "name": "hostname",
      "description": "The hostname of the database to copy.",
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
    "full": "Copies a remote database to the current database. The command assumes that the remote database has the same name as the current database.",
    "summary": "Copies a remote database to the current database. The command assumes that the remote database has the same name as the current database.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 137,
  "codeStart": 142,
  "code": "cloneDatabase(hostname) {\n  assert(isString(hostname) && hostname.length);\n  return this.runCommand({ clone: hostname });\n}",
  "ctx": {
    "type": "method",
    "name": "cloneDatabase",
    "string": "cloneDatabase()"
  }
}