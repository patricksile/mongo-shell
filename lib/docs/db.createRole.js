module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "The following createRole command creates the myClusterwideAdmin role on the admin database\nuse admin\ndb.runCommand({ createRole: \"myClusterwideAdmin\",\n privileges: [\n   { resource: { cluster: true }, actions: [ \"addShard\" ] },\n   { resource: { db: \"config\", collection: \"\" }, actions: [ \"find\", \"update\", \"insert\", \"remove\" ] },\n   { resource: { db: \"users\", collection: \"usersCollection\" }, actions: [ \"update\", \"insert\", \"remove\" ] },\n   { resource: { db: \"\", collection: \"\" }, actions: [ \"find\" ] }\n ],\n roles: [\n   { role: \"read\", db: \"admin\" }\n ],\n writeConcern: { w: \"majority\" , wtimeout: 5000 }\n})"
    },
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
    "full": "Creates a role in a database. You can specify privileges for the role by explicitly listing the privileges or by having the role inherit privileges from other roles or both. The role applies to the database on which you run the method.",
    "summary": "Creates a role in a database. You can specify privileges for the role by explicitly listing the privileges or by having the role inherit privileges from other roles or both. The role applies to the database on which you run the method.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 290,
  "codeStart": 312,
  "code": "createRole(role, writeConcern) {\n  let name = role.role;\n  let cmd = Object.assign({ createRole: name }, role);\n  delete cmd.role;\n  cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;\n\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); });\n}",
  "ctx": {
    "type": "method",
    "name": "createRole",
    "string": "createRole()"
  }
}