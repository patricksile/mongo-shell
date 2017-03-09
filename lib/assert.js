'use strict';
const { getErrorWithCode } = require('./helpers');
const { isAsyncFunction, isPromise } = require('./utilities');
const { BulkWriteResult } = require('mongodb/lib/bulk/common');
const util = require('util');

let friendlyEqual = function(a, b) {
  if (a == b) { // eslint-disable-line
    return true;
  }

  a = JSON.stringify(a, false, true);
  b = JSON.stringify(b, false, true);

  if (a == b) { // eslint-disable-line
    return true;
  }

  let clean = function(s) {
    s = s.replace(/NumberInt\((\-?\d+)\)/g, '$1');
    return s;
  };

  a = clean(a);
  b = clean(b);

  if (a == b) { // eslint-disable-line
    return true;
  }

  return false;
};

let doassert = function(msg, obj) {
  // eval if msg is a function
  if (typeof(msg) === 'function') {
    msg = msg();
  }

  if (typeof(msg) === 'object') {
    msg = JSON.stringify(msg);
  }

  if (typeof(msg) === 'string' && msg.indexOf('assert') === 0) {
    console.log(msg);
  } else {
    console.log('assert: ' + msg);
  }

  let ex = obj ? getErrorWithCode(obj, msg) : new Error(msg);
  console.log(ex.stack);
  throw ex;
};

let assert = function(b, msg) {
  if (arguments.length > 2) {
    doassert('Too many parameters to assert().');
  }

  if (arguments.length > 1 && typeof(msg) !== 'string') {
    doassert("Non-string 'msg' parameters are invalid for assert().");
  }

  if (assert._debug && msg) {
    console.log('in assert for: ' + msg);
  }

  if (b) {
    return;
  }

  doassert(msg === undefined ? 'assert failed' : 'assert failed : ' + msg);
};

assert.automsg = function(b) {
  assert(eval(b), b); // eslint-disable-line
};

assert._debug = false;

assert.eq = function(a, b, msg) {
  if (assert._debug && msg) {
    console.log('in assert for: ' + msg);
  }

  if (a == b) { // eslint-disable-line
    return;
  }

  if ((a != null && b != null) && friendlyEqual(a, b)) { // eslint-disable-line
    return;
  }

  doassert(`[${a}] != [${b}] are not equal : ${msg}`);
};

// Sort doc/obj fields and return new sorted obj
let sortDoc = function(doc) {
  throw new Error('not implemented');
/*
    // Helper to sort the elements of the array
    var sortElementsOfArray = function(arr) {
        var newArr = [];
        if (!arr || arr.constructor != Array)
            return arr;
        for (var i = 0; i < arr.length; i++) {
            newArr.push(sortDoc(arr[i]));
        }
        return newArr;
    };

    // not a container we can sort
    if (!(doc instanceof Object))
        return doc;

    // if it an array, sort the elements
    if (doc.constructor == Array)
        return sortElementsOfArray(doc);

    var newDoc = {};
    var fields = Object.keys(doc);
    if (fields.length > 0) {
        fields.sort();
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (doc.hasOwnProperty(field)) {
                var tmp = doc[field];

                if (tmp) {
                    // Sort recursively for Arrays and Objects (including bson ones)
                    if (tmp.constructor == Array)
                        tmp = sortElementsOfArray(tmp);
                    else if (tmp._bson || tmp.constructor == Object)
                        tmp = sortDoc(tmp);
                }
                newDoc[field] = tmp;
            }
        }
    } else {
        newDoc = doc;
    }

    return newDoc;
*/
};

assert.docEq = function(a, b, msg) {
  throw new Error('not implemented');
/*
    if (assert._debug && msg)
        print("in assert for: " + msg);

    if (a == b)
        return;

    var aSorted = sortDoc(a);
    var bSorted = sortDoc(b);

    if ((aSorted != null && bSorted != null) && friendlyEqual(aSorted, bSorted))
        return;

    doassert("[" + tojson(aSorted) + "] != [" + tojson(bSorted) + "] are not equal : " + msg);
*/
};

assert.eq.automsg = function(a, b) {
  assert.eq(eval(a), eval(b), '[' + a + '] != [' + b + ']');
};

assert.neq = function(a, b, msg) {
  if (assert._debug && msg) {
    console.log(`in assert for: ${msg}`);
  }

  if (a !== b) {
    return;
  }

  doassert(`[${a}] != [${b}] are equal : ${msg}`);
};

assert.contains = function(o, arr, msg) {
  let wasIn = false;
  if (!Array.isArray(arr)) {
    throw new Error('The second argument to assert.contains must be an array.');
  }

  for (let i = 0; i < arr.length; i++) {
    wasIn = arr[i] === o || ((arr[i] !== null && o !== null) && friendlyEqual(arr[i], o));
    if (wasIn) {
      break;
    }
  }

  if (!wasIn) {
    doassert(util.inspect(o) + ' was not in ' + util.inspect(arr) + ' : ' + msg);
  }
};

/*
 * This function transforms a given function, 'func', into a function 'safeFunc',
 * where 'safeFunc' matches the behavior of 'func', except that it returns false
 * in any instance where 'func' throws an exception. 'safeFunc' also prints
 * message 'excMsg' upon catching such a thrown exception.
 */
// function _convertExceptionToReturnStatus(func, excMsg) {
//   let safeFunc = () => {
//     try {
//       return func();
//     } catch (e) {
//       console.log(`${excMsg}, exception: ${e}`);
//       return false;
//     }
//   };

//   return safeFunc;
// }

/*
 * Calls a function 'func' at repeated intervals until either func() returns true
 * or more than 'timeout' milliseconds have elapsed. Throws an exception with
 * message 'msg' after timing out.
 */
assert.soon = function(func, msg, timeout, interval) {
  throw new Error('not implemented');
/*
    if (assert._debug && msg)
        print("in assert for: " + msg);

    if (msg) {
        if (typeof(msg) != "function") {
            msg = "assert.soon failed, msg:" + msg;
        }
    } else {
        msg = "assert.soon failed: " + func;
    }

    var start = new Date();
    timeout = timeout || 5 * 60 * 1000;
    interval = interval || 200;
    var last;
    while (1) {
        if (typeof(func) == "string") {
            if (eval(func))
                return;
        } else {
            if (func())
                return;
        }

        diff = (new Date()).getTime() - start.getTime();
        if (diff > timeout) {
            doassert(msg);
        }
        sleep(interval);
    }
*/
};

/*
 * Calls a function 'func' at repeated intervals until either func() returns true without
 * throwing an exception or more than 'timeout' milliseconds have elapsed. Throws an exception
 * with message 'msg' after timing out.
 */
assert.soonNoExcept = function(func, msg, timeout) {
  throw new Error('not implemented');
    // var safeFunc = _convertExceptionToReturnStatus(func, "assert.soonNoExcept caught exception");
    // assert.soon(safeFunc, msg, timeout);
};

/*
 * Calls the given function 'func' repeatedly at time intervals specified by
 * 'intervalMS' (milliseconds) until either func() returns true or the number of
 * attempted function calls is equal to 'num_attempts'. Throws an exception with
 * message 'msg' after all attempts are used up. If no 'intervalMS' argument is passed,
 * it defaults to 0.
 */
assert.retry = function(func, msg, numAttempts, intervalMS) {
  throw new Error('not implemented');
/*
    var intervalMS = intervalMS || 0;
    var attempts_made = 0;
    while (attempts_made < num_attempts) {
        if (func()) {
            return;
        } else {
            attempts_made += 1;
            print("assert.retry failed on attempt " + attempts_made + " of " + num_attempts);
            sleep(intervalMS);
        }
    }
    // Used up all attempts
    doassert(msg);
*/
};

/*
 * Calls the given function 'func' repeatedly at time intervals specified by
 * 'intervalMS' (milliseconds) until either func() returns true without throwing
 * an exception or the number of attempted function calls is equal to 'num_attempts'.
 * Throws an exception with message 'msg' after all attempts are used up. If no 'intervalMS'
 * argument is passed, it defaults to 0.
 */
assert.retryNoExcept = function(func, msg, numAttempts, intervalMS) {
  throw new Error('not implemented');
/*
    var safeFunc = _convertExceptionToReturnStatus(func, "assert.retryNoExcept caught exception");
    assert.retry(safeFunc, msg, num_attempts, intervalMS);
*/
};

assert.time = function(f, msg, timeout /*ms*/) {
  if (assert._debug && msg) {
    console.log(`in assert for: ${msg}`);
  }

  let res;
  let start = new Date();
  timeout = timeout || 30000;
  if (typeof(f) === 'string') {
    res = eval(f);  // eslint-disable-line
  } else {
    res = f();
  }

  let diff = (new Date()).getTime() - start.getTime();
  if (diff > timeout) {
    doassert('assert.time failed timeout ' + timeout + 'ms took ' + diff + 'ms : ' + f +
              ', msg:' + msg);
  }

  return res;
};

(function() {
  // Wrapping the helper function in an IIFE to avoid polluting the global namespace.
  function assertThrowsHelper(func, params) {
    if (typeof func !== 'function') {
      throw new Error('1st argument must be a function');
    }

    if (arguments.length >= 2 && !Array.isArray(params) &&
        Object.prototype.toString.call(params) !== '[object Arguments]') {
      throw new Error('2nd argument must be an Array or Arguments object');
    }

    let thisKeywordWasUsed = false;

    const thisSpy = new Proxy({}, {
      has: () => {
        thisKeywordWasUsed = true;
        return false;
      },

      get: () => {
        thisKeywordWasUsed = true;
        return undefined;
      },

      set: () => {
        thisKeywordWasUsed = true;
        return false;
      },

      deleteProperty: () => {
        thisKeywordWasUsed = true;
        return false;
      }
    });

    let error = null;
    let res = null;
    try {
      res = func.apply(thisSpy, params);
    } catch (e) {
      error = e;
    }

    if (thisKeywordWasUsed) {
      doassert("Attempted to access 'this' during function call in" +
               ' assert.throws/doesNotThrow. Instead, wrap the function argument in' +
               ' another function.');
    }

    return { error: error, res: res };
  }

  assert.throws = function(func, params, msg) {
    if (assert._debug && msg) {
      console.log(`in assert for: ${msg}`);
    }

    // support for assertion of async methods throwing
    if (isAsyncFunction(func)) {
      let asyncResult = (async function() {
        let error = null;
        let res = null;

        try {
          res = await func();
        } catch (e) {
          error = e;
        }

        return { error: error, res: res };
      })();

      return asyncResult
        .then(r => !r.error ? doassert(`did not throw exception: ${msg}`) : r.error);
    }

    // Use .apply() instead of calling the function directly with explicit arguments to
    // preserve the length of the `arguments` object.
    const {error} = assertThrowsHelper.apply(null, arguments);

    if (!error) {
      doassert(`did not throw exception: ${msg}`);
    }

    return error;
  };

  assert.doesNotThrow = function(func, params, msg) {
    if (assert._debug && msg) {
      console.log(`in assert for: ${msg}`);
    }

    // Use .apply() instead of calling the function directly with explicit arguments to
    // preserve the length of the `arguments` object.
    const {error, res} = assertThrowsHelper.apply(null, arguments);

    if (error) {
      doassert(`threw unexpected exception: ${error} : ${msg}`);
    }

    return res;
  };
})();

assert.throws.automsg = function(func, params) {
  throw new Error('not implemented');
/*
    if (arguments.length === 1)
        params = [];
    assert.throws(func, params, func.toString());
*/
};

assert.doesNotThrow.automsg = function(func, params) {
  throw new Error('not implemented');
/*
    if (arguments.length === 1)
        params = [];
    assert.doesNotThrow(func, params, func.toString());
*/
};

assert.commandWorked = function(res, msg) {
  if (assert._debug && msg) {
    console.log(`in assert for: ${msg}`);
  }

  if (res.ok === 1) {
    return res;
  }

  doassert(`command failed: ${util.inspect(res)} : ${msg}`, res);
};

assert.commandFailed = async function(res, msg) {
  if (assert._debug && msg) {
    console.log(`in assert for: ${msg}`);
  }

  function _commandFailed(_res, _msg) {
    if (_res.ok === 0) {
      return _res;
    }

    doassert(`command worked when it should have failed: ${util.inspect(_res)} : ${_msg}`);
  }

  if (isPromise(res)) {
    return res
      .then(r => doassert(`command worked when it should have failed: ${util.inspect(r)} : ${msg}`))
      .catch(e => { /* expected*/ });
  }

  return _commandFailed(res, msg);
};

assert.commandFailedWithCode = function(res, code, msg) {
  if (assert._debug && msg) {
    console.log(`in assert for: ${msg}`);
  }

  assert(!res.ok,
          'Command result indicates success, but expected failure with code ' + code + ': ' +
              util.inspect(res) + ' : ' + msg);
  assert.eq(res.code,
            code,
            'Expected failure code did not match actual in command result: ' + util.inspect(res) +
                ' : ' + msg);
  return res;
};

assert.isnull = function(what, msg) {
  if (assert._debug && msg) {
    console.log(`in assert for: ${msg}`);
  }

  if (what === null) {
    return;
  }

  doassert('supposed to be null (' + (msg || '') + ') was: ' + util.inspect(what));
};

assert.lt = function(a, b, msg) {
  if (assert._debug && msg) {
    console.log(`in assert for: ${msg}`);
  }

  if (a < b) {
    return;
  }

  doassert(a + ' is not less than ' + b + ' : ' + msg);
};

assert.gt = function(a, b, msg) {
  if (assert._debug && msg) {
    console.log(`in assert for: ${msg}`);
  }

  if (a > b) {
    return;
  }

  doassert(a + ' is not greater than ' + b + ' : ' + msg);
};

assert.lte = function(a, b, msg) {
  if (assert._debug && msg) {
    console.log(`in assert for: ${msg}`);
  }

  if (a <= b) {
    return;
  }

  doassert(a + ' is not less than or eq ' + b + ' : ' + msg);
};

assert.gte = function(a, b, msg) {
  if (assert._debug && msg) {
    console.log('in assert for: ' + msg);
  }

  if (a >= b) {
    return;
  }

  doassert(a + ' is not greater than or eq ' + b + ' : ' + msg);
};

assert.between = function(a, b, c, msg, inclusive) {
  if (assert._debug && msg) {
    console.log(`in assert for: ${msg}`);
  }

  if ((inclusive === undefined || inclusive === true) && a <= b && b <= c) {
    return;
  } else if (a < b && b < c) {
    return;
  }

  doassert(b + ' is not between ' + a + ' and ' + c + ' : ' + msg);
};

assert.betweenIn = function(a, b, c, msg) {
  assert.between(a, b, c, msg, true);
};

assert.betweenEx = function(a, b, c, msg) {
  assert.between(a, b, c, msg, false);
};

assert.close = function(a, b, msg, places) {
  throw new Error('not implemented');
/*
    if (places === undefined) {
        places = 4;
    }

    // This treats 'places' as digits past the decimal point.
    var absoluteError = Math.abs(a - b);
    if (Math.round(absoluteError * Math.pow(10, places)) === 0) {
        return;
    }

    // This treats 'places' as significant figures.
    var relativeError = Math.abs(absoluteError / b);
    if (Math.round(relativeError * Math.pow(10, places)) === 0) {
        return;
    }

    doassert(a + " is not equal to " + b + " within " + places + " places, absolute error: " +
             absoluteError + ", relative error: " + relativeError + " : " + msg);
*/
};

/**
 * Asserts if the times in millis are not withing delta milliseconds, in either direction.
 * Default Delta: 1 second
 */
assert.closeWithinMS = function(a, b, msg, deltaMS) {
  throw new Error('not implemented');
/*
    "use strict";
    if (deltaMS === undefined) {
        deltaMS = 1000;
    }
    var aMS = a instanceof Date ? a.getTime() : a;
    var bMS = b instanceof Date ? b.getTime() : b;
    var actualDelta = Math.abs(Math.abs(aMS) - Math.abs(bMS));
    if (actualDelta <= deltaMS)
        return;

    doassert(a + " is not equal to " + b + " within " + deltaMS + " millis, actual delta: " +
             actualDelta + " millis : " + msg);
*/
};

assert.writeOK = function(_res, msg) {
  let res = (_res && _res.result) ? _res.result : _res;

  let errMsg = null;
  // if (res instanceof WriteResult) {
  //   if (res.hasWriteError()) {
  //     errMsg = 'write failed with error: ' + util.inspect(res);
  //   } else if (res.hasWriteConcernError()) {
  //     errMsg = 'write concern failed with errors: ' + util.inspect(res);
  //   }
  // } else
  if (res instanceof BulkWriteResult) {
    // Can only happen with bulk inserts
    if (res.hasWriteErrors()) {
      errMsg = 'write failed with errors: ' + util.inspect(res);
    } else if (res.hasWriteConcernError()) {
      errMsg = 'write concern failed with errors: ' + util.inspect(res);
    }
  }

  //  else if (res instanceof WriteCommandError) {
  //   // Can only happen with bulk inserts
  //   errMsg = 'write command failed: ' + util.inspect(res);
  // } else {
  //   if (!res || !res.ok) {
  //     errMsg = 'unknown type of write result, cannot check ok: ' + util.inspect(res);
  //   }
  // }

  if (errMsg) {
    if (msg) {
      errMsg = errMsg + ': ' + msg;
    }

    doassert(errMsg, res);
  }

  return res;
};

assert.writeError = function(res, msg) {
  throw new Error('not implemented');
    // return assert.writeErrorWithCode(res, null, msg);
};

assert.writeErrorWithCode = function(res, expectedCode, msg) {
  throw new Error('not implemented');
/*
    var errMsg = null;
    var foundCode = null;

    if (res instanceof WriteResult) {
        if (res.hasWriteError()) {
            foundCode = res.getWriteError().code;
        } else if (res.hasWriteConcernError()) {
            foundCode = res.getWriteConcernError().code;
        } else {
            errMsg = "no write error: " + tojson(res);
        }
    } else if (res instanceof BulkWriteResult) {
        // Can only happen with bulk inserts
        if (res.hasWriteErrors()) {
            if (res.getWriteErrorCount() > 1 && expectedCode != null) {
                errMsg = "can't check for specific code when there was more than one write error";
            } else {
                foundCode = res.getWriteErrorAt(0).code;
            }
        } else if (res.hasWriteConcernError()) {
            foundCode = res.getWriteConcernError().code;
        } else {
            errMsg = "no write errors: " + tojson(res);
        }
    } else if (res instanceof WriteCommandError) {
        // Can only happen with bulk inserts
        // No-op since we're expecting an error
    } else {
        if (!res || res.ok) {
            errMsg = "unknown type of write result, cannot check error: " + tojson(res);
        }
    }

    if (!errMsg && expectedCode) {
        if (foundCode != expectedCode) {
            errMsg = "found code " + foundCode + " does not match expected code " + expectedCode;
        }
    }

    if (errMsg) {
        if (msg)
            errMsg = errMsg + ": " + msg;
        doassert(errMsg);
    }

    return res;
*/
};

assert.gleOK = function(res, msg) {
  throw new Error('not implemented');
/*
    var errMsg = null;

    if (!res) {
        errMsg = "missing first argument, no response to check";
    } else if (!res.ok) {
        errMsg = "getLastError failed: " + tojson(res);
    } else if ('code' in res || 'errmsg' in res || ('err' in res && res['err'] != null)) {
        errMsg = "write or write concern failed: " + tojson(res);
    }

    if (errMsg) {
        if (msg)
            errMsg = errMsg + ": " + msg;
        doassert(errMsg, res);
    }

    return res;
*/
};

assert.gleSuccess = function(dbOrGLEDoc, msg) {
  throw new Error('not implemented');
/*
    var gle = dbOrGLEDoc instanceof DB ? dbOrGLEDoc.getLastErrorObj() : dbOrGLEDoc;
    if (gle.err) {
        if (typeof(msg) == "function")
            msg = msg(gle);
        doassert("getLastError not null:" + tojson(gle) + " :" + msg, gle);
    }
    return gle;
*/
};

assert.gleError = function(dbOrGLEDoc, msg) {
  throw new Error('not implemented');
/*
    var gle = dbOrGLEDoc instanceof DB ? dbOrGLEDoc.getLastErrorObj() : dbOrGLEDoc;
    if (!gle.err) {
        if (typeof(msg) == "function")
            msg = msg(gle);
        doassert("getLastError is null: " + tojson(gle) + " :" + msg);
    }
*/
};

assert.gleErrorCode = function(dbOrGLEDoc, code, msg) {
  throw new Error('not implemented');
/*
    var gle = dbOrGLEDoc instanceof DB ? dbOrGLEDoc.getLastErrorObj() : dbOrGLEDoc;
    if (!gle.err || gle.code != code) {
        if (typeof(msg) == "function")
            msg = msg(gle);
        doassert("getLastError is null or has code other than \"" + code + "\": " + tojson(gle) +
                 " :" + msg);
    }
*/
};

assert.gleErrorRegex = function(dbOrGLEDoc, regex, msg) {
  throw new Error('not implemented');
/*
    var gle = dbOrGLEDoc instanceof DB ? dbOrGLEDoc.getLastErrorObj() : dbOrGLEDoc;
    if (!gle.err || !regex.test(gle.err)) {
        if (typeof(msg) == "function")
            msg = msg(gle);
        doassert("getLastError is null or doesn't match regex (" + regex + "): " + tojson(gle) +
                 " :" + msg);
    }
*/
};

class Assert {
  static decorate(context, state) {
    context.assert = assert;
    context.friendlyEqual = friendlyEqual;
  }
}

module.exports = Assert;
