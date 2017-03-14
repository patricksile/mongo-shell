module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following example converts the returned values to kilobytes\ndb.stats(1024)"
    },
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
    "full": "Returns statistics that reflect the use state of a single database .",
    "summary": "Returns statistics that reflect the use state of a single database .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1445,
  "codeStart": 1453,
  "code": "stats(scale) {\n  return this.runCommand({ dbstats: 1, scale: scale });\n}",
  "ctx": {
    "type": "method",
    "name": "stats",
    "string": "stats()"
  }
}