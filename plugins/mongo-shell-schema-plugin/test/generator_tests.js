const assert = require('assert');
const OdmGenerator = require('../');
const co = require('co');
const fs = require('fs');
const connect = require('mongodb');

describe('Mongo Shell Schema Plugin Generation', () => {
  describe('Collection', () => {
    it('should correctly generate a mongoose schema and preview it', function(done) {
      co(function*() {
        // Get the client
        const client = yield connect('mongodb://localhost:27017/schema_test');
        // Clean up
        yield client.collection('employees').deleteMany({});
        // Add a bunch of documents
        yield client.collection('employees').insertMany([
          {
            name: 'Peter Pan',
            age: 200,
            address: {
              home: {
                street: 'Neverland lane 1',
                postcode: 111222
              }
            },
            grades: [10, 9, 7],
            schooling: [{
              name: 'University of NeverLand',
              title: 'Undergraduate in Fairy Flight',
            }, {
              name: 'University of NeverLand',
              title: 'PostGraduate in Fairy Flight',
            }]
          }
        ]);
        // Create an odm generator
        const odmGenerator = new OdmGenerator(client);
        // Create fake context
        const context = {};
        // Decorate the context
        yield odmGenerator.decorateContext(context);
        // Get the collection and execute
        const result = yield context.schema.collection('employees').generate({
          target: 'mongoose', preview: true
        });

        assert.ok(result.indexOf(`var EmployeeSchema = new Schema({
  "_id": {
    "type": "ObjectId"
  },
  "address": {
    "home": {
      "postcode": {
        "type": "Number"
      },
      "street": {
        "type": "String"
      }
    }
  },
  "age": {
    "type": "Number"
  },
  "grades": [
    "Number"
  ],
  "name": {
    "type": "String"
  },
  "schooling": {
    "name": {
      "type": "String"
    },
    "title": {
      "type": "String"
    }
  }
});`))

        done();
      }).catch(err => console.log(err));
    });

    it('should correctly generate a mongoose schema and generate file', function(done) {
      co(function*() {
        // Get the client
        const client = yield connect('mongodb://localhost:27017/schema_test');
        // Clean up
        yield client.collection('employees').deleteMany({});
        // Add a bunch of documents
        yield client.collection('employees').insertMany([
          {
            name: 'Peter Pan',
            age: 200,
            address: {
              home: {
                street: 'Neverland lane 1',
                postcode: 111222
              }
            },
            grades: [10, 9, 7],
            schooling: [{
              name: 'University of NeverLand',
              title: 'Undergraduate in Fairy Flight',
            }, {
              name: 'University of NeverLand',
              title: 'PostGraduate in Fairy Flight',
            }]
          }
        ]);
        // Create an odm generator
        const odmGenerator = new OdmGenerator(client);
        // Create fake context
        const context = {};
        // Decorate the context
        yield odmGenerator.decorateContext(context);
        // Get the collection and execute
        yield context.schema.collection('employees').generate({
          target: 'mongoose'
        });

        // Read the content
        const result = fs.readFileSync('./employee.js', 'utf8');
        // Delete the file
        fs.unlinkSync('./employee.js');
        // Perform the assertion
        assert.ok(result.indexOf(`var EmployeeSchema = new Schema({
  "_id": {
    "type": "ObjectId"
  },
  "address": {
    "home": {
      "postcode": {
        "type": "Number"
      },
      "street": {
        "type": "String"
      }
    }
  },
  "age": {
    "type": "Number"
  },
  "grades": [
    "Number"
  ],
  "name": {
    "type": "String"
  },
  "schooling": {
    "name": {
      "type": "String"
    },
    "title": {
      "type": "String"
    }
  }
});`))

        done();
      }).catch(err => console.log(err));
    });
  });

  describe('Db', () => {
    it('should correctly generate a db schema and preview it', function(done) {
      co(function*() {
        // Get the client
        const client = yield connect('mongodb://localhost:27017/schema_test');
        // Clean up
        yield client.dropDatabase();
        // Add a bunch of documents
        yield client.collection('employees').insertMany([
          {
            name: 'Peter Pan',
            age: 200,
            address: {
              home: {
                street: 'Neverland lane 1',
                postcode: 111222
              }
            },
            grades: [10, 9, 7],
            schooling: [{
              name: 'University of NeverLand',
              title: 'Undergraduate in Fairy Flight',
            }, {
              name: 'University of NeverLand',
              title: 'PostGraduate in Fairy Flight',
            }]
          }
        ]);

        // Add a bunch of documents
        yield client.collection('schools').insertMany([
          {
            name: 'University of Neverland',
            age: 200,
            address: {
              home: {
                street: 'Neverland lane 1',
                postcode: 111222
              }
            },
          }
        ]);

        // Create an odm generator
        const odmGenerator = new OdmGenerator(client);
        // Create fake context
        const context = {};
        // Decorate the context
        yield odmGenerator.decorateContext(context);
        // Get the collection and execute
        const result = yield context.schema.generate({
          target: 'mongoose', preview: true
        });

        const merged = result.join('\n');
        assert.ok(merged.indexOf(`var EmployeeSchema = new Schema({
  "_id": {
    "type": "ObjectId"
  },
  "address": {
    "home": {
      "postcode": {
        "type": "Number"
      },
      "street": {
        "type": "String"
      }
    }
  },
  "age": {
    "type": "Number"
  },
  "grades": [
    "Number"
  ],
  "name": {
    "type": "String"
  },
  "schooling": {
    "name": {
      "type": "String"
    },
    "title": {
      "type": "String"
    }
  }
});`) != -1);
        assert.ok(merged.indexOf(`var SchoolSchema = new Schema({
  "_id": {
    "type": "ObjectId"
  },
  "address": {
    "home": {
      "postcode": {
        "type": "Number"
      },
      "street": {
        "type": "String"
      }
    }
  },
  "age": {
    "type": "Number"
  },
  "name": {
    "type": "String"
  }
})`) != -1);
        done();
      });
    });

    it('should correctly generate a db schema and render to file', function(done) {
      co(function*() {
        // Get the client
        const client = yield connect('mongodb://localhost:27017/schema_test');
        // Clean up
        yield client.dropDatabase();
        // Add a bunch of documents
        yield client.collection('employees').insertMany([
          {
            name: 'Peter Pan',
            age: 200,
            address: {
              home: {
                street: 'Neverland lane 1',
                postcode: 111222
              }
            },
            grades: [10, 9, 7],
            schooling: [{
              name: 'University of NeverLand',
              title: 'Undergraduate in Fairy Flight',
            }, {
              name: 'University of NeverLand',
              title: 'PostGraduate in Fairy Flight',
            }]
          }
        ]);

        // Add a bunch of documents
        yield client.collection('schools').insertMany([
          {
            name: 'University of Neverland',
            age: 200,
            address: {
              home: {
                street: 'Neverland lane 1',
                postcode: 111222
              }
            },
          }
        ]);

        // Create an odm generator
        const odmGenerator = new OdmGenerator(client);
        // Create fake context
        const context = {};
        // Decorate the context
        yield odmGenerator.decorateContext(context);
        // Get the collection and execute
        yield context.schema.generate({
          target: 'mongoose', preview: false
        });

        const employee = fs.readFileSync('./employee.js', 'utf8');
        const school = fs.readFileSync('./school.js', 'utf8');
        const merged = employee + school;

        // Delete the file
        fs.unlinkSync('./employee.js');
        fs.unlinkSync('./school.js');

        assert.ok(merged.indexOf(`var EmployeeSchema = new Schema({
  "_id": {
    "type": "ObjectId"
  },
  "address": {
    "home": {
      "postcode": {
        "type": "Number"
      },
      "street": {
        "type": "String"
      }
    }
  },
  "age": {
    "type": "Number"
  },
  "grades": [
    "Number"
  ],
  "name": {
    "type": "String"
  },
  "schooling": {
    "name": {
      "type": "String"
    },
    "title": {
      "type": "String"
    }
  }
});`) != -1);
        assert.ok(merged.indexOf(`var SchoolSchema = new Schema({
  "_id": {
    "type": "ObjectId"
  },
  "address": {
    "home": {
      "postcode": {
        "type": "Number"
      },
      "street": {
        "type": "String"
      }
    }
  },
  "age": {
    "type": "Number"
  },
  "name": {
    "type": "String"
  }
})`) != -1);
        done();
      });
    });
  });
});
