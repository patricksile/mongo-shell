module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{int} level The log verbosity level.  .. include:: /includes/log-verbosity-levels.rst  To inherit the verbosity level of the component's parent, you can also specify ``-1``.",
      "name": "level",
      "description": "The log verbosity level. .. include:: /includes/log-verbosity-levels.rst To inherit the verbosity level of the component's parent, you can also specify ``-1``.",
      "types": [
        "int"
      ],
      "typesDescription": "<a href=\"int.html\">int</a>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{string} [component] The name of the component for which to specify the log verbosity level. The component name corresponds to the ``<name>`` from the corresponding ``systemLog.component.<name>.verbosity`` setting:  .. include:: /includes/list-log-component-setting-correspondence.rst  Omit to specify the default verbosity level for all components.",
      "name": "[component]",
      "description": "The name of the component for which to specify the log verbosity level. The component name corresponds to the ``<name>`` from the corresponding ``systemLog.component.<name>.verbosity`` setting: .. include:: /includes/list-log-component-setting-correspondence.rst Omit to specify the default verbosity level for all components.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    }
  ],
  "description": {
    "full": "Sets a single verbosity level for log messages </reference/log-messages> .",
    "summary": "Sets a single verbosity level for log messages </reference/log-messages> .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1412,
  "codeStart": 1418,
  "code": "setLogLevel(level, component) {\n}",
  "ctx": {
    "type": "method",
    "name": "setLogLevel",
    "string": "setLogLevel()"
  }
}