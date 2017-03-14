module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{number} stepdownSecs=60 The number of seconds to step down the primary, during which time the stepdown member is ineligible for becoming primary. If you specify a non-numeric value, the command uses 60 seconds.",
      "name": "stepdownSecs=60",
      "description": "The number of seconds to step down the primary, during which time the stepdown member is ineligible for becoming primary. If you specify a non-numeric value, the command uses 60 seconds.",
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
      "type": "param",
      "string": "{number} [catchUpSecs] The number of seconds that the mongod will wait for an electable secondary to catch up to the primary.",
      "name": "[catchUpSecs]",
      "description": "The number of seconds that the mongod will wait for an electable secondary to catch up to the primary.",
      "types": [
        "number"
      ],
      "typesDescription": "<code>number</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{boolean} [options.force=false] A boolean that determines whether the primary steps down if no electable and up-to-date secondary exists within the wait period.",
      "name": "[options.force=false]",
      "description": "A boolean that determines whether the primary steps down if no electable and up-to-date secondary exists within the wait period.",
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
      "string": "{object} returns the result of the replSetStepDown command",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false,
      "description": "returns the result of the replSetStepDown command"
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
  "line": 114,
  "codeStart": 122,
  "code": "stepDown(stepdownSecs = 60, catchUpSecs, options = {}) {\n  if (!typeof stepdownSecs == 'number') throw new Error(`stepdownSecs must a number`);\n  const command = { replSetStepDown: stepdownSecs };\n  if (typeof catchUpSecs == 'number') {\n    command['secondaryCatchUpPeriodSecs'] = catchUpSecs;\n  }\n\n  const admin = this.state.client.db('admin');\n  return admin.command(command);\n}",
  "ctx": {
    "type": "method",
    "name": "stepDown",
    "string": "stepDown()"
  }
}