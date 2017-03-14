module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Return Distinct Values for a Field\ndb.inventory.distinct( \"dept\" )\n\n// Return Distinct Values for an Embedded Field\ndb.inventory.distinct( \"item.sku\" )\n\n// Return Distinct Values for an Array Field\ndb.inventory.distinct( \"sizes\" )\n\n// Specify Query with distinct\ndb.inventory.distinct( \"item.sku\", { dept: \"A\" } )\n\n// Specify a Collation\ndb.myColl.distinct( \"category\", {}, { collation: { locale: \"fr\", strength: 1 } } )"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"distinct\", \"value\": \"(field, query, options) => {\", \"string\": \"distinct\"}"
    },
    {
      "type": "method",
      "string": "distinct"
    },
    {
      "type": "param",
      "string": "{string} field The field for which to return distinct values.",
      "name": "field",
      "description": "The field for which to return distinct values.",
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
      "string": "{object} query A query that specifies the documents from which to retrieve the distinct values.",
      "name": "query",
      "description": "A query that specifies the documents from which to retrieve the distinct values.",
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
      "string": "{object} [options] Additional options to pad to the command executor.",
      "name": "[options]",
      "description": "Additional options to pad to the command executor.",
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
      "string": "{object} [options.collation] Specifies the collation to use for the operation.",
      "name": "[options.collation]",
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
    "full": "Finds the distinct values for a specified field across a single collection and returns the results in an array.",
    "summary": "Finds the distinct values for a specified field across a single collection and returns the results in an array.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 513,
  "codeStart": 538,
  "ctx": {
    "type": "property",
    "name": "distinct",
    "value": "(field, query, options) => {",
    "string": "distinct"
  }
}