module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{integer} level Specifies a profiling level, which is either ``0`` for no profiling, ``1`` for only slow operations, or ``2`` for all operations.",
      "name": "level",
      "description": "Specifies a profiling level, which is either ``0`` for no profiling, ``1`` for only slow operations, or ``2`` for all operations.",
      "types": [
        "integer"
      ],
      "typesDescription": "<a href=\"integer.html\">integer</a>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{integer} [slowms] Sets the threshold in milliseconds for the profile to consider a query or operation to be slow.",
      "name": "[slowms]",
      "description": "Sets the threshold in milliseconds for the profile to consider a query or operation to be slow.",
      "types": [
        "integer"
      ],
      "typesDescription": "<a href=\"integer.html\">integer</a>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    }
  ],
  "description": {
    "full": "Modifies the current database profiler level used by the database profiling system to capture data about performance. The method provides a wrapper around the database command  profile .",
    "summary": "Modifies the current database profiler level used by the database profiling system to capture data about performance. The method provides a wrapper around the database command  profile .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1421,
  "codeStart": 1427,
  "code": "setProfilingLevel(level, slowms) {}",
  "ctx": {
    "type": "method",
    "name": "setProfilingLevel",
    "string": "setProfilingLevel()"
  }
}