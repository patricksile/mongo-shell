module.exports = {
  "tags": [],
  "description": {
    "full": "Wraps the getCmdLineOpts  database command .",
    "summary": "Wraps the getCmdLineOpts  database command .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 974,
  "codeStart": 977,
  "code": "serverCmdLineOpts() {\n  return adminCommand(this, 'getCmdLineOpts');\n}",
  "ctx": {
    "type": "method",
    "name": "serverCmdLineOpts",
    "string": "serverCmdLineOpts()"
  }
}