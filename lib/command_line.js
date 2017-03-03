const packageJson = require('../package.json');
const authMechanisms = ['DEFAULT', 'SCRAM-SHA-1', 'MONGODB-X509', 'GSSAPI', 'MONGODB-CR'];
const {URL} = require('url');
const fs = require('fs');

const cmdLineOptions = [
  {
    name: 'help',
    description: 'Display this usage guide.',
    alias: 'h',
    type: Boolean
  },
  {
    name: 'shell',
    description: 'run the shell after executing files.',
    type: Boolean,
    defaultValue: false,
  },
  {
    name: 'nodb',
    description: `don't connect to mongod on startup - no 'db address' arg expected.`,
    type: Boolean,
    defaultValue: false,
  },
  {
    name: 'norc',
    description: `will not run the ".mongorc.js" file on start up.`,
    type: Boolean,
    defaultValue: false,
  },
  {
    name: 'quiet',
    description: `be less chatty.`,
    type: Boolean,
  },
  {
    name: 'port',
    description: `will not run the ".mongorc.js" file on start up.`,
    type: Number,
    typeLabel: '[arg]',
  },
  {
    name: 'host',
    description: `server to connect to.`,
    type: String,
    typeLabel: '[arg]',
  },
  {
    name: 'eval',
    description: `evaluate javascript.`,
    type: String,
    typeLabel: '[arg]',
  },
  {
    name: 'version',
    description: `show version information.`,
    type: Boolean,
  },
  {
    name: 'verbose',
    description: `increase verbosity.`,
    type: Boolean,
  },
  {
    name: 'username',
    alias: 'u',
    description: `username for authentication.`,
    type: String,
    typeLabel: '[arg]',
    group: "auth"
  },
  {
    name: 'password',
    alias: 'p',
    description: `password for authentication.`,
    type: String,
    typeLabel: '[arg]',
    group: "auth"
  },
  {
    name: 'authenticationDatabase',
    description: `user source (defaults to dbname).`,
    type: String,
    typeLabel: '[arg]',
    group: "auth"
  },
  {
    name: 'authenticationMechanism',
    description: `authentication mechanism one off [DEFAULT, SCRAM-SHA-1, MONGODB-X509, GSSAPI, MONGODB-CR]`,
    type: String,
    typeLabel: '[arg]',
    group: "auth"
  },
  {
    name: 'gssapiServiceName',
    description: `Service name to use when authenticating using GSSAPI/Kerberos.`,
    type: String,
    typeLabel: '[arg] (=mongodb)',
    group: "auth"
  },
  // {
  //   name: 'gssapiHostName',
  //   description: `Remote host name to use for purpose of GSSAPI/Kerberos authentication.`,
  //   type: String,
  //   typeLabel: '[arg]',
  //   group: "auth"
  // },
  {
    name: 'ssl',
    description: `use SSL for all connections.`,
    type: Boolean,
    group: "ssl"
  },{
    name: 'sslCAFile',
    description: `Certificate Authority file for SSL.`,
    type: String,
    typeLabel: '[arg]',
    group: "ssl"
  },{
    name: 'sslPEMKeyFile',
    description: `PEM certificate/key file for SSL.`,
    type: String,
    typeLabel: '[arg]',
    group: "ssl"
  },{
    name: 'sslPEMKeyPassword',
    description: `password for key in PEM file for SSL.`,
    type: String,
    typeLabel: '[arg]',
    group: "ssl"
  },{
    name: 'sslCRLFile',
    description: `Certificate Revocation List file for SSL.`,
    type: String,
    typeLabel: '[arg]',
    group: "ssl"
  },{
    name: 'sslAllowInvalidHostnames',
    description: `allow connections to servers with non-matching hostnames.`,
    type: Boolean,
    group: "ssl"
  },{
    name: 'sslAllowInvalidCertificates',
    description: `allow connections to servers with invalid certificates.`,
    type: Boolean,
    group: "ssl",
  // },{
  //   name: 'sslFIPSMode',
  //   description: `activate FIPS 140-2 mode at startup.`,
  //   type: Boolean,
  //   group: "ssl"
  },
]

const cmdLineSections = [
  {
    header: `MongoDB shell version ${packageJson.version}`,
    content: 'MongoDB shell commmand line help.'
  },
  {
    header: 'Usage',
    content: [
      `$ mongo [bold]{[options]} [db address] [file names (ending in .js)`,
      '$ mongo [bold]{--help}',
      '',
      '[bold]{db address can be:}',
      'foo                   foo database on local machine',
      '192.168.0.5/foo       foo database on 192.168.0.5 machine',
      '192.168.0.5:9999/foo  foo database on 192.168.0.5 machine on port 9999',
    ]
  },
  {
    header: 'Options',
    optionList: cmdLineOptions,
    group: ['_none'],
  },
  {
    header: 'Authentication Options',
    optionList: cmdLineOptions,
    group: ['auth'],
  },
  {
    header: 'SSL Options',
    optionList: cmdLineOptions,
    group: ['ssl'],
  },
  {
    content: 'MongoDB home: [underline]{https://mongodb.com}'
  }
]

function processor(uri, log, options = {}) {
  // Apply and transformations to the uri (hostname, port)
  // Parse the uri so we can modify it's representation
  const uriObject = new URL(uri);
  // Apply overriden fields
  if (options.port) {
    uriObject.host = `${uriObject.hostname}:${uriObject.port}`;
  }

  if (options.host) {
    uriObject.host = `${options.host}:${uriObject.port}`;
  }

  if (options.username) {
    uriObject.password = encodeURIComponent(options.password);
  }

  if (options.username) {
    uriObject.username = encodeURIComponent(options.username);
  }

  if (options.authenticationDatabase) {
    uriObject.searchParams.append('authSource', options.authenticationDatabase);
  }

  if (options.authenticationMechanism) {
    if (authMechanisms.indexOf(options.authenticationMechanism.toUpperCase()) == -1) {
      log(usage)
      process.exit(0);
    }

    // Add the parameter to the uri for the driver
    uriObject.searchParams.append('authMechanism', options.authenticationMechanism);
  }

  if (options.gssapiServiceName) {
    uriObject.searchParams.append('gssapiServiceName', options.gssapiServiceName);
  }

  if (options.ssl) {
    uriObject.searchParams.append('ssl', options.ssl);
  }

  // Options that go in the MongoClient connection options
  const connectionOptions = {}

  if (options.sslCAFile) {
    const buffer = fs.readFileSync(options.sslCAFile, 'binary');
    connectionOptions['sslCA'] = buffer;
  }

  if (options.sslPEMKeyFile) {
    const buffer = fs.readFileSync(options.sslCAFile, 'binary');
    connectionOptions['sslKey'] = buffer;
  }

  if (options.sslPEMKeyPassword) {
    connectionOptions['sslPass'] = options.sslPEMKeyPassword;
  }

  if (options.sslCRLFile) {
    const buffer = fs.readFileSync(options.sslCRLFile, 'binary');
    connectionOptions['sslCRL'] = buffer;
  }

  if (options.sslAllowInvalidCertificates) {
    connectionOptions['sslValidate'] = !options.sslAllowInvalidCertificates;
  } else {
    connectionOptions['sslValidate'] = true;
  }

  if (options.sslAllowInvalidHostnames) {
    connectionOptions['checkServerIdentity'] = !options.sslAllowInvalidHostnames;
  } else {
    connectionOptions['checkServerIdentity'] = true;
  }

  // if (options.sslFIPSMode) {
  //   connectionOptions['checkServerIdentity'] = options.sslFIPSMode;
  // }

  // Return results
  return { uriObject, connectionOptions };
}

module.exports = {
  cmdLineOptions, cmdLineSections, processor
}
