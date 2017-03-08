module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "[options] Object Options passed to the generator.",
      "name": "[options]",
      "description": "Object Options passed to the generator.",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false
    },
    {
      "type": "param",
      "string": "[options.target] String the target ODM, can be one of [mongoose].",
      "name": "[options.target]",
      "description": "String the target ODM, can be one of [mongoose].",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false
    },
    {
      "type": "param",
      "string": "[options.output=.] String the output directory.",
      "name": "[options.output=.]",
      "description": "String the output directory.",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false
    },
    {
      "type": "param",
      "string": "[options.preview=false] Boolean return the ODM class preview.",
      "name": "[options.preview=false]",
      "description": "Boolean return the ODM class preview.",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false
    },
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
  "line": 101,
  "codeStart": 112,
  "code": "generate(options = {}) {\n  const self = this;\n\n  return co(function*() {\n    if (!options.target) throw new Error('target must be set to one of the supported targets [mongoose]');\n    if (modes.indexOf(options.target) == -1) throw new Error('target must be set to one of the supported targets [mongoose]');\n\n    // Set default options\n    if (!options.mode) options.mode = 'sample';\n    if (!options.size) options.size = 1000;\n    if (!options.output) options.output = '.';\n\n    const collections = yield self.client.listCollections().toArray();\n    const results = [];\n\n    // Let's determine the generator we are going to use\n    const generator = self.generators[options.target];\n\n    for (const col of collections) {\n      self.log(`Generating Schema for collection ${col.name}`);\n      const schema = yield parseSchemaPromise(self.client\n        .collection(col.name), options);\n      self.log(`Generating ${options.target} ODM Schema for collection ${col.name}`);\n\n      // Singular name\n      const singular = pluralize.singular(col.name);\n      const singularCapitalized = capitalize(singular);\n      // Lets generate the actual template file\n      const file = yield generator.generate(singularCapitalized, schema, options);      \n      if (options.preview === true) {\n        results.push(file);\n      } else {\n        fs.writeFileSync(`${options.output}/${singular}.js`, file, 'utf8');\n        self.log(`Generating ${options.target} ODM Schema for collection ${col.name} to file ${options.output}/${singular}.js`);        \n      }\n    }\n\n    if (options.preview) return results;\n    return Promise.resolve(`Successfully generated ${options.target} ODM Schema`);\n  })\n}\n}\n\nmodule.exports = OdmGenerator;",
  "ctx": {
    "type": "method",
    "name": "generate",
    "string": "generate()"
  }
}