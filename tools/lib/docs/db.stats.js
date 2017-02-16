module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{number} [scale] The scale at which to deliver results. Unless specified, this command returns all data in bytes.",
      "name": "[scale]",
      "description": "The scale at which to deliver results. Unless specified, this command returns all data in bytes.",
      "types": [
        "number"
      ],
      "typesDescription": "<code>number</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    }
  ],
  "description": {
    "full": "Returns statistics that reflect the use state of a single database .",
    "summary": "Returns statistics that reflect the use state of a single database .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1022,
  "codeStart": 1027,
  "code": "stats(scale) {\n  return this.runCommand({ dbstats: 1, scale: scale });\n}",
  "ctx": {
    "type": "method",
    "name": "stats",
    "string": "stats()"
  }
}