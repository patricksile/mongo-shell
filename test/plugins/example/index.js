class ExamplePlugin {
  constructor(client) {
    this.client = client;
  }

  namespace() {
    return 'example';
  }

  decorateContext(context) {
    return Promise.resolve(Object.assign(context, {
      example: new Plugin()
    }));
  }

  help(string) {
    return "Example plugin help";
  }
}

class Plugin {
  constructor(client) {
  }

  hello() {
    return 'hello world from example plugin';
  }

  async asyncHello() {
    return 'hello world from async example plugin';
  }
}

module.exports = ExamplePlugin;
