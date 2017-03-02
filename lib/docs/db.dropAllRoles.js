module.exports = {
  "tags": [
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
    "full": "Deletes all user-defined <user-defined-roles> roles on the database where you run the method.",
    "summary": "Deletes all user-defined <user-defined-roles> roles on the database where you run the method.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 330,
  "codeStart": 336,
  "code": "dropAllRoles(writeConcern) {\n  let cmd = { dropAllRolesFromDatabase: 1 };\n  cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;\n\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); })\n    .then(res => res.n);\n}",
  "ctx": {
    "type": "method",
    "name": "dropAllRoles",
    "string": "dropAllRoles()"
  }
}