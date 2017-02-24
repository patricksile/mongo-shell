class ExamplePlugin {
  constructor(client) {
    this.client = client;
  }

  namespace() {
    // console.log("ExamplePlugin namespace")
    return 'example';
  }

  decorateContext(context) {
    // console.log("ExamplePlugin decorate context")
    return Promise.resolve(Object.assign(context, {
      example: new Plugin()
    }));
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
