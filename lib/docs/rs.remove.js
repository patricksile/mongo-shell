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
    "full": "Remove a node from the replicaset",
    "summary": "Remove a node from the replicaset",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 63,
  "codeStart": 69,
  "code": "remove(host) {\n  const self = this;\n\n  return co(function*() {\n    if(!host) throw new Error('hostname and port must be provided ex: \"localhost:31000\"')\n    // Get the local db\n    const local = self.client.db('local');\n    // Assert there are no errors\n    const count = yield local.collection('system.replset').count();\n    if (count <= 1) throw new Error(\"local.system.replset has unexpected contents\");\n    const configuration = yield local.collection('system.replset').findOne();\n    if (!configuration) throw new Error(\"no config object retrievable from local.system.replset\");\n\n    // Increment the configuration version\n    configuration.version = configuration.version + 1;\n\n    // Splice the member out\n    for (let member in configuration.members) {\n      if (configuration.members[i].host == host) {\n        configuration.splice(i, 1);\n        return self.admin.command({replSetReconfig: configuration});\n      }\n    }\n\n    // Could not find the host to remove, error out\n    throw new Error(`could not find ${host} in ${JSON.stringify(configuration.members)}`);\n  });\n}",
  "ctx": {
    "type": "method",
    "name": "remove",
    "string": "remove()"
  }
}