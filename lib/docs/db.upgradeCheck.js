module.exports = {
  "tags": [
    {
      "type": "param",
      "string": "{object} [scope] Document to limit the scope of the check to the specified collection in the database.  Omit to perform the check on all collections in the database.",
      "name": "[scope]",
      "description": "Document to limit the scope of the check to the specified collection in the database. Omit to perform the check on all collections in the database.",
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
    "full": "Performs a preliminary check for upgrade preparedness to 2.6. The helper, available in the 2.6 mongo shell, can run connected to either a 2.4 or a 2.6 server.",
    "summary": "Performs a preliminary check for upgrade preparedness to 2.6. The helper, available in the 2.6 mongo shell, can run connected to either a 2.4 or a 2.6 server.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 1534,
  "codeStart": 1539,
  "code": "upgradeCheck(scope) {}",
  "ctx": {
    "type": "method",
    "name": "upgradeCheck",
    "string": "upgradeCheck()"
  }
}