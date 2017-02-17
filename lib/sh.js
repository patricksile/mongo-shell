const co = require('co');
const assert = require('assert');

const {
  commandWorked,
  sleep
} = require('./helpers');

const {
  ErrorCodes
} = require('./error_codes');

function _checkMongos(self) {
  return co(function*() {
    const result = yield self.state.client.command({ismaster:true});
    if (result.msg != 'isdbgrid') {
      throw new Error('not connected to a mongos');
    }
  });
}

function _getConfigDb(self, configDB) {
  return co(function*() {
    if (configDB && configDB.name) {
      return self.state.client.db(configDB.name);
    }

    // Check mongos
    yield _checkMongos(self);
    // Return the config db
    return self.state.client.db('config');
  });
}

function _adminCommand(self, cmd, skipCheck) {
  return co(function*() {
    if (!skipCheck) {
      yield _checkMongos(self);
    }

    // Run the command against admin
    return yield self.state.client.db('admin').run(cmd);
  });
}

function _checkFullName(fullName) {
  if(!fullName) throw new Error("need a full name");
  if(fullName.indexOf(".") == -1) {
    throw new Error("name needs to be fully qualified <db>.<collection>'")
  }
}

function _writeOK(result) {
  var errMsg = null;

  if (res instanceof WriteResult) {
    if (res.hasWriteError()) {
      errMsg = `write failed with error: JSON.stringify(res, null, 2)`;
    } else if (res.getWriteConcernError()) {
      errMsg = `write concern failed with errors: JSON.stringify(res, null, 2)`;
    }
  } else if (res instanceof BulkWriteResult) {
    // Can only happen with bulk inserts
    if (res.hasWriteErrors()) {
      errMsg = `write failed with errors: JSON.stringify(res, null, 2)`;
    } else if (res.getWriteConcernError()) {
      errMsg = `write concern failed with errors: JSON.stringify(res, null, 2)`;
    }
  } else if (res instanceof WriteCommandError) {
    // Can only happen with bulk inserts
    errMsg = `write command failed: JSON.stringify(res, null, 2)`;
  } else {
    if (!res || !res.ok) {
      errMsg = `unknown type of write result, cannot check ok: JSON.stringify(res, null, 2)`;
    }
  }

  return errMsg == null;
}

class Sharded {
  constructor(state, outputStream) {
    this.state = state;
    this.context = state.context;
    this.outputStream = outputStream;
  }

  status(verbose = false, configDB) {
    return printShardingStatus(this, this.state, configDB, verbose);
  }

  addShard(url) {
    return _adminCommand(this, {addShard:url}, true);
  }

  enableSharding(dbName) {
    if (!dbName) throw new Error(`need a valid dbname`);
    return _adminCommand(this, {enableSharding:dbName});
  }

  shardCollection(fullName, key, unique, options) {
    const self = this;

    return co(function*() {
      _checkFullName(fullName);
      if(!key) throw new Error("need a key");
      if(!typeof(key) == "object") throw new Error("key needs to be an object");

      var cmd = {shardCollection: fullName, key: key};
      if (unique) {
        cmd.unique = true;
      }

      if (options) {
        if (typeof(options) !== "object") {
          throw new Error("options must be an object");
        }

        cmd = Object.assign(cmd, options);
      }

      return yield _adminCommand(self, cmd);
    });
  }

  splitFind(fullName, find) {
    const self = this;

    return co(function*() {
      _checkFullName(fullName);
      return yield _adminCommand(self, {split: fullName, find: find});
    });
  }

  splitAt(fullName, middle) {
    const self = this;

    return co(function*() {
      _checkFullName(fullName);
      return yield _adminCommand(self, {split: fullName, middle: middle});
    });
  }

  moveChunk(fullName, find, to) {
    const self = this;

    return co(function*() {
      _checkFullName(fullName);
      return yield _adminCommand(self, {moveChunk: fullName, find: find, to: to});
    });
  }

  setBalancerState(isOn) {
    const self = this;

    return co(function*() {
      if (isOn) return self.startBalancer();
      return self.stopBalancer();
    });
  }

  stopBalancer(timeoutMS = 60000, interval) {
    const self = this;

    return co(function*() {
      const result = _adminCommand(self, {balancerStop: 1, maxTimeMS: timeoutMS});
      return commandWorked(result);
    });
  }

  startBalancer(timeoutMS = 60000, interval) {
    const self = this;

    return co(function*() {
      const result = _adminCommand(self, {balancerStart: 1, maxTimeMS: timeoutMS});
      return commandWorked(result);
    });
  }

  enableAutoSplit(configDB) {
    const self = this;

    return co(function*() {
      configDB = yield _getConfigDb(self, configDB);
      // Update the split settings
      const result = yield configDB.collection('settings')
        .updateOne(
          {_id: 'autosplit'},
          {$set: {enabled: true}},
          {upsert: true, w: 'majority', wtimeout: 30000}
        );

      return _writeOK(result);
    });
  }

  disableAutoSplit(configDB) {
    const self = this;

    return co(function*() {
      configDB = yield _getConfigDb(self, configDB);
      // Update the split settings
      const result = yield configDB.collection('settings')
        .updateOne(
          {_id: 'autosplit'},
          {$set: {enabled: false}},
          {upsert: true, w: 'majority', wtimeout: 30000}
        );

      return _writeOK(result);
    });
  }

  getBalancerLockDetails(configDB) {
    const self = this;

    return co(function*() {
      configDB = yield _getConfigDb(self, configDB);

      var lock = yield configDB
        .collection('locks')
        .findOne({_id: 'balancer'});

      if(!lock || lock && lock.state == 0) {
        return null;
      }

      return lock;
    });
  }

  getShouldAutoSplit(configDB) {
    const self = this;

    return co(function*() {
      configDB = yield _getConfigDb(self, configDB);

      const result = yield configDB
        .collection('settings')
        .findOne({_id: 'autosplit'});
      if(result == null) {
        return true;
      }

      return result.enabled;
    });
  }

  waitForPingChange(activePings, timeout, interval) {
    const self = this;

    return co(function*() {
      const configDB = yield _getConfigDb(self);

      var isPingChanged = function(activePing) {
        return co(function*() {
          var newPing = yield configDB.collection('mongos').findOne({_id: activePing._id});
          return !newPing || newPing.ping + "" != activePing.ping + "";
        });
      };

      // First wait for all active pings to change, so we're sure a settings reload
      // happened

      // Timeout all pings on the same clock
      var start = new Date();

      var remainingPings = [];
      for (var i = 0; i < activePings.length; i++) {
        var activePing = activePings[i];
        self.outputStream.log(`Waiting for active host ${activePing._id}  to recognize new settings... (ping : ${activePing.ping})`);

        // Do a manual timeout here, avoid scary assert.soon errors
        var timeout = timeout || 30000;
        var interval = interval || 200;
        var _isPingChanged = yield isPingChanged(activePing);

        while (_isPingChanged != true) {
          if ((new Date()).getTime() - start.getTime() > timeout) {
            self.outputStream.log(`Waited for active ping to change for host ${activePing._id}` +
                  `, a migration may be in progress or the host may be down.`);
            remainingPings.push(activePing);
            break;
          }

          // Sleep for a little
          yield sleep(interval);
          // Check if ping changed
          _isPingChanged = yield isPingChanged(activePing);
        }
      }

      return remainingPings;
    });
  }

  disableBalancing(coll) {
    const self = this;

    return co(function*() {
      if(!coll) throw new Error(`Must specify collection`);
      yield _checkMongos(self);
      const result = yield self.state.client
        .db('config')
        .collection('collections')
        .updateOne(
          {_id: coll + ""},
          {$set: {"noBalance": true}},
          {w: 'majority', wtimeout: 60000}
        )
      return _writeOK(result);
    });
  }

  enableBalancing(coll) {
    const self = this;

    return co(function*() {
      if(!coll) throw new Error(`Must specify collection`);
      yield _checkMongos(self);
      const result = yield self.state.client
        .db('config')
        .collection('collections')
        .updateOne(
          {_id: coll + ""},
          {$set: {"noBalance": false}},
          {w: 'majority', wtimeout: 60000}
        )
      return _writeOK(result);
    });
  }

  addShardTag(shard, tag) {
    const self = this;

    return co(function*() {
      let result = yield self.addShardToZone(shard, tag);
      if (result.code != ErrorCodes.CommandNotFound) {
        return result;
      }

      // Get the config db
      const configDB = yield _getConfigDb(self);
      // Attempt to find the shard description
      result = yield configDB.collection('shards').findOne({_id: shard});
      if (!result) throw new Error(`can't find a shard with name: ${shard}`);

      // Update the shard description with the tag
      result = yield configDB.collection('shards').updateOne(
        {_id: shard},
        {$addToSet: {tags: tag}},
        {w: 'majority', wtimeout: 60000}
      );

      return _writeOK(result);
    });
  }

  removeShardTag(shard, tag) {
    const self = this;

    return co(function*() {
      let result = yield self.addShardToZone(shard, tag);
      if (result.code != ErrorCodes.CommandNotFound) {
        return result;
      }

      // Get the config db
      const configDB = yield _getConfigDb(self);
      // Attempt to find the shard description
      result = yield configDB.collection('shards').findOne({_id: shard});
      if (!result) throw new Error(`can't find a shard with name: ${shard}`);

      // Update the shard description with the tag
      result = yield configDB.collection('shards').updateOne(
        {_id: shard},
        {$pull: {tags: tag}},
        {w: 'majority', wtimeout: 60000}
      );

      return _writeOK(result);
    });
  }

  addTagRange(ns, min, max, tag) {
    const self = this;

    return co(function*() {
      let result = yield self.updateZoneKeyRange(ns, min, max, tag);
      if (result.code != ErrorCodes.CommandNotFound) {
        return result;
      }

      try {
        assert.notDeepEqual(min, max);
      } catch(err) {
        throw new Error(`min and max cannot be the same`);
      }

      // Get the config db
      const configDB = yield _getConfigDb(self);
      // Update the shard description with the tag
      result = yield configDB.collection('tags').updateOne(
        {_id: {ns: ns, min: min}},
        {_id: {ns: ns, min: min}, ns: ns, min: min, max: max, tag: tag},
        {upsert: true, w: 'majority', wtimeout: 60000}
      );

      return _writeOK(result);
    });
  }

  removeTagRange(ns, min, max, tag) {
    const self = this;

    return co(function*() {
      let result = yield self.removeRangeFromZone(ns, min, max, tag);
      if (result.code != ErrorCodes.CommandNotFound) {
        return result;
      }

      // Get the config db
      const configDB = yield _getConfigDb(self);

      // warn if the namespace does not exist, even dropped
      result = yield configDB.collection('collections').findOne({_id: ns});
      if (!result) {
        self.outputStream.log(`Warning: can't find the namespace: ${ns} - collection likely never sharded`);
      }

      // warn if the tag being removed is still in use
      result = yield configDB.collection('shards').findOne({tags: tag});
      if(result) {
        self.outputStream.log(`Warning: tag still in use by at least one shard`);
      }

      // max and tag criteria not really needed, but including them avoids potentially unexpected
      // behavior.
      result = yield configDB.collection('tags').deleteOne(
        {_id: {ns: ns, min: min}, max: max, tag: tag},
        {w: 'majority', wtimeout: 60000}
      );

      return _writeOK(result);
    });
  }

  addShardToZone(shardName, zoneName) {
    const self = this;

    return co(function*() {
      // Get the config db
      const configDB = yield _getConfigDb(self);
      // Execute addShardToZone command
      return configDB.db('admin').command({addShardToZone: shardName, zone: zoneName});
    });
  }

  removeShardFromZone(shardName, zoneName) {
    const self = this;

    return co(function*() {
      // Get the config db
      const configDB = yield _getConfigDb(self);
      // Execute addShardToZone command
      return configDB.db('admin').command({removeShardFromZone: shardName, zone: zoneName});
    });
  }

  updateZoneKeyRange(ns, min, max, zoneName) {
    const self = this;

    return co(function*() {
      // Get the config db
      const configDB = yield _getConfigDb(self);
      // Execute addShardToZone command
      return configDB.db('admin').command({updateZoneKeyRange: ns, min: min, max: max, zone: zoneName});
    });
  }

  removeRangeFromZone(ns, min, max) {
    const self = this;

    return co(function*() {
      // Get the config db
      const configDB = yield _getConfigDb(self);
      // Execute addShardToZone command
      return configDB.db('admin').command({updateZoneKeyRange: ns, min: min, max: max, zone: null});
    });
  }

  getBalancerState(configDB) {
    const self = this;

    return co(function*() {
      configDB = yield _getConfigDb(self, configDB);

      const result = yield configDB
        .collection('settings')
        .findOne({_id: 'balancer'});
      if(result == null) {
        return true;
      }

      return !result.stopped;
    });
  }

  isBalancerRunning(configDB) {
    const self = this;

    return co(function*() {
      configDB = yield _getConfigDb(self, configDB);

      const result = yield self.state.client
        .db('admin')
        .command({balancerStatus:1});
      return commandWorked(result).inBalancerRound;
    });
  }

  getBalancerWindow(configDB) {
    const self = this;

    return co(function*() {
      configDB = yield _getConfigDb(self, configDB);

      const settings = yield configDB
        .collection('settings')
        .findOne({_id: 'balancer'});

      if (settings && settings.activeWindow) {
        return settings.activeWindow;
      }

      return null;
    });
  }

  getActiveMigrations(configDB) {
    const self = this;

    return co(function*() {
      configDB = yield _getConfigDb(self, configDB);

      const activeLocks = yield configDB
        .collection('locks')
        .find({state: {$eq: 2}, _id: {$ne: "balancer"}})
        .toArray();

      // Map all active locks
      return activeLocks.map(lock => {
        return {_id: lock._id, when: lock.when}
      });
    });
  }

  getRecentFailedRounds(configDB) {
    const self = this;

    return co(function*() {
      configDB = yield _getConfigDb(self, configDB);

      const balErrs = yield configDB
        .collection('actionlog')
        .find({what: "balancer.round"})
        .sort({time: -1})
        .limit(5)
        .toArray();

      var result = {count: 0, lastErr: "", lastTime: " "};
      balErrs.forEach(r => {
        if (r.details.errorOccured) {
          result.count += 1;
          result.lastErr = r.details.errmsg;
          result.lastTime = r.time;
        }
      });

      // Map all active locks
      return result;
    });
  }

  getRecentMigrations(configDB) {
    const self = this;

    return co(function*() {
      configDB = yield _getConfigDb(self, configDB);
      const yesterday = new Date(new Date() - 24 * 60 * 60 * 1000);

      // Successful migrations.
      let result = yield configDB
        .collection('changelog')
        .aggregate([
           {
             $match: {
                 time: {$gt: yesterday},
                 what: "moveChunk.from",
                 'details.errmsg': {$exists: false},
                 'details.note': 'success'
             }
           },
           {$group: {_id: {msg: "$details.errmsg"}, count: {$sum: 1}}},
           {$project: {_id: {$ifNull: ["$_id.msg", "Success"]}, count: "$count"}}
        ])
        .toArray();

      let results = yield configDB
        .collection('changelog')
        .aggregate([
            {
              $match: {
                  time: {$gt: yesterday},
                  what: "moveChunk.from",
                  $or: [
                      {'details.errmsg': {$exists: true}},
                      {'details.note': {$ne: 'success'}}
                  ]
              }
            },
            {
              $group: {
                  _id: {msg: "$details.errmsg", from: "$details.from", to: "$details.to"},
                  count: {$sum: 1}
              }
            },
            {
              $project: {
                  _id: {$ifNull: ['$_id.msg', 'aborted']},
                  from: "$_id.from",
                  to: "$_id.to",
                  count: "$count"
              }
            }
        ])
        .toArray()

      // Failed migrations.
      result = result.concat(results);

      // Map all active locks
      return result;
    });
  }

  waitForBalancer(onOrNot, timeout, interval) {
    const self = this;

    return co(function*() {
      const configDB = yield _getConfigDb(self);
      // If we're waiting for the balancer to turn on or switch state or go to a particular state
      if (onOrNot) {
        // Just wait for the balancer lock to change, can't ensure we'll ever see it actually locked
        yield _waitForDLock(self, "balancer", undefined, timeout, interval);
      } else {
        // Otherwise we need to wait until we're sure balancing stops
        var activePings = [];
        const mongoses = yield configDB.collection('mongos').find().toArray();
        mongoses.forEach(function(ping) {
          if (!ping.waiting) {
            activePings.push(ping);
          }
        });

        self.outputStream.log("Waiting for active hosts...");
        activePings = yield self.waitForPingChange(activePings, 60 * 1000);

        // After 1min, we assume that all hosts with unchanged pings are either offline (this is
        // enough time for a full errored balance round, if a network issue, which would reload
        // settings) or balancing, which we wait for next. Legacy hosts we always have to wait for.
        self.outputStream.log("Waiting for the balancer lock...");

        // Wait for the balancer lock to become inactive. We can guess this is stale after 15 mins,
        // but need to double-check manually.
        try {
          yield _waitForDLock(self, "balancer", false, 15 * 60 * 1000);
        } catch (e) {
          self.outputStream.log(
              "Balancer still may be active, you must manually verify this is not the case using the config.changelog collection.");
          throw Error(e);
        }

        self.outputStream.log("Waiting again for active hosts after balancer is off...");

        // Wait a short time afterwards, to catch the host which was balancing earlier
        activePings = yield self.waitForPingChange(activePings, 5 * 1000);

        // Warn about all the stale host pings remaining
        activePings.forEach(function(activePing) {
            self.outputStream.log("Warning : host " + activePing._id + " seems to have been offline since " +
                  activePing.ping);
        });
      }
    }).catch(err=> console.log(err));
  }
}

function _waitForDLock(self, lockId, onOrNot, timeout, interval) {
  return co(function*() {
    var state = onOrNot;
    // Wait for balancer to be on or off
    // Can also wait for particular balancer state
    const configDB = yield _getConfigDb(self);

    var beginTS = undefined;
    if (state == undefined) {
      var currLock = yield configDB.collection('locks').findOne({_id: lockId});
      if (currLock != null) {
        beginTS = currLock.ts;
      }
    }

    var lockStateOk = function() {
      return co(function*() {
        var lock = yield configDB.collection('locks').findOne({_id: lockId});

        if (state == false)
          return !lock || lock.state == 0;
        if (state == true)
          return lock && lock.state == 2;
        if (state == undefined)
          return (beginTS == undefined && lock) ||
            (beginTS != undefined && (!lock || lock.ts + "" != beginTS + ""));
        else
          return lock && lock.state == state;
      })
    };

    return yield _soon(
      lockStateOk,
      "Waited too long for lock " + lockId + " to " +
          (state == true ? "lock" : (state == false ? "unlock" : "change to state " + state)),
      timeout,
      interval);
  });
}

function _soon(func, msg, timeout, interval) {
  return co(function*() {
    if (msg) {
      if (typeof(msg) != "function") {
        msg = `assert.soon failed, msg:${msg}`;
      }
    } else {
      msg = `assert.soon failed: ${func}`;
    }

    var start = new Date();
    timeout = timeout || 5 * 60 * 1000;
    interval = interval || 200;
    var last;

    while (1) {
      let result = yield func();
      if(result) return;

      diff = (new Date()).getTime() - start.getTime();
      if (diff > timeout) {
        throw new Error(msg)
      }

      yield sleep(interval);
    }
  });
}

function printShardingStatus(self, state, configDB, verbose = false) {
  return co(function*() {
    const output = [];
    // configDB is a DB object that contains the sharding metadata of interest.
    // Defaults to the db named "config" on the current connection.
    configDB = yield _getConfigDb(self, configDB);
    let version = yield configDB.collection("version").findOne();
    // No version found, the db does not have sharding enabled
    if (version == null) {
      throw new Error("printShardingStatus: this db does not have sharding enabled. be sure you are connecting to a mongos from the shell and not to a mongod.");
    }

    output.push(`--- Sharding Status --- \n`);
    output.push(`  sharding version: ${JSON.stringify(version, null, 2)}`);

    output.push(`  shards:`);

    // Get all the shards info
    const shards = yield configDB.collection("shards")
        .find({})
        .sort({_id: 1})
        .toArray();

    shards.forEach(function(z) {
      output.push(`\t${JSON.stringify(z)}`);
    });

    // (most recently) active mongoses
    var mongosActiveThresholdMs = 60000;
    var mostRecentMongos = yield configDB.collection('mongos')
      .find().sort({ping: -1}).limit(1).next();
    var mostRecentMongosTime = null;
    var mongosAdjective = "most recently active";

    if (mostRecentMongos) {
      mostRecentMongosTime = mostRecentMongos.ping;
      // Mongoses older than the threshold are the most recent, but cannot be
      // considered "active" mongoses. (This is more likely to be an old(er)
      // configdb dump, or all the mongoses have been stopped.)
      if (mostRecentMongosTime.getTime() >= Date.now() - mongosActiveThresholdMs) {
        mongosAdjective = "active";
      }
    }

    output.push(`  ${mongosAdjective} mongoses:`);

    if (mostRecentMongosTime === null) {
      output.push(`\tnone`);
    } else {
      var recentMongosQuery = {
        ping: {
          $gt: (function() {
            var d = mostRecentMongosTime;
            d.setTime(d.getTime() - mongosActiveThresholdMs);
            return d;
          })()
        }
      };

      if (verbose) {
        let mongoses = yield configDB.collection('mongos')
          .find(recentMongosQuery).sort({ping: -1}).toArray()

        mongoses.forEach(function(z) {
          output.push(`\t${JSON.stringify(z)}`);
        });
      } else {
        let mongoses = yield configDB
            .collection('mongos')
            .aggregate([
                {$match: recentMongosQuery},
                {$group: {_id: "$mongoVersion", num: {$sum: 1}}},
                {$sort: {num: -1}}
            ])
            .toArray();
        mongoses.forEach(function(z) {
          output.push(`\t${JSON.stringify(z._id, null, 2)} : ${z.num}`);
        });
      }
    }

    output.push(` autosplit:`);

    // locate the state of the components
    const isAutoSplitEnabled = yield self.getShouldAutoSplit(configDB);
    const isBalancerEnabled = yield self.getBalancerState(configDB);
    const isBalancerRunning = yield self.isBalancerRunning(configDB);

    // Is autosplit currently enabled
    output.push(`\tCurrently enabled: ${isAutoSplitEnabled ? "yes" : "no"}`);
    output.push(`  balancer:`);

    // Is the balancer currently enabled
    output.push(`\tCurrently enabled:  ${isBalancerEnabled ? "yes" : "no"}`);

    // Is the balancer currently active
    output.push(`\tCurrently running:  ${isBalancerRunning ? "yes" : "no"}`);

    // Output details of the current balancer round
    var balLock = yield self.getBalancerLockDetails(configDB);
    if (balLock) {
      output.push(`\t\tBalancer lock taken at ${balLock.when} by ${balLock.who}`);
    }

    // Output the balancer window
    var balSettings = yield self.getBalancerWindow(configDB);
    if (balSettings) {
      output.push(`\t\tBalancer active window is set between ${balSettings.start} and ${balSettings.stop} server local time`);
    }

    // Output the list of active migrations
    var activeMigrations = yield self.getActiveMigrations(configDB);
    if (activeMigrations.length > 0) {
      output.push(`\tCollections with active migrations: `);
      activeMigrations.forEach(function(migration) {
        output.push(`\t\t${migration._id.capitalizeFirstLetter()} started at ${migration.when}`);
      });
    }

    // Actionlog and version checking only works on 2.7 and greater
    var versionHasActionlog = false;
    version = yield configDB.collection("version").findOne();
    var metaDataVersion = version.currentVersion;

    if (metaDataVersion > 5) {
      versionHasActionlog = true;
    }

    if (metaDataVersion == 5) {
      // db.serverBuildInfo()
      var serverBuildInfo = yield configDB.db('admin').command({buildInfo:true});
      var verArray = serverBuildInfo.versionArray;

      if (verArray[0] == 2 && verArray[1] > 6) {
        versionHasActionlog = true;
      }
    }

    if (versionHasActionlog) {
      // Review config.actionlog for errors
      var actionReport = yield self.getRecentFailedRounds(configDB);
      // Always print the number of failed rounds
      output.push(`\tFailed balancer rounds in last 5 attempts:  ${actionReport.count}`);

      // Only print the errors if there are any
      if (actionReport.count > 0) {
        output.push(`\tLast reported error:  ${actionReport.lastErr}`);
        output.push(`\tTime of Reported error:  ${actionReport.lastTime}`);
      }

      output.push(`\tMigration Results for the last 24 hours: `);
      var migrations = yield self.getRecentMigrations(configDB);
      if (migrations.length > 0) {
        migrations.forEach(function(x) {
          if (x._id === "Success") {
            output.push(`\t\t${x.count} : ${x._id}`);
          } else {
            output.push(`\t\t${x.count} : Failed with error '${x._id}', from ${x.from} to ${x.to}`);
          }
        });
      } else {
        output.push(`\t\tNo recent migrations`);
      }
    }

    output.push(`  databases:`);

    // Get all the databases
    const databases = yield configDB.collection('databases')
      .find().sort({name: 1}).toArray();

    for (let i = 0; i < databases.length; i++) {
      const db = databases[i];

      var truthy = function(value) {
        return !!value;
      };

      var nonBooleanNote = function(name, value) {
        // If the given value is not a boolean, return a string of the
        // form " (<name>: <value>)", where <value> is converted to JSON.
        var t = typeof(value);
        var s = "";
        if (t != "boolean" && t != "undefined") {
            s = ` (${name}: ${JSON.stringify(value, null, 2)})`;
        }
        return s;
      };

      output.push(`\t${JSON.stringify(db)}`);

      if (db.partitioned) {
        const collections = yield configDB.collection('collections')
            .find({_id: new RegExp(`^${RegExp.escape(db._id)}\\.`)})
            .sort({_id: 1})
            .toArray();

        for (let j = 0; j < collections.length; j++) {
          const coll = collections[j];

          if (!coll.dropped) {
            output.push(`\t\t${coll._id}`);
            output.push(`\t\t\tshard key: ${JSON.stringify(coll.key, null, 2)}`);
            output.push(`\t\t\tunique: ${truthy(coll.unique)}${nonBooleanNote("unique", coll.unique)}`);
            output.push(`\t\t\tbalancing: ${!truthy(coll.noBalance)}${nonBooleanNote("noBalance", coll.noBalance)}`);
            output.push(`\t\t\tchunks:`);

            const res = yield configDB
                .collection('chunks')
                .aggregate({$match: {ns: coll._id}},
                           {$group: {_id: "$shard", cnt: {$sum: 1}}},
                           {$project: {_id: 0, shard: "$_id", nChunks: "$cnt"}},
                           {$sort: {shard: 1}})
                .toArray();

            var totalChunks = 0;
            res.forEach(function(z) {
              totalChunks += z.nChunks;
              output.push(`\t\t\t\t${z.shard}\t${z.nChunks}`);
            });

            if (totalChunks < 20 || verbose) {
              const chunks = yield configDB
                  .collection('chunks')
                  .find({"ns": coll._id})
                  .sort({min: 1})
                  .toArray();

              chunks.forEach(function(chunk) {
                output.push(`\t\t\t${JSON.stringify(chunk.min, null, 2)} -->> ` +
                    `${JSON.stringify(chunk.max, null, 2)} on : ${chunk.shard} ` +
                    `${JSON.stringify(chunk.lastmod, null, 2)} ` +
                    `${chunk.jumbo ? "jumbo " : ""}`);
              });
            } else {
              output.push(
                  `\t\t\ttoo many chunks to print, use verbose if you want to force print`);
            }

            const tags = yield configDB
                .collection('tags')
                .find({ns: coll._id})
                .sort({min: 1})
                .toArray();

            tags.forEach(function(tag) {
              output.push(`\t\t\t tag: ${tag.tag} ${JSON.stringify(tag.min, null, 2)} ` +
               `-->> ${JSON.stringify(tag.max, null, 2)}`);
            });
          }
        }
      }
    }

    // Render the output
    output.push('');
    return output.join(`\n`);
  }).catch(err => {
    console.log(err);
  });
}

module.exports = Sharded;
