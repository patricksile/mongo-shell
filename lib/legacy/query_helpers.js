'use strict';

function applyCountOptions(query, options) {
  const opts = Object.assign({}, options || {});

  if (typeof opts.skip === 'number') {
    query.skip(opts.skip);
  }

  if (typeof opts.limit === 'number') {
    query.limit(opts.limit);
  }

  if (typeof opts.maxTimeMS === 'number') {
    query.maxTimeMS(opts.maxTimeMS);
  }

  if (opts.hint) {
    query.hint(opts.hint);
  }

  if (typeof opts.readConcern === 'string') {
    query.readConcern(opts.readConcern);
  }

  if (typeof opts.collation === 'object') {
    query.collation(opts.collation);
  }

  return query;
}

module.exports = { applyCountOptions };
