module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{object} configuration The ReplicaSet configuration object used to reconfigure the replicaset.",
      "name": "configuration",
      "description": "The ReplicaSet configuration object used to reconfigure the replicaset.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{boolean} [options.force=false] A boolean that determines whether the reconfiguration should be forced.",
      "name": "[options.force=false]",
      "description": "A boolean that determines whether the reconfiguration should be forced.",
      "types": [
        "boolean"
      ],
      "typesDescription": "<code>boolean</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "return",
      "string": "{object} returns the result of the replSetGetConfig command",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false,
      "description": "returns the result of the replSetGetConfig command"
    }
  ],
  "description": {
    "full": "The reconfig command modifies the configuration of an existing replica set. You can use this command to add and remove members, and to alter the options set on existing members. Use the following syntax:",
    "summary": "The reconfig command modifies the configuration of an existing replica set. You can use this command to add and remove members, and to alter the options set on existing members. Use the following syntax:",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 179,
  "codeStart": 186,
  "code": "reconfig(configuration, options = {}) {\n  const self = this;\n\n  return co(function*() {\n    const admin = self.state.client.db('admin');\n    // Get current configuration\n    const _conf = yield self.config();\n    // Update configuration version\n    configuration.version = _conf.version + 1;\n    // Execute reconfigure\n    return admin.command(Object.assign(\n      {replSetGetConfig: configuration},\n      options\n    ));\n  });\n}",
  "ctx": {
    "type": "method",
    "name": "reconfig",
    "string": "reconfig()"
  }
}