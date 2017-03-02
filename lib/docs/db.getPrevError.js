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
    "full": "Returns a status document, containing the errors.",
    "summary": "Returns a status document, containing the errors.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 546,
  "codeStart": 551,
  "code": "getPrevError() {\n  return this.runCommand({ getpreverror: 1 });\n}",
  "ctx": {
    "type": "method",
    "name": "getPrevError",
    "string": "getPrevError()"
  }
}