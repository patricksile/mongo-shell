module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{number} scale",
      "name": "scale",
      "description": "",
      "types": [
        "number"
      ],
      "typesDescription": "<code>number</code>",
      "optional": false,
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
    "full": "Provides a wrapper around the db.collection.stats()  method. Returns statistics from every collection separated by three hyphen characters.",
    "summary": "Provides a wrapper around the db.collection.stats()  method. Returns statistics from every collection separated by three hyphen characters.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 868,
  "codeStart": 874,
  "code": "printCollectionStats(scale) {\n  if (arguments.length > 1) {\n    throw new Error('printCollectionStats() has a single optional argument (scale)');\n  }\n\n  if (typeof scale !== 'undefined') {\n    if (typeof scale !== 'number') {\n      throw new Error('scale has to be a number >= 1');\n    }\n\n    if (scale < 1) {\n      throw new Error('scale has to be >= 1');\n    }\n  }\n\n  let mydb = this;\n  return this.getCollectionNames()\n    .then(names => names.forEach(z => {\n      console.log(z);\n      console.log(mydb.getCollection(z).stats(scale));\n      console.log('---');\n    }));\n}",
  "ctx": {
    "type": "method",
    "name": "printCollectionStats",
    "string": "printCollectionStats()"
  }
}