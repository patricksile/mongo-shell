'use strict';
const os = require('os');
const fs = require('fs');
const vm = require('vm');

class Native {
  static decorate(context, state) {
    const methods = Object.getOwnPropertyNames(Native.prototype);
    for (let name of methods) {
      if (typeof Native.prototype[name] === 'function' && name !== 'constructor') {
        context[name] = Native.prototype[name].bind({ state: state });
      }
    }

    return context;
  }

  /**
   * Returns the contents of the specified file.
   */
  cat() {}

  /**
   * Returns the current version of the mongo shell instance.
   */
  version() {}

  /**
   * Changes the current working directory to the specified path.
   */
  cd() {}

  /**
   * Suspends the mongo shell for a given period of time.
   */
  sleep() {}

  /**
   * Copies a local dbPath. For internal use.
   */
  copyDbpath() {}

  /**
   * Removes a local dbPath. For internal use.
   */
  resetDbpath() {}

  /**
   * For internal use to support testing.
   */
  fuzzFile() {}

  /**
   * Returns the hostname of the system running the mongo shell.
   */
  getHostName() { return this.hostname(); }

  /**
   * Returns a document that reports the amount of memory used by the shell.
   */
  getMemInfo() {
    // @TODO: this needs to match the output of the current shell
    return process.memoryUsage();
  }

  /**
   * Returns the hostname of the system running the shell.
   */
  hostname() { return os.hostname(); }

  /**
   * Returns true if the shell runs on a Windows system; false if a Unix or Linux system.
   */
  _isWindows() { return os.type() === 'Windows_NT'; }

  /**
   * Returns an array of documents that give the name and size of each object in the directory.
   */
  listFiles() {}

  /**
   * Loads and runs a JavaScript file in the shell.
   */
  load(path) {
    // use repl if running with repl
    if (this.state.repl) {
      this.state.repl.commands.load.action.call(this.state.repl, path);
      return;
    }

    let src = fs.readFileSync(path);
    try {
      const script = new vm.Script(src);
      script.runInContext(this.state.context);
    } catch (e) {
      console.log('[ERROR]: ', e);
    }
  }

  /**
   * Returns a list of the files in the current directory.
   */
  ls() {}

  /**
   * The md5 hash of the specified file.
   */
  md5sumFile() {}

  /**
   * Creates a directory at the specified path.
   */
  mkdir() {}

  /**
   * Returns the current directory.
   */
  pwd() {}

  /**
   * Exits the current shell session.
   */
  quit() {}

  /**
   * Returns a random number between 0 and 1.
   */
  _rand() {}

  /**
   * Removes the specified file from the local file system.
   */
  removeFile() {}

  /**
   * Configures the mongo shell to report operation timing.
   */
  setVerboseShell() {}

  /**
   * For internal use.
   */
  _srand() {}
}

module.exports = Native;
