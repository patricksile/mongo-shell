module.exports = {
  "tags": [
    {
      "type": "returns",
      "string": "A document with the status of the replica set, using data polled from the oplog . Use this output when diagnosing issues with replication.",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false,
      "description": "A document with the status of the replica set, using data polled from the oplog . Use this output when diagnosing issues with replication."
    }
  ],
  "description": {
    "full": "",
    "summary": "",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 548,
  "codeStart": 551,
  "code": "getReplicationInfo() {\n  // @TODO: this has async methods in it!\n  let localdb = this.getSiblingDB('local');\n\n  let result = {};\n  let oplog;\n  let localCollections = localdb.getCollectionNames();\n  if (localCollections.indexOf('oplog.rs') >= 0) {\n    oplog = 'oplog.rs';\n  } else if (localCollections.indexOf('oplog.$main') >= 0) {\n    oplog = 'oplog.$main';\n  } else {\n    result.errmsg = 'neither master/slave nor replica set replication detected';\n    return result;\n  }\n\n  let ol = localdb.getCollection(oplog);\n  let olStats = ol.stats();\n  if (olStats && olStats.maxSize) {\n    result.logSizeMB = olStats.maxSize / (1024 * 1024);\n  } else {\n    result.errmsg = `Could not get stats for local.${oplog} collection. ` +\n                    `collstats returned: ${JSON.stringify(olStats)}`;\n    return result;\n  }\n\n  result.usedMB = olStats.size / (1024 * 1024);\n  result.usedMB = Math.ceil(result.usedMB * 100) / 100;\n\n  let firstc = ol.find().sort({$natural: 1}).limit(1);\n  let lastc = ol.find().sort({$natural: -1}).limit(1);\n  if (!firstc.hasNext() || !lastc.hasNext()) {\n    result.errmsg = 'objects not found in local.oplog.$main -- is this a new and empty db instance?';\n    result.oplogMainRowCount = ol.count();\n    return result;\n  }\n\n  let first = firstc.next();\n  let last = lastc.next();\n  let tfirst = first.ts;\n  let tlast = last.ts;\n\n  if (tfirst && tlast) {\n    tfirst = tsToSeconds(tfirst);\n    tlast = tsToSeconds(tlast);\n    result.timeDiff = tlast - tfirst;\n    result.timeDiffHours = Math.round(result.timeDiff / 36) / 100;\n    result.tFirst = (new Date(tfirst * 1000)).toString();\n    result.tLast = (new Date(tlast * 1000)).toString();\n    result.now = Date();\n  } else {\n    result.errmsg = 'ts element not found in oplog objects';\n  }\n\n  return result;\n}",
  "ctx": {
    "type": "method",
    "name": "getReplicationInfo",
    "string": "getReplicationInfo()"
  }
}