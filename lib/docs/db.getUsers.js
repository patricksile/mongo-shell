module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{object} [args]",
      "name": "[args]",
      "description": "",
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
    "full": "Returns information for all the users in the database.",
    "summary": "Returns information for all the users in the database.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 668,
  "codeStart": 673,
  "code": "getUsers(args) {\n  let cmd = Object.assign({ usersInfo: 1 }, args);\n\n  return this.runCommand(cmd)\n    .then(res => res.users)\n    .catch(res => {\n      if (res.code === 69",
  "ctx": {
    "type": "method",
    "name": "getUsers",
    "string": "getUsers()"
  }
}