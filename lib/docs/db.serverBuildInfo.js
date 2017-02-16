module.exports = {
  "tags": [],
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
  "line": 967,
  "codeStart": 970,
  "code": "serverBuildInfo() {\n  return adminCommand(this, 'buildinfo');\n}",
  "ctx": {
    "type": "method",
    "name": "serverBuildInfo",
    "string": "serverBuildInfo()"
  }
}