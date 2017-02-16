module.exports = {
  "tags": [
    {
      "type": "returns",
      "string": "A status document, containing the errors.",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false,
      "description": "A status document, containing the errors."
    }
  ],
  "description": {
    "full": "",
    "summary": "",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 523,
  "codeStart": 526,
  "code": "getPrevError() {\n  return this.runCommand({ getpreverror: 1 });\n}",
  "ctx": {
    "type": "method",
    "name": "getPrevError",
    "string": "getPrevError()"
  }
}