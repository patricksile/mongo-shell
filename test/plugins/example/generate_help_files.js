const dox = require('dox');
const fs = require('fs');
const mkdirp = require('mkdirp');

// Settings
const outputDir = `${__dirname}/docs`;

// name space configurations
const files = [
  `${__dirname}/index.js`,
];

// Create docs directory
mkdirp.sync(outputDir);

// List of final index file
const indexes = {};

// Iterate over all the namespaces and generate the files
for (let i = 0; i < files.length; i++) {
  const code = fs.readFileSync(files[i], 'utf8');
  const obj = dox.parseComments(code, {raw: true});

  // Iterate over all the object
  obj.forEach(element => {
    if (element.ctx.type === 'method') {
      fs.writeFileSync(
        `${outputDir}/${element.ctx.name}.js`,
        `module.exports = ${JSON.stringify(element, null, 2)}`,
        'utf8');

      // Add the file and method to the indexes
      indexes[`${element.ctx.name}`] = `./${element.ctx.name}`;
    }
  });
}

// Strings
const strings = [];

// create the index file string
for (let name in indexes) {
  strings.push(`  '${name}': require('${indexes[name]}')`);
}

const template = `
module.exports = {
${strings.join(',\n')}
}
`;

// Write the indexes file
fs.writeFileSync(`${outputDir}/index.js`, template, 'utf8');

console.dir(indexes);
