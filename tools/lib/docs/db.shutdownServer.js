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
  "line": 1007,
  "codeStart": 1012,
  "code": "shutdownServer(options) {\n  if (this.name !== 'admin') {\n    throw new Error(\"shutdown command only works with the admin database; try 'use admin'\");\n  }\n\n  let cmd = Object.assign({ shutdown: 1 }, options);\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, `shutdownServer failed: ${JSON.stringify(res)}`); });\n}",
  "ctx": {
    "type": "method",
    "name": "shutdownServer",
    "string": "shutdownServer()"
  }
}