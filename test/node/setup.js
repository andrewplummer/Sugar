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
    var match = e.message.match(/Cannot find module (.+)/);
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

function pathIsLocal(p) {
  return !/node_modules/.test(p);
}

function pathIsCore(p) {
  return /sugar-core/.test(p);
}

function expireCache() {
  var keys = Object.keys(require.cache);
  keys.forEach(function(path) {
    if (pathIsLocal(path) || pathIsCore(path)) {
      delete require.cache[path]
    }
  });
}

function getTestNameFromModule(mod) {
  var match = mod.filename.match(/(\w+)\/([\w-]+)\.js$/);
  var type = match[1];
  var name = match[2];
  if (name === 'dist') {
    name = 'Distributed (sugar.js)';
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

  loadAll: function(subdir) {
    var files = fs.readdirSync(path.join(__dirname, subdir));
    files.forEach(function(filename) {
      load(path.join(__dirname, subdir, filename));
    });
  },

  loadLocaleTests: function() {
    var files = fs.readdirSync(path.join(__dirname, '../tests/locales/'));
    files.forEach(function(filename) {
      if (path.extname(filename) !== '.js') {
        return;
      }
      load(path.join(__dirname, '../tests/locales', filename));
    });
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

  logTotals: function(exitOnError) {
    if (globalFailures) {
      notice('Fail! ' + globalFailures + ' failures', logRed);
    } else {
      notice('Success! 0 failures', logBlue);
    }
    if (exitOnError && globalFailures) {
      process.exit(1);
    }
    globalFailures = 0;
  },

  notice: function(message) {
    notice(message, logBlue);
  }

};
