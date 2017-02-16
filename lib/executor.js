const { sleep } = require('./helpers');
const Script = require('vm').Script;
const falafel = require('falafel');
const debug = require('util').debuglog('translator');

// @TODO: We are just checking the existence of these method names, however the
//        more complete solution would be to introspect if they are indeed the type
//        of object we expect them to be.
const ASYNC_METHODS = [
  // Database
  'auth', 'cloneCollection', 'cloneDatabase', 'commandHelp', 'copyDatabase',
  'createCollection', 'createRole', 'createUser', 'createView', 'currentOp',
  'dropAllRoles', 'dropAllUsers', 'dropDatabase', 'dropRole', 'dropUser',
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
  'itcount',

  // Cursors
  'close', 'count', 'explain', 'hasNext', 'next', 'nextObject', 'toArray',

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

function findParent(node, type) {
  if (node.type === type) return node;
  if (node.parent) return findParent(node.parent, type);
  return undefined;
}

function ensureParentIsGenerator(node, rewriteCache) {
  let parentFunction = findParent(node, 'FunctionDeclaration');
  if (parentFunction) {
    if (!parentFunction.awaited) {
      parentFunction.prepend('async ');  // only first reference
      parentFunction.awaited = true;
      rewriteCache.push(parentFunction.id.name);
    }
  } else {
    parentFunction = findParent(node, 'FunctionExpression');
    if (parentFunction) {
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
        if (parentFunction.parent.type === 'CallExpression') {
          parentFunction.prepend('await ');
          parentFunction.awaited = true;
        }
      }
    }
  }
}

function rewriteScript(src) {
  let rewriteCache = [];
  let output = falafel(src, function(node) {
    // if (node.type === 'VariableDeclaration') {
    //   if (node.declarations[0].init) {
    //     const source = node.declarations[0].init.source();
    //     if (ASYNC_RX.test(source)) {
    //       if (source.match(/await/)) return;
    //       node.declarations[0].init.update(`await ${source}`);
    //       node.declarations[0].init.awaited = true;
    //     }
    //   }
    // }

    if (node.type === 'CallExpression') {
      debug('[CALLEXPR]: ', node.source());
      if (rewriteCache.indexOf(node.callee.name) !== -1) {
        node.prepend('await ');
        node.awaited = true;
        ensureParentIsGenerator(node, rewriteCache);
        return;
      }

      if (!node.callee || !node.callee.property) return;

      let source = node.source();
      if (ASYNC_METHODS.indexOf(node.callee.property.name) > -1 && !isIIFE(node)) {
        // NOTE: this will have to become _much_ smarter, but solves current test cases, specifically
        //       this addresses cases such as `assert.eq(await cursor.next()` not requiring a await
        //       before the `assert.eq`.
        if (source.startsWith('await')) {
          node.awaited = true;
          return;
        }

        // console.dir(node);
        if ((node.parent && node.parent.type === 'UnaryExpression' && node.parent.operator === '!') ||
            (node.parent && node.parent.type === 'BinaryExpression' && node.parent.operator === 'in')) {
          node.update(`(await ${source})`);
        } else {
          node.prepend('await ');
        }

        debug('  -> awaited async callexpr');
        node.awaited = true;
        ensureParentIsGenerator(node, rewriteCache);

        if (node.callee && node.callee.property && node.callee.property.name === 'drop') {
          node.update(`try { ${node.source()}; } catch(err) { console.warn(err); }`);
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

  /*
    if (node.type === 'CallExpression') {
      // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      // console.log(`${node.type} :: "${node.source()}"`)
      // console.dir(`parent: ${node.parent.source()}`)

      // Only wrap the end function in the wrapper function (if db.a.get('a').list()) wrap chained functions and only wrap the
      // last function
      if (node.parent && node.parent.source().indexOf(`${node.source()}.`) === -1) {
        // Set the value of the detectCallbacks
        const detectCallbacks = typeof options.detectCallbacks === 'boolean' ? options.detectCallbacks : false;
        // Update the node with the wrapper
        node.update(`__result = yield __shellWrapperMethod(${detectCallbacks}, "${node.callee.source()}", ${node.callee.source()}).apply(${node.callee.object ? node.callee.object.source() : 'this'}, [${node.arguments.map(x => x.source())}])`);
      }
    } else if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      // Wrap the content in a co routine
      const functionName = node.id ? node.id.name : '';
      // Update the node for the function
      node.update(`
        function ${functionName}(${node.params ? node.params.map(x => x.name) : ''}) {
          return new Promise((__resolve, __reject) => {
            co(function*() {
              ${node.body.body.map(x => x.source()).join('\n')}
              __resolve();
            }).catch(err => {
              __reject(err);
            });
          });
        }
      `.trim());
    } else if (node.type === 'ReturnStatement') {
      if (node.argument) {
        node.update(`return __resolve(${node.argument.raw ? node.argument.raw : node.argument.name})`.trim());
      }
    } else if (node.type === 'VariableDeclaration' && node.parent && node.parent.type === 'Program') {
      const sourceParts = node.source().split(' ');
      const newString = ['__result', '='].concat(sourceParts.slice(1));
      node.update(newString.join(' '));
    } else if (node.type === 'ExpressionStatement' && node.parent && node.parent.type === 'Program') {
      const sourceParts = node.source().split(' ');
      const newString = ['__result', '='].concat(sourceParts);
      node.update(newString.join(' '));
    }
  */

  return output;
}

class Executor {
  constructor() {}

  executeAsync(src, context = {}, options = {}) {
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
          console.log(err)
          __executing = false;
          __executingError = err;
        };
      })();
    `.trim();

    // console.log("========================================================")
    debug(scriptString);

    // Create a script object
    const script = new Script(scriptString, {});

    // Add the variables to the global scope
    context.__executing = false;

    // Run a script in the global context of the shell
    return script.runInContext(context);
  }

  executeSync(file, context, options) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.executeAsync(file, context, options);

        // console.log("-------------------------- 0")
        // Wait for execution to finish
        while (context.__executing) {
          await sleep(10);
        }
        // console.log("-------------------------- 1")

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = Executor;
module.exports.rewriteScript = rewriteScript;

