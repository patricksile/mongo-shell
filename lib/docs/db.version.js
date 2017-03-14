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
    "full": "Returns the version of the mongod or mongos instance.",
    "summary": "Returns the version of the mongod or mongos instance.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1546,
  "codeStart": 1551,
  "code": "version() {\n  return this.serverBuildInfo().then(info => info.version);\n}\n}\n\n// aliases\nDb.prototype.getSisterDB = Db.prototype.getSiblingDB;\n\n\nmodule.exports = Db;",
  "ctx": {
    "type": "method",
    "name": "version",
    "string": "version()"
  }
}