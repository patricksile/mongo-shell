module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Create a Capped Collection\n// This command creates a collection named log with a maximum size of 5 megabytes and a maximum of 5000 documents\ndb.createCollection(\"log\", { capped : true, size : 5242880, max : 5000 } )\n// The following command simply pre-allocates a 2-gigabyte, uncapped collection named people\ndb.createCollection(\"people\", { size: 2147483648 } )\n\n// Create a Collection with Document Validation\n// The following example creates a contacts collection with a validator that specifies that inserted or updated documents should match at least one of three following condition\n//  * the phone field is a string\n//  * the email field matches the regular expression\n//  * the status field is either Unknown or Incomplete.\ndb.createCollection( \"contacts\", {\n  validator: { $or:\n     [\n        { phone: { $type: \"string\" } },\n        { email: { $regex: /@mongodb\\.com$/ } },\n        { status: { $in: [ \"Unknown\", \"Incomplete\" ] } }\n     ]\n  }\n})\n\n// Specify Collation\ndb.createCollection( \"myColl\", { collation: { locale: \"fr\" } } );"
    },
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
    },
    {
      "type": "param",
      "string": "{boolean} [options.capped] To create a capped collection, specify true. If you specify true, you must also set a maximum size in the size field.",
      "name": "[options.capped]",
      "description": "To create a capped collection, specify true. If you specify true, you must also set a maximum size in the size field.",
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
      "type": "param",
      "string": "{boolean} [options.autoIndexId] Specify false to disable the automatic creation of an index on the _id field. (Deprecated since version 3.2: The autoIndexId option will be removed in version 3.4.)",
      "name": "[options.autoIndexId]",
      "description": "Specify false to disable the automatic creation of an index on the _id field. (Deprecated since version 3.2: The autoIndexId option will be removed in version 3.4.)",
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
      "type": "param",
      "string": "{number} [options.size] Specify a maximum size in bytes for a capped collection. Once a capped collection reaches its maximum size, MongoDB removes the older documents to make space for the new documents. The size field is required for capped collections and ignored for other collections. ",
      "name": "[options.size]",
      "description": "Specify a maximum size in bytes for a capped collection. Once a capped collection reaches its maximum size, MongoDB removes the older documents to make space for the new documents. The size field is required for capped collections and ignored for other collections.",
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
      "string": "{number} [options.max] The maximum number of documents allowed in the capped collection. The size limit takes precedence over this limit. If a capped collection reaches the size limit before it reaches the maximum number of documents, MongoDB removes old documents. If you prefer to use the max limit, ensure that the size limit, which is required for a capped collection, is sufficient to contain the maximum number of documents.",
      "name": "[options.max]",
      "description": "The maximum number of documents allowed in the capped collection. The size limit takes precedence over this limit. If a capped collection reaches the size limit before it reaches the maximum number of documents, MongoDB removes old documents. If you prefer to use the max limit, ensure that the size limit, which is required for a capped collection, is sufficient to contain the maximum number of documents.",
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
      "string": "{boolean} [options.usePowerOf2Sizes] Available for the MMAPv1 storage engine only. Deprecated since version 3.0: For the MMAPv1 storage engine, all collections use the power of 2 sizes allocation unless the noPadding option is true. The usePowerOf2Sizes option does not affect the allocation strategy. ",
      "name": "[options.usePowerOf2Sizes]",
      "description": "Available for the MMAPv1 storage engine only. Deprecated since version 3.0: For the MMAPv1 storage engine, all collections use the power of 2 sizes allocation unless the noPadding option is true. The usePowerOf2Sizes option does not affect the allocation strategy.",
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
      "type": "param",
      "string": "{boolean} [options.noPadding = false] Available for the MMAPv1 storage engine only. New in version 3.0: noPadding flag disables the power of 2 sizes allocation for the collection. With noPadding flag set to true, the allocation strategy does not include additional space to accommodate document growth, as such, document growth will result in new allocation. Use for collections with workloads that are insert-only or in-place updates (such as incrementing counters).",
      "name": "[options.noPadding",
      "description": "= false] Available for the MMAPv1 storage engine only. New in version 3.0: noPadding flag disables the power of 2 sizes allocation for the collection. With noPadding flag set to true, the allocation strategy does not include additional space to accommodate document growth, as such, document growth will result in new allocation. Use for collections with workloads that are insert-only or in-place updates (such as incrementing counters).",
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
      "type": "param",
      "string": "{object} [options.storageEngine] Available for the WiredTiger storage engine only. Allows users to specify configuration to the storage engine on a per-collection basis when creating a collection. The value of the storageEngine option should take the following form: { <storage-engine-name>: <options> }",
      "name": "[options.storageEngine]",
      "description": "Available for the WiredTiger storage engine only. Allows users to specify configuration to the storage engine on a per-collection basis when creating a collection. The value of the storageEngine option should take the following form: { <storage-engine-name>: <options> }",
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
      "string": "{object} [options.validator] Allows users to specify validation rules or expressions for the collection. For more information, see Document Validation.",
      "name": "[options.validator]",
      "description": "Allows users to specify validation rules or expressions for the collection. For more information, see Document Validation.",
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
      "string": "{string} [options.validationLevel] Determines how strictly MongoDB applies the validation rules to existing documents during an update.",
      "name": "[options.validationLevel]",
      "description": "Determines how strictly MongoDB applies the validation rules to existing documents during an update.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{string} [options.validationAction] Determines whether to error on invalid documents or just warn about the violations but allow invalid documents to be inserted.",
      "name": "[options.validationAction]",
      "description": "Determines whether to error on invalid documents or just warn about the violations but allow invalid documents to be inserted.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [options.indexOptionDefaults] Allows users to specify a default configuration for indexes when creating a collection.",
      "name": "[options.indexOptionDefaults]",
      "description": "Allows users to specify a default configuration for indexes when creating a collection.",
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
      "string": "{string} [options.viewOn] The name of the source collection or view from which to create the view. The name is not the full namespace of the collection or view; i.e. does not include the database name and implies the same database as the view to create.",
      "name": "[options.viewOn]",
      "description": "The name of the source collection or view from which to create the view. The name is not the full namespace of the collection or view; i.e. does not include the database name and implies the same database as the view to create.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{array} [options.pipeline] An array that consists of the aggregation pipeline stage. db.createView creates the view by applying the specified pipeline to the viewOn collection or view.",
      "name": "[options.pipeline]",
      "description": "An array that consists of the aggregation pipeline stage. db.createView creates the view by applying the specified pipeline to the viewOn collection or view.",
      "types": [
        "array"
      ],
      "typesDescription": "<code>array</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [options.collation] Specifies the default collation for the collection. Collation allows users to specify language-specific rules for string comparison, such as rules for lettercase and accent marks.",
      "name": "[options.collation]",
      "description": "Specifies the default collation for the collection. Collation allows users to specify language-specific rules for string comparison, such as rules for lettercase and accent marks.",
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
    "full": "Creates a new collection or view </core/views> .",
    "summary": "Creates a new collection or view </core/views> .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 204,
  "codeStart": 248,
  "code": "createCollection(name, options) {\n  options = options || {};\n\n  // We have special handling for the 'flags' field, and provide sugar for specific flags. If the\n  // user specifies any flags we send the field in the command. Otherwise, we leave it blank and\n  // use the server's defaults.\n  let sendFlags = false;\n  let flags = 0;\n  if (options.usePowerOf2Sizes) {\n    this.log(\n      \"WARNING: The 'usePowerOf2Sizes' flag is ignored in 3.0 and higher as all MMAPv1 \" +\n      \"collections use fixed allocation sizes unless the 'noPadding' flag is specified\");\n\n    sendFlags = true;\n    if (options.usePowerOf2Sizes) {\n      flags |= 1;  // Flag_UsePowerOf2Sizes\n    }\n    delete options.usePowerOf2Sizes;\n  }\n\n  if (options.noPadding) {\n    sendFlags = true;\n    if (options.noPadding) {\n      flags |= 2;  // Flag_NoPadding\n    }\n    delete options.noPadding;\n  }\n\n  // New flags must be added above here.\n  if (sendFlags) {\n    if (options.flags) {\n      throw Error(\"Can't set 'flags' with either 'usePowerOf2Sizes' or 'noPadding'\");\n    }\n\n    options.flags = flags;\n  }\n\n  let cmd = Object.assign({ create: name }, options);\n  return this.runCommand(cmd);\n}",
  "ctx": {
    "type": "method",
    "name": "createCollection",
    "string": "createCollection()"
  }
}