module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "name String the collection name",
      "name": "name",
      "description": "String the collection name",
      "types": [],
      "typesDescription": "",
      "variable": false,
      "nonNullable": false,
      "nullable": false,
      "optional": false
    },
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
  "line": 62,
  "codeStart": 68,
  "code": "collection(name) {\n  return new Collection(this.client, this.client.collection(name), this.generators, this.options);\n}",
  "ctx": {
    "type": "method",
    "name": "collection",
    "string": "collection()"
  }
}