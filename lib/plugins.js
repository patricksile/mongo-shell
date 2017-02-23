const npmi = require('npmi');
const path = require('path');
const os = require('os');
const fs = require('fs');
const mkdirp = require('mkdirp');

class Plugins {
  static async cmd(code, state) {
    // Split the code into pieces
    const parts = code.split(' ');

    if (parts.length === 1) {
      return "available commands are list, install, remove, update";
    } else if (parts.length >= 2) {
      switch(parts[1]) {
        case 'install': {
          return await install(parts, state);
        }

        case 'list': {
          return await list(parts, state);
        }

        case 'remove': {
          return await remove(parts, state);
        }

        case 'update': {
          return await update(parts, state);
        }

        default: {
          return `command ${parts[1]} is not supported`;
        }
      }
    }
  }
}

async function install(parts, state) {
  // Let get the users home directory
  const _path = `${os.homedir()}/.mongo`;
  // Attempt to create the directory
  mkdirp.sync(_path);

  // Build the parts
  var options = {
      // your module name
      name: parts[2],
      // expected version [default: 'latest']
      version: parts[3] || 'latest',
      // installation path [default: '.']
      path: _path,
      // force install if set to true (even if already installed, it will do a reinstall) [default: false]
      forceInstall: true,
      // npm.load(options, callback): this is the "options" given to npm.load()
      npmLoad: {
        // [default: {loglevel: 'silent'}]
        loglevel: 'silent',
        progress: false,
        production:true,
        json: false,
      }
  };

  // Execute npm install
  const result = await executeNpmi(options);
  // Module install path
  const moduleInstallPath = result.pop()[1];
  // Let's read the package.json to establish if this is a supported plugin or not
  const packageJson = JSON.parse(fs.readFileSync(`${moduleInstallPath}/package.json`, 'utf8'));
  // Ensure this is an actual plugin
  if (packageJson.mongo && packageJson.mongo.plugin
    && packageJson.mongo.plugin.type == 'shell') {
      // Return the installed successfully
      return `plugin ${options.name}@${options.version} installed successfully in ${path.resolve(options.path)}`;
    }

  return `plugin ${options.name}@${options.version} is not a valid plugin`;
}

function executeNpmi(options) {
  return new Promise((resolve, reject) => {
    // console.dir(options)
    npmi(options, function (err, result) {
      if (err) {
        if (err.code === npmi.LOAD_ERR) {
          return reject('npm load error');
        } else if (err.code === npmi.INSTALL_ERR) {
          return reject('npm install error');
        }

        return reject(err.message);
      }

      resolve(result);
    });
  });
}

async function list(parts, state) {
}

async function remove(parts, state) {
}

async function update(parts, state) {
}

module.exports = Plugins;
