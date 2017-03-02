module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{string} rolename The name of the role.",
      "name": "rolename",
      "description": "The name of the role.",
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
    "full": "Returns the roles from which this role inherits privileges. Optionally, the method can also return all the role's privileges.",
    "summary": "Returns the roles from which this role inherits privileges. Optionally, the method can also return all the role's privileges.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 639,
  "codeStart": 646,
  "code": "getRole(rolename, args) {\n  if (typeof rolename !== 'string') {\n    throw Error('Role name for getRole shell helper must be a string');\n  }\n\n  let cmd = Object.assign({ rolesInfo: rolename }, args);\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); })\n    .then(res => (res.roles.length === 0) ? null : res.roles[0]);\n}",
  "ctx": {
    "type": "method",
    "name": "getRole",
    "string": "getRole()"
  }
}