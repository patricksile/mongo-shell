module.exports = {
  "tags": [
    {
      "type": "return",
      "string": "{object} returns the result of the replSetGetStatus command",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false,
      "description": "returns the result of the replSetGetStatus command"
    }
  ],
  "description": {
    "full": "Return the replicaset status",
    "summary": "Return the replicaset status",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 98,
  "codeStart": 103,
  "code": "status() {\n  return this.admin.command({replSetGetStatus: true});\n}",
  "ctx": {
    "type": "method",
    "name": "status",
    "string": "status()"
  }
}