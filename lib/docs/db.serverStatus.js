module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// For example, the following operation suppresses the repl, metrics and locks information in the output.\ndb.serverStatus( { repl: 0,  metrics: 0, locks: 0 } )\n\n// The following example includes rangeDeleter and all repl information in the output.\ndb.serverStatus( { rangeDeleter: 1, repl: 1 } )"
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
    "full": "Returns a document that provides an overview of the database process's state.",
    "summary": "Returns a document that provides an overview of the database process's state.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1377,
  "codeStart": 1387,
  "code": "serverStatus(options) {\n  options = options || {};\n  return this.adminCommand(Object.assign({ serverStatus: 1 }, options));\n}",
  "ctx": {
    "type": "method",
    "name": "serverStatus",
    "string": "serverStatus()"
  }
}