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
    "full": "Forces the mongod to flush all pending write operations to disk and locks the   mongod instance to prevent additional writes until the user releases the lock with the db.fsyncUnlock() command. db.fsyncLock() is an administrative command.",
    "summary": "Forces the mongod to flush all pending write operations to disk and locks the   mongod instance to prevent additional writes until the user releases the lock with the db.fsyncUnlock() command. db.fsyncLock() is an administrative command.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 440,
  "codeStart": 445,
  "code": "fsyncLock() {\n  return this.adminCommand({ fsync: 1, lock: true });\n}",
  "ctx": {
    "type": "method",
    "name": "fsyncLock",
    "string": "fsyncLock()"
  }
}