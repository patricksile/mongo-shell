module.exports = {
  "tags": [
    {
      "type": "example",
      "string": ""
    },
    {
      "type": "ctx",
      "string": "{ \"type\": \"property\", \"validate\": \"stats\", \"value\": \"(full) => {\", \"string\": \"validate\"}"
    },
    {
      "type": "method",
      "string": "validate"
    },
    {
      "type": "param",
      "string": "{boolean} [full] Specify true to enable a full validation and to return full statistics. MongoDB disables full validation by default because it is a potentially resource-intensive operation.",
      "name": "[full]",
      "description": "Specify true to enable a full validation and to return full statistics. MongoDB disables full validation by default because it is a potentially resource-intensive operation.",
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
    "full": "Validates a collection. The method scans a collection’s data structures for correctness and returns a single document that describes the relationship between the logical collection and the physical representation of the data.",
    "summary": "Validates a collection. The method scans a collection’s data structures for correctness and returns a single document that describes the relationship between the logical collection and the physical representation of the data.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1231,
  "codeStart": 1241,
  "code": "};\n\nfunction isAcknowledged(wc) { return (wc && wc.w === 0) ? false : true; }\nfunction renderResponse(method, target, args, response) {\n  if (!renderMapping.hasOwnProperty(method)) {\n    return response;\n  }\n\n  let wc = createWriteConcern(target, args.slice(-1)[0]);\n  let result = { acknowledged: isAcknowledged(wc) };\n  if (!result.acknowledged) return result;\n\n  let rendered =  Object.assign(result, renderMapping[method](target, args, response));\n  if (response.result) {\n    Object.defineProperty(rendered, 'result', {\n      enumerable: false,\n      get: function() { return response.result; }\n    });\n  }\n\n  return rendered;\n}\n\nconst RENDER_METHODS = [\n  'bulkWrite', 'insertOne', 'insertMany', 'deleteOne', 'deleteMany', 'replaceOne',\n  'updateOne', 'updateMany', 'ensureIndex', 'createIndex'\n];\n\nlet methodHandler = function(db) {\n  return {\n    get(target, key, receiver) {\n      // special cases\n      if (key === 'getDB') return function() { return db; };\n\n      // all the rest\n      if (typeof key !== 'string') return target[key];\n      if (typeof key === 'string') {\n        if (typeof target[key] === 'undefined') {\n          const collectionName = `${target.collectionName}.${key}`;\n          return new CollectionProxy(target.s.db.collection(collectionName), db);\n        }\n\n        // return the existing property if its not a function\n        if (typeof target[key] !== 'function') {\n          return target[key];\n        }\n      }\n\n      if (RENDER_METHODS.indexOf(key) === -1) {\n        return target[key];\n      }\n\n      // otherwise trap function call\n      const $method = target[key];\n      return function(...args) {\n        let response = $method.apply(this, args);\n        if (response instanceof Promise) {\n          return response.then(r => renderResponse(key, target, args, r));\n        }\n\n        return renderResponse(key, target, args, response);\n      };\n    }\n  };\n};\n\nfunction CollectionProxy(collection, db, options) {\n  // Add our options to the collection instance\n  collection.__options = options || { log: console.log };\n  // Create a collection proxy\n  return new Proxy(collection, methodHandler(db));\n}\n\nmodule.exports = CollectionProxy;",
  "ctx": {
    "type": "property",
    "validate": "stats",
    "value": "(full) => {",
    "string": "validate"
  }
}