module.exports = {
  "tags": [
    {
      "type": "example",
      "string": ""
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
      "string": "{number} [options.maxTimeMS] The maximum amount of time to allow the query to run.",
      "name": "[options.maxTimeMS]",
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
    "full": "Modifies and returns a single document. By default, the returned document does not include the modifications made on the update. To return the document with the modifications made on the update, use the new option. The findAndModify() method is a shell helper around the findAndModify command.",
    "summary": "Modifies and returns a single document. By default, the returned document does not include the modifications made on the update. To return the document with the modifications made on the update, use the new option. The findAndModify() method is a shell helper around the findAndModify command.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 659,
  "codeStart": 679,
  "code": "};\n\nfunction isAcknowledged(wc) { return (wc && wc.w === 0) ? false : true; }\nfunction renderResponse(method, target, args, response) {\n  if (!renderMapping.hasOwnProperty(method)) {\n    return response;\n  }\n\n  let wc = createWriteConcern(target, args.slice(-1)[0]);\n  let result = { acknowledged: isAcknowledged(wc) };\n  if (!result.acknowledged) return result;\n\n  let rendered =  Object.assign(result, renderMapping[method](target, args, response));\n  if (response.result) {\n    Object.defineProperty(rendered, 'result', {\n      enumerable: false,\n      get: function() { return response.result; }\n    });\n  }\n\n  return rendered;\n}\n\nconst RENDER_METHODS = [\n  'bulkWrite', 'insertOne', 'insertMany', 'deleteOne', 'deleteMany', 'replaceOne',\n  'updateOne', 'updateMany', 'ensureIndex', 'createIndex'\n];\n\nlet methodHandler = function(db) {\n  return {\n    get(target, key, receiver) {\n      // special cases\n      if (key === 'getDB') return function() { return db; };\n\n      // all the rest\n      if (typeof key !== 'string') return target[key];\n      if (typeof key === 'string') {\n        if (typeof target[key] === 'undefined') {\n          const collectionName = `${target.collectionName}.${key}`;\n          return new CollectionProxy(target.s.db.collection(collectionName), db);\n        }\n\n        // return the existing property if its not a function\n        if (typeof target[key] !== 'function') {\n          return target[key];\n        }\n      }\n\n      if (RENDER_METHODS.indexOf(key) === -1) {\n        return target[key];\n      }\n\n      // otherwise trap function call\n      const $method = target[key];\n      return function(...args) {\n        let response = $method.apply(this, args);\n        if (response instanceof Promise) {\n          return response.then(r => renderResponse(key, target, args, r));\n        }\n\n        return renderResponse(key, target, args, response);\n      };\n    }\n  };\n};\n\nfunction CollectionProxy(collection, db, options) {\n  // Add our options to the collection instance\n  collection.__options = options || { log: console.log };\n  // Create a collection proxy\n  return new Proxy(collection, methodHandler(db));\n}\n\nmodule.exports = CollectionProxy;",
  "ctx": {
    "type": "property",
    "name": "findAndModify",
    "value": "(object) => {",
    "string": "findAndModify"
  }
}