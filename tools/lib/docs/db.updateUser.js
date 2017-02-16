module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{string} username The name of the user to update.",
      "name": "username",
      "description": "The name of the user to update.",
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
      "string": "{object} update A document containing the replacement data for the user. This data completely replaces the corresponding data for the user.",
      "name": "update",
      "description": "A document containing the replacement data for the user. This data completely replaces the corresponding data for the user.",
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
    }
  ],
  "description": {
    "full": "Updates the user's profile on the database on which you run the method. An update to a field  the previous field's values. This includes updates to the user's  array.",
    "summary": "Updates the user's profile on the database on which you run the method. An update to a field  the previous field's values. This includes updates to the user's  array.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1045,
  "codeStart": 1052,
  "code": "updateUser(username, update, writeConcern) {\n  let cmd = Object.assign({ updateUser: username }, update);\n  cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;\n  modifyCommandToDigestPasswordIfNecessary(cmd, username);\n\n  return this.runCommand(cmd)\n    .catch(res => {\n      if (res.errmsg.match(/no such cmd: updateUser/)) {\n        // @TODO: implement updateUserV1\n        throw res;\n      }\n\n      throw getErrorWithCode(res, `Updating user failed: ${res.errmsg}`);\n    });\n}",
  "ctx": {
    "type": "method",
    "name": "updateUser",
    "string": "updateUser()"
  }
}