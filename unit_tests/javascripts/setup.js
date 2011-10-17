
// The scope when none is set.
nullScope = (function(){ return this; }).call();

var results;
var currentTest;

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


var isInstanceOf = function(obj, str) {
  return Object.prototype.toString.call(obj).toLowerCase() === '[object '+str+']';
};

// Arrays and objects must be treated separately here because in IE arrays with undefined
// elements will not pass the .hasOwnProperty check. For example [undefined].hasOwnProperty('0')
// will report false.
var deepEqual = function(one, two) {
  if(one.length && two.length) {
    return arrayEqual(one, two);
  } else {
    return objectEqual(one, two);
  }
}

var arrayEqual = function(one, two) {
  var i;
  for(i = 0; i < one.length; i++) {
    if(!isEqual(one[i], two[i])) {
      return false;
    }
  }
  return one.length === two.length;
}

var objectEqual = function(one, two) {
  var onep = 0, twop = 0, key;
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
  return onep === twop;
}

var isEqual = function(one, two) {
  if(one === nullScope && two === nullScope) {
    // Null scope should always be a strict equal check
    return true;
  } else if(typeof two == 'number' && typeof one == 'number' && isNaN(two) && isNaN(one)) {
    // NaN is NaN: equal
    return true;
  } else if(typeof two == 'object' && typeof one == 'object' && two != null && one != null && deepEqual(two, one)) {
    // Deeply equal
    return true;
  } else if(two === null && one === null) {
    // null is null: equal
    return true;
  } else if(two === undefined && one === undefined) {
    // undefined is undefined: equal
    return true;
  } else if(isInstanceOf(one, typeof two) && two == one) {
    // Strictly equal
    return true;
  } else {
    return false;
  }
}

var addFailure = function(actual, expected, message, stack, warning) {
  var meta = getMeta(stack);
  currentTest.failures.push({ actual: actual, expected: expected, message: message, file: meta.file, line: meta.line, warning: !!warning });
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
  var s = e.stack.split('\n');
  var match = s[level].match(/\/(.+?):(\d+)(?:(\d+))?/);
  return { file: match[1], line: match[2] };
}

var checkCanFinish = function() {
  if(!syncTestsRunning && capturedTimers.length == 0) {
    testsFinished();
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
    displayResults();
  }
  results = [];
}

var displayResults = function() {
  var i, j, failure, totalAssertions = 0, totalFailures = 0;
  for (i = 0; i < results.length; i += 1) {
    totalAssertions += results[i].assertions;
    totalFailures += results[i].failures.length;
    for(j = 0; j < results[i].failures.length; j++) {
      failure = results[i].failures[j];
      console.info('\n'+ (j + 1) + ') Failure:');
      console.info(failure.message);
      console.info('Expected: ' + JSON.stringify(failure.expected) + ' but was: ' + JSON.stringify(failure.actual));
      console.info('File: ' + failure.file + ', Line: ' + failure.line + '\n');
    }
  };
  var time = (runtime / 1000);
  console.info(results.length + ' tests, ' + totalAssertions + ' assertions, ' + totalFailures + ' failures, ' + time + 's\n');
}

test = function(name, fn) {
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

var removeCapturedTimer = function(timer) {
  var index = capturedTimers.indexOf(timer);
  if(index !== -1) {
    capturedTimers.splice(index, 1);
  }
};

equal = function(actual, expected, message, exceptions, stack) {
  exceptions = exceptions || {};
  if(environment in exceptions) {
    expected = exceptions[environment];
  }
  currentTest.assertions++;
  if(!isEqual(actual, expected)) {
    addFailure(actual, expected, message, stack);
  }
}

strictlyEqual = function(actual, expected, message, exceptions) {
  equal(actual === expected, true, message + ' | strict equality', exceptions, 1);
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
  if(environments.indexOf(environment) === -1) {
    test.call();
  }
}

syncTestsFinished = function() {
  syncTestsRunning = false;
  checkCanFinish();
}

