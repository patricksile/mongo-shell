module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following operation removes multiple privileges from the associates role\ndb.revokePrivilegesFromRole(\n  \"associate\", [{\n    resource: { db: \"products\", collection: \"\" },\n    actions: [ \"createCollection\", \"createIndex\", \"find\" ]\n  }, {\n    resource: { db: \"products\", collection: \"orders\" },\n    actions: [ \"insert\" ]\n  }],\n  { w: \"majority\" })"
    },
    {
      "type": "param",
      "string": "{string} rolename The name of the :ref:`user-defined <user-defined-roles>` role from which to revoke privileges.",
      "name": "rolename",
      "description": "The name of the :ref:`user-defined <user-defined-roles>` role from which to revoke privileges.",
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
      "string": "{array} privileges An array of privileges to remove from the role.  See :data:`~admin.system.roles.privileges` for more information on the format of the privileges.",
      "name": "privileges",
      "description": "An array of privileges to remove from the role. See :data:`~admin.system.roles.privileges` for more information on the format of the privileges.",
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
      "string": "{object} [options] Additional options to pad to the command executor.",
      "name": "[options]",
      "description": "Additional options to pad to the command executor.",
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
      "type": "param",
      "string": "{object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
      "name": "[options.writeConcern]",
      "description": "The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
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
    "full": "Removes the specified privileges from the user-defined <user-defined-roles> role on the database where the method runs. The revokePrivilegesFromRole method has the following syntax:",
    "summary": "Removes the specified privileges from the user-defined <user-defined-roles> role on the database where the method runs. The revokePrivilegesFromRole method has the following syntax:",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1211,
  "codeStart": 1230,
  "code": "revokePrivilegesFromRole(rolename, privileges, writeConcern) {\n  let cmd = { revokePrivilegesFromRole: rolename, privileges: privileges };\n  cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;\n\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); });\n}",
  "ctx": {
    "type": "method",
    "name": "revokePrivilegesFromRole",
    "string": "revokePrivilegesFromRole()"
  }
}