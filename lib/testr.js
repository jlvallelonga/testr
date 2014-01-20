var validations = require('./validations');

var testr = function(){};

testr.prototype.configuration = {
  validationPrefix: '_',
  customValidators: {}
};

testr.prototype.configure = function(configObj) {
  if (configObj === undefined) {
    configObj = {};
  }
  //provide a default validationPrefix if it's not present in the given configObj
  if (configObj.validationPrefix === undefined) {
    configObj.validationPrefix = '_';
  }
  this.configuration = configObj;
};

testr.prototype.validate = function(objToValidate, validationObject) {
  var result = {};
  //loop through validation object properties
  for (var prop in validationObject) {
    if (validationObject.hasOwnProperty(prop)) {
      if (this.isValidationProperty(prop)) {
        var validationName = prop;
        var validationValue = validationObject[validationName];
        var validationResult = this.runValidation(validationName, validationValue, objToValidate);
        if (validationResult !== undefined) {
          if (validationResult.needsFurtherValidation) {
            if (validationResult instanceof Array) { //arrays can have named properties too
              result[prop] = [];
              for(var i = 0; i < validationResult.length; i++) {
                result[prop].push(this.validate(validationResult[i].objToValidate, validationResult[i].validationObject));
              }
            }
            else {
              result[prop] = this.validate(validationResult.objToValidate, validationResult.validationObject);
            }
          }
          else {
            try {
              result.actualValue = JSON.parse(JSON.stringify(objToValidate));//log a deep copy of the actual value
            }
            catch (e) {
              result.actualValue = 'undefined';
            }
            result[validationName] = validationResult;
          }
        }
        else {
          result[prop] = validationObject[prop];
        }
      }
      else {//otherwise it should be a property of the object to validate
        result[prop] = this.validate(objToValidate[prop], validationObject[prop]);
      }
    }
  }
  return result;
};

testr.prototype.runValidation = function(validationName, validationValue, objToValidate) {
  var validationFunctionName = this.stripValidationPrefix(validationName);
  if (this.configuration.customValidators && this.configuration.customValidators[validationFunctionName] !== undefined) {
    return this.configuration.customValidators[validationFunctionName](objToValidate, validationValue);
  }
  else if (validations[validationFunctionName] !== undefined) {
    return validations[validationFunctionName](objToValidate, validationValue);
  }
};

testr.prototype.stripValidationPrefix = function(validationWithPrefix) {
  var result = validationWithPrefix;
  if (validationWithPrefix.indexOf(this.configuration.validationPrefix) === 0) {
    result = result.substring(this.configuration.validationPrefix.length);
  }
  return result;
};

testr.prototype.isValidationProperty = function(property) {
  if (property.indexOf(this.configuration.validationPrefix) === 0) {
    return true;
  }
  return false;
};

module.exports = new testr();