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
    "full": "Returns the current profile level and ~operationProfiling.slowOpThresholdMs setting.",
    "summary": "Returns the current profile level and ~operationProfiling.slowOpThresholdMs setting.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 769,
  "codeStart": 774,
  "code": "getProfilingStatus() {\n  return this.runCommand({ profile: -1 })\n    .then(res => { delete res.ok; return res; })\n    .catch(res => { throw getErrorWithCode(res, `profile command failed: ${JSON.stringify(res)}`); });\n}",
  "ctx": {
    "type": "method",
    "name": "getProfilingStatus",
    "string": "getProfilingStatus()"
  }
}