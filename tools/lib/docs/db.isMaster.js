module.exports = {
  "tags": [
    {
      "type": "returns",
      "string": "A document that describes the role of the mongod instance.",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false,
      "description": "A document that describes the role of the mongod instance."
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
  "line": 751,
  "codeStart": 754,
  "code": "isMaster() {\n  return this.runCommand('isMaster');\n}",
  "ctx": {
    "type": "method",
    "name": "isMaster",
    "string": "isMaster()"
  }
}