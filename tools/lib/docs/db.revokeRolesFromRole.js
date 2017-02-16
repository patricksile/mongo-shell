module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{string} rolename The name of the role from which to revoke roles.",
      "name": "rolename",
      "description": "The name of the role from which to revoke roles.",
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
      "string": "{array} roles The inherited roles to remove.",
      "name": "roles",
      "description": "The inherited roles to remove.",
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
      "string": "{object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` to apply to this operation. The ``writeConcern`` document uses the same fields as the `getLastError` command.",
      "name": "[writeConcern]",
      "description": "The level of :doc:`write concern </reference/write-concern>` to apply to this operation. The ``writeConcern`` document uses the same fields as the `getLastError` command.",
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
    "full": "Removes the specified inherited roles from a role.",
    "summary": "Removes the specified inherited roles from a role.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 907,
  "codeStart": 914,
  "code": "revokeRolesFromRole(rolename, roles, writeConcern) {\n  let cmd = { revokeRolesFromRole: rolename, roles: roles };\n  cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;\n\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); });\n}",
  "ctx": {
    "type": "method",
    "name": "revokeRolesFromRole",
    "string": "revokeRolesFromRole()"
  }
}