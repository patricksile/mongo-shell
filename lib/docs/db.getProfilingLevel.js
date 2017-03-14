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
    "full": "This method provides a wrapper around the database command \" profile \" and returns the current profiling level.",
    "summary": "This method provides a wrapper around the database command \" profile \" and returns the current profiling level.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 765,
  "codeStart": 770,
  "code": "getProfilingLevel() {\n  return this.runCommand({ profile: -1 })\n    .then(res => res.was)\n    .catch(res => null);\n}",
  "ctx": {
    "type": "method",
    "name": "getProfilingLevel",
    "string": "getProfilingLevel()"
  }
}