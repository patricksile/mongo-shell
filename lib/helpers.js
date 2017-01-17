"use strict"

function __promisify(context, func) {
  return function() {
    const args = Array.prototype.slice.call(arguments, 0);

    if (args.length > 0 && typeof args[args.length - 1] == 'function') {
      return new Promise((resolve, reject) => {
        const callback = args.pop();
        args.push((err, result) => {
          // Do we have an error
          if(err) return reject(err);
          // Resolve the result
          resolve(result);
        });
      });
    } else {
      const result = func.apply(context, args);
      // Check if it returned a promise then execute the promise
      if(Promise.resolve(result) == result) {
        return result;
      } else {
        return new Promise((resolve, reject) => {
          resolve(result);
        });
      }
    }
  }
}

function __shellWrapperMethod(method) {
  return function() {
    let promisifiedMethod = __promisify(this, method);
    let promise = promisifiedMethod.apply(this, Array.prototype.slice.call(arguments, 0));
    return promise;
  }
}

module.exports = {
  __promisify: __promisify,
  __shellWrapperMethod: __shellWrapperMethod,
}