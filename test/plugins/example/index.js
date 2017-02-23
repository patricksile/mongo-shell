class ExamplePlugin {
  constructor(client) {
  }

  namespace() {
    console.log("ExamplePlugin namespace")
    return 'example';
  }

  decorateContext(context) {
    console.log("ExamplePlugin decorateContext")
    return Promise.resolve(Object.assign(context, {
      example: {}
    }));
  }
}

module.exports = ExamplePlugin;
