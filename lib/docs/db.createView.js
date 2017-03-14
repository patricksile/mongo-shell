module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Create a View from a Single Collection\ndb.createView(\n \"managementFeedback\",\n \"survey\",\n [ { $project: { \"management\": \"$feedback.management\", department: 1 } } ]\n)\n\n// Query a View\ndb.managementFeedback.find()\n\n// Perform Aggregation Pipeline on a View\ndb.managementFeedback.aggregate([ { $sortByCount: \"$department\" } ] )\n\n// Create a View from Multiple Collections\ndb.createView(\n  \"orderDetails\",\n  \"orders\",\n  [\n    { $lookup: { from: \"inventory\", localField: \"item\", foreignField: \"sku\", as: \"inventory_docs\" } },\n    { $project: { \"inventory_docs._id\": 0, \"inventory_docs.sku\": 0 } }\n  ]\n)\n\n// Perform Aggregation Pipeline on a View\ndb.orderDetails.aggregate( [ { $sortByCount: \"$item\" } ] )\n\n// Create a View with Default Collation\ndb.createView(\n \"placesView\",\n \"places\",\n [ { $project: { category: 1 } } ],\n { collation: { locale: \"fr\", strength: 1 } }\n)"
    },
    {
      "type": "param",
      "string": "{string} view The name of the view to create.",
      "name": "view",
      "description": "The name of the view to create.",
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
      "string": "{string} source The name of the source collection or view from which to create the view. The name is not the full namespace of the collection or view; i.e. does not include the database name and implies the same database as the view to create.",
      "name": "source",
      "description": "The name of the source collection or view from which to create the view. The name is not the full namespace of the collection or view; i.e. does not include the database name and implies the same database as the view to create.",
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
      "string": "{array} pipeline An array that consists of the :ref:`aggregation pipeline stage <aggregation-pipeline>`.  {{op}} creates the view by applying the specified ``pipeline`` to the {{source}}.  .. include:: /includes/extracts/views-public-definition.rst",
      "name": "pipeline",
      "description": "An array that consists of the :ref:`aggregation pipeline stage <aggregation-pipeline>`. {{op}} creates the view by applying the specified ``pipeline`` to the {{source}}. .. include:: /includes/extracts/views-public-definition.rst",
      "types": [
        "array"
      ],
      "typesDescription": "<code>array</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [options] Additional options for the method.",
      "name": "[options]",
      "description": "Additional options for the method.",
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
    "full": "Creates a view </core/views> as the result of the applying the specified aggregation pipeline <aggregation-pipeline> to the source collection or view. Views act as read-only collections, and are computed on demand during read operations. MongoDB executes read operations on views as part of the underlying aggregation pipeline.",
    "summary": "Creates a view </core/views> as the result of the applying the specified aggregation pipeline <aggregation-pipeline> to the source collection or view. Views act as read-only collections, and are computed on demand during read operations. MongoDB executes read operations on views as part of the underlying aggregation pipeline.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 366,
  "codeStart": 408,
  "code": "createView(view, source, pipeline, options) {\n  if (source === undefined || source === null) {\n    throw Error('Must specify a backing view or collection');\n  }\n\n  options = options || {};\n  options.viewOn = source;\n\n  // Since we allow a single stage pipeline to be specified as an object\n  // in aggregation, we need to account for that here for consistency.\n  if (pipeline) {\n    if (!Array.isArray(pipeline)) pipeline = [ pipeline ];\n  }\n  options.pipeline = pipeline;\n\n  let cmd = Object.assign({ create: view }, options);\n  return this.runCommand(cmd);\n}",
  "ctx": {
    "type": "method",
    "name": "createView",
    "string": "createView()"
  }
}