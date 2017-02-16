module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{object} [configuration] The ReplicaSet configuration object used to initiate the replicaset.",
      "name": "[configuration]",
      "description": "The ReplicaSet configuration object used to initiate the replicaset.",
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
      "string": "{object} returns the result of the replSetInitiate command",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false,
      "description": "returns the result of the replSetInitiate command"
    }
  ],
  "description": {
    "full": "The initiate command initializes a new replica set.",
    "summary": "The initiate command initializes a new replica set.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 191,
  "codeStart": 197,
  "code": "initiate(configuration = true) {\n  return this.admin.command({ replSetInitiate: configuration });\n}",
  "ctx": {
    "type": "method",
    "name": "initiate",
    "string": "initiate()"
  }
}