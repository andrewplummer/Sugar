
dateEqual = function(a, b, message) {
  var format = '{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}{tz}'
  var buffer = 50; // Number of milliseconds of "play" to make sure these tests pass.
  if(typeof b == 'number') {
    var d = new Date();
    d.setTime(d.getTime() + b);
    b = d;
  }
  var offset = Math.abs(a.getTime() - b.getTime());
  equal(offset < buffer, true, message + ' | expected: ' + b.format(format) + ' got: ' + a.format(format), null, 1);
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


toUTC = function(d) {
  return d.addMinutes(-d.getTimezoneOffset());
}
