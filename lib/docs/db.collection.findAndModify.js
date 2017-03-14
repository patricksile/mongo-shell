module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Update and Return\ndb.people.findAndModify({\n  query: { name: \"Tom\", state: \"active\", rating: { $gt: 10 } },\n  sort: { rating: 1 },\n  update: { $inc: { score: 1 } }\n})\n\n// Upsert\ndb.people.findAndModify({\n  query: { name: \"Gus\", state: \"active\", rating: 100 },\n  sort: { rating: 1 },\n   update: { $inc: { score: 1 } },\n   upsert: true\n})\n\n// Return New Document\ndb.people.findAndModify({\n  query: { name: \"Pascal\", state: \"active\", rating: 25 },\n  sort: { rating: 1 },\n  update: { $inc: { score: 1 } },\n  upsert: true,\n  new: true\n})\n\n// Sort and Remove\ndb.people.findAndModify({\n  query: { state: \"active\" },\n  sort: { rating: 1 },\n  remove: true\n})\n\n// Specify Collation\ndb.myColl.findAndModify({\n  query: { category: \"cafe\", status: \"a\" },\n  sort: { category: 1 },\n  update: { $set: { status: \"Updated\" } },\n  collation: { locale: \"fr\", strength: 1 }\n});"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"findAndModify\", \"value\": \"(object) => {\", \"string\": \"findAndModify\"}"
    },
    {
      "type": "method",
      "string": "findAndModify"
    },
    {
      "type": "param",
      "string": "{object} object The findAndModify operation object.",
      "name": "object",
      "description": "The findAndModify operation object.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [object.query] The selection criteria for the modification. The query field employs the same query selectors as used in the db.collection.find() method. Although the query may match multiple documents, findAndModify() will only select one document to modify.",
      "name": "[object.query]",
      "description": "The selection criteria for the modification. The query field employs the same query selectors as used in the db.collection.find() method. Although the query may match multiple documents, findAndModify() will only select one document to modify.",
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
      "string": "{object} [object.sort]  Determines which document the operation modifies if the query selects multiple documents. findAndModify() modifies the first document in the sort order specified by this argument.",
      "name": "[object.sort]",
      "description": "Determines which document the operation modifies if the query selects multiple documents. findAndModify() modifies the first document in the sort order specified by this argument.",
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
      "string": "{boolean} object.remove=false Must specify either the remove or the update field. Removes the document specified in the query field. Set this to true to remove the selected document . The default is false.",
      "name": "object.remove=false",
      "description": "Must specify either the remove or the update field. Removes the document specified in the query field. Set this to true to remove the selected document . The default is false.",
      "types": [
        "boolean"
      ],
      "typesDescription": "<code>boolean</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} object.update Must specify either the remove or the update field. Performs an update of the selected document. The update field employs the same update operators or field: value specifications to modify the selected document.",
      "name": "object.update",
      "description": "Must specify either the remove or the update field. Performs an update of the selected document. The update field employs the same update operators or field: value specifications to modify the selected document.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{boolean} object.new=false When true, returns the modified document rather than the original. The findAndModify() method ignores the new option for remove operations. The default is false.",
      "name": "object.new=false",
      "description": "When true, returns the modified document rather than the original. The findAndModify() method ignores the new option for remove operations. The default is false.",
      "types": [
        "boolean"
      ],
      "typesDescription": "<code>boolean</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [object.fields] A subset of fields to return. The fields document specifies an inclusion of a field with 1, as in: fields: { <field1>: 1, <field2>: 1, ... }",
      "name": "[object.fields]",
      "description": "A subset of fields to return. The fields document specifies an inclusion of a field with 1, as in: fields: { <field1>: 1, <field2>: 1, ... }",
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
      "string": "{boolean} [object.upsert=false] Used in conjuction with the update field.",
      "name": "[object.upsert=false]",
      "description": "Used in conjuction with the update field.",
      "types": [
        "boolean"
      ],
      "typesDescription": "<code>boolean</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{boolean} [object.bypassDocumentValidation] Enables db.collection.findAndModify to bypass document validation during the operation. This lets you update documents that do not meet the validation requirements.",
      "name": "[object.bypassDocumentValidation]",
      "description": "Enables db.collection.findAndModify to bypass document validation during the operation. This lets you update documents that do not meet the validation requirements.",
      "types": [
        "boolean"
      ],
      "typesDescription": "<code>boolean</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [object.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
      "name": "[object.writeConcern]",
      "description": "The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
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
      "string": "{number} [object.maxTimeMS] The maximum amount of time to allow the query to run.",
      "name": "[object.maxTimeMS]",
      "description": "The maximum amount of time to allow the query to run.",
      "types": [
        "number"
      ],
      "typesDescription": "<code>number</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [object.collation] Specifies the collation to use for the operation.",
      "name": "[object.collation]",
      "description": "Specifies the collation to use for the operation.",
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
    "full": "Modifies and returns a single document. By default, the returned document does not include the modifications made on the update. To return the document with the modifications made on the update, use the new option. The findAndModify() method is a shell helper around the findAndModify command.",
    "summary": "Modifies and returns a single document. By default, the returned document does not include the modifications made on the update. To return the document with the modifications made on the update, use the new option. The findAndModify() method is a shell helper around the findAndModify command.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 670,
  "codeStart": 728,
  "ctx": {
    "type": "property",
    "name": "findAndModify",
    "value": "(object) => {",
    "string": "findAndModify"
  }
}