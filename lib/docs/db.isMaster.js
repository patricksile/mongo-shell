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
    "full": "Returns a document that describes the role of the mongod instance.",
    "summary": "Returns a document that describes the role of the mongod instance.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1050,
  "codeStart": 1055,
  "code": "isMaster() {\n  return this.runCommand('isMaster');\n}",
  "ctx": {
    "type": "method",
    "name": "isMaster",
    "string": "isMaster()"
  }
}