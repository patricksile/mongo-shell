module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{string} username The name of the user to remove from the database.",
      "name": "username",
      "description": "The name of the user to remove from the database.",
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
      "type": "param",
      "string": "{object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
      "name": "[writeConcern]",
      "description": "The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    }
  ],
  "description": {
    "full": "Removes the user from the current database.",
    "summary": "Removes the user from the current database.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 384,
  "codeStart": 390,
  "code": "dropUser(username, writeConcern) {\n  let cmd = { dropUser: username };\n  cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;\n\n  return this.runCommand(cmd)\n    .then(() => true)\n    .catch(res => {\n      if (res.code === 11",
  "ctx": {
    "type": "method",
    "name": "dropUser",
    "string": "dropUser()"
  }
}