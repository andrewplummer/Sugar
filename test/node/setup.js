// Test suite

sinon = require('sinon');
require('../suite/suite');
require('../suite/helpers/common');
require('../suite/helpers/core');
require('../suite/helpers/date');

logResults = function(runtime, results) {
  var i, j, failure, totalAssertions = 0, totalFailures = 0;
  for (i = 0; i < results.length; i += 1) {
    totalAssertions += results[i].assertions;
    totalFailures += results[i].failures.length;
    for(j = 0; j < results[i].failures.length; j++) {
      failure = results[i].failures[j];
      console.info('\n'+ (j + 1) + ') Failure:');
      console.info(failure.message);
      try {
        console.info('Expected: ' + JSON.stringify(failure.expected) + ' but was: ' + JSON.stringify(failure.actual));
      } catch(e) {
        if (e instanceof TypeError) {
          // Sugar.Date has a "toJSON" method which means if it or the Sugar
          // global is stringified it will error. In most cases it's the global.
          console.error('Actual value was likely Sugar global object!');
        } else {
          throw e;
        }
      }
      console.info('File: ' + failure.file + ', Line: ' + failure.line, ' Col: ' + failure.col + '\n');
    }
  };
  var time = (runtime / 1000);
  console.info(results.length + ' tests, ' + totalAssertions + ' assertions, ' + totalFailures + ' failures, ' + time + 's\n');
  if (totalFailures > 0) {
    process.exit(1);
  }
}
