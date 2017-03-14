module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Bulk Write Operations\ndb.characters.bulkWrite([{ \n  insertOne : {\n    \"document\" : {\n      \"_id\" : 4, \"char\" : \"Dithras\", \"class\" : \"barbarian\", \"lvl\" : 4\n    }\n  }\n}, { \n  insertOne : {\n    \"document\" : {\n      \"_id\" : 5, \"char\" : \"Taeln\", \"class\" : \"fighter\", \"lvl\" : 3\n    }\n  }\n}, { \n  updateOne : {\n    \"filter\" : { \"char\" : \"Eldon\" },\n    \"update\" : { $set : { \"status\" : \"Critical Injury\" } }\n  }\n}, { \n  deleteOne : {\n    \"filter\" : { \"char\" : \"Brisbane\"} \n  }\n}, { \n  replaceOne : {\n    \"filter\" : { \"char\" : \"Meldane\" },\n    \"replacement\" : { \"char\" : \"Tanys\", \"class\" : \"oracle\", \"lvl\" : 4 }\n  }\n}]);\n\n// Unordered Bulk Write with writeConcern\ndb.characters.bulkWrite([{ \n  insertOne : {\n    \"document\" : {\n      \"_id\" : 4, \"char\" : \"Dithras\", \"class\" : \"barbarian\", \"lvl\" : 4\n    }\n  }\n}, { \n  insertOne : {\n    \"document\" : {\n      \"_id\" : 5, \"char\" : \"Taeln\", \"class\" : \"fighter\", \"lvl\" : 3\n    }\n  }\n}, { \n  updateOne : {\n    \"filter\" : { \"char\" : \"Eldon\" },\n    \"update\" : { $set : { \"status\" : \"Critical Injury\" } }\n  }\n}, { \n  deleteOne : {\n    \"filter\" : { \"char\" : \"Brisbane\"} \n  }\n}, { \n  replaceOne : {\n    \"filter\" : { \"char\" : \"Meldane\" },\n    \"replacement\" : { \"char\" : \"Tanys\", \"class\" : \"oracle\", \"lvl\" : 4 }\n  }\n}], {\n  ordered: false\n  writeConcern : { w : \"majority\", wtimeout : 100 }\n});"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"bulkWrite\", \"value\": \"(operations, options) => {\", \"string\": \"bulkWrite\"}"
    },
    {
      "type": "method",
      "string": "bulkWrite"
    },
    {
      "type": "param",
      "string": "{array} operations An array of bulkWrite() write operations.",
      "name": "operations",
      "description": "An array of bulkWrite() write operations.",
      "types": [
        "array"
      ],
      "typesDescription": "<code>array</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [options] Additional options to pad to the command executor.",
      "name": "[options]",
      "description": "Additional options to pad to the command executor.",
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
      "type": "param",
      "string": "{object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
      "name": "[options.writeConcern]",
      "description": "The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
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
      "type": "param",
      "string": "{object} [options.ordered=true] A boolean specifying whether the mongod instance should perform an ordered or unordered insert. Defaults to true.",
      "name": "[options.ordered=true]",
      "description": "A boolean specifying whether the mongod instance should perform an ordered or unordered insert. Defaults to true.",
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
      "string": "{Promise}",
      "types": [
        "Promise"
      ],
      "typesDescription": "<a href=\"Promise.html\">Promise</a>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false,
      "description": ""
    }
  ],
  "description": {
    "full": "Performs multiple write operations with controls for order of execution.",
    "summary": "Performs multiple write operations with controls for order of execution.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 421,
  "codeStart": 492,
  "ctx": {
    "type": "property",
    "name": "bulkWrite",
    "value": "(operations, options) => {",
    "string": "bulkWrite"
  }
}