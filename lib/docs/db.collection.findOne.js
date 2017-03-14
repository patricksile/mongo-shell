module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Find First Document in a Collection\ndb.bios.findOne()\n\n// Find First Document that Match Query Criteria\ndb.products.findOne( { qty: { $gt: 25 } } )\n\n// Query for Equality\ndb.bios.findOne( { _id: 5 } )\n\n// Query Using Operators\ndb.bios.findOne({\n  _id: { $in: [ 5,  ObjectId(\"507c35dd8fada716c89d0013\") ] }\n})\n\n// Query for Ranges\ndb.collection.findOne( { field: { $gt: value1, $lt: value2 } } );\n\n// Query a Field that Contains an Array\ndb.students.findOne( { score: { $gt: 0, $lt: 2 } } )\n\n// Query for an Array Element\ndb.bios.findOne( { contribs: \"UNIX\" } )\n\n// Query an Array of Documents\ndb.bios.findOne({\n  awards: {\n    $elemMatch: {\n      award: \"Turing Award\",\n      year: { $gt: 1980 }\n    }\n  }\n})\n\n// Query Exact Matches on Embedded Documents\ndb.bios.findOne({\n  name: {\n    first: \"Yukihiro\",\n    last: \"Matsumoto\"\n  }\n})\n\n// Specify the Fields to Return\ndb.products.findOne( { qty: { $gt: 25 } }, { item: 1, qty: 1 } )\n\n// Explicitly Excluded Fields\ndb.bios.findOne({ contribs: 'OOP' }, { 'name.first': 0, birth: 0 })"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"findOne\", \"value\": \"(query, projection) => {\", \"string\": \"findOne\"}"
    },
    {
      "type": "method",
      "string": "findOne"
    },
    {
      "type": "param",
      "string": "{object} [query] Specifies selection filter using query operators. To return all documents in a collection, omit this parameter or pass an empty document ({}).",
      "name": "[query]",
      "description": "Specifies selection filter using query operators. To return all documents in a collection, omit this parameter or pass an empty document ({}).",
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
      "string": "{object} [projection] Specifies the fields to return in the documents that match the query filter. To return all fields in the matching documents, omit this parameter. For details, see Projection.",
      "name": "[projection]",
      "description": "Specifies the fields to return in the documents that match the query filter. To return all fields in the matching documents, omit this parameter. For details, see Projection.",
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
    "full": "Returns one document that satisfies the specified query criteria. If multiple documents satisfy the query, this method returns the first document according to the natural order which reflects the order of documents on the disk. In capped collections, natural order is the same as insertion order. If no document satisfies the query, the method returns null.",
    "summary": "Returns one document that satisfies the specified query criteria. If multiple documents satisfy the query, this method returns the first document according to the natural order which reflects the order of documents on the disk. In capped collections, natural order is the same as insertion order. If no document satisfies the query, the method returns null.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 729,
  "codeStart": 784,
  "ctx": {
    "type": "property",
    "name": "findOne",
    "value": "(query, projection) => {",
    "string": "findOne"
  }
}