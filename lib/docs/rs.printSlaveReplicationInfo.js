module.exports = {
  "tags": [],
  "description": {
    "full": "Returns a formatted report of the status of a replica set from the perspective of the secondary member of the set. The output is identical to that of rs.printSlaveReplicationInfo().",
    "summary": "Returns a formatted report of the status of a replica set from the perspective of the secondary member of the set. The output is identical to that of rs.printSlaveReplicationInfo().",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 201,
  "codeStart": 204,
  "code": "printSlaveReplicationInfo() {\n  const self = this;\n\n  return co(function*() {\n    var startOptimeDate = null;\n    var primary = null;\n    var results = [];\n\n    function getReplLag(st) {\n      if (!startOptimeDate) throw new Error(`how could this be null (getReplLag startOptimeDate)`);\n      results.push(`\\tsyncedTo: ${st}`);\n\n      var ago = (startOptimeDate - st) / 1000;\n      var hrs = Math.round(ago / 36) / 100;\n\n      var suffix = primary\n        ? \"primary \"\n        : \"freshest member (no primary available at the moment)\";\n      results.push(`\\t${Math.round(ago)} secs (${hrs} hrs) behind the ${suffix}`);\n    }\n\n    function getMaster(members) {\n      return members.filter(member => member.state === 1)[0];\n    }\n\n    function g(x) {\n        if (!x) throw new Error(`how could this be null (printSlaveReplicationInfo gx)`);\n        results.push(`source: ${x.host}`);\n\n        if (x.syncedTo) {\n          getReplLag(new Date(tsToSeconds(x.syncedTo) * 1000));\n        } else {\n          results.push(`\\tdoing initial sync`);\n        }\n    }\n\n    function r(x) {\n      if (!x) throw new Error(`how could this be null (printSlaveReplicationInfo rx)`);\n      if (x.state == 1 || x.state == 7) {  // ignore primaries (1) and arbiters (7)\n        return;\n      }\n\n      results.push(`source: ${x.name}`);\n\n      if (x.optime) {\n        getReplLag(x.optimeDate);\n      } else {\n        results.push(`\\tno replication info, yet.  State: ${x.stateStr}`);\n      }\n    }\n\n    // Get the local db\n    const local = self.client.db(\"local\");\n\n    // Get the replicaset count\n    const count = yield local.collection('system.replset').count();\n    const sourceCount = yield local.collection('sources').count();\n\n    // Do we have a replicaset configuration\n    if (count != 0) {\n      // Get the current replicaset status\n      const status = yield self.admin.command({'replSetGetStatus': 1});\n      // Get the primary\n      primary = getMaster(status.members);\n\n      // If we have a primary set it's optimeDate as start time\n      if (primary) {\n        startOptimeDate = primary.optimeDate;\n      } else {\n        // Sort members by latest optime\n        startOptimeDate = status.members\n          .map(m => m.optimeDate)\n          .sort((a, b) => a <= b)[0];\n      }\n\n      // Go over all the members\n      for (let member in status.members) {\n        r(status.members[member]);\n      }\n    } else if (sourceCount != 0) {\n      startOptimeDate = new Date();\n      // Get all the sources\n      const sources = yield local.collection('sources').find({}).toArray();\n      // Appy the g method to all entries\n      sources.forEach(source => g(source));\n    } else {\n      results.push(\"local.sources is empty; is this db a --slave?\");\n    }\n\n    return results.join('\\n');\n  }).catch(err => {\n    return Promise.reject(err);\n  });\n}",
  "ctx": {
    "type": "method",
    "name": "printSlaveReplicationInfo",
    "string": "printSlaveReplicationInfo()"
  }
}