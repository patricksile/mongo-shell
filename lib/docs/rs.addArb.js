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
      "string": "{object} returns the result of the replSetReconfig command",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false,
      "description": "returns the result of the replSetReconfig command"
    }
  ],
  "description": {
    "full": "Adds a new replicaset arbiter node to the set.",
    "summary": "Adds a new replicaset arbiter node to the set.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 53,
  "codeStart": 59,
  "code": "addArb(host) {\n  return this.add(host, true);\n}",
  "ctx": {
    "type": "method",
    "name": "addArb",
    "string": "addArb()"
  }
}