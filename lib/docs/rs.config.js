module.exports = {
  "tags": [
    {
      "type": "return",
      "string": "{object} returns the Replicaset configuration.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false,
      "description": "returns the Replicaset configuration."
    }
  ],
  "description": {
    "full": "Retrieve the current Replicaset configuration.",
    "summary": "Retrieve the current Replicaset configuration.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 147,
  "codeStart": 152,
  "code": "config() {\n  const self = this;\n\n  return co(function*() {\n    try {\n      return yield self.admin.command({replSetGetConfig: 1});\n    } catch(err) {\n      if (err.message.startsWith('no such cmd')) {\n        return self.client.db('local').collection('system.replset').findOne();\n      } else {\n        throw new Error(`Could not retrieve replica set config: ${JSON.stringify(err)}`);\n      }\n    }\n  });\n}",
  "ctx": {
    "type": "method",
    "name": "config",
    "string": "config()"
  }
}