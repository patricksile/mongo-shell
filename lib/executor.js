const { sleep } = require('./helpers');
const Script = require('vm').Script;
const falafel = require('falafel');
const debug = require('util').debuglog('translator');

const Db = require('./db');

const DB_METHODS = Object.getOwnPropertyNames(Db.prototype);
const DB_COMPAT_METHODS = [ 'getCollection' ];

const DB_ASYNC_METHODS = [
  'auth', 'adminCommand', 'cloneCollection', 'cloneDatabase', 'commandHelp',
  'copyDatabase', 'createCollection', 'createRole', 'createUser', 'createView',
  'currentOp', 'dropAllRoles', 'dropAllUsers', 'dropDatabase', 'dropRole', 'dropUser',
  'eval', 'fsyncLock', 'fsyncUnlock', 'getCollectionInfos', 'getCollectionNames',
  'getLastError', 'getLastErrorObj', 'getPrevError', 'getProfilingLevel',
  'getProfilingStatus', 'getReplicationInfo', 'getRole', 'getRoles', 'getUser',
  'getUsers', 'grantPrivilegesToRole', 'grantRolesToRole', 'grantRolesToUser',
  'hostInfo', 'isMaster', 'killOp', 'listCommands', 'logout', 'printCollectionStats',
  'removeUser', 'repairDatabase', 'resetError', 'revokePrivilegesFromRole',
  'revokeRolesFromRole', 'revokeRolesFromUser', 'runCommand', 'serverBuildInfo',
  'serverCmdLineOpts', 'serverStatus', 'shutdownServer', 'stats', 'updateRole',
  'updateUser', 'version'
];

const COLLECTION_ASYNC_METHODS = [
  'bulkWrite', 'count', 'createIndex', 'createIndexes', 'deleteMany', 'deleteOne',
  'distinct', 'drop', 'dropAllIndexes', 'dropIndex', 'dropIndexes', 'ensureIndex',
  'findAndModify', 'findAndRemove', 'findOne', 'findOneAndDelete', 'findOneAndReplace',
  'findOneAndUpdate', 'geoHaystackSearch', 'geoNear', 'group', 'indexes', 'indexExists',
  'indexInformation', 'insert', 'insertMany', 'insertOne', 'isCapped', 'mapReduce',
  'options', 'parallelCollectionScan', 'reIndex', 'remove', 'rename', 'replaceOne',
  'save', 'stats', 'update', 'updateMany', 'updateOne',

  // compat
  'getIndexes', 'getIndexKeys', 'itcount', 'runCommand', 'validate'
];

const CREATE_CURSOR_METHODS = [ 'find', 'listIndexes', 'aggregate' ];
const CURSOR_ASYNC_METHODS = [
  'close', 'count', 'explain', 'hasNext', 'next', 'nextObject', 'toArray',

  // compat
  'arrayAccess', 'countReturn', 'length', 'size'
];

function isIIFE(node) {
  if (node.type === 'CallExpression' &&
      node.callee && node.callee.type === 'FunctionExpression' &&
      node.parent && node.parent.type === 'ExpressionStatement') {
    return true;
  } else if (node.type === 'FunctionExpression' &&
             node.parent && node.parent.type === 'CallExpression' && node.parent.callee === node) {
    return true;
  }

  return false;
}

function findParent(node, types) {
  types = Array.isArray(types) ? types : [ types ];
  if (types.indexOf(node.type) !== -1) return node;
  if (node.parent) return findParent(node.parent, types);

  return undefined;
}

function ensureParentIsAsync(node, rewriteCache) {
  let parentFunction = findParent(node, [ 'FunctionDeclaration', 'FunctionExpression' ]);
  if (!parentFunction) {
    debug('  -> no parent function found');
    return;
  }

  if (parentFunction.type === 'FunctionDeclaration') {
    if (!parentFunction.awaited) {
      parentFunction.prepend('async ');  // only first reference
      parentFunction.awaited = true;
      rewriteCache.push(parentFunction.id.name);
    }
  } else if (parentFunction.type === 'FunctionExpression') {
    if (!parentFunction.awaited) {
      parentFunction.prepend('async ');  // only first reference
      parentFunction.awaited = true;
    }

    // we need to add a `await` to parent IIFE's CallExpression if necessary
    if (isIIFE(parentFunction)) {
      let iifeParentCallExpression = findParent(parentFunction, 'CallExpression').parent;
      if (!iifeParentCallExpression.awaited) {
        iifeParentCallExpression.prepend('await ');
        iifeParentCallExpression.awaited = true;
      }
    } else {
      if (parentFunction.parent.type === 'CallExpression' &&
          !isAssertThrows(parentFunction.parent.callee)) {
        parentFunction.prepend('await ');
        parentFunction.awaited = true;
      }
    }
  }
}

function nodeStack(node, stack) {
  stack = stack || [];
  stack.push(node.type);
  if (node.parent) nodeStack(node.parent, stack);
  return stack;
}

function stackEquals(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Determine whether the given node represents code that should be async wrapped
 * at the Program level.
 *
 * @param {Object} node
 */
function shouldAsyncWrap(node) {
  // NOTE: This is going to be incredibly naive as I'm working through code snippets,
  //       the hope being that we will eventually see smarter patterns. It should also
  //       be noted that we're incurring some performance penalties for the recursive
  //       `nodeStack` invocation here, as well as `stackEquals`.

  let stack = nodeStack(node);
  if (stackEquals(stack, [ 'CallExpression', 'CallExpression', 'ExpressionStatement', 'Program' ])) {
    return true;
  }

  // for/while-loop at Program level - inefficient..
  if (stackEquals(stack, [ 'CallExpression', 'ExpressionStatement', 'ForStatement', 'Program' ]) ||
      stackEquals(stack, [ 'CallExpression', 'ExpressionStatement', 'BlockStatement', 'ForStatement', 'Program' ]) ||
      stackEquals(stack, [ 'CallExpression', 'ExpressionStatement', 'WhileStatement', 'Program' ]) ||
      stackEquals(stack, [ 'CallExpression', 'ExpressionStatement', 'BlockStatement', 'WhileStatement', 'Program' ])) {
    return true;
  }

  if (node.parent.type === 'AssignmentExpression' ||
      node.parent.type === 'VariableDeclarator') {
    return node.parent.parent.parent.type === 'Program';
  }

  return node.parent.type === 'Program' ||
         node.parent.parent.type === 'Program';
}

function isAssertThrows(node) {
  return node && node.object && node.object.name === 'assert' && node.property.name === 'throws';
}

function isAsyncThrowsMethod(node) {
  return node && node.object && node.object.name === 'assert' &&
    (node.property.name === 'commandFailed' ||
     node.property.name === 'commandWorked' ||
     node.property.name === 'commandFailedWithCode');
}


// NOTE: There is something bad going on here.. it appears I'm sending in ExpressionStatements
//       in for non-assignment wrapping. No time to investigate atm, lots of room to improve here.
function applyAsyncWrapper(node, programNode) {
  if (node.asyncWrapped) {
    // already wrapped
    return;
  }

  debug('  -> applying async wrapper');
  programNode = programNode || node;
  let needsExpressionSemicolon = !(node.source().endsWith(';'));
  let needsEndSemicolon = (node === programNode) ? true : !(programNode.source().endsWith(';'));
  node.prepend('(() => { async function _wrap() { return ');
  let suffix = needsExpressionSemicolon ? '; ' : ' ';
  suffix += '} return _wrap(); })()';
  suffix += needsEndSemicolon ? ';' : '';
  node.append(suffix);

  // mark it as wrapped in the AST
  node.asyncWrapped = true;
}

const TYPE_UNKNOWN = 0;
const TYPE_DB = 1;
const TYPE_COLLECTION = 2;
const TYPE_CURSOR = 3;

function typeToString(type) {
  if (type === TYPE_DB) return 'db';
  else if (type === TYPE_COLLECTION) return 'collection';
  else if (type === TYPE_CURSOR) return 'cursor';
  return 'unknown';
}

function getCallParts(node, parts) {
  parts = parts || [];
  if (node.type === 'MemberExpression') {
    parts.unshift(node.property.name);
    parts.unshift(node.object.name);
  } else if (node.type === 'Identifier') {
    parts.unshift(node.name);
  } else {
    if (node.callee && node.callee.type === 'MemberExpression') {
      parts.unshift(node.callee.property.name);

      if (node.callee.object.type === 'CallExpression') {
        getCallParts(node.callee.object, parts);
      } else if (node.callee.object.type === 'MemberExpression') {
        parts.unshift(node.callee.object.property.name);
        parts.unshift(node.callee.object.object.name);
      } else if (node.callee.object.type === 'Identifier') {
        parts.unshift(node.callee.object.name);
      }
    }
  }

  return parts;
}

const hasProp = {}.hasOwnProperty;
function inferCalleeType(node, typeCache) {
  let type = TYPE_UNKNOWN;
  let parts = getCallParts(node);
  if (parts.length === 0) {
    return type;
  }

  if (parts[0] === 'db') {
    if (parts.length > 1 && (DB_METHODS.indexOf(parts[1]) === -1 || DB_COMPAT_METHODS.indexOf(parts[1]) !== -1)) {
      if (CREATE_CURSOR_METHODS.indexOf(parts[2]) !== -1) {
        type = TYPE_CURSOR;
      } else {
        type = TYPE_COLLECTION;
      }
    } else {
      type = TYPE_DB;
    }
  } else if (typeCache && hasProp.call(typeCache, parts[0])) {
    type = typeCache[parts[0]];
  }

  return type;
}

function maybeCacheAssignedType(lhs, rhs, typeCache) {
  if (rhs.type === 'ArrayExpression') {
    return;
  }

  let type = inferCalleeType(rhs, typeCache);
  if (type !== TYPE_UNKNOWN) {
    debug('  -> cached `' + lhs + '` as type:', typeToString(type));
    typeCache[lhs] = type;
  }
}

function isAsyncCallExpression(node, typeCache) {
  let method = node.callee.property.name;
  let type = inferCalleeType(node, typeCache);

  if (type === TYPE_COLLECTION) {
    return COLLECTION_ASYNC_METHODS.indexOf(method) !== -1;
  } else if (type === TYPE_CURSOR) {
    return CURSOR_ASYNC_METHODS.indexOf(method) !== -1;
  } else if (type === TYPE_DB) {
    return DB_ASYNC_METHODS.indexOf(method) !== -1;
  }

  return false;
}

/**
 *
 * @param {*} src
 * @param {Object}   [options]
 * @param {Boolean} [options.repl] is the rewrite being done for REPL vs file mode
 */
function rewriteScript(src, options) {
  options = options || { repl: false };

  let rewriteCache = [];
  let typeCache = options.typeCache || Object.create(null);
  let output = falafel(src, function(node) {
    if (node.type === 'VariableDeclaration') {
      debug('[VARDEC]: ', node.source());

      if (node.declarations.some(d => d.init && d.init.awaited)) {
        if (options.repl) {
          applyAsyncWrapper(node.declarations[0].init);  // TODO: what about multiple declarations?
        }
      } else {
        let decl = node.declarations[0];
        if (decl.init) {
          maybeCacheAssignedType(decl.id.name, decl.init, typeCache);
        }
      }
    }

    if (node.type === 'AssignmentExpression') {
      debug('[ASSGNEXPR]: ', node.source());
      if (node.right.awaited) {
        rewriteCache.push(node.left.name);
      } else {
        maybeCacheAssignedType(node.left.name, node.right, typeCache);
      }
    }

    if (node.type === 'CallExpression') {
      // NOTE: see note in `applyAsyncWrapper` above, this is a workaround to see the actual rewritten code
      if (node.parent.type === 'ExpressionStatement') {
        debug('[CALLEXPR]: ', node.parent.source());
      } else {
        debug('[CALLEXPR]: ', node.source());
      }

      if ((isAssertThrows(node.callee) || isAsyncThrowsMethod(node.callee)) &&
          node.arguments.some(a => a.awaited)) {
        node.callee.prepend('await ');
        node.callee.awaited = true;
        ensureParentIsAsync(node, rewriteCache);
      }

      if (rewriteCache.indexOf(node.callee.name) !== -1) {
        node.prepend('await ');
        node.awaited = true;
        ensureParentIsAsync(node, rewriteCache);
        return;
      }

      if (!node.callee || !node.callee.property) return;

      let source = node.source();

      if (isAsyncCallExpression(node, typeCache) && !isIIFE(node)) {
        // NOTE: this will have to become _much_ smarter, but solves current test cases, specifically
        //       this addresses cases such as `assert.eq(await cursor.next()` not requiring a await
        //       before the `assert.eq`.
        if (source.startsWith('await')) {
          node.awaited = true;
          return;
        }

        if ((node.parent && node.parent.type === 'UnaryExpression' && node.parent.operator === '!') ||
            (node.parent && node.parent.type === 'BinaryExpression' && node.parent.operator === 'in')) {
          node.prepend('(await ');
          node.append(')');
        } else if (node.parent && node.parent.callee && isAsyncThrowsMethod(node.parent.callee)) {
          // do nothing, we will pass the promise to the assert method
          node.parent.awaited = true;
        } else {
          node.prepend('await ');
        }

        debug('  -> awaited async callexpr');
        node.awaited = true;
        ensureParentIsAsync(node, rewriteCache);

        if (options.repl) {
          if (node.awaited && shouldAsyncWrap(node)) {
            let programNode = findParent(node, [ 'Program' ]);
            if (node.parent.type === 'AssignmentExpression' ||
                node.parent.type === 'VariableDeclarator') {
              applyAsyncWrapper(node, programNode);
            } else if (node.parent.parent.type === 'ForStatement' ||
                       node.parent.parent.type === 'WhileStatement' ||
                       (node.parent.parent.parent && (
                        node.parent.parent.parent.type === 'ForStatement' ||
                        node.parent.parent.parent.type === 'WhileStatement'))) {
              applyAsyncWrapper(node);
            } else {
              applyAsyncWrapper(programNode, programNode);
              node.parent.asyncWrapped = true;
            }
          }
        }
      } else {
        // CallExpression is _not_ async
        if (node.callee && node.callee.object && node.callee.object.awaited) {
          node.callee.object.update(`(${node.callee.object.source()})`);
        }
      }
    }

    if (node.type === 'MemberExpression') {
      debug('[MEMBEREXPR]: ', node.source());
      if (node.parent.type === 'CallExpression' && node.parent.callee === node) return;
      if (node.object && node.object.awaited) {
        node.object.update(`(${node.object.source()})`);
        debug('  -> wrapped async expr in parens');
      }
    }
  });

  return output;
}

class Executor {
  constructor() {}

  static executeAsync(src, context = {}, options = {}) {
    // Instrument the code
    let output = rewriteScript(src);

    // Create the scriptString
    const scriptString = `
      (async function() {
        try {
          __executing = true;
          ${output}
          __executing = false;
        } catch (err) {
          // console.log(err)
          __executing = false;
          __executingError = err;
        };
      })();
    `.trim();

    // console.log("========================================================")
    debug(scriptString);

    // Create a script object
    const script = new Script(scriptString, options);

    // Add the variables to the global scope
    context.__executing = false;

    // Run a script in the global context of the shell
    return script.runInContext(context);
  }

  static async executeSync(file, context, options) {
    await this.executeAsync(file, context, options);

    // console.log("-------------------------- 0")
    // Wait for execution to finish
    while (context.__executing) {
      await sleep(10);
    }
    // console.log("-------------------------- 1")
  }
}

module.exports = Executor;
module.exports.rewriteScript = rewriteScript;
module.exports.inferCalleeType = inferCalleeType;
module.exports.TYPE_UNKNOWN = TYPE_UNKNOWN;
module.exports.TYPE_DB = TYPE_DB;
module.exports.TYPE_COLLECTION = TYPE_COLLECTION;
module.exports.TYPE_CURSOR = TYPE_CURSOR;
