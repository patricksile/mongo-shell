const ReplTestFixture = require('./repl_test_fixture'),
      co = require('co'),
      rmdir = require('rmdir'),
      assert = require('assert');

let test = new ReplTestFixture();
before(() => test.databaseSetup());
after(() => test.databaseTeardown());

describe('Repl Plugin tests', () => {
  describe('plugin install', () => {
    beforeEach(() => test.setup());
    afterEach(() => test.teardown());

    it('should correctly exercise plugin shell command', function(done) {
      co(function*() {
        try {
          yield rm(`${__dirname}/../../tmp`);
        } catch(err) {}
        // List the plugins available
        let result = yield executeRepl(test, 'plugin list', test.context);
        assert.equal('', result);

        // Install a plugin
        result = yield executeRepl(test, `plugin install ${__dirname}/../plugins/example`, test.context);
        assert.ok(result.indexOf('installed successfully') != -1);

        // List the plugins again
        result = yield executeRepl(test, 'plugin list', test.context);
        assert.ok(result.indexOf('An example CLI Plugin') != -1);

        // Remove the plugin
        result = yield executeRepl(test, `plugin remove example`, test.context);
        assert.ok(result.indexOf('successfully remove the') != -1);
        assert.ok(result.indexOf('example') != -1);

        // List the plugins available
        result = yield executeRepl(test, 'plugin list', test.context);
        assert.equal('', result);

        done();
      }).catch(err => {
        console.log(err);
        throw err;
      });
    });

    it('should correctly error plugin install command', function(done) {
      co(function*() {
        try {
          yield rm(`${__dirname}/../../tmp`);
        } catch(err) {}
        // List the plugins available
        let result = yield executeRepl(test, 'plugin list', test.context);
        assert.equal('', result);

        // Install a plugin
        result = yield executeRepl(test, `plugin install ${__dirname}/../plugins/example5`, test.context);
        assert.ok(result.indexOf('plugin install error') != -1);
        done();
      }).catch(err => {
        console.log(err);
        throw err;
      });
    });
  });

  describe('exercise plugin', () => {
    beforeEach(() => test.setup());
    afterEach(() => test.teardown());

    it('should correctly call plugin function', function(done) {
      co(function*() {
        try {
          yield rm(`${__dirname}/../../tmp`);
        } catch(err) {}
        // Install a plugin
        result = yield executeRepl(test, `plugin install ${__dirname}/../plugins/example`, test.context);
        assert.ok(result.indexOf('installed successfully') != -1);

        // Execute plugin method
        result = yield executeRepl(test, `example.hello()`, test.context);
        assert.ok(result.indexOf('hello world from example plugin') != -1);

        done();
      }).catch(err => {
        console.log(err);
        throw err;
      });
    });

    it('should correctly call async plugin function', function(done) {
      co(function*() {
        try {
          yield rm(`${__dirname}/../../tmp`);
        } catch(err) {}
        // Install a plugin
        result = yield executeRepl(test, `plugin install ${__dirname}/../plugins/example`, test.context);
        assert.ok(result.indexOf('installed successfully') != -1);

        // Execute plugin method
        result = yield executeRepl(test, `example.asyncHello()`, test.context);
        assert.ok(result.indexOf('hello world from async example plugin') != -1);

        done();
      }).catch(err => {
        console.log(err);
        throw err;
      });
    });
  });
});

function rm(string) {
  return new Promise((resolve, reject) => {
    // Execute command
    rmdir(string, (err, result) => {
      if(err) return reject(err);
      resolve(result);
    });
  });
}

function executeRepl(test, string, context) {
  return new Promise((resolve, reject) => {
    // Execute command
    test.repl.eval(string, context, '', (err, result) => {
      if(err) return reject(err);
      resolve(result);
    });
  });
}
