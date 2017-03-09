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
    "full": "Returns the collection schema",
    "summary": "Returns the collection schema",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 27,
  "codeStart": 33,
  "code": "schema(options = { mode: 'sample', size: 1000 }) {\n  // Set default options\n  if (!options.mode) options.mode = 'sample';\n  if (!options.size) options.size = 1000;\n  // Generate the schema\n  return parseSchemaPromise(this.collection, options);\n}",
  "ctx": {
    "type": "method",
    "constructor": "Collection",
    "cons": "Collection",
    "name": "schema",
    "string": "Collection.prototype.schema()"
  }
}