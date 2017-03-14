'use strict';

const CollectionProxy = require('./collection_proxy');
const { getErrorWithCode, hashPassword } = require('./helpers');
const assert = require('assert');
const isString = require('util').isString;
const {
  tsToSeconds
} = require('./utilities');

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
  constructor(name, state, options = {}) {
    this.name = name;
    this.state = state;
    this.context = state.context;
    this.log = options.log || console.log;
  }

  static proxy(name, state, context = {}) {
    return new Proxy(new Db(name, state, context), {
      get: function(target, _name) {
        if (typeof _name === 'symbol') return target[_name];
        if (target[_name]) return target[_name];

        // Save the current namespace
        context.__namespace = `${target.name}.${_name}`;

        // Return the collection
        return new CollectionProxy(
          state.client.db(target.name).collection(_name), state.context.db,
          { log: target.log });
      }
    });
  }

  /**
   * Allows a user to authenticate to the database from within the shell.
   * @example
   * // The db.auth() method can accept either
   * db.auth( <username>, <password> )
   * // a user document that contains the username and password, and optionally, the authentication mechanism and a digest password flag.
   * db.auth( {
   *   user: <username>,
   *   pwd: <password>,
   *   mechanism: <authentication mechanism>,
   *   digestPassword: <boolean>
   * } )
   * @param {string} username Specifies an existing username with access privileges for this database.
   * @param {string} password Specifies the corresponding password.
   * @param {string} [mechanism] Specifies the :ref:`authentication mechanism <mongo-shell-authentication-mechanisms>` used. Defaults to either:  - ``SCRAM-SHA-1`` on new 3.0 installations and on 3.0 databases that   have been :ref:`upgraded from 2.6 with authSchemaUpgrade   <upgrade-scram-scenarios>`; or  - ``MONGODB-CR`` otherwise.  .. versionchanged:: 3.0    In previous version, defaulted to ``MONGODB-CR``.  For available mechanisms, see :ref:`authentication mechanisms <mongo-shell-authentication-mechanisms>`.
   * @param {boolean} [digestPassword] Determines whether the server receives digested or undigested password. Set to false to specify undigested password. For use with :doc:`SASL/LDAP authentication </tutorial/configure-ldap-sasl-openldap>` since the server must forward an undigested password to ``saslauthd``.
   * @return {Promise}
   */
  auth(username, password, mechanism, digestPassword) {
    let options = {};
    if (mechanism) options.mechanism = mechanism;
    if (digestPassword) options.digestPassword = digestPassword;

    return this.state.client.db(this.name).authenticate(username, password, options);
  }

  /**
   * Updates a user's password. Run the method in the database where the user is defined, i.e. the database you created <db.createUser> the user.
   * @example
   * // The following operation changes the password of the user named accountUser in the products database to SOh3TbYhx8ypJPxmt1oOfL
   * use products
   * db.changeUserPassword("accountUser", "SOh3TbYhx8ypJPxmt1oOfL")
   * @param {string} username Specifies an existing username with access privileges for this database.
   * @param {string} password Specifies the corresponding password.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of write concern to apply to this operation. The ``writeConcern`` document uses the same fields as the `getLastError` command.
   */
  changeUserPassword(username, password, writeConcern) {
    return this.updateUser(username, { pwd: password }, writeConcern);
  }

  /**
   * Copies data directly between MongoDB instances. The db.cloneCollection() method wraps the cloneCollection database command and accepts the following arguments:
   * @example
   * // This operation copies the profiles collection from the users database on the server at mongodb.example.net. The operation only copies 
   * // documents that satisfy the query { 'active' : true }
   * db.cloneCollection('mongodb.example.net:27017', 'users.profile', { 'active' : true } )
   * @param {string} from The address of the server to clone from.
   * @param {string} collection The collection in the MongoDB instance that you want to copy. `db.cloneCollection()` will only copy the collection with this name from *database* of the same name as the current database the remote MongoDB instance.  If you want to copy a collection from a different database name you must use the `cloneCollection` directly.
   * @param {object} [query] A standard query document that limits the documents copied as part of the `db.cloneCollection()` operation.  All :ref:`query selectors <query-selectors>` available to the `find() <db.collection.find()>` are available here.
   * @return {Promise}
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
   * @example
   * // To clone a database named importdb on a host named hostname, issue the following
   * db.cloneDatabase("hostname")
   * @param {string} hostname The hostname of the database to copy.
   * @return {Promise}
   */
  cloneDatabase(hostname) {
    assert(isString(hostname) && hostname.length);
    return this.runCommand({ clone: hostname });
  }

  /**
   * Displays help server text for the specified database command . See the /reference/command .
   * @example
   * // Retrieve the server help string for the ismaster command
   * db.commandHelp("ismaster")
   * @param {string} command The name of a :term:`database command`.
   * @return {Promise}
   */
  commandHelp(command) {
    let cmd = {};
    cmd[command] = 1;
    cmd.help = true;
    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Copies a database either from one mongod instance to the current mongod instance or within the current mongod . db.copyDatabase() wraps the copydb command and takes the following arguments:
   * @example
   * // The following operation copies a database named records into a database named archive_records
   * db.copyDatabase('records', 'archive_records')
   * // The following operation copies a database named reporting from a version 2.6 mongod instance that runs on example.net and enforces access control
   * db.copyDatabase(
   *   "reporting",
   *   "reporting_copy",
   *   "example.net",
   *   "reportUser",
   *   "abc123",
   *   "MONGODB-CR"
   * )
   * @param {string} fromdb Name of the source database.
   * @param {string} todb Name of the target database.
   * @param {string} [fromhost] The hostname of the source :program:`mongod` instance. Omit  to copy databases within the same :program:`mongod` instance.
   * @param {string} [username] The name of the user on the ``fromhost`` MongoDB instance. The user authenticates to the ``fromdb``.  For more information, see :ref:`copyDatabase-access-control`.
   * @param {string} [password] The password on the ``fromhost`` for authentication. The method does **not** transmit the password in plaintext.  For more information, see :ref:`copyDatabase-access-control`.
   * @param {string} [mechanism] The mechanism to authenticate the ``username`` and ``password`` on the ``fromhost``. Specify either :ref:`MONGODB-CR <authentication-mongodb-cr>` or :ref:`SCRAM-SHA-1 <authentication-scram-sha-1>`.   `db.copyDatabase` defaults to :ref:`SCRAM-SHA-1 <authentication-scram-sha-1>` if the wire protocol version (:data:`~isMaster.maxWireVersion`) is greater than or equal to ``3`` (i.e. MongoDB versions 3.0 or greater). Otherwise, it defaults to :ref:`MONGODB-CR <authentication-mongodb-cr>`.  Specify ``MONGODB-CR`` to authenticate to the version 2.6.x ``fromhost`` from a version 3.0 instance or greater. For an example, see :ref:`example-copyDatabase-from-2.6`.  .. versionadded:: 3.0
   * @return {Promise}
   */
  copyDatabase(fromdb, todb, fromhost, username, password, mechanism) {}

  /**
   * Creates a new collection or view </core/views> .
   * @example
   * // Create a Capped Collection
   * // This command creates a collection named log with a maximum size of 5 megabytes and a maximum of 5000 documents
   * db.createCollection("log", { capped : true, size : 5242880, max : 5000 } )
   * // The following command simply pre-allocates a 2-gigabyte, uncapped collection named people
   * db.createCollection("people", { size: 2147483648 } )
   * 
   * // Create a Collection with Document Validation
   * // The following example creates a contacts collection with a validator that specifies that inserted or updated documents should match at least one of three following condition
   * //  * the phone field is a string
   * //  * the email field matches the regular expression
   * //  * the status field is either Unknown or Incomplete.
   * db.createCollection( "contacts", {
   *   validator: { $or:
   *      [
   *         { phone: { $type: "string" } },
   *         { email: { $regex: /@mongodb\.com$/ } },
   *         { status: { $in: [ "Unknown", "Incomplete" ] } }
   *      ]
   *   }
   * })
   * 
   * // Specify Collation
   * db.createCollection( "myColl", { collation: { locale: "fr" } } );
   * @param {string} name The name of the collection to create.
   * @param {object} [options] Configuration options for creating a capped collection, for preallocating space in a new collection, or for creating a view.
   * @param {boolean} [options.capped] To create a capped collection, specify true. If you specify true, you must also set a maximum size in the size field.
   * @param {boolean} [options.autoIndexId] Specify false to disable the automatic creation of an index on the _id field. (Deprecated since version 3.2: The autoIndexId option will be removed in version 3.4.)
   * @param {number} [options.size] Specify a maximum size in bytes for a capped collection. Once a capped collection reaches its maximum size, MongoDB removes the older documents to make space for the new documents. The size field is required for capped collections and ignored for other collections. 
   * @param {number} [options.max] The maximum number of documents allowed in the capped collection. The size limit takes precedence over this limit. If a capped collection reaches the size limit before it reaches the maximum number of documents, MongoDB removes old documents. If you prefer to use the max limit, ensure that the size limit, which is required for a capped collection, is sufficient to contain the maximum number of documents.
   * @param {boolean} [options.usePowerOf2Sizes] Available for the MMAPv1 storage engine only. Deprecated since version 3.0: For the MMAPv1 storage engine, all collections use the power of 2 sizes allocation unless the noPadding option is true. The usePowerOf2Sizes option does not affect the allocation strategy. 
   * @param {boolean} [options.noPadding = false] Available for the MMAPv1 storage engine only. New in version 3.0: noPadding flag disables the power of 2 sizes allocation for the collection. With noPadding flag set to true, the allocation strategy does not include additional space to accommodate document growth, as such, document growth will result in new allocation. Use for collections with workloads that are insert-only or in-place updates (such as incrementing counters).
   * @param {object} [options.storageEngine] Available for the WiredTiger storage engine only. Allows users to specify configuration to the storage engine on a per-collection basis when creating a collection. The value of the storageEngine option should take the following form: { <storage-engine-name>: <options> }
   * @param {object} [options.validator] Allows users to specify validation rules or expressions for the collection. For more information, see Document Validation.
   * @param {string} [options.validationLevel] Determines how strictly MongoDB applies the validation rules to existing documents during an update.
   * @param {string} [options.validationAction] Determines whether to error on invalid documents or just warn about the violations but allow invalid documents to be inserted.
   * @param {object} [options.indexOptionDefaults] Allows users to specify a default configuration for indexes when creating a collection.
   * @param {string} [options.viewOn] The name of the source collection or view from which to create the view. The name is not the full namespace of the collection or view; i.e. does not include the database name and implies the same database as the view to create.
   * @param {array} [options.pipeline] An array that consists of the aggregation pipeline stage. db.createView creates the view by applying the specified pipeline to the viewOn collection or view.
   * @param {object} [options.collation] Specifies the default collation for the collection. Collation allows users to specify language-specific rules for string comparison, such as rules for lettercase and accent marks.
   * @return {Promise}
   */
  createCollection(name, options) {
    options = options || {};

    // We have special handling for the 'flags' field, and provide sugar for specific flags. If the
    // user specifies any flags we send the field in the command. Otherwise, we leave it blank and
    // use the server's defaults.
    let sendFlags = false;
    let flags = 0;
    if (options.usePowerOf2Sizes) {
      this.log(
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
   * @example
   * The following createRole command creates the myClusterwideAdmin role on the admin database
   * use admin
   * db.runCommand({ createRole: "myClusterwideAdmin",
   *  privileges: [
   *    { resource: { cluster: true }, actions: [ "addShard" ] },
   *    { resource: { db: "config", collection: "" }, actions: [ "find", "update", "insert", "remove" ] },
   *    { resource: { db: "users", collection: "usersCollection" }, actions: [ "update", "insert", "remove" ] },
   *    { resource: { db: "", collection: "" }, actions: [ "find" ] }
   *  ],
   *  roles: [
   *    { role: "read", db: "admin" }
   *  ],
   *  writeConcern: { w: "majority" , wtimeout: 5000 }
   * })
   * @param {object} role A document containing the name of the role and the role definition.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` to apply to this operation. The ``writeConcern`` document uses the same fields as the `getLastError` command.
   * @return {Promise}
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
   * @example
   * // The following createUser command creates a user accountAdmin01 on the products database. The command gives accountAdmin01 the clusterAdmin and readAnyDatabase roles on the admin database and the readWrite role on the products database
   * db.getSiblingDB("products").runCommand( { 
   *   createUser: "accountAdmin01",
   *   pwd: "cleartext password",
   *   customData: { employeeId: 12345 },
   *   roles: [
   *     { role: "clusterAdmin", db: "admin" },
   *     { role: "readAnyDatabase", db: "admin" },
   *     "readWrite"
   *   ],
   *   writeConcern: { w: "majority" , wtimeout: 5000 }
   * } )
   * @param {object} user The document with authentication and access information about the user to create.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the creation operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @return {Promise}
   */
  createUser(user, writeConcern) {
    const self = this;
    let name = user.user;
    let cmd = Object.assign({ createUser: name }, user);
    delete cmd.user;

    modifyCommandToDigestPasswordIfNecessary(cmd, name);
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .then(() => self.log(`Successfully added user: ${getUserObjString(user)}`))
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
   * @example
   * // Create a View from a Single Collection
   * db.createView(
   *  "managementFeedback",
   *  "survey",
   *  [ { $project: { "management": "$feedback.management", department: 1 } } ]
   * )
   * 
   * // Query a View
   * db.managementFeedback.find()
   * 
   * // Perform Aggregation Pipeline on a View
   * db.managementFeedback.aggregate([ { $sortByCount: "$department" } ] )
   * 
   * // Create a View from Multiple Collections
   * db.createView(
   *   "orderDetails",
   *   "orders",
   *   [
   *     { $lookup: { from: "inventory", localField: "item", foreignField: "sku", as: "inventory_docs" } },
   *     { $project: { "inventory_docs._id": 0, "inventory_docs.sku": 0 } }
   *   ]
   * )
   * 
   * // Perform Aggregation Pipeline on a View
   * db.orderDetails.aggregate( [ { $sortByCount: "$item" } ] )
   * 
   * // Create a View with Default Collation
   * db.createView(
   *  "placesView",
   *  "places",
   *  [ { $project: { category: 1 } } ],
   *  { collation: { locale: "fr", strength: 1 } }
   * )
   * @param {string} view The name of the view to create.
   * @param {string} source The name of the source collection or view from which to create the view. The name is not the full namespace of the collection or view; i.e. does not include the database name and implies the same database as the view to create.
   * @param {array} pipeline An array that consists of the :ref:`aggregation pipeline stage <aggregation-pipeline>`.  {{op}} creates the view by applying the specified ``pipeline`` to the {{source}}.  .. include:: /includes/extracts/views-public-definition.rst
   * @param {object} [options] Additional options for the method.
   * @return {Promise}
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
   * @example
   * // Write Operations Waiting for a Lock
   * db.currentOp({
   *  "waitingForLock" : true,
   *  $or: [
   *     { "op" : { "$in" : [ "insert", "update", "remove" ] } },
   *     { "query.findandmodify": { $exists: true } }
   *  ]
   * })
   * 
   * // Active Operations with no Yields
   * db.currentOp({
   *   "active" : true,
   *   "numYields" : 0,
   *   "waitingForLock" : false
   * })
   * 
   * // Active Operations on a Specific Database
   * db.currentOp({
   *   "active" : true,
   *   "secs_running" : { "$gt" : 3 },
   *   "ns" : /^db1\./
   * })
   * 
   * // Active Indexing Operations
   * db.currentOp({
   *   $or: [
   *     { op: "query", "query.createIndexes": { $exists: true } },
   *     { op: "insert", ns: /\.system\.indexes\b/ }
   *   ]
   * })
   * @param {boolean|document} [operations] Specifies the operations to report on. Can pass either a boolean or a document.  Specify ``true`` to include operations on idle connections and system operations. Specify a document with query conditions to report only on operations that match the conditions. See :ref:`currentOp-behavior` for details.
   * @return {Promise}
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
    return this.adminCommand(cmd)
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
   * @example
   * // The following operations drop all user-defined roles from the products database and uses a write concern of majority
   * use products
   * db.dropAllRoles( { w: "majority" } )
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @return {Promise}
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
   * @example
   * // Drops all the users
   * db.dropAllUsers();
   * // Drops all the users using a majority writeConcern
   * db.dropAllUsers({w:'majority'});
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @return {Promise}
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
   * @example
   * // The following example in the mongo shell uses the use <database> operation to switch the current database to the temp database and then uses the db.dropDatabase() method to drops the temp database
   * use temp
   * db.dropDatabase()
   * @return {Promise}
   */
  dropDatabase() {
    if (arguments.length) {
      throw Error("dropDatabase doesn't take arguments");
    }

    return this.runCommand({ dropDatabase: 1 });
  }

  /**
   * Deletes a user-defined <user-defined-roles> role from the database on which you run the method.
   * @example
   * // The following operations remove the readPrices role from the products database
   * use products
   * db.dropRole( "readPrices", { w: "majority" } )
   * @param {string} rolename The name of the :ref:`user-defined role <user-defined-roles>` to remove from the database.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @return {Promise}
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
   * @example
   * // The following db.dropUser() operation drops the reportUser1 user on the products database
   * use products
   * db.dropUser("reportUser1", {w: "majority", wtimeout: 5000})
   * @param {string} username The name of the user to remove from the database.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @return {Promise}
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
   * Provides the ability to run JavaScript code on the MongoDB server (Deprecated since version 3.0).
   * @example
   * // The following is an example of the db.eval() method
   * db.eval( function(name, incAmount) {
   *    var doc = db.myCollection.findOne( { name : name } );
   *
   *    doc = doc || { name : name , num : 0 , total : 0 , avg : 0 };
   *
   *    doc.num++;
   *    doc.total += incAmount;
   *    doc.avg = doc.total / doc.num;
   *
   *    db.myCollection.save( doc );
   *    return doc;
   *  },
   * "eliot", 5 );
   * @param {func} func A JavaScript function to execute.
   * @param {list} [args] A list of arguments to pass to the JavaScript function. Omit if the function does not take arguments.
   * @return {Promise}
   */
  eval(func, ...args) {
    this.log('WARNING: db.eval is deprecated');

    let cmd = { $eval: func };
    if (args.length) cmd.args = args;

    return this.runCommand(cmd)
      .then(res => res.retval)
      .catch(res => { throw getErrorWithCode(res, JSON.stringify(res)); });
  }

  /**
   * Forces the mongod to flush all pending write operations to disk and locks the   mongod instance to prevent additional writes until the user releases the lock with the db.fsyncUnlock() command. db.fsyncLock() is an administrative command.
   *
   * @return {Promise}
   */
  fsyncLock() {
    return this.adminCommand({ fsync: 1, lock: true });
  }

  /**
   * Unlocks a mongod instance to allow writes and reverses the operation of a db.fsyncLock() operation. Typically you will use db.fsyncUnlock() following a database backup operation </core/backups> .
   *
   * @return {Promise}
   */
  fsyncUnlock() {
    return this.adminCommand({ fsyncUnlock: 1 })
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
   * @example
   * // The following example uses db.getCollection() to access the auth collection
   * var authColl = db.getCollection("auth");
   * @param {string} name The name of the collection.
   */
  getCollection(name) {
    return new CollectionProxy(this.state.client.db(this.name).collection(name), this, { log: this.log });
  }

  /**
   * Returns an array of documents with collection or view </core/views> information, such as name and options, for the current database.
   * @example
   * // The following returns information for all collections in the example database
   * use example
   * db.getCollectionInfos()
   * 
   * // To request collection information for a specific collection, specify the collection name when calling the method, as in the following
   * use example
   * db.getCollectionInfos( { name: "restaurants" } )
   * @param {object} [filter]  An optional filter specified to match only collections with certain metadata.
   * @return {Promise}
   */
  getCollectionInfos() {
    return this.state.client.db(this.name).listCollections().toArray();
  }

  /**
   * Returns an array containing the names of all collections and views </core/views> in the current database.
   * @example
   * // The following returns the names of all collections in the records databas
   * use records
   * db.getCollectionNames()
   * @return {Promise}
   */
  getCollectionNames() {
    return this.state.client.db(this.name).listCollections().toArray()
      .then(collections => collections.map(c => c.name));
  }

  /**
   * The db.getLastError() can accept the following parameters:
   * @example
   * // The following example issues a db.getLastError() operation that verifies that the preceding write operation, issued over the same connection, has propagated to at least two members of the replica set.
   * db.getLastError(2)
   * @param {int|string} [w] The write concern's ``w`` value.
   * @param {int} [wtimeout] The time limit in milliseconds.
   * @return {Promise}
   */
  getLastError(w, wtimeout) {
    return this.getLastErrorObj(w, wtimeout)
      .then(res => res.err)
      .catch(res => { throw getErrorWithCode(res, `getlasterror failed: ${JSON.stringify(res)}`); });
  }

  /**
   * The db.getLastErrorObj() can accept the following parameters:
   * @example
   * // The following example issues a db.getLastErrorObj() operation that verifies that the preceding write operation, issued over the same connection, has propagated to at least two members of the replica set.
   * db.getLastErrorObj(2)
   * @param {int|string} [key] The write concern's ``w`` value.
   * @param {int} [wtimeout] The time limit in milliseconds.
   * @return {Promise}
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
  getMongo() { return this.state.client; }

  /**
   * @returns the current database name.
   */
  getName() { return this.name; }

  /**
   * Returns a status document, containing the errors (Deprecated since version 1.6.)
   *
   * @return {Promise}
   */
  getPrevError() {
    return this.runCommand({ getpreverror: 1 });
  }

  /**
   * This method provides a wrapper around the database command " profile " and returns the current profiling level.
   *
   * @return {Promise}
   */
  getProfilingLevel() {
    return this.runCommand({ profile: -1 })
      .then(res => res.was)
      .catch(res => null);
  }

  /**
   * Returns the current profile level and ~operationProfiling.slowOpThresholdMs setting.
   *
   * @return {Promise}
   */
  getProfilingStatus() {
    return this.runCommand({ profile: -1 })
      .then(res => { delete res.ok; return res; })
      .catch(res => { throw getErrorWithCode(res, `profile command failed: ${JSON.stringify(res)}`); });
  }

  /**
   * Returns a document with the status of the replica set, using data polled from the oplog . Use this output when diagnosing issues with replication.
   *
   * @return {Object}
   */
  async getReplicationInfo() {
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
   * @example
   * // The following operation returns role inheritance information for the role associate defined on the products database
   * use products
   * db.getRole( "associate" )
   * 
   * // The following operation returns role inheritance information and privileges for the role associate defined on the products database
   * use products
   * db.getRole( "associate", { showPrivileges: true } )
   * @param {string} rolename The name of the role.
   * @param {object} [args] A document specifying additional arguments.
   * @return {Promise}
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
   * @example
   * // The following operations return documents for all the roles on the products database, including role privileges and built-in roles
   * db.getRoles({
   *   rolesInfo: 1,
   *   showPrivileges:true,
   *   showBuiltinRoles: true
   * })
   * @param {integer} rolesInfo Set this field to ``1`` to retrieve all user-defined roles.
   * @param {boolean} [showPrivileges] Set the field to ``true`` to show role privileges, including both privileges inherited from other roles and privileges defined directly. By default, the command returns only the roles from which this role inherits privileges and does not return specific privileges.
   * @param {boolean} [showBuiltinRoles] Set to true to display :ref:`built-in roles <built-in-roles>` as well as user-defined roles.
   * @return {Promise}
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
   * @example
   * // You can use db.getSiblingDB() as an alternative to the use <database> helper. This is particularly useful when writing scripts using the mongo shell where the use helper is not available. Consider the following sequence of operation
   * db = db.getSiblingDB('users')
   * db.active.count()
   * @param {string} database The name of a MongoDB database.
   */
  getSiblingDB(database) {
    return Db.proxy(database, this.state);
  }

  /**
   * Returns user information for a specified user. Run this method on the user's database. The user must exist on the database on which the method runs.
   * @example
   * // The following sequence of operations returns information about the appClient user on the accounts database
   * use accounts
   * db.getUser("appClient")
   * @param {string} username The name of the user for which to retrieve information.
   * @param {object} [args] A document specifying additional arguments.
   * @return {Promise}
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
   * @return {Promise}
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
   * @example
   * // The following db.grantPrivilegesToRole() operation grants two additional privileges to the role inventoryCntrl01, which exists on the products database. The operation is run on that database
   * use products
   * db.grantPrivilegesToRole(
   *   "inventoryCntrl01", [{
   *     resource: { db: "products", collection: "" },
   *     actions: [ "insert" ]
   *   }, {
   *     resource: { db: "products", collection: "system.js" },
   *     actions: [ "find" ]
   *   }],
   *   { w: "majority" })
   * @param {string} rolename The name of the role to grant privileges to.
   * @param {array} privileges The privileges to add to the role. For the format of a privilege, see :data:`~admin.system.roles.privileges`.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @return {Promise}
   */
  grantPrivilegesToRole(rolename, privileges, writeConcern) {
    let cmd = { grantPrivilegesToRole: rolename, privileges: privileges };
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Grants roles to a user-defined role <user-defined-roles> .
   * @example
   * // The following grantRolesToRole() operation updates the productsReaderWriter role in the products database to inherit the privileges of productsReader rol
   * use products
   * db.grantRolesToRole(
   *   "productsReaderWriter",
   *   [ "productsReader" ],
   *   { w: "majority" , wtimeout: 5000 })
   * @param {string} rolename The name of the role to which to grant sub roles.
   * @param {array} roles An array of roles from which to inherit.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @return {Promise}
   */
  grantRolesToRole(rolename, roles, writeConcern) {
    let cmd = { grantRolesToRole: rolename, roles: roles };
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Grants additional roles to a user.
   * @example
   * // Given a user accountUser01 in the products database with the following roles
   * "roles" : [{ "role" : "assetsReader",
   *   "db" : "assets"
   * }]
   * // The following grantRolesToUser() operation gives accountUser01 the readWrite role on the products database and the read role on the stock database.
   * use products
   * db.grantRolesToUser(
   *   "accountUser01",
   *   [ "readWrite" , { role: "read", db: "stock" } ],
   *   { w: "majority" , wtimeout: 4000 })
   * @param {string} user The name of the user to whom to grant roles.
   * @param {array} roles An array of additional roles to grant to the user.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @return {Promise}
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
   * Returns a document with information about the underlying system that the mongod or mongos runs on. Some of the returned fields are only included on some platforms.
   *
   * @return {Promise}
   */
  hostInfo() {
    return this.adminCommand('hostInfo');
  }

  /**
   * Returns a document that describes the role of the mongod instance.
   *
   * @return {Promise}
   */
  isMaster() {
    return this.runCommand('isMaster');
  }

  /**
   * Terminates an operation as specified by the operation ID. To find operations and their corresponding IDs, see db.currentOp() .
   *
   * @param {number} op An operation ID.
   * @return {Promise}
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
   *
   * @return {Promise}
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

          this.log(s);
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
   *
   * @return {Promise}
   */
  logout() {
    return this.state.client.logout();
  }

  /**
   * Provides a wrapper around the db.collection.stats()  method. Returns statistics from every collection separated by three hyphen characters.
   *
   * @param {number} scale
   * @return {Promise}
   */
  async printCollectionStats(scale) {
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
    const names = await this.getCollectionNames();
    for (const name of names) {
      this.log(name);
      this.log(await mydb.getCollection(name).stats(scale));
      this.log('---');
    }
  }

  /**
   * Prints a formatted report of the replica set member's oplog . The displayed report formats the data returned by db.getReplicationInfo() .
   */
  printReplicationInfo() {
    return this.context.rs.printReplicationInfo()
  }

  /**
   * Prints a formatted report of the sharding configuration and the information regarding existing chunks in a sharded cluster .
   *
   * @param {boolean} [verbose] If ``true``, the method displays details of the document distribution across chunks when you have 20 or more chunks.
   */
  printShardingStatus(verbose) {
    return this.context.sh.status(verbose)
  }

  /**
   * Returns a formatted report of the status of a replica set  from the perspective of the secondary member of the set. The output is identical to that of rs.printSlaveReplicationInfo() .
   */
  printSlaveReplicationInfo() {
    return this.context.rs.printSlaveReplicationInfo()    
  }

  /**
   * Removes the specified username from the database.
   *
   * @param {string} username The database username.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern]
   * @return {Promise}
   */
  removeUser(username, writeConcern) {
    this.log('WARNING: db.removeUser has been deprecated, please use db.dropUser instead');
    return this.dropUser(username, writeConcern);
  }

  /**
   * db.repairDatabase() provides a wrapper around the database command repairDatabase, and has the same effect as the run-time option mongod --repair option, limited to  the current database. See repairDatabase for full documentation.
   *
   * @return {Promise}
   */
  repairDatabase() {
    return this.runCommand({ repairDatabase: 1 });
  }

  /**
   * Resets the error message returned by db.getPrevError or getPrevError . Provides a wrapper around the resetError command.
   *
   * @return {Promise}
   */
  resetError() {
    return this.runCommand({ reseterror: 1 });
  }

  /**
   * Removes the specified privileges from the user-defined <user-defined-roles> role on the database where the method runs. The revokePrivilegesFromRole method has the following syntax:
   * @example
   * // The following operation removes multiple privileges from the associates role
   * db.revokePrivilegesFromRole(
   *   "associate", [{
   *     resource: { db: "products", collection: "" },
   *     actions: [ "createCollection", "createIndex", "find" ]
   *   }, {
   *     resource: { db: "products", collection: "orders" },
   *     actions: [ "insert" ]
   *   }],
   *   { w: "majority" })
   * @param {string} rolename The name of the :ref:`user-defined <user-defined-roles>` role from which to revoke privileges.
   * @param {array} privileges An array of privileges to remove from the role.  See :data:`~admin.system.roles.privileges` for more information on the format of the privileges.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @return {Promise}
   */
  revokePrivilegesFromRole(rolename, privileges, writeConcern) {
    let cmd = { revokePrivilegesFromRole: rolename, privileges: privileges };
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Removes the specified inherited roles from a role.
   * @example
   * // The purchaseAgents role in the emea database inherits privileges from several other roles, as listed in the roles array
   * {
   *   "_id" : "emea.purchaseAgents",
   *   "role" : "purchaseAgents",
   *   "db" : "emea",
   *   "privileges" : [],
   *   "roles" : [{
   *     "role" : "readOrdersCollection",
   *     "db" : "emea"
   *   }, {
   *     "role" : "readAccountsCollection",
   *     "db" : "emea"
   *   }, {
   *     "role" : "writeOrdersCollection",
   *     "db" : "emea"
   *   }]
   * }
   * 
   * // The following db.revokeRolesFromRole() operation on the emea database removes two roles from the purchaseAgents role
   * use emea
   * db.revokeRolesFromRole( "purchaseAgents", [
   *     "writeOrdersCollection",
   *     "readOrdersCollection"
   *   ],
   *   { w: "majority" , wtimeout: 5000 }
   * )
   * @param {string} rolename The name of the role from which to revoke roles.
   * @param {array} roles The inherited roles to remove.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` to apply to this operation. The ``writeConcern`` document uses the same fields as the `getLastError` command.
   * @return {Promise}
   */
  revokeRolesFromRole(rolename, roles, writeConcern) {
    let cmd = { revokeRolesFromRole: rolename, roles: roles };
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;

    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Removes a one or more roles from a user on the current database. The db.revokeRolesFromUser() method uses the following syntax:
   * @example
   * // The accountUser01 user in the products database has the following role
   * "roles" : [{ 
   *   "role" : "assetsReader",
   *   "db" : "assets"
   * }, { 
   *   "role" : "read",
   *   "db" : "stock"
   * }, { 
   *   "role" : "readWrite",
   *   "db" : "products"
   * }]
   * 
   * // The following db.revokeRolesFromUser() method removes the two of the user’s roles: the read role on the stock database and the readWrite role on the products database, which is also the database on which the method runs
   * use products
   * db.revokeRolesFromUser( "accountUser01",
   *   [ { role: "read", db: "stock" }, "readWrite" ],
   *   { w: "majority" }
   * )
   * @param {string} user The name of the user from whom to revoke roles.
   * @param {array} roles The roles to remove from the user.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @return {Promise}
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
   * Provides a helper to run specified database commands against the admin database.
   * @example
   * // The following example uses the db.adminCommand() method to execute a killOp command to terminate an operation with opid 724. killOp is an administrative command and must be run against the admin database.
   * db.adminCommand( { "killOp": 1, "op": 724 } )
   * 
   * // The following example uses db.adminCommand() to execute the renameCollection administrative database command to rename the orders collection in the test database to orders-2016.
   * db.adminCommand({
   *   renameCollection: "test.orders",
   *   to: "test.orders-2016"
   * })
   * 
   * // The following example uses the db.adminCommand() method to create a user named bruce with the dbOwner role on the admin database.
   * db.adminCommand({
   *   createUser: "bruce",
   *   pwd: "bruce123",
   *   roles: [
   *     { role: "dbOwner", db: "admin" }
   *   ]
   * })
   * @param {object|string} command A database command, specified either in document form or as a string. If specified as a string, the command cannot include any arguments.
   * @param {object} [options] Additional options to pad to the command executor.
   * @return {Promise}
   */
  adminCommand(obj, options) {
    if (this.name === 'admin') {
      return this.runCommand(obj, options);
    }

    return this.getSiblingDB('admin').runCommand(obj, options);
  }

  /**
   * Provides a helper to run specified database commands </reference/command> . This is the preferred method to issue database commands, as it provides a consistent interface between the shell and drivers.
   *
   * @param {object|string} command "A :term:`database command`, specified either in :term:`document` form or as a string. If specified as a string, `db.runCommand()` transforms the string into a document."
   * @param {object} [extra]
   * @param {object} [queryOptions]
   * @return {Promise}
   */
  runCommand(command, extra, queryOptions) {
    let mergedObj = (typeof(command) === 'string') ? mergeCommandOptions(command, extra) : command;

    // if options were passed (i.e. because they were overridden on a collection), use them.
    // Otherwise use getQueryOptions.
    let options = (typeof(queryOptions) !== 'undefined') ? queryOptions : getQueryOptions(this);

    return this.state.client.db(this.name).command(mergedObj, options)
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
   *
   * @return {Promise}
   */
  serverBuildInfo() {
    return this.adminCommand('buildinfo');
  }

  /**
   * Wraps the getCmdLineOpts  database command .
   *
   * @return {Promise}
   */
  serverCmdLineOpts() {
    return this.adminCommand('getCmdLineOpts');
  }

  /**
   * Returns a document that provides an overview of the database process's state.
   * @example
   * // For example, the following operation suppresses the repl, metrics and locks information in the output.
   * db.serverStatus( { repl: 0,  metrics: 0, locks: 0 } )
   * 
   * // The following example includes rangeDeleter and all repl information in the output.
   * db.serverStatus( { rangeDeleter: 1, repl: 1 } )
   * @return {Promise}
   */
  serverStatus(options) {
    options = options || {};
    return this.adminCommand(Object.assign({ serverStatus: 1 }, options));
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
   * @return {Promise}
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
   * @example
   * // The following example converts the returned values to kilobytes
   * db.stats(1024)
   * @param {number} [scale] The scale at which to deliver results. Unless specified, this command returns all data in bytes.
   * @return {Promise}
   */
  stats(scale) {
    return this.runCommand({ dbstats: 1, scale: scale });
  }

  /**
   * Updates a user-defined role <user-defined-roles> . The db.updateRole() method must run on the role's database.
   * @example
   * // The following db.updateRole() method replaces the privileges and the roles for the inventoryControl role that exists in the products database. The method runs on the database that contains inventoryControl
   * use products
   * db.updateRole(
   *   "inventoryControl", {
   *     privileges: [{
   *       resource: { db:"products", collection:"clothing" },
   *       actions: [ "update", "createCollection", "createIndex"]
   *     }],
   *     roles: [{
   *       role: "read",
   *       db: "products"
   *     }]
   *   },
   *   { w:"majority" })
   * @param {string} rolename The name of the :ref:`user-defined role <user-defined-roles>` to update.
   * @param {object} update A document containing the replacement data for the role. This data completely replaces the corresponding data for the role.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the update operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @return {Promise}
   */
  updateRole(rolename, update, writeConcern) {
    let cmd = Object.assign({ updateRole: rolename }, update);
    cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;
    return this.runCommand(cmd)
      .catch(res => { throw getErrorWithCode(res, res.errmsg); });
  }

  /**
   * Updates the user's profile on the database on which you run the method. An update to a field  the previous field's values. This includes updates to the user's  array.
   * @example
   * // Given a user appClient01 in the products database with the following user info
   * {
   *   "_id" : "products.appClient01",
   *   "user" : "appClient01",
   *   "db" : "products",
   *   "customData" : { "empID" : "12345", "badge" : "9156" },
   *   "roles" : [{ 
   *     "role" : "readWrite",
   *     "db" : "products"
   *   }, { 
   *     "role" : "read",
   *     "db" : "inventory"
   *   }]
   * }
   * 
   * // use products
   * db.updateUser( "appClient01", {
   *   customData : { employeeId : "0x3039" },
   *   roles : [
   *     { role : "read", db : "assets"  }
   *   ]
   * })
   * @param {string} username The name of the user to update.
   * @param {object} update A document containing the replacement data for the user. This data completely replaces the corresponding data for the user.
   * @param {object} [options] Additional options to pad to the command executor.
   * @param {object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the update operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.
   * @return {Promise}
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
   * Returns the version of the mongod or mongos instance.
   *
   * @return {Promise}
   */
  version() {
    return this.serverBuildInfo().then(info => info.version);
  }
}

// aliases
Db.prototype.getSisterDB = Db.prototype.getSiblingDB;


module.exports = Db;
