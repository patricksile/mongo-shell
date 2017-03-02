module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{int|string} [w] The write concern's ``w`` value.",
      "name": "[w]",
      "description": "The write concern's ``w`` value.",
      "types": [
        "int",
        "string"
      ],
      "typesDescription": "<a href=\"int.html\">int</a>|<code>string</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{int} [wtimeout] The time limit in milliseconds.",
      "name": "[wtimeout]",
      "description": "The time limit in milliseconds.",
      "types": [
        "int"
      ],
      "typesDescription": "<a href=\"int.html\">int</a>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
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
    "full": "The db.getLastError() can accept the following parameters:",
    "summary": "The db.getLastError() can accept the following parameters:",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 500,
  "codeStart": 507,
  "code": "getLastError(w, wtimeout) {\n  return this.getLastErrorObj(w, wtimeout)\n    .then(res => res.err)\n    .catch(res => { throw getErrorWithCode(res, `getlasterror failed: ${JSON.stringify(res)}`); });\n}",
  "ctx": {
    "type": "method",
    "name": "getLastError",
    "string": "getLastError()"
  }
}