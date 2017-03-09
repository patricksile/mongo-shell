const parseSchema = require('mongodb-schema');

function parseSchemaPromise(collection, options = { mode: 'sample', size: 1000}) {
  return new Promise((resolve, reject) => {
    if (Object.keys(options).length > 0) {
      if (!options.mode) return reject(new Error('mode must be specified and must be either sample or full'));
    }

    if (options.mode == 'sample') {
      var size = typeof options.size == 'number' ? options.size : 1000;
      var cursor = collection.aggregate([{$sample: {size: size}}]);
    } else if (options.mode == 'full') {
      var cursor = collection.find({});
    }

    if (!cursor) {
      return reject(new Error(`mode ${options.mode} not supported`));
    }

    parseSchema(cursor, function(err, schema) {
      if(err) return reject(err);
      resolve(schema);
    });
  });
}

module.exports = {
  parseSchemaPromise
}