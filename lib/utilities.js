function tsToSeconds(x) {
  return x.t && x.i
    ? x.t
    : x / 4294967296;
}

RegExp.escape = function(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = {
  tsToSeconds,
}
