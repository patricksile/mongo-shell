module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following db.grantPrivilegesToRole() operation grants two additional privileges to the role inventoryCntrl01, which exists on the products database. The operation is run on that database\nuse products\ndb.grantPrivilegesToRole(\n  \"inventoryCntrl01\", [{\n    resource: { db: \"products\", collection: \"\" },\n    actions: [ \"insert\" ]\n  }, {\n    resource: { db: \"products\", collection: \"system.js\" },\n    actions: [ \"find\" ]\n  }],\n  { w: \"majority\" })"
    },
    {
      "type": "param",
      "string": "{string} rolename The name of the role to grant privileges to.",
      "name": "rolename",
      "description": "The name of the role to grant privileges to.",
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
      "string": "{array} privileges The privileges to add to the role. For the format of a privilege, see :data:`~admin.system.roles.privileges`.",
      "name": "privileges",
      "description": "The privileges to add to the role. For the format of a privilege, see :data:`~admin.system.roles.privileges`.",
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
    "full": "Grants additional privileges <privileges> to a user-defined <user-defined-roles> role.",
    "summary": "Grants additional privileges <privileges> to a user-defined <user-defined-roles> role.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 954,
  "codeStart": 974,
  "code": "grantPrivilegesToRole(rolename, privileges, writeConcern) {\n  let cmd = { grantPrivilegesToRole: rolename, privileges: privileges };\n  cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;\n\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); });\n}",
  "ctx": {
    "type": "method",
    "name": "grantPrivilegesToRole",
    "string": "grantPrivilegesToRole()"
  }
}