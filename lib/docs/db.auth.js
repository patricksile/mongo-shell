module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The db.auth() method can accept either\ndb.auth( <username>, <password> )\n// a user document that contains the username and password, and optionally, the authentication mechanism and a digest password flag.\ndb.auth( {\n  user: <username>,\n  pwd: <password>,\n  mechanism: <authentication mechanism>,\n  digestPassword: <boolean>\n} )"
    },
    {
      "type": "param",
      "string": "{string} username Specifies an existing username with access privileges for this database.",
      "name": "username",
      "description": "Specifies an existing username with access privileges for this database.",
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
      "string": "{string} password Specifies the corresponding password.",
      "name": "password",
      "description": "Specifies the corresponding password.",
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
      "string": "{string} [mechanism] Specifies the :ref:`authentication mechanism <mongo-shell-authentication-mechanisms>` used. Defaults to either:  - ``SCRAM-SHA-1`` on new 3.0 installations and on 3.0 databases that   have been :ref:`upgraded from 2.6 with authSchemaUpgrade   <upgrade-scram-scenarios>`; or  - ``MONGODB-CR`` otherwise.  .. versionchanged:: 3.0    In previous version, defaulted to ``MONGODB-CR``.  For available mechanisms, see :ref:`authentication mechanisms <mongo-shell-authentication-mechanisms>`.",
      "name": "[mechanism]",
      "description": "Specifies the :ref:`authentication mechanism <mongo-shell-authentication-mechanisms>` used. Defaults to either: - ``SCRAM-SHA-1`` on new 3.0 installations and on 3.0 databases that have been :ref:`upgraded from 2.6 with authSchemaUpgrade <upgrade-scram-scenarios>`; or - ``MONGODB-CR`` otherwise. .. versionchanged:: 3.0 In previous version, defaulted to ``MONGODB-CR``. For available mechanisms, see :ref:`authentication mechanisms <mongo-shell-authentication-mechanisms>`.",
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
      "string": "{boolean} [digestPassword] Determines whether the server receives digested or undigested password. Set to false to specify undigested password. For use with :doc:`SASL/LDAP authentication </tutorial/configure-ldap-sasl-openldap>` since the server must forward an undigested password to ``saslauthd``.",
      "name": "[digestPassword]",
      "description": "Determines whether the server receives digested or undigested password. Set to false to specify undigested password. For use with :doc:`SASL/LDAP authentication </tutorial/configure-ldap-sasl-openldap>` since the server must forward an undigested password to ``saslauthd``.",
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
    "full": "Allows a user to authenticate to the database from within the shell.",
    "summary": "Allows a user to authenticate to the database from within the shell.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 92,
  "codeStart": 110,
  "code": "auth(username, password, mechanism, digestPassword) {\n  let options = {};\n  if (mechanism) options.mechanism = mechanism;\n  if (digestPassword) options.digestPassword = digestPassword;\n\n  return this.state.client.db(this.name).authenticate(username, password, options);\n}",
  "ctx": {
    "type": "method",
    "name": "auth",
    "string": "auth()"
  }
}