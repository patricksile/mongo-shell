module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following operation copies a database named records into a database named archive_records\ndb.copyDatabase('records', 'archive_records')\n// The following operation copies a database named reporting from a version 2.6 mongod instance that runs on example.net and enforces access control\ndb.copyDatabase(\n  \"reporting\",\n  \"reporting_copy\",\n  \"example.net\",\n  \"reportUser\",\n  \"abc123\",\n  \"MONGODB-CR\"\n)"
    },
    {
      "type": "param",
      "string": "{string} fromdb Name of the source database.",
      "name": "fromdb",
      "description": "Name of the source database.",
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
      "string": "{string} todb Name of the target database.",
      "name": "todb",
      "description": "Name of the target database.",
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
      "string": "{string} [fromhost] The hostname of the source :program:`mongod` instance. Omit  to copy databases within the same :program:`mongod` instance.",
      "name": "[fromhost]",
      "description": "The hostname of the source :program:`mongod` instance. Omit to copy databases within the same :program:`mongod` instance.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{string} [username] The name of the user on the ``fromhost`` MongoDB instance. The user authenticates to the ``fromdb``.  For more information, see :ref:`copyDatabase-access-control`.",
      "name": "[username]",
      "description": "The name of the user on the ``fromhost`` MongoDB instance. The user authenticates to the ``fromdb``. For more information, see :ref:`copyDatabase-access-control`.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{string} [password] The password on the ``fromhost`` for authentication. The method does **not** transmit the password in plaintext.  For more information, see :ref:`copyDatabase-access-control`.",
      "name": "[password]",
      "description": "The password on the ``fromhost`` for authentication. The method does **not** transmit the password in plaintext. For more information, see :ref:`copyDatabase-access-control`.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{string} [mechanism] The mechanism to authenticate the ``username`` and ``password`` on the ``fromhost``. Specify either :ref:`MONGODB-CR <authentication-mongodb-cr>` or :ref:`SCRAM-SHA-1 <authentication-scram-sha-1>`.   `db.copyDatabase` defaults to :ref:`SCRAM-SHA-1 <authentication-scram-sha-1>` if the wire protocol version (:data:`~isMaster.maxWireVersion`) is greater than or equal to ``3`` (i.e. MongoDB versions 3.0 or greater). Otherwise, it defaults to :ref:`MONGODB-CR <authentication-mongodb-cr>`.  Specify ``MONGODB-CR`` to authenticate to the version 2.6.x ``fromhost`` from a version 3.0 instance or greater. For an example, see :ref:`example-copyDatabase-from-2.6`.  .. versionadded:: 3.0",
      "name": "[mechanism]",
      "description": "The mechanism to authenticate the ``username`` and ``password`` on the ``fromhost``. Specify either :ref:`MONGODB-CR <authentication-mongodb-cr>` or :ref:`SCRAM-SHA-1 <authentication-scram-sha-1>`. `db.copyDatabase` defaults to :ref:`SCRAM-SHA-1 <authentication-scram-sha-1>` if the wire protocol version (:data:`~isMaster.maxWireVersion`) is greater than or equal to ``3`` (i.e. MongoDB versions 3.0 or greater). Otherwise, it defaults to :ref:`MONGODB-CR <authentication-mongodb-cr>`. Specify ``MONGODB-CR`` to authenticate to the version 2.6.x ``fromhost`` from a version 3.0 instance or greater. For an example, see :ref:`example-copyDatabase-from-2.6`. .. versionadded:: 3.0",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
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
    "full": "Copies a database either from one mongod instance to the current mongod instance or within the current mongod . db.copyDatabase() wraps the copydb command and takes the following arguments:",
    "summary": "Copies a database either from one mongod instance to the current mongod instance or within the current mongod . db.copyDatabase() wraps the copydb command and takes the following arguments:",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 180,
  "codeStart": 202,
  "code": "copyDatabase(fromdb, todb, fromhost, username, password, mechanism) {}",
  "ctx": {
    "type": "method",
    "name": "copyDatabase",
    "string": "copyDatabase()"
  }
}