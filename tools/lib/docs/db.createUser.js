module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{object} user The document with authentication and access information about the user to create.",
      "name": "user",
      "description": "The document with authentication and access information about the user to create.",
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
      "string": "{object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the creation operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
      "name": "[writeConcern]",
      "description": "The level of :doc:`write concern </reference/write-concern>` for the creation operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
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
    "full": "Creates a new user for the database where the method runs. db.createUser()  returns a  error if the user already exists on the database.",
    "summary": "Creates a new user for the database where the method runs. db.createUser()  returns a  error if the user already exists on the database.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 234,
  "codeStart": 240,
  "code": "createUser(user, writeConcern) {\n  let name = user.user;\n  let cmd = Object.assign({ createUser: name }, user);\n  delete cmd.user;\n\n  modifyCommandToDigestPasswordIfNecessary(cmd, name);\n  cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;\n\n  return this.runCommand(cmd)\n    .then(() => console.log(`Successfully added user: ${getUserObjString(user)}`))\n    .catch(res => {\n      if (res.errmsg.match(/no such cmd: createUser/)) {\n        throw Error(\"'createUser' command not found.  This is most likely because you are \" +\n                    'talking to an old (pre v2.6) MongoDB server');\n      }\n\n\n      if (res.errmsg.match(/timeout/)) {\n        throw Error('timed out while waiting for user authentication to replicate - ' +\n                    'database will not be fully secured until replication finishes');\n      }\n\n      throw getErrorWithCode(res, `couldn't add user: ${res.errmsg}`);\n    });\n}",
  "ctx": {
    "type": "method",
    "name": "createUser",
    "string": "createUser()"
  }
}