const packageJson = require('../package.json');

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
    type: Number,
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
    description: `authentication mechanism.`,
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
  {
    name: 'gssapiHostName',
    description: `Remote host name to use for purpose of GSSAPI/Kerberos authentication.`,
    type: String,
    typeLabel: '[arg]',
    group: "auth"
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
    content: 'MongoDB home: [underline]{https://mongodb.com}'
  }
]

module.exports = {
  cmdLineOptions, cmdLineSections
}
