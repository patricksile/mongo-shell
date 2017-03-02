module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{number} op An operation ID.",
      "name": "op",
      "description": "An operation ID.",
      "types": [
        "number"
      ],
      "typesDescription": "<code>number</code>",
      "optional": false,
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
    "full": "Terminates an operation as specified by the operation ID. To find operations and their corresponding IDs, see db.currentOp() .",
    "summary": "Terminates an operation as specified by the operation ID. To find operations and their corresponding IDs, see db.currentOp() .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 800,
  "codeStart": 806,
  "code": "killOp(op) {\n  if (!op) {\n    throw Error('no opNum to kill specified');\n  }\n\n  return this.adminCommand({ killOp: 1, op: op })\n    .catch(err => {\n      // @TODO: implement",
  "ctx": {
    "type": "method",
    "name": "killOp",
    "string": "killOp()"
  }
}