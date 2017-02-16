module.exports = {
  "tags": [],
  "description": {
    "full": "Returns a document that provides an overview of the database process's state.",
    "summary": "Returns a document that provides an overview of the database process's state.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 981,
  "codeStart": 984,
  "code": "serverStatus(options) {\n  options = options || {};\n  return adminCommand(this, Object.assign({ serverStatus: 1 }, options));\n}",
  "ctx": {
    "type": "method",
    "name": "serverStatus",
    "string": "serverStatus()"
  }
}