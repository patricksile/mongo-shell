module.exports = {
  "tags": [],
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
  "line": 878,
  "codeStart": 881,
  "code": "repairDatabase() {\n  return this.runCommand({ repairDatabase: 1 });\n}",
  "ctx": {
    "type": "method",
    "name": "repairDatabase",
    "string": "repairDatabase()"
  }
}