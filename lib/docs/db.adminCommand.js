module.exports = {
  "tags": [
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
    "full": "",
    "summary": "",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 995,
  "codeStart": 999,
  "code": "adminCommand(obj, options) {\n  if (this.name === 'admin') {\n    return this.runCommand(obj, options);\n  }\n\n  return this.getSiblingDB('admin').runCommand(obj, options);\n}",
  "ctx": {
    "type": "method",
    "name": "adminCommand",
    "string": "adminCommand()"
  }
}