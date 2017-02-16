module.exports = {
  "tags": [
    {
      "type": "returns",
      "string": "A document with information about the underlying system that the mongod or mongos runs on. Some of the returned fields are only included on some platforms.",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false,
      "description": "A document with information about the underlying system that the mongod or mongos runs on. Some of the returned fields are only included on some platforms."
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
  "line": 744,
  "codeStart": 747,
  "code": "hostInfo() {\n  return adminCommand(this, 'hostInfo');\n}",
  "ctx": {
    "type": "method",
    "name": "hostInfo",
    "string": "hostInfo()"
  }
}