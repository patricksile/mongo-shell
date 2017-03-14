module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Find All Documents in a Collection\ndb.bios.find()\n\n// Find Documents that Match Query Criteria\ndb.products.find( { qty: { $gt: 25 } } )\n\n// Query for Equality\ndb.bios.find( { _id: 5 } )\n\n// Query Using Operators\ndb.bios.find({\n  _id: { $in: [ 5,  ObjectId(\"507c35dd8fada716c89d0013\") ] }\n})\n\n// Query for Ranges\ndb.collection.find( { field: { $gt: value1, $lt: value2 } } );\n\n// Query a Field that Contains an Array\ndb.students.find( { score: { $gt: 0, $lt: 2 } } )\n\n// Query for an Array Element\ndb.bios.find( { contribs: \"UNIX\" } )\n\n// Query an Array of Documents\ndb.bios.find({\n  awards: {\n    $elemMatch: {\n      award: \"Turing Award\",\n      year: { $gt: 1980 }\n    }\n  }\n})\n\n// Query Exact Matches on Embedded Documents\ndb.bios.find({\n  name: {\n    first: \"Yukihiro\",\n    last: \"Matsumoto\"\n  }\n})\n\n// Specify the Fields to Return\ndb.products.find( { qty: { $gt: 25 } }, { item: 1, qty: 1 } )\n\n// Explicitly Excluded Fields\ndb.bios.find({ contribs: 'OOP' }, { 'name.first': 0, birth: 0 })"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"find\", \"value\": \"(query, projection) => {\", \"string\": \"find\"}"
    },
    {
      "type": "method",
      "string": "find"
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
    "full": "Selects documents in a collection and returns a cursor to the selected documents.",
    "summary": "Selects documents in a collection and returns a cursor to the selected documents.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 614,
  "codeStart": 669,
  "ctx": {
    "type": "property",
    "name": "find",
    "value": "(query, projection) => {",
    "string": "find"
  }
}