// Test suite

var reload = require('require-reload')(require);

sinon = require('sinon');
require('../suite/suite');
require('../suite/helpers/common');
require('../suite/helpers/core');
require('../suite/helpers/date');

var globalFailures = 0;
var exitOnFail = true;

function logResults(runtime, results, testName) {
  var i, j, failure, totalAssertions = 0, totalFailures = 0;
  for (i = 0; i < results.length; i += 1) {
    totalAssertions += results[i].assertions;
    totalFailures += results[i].failures.length;
    for(j = 0; j < results[i].failures.length; j++) {
      failure = results[i].failures[j];
      console.info();
      logRed('Failure:');
      logRed(failure.message);
      try {
        logRed('Expected: ' + JSON.stringify(failure.expected) + ' but was: ' + JSON.stringify(failure.actual));
      } catch(e) {
        if (e instanceof TypeError) {
          // Sugar.Date has a "toJSON" method which means if it or the Sugar
          // global is stringified it will error. In most cases it's the global.
          logRed('Actual value was likely Sugar global object!');
        } else {
          throw e;
        }
      }
      logRed('File: ' + failure.file + ', Line: ' + failure.line, ' Col: ' + failure.col);
    }
  };
  var time = (runtime / 1000);
  console.info();
  if (totalFailures === 0) {
    logGreen(testName);
    logGreen(totalAssertions + ' assertions, ' + totalFailures + ' failures, ' + time + 's');
  } else {
    logRed(testName);
    logRed(totalAssertions + ' assertions, ' + totalFailures + ' failures, ' + time + 's');
    if (exitOnFail) {
      process.exit(1);
    }
  }
  globalFailures += totalFailures;
}

function getPackageName(name) {
  return name === 'sugar' ? 'sugar' : 'sugar-' + name;
}

function getNpmPath(name) {
  var packageName = getPackageName(name);
  if (packageName === 'sugar') {
    // In the root directory
    return '../../sugar';
  }
  return '../../release/npm/' + packageName + '/' + packageName;
}

function getTestName(type, name) {
  var packageName = getPackageName(name);
  return type === 'extended' ? packageName + ' (extended)' : packageName;
}

function logGreen(message) {
  console.log('\x1b[32m', message || '','\x1b[0m');
}

function logRed(message) {
  console.log('\x1b[31m', message || '','\x1b[0m');
}

function logBlue(message) {
  console.log('\x1b[36m', message || '','\x1b[0m');
}

function logYellow(message) {
  console.log('\x1b[33m', message || '','\x1b[0m');
}

function notice(message, logFn) {
  var cols = 36;
  var pad = new Array(Math.floor((cols - message.length) / 2)).join(' ');
  var sep = new Array(cols).join('-');
  console.info();
  console.info();
  logFn(sep);
  logFn(pad + message + pad);
  logFn(sep);
  console.info();
}

module.exports = {

  loadTest: function(name) {
    reload('../tests/' + name);
  },

  run: function(mod, extended) {
    var match = mod.filename.match(/(\w+)\/([\w-]+)\.js$/);
    var type = match[1];
    var name = match[2];
    Sugar = reload(getNpmPath(name));
    if (extended) {
      Sugar();
    }
    function finished(runtime, results) {
      logResults(runtime, results, getTestName(type, name));
    }
    runTests(finished, !!extended, 'node');
  },

  runExtended: function(mod) {
    this.run(mod, true);
  },

  resetPolyfills: function(name) {
    reload('../suite/helpers/' + name + '-reset.js');
  },

  reset: function() {
    globalFailures = 0;
  },

  exitOnFail: function(set) {
    exitOnFail = set;
  },

  logTotals: function(exit) {
    if (globalFailures) {
      notice('Fail! ' + globalFailures + ' failures', logRed);
      if (exit) {
        process.exit(1);
      }
    } else {
      notice('Success! 0 failures', logBlue);
    }
  },

  notice: function(message) {
    notice(message, logYellow);
  }

};
