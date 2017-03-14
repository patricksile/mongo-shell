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
    "full": "Ends the current authentication session. This function has no effect if the current session is not authenticated.",
    "summary": "Ends the current authentication session. This function has no effect if the current session is not authenticated.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1118,
  "codeStart": 1123,
  "code": "logout() {\n  return this.state.client.logout();\n}",
  "ctx": {
    "type": "method",
    "name": "logout",
    "string": "logout()"
  }
}