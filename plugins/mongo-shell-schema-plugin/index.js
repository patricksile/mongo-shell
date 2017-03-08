const docs = require('./docs');
const fs = require('fs');
const pluralize = require('pluralize');
const capitalize = require('capitalize');
const parseSchema = require('mongodb-schema');
const MongooseGenerator = require('./lib/mongoose');
const modes = ['mongoose'];

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
      schema: new Plugin(this.client, this.options)
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
  constructor(client, options = {}) {
    this.client = client;
    this.options = options;
    this.log = options.log || console.log;
    // Contains all the generators
    this.generators = {
      'mongoose': new MongooseGenerator(client)
    };
  }

  /**
   * Returns a collection schema model
   *
   * @return {String}
   */
  collection(name) {
    return new Collection(this.client, this.client.collection(name), this.generators, this.options);
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

  /**
   * Returns the collection schema
   * @param [options] Object Options passed to the generator.
   * @param [options.target] String the target ODM, can be one of [mongoose].
   * @param [options.output=.] String the output directory.
   * @param [options.preview=false] Boolean return the ODM class preview.
   * @param [options.mode=sample] String the sampling method, can be one of [sample,full].
   * @param [options.size=1000] Number the sample size if [options.mode=sample] is defined.
   * @return {Promise}
   */
  async generate(options = {}) {
    if (!options.target) throw new Error('target must be set to one of the supported targets [mongoose]');
    if (modes.indexOf(options.target) == -1) throw new Error('target must be set to one of the supported targets [mongoose]');

    // Set default options
    if (!options.mode) options.mode = 'sample';
    if (!options.size) options.size = 1000;
    if (!options.output) options.output = '.';

    const collections = await this.client.listCollections().toArray();
    const results = [];

    // Let's determine the generator we are going to use
    const generator = this.generators[options.target];

    for (const col of collections) {
      this.log(`Generating Schema for collection ${col.name}`);
      const schema = await parseSchemaPromise(this.client
        .collection(col.name), options);
      this.log(`Generating ${options.target} ODM Schema for collection ${col.name}`);

      // Singular name
      const singular = pluralize.singular(col.name);
      const singularCapitalized = capitalize(singular);
      // Lets generate the actual template file
      const file = await generator.generate(singularCapitalized, schema, options);      
      if (options.preview === true) {
        results.push(file);
      } else {
        fs.writeFileSync(`${options.output}/${singular}.js`, file, 'utf8');
        this.log(`Generating ${options.target} ODM Schema for collection ${col.name} to file ${options.output}/${singular}.js`);        
      }
    }

    if (options.preview) return results;
    return `Successfully generated ${options.target} ODM Schema`;
  }
}

class Collection {
  constructor(client, collection, generators, options = {}) {
    this.client = client;
    this.collection = collection;
    this.generators = generators;
    this.options = options;
    this.log = options.log || console.log;
  }

  /**
   * Returns the collection schema
   * @return {Promise}
   */
  async schema(options = { mode: 'sample', size: 1000 }) {
    return await parseSchemaPromise(this.collection, options);
  }

  /**
   * Returns the collection schema
   * @param [options] Object Options passed to the generator.
   * @param [options.target] String the target ODM, can be one of [mongoose].
   * @param [options.output=.] String the output directory.
   * @param [options.preview=false] Boolean return the ODM class preview.
   * @param [options.mode=sample] String the sampling method, can be one of [sample,full].
   * @param [options.size=1000] Number the sample size if [options.mode=sample] is defined.
   * @return {Promise}
   */
  async generate(options = {}) {
    if (!options.target) throw new Error('target must be set to one of the supported targets [mongoose]');
    if (modes.indexOf(options.target) == -1) throw new Error('target must be set to one of the supported targets [mongoose]');

    // Set default options
    if (!options.mode) options.mode = 'sample';
    if (!options.size) options.size = 1000;
    if (!options.output) options.output = '.';

    // console.log("-------------------- generate")
    // console.dir(options)
    this.log(`Generating Schema for collection ${this.collection.collectionName}`);
    // Get the schema
    const schema = await this.schema(options);

    // Let's determine the generator we are going to use
    const generator = this.generators[options.target];

    // console.log("-------------------- schema")
    // console.log(JSON.stringify(schema, null, 2))

    this.log(`Generating ${options.target} ODM Schema for collection ${this.collection.collectionName}`);

    // Singular name
    const singular = pluralize.singular(this.collection.collectionName);
    const singularCapitalized = capitalize(singular);
    // Lets generate the actual template file
    const file = await generator.generate(singularCapitalized, schema, options);

    // If we are generating a file
    if (options.preview === true) {
      return file;
    } else {
      fs.writeFileSync(`${options.output}/${singular}.js`, file, 'utf8');
      this.log(`Generating ${options.target} ODM Schema for collection ${this.collection.collectionName} to file ${options.output}/${singular}.js`);
    }
    
    return `Successfully generated ${options.target} ODM Schema`;
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
