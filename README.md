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

```
  _exists
  _isType
  _startsWith
  _contains
  _lessThan
  _greaterThan
  _equals
  _matchesRegexPattern
  _arrayContains
  _arrayContainsObjectWithProperties
  _validateArrayObjectElement
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
