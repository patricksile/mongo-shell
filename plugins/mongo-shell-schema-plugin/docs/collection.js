module.exports = {
  "tags": [
    {
      "type": "return",
      "string": "{String}",
      "types": [
        "String"
      ],
      "typesDescription": "<code>String</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false,
      "description": ""
    }
  ],
  "description": {
    "full": "Returns a collection schema model",
    "summary": "Returns a collection schema model",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 46,
  "codeStart": 51,
  "code": "collection(name) {\n  return new Collection(this.client, this.client.collection(name));\n}",
  "ctx": {
    "type": "method",
    "name": "collection",
    "string": "collection()"
  }
}