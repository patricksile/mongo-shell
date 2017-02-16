module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{string} username The name of the user for which to retrieve information.",
      "name": "username",
      "description": "The name of the user for which to retrieve information.",
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
      "string": "{object} [args] A document specifying additional arguments.",
      "name": "[args]",
      "description": "A document specifying additional arguments.",
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
    "full": "Returns user information for a specified user. Run this method on the user's database. The user must exist on the database on which the method runs.",
    "summary": "Returns user information for a specified user. Run this method on the user's database. The user must exist on the database on which the method runs.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 651,
  "codeStart": 657,
  "code": "getUser(username, args) {\n  if (typeof username !== 'string') {\n    throw Error('User name for getUser shell helper must be a string');\n  }\n\n  let cmd = Object.assign({ usersInfo: username }, args);\n  return this.runCommand(cmd)\n    .then(res => (res.users.length === 0) ? null : res.users[0])\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); });\n}",
  "ctx": {
    "type": "method",
    "name": "getUser",
    "string": "getUser()"
  }
}