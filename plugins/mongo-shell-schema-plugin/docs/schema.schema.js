module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "[options.mode=sample] String the sampling method, can be one of [sample,full].",
      "name": "[options.mode=sample]",
      "description": "String the sampling method, can be one of [sample,full].",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false
    },
    {
      "type": "param",
      "string": "[options.size=1000] Number the sample size if [options.mode=sample] is defined.",
      "name": "[options.size=1000]",
      "description": "Number the sample size if [options.mode=sample] is defined.",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false
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
    "full": "Returns all the schemas for the current databae",
    "summary": "Returns all the schemas for the current databae",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 72,
  "codeStart": 79,
  "code": "schema(options = { mode: 'sample', size: 1000 }) {\n  const self = this;\n\n  return co(function*() {\n    const collections = yield self.client.listCollections().toArray();\n    const results = {};\n\n    // Set default options\n    if (!options.mode) options.mode = 'sample';\n    if (!options.size) options.size = 1000;\n\n    // Generate the schema\n    for (const col of collections) {\n      const schema = yield parseSchemaPromise(self.client\n        .collection(col.name), options);\n      results[col.name] = schema;\n    }\n\n    return Promise.resolve(results);\n  });\n}",
  "ctx": {
    "type": "method",
    "name": "schema",
    "string": "schema()"
  }
}