// Test suite

var reload = require('require-reload')(require);

sinon = require('sinon');
require('../suite/suite');
require('../suite/log');
require('../suite/helpers/common');
require('../suite/helpers/core');
require('../suite/helpers/date');
require('../suite/helpers/object');

// Move this to sugar-core when its ready
var Sugar = require('../../lib/core');
testSetGlobal(Sugar);

var exitOnFail = true;

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

function getTestNameFromModule(mod) {
  var match = mod.filename.match(/(\w+)\/([\w-]+)\.js$/);
  var type = match[1];
  var name = match[2];
  if (name === 'regexp') {
    name = 'RegExp';
  } else {
    name = name.slice(0, 1).toUpperCase() + name.slice(1);
  }
  return type === 'extended' ? name + ' - Extended' : name;
}

module.exports = {

  loadTest: function(name) {
    reload('../tests/' + name);
  },

  loadPackage: function(path) {
    reload(path);
  },

  run: function(mod, extended) {
    var testName = getTestNameFromModule(mod);
    if (extended) {
      Sugar();
    }
    function finished(runtime, results) {
      logResults(runtime, results, testName, exitOnFail);
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
