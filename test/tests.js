var testr = require('../lib/testr');
var assert = require('assert');

var eyes = require('eyes');

describe('testr', function() {
  beforeEach(function() {
    testr.configure();//reset defaults
  });
  describe('isValidationProperty', function() {
    it('should recognize the default prefix', function() {
      var expected = true;
      var actual = testr.isValidationProperty('_startsWith');
      assert.equal(actual, expected);
    });
    it('should recognize a non-default prefix', function() {
      testr.configure({validationPrefix: '$'});
      var expected = true;
      var actual = testr.isValidationProperty('$startsWith');
      assert.equal(actual, expected);
    });
    it('should recognize a multi-character prefix', function() {
      testr.configure({validationPrefix: '--'});
      var expected = true;
      var actual = testr.isValidationProperty('--startsWith');
      assert.equal(actual, expected);
    });
  });
  describe('stripValidationPrefix', function() {
    it('should strip the default prefix', function() {
      var expected = 'startsWith';
      var actual = testr.stripValidationPrefix('_startsWith');
      assert.equal(actual, expected);
    });
    it('should strip a non-default prefix', function() {
      testr.configure({validationPrefix: '-'});
      var expected = 'startsWith';
      var actual = testr.stripValidationPrefix('-startsWith');
      assert.equal(actual, expected);
    });
    it('should strip a multi-character prefix', function() {
      testr.configure({validationPrefix: '--'});
      var expected = 'startsWith';
      var actual = testr.stripValidationPrefix('--startsWith');
      assert.equal(actual, expected);
    });
    it('should do nothing to a name without a prefix', function() {
      var expected = 'startsWith';
      var actual = testr.stripValidationPrefix('startsWith');
      assert.equal(actual, expected);
    });
  });
  describe('runValidation', function() {
    it('should run validation and return true if validation passes', function() {
      var actual = testr.runValidation("_startsWith", "hello", "hello world");
      var expected = {
        passed: true,
        validationValue: "hello"
      };
      assert.deepEqual(actual, expected);
    });
    it('should run validation and return false if validation fails', function() {
      var actual = testr.runValidation("_startsWith", "somethingElse", "hello world");
      var expected = {
        passed: false,
        validationValue: "somethingElse"
      };
      assert.deepEqual(actual, expected);
    });
    it('should run custom validators if any exist', function() {
      testr.configure({
        customValidators: {
          isBlue: function(valueToCheck, whetherOrNotItShouldBeBlue) {
            var result = {};
            result.passed = ((valueToCheck === 'blue') === whetherOrNotItShouldBeBlue);
            result.validationValue = whetherOrNotItShouldBeBlue;
            return result;
          },
        }
      });
      var actual = testr.runValidation("_isBlue", true, "blue");
      var expected = {
        passed: true,
        validationValue: true
      };
      assert.deepEqual(actual, expected);
    });
  });
  describe('validate', function() {
    it('should validate with regular expression', function() {
      var objToValidate = 'hello world';
      var validationObject = {
        '_matchesRegexPattern': 'h.*'
      };
      var actual = testr.validate(objToValidate, validationObject);
      var expected = {
        'actualValue': 'hello world',
        '_matchesRegexPattern': {
          'validationValue': 'h.*',
          'passed': true
        }
      };
      assert.deepEqual(actual, expected);
    });
    it('should validate a string', function() {
      var objToValidate = 'hello world';
      var validationObject = {
        '_startsWith': 'hello'
      };
      var actual = testr.validate(objToValidate, validationObject);
      var expected = {
        'actualValue': 'hello world',
        '_startsWith': {
          'validationValue': 'hello',
          'passed': true
        }
      };
      assert.deepEqual(actual, expected);
    });
    it('should run custom validators if any exist', function() {
      testr.configure({
        customValidators: {
          isBlue: function(valueToCheck, whetherOrNotItShouldBeBlue) {
            var result = {};
            result.passed = ((valueToCheck === 'blue') === whetherOrNotItShouldBeBlue);
            result.validationValue = whetherOrNotItShouldBeBlue;
            return result;
          }
        }
      });
      var validationObject = {
        '_isBlue': true
      };
      var actual = testr.validate("blue", validationObject);
      var expected = {
        actualValue: "blue",
        '_isBlue': {
          passed: true,
          validationValue: true
        }
      };
      assert.deepEqual(actual, expected);
    });
    it('should set passed to false on failures', function() {
      var objToValidate = 'hello world';
      var validationObject = {
        '_matchesRegexPattern': 'hz.*'
      };
      var result = testr.validate(objToValidate, validationObject);
      var actual = result._matchesRegexPattern.passed;
      var expected = false;
      assert.equal(actual, expected);
    });
    it('should validate existence', function() {
      var objToValidate = {
        name: 'justin'
      };
      var validationObject = {
        name: {
          '_exists': true
        }
      };
      var actual = testr.validate(objToValidate, validationObject);
      var expected = {
        'name': {
          'actualValue': 'justin',
          '_exists': {
            'validationValue': true,
            'passed': true
          }
        }
      };
      assert.deepEqual(actual, expected);
    });
    it('should validate lack of existence', function() {
      var objToValidate = {
        name: 'justin'
      };
      var validationObject = {
        beer: {
          '_exists': false
        }
      };
      var actual = testr.validate(objToValidate, validationObject);
      var expected = {
        'beer': {
          'actualValue': 'undefined',
          '_exists': {
            'validationValue': false,
            'passed': true
          }
        }
      };
      assert.deepEqual(actual, expected);
    });
    it('should validate type', function() {
      var objToValidate = {
        strTest: '',
        arrTest: [],
        objTest: {},
        boolTest: true
      };
      var validationObject = {
        strTest: {
          '_isType': 'String'
        },
        arrTest: {
          '_isType': 'Array'
        },
        objTest: {
          '_isType': 'Object'
        },
        boolTest: {
          '_isType': 'Boolean'
        }
      };
      var actual = testr.validate(objToValidate, validationObject);
      var expected = {
        'strTest': {
          'actualValue': '',
          '_isType': {
            'validationValue': 'String',
            'passed': true
          }
        },
        'arrTest': {
          'actualValue': [],
          '_isType': {
            'validationValue': 'Array',
            'passed': true
          }
        },
        'objTest': {
          'actualValue': {},
          '_isType': {
            'validationValue': 'Object',
            'passed': true
          }
        },
        'boolTest': {
          'actualValue': true,
          '_isType': {
            'validationValue': 'Boolean',
            'passed': true
          }
        }
      };
      assert.deepEqual(actual, expected);
    });
    it('should validate an object', function() {
      var objToValidate = {
        name: 'justin'
      };
      var validationObject = {
        'name': {
          '_contains': 'j'
        }
      };
      var actual = testr.validate(objToValidate, validationObject);
      var expected = {
        name: {
          actualValue: 'justin',
          '_contains': {
            validationValue: 'j',
            'passed': true
          }
        }
      };
      assert.deepEqual(actual, expected);
    });
    it('should validate a complex object', function() {
      var objToValidate = {
        "name": "justin",
        "age": 25,
        "languages": [
          "JavaScript",
          "Java",
          "C#"
        ]
      };
      var validationObject = {
        "name": {
          "_contains": "j"
        },
        "age": {
          "_greaterThan": 18
        },
        "languages": {
          "_arrayContains": "Java"
        }
      };
      var actual = testr.validate(objToValidate, validationObject);
      var expected = {
        "name": {
          "actualValue": "justin",
          "_contains": {
            "validationValue": "j",
            "passed": true
          }
        },
        "age": {
          "actualValue": 25,
          "_greaterThan": {
            "validationValue": 18,
            "passed": true
          }
        },
        "languages": {
          "actualValue": [
            "JavaScript",
            "Java",
            "C#"
          ],
          "_arrayContains": {
            "validationValue": "Java",
            "passed": true
          }
        }
      };
      assert.deepEqual(actual, expected);
    });
    it('should validate multiple array values', function() {
      var objToValidate = {
        "languages": [
          "JavaScript",
          "Java",
          "C#"
        ]
      };
      var validationObject = {
        "languages": {
          "_arrayContains": ["Java", "C#"]
        }
      };
      var actual = testr.validate(objToValidate, validationObject);
      var expected = {
        "languages": {
          "actualValue": [
            "JavaScript",
            "Java",
            "C#"
          ],
          "_arrayContains": [
            {
              "validationValue": "Java",
              "passed": true
            },
            {
              "validationValue": "C#",
              "passed": true
            }
          ]
        }
      };
      assert.deepEqual(actual, expected);
    });
    it('should validate a very complex object', function() {
      var objToValidate = {
        "name": "justin",
        "age": 25,
        "profile": {
          "skills": [
            {
              "name": "special skills",
              "level": 49,
              "value": 10
            },
            {
              "name": "programming",
              "level": 3,
              "value": 10
            },
            {
              "name": "gardening",
              "level": 8,
              "value": 10
            }
          ]
        }
      };
      var validationObject = {
        "profile": {
          "skills": {
            "_arrayContainsObjectWithProperties": {
              "name": "programming"
            },
            "_validateArrayObjectElement": {
              "_identifierProperties": {"name": "special skills"},
              "level": {
                "_greaterThan": 40,
                "_lessThan": 89
              },
              "value": {
                "_equals": 10
              }
            }
          }
        }
      };
      var actual = testr.validate(objToValidate, validationObject);
      var expected = {
        "profile": {
          "skills": {
            "actualValue": [//if there are any tests of the object, then deep copy the object into the result
              {
                "name": "special skills",
                "level": 49,
                "value": 10
              },
              {
                "name": "programming",
                "level": 3,
                "value": 10
              },
              {
                "name": "gardening",
                "level": 8,
                "value": 10
              }
            ],
            "_arrayContainsObjectWithProperties": {
              "validationValue": {
                "name": "programming"
              },
              "passed": true
            },
            //this key is not a test like the others so far. so it doesn't have associated validationValue or passed properties
            "_validateArrayObjectElement": {
              "_identifierProperties": {"name": "special skills"},
              "level": {
                "actualValue": 49,
                "_greaterThan": {
                  "validationValue": 40,
                  "passed": true
                },
                "_lessThan": {
                  "validationValue": 89,
                  "passed": true
                }
              },
              "value": {
                "actualValue": 10,
                "_equals": {
                  "validationValue": 10,
                  "passed": true
                }
              }
            }
          }
        }
      };
      assert.deepEqual(actual, expected);
    });
    it('should multiple array elements when given an array validation property', function()
    {
      var objToValidate = {
        "name": "justin",
        "age": 25,
        "profile": {
          "skills": [
            {
              "name": "special skills",
              "level": 49,
              "value": 10
            },
            {
              "name": "programming",
              "level": 3,
              "value": 10
            },
            {
              "name": "gardening",
              "level": 8,
              "value": 10
            }
          ]
        }
      };
      var validationObject = {
        "profile": {
          "skills": {
            "_arrayContainsObjectWithProperties": {
              "name": "programming"
            },
            "_validateArrayObjectElement": [
              {
                "_identifierProperties": {"name": "special skills"},
                "level": {
                  "_greaterThan": 40,
                  "_lessThan": 89
                },
                "value": {
                  "_equals": 10
                }
              },
              {
                "_arrayIndex": 2,
                "name": {
                  "_equals": "gardening"
                }
              }
            ]
          }
        }
      };
      var actual = testr.validate(objToValidate, validationObject);
      var expected = {
        "profile": {
          "skills": {
            "actualValue": [//if there are any tests of the object, then deep copy the object into the result
              {
                "name": "special skills",
                "level": 49,
                "value": 10
              },
              {
                "name": "programming",
                "level": 3,
                "value": 10
              },
              {
                "name": "gardening",
                "level": 8,
                "value": 10
              }
            ],
            "_arrayContainsObjectWithProperties": {
              "validationValue": {
                "name": "programming"
              },
              "passed": true
            },
            //this key is not a test like the others so far. so it doesn't have associated validationValue or passed properties
            "_validateArrayObjectElement": [
              {
                "_identifierProperties": {"name": "special skills"},
                "level": {
                  "actualValue": 49,
                  "_greaterThan": {
                    "validationValue": 40,
                    "passed": true
                  },
                  "_lessThan": {
                    "validationValue": 89,
                    "passed": true
                  }
                },
                "value": {
                  "actualValue": 10,
                  "_equals": {
                    "validationValue": 10,
                    "passed": true
                  }
                }
              },
              {//not a test
                "_arrayIndex": 2,//not a test
                "name": {
                  "actualValue": "gardening",
                  "_equals": {
                    "validationValue": "gardening",
                    "passed": true
                  }
                }
              }
            ]
          }
        }
      };
      assert.deepEqual(actual, expected);
    });
  });
});