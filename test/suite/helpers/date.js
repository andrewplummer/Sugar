
var INVALID_DATE = new Date(NaN).toString();

var TEST_DATE_UNITS = [
  ['FullYear', 0],
  ['Month', 0],
  ['Date', 1],
  ['Hours', 0],
  ['Minutes', 0],
  ['Seconds', 0],
  ['Milliseconds', 0]
];

testCreateDate = function(arg1, arg2) {
  return Sugar.Date.create(arg1, arg2);
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

dateRangeEqual = function(a, b, message) {
  var ast = a.start.getTime();
  var aet = a.end.getTime();
  var bst = b.start.getTime();
  var bet = b.end.getTime();

  // Allow for NaN values.
  var startEqual = ast === bst || (ast !== ast && bst !== bst);
  var endEqual   = aet === bet || (aet !== aet && bet !== bet);

  equal(startEqual && endEqual, true, message);
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
    if (setDate !== d.getDate()) {
      d.setDate(setDate);
    }
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

getRelativeDateReset = function() {
  var d = getRelativeDate.apply(this, arguments);
  for (var i = arguments.length; i < TEST_DATE_UNITS.length; i++) {
    var unit = TEST_DATE_UNITS[i];
    d['set' + unit[0]](unit[1]);
  }
  return d;
};

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

testIsUTC = function(d) {
  return testGetPrivateProp(d, 'utc');
}

testGetWeekday = function(weekday, weekOffset, hours, minutes, seconds, milliseconds) {
  var d = new Date();
  if(weekOffset) d.setDate(d.getDate() + (weekOffset * 7));
  d.setDate(d.getDate() + (weekday - d.getDay()));
  d.setHours(hours || 0);
  d.setMinutes(minutes || 0);
  d.setSeconds(seconds || 0);
  d.setMilliseconds(milliseconds || 0);
  return d;
}

testGetEndOfMonth = function(year, month) {
  var day = testGetDaysInMonth(year, month);
  return new Date(year, month, day, 23, 59, 59, 999);
}

testGetEndOfRelativeMonth = function(month) {
  var now = new Date();
  return testGetEndOfMonth(now.getFullYear(), now.getMonth() + month);
}

testGetWeekdayInMonth = function(month, weekday, weekOffset, hours, minutes, seconds, milliseconds) {
  var d = new Date(), offset;
  d.setMonth(month);
  d.setDate(1);
  offset = weekday - d.getDay();
  if (offset < 0) {
    offset += 7;
  }
  d.setDate(1 + offset + (7 * (weekOffset || 0)));
  d.setHours(hours || 0);
  d.setMinutes(minutes || 0);
  d.setSeconds(seconds || 0);
  d.setMilliseconds(milliseconds || 0);
  return d;
}

testGetWeekdayInRelativeMonth = function(month, weekday, weekOffset) {
  var now = new Date();
  return testGetWeekdayInMonth(now.getMonth() + month, weekday, weekOffset);
}

testGetBeginningOfWeek = function(startWeekday) {
  var d = new Date();
  var dow = d.getDay();
  if (dow < startWeekday) {
    startWeekday -= 7;
  }
  d.setDate(d.getDate() - (dow - startWeekday));
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}

testGetEndOfWeek = function(endWeekday) {
  var d = new Date();
  var dow = d.getDay();
  if (dow > endWeekday) {
    endWeekday += 7;
  }
  d.setDate(d.getDate() + (endWeekday - dow));
  d.setHours(23);
  d.setMinutes(59);
  d.setSeconds(59);
  d.setMilliseconds(999);
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

testGetTimezoneHours = function(d) {
  return Math.floor(Math.abs(d.getTimezoneOffset()) / 60);
}

testCreateFakeLocale = function(code) {
  // Imaginary locale to test locale switching
  Sugar.Date.addLocale(code, {
    units: 'do,re,mi,fa,so,la,ti,do',
    months: 'Do,Re,Mi,Fa,So,La,Ti,Do',
    dateParse: [
      '{year}kupo',
      '{month}mofo'
    ],
    duration: '{num}{unit}momoney',
    long: 'yeehaw'
  });
}

// This helper method are necessary because setting/getting
// the locale is sometimes performed outside the Date module,
// giving no context for run().
testSetLocale = function(code) {
  if (!Sugar.Date || !Sugar.Date.setLocale) return;
  return Sugar.Date.setLocale(code);
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

assertRelative = function(format, expected) {
  var d = testCreateDate(format, 'en');
  if (d - new Date > 1000) {
    d = new Date(d.getTime() + 80);
  }
  equal(run(d, 'relative'), expected, 'relative | ' + format);
}

assertFormatShortcut = function (d, name, expected, localeCode) {
  var l = localeCode ? ' | ' + localeCode : '';
  test(d, ['{' + name + '}', localeCode], expected, 'direct token ' + name + l);
  equal(run(d, name, [localeCode]), expected, 'method ' + name + l);
}
