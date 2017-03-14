module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{object|string} command \"A :term:`database command`, specified either in :term:`document` form or as a string. If specified as a string, `db.runCommand()` transforms the string into a document.\"",
      "name": "command",
      "description": "\"A :term:`database command`, specified either in :term:`document` form or as a string. If specified as a string, `db.runCommand()` transforms the string into a document.\"",
      "types": [
        "object",
        "string"
      ],
      "typesDescription": "<code>object</code>|<code>string</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [extra]",
      "name": "[extra]",
      "description": "",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [queryOptions]",
      "name": "[queryOptions]",
      "description": "",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "return",
      "string": "{Promise}",
      "types": [
        "Promise"
      ],
      "typesDescription": "<a href=\"Promise.html\">Promise</a>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false,
      "description": ""
    }
  ],
  "description": {
    "full": "Provides a helper to run specified database commands </reference/command> . This is the preferred method to issue database commands, as it provides a consistent interface between the shell and drivers.",
    "summary": "Provides a helper to run specified database commands </reference/command> . This is the preferred method to issue database commands, as it provides a consistent interface between the shell and drivers.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1330,
  "codeStart": 1338,
  "code": "runCommand(command, extra, queryOptions) {\n  let mergedObj = (typeof(command) === 'string') ? mergeCommandOptions(command, extra) : command;\n\n  // if options were passed (i.e. because they were overridden on a collection), use them.\n  // Otherwise use getQueryOptions.\n  let options = (typeof(queryOptions) !== 'undefined') ? queryOptions : getQueryOptions(this);\n\n  return this.state.client.db(this.name).command(mergedObj, options)\n    .catch(res => {\n      // When runCommand flowed through query, a connection error resulted in the message\n      // \"error doing query: failed\". Even though this message is arguably incorrect\n      // for a command failing due to a connection failure, we preserve it for backwards\n      // compatibility. See SERVER-18334 for details.\n      if (res.message.match(/network error/)) {\n        throw new Error(`error doing query: failed: ${res.message}`);\n      }\n\n      throw res;\n    });\n}",
  "ctx": {
    "type": "method",
    "name": "runCommand",
    "string": "runCommand()"
  }
}