const docs = require('./docs');
const co = require('co');
const fs = require('fs');
const pluralize = require('pluralize');
const capitalize = require('capitalize');
const {
  parseSchemaPromise
} = require('./shared');
const MongooseGenerator = require('./lib/mongoose');
const Collection = require('./collection');
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
    // Do we have a docs item for this
    if (docs[hint[0]]) return docs[hint[0]];
    throw new Error(`no documentation found for ${hint}`);
  }

  help(hints) {
    return [
      ['schema.collection()', 'Return a collection schema instance.'],
      ['schema.schema()', 'Return schema information for all collection in the current db.'],
      ['schema.generate()', 'Generate schema ODM language files for current db.'],
      ['schema.collection(name).generate()', 'Generates schema ODM language files.'],
      ['schema.collection(name).schema()', 'Generates collection schema ODM language file.'],
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
   * @param name String the collection name
   * @return {String}
   */
  collection(name) {
    return new Collection(this.client, this.client.collection(name), this.generators, this.options);
  }

  /**
   * Returns all the schemas for the current databae
   * 
   * @param [options.mode=sample] String the sampling method, can be one of [sample,full].
   * @param [options.size=1000] Number the sample size if [options.mode=sample] is defined.
   * @return {Promise}
   */
  schema(options = { mode: 'sample', size: 1000 }) {
    const self = this;

    return co(function*() {
      const collections = yield self.client.listCollections().toArray();
      const results = {};

      // Set default options
      if (!options.mode) options.mode = 'sample';
      if (!options.size) options.size = 1000;

      // Generate the schema
      for (const col of collections) {
        const schema = yield parseSchemaPromise(self.client
          .collection(col.name), options);
        results[col.name] = schema;
      }

      return Promise.resolve(results);
    });
  }

  /**
   * Returns the collection schema
   * 
   * @param [options] Object Options passed to the generator.
   * @param [options.target] String the target ODM, can be one of [mongoose].
   * @param [options.output=.] String the output directory.
   * @param [options.preview=false] Boolean return the ODM class preview.
   * @param [options.mode=sample] String the sampling method, can be one of [sample,full].
   * @param [options.size=1000] Number the sample size if [options.mode=sample] is defined.
   * @return {Promise}
   */
  generate(options = {}) {
    const self = this;

    return co(function*() {
      if (!options.target) throw new Error('target must be set to one of the supported targets [mongoose]');
      if (modes.indexOf(options.target) == -1) throw new Error('target must be set to one of the supported targets [mongoose]');

      // Set default options
      if (!options.mode) options.mode = 'sample';
      if (!options.size) options.size = 1000;
      if (!options.output) options.output = '.';

      const collections = yield self.client.listCollections().toArray();
      const results = [];

      // Let's determine the generator we are going to use
      const generator = self.generators[options.target];

      for (const col of collections) {
        self.log(`Generating Schema for collection ${col.name}`);
        const schema = yield parseSchemaPromise(self.client
          .collection(col.name), options);
        self.log(`Generating ${options.target} ODM Schema for collection ${col.name}`);

        // Singular name
        const singular = pluralize.singular(col.name);
        const singularCapitalized = capitalize(singular);
        // Lets generate the actual template file
        const file = yield generator.generate(singularCapitalized, schema, options);      
        if (options.preview === true) {
          results.push(file);
        } else {
          fs.writeFileSync(`${options.output}/${singular}.js`, file, 'utf8');
          self.log(`Generating ${options.target} ODM Schema for collection ${col.name} to file ${options.output}/${singular}.js`);        
        }
      }

      if (options.preview) return results;
      return Promise.resolve(`Successfully generated ${options.target} ODM Schema`);
    })
  }
}

module.exports = OdmGenerator;
