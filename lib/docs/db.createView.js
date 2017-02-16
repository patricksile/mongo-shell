module.exports = {
  "tags": [
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
  "line": 266,
  "codeStart": 274,
  "code": "createView(view, source, pipeline, options) {\n  if (source === undefined || source === null) {\n    throw Error('Must specify a backing view or collection');\n  }\n\n  options = options || {};\n  options.viewOn = source;\n\n  // Since we allow a single stage pipeline to be specified as an object\n  // in aggregation, we need to account for that here for consistency.\n  if (pipeline) {\n    if (!Array.isArray(pipeline)) pipeline = [ pipeline ];\n  }\n  options.pipeline = pipeline;\n\n  let cmd = Object.assign({ create: view }, options);\n  return this.runCommand(cmd);\n}",
  "ctx": {
    "type": "method",
    "name": "createView",
    "string": "createView()"
  }
}