module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{string} host The host and port of the server we wish to add ex: localhost:32000",
      "name": "host",
      "description": "The host and port of the server we wish to add ex: localhost:32000",
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
      "type": "return",
      "string": "{object} returns the result of the replSetSyncFrom command",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false,
      "description": "returns the result of the replSetSyncFrom command"
    }
  ],
  "description": {
    "full": "Temporarily overrides the default sync target for the current mongod. This operation is useful for testing different patterns and in situations where a set member is not replicating from the desired host.",
    "summary": "Temporarily overrides the default sync target for the current mongod. This operation is useful for testing different patterns and in situations where a set member is not replicating from the desired host.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 132,
  "codeStart": 138,
  "code": "syncFrom(host) {\n  if (!typeof stepdownSecs == 'string') throw new Error(`host must be a string`);\n  const admin = this.state.client.db('admin');\n  return admin.command({replSetSyncFrom: host});\n}",
  "ctx": {
    "type": "method",
    "name": "syncFrom",
    "string": "syncFrom()"
  }
}