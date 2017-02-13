'use strict';

const CollectionProxy = require('./collection_proxy');
const { getErrorWithCode, hashPassword } = require('./helpers');
const assert = require('assert');
const isString = require('util').isString;

const DEFAULT_WRITE_CONCERN = { w: 'majority', wtimeout: 5 * 60 * 1000 };

function getUserObjString(userObj) {
  let pwd = userObj.pwd;
  delete userObj.pwd;
  let toreturn = JSON.parse(JSON.stringify(userObj));
  userObj.pwd = pwd;
  return toreturn;
}

// if someone passes i.e. runCommand("foo", {bar: "baz"}
// we merge it in to runCommand({foo: 1, bar: "baz"}
// this helper abstracts that logic.
function mergeCommandOptions(commandName, extraKeys) {
  'use strict';
  let mergedCmdObj = {};
  mergedCmdObj[commandName] = 1;

  if (typeof(extraKeys) === 'object') {
    // this will traverse the prototype chain of extra, but keeping
    // to maintain legacy behavior
    for (let key in extraKeys) {
      mergedCmdObj[key] = extraKeys[key];
    }
  }

  return mergedCmdObj;
}

function getQueryOptions(db) {
  // @TODO: implement me
}

function adminCommand(db, obj, options) {
  if (db.name === 'admin') {
    return db.runCommand(obj, options);
  }

  return db.getSiblingDB('admin').runCommand(obj, options);
}

function tsToSeconds(x) {
  return (x.t && x.i) ? x.t : x / 4294967296;  // low 32 bits are ordinal #s within a second
}

function modifyCommandToDigestPasswordIfNecessary(cmd, username) {
  if (!cmd.pwd) {
    return;
  }

  if (cmd.digestPassword) {
    throw Error("Cannot specify 'digestPassword' through the user management shell helpers, use 'passwordDigestor' instead");
  }

  let passwordDigestor = cmd.passwordDigestor ? cmd.passwordDigestor : 'client';
  if (passwordDigestor === 'server') {
    cmd.digestPassword = true;
  } else if (passwordDigestor === 'client') {
    cmd.pwd = hashPassword(username, cmd.pwd);
    cmd.digestPassword = false;
  } else {
    throw Error(`'passwordDigestor' must be either 'server' or 'client', got: '${passwordDigestor}'`);
  }

  delete cmd.passwordDigestor;
}


class Db {
  constructor(name, client, context = {}) {
    this.name = name;
    this.client = client;
    this.context = context;
  }

  static proxy(name, client, context = {}) {
    return new Proxy(new Db(name, client, context), {
      get: function(target, _name) {
        if (target[_name]) return target[_name];
        // Save the current namespace
        context.__namespace = `${target.name}.${_name}`;
        // Return the collection
        return new CollectionProxy(client.db(target.name).collection(_name));
      }
    });
  }

  /**
   * Allows a user to authenticate to the database from within the shell.
   *
   * @param {string} username Specifies an existing username with access privileges for this database.
   * @param {string} password Specifies the corresponding password.
   * @param {string} [mechanism] Specifies the :ref:`authentication mechanism <mongo-shell-authentication-mechanisms>` used. Defaults to either:  - ``SCRAM-SHA-1`` on new 3.0 installations and on 3.0 databases that   have been :ref:`upgraded from 2.6 with authSchemaUpgrade   <upgrade-scram-scenarios>`; or  - ``MONGODB-CR`` otherwise.  .. versionchanged:: 3.0    In previous version, defaulted to ``MONGODB-CR``.  For available mechanisms, see :ref:`authentication mechanisms <mongo-shell-authentication-mechanisms>`.
   * @param {boolean} [digestPassword] Determines whether the server receives digested or undigested password. Set to false to specify undigested password. For use with :doc:`SASL/LDAP authentication </tutorial/configure-ldap-sasl-openldap>` since the server must forward an undigested password to ``saslauthd``.
   */
  auth(username, password, mechanism, digestPassword) {
    let options = {};
    if (mechanism) options.mechanism = mechanism;
    if (digestPassword) options.digestPassword = digestPassword;

    return this.client.db(this.name).authenticate(username, password, options);
  }

  /**
   * Updates a user's password. Run the method in the database where the user is defined, i.e. the database you created <db.createUser> the user.
   *
   * @param {string} username Specifies an existing username with access privileges for this database.
   * @param {string} password Specifies the corresponding password.
   * @param {object} [writeConcern] The level of write concern to apply to this operation. The ``writeConcern`` document uses the same fields as the `getLastError` command.
   */
  changeUserPassword(username, password, writeConcern) {
    return this.updateUser(username, { pwd: password }, writeConcern);
  }

  /**
   * Copies data directly between MongoDB instances. The db.cloneCollection() method wraps the cloneCollection database command and accepts the following arguments:
   *
   * @param {string} from The address of the server to clone from.
   * @param {string} collection The collection in the MongoDB instance that you want to copy. `db.cloneCollection()` will only copy the collection with this name from *database* of the same name as the current database the remote MongoDB instance.  If you want to copy a collection from a different database name you must use the `cloneCollection` directly.
   * @param {object} [query] A standard query document that limits the documents copied as part of the `db.cloneCollection()` operation.  All :ref:`query selectors <query-selectors>` available to the `find() <db.collection.find()>` are available here.
   */
  cloneCollection(from, collection, query) {
    assert(isString(from) && from.length);
    assert(isString(collection) && collection.length);
    collection = `${this.name}.${collection}`;
    query = query || {};
    return this.runCommand({ cloneCollection: collection, from: from, query: query });
  }

  /**
   * Copies a remote database to the current database. The command assumes that the remote database has the same name as the current database.
   *
   * @param {string} hostname The hostname of the database to copy.
   */
  cloneDatabase(hostname) {
    assert(isString(hostname) && hostname.length);
    return this.runCommand({ clone: hostname });
  }

  /**
   * Displays help text for the specified database command . See the /reference/command .
   *
   * @param {string} command The name of a :term:`database command`.
   */
  commandHelp(command) {
    let cmd = { help: true };
    cmd[command] = 1;
    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Copies a database either from one mongod instance to the current mongod instance or within the current mongod . db.copyDatabase() wraps the copydb command and takes the following arguments:
   *
   * @param {string} fromdb Name of the source database.
   * @param {string} todb Name of the target database.
   * @param {string} [fromhost] The hostname of the source :program:`mongod` instance. Omit  to copy databases within the same :program:`mongod` instance.
   * @param {string} [username] The name of the user on the ``fromhost`` MongoDB instance. The user authenticates to the ``fromdb``.  For more information, see :ref:`copyDatabase-access-control`.
   * @param {string} [password] The password on the ``fromhost`` for authentication. The method does **not** transmit the password in plaintext.  For more information, see :ref:`copyDatabase-access-control`.
   * @param {string} [mechanism] The mechanism to authenticate the ``username`` and ``password`` on the ``fromhost``. Specify either :ref:`MONGODB-CR <authentication-mongodb-cr>` or :ref:`SCRAM-SHA-1 <authentication-scram-sha-1>`.   `db.copyDatabase` defaults to :ref:`SCRAM-SHA-1 <authentication-scram-sha-1>` if the wire protocol version (:data:`~isMaster.maxWireVersion`) is greater than or equal to ``3`` (i.e. MongoDB versions 3.0 or greater). Otherwise, it defaults to :ref:`MONGODB-CR <authentication-mongodb-cr>`.  Specify ``MONGODB-CR`` to authenticate to the version 2.6.x ``fromhost`` from a version 3.0 instance or greater. For an example, see :ref:`example-copyDatabase-from-2.6`.  .. versionadded:: 3.0
   */
  copyDatabase(fromdb, todb, fromhost, username, password, mechanism) {}

  /**
   * Creates a new collection or view </core/views> .
   *
   * @param {string} name The name of the collection to create.
   * @param {object} [options] Configuration options for creating a capped collection, for preallocating space in a new collection, or for creating a view.
   */
  createCollection(name, options) {
    options = options || {};

    // We have special handling for the 'flags' field, and provide sugar for specific flags. If the
    // user specifies any flags we send the field in the command. Otherwise, we leave it blank and
    // use the server's defaults.
    let sendFlags = false;
    let flags = 0;
    if (options.usePowerOf2Sizes) {
      console.log(
        "WARNING: The 'usePowerOf2Sizes' flag is ignored in 3.0 and higher as all MMAPv1 " +
        "collections use fixed allocation sizes unless the 'noPadding' flag is specified");

      sendFlags = true;
      if (options.usePowerOf2Sizes) {
        flags |= 1;  // Flag_UsePowerOf2Sizes
      }
      delete options.usePowerOf2Sizes;
    }

    if (options.noPadding) {
      sendFlags = true;
      if (options.noPadding) {
        flags |= 2;  // Flag_NoPadding
      }
      delete options.noPadding;
    }

    // New flags must be added above here.
    if (sendFlags) {
      if (options.flags) {
        throw Error("Can't set 'flags' with either 'usePowerOf2Sizes' or 'noPadding'");
      }

      options.flags = flags;
    }

    let cmd = Object.assign({ create: name }, options);
    return this.runCommand(cmd);
  }

  /**
   * Creates a role in a database. You can specify privileges for the role by explicitly listing the privileges or by having the role inherit privileges from other roles or both. The role applies to the database on which you run the method.
   *
   * @param {object} role A document containing the name of the role and the role definition.
   * @param {object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` to apply to this operation. The ``writeConcern`` document uses the same fields as the `getLastError` command.
   */
  createRole(role, writeConcern) {
    let name = role.role;
    let cmd = Object.assign({ createRole: name }, role);
    delete cmd.role;
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Creates a new user for the database where the method runs. db.createUser()  returns a  error if the user already exists on the database.
   *
   * @param {object} user The document with authentication and access information about the user to create.
   * @param {object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the creation operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   */
  createUser(user, writeConcern) {
    let name = user.user;
    let cmd = Object.assign({ createUser: name }, user);
    delete cmd.user;

    modifyCommandToDigestPasswordIfNecessary(cmd, name);
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .then(() => console.log(`Successfully added user: ${getUserObjString(user)}`))
      .catch(res => {
        if (res.errmsg.match(/no such cmd: createUser/)) {
          throw Error("'createUser' command not found.  This is most likely because you are " +
                      'talking to an old (pre v2.6) MongoDB server');
        }


        if (res.errmsg.match(/timeout/)) {
          throw Error('timed out while waiting for user authentication to replicate - ' +
                      'database will not be fully secured until replication finishes');
        }

        throw getErrorWithCode(res, `couldn't add user: ${res.errmsg}`);
      });
  }

  /**
   * Creates a view </core/views> as the result of the applying the specified aggregation pipeline <aggregation-pipeline> to the source collection or view. Views act as read-only collections, and are computed on demand during read operations. MongoDB executes read operations on views as part of the underlying aggregation pipeline.
   *
   * @param {string} view The name of the view to create.
   * @param {string} source The name of the source collection or view from which to create the view. The name is not the full namespace of the collection or view; i.e. does not include the database name and implies the same database as the view to create.
   * @param {array} pipeline An array that consists of the :ref:`aggregation pipeline stage <aggregation-pipeline>`.  {{op}} creates the view by applying the specified ``pipeline`` to the {{source}}.  .. include:: /includes/extracts/views-public-definition.rst
   * @param {object} [options] Additional options for the method.
   */
  createView(view, source, pipeline, options) {
    if (source === undefined || source === null) {
      throw Error('Must specify a backing view or collection');
    }

    options = options || {};
    options.viewOn = source;

    // Since we allow a single stage pipeline to be specified as an object
    // in aggregation, we need to account for that here for consistency.
    if (pipeline) {
      if (!Array.isArray(pipeline)) pipeline = [ pipeline ];
    }
    options.pipeline = pipeline;

    let cmd = Object.assign({ create: view }, options);
    return this.runCommand(cmd);
  }

  /**
   * Returns a document that contains information on in-progress operations for the database instance.
   *
   * @param {boolean|document} [operations] Specifies the operations to report on. Can pass either a boolean or a document.  Specify ``true`` to include operations on idle connections and system operations. Specify a document with query conditions to report only on operations that match the conditions. See :ref:`currentOp-behavior` for details.
   */
  currentOp(operations) {
    let q = {};
    if (operations) {
      if (typeof(arg) === 'object') {
        q = Object.assign(q, operations);
      } else if (operations) {
        q.$all = true;
      }
    }

    let cmd = Object.assign({ currentOp: 1 }, q);
    return adminCommand(this, cmd)
      .catch(res => {
        // @TODO: implement me
        /*
        if (commandUnsupported(res)) {
            // always send legacy currentOp with default (null) read preference (SERVER-17951)
            var _readPref = this.getMongo().getReadPrefMode();
            try {
                this.getMongo().setReadPref(null);
                res = this.getSiblingDB("admin").$cmd.sys.inprog.findOne(q);
            } finally {
                this.getMongo().setReadPref(_readPref);
            }
        }
        */
      });
  }

  /**
   * Deletes all user-defined <user-defined-roles> roles on the database where you run the method.
   *
   * @param {object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   */
  dropAllRoles(writeConcern) {
    let cmd = { dropAllRolesFromDatabase: 1 };
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); })
      .then(res => res.n);
  }

  /**
   * Removes all users from the current database.
   *
   * @param {object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   */
  dropAllUsers(writeConcern) {
    let cmd = { dropAllUsersFromDatabase: 1 };
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .then(res => res.n)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Removes the current database, deleting the associated data files.
   */
  dropDatabase() {
    if (arguments.length) {
      throw Error("dropDatabase doesn't take arguments");
    }

    return this.runCommand({ dropDatabase: 1 });
  }

  /**
   * Deletes a user-defined <user-defined-roles> role from the database on which you run the method.
   *
   * @param {string} rolename The name of the :ref:`user-defined role <user-defined-roles>` to remove from the database.
   * @param {object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   */
  dropRole(rolename, writeConcern) {
    let cmd = { dropRole: rolename };
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .catch(res => {
        if (res.code === 31) return false;
        throw getErrorWithCode(res, res.errmsg);
      })
      .then(() => true);
  }

  /**
   * Removes the user from the current database.
   *
   * @param {string} username The name of the user to remove from the database.
   * @param {object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   */
  dropUser(username, writeConcern) {
    let cmd = { dropUser: username };
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .then(() => true)
      .catch(res => {
        if (res.code === 11 /* UserNotFound */) return false;

        if (res.errmsg.match(/no such cmd: dropUsers/)) {
          // @TODO: implement _removeUserV1
          // return this._removeUserV1(username, cmdObj['writeConcern']);
          throw res;
        }

        throw getErrorWithCode(res, res.errmsg);
      });
  }

  /**
   * Provides the ability to run JavaScript code on the MongoDB server.
   *
   * @param {func} func A JavaScript function to execute.
   * @param {list} [args] A list of arguments to pass to the JavaScript function. Omit if the function does not take arguments.
   */
  eval(func, ...args) {
    console.log('WARNING: db.eval is deprecated');

    let cmd = { $eval: func };
    if (args.length) cmd.args = args;

    return this.runCommand(cmd)
      .then(res => res.retval)
      .catch(res => { throw getErrorWithCode(res, JSON.stringify(res)); });
  }

  /**
   * Forces the mongod to flush all pending write operations to disk and locks the   mongod instance to prevent additional writes until the user releases the lock with the db.fsyncUnlock() command. db.fsyncLock() is an administrative command.
   */
  fsyncLock() {
    return adminCommand(this, { fsync: 1, lock: true });
  }

  /**
   * Unlocks a mongod instance to allow writes and reverses the operation of a db.fsyncLock() operation. Typically you will use db.fsyncUnlock() following a database backup operation </core/backups> .
   */
  fsyncUnlock() {
    return adminCommand(this, { fsyncUnlock: 1 })
      .catch(res => {
        // if (commandUnsupported(res)) {
        //     var _readPref = this.getMongo().getReadPrefMode();
        //     try {
        //         this.getMongo().setReadPref(null);
        //         res = this.getSiblingDB("admin").$cmd.sys.unlock.findOne();
        //     } finally {
        //         this.getMongo().setReadPref(_readPref);
        //     }
        // }
      });
  }

  /**
   * Returns a collection object that is functionally equivalent to using the syntax. The method is useful for a collection whose name might interact with the shell itself, such as names that begin with  or that match a database shell method </reference/method/js-database> .
   *
   * @param {string} name The name of the collection.
   */
  getCollection(name) {
    // @TODO: needs to be properly implemented
    return this.client.collection(name);
    // return new Collection(this._mongo, this, name, this.name + '.' + name);
  }

  /**
   * Returns an array of documents with collection or view </core/views> information, such as name and options, for the current database.
   *
   * @param {object} [filter]  An optional filter specified to match only collections with certain metadata.
   */
  getCollectionInfos() {
    return this.client.db(this.name).listCollections().toArray();
  }

  /**
   * Returns an array containing the names of all collections and views </core/views> in the current database.
   */
  getCollectionNames() {
    return this.client.db(this.name).listCollections().toArray()
      .then(collections => collections.map(c => c.name));
  }

  /**
   * The db.getLastError() can accept the following parameters:
   *
   * @param {int|string} [w] The write concern's ``w`` value.
   * @param {int} [wtimeout] The time limit in milliseconds.
   */
  getLastError(w, wtimeout) {
    return this.getLastErrorObj(w, wtimeout)
      .then(res => res.err)
      .catch(res => { throw getErrorWithCode(res, `getlasterror failed: ${JSON.stringify(res)}`); });
  }

  /**
   * The db.getLastErrorObj() can accept the following parameters:
   *
   * @param {int|string} [key] The write concern's ``w`` value.
   * @param {int} [wtimeout] The time limit in milliseconds.
   */
  getLastErrorObj(key, wtimeout) {
    let cmd = { getlasterror: 1 };
    if (key) {
      cmd.w = key;
      if (wtimeout) cmd.wtimeout = wtimeout;
    }

    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, `getlasterror failed: ${JSON.stringify(res)}`); });
  }

  /**
   * Returns the current verbosity settings. The verbosity settings determine the amount of /reference/log-messages that MongoDB produces for each log message component <log-message-components> .
   */
  getLogComponents() {}

  /**
   * @returns The current database connection.
   */
  getMongo() { return this.client; }

  /**
   * @returns the current database name.
   */
  getName() { return this.name; }

  /**
   * @returns A status document, containing the errors.
   */
  getPrevError() {
    return this.runCommand({ getpreverror: 1 });
  }

  /**
   * This method provides a wrapper around the database command " profile " and returns the current profiling level.
   */
  getProfilingLevel() {
    return this.runCommand({ profile: -1 })
      .then(res => res.was)
      .catch(res => null);
  }

  /**
   * @returns The current profile level and ~operationProfiling.slowOpThresholdMs setting.
   */
  getProfilingStatus() {
    return this.runCommand({ profile: -1 })
      .then(res => { delete res.ok; return res; })
      .catch(res => { throw getErrorWithCode(res, `profile command failed: ${JSON.stringify(res)}`); });
  }

  /**
   * @returns A document with the status of the replica set, using data polled from the oplog . Use this output when diagnosing issues with replication.
   */
  getReplicationInfo() {
    // @TODO: this has async methods in it!
    let localdb = this.getSiblingDB('local');

    let result = {};
    let oplog;
    let localCollections = localdb.getCollectionNames();
    if (localCollections.indexOf('oplog.rs') >= 0) {
      oplog = 'oplog.rs';
    } else if (localCollections.indexOf('oplog.$main') >= 0) {
      oplog = 'oplog.$main';
    } else {
      result.errmsg = 'neither master/slave nor replica set replication detected';
      return result;
    }

    let ol = localdb.getCollection(oplog);
    let olStats = ol.stats();
    if (olStats && olStats.maxSize) {
      result.logSizeMB = olStats.maxSize / (1024 * 1024);
    } else {
      result.errmsg = `Could not get stats for local.${oplog} collection. ` +
                      `collstats returned: ${JSON.stringify(olStats)}`;
      return result;
    }

    result.usedMB = olStats.size / (1024 * 1024);
    result.usedMB = Math.ceil(result.usedMB * 100) / 100;

    let firstc = ol.find().sort({$natural: 1}).limit(1);
    let lastc = ol.find().sort({$natural: -1}).limit(1);
    if (!firstc.hasNext() || !lastc.hasNext()) {
      result.errmsg = 'objects not found in local.oplog.$main -- is this a new and empty db instance?';
      result.oplogMainRowCount = ol.count();
      return result;
    }

    let first = firstc.next();
    let last = lastc.next();
    let tfirst = first.ts;
    let tlast = last.ts;

    if (tfirst && tlast) {
      tfirst = tsToSeconds(tfirst);
      tlast = tsToSeconds(tlast);
      result.timeDiff = tlast - tfirst;
      result.timeDiffHours = Math.round(result.timeDiff / 36) / 100;
      result.tFirst = (new Date(tfirst * 1000)).toString();
      result.tLast = (new Date(tlast * 1000)).toString();
      result.now = Date();
    } else {
      result.errmsg = 'ts element not found in oplog objects';
    }

    return result;
  }

  /**
   * Returns the roles from which this role inherits privileges. Optionally, the method can also return all the role's privileges.
   *
   * @param {string} rolename The name of the role.
   * @param {object} [args] A document specifying additional arguments.
   */
  getRole(rolename, args) {
    if (typeof rolename !== 'string') {
      throw Error('Role name for getRole shell helper must be a string');
    }

    let cmd = Object.assign({ rolesInfo: rolename }, args);
    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); })
      .then(res => (res.roles.length === 0) ? null : res.roles[0]);
  }

  /**
   * Returns information for all the roles in the database on which the command runs. The method can be run with or without an argument.
   *
   * @param {integer} rolesInfo Set this field to ``1`` to retrieve all user-defined roles.
   * @param {boolean} [showPrivileges] Set the field to ``true`` to show role privileges, including both privileges inherited from other roles and privileges defined directly. By default, the command returns only the roles from which this role inherits privileges and does not return specific privileges.
   * @param {boolean} [showBuiltinRoles] Set to true to display :ref:`built-in roles <built-in-roles>` as well as user-defined roles.
   */
  getRoles(rolesInfo, showPrivileges, showBuiltinRoles) {
    let cmd = { rolesInfo: 1 };
    if (showPrivileges) cmd.showPrivileges = showPrivileges;
    if (showBuiltinRoles) cmd.showBuiltinRoles = showBuiltinRoles;

    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); })
      .then(res => res.roles);
  }

  /**
   * @returns A database object.
   *
   * @param {string} database The name of a MongoDB database.
   */
  getSiblingDB(database) {
    return Db.proxy(database, this.client);
  }

  /**
   * Returns user information for a specified user. Run this method on the user's database. The user must exist on the database on which the method runs.
   *
   * @param {string} username The name of the user for which to retrieve information.
   * @param {object} [args] A document specifying additional arguments.
   */
  getUser(username, args) {
    if (typeof username !== 'string') {
      throw Error('User name for getUser shell helper must be a string');
    }

    let cmd = Object.assign({ usersInfo: username }, args);
    return this.runCommand(cmd)
      .then(res => (res.users.length === 0) ? null : res.users[0])
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Returns information for all the users in the database.
   *
   * @param {object} [args]
   */
  getUsers(args) {
    let cmd = Object.assign({ usersInfo: 1 }, args);

    return this.runCommand(cmd)
      .then(res => res.users)
      .catch(res => {
        if (res.code === 69 /* AUTH_SCHEMA_INCOMPATIBLE */ ||
            (res.code === null && res.errmsg.match(/no such cmd: usersInfo/))) {
          // Working with 2.4 schema user data
          // @TODO: this.system??
          return this.system.users.find({}).toArray();
        }

        throw getErrorWithCode(res, res.errmsg);
      });
  }

  /**
   * Grants additional privileges <privileges> to a user-defined <user-defined-roles> role.
   *
   * @param {string} rolename The name of the role to grant privileges to.
   * @param {array} privileges The privileges to add to the role. For the format of a privilege, see :data:`~admin.system.roles.privileges`.
   * @param {object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   */
  grantPrivilegesToRole(rolename, privileges, writeConcern) {
    let cmd = { grantPrivilegesToRole: rolename, privileges: privileges };
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Grants roles to a user-defined role <user-defined-roles> .
   *
   * @param {string} rolename The name of the role to which to grant sub roles.
   * @param {array} roles An array of roles from which to inherit.
   * @param {object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   */
  grantRolesToRole(rolename, roles, writeConcern) {
    let cmd = { grantRolesToRole: rolename, roles: roles };
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Grants additional roles to a user.
   *
   * @param {string} user The name of the user to whom to grant roles.
   * @param {array} roles An array of additional roles to grant to the user.
   * @param {object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   */
  grantRolesToUser(user, roles, writeConcern) {
    const options = {
      grantRolesToUser: user,
      roles: roles,
      writeConcern: writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN
    };

    return this.runCommand(options);
  }

  /**
   * @returns Text output listing common methods on the  object.
   */
  help() {
    // @TODO: implement me
  }

  /**
   * @returns A document with information about the underlying system that the mongod or mongos runs on. Some of the returned fields are only included on some platforms.
   */
  hostInfo() {
    return adminCommand(this, 'hostInfo');
  }

  /**
   * @returns A document that describes the role of the mongod instance.
   */
  isMaster() {
    return this.runCommand('isMaster');
  }

  /**
   * Terminates an operation as specified by the operation ID. To find operations and their corresponding IDs, see db.currentOp() .
   *
   * @param {number} op An operation ID.
   */
  killOp(op) {
    if (!op) {
      throw Error('no opNum to kill specified');
    }

    return this.adminCommand({ killOp: 1, op: op })
      .catch(err => {
        // @TODO: implement
        /*
        if (commandUnsupported(res)) {
            // fall back for old servers
            var _readPref = this.getMongo().getReadPrefMode();
            try {
                this.getMongo().setReadPref(null);
                res = this.getSiblingDB("admin").$cmd.sys.killop.findOne({'op': op});
            } finally {
                this.getMongo().setReadPref(_readPref);
            }
        }
        */
      });
  }

  /**
   * Provides a list of all database commands. See the /reference/command document for a more extensive index of these options.
   */
  listCommands() {
    return this.runCommand('listCommands')
      .then(x => {
        for (let name in x.commands) {
          let c = x.commands[name];
          let s = name + ': ';
          if (c.adminOnly) s += ' adminOnly ';
          if (c.slaveOk) s += ' slaveOk ';

          s += '\n  ';
          s += c.help.replace(/\n/g, '\n  ');
          s += '\n';

          console.log(s);
        }
      });
  }

  /**
   * db.loadServerScripts() loads all scripts in the collection for the current database into the mongo shell session.
   */
  loadServerScripts() {
    // @TODO: implement me
  }

  /**
   * Ends the current authentication session. This function has no effect if the current session is not authenticated.
   */
  logout() {
    return this.client.logout();
  }

  /**
   * Provides a wrapper around the db.collection.stats()  method. Returns statistics from every collection separated by three hyphen characters.
   *
   * @param {number} scale
   */
  printCollectionStats(scale) {
    if (arguments.length > 1) {
      throw new Error('printCollectionStats() has a single optional argument (scale)');
    }

    if (typeof scale !== 'undefined') {
      if (typeof scale !== 'number') {
        throw new Error('scale has to be a number >= 1');
      }

      if (scale < 1) {
        throw new Error('scale has to be >= 1');
      }
    }

    let mydb = this;
    return this.getCollectionNames()
      .then(names => names.forEach(z => {
        console.log(z);
        console.log(mydb.getCollection(z).stats(scale));
        console.log('---');
      }));
  }

  /**
   * Prints a formatted report of the replica set member's oplog . The displayed report formats the data returned by db.getReplicationInfo() .
   */
  printReplicationInfo() {}

  /**
   * Prints a formatted report of the sharding configuration and the information regarding existing chunks in a sharded cluster .
   *
   * @param {boolean} [verbose] If ``true``, the method displays details of the document distribution across chunks when you have 20 or more chunks.
   */
  printShardingStatus(verbose) {}

  /**
   * Returns a formatted report of the status of a replica set  from the perspective of the secondary member of the set. The output is identical to that of rs.printSlaveReplicationInfo() .
   */
  printSlaveReplicationInfo() {}

  /**
   * Removes the specified username from the database.
   *
   * @param {string} username The database username.
   * @param {object} [writeConcern]
   */
  removeUser(username, writeConcern) {
    console.log('WARNING: db.removeUser has been deprecated, please use db.dropUser instead');
    return this.dropUser(username, writeConcern);
  }

  /**
   * db.repairDatabase() provides a wrapper around the database command repairDatabase, and has the same effect as the run-time option mongod --repair option, limited to  the current database. See repairDatabase for full documentation.
   */
  repairDatabase() {
    return this.runCommand({ repairDatabase: 1 });
  }

  /**
   * Resets the error message returned by db.getPrevError or getPrevError . Provides a wrapper around the resetError command.
   */
  resetError() {
    return this.runCommand({ reseterror: 1 });
  }

  /**
   * Removes the specified privileges from the user-defined <user-defined-roles> role on the database where the method runs. The revokePrivilegesFromRole method has the following syntax:
   *
   * @param {string} rolename The name of the :ref:`user-defined <user-defined-roles>` role from which to revoke privileges.
   * @param {array} privileges An array of privileges to remove from the role.  See :data:`~admin.system.roles.privileges` for more information on the format of the privileges.
   * @param {object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   */
  revokePrivilegesFromRole(rolename, privileges, writeConcern) {
    let cmd = { revokePrivilegesFromRole: rolename, privileges: privileges };
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Removes the specified inherited roles from a role.
   *
   * @param {string} rolename The name of the role from which to revoke roles.
   * @param {array} roles The inherited roles to remove.
   * @param {object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` to apply to this operation. The ``writeConcern`` document uses the same fields as the `getLastError` command.
   */
  revokeRolesFromRole(rolename, roles, writeConcern) {
    let cmd = { revokeRolesFromRole: rolename, roles: roles };
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Removes a one or more roles from a user on the current database. The db.revokeRolesFromUser() method uses the following syntax:
   *
   * @param {string} user The name of the user from whom to revoke roles.
   * @param {array} roles The roles to remove from the user.
   * @param {object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   */
  revokeRolesFromUser(user, roles, writeConcern) {
    const options = {
      revokeRolesFromUser: user,
      roles: roles,
      writeConcern: writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN
    };

    return this.runCommand(options);
  }

  /**
   * Provides a helper to run specified database commands </reference/command> . This is the preferred method to issue database commands, as it provides a consistent interface between the shell and drivers.
   *
   * @param {object|string} command "A :term:`database command`, specified either in :term:`document` form or as a string. If specified as a string, `db.runCommand()` transforms the string into a document."
   * @param {object} [extra]
   * @param {object} [queryOptions]
   */
  runCommand(command, extra, queryOptions) {
    let mergedObj = (typeof(command) === 'string') ? mergeCommandOptions(command, extra) : command;

    // if options were passed (i.e. because they were overridden on a collection), use them.
    // Otherwise use getQueryOptions.
    let options = (typeof(queryOptions) !== 'undefined') ? queryOptions : getQueryOptions(this);

    return this.client.db(this.name).command(mergedObj, options)
      .catch(res => {
        // When runCommand flowed through query, a connection error resulted in the message
        // "error doing query: failed". Even though this message is arguably incorrect
        // for a command failing due to a connection failure, we preserve it for backwards
        // compatibility. See SERVER-18334 for details.
        if (res.message.match(/network error/)) {
          throw new Error(`error doing query: failed: ${res.message}`);
        }

        throw res;
      });
  }

  /**
   * Provides a wrapper around the buildInfo  database command . buildInfo returns a document that contains an overview of parameters used to compile this mongod  instance.
   */
  serverBuildInfo() {
    return adminCommand(this, 'buildinfo');
  }

  /**
   * Wraps the getCmdLineOpts  database command .
   */
  serverCmdLineOpts() {
    return adminCommand(this, 'getCmdLineOpts');
  }

  /**
   * Returns a document that provides an overview of the database process's state.
   */
  serverStatus(options) {
    options = options || {};
    return adminCommand(this, Object.assign({ serverStatus: 1 }, options));
  }

  /**
   * Sets a single verbosity level for log messages </reference/log-messages> .
   *
   * @param {int} level The log verbosity level.  .. include:: /includes/log-verbosity-levels.rst  To inherit the verbosity level of the component's parent, you can also specify ``-1``.
   * @param {string} [component] The name of the component for which to specify the log verbosity level. The component name corresponds to the ``<name>`` from the corresponding ``systemLog.component.<name>.verbosity`` setting:  .. include:: /includes/list-log-component-setting-correspondence.rst  Omit to specify the default verbosity level for all components.
   */
  setLogLevel(level, component) {

  }

  /**
   * Modifies the current database profiler level used by the database profiling system to capture data about performance. The method provides a wrapper around the database command  profile .
   *
   * @param {integer} level Specifies a profiling level, which is either ``0`` for no profiling, ``1`` for only slow operations, or ``2`` for all operations.
   * @param {integer} [slowms] Sets the threshold in milliseconds for the profile to consider a query or operation to be slow.
   */
  setProfilingLevel(level, slowms) {}

  /**
   * Shuts down the current mongod or mongos  process cleanly and safely.
   *
   * @param {object} [options]
   */
  shutdownServer(options) {
    if (this.name !== 'admin') {
      throw new Error("shutdown command only works with the admin database; try 'use admin'");
    }

    let cmd = Object.assign({ shutdown: 1 }, options);
    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, `shutdownServer failed: ${JSON.stringify(res)}`); });
  }

  /**
   * Returns statistics that reflect the use state of a single database .
   *
   * @param {number} [scale] The scale at which to deliver results. Unless specified, this command returns all data in bytes.
   */
  stats(scale) {
    return this.runCommand({ dbstats: 1, scale: scale });
  }

  /**
   * Updates a user-defined role <user-defined-roles> . The db.updateRole() method must run on the role's database.
   *
   * @param {string} rolename The name of the :ref:`user-defined role <user-defined-roles>` to update.
   * @param {object} update A document containing the replacement data for the role. This data completely replaces the corresponding data for the role.
   * @param {object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the update operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   */
  updateRole(rolename, update, writeConcern) {
    let cmd = Object.assign({ updateRole: rolename }, update);
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;
    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Updates the user's profile on the database on which you run the method. An update to a field  the previous field's values. This includes updates to the user's  array.
   *
   * @param {string} username The name of the user to update.
   * @param {object} update A document containing the replacement data for the user. This data completely replaces the corresponding data for the user.
   * @param {object} [writeConcern] The level of :doc:`write concern </reference/write-concern>` for the update operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   */
  updateUser(username, update, writeConcern) {
    let cmd = Object.assign({ updateUser: username }, update);
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;
    modifyCommandToDigestPasswordIfNecessary(cmd, username);

    return this.runCommand(cmd)
      .catch(res => {
        if (res.errmsg.match(/no such cmd: updateUser/)) {
          // @TODO: implement updateUserV1
          throw res;
        }

        throw getErrorWithCode(res, `Updating user failed: ${res.errmsg}`);
      });
  }

  /**
   * Performs a preliminary check for upgrade preparedness to 2.6. The helper, available in the 2.6 mongo shell, can run connected to either a 2.4 or a 2.6 server.
   *
   * @param {object} [scope] Document to limit the scope of the check to the specified collection in the database.  Omit to perform the check on all collections in the database.
   */
  upgradeCheck(scope) {}

  /**
   * Performs a preliminary check for upgrade preparedness to 2.6. The helper, available in the 2.6 mongo shell, can run connected to either a 2.4 or a 2.6 server in the  database.
   */
  upgradeCheckAllDBs() {}

  /**
   * @returns The version of the mongod or mongos instance.
   */
  version() {
    return this.serverBuildInfo().then(info => info.version);
  }
}

module.exports = Db;
