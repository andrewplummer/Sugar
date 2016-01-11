// Node test suite

sinon = require('sinon');
require('../suite/suite');
require('../suite/log');
require('../suite/helpers/common');
require('../suite/helpers/core');
require('../suite/helpers/date');
require('../suite/helpers/array');
require('../suite/helpers/object');

// TODO: Move this to sugar-core when its ready
var Sugar = require('../../lib/core');
testSetGlobal(Sugar);

var exitOnFail = true;

function notice(message, logFn) {
  var cols = Math.max(36, message.length + 1);
  var pad = new Array(Math.floor((cols - message.length) / 2)).join(' ');
  var sep = new Array(cols).join('-');
  console.info();
  console.info();
  logFn(sep);
  logFn(pad + message + pad);
  logFn(sep);
  console.info();
}

function load(path) {
  if (path.match(/es[567]$/)) {
    // Need to manually expire this as it's being
    // linked to from inside the polyfill package.
    resetPolyfillCache();
  }
  if (path.match(/foobar/)) {
    fs.lstatSync(COMPIER_JAR_PATH);
  }
  try {
    return require(path);
  } catch (e) {
    var match = path.match(/(sugar(-\w+)?)$/);
    if (match) {
      var message = [
        '',
        '     Package "' + match[1] + '" does not exist!',
        (match[2] ?
        '     Run "gulp build:npm:all" to build all packages.' :
        '     Run "gulp build:npm" to build it.'
        ),
        '',
      ].join('\n');
      logYellow(message);
      process.exit();
    } else {
      throw e;
    }
  }
}

function loadLocaleTests() {
  var path = require('path'), fs = require('fs');
  fs.readdirSync(path.join(__dirname, '../tests/locales')).forEach(function(file) {
    load(path.relative(__dirname, path.join('./test/tests/locales', file)));
  });
}

function resetPolyfillCache() {
  for (var path in require.cache) {
    if(!require.cache.hasOwnProperty(path)) continue;
    var path = require.resolve(path);
    if (path.match(/polyfills\/\w+\/\w+\.js$/)) {
      delete require.cache[path]
    }
  };
}

function getTestNameFromModule(mod) {
  var match = mod.filename.match(/(\w+)\/([\w-]+)\.js$/);
  var type = match[1];
  var name = match[2];
  if (name === 'regexp') {
    name = 'RegExp';
  } else if (name.match(/^es\d/)) {
    name = name.toUpperCase();
  } else {
    name = name.slice(0, 1).toUpperCase() + name.slice(1);
  }
  return type === 'extended' ? name + ' - Extended' : name;
}

module.exports = {

  load: function(path) {
    return load(path);
  },

  loadTest: function(name) {
    return load('../tests/' + name);
  },

  loadLocaleTests: function() {
    loadLocaleTests();
  },

  run: function(mod, extended) {

    var testName = getTestNameFromModule(mod);
    if (extended) {
      storeNativeState();
      Sugar.extendAll();
    }
    function finished(runtime, results) {
      logResults(runtime, results, testName, exitOnFail);
    }
    runTests(finished, !!extended, 'node');

    if (extended) {
      // Tests may be in a watcher, so restore native state
      // after finished to prepare for next run.
      restoreNativeState();
    }
  },

  runExtended: function(mod) {
    this.run(mod, true);
  },

  resetPolyfills: function(name) {
    load('../suite/helpers/' + name + '-reset.js');
  },

  reset: function() {
    globalFailures = 0;
  },

  exitOnFail: function(set) {
    exitOnFail = set;
  },

  logTotals: function() {
    if (globalFailures) {
      notice('Fail! ' + globalFailures + ' failures', logRed);
    } else {
      notice('Success! 0 failures', logBlue);
    }
    globalFailures = 0;
  },

  notice: function(message) {
    notice(message, logYellow);
  }

};
