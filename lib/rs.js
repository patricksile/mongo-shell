const co = require('co');

// const { getErrorWithCode } = require('./helpers');
const { tsToSeconds } = require('./utilities');

class ReplicaSet {
  constructor(state) {
    this.state = state;
    this.context = state.context;
  }

  /**
   * Adds a new replicaset node to the set.
   *
   * @param {string} host The host and port of the server we wish to add ex: localhost:32000
   * @param {boolean} arbiter=false Is the host we are adding an arbiter
   * @return {object} returns the result of the replSetReconfig command
   */
  add(host, arbiter = false) {
    const self = this;

    return co(function*() {
      if(!host) throw new Error('hostname and port must be provided ex: "localhost:31000"')
      // Get the local db
      const local = self.state.client.db('local');
      // Assert there are no errors
      const count = yield local.collection('system.replset').count();
      if (count > 1) throw new Error("local.system.replset has unexpected contents");
      const configuration = yield local.collection('system.replset').findOne();
      if (!configuration) throw new Error("no config object retrievable from local.system.replset");

      // Increment the configuration version
      configuration.version = configuration.version + 1;

      // Find max id from the members
      let max = Math.max(...[{_id: 0}].concat(configuration.members).map(m => m._id));
      // Create config object
      const memberConfiguration = {
        _id: max + 1, host: host
      }

      if (arbiter) {
        memberConfiguration.arbiterOnly = true;
      }

      // Get admin db
      const admin = self.state.client.db('admin');

      // Add member configuration to list of members
      configuration.members.push(memberConfiguration);
      return admin.command({replSetReconfig: configuration});
    });
  }

  /**
   * Adds a new replicaset arbiter node to the set.
   *
   * @param {string} host The host and port of the server we wish to add ex: localhost:32000
   * @return {object} returns the result of the replSetReconfig command
   */
  addArb(host) {
    return this.add(host, true);
  }

  /**
   * Remove a node from the replicaset
   *
   * @param {string} host The host and port of the server we wish to add ex: localhost:32000
   * @return {object} returns the result of the replSetReconfig command
   */
  remove(host) {
    const self = this;

    return co(function*() {
      if(!host) throw new Error('hostname and port must be provided ex: "localhost:31000"')
      // Get the local db
      const local = self.state.client.db('local');
      // Assert there are no errors
      const count = yield local.collection('system.replset').count();
      if (count > 1) throw new Error("local.system.replset has unexpected contents");
      const configuration = yield local.collection('system.replset').findOne();
      if (!configuration) throw new Error("no config object retrievable from local.system.replset");

      // Increment the configuration version
      configuration.version = configuration.version + 1;

      // Get admin db
      const admin = self.state.client.db('admin');

      // Splice the member out
      for (let i in configuration.members) {
        if (configuration.members[i].host == host) {
          configuration.members.splice(i, 1);
          return admin.command({replSetReconfig: configuration});
        }
      }

      // Could not find the host to remove, error out
      throw new Error(`could not find ${host} in ${JSON.stringify(configuration.members)}`);
    });
  }

  /**
   * Return the replicaset status
   *
   * @return {object} returns the result of the replSetGetStatus command
   */
  status() {
    const admin = this.state.client.db('admin');
    return admin.command({replSetGetStatus: true});
  }

  /**
   * Remove a node from the replicaset
   *
   * @param {number} stepdownSecs=60 The number of seconds to step down the primary, during which time the stepdown member is ineligible for becoming primary. If you specify a non-numeric value, the command uses 60 seconds.
   * @param {number} [catchUpSecs] The number of seconds that the mongod will wait for an electable secondary to catch up to the primary.
   * @param {boolean} [options.force=false] A boolean that determines whether the primary steps down if no electable and up-to-date secondary exists within the wait period.
   * @return {object} returns the result of the replSetStepDown command
   */
  stepDown(stepdownSecs = 60, catchUpSecs, options = {}) {
    if (!typeof stepdownSecs == 'number') throw new Error(`stepdownSecs must a number`);
    const command = { replSetStepDown: stepdownSecs };
    if (typeof catchUpSecs == 'number') {
      command['secondaryCatchUpPeriodSecs'] = catchUpSecs;
    }

    const admin = this.state.client.db('admin');
    return admin.command(command);
  }

  /**
   * Temporarily overrides the default sync target for the current mongod. This operation is useful for testing different patterns and in situations where a set member is not replicating from the desired host.
   *
   * @param {string} host The host and port of the server we wish to add ex: localhost:32000
   * @return {object} returns the result of the replSetSyncFrom command
   */
  syncFrom(host) {
    if (!typeof stepdownSecs == 'string') throw new Error(`host must be a string`);
    const admin = this.state.client.db('admin');
    return admin.command({replSetSyncFrom: host});
  }

  /**
   * The replSetFreeze command prevents a replica set member from seeking election for the specified number of seconds.
   *
   * @param {number} seconds The number of seconds the current node should wait before seeking an election.
   * @return {object} returns the result of the replSetFreeze command
   */
  freeze(seconds) {
    if (!typeof seconds == 'number') throw new Error(`seconds must a number`);
    const admin = this.state.client.db('admin');
    return admin.command({replSetFreeze: seconds});
  }

  /**
   * Retrieve the current Replicaset configuration.
   *
   * @return {object} returns the Replicaset configuration.
   */
  config() {
    const self = this;

    return co(function*() {
      try {
        const admin = self.state.client.db('admin');
        const result = yield admin.command({replSetGetConfig: 1});
        return result.config;
      } catch(err) {
        if (err.message.startsWith('no such cmd')) {
          return self.state.client.db('local').collection('system.replset').findOne();
        } else {
          throw new Error(`Could not retrieve replica set config: ${JSON.stringify(err)}`);
        }
      }
    });
  }

  /**
   * The reconfig command modifies the configuration of an existing replica set. You can use this command to add and remove members, and to alter the options set on existing members. Use the following syntax:
   *
   * @param {object} configuration The ReplicaSet configuration object used to reconfigure the replicaset.
   * @param {boolean} [options.force=false] A boolean that determines whether the reconfiguration should be forced.
   * @return {object} returns the result of the replSetGetConfig command
   */
  reconfig(configuration, options = {}) {
    const self = this;

    return co(function*() {
      const admin = self.state.client.db('admin');
      // Get current configuration
      const _conf = yield self.config();
      // Update configuration version
      configuration.version = _conf.version + 1;
      // Execute reconfigure
      return admin.command(Object.assign(
        {replSetGetConfig: configuration},
        options
      ));
    });
  }

  /**
   * The initiate command initializes a new replica set.
   *
   * @param {object} [configuration] The ReplicaSet configuration object used to initiate the replicaset.
   * @return {object} returns the result of the replSetInitiate command
   */
  initiate(configuration = true) {
    const admin = this.state.client.db('admin');
    return admin.command({ replSetInitiate: configuration });
  }

  /**
   * Returns a formatted report of the status of a replica set from the perspective of the secondary member of the set. The output is identical to that of rs.printSlaveReplicationInfo().
   */
  printSlaveReplicationInfo() {
    const self = this;

    return co(function*() {
      var startOptimeDate = null;
      var primary = null;
      var results = [];

      function getReplLag(st) {
        if (!startOptimeDate) throw new Error(`how could this be null (getReplLag startOptimeDate)`);
        results.push(`\tsyncedTo: ${st}`);

        var ago = (startOptimeDate - st) / 1000;
        var hrs = Math.round(ago / 36) / 100;

        var suffix = primary
          ? "primary "
          : "freshest member (no primary available at the moment)";
        results.push(`\t${Math.round(ago)} secs (${hrs} hrs) behind the ${suffix}`);
      }

      function getMaster(members) {
        return members.filter(member => member.state === 1)[0];
      }

      function g(x) {
          if (!x) throw new Error(`how could this be null (printSlaveReplicationInfo gx)`);
          results.push(`source: ${x.host}`);

          if (x.syncedTo) {
            getReplLag(new Date(tsToSeconds(x.syncedTo) * 1000));
          } else {
            results.push(`\tdoing initial sync`);
          }
      }

      function r(x) {
        if (!x) throw new Error(`how could this be null (printSlaveReplicationInfo rx)`);
        if (x.state == 1 || x.state == 7) {  // ignore primaries (1) and arbiters (7)
          return;
        }

        results.push(`source: ${x.name}`);

        if (x.optime) {
          getReplLag(x.optimeDate);
        } else {
          results.push(`\tno replication info, yet.  State: ${x.stateStr}`);
        }
      }

      // Get the local db
      const local = self.state.client.db("local");
      const admin = self.state.client.db('admin');

      // Get the replicaset count
      const count = yield local.collection('system.replset').count();
      const sourceCount = yield local.collection('sources').count();

      // Do we have a replicaset configuration
      if (count != 0) {
        // Get the current replicaset status
        const status = yield admin.command({'replSetGetStatus': 1});
        // Get the primary
        primary = getMaster(status.members);

        // If we have a primary set it's optimeDate as start time
        if (primary) {
          startOptimeDate = primary.optimeDate;
        } else {
          // Sort members by latest optime
          startOptimeDate = status.members
            .map(m => m.optimeDate)
            .sort((a, b) => a <= b)[0];
        }

        // Go over all the members
        for (let member in status.members) {
          r(status.members[member]);
        }
      } else if (sourceCount != 0) {
        startOptimeDate = new Date();
        // Get all the sources
        const sources = yield local.collection('sources').find({}).toArray();
        // Appy the g method to all entries
        sources.forEach(source => g(source));
      } else {
        results.push("local.sources is empty; is this db a --slave?");
      }

      return results.join('\n');
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  /**
    Get a replication log information summary.
    <p>
    This command is for the database/cloud administer and not applicable to most databases.
    It is only used with the local database.  One might invoke from the JS shell:
    <pre>
         use local
         db.getReplicationInfo();
    </pre>
    It is assumed that this database is a replication master -- the information returned is
    about the operation log stored at local.oplog.$main on the replication master.  (It also
    works on a machine in a replica pair: for replica pairs, both machines are "masters" from
    an internal database perspective.
    <p>
    * @return Object timeSpan: time span of the oplog from start to end  if slave is more out
    *                          of date than that, it can't recover without a complete resync
  */
  getReplicationInfo() {
    var self = this;

    return co(function*() {
      const local = self.state.client.db('local');

      var result = {};
      var oplog;

      // Get the local collection names
      const localCollectionNames = yield local.listCollections().toArray()
        .then(collections => collections.map(c => c.name));

      if (localCollectionNames.indexOf('oplog.rs') >= 0) {
        oplog = 'oplog.rs';
      } else if (localCollectionNames.indexOf('oplog.$main') >= 0) {
        oplog = 'oplog.$main';
      } else {
        throw new Error(`neither master/slave nor replica set replication detected`);
      }

      // Get the oplog collection
      var ol = local.collection(oplog);
      // Get the collection stats
      var ol_stats = yield ol.stats();

      // Check if we have the maxSize otherwise error out
      if (ol_stats && ol_stats.maxSize) {
        result.logSizeMB = ol_stats.maxSize / (1024 * 1024);
      } else {
        throw new Error(`Could not get stats for local.${oplog} collection. collstats returned: ${JSON.stringify(ol_stats)}`);
      }

      result.usedMB = ol_stats.size / (1024 * 1024);
      result.usedMB = Math.ceil(result.usedMB * 100) / 100;

      // Get the first and last oplog entry
      var first = yield ol.find({}).sort({$natural: 1}).limit(1).next();
      var last = yield ol.find({}).sort({$natural: -1}).limit(1).next();
      // Count of oplog entries
      var count = yield ol.count();

      // If cannot find the first and last oplog entry error out
      if (!first || !last) {
        throw Object.assign(new Error(`objects not found in local.oplog.$main -- is this a new and empty db instance?`), {
          oplogMainRowCount: count,
        });
      }

      // Get the timestamps
      var tfirst = first.ts;
      var tlast = last.ts;

      // If we have both a first and last timestamp
      if (tfirst && tlast) {
        tfirst = tsToSeconds(tfirst);
        tlast = tsToSeconds(tlast);
        result.timeDiff = tlast - tfirst;
        result.timeDiffHours = Math.round(result.timeDiff / 36) / 100;
        result.tFirst = (new Date(tfirst * 1000)).toString();
        result.tLast = (new Date(tlast * 1000)).toString();
        result.now = Date();
      } else {
        throw new Error(`ts element not found in oplog objects`);
      }

      return result;
    }).catch(err => {
      return Promise.reject(err);
    })
  };

  printReplicationInfo() {
    const self = this;

    return co(function*() {
      const results = [];

      try {
        var result = yield self.getReplicationInfo();
        results.push(`configured oplog size:   ${result.logSizeMB} MB`);
        results.push(`log length start to end: ${result.timeDiff} secs (${result.timeDiffHours} hrs)`);
        results.push(`oplog first event time:  ${result.tFirst}`);
        results.push(`oplog last event time:   ${result.tLast}`);
        results.push(`now:                     ${result.now}`);
        return results.join('\n');
      } catch(err) {
        const ismaster = self.state.client.command({ismaster:true});

        if (ismaster.arbiterOnly) {
          throw new Error(`cannot provide replication status from an arbiter.`);
        } else if (!ismaster.ismaster) {
          results.push(`this is a slave, printing slave replication info.`);
          const replicationInfo = yield self.printSlaveReplicationInfo();
          results.push(replicationInfo);
          return results.join('\n');
        }

        // Return raw error
        return result;
      }
    });
  }
}

module.exports = ReplicaSet;
