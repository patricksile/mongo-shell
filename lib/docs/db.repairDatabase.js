module.exports = {
  "tags": [
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
    "full": "db.repairDatabase() provides a wrapper around the database command repairDatabase, and has the same effect as the run-time option mongod --repair option, limited to  the current database. See repairDatabase for full documentation.",
    "summary": "db.repairDatabase() provides a wrapper around the database command repairDatabase, and has the same effect as the run-time option mongod --repair option, limited to  the current database. See repairDatabase for full documentation.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1193,
  "codeStart": 1198,
  "code": "repairDatabase() {\n  return this.runCommand({ repairDatabase: 1 });\n}",
  "ctx": {
    "type": "method",
    "name": "repairDatabase",
    "string": "repairDatabase()"
  }
}