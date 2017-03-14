module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// queryPlanner Mode\ndb.products.explain().count( { quantity: { $gt: 50 } } )\n\n// executionStats Mode\ndb.products.explain(\"executionStats\").find(\n  { quantity: { $gt: 50 }, category: \"apparel\" }\n)\n\n// allPlansExecution Mode\ndb.products.explain(\"allPlansExecution\").update(\n  { quantity: { $lt: 1000}, category: \"apparel\" },\n  { $set: { reorder: true } }\n)\n\n// Explain find() with Modifiers\ndb.products.explain(\"executionStats\").find(\n  { quantity: { $gt: 50 }, category: \"apparel\" }\n).sort( { quantity: -1 } ).hint( { category: 1, quantity: -1 } )\n\n// Iterate the explain().find() Return Cursor\nvar explainResult = db.products.explain().find( { category: \"apparel\" } ).next();"
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"name\": \"explain\", \"value\": \"(verbosity) => {\", \"string\": \"explain\"}"
    },
    {
      "type": "method",
      "string": "explain"
    },
    {
      "type": "param",
      "string": "{string} verbosity Specifies the verbosity mode for the explain output. The mode affects the behavior of explain() and determines the amount of information to return. The possible modes are: \"queryPlanner\", \"executionStats\", and \"allPlansExecution\".",
      "name": "verbosity",
      "description": "Specifies the verbosity mode for the explain output. The mode affects the behavior of explain() and determines the amount of information to return. The possible modes are: \"queryPlanner\", \"executionStats\", and \"allPlansExecution\".",
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
    "full": "Returns information on the query plan for the following operations: aggregate(); count(); distinct(); find(); group(); remove(); and update() methods.",
    "summary": "Returns information on the query plan for the following operations: aggregate(); count(); distinct(); find(); group(); remove(); and update() methods.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 573,
  "codeStart": 602,
  "ctx": {
    "type": "property",
    "name": "explain",
    "value": "(verbosity) => {",
    "string": "explain"
  }
}