class ExamplePlugin {
  constructor(client) {
  }

  namespace() {
    console.log("ExamplePlugin namespace")
    return 'example';
  }

  decorateContext(context) {
    return Promise.resolve(Object.assign(context, {
      example: {}
    }));
  }
}

module.exports = ExamplePlugin;
