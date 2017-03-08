const ejs = require('ejs');
const fs = require('fs');
const schemaTemplate = fs.readFileSync(`${__dirname}/schema.ejs`, 'utf8');

class MongooseGenerator {
  constructor(client) {
    this.client = client;
  }

  async generate(name, schema, options = {}) {
    // We need to transform the document
    const transformedDoc = transform(schema, {});
    // Render the Schema definition
    return ejs.render(schemaTemplate, {name: name, schema: JSON.stringify(transformedDoc, null, 2)}, {});
  }
}

function transform(schema, result) {
  if (schema.fields) {
    for (let field of schema.fields) {
      if (field.type 
        && field.type.indexOf('Document') == -1 
        && field.type.indexOf('Array') == -1) {
          result[field.name] = {type: translateType(field.type)} 
      } else if (field.type && field.type.indexOf('Document') != -1) {    
        for (const _type of field.types) {
          if (_type.bsonType == 'Document') {
            result[field.name] = transform(_type, {});
            break;
          }
        }
      } else if (field.type && field.type.indexOf('Array') != -1) {
        for (const _type of field.types) {
          if (_type.bsonType == 'Array') {            
            // Check if it's an array of Documents
            for (const __type of _type.types) {
              if (__type.bsonType == 'Document') {
                result[field.name] = transform(__type, {});
                break;
              } else if(__type.bsonType !== 'Undefined') {
                result[field.name] = [translateType(__type.bsonType)];
              }
            }

            break;
          }
        }        
      }
    }
  }

  return result;
}

function translateType(type) {
  if (Array.isArray(type) && type.length == 2 && type.indexOf('Undefined') != -1) {
    type = type[0] === 'Undefined' ? type[1] : type[0];
  }

  if (type == 'ObjectID') return 'ObjectId';
  if (type == 'Long') return 'Number';
  return type;
}

module.exports = MongooseGenerator;