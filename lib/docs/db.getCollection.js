module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following example uses db.getCollection() to access the auth collection\nvar authColl = db.getCollection(\"auth\");"
    },
    {
      "type": "param",
      "string": "{string} name The name of the collection.",
      "name": "name",
      "description": "The name of the collection.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    }
  ],
  "description": {
    "full": "Returns a collection object that is functionally equivalent to using the syntax. The method is useful for a collection whose name might interact with the shell itself, such as names that begin with  or that match a database shell method </reference/method/js-database> .",
    "summary": "Returns a collection object that is functionally equivalent to using the syntax. The method is useful for a collection whose name might interact with the shell itself, such as names that begin with  or that match a database shell method </reference/method/js-database> .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 665,
  "codeStart": 672,
  "code": "getCollection(name) {\n  return new CollectionProxy(this.state.client.db(this.name).collection(name), this, { log: this.log });\n}",
  "ctx": {
    "type": "method",
    "name": "getCollection",
    "string": "getCollection()"
  }
}