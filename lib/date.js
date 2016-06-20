'use strict';

/***
 * @module Date
 * @description Date parsing and formatting, relative formats, number shortcuts,
 *              and locale support with default English locales.
 *
 ***/

var DATE_OPTIONS = {
  'newDateInternal': defaultNewDate
};

var LOCALE_ARRAY_FIELDS = [
  'months', 'weekdays', 'units', 'numerals', 'placeholders',
  'articles', 'tokens', 'timeMarkers', 'ampm', 'timeSuffixes',
  'parse', 'timeParse', 'timeFrontParse', 'modifiers'
];

// Regex for stripping Timezone Abbreviations
var TIMEZONE_ABBREVIATION_REG = /(\w{3})[()\s\d]*$/;

// One minute in milliseconds
var MINUTES = 60 * 1000;

// Date unit indexes
var SECONDS_INDEX = 1,
    HOURS_INDEX   = 3,
    DAY_INDEX     = 4,
    WEEK_INDEX    = 5,
    MONTH_INDEX   = 6,
    YEAR_INDEX    = 7;

// ISO Defaults
var ISO_FIRST_DAY_OF_WEEK = 1,
    ISO_FIRST_DAY_OF_WEEK_YEAR = 4;

// A hash of date units by name
var DateUnitsByName;

var ParsingTokens = {
  'year': {
    src: '\\d{4}',
    allowsNumerals: true,
    requiresSuffix: true
  },
  'yearShort': {
    src: '\\d{2}'
  },
  'month': {
    src: '[01]?\\d',
    allowsNumerals: true,
    requiresSuffix: true
  },
  'date': {
    src: '[0123]?\\d',
    allowsNumerals: true,
    requiresSuffix: true
  },
  'hour': {
    src: '[0-5]?\\d',
    allowsNumerals: true,
    requiresAlternate: ':'
  },
  'minute': {
    src: '[0-5]\\d',
    allowsNumerals: true
  },
  'second': {
    src: '[0-5]\\d(?:[,.]\\d+)?',
    allowsNumerals: true
  },
  'num': {
    src: '\\d+',
    requiresNumerals: true
  },
  'utc': {
    src: 'Z|GMT'
  }
};

var CoreParsingFormats = [
  {
    // ISO-8601
    match: 'yearSign,year,month,date,hour,minute,second,utc,offsetSign,offsetHour,offsetMinute',
    src: buildISO8601()
  },
  {
    // 08/12/1978 (en-US)
    // 12/08/1978 (en-other)
    time: true,
    src: '{date}[-.\\/]{month}[-.\\/]{year|yearShort}',
    mdy: '{month}[-.\\/]{date}[-.\\/]{year|yearShort}'
  },
  {
    // 08-1978 (en-US)
    // 12-1978 (en-other)
    time: true,
    src: '{date}[-.\\/]{month}',
    mdy: '{month}[-.\\/]{date}'
  },
  {
    // 1975-08
    // 1975-08-25
    time: true,
    src: '{year}[-.\\/]{month}[-.\\/]?{date?}'
  },
  {
    // .NET JSON
    match: 'timestamp',
    src: '\\\\/Date\\((\\d+)(?:[+-]\\d{4,4})?\\)\\\\/'
  }
];

var CoreOutputFormats = {
  'ISO8601': '{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{SSS}{Z}',
  'RFC1123': '{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {tz}',
  'RFC1036': '{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {tz}'
};

var FormatTokensBase = [
  {
    ldml: 'Dow',
    strf: 'a',
    lowerToken: 'dow',
    get: function(d, localeCode) {
      return localeManager.get(localeCode).getWeekdayName(getWeekday(d), 2);
    }
  },
  {
    ldml: 'Weekday',
    strf: 'A',
    lowerToken: 'weekday',
    allowAlternates: true,
    get: function(d, localeCode, alternate) {
      return localeManager.get(localeCode).getWeekdayName(getWeekday(d), alternate);
    }
  },
  {
    ldml: 'Mon',
    strf: 'b,h',
    lowerToken: 'mon',
    get: function(d, localeCode) {
      return localeManager.get(localeCode).getMonthName(getMonth(d), 2);
    }
  },
  {
    ldml: 'Month',
    strf: 'B',
    lowerToken: 'month',
    allowAlternates: true,
    get: function(d, localeCode, alternate) {
      return localeManager.get(localeCode).getMonthName(getMonth(d), alternate);
    }
  },
  {
    strf: 'C',
    get: function(d) {
      return getYear(d).toString().slice(0, 2);
    }
  },
  {
    ldml: 'd,date,day',
    strf: 'd',
    strfPadding: 2,
    ldmlPaddedToken: 'dd',
    ordinalToken: 'do',
    get: function(d) {
      return getDate(d);
    }
  },
  {
    strf: 'e',
    get: function(d) {
      return padNumber(getDate(d), 2, false, 10, ' ');
    }
  },
  {
    ldml: 'H,24hr',
    strf: 'H',
    strfPadding: 2,
    ldmlPaddedToken: 'HH',
    get: function(d) {
      return getHours(d);
    }
  },
  {
    ldml: 'h,hours,12hr',
    strf: 'I',
    strfPadding: 2,
    ldmlPaddedToken: 'hh',
    get: function(d) {
      return getHours(d) % 12 || 12;
    }
  },
  {
    ldml: 'D',
    strf: 'j',
    strfPadding: 3,
    ldmlPaddedToken: 'DDD',
    get: function(d) {
      var s = resetUnitAndLower(cloneDate(d), 'month');
      return daysSince(d, s) + 1;
    }
  },
  {
    ldml: 'M',
    strf: 'm',
    strfPadding: 2,
    ordinalToken: 'Mo',
    ldmlPaddedToken: 'MM',
    get: function(d) {
      return getMonth(d) + 1;
    }
  },
  {
    ldml: 'm,minutes',
    strf: 'M',
    strfPadding: 2,
    ldmlPaddedToken: 'mm',
    get: function(d) {
      return callDateGet(d, 'Minutes');
    }
  },
  {
    ldml: 'Q',
    get: function(d) {
      return ceil((getMonth(d) + 1) / 3);
    }
  },
  {
    ldml: 'TT',
    strf: 'p',
    get: function(d, localeCode) {
      return getMeridianForDate(d, localeCode);
    }
  },
  {
    ldml: 'tt',
    strf: 'P',
    get: function(d, localeCode) {
      return getMeridianForDate(d, localeCode).toLowerCase();
    }
  },
  {
    ldml: 'T',
    lowerToken: 't',
    get: function(d, localeCode) {
      return getMeridianForDate(d, localeCode).charAt(0);
    }
  },
  {
    ldml: 's,seconds',
    strf: 'S',
    strfPadding: 2,
    ldmlPaddedToken: 'ss',
    get: function(d) {
      return callDateGet(d, 'Seconds');
    }
  },
  {
    ldml: 'S,ms',
    strfPadding: 3,
    ldmlPaddedToken: 'SSS',
    get: function(d) {
      return callDateGet(d, 'Milliseconds');
    }
  },
  {
    ldml: 'e',
    strf: 'u',
    ordinalToken: 'eo',
    get: function(d) {
      return getWeekday(d) || 7;
    }
  },
  {
    strf: 'U',
    strfPadding: 2,
    get: function(d) {
      // Sunday first, 0-53
      return getWeekNumber(d, false, 0);
    }
  },
  {
    ldml: 'W',
    strf: 'V',
    strfPadding: 2,
    ordinalToken: 'Wo',
    ldmlPaddedToken: 'WW',
    get: function(d) {
      // Monday first, 1-53 (ISO8601)
      return getWeekNumber(d, true);
    }
  },
  {
    strf: 'w',
    get: function(d) {
      return getWeekday(d);
    }
  },
  {
    ldml: 'w',
    ordinalToken: 'wo',
    ldmlPaddedToken: 'ww',
    get: function(d, localeCode) {
      // Locale dependent, 1-53
      var loc = localeManager.get(localeCode),
          dow = loc.getFirstDayOfWeek(localeCode),
          doy = loc.getFirstDayOfWeekYear(localeCode);
      return getWeekNumber(d, true, dow, doy);
    }
  },
  {
    strf: 'W',
    strfPadding: 2,
    get: function(d) {
      // Monday first, 0-53
      return getWeekNumber(d, false);
    }
  },
  {
    ldmlPaddedToken: 'gggg',
    ldmlTwoDigitToken: 'gg',
    get: function(d, localeCode) {
      return getWeekYear(d, localeCode);
    }
  },
  {
    strf: 'G',
    strfPadding: 4,
    strfTwoDigitToken: 'g',
    ldmlPaddedToken: 'GGGG',
    ldmlTwoDigitToken: 'GG',
    get: function(d, localeCode) {
      return getWeekYear(d, localeCode, true);
    }
  },
  {
    ldml: 'year',
    ldmlPaddedToken: 'yyyy',
    ldmlTwoDigitToken: 'yy',
    strf: 'Y',
    strfPadding: 4,
    strfTwoDigitToken: 'y',
    get: function(d) {
      return getYear(d);
    }
  },
  {
    ldml: 'tz,ZZ',
    strf: 'z',
    get: function(d) {
      return getUTCOffset(d);
    }
  },
  {
    ldml: 'X',
    get: function(d) {
      return trunc(d.getTime() / 1000);
    }
  },
  {
    ldml: 'x',
    get: function(d) {
      return d.getTime();
    }
  },
  {
    ldml: 'Z',
    get: function(d) {
      return getUTCOffset(d, true);
    }
  },
  {
    ldml: 'z',
    strf: 'Z',
    get: function(d) {
      // Note that this is not accurate in all browsing environments!
      // https://github.com/moment/moment/issues/162
      // It will continue to be supported for Node and usage with the
      // understanding that it may be blank.
      var match = d.toString().match(TIMEZONE_ABBREVIATION_REG);
      return match ? match[1]: '';
    }
  },
  {
    strf: 'D',
    alias: '%m/%d/%y'
  },
  {
    strf: 'F',
    alias: '%Y-%m-%d'
  },
  {
    strf: 'r',
    alias: '%I:%M:%S %p'
  },
  {
    strf: 'R',
    alias: '%H:%M'
  },
  {
    strf: 'T',
    alias: '%H:%M:%S'
  },
  {
    strf: 'x',
    alias: '{short}'
  },
  {
    strf: 'X',
    alias: '{time}'
  },
  {
    strf: 'c',
    alias: '{stamp}'
  }
];

var DateUnits = [
  {
    name: 'millisecond',
    method: 'Milliseconds',
    multiplier: 1,
    start: 0,
    end: 999
  },
  {
    name: 'second',
    method: 'Seconds',
    multiplier: 1000,
    half: 500,
    start: 0,
    end: 59
  },
  {
    name: 'minute',
    method: 'Minutes',
    multiplier: 60 * 1000,
    half: 30,
    start: 0,
    end: 59
  },
  {
    name: 'hour',
    method: 'Hours',
    multiplier: 60 * 60 * 1000,
    half: 30,
    start: 0,
    end: 23
  },
  {
    name: 'day',
    method: 'Date',
    higher: true,
    resetValue: 1,
    multiplier: 24 * 60 * 60 * 1000,
    half: 12,
    start: 1,
    end: function(d) {
      return daysInMonth(d);
    }
  },
  {
    name: 'week',
    method: 'ISOWeek',
    higher: true,
    resetValue: 1,
    multiplier: 7 * 24 * 60 * 60 * 1000
  },
  {
    name: 'month',
    method: 'Month',
    higher: true,
    multiplier: 30.4375 * 24 * 60 * 60 * 1000,
    start: 0,
    end: 11
  },
  {
    name: 'year',
    method: 'FullYear',
    higher: true,
    multiplier: 365.25 * 24 * 60 * 60 * 1000,
    half: 6,
    start: 0
  }
];

/***
 * @method getOption(<name>)
 * @returns Mixed
 * @accessor
 * @short Gets an option used interally by Date.
 * @options
 *
 *   newDateInternal   Sugar's internal date constructor. By default this
 *                     function simply returns a `new Date()`, however it can be
 *                     overridden if needed.
 *
 * @example
 *
 *   Sugar.Date.getOption('newDateInternal');
 *
 ***
 * @method setOption(<name>, <value>)
 * @returns undefined
 * @accessor
 * @short Sets an option used interally by Date.
 * @extra If <value> is `null`, the default value will be restored.
 * @options
 *
 *   newDateInternal   Sugar's internal date constructor. Date methods often
 *                     construct a `new Date()` internally as a reference point
 *                     (`isToday`, relative formats like `tomorrow`, etc). This
 *                     can be overridden if you need it to be something else.
 *                     Most commonly, this allows you to return a shifted date
 *                     to simulate a specific timezone, as dates in Javascript
 *                     are always local.
 *
 * @example
 *
 *   Sugar.Date.setOption('newDateInternal', function() {
 *     var d = new Date(), offset;
 *     offset = (d.getTimezoneOffset() - 600) * 60 * 1000; // Hawaii time!
 *     d.setTime(d.getTime() + offset);
 *     return d;
 *   });
 *
 ***/
var _dateOptions = defineOptionsAccessor(sugarDate, DATE_OPTIONS);

function setDateChainableConstructor() {
  setChainableConstructor(sugarDate, createDate);
}

// General helpers

function tzOffset(d) {
  return d.getTimezoneOffset();
}

function getNewDate() {
  return _dateOptions('newDateInternal')();
}

function defaultNewDate() {
  return new Date;
}

function cloneDate(d) {
  // Rhino environments have a bug where new Date(d) truncates
  // milliseconds so need to call getTime() here.
  var clone = new Date(d.getTime());
  _utc(clone, !!_utc(d));
  return clone;
}

function getHours(d) {
  return callDateGet(d, 'Hours');
}

function getWeekday(d) {
  return callDateGet(d, 'Day');
}

function getDate(d) {
  return callDateGet(d, 'Date');
}

function getMonth(d) {
  return callDateGet(d, 'Month');
}

function getYear(d) {
  return callDateGet(d, 'FullYear');
}

function setDate(d, val) {
  return callDateSet(d, 'Date', val);
}

function setMonth(d, val) {
  return callDateSet(d, 'Month', val);
}

function setYear(d, val) {
  return callDateSet(d, 'FullYear', val);
}

// Normal callDateSet method with ability
// to handle ISOWeek setting as well.
function callDateSetWithWeek(d, method, value) {
  if (method === 'ISOWeek') {
    return setISOWeekNumber(d, value);
  } else {
    return callDateSet(d, method, value);
  }
}

function dateIsValid(d) {
  return !isNaN(d.getTime());
}

// UTC helpers

function isUTC(d) {
  return !!_utc(d) || tzOffset(d) === 0;
}

function getUTCOffset(d, iso) {
  var offset = _utc(d) ? 0 : tzOffset(d), hours, mins, colon;
  colon  = iso === true ? ':' : '';
  if (!offset && iso) return 'Z';
  hours = padNumber(trunc(-offset / 60), 2, true);
  mins = padNumber(abs(offset % 60), 2);
  return  hours + colon + mins;
}

function buildISO8601() {

  function opt(arg, src) {
    return getRegNonCapturing((arg || '') + (src || ''), true);
  }

  var n4 = '(\\d{4})';
  var n2 = '(\\d{2})';
  var d2 = '(\\d{2}(?:[,.]\\d+)?)';
  var d3 = '(\\d{1,3}(?:[,.]\\d+)?)';

  var utc  = '(Z)|([+-])(\\d{2})(?::?(\\d{2}))?';
  var time = opt('T', d2 + opt(':?', d2 + opt(':?', d3)) + opt(utc));
  var src  = '([+-])?'+ n4 + opt('-?', n2 + opt('-?', n2 + opt(time)));

  return src;
}

// Date argument helpers

function collectDateArguments(args, duration) {
  var arg1 = args[0], arg2 = args[1];
  if (duration && isString(arg1)) {
    return [getDateParamsFromString(arg1), arg2];
  } else if (isNumber(arg1) && isNumber(arg2)) {
    return collectDateParamsFromArguments(args);
  } else {
    if (isObjectType(arg1)) {
      args[0] = simpleClone(arg1);
    }
    return args;
  }
}

function collectDateParamsFromArguments(args) {
  var obj = {}, u = DateUnitsByName['year'];
  while (u && isNumber(args[0])) {
    obj[u.name] = args[0];
    args.splice(0, 1);
    u = u.lower;
  }
  args.unshift(obj);
  return args;
}

function getDateParamsFromString(str) {
  var match, num, params = {};
  match = str.match(/^(-?\d+)?\s?(\w+?)s?$/i);
  if (match) {
    if (isUndefined(num)) {
      num = +match[1];
      if (isNaN(num)) {
        num = 1;
      }
    }
    params[match[2].toLowerCase()] = num;
  }
  return params;
}

// Date iteration helpers

// Milliseconds -> Years
function iterateOverDateUnits(fn, from, to) {
  var i = from || 0, inc, unit, result;
  if (isUndefined(to)) to = YEAR_INDEX;
  inc = i > to ? -1 : 1;
  while (result !== false) {
    unit = DateUnits[i];
    result = fn(unit.name, unit, i);
    if (i === to) {
      break;
    }
    i += inc;
  }
}

// Years -> Milliseconds
function iterateOverDateUnitsReverse(fn) {
  iterateOverDateUnits(fn, YEAR_INDEX, 0);
}

// Days -> Years
function iterateOverHigherDateUnits(fn) {
  iterateOverDateUnits(fn, DAY_INDEX, YEAR_INDEX);
}

// Seconds -> Hours
function iterateOverLowerDateUnits(fn) {
  iterateOverDateUnits(fn, SECONDS_INDEX, HOURS_INDEX);
}

// Milliseconds -> Years with "date" for "day" and optional "weekday"
function iterateOverDateParamUnits(allowWeekday, fn) {
  iterateOverDateUnits(function(name, u, i) {
    if (name === 'day') {
      name = 'date';
      if (allowWeekday) {
        fn('weekday', i);
      }
    }
    return fn(name, i);
  });
}

// Date shifting helpers

function advanceDate(d, unit, num, reset) {
  var set = {};
  set[unit] = num;
  return updateDate(d, set, reset, 1);
}

function advanceDateWithArgs(d, args, dir) {
  var set = collectDateArguments(args, true);
  return updateDate(d, set[0], set[1], dir);
}

// Ex. "hours" -> "milliseconds"
function resetUnitAndLower(d, unit) {
  return setUnitAndLowerToEdge(d, DateUnitsByName[unit || 'hours']);
}

// Ex. set "month" to either 0 or 11. Note that "moveToEdgeOfUnit" is similar
// to this, only one unit higher, ie moving to the beginning of the year is
// equivalent to setting the months to 0. However, this method does not support
// weeks, as 1) this decouples locale considerations, and 2) although moving to
// the edge of a week shifts the day, moving the day as a unit implies months
// as the higher unit, not weeks. Making this separation means we can handle
// weeks only if required.
function setUnitAndLowerToEdge(d, u, end) {
  while (u) {
    var val = end ? u.end : u.start;
    if (isFunction(val)) {
      val = val(d);
    }
    callDateSet(d, u.method, val);
    u = u.lower;
  }
  return d;
}

function dateParamKey(params, key) {
  return isDefined(params[key]) ? key : key + 's';
}

function getDateParam(params, key) {
  return getOwn(params, dateParamKey(params, key));
}

function deleteDateParam(params, key) {
  delete params[dateParamKey(params, key)];
}

function dateParamIsDefined(params, key) {
  return isDefined(getDateParam(params, key));
}

function resetTime(d) {
  callDateSet(d, 'Hours', 0);
  callDateSet(d, 'Minutes', 0);
  callDateSet(d, 'Seconds', 0);
  callDateSet(d, 'Milliseconds', 0);
  return d;
}

function setWeekday(d, dow, dir) {
  if (!isNumber(dow)) return;
  var currentWeekday = getWeekday(d);
  if (dir) {
    // Allow a "direction" parameter to determine whether a weekday can
    // be set beyond the current weekday in either direction.
    var ndir = dir > 0 ? 1 : -1;
    var offset = dow % 7 - currentWeekday;
    if (offset && offset / abs(offset) !== ndir) {
      dow += 7 * ndir;
    }
  }
  return setDate(d, getDate(d) + dow - currentWeekday);
}

function moveToEdgeOfUnit(d, unit, localeCode, edgeOfWeek, end) {
  var lower;
  if (unit === 'week') {
    edgeOfWeek(d, localeManager.get(localeCode).getFirstDayOfWeek());
    lower = DateUnitsByName['hours'];
  } else {
    lower = DateUnitsByName[unit].lower;
  }
  return setUnitAndLowerToEdge(d, lower, end);
}

function moveToBeginningOfUnit(d, unit, localeCode) {
  return moveToEdgeOfUnit(d, unit, localeCode, moveToBeginningOfWeek);
}

function moveToEndOfUnit(d, unit, localeCode) {
  return moveToEdgeOfUnit(d, unit, localeCode, moveToEndOfWeek, true);
}

function daysSince(d1, d2) {
  return getTimeDistanceForUnit(d1, d2, DateUnitsByName['day']);
}

function getTimeDistanceForUnit(d1, d2, u) {
  var fwd = d2 > d1, num, tmp;
  if (!fwd) {
    tmp = d2;
    d2  = d1;
    d1  = tmp;
  }
  num = d2 - d1;
  if (u.multiplier > 1) {
    num = trunc(num / u.multiplier);
  }
  // For higher order with potential ambiguity, use the numeric calculation
  // as a starting point, then iterate until we pass the target date.
  if (u.higher) {
    d1 = cloneDate(d1);
    advanceDate(d1, u.name, num);
    while (d1 < d2) {
      advanceDate(d1, u.name, 1);
      if (d1 > d2) {
        break;
      }
      num += 1;
    }
  }
  return fwd ? -num : num;
}

function getExtendedDate(contextDate, d, opt) {

  var date, set, loc, options, afterCallbacks, relative, weekdayDir;

  afterCallbacks = [];
  options = getDateOptions(opt);

  function getDateOptions(opt) {
    var options = isString(opt) ? { locale: opt } : opt || {};
    options.prefer = +!!options.future - +!!options.past;
    return options;
  }

  function getFormatMatch(match, dif) {
    var set = options.set || {};
    forEach(dif.to, function(field, i) {
      var val = match[i + 1];
      if (!val) return;
      if (field === 'yearShort') {
        set.year = getYearFromAbbreviation(val, date, options.prefer);
      } else {
        set[field] = loc.getTokenValue(field, val);
      }
    });
    return set;
  }

  // Clone date will set the utc flag, but it will
  // be overriden later, so set option flags instead.
  function cloneDateByFlag(d) {
    var clone = new Date(d.getTime());
    if (_utc(d) && !isDefined(options.fromUTC)) {
      options.fromUTC = true;
    }
    if (_utc(d) && !isDefined(options.setUTC)) {
      options.setUTC = true;
    }
    return clone;
  }

  function afterDateSet(fn) {
    afterCallbacks.push(fn);
  }

  function fireCallbacks() {
    forEach(afterCallbacks, function(fn) {
      fn.call();
    });
  }

  function handleUnitlessShift() {
    if (isDefined(set.month)) {
      // "next January"
      set.unit = YEAR_INDEX;
    } else if (isDefined(set.weekday)) {
      // "next Monday"
      set.unit = WEEK_INDEX;
    }
  }

  function handleMidday(hours) {
    set.hours = hours % 24;
    if (hours > 23) {
      // If the date has hours past 24, we need to prevent it from traversing
      // into a new day as that would make it being part of a new week in
      // ambiguous dates such as "Monday".
      afterDateSet(function() {
        advanceDate(date, 'date', trunc(hours / 24));
      });
    }
  }

  function handleRelativeDay() {
    resetTime(date);
    relative = true;
  }

  function handleAmpm(ampm) {
    if (ampm === 1 && set.hour < 12) {
      // If the time is 1pm-11pm advance the time by 12 hours.
      set.hour += 12;
    } else if (ampm === 0 && set.hour === 12) {
      // If it is 12:00am then set the hour to 0.
      set.hour = 0;
    }
  }

  function handleTimezoneOffset(offsetHour, offsetMinute, offsetSign) {
    // Adjust for timezone offset
    _utc(date, true);
    var offset = (offsetSign || 1) * ((offsetHour || 0) * 60 + (offsetMinute || 0));
    if (offset) {
      set.minute = (set.minute || 0) - offset;
    }
  }

  function handleRelativeUnit(unitIndex) {
    var unitName, num;
    num = isDefined(set.num) ? set.num : 1;
    unitName = English.units[unitIndex];

    // Allow localized "half" as a standalone colloquialism. Purposely avoiding
    // the locale number system to reduce complexity. The units "month" and
    // "week" are purposely excluded in the English date formats below, as
    // "half a week" and "half a month" are meaningless as exact dates.
    if (set.half && set.unit) {
      var unit = DateUnits[unitIndex];
      if (unit.half) {
        num = unit.half;
        unitIndex -= 1;
        unitName = unit.lower.name;
      }
      delete set.half;
    }

    // If a weekday is defined, there are 3 possible formats being applied:
    //
    // 1. "the day after monday": unit is days
    // 2. "next monday": short for "next week monday", unit is weeks
    // 3. "the 2nd monday of next month": unit is months
    //
    // In the first case, we need to set the weekday up front, as the day is
    // relative to it. In case three, the weekday needs to be set after the
    // month is set, so allow separateLowerUnits to set up a callback. The
    // second case can be set at either time, but setting it first to handle
    // "next monday at midnight", which needs to have the day set first.
    if (isDefined(set.weekday)) {
      if (unitIndex === MONTH_INDEX) {
        set.weekday += (num - 1) * 7;
        weekdayDir = 1;
        num = 1;
      } else {
        updateDate(date, { weekday: set.weekday }, true);
        delete set.weekday;
      }
    }

    // Formats like "the 15th of last month" or "6:30pm of next week"
    // contain absolute units in addition to relative ones, so separate
    // them here, remove them from the params, and set up a callback to
    // set them after the relative ones have been set.
    separateLowerUnits(unitIndex);

    if (isDefined(set.shift)) {
      // Shift and unit, ie "next month", "last week", etc.
      num *= set.shift;
    }

    if (isDefined(set.sign)) {
      // Unit and sign, ie "months ago", "weeks from now", etc.
      num *= set.sign;
    }

    // Finally shift the unit.
    set[unitName] = (set[unitName] || 0) + num;
    relative = true;
  }

  function handleUnitEdge() {
    // If there is an "edge" it needs to be set after the other fields are set.
    // ie "the end of February". If there are any weekdays to be set, then they
    // need to be removed until after the edge is set.
    var weekday = set.weekday;
    delete set.weekday;
    afterDateSet(function() {
      if (isDefined(weekday)) {
        set.weekday = weekday;
      }
      setUnitEdge(set);
    });
  }

  function handleFractionalTime() {
    iterateOverLowerDateUnits(function(name, u) {
      var value = set[name] || 0, fraction = value % 1;
      if (fraction) {
        set[u.lower.name] = round(fraction * (name === 'second' ? 1000 : 60));
        set[name] = trunc(value);
      }
    });
  }

  function separateLowerUnits(unitIndex) {
    var params;

    iterateOverDateParamUnits(true, function(name, specificityIndex) {
      if (dateParamIsDefined(set, name)) {
        // If there is a time unit set that is more specific than
        // the matched unit we have a string like "5:30am in 2 minutes",
        // which is meaningless, so invalidate the date.
        if (specificityIndex >= unitIndex) {
          invalidateDate(date);
          return false;
        }
        // ...otherwise set the params to set the absolute date
        // as a callback after the relative date has been set.
        params = params || {};
        params[name] = getDateParam(set, name);
        deleteDateParam(set, name);
      }
    });
    if (params) {
      afterDateSet(function() {
        if (unitIndex === MONTH_INDEX && isDefined(params.weekday)) {
          // If the relative unit was "months", and a weekday is set, then we
          // have a format like "the first friday of next month", which is
          // relative to the first of the month, so reset the date here to
          // allow for this.
          setDate(date, 1);
        }
        updateDate(date, params, true, false, options.prefer, weekdayDir);
      });
      if (set.edge) {
        // Allow formats like "the end of March of next year"
        params.edge = set.edge;
        afterDateSet(function() {
          setUnitEdge(params);
        });
        delete set.edge;
      }
    }
  }

  function setUnitEdge(params) {
    var val = params.edge, unit;
    iterateOverHigherDateUnits(function(name) {
      if (isDefined(params[name])) {
        unit = name;
        return false;
      }
    });
    if (unit === 'year') {
      params.specificity = 'month';
    } else if (unit === 'month' || unit === 'week') {
      params.specificity = 'day';
    }
    // "edge" values that are at the very edge are "2" so the beginning of the
    // year is -2 and the end of the year is 2. Conversely, the "last day" is
    // actually 00:00am so it is 1. -1 is reserved but unused for now.
    if (val < 0) {
      moveToBeginningOfUnit(date, unit, options.locale);
    } else {
      moveToEndOfUnit(date, unit, options.locale);
      if (val === 1) {
        resetTime(date);
      }
    }
    if (isDefined(params.weekday)) {
      // If a weekday is defined then set it here. If we are at the end of the
      // month, then force a previous weekday otherwise force the next weekday.
      setWeekday(date, params.weekday, -val);
      resetTime(date);
    }
  }

  if (contextDate && d) {
    // If a context date is passed, (in the case of "get"
    // and "unitsFromNow") then use it as the starting point.
    date = cloneDateByFlag(contextDate);
  } else {
    date = getNewDate();
  }

  _utc(date, options.fromUTC);

  if (isDate(d)) {
    date = cloneDateByFlag(d);
  } else if (isObjectType(d)) {
    set = simpleClone(d);
    updateDate(date, set, true);
  } else if (isNumber(d) || d === null) {
    date.setTime(d);
  } else if (isString(d)) {

    d = d.toLowerCase();

    // The act of getting the locale will pre-initialize
    // if it is missing and add the required formats.
    loc = localeManager.get(options.locale);

    if (loc) {

      forEachProperty(loc.getFormats(), function(i, dif) {
        var match = d.match(dif.reg);

        if (match) {
          loc.setCachedFormat(dif);
          set = getFormatMatch(match, dif);

          if (isDefined(set.timestamp)) {
            set = set.timestamp;
            return false;
          }

          if (isDefined(set.shift) && isUndefined(set.unit)) {
            // "next january", "next monday", etc
            handleUnitlessShift();
          }

          if (isDefined(set.num) && isDefined(set.month) && isUndefined(set.date) && isUndefined(set.weekday)) {
            // "The second of March"
            set.date = set.num;
          }

          if (isDefined(set.num) && isDefined(set.weekday) && isDefined(set.month)) {
            // If we have "the 2nd Tuesday of June", then pass the "weekdayDir"
            // flag along to updateDate so that the date does not accidentally traverse
            // into the previous month. This needs to be independent of the "prefer"
            // flag because we are only ensuring that the weekday is in the future, not
            // the entire date.
            set.weekday = 7 * (set.num - 1) + set.weekday;
            weekdayDir = 1;
          }

          if (set.midday) {
            // "noon" and "midnight"
            handleMidday(set.midday);
          }

          if (isDefined(set.day)) {
            // Relative day localizations such as "today" and "tomorrow".
            handleRelativeDay(set.day);
          }

          if (isDefined(set.ampm)) {
            handleAmpm(set.ampm);
          }

          if (set.utc || isDefined(set.offsetHour)) {
            handleTimezoneOffset(set.offsetHour, set.offsetMinute, set.offsetSign);
          }

          if (isDefined(set.unit)) {
            handleRelativeUnit(set.unit);
          }

          if (set.edge) {
            handleUnitEdge();
          }

          if (set.yearSign) {
            set.year *= set.yearSign;
          }

          handleFractionalTime();

          return false;
        }
      });
    }

    if (!set) {
      // Fall back to native parsing
      date = new Date(d);
      if (options.fromUTC) {
        // Falling back to system date here which cannot be parsed as UTC,
        // so if we're forcing UTC then simply add the offset.
        date.setTime(date.getTime() + (tzOffset(date) * MINUTES));
      }
    } else if (relative) {
      updateDate(date, set, false, 1);
    } else {
      if (_utc(date)) {
        // UTC times can traverse into other days or even months,
        // so preemtively reset the time here to prevent this.
        resetTime(date);
      }
      updateDate(date, set, true, 0, options.prefer, weekdayDir);
    }
    fireCallbacks();
  }
  // A date created by parsing a string presumes that the format *itself* is
  // UTC, but not that the date, once created, should be manipulated as such. In
  // other words, if you are creating a date object from a server time
  // "2012-11-15T12:00:00Z", in the majority of cases you are using it to create
  // a date that will, after creation, be manipulated as local, so reset the utc
  // flag here unless "setUTC" is also set.
  _utc(date, !!options.setUTC);
  return {
    date: date,
    set: set
  };
}

// If the year is two digits, add the most appropriate century prefix.
function getYearFromAbbreviation(str, d, prefer) {
  var relYear = getYear(d), yearEnd = +str, dyear, year;
  year = withPrecision(relYear, -2) - withPrecision(yearEnd, -2) + yearEnd;
  if (prefer) {
    dyear = year - relYear;
    if (dyear / abs(dyear) !== prefer) {
      year += prefer * 100;
    }
  }
  return year;
}

function setISOWeekNumber(d, num) {
  if (isNumber(num)) {
    // Consciously avoiding updateDate here to prevent circular dependencies.
    var isoWeek = cloneDate(d), dow = getWeekday(d);
    moveToFirstDayOfWeekYear(isoWeek, ISO_FIRST_DAY_OF_WEEK, ISO_FIRST_DAY_OF_WEEK_YEAR);
    setDate(isoWeek, getDate(isoWeek) + 7 * (num - 1));
    setYear(d, getYear(isoWeek));
    setMonth(d, getMonth(isoWeek));
    setDate(d, getDate(isoWeek));
    setWeekday(d, dow || 7);
  }
  return d.getTime();
}

function getWeekNumber(d, allowPrevious, firstDayOfWeek, firstDayOfWeekYear) {
  var isoWeek, n = 0;
  if (isUndefined(firstDayOfWeek)) {
    firstDayOfWeek = ISO_FIRST_DAY_OF_WEEK;
  }
  if (isUndefined(firstDayOfWeekYear)) {
    firstDayOfWeekYear = ISO_FIRST_DAY_OF_WEEK_YEAR;
  }
  // Moving to the end of the week allows for forward year traversal, ie
  // Dec 29 2014 is actually week 01 of 2015.
  isoWeek = moveToEndOfWeek(cloneDate(d), firstDayOfWeek);
  moveToFirstDayOfWeekYear(isoWeek, firstDayOfWeek, firstDayOfWeekYear);
  if (allowPrevious && d < isoWeek) {
    // If the date is still before the start of the year, then it should be
    // the last week of the previous year, ie Jan 1 2016 is actually week 53
    // of 2015, so move to the beginning of the week to traverse the year.
    isoWeek = moveToBeginningOfWeek(cloneDate(d), firstDayOfWeek);
    moveToFirstDayOfWeekYear(isoWeek, firstDayOfWeek, firstDayOfWeekYear);
  }
  while (isoWeek <= d) {
    // Doing a very simple walk to get the week number.
    setDate(isoWeek, getDate(isoWeek) + 7);
    n++;
  }
  return n;
}

function getWeekYear(d, localeCode, iso) {
  var year, month, firstDayOfWeek, firstDayOfWeekYear, week, loc;
  year = getYear(d);
  month = getMonth(d);
  if (month === 0 || month === 11) {
    if (!iso) {
      loc = localeManager.get(localeCode);
      firstDayOfWeek = loc.getFirstDayOfWeek(localeCode);
      firstDayOfWeekYear = loc.getFirstDayOfWeekYear(localeCode);
    }
    week = getWeekNumber(d, false, firstDayOfWeek, firstDayOfWeekYear);
    if (month === 0 && week === 0) {
      year -= 1;
    } else if (month === 11 && week === 1) {
      year += 1;
    }
  }
  return year;
}

function moveToEndOfWeek(d, firstDayOfWeek) {
  var target = firstDayOfWeek - 1;
  setWeekday(d, ceil((getWeekday(d) - target) / 7) * 7 + target);
  return d;
}

function moveToBeginningOfWeek(d, firstDayOfWeek) {
  setWeekday(d, floor((getWeekday(d) - firstDayOfWeek) / 7) * 7 + firstDayOfWeek);
  return d;
}

function moveToFirstDayOfWeekYear(d, firstDayOfWeek, firstDayOfWeekYear) {
  resetUnitAndLower(d, 'month');
  setDate(d, firstDayOfWeekYear);
  moveToBeginningOfWeek(d, firstDayOfWeek);
}

function daysInMonth(d) {
  return 32 - callDateGet(new Date(getYear(d), getMonth(d), 32), 'Date');
}

// Gets an "adjusted date unit" which is a way of representing
// the largest possible meaningful unit. In other words, if passed
// 3600000, this will return an array which represents "1 hour".
function getAdjustedUnit(ms, fn) {
  var unitIndex = 0, value = 0;
  iterateOverDateUnitsReverse(function(name, u, i) {
    value = abs(fn(u));
    if (value >= 1) {
      unitIndex = i;
      return false;
    }
  });
  return [value, unitIndex, ms];
}

// Gets the adjusted unit based on simple division by
// date unit multiplier.
function getAdjustedUnitForNumber(ms) {
  return getAdjustedUnit(ms, function(unit) {
    return trunc(withPrecision(ms / unit.multiplier, 1));
  });
}

// Gets the adjusted unit using the unitsFromNow methods,
// which use internal date methods that neatly avoid vaguely
// defined units of time (days in month, leap years, etc).
function getAdjustedUnitForDate(d, dRelative) {
  var ms;
  if (!dRelative) {
    dRelative = getNewDate();
    if (d > dRelative) {
      // If our date is greater than the one that we got from getNewDate, it
      // means that we are finding the unit for a date that is in the future
      // relative to now. However, often the incoming date was created in
      // the same cycle as our comparison, but our "now" date will have been
      // created an instant after it, creating situations where "5 minutes from
      // now" becomes "4 minutes from now" in the same tick. To prevent this,
      // subtract a buffer of 10ms to compensate.
      dRelative = new Date(dRelative.getTime() - 10);
    }
  }
  ms = d - dRelative;
  return getAdjustedUnit(ms, function(u) {
    return abs(getTimeDistanceForUnit(d, dRelative, u));
  });
}

function getMeridianForDate(d, localeCode) {
  var hours = getHours(d);
  return localeManager.get(localeCode).ampm[trunc(hours / 12)] || '';
}

// Date formatting helpers

// Formatting tokens
var ldmlTokens, strfTokens;

var dateFormatMatcher;

function buildDateFormatTokens() {

  function addFormats(target, tokens, fn) {
    if (tokens) {
      forEach(commaSplit(tokens), function(token) {
        target[token] = fn;
      });
    }
  }

  function buildLowercase(get) {
    return function(d, localeCode) {
      return get(d, localeCode).toLowerCase();
    };
  }

  function buildOrdinal(get) {
    return function(d, localeCode) {
      var n = get(d, localeCode);
      return n + localeManager.get(localeCode).getOrdinal(n);
    };
  }

  function buildPadded(get, padding) {
    return function(d, localeCode) {
      return padNumber(get(d, localeCode), padding);
    };
  }

  function buildTwoDigits(get) {
    return function(d, localeCode) {
      return get(d, localeCode) % 100;
    };
  }

  function buildAlias(alias) {
    return function(d, localeCode) {
      return dateFormatMatcher(alias, d, localeCode);
    };
  }

  function buildAlternates(f) {
    for (var n = 1; n <= 5; n++) {
      buildAlternate(f, n);
    }
  }

  function buildAlternate(f, n) {
    var alternate = function(d, localeCode) {
      return f.get(d, localeCode, n);
    };
    addFormats(ldmlTokens, f.ldml + n, alternate);
    if (f.lowerToken) {
      ldmlTokens[f.lowerToken + n] = buildLowercase(alternate);
    }
  }

  function getIdentityFormat(name) {
    return function(d, localeCode) {
      var loc = localeManager.get(localeCode);
      return dateFormatMatcher(loc[name], d, localeCode);
    };
  }

  ldmlTokens = {};
  strfTokens = {};

  forEach(FormatTokensBase, function(f) {
    var get = f.get, getPadded;
    if (f.lowerToken) {
      ldmlTokens[f.lowerToken] = buildLowercase(get);
    }
    if (f.ordinalToken) {
      ldmlTokens[f.ordinalToken] = buildOrdinal(get, f);
    }
    if (f.ldmlPaddedToken) {
      ldmlTokens[f.ldmlPaddedToken] = buildPadded(get, f.ldmlPaddedToken.length);
    }
    if (f.ldmlTwoDigitToken) {
      ldmlTokens[f.ldmlTwoDigitToken] = buildPadded(buildTwoDigits(get), 2);
    }
    if (f.strfTwoDigitToken) {
      strfTokens[f.strfTwoDigitToken] = buildPadded(buildTwoDigits(get), 2);
    }
    if (f.strfPadding) {
      getPadded = buildPadded(get, f.strfPadding);
    }
    if (f.alias) {
      get = buildAlias(f.alias);
    }
    if (f.allowAlternates) {
      buildAlternates(f);
    }
    addFormats(ldmlTokens, f.ldml, get);
    addFormats(strfTokens, f.strf, getPadded || get);
  });

  forEachProperty(CoreOutputFormats, function(name, src) {
    addFormats(ldmlTokens, name, buildAlias(src));
  });

  defineInstanceSimilar(sugarDate, 'short,medium,long,full', function(methods, name) {
    var fn = getIdentityFormat(name);
    addFormats(ldmlTokens, name, fn);
    methods[name] = fn;
  });

  addFormats(ldmlTokens, 'time', getIdentityFormat('time'));
  addFormats(ldmlTokens, 'stamp', getIdentityFormat('stamp'));
}

function buildDateFormatMatcher() {

  function getLdml(d, token, localeCode) {
    return getOwn(ldmlTokens, token)(d, localeCode);
  }

  function getStrf(d, token, localeCode) {
    return getOwn(strfTokens, token)(d, localeCode);
  }

  function checkDateToken(ldml, strf) {
    return hasOwn(ldmlTokens, ldml) || hasOwn(strfTokens, strf);
  }

  // Format matcher for LDML or STRF tokens.
  dateFormatMatcher = createFormatMatcher(getLdml, getStrf, checkDateToken);
}

function dateRelative(d, fn, localeCode) {
  var adu, format;
  if (!dateIsValid(d)) {
    return d.toString();
  }
  if (fn) {
    adu = getAdjustedUnitForDate(d);
    format = fn.apply(d, adu.concat(localeManager.get(localeCode)));
    if (format) {
      return dateFormat(d, format, localeCode);
    }
  }
  adu = adu || getAdjustedUnitForDate(d);
  // Adjust up if time is in ms, as this doesn't
  // look very good for a standard relative date.
  if (adu[1] === 0) {
    adu[1] = 1;
    adu[0] = 1;
  }
  return localeManager.get(localeCode).getRelativeFormat(adu);
}

function dateFormat(d, format, localeCode) {
  if (!dateIsValid(d)) {
    return d.toString();
  }
  format = CoreOutputFormats[format] || format || '{long}';
  return dateFormatMatcher(format, d, localeCode);
}

// Date comparison helpers

function fullCompareDate(date, d, margin) {
  var tmp;
  if (!dateIsValid(date)) return;
  if (isString(d)) {
    d = trim(d).toLowerCase();
    switch(true) {
      case d === 'future':    return date.getTime() > getNewDate().getTime();
      case d === 'past':      return date.getTime() < getNewDate().getTime();
      case d === 'today':     return compareDay(date);
      case d === 'tomorrow':  return compareDay(date,  1);
      case d === 'yesterday': return compareDay(date, -1);
      case d === 'weekday':   return getWeekday(date) > 0 && getWeekday(date) < 6;
      case d === 'weekend':   return getWeekday(date) === 0 || getWeekday(date) === 6;

      case (isDefined(tmp = English.weekdayMap[d])):
        return getWeekday(date) === tmp;
      case (isDefined(tmp = English.monthMap[d])):
        return getMonth(date) === tmp;
    }
  }
  return compareDate(date, d, margin);
}

function compareDate(date, d, margin, localeCode, options) {
  var loMargin = 0, hiMargin = 0, override, min, max, p, t;

  function getMaxBySpecificity() {
    var params = getDateParamsFromString('1 ' + p.set.specificity);
    return updateDate(cloneDate(p.date), params, false, 1).getTime() - 1;
  }

  if (_utc(date)) {
    options = options || {};
    options.fromUTC = true;
    options.setUTC = true;
  }

  p = getExtendedDate(null, d, options);

  if (margin > 0) {
    loMargin = hiMargin = margin;
    override = true;
  }
  if (!dateIsValid(p.date)) return false;
  if (p.set && p.set.specificity) {
    if (isDefined(p.set.edge) || isDefined(p.set.shift)) {
      moveToBeginningOfUnit(p.date, p.set.specificity, localeCode);
    }
    if (p.set.specificity === 'month') {
      max = moveToEndOfUnit(cloneDate(p.date), p.set.specificity, localeCode).getTime();
    } else {
      max = getMaxBySpecificity();
    }
    if (!override && isDefined(p.set.sign) && p.set.specificity !== 'millisecond') {
      // If the time is relative, there can occasionally be an disparity between
      // the relative date and "now", which it is being compared to, so set an
      // extra margin to account for this.
      loMargin = 50;
      hiMargin = -50;
    }
  }
  t   = date.getTime();
  min = p.date.getTime();
  max = max || min;
  var timezoneShift = getTimezoneShift(date, p);
  if (timezoneShift) {
    min -= timezoneShift;
    max -= timezoneShift;
  }
  return t >= (min - loMargin) && t <= (max + hiMargin);
}

function compareDay(d, shift) {
  var comp = getNewDate();
  if (shift) {
    setDate(comp, getDate(comp) + shift);
  }
  return getYear(d) === getYear(comp) &&
         getMonth(d) === getMonth(comp) &&
         getDate(d) === getDate(comp);
}

function getTimezoneShift(d, p) {
  // If there is any specificity in the date then we're implicitly not
  // checking absolute time, so ignore timezone shifts.
  if (p.set && p.set.specificity) {
    return 0;
  }
  return (tzOffset(p.date) - tzOffset(d)) * MINUTES;
}

function updateDate(d, params, reset, advance, prefer, weekdayDir) {
  var specificityIndex, noop = true;

  function getParam(key) {
    return getDateParam(params, key);
  }

  function paramExists(key) {
    return dateParamIsDefined(params, key);
  }

  function uniqueParamExists(key, isDay) {
    return paramExists(key) || (isDay && paramExists('weekday') && !paramExists('month'));
  }

  function canDisambiguate() {
    switch(prefer) {
      case -1: return d > getNewDate();
      case  1: return d < getNewDate();
    }
  }

  function setUnit(u, advance, value) {
    var name = u.name, method = u.method, checkMonth;
    if (isUndefined(value)) return;

    noop = false;
    checkMonth = name === 'month' && getDate(d) > 28;

    // If we are advancing or rewinding, then we need we need to set the
    // absolute time if the unit is "hours" or less. This is due to the fact
    // that setting by method is ambiguous during DST shifts. For example,
    // 1:00am on November 1st 2015 occurs twice in North American timezones
    // with DST, the second time being after the clocks are rolled back at
    // 2:00am. When springing forward this is automatically handled as there
    // is no 2:00am so the date automatically jumps to 3:00am. However, when
    // rolling back, setHours(2) will always choose the first "2am" even if
    // the date is currently set to the second, causing unintended jumps.
    // This ambiguity is unavoidable when setting dates as the notation is
    // ambiguous. However when advancing, we clearly want the resulting date
    // to be an acutal hour ahead, which can only accomplished by setting the
    // absolute time. Conversely, any unit higher than "hours" MUST use the
    // internal set methods, as they are ambiguous as absolute units of time.
    // Years may be 365 or 366 days depending on leap years, months are all
    // over the place, and even days may be 23-25 hours depending on DST shifts.
    // Finally, the kind of jumping described above will happen if ANY "set"
    // method is called on the date, so compensating for this in callDateSet
    // by not calling any set methods if the value is the same.
    if (advance && !u.higher) {
      d.setTime(d.getTime() + (value * advance * u.multiplier));
      return;
    } else if (advance) {
      if (name === 'week') {
        value *= 7;
        method = 'Date';
      }
      value = (value * advance) + callDateGet(d, method);
    }
    callDateSetWithWeek(d, method, value);
    if (checkMonth && monthHasShifted(d, value)) {
      // As we are setting the units in reverse order, there is a chance that
      // our date may accidentally traverse into a new month, such as setting
      // { month: 1, date 15 } on January 31st. Check for this here and reset
      // the date to the last day of the previous month if this has happened.
      setDate(d, 0);
    }
  }

  if (isNumber(params) && advance) {
    // If param is a number and advancing, the number is in milliseconds.
    params = { milliseconds: params };
  } else if (isNumber(params)) {
    // Otherwise just set the timestamp and return.
    d.setTime(params);
    return d;
  } else if (!getKeys(params).length) {
    // If no parameters are set, then simply return the date.
    return d;
  }

  // "date" can also be passed for the day
  if (isDefined(params.date)) {
    params.day = params.date;
  }

  // Reset any unit lower than the least specific unit set. Do not do this for
  // weeks or for years. This needs to be performed before actually setting the
  // date because the order needs to be reversed in order to get the lowest
  // specificity, also because higher order units can be overridden by lower
  // order units, such as setting hour: 3, minute: 345, etc.
  iterateOverDateUnits(function(name, u, i) {
    var isDay = name === 'day';
    if (uniqueParamExists(name, isDay)) {
      params.specificity = name;
      specificityIndex = i;
      noop = false;
      return false;
    } else if (reset && name !== 'week' && (!isDay || !paramExists('week'))) {
      // Days are relative to months, not weeks, so don't reset if a week exists.
      callDateSet(d, u.method, u.resetValue || 0);
    }
  });

  // Now actually set or advance the date in order, higher units first.
  iterateOverDateUnitsReverse(function(name, u) {
    setUnit(u, advance, getParam(name));
  });

  // If a weekday is included in the params and no 'date' parameter is
  // overriding, set it here after all other units have been set. Note that
  // the date has to be perfectly set before disambiguation so that a proper
  // comparison can be made.
  if (!advance && !paramExists('day') && paramExists('weekday')) {
    setWeekday(d, getParam('weekday'), weekdayDir);
  }

  // If no params are set, then the date should have been returne above, so
  // if the update operation is still a noop, it means that incorrect keys
  // were passed to the params object, so invalidate the date here.
  if (noop) {
    invalidateDate(d);
    return d;
  }

  // If past or future is preferred, then the process of "disambiguation" will
  // ensure that an ambiguous time/date ("4pm", "thursday", "June", etc.) will
  // be in the past or future. Weeks are only considered ambiguous if there is
  // a weekday, i.e. "thursday" is an ambiguous week, but "the 4th" is an
  // ambiguous month.
  if (canDisambiguate()) {
    iterateOverDateUnits(function(name, u) {
      var ambiguous = u.higher && (name !== 'week' || paramExists('weekday'));
      if (ambiguous && !uniqueParamExists(name, name === 'day')) {
        setUnit(u, prefer, 1);
        return false;
      }
    }, specificityIndex + 1);
  }
  return d;
}

function monthHasShifted(d, targetMonth) {
  if (targetMonth < 0) {
    targetMonth = targetMonth % 12 + 12;
  }
  return targetMonth % 12 !== getMonth(d);
}

function createDate(d, options) {
  return getExtendedDate(null, d, options).date;
}

function createDateWithContext(contextDate, d, options) {
  return getExtendedDate(contextDate, d, options).date;
}

function invalidateDate(d) {
  d.setTime(NaN);
}

function buildDateUnits() {
  DateUnitsByName = {};
  forEach(DateUnits, function(u, i) {
    var name = u.name;
    // Skip week entirely.
    if (name !== 'week') {
      DateUnitsByName[name] = u;
      DateUnitsByName[name + 's'] = u;
      // Build a chain of lower units.
      u.lower = DateUnits[i - (name === 'month' ? 2 : 1)];
    }
  });
  DateUnitsByName['date'] = DateUnitsByName['day'];
}

/***
 * @method [units]Since([d], [options])
 * @returns Number
 * @short Returns the time since [d].
 * @extra [d] will accept a date object, timestamp, or string. If not specified,
 *        [d] is assumed to be now. `unitsAgo` is provided as an alias to make
 *        this more readable when [d] is assumed to be the current date. See
 *        `create` for options.
 *
 * @set
 *   millisecondsSince
 *   secondsSince
 *   minutesSince
 *   hoursSince
 *   daysSince
 *   weeksSince
 *   monthsSince
 *   yearsSince
 *
 * @example
 *
 *   new Date().millisecondsSince('1 hour ago') -> 3,600,000
 *   new Date().daysSince('1 week ago')         -> 7
 *   new Date().yearsSince('15 years ago')      -> 15
 *   lastYear.yearsAgo()                 -> 1
 *
 ***
 * @method [units]Ago()
 * @returns Number
 * @short Returns the time ago in the appropriate unit.
 *
 * @set
 *   millisecondsAgo
 *   secondsAgo
 *   minutesAgo
 *   hoursAgo
 *   daysAgo
 *   weeksAgo
 *   monthsAgo
 *   yearsAgo
 *
 * @example
 *
 *   lastYear.millisecondsAgo() -> 3,600,000
 *   lastYear.daysAgo()         -> 7
 *   lastYear.yearsAgo()        -> 15
 *
 ***
 * @method [units]Until([d], [options])
 * @returns Number
 * @short Returns the time until [d].
 * @extra [d] will accept a date object, timestamp, or string. If not specified,
 *        [d] is assumed to be now. `unitsFromNow` is provided as an alias to
 *        make this more readable when [d] is assumed to be the current date.
 *        See `create` for options.
 *
 *
 * @set
 *   millisecondsUntil
 *   secondsUntil
 *   minutesUntil
 *   hoursUntil
 *   daysUntil
 *   weeksUntil
 *   monthsUntil
 *   yearsUntil
 *
 * @example
 *
 *   new Date().millisecondsUntil('1 hour from now') -> 3,600,000
 *   new Date().daysUntil('1 week from now')         -> 7
 *   new Date().yearsUntil('15 years from now')      -> 15
 *   nextYear.yearsFromNow()                  -> 1
 *
 ***
 * @method [units]FromNow()
 * @returns Number
 * @short Returns the time from now in the appropriate unit.
 *
 * @set
 *   millisecondsFromNow
 *   secondsFromNow
 *   minutesFromNow
 *   hoursFromNow
 *   daysFromNow
 *   weeksFromNow
 *   monthsFromNow
 *   yearsFromNow
 *
 * @example
 *
 *   nextYear.millisecondsFromNow() -> 3,600,000
 *   nextYear.daysFromNow()         -> 7
 *   nextYear.yearsFromNow()        -> 15
 *
 ***
 * @method add[Units](<n>, [reset] = false)
 * @returns Date
 * @short Adds <n> units to the date. If [reset] is true, all lower units will
 *        be reset.
 * @extra Note that in the case of `addMonths`, the date may fall on a date
 *        that doesn't exist (i.e. February 30). In this case the date will be
 *        shifted to the last day of the month. Don't use `addMonths` if you
 *        need precision.
 *
 * @set
 *   addMilliseconds
 *   addSeconds
 *   addMinutes
 *   addHours
 *   addDays
 *   addWeeks
 *   addMonths
 *   addYears
 *
 * @example
 *
 *   new Date().addYears(5)        -> current time + 5 years
 *   new Date().addDays(5)         -> current time + 5 days
 *   new Date().addDays(5, true)   -> current time + 5 days (time reset)
 *
 ***
 * @method isLast[Unit]([locale])
 * @returns Boolean
 * @short Returns true if the date is last week, month, or year.
 * @extra This method takes an optional locale code for `isLastWeek`, which is
 *        locale dependent. The default locale code is `en`, which places
 *        Sunday at the beginning of the week. You can pass `en-GB` as a quick
 *        way to force Monday as the beginning of the week.
 *
 * @set
 *   isLastWeek
 *   isLastMonth
 *   isLastYear
 *
 * @example
 *
 *   yesterday.isLastWeek()  -> true or false?
 *   yesterday.isLastMonth() -> probably not...
 *   yesterday.isLastYear()  -> even less likely...
 *
 ***
 * @method isThis[Unit]([locale])
 * @returns Boolean
 * @short Returns true if the date is this week, month, or year.
 * @extra This method takes an optional locale code for `isThisWeek`, which is
 *        locale dependent. The default locale code is `en`, which places
 *        Sunday at the beginning of the week. You can pass `en-GB` as a quick
 *        way to force Monday as the beginning of the week.
 *
 * @set
 *   isThisWeek
 *   isThisMonth
 *   isThisYear
 *
 * @example
 *
 *   tomorrow.isThisWeek()  -> true or false?
 *   tomorrow.isThisMonth() -> probably...
 *   tomorrow.isThisYear()  -> signs point to yes...
 *
 ***
 * @method isNext[Unit]([locale])
 * @returns Boolean
 * @short Returns true if the date is next week, month, or year.
 * @extra This method takes an optional locale code for `isNextWeek`, which is
 *        locale dependent. The default locale code is `en`, which places
 *        Sunday at the beginning of the week. You can pass `en-GB` as a quick
 *        way to force Monday as the beginning of the week.
 *
 * @set
 *   isNextWeek
 *   isNextMonth
 *   isNextYear
 *
 * @example
 *
 *   tomorrow.isNextWeek()  -> true or false?
 *   tomorrow.isNextMonth() -> probably not...
 *   tomorrow.isNextYear()  -> even less likely...
 *
 ***
 * @method beginningOf[Unit]([locale])
 * @returns Date
 * @short Sets the date to the beginning of the appropriate unit.
 * @extra This method takes an optional locale code for `beginningOfWeek`,
 *        which is locale dependent. If consistency is needed, use
 *        `beginningOfISOWeek` instead.
 *
 * @set
 *   beginningOfDay
 *   beginningOfWeek
 *   beginningOfMonth
 *   beginningOfYear
 *
 * @example
 *
 *   new Date().beginningOfDay()   -> the beginning of today (resets the time)
 *   new Date().beginningOfWeek()  -> the beginning of the week
 *   new Date().beginningOfMonth() -> the beginning of the month
 *   new Date().beginningOfYear()  -> the beginning of the year
 *
 ***
 * @method endOf[Unit]([locale])
 * @returns Date
 * @short Sets the date to the end of the appropriate unit.
 * @extra This method takes an optional locale code for `endOfWeek`, which is
 *        locale dependent. If consistency is needed, use `endOfISOWeek`
 *        instead.
 *
 * @set
 *   endOfDay
 *   endOfWeek
 *   endOfMonth
 *   endOfYear
 *
 * @example
 *
 *   new Date().endOfDay()   -> the end of today (sets the time to 23:59:59.999)
 *   new Date().endOfWeek()  -> the end of the week
 *   new Date().endOfMonth() -> the end of the month
 *   new Date().endOfYear()  -> the end of the year
 *
 ***/
function buildDateUnitMethods() {

  defineInstanceSimilar(sugarDate, DateUnits, function(methods, u, i) {
    var name = u.name, caps = simpleCapitalize(name);

    if (i > DAY_INDEX) {
      forEach(['Last','This','Next'], function(shift) {
        methods['is' + shift + caps] = function(d, localeCode) {
          return compareDate(d, shift + ' ' + name, 0, localeCode, { locale: 'en' });
        };
      });
    }
    if (i > HOURS_INDEX) {
      methods['beginningOf' + caps] = function(d, localeCode) {
        return moveToBeginningOfUnit(d, name, localeCode);
      };
      methods['endOf' + caps] = function(d, localeCode) {
        return moveToEndOfUnit(d, name, localeCode);
      };
    }

    methods['add' + caps + 's'] = function(d, num, reset) {
      return advanceDate(d, name, num, reset);
    };

    var since = function(date, d, options) {
      return getTimeDistanceForUnit(date, createDateWithContext(date, d, options), u);
    };
    var until = function(date, d, options) {
      return getTimeDistanceForUnit(createDateWithContext(date, d, options), date, u);
    };

    methods[u.name + 'sAgo']   = methods[u.name + 'sUntil']   = until;
    methods[u.name + 'sSince'] = methods[u.name + 'sFromNow'] = since;

  });

}

/***
 * @method is[Day]()
 * @returns Boolean
 * @short Returns true if the date falls on the specified day.
 *
 * @set
 *   isToday
 *   isYesterday
 *   isTomorrow
 *   isWeekday
 *   isWeekend
 *   isSunday
 *   isMonday
 *   isTuesday
 *   isWednesday
 *   isThursday
 *   isFriday
 *   isSaturday
 *
 * @example
 *
 *   tomorrow.isToday() -> false
 *   thursday.isTomorrow() -> ?
 *   yesterday.isWednesday() -> ?
 *   today.isWeekend() -> ?
 *
 ***
 * @method isFuture()
 * @returns Boolean
 * @short Returns true if the date is in the future.
 *
 * @example
 *
 *   lastWeek.isFuture() -> false
 *   nextWeek.isFuture() -> true
 *
 ***
 * @method isPast()
 * @returns Boolean
 * @short Returns true if the date is in the past.
 *
 * @example
 *
 *   lastWeek.isPast() -> true
 *   nextWeek.isPast() -> false
 *
 ***/
function buildRelativeAliases() {
  var special  = commaSplit('Today,Yesterday,Tomorrow,Weekday,Weekend,Future,Past');
  var weekdays = English.weekdays.slice(0, 7);
  var months   = English.months.slice(0, 12);
  var together = special.concat(weekdays).concat(months);
  defineInstanceSimilar(sugarDate, together, function(methods, name) {
    methods['is'+ name] = function(d) {
      return fullCompareDate(d, name);
    };
  });
}

defineStatic(sugarDate, {

  /***
   * @method create(<d>, [options])
   * @returns Date
   * @static
   * @short Alternate date constructor which accepts text formats, a timestamp,
   *        objects, or another date.
   * @extra If no argument is given, the date is assumed to be now. The second
   *        argument can either be an options object or a locale code as a
   *        shortcut. For more, see `date input formats`.
   *
   * @options
   *
   *   locale     A locale code to parse the date in. This can also be passed as
   *              the second argument to this method. Default is the current
   *              locale, which is `en` if none is set.
   *
   *   past       If `true`, ambiguous dates like `Sunday` will be parsed as
   *              `last Sunday`. Note that non-ambiguous dates are not
   *              guaranteed to be in the past.
   *              Default is `false`.
   *
   *   future     If `true`, ambiguous dates like `Sunday` will be parsed as
   *              `next Sunday`. Note that non-ambiguous dates are not
   *              guaranteed to be in the future.
   *              Default is `false`.
   *
   *   fromUTC    If `true`, dates with no timezone notation will be parsed as
   *              UTC (no timezone offset). This is useful for server
   *              timestamps, etc. Note that this flag is not required if the
   *              timezone is specified in the string, either as an explicit
   *              value (ex. +0900 or -09:00) or "Z", which is UTC time.
   *
   *   setUTC     If `true`, this will set a flag on the date that tells Sugar
   *              to internally use UTC methods like `getUTCHours` when handling
   *              the date. This flag is the same as calling the `setUTC` method
   *              on the date after parsing is complete. Note that this is
   *              different from `fromUTC`, which parses a string as UTC, but
   *              does not set this flag.
   *
   *   set        An optional object that is populated with properties that are
   *              parsed from string input. This option is useful when parsed
   *              properties need to be retained.
   *
   * @example
   *
   *   Date.create('July')                      -> July of this year
   *   Date.create('1776')                      -> 1776
   *   Date.create('today')                     -> today
   *   Date.create('Wednesday')                 -> This wednesday
   *   Date.create('next Friday')               -> Next friday
   *   Date.create('July 4, 1776')              -> July 4, 1776
   *   Date.create(-446806800000)               -> November 5, 1955
   *   Date.create('1776年07月04日', 'ja')      -> July 4, 1776
   *   Date.create('August', {past: true})      -> August of this or last year
   *   Date.create('August', {future: true})    -> August of this or next year
   *   Date.create('Thursday', {fromUTC: true}) -> Thursday at 12:00am UTC time
   *
   ***/
  'create': function(d, options) {
    return createDate(d, options);
  },

  /***
   * @method getLocale([code] = current)
   * @returns Locale
   * @static
   * @short Gets the locale object for the given code, or the current locale.
   * @extra The locale object has various properties that dictate how dates are
   *        parsed and formatted for that locale. The locale object is exposed
   *        here mostly for introspection - it should be uncommon to need to
   *        maniplate the object itself. For more, see `date locales`.
   *
   * @example
   *
   *   Date.getLocale()     -> Returns the current locale
   *   Date.getLocale('en') -> Returns the EN locale
   *
   ***/
  'getLocale': function(code) {
    return localeManager.get(code, !code);
  },

  /***
   * @method getAllLocales()
   * @returns Object
   * @static
   * @short Returns all available locales as an object.
   * @extra For more, see `date locales`.
   * @example
   *
   *   Date.getAllLocales()
   *
   ***/
  'getAllLocales': function() {
    return localeManager.getAll();
  },

  /***
   * @method getAllLocaleCodes()
   * @returns Array
   * @static
   * @short Returns all available locale codes as an array of strings.
   * @extra For more, see `date locales`.
   * @example
   *
   *   Date.getAllLocaleCodes()
   *
   ***/
  'getAllLocaleCodes': function() {
    return getKeys(localeManager.getAll());
  },

  /***
   * @method setLocale(<code>)
   * @returns Locale
   * @static
   * @short Sets the current locale to be used with dates.
   * @extra Sugar has native support for 17 major locales. In addition, you can
   *        define a new locale with `addLocale`. For more, see `date locales`.
   * @example
   *
   *   Date.setLocale('en')
   *
   ***/
  'setLocale': function(code) {
    return localeManager.set(code);
  },

  /***
   * @method addLocale(<code>, <def>)
   * @returns Locale
   * @static
   * @short Adds a locale definition to the locales understood by Sugar.
   * @extra This method should only be required for adding locale definitions
   *        that don't already exist. For more, see `date locales`.
   * @example
   *
   *   Date.addLocale('eo', {})
   *
   ***/
  'addLocale': function(code, set) {
    return localeManager.add(code, set);
  },

  /***
   * @method removeLocale(<code>)
   * @returns Locale
   * @static
   * @short Deletes the the locale by <code> from Sugar's known locales.
   * @extra For more, see `date locales`.
   * @example
   *
   *   Date.removeLocale('foo')
   *
   ***/
  'removeLocale': function(code) {
    return localeManager.remove(code);
  }

});

defineInstanceWithArguments(sugarDate, {

  /***
   * @method set(<set>, [reset] = false)
   * @returns Date
   * @short Sets the date object.
   * @extra This method accepts multiple formats including a single number as
   *        a timestamp, an object, or enumerated arguments. If [reset] is
   *        `true`, any units more specific than those passed will be reset.
   *
   * @example
   *
   *   new Date().set({year:2011,month:11,day:31}) -> December 31, 2011
   *   new Date().set(2011, 11, 31)                -> December 31, 2011
   *   new Date().set(86400000)                    -> 1 day after Jan 1, 1970
   *   new Date().set({year:2004,month:6}, true)   -> June 1, 2004, 00:00:00.000
   *
   ***/
  'set': function(d, args) {
    args = collectDateArguments(args);
    return updateDate(d, args[0], args[1]);
  },

  /***
   * @method advance(<set>, [reset] = false)
   * @returns Date
   * @short Shifts the date forward.
   * @extra <set> accepts multiple formats including an object, a string in the
   *        format "3 days", a single number as milliseconds, or enumerated
   *        parameters (as with the Date constructor). If [reset] is `true`, any
   *        units more specific than those passed will be reset. This method
   *        modifies the date!
   *
   * @example
   *
   *   new Date().advance({ year: 2 }) -> 2 years in the future
   *   new Date().advance('2 hours')   -> 2 hours in the future
   *   new Date().advance(0, 2, 3)     -> 2 months 3 days in the future
   *   new Date().advance(86400000)    -> 1 day in the future
   *
   ***/
  'advance': function(d, args) {
    return advanceDateWithArgs(d, args, 1);
  },

  /***
   * @method rewind(<set>, [reset] = false)
   * @returns Date
   * @short Shifts the date backward.
   * @extra [set] accepts multiple formats including an object, a string in the
   *        format "3 days", a single number as milliseconds, or enumerated
   *        parameters (as with the Date constructor). If [reset] is `true`, any
   *        units more specific than those passed will be reset. This method
   *        modifies the date!
   *
   * @example
   *
   *   new Date().rewind({ year: 2 }) -> 2 years in the past
   *   new Date().rewind('2 weeks')   -> 2 weeks in the past
   *   new Date().rewind(0, 2, 3)     -> 2 months 3 days in the past
   *   new Date().rewind(86400000)    -> 1 day in the past
   *
   ***/
  'rewind': function(d, args) {
    return advanceDateWithArgs(d, args, -1);
  }

});

defineInstance(sugarDate, {

  /***
   * @method get(<d>, [options])
   * @returns Date
   * @short Gets a new date using the current one as a starting point.
   * @extra This method is identical to `Date.create`, except that relative
   *        formats like `next month` are relative to the date instance rather
   *        than the current date. See `create` for options.
   *
   * @example
   *
   *   nextYear.get('monday') -> monday of the week exactly 1 year from now
   *   millenium.get('2 years before') -> 2 years before Jan 1, 2000.
   *
   ***/
  'get': function(date, d, options) {
    return createDateWithContext(date, d, options);
  },

  /***
   * @method setWeekday(<dow>)
   * @returns undefined
   * @short Sets the weekday of the date, starting with Sunday at `0`.
   *
   * @example
   *
   *   d = new Date(); d.setWeekday(1); d; -> Monday of this week
   *   d = new Date(); d.setWeekday(6); d; -> Saturday of this week
   *
   ***/
  'setWeekday': function(d, dow) {
    return setWeekday(d, dow);
  },

  /***
   * @method setISOWeek(<num>)
   * @returns undefined
   * @short Sets the week (of the year) as defined by the ISO8601 standard.
   * @extra Note that this standard places Sunday at the end of the week (day 7).
   *
   * @example
   *
   *   d = new Date(); d.setISOWeek(15); d; -> 15th week of the year
   *
   ***/
  'setISOWeek': function(d, num) {
    return setISOWeekNumber(d, num);
  },

  /***
   * @method getISOWeek()
   * @returns Number
   * @short Gets the date's week (of the year) as defined by the ISO8601 standard.
   * @extra Note that this standard places Sunday at the end of the week (day 7).
   *        If `utc` is set on the date, the week will be according to UTC time.
   *
   * @example
   *
   *   new Date().getISOWeek() -> today's week of the year
   *
   ***/
  'getISOWeek': function(d) {
    return getWeekNumber(d, true);
  },

  /***
   * @method beginningOfISOWeek()
   * @returns Date
   * @short Set the date to the beginning of week as defined by ISO8601.
   * @extra Note that this standard places Monday at the start of the week.
   *
   * @example
   *
   *   new Date().beginningOfISOWeek() -> Monday
   *
   ***/
  'beginningOfISOWeek': function(d) {
    var day = getWeekday(d);
    if (day === 0) {
      day = -6;
    } else if (day !== 1) {
      day = 1;
    }
    setWeekday(d, day);
    return resetTime(d);
  },

  /***
   * @method endOfISOWeek()
   * @returns Date
   * @short Set the date to the end of week as defined by this ISO8601 standard.
   * @extra Note that this standard places Sunday at the end of the week.
   *
   * @example
   *
   *   new Date().endOfISOWeek() -> Sunday
   *
   ***/
  'endOfISOWeek': function(d) {
    if (getWeekday(d) !== 0) {
      setWeekday(d, 7);
    }
    return moveToEndOfUnit(d, 'day');
  },

  /***
   * @method getUTCOffset([iso])
   * @returns String
   * @short Returns a string representation of the offset from UTC time. If [iso]
   *        is true the offset will be in ISO8601 format.
   *
   * @example
   *
   *   new Date().getUTCOffset()     -> "+0900"
   *   new Date().getUTCOffset(true) -> "+09:00"
   *
   ***/
  'getUTCOffset': function(d, iso) {
    return getUTCOffset(d, iso);
  },

  /***
   * @method setUTC([on] = false)
   * @returns Date
   * @short Controls a flag on the date that tells Sugar to internally use UTC
   *        methods like `getUTCHours`.
   * @extra This flag is most commonly used for output in UTC time with the
   *        `format` method. Note that this flag only governs which methods are
   *        called internally – date native methods like `setHours` will still
   *        return local non-UTC values.
   *
   * @example
   *
   *   new Date().setUTC(true).long()  -> formatted with UTC methods
   *   new Date().setUTC(false).long() -> formatted without UTC methods
   *
   ***/
  'setUTC': function(d, on) {
    return _utc(d, on);
  },

  /***
   * @method isUTC()
   * @returns Boolean
   * @short Returns true if the date has no timezone offset.
   * @extra This will also return true for dates whose internal utc flag is set
   *        with `setUTC`. Even if the utc flag is set, `getTimezoneOffset`
   *        will always report the same thing as Javascript always reports that
   *        based on the environment's locale.
   *
   * @example
   *
   *   new Date().isUTC() -> true or false (depends on the local offset)
   *   new Date().setUTC(true).isUTC() -> true
   *
   ***/
  'isUTC': function(d) {
    return isUTC(d);
  },

  /***
   * @method isValid()
   * @returns Boolean
   * @short Returns true if the date is valid.
   *
   * @example
   *
   *   new Date().isValid()         -> true
   *   new Date('flexor').isValid() -> false
   *
   ***/
  'isValid': function(d) {
    return dateIsValid(d);
  },

  /***
   * @method isAfter(<d>, [margin] = 0)
   * @returns Boolean
   * @short Returns true if the date is after <d>.
   * @extra [margin] is to allow extra margin of error in ms. <d> will accept
   *        a date object, timestamp, or string. If not specified, <d> is
   *        assumed to be now. See `create` for formats.
   *
   * @example
   *
   *   today.isAfter('tomorrow')  -> false
   *   today.isAfter('yesterday') -> true
   *
   ***/
  'isAfter': function(date, d, margin) {
    return date.getTime() > createDate(d).getTime() - (margin || 0);
  },

  /***
   * @method isBefore(<d>, [margin] = 0)
   * @returns Boolean
   * @short Returns true if the date is before <d>.
   * @extra [margin] is to allow extra margin of error in ms. <d> will accept
   *        a date object, timestamp, or text format. If not specified, <d> is
   *        assumed to be now. See `create` for formats.
   *
   * @example
   *
   *   today.isBefore('tomorrow')  -> true
   *   today.isBefore('yesterday') -> false
   *
   ***/
  'isBefore': function(date, d, margin) {
    return date.getTime() < createDate(d).getTime() + (margin || 0);
  },

  /***
   * @method isBetween(<d1>, <d2>, [margin] = 0)
   * @returns Boolean
   * @short Returns true if the date is later or equal to <d1> and before or
   *        equal to <d2>.
   * @extra [margin] is to allow extra margin of error in ms. <d1> and <d2> will
   *        accept a date object, timestamp, or text format. If not specified,
   *        they are assumed to be now.  See `create` for formats.
   *
   * @example
   *
   *   new Date().isBetween('yesterday', 'tomorrow')    -> true
   *   new Date().isBetween('last year', '2 years ago') -> false
   *
   ***/
  'isBetween': function(date, d1, d2, margin) {
    var t  = date.getTime();
    var t1 = createDate(d1).getTime();
    var t2 = createDate(d2).getTime();
    var lo = min(t1, t2);
    var hi = max(t1, t2);
    margin = margin || 0;
    return (lo - margin <= t) && (hi + margin >= t);
  },

  /***
   * @method isLeapYear()
   * @returns Boolean
   * @short Returns true if the date is a leap year.
   *
   * @example
   *
   *   millenium.isLeapYear() -> true
   *
   ***/
  'isLeapYear': function(d) {
    var year = getYear(d);
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  },

  /***
   * @method daysInMonth()
   * @returns Number
   * @short Returns the number of days in the date's month.
   *
   * @example
   *
   *   may.daysInMonth() -> 31
   *   feb.daysInMonth() -> 28 or 29
   *
   ***/
  'daysInMonth': function(d) {
    return daysInMonth(d);
  },

  /***
   * @method format([f], [locale] = currentLocale)
   * @returns String
   * @short Returns the date as a string using the format <f>.
   * @extra <f> is a string that contains tokens in either LDML format using
   *        curly braces, or "strftime" format using a percent sign. If <f> is
   *        not specified, the locale specific `{long}` format is used. [locale]
   *        is a locale code to use (if not specified the current locale is
   *        used). For more, see `date output formats`.
   *
   * @example
   *
   *   new Date().format()                        -> ex. February 13, 2012 11:21 AM
   *   new Date().format('{Weekday} {d} {Month}') -> ex. Monday July 4
   *   new Date().format('{hh}:{mm}')             -> ex. 15:57
   *   new Date().format('%H:%M')                 -> ex. 15:57
   *   new Date().format('{12hr}:{mm}{tt}')       -> ex. 3:57pm
   *   new Date().format('ISO8601')               -> ex. 2011-07-05 12:24:55.528Z
   *   new Date().format('{Weekday}', 'ja')       -> ex. 先週
   *
   ***
   * @method short([locale] = currentLocale)
   * @returns String
   * @short Outputs the date in the short format for the current locale.
   * @extra [locale] overrides the current locale if passed.
   *
   * @example
   *
   *   new Date().short()     -> ex. 02/13/2016
   *   new Date().short('fi') -> ex. 13.2.2016
   *
   ***
   * @method medium([locale] = currentLocale)
   * @returns String
   * @short Outputs the date in the medium format for the current locale.
   * @extra [locale] overrides the current locale if passed.
   *
   * @example
   *
   *   new Date().medium()     -> ex. February 13, 2016
   *   new Date().medium('ja') -> ex. 2016年2月13日
   *
   ***
   * @method long([locale] = currentLocale)
   * @returns String
   * @short Outputs the date in the long format for the current locale.
   * @extra [locale] overrides the current locale if passed.
   *
   * @example
   *
   *   new Date().long()     -> ex. February 13, 2016 6:22 PM
   *   new Date().long('es') -> ex. 13 de febrero de 2016 18:22
   *
   ***
   * @method full([locale] = currentLocale)
   * @returns String
   * @short Outputs the date in the full format for the current locale.
   * @extra [locale] overrides the current locale if passed.
   *
   * @example
   *
   *   new Date().full()     -> ex. Saturday, February 13, 2016 6:23 PM
   *   new Date().full('ru') -> ex. суббота, 13 февраля 2016 г., 18:23
   *
   ***/
  'format': function(d, f, localeCode) {
    return dateFormat(d, f, localeCode);
  },

  /***
   * @method relative([fn], [locale] = currentLocale)
   * @returns String
   * @short Returns the date in a text format relative to the current time,
   *        such as "5 minutes ago".
   * @extra [fn] is a function that can be passed to provide more granular control
   *        over the resulting string. Its return value will be passed to `format`.
   *        If nothing is returned, the relative format will be used. [locale] may
   *        also be passed in place of [fn]. For more about formats, see
   *        `date output formats`.
   *
   * @callback fn
   *
   *   num   The offset number in `unit`.
   *   unit  A numeric representation of the unit that `num` is in, starting at
   *         0 for ms.
   *   ms    The absolute offset in milliseconds.
   *   loc   The locale object, either specified by [locale] or default.
   *
   * @example
   *
   *   hourAgo.relative() -> 1 hour ago
   *   jan.relative()     -> ex. 5 months ago
   *   jan.relative('ja') -> 3ヶ月前
   *   jan.relative(function(num, unit, ms, loc) {
   *     // Return an absolute date for anything over 6 months.
   *     if(unit == 6 && num > 6 || unit > 6) {
   *       return '{Month} {d}, {yyyy}';
   *     }
   *   }); -> ex. 5 months ago
   *
   ***/
  'relative': function(d, fn, localeCode) {
    if (isString(fn)) {
      localeCode = fn;
      fn = null;
    }
    return dateRelative(d, fn, localeCode);
  },

  /***
   * @method is(<f>, [margin] = 0)
   * @returns Boolean
   * @short Returns true if the date matches <f>.
   * @extra <f> will accept a date object, timestamp, or text format. In the
   *        case of objects and text formats, `is` will additionally compare
   *        based on the precision implied in the input. In the case of text
   *        formats <f> will use the currently set locale. [margin] allows an
   *        extra margin of error in milliseconds. See `create` for formats.
   *
   * @example
   *
   *   new Date().is('July')               -> true or false?
   *   new Date().is('1776')               -> false
   *   new Date().is('today')              -> true
   *   new Date().is('weekday')            -> true or false?
   *   new Date().is('July 4, 1776')       -> false
   *   new Date().is(-6106093200000)       -> false
   *   new Date().is(new Date(1776, 6, 4)) -> false
   *
   ***/
  'is': function(date, d, margin) {
    return fullCompareDate(date, d, margin);
  },

  /***
   * @method reset([unit] = 'hours')
   * @returns Date
   * @short Resets the unit passed and all smaller units. Default is "hours",
   *        effectively resetting the time.
   * @extra This method modifies the date!
   *
   * @example
   *
   *   new Date().reset('day')   -> Beginning of today
   *   new Date().reset('month') -> 1st of the month
   *
   ***/
  'reset': function(d, unit) {
    return resetUnitAndLower(d, unit);
  },

  /***
   * @method clone()
   * @returns Date
   * @short Clones the date.
   *
   * @example
   *
   *   new Date().clone() -> Copy of now
   *
   ***/
  'clone': function(d) {
    return cloneDate(d);
  },

  /***
   * @method iso()
   * @alias toISOString
   *
   ***/
  'iso': function(d) {
    return d.toISOString();
  },

  /***
   * @method getWeekday()
   * @returns Number
   * @short Alias for `getDay`.
   *
   * @example
   *
   *   new Date().getWeekday();    -> (ex.) 3
   *
   ***/
  'getWeekday': function(d) {
    return getWeekday(d);
  },

  /***
   * @method getUTCWeekday()
   * @returns Number
   * @short Alias for `getUTCDay`.
   *
   * @example
   *
   *   new Date().getUTCWeekday(); -> (ex.) 3
   *
   ***/
  'getUTCWeekday': function(d) {
    return d.getUTCDay();
  }

});


/*** @namespace Number ***/

/***
 * @method [unit]()
 * @returns Number
 * @short Takes the number as a unit of time and converts to milliseconds.
 * @extra Method names can be singular or plural.  Note that as "a month" is
 *        ambiguous as a unit of time, `months` will be equivalent to 30.4375
 *        days, the average number in a month. Be careful using `months` if you
 *        need exact precision.
 *
 * @set
 *   millisecond
 *   milliseconds
 *   second
 *   seconds
 *   minute
 *   minutes
 *   hour
 *   hours
 *   day
 *   days
 *   week
 *   weeks
 *   month
 *   months
 *   year
 *   years
 *
 * @example
 *
 *   (5).milliseconds() -> 5
 *   (10).hours()       -> 36000000
 *   (1).day()          -> 86400000
 *
 ***
 * @method [unit]Before([d], [options])
 * @returns Date
 * @short Returns a date that is <n> units before [d], where <n> is the number.
 * @extra [d] will accept a date object, timestamp, or text format. Note that
 *        "months" is ambiguous as a unit of time. If the target date falls on a
 *        day that does not exist (i.e. August 31 -> February 31), the date will
 *        be shifted to the last day of the month. Be careful using `monthsBefore`
 *        if you need exact precision. See `create` for options.
 *
 *
 * @set
 *   millisecondBefore
 *   millisecondsBefore
 *   secondBefore
 *   secondsBefore
 *   minuteBefore
 *   minutesBefore
 *   hourBefore
 *   hoursBefore
 *   dayBefore
 *   daysBefore
 *   weekBefore
 *   weeksBefore
 *   monthBefore
 *   monthsBefore
 *   yearBefore
 *   yearsBefore
 *
 * @example
 *
 *   (5).daysBefore('tuesday')          -> 5 days before tuesday of this week
 *   (1).yearBefore('January 23, 1997') -> January 23, 1996
 *
 ***
 * @method [unit]Ago()
 * @returns Date
 * @short Returns a date that is <n> units ago.
 * @extra Note that "months" is ambiguous as a unit of time. If the target date
 *        falls on a day that does not exist (i.e. August 31 -> February 31), the
 *        date will be shifted to the last day of the month. Be careful using
 *        `monthsAgo` if you need exact precision.
 *
 * @set
 *   millisecondAgo
 *   millisecondsAgo
 *   secondAgo
 *   secondsAgo
 *   minuteAgo
 *   minutesAgo
 *   hourAgo
 *   hoursAgo
 *   dayAgo
 *   daysAgo
 *   weekAgo
 *   weeksAgo
 *   monthAgo
 *   monthsAgo
 *   yearAgo
 *   yearsAgo
 *
 * @example
 *
 *   (5).weeksAgo() -> 5 weeks ago
 *   (1).yearAgo()  -> January 23, 1996
 *
 ***
 * @method [unit]After([d], [options])
 * @returns Date
 * @short Returns a date <n> units after [d], where <n> is the number.
 * @extra [d] will accept a date object, timestamp, or text format. Note that
 *        "months" is ambiguous as a unit of time. If the target date falls on a
 *        day that does not exist (i.e. August 31 -> February 31), the date will
 *        be shifted to the last day of the month. Be careful using `monthsAfter`
 *        if you need exact precision. See `create` for options.
 *
 * @set
 *   millisecondAfter
 *   millisecondsAfter
 *   secondAfter
 *   secondsAfter
 *   minuteAfter
 *   minutesAfter
 *   hourAfter
 *   hoursAfter
 *   dayAfter
 *   daysAfter
 *   weekAfter
 *   weeksAfter
 *   monthAfter
 *   monthsAfter
 *   yearAfter
 *   yearsAfter
 *
 * @example
 *
 *   (5).daysAfter('tuesday')          -> 5 days after tuesday of this week
 *   (1).yearAfter('January 23, 1997') -> January 23, 1998
 *
 ***
 * @method [unit]FromNow()
 * @returns Date
 * @short Returns a date <n> units from now.
 * @extra Note that "months" is ambiguous as a unit of time. If the target date
 *        falls on a day that does not exist (i.e. August 31 -> February 31), the
 *        date will be shifted to the last day of the month. Be careful using
 *        `monthsFromNow` if you need exact precision.
 *
 * @set
 *   millisecondFromNow
 *   millisecondsFromNow
 *   secondFromNow
 *   secondsFromNow
 *   minuteFromNow
 *   minutesFromNow
 *   hourFromNow
 *   hoursFromNow
 *   dayFromNow
 *   daysFromNow
 *   weekFromNow
 *   weeksFromNow
 *   monthFromNow
 *   monthsFromNow
 *   yearFromNow
 *   yearsFromNow
 *
 * @example
 *
 *   (5).weeksFromNow() -> 5 weeks ago
 *   (1).yearFromNow()  -> January 23, 1998
 *
 ***/
function buildNumberUnitMethods() {
  defineInstanceSimilar(sugarNumber, DateUnits, function(methods, u) {
    var base, after, before;
    base = function(n) {
      return round(n * u.multiplier);
    };
    after = function(n, d, options) {
      return advanceDate(createDate(d, options), u.name, n);
    };
    before = function(n, d, options) {
      return advanceDate(createDate(d, options), u.name, -n);
    };
    methods[u.name] = base;
    methods[u.name + 's'] = base;
    methods[u.name + 'Before'] = before;
    methods[u.name + 'sBefore'] = before;
    methods[u.name + 'Ago'] = before;
    methods[u.name + 'sAgo'] = before;
    methods[u.name + 'After'] = after;
    methods[u.name + 'sAfter'] = after;
    methods[u.name + 'FromNow'] = after;
    methods[u.name + 'sFromNow'] = after;
  });
}

defineInstance(sugarNumber, {

  /***
   * @method duration([locale] = currentLocale)
   * @returns String
   * @short Takes the number as milliseconds and returns a localized string.
   * @extra This method is the same as `Date#relative` without the localized
   *        equivalent of "from now" or "ago". [locale] can be passed as the
   *        first (and only) parameter. Note that this method is only available
   *        when the dates module is included.
   *
   * @example
   *
   *   (500).duration() -> '500 milliseconds'
   *   (1200).duration() -> '1 second'
   *   (75).minutes().duration() -> '1 hour'
   *   (75).minutes().duration('es') -> '1 hora'
   *
   ***/
  'duration': function(n, localeCode) {
    return localeManager.get(localeCode).getDuration(n);
  }

});


// Locales
// TODO: move this to top??


// Locale helpers
var English, localeManager;

function getEnglishVariant(v) {
  return simpleMerge(simpleClone(EnglishLocaleBaseDefinition), v);
}

function arrayToRegAlternates(arr) {
  var joined = arr.join('');
  if (!arr || !arr.length) {
    return '';
  }
  if (joined.length === arr.length) {
    return '[' + joined + ']';
  }
  // map handles sparse arrays so no need to compact the array here.
  return map(arr, escapeRegExp).join('|');
}

function getRegNonCapturing(src, opt) {
  if (src.length > 1) {
    src = '(?:' + src + ')';
  }
  if (opt) {
    src += '?';
  }
  return src;
}

function getTokenWithSuffix(field, src, suffix) {
  var token = ParsingTokens[field];
  if (token.requiresSuffix) {
    src = getRegNonCapturing(src + getRegNonCapturing(suffix));
  } else if (token.requiresAlternate) {
    src += getRegNonCapturing(token.requiresAlternate + '|' + suffix);
  } else {
    src += getRegNonCapturing(suffix, true);
  }
  return src;
}

function getArrayWithOffset(arr, n, alternate, offset) {
  var val;
  if (alternate > 1) {
    val = arr[n + (alternate - 1) * offset];
  }
  return val || arr[n];
}

function buildLocales() {

  function LocaleManager(loc) {
    this.locales = {};
    this.add(loc);
  }

  LocaleManager.prototype = {

    get: function(code, fallback) {
      var loc = this.locales[code];
      if (!loc && LazyLoadedLocales[code]) {
        loc = this.add(code, LazyLoadedLocales[code]);
      } else if (!loc && code) {
        loc = this.locales[code.slice(0, 2)];
      }
      return loc || fallback === false ? loc : this.current;
    },

    getAll: function() {
      return this.locales;
    },

    set: function(code) {
      var loc = this.get(code, false);
      if (!loc) {
        throw new TypeError('Invalid Locale: ' + code);
      }
      return this.current = loc;
    },

    add: function(code, def) {
      if (!def) {
        def = code;
        code = def.code;
      } else {
        def.code = code;
      }
      var loc = def.compiledFormats ? def : getNewLocale(def);
      this.locales[code] = loc;
      if (!this.current) {
        this.current = loc;
      }
      return loc;
    },

    remove: function(code) {
      if (this.current.code === code) {
        this.current = this.get('en');
      }
      return delete this.locales[code];
    }

  };

  // Sorry about this guys...
  English = getNewLocale(AmericanEnglishDefinition);
  localeManager = new LocaleManager(English);
}

function getNewLocale(def) {

  function Locale(def) {
    this.init(def);
  }

  Locale.prototype = {

    getMonthName: function(n, alternate) {
      if (this.monthSuffix) {
        return (n + 1) + this.monthSuffix;
      }
      return getArrayWithOffset(this.months, n, alternate, 12);
    },

    getWeekdayName: function(n, alternate) {
      return getArrayWithOffset(this.weekdays, n, alternate, 7);
    },

    getTokenValue: function(field, str) {
      var map = this[field + 'Map'], val;
      if (map) {
        val = map[str];
      }
      if (isUndefined(val)) {
        val = this.getNumber(str);
        if (field === 'month') {
          // Months are the only numeric date field
          // whose value is not the same as its number.
          val -= 1;
        }
      }
      return val;
    },

    getNumber: function(str) {
      var num = this.numeralMap[str];
      if (isDefined(num)) {
        return num;
      }
      // The unary plus operator here show better performance and handles
      // every format that parseFloat does with the exception of trailing
      // characters, which are guaranteed not to be in our string at this point.
      num = +str.replace(/,/, '.');
      if (!isNaN(num)) {
        return num;
      }
      num = this.getNumeralValue(str);
      if (!isNaN(num)) {
        this.numeralMap[str] = num;
        return num;
      }
      return num;
    },

    getNumeralValue: function(str) {
      var place = 1, num = 0, lastWasPlace, isPlace, numeral, digit, arr;
      // Note that "numerals" that need to be converted through this method are
      // all considered to be single characters in order to handle CJK. This
      // method is by no means unique to CJK, but the complexity of handling
      // inflections in non-CJK languages adds too much overhead for not enough
      // value, so avoiding for now.
      arr = str.split('');
      for (var i = arr.length - 1; numeral = arr[i]; i--) {
        digit = getOwn(this.numeralMap, numeral);
        if (isUndefined(digit)) {
          digit = getOwn(fullWidthNumberMap, numeral);
        }
        isPlace = digit > 0 && digit % 10 === 0;
        if (isPlace) {
          if (lastWasPlace) {
            num += place;
          }
          if (i) {
            place = digit;
          } else {
            num += digit;
          }
        } else {
          num += digit * place;
          place *= 10;
        }
        lastWasPlace = isPlace;
      }
      return num;
    },

    getOrdinal: function(n) {
      var suffix = this.ordinalSuffix;
      return suffix || getOrdinalSuffix(n);
    },

    getRelativeFormat: function(adu) {
      return this.convertAdjustedToFormat(adu, adu[2] > 0 ? 'future' : 'past');
    },

    getDuration: function(ms) {
      return this.convertAdjustedToFormat(getAdjustedUnitForNumber(max(0, ms)), 'duration');
    },

    getFirstDayOfWeek: function() {
      var val = this.firstDayOfWeek;
      return isDefined(val) ? val : ISO_FIRST_DAY_OF_WEEK;
    },

    getFirstDayOfWeekYear: function() {
      return this.firstDayOfWeekYear || ISO_FIRST_DAY_OF_WEEK_YEAR;
    },

    convertAdjustedToFormat: function(adu, mode) {
      var sign, unit, mult,
          num    = adu[0],
          u      = adu[1],
          ms     = adu[2],
          format = this[mode] || this.relative;
      if (isFunction(format)) {
        return format.call(this, num, u, ms, mode);
      }
      mult = !this.plural || num === 1 ? 0 : 1;
      unit = this.units[mult * 8 + u] || this.units[u];
      sign = this[ms > 0 ? 'fromNow' : 'ago'];
      return format.replace(/\{(.*?)\}/g, function(full, match) {
        switch(match) {
          case 'num': return num;
          case 'unit': return unit;
          case 'sign': return sign;
        }
      });
    },

    getFormats: function() {
      return this.cachedFormats || this.compiledFormats;
    },

    // TODO: can this be better?
    setCachedFormat: function(dif) {
      var arr = filter(this.compiledFormats, function(f) {
        return f !== dif;
      });
      arr.unshift(dif);
      this.cachedFormats = arr;
    },

    addFormat: function(src, to) {
      var loc = this;

      function getTokenSrc(str) {
        var suffix, src, val,
            opt   = str.match(/\?$/),
            nc    = str.match(/^(\d+)\??$/),
            slice = str.match(/(\d)(?:-(\d))?/),
            key   = str.replace(/[^a-z]+$/, '');

        // Allowing alias tokens such as {time}
        if (val = getOwn(loc.parseAliases, key)) {
          return replaceParsingTokens(val);
        }

        if (nc) {
          src = loc.tokens[nc[1]];
        } else {
          val = getOwn(loc.parseTokens, key) || getOwn(loc, key);

          // Both the "months" array and the "month" parseToken can be accessed
          // by either {month} or {months}, falling back as necessary, however
          // regardless of whether or not a fallback occurs, the final field to
          // be passed to addRawFormat must be normalized as singular.
          key = key.replace(/s$/, '');

          if (!val) {
            val = getOwn(loc.parseTokens, key) || getOwn(loc, key + 's');
          }

          if (isString(val)) {
            src = val;
            suffix = loc[key + 'Suffix'];
          } else {
            if (slice) {
              val = filter(val, function(m, i) {
                var mod = i % (loc.units ? 8 : val.length);
                return mod >= slice[1] && mod <= (slice[2] || slice[1]);
              });
            }
            src = arrayToRegAlternates(val);
          }
        }
        if (!src) {
          return '';
        }
        if (nc) {
          // Non-capturing tokens like {0}
          src = getRegNonCapturing(src);
        } else {
          // Capturing group and add to parsed tokens
          to.push(key);
          src = '(' + src + ')';
        }
        if (suffix) {
          // Date/time suffixes such as those in CJK
          src = getTokenWithSuffix(key, src, suffix);
        }
        if (opt) {
          src += '?';
        }
        return src;
      }

      function replaceParsingTokens(str) {

        // Make spaces optional
        str = str.replace(/ /g, ' ?');

        return str.replace(/\{([^,]+?)\}/g, function(match, token) {
          var tokens = token.split('|'), src;
          if (tokens.length > 1) {
            src = getRegNonCapturing(tokens.map(getTokenSrc).join('|'));
          } else {
            src = getTokenSrc(token);
          }
          return src;
        });
      }

      if (!to) {
        to = [];
        src = replaceParsingTokens(src);
      }

      loc.addRawFormat(src, to);
    },

    addRawFormat: function(format, to) {
      this.compiledFormats.unshift({
        reg: RegExp('^ *' + format + ' *$', 'i'),
        to: to
      });
      this.cachedFormats = null;
    },

    init: function(def) {
      var loc = this;

      // -- Initialization helpers

      function initFormats() {
        loc.compiledFormats = [];
        loc.parseAliases = {};
        loc.parseTokens = {};
      }

      function initDefinition() {
        simpleMerge(loc, def);
      }

      function initArrayFields() {
        forEach(LOCALE_ARRAY_FIELDS, function(name) {
          var val = loc[name];
          if (isString(val)) {
            loc[name] = commaSplit(val);
          } else if (!val) {
            loc[name] = [];
          }
        });
      }

      // -- Value array build helpers

      function buildValueArray(name, mod, map, fn) {
        var field = name, all = [], setMap;
        if (!loc[field]) {
          field += 's';
        }
        if (!map) {
          map = {};
          setMap = true;
        }
        forAllAlternates(field, function(alt, j, i) {
          var idx = j * mod + i, val;
          val = fn ? fn(i) : i;
          map[alt] = val;
          map[alt.toLowerCase()] = val;
          all[idx] = alt;
        });
        loc[field] = all;
        if (setMap) {
          loc[name + 'Map'] = map;
        }
      }

      function forAllAlternates(field, fn) {
        forEach(loc[field], function(str, i) {
          forEachAlternate(str, function(alt, j) {
            fn(alt, j, i);
          });
        });
      }

      function forEachAlternate(str, fn) {
        var arr = map(str.split('+'), function(split) {
          return split.replace(/(.+):(.+)$/, function(full, base, suffixes) {
            return map(suffixes.split('|'), function(suffix) {
              return base + suffix;
            }).join('|');
          });
        }).join('|');
        forEach(arr.split('|'), fn);
      }

      function buildNumerals() {
        var map = {};
        buildValueArray('numeral', 10, map);
        buildValueArray('article', 1, map, function() {
          return 1;
        });
        buildValueArray('placeholder', 4, map, function(n) {
          return pow(10, n + 1);
        });
        loc.numeralMap = map;
      }

      function buildTimeFormat() {
        var src;
        if (loc.ampmFront) {
          // "ampmFront" exists mostly for CJK locales, which also presume that
          // time suffixes exist, allowing this to be a simpler regex.
          src = '{ampm?} {hour} (?:{minute} (?::?{second})?)?';
        } else if(loc.ampm.length) {
          src = '{hour}(?:[.:]{minute}(?:[.:]{second})? {ampm?}| {ampm})';
        } else {
          src = '{hour}(?:[.:]{minute}(?:[.:]{second})?)';
        }
        loc.parseAliases['time'] = src;
      }

      function buildParsingTokens() {
        forEachProperty(ParsingTokens, function(name, token) {
          var src = token.src, arr;
          if (token.requiresNumerals || (token.allowsNumerals && loc['allowsNumerals'])) {
            src += getNumeralSrc();
          }
          arr = loc[name + 's'];
          if (arr && arr.length) {
            src += '|' + arrayToRegAlternates(arr);
          }
          loc.parseTokens[name] = src;
        });
      }

      function getNumeralSrc() {
        var all, src = '';
        all = loc.numerals.concat(loc.placeholders).concat(loc.articles);
        if (loc.allowsFullWidth) {
          all = all.concat(fullWidthNumbers.split(''));
        }
        if (all.length) {
          src = '|(?:' + arrayToRegAlternates(all) + ')+';
        }
        return src;
      }

      function buildTimeSuffixes() {
        iterateOverDateParamUnits(false, function(unitName, i) {
          var token = loc.timeSuffixes[i];
          if (token) {
            loc[unitName + 'Suffix'] = token;
          }
        });
      }

      function buildModifiers() {
        forEach(loc.modifiers, function(modifier) {
          var name = modifier.name, mapKey = name + 'Map', map;
          map = loc[mapKey] || {};
          forEachAlternate(modifier.src, function(alt, j) {
            var token = getOwn(loc.parseTokens, name), val = modifier.value;
            map[alt] = val;
            loc.parseTokens[name] = token ? token + '|' + alt : alt;
            if (modifier.name === 'sign' && j === 0) {
              // Hooking in here to set the first "fromNow" or "ago" modifier
              // directly on the locale, so that it can be reused in the
              // relative format.
              loc[val === 1 ? 'fromNow' : 'ago'] = alt;
            }
          });
          loc[mapKey] = map;
        });
      }

      function buildUTCTokens() {
        var signMap = {'-':-1,'+':1};
        var utcMap = {'z':1,'gmt':1};

        loc.utcMap        = utcMap;
        loc.yearSignMap   = signMap;
        loc.offsetSignMap = signMap;
      }

      // -- Format adding helpers

      function addCoreFormats() {
        forEach(CoreParsingFormats, function(df) {
          var src = df.src, match = df.match && commaSplit(df.match);
          if (df.mdy && loc.mdy) {
            // Use the mm/dd/yyyy variant if it
            // exists and the locale requires it
            src = df.mdy;
          }
          if (df.time) {
            // Core formats that allow time require the time
            // reg on both sides, so add both versions here.
            loc.addFormat(getFormatWithTime(src, true), match, df.variant, df.iso);
            loc.addFormat(getFormatWithTime(src), match, df.variant, df.iso);
          } else {
            loc.addFormat(src, match, df.variant, df.iso);
          }
        });
        loc.addFormat('{time}');
      }

      function addLocaleFormats() {
        addFormatSet('parse');
        addFormatSet('timeParse', true);
        addFormatSet('timeFrontParse', true, true);
      }

      function addFormatSet(field, allowTime, timeFront) {
        forEach(loc[field], function(format) {
          if (allowTime) {
            format = getFormatWithTime(format, timeFront);
          }
          loc.addFormat(format);
        });
      }

      function getFormatWithTime(baseFormat, timeBefore) {
        if (timeBefore) {
          return getTimeBefore() + baseFormat;
        }
        return baseFormat + getTimeAfter();
      }

      function getTimeBefore() {
        return getRegNonCapturing('{time}[,\\s\\u3000]', true);
      }

      function getTimeAfter() {
        var markers = ',?[\\s\\u3000]', localized;
        localized = arrayToRegAlternates(loc.timeMarkers);
        if (localized) {
          markers += '| (?:' + localized + ') ';
        }
        markers = getRegNonCapturing(markers, loc.timeMarkerOptional);
        return getRegNonCapturing(markers + '{time}', true);
      }

      initFormats();
      initDefinition();
      initArrayFields();

      buildValueArray('month', 12);
      buildValueArray('weekday', 7);
      buildValueArray('unit', 8);
      buildValueArray('ampm', 2);

      buildNumerals();
      buildTimeFormat();
      buildParsingTokens();
      buildTimeSuffixes();
      buildModifiers();
      buildUTCTokens();

      // The order of these formats is important. Order is reversed so formats
      // that are initialized later will take precedence. Generally, this means
      // that more specific formats should come later.
      addCoreFormats();
      addLocaleFormats();

    }

  };

  return new Locale(def);
}

var EnglishLocaleBaseDefinition = {
  'code': 'en',
  'plural': true,
  'timeMarkers': 'at',
  'ampm': 'AM|A.M.|a,PM|P.M.|p',
  'units': 'millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s',
  'months': 'Jan:uary|,Feb:ruary|,Mar:ch|,Apr:il|,May,Jun:e|,Jul:y|,Aug:ust|,Sep:tember|t|,Oct:ober|,Nov:ember|,Dec:ember|',
  'weekdays': 'Sun:day|,Mon:day|,Tue:sday|,Wed:nesday|,Thu:rsday|,Fri:day|,Sat:urday|+weekend',
  'numerals': 'zero,one|first,two|second,three|third,four:|th,five|fifth,six:|th,seven:|th,eight:|h,nin:e|th,ten:|th',
  'articles': 'a,an,the',
  'tokens': 'the,st|nd|rd|th,of|in,a|an,on',
  'time': '{H}:{mm}',
  'past': '{num} {unit} {sign}',
  'future': '{num} {unit} {sign}',
  'duration': '{num} {unit}',
  'modifiers': [
    { 'name': 'half',   'src': 'half', 'value': .5 },
    { 'name': 'midday', 'src': 'noon', 'value': 12 },
    { 'name': 'midday', 'src': 'midnight', 'value': 24 },
    { 'name': 'day',    'src': 'yesterday', 'value': -1 },
    { 'name': 'day',    'src': 'today|tonight', 'value': 0 },
    { 'name': 'day',    'src': 'tomorrow', 'value': 1 },
    { 'name': 'sign',   'src': 'ago|before', 'value': -1 },
    { 'name': 'sign',   'src': 'from now|after|from|in|later', 'value': 1 },
    { 'name': 'edge',   'src': 'first day|first|beginning', 'value': -2 },
    { 'name': 'edge',   'src': 'last day', 'value': 1 },
    { 'name': 'edge',   'src': 'end|last', 'value': 2 },
    { 'name': 'shift',  'src': 'last', 'value': -1 },
    { 'name': 'shift',  'src': 'the|this', 'value': 0 },
    { 'name': 'shift',  'src': 'next', 'value': 1 }
  ],
  'parse': [
    '{months}',
    '(?:just)? now',
    '{edge} of {day}',
    '{shift} {unit:5-7}',
    '{month}[-.\\/\\s]{year}',
    '{midday} {4?} {day|weekday}',
    '{0|months} {date?}{1?} of {shift} {unit:6-7}',
    '{0} {num}{1?} {weekday} {2} {months},? {year?}',
    '{shift?} {day?} {weekday?} {timeMarker?} {midday}',
    '{sign?} {3?} {half} {3?} {unit:3-4|unit:7} {sign?}',
    '{weekday},? {date} {months} {year} {hour}:{minute}:{second} {utc}',
    '{0?} {edge} {weekday?} {2} {shift?} {unit:4-7?} {months?},? {year?}'
  ],
  'timeParse': [
    '{day|weekday}',
    '{shift} {unit:5?} {weekday}',
    '{0?} {date}{1?} {2?} {months?}',
    '{weekday} {2?} {shift} {unit:5}',
    '{0?} {num} of {months},? {year?}',
    '{num?} {unit:4-5} {sign} {day|weekday}',
    '{0?} {num}{1?} {weekday} of {shift} {unit:6}',
    "{weekday?}\\.? {months}\\.? {date}{1?},? (?:{year}|'{yearShort})?"
  ],
  'timeFrontParse': [
    '{sign} {num} {unit}',
    '{num} {unit} {sign}',
    '{4?} {day|weekday}'
  ]
};

var AmericanEnglishDefinition = getEnglishVariant({
  'mdy': true,
  'firstDayOfWeek': 0,
  'firstDayOfWeekYear': 1,
  'short':  '{MM}/{dd}/{yyyy}',
  'medium': '{Month} {d}, {yyyy}',
  'long':   '{Month} {d}, {yyyy} {time}',
  'full':   '{Weekday}, {Month} {d}, {yyyy} {time}',
  'stamp':  '{Dow} {Mon} {d} {yyyy} {time}',
  'time':   '{h}:{mm} {TT}'
});

var BritishEnglishDefinition = getEnglishVariant({
  'short':  '{dd}/{MM}/{yyyy}',
  'medium': '{d} {Month} {yyyy}',
  'long':   '{d} {Month} {yyyy} {H}:{mm}',
  'full':   '{Weekday}, {d} {Month}, {yyyy} {time}',
  'stamp':  '{Dow} {d} {Mon} {yyyy} {time}'
});

var CanadianEnglishDefinition = getEnglishVariant({
  'short':  '{yyyy}-{MM}-{dd}',
  'medium': '{d} {Month}, {yyyy}',
  'long':   '{d} {Month}, {yyyy} {H}:{mm}',
  'full':   '{Weekday}, {d} {Month}, {yyyy} {time}',
  'stamp':  '{Dow} {d} {Mon} {yyyy} {time}'
});

var LazyLoadedLocales = {
  'en-US': AmericanEnglishDefinition,
  'en-GB': BritishEnglishDefinition,
  'en-AU': BritishEnglishDefinition,
  'en-CA': CanadianEnglishDefinition
};


buildDateUnits();
buildLocales();
buildDateFormatTokens();
buildDateFormatMatcher();
buildDateUnitMethods();
buildNumberUnitMethods();
buildRelativeAliases();
setDateChainableConstructor();
