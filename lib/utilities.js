function tsToSeconds(x) {
  return x.t && x.i
    ? x.t
    : x / 4294967296;
}

module.exports = {
  tsToSeconds,
}
