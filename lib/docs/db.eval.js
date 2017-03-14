module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following is an example of the db.eval() method\ndb.eval( function(name, incAmount) {\n   var doc = db.myCollection.findOne( { name : name } );\n\n   doc = doc || { name : name , num : 0 , total : 0 , avg : 0 };\n\n   doc.num++;\n   doc.total += incAmount;\n   doc.avg = doc.total / doc.num;\n\n   db.myCollection.save( doc );\n   return doc;\n },\n\"eliot\", 5 );"
    },
    {
      "type": "param",
      "string": "{func} func A JavaScript function to execute.",
      "name": "func",
      "description": "A JavaScript function to execute.",
      "types": [
        "func"
      ],
      "typesDescription": "<a href=\"func.html\">func</a>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{list} [args] A list of arguments to pass to the JavaScript function. Omit if the function does not take arguments.",
      "name": "[args]",
      "description": "A list of arguments to pass to the JavaScript function. Omit if the function does not take arguments.",
      "types": [
        "list"
      ],
      "typesDescription": "<a href=\"list.html\">list</a>",
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
    "full": "Provides the ability to run JavaScript code on the MongoDB server (Deprecated since version 3.0).",
    "summary": "Provides the ability to run JavaScript code on the MongoDB server (Deprecated since version 3.0).",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 597,
  "codeStart": 618,
  "code": "eval(func, ...args) {\n  this.log('WARNING: db.eval is deprecated');\n\n  let cmd = { $eval: func };\n  if (args.length) cmd.args = args;\n\n  return this.runCommand(cmd)\n    .then(res => res.retval)\n    .catch(res => { throw getErrorWithCode(res, JSON.stringify(res)); });\n}",
  "ctx": {
    "type": "method",
    "name": "eval",
    "string": "eval()"
  }
}