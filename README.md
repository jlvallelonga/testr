# testr

generic object testing for node.js

## Install
```
npm install testr
```

## Usage

```
var testr = require('testr');

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
var result = testr.validate(objToValidate, validationObject);
```

the resulting object will look like this:
```
{
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
}
```
