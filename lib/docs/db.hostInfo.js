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
    "full": "Returns a document with information about the underlying system that the mongod or mongos runs on. Some of the returned fields are only included on some platforms.",
    "summary": "Returns a document with information about the underlying system that the mongod or mongos runs on. Some of the returned fields are only included on some platforms.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 782,
  "codeStart": 787,
  "code": "hostInfo() {\n  return this.adminCommand('hostInfo');\n}",
  "ctx": {
    "type": "method",
    "name": "hostInfo",
    "string": "hostInfo()"
  }
}