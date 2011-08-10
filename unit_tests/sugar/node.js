
environment = 'node';

var results = '';

test = function(name, fn) {
  fn.call();
  console.info(results);
}

equals = function(expected, actual) {
  if(expected === actual){
    results += '.';
  } else {
    results += 'F';
  }
}

equal = equals;

same = function(expected, actual) {
  if(expected === actual){
    results += '.';
  } else {
    results += 'F';
  }
}

require('./../../lib/sugar.js');
require('./setup.js');
require('./array.js');
