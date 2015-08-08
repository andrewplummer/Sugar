
environment = 'node';

// Test suite
require('../../javascripts/suite.js');
require('../../javascripts/helpers.js');
require('../../javascripts/date-helpers.js');

sinon = require('sinon');

// No conflict tests
require('./no-conflict.js');

var Sugar = require( '../../../release/sugar-full.dev');

// Adding a reference here to the global context
// will save massive amounts of pain later when
// trying to interact with the testing suite, so
// do this for now.
global.Sugar = Sugar;

function logResults(runtime, results) {
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
  process.exit(totalFailures);
}

// Tests

require('../sugar/array.js');
require('../sugar/date.js');
require('../sugar/date_de.js');
require('../sugar/date_es.js');
require('../sugar/date_fr.js');
require('../sugar/date_it.js');
require('../sugar/date_ja.js');
require('../sugar/date_ko.js');
require('../sugar/date_nl.js');
require('../sugar/date_pt.js');
require('../sugar/date_ru.js');
require('../sugar/date_sv.js');
require('../sugar/date_zh_cn.js');
require('../sugar/date_zh_tw.js');
require('../sugar/date_range.js');
require('../sugar/enumerable.js');
require('../sugar/equals.js');
require('../sugar/es5.js');
require('../sugar/es6.js');
require('../sugar/function.js');
require('../sugar/global.js');
require('../sugar/inflections.js');
require('../sugar/language.js');
require('../sugar/number.js');
require('../sugar/number_range.js');
require('../sugar/object.js');
require('../sugar/regexp.js');
require('../sugar/string.js');
require('../sugar/string_range.js');

runTests(logResults);
