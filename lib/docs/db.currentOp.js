module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// Write Operations Waiting for a Lock\ndb.currentOp({\n \"waitingForLock\" : true,\n $or: [\n    { \"op\" : { \"$in\" : [ \"insert\", \"update\", \"remove\" ] } },\n    { \"query.findandmodify\": { $exists: true } }\n ]\n})\n\n// Active Operations with no Yields\ndb.currentOp({\n  \"active\" : true,\n  \"numYields\" : 0,\n  \"waitingForLock\" : false\n})\n\n// Active Operations on a Specific Database\ndb.currentOp({\n  \"active\" : true,\n  \"secs_running\" : { \"$gt\" : 3 },\n  \"ns\" : /^db1\\./\n})\n\n// Active Indexing Operations\ndb.currentOp({\n  $or: [\n    { op: \"query\", \"query.createIndexes\": { $exists: true } },\n    { op: \"insert\", ns: /\\.system\\.indexes\\b/ }\n  ]\n})"
    },
    {
      "type": "param",
      "string": "{boolean|document} [operations] Specifies the operations to report on. Can pass either a boolean or a document.  Specify ``true`` to include operations on idle connections and system operations. Specify a document with query conditions to report only on operations that match the conditions. See :ref:`currentOp-behavior` for details.",
      "name": "[operations]",
      "description": "Specifies the operations to report on. Can pass either a boolean or a document. Specify ``true`` to include operations on idle connections and system operations. Specify a document with query conditions to report only on operations that match the conditions. See :ref:`currentOp-behavior` for details.",
      "types": [
        "boolean",
        "document"
      ],
      "typesDescription": "<code>boolean</code>|<code>document</code>",
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
    "full": "Returns a document that contains information on in-progress operations for the database instance.",
    "summary": "Returns a document that contains information on in-progress operations for the database instance.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 430,
  "codeStart": 466,
  "code": "currentOp(operations) {\n  let q = {};\n  if (operations) {\n    if (typeof(arg) === 'object') {\n      q = Object.assign(q, operations);\n    } else if (operations) {\n      q.$all = true;\n    }\n  }\n\n  let cmd = Object.assign({ currentOp: 1 }, q);\n  return this.adminCommand(cmd)\n    .catch(res => {\n      // @TODO: implement me",
  "ctx": {
    "type": "method",
    "name": "currentOp",
    "string": "currentOp()"
  }
}