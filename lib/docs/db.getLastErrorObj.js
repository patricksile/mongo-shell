module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following example issues a db.getLastErrorObj() operation that verifies that the preceding write operation, issued over the same connection, has propagated to at least two members of the replica set.\ndb.getLastErrorObj(2)"
    },
    {
      "type": "param",
      "string": "{int|string} [key] The write concern's ``w`` value.",
      "name": "[key]",
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
    "full": "The db.getLastErrorObj() can accept the following parameters:",
    "summary": "The db.getLastErrorObj() can accept the following parameters:",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 714,
  "codeStart": 723,
  "code": "getLastErrorObj(key, wtimeout) {\n  let cmd = { getlasterror: 1 };\n  if (key) {\n    cmd.w = key;\n    if (wtimeout) cmd.wtimeout = wtimeout;\n  }\n\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, `getlasterror failed: ${JSON.stringify(res)}`); });\n}",
  "ctx": {
    "type": "method",
    "name": "getLastErrorObj",
    "string": "getLastErrorObj()"
  }
}