module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Retrieve the server help string for the ismaster command\ndb.commandHelp(\"ismaster\")"
    },
    {
      "type": "param",
      "string": "{string} command The name of a :term:`database command`.",
      "name": "command",
      "description": "The name of a :term:`database command`.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": false,
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
    "full": "Displays help server text for the specified database command . See the /reference/command .",
    "summary": "Displays help server text for the specified database command . See the /reference/command .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 164,
  "codeStart": 172,
  "code": "commandHelp(command) {\n  let cmd = {};\n  cmd[command] = 1;\n  cmd.help = true;\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); });\n}",
  "ctx": {
    "type": "method",
    "name": "commandHelp",
    "string": "commandHelp()"
  }
}