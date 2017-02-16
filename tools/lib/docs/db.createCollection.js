module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{string} name The name of the collection to create.",
      "name": "name",
      "description": "The name of the collection to create.",
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
      "string": "{object} [options] Configuration options for creating a capped collection, for preallocating space in a new collection, or for creating a view.",
      "name": "[options]",
      "description": "Configuration options for creating a capped collection, for preallocating space in a new collection, or for creating a view.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    }
  ],
  "description": {
    "full": "Creates a new collection or view </core/views> .",
    "summary": "Creates a new collection or view </core/views> .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 171,
  "codeStart": 177,
  "code": "createCollection(name, options) {\n  options = options || {};\n\n  // We have special handling for the 'flags' field, and provide sugar for specific flags. If the\n  // user specifies any flags we send the field in the command. Otherwise, we leave it blank and\n  // use the server's defaults.\n  let sendFlags = false;\n  let flags = 0;\n  if (options.usePowerOf2Sizes) {\n    console.log(\n      \"WARNING: The 'usePowerOf2Sizes' flag is ignored in 3.0 and higher as all MMAPv1 \" +\n      \"collections use fixed allocation sizes unless the 'noPadding' flag is specified\");\n\n    sendFlags = true;\n    if (options.usePowerOf2Sizes) {\n      flags |= 1;  // Flag_UsePowerOf2Sizes\n    }\n    delete options.usePowerOf2Sizes;\n  }\n\n  if (options.noPadding) {\n    sendFlags = true;\n    if (options.noPadding) {\n      flags |= 2;  // Flag_NoPadding\n    }\n    delete options.noPadding;\n  }\n\n  // New flags must be added above here.\n  if (sendFlags) {\n    if (options.flags) {\n      throw Error(\"Can't set 'flags' with either 'usePowerOf2Sizes' or 'noPadding'\");\n    }\n\n    options.flags = flags;\n  }\n\n  let cmd = Object.assign({ create: name }, options);\n  return this.runCommand(cmd);\n}",
  "ctx": {
    "type": "method",
    "name": "createCollection",
    "string": "createCollection()"
  }
}