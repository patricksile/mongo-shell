const { sleep } = require('./helpers');
const Script = require('vm').Script;
const falafel = require('falafel');
const debug = require('util').debuglog('translator');

// @TODO: We are just checking the existence of these method names, however the
//        more complete solution would be to introspect if they are indeed the type
//        of object we expect them to be.
const ASYNC_METHODS = [
  // Database
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
  'updateUser', 'version',

  // Collections
  'bulkWrite', 'count', 'createIndex', 'createIndexes', 'deleteMany', 'deleteOne',
  'distinct', 'drop', 'dropAllIndexes', 'dropIndex', 'dropIndexes', 'ensureIndex',
  'findAndModify', 'findAndRemove', 'findOne', 'findOneAndDelete', 'findOneAndReplace',
  'findOneAndUpdate', 'geoHaystackSearch', 'geoNear', 'group', 'indexes', 'indexExists',
  'indexInformation', 'insert', 'insertMany', 'insertOne', 'isCapped', 'mapReduce',
  'options', 'parallelCollectionScan', 'reIndex', 'remove', 'rename', 'replaceOne',
  'save', 'stats', 'update', 'updateMany', 'updateOne',

  // Collection (legacy)
  'getIndexes', 'getIndexKeys', 'itcount', 'runCommand', 'validate',

  // Cursors
  'close', 'count', 'hasNext', 'next', 'nextObject', 'toArray',

  // Cursors (legacy)
  'arrayAccess', 'countReturn', 'length', 'size',

  // Databases
  'dropDatabase', 'createView'
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

/**
 * Determine whether the given node represents code at the Program (root) level
 * of execution.
 *
 * @param {Object} node
 */
function isProgramExpression(node) {
  // NOTE: looks a little sketchy huh? :)
  return node.parent.type === 'Program' ||
         node.parent.parent.type === 'Program' ||
         node.parent.parent.parent.type === 'Program';
}

function isAssertThrows(node) {
  return node && node.object && node.object.name === 'assert' && node.property.name === 'throws';
}

// NOTE: There is something bad going on here.. it appears I'm sending in ExpressionStatements
//       in for non-assignment wrapping. No time to investigate atm, lots of room to improve here.
function applyAsyncWrapper(node, programNode) {
  let needsExpressionSemicolon = !(node.source().endsWith(';'));
  let needsEndSemicolon = (node === programNode) ? true : !(programNode.source().endsWith(';'));
  node.prepend('(() => { async function _wrap() { return ');
  let suffix = needsExpressionSemicolon ? '; ' : ' ';
  suffix += '} return _wrap(); })()';
  suffix += needsEndSemicolon ? ';' : '';
  node.append(suffix);
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
  let output = falafel(src, function(node) {
    if (node.type === 'AssignmentExpression') {
      if (node.right.awaited) {
        rewriteCache.push(node.left.name);
      }
    }

    if (node.type === 'CallExpression') {
      // NOTE: see note in `applyAsyncWrapper` above, this is a workaround to see the actual rewritten code
      if (node.parent.type === 'ExpressionStatement') {
        debug('[CALLEXPR]: ', node.parent.source());
      } else {
        debug('[CALLEXPR]: ', node.source());
      }

      // NOTE: special case for `assert.throws` with an async argument
      // if (isAssertThrows(node.callee)) console.dir(node, { depth: null });
      if (isAssertThrows(node.callee) && node.arguments.some(a => a.awaited)) {
        node.callee.prepend('await ');
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
      if (ASYNC_METHODS.indexOf(node.callee.property.name) !== -1 && !isIIFE(node)) {
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
        } else {
          node.prepend('await ');
        }

        debug('  -> awaited async callexpr');
        node.awaited = true;
        ensureParentIsAsync(node, rewriteCache);

        if (options.repl) {
          if (node.awaited && isProgramExpression(node)) {
            let programNode = findParent(node, [ 'Program' ]);
            if (node.parent.type === 'AssignmentExpression' ||
                node.parent.type === 'VariableDeclarator') {
              if (!node.asyncWrapped) {
                applyAsyncWrapper(node, programNode);
                node.asyncWrapped = true;
              }
            } else {
              if (!programNode.asyncWrapped) {
                applyAsyncWrapper(programNode, programNode);
                programNode.asyncWrapped = true;
              }
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
