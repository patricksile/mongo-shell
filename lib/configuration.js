const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

class Configuration {
  constructor(path) {
    this.path = path;
  }

  read() {
    const self = this;

    return new Promise((resolve, reject) => {
      fs.readFile(`${this.path}`, 'utf8', function(err, data) {
        if(err) return reject(err);

        try {
          resolve(JSON.parse(data));
        } catch(err) {
          reject(err);
        }
      });
    });
  }

  write(configuration) {
    const self = this;

    return new Promise((resolve, reject) => {
      // Attempt to create the directory
      mkdirp.sync(path.dirname(self.path));
      // Write the file
      fs.writeFile(`${self.path}`, JSON.stringify(configuration, null, 2), 'utf8', function(err) {
        if(err) return reject(err);

        try {
          resolve();
        } catch(err) {
          reject(err);
        }
      });
    });
  }
}

module.exports = Configuration;
