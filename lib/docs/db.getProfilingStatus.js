module.exports = {
  "tags": [
    {
      "type": "returns",
      "string": "The current profile level and ~operationProfiling.slowOpThresholdMs setting.",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false,
      "description": "The current profile level and ~operationProfiling.slowOpThresholdMs setting."
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
  "line": 539,
  "codeStart": 542,
  "code": "getProfilingStatus() {\n  return this.runCommand({ profile: -1 })\n    .then(res => { delete res.ok; return res; })\n    .catch(res => { throw getErrorWithCode(res, `profile command failed: ${JSON.stringify(res)}`); });\n}",
  "ctx": {
    "type": "method",
    "name": "getProfilingStatus",
    "string": "getProfilingStatus()"
  }
}