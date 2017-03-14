module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The accountUser01 user in the products database has the following role\n\"roles\" : [{ \n  \"role\" : \"assetsReader\",\n  \"db\" : \"assets\"\n}, { \n  \"role\" : \"read\",\n  \"db\" : \"stock\"\n}, { \n  \"role\" : \"readWrite\",\n  \"db\" : \"products\"\n}]\n\n// The following db.revokeRolesFromUser() method removes the two of the user’s roles: the read role on the stock database and the readWrite role on the products database, which is also the database on which the method runs\nuse products\ndb.revokeRolesFromUser( \"accountUser01\",\n  [ { role: \"read\", db: \"stock\" }, \"readWrite\" ],\n  { w: \"majority\" }\n)"
    },
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
    "full": "Removes a one or more roles from a user on the current database. The db.revokeRolesFromUser() method uses the following syntax:",
    "summary": "Removes a one or more roles from a user on the current database. The db.revokeRolesFromUser() method uses the following syntax:",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1281,
  "codeStart": 1308,
  "code": "revokeRolesFromUser(user, roles, writeConcern) {\n  const options = {\n    revokeRolesFromUser: user,\n    roles: roles,\n    writeConcern: writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN\n  };\n\n  return this.runCommand(options);\n}",
  "ctx": {
    "type": "method",
    "name": "revokeRolesFromUser",
    "string": "revokeRolesFromUser()"
  }
}