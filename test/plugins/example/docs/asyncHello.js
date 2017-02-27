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
    "full": "A simple Asynchronous hello method",
    "summary": "A simple Asynchronous hello method",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 64,
  "codeStart": 68,
  "code": "asyncHello() {\n  return Promise.resolve('hello world from async example plugin');\n}\n}\n\nmodule.exports = ExamplePlugin;",
  "ctx": {
    "type": "method",
    "name": "asyncHello",
    "string": "asyncHello()"
  }
}