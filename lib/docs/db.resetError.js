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
    "full": "Resets the error message returned by db.getPrevError or getPrevError . Provides a wrapper around the resetError command.",
    "summary": "Resets the error message returned by db.getPrevError or getPrevError . Provides a wrapper around the resetError command.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1202,
  "codeStart": 1207,
  "code": "resetError() {\n  return this.runCommand({ reseterror: 1 });\n}",
  "ctx": {
    "type": "method",
    "name": "resetError",
    "string": "resetError()"
  }
}