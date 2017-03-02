module.exports = {
  "tags": [
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
  "line": 1054,
  "codeStart": 1059,
  "code": "serverStatus(options) {\n  options = options || {};\n  return this.adminCommand(Object.assign({ serverStatus: 1 }, options));\n}",
  "ctx": {
    "type": "method",
    "name": "serverStatus",
    "string": "serverStatus()"
  }
}