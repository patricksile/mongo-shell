module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{number} seconds The number of seconds the current node should wait before seeking an election.",
      "name": "seconds",
      "description": "The number of seconds the current node should wait before seeking an election.",
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
      "string": "{object} returns the result of the replSetFreeze command",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false,
      "description": "returns the result of the replSetFreeze command"
    }
  ],
  "description": {
    "full": "The replSetFreeze command prevents a replica set member from seeking election for the specified number of seconds.",
    "summary": "The replSetFreeze command prevents a replica set member from seeking election for the specified number of seconds.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 144,
  "codeStart": 150,
  "code": "freeze(seconds) {\n  if (!typeof seconds == 'number') throw new Error(`seconds must a number`);\n  const admin = this.state.client.db('admin');\n  return admin.command({replSetFreeze: seconds});\n}",
  "ctx": {
    "type": "method",
    "name": "freeze",
    "string": "freeze()"
  }
}