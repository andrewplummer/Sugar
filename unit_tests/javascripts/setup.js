if(typeof environment == 'undefined') environment = 'default'; // Override me!

// The scope when none is set.
nullScope = (function(){ return this; }).call();

var results;
var currentTest;
var moduleName;
var moduleSetupMethod;
var moduleTeardownMethod;

var syncTestsRunning = true;

// Capturing the timers here b/c Mootools (and maybe other frameworks) may clear a timeout that
// it kicked off after this script is loaded, which would throw off a simple incrementing mechanism.
var capturedTimers = [];

// This declaration has the effect of pulling setTimeout/clearTimeout off the window's prototype
// object and setting it directly on the window itself. From here it can be globally reset while
// retaining the reference to the native setTimeout method. More about this here:
//
// http://www.adequatelygood.com/2011/4/Replacing-setTimeout-Globally

nullScope.setTimeout = nullScope.setTimeout;
nullScope.clearTimeout = nullScope.clearTimeout;

var nativeSetTimeout = nullScope.setTimeout;
var nativeClearTimeout = nullScope.clearTimeout;

var testStartTime;
var runtime;


// Arrays and objects must be treated separately here because in IE arrays with undefined
// elements will not pass the .hasOwnProperty check. For example [undefined].hasOwnProperty('0')
// will report false.
var arrayEqual = function(one, two) {
  var i, result = true;
  testArrayEach(one, function(a, i) {
    if(!testIsEqual(one[i], two[i])) {
      result = false;
    }
  });
  return result && one.length === two.length;
}

var sortOnStringValue = function(arr) {
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

var testArrayIndexOf = function(arr, obj) {
  for(var i = 0; i < arr.length; i++) {
    if(arr[i] === obj) {
      return i;
    }
  }
  return -1;
}

testCloneObject = function(obj) {
  var result = {}, key;
  for(key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    result[key] = obj[key];
  }
  return result;
}

testArrayEach = function(arr, fn, sparse) {
  var length = arr.length, i = 0;
  while(i < length) {
    if(!(i in arr)) {
      return testIterateOverSparseArray(arr, fn, i);
    } else if(fn.call(arr, arr[i], i, arr) === false) {
      break;
    }
    i++;
  }
}

testIterateOverSparseArray = function(arr, fn, fromIndex) {
  var indexes = [], i;
  for(i in arr) {
    if(testIsArrayIndex(arr, i) && i >= fromIndex) {
      indexes.push(parseInt(i));
    }
  }
  testArrayEach(indexes.sort(), function(index) {
    return fn.call(arr, arr[index], index, arr);
  });
  return arr;
}

testIsArrayIndex = function(arr, i) {
  return i in arr && (i >>> 0) == i && i != 0xffffffff;
}

testIsArray = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

testPadNumber = function(val, place, sign) {
  var num = Math.abs(val);
  var len = Math.abs(num).toString().replace(/\.\d+/, '').length;
  var str =  new Array(Math.max(0, place - len) + 1).join('0') + num;
  if(val < 0 || sign) {
    str = (val < 0 ? '-' : '+') + str;
  }
  return str;
}

testCapitalize = function(str) {
  return str.slice(0,1).toUpperCase() + str.slice(1);
}

var objectEqual = function(one, two) {
  var onep = 0, twop = 0, key;
  for(key in one) {
    if(!one.hasOwnProperty(key)) continue;
    onep++;
    if(!testIsEqual(one[key], two[key])) {
      return false;
    }
  }
  for(key in two) {
    if(!two.hasOwnProperty(key)) continue;
    twop++;
  }
  return onep === twop && one.toString() === two.toString();
}

var testIsEqual = function(one, two) {

  var type, klass;

  type = typeof one;

  if(type === 'string' || type === 'boolean' || one == null) {
    return one === two;
  } else if(type === 'number') {
    return (isNaN(one) && isNaN(two)) || one === two;
  }

  klass = Object.prototype.toString.call(one);

  if(klass === '[object Date]') {
    return one.getTime() === two.getTime();
  } else if(klass === '[object RegExp]') {
    return String(one) === String(two);
  } else if(klass === '[object Array]') {
    return arrayEqual(one, two);
  } else if((klass === '[object Object]' || klass === '[object Arguments]') && ('hasOwnProperty' in one) && type === 'object') {
    return objectEqual(one, two);
  } else if(isNaN(one) && isNaN(two)) {
    return true;
  }

  return one === two;
}

var testIsClass = function(obj, klass) {
  return Object.prototype.toString.call(obj) === '[object ' + klass + ']';
}

var addFailure = function(actual, expected, message, stack, warning) {
  var meta = getMeta(stack);
  currentTest.failures.push({ actual: actual, expected: expected, message: message, file: meta.file, line: meta.line, col: meta.col, warning: !!warning });
}

var getMeta = function(stack) {
  var level = 4;
  if(stack !== undefined) {
    level += stack;
  }
  var e = new Error();
  if(!e.stack) {
    return {};
  }
  var s = e.stack.split(/@|at/m);
  var match = s[level].match(/(.+\.js):(\d+)(?::(\d+))?/);
  if(!match) match = [];
  return { file: match[1], line: match[2], col: match[3] };
}

var checkCanFinish = function() {
  if(!syncTestsRunning && capturedTimers.length == 0) {
    testsFinished();
    restoreNativeTimeout();
  }
}

var testsStarted = function() {
  if(typeof testsStartedCallback != 'undefined') {
    testsStartedCallback(results);
  }
  if(environment == 'node') {
    console.info('\n----------------------- STARTING TESTS ----------------------------\n');
  }
  testStartTime = new Date();
}

var testsFinished = function() {
  runtime = new Date() - testStartTime;
  if(typeof testsFinishedCallback != 'undefined') {
    testsFinishedCallback(results, runtime);
  }
  if(environment == 'node') {
    this.totalFailures = 0
    // displayResults will increment totalFailures by 1 for each failed test encountered
    displayResults();
    // will exit now setting the status to the number of failed tests
    process.exit(this.totalFailures);
  }
  results = [];
}

var displayResults = function() {
  var i, j, failure, totalAssertions = 0, totalFailures = 0;
  for (i = 0; i < results.length; i += 1) {
    totalAssertions += results[i].assertions;
    this.totalFailures += results[i].failures.length;
    for(j = 0; j < results[i].failures.length; j++) {
      failure = results[i].failures[j];
      console.info('\n'+ (j + 1) + ') Failure:');
      console.info(failure.message);
      console.info('Expected: ' + JSON.stringify(failure.expected) + ' but was: ' + JSON.stringify(failure.actual));
      console.info('File: ' + failure.file + ', Line: ' + failure.line, ' Col: ' + failure.col + '\n');
    }
  };
  var time = (runtime / 1000);
  console.info(results.length + ' tests, ' + totalAssertions + ' assertions, ' + this.totalFailures + ' failures, ' + time + 's\n');
}

test = function(name, fn) {
  if(moduleSetupMethod) {
    moduleSetupMethod();
  }
  if(!results) {
    results = [];
    testsStarted();
  }
  currentTest = {
    name: name,
    assertions: 0,
    failures: []
  };
  try {
    fn.call();
  } catch(e) {
    console.info(e);
  }
  results.push(currentTest);
  if(moduleTeardownMethod) {
    moduleTeardownMethod();
  }
}

setTimeout = function(fn, delay) {
  var timer = nativeSetTimeout(function() {
    fn.apply(this, arguments);
    removeCapturedTimer(timer);
    checkCanFinish();
  }, delay);
  capturedTimers.push(timer);
  return timer;
}

clearTimeout = function(timer) {
  removeCapturedTimer(timer);
  return nativeClearTimeout(timer);
}

restoreNativeTimeout = function() {
  setTimeout = nativeSetTimeout;
}

var removeCapturedTimer = function(timer) {
  var index = testArrayIndexOf(capturedTimers, timer);
  if(index !== -1) {
    capturedTimers.splice(index, 1);
  }
};

testModule = function(name, options) {
  moduleName = name;
  moduleSetupMethod = options.setup;
  moduleTeardownMethod = options.teardown;
}

equal = function(actual, expected, message, exceptions, stack) {
  exceptions = exceptions || {};
  if(environment in exceptions) {
    expected = exceptions[environment];
  }
  currentTest.assertions++;
  if(!testIsEqual(actual, expected)) {
    addFailure(actual, expected, message, stack);
  }
}

notEqual = function(actual, expected, message, exceptions) {
  equal(actual !== expected, true, message + ' | strict equality', exceptions, 1);
}

equalWithWarning = function(expected, actual, message) {
  if(expected != actual) {
    addFailure(actual, expected, message, null, true);
  }
}

equalWithMargin = function(actual, expected, margin, message) {
  equal((actual > expected - margin) && (actual < expected + margin), true, message, null, 1);
}

// Array content is equal, but order may differ
arrayEquivalent = function(a, b, message) {
  equal(sortOnStringValue(a), sortOnStringValue(b), message);
}

raisesError = function(fn, message, exceptions) {
  var raised = false;
  try {
    fn.call();
  } catch(e) {
    raised = true;
  }
  equal(raised, true, message, exceptions, 1);
}

skipEnvironments = function(environments, test) {
  if(testArrayIndexOf(environments, environment) === -1) {
    test.call();
  }
}

syncTestsFinished = function() {
  syncTestsRunning = false;
  checkCanFinish();
}

// This method has 2 benefits:
// 1. It gives asynchronous functions their own scope so vars can't be overwritten later by other asynchronous functions
// 2. It runs the tests after the CPU is free decreasing the chance of timing based errors.
async = function(fn) {
  setTimeout(fn, 200);
}

runPerformanceTest = function() {
  var iterations, fn, start, i = 0;
  if(arguments.length == 1) {
    iterations = 10000;
    fn = arguments[0];
  } else {
    iterations = arguments[0];
    fn = arguments[1];
  }
  start = new Date();
  while(i < iterations) {
    fn();
    i++;
  }
  console.info(iterations, ' iterations finished in ', new Date() - start, ' milliseconds');
}

