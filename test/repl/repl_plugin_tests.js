const ReplTestFixture = require('./repl_test_fixture'),
      rmdir = require('rmdir'),
      assert = require('assert');

function rm(string) {
  return new Promise((resolve, reject) => {
    // Execute command
    rmdir(string, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

let test = new ReplTestFixture();
before(() => test.databaseSetup());
after(() => test.databaseTeardown());

describe('Repl Plugin tests', () => {
  describe('plugin install', () => {
    beforeEach(() => test.setup());
    afterEach(() => test.teardown());

    it('should correctly exercise plugin shell command', async function() {
      try {
        await rm(`${__dirname}/../../tmp`);
      } catch (err) {
        // ignore
      }

      // List the plugins available
      let result = await test.executeRepl('plugin list', test.context);
      assert.equal('', result);

      // Install a plugin
      result = await test.executeRepl(`plugin install ${__dirname}/../plugins/example`, test.context);
      assert.ok(result.indexOf('installed successfully') !== -1);

      // List the plugins again
      result = await test.executeRepl('plugin list', test.context);
      assert.ok(result.indexOf('An example CLI Plugin') !== -1);

      // Remove the plugin
      result = await test.executeRepl('plugin remove example', test.context);
      assert.ok(result.indexOf('successfully remove the') !== -1);
      assert.ok(result.indexOf('example') !== -1);

      // List the plugins available
      result = await test.executeRepl('plugin list', test.context);
      assert.equal('', result);
    });

    it('should correctly error plugin install command', async function() {
      try {
        await rm(`${__dirname}/../../tmp`);
      } catch (err) {
        // ignore
      }

      // List the plugins available
      let result = await test.executeRepl('plugin list', test.context);
      assert.equal('', result);

      // Install a plugin
      result = await test.executeRepl(`plugin install ${__dirname}/../plugins/example5`, test.context);
      assert.ok(result.indexOf('plugin install error') !== -1);
    });
  });

  describe('exercise plugin', () => {
    beforeEach(() => test.setup());
    afterEach(() => test.teardown());

    it('should correctly call plugin function', async function() {
      try {
        await rm(`${__dirname}/../../tmp`);
      } catch (err) {
        // ignore
      }

      // Install a plugin
      let result = await test.executeRepl(`plugin install ${__dirname}/../plugins/example`, test.context);
      assert.ok(result.indexOf('installed successfully') !== -1);

      // Execute plugin method
      result = await test.executeRepl('example.hello()', test.context);
      assert.ok(result.indexOf('hello world from example plugin') !== -1);
    });

    it('should correctly call async plugin function', async function() {
      try {
        await rm(`${__dirname}/../../tmp`);
      } catch (err) {
        // ignore
      }

      // Install a plugin
      let result = await test.executeRepl(`plugin install ${__dirname}/../plugins/example`, test.context);
      assert.ok(result.indexOf('installed successfully') !== -1);

      // Execute plugin method
      result = await test.executeRepl('example.asyncHello()', test.context);
      assert.ok(result.indexOf('hello world from async example plugin') !== -1);
    });
  });
});
