module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{string} user The name of the user to whom to grant roles.",
      "name": "user",
      "description": "The name of the user to whom to grant roles.",
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
      "string": "{array} roles An array of additional roles to grant to the user.",
      "name": "roles",
      "description": "An array of additional roles to grant to the user.",
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
    "full": "Grants additional roles to a user.",
    "summary": "Grants additional roles to a user.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 720,
  "codeStart": 727,
  "code": "grantRolesToUser(user, roles, writeConcern) {\n  const options = {\n    grantRolesToUser: user,\n    roles: roles,\n    writeConcern: writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN\n  };\n\n  return this.runCommand(options);\n}",
  "ctx": {
    "type": "method",
    "name": "grantRolesToUser",
    "string": "grantRolesToUser()"
  }
}