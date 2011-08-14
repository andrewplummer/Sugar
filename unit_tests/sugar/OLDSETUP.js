
dateEquals = function(a, b, message) {
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

getRelativeDate = function(year, month, day, hours, minutes, seconds, milliseconds) {
  var d = this.getFullYear ? this : new Date();
  var setYear  = d.getFullYear() + (year || 0)
  var setMonth = d.getMonth() + (month || 0)
  var setDate  = d.getDate() + (day || 0);
  // Relative dates that have no more specificity than months only walk
  // the bounds of months, they can't traverse into a new month if the
  // target month doesn't have the same number of days.
  if(day === undefined && month !== undefined) {
    setDate = Math.min(setDate, new Date(setYear, setMonth).daysInMonth());
    d.setDate(setDate);
  }
  d.setFullYear(setYear);
  d.setMonth(setMonth);
  d.setDate(setDate);
  d.setHours(d.getHours() + (hours || 0));
  d.setMinutes(d.getMinutes() + (minutes || 0));
  d.setSeconds(d.getSeconds() + (seconds || 0));
  d.setMilliseconds(d.getMilliseconds() + (milliseconds || 0));
  return d;
}

getUTCDate = function(year, month, day, hours, minutes, seconds, milliseconds) {
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

getDateWithWeekdayAndOffset = function(weekday, offset, hours, minutes, seconds, milliseconds) {
  var d = new Date();
  if(offset) d.setDate(d.getDate() + offset);
  d.setDate(d.getDate() + (weekday - d.getDay()));
  d.setHours(hours || 0);
  d.setMinutes(minutes || 0);
  d.setSeconds(seconds || 0);
  d.setMilliseconds(milliseconds || 0);
  return d;
}

getDaysInMonth = function(year, month) {
  return 32 - new Date(year, month, 32).getDate();
}

getWeekdayFromDate = function(d, utc) {
  var day = utc ? d.getUTCDay() : d.getDay();
  return ['sunday','monday','tuesday','wednesday','thursday','friday','saturday','sunday'][day];
}

getMonthFromDate = function(d, utc) {
  var month = utc ? d.getUTCMonth() : d.getMonth();
  return ['january','february','march','april','may','june','july','august','september','october','november','december'][month];
}

getHours = function(num) {
  return Math.floor(num < 0 ? 24 + num : num);
}

strictlyEqual = function(actual, expected, message) {
  equals(actual === expected, true, message + ' | strict equality');
}

equalsWithMargin = function(actual, expected, margin, message) {
  equals((actual > expected - margin) && (actual < expected + margin), true, message);
}

equalsWithException = function(actual, expected, exception, message) {
  if(exception.hasOwnProperty(environment)) expected = exception[environment];
  if(expected == 'NaN') {
    equals(isNaN(actual), true, message);
  } else {
    equals(actual, expected, message);
  }
}

sameWithException = function(actual, expected, exception, message, sort) {
  if(exception.hasOwnProperty(environment)) expected = exception[environment];
  if(sort) {
    actual = actual.concat().sort();
    expected = expected.concat().sort();
  }
  same(actual, expected, message);
}

strictlyEqualsWithException = function(actual, expected, exception, message) {
  equalsWithException(actual === expected, true, exception, message + ' | strict equality');
}

sameProxy = same;

deepEqualWithoutPrototyping = function(actual, expected) {
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

equalsWithWarning = function(actual, expected, message){
  equals(actual, expected, 'Warning: ' + message);
}


// A DST Safe version of equals for dates
equalsDST = function(actual, expected, multiplier, message) {
  if(multiplier === undefined) multiplier = 1;
  var dst = Date.DSTOffset;
  dst /= multiplier;
  if(expected < 0) expected += dst;
  else expected -= dst;
  equals(actual, expected.round(4), message + ' | DST offset applied');
}

dst = function(d) {
  return new Date(d.getTime() - Date.DSTOffset);
}

benchmark = function(fn, iterations) {
  var i = 0; d = new Date;
  iterations = iterations || 1000;
  for(i = 0; i < iterations; i++) {
    fn.call();
  }
  console.info(new Date - d);
}


// Passing undefined into .call will always set the scope as the window, so use this when available.
windowOrUndefined = (typeof window !== 'undefined' ? window : undefined);

