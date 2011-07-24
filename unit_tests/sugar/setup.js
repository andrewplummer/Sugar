
var dateEquals = function(a, b, message) {
  var format = '{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}'
  var buffer = 50; // Number of milliseconds of "play" to make sure these tests pass.
  if(typeof b == 'number') {
    var d = new Date();
    d.setTime(d.getTime() + b);
    b = d;
  }
  var offset = Math.abs(a.getTime() - b.getTime());
  equals(offset < buffer, true, message + ' | expected: ' + b.format(format) + ' got: ' + a.format(format));
}

var getRelativeDate = function(year, month, day, hours, minutes, seconds, milliseconds) {
  var d = this.getFullYear  ? this : new Date();
  d.setFullYear(d.getFullYear() + (year || 0));
  d.setMonth(d.getMonth() + (month || 0));
  d.setDate(d.getDate() + (day || 0));
  d.setHours(d.getHours() + (hours || 0));
  d.setMinutes(d.getMinutes() + (minutes || 0));
  d.setSeconds(d.getSeconds() + (seconds || 0));
  d.setMilliseconds(d.getMilliseconds() + (milliseconds || 0));
  return d;
}

var getUTCDate = function(year, month, day, hours, minutes, seconds, milliseconds) {
  var d = new Date();
  if(year) d.setFullYear(year);
  d.setUTCDate(15); // Pre-emptively preventing a month overflow situation
  d.setUTCMonth(month === undefined ? 0 : month - 1);
  d.setUTCDate(day === undefined ? 1 : day);
  d.setUTCHours(hours === undefined ? 0 : hours);
  d.setUTCMinutes(minutes === undefined ? 0 : minutes);
  d.setUTCSeconds(seconds === undefined ? 0 : seconds);
  d.setUTCMilliseconds(milliseconds === undefined ? 0 : milliseconds);
  return d;
}

var getDateWithWeekdayAndOffset = function(weekday, offset, hours, minutes, seconds, milliseconds) {
  var d = new Date();
  if(offset) d.setDate(d.getDate() + offset);
  d.setDate(d.getDate() + (weekday - d.getDay()));
  d.setHours(hours || 0);
  d.setMinutes(minutes || 0);
  d.setSeconds(seconds || 0);
  d.setMilliseconds(milliseconds || 0);
  return d;
}

var getDaysInMonth = function(year, month) {
  return 32 - new Date(year, month, 32).getDate();
}

var getWeekdayFromDate = function(d, utc) {
  var day = utc ? d.getUTCDay() : d.getDay();
  return ['sunday','monday','tuesday','wednesday','thursday','friday','saturday','sunday'][day];
}

var getMonthFromDate = function(d, utc) {
  var month = utc ? d.getUTCMonth() : d.getMonth();
  return ['january','february','march','april','may','june','july','august','september','october','november','december'][month];
}

var getHours = function(num) {
  return Math.floor(num < 0 ? 24 + num : num);
}


var contains = function(actual, expected, message) {
  equals(expected.any(actual), true, message);
}

var strictlyEqual = function(actual, expected, message) {
  equals(actual === expected, true, message + ' | strict equality');
}

var equalsWithMargin = function(actual, expected, margin, message) {
  equals((actual > expected - margin) && (actual < expected + margin), true, message);
}

var equalsWithException = function(actual, expected, exception, message) {
  if(exception.hasOwnProperty(environment)) expected = exception[environment];
  if(expected == 'NaN') {
    equals(isNaN(actual), true, message);
  } else {
    equals(actual, expected, message);
  }
}

var sameWithException = function(actual, expected, exception, message, sort) {
  if(exception.hasOwnProperty(environment)) expected = exception[environment];
  if(sort) {
    actual = actual.concat().sort();
    expected = expected.concat().sort();
  }
  same(actual, expected, message);
}

var strictlyEqualsWithException = function(actual, expected, exception, message) {
  equalsWithException(actual === expected, true, exception, message + ' | strict equality');
}

var fixPrototypeIterators = function() {
  if(environment == 'prototype') {
    fixIterator('find');
    fixIterator('findAll');
    fixIterator('min', true);
    fixIterator('max', true);
  }
}

var fixIterator = function(name, map) {
  var fn = Array.prototype[name];
  Array.prototype[name] = function(a) {
    if(typeof a == 'function') {
      return fn.apply(this, arguments);
    } else {
      return fn.apply(this, [function(s) {
        if(map) {
          return s && s[a] ? s[a] : s;
        } else {
          return s == a;
        }
      }].concat(Array.prototype.slice.call(arguments, 1)));
    }
  };
}

var testWithErrorHandling = function(test, environments) {
  try {
    test.call();
  } catch(error) {
    for(var i = 0; i < environments.length; i++) {
      if(environments[i] == environment) {
        // Allow test to fail
        if(console) {
          console.info('Skipping test with exepction "' + error.message + '" for environment ' + environment);
        }
        return;
      }
    }
    throw new Error('Test ' + test.toString() + ' errored with message ' + error.message);
  }
}

var sameProxy = same;

var deepEqualWithoutPrototyping = function(actual, expected) {
  for(var key in actual) {
    if(!actual.hasOwnProperty(key)) continue;
    if(Object.isObject(actual[key]) || Object.isArray(actual[key])) {
      if(!deepEqualWithoutPrototyping(actual[key], expected[key])) {
        return false;
      }
    } else if(actual[key] !== expected[key]) {
      return false;
    }
  }
  if((actual && !expected) || (expected && !actual)) {
    return false;
  }
  return true;
}

same = function(actual, expected, message) {
  if(Object.isObject(actual) || Object.isObject(expected)) {
    equals(deepEqualWithoutPrototyping(actual, expected), true, message);
  } else {
    sameProxy.apply(this, arguments);
  }
}

var equalsWithWarning = function(actual, expected, message){
  equals(actual, expected, 'Warning: ' + message);
}


// A DST Safe version of equals for dates
var equalsDST = function(actual, expected, multiplier, message) {
  if(multiplier === undefined) multiplier = 1;
  var dst = Date.DSTOffset;
  dst /= multiplier;
  if(expected < 0) expected += dst;
  else expected -= dst;
  equals(actual, expected.round(4), message + ' | DST offset applied');
}

var dst = function(d) {
  return new Date(d.getTime() - Date.DSTOffset);
}

var objectPrototypeMethods = {};

var rememberObjectProtoypeMethods = function() {
  for(var m in Object.prototype) {
    if(!Object.prototype.hasOwnProperty(m)) continue;
    objectPrototypeMethods[m] = Object.prototype[m];
  }
}

var restoreObjectPrototypeMethods = function() {
  for(var m in Object.prototype) {
    if(!Object.prototype.hasOwnProperty(m)) continue;
    var actualProp = objectPrototypeMethods.hasOwnProperty(m) && objectPrototypeMethods[m];
    if(Object.prototype[m] == actualProp) {
      continue;
    } else if(actualProp) {
      Object.prototype[m] = objectPrototypeMethods[m];
    } else {
      delete Object.prototype[m];
    }
  }
}

var raisesError = function(fn, message) {
  var raised = false;
  try {
    fn.call();
  } catch(e) {
    raised = true;
  }
  equals(raised, true, message);
}

