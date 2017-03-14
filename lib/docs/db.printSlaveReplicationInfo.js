module.exports = {
  "tags": [],
  "description": {
    "full": "Returns a formatted report of the status of a replica set  from the perspective of the secondary member of the set. The output is identical to that of rs.printSlaveReplicationInfo() .",
    "summary": "Returns a formatted report of the status of a replica set  from the perspective of the secondary member of the set. The output is identical to that of rs.printSlaveReplicationInfo() .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1173,
  "codeStart": 1176,
  "code": "printSlaveReplicationInfo() {\n  return this.context.rs.printSlaveReplicationInfo()    \n}",
  "ctx": {
    "type": "method",
    "name": "printSlaveReplicationInfo",
    "string": "printSlaveReplicationInfo()"
  }
}