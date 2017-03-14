module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following operation drops the students collection in the current database.\ndb.students.drop()"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"drop\", \"value\": \"() => {\", \"string\": \"drop\"}"
    },
    {
      "type": "method",
      "string": "drop"
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
    "full": "Removes a collection or view from the database. The method also removes any indexes associated with the dropped collection. The method provides a wrapper around the drop command.",
    "summary": "Removes a collection or view from the database. The method also removes any indexes associated with the dropped collection. The method provides a wrapper around the drop command.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 539,
  "codeStart": 548,
  "ctx": {
    "type": "property",
    "name": "drop",
    "value": "() => {",
    "string": "drop"
  }
}