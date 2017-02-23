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
  const _module = result.pop();
  const moduleInstallPath = _module[1];
  // Let's read the package.json to establish if this is a supported plugin or not
  const packageJson = JSON.parse(fs.readFileSync(`${moduleInstallPath}/package.json`, 'utf8'));
  // Ensure this is an actual plugin
  if (packageJson.mongo && packageJson.mongo.plugin
    && packageJson.mongo.plugin.type == 'shell') {
      try {
      // Attemp to write the plugin
      await updatePluginLists(_path, _module);
    } catch(err) {
      console.log(err)
    }
      // Return the installed successfully
      return `plugin ${options.name}@${options.version} installed successfully in ${path.resolve(options.path)}`;
    }

  return `plugin ${options.name}@${options.version} is not a valid plugin`;
}

async function updatePluginLists(path, _module) {
  let configuration = null;

  try {
    configuration = JSON.parse(fs.readFileSync(`${path}/plugins.json`, 'utf8'));
  } catch (err) {
    configuration = {
      plugins: []
    };
  }

  // Ensure we don't have multiple entries
  const plugins = [];

  // Ensure we don't have duplicate records
  for (let m of configuration.plugins) {
    console.log("------------ 0")
    console.dir(m[0].split('@')[0])
    console.dir(_module[0].split('@')[0])

    if (m[0].split('@')[0] !== _module[0].split('@')[0]) {
      plugins.push(m);
    }
  }

  // Push the module we added
  plugins.push(_module);
  // Set the plugin
  configuration.plugins = plugins;
  // Write to disk
  fs.writeFileSync(`${path}/plugins.json`, JSON.stringify(configuration, null, 2), 'utf8');
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
