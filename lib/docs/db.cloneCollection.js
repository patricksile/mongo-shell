module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// This operation copies the profiles collection from the users database on the server at mongodb.example.net. The operation only copies \n// documents that satisfy the query { 'active' : true }\ndb.cloneCollection('mongodb.example.net:27017', 'users.profile', { 'active' : true } )"
    },
    {
      "type": "param",
      "string": "{string} from The address of the server to clone from.",
      "name": "from",
      "description": "The address of the server to clone from.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{string} collection The collection in the MongoDB instance that you want to copy. `db.cloneCollection()` will only copy the collection with this name from *database* of the same name as the current database the remote MongoDB instance.  If you want to copy a collection from a different database name you must use the `cloneCollection` directly.",
      "name": "collection",
      "description": "The collection in the MongoDB instance that you want to copy. `db.cloneCollection()` will only copy the collection with this name from *database* of the same name as the current database the remote MongoDB instance. If you want to copy a collection from a different database name you must use the `cloneCollection` directly.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [query] A standard query document that limits the documents copied as part of the `db.cloneCollection()` operation.  All :ref:`query selectors <query-selectors>` available to the `find() <db.collection.find()>` are available here.",
      "name": "[query]",
      "description": "A standard query document that limits the documents copied as part of the `db.cloneCollection()` operation. All :ref:`query selectors <query-selectors>` available to the `find() <db.collection.find()>` are available here.",
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
    "full": "Copies data directly between MongoDB instances. The db.cloneCollection() method wraps the cloneCollection database command and accepts the following arguments:",
    "summary": "Copies data directly between MongoDB instances. The db.cloneCollection() method wraps the cloneCollection database command and accepts the following arguments:",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 133,
  "codeStart": 144,
  "code": "cloneCollection(from, collection, query) {\n  assert(isString(from) && from.length);\n  assert(isString(collection) && collection.length);\n  collection = `${this.name}.${collection}`;\n  query = query || {};\n  return this.runCommand({ cloneCollection: collection, from: from, query: query });\n}",
  "ctx": {
    "type": "method",
    "name": "cloneCollection",
    "string": "cloneCollection()"
  }
}