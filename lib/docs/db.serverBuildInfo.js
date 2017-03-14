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
    "full": "Provides a wrapper around the buildInfo  database command . buildInfo returns a document that contains an overview of parameters used to compile this mongod  instance.",
    "summary": "Provides a wrapper around the buildInfo  database command . buildInfo returns a document that contains an overview of parameters used to compile this mongod  instance.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1379,
  "codeStart": 1384,
  "code": "serverBuildInfo() {\n  return this.adminCommand('buildinfo');\n}",
  "ctx": {
    "type": "method",
    "name": "serverBuildInfo",
    "string": "serverBuildInfo()"
  }
}