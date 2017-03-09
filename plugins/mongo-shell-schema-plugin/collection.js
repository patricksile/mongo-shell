const docs = require('./docs');
const fs = require('fs');
const co = require('co');
const pluralize = require('pluralize');
const capitalize = require('capitalize');
const {
  parseSchemaPromise
} = require('./shared');
const MongooseGenerator = require('./lib/mongoose');
const modes = ['mongoose'];

/*
 * @class Collection
 */
class Collection {
  /**
   * @ignore
   */
  constructor(client, collection, generators, options = {}) {
    this.client = client;
    this.collection = collection;
    this.generators = generators;
    this.options = options;
    this.log = options.log || console.log;
  }

  /**
   * Returns the collection schema
   * @param [options.mode=sample] String the sampling method, can be one of [sample,full].
   * @param [options.size=1000] Number the sample size if [options.mode=sample] is defined.
   * @return {Promise}
   */
  schema(options = { mode: 'sample', size: 1000 }) {
    // Set default options
    if (!options.mode) options.mode = 'sample';
    if (!options.size) options.size = 1000;
    // Generate the schema
    return parseSchemaPromise(this.collection, options);
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
  generate(options = {}) {
    const self = this;

    return co(function*() {
      if (!options.target) throw new Error('target must be set to one of the supported targets [mongoose]');
      if (modes.indexOf(options.target) == -1) throw new Error('target must be set to one of the supported targets [mongoose]');

      // Set default options
      if (!options.mode) options.mode = 'sample';
      if (!options.size) options.size = 1000;
      if (!options.output) options.output = '.';

      self.log(`Generating Schema for collection ${self.collection.collectionName}`);
      // Get the schema
      const schema = yield self.schema(options);

      // Let's determine the generator we are going to use
      const generator = self.generators[options.target];
      self.log(`Generating ${options.target} ODM Schema for collection ${self.collection.collectionName}`);

      // Singular name
      const singular = pluralize.singular(self.collection.collectionName);
      const singularCapitalized = capitalize(singular);
      // Lets generate the actual template file
      const file = yield generator.generate(singularCapitalized, schema, options);

      // If we are generating a file
      if (options.preview === true) {
        return file;
      } else {
        fs.writeFileSync(`${options.output}/${singular}.js`, file, 'utf8');
        self.log(`Generating ${options.target} ODM Schema for collection ${self.collection.collectionName} to file ${options.output}/${singular}.js`);
      }
      
      return `Successfully generated ${options.target} ODM Schema`;
    });
  }
}

module.exports = Collection;