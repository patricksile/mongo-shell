module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{object} [options]",
      "name": "[options]",
      "description": "",
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
    "full": "Shuts down the current mongod or mongos  process cleanly and safely.",
    "summary": "Shuts down the current mongod or mongos  process cleanly and safely.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1409,
  "codeStart": 1415,
  "code": "shutdownServer(options) {\n  if (this.name !== 'admin') {\n    throw new Error(\"shutdown command only works with the admin database; try 'use admin'\");\n  }\n\n  let cmd = Object.assign({ shutdown: 1 }, options);\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, `shutdownServer failed: ${JSON.stringify(res)}`); });\n}",
  "ctx": {
    "type": "method",
    "name": "shutdownServer",
    "string": "shutdownServer()"
  }
}