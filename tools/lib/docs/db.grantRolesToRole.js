module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{string} rolename The name of the role to which to grant sub roles.",
      "name": "rolename",
      "description": "The name of the role to which to grant sub roles.",
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
      "string": "{array} roles An array of roles from which to inherit.",
      "name": "roles",
      "description": "An array of roles from which to inherit.",
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
    "full": "Grants roles to a user-defined role <user-defined-roles> .",
    "summary": "Grants roles to a user-defined role <user-defined-roles> .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 705,
  "codeStart": 712,
  "code": "grantRolesToRole(rolename, roles, writeConcern) {\n  let cmd = { grantRolesToRole: rolename, roles: roles };\n  cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;\n\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); });\n}",
  "ctx": {
    "type": "method",
    "name": "grantRolesToRole",
    "string": "grantRolesToRole()"
  }
}