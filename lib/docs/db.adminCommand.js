module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following example uses the db.adminCommand() method to execute a killOp command to terminate an operation with opid 724. killOp is an administrative command and must be run against the admin database.\ndb.adminCommand( { \"killOp\": 1, \"op\": 724 } )\n\n// The following example uses db.adminCommand() to execute the renameCollection administrative database command to rename the orders collection in the test database to orders-2016.\ndb.adminCommand({\n  renameCollection: \"test.orders\",\n  to: \"test.orders-2016\"\n})\n\n// The following example uses the db.adminCommand() method to create a user named bruce with the dbOwner role on the admin database.\ndb.adminCommand({\n  createUser: \"bruce\",\n  pwd: \"bruce123\",\n  roles: [\n    { role: \"dbOwner\", db: \"admin\" }\n  ]\n})"
    },
    {
      "type": "param",
      "string": "{object|string} command A database command, specified either in document form or as a string. If specified as a string, the command cannot include any arguments.",
      "name": "command",
      "description": "A database command, specified either in document form or as a string. If specified as a string, the command cannot include any arguments.",
      "types": [
        "object",
        "string"
      ],
      "typesDescription": "<code>object</code>|<code>string</code>",
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
    "full": "Provides a helper to run specified database commands against the admin database.",
    "summary": "Provides a helper to run specified database commands against the admin database.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1318,
  "codeStart": 1342,
  "code": "adminCommand(obj, options) {\n  if (this.name === 'admin') {\n    return this.runCommand(obj, options);\n  }\n\n  return this.getSiblingDB('admin').runCommand(obj, options);\n}",
  "ctx": {
    "type": "method",
    "name": "adminCommand",
    "string": "adminCommand()"
  }
}