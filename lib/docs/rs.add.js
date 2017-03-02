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
      "type": "param",
      "string": "{boolean} arbiter=false Is the host we are adding an arbiter",
      "name": "arbiter=false",
      "description": "Is the host we are adding an arbiter",
      "types": [
        "boolean"
      ],
      "typesDescription": "<code>boolean</code>",
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
    "full": "Adds a new replicaset node to the set.",
    "summary": "Adds a new replicaset node to the set.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 12,
  "codeStart": 19,
  "code": "add(host, arbiter = false) {\n  const self = this;\n\n  return co(function*() {\n    if(!host) throw new Error('hostname and port must be provided ex: \"localhost:31000\"')\n    // Get the local db\n    const local = self.state.client.db('local');\n    // Assert there are no errors\n    const count = yield local.collection('system.replset').count();\n    if (count > 1) throw new Error(\"local.system.replset has unexpected contents\");\n    const configuration = yield local.collection('system.replset').findOne();\n    if (!configuration) throw new Error(\"no config object retrievable from local.system.replset\");\n\n    // Increment the configuration version\n    configuration.version = configuration.version + 1;\n\n    // Find max id from the members\n    let max = Math.max(...[{_id: 0}].concat(configuration.members).map(m => m._id));\n    // Create config object\n    const memberConfiguration = {\n      _id: max + 1, host: host\n    }\n\n    if (arbiter) {\n      memberConfiguration.arbiterOnly = true;\n    }\n\n    // Get admin db\n    const admin = self.state.client.db('admin');\n\n    // Add member configuration to list of members\n    configuration.members.push(memberConfiguration);\n    return admin.command({replSetReconfig: configuration});\n  });\n}",
  "ctx": {
    "type": "method",
    "name": "add",
    "string": "add()"
  }
}