module.exports = {
  "tags": [],
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
  "line": 426,
  "codeStart": 429,
  "code": "fsyncLock() {\n  return adminCommand(this, { fsync: 1, lock: true });\n}",
  "ctx": {
    "type": "method",
    "name": "fsyncLock",
    "string": "fsyncLock()"
  }
}