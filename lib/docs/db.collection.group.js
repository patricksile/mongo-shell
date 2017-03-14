module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Group by Two Fields\ndb.orders.group({\n key: { ord_dt: 1, 'item.sku': 1 },\n cond: { ord_dt: { $gt: new Date( '01/01/2012' ) } },\n reduce: function ( curr, result ) { },\n initial: { }\n})\n\n// Calculate the Sum\ndb.orders.group({\n  key: { ord_dt: 1, 'item.sku': 1 },\n  cond: { ord_dt: { $gt: new Date( '01/01/2012' ) } },\n  reduce: function( curr, result ) {\n    result.total += curr.item.qty;\n  },\n  initial: { total : 0 }\n})\n\n// Calculate Sum, Count, and Average\ndb.orders.group({\n  keyf: function(doc) {\n    return { day_of_week: doc.ord_dt.getDay() };\n  },\n  cond: { ord_dt: { $gt: new Date( '01/01/2012' ) } },\n  reduce: function( curr, result ) {\n    result.total += curr.item.qty;\n    result.count++;\n  },\n  initial: { total : 0, count: 0 },\n  finalize: function(result) {\n    var weekdays = [\"Sunday\", \"Monday\", \"Tuesday\",\n                    \"Wednesday\", \"Thursday\",\n                    \"Friday\", \"Saturday\"];\n    result.day_of_week = weekdays[result.day_of_week];\n    result.avg = Math.round(result.total / result.count);\n  }\n})"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"group\", \"value\": \"(key, reduce, initial[, keyf] [, cond] [, finializer]) => {\", \"string\": \"group\"}"
    },
    {
      "type": "method",
      "string": "group"
    },
    {
      "type": "deprecated",
      "string": ""
    },
    {
      "type": "param",
      "string": "{object} key The field or fields to group. Returns a “key object” for use as the grouping key.",
      "name": "key",
      "description": "The field or fields to group. Returns a “key object” for use as the grouping key.",
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
      "string": "{function} reduce An aggregation function that operates on the documents during the grouping operation. These functions may return a sum or a count. The function takes two arguments: the current document and an aggregation result document for that group.",
      "name": "reduce",
      "description": "An aggregation function that operates on the documents during the grouping operation. These functions may return a sum or a count. The function takes two arguments: the current document and an aggregation result document for that group.",
      "types": [
        "function"
      ],
      "typesDescription": "<code>function</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} initial Initializes the aggregation result document.",
      "name": "initial",
      "description": "Initializes the aggregation result document.",
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
      "string": "{function} [keyf] Alternative to the key field. Specifies a function that creates a “key object” for use as the grouping key. Use keyf instead of key to group by calculated fields rather than existing document fields. ",
      "name": "[keyf]",
      "description": "Alternative to the key field. Specifies a function that creates a “key object” for use as the grouping key. Use keyf instead of key to group by calculated fields rather than existing document fields.",
      "types": [
        "function"
      ],
      "typesDescription": "<code>function</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} cond The selection criteria to determine which documents in the collection to process. If you omit the cond field, db.collection.group() processes all the documents in the collection for the group operation.",
      "name": "cond",
      "description": "The selection criteria to determine which documents in the collection to process. If you omit the cond field, db.collection.group() processes all the documents in the collection for the group operation.",
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
      "string": "{function} [finalize] A function that runs each item in the result set before db.collection.group() returns the final value. This function can either modify the result document or replace the result document as a whole.",
      "name": "[finalize]",
      "description": "A function that runs each item in the result set before db.collection.group() returns the final value. This function can either modify the result document or replace the result document as a whole.",
      "types": [
        "function"
      ],
      "typesDescription": "<code>function</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [collation] Specifies the collation to use for the operation. ",
      "name": "[collation]",
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
    "full": "Groups documents in a collection by the specified keys and performs simple aggregation functions such as computing counts and sums. The method is analogous to a SELECT <...> GROUP BY statement in SQL. The group() method returns an array.",
    "summary": "Groups documents in a collection by the specified keys and performs simple aggregation functions such as computing counts and sums. The method is analogous to a SELECT <...> GROUP BY statement in SQL. The group() method returns an array.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 943,
  "codeStart": 996,
  "ctx": {
    "type": "property",
    "name": "group",
    "value": "(key, reduce, initial[, keyf] [, cond] [, finializer]) => {",
    "string": "group"
  }
}