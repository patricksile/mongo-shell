module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The purchaseAgents role in the emea database inherits privileges from several other roles, as listed in the roles array\n{\n  \"_id\" : \"emea.purchaseAgents\",\n  \"role\" : \"purchaseAgents\",\n  \"db\" : \"emea\",\n  \"privileges\" : [],\n  \"roles\" : [{\n    \"role\" : \"readOrdersCollection\",\n    \"db\" : \"emea\"\n  }, {\n    \"role\" : \"readAccountsCollection\",\n    \"db\" : \"emea\"\n  }, {\n    \"role\" : \"writeOrdersCollection\",\n    \"db\" : \"emea\"\n  }]\n}\n\n// The following db.revokeRolesFromRole() operation on the emea database removes two roles from the purchaseAgents role\nuse emea\ndb.revokeRolesFromRole( \"purchaseAgents\", [\n    \"writeOrdersCollection\",\n    \"readOrdersCollection\"\n  ],\n  { w: \"majority\" , wtimeout: 5000 }\n)"
    },
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
      "string": "{object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` to apply to this operation. The ``writeConcern`` document uses the same fields as the `getLastError` command.",
      "name": "[options.writeConcern]",
      "description": "The level of :doc:`write concern </reference/write-concern>` to apply to this operation. The ``writeConcern`` document uses the same fields as the `getLastError` command.",
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
    "full": "Removes the specified inherited roles from a role.",
    "summary": "Removes the specified inherited roles from a role.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1238,
  "codeStart": 1273,
  "code": "revokeRolesFromRole(rolename, roles, writeConcern) {\n  let cmd = { revokeRolesFromRole: rolename, roles: roles };\n  cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;\n\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); });\n}",
  "ctx": {
    "type": "method",
    "name": "revokeRolesFromRole",
    "string": "revokeRolesFromRole()"
  }
}