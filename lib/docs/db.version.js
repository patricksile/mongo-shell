module.exports = {
  "tags": [
    {
      "type": "returns",
      "string": "The version of the mongod or mongos instance.",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false,
      "description": "The version of the mongod or mongos instance."
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
  "line": 1080,
  "codeStart": 1083,
  "code": "version() {\n  return this.serverBuildInfo().then(info => info.version);\n}\n}\n\nmodule.exports = Db;",
  "ctx": {
    "type": "method",
    "name": "version",
    "string": "version()"
  }
}