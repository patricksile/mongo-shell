module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{string} rolename The name of the :ref:`user-defined role <user-defined-roles>` to update.",
      "name": "rolename",
      "description": "The name of the :ref:`user-defined role <user-defined-roles>` to update.",
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
      "string": "{object} update A document containing the replacement data for the role. This data completely replaces the corresponding data for the role.",
      "name": "update",
      "description": "A document containing the replacement data for the role. This data completely replaces the corresponding data for the role.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the update operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
      "name": "[writeConcern]",
      "description": "The level of :doc:`write concern </reference/write-concern>` for the update operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
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
    "full": "Updates a user-defined role <user-defined-roles> . The db.updateRole() method must run on the role's database.",
    "summary": "Updates a user-defined role <user-defined-roles> . The db.updateRole() method must run on the role's database.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1108,
  "codeStart": 1116,
  "code": "updateRole(rolename, update, writeConcern) {\n  let cmd = Object.assign({ updateRole: rolename }, update);\n  cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); });\n}",
  "ctx": {
    "type": "method",
    "name": "updateRole",
    "string": "updateRole()"
  }
}