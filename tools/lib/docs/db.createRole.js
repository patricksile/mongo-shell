module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{object} role A document containing the name of the role and the role definition.",
      "name": "role",
      "description": "A document containing the name of the role and the role definition.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
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
    "full": "Creates a role in a database. You can specify privileges for the role by explicitly listing the privileges or by having the role inherit privileges from other roles or both. The role applies to the database on which you run the method.",
    "summary": "Creates a role in a database. You can specify privileges for the role by explicitly listing the privileges or by having the role inherit privileges from other roles or both. The role applies to the database on which you run the method.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 218,
  "codeStart": 224,
  "code": "createRole(role, writeConcern) {\n  let name = role.role;\n  let cmd = Object.assign({ createRole: name }, role);\n  delete cmd.role;\n  cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;\n\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); });\n}",
  "ctx": {
    "type": "method",
    "name": "createRole",
    "string": "createRole()"
  }
}