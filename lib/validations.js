var _ = require('underscore');

function createResultObj(passed, validationValue) {
  var result = {};
  result.passed = passed;
  result.validationValue = validationValue;
  return result;
}

module.exports = {
  exists: function(propertyToCheck, whetherOrNotItShouldExist) {
    var passed = ((propertyToCheck !== undefined) === whetherOrNotItShouldExist);
    return createResultObj(passed, whetherOrNotItShouldExist);
  },
  isType: function(thingToCheck, whatTypeItShouldBe) {
    var passed = Object.prototype.toString.call(thingToCheck).slice(8, -1) === whatTypeItShouldBe;
    return createResultObj(passed, whatTypeItShouldBe);
  },
  startsWith: function(strToCheck, whatStrShouldStartWith) {
    var passed = strToCheck.indexOf(whatStrShouldStartWith) === 0;
    return createResultObj(passed, whatStrShouldStartWith);
  },
  contains: function(strToCheck, whatItShouldContain) {
    var passed = strToCheck.indexOf(whatItShouldContain) !== -1;
    return createResultObj(passed, whatItShouldContain);
  },
  lessThan: function(valueToCheck, whatItShouldBeLessThan) {
    var passed = valueToCheck < whatItShouldBeLessThan;
    return createResultObj(passed, whatItShouldBeLessThan);
  },
  greaterThan: function(valueToCheck, whatItShouldBeGreaterThan) {
    var passed = valueToCheck > whatItShouldBeGreaterThan;
    return createResultObj(passed, whatItShouldBeGreaterThan);
  },
  equals: function(valueToCheck, whatItShouldEqual) {
    var passed = valueToCheck === whatItShouldEqual;
    return createResultObj(passed, whatItShouldEqual);
  },
  matchesRegexPattern: function(valueToCheck, regexPatternToMatch) {
    var regex = new RegExp(regexPatternToMatch);
    var passed = regex.test(valueToCheck);
    return createResultObj(passed, regexPatternToMatch);
  },
  //array validations should take objects or arrays of objects as input
  //  this is because arrays have multiple values and there is the chance that you 
  //  will want to run the same validation type more than once on the array for different array elements
  arrayContains: function(arrayToCheck, whatItShouldContain) {
    var result;
    if (whatItShouldContain instanceof Array) {
      //then recursively call for each array element
      result = [];
      for (var i = 0; i < whatItShouldContain.length; i++) {
        result.push(this.arrayContains(arrayToCheck, whatItShouldContain[i]));
      }
    }
    else {
      var passed = _.some(arrayToCheck, function(arrValue) {
        return arrValue === whatItShouldContain;
      });
      result = createResultObj(passed, whatItShouldContain);
    }
    return result;
  },
  arrayContainsObjectWithProperties: function(arrayToCheck, propertiesToUseToFindObject) {
    var result;
    if (propertiesToUseToFindObject instanceof Array) {
      //then recursively call for each array element
      result = [];
      for (var i = 0; i < propertiesToUseToFindObject.length; i++) {
        result.push(this.arrayContainsObjectWithProperties(arrayToCheck, propertiesToUseToFindObject[i]));
      }
    }
    else {
      var passed = _.findWhere(arrayToCheck, propertiesToUseToFindObject) !== undefined;
      result = createResultObj(passed, propertiesToUseToFindObject);
    }
    return result;
  },
  //special function. doesn't return a boolean but returns an object with objToValidate and validationObject properties
  validateArrayObjectElement: function(arrayToSearch, validationObject) {
    var retObj;
    if (validationObject instanceof Array) {
      retObj = [];
      for(var i = 0; i < validationObject.length; i++) {
        currRetObj = {};
        if (validationObject[i]._identifierProperties !== undefined) {
          currRetObj.objToValidate = _.findWhere(arrayToSearch, validationObject[i]._identifierProperties);
        }
        else if (validationObject[i]._arrayIndex !== undefined) {
          currRetObj.objToValidate = arrayToSearch[validationObject[i]._arrayIndex];
        }
        currRetObj.validationObject = validationObject[i];
        retObj.push(currRetObj);
      }
    }
    else {
      retObj = {};
      if (validationObject._identifierProperties !== undefined) {
        retObj.objToValidate = _.findWhere(arrayToSearch, validationObject._identifierProperties);
      }
      else if (validationObject._arrayIndex !== undefined) {
        retObj.objToValidate = arrayToSearch[validationObject._arrayIndex];
      }
      retObj.validationObject = validationObject;
    }
    retObj.needsFurtherValidation = true;//adding a named property to the array (in cases where it is an array)
    return retObj;
  }
};