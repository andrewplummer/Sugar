// Test suite

var reload = require('require-reload')(require);

sinon = require('sinon');
require('../suite/suite');
require('../suite/log');
require('../suite/helpers/common');
require('../suite/helpers/core');
require('../suite/helpers/date');
require('../suite/helpers/object');

var npmPath;
var exitOnFail = true;

function getPackageName(name) {
  return name === 'sugar' ? 'sugar' : 'sugar-' + name;
}
/*

function getNpmPath(name) {
  var packageName = getPackageName(name);
  if (packageName === 'sugar') {
    // In the root directory
    return '../../sugar';
  }
  return '../../release/npm/' + packageName + '/' + packageName;
}
*/

function getTestName(type, name) {
  var packageName = getPackageName(name);
  return type === 'extended' ? packageName + ' (extended)' : packageName;
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

  setSource: function(path) {
    npmPath = path;
  },

  run: function(mod, extended) {
    //var match = mod.filename.match(/(\w+)\/([\w-]+)\.js$/);
    //var type = match[1];
    //var name = match[2];
    Sugar = reload(npmPath);
    if (extended) {
      Sugar();
    }
    function finished(runtime, results) {
      logResults(runtime, results, getTestName(type, name), exitOnFail);
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
