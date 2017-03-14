module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following operation changes the password of the user named accountUser in the products database to SOh3TbYhx8ypJPxmt1oOfL\nuse products\ndb.changeUserPassword(\"accountUser\", \"SOh3TbYhx8ypJPxmt1oOfL\")"
    },
    {
      "type": "param",
      "string": "{string} username Specifies an existing username with access privileges for this database.",
      "name": "username",
      "description": "Specifies an existing username with access privileges for this database.",
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
      "string": "{string} password Specifies the corresponding password.",
      "name": "password",
      "description": "Specifies the corresponding password.",
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
      "string": "{object} [options.writeConcern] The level of write concern to apply to this operation. The ``writeConcern`` document uses the same fields as the `getLastError` command.",
      "name": "[options.writeConcern]",
      "description": "The level of write concern to apply to this operation. The ``writeConcern`` document uses the same fields as the `getLastError` command.",
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
    "full": "Updates a user's password. Run the method in the database where the user is defined, i.e. the database you created <db.createUser> the user.",
    "summary": "Updates a user's password. Run the method in the database where the user is defined, i.e. the database you created <db.createUser> the user.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 118,
  "codeStart": 129,
  "code": "changeUserPassword(username, password, writeConcern) {\n  return this.updateUser(username, { pwd: password }, writeConcern);\n}",
  "ctx": {
    "type": "method",
    "name": "changeUserPassword",
    "string": "changeUserPassword()"
  }
}