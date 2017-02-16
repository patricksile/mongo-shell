module.exports = {
  "tags": [],
  "description": {
    "full": "Unlocks a mongod instance to allow writes and reverses the operation of a db.fsyncLock() operation. Typically you will use db.fsyncUnlock() following a database backup operation </core/backups> .",
    "summary": "Unlocks a mongod instance to allow writes and reverses the operation of a db.fsyncLock() operation. Typically you will use db.fsyncUnlock() following a database backup operation </core/backups> .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 433,
  "codeStart": 436,
  "code": "fsyncUnlock() {\n  return adminCommand(this, { fsyncUnlock: 1 })\n    .catch(res => {\n      // if (commandUnsupported(res)) {\n      //     var _readPref = this.getMongo().getReadPrefMode();\n      //     try {\n      //         this.getMongo().setReadPref(null);\n      //         res = this.getSiblingDB(\"admin\").$cmd.sys.unlock.findOne();\n      //     } finally {\n      //         this.getMongo().setReadPref(_readPref);\n      //     }\n      // }\n    });\n}",
  "ctx": {
    "type": "method",
    "name": "fsyncUnlock",
    "string": "fsyncUnlock()"
  }
}