const docs = require('./docs');
const parseSchema = require('mongodb-schema');

class OdmGenerator {
  constructor(client, options = {}) {
    this.client = client;
    this.log = options.log || console.log;
  }

  namespace() {
    return 'schema';
  }

  decorateContext(context) {
    return Promise.resolve(Object.assign(context, {
      schema: new Plugin(this.client)
    }));
  }

  description() {
    return "ODM Generator plugin";
  }

  autocomplete(hint) {
    if (!hint) throw new Error('no hint passed to plugin');
    // remove namespace if it exits
    const cmd = hint[0].replace(`${this.namespace()}.`, '');
    // Do we have a docs item for this
    if (docs[cmd]) return docs[cmd];
    throw new Error(`no documentation found for ${hint}`);
  }

  help(hints) {
    return [
      ['schema.collection()', 'Return a collection schema instance'],
      ['schema.schema()', 'Returns all the collection schemas for the currently selected database'],
    ]
  }
}

class Plugin {
  constructor(client) {
    this.client = client;
  }

  /**
   * Returns a collection schema model
   *
   * @return {String}
   */
  collection(name) {
    return new Collection(this.client, this.client.collection(name));
  }

  /**
   * Returns all the schemas for the current databae
   * @return {Promise}
   */
  async schema(options = { mode: 'sample', size: 1000 }) {
    const collections = await this.client.listCollections().toArray();
    const results = {};

    for (const col of collections) {
      const schema = await parseSchemaPromise(this.client
        .collection(col.name), options);
      results[col.name] = schema;
    }

    return results;
  }
}

class Collection {
  constructor(client, collection) {
    this.client = client;
    this.collection = collection;
  }

  /**
   * Returns the collection schema
   * @return {Promise}
   */
  async schema(options = { mode: 'sample', size: 1000 }) {
    return await parseSchemaPromise(this.collection, options);
  }
}

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

module.exports = OdmGenerator;
