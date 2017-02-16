module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{string} user The name of the user from whom to revoke roles.",
      "name": "user",
      "description": "The name of the user from whom to revoke roles.",
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
      "string": "{array} roles The roles to remove from the user.",
      "name": "roles",
      "description": "The roles to remove from the user.",
      "types": [
        "array"
      ],
      "typesDescription": "<code>array</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
      "name": "[writeConcern]",
      "description": "The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
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
    "full": "Removes a one or more roles from a user on the current database. The db.revokeRolesFromUser() method uses the following syntax:",
    "summary": "Removes a one or more roles from a user on the current database. The db.revokeRolesFromUser() method uses the following syntax:",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 922,
  "codeStart": 929,
  "code": "revokeRolesFromUser(user, roles, writeConcern) {\n  const options = {\n    revokeRolesFromUser: user,\n    roles: roles,\n    writeConcern: writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN\n  };\n\n  return this.runCommand(options);\n}",
  "ctx": {
    "type": "method",
    "name": "revokeRolesFromUser",
    "string": "revokeRolesFromUser()"
  }
}