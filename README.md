# testr

A generic object testing package for Node.js

## Install
```
npm install testr
```

## Usage

```
var testr = require('testr');

var objToValidate = 'hello world';
var result = testr.validate(objToValidate, {_startsWith: 'hello'});
```

and the result is:
```
{
  actualValue: 'hello world',
  _startsWith: {
    passed: true,
    validationValue: 'hello'
  }
}
```

## Validators

All validators begin with an underscore by default. You can override this by calling testr.configure with a configuration object argument like so:

```
testr.configure({validationPrefix: '$'});
```

validator functions are below:


### exists
```
var result = testr.validate({name: 'testr'}, {name: {_exists: true}});
```
result:
```
{
    name: {
        actualValue: 'testr',
        _exists: { passed: true, validationValue: true }
    }
}
```
### isType
```
var result = testr.validate('testr', {_isType: 'String'});
```
result:
```
{
    actualValue: 'testr',
    _isType: { passed: true, validationValue: 'String' }
}
```
### startsWith
```
var result = testr.validate('testr', {_startsWith: 't'});
```
result:
```
{
    actualValue: 'testr',
    _startsWith: { passed: true, validationValue: 't' }
}
```
### contains
```
var result = testr.validate('testr', {_contains: 't'});
```
result:
```
{
    actualValue: 'testr',
    _contains: { passed: true, validationValue: 't' }
}
```
### lessThan
```
var result = testr.validate(47, {_lessThan: 48});
```
result:
```
{
    actualValue: 47,
    _lessThan: { passed: true, validationValue: 48 }
}
```
### greaterThan
```
var result = testr.validate(47, {_greaterThan: 46});
```
result:
```
{
    actualValue: 47,
    _greaterThan: { passed: true, validationValue: 46 }
}
```
### equals
```
var result = testr.validate('testr', {_equals: 'testr'});
```
result:
```
{
    actualValue: 'testr',
    _equals: { passed: true, validationValue: 'testr' }
}
```
### matchesRegexPattern
```
var result = testr.validate('testr', {_matchesRegexPattern: 't.*'});
```
result:
```
{
    actualValue: 'testr',
    _matchesRegexPattern: { passed: true, validationValue: 't.*' }
}
```
### arrayContains
```
var result = testr.validate([1, 2, 3], {_arrayContains: 3});
```
result:
```
{
    actualValue: [ 1, 2, 3 ],
    _arrayContains: { passed: true, validationValue: 3 }
}
```
You can also use an array as the expected value to validate that the array contains multiple values:
```
var result = testr.validate([1, 2, 3], {_arrayContains: [2, 3]});
```
result:
```
{
    actualValue: [ 1, 2, 3 ],
    _arrayContains: [
        { passed: true, validationValue: 2 },
        { passed: true, validationValue: 3 }
    ]
}
```
The following examples reference this array:
```
var testArray = [
  {
    name: 'testr',
    description: 'generic object testing'
  }, 
  {
    name: 'billy-bob',
    age: 49
  }, 
  {
    name: 'the ugly one',
    ugliness: {
      isReallyIntense: true,
      level: 140
    }
  }
];
```
### arrayContainsObjectWithProperties
```
var result = testr.validate(testArray, {_arrayContainsObjectWithProperties: {name: 'testr'}});
```
result:
```
{
    actualValue: [
        { name: 'testr', description: 'generic object testing' },
        { name: 'billy-bob', age: 49 },
        {
            name: 'the ugly one',
            ugliness: { isReallyIntense: true, level: 140 }
        }
    ],
    _arrayContainsObjectWithProperties: {
        passed: true,
        validationValue: { name: 'testr' }
    }
}
```
You can also use an array as the expected value to validate multiple values:
```
var result = testr.validate(testArray, {_arrayContainsObjectWithProperties: [{name: 'testr'}, {name: 'billy-bob'}]});
```
result:
```
{
    actualValue: [
        { name: 'testr', description: 'generic object testing' },
        { name: 'billy-bob', age: 49 },
        {
            name: 'the ugly one',
            ugliness: { isReallyIntense: true, level: 140 }
        }
    ],
    _arrayContainsObjectWithProperties: [
        {
            passed: true,
            validationValue: { name: 'testr' }
        },
        {
            passed: true,
            validationValue: { name: 'billy-bob' }
        }
    ]
}
```
### validateArrayObjectElement
```
var validationObj = {
  _validateArrayObjectElement: {
    _identifierProperties: {name: 'testr'},
    description: {
      _contains: 'testing'
    }
  }
}
var result = testr.validate(testArray, validationObj);
```
result:
```
{
    _validateArrayObjectElement: {
        _identifierProperties: { name: 'testr' },
        description: {
            actualValue: 'generic object testing',
            _contains: { passed: true, validationValue: 'testing' }
        }
    }
}
```
You can also use an array as the expected value to validate multiple values.
Here you also see how nesting works:
```
validationObj = {
  _validateArrayObjectElement: [
    {
      _identifierProperties: {name: 'testr'},
      description: {
        _contains: 'testing'
      }
    },
    {
      _identifierProperties: {name: 'billy-bob'},
      age: {
        _lessThan: 100
      }
    },
    {
      _identifierProperties: {name: 'the ugly one'},
      ugliness: {
        isReallyIntense: {
          _equals: true
        },
        level: {
          _greaterThan: 125
        }
      }
    }
  ]
}
var result = testr.validate(testArray, validationObj);
```
result:
```
{
    _validateArrayObjectElement: [
        {
            _identifierProperties: { name: 'testr' },
            description: {
                actualValue: 'generic object testing',
                _contains: { passed: true, validationValue: 'testing' }
            }
        },
        {
            _identifierProperties: { name: 'billy-bob' },
            age: {
                actualValue: 49,
                _lessThan: { passed: true, validationValue: 100 }
            }
        },
        {
            _identifierProperties: { name: 'the ugly one' },
            ugliness: {
                isReallyIntense: {
                    actualValue: true,
                    _equals: { passed: true, validationValue: true }
                },
                level: {
                    actualValue: 140,
                    _greaterThan: { passed: true, validationValue: 125 }
                }
            }
        }
    ]
}
```


example usage is in the test directory for now

## Custom Validators

Additionally you can provide custom validation functions by calling testr.configure with a configuration object argument like so:

```
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
```

## Contributions are welcome
