module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{func} func A JavaScript function to execute.",
      "name": "func",
      "description": "A JavaScript function to execute.",
      "types": [
        "func"
      ],
      "typesDescription": "<a href=\"func.html\">func</a>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{list} [args] A list of arguments to pass to the JavaScript function. Omit if the function does not take arguments.",
      "name": "[args]",
      "description": "A list of arguments to pass to the JavaScript function. Omit if the function does not take arguments.",
      "types": [
        "list"
      ],
      "typesDescription": "<a href=\"list.html\">list</a>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    }
  ],
  "description": {
    "full": "Provides the ability to run JavaScript code on the MongoDB server.",
    "summary": "Provides the ability to run JavaScript code on the MongoDB server.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 409,
  "codeStart": 415,
  "code": "eval(func, ...args) {\n  console.log('WARNING: db.eval is deprecated');\n\n  let cmd = { $eval: func };\n  if (args.length) cmd.args = args;\n\n  return this.runCommand(cmd)\n    .then(res => res.retval)\n    .catch(res => { throw getErrorWithCode(res, JSON.stringify(res)); });\n}",
  "ctx": {
    "type": "method",
    "name": "eval",
    "string": "eval()"
  }
}