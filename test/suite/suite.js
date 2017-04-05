(function() {

  var allTests = [];
  var namespaces = [];
  var currentTest;
  var currentArgs;
  var currentMode;
  var currentMethod;
  var currentNamespace;

  // The global context
  var globalContext = typeof global !== 'undefined' ? global : this;

  // Has ability to use Object.defineProperty
  testDefinePropertySupport = !!(Object.defineProperty && Object.defineProperties);

  testInternalToString = Object.prototype.toString;

  // Global methods.
  // BE CAREFUL HERE! If you declare these using window.xxx or
  // some form thereof they will not trigger errors in IE7!

  runTests = function(fn, mode, env) {
    var time = new Date;
    var tests = getTestsToRun();
    currentMode = mode;
    environment = env;
    for (var i = 0; i < tests.length; i++) {
      currentTest = tests[i];
      if (typeof currentTest.fn != 'function') {
        throw new Error('Test ' + currentTest.name + ' has no tests.');
        continue;
      }
      if (currentTest.namespace.setup) {
        currentTest.namespace.setup();
      }
      currentTest.fn();
      if (currentTest.namespace.teardown) {
        currentTest.namespace.teardown();
      }
      currentTest = null;
    }
    var runAll = arrayFilter(namespaces, function(p) {
      return p.assertions > 0 || p.failures.length;
    });
    fn(new Date() - time, runAll);
    allTests = [];
    namespaces = [];
  }

  namespace = function (name, fn, focused) {
    var split;
    split = name.split(' | ');
    currentNamespace = {
      name: split[0],
      subname: split[1],
      focused: !!focused,
      assertions: 0,
      skipped: [],
      failures: []
    };
    namespaces.push(currentNamespace);
    // Queue the tests...
    fn.call();
    currentNamespace = null;
  }

  fnamespace = function(name, fn) {
    namespace(name, fn, true);
  }

  // Noop
  xnamespace = function() {};

  equal = function (actual, expected, message, stack) {
    currentTest.namespace.assertions++;
    if (!isEqual(actual, expected)) {
      addFailure(actual, expected, getFullMessage(message), stack);
    }
  }

  equalWithMargin = function (actual, expected, margin, message) {
    equal((actual >= expected - margin) && (actual <= expected + margin), true, message, null, 1);
  }

  // Array content is equal, but order may differ
  assertArrayEquivalent = function (a, b, message) {
    equal(sortOnStringValue(a), sortOnStringValue(b), message);
  }

  assertRangeEqual = function(a, b, message) {
    equal(isEqual(a.start, b.start) && isEqual(a.end, b.end), true, message);
  }

  notEqual = function (actual, expected, message) {
    equal(actual !== expected, true, message + ' | strict equality', 1);
  }

  raisesError = function (fn, message, errorType) {
    var err;
    try {
      fn.call();
    } catch(e) {
      err = e;
    }
    if (errorType) {
      equal(err instanceof errorType, true, message, 1);
    } else {
      if (err && err.message.match(/cannot read property/i)) {
        console.warn('Possible missing method. Error:\n', err.stack);
      }
      equal(!!err, true, message, 1);
    }
  }

  method = function (name, fn, focused, ignored) {
    allTests.push({
      fn: fn,
      name: name,
      focused: !!focused,
      ignored: !!ignored,
      namespace: currentNamespace
    });
  }

  fmethod = function(name, fn) {
    method(name, fn, true);
  }

  xmethod = function(name, fn) {
    method(name, fn, false, true);
  }

  // Alias
  group = method;
  fgroup = fmethod;
  xgroup = xmethod;

  setup = function(fn) {
    currentNamespace.setup = fn;
  }

  teardown = function(fn) {
    currentNamespace.teardown = fn;
  }

  withArgs = function(args) {
    var name, fn;
    if (arguments.length === 2) {
      fn   = arguments[1];
    } else if (arguments.length === 3) {
      name = arguments[1];
      fn   = arguments[2];
    }
    currentTest.message = name || args.join(', ');
    currentArgs = args;
    fn();
    currentTest.message = null;
    currentArgs = null;
  }

  withMethod = function(name, fn) {
    var namespace = currentTest.namespace.name;
    if (!Sugar[namespace][name]) {
      var key = [namespace, currentTest.name, name].join(' | ')
      currentTest.namespace.skipped.push(key);
      return;
    }
    currentMethod = name;
    fn();
    currentMethod = null;
  }

  isDefaultMode = function() {
    return currentMode === 'default';
  }

  isChainedMode = function() {
    return currentMode === 'chained';
  }

  isExtendedMode = function() {
    return currentMode === 'extended';
  }

  test = function (subject) {
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

  run = function (subject, methodName, args) {
    var namespace, nativeMethod, isInstance;

    namespace = currentTest.namespace.name;
    isInstance = !objectIsClass(subject);
    methodName = methodName || currentMethod || currentTest.name;
    args = args || currentArgs || [];

    if (currentMode === 'extended') {
      if (isInstance) {
        nativeMethod = globalContext[namespace].prototype[methodName];
      } else {
        nativeMethod = globalContext[namespace][methodName];
      }
      if (!nativeMethod) {
        throw new Error('missing method ' + methodName);
      }
      return nativeMethod.apply(subject, args);
    } else if (currentMode === 'chained' && isInstance) {
      subject = new Sugar[namespace](subject);
      return subject[methodName].apply(subject, args).raw;
    } else {
      if (isInstance) {
        args = [subject].concat(args);
      }
      if (!Sugar[namespace][methodName]) {
        throw new Error('missing method ' + methodName);
      }
      return Sugar[namespace][methodName].apply(null, args);
    }
  }

  getCurrentTest = function() {
    return currentTest;
  }

  function getTestsToRun() {
    var focusedNamespacesExist = false;

    function namespaceIsActive(namespace) {
      if (!focusedNamespacesExist) {
        return true;
      }
      return namespace.focused;
    }

    for (var i = 0; i < namespaces.length; i++) {
      if (namespaces[i].focused) {
        focusedNamespacesExist = true;
        break;
      }
    }

    var focused = arrayFilter(allTests, function(t) {
      return t.focused && namespaceIsActive(t.namespace);
    });

    if (focused.length) {
      return focused;
    }

    return arrayFilter(allTests, function(t) {
      return !t.ignored && namespaceIsActive(t.namespace);
    });
  }

  function objectIsClass(obj) {
    switch(obj) {
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

  function getGlobalName(global) {
    if (global && global.name) {
      return global.name;
    }
    // < IE9 environments do not have .name
    switch (global) {
      case Boolean:  return 'Boolean';
      case Number:   return 'Number';
      case String:   return 'String';
      case Array:    return 'Array';
      case Object:   return 'Object';
      case Date:     return 'Date';
      case RegExp:   return 'RegExp';
      case Function: return 'Function';
    }
  }

  function getFullMessage(tail) {
    var msg = '';
    var title = currentTest.name;
    if (title) {
      msg += title + ' | ';
    }
    if (currentTest.message) {
      msg += currentTest.message + ' | ';
    }
    msg += tail;
    return msg;
  }

  function addFailure(actual, expected, message, stack, warning) {
    var meta = getMeta(stack);
    currentTest.namespace.failures.push({
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
    if (stack !== undefined) {
      level += stack;
    }
    var e = new Error();
    if (!e.stack) {
      return {};
    }
    var s = e.stack.split(/@|^\s+at/m);
    var match = s[level].match(/(.+\.js):(\d+)(?::(\d+))?/);
    if (!match) match = [];
    return { file: match[1], line: match[2], col: match[3] };
  }

  // Equality test methods.

  function isEqual(one, two, stack) {
    var type, klass;

    type = typeof one;

    if (type === 'string' || type === 'boolean' || one == null) {
      return one === two;
    } else if (type === 'number') {
      return typeof two === 'number' && numberIsEqual(one, two);
    }

    klass = testInternalToString.call(one);

    if (klass === '[object Date]' && two.getTime) {
      return dateIsEqual(one, two);
    } else if (klass === '[object RegExp]') {
      return String(one) === String(two);
    } else if (klass === '[object Array]' || klass === '[object Arguments]') {
      return arrayIsEqual(one, two) && klass === testInternalToString.call(two);
    } else if (klass === '[object Object]' && ('hasOwnProperty' in one) && type === 'object') {
      return objectIsEqual(one, two, stack) && klass === testInternalToString.call(two);
    } else if (klass === '[object Number]' && isNaN(one) && isNaN(two)) {
      return true;
    } else if (klass === '[object String]' || klass === '[object Number]') {
      return one.valueOf() === two.valueOf();
    }

    return one === two;
  }

  function numberIsEqual(one, two) {
    return (isNaN(one) && isNaN(two)) || (one === two && 1 / one === 1 / two);
  }

  // Arrays and objects must be treated separately here because in IE arrays with undefined
  // elements will not pass the .hasOwnProperty check. For example [undefined].hasOwnProperty('0')
  // will report false.
  function arrayIsEqual(one, two) {
    var i, result = true, key;
    if (one === two) {
      return true;
    } else if (!two || one.length !== two.length) {
      return false;
    }

    if (!one || !two || typeof one !== 'object' || typeof two !== 'object') {
      return false;
    }
    arrayEach(one, function(a, i) {
      if (!isEqual(one[i], two[i])) {
        result = false;
      }
    });
    if (!result) {
      return false;
    }
    var onep = 0, twop = 0;
    for(key in one) {
      if (!one.hasOwnProperty(key)) continue;
      onep++;
      if (!isEqual(one[key], two[key])) {
        return false;
      }
    }
    for(key in two) {
      if (!two.hasOwnProperty(key)) continue;
      twop++;
    }
    return result && onep === twop;
  }

  function objectIsEqual(one, two, stack) {
    var onep = 0, twop = 0, key;

    stack = stack || [];

    if (one && two) {
      isEqual:
      for(key in one) {
        if (!one.hasOwnProperty(key)) continue;
        onep++;

        // Cyclic structure check
        if (stack.length > 1) {
          var i = stack.length;
          while (i--) {
            if (stack[i] === one[key]) {
              if (one[key] !== two[key]) {
                return false;
              } else {
                continue isEqual;
              }
            }
          }
        }

        stack.push(one[key]);

        if (!isEqual(one[key], two[key], stack)) {
          return false;
        }
      }
      for(key in two) {
        if (!two.hasOwnProperty(key)) continue;
        twop++;
      }
    }
    if (Object.getOwnPropertySymbols) {
      var symOne = Object.getOwnPropertySymbols(one);
      var symTwo = Object.getOwnPropertySymbols(two);
      if (!arrayIsEqual(symOne, symTwo)) {
        return false;
      }
    }
    return onep === twop && String(one) === String(two);
  }

  function dateIsEqual(a, b) {
    var aTime = a.getTime(), bTime = b.getTime(), margin = 80;

    if (aTime !== aTime && bTime !== bTime) {
      return true;
    }
    return Math.abs(aTime - bTime) < margin;
  }

  function sortOnStringValue(arr) {
    return arr.sort(function(a, b) {
      var aStr = getStringValueForObject(a);
      var bStr = getStringValueForObject(b);
      if (aStr === bStr) return 0;
      return aStr < bStr ? -1 : 1;
    });
  }

  function getStringValueForObject(obj) {
    var type = typeof obj, str;
    if (type === 'object') {
      str = 'obj:';
      for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        str += key + getStringValueForObject(obj[key]);
      }
      return str;
    } else {
      return 'pri:' + type + String(obj);
    }
  }

  // Iteration methods

  // Tests may include sparse arrays, so need a way to iterate
  // over them safely here.
  function arrayEach(arr, fn, sparse) {
    var length = arr.length, i = 0;
    while(i < length) {
      if (!(i in arr)) {
        return iterateOverArray(arr, fn, i);
      } else if (fn.call(arr, arr[i], i, arr) === false) {
        break;
      }
      i++;
    }
  }

  function iterateOverArray(arr, fn, fromIndex) {
    var indexes = [], i;
    for(i in arr) {
      if (isArrayIndex(arr, i) && i >= fromIndex) {
        indexes.push(parseInt(i));
      }
    }
    arrayEach(indexes.sort(), function(index) {
      return fn.call(arr, arr[index], index, arr);
    });
    return arr;
  }

  function arrayFilter(arr, fn) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      if (fn(arr[i], i)) {
        result.push(arr[i]);
      }
    }
    return result;
  }

  function isArrayIndex(arr, i) {
    return i in arr && (i >>> 0) == i && i != 0xffffffff;
  }

  if (typeof console === 'undefined') {

    if (typeof $ !== 'undefined') {
      var consoleFn = function() {
        var messages = Array.prototype.slice.call(arguments);
        messages = messages.map(function(arg) {
          return String(arg);
        })
        $('<p/>').css({
          fontFamily: 'monospace',
          fontSize: '12px'
        }).text(messages.join(',')).appendTo(document.body);
      }
      console = {
        log: consoleFn,
        info: consoleFn
      }
    } else if (typeof print !== 'undefined') {
      console = {
        log: print,
        info: print
      }
    }
  }

})();
