module.exports = {
  "tags": [],
  "description": {
    "full": "Prints a formatted report of the replica set member's oplog . The displayed report formats the data returned by db.getReplicationInfo() .",
    "summary": "Prints a formatted report of the replica set member's oplog . The displayed report formats the data returned by db.getReplicationInfo() .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1157,
  "codeStart": 1160,
  "code": "printReplicationInfo() {\n  return this.context.rs.printReplicationInfo()\n}",
  "ctx": {
    "type": "method",
    "name": "printReplicationInfo",
    "string": "printReplicationInfo()"
  }
}