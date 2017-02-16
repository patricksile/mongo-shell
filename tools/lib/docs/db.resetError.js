module.exports = {
  "tags": [],
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
  "line": 885,
  "codeStart": 888,
  "code": "resetError() {\n  return this.runCommand({ reseterror: 1 });\n}",
  "ctx": {
    "type": "method",
    "name": "resetError",
    "string": "resetError()"
  }
}