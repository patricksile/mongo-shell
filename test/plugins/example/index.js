const docs = require('./docs');

class ExamplePlugin {
  constructor(client) {
    this.client = client;
  }

  namespace() {
    return require(`${__dirname}/package.json`).name;
  }

  decorateContext(context) {
    return Promise.resolve(Object.assign(context, {
      example: new Plugin()
    }));
  }

  description() {
    return "Example plugin help";
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
      ['example.hello()', 'Return a synchronous hello world'],
      ['example.asyncHello()', 'Return a asynchronous hello world'],
    ]
  }
}

class Plugin {
  constructor(client) {
  }

  /**
   * A simple synchronous hello method
   *
   * @return {String}
   */
  hello() {
    return 'hello world from example plugin';
  }

  /**
   * A simple Asynchronous hello method
   * @return {Promise}
   */
  asyncHello() {
    return Promise.resolve('hello world from async example plugin');
  }
}

module.exports = ExamplePlugin;
