module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Given a user accountUser01 in the products database with the following roles\n\"roles\" : [{ \"role\" : \"assetsReader\",\n  \"db\" : \"assets\"\n}]\n// The following grantRolesToUser() operation gives accountUser01 the readWrite role on the products database and the read role on the stock database.\nuse products\ndb.grantRolesToUser(\n  \"accountUser01\",\n  [ \"readWrite\" , { role: \"read\", db: \"stock\" } ],\n  { w: \"majority\" , wtimeout: 4000 })"
    },
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
    "full": "Grants additional roles to a user.",
    "summary": "Grants additional roles to a user.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1005,
  "codeStart": 1024,
  "code": "grantRolesToUser(user, roles, writeConcern) {\n  const options = {\n    grantRolesToUser: user,\n    roles: roles,\n    writeConcern: writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN\n  };\n\n  return this.runCommand(options);\n}",
  "ctx": {
    "type": "method",
    "name": "grantRolesToUser",
    "string": "grantRolesToUser()"
  }
}