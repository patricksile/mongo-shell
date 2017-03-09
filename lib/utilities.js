function tsToSeconds(x) {
  return x.t && x.i
    ? x.t
    : x / 4294967296;
}

RegExp.escape = function(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function isAsyncFunction(fn) {
  const constructor = fn.constructor;
  if (!constructor) return false;
  if (constructor.name === 'AsyncFunction' || constructor.displayName === 'AsyncFunction') return true;
  return false;
}

function isPromise(fn) {
  const constructor = fn.constructor;
  if (!constructor) return false;
  if (constructor.name === 'Promise' || constructor.displayName === 'Promise') return true;
  return false;
}

module.exports = {
  tsToSeconds,
  isAsyncFunction,
  isPromise
};
