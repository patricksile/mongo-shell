module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following operations return documents for all the roles on the products database, including role privileges and built-in roles\ndb.getRoles({\n  rolesInfo: 1,\n  showPrivileges:true,\n  showBuiltinRoles: true\n})"
    },
    {
      "type": "param",
      "string": "{integer} rolesInfo Set this field to ``1`` to retrieve all user-defined roles.",
      "name": "rolesInfo",
      "description": "Set this field to ``1`` to retrieve all user-defined roles.",
      "types": [
        "integer"
      ],
      "typesDescription": "<a href=\"integer.html\">integer</a>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{boolean} [showPrivileges] Set the field to ``true`` to show role privileges, including both privileges inherited from other roles and privileges defined directly. By default, the command returns only the roles from which this role inherits privileges and does not return specific privileges.",
      "name": "[showPrivileges]",
      "description": "Set the field to ``true`` to show role privileges, including both privileges inherited from other roles and privileges defined directly. By default, the command returns only the roles from which this role inherits privileges and does not return specific privileges.",
      "types": [
        "boolean"
      ],
      "typesDescription": "<code>boolean</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{boolean} [showBuiltinRoles] Set to true to display :ref:`built-in roles <built-in-roles>` as well as user-defined roles.",
      "name": "[showBuiltinRoles]",
      "description": "Set to true to display :ref:`built-in roles <built-in-roles>` as well as user-defined roles.",
      "types": [
        "boolean"
      ],
      "typesDescription": "<code>boolean</code>",
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
    "full": "Returns information for all the roles in the database on which the command runs. The method can be run with or without an argument.",
    "summary": "Returns information for all the roles in the database on which the command runs. The method can be run with or without an argument.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 867,
  "codeStart": 881,
  "code": "getRoles(rolesInfo, showPrivileges, showBuiltinRoles) {\n  let cmd = { rolesInfo: 1 };\n  if (showPrivileges) cmd.showPrivileges = showPrivileges;\n  if (showBuiltinRoles) cmd.showBuiltinRoles = showBuiltinRoles;\n\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); })\n    .then(res => res.roles);\n}",
  "ctx": {
    "type": "method",
    "name": "getRoles",
    "string": "getRoles()"
  }
}