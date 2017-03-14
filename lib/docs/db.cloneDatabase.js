module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// To clone a database named importdb on a host named hostname, issue the following\ndb.cloneDatabase(\"hostname\")"
    },
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
    "full": "Copies a remote database to the current database. The command assumes that the remote database has the same name as the current database.",
    "summary": "Copies a remote database to the current database. The command assumes that the remote database has the same name as the current database.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 152,
  "codeStart": 160,
  "code": "cloneDatabase(hostname) {\n  assert(isString(hostname) && hostname.length);\n  return this.runCommand({ clone: hostname });\n}",
  "ctx": {
    "type": "method",
    "name": "cloneDatabase",
    "string": "cloneDatabase()"
  }
}