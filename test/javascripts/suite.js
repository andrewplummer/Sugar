if(typeof environment == 'undefined') environment = 'default'; // Override me!

(function() {

  var results;

  var currentPackage;
  var currentMethod;
  var currentGroup;
  var currentArgs;

  var syncTestsRunning;
  var asyncTestsRunning;

  var startTime;
  var runtime;

  // The global context
  var globalContext = typeof global !== 'undefined' ? global : this;


  function package(name, fn) {
    // Set up results if there are none.
    if(!results) {
      results = [];
      syncTestsRunning = true;
      asyncTestsRunning = 0;
      testsStarted();
    }
    var split = name.split(' | ');
    currentPackage = {
      name: split[0],
      subname: split[1],
      assertions: 0,
      failures: []
    };
    // Run the tests...
    try {
      fn.call();
    } catch(e) {
      console.info(e.stack);
    }
    results.push(currentPackage);
    currentPackage = null;
  }

  function async(fn) {
    asyncTestsRunning++;
    setTimeout(wrapTestingScope(function() {
      fn(wrapTestingScope, asyncFinish);
    }), 1);
  }

  function asyncFinish() {
    asyncTestsRunning--;
    checkCanFinish();
  }

  function checkCanFinish() {
    if(!syncTestsRunning && asyncTestsRunning === 0) {
      testsFinished();
    }
  }

  function syncTestsFinished() {
    syncTestsRunning = false;
    checkCanFinish();
  }

  function wrapTestingScope(fn) {
    var cachedPackage = currentPackage;
    var cachedMethod = currentMethod;
    var cachedArgs = currentArgs;
    return function () {
      currentPackage = cachedPackage;
      currentMethod = cachedMethod;
      currentArgs = cachedArgs;
      fn.apply(this, arguments);
    }
  }

  function method(name) {
    var fn = arguments[arguments.length - 1];
    if(arguments.length === 3) {
      currentArgs = arguments[1];
    } else {
      currentArgs = [];
    }
    currentMethod = name;
    fn(async);
    currentMethod = null;
    currentArgs   = [];
  }

  function group(name, fn) {
    currentGroup = name;
    fn();
    currentGroup = null;
  }

  function test(subject) {
    var args, expected, message;
    switch(arguments.length) {
      case 2:
        expected = arguments[1];
        message  = subject;
        break;
      case 3:
        expected = arguments[1];
        message  = arguments[2];
        break;
      case 4:
        args     = arguments[1];
        expected = arguments[2];
        message  = arguments[3];
        break;
    }
    equal(run(subject, null, args), expected, message);
  }

  function run(subject, method, args) {
    method = method || currentMethod;
    args = args || currentArgs;
    if(Sugar.noConflict) {
      if(!subjectIsClass(subject)) {
        args = [subject].concat(Array.prototype.slice.call(args));
      }
      return Sugar[currentPackage.name][method].apply(null, args);
    } else {
      // Sometimes testing on other objects via .call, so access through the global context.
      var globalObject = globalContext[currentPackage.name];
      // Use the global object for reason above, but test if method exists on prototype.
      var target = subject.prototype[method] ? globalObject.prototype : globalObject;
      return target[method].apply(subject, args);
    }
  }

  function getProperty(subject, prop) {
    if(Sugar.noConflict) {
      return Sugar[currentPackage.name][prop];
    } else {
      return subject[prop];
    }
  }


  function subjectIsClass(subject) {
    switch(subject) {
      case Boolean:
      case Number:
      case String:
      case Array:
      case Object:
      case Date:
      case RegExp:
      case Function:
        return true;
    }
    return false;
  }

  function raisesError(fn, message, errorType) {
    var err;
    try {
      fn.call();
    } catch(e) {
      err = e;
    }
    if(!errorType) {
      equal(!!err, true, getFullMessage(message), 1);
    } else {
      equal(err instanceof errorType, true, getFullMessage(message), 1);
    }
  }

  function getFullMessage(tail) {
    var msg = '';
    var title = currentMethod || currentGroup;
    if(title) {
      msg += title;
      if(currentArgs && currentArgs.length > 0) {
        msg += '('+ currentArgs.join(',') +')';
      }
      msg += ' | ';
    }
    msg += tail;
    return msg;
  }


  // Runner methods

  function equal(actual, expected, message, stack) {
    currentPackage.assertions++;
    if(!isEqual(actual, expected)) {
      addFailure(actual, expected, getFullMessage(message), stack);
    }
  }

  function notEqual(actual, expected, message) {
    equal(actual !== expected, true, message + ' | strict equality', 1);
  }

  function testsStarted() {
    if(environment == 'node') {
      console.info('\n----------------------- STARTING TESTS ----------------------------\n');
    }
    startTime = new Date();
  }

  function testsFinished() {
    runtime = new Date() - startTime;
    if(environment == 'node') {
      // will exit now setting the status to the number of failed tests
      process.exit(logResults());
    } else if(this.testsFinishedCallback) {
      this.testsFinishedCallback(results, runtime);
    }
    results = [];
  }

  function logResults() {
    var i, j, failure, totalAssertions = 0, totalFailures = 0;
    for (i = 0; i < results.length; i += 1) {
      totalAssertions += results[i].assertions;
      totalFailures += results[i].failures.length;
      for(j = 0; j < results[i].failures.length; j++) {
        failure = results[i].failures[j];
        console.info('\n'+ (j + 1) + ') Failure:');
        console.info(failure.message);
        console.info('Expected: ' + JSON.stringify(failure.expected) + ' but was: ' + JSON.stringify(failure.actual));
        console.info('File: ' + failure.file + ', Line: ' + failure.line, ' Col: ' + failure.col + '\n');
      }
    };
    var time = (runtime / 1000);
    console.info(results.length + ' tests, ' + totalAssertions + ' assertions, ' + totalFailures + ' failures, ' + time + 's\n');
    return totalFailures;
  }

  function addFailure(actual, expected, message, stack, warning) {
    var meta = getMeta(stack);
    currentPackage.failures.push({
      actual: actual,
      expected: expected,
      message: message,
      file: meta.file,
      line: meta.line,
      col: meta.col,
      warning: !!warning
    });
  }

  function getMeta(stack) {
    var level = 4;
    if(stack !== undefined) {
      level += stack;
    }
    var e = new Error();
    if(!e.stack) {
      return {};
    }
    var s = e.stack.split(/@|^\s+at/m);
    var match = s[level].match(/(.+\.js):(\d+)(?::(\d+))?/);
    if(!match) match = [];
    return { file: match[1], line: match[2], col: match[3] };
  }

  // Equality test methods.

  function isEqual(one, two) {
    var type, klass;

    type = typeof one;

    if(type === 'string' || type === 'boolean' || one == null) {
      return one === two;
    } else if(type === 'number') {
      return typeof two === 'number' && ((isNaN(one) && isNaN(two)) || one === two);
    }

    klass = Object.prototype.toString.call(one);

    if(klass === '[object Date]') {
      return one.getTime() === two.getTime();
    } else if(klass === '[object RegExp]') {
      return String(one) === String(two);
    } else if(klass === '[object Array]') {
      return arrayIsEqual(one, two);
    } else if((klass === '[object Object]' || klass === '[object Arguments]') && ('hasOwnProperty' in one) && type === 'object') {
      return objectIsEqual(one, two);
    } else if(klass === '[object Number]' && isNaN(one) && isNaN(two)) {
      return true;
    }

    return one === two;
  }

  // Arrays and objects must be treated separately here because in IE arrays with undefined
  // elements will not pass the .hasOwnProperty check. For example [undefined].hasOwnProperty('0')
  // will report false.
  function arrayIsEqual(one, two) {
    var i, result = true;
    if(!one || !two) {
      return false;
    }
    arrayEach(one, function(a, i) {
      if(!isEqual(one[i], two[i])) {
        result = false;
      }
    });
    return result && one.length === two.length;
  }

  function objectIsEqual(one, two) {
    var onep = 0, twop = 0, key;
    if(one && two) {
      for(key in one) {
        if(!one.hasOwnProperty(key)) continue;
        onep++;
        if(!isEqual(one[key], two[key])) {
          return false;
        }
      }
      for(key in two) {
        if(!two.hasOwnProperty(key)) continue;
        twop++;
      }
    }
    return onep === twop && String(one) === String(two);
  }

  function equalWithMargin(actual, expected, margin, message) {
    equal((actual > expected - margin) && (actual < expected + margin), true, message, null, 1);
  }

  // Sets are equal, but order may differ
  function setIsEqual(a, b, message) {
    equal(sortOnStringValue(a), sortOnStringValue(b), message);
  }

  function sortOnStringValue(arr) {
    return arr.sort(function(a, b) {
      var aType = typeof a;
      var bType = typeof b;
      var aVal = String(a);
      var bVal = String(b);
      if(aType != bType) {
        return aType < bType;
      }
      if(aVal === bVal) return 0;
      return a < b ? -1 : 1;
    });
  }


  // Iteration methods

  // Tests may include sparse arrays, so need a way to iterate
  // over them safely here.
  function arrayEach(arr, fn, sparse) {
    var length = arr.length, i = 0;
    while(i < length) {
      if(!(i in arr)) {
        return iterateOverArray(arr, fn, i);
      } else if(fn.call(arr, arr[i], i, arr) === false) {
        break;
      }
      i++;
    }
  }

  function iterateOverArray(arr, fn, fromIndex) {
    var indexes = [], i;
    for(i in arr) {
      if(isArrayIndex(arr, i) && i >= fromIndex) {
        indexes.push(parseInt(i));
      }
    }
    arrayEach(indexes.sort(), function(index) {
      return fn.call(arr, arr[index], index, arr);
    });
    return arr;
  }

  function isArrayIndex(arr, i) {
    return i in arr && (i >>> 0) == i && i != 0xffffffff;
  }

  if(typeof console === 'undefined') {
    var consoleFn = function() {
      var messages = Array.prototype.slice.call(arguments);
      messages = messages.map(function(arg) {
        return String(arg);
      })
      $('<p/>').text(messages.join(',')).appendTo(document.body);
    }
    console = {
      log: consoleFn,
      info: consoleFn
    }
  }

  this.syncTestsFinished = syncTestsFinished;
  this.equalWithMargin = equalWithMargin;
  this.raisesError = raisesError;
  this.getProperty = getProperty;
  this.setIsEqual = setIsEqual;
  this.notEqual = notEqual;
  this.package = package;
  this.method = method;
  this.group = group;
  this.equal = equal;
  this.test = test;
  this.run = run;


})();
