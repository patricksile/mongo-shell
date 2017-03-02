module.exports = {
  "tags": [
    {
      "type": "return",
      "string": "Object timeSpan: time span of the oplog from start to end  if slave is more out\n                         of date than that, it can't recover without a complete resync",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false,
      "description": "Object timeSpan: time span of the oplog from start to end if slave is more out                          of date than that, it can't recover without a complete resync"
    }
  ],
  "description": {
    "full": "Get a replication log information summary.\n    <p>\n    This command is for the database/cloud administer and not applicable to most databases.\n    It is only used with the local database.  One might invoke from the JS shell:\n    <pre>\n         use local\n         db.getReplicationInfo();\n    </pre>\n    It is assumed that this database is a replication master -- the information returned is\n    about the operation log stored at local.oplog.$main on the replication master.  (It also\n    works on a machine in a replica pair: for replica pairs, both machines are \"masters\" from\n    an internal database perspective.\n    <p>",
    "summary": "Get a replication log information summary.\n    <p>\n    This command is for the database/cloud administer and not applicable to most databases.\n    It is only used with the local database.  One might invoke from the JS shell:\n    <pre>\n         use local\n         db.getReplicationInfo();\n    </pre>\n    It is assumed that this database is a replication master -- the information returned is\n    about the operation log stored at local.oplog.$main on the replication master.  (It also\n    works on a machine in a replica pair: for replica pairs, both machines are \"masters\" from\n    an internal database perspective.\n    <p>",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 313,
  "codeStart": 330,
  "code": "getReplicationInfo() {\n  var self = this;\n\n  return co(function*() {\n    const local = self.state.client.db('local');\n\n    var result = {};\n    var oplog;\n\n    // Get the local collection names\n    const localCollectionNames = yield local.listCollections().toArray()\n      .then(collections => collections.map(c => c.name));\n\n    if (localCollectionNames.indexOf('oplog.rs') >= 0) {\n      oplog = 'oplog.rs';\n    } else if (localCollectionNames.indexOf('oplog.$main') >= 0) {\n      oplog = 'oplog.$main';\n    } else {\n      throw new Error(`neither master/slave nor replica set replication detected`);\n    }\n\n    // Get the oplog collection\n    var ol = local.collection(oplog);\n    // Get the collection stats\n    var ol_stats = yield ol.stats();\n\n    // Check if we have the maxSize otherwise error out\n    if (ol_stats && ol_stats.maxSize) {\n      result.logSizeMB = ol_stats.maxSize / (1024 * 1024);\n    } else {\n      throw new Error(`Could not get stats for local.${oplog} collection. collstats returned: ${JSON.stringify(ol_stats)}`);\n    }\n\n    result.usedMB = ol_stats.size / (1024 * 1024);\n    result.usedMB = Math.ceil(result.usedMB * 100) / 100;\n\n    // Get the first and last oplog entry\n    var first = yield ol.find({}).sort({$natural: 1}).limit(1).next();\n    var last = yield ol.find({}).sort({$natural: -1}).limit(1).next();\n    // Count of oplog entries\n    var count = yield ol.count();\n\n    // If cannot find the first and last oplog entry error out\n    if (!first || !last) {\n      throw Object.assign(new Error(`objects not found in local.oplog.$main -- is this a new and empty db instance?`), {\n        oplogMainRowCount: count,\n      });\n    }\n\n    // Get the timestamps\n    var tfirst = first.ts;\n    var tlast = last.ts;\n\n    // If we have both a first and last timestamp\n    if (tfirst && tlast) {\n      tfirst = tsToSeconds(tfirst);\n      tlast = tsToSeconds(tlast);\n      result.timeDiff = tlast - tfirst;\n      result.timeDiffHours = Math.round(result.timeDiff / 36) / 100;\n      result.tFirst = (new Date(tfirst * 1000)).toString();\n      result.tLast = (new Date(tlast * 1000)).toString();\n      result.now = Date();\n    } else {\n      throw new Error(`ts element not found in oplog objects`);\n    }\n\n    return result;\n  }).catch(err => {\n    return Promise.reject(err);\n  })\n};\n\nprintReplicationInfo() {\n  const self = this;\n\n  return co(function*() {\n    const results = [];\n\n    try {\n      var result = yield self.getReplicationInfo();\n      results.push(`configured oplog size:   ${result.logSizeMB} MB`);\n      results.push(`log length start to end: ${result.timeDiff} secs (${result.timeDiffHours} hrs)`);\n      results.push(`oplog first event time:  ${result.tFirst}`);\n      results.push(`oplog last event time:   ${result.tLast}`);\n      results.push(`now:                     ${result.now}`);\n      return results.join('\\n');\n    } catch(err) {\n      const ismaster = self.state.client.command({ismaster:true});\n\n      if (ismaster.arbiterOnly) {\n        throw new Error(`cannot provide replication status from an arbiter.`);\n      } else if (!ismaster.ismaster) {\n        results.push(`this is a slave, printing slave replication info.`);\n        const replicationInfo = yield self.printSlaveReplicationInfo();\n        results.push(replicationInfo);\n        return results.join('\\n');\n      }\n\n      // Return raw error\n      return result;\n    }\n  });\n}\n}\n\nmodule.exports = ReplicaSet;",
  "ctx": {
    "type": "method",
    "name": "getReplicationInfo",
    "string": "getReplicationInfo()"
  }
}