
testCreateDate = function() {
  return run(Date, 'create', arguments);
}

testCreateFutureDate = function() {
  return run(Date, 'future', arguments);
}

testCreatePastDate = function() {
  return run(Date, 'past', arguments);
}

dateRun = function(d, name, arguments) {
  return run(Sugar.Date.clone(d), name, arguments);
}

dateTest = function(d) {
  var args = Array.prototype.slice.call(arguments, 1);
  return test.apply(null, [Sugar.Date.clone(d)].concat(args));
}

dateEqual = function(a, b, message) {
  var buffer = 50; // Number of milliseconds of "play" to make sure these tests pass.
  if(typeof b == 'number') {
    var d = new Date();
    d.setTime(d.getTime() + b);
    b = d;
  }
  var offset = Math.abs(a.getTime() - b.getTime());
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
         testPadDigits(d.getMonth()) + '-' +
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

runUTC = function(name, args) {
  var target = Sugar.noConflict ? Sugar.Date.utc : Date.utc;
  return target[name].apply(null, args);
}

// These helper methods are necessary because setting/getting
// the locale is sometimes performed outside the Date package,
// giving no context for run().
testSetLocale = function(code) {
  if(Sugar.noConflict) {
    return Sugar.Date.setLocale(code);
  } else {
    return Date.setLocale(code);
  }
}

testGetLocale = function(code) {
  if(Sugar.noConflict) {
    return Sugar.Date.getLocale(code);
  } else {
    return Date.getLocale(code);
  }
}

testAddLocale = function(code, set) {
  if(Sugar.noConflict) {
    return Sugar.Date.addLocale(code, set);
  } else {
    return Date.addLocale(code, set);
  }
}

testMonthsFromNow = function(n, monthString, weekString) {
  var en = n === 1 ? '1 month from now' : n + ' months from now';
  var date = testCreateDate(en, 'en');
  var expected = date.getDate() < new Date().getDate() ? weekString : monthString;
  equal(run(date, 'relative'), expected, en);
}

