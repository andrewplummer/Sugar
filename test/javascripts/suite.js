if(typeof environment == 'undefined') environment = 'default'; // Override me!

(function() {

  var allTests = [];
  var packages = [];
  var currentTest;
  var currentArgs;
  var currentPackage;

  // The global context
  var globalContext = typeof global !== 'undefined' ? global : this;


  // Global methods.
  // BE CAREFUL HERE! If you declare these using window.xxx or
  // some form thereof they will not trigger errors in IE7!

  runTests = function(fn) {
    var time = new Date;
    var tests = getTestsToRun();
    for (var i = 0; i < tests.length; i++) {
      currentTest = tests[i];
      if (typeof currentTest.fn != 'function') {
        throw new Error('Test ' + currentTest.name + ' has no tests.');
        continue;
      }
      if (currentTest.package.setup) {
        currentTest.package.setup();
      }
      currentTest.fn();
      if (currentTest.package.teardown) {
        currentTest.package.teardown();
      }
      currentTest = null;
    }
    var runPackages = packages.filter(function(p) {
      return p.assertions > 0;
    });
    fn(new Date() - time, runPackages);
  }

  package = function (name, fn, focused) {
    var split;
    split = name.split(' | ');
    currentPackage = {
      name: split[0],
      subname: split[1],
      focused: !!focused,
      assertions: 0,
      failures: []
    };
    packages.push(currentPackage);
    // Queue the tests...
    fn.call();
    currentPackage = null;
  }

  fpackage = function(name, fn) {
    package(name, fn, true);
  }

  // Noop
  xpackage = function() {};

  equal = function (actual, expected, message, stack) {
    currentTest.package.assertions++;
    if(!isEqual(actual, expected)) {
      addFailure(actual, expected, getFullMessage(message), stack);
    }
  }

  equalWithMargin = function (actual, expected, margin, message) {
    equal((actual > expected - margin) && (actual < expected + margin), true, message, null, 1);
  }

  // Sets are equal, but order may differ
  setIsEqual = function (a, b, message) {
    equal(sortOnStringValue(a), sortOnStringValue(b), message);
  }

  notEqual = function (actual, expected, message) {
    equal(actual !== expected, true, message + ' | strict equality', 1);
  }

  raisesError = function (fn, message, errorType) {
    var err, message = getFullMessage(message) + ' should raise an error';
    try {
      fn.call();
    } catch(e) {
      err = e;
    }
    if(errorType) {
      equal(err instanceof errorType, true, message, 1);
    } else {
      if (err.message.match(/cannot read property/i)) {
        console.warn('Possible missing method. Error:\n', err.stack);
      }
      equal(!!err, true, message, 1);
    }
  }

  getProperty = function (subject, prop) {
    if(Sugar.noConflict) {
      return Sugar[currentTest.package.name][prop];
    } else {
      return subject[prop];
    }
  }

  method = function (name, fn, focused, ignored) {
    allTests.push({
      fn: fn,
      name: name,
      focused: !!focused,
      ignored: !!ignored,
      package: currentPackage
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
    currentPackage.setup = fn;
  }

  teardown = function(fn) {
    currentPackage.teardown = fn;
  }

  withArgs = function(args, fn) {
    currentArgs = args;
    fn();
    currentArgs = null;
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

  run = function (subject, method, args) {
    method = method || currentTest.name;
    args = args || currentArgs || [];
    if(Sugar.noConflict) {
      if(!subjectIsClass(subject)) {
        args = [subject].concat(Array.prototype.slice.call(args));
      }
      return Sugar[currentTest.package.name][method].apply(null, args);
    } else {
      var globalObject = globalContext[currentTest.package.name], fn;
      if(subject && subject[method]) {
        // If the method exists on the subject, then it is the target
        // to be called. This is true in normal prototype testing as well
        // as for Sugar defined objects such as Ranges and Extended Objects.
        fn = subject[method];
      } else if(globalObject.prototype[method]) {
        // If the method is defined on the prototype of the global object,
        // then use it instead. This is the case when testing methods not
        // originally defined on the prototype of the subject, such as string
        // methods on numbers, undefined/null, etc.
        fn = globalObject.prototype[method];
      } else {
        // Otherwise assume a class method of the global object.
        fn = globalObject[method];
      }
      return fn.apply(subject, args);
    }
  }

  function getTestsToRun() {
    var focusedPackagesExist;

    function packageIsActive(package) {
      if (!focusedPackagesExist) {
        return true;
      }
      return package.focused;
    }

    focusedPackagesExist = packages.some(function(p) {
      return p.focused;
    });

    var focused = allTests.filter(function(t) {
      return t.focused && packageIsActive(t.package);
    });
    if (focused.length) {
      return focused;
    }
    return allTests.filter(function(t) {
      return !t.ignored && packageIsActive(t.package);
    });
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

  function getFullMessage(tail) {
    var msg = '';
    var title = currentTest.name;
    if(title) {
      msg += title + ' | ';
    }
    msg += tail;
    return msg;
  }

  function addFailure(actual, expected, message, stack, warning) {
    var meta = getMeta(stack);
    currentTest.package.failures.push({
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
    if(!one || !two || typeof one !== 'object' || typeof two !== 'object') {
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

  function sortOnStringValue(arr) {
    return arr.sort(function(a, b) {
      var aStr = getStringValueForObject(a);
      var bStr = getStringValueForObject(b);
      if(aStr === bStr) return 0;
      return aStr < bStr ? -1 : 1;
    });
  }

  function getStringValueForObject(obj) {
    var type = typeof obj, str;
    if(type === 'object') {
      str = 'obj:';
      for (var key in obj) {
        if(!obj.hasOwnProperty(key)) continue;
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
      $('<p/>').css({
        fontFamily: 'monospace',
        fontSize: '12px'
      }).text(messages.join(',')).appendTo(document.body);
    }
    console = {
      log: consoleFn,
      info: consoleFn
    }
  }

})();
