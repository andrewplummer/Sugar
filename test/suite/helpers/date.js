
testCreateDate = function() {
  return run(Date, 'create', arguments);
}

testCreateDateWithOptions = function(rawArgs, optName) {
  // Optimized: no leaking arguments
  var args = [], $i; for($i = 0; $i < rawArgs.length; $i++) args.push(rawArgs[$i]);
  var opt = {};
  opt[optName] = true;
  args.push(opt);
  return testCreateDate.apply(null, args);
}

testCreateFutureDate = function() {
  return testCreateDateWithOptions(arguments, 'future');
}

testCreatePastDate = function() {
  return testCreateDateWithOptions(arguments, 'past');
}

testCreateUTCDate = function() {
  return testCreateDateWithOptions(arguments, 'fromUTC');
}

dateRun = function(d, name, arguments) {
  return run(Sugar.Date.clone(d), name, arguments);
}

dateTest = function(d) {
  var args = Array.prototype.slice.call(arguments, 1);
  return test.apply(null, [Sugar.Date.clone(d)].concat(args));
}

dateEqual = function(a, b, message, tzReference) {
  var buffer = 50, tzOffset = 0; // Number of milliseconds of "play" to make sure these tests pass.
  if(typeof b == 'number') {
    var d = new Date();
    d.setTime(d.getTime() + b);
    b = d;
  }
  if (tzReference) {
    tzOffset = (b.getTimezoneOffset() - tzReference.getTimezoneOffset()) * 60 * 1000;
  }
  var offset = Math.abs(a.getTime() - (b.getTime() - tzOffset));
  equal(offset < buffer, true, message + ' | expected: ' + testFormatDate(b) + ' got: ' + testFormatDate(a), null, 1);
}

dateRangeEqual = function(a, b, message) {
  dateEqual(a.start, b.start, message);
  dateEqual(a.end, b.end, message);
}

getRelativeDate = function(year, month, day, hours, minutes, seconds, milliseconds) {
  var d = this.getFullYear ? new Date(this.getTime()) : new Date();
  var setYear  = d.getFullYear() + (year || 0)
  var setMonth = d.getMonth() + (month || 0)
  var setDate  = d.getDate() + (day || 0);
  // Relative dates that have no more specificity than months only walk
  // the bounds of months, they can't traverse into a new month if the
  // target month doesn't have the same number of days.
  if(day === undefined && month !== undefined) {
    setDate = Math.min(setDate, testGetDaysInMonth(setYear, setMonth));
    d.setDate(setDate);
  }
  if (setYear !== d.getFullYear()) {
    d.setFullYear(setYear);
  }
  if (setMonth !== d.getMonth()) {
    d.setMonth(setMonth);
  }
  if (setDate !== d.getDate()) {
    d.setDate(setDate);
  }

  // "hours" and lower must be set by absolute time or they will result
  // in unintended dates when traversing over DST shifts.
  d.setTime(d.getTime() +
    ((hours        || 0) * 60 * 60 * 1000) +
    ((minutes      || 0) * 60 * 1000) +
    ((seconds      || 0) * 1000) +
     (milliseconds || 0)
  );
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

testGetDaysInMonth = function(year, month) {
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

testGetHours = function(num) {
  return Math.floor(num < 0 ? 24 + num : num);
}

testGetTimezoneDiff = function(d1, d2) {
  return (d2.getTimezoneOffset() - d1.getTimezoneOffset()) * 60 * 1000;
}

getExpectedTimezoneOffset = function(d, iso) {
  // Beware of DST!
  if(run(d, 'isUTC', [])) {
    return iso ? 'Z' : '+0000';
  }
  var offset  = d.getTimezoneOffset();
  var hours   = testPadNumber(Math.floor(-offset / 60), 2, true);
  var minutes = testPadNumber(Math.abs(offset % 60), 2);
  return hours + (iso ? ':' : '') + minutes;
}

testFormatDate = function(d) {
  var tzOffset = d.getTimezoneOffset();
  var tzSign   = tzOffset > 0 ? '+' : '';
  var tzHr     = testPadDigits(tzOffset / 60);
  var tzMin    = testPadDigits(tzOffset % 60);
  return d.getFullYear() + '-' +
         testPadDigits(d.getMonth() + 1) + '-' +
         testPadDigits(d.getDate()) + ' ' +
         testPadDigits(d.getHours()) + ':' +
         testPadDigits(d.getMinutes()) + ':' +
         testPadDigits(d.getSeconds()) +
         tzSign +
         tzHr + ':' +
         tzMin;
}

testPadDigits = function(d, place) {
  var str = d.toString(), negative;
  if(!place) place = 2;
  if(str.slice(0, 1) === '-') {
    str = str.slice(1);
    negative = true;
  }
  while(str.length < place) {
    str = '0' + str;
  }
  if(negative) {
    str = '-' + str;
  }
  return str;
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

testGetTimezoneHours = function(d) {
  return Math.floor(Math.abs(d.getTimezoneOffset()) / 60);
}

// These helper methods are necessary because setting/getting
// the locale is sometimes performed outside the Date package,
// giving no context for run().
testSetLocale = function(code) {
  if (!Sugar.Date || !Sugar.Date.setLocale) return;
  return Sugar.Date.setLocale(code);
}

testGetLocale = function(code) {
  return Sugar.Date.getLocale(code);
}

testAddLocale = function(code, set) {
  return Sugar.Date.addLocale(code, set);
}

assertAddUnitIsNumericallyEqual = function (d, method, add, message) {
  var mult;
  message = [message, method, add, 'should be equal to adding absolute time'].join(' | ');
  switch (method.match(/add(\w+)/)[1]) {
    case 'Seconds':
      mult = 1000;
    break;
    case 'Minutes':
      mult = 60 * 1000;
    break;
    case 'Hours':
      mult = 60 * 60 * 1000;
    break;
    default:
      mult = 1;
  }
  equal(run(new Date(d.getTime()), method, [add]) - d, add * mult, message);
}

// For some awesome reason, calling any "set" method on a newly created date
// will have the effect of choosing the first ambiguous hour during a DST shift
// backward. For example, if you are in Mountain Time on Nov 2nd 1:00am, a date
// created with new Date() will be MST, but calling any set method on the date
// will make it jump an hour back to MDT. Call this on inconsistent dates to
// ensure that they are consistent.
dstSafe = function(d) {
  d.setFullYear(d.getFullYear());
  return d;
}

// If a date cannot set itself back by an hour then it's possible that it was
// shifted forward as the target time did not exist.
mayHaveDSTShifted = function(d) {
  var d2 = new Date(d.getTime()), h = d2.getHours();
  d2.setHours(d.getHours() - 1);
  return d2.getHours() === h;
}

// "relative" goes through the Date#since/until methods which need to step
// through "set" methods for higher order units (anything above hours). Doing
// this can occasionally result in a forward DST shift -- when a date will move
// forward an hour because the target date does not exist (as it is during the
// shift). While this can be compensated for internally when traversing, nothing
// can be done if the date has already jumped forward. In other words,
// "12 months ago" is not always "12 months ago" because at the point of the
// date being created it may have shifted forward in time by 1 hour. These tests
// should technically be rewritten to account for this, however the complexity
// of timezones and locales makes this prohibitive. It is also impossible to be
// sure that the shift is actually occurring or the date landed on was
// coincidentally an hour after a DST shift. Note that this issue does not exist
// in Fall as there are no gaps in the clock. Conversely "set" methods do not
// work so absolute time needs to be used with "setTime".
assertRelative = function(format, expected) {
  var d = testCreateDate(format, 'en');
  if (!mayHaveDSTShifted(d)) {
    equal(run(d, 'relative'), expected, 'relative | ' + format);
  }
}
