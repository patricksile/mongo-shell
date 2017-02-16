module.exports = {
  "tags": [
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
    }
  ],
  "description": {
    "full": "Displays help text for the specified database command . See the /reference/command .",
    "summary": "Displays help text for the specified database command . See the /reference/command .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 147,
  "codeStart": 152,
  "code": "commandHelp(command) {\n  let cmd = { help: true };\n  cmd[command] = 1;\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); });\n}",
  "ctx": {
    "type": "method",
    "name": "commandHelp",
    "string": "commandHelp()"
  }
}