// Node test suite

var fs = require('fs');
var path = require('path');

var baseDir = path.resolve(__dirname, '../..');

sinon = require('sinon');
require('../suite/suite');
require('../suite/log');
require('../suite/helpers/core');
require('../suite/helpers/common');
require('../suite/helpers/array');
require('../suite/helpers/date');
require('../suite/helpers/object');

function notice(message, logFn) {
  message = ' ' + message + ' ';
  var cols = Math.max(38, message.length);
  var offset = message.length % 2;
  var half = Math.floor((cols - message.length) / 2);
  var lPad = new Array(half + offset).join(' ');
  var rPad = new Array(half + 1).join(' ');
  var sep = new Array(cols).join('-');
  console.info();
  logFn(sep);
  logFn(lPad + message + rPad);
  logFn(sep);
}

function noticeOneLine(message, logFn) {
  var cols = Math.max(30, message.length + 1);
  var pad = new Array(cols - message.length).join('-');
  console.info();
  console.info();
  logFn('-------- ' + message + ' ' + pad);
  console.info();
}

function load(loadPath) {
  try {
    return require(loadPath);
  } catch (e) {
    var match = loadPath.match(/(sugar(-\w+)?)$/);
    if (e.code === 'MODULE_NOT_FOUND' && match) {
      var message = [
        '',
        ' Package "' + match[1] + '" does not exist!',
        (match[2] ?
        ' Run "gulp build:npm:all" to build all packages.' :
        ' Run "gulp build:npm" to build it.'
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
  fs.readdirSync(path.join(__dirname, '../tests/locales')).forEach(function(file) {
    load(path.relative(__dirname, path.join('./test/tests/locales', file)));
  });
}

function pathIsLocal(p) {
  return p.indexOf(baseDir) === 0 && !/node_modules/.test(p);
}

function pathIsCore(p) {
  return /sugar-core/.test(p);
}

function expireCache() {
  for (var path in require.cache) {
    if(!require.cache.hasOwnProperty(path)) continue;
    if (pathIsLocal(path) || pathIsCore(path)) {
      // console.info('EXPIRING:', path);
      delete require.cache[path]
    }
  };
}

function getTestNameFromModule(mod) {
  var match = mod.filename.match(/(\w+)\/([\w-]+)\.js$/);
  var type = match[1];
  var name = match[2];
  if (name === 'default') {
    name = 'Dist (sugar.js)';
  }
  return name;
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

  run: function(mod, mode, localSugar) {
    var extended = mode === 'extended';

    // Set the global object so that the tests can access.
    // Local sugar is to allow testing of the concatenated
    // build instead of modular npm packages.
    Sugar = localSugar || require('sugar-core');

    var testName = getTestNameFromModule(mod);
    if (extended) {
      storeNativeState();
      Sugar.extend({
        objectPrototype: true
      });
    }
    function finished(runtime, results) {
      logResults(runtime, results, testName);
    }
    runTests(finished, mode || 'default', 'node');

    if (extended) {
      // Tests may be in a watcher, so restore native state
      // after finished to prepare for next run.
      restoreNativeState();
    }
    Sugar = null;
    expireCache();
  },

  resetPolyfills: function(name) {
    load('../suite/helpers/' + name + '-reset.js');
  },

  reset: function() {
    globalFailures = 0;
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
    notice(message, logBlue);
  }

};
