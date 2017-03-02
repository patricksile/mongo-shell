module.exports = {
  "tags": [
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
  "line": 469,
  "codeStart": 474,
  "code": "getCollection(name) {\n  // @TODO: needs to be properly implemented\n  return new CollectionProxy(this.state.client.db(this.name).collection(name), this);\n  // return new Collection(this._mongo, this, name, this.name + '.' + name);\n}",
  "ctx": {
    "type": "method",
    "name": "getCollection",
    "string": "getCollection()"
  }
}