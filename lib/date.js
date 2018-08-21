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
var TIMEZONE_ABBREVIATION_REG = /\(([-+]\d{2,4}|\w{3,5})\)$/;

// Regex for years with 2 digits or less
var ABBREVIATED_YEAR_REG = /^'?(\d{1,2})$/;

// One minute in milliseconds
var MINUTES = 60 * 1000;

// Date unit indexes
var HOURS_INDEX   = 3,
    DAY_INDEX     = 4,
    WEEK_INDEX    = 5,
    MONTH_INDEX   = 6,
    YEAR_INDEX    = 7;

// ISO Defaults
var ISO_FIRST_DAY_OF_WEEK = 1,
    ISO_FIRST_DAY_OF_WEEK_YEAR = 4;

var CoreParsingTokens = {
  'yyyy': {
    param: 'year',
    src: '[-−+]?\\d{4,6}'
  },
  'yy': {
    param: 'year',
    src: '\\d{2}'
  },
  'y': {
    param: 'year',
    src: '\\d'
  },
  'ayy': {
    param: 'year',
    src: '\'\\d{2}'
  },
  'MM': {
    param: 'month',
    src: '(?:1[012]|0?[1-9])'
  },
  'dd': {
    param: 'date',
    src: '(?:3[01]|[12][0-9]|0?[1-9])'
  },
  'hh': {
    param: 'hour',
    src: '(?:2[0-4]|[01]?[0-9])'
  },
  'mm': {
    param: 'minute',
    src: '[0-5]\\d'
  },
  'ss': {
    param: 'second',
    src: '[0-5]\\d(?:[,.]\\d+)?'
  },
  'tzHour': {
    src: '[-−+](?:2[0-4]|[01]?[0-9])'
  },
  'tzMinute': {
    src: '[0-5]\\d'
  },
  'iyyyy': {
    param: 'year',
    src: '(?:[-−+]?\\d{4}|[-−+]\\d{5,6})'
  },
  'ihh': {
    param: 'hour',
    src: '(?:2[0-4]|[01][0-9])(?:[,.]\\d+)?'
  },
  'imm': {
    param: 'minute',
    src: '[0-5]\\d(?:[,.]\\d+)?'
  },
  'GMT': {
    param: 'utc',
    src: 'GMT'
  },
  'Z': {
    param: 'utc',
    src: 'Z'
  },
  'timestamp': {
    src: '\\d+'
  }
};

var LocalizedParsingTokens = {
  'year': {
    base: 'yyyy|ayy',
    requiresSuffix: true
  },
  'month': {
    base: 'MM',
    requiresSuffix: true
  },
  'date': {
    base: 'dd',
    requiresSuffix: true
  },
  'hour': {
    base: 'hh',
    requiresSuffixOr: ':'
  },
  'minute': {
    base: 'mm'
  },
  'second': {
    base: 'ss'
  },
  'num': {
    src: '\\d+',
    requiresNumerals: true
  }
};

var CoreParsingFormats = [
  {
    // 12-1978
    // 08-1978 (MDY)
    src: '{MM}[-.\\/]{yyyy}'
  },
  {
    // 12/08/1978
    // 08/12/1978 (MDY)
    time: true,
    src: '{dd}[-\\/]{MM}(?:[-\\/]{yyyy|yy|y})?',
    mdy: '{MM}[-\\/]{dd}(?:[-\\/]{yyyy|yy|y})?'
  },
  {
    // 12.08.1978
    // 08.12.1978 (MDY)
    time: true,
    src: '{dd}\\.{MM}(?:\\.{yyyy|yy|y})?',
    mdy: '{MM}\\.{dd}(?:\\.{yyyy|yy|y})?',
    localeCheck: function(loc) {
      // Do not allow this format if the locale
      // uses a period as a time separator.
      return loc.timeSeparator !== '.';
    }
  },
  {
    // 1975-08-25
    time: true,
    src: '{yyyy}[-.\\/]{MM}(?:[-.\\/]{dd})?'
  },
  {
    // .NET JSON
    src: '\\\\/Date\\({timestamp}(?:[-+]\\d{4,4})?\\)\\\\/'
  },
  {
    // ISO-8601
    src: '{iyyyy}(?:-?{MM}(?:-?{dd}(?:T{ihh}(?::?{imm}(?::?{ss})?)?)?)?)?{tzOffset?}'
  }
];

var CoreOutputFormats = {
  'ISO8601': '{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{SSS}{Z}',
  'RFC1123': '{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {ZZ}',
  'RFC1036': '{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {ZZ}'
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
    strf: 'b h',
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
    ldml: 'd date day',
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
    ldml: 'H 24hr',
    strf: 'H',
    strfPadding: 2,
    ldmlPaddedToken: 'HH',
    get: function(d) {
      return getHours(d);
    }
  },
  {
    ldml: 'h hours 12hr',
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
      var s = setUnitAndLowerToEdge(cloneDate(d), MONTH_INDEX);
      return getDaysSince(d, s) + 1;
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
    ldml: 'm minutes',
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
      return getMeridiemToken(d, localeCode);
    }
  },
  {
    ldml: 'tt',
    strf: 'P',
    get: function(d, localeCode) {
      return getMeridiemToken(d, localeCode).toLowerCase();
    }
  },
  {
    ldml: 'T',
    lowerToken: 't',
    get: function(d, localeCode) {
      return getMeridiemToken(d, localeCode).charAt(0);
    }
  },
  {
    ldml: 's seconds',
    strf: 'S',
    strfPadding: 2,
    ldmlPaddedToken: 'ss',
    get: function(d) {
      return callDateGet(d, 'Seconds');
    }
  },
  {
    ldml: 'S ms',
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
    ldml: 'ZZ',
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
      // istanbul ignore next
      return match ? match[1] : '';
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
    start: 0,
    end: 59
  },
  {
    name: 'minute',
    method: 'Minutes',
    multiplier: 60 * 1000,
    start: 0,
    end: 59
  },
  {
    name: 'hour',
    method: 'Hours',
    multiplier: 60 * 60 * 1000,
    start: 0,
    end: 23
  },
  {
    name: 'day',
    alias: 'date',
    method: 'Date',
    ambiguous: true,
    multiplier: 24 * 60 * 60 * 1000,
    start: 1,
    end: function(d) {
      return getDaysInMonth(d);
    }
  },
  {
    name: 'week',
    method: 'ISOWeek',
    ambiguous: true,
    multiplier: 7 * 24 * 60 * 60 * 1000
  },
  {
    name: 'month',
    method: 'Month',
    ambiguous: true,
    multiplier: 30.4375 * 24 * 60 * 60 * 1000,
    start: 0,
    end: 11
  },
  {
    name: 'year',
    method: 'FullYear',
    ambiguous: true,
    multiplier: 365.25 * 24 * 60 * 60 * 1000,
    start: 0
  }
];

/***
 * @method getOption(name)
 * @returns Mixed
 * @accessor
 * @short Gets an option used internally by Date.
 * @example
 *
 *   Sugar.Date.getOption('newDateInternal');
 *
 * @param {string} name
 *
 ***
 * @method setOption(name, value)
 * @accessor
 * @short Sets an option used internally by Date.
 * @extra If `value` is `null`, the default value will be restored.
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
 * @signature setOption(options)
 * @param {DateOptions} options
 * @param {string} name
 * @param {any} value
 * @option {Function} newDateInternal
 *
 ***/
var _dateOptions = defineOptionsAccessor(sugarDate, DATE_OPTIONS);

function setDateChainableConstructor() {
  setChainableConstructor(sugarDate, createDate);
}

// General helpers

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

function dateIsValid(d) {
  return !isNaN(d.getTime());
}

function assertDateIsValid(d) {
  if (!dateIsValid(d)) {
    throw new TypeError('Date is not valid');
  }
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
  callDateSet(d, 'Date', val);
}

function setMonth(d, val) {
  callDateSet(d, 'Month', val);
}

function setYear(d, val) {
  callDateSet(d, 'FullYear', val);
}

function getDaysInMonth(d) {
  return 32 - callDateGet(new Date(getYear(d), getMonth(d), 32), 'Date');
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
  setDate(d, getDate(d) + dow - currentWeekday);
  return d.getTime();
}

// Normal callDateSet method with ability
// to handle ISOWeek setting as well.
function callDateSetWithWeek(d, method, value, safe) {
  if (method === 'ISOWeek') {
    setISOWeekNumber(d, value);
  } else {
    callDateSet(d, method, value, safe);
  }
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

function tzOffset(d) {
  return d.getTimezoneOffset();
}

// Argument helpers

function collectUpdateDateArguments(args, allowDuration) {
  var arg1 = args[0], arg2 = args[1], params, reset;
  if (allowDuration && isString(arg1)) {
    params = getDateParamsFromString(arg1);
    reset  = arg2;
  } else if (isNumber(arg1) && isNumber(arg2)) {
    params = collectDateParamsFromArguments(args);
  } else {
    params = isObjectType(arg1) ? simpleClone(arg1) : arg1;
    reset  = arg2;
  }
  return [params, reset];
}

function collectDateParamsFromArguments(args) {
  var params = {}, index = 0;
  walkUnitDown(YEAR_INDEX, function(unit) {
    var arg = args[index++];
    if (isDefined(arg)) {
      params[unit.name] = arg;
    }
  });
  return params;
}

function getDateParamsFromString(str) {
  var match, num, params = {};
  match = str.match(/^(-?\d*[\d.]\d*)?\s?(\w+?)s?$/i);
  if (match) {
    if (isUndefined(num)) {
      num = match[1] ? +match[1] : 1;
    }
    params[match[2].toLowerCase()] = num;
  }
  return params;
}

// Iteration helpers

// Years -> Milliseconds
function iterateOverDateUnits(fn, startIndex, endIndex) {
  endIndex = endIndex || 0;
  if (isUndefined(startIndex)) {
    startIndex = YEAR_INDEX;
  }
  for (var index = startIndex; index >= endIndex; index--) {
    if (fn(DateUnits[index], index) === false) {
      break;
    }
  }
}

// Years -> Milliseconds using getLower/Higher methods
function walkUnitDown(unitIndex, fn) {
  while (unitIndex >= 0) {
    if (fn(DateUnits[unitIndex], unitIndex) === false) {
      break;
    }
    unitIndex = getLowerUnitIndex(unitIndex);
  }
}

// Moving lower from specific unit
function getLowerUnitIndex(index) {
  if (index === MONTH_INDEX) {
    return DAY_INDEX;
  } else if (index === WEEK_INDEX) {
    return HOURS_INDEX;
  }
  return index - 1;
}

// Moving higher from specific unit
function getHigherUnitIndex(index) {
  return index === DAY_INDEX ? MONTH_INDEX : index + 1;
}

// Years -> Milliseconds checking all date params including "weekday"
function iterateOverDateParams(params, fn, startIndex, endIndex) {

  function run(name, unit, i) {
    var val = getDateParam(params, name);
    if (isDefined(val)) {
      fn(name, val, unit, i);
    }
  }

  iterateOverDateUnits(function (unit, i) {
    var result = run(unit.name, unit, i);
    if (result !== false && i === DAY_INDEX) {
      // Check for "weekday", which has a distinct meaning
      // in the context of setting a date, but has the same
      // meaning as "day" as a unit of time.
      result = run('weekday', unit, i);
    }
    return result;
  }, startIndex, endIndex);

}

// Years -> Days
function iterateOverHigherDateParams(params, fn) {
  iterateOverDateParams(params, fn, YEAR_INDEX, DAY_INDEX);
}

// Advancing helpers

function advanceDate(d, unit, num, reset) {
  var set = {};
  set[unit] = num;
  return updateDate(d, set, reset, 1);
}

function advanceDateWithArgs(d, args, dir) {
  args = collectUpdateDateArguments(args, true);
  return updateDate(d, args[0], args[1], dir);
}

// Edge helpers

function resetTime(d) {
  return setUnitAndLowerToEdge(d, HOURS_INDEX);
}

function resetLowerUnits(d, unitIndex) {
  return setUnitAndLowerToEdge(d, getLowerUnitIndex(unitIndex));
}

function moveToBeginningOfWeek(d, firstDayOfWeek) {
  setWeekday(d, floor((getWeekday(d) - firstDayOfWeek) / 7) * 7 + firstDayOfWeek);
  return d;
}

function moveToEndOfWeek(d, firstDayOfWeek) {
  var target = firstDayOfWeek - 1;
  setWeekday(d, ceil((getWeekday(d) - target) / 7) * 7 + target);
  return d;
}

function moveToBeginningOfUnit(d, unitIndex, localeCode) {
  if (unitIndex === WEEK_INDEX) {
    moveToBeginningOfWeek(d, localeManager.get(localeCode).getFirstDayOfWeek());
  }
  return setUnitAndLowerToEdge(d, getLowerUnitIndex(unitIndex));
}

function moveToEndOfUnit(d, unitIndex, localeCode, stopIndex) {
  if (unitIndex === WEEK_INDEX) {
    moveToEndOfWeek(d, localeManager.get(localeCode).getFirstDayOfWeek());
  }
  return setUnitAndLowerToEdge(d, getLowerUnitIndex(unitIndex), stopIndex, true);
}

function setUnitAndLowerToEdge(d, startIndex, stopIndex, end) {
  walkUnitDown(startIndex, function(unit, i) {
    var val = end ? unit.end : unit.start;
    if (isFunction(val)) {
      val = val(d);
    }
    callDateSet(d, unit.method, val);
    return !isDefined(stopIndex) || i > stopIndex;
  });
  return d;
}

// Param helpers

function getDateParamKey(params, key) {
  return getOwnKey(params, key) ||
         getOwnKey(params, key + 's') ||
         (key === 'day' && getOwnKey(params, 'date'));
}

function getDateParam(params, key) {
  return getOwn(params, getDateParamKey(params, key));
}

function deleteDateParam(params, key) {
  delete params[getDateParamKey(params, key)];
}

function getUnitIndexForParamName(name) {
  var params = {}, unitIndex;
  params[name] = 1;
  iterateOverDateParams(params, function(name, val, unit, i) {
    unitIndex = i;
    return false;
  });
  return unitIndex;
}

// Time distance helpers

function getDaysSince(d1, d2) {
  return getTimeDistanceForUnit(d1, d2, DateUnits[DAY_INDEX]);
}

function getTimeDistanceForUnit(d1, d2, unit) {
  var fwd = d2 > d1, num, tmp;
  if (!fwd) {
    tmp = d2;
    d2  = d1;
    d1  = tmp;
  }
  num = d2 - d1;
  if (unit.multiplier > 1) {
    num = trunc(num / unit.multiplier);
  }
  // For higher order with potential ambiguity, use the numeric calculation
  // as a starting point, then iterate until we pass the target date. Decrement
  // starting point by 1 to prevent overshooting the date due to inconsistencies
  // in ambiguous units numerically. For example, calculating the number of days
  // from the beginning of the year to August 5th at 11:59:59 by doing a simple
  // d2 - d1 will produce different results depending on whether or not a
  // timezone shift was encountered due to DST, however that should not have an
  // effect on our calculation here, so subtract by 1 to ensure that the
  // starting point has not already overshot our target date.
  if (unit.ambiguous) {
    d1 = cloneDate(d1);
    if (num) {
      num -= 1;
      advanceDate(d1, unit.name, num);
    }
    while (d1 < d2) {
      advanceDate(d1, unit.name, 1);
      if (d1 > d2) {
        break;
      }
      num += 1;
    }
  }
  return fwd ? -num : num;
}

// Parsing helpers

function getYearFromAbbreviation(str, d, prefer) {
  // Following IETF here, adding 1900 or 2000 depending on the last two digits.
  // Note that this makes no accordance for what should happen after 2050, but
  // intentionally ignoring this for now. https://www.ietf.org/rfc/rfc2822.txt
  var val = +str, delta;
  val += val < 50 ? 2000 : 1900;
  if (prefer) {
    delta = val - getYear(d);
    if (delta / abs(delta) !== prefer) {
      val += prefer * 100;
    }
  }
  return val;
}

// Week number helpers

function setISOWeekNumber(d, num) {
  if (isNumber(num)) {
    // Intentionally avoiding updateDate here to prevent circular dependencies.
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

// Week year helpers

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

function moveToFirstDayOfWeekYear(d, firstDayOfWeek, firstDayOfWeekYear) {
  setUnitAndLowerToEdge(d, MONTH_INDEX);
  setDate(d, firstDayOfWeekYear);
  moveToBeginningOfWeek(d, firstDayOfWeek);
}

// Relative helpers

function dateRelative(d, dRelative, arg1, arg2) {
  var adu, format, type, localeCode, fn;
  assertDateIsValid(d);
  if (isFunction(arg1)) {
    fn = arg1;
  } else {
    localeCode = arg1;
    fn = arg2;
  }
  adu = getAdjustedUnitForDate(d, dRelative);
  if (fn) {
    format = fn.apply(d, adu.concat(localeManager.get(localeCode)));
    if (format) {
      return dateFormat(d, format, localeCode);
    }
  }
  // Adjust up if time is in ms, as this doesn't
  // look very good for a standard relative date.
  if (adu[1] === 0) {
    adu[1] = 1;
    adu[0] = 1;
  }
  if (dRelative) {
    type = 'duration';
  } else if (adu[2] > 0) {
    type = 'future';
  } else {
    type = 'past';
  }
  return localeManager.get(localeCode).getRelativeFormat(adu, type);
}

// Gets an "adjusted date unit" which is a way of representing
// the largest possible meaningful unit. In other words, if passed
// 3600000, this will return an array which represents "1 hour".
function getAdjustedUnit(ms, fn) {
  var unitIndex = 0, value = 0;
  iterateOverDateUnits(function(unit, i) {
    value = abs(fn(unit));
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
// Reserving dRelative to allow another date to be relative to.
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

// Foramtting helpers

// Formatting tokens
var ldmlTokens, strfTokens;

function dateFormat(d, format, localeCode) {
  assertDateIsValid(d);
  format = CoreOutputFormats[format] || format || '{long}';
  return dateFormatMatcher(format, d, localeCode);
}

function getMeridiemToken(d, localeCode) {
  var hours = getHours(d);
  return localeManager.get(localeCode).ampm[trunc(hours / 12)] || '';
}

function buildDateFormatTokens() {

  function addFormats(target, tokens, fn) {
    if (tokens) {
      forEach(spaceSplit(tokens), function(token) {
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

  forEachProperty(CoreOutputFormats, function(src, name) {
    addFormats(ldmlTokens, name, buildAlias(src));
  });

  defineInstanceSimilar(sugarDate, 'short medium long full', function(methods, name) {
    var fn = getIdentityFormat(name);
    addFormats(ldmlTokens, name, fn);
    methods[name] = fn;
  });

  addFormats(ldmlTokens, 'time', getIdentityFormat('time'));
  addFormats(ldmlTokens, 'stamp', getIdentityFormat('stamp'));
}

// Format matcher

var dateFormatMatcher;

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

// Comparison helpers

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
  var loMargin = 0, hiMargin = 0, timezoneShift, compareEdges, override, min, max, p, t;

  function getTimezoneShift() {
    // If there is any specificity in the date then we're implicitly not
    // checking absolute time, so ignore timezone shifts.
    if (p.set && p.set.specificity) {
      return 0;
    }
    return (tzOffset(p.date) - tzOffset(date)) * MINUTES;
  }

  function addSpecificUnit() {
    var unit = DateUnits[p.set.specificity];
    return advanceDate(cloneDate(p.date), unit.name, 1).getTime() - 1;
  }

  if (_utc(date)) {
    options = options || {};
    options.fromUTC = true;
    options.setUTC = true;
  }

  p = getExtendedDate(null, d, options, true);

  if (margin > 0) {
    loMargin = hiMargin = margin;
    override = true;
  }
  if (!dateIsValid(p.date)) return false;
  if (p.set && p.set.specificity) {
    if (isDefined(p.set.edge) || isDefined(p.set.shift)) {
      compareEdges = true;
      moveToBeginningOfUnit(p.date, p.set.specificity, localeCode);
    }
    if (compareEdges || p.set.specificity === MONTH_INDEX) {
      max = moveToEndOfUnit(cloneDate(p.date), p.set.specificity, localeCode).getTime();
    } else {
      max = addSpecificUnit();
    }
    if (!override && isDefined(p.set.sign) && p.set.specificity) {
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
  timezoneShift = getTimezoneShift();
  // istanbul ignore if
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

// Create helpers

function createDate(d, options, forceClone) {
  return getExtendedDate(null, d, options, forceClone).date;
}

function createDateWithContext(contextDate, d, options, forceClone) {
  return getExtendedDate(contextDate, d, options, forceClone).date;
}

function getExtendedDate(contextDate, d, opt, forceClone) {

  // Locals
  var date, set, loc, afterCallbacks, relative, weekdayDir;

  // Options
  var optPrefer, optLocale, optFromUTC, optSetUTC, optParams, optClone;

  afterCallbacks = [];

  setupOptions(opt);

  function setupOptions(opt) {
    opt = isString(opt) ? { locale: opt } : opt || {};
    optPrefer  = +!!getOwn(opt, 'future') - +!!getOwn(opt, 'past');
    optLocale  = getOwn(opt, 'locale');
    optFromUTC = getOwn(opt, 'fromUTC');
    optSetUTC  = getOwn(opt, 'setUTC');
    optParams  = getOwn(opt, 'params');
    optClone   = getOwn(opt, 'clone');
  }

  function parseFormatValues(match, dif) {
    var set = optParams || {};
    forEach(dif.to, function(param, i) {
      var str = match[i + 1], val;
      if (!str) return;

      val = parseIrregular(str, param);

      if (isUndefined(val)) {
        val = loc.parseValue(str, param);
      }

      set[param] = val;
    });
    return set;
  }

  function parseIrregular(str, param) {
    if (param === 'utc') {
      return 1;
    } else if (param === 'year') {
      var match = str.match(ABBREVIATED_YEAR_REG);
      if (match) {
        return getYearFromAbbreviation(match[1], date, optPrefer);
      }
    }
  }

  // Force the UTC flags to be true if the source date
  // date is UTC, as they will be overwritten later.
  function cloneDateByFlag(d, clone) {
    if (_utc(d) && !isDefined(optFromUTC)) {
      optFromUTC = true;
    }
    if (_utc(d) && !isDefined(optSetUTC)) {
      optSetUTC = true;
    }
    if (clone) {
      d = new Date(d.getTime());
    }
    return d;
  }

  function afterDateSet(fn) {
    afterCallbacks.push(fn);
  }

  function fireCallbacks() {
    forEach(afterCallbacks, function(fn) {
      fn.call();
    });
  }

  function parseStringDate(str) {

    str = str.toLowerCase();

    // The act of getting the locale will initialize
    // if it is missing and add the required formats.
    loc = localeManager.get(optLocale);

    for (var i = 0, dif, match; dif = loc.compiledFormats[i]; i++) {
      match = str.match(dif.reg);
      if (match) {

        // Note that caching the format will modify the compiledFormats array
        // which is not a good idea to do inside its for loop, however we
        // know at this point that we have a matched format and that we will
        // break out below, so simpler to do it here.
        loc.cacheFormat(dif, i);

        set = parseFormatValues(match, dif);

        if (isDefined(set.timestamp)) {
          date.setTime(set.timestamp);
          break;
        }

        if (isDefined(set.ampm)) {
          handleAmpm(set.ampm);
        }

        if (set.utc || isDefined(set.tzHour)) {
          handleTimezoneOffset(set.tzHour, set.tzMinute);
        }

        if (isDefined(set.shift) && isUndefined(set.unit)) {
          // "next january", "next monday", etc
          handleUnitlessShift();
        }

        if (isDefined(set.num) && isUndefined(set.unit)) {
          // "the second of January", etc
          handleUnitlessNum(set.num);
        }

        if (set.midday) {
          // "noon" and "midnight"
          handleMidday(set.midday);
        }

        if (isDefined(set.day)) {
          // Relative day localizations such as "today" and "tomorrow".
          handleRelativeDay(set.day);
        }

        if (isDefined(set.unit)) {
          // "3 days ago", etc
          handleRelativeUnit(set.unit);
        }

        if (set.edge) {
          // "the end of January", etc
          handleEdge(set.edge, set);
        }

        break;
      }
    }

    if (!set) {
      // TODO: remove in next major version
      // Fall back to native parsing
      date = new Date(str);
      if (optFromUTC && dateIsValid(date)) {
        // Falling back to system date here which cannot be parsed as UTC,
        // so if we're forcing UTC then simply add the offset.
        date.setTime(date.getTime() + (tzOffset(date) * MINUTES));
      }
    } else if (relative) {
      updateDate(date, set, false, 1);
    } else {
      updateDate(date, set, true, 0, optPrefer, weekdayDir, contextDate);
    }
    fireCallbacks();
    return date;
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

  function handleTimezoneOffset(tzHour, tzMinute) {
    // Adjust for timezone offset
    _utc(date, true);

    // Sign is parsed as part of the hour, so flip
    // the minutes if it's negative.

    if (tzHour < 0) {
      tzMinute *= -1;
    }

    var offset = tzHour * 60 + (tzMinute || 0);
    if (offset) {
      set.minute = (set.minute || 0) - offset;
    }
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

  function handleUnitlessNum(num) {
    if (isDefined(set.weekday)) {
      // "The second Tuesday of March"
      setOrdinalWeekday(num);
    } else if (isDefined(set.month)) {
      // "The second of March"
      set.date = set.num;
    }
  }

  function handleMidday(hour) {
    set.hour = hour % 24;
    if (hour > 23) {
      // If the date has hours past 24, we need to prevent it from traversing
      // into a new day as that would make it being part of a new week in
      // ambiguous dates such as "Monday".
      afterDateSet(function() {
        advanceDate(date, 'date', trunc(hour / 24));
      });
    }
  }

  function handleRelativeDay() {
    resetTime(date);
    if (isUndefined(set.unit)) {
      set.unit = DAY_INDEX;
      set.num  = set.day;
      delete set.day;
    }
  }

  function handleRelativeUnit(unitIndex) {
    var num;

    if (isDefined(set.num)) {
      num = set.num;
    } else if (isDefined(set.edge) && isUndefined(set.shift)) {
      num = 0;
    } else {
      num = 1;
    }

    // If a weekday is defined, there are 3 possible formats being applied:
    //
    // 1. "the day after monday": unit is days
    // 2. "next monday": short for "next week monday", unit is weeks
    // 3. "the 2nd monday of next month": unit is months
    //
    // In the first case, we need to set the weekday up front, as the day is
    // relative to it. The second case also needs to be handled up front for
    // formats like "next monday at midnight" which will have its weekday reset
    // if not set up front. The last case will set up the params necessary to
    // shift the weekday and allow separateAbsoluteUnits below to handle setting
    // it after the date has been shifted.
    if(isDefined(set.weekday)) {
      if(unitIndex === MONTH_INDEX) {
        setOrdinalWeekday(num);
        num = 1;
      } else {
        updateDate(date, { weekday: set.weekday }, true);
        delete set.weekday;
      }
    }

    if (set.half) {
      // Allow localized "half" as a standalone colloquialism. Purposely avoiding
      // the locale number system to reduce complexity. The units "month" and
      // "week" are purposely excluded in the English date formats below, as
      // "half a week" and "half a month" are meaningless as exact dates.
      num *= set.half;
    }

    if (isDefined(set.shift)) {
      // Shift and unit, ie "next month", "last week", etc.
      num *= set.shift;
    } else if (set.sign) {
      // Unit and sign, ie "months ago", "weeks from now", etc.
      num *= set.sign;
    }

    if (isDefined(set.day)) {
      // "the day after tomorrow"
      num += set.day;
      delete set.day;
    }

    // Formats like "the 15th of last month" or "6:30pm of next week"
    // contain absolute units in addition to relative ones, so separate
    // them here, remove them from the params, and set up a callback to
    // set them after the relative ones have been set.
    separateAbsoluteUnits(unitIndex);

    // Finally shift the unit.
    set[English.units[unitIndex]] = num;
    relative = true;
  }

  function handleEdge(edge, params) {
    var edgeIndex = params.unit, weekdayOfMonth;
    if (!edgeIndex) {
      // If we have "the end of January", then we need to find the unit index.
      iterateOverHigherDateParams(params, function(unitName, val, unit, i) {
        if (unitName === 'weekday' && isDefined(params.month)) {
          // If both a month and weekday exist, then we have a format like
          // "the last tuesday in November, 2012", where the "last" is still
          // relative to the end of the month, so prevent the unit "weekday"
          // from taking over.
          return;
        }
        edgeIndex = i;
      });
    }
    if (edgeIndex === MONTH_INDEX && isDefined(params.weekday)) {
      // If a weekday in a month exists (as described above),
      // then set it up to be set after the date has been shifted.
      weekdayOfMonth = params.weekday;
      delete params.weekday;
    }
    afterDateSet(function() {
      var stopIndex;
      // "edge" values that are at the very edge are "2" so the beginning of the
      // year is -2 and the end of the year is 2. Conversely, the "last day" is
      // actually 00:00am so it is 1. -1 is reserved but unused for now.
      if (edge < 0) {
        moveToBeginningOfUnit(date, edgeIndex, optLocale);
      } else if (edge > 0) {
        if (edge === 1) {
          stopIndex = DAY_INDEX;
          moveToBeginningOfUnit(date, DAY_INDEX);
        }
        moveToEndOfUnit(date, edgeIndex, optLocale, stopIndex);
      }
      if (isDefined(weekdayOfMonth)) {
        setWeekday(date, weekdayOfMonth, -edge);
        resetTime(date);
      }
    });
    if (edgeIndex === MONTH_INDEX) {
      params.specificity = DAY_INDEX;
    } else {
      params.specificity = edgeIndex - 1;
    }
  }

  function setOrdinalWeekday(num) {
    // If we have "the 2nd Tuesday of June", then pass the "weekdayDir"
    // flag along to updateDate so that the date does not accidentally traverse
    // into the previous month. This needs to be independent of the "prefer"
    // flag because we are only ensuring that the weekday is in the future, not
    // the entire date.
    set.weekday = 7 * (num - 1) + set.weekday;
    set.date = 1;
    weekdayDir = 1;
  }

  function separateAbsoluteUnits(unitIndex) {
    var params;

    iterateOverDateParams(set, function(name, val, unit, i) {
      // If there is a time unit set that is more specific than
      // the matched unit we have a string like "5:30am in 2 minutes",
      // which is meaningless, so invalidate the date...
      if (i >= unitIndex) {
        date.setTime(NaN);
        return false;
      } else if (i < unitIndex) {
        // ...otherwise set the params to set the absolute date
        // as a callback after the relative date has been set.
        params = params || {};
        params[name] = val;
        deleteDateParam(set, name);
      }
    });
    if (params) {
      afterDateSet(function() {
        updateDate(date, params, true, 0, false, weekdayDir);
        if (optParams) {
          simpleMerge(optParams, params);
        }
      });
      if (set.edge) {
        // "the end of March of next year"
        handleEdge(set.edge, params);
        delete set.edge;
      }
    }
  }

  if (contextDate && d) {
    // If a context date is passed ("get" and "unitsFromNow"),
    // then use it as the starting point.
    date = cloneDateByFlag(contextDate, true);
  } else {
    date = getNewDate();
  }

  _utc(date, optFromUTC);

  if (isString(d)) {
    date = parseStringDate(d);
  } else if (isDate(d)) {
    date = cloneDateByFlag(d, optClone || forceClone);
  } else if (isObjectType(d)) {
    set = simpleClone(d);
    updateDate(date, set, true);
  } else if (isNumber(d) || d === null) {
    date.setTime(d);
  }
  // A date created by parsing a string presumes that the format *itself* is
  // UTC, but not that the date, once created, should be manipulated as such. In
  // other words, if you are creating a date object from a server time
  // "2012-11-15T12:00:00Z", in the majority of cases you are using it to create
  // a date that will, after creation, be manipulated as local, so reset the utc
  // flag here unless "setUTC" is also set.
  _utc(date, !!optSetUTC);
  return {
    set: set,
    date: date
  };
}

// TODO: consolidate arguments into options
function updateDate(d, params, reset, advance, prefer, weekdayDir, contextDate) {
  var upperUnitIndex;

  function setUpperUnit(unitName, unitIndex) {
    if (prefer && !upperUnitIndex) {
      if (unitName === 'weekday') {
        upperUnitIndex = WEEK_INDEX;
      } else {
        upperUnitIndex = getHigherUnitIndex(unitIndex);
      }
    }
  }

  function setSpecificity(unitIndex) {
    // Other functions may preemptively set the specificity before arriving
    // here so concede to them if they have already set more specific units.
    if (unitIndex > params.specificity) {
      return;
    }
    params.specificity = unitIndex;
  }

  function canDisambiguate() {
    if (!upperUnitIndex || upperUnitIndex > YEAR_INDEX) {
      return;
    }

    switch(prefer) {
      case -1: return d >= (contextDate || getNewDate());
      case  1: return d <= (contextDate || getNewDate());
    }
  }

  function disambiguateHigherUnit() {
    var unit = DateUnits[upperUnitIndex];
    advance = prefer;
    setUnit(unit.name, 1, unit, upperUnitIndex);
  }

  function handleFraction(unit, unitIndex, fraction) {
    if (unitIndex) {
      var lowerUnit = DateUnits[getLowerUnitIndex(unitIndex)];
      var val = round(unit.multiplier / lowerUnit.multiplier * fraction);
      params[lowerUnit.name] = val;
    }
  }

  function monthHasShifted(d, targetMonth) {
    if (targetMonth < 0) {
      targetMonth = targetMonth % 12 + 12;
    }
    return targetMonth % 12 !== getMonth(d);
  }

  function setUnit(unitName, value, unit, unitIndex) {
    var method = unit.method, checkMonth, fraction;

    setUpperUnit(unitName, unitIndex);
    setSpecificity(unitIndex);

    fraction = value % 1;
    if (fraction) {
      handleFraction(unit, unitIndex, fraction);
      value = trunc(value);
    }

    if (unitName === 'weekday') {
      if (!advance) {
        // Weekdays are always considered absolute units so simply set them
        // here even if it is an "advance" operation. This is to help avoid
        // ambiguous meanings in "advance" as well as to neatly allow formats
        // like "Wednesday of next week" without more complex logic.
        setWeekday(d, value, weekdayDir);
      }
      return;
    }
    checkMonth = unitIndex === MONTH_INDEX && getDate(d) > 28;

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
    // to be an acutal hour ahead, which can only be accomplished by setting
    // the absolute time. Conversely, any unit higher than "hours" MUST use
    // the internal set methods, as they are ambiguous as absolute units of
    // time. Years may be 365 or 366 days depending on leap years, months are
    // all over the place, and even days may be 23-25 hours depending on DST
    // shifts. Finally, note that the kind of jumping described above will
    // occur when calling ANY "set" method on the date and will occur even if
    // the value being set is identical to the one currently set (i.e.
    // setHours(2) on a date at 2am may not be a noop). This is precarious,
    // so avoiding this situation in callDateSet by checking up front that
    // the value is not the same before setting.
    if (advance && !unit.ambiguous) {
      d.setTime(d.getTime() + (value * advance * unit.multiplier));
      return;
    } else if (advance) {
      if (unitIndex === WEEK_INDEX) {
        value *= 7;
        method = DateUnits[DAY_INDEX].method;
      }
      value = (value * advance) + callDateGet(d, method);
    }
    callDateSetWithWeek(d, method, value, advance);
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
    params = { millisecond: params };
  } else if (isNumber(params)) {
    // Otherwise just set the timestamp and return.
    d.setTime(params);
    return d;
  }

  iterateOverDateParams(params, setUnit);

  if (reset && params.specificity) {
    resetLowerUnits(d, params.specificity);
  }

  // If past or future is preferred, then the process of "disambiguation" will
  // ensure that an ambiguous time/date ("4pm", "thursday", "June", etc.) will
  // be in the past or future. Weeks are only considered ambiguous if there is
  // a weekday, i.e. "thursday" is an ambiguous week, but "the 4th" is an
  // ambiguous month.
  if (canDisambiguate()) {
    disambiguateHigherUnit();
  }
  return d;
}

// Locales

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

function getParsingTokenWithSuffix(field, src, suffix) {
  var token = LocalizedParsingTokens[field];
  if (token.requiresSuffix) {
    src = getRegNonCapturing(src + getRegNonCapturing(suffix));
  } else if (token.requiresSuffixOr) {
    src += getRegNonCapturing(token.requiresSuffixOr + '|' + suffix);
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

    // TODO: rename to parse in next major version
    parseValue: function(str, param) {
      var map = this[param + 'Map'];
      if (hasOwn(map, str)) {
        return map[str];
      }
      return this.parseNumber(str, param);
    },

    // TODO: analyze performance of parsing first vs checking
    // numeralMap first.
    parseNumber: function(str, param) {
      var val;

      // Simple numerals such as "one" are mapped directly in
      // the numeral map so catch up front if there is a match.
      if (hasOwn(this.numeralMap, str)) {
        val = this.numeralMap[str];
      }

      // TODO: perf test isNaN vs other methods
      if (isNaN(val)) {
        val = this.parseRegularNumerals(str);
      }

      if (isNaN(val)) {
        val = this.parseIrregularNumerals(str);
      }

      if (param === 'month') {
        // Months are the only numeric date field
        // whose value is not the same as its number.
        val -= 1;
      }

      return val;
    },

    // TODO: perf test returning up front if no regular decimals exist
    parseRegularNumerals: function(str) {
      // Allow decimals as commas and the minus-sign as per ISO-8601.
      str = str.replace(/^−/, '-').replace(/,/, '.');

      // The unary plus operator here shows better performance and handles
      // every format that parseFloat does with the exception of trailing
      // characters, which are guaranteed not to be in our string at this point.
      return +str;
    },

    parseIrregularNumerals: function(str) {
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
          digit = getOwn(fullWidthNumberMap, numeral) || 0;
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

    getRelativeFormat: function(adu, type) {
      return this.convertAdjustedToFormat(adu, type);
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

    convertAdjustedToFormat: function(adu, type) {
      var sign, unit, mult,
          num    = adu[0],
          u      = adu[1],
          ms     = adu[2],
          format = this[type] || this.relative;
      if (isFunction(format)) {
        return format.call(this, num, u, ms, type);
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

    cacheFormat: function(dif, i) {
      this.compiledFormats.splice(i, 1);
      this.compiledFormats.unshift(dif);
    },

    addFormat: function(format) {
      var loc = this, src, to;

      function getTokenSrc(token) {
        var suffix, src, tmp,
            opt   = token.match(/\?$/),
            nc    = token.match(/^(\d+)\??$/),
            slice = token.match(/(\d)(?:-(\d))?/),
            param = token.replace(/[^a-z]+$/i, '');

        // Allowing alias tokens such as {time}
        if (tmp = getOwn(loc.parsingAliases, param)) {
          src = formatToSrc(tmp);
          if (opt) {
            src = getRegNonCapturing(src, true);
          }
          return src;
        }

        if (nc) {
          src = loc.tokens[nc[1]];
        } else if (tmp = getOwn(CoreParsingTokens, param)) {
          src = tmp.src;
          param = tmp.param || param;
        } else {
          tmp = getOwn(loc.parsingTokens, param) || getOwn(loc, param);

          // Both the "months" array and the "month" parsing token can be accessed
          // by either {month} or {months}, falling back as necessary, however
          // regardless of whether or not a fallback occurs, the final field to
          // be passed to addRawFormat must be normalized as singular.
          param = param.replace(/s$/, '');

          if (!tmp) {
            tmp = getOwn(loc.parsingTokens, param) || getOwn(loc, param + 's');
          }

          if (isString(tmp)) {
            src = tmp;
            suffix = loc[param + 'Suffix'];
          } else {

            // This is a hack to temporarily disallow parsing of single character
            // weekdays until the format can be changed to allow for this.
            if (param === 'weekday' && loc.code === 'ko') {
              tmp = tmp.filter(function(str) {
                return str.length > 1;
              });
            }

            if (slice) {
              tmp = filter(tmp, function(m, i) {
                var mod = i % (loc.units ? 8 : tmp.length);
                return mod >= slice[1] && mod <= (slice[2] || slice[1]);
              });
            }
            src = arrayToRegAlternates(tmp);
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
          to.push(param);
          src = '(' + src + ')';
        }
        if (suffix) {
          // Date/time suffixes such as those in CJK
          src = getParsingTokenWithSuffix(param, src, suffix);
        }
        if (opt) {
          src += '?';
        }
        return src;
      }

      function formatToSrc(str) {

        // Make spaces optional
        str = str.replace(/ /g, ' ?');

        str = str.replace(/\{([^,]+?)\}/g, function(match, token) {
          var tokens = token.split('|');
          if (tokens.length > 1) {
            return getRegNonCapturing(map(tokens, getTokenSrc).join('|'));
          } else {
            return getTokenSrc(token);
          }
        });

        return str;
      }

      function parseInputFormat() {
        to = [];
        src = formatToSrc(format);
      }

      parseInputFormat();
      loc.addRawFormat(src, to);
    },

    addRawFormat: function(format, to) {
      this.compiledFormats.unshift({
        reg: RegExp('^ *' + format + ' *$', 'i'),
        to: to
      });
    },

    init: function(def) {
      var loc = this;

      // -- Initialization helpers

      function initFormats() {
        loc.compiledFormats = [];
        loc.parsingAliases = {};
        loc.parsingTokens = {};
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

      function buildTimeFormats() {
        loc.parsingAliases['time'] = getTimeFormat();
        loc.parsingAliases['tzOffset'] = getTZOffsetFormat();
      }

      function getTimeFormat(standalone) {
        var src, sep;
        sep = getTimeSeparatorSrc(standalone);
        if (loc.ampmFront) {
          // "ampmFront" exists mostly for CJK locales, which also presume that
          // time suffixes exist, allowing this to be a simpler regex.
          src = '{ampm?} {hour} (?:{minute} (?::?{second})?)?';
        } else if(loc.ampm.length) {
          src = '{hour}(?:'+sep+'{minute?}(?:'+sep+'{second?})? {ampm?}| {ampm})';
        } else {
          src = '{hour}(?:'+sep+'{minute?}(?:'+sep+'{second?})?)';
        }
        return src;
      }

      function getTimeSeparatorSrc() {
        if (loc.timeSeparator) {
          return '[:' + loc.timeSeparator + ']';
        } else {
          return ':';
        }
      }

      function getTZOffsetFormat() {
        return '(?:{Z}|{GMT?}(?:{tzHour}(?::?{tzMinute}(?: \\([\\w\\s]+\\))?)?)?)?';
      }

      function buildParsingTokens() {
        forEachProperty(LocalizedParsingTokens, function(token, name) {
          var src = token.base ? getCoreTokensForBase(token.base) : token.src, arr;
          if (token.requiresNumerals || loc.numeralUnits) {
            src += getNumeralSrc();
          }
          arr = loc[name + 's'];
          if (arr && arr.length) {
            src += '|' + arrayToRegAlternates(arr);
          }
          loc.parsingTokens[name] = src;
        });
      }

      function getCoreTokensForBase(base) {
        return base.split('|').map(function(key) {
          return CoreParsingTokens[key].src;
        }).join('|');
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
        iterateOverDateUnits(function(unit, i) {
          var token = loc.timeSuffixes[i];
          if (token) {
            loc[(unit.alias || unit.name) + 'Suffix'] = token;
          }
        });
      }

      function buildModifiers() {
        forEach(loc.modifiers, function(modifier) {
          var name = modifier.name, mapKey = name + 'Map', map;
          map = loc[mapKey] || {};
          forEachAlternate(modifier.src, function(alt, j) {
            var token = getOwn(loc.parsingTokens, name), val = modifier.value;
            map[alt] = val;
            loc.parsingTokens[name] = token ? token + '|' + alt : alt;
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

      // -- Format adding helpers

      function addCoreFormats() {
        forEach(CoreParsingFormats, function(df) {
          var src = df.src;
          if (df.localeCheck && !df.localeCheck(loc)) {
            return;
          }
          if (df.mdy && loc.mdy) {
            // Use the mm/dd/yyyy variant if it
            // exists and the locale requires it
            src = df.mdy;
          }
          if (df.time) {
            // Core formats that allow time require the time
            // reg on both sides, so add both versions here.
            loc.addFormat(getFormatWithTime(src, true));
            loc.addFormat(getFormatWithTime(src));
          } else {
            loc.addFormat(src);
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
        return getRegNonCapturing(markers + '{time}{tzOffset}', true);
      }

      initFormats();
      initDefinition();
      initArrayFields();

      buildValueArray('month', 12);
      buildValueArray('weekday', 7);
      buildValueArray('unit', 8);
      buildValueArray('ampm', 2);

      buildNumerals();
      buildTimeFormats();
      buildParsingTokens();
      buildTimeSuffixes();
      buildModifiers();

      // The order of these formats is important. Order is reversed so formats
      // that are initialized later will take precedence. Generally, this means
      // that more specific formats should come later.
      addCoreFormats();
      addLocaleFormats();

    }

  };

  return new Locale(def);
}


/***
 * @method [units]Since(d, [options])
 * @returns Number
 * @short Returns the time since [d].
 * @extra [d] will accept a date object, timestamp, or string. If not specified,
 *        [d] is assumed to be now. `unitsAgo` is provided as an alias to make
 *        this more readable when [d] is assumed to be the current date.
 *        [options] can be an object or a locale code as a string. See `create`
 *        for more.
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
 * @param {string|number|Date} d
 * @param {DateCreateOptions} options
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
 *        [options] can be an object or a locale code as a string. See `create`
 *        for more.
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
 * @param {string|number|Date} d
 * @param {DateCreateOptions} options
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
 * @method add[Units](n, [reset] = false)
 * @returns Date
 * @short Adds `n` units to the date. If [reset] is true, all lower units will
 *        be reset.
 * @extra This method modifies the date! Note that in the case of `addMonths`,
 *        the date may fall on a date that doesn't exist (i.e. February 30). In
 *        this case the date will be shifted to the last day of the month. Don't
 *        use `addMonths` if you need precision.
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
 * @param {number} n
 * @param {boolean} [reset]
 *
 ***
 * @method isLast[Unit]([localeCode])
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
 * @param {string} [localeCode]
 *
 ***
 * @method isThis[Unit]([localeCode])
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
 * @param {string} [localeCode]
 *
 ***
 * @method isNext[Unit]([localeCode])
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
 * @param {string} [localeCode]
 *
 ***
 * @method beginningOf[Unit]([localeCode])
 * @returns Date
 * @short Sets the date to the beginning of the appropriate unit.
 * @extra This method modifies the date! A locale code can be passed for
 *        `beginningOfWeek`, which is locale dependent. If consistency is
 *        needed, use `beginningOfISOWeek` instead.
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
 * @param {string} [localeCode]
 *
 ***
 * @method endOf[Unit]([localeCode])
 * @returns Date
 * @short Sets the date to the end of the appropriate unit.
 * @extra This method modifies the date! A locale code can be passed for
 *        `endOfWeek`, which is locale dependent. If consistency is needed, use
 *        `endOfISOWeek` instead.
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
 * @param {string} [localeCode]
 *
 ***/
function buildDateUnitMethods() {

  defineInstanceSimilar(sugarDate, DateUnits, function(methods, unit, index) {
    var name = unit.name, caps = simpleCapitalize(name);

    if (index > DAY_INDEX) {
      forEach(['Last','This','Next'], function(shift) {
        methods['is' + shift + caps] = function(d, localeCode) {
          return compareDate(d, shift + ' ' + name, 0, localeCode, { locale: 'en' });
        };
      });
    }
    if (index > HOURS_INDEX) {
      methods['beginningOf' + caps] = function(d, localeCode) {
        return moveToBeginningOfUnit(d, index, localeCode);
      };
      methods['endOf' + caps] = function(d, localeCode) {
        return moveToEndOfUnit(d, index, localeCode);
      };
    }

    methods['add' + caps + 's'] = function(d, num, reset) {
      return advanceDate(d, name, num, reset);
    };

    var since = function(date, d, options) {
      return getTimeDistanceForUnit(date, createDate(d, options, true), unit);
    };
    var until = function(date, d, options) {
      return getTimeDistanceForUnit(createDate(d, options, true), date, unit);
    };

    methods[name + 'sAgo']   = methods[name + 'sUntil']   = until;
    methods[name + 'sSince'] = methods[name + 'sFromNow'] = since;

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
  var special  = spaceSplit('Today Yesterday Tomorrow Weekday Weekend Future Past');
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
   * @method create(d, [options])
   * @returns Date
   * @static
   * @short Alternate date constructor which accepts text formats, a timestamp,
   *        objects, or another date.
   * @extra If no argument is given, the date is assumed to be now. The second
   *        argument can either be an options object or a locale code as a
   *        shortcut. For more, see `date parsing`.
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
   *              it. This flag is the same as calling the `setUTC` method on
   *              the date after parsing is complete. Note that this is
   *              different from `fromUTC`, which parses a string as UTC, but
   *              does not set this flag.
   *
   *   clone      If `true` and `d` is a date, it will be cloned.
   *
   *   params     An optional object that is populated with properties that are
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
   * @param {string|number|Date} d
   * @param {DateCreateOptions} [options]
   *
   * @option {string} [locale]
   * @option {boolean} [past]
   * @option {boolean} [future]
   * @option {boolean} [fromUTC]
   * @option {boolean} [setUTC]
   * @option {boolean} [clone]
   * @option {Object} [params]
   *
   ***/
  'create': function(d, options) {
    return createDate(d, options);
  },

  /***
   * @method getLocale([localeCode] = current)
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
   * @param {string} [localeCode]
   *
   ***/
  'getLocale': function(code) {
    return localeManager.get(code, !code);
  },

  /***
   * @method getAllLocales()
   * @returns Array<Locale>
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
   * @returns string[]
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
   * @method setLocale(localeCode)
   * @returns Locale
   * @static
   * @short Sets the current locale to be used with dates.
   * @extra Sugar has native support for 17 major locales. In addition, you can
   *        define a new locale with `addLocale`. For more, see `date locales`.
   * @example
   *
   *   Date.setLocale('en')
   *
   * @param {string} localeCode
   *
   ***/
  'setLocale': function(code) {
    return localeManager.set(code);
  },

  /***
   * @method addLocale(localeCode, def)
   * @returns Locale
   * @static
   * @short Adds a locale definition to the locales understood by Sugar.
   * @extra This method should only be required for adding locale definitions
   *        that don't already exist. For more, see `date locales`.
   * @example
   *
   *   Date.addLocale('eo', {})
   *
   * @param {string} localeCode
   * @param {Object} def
   *
   ***/
  'addLocale': function(code, set) {
    return localeManager.add(code, set);
  },

  /***
   * @method removeLocale(localeCode)
   * @returns Locale
   * @static
   * @short Deletes the the locale by `localeCode` from Sugar's known locales.
   * @extra For more, see `date locales`.
   * @example
   *
   *   Date.removeLocale('foo')
   *
   * @param {string} localeCode
   *
   ***/
  'removeLocale': function(code) {
    return localeManager.remove(code);
  }

});

defineInstanceWithArguments(sugarDate, {

  /***
   * @method set(set, [reset] = false)
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
   * @signature set(milliseconds)
   * @signature set(year, month, [day], [hour], [minute], [second], [millliseconds])
   * @param {Object} set
   * @param {boolean} [reset]
   * @param {number} year
   * @param {number} month
   * @param {number} [day]
   * @param {number} [hour]
   * @param {number} [minute]
   * @param {number} [second]
   * @param {number} [milliseconds]
   *
   ***/
  'set': function(d, args) {
    args = collectUpdateDateArguments(args);
    return updateDate(d, args[0], args[1]);
  },

  /***
   * @method advance(set, [reset] = false)
   * @returns Date
   * @short Shifts the date forward.
   * @extra `set` accepts multiple formats including an object, a string in the
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
   * @signature advance(milliseconds)
   * @signature advance(year, month, [day], [hour], [minute], [second], [millliseconds])
   * @param {string|Object} set
   * @param {boolean} [reset]
   * @param {number} year
   * @param {number} month
   * @param {number} [day]
   * @param {number} [hour]
   * @param {number} [minute]
   * @param {number} [second]
   * @param {number} [milliseconds]
   *
   ***/
  'advance': function(d, args) {
    return advanceDateWithArgs(d, args, 1);
  },

  /***
   * @method rewind(set, [reset] = false)
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
   * @signature advance(milliseconds)
   * @signature advance(year, month, [day], [hour], [minute], [second], [millliseconds])
   * @param {string|Object} set
   * @param {boolean} [reset]
   * @param {number} year
   * @param {number} month
   * @param {number} [day]
   * @param {number} [hour]
   * @param {number} [minute]
   * @param {number} [second]
   * @param {number} [milliseconds]
   *
   ***/
  'rewind': function(d, args) {
    return advanceDateWithArgs(d, args, -1);
  }

});

defineInstance(sugarDate, {

  /***
   * @method get(d, [options])
   * @returns Date
   * @short Gets a new date using the current one as a starting point.
   * @extra This method is identical to `Date.create`, except that relative
   *        formats like `next month` are relative to the date instance rather
   *        than the current date. Accepts a locale code as a string in place
   *        of [options]. See `create` for more.
   *
   * @example
   *
   *   nextYear.get('monday') -> monday of the week exactly 1 year from now
   *   millenium.get('2 years before') -> 2 years before Jan 1, 2000.
   *
   * @param {string|number|Date} d
   * @param {DateCreateOptions} options
   *
   ***/
  'get': function(date, d, options) {
    return createDateWithContext(date, d, options);
  },

  /***
   * @method setWeekday(dow)
   * @short Sets the weekday of the date, starting with Sunday at `0`.
   * @extra This method modifies the date!
   *
   * @example
   *
   *   d = new Date(); d.setWeekday(1); d; -> Monday of this week
   *   d = new Date(); d.setWeekday(6); d; -> Saturday of this week
   *
   * @param {number} dow
   *
   ***/
  'setWeekday': function(date, dow) {
    return setWeekday(date, dow);
  },

  /***
   * @method setISOWeek(num)
   * @short Sets the week (of the year) as defined by the ISO8601 standard.
   * @extra Note that this standard places Sunday at the end of the week (day 7).
   *        This method modifies the date!
   *
   * @example
   *
   *   d = new Date(); d.setISOWeek(15); d; -> 15th week of the year
   *
   * @param {number} num
   *
   ***/
  'setISOWeek': function(date, num) {
    return setISOWeekNumber(date, num);
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
  'getISOWeek': function(date) {
    return getWeekNumber(date, true);
  },

  /***
   * @method beginningOfISOWeek()
   * @returns Date
   * @short Set the date to the beginning of week as defined by ISO8601.
   * @extra Note that this standard places Monday at the start of the week.
   *        This method modifies the date!
   *
   * @example
   *
   *   new Date().beginningOfISOWeek() -> Monday
   *
   ***/
  'beginningOfISOWeek': function(date) {
    var day = getWeekday(date);
    if (day === 0) {
      day = -6;
    } else if (day !== 1) {
      day = 1;
    }
    setWeekday(date, day);
    return resetTime(date);
  },

  /***
   * @method endOfISOWeek()
   * @returns Date
   * @short Set the date to the end of week as defined by this ISO8601 standard.
   * @extra Note that this standard places Sunday at the end of the week.
   *        This method modifies the date!
   *
   * @example
   *
   *   new Date().endOfISOWeek() -> Sunday
   *
   ***/
  'endOfISOWeek': function(date) {
    if (getWeekday(date) !== 0) {
      setWeekday(date, 7);
    }
    return moveToEndOfUnit(date, DAY_INDEX);
  },

  /***
   * @method getUTCOffset([iso] = false)
   * @returns String
   * @short Returns a string representation of the offset from UTC time. If [iso]
   *        is true the offset will be in ISO8601 format.
   *
   * @example
   *
   *   new Date().getUTCOffset()     -> "+0900"
   *   new Date().getUTCOffset(true) -> "+09:00"
   *
   * @param {boolean} iso
   *
   ***/
  'getUTCOffset': function(date, iso) {
    return getUTCOffset(date, iso);
  },

  /***
   * @method setUTC([on] = false)
   * @returns Date
   * @short Controls a flag on the date that tells Sugar to internally use UTC
   *        methods like `getUTCHours`.
   * @extra This flag is most commonly used for output in UTC time with the
   *        `format` method. Note that this flag only governs which native
   *        methods are called internally – date native methods like `setHours`
   *        will still return local non-UTC values. Also note that other date
   *        operations such as comparison and subtraction still work as normal.
   *        This effectively makes it not meaningful to use date comparison
   *        methods like `isBefore` or difference methods like `hoursBefore`
   *        unless these flags are both the same, as the date is not actually
   *        in UTC time. If such a usage is required, the timezone offset should
   *        instead be manually subtracted. This method will modify the date!
   *
   * @example
   *
   *   new Date().setUTC(true).long()  -> formatted with UTC methods
   *   new Date().setUTC(false).long() -> formatted without UTC methods
   *
   * @param {boolean} on
   *
   ***/
  'setUTC': function(date, on) {
    return _utc(date, on);
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
  'isUTC': function(date) {
    return isUTC(date);
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
  'isValid': function(date) {
    return dateIsValid(date);
  },

  /***
   * @method isAfter(d, [margin] = 0)
   * @returns Boolean
   * @short Returns true if the date is after `d`.
   * @extra [margin] is to allow extra margin of error in ms. `d` will accept
   *        a date object, timestamp, or string. If not specified, `d` is
   *        assumed to be now. See `create` for formats.
   *
   * @example
   *
   *   today.isAfter('tomorrow')  -> false
   *   today.isAfter('yesterday') -> true
   *
   * @param {string|number|Date} d
   * @param {number} [margin]
   *
   ***/
  'isAfter': function(date, d, margin) {
    return date.getTime() > createDate(d).getTime() - (margin || 0);
  },

  /***
   * @method isBefore(d, [margin] = 0)
   * @returns Boolean
   * @short Returns true if the date is before `d`.
   * @extra [margin] is to allow extra margin of error in ms. `d` will accept
   *        a date object, timestamp, or text format. If not specified, `d` is
   *        assumed to be now. See `create` for formats.
   *
   * @example
   *
   *   today.isBefore('tomorrow')  -> true
   *   today.isBefore('yesterday') -> false
   *
   * @param {string|number|Date} d
   * @param {number} [margin]
   *
   ***/
  'isBefore': function(date, d, margin) {
    return date.getTime() < createDate(d).getTime() + (margin || 0);
  },

  /***
   * @method isBetween(d1, d2, [margin] = 0)
   * @returns Boolean
   * @short Returns true if the date is later or equal to `d1` and before or
   *        equal to `d2`.
   * @extra [margin] is to allow extra margin of error in ms. `d1` and `d2` will
   *        accept a date object, timestamp, or text format. If not specified,
   *        they are assumed to be now.  See `create` for formats.
   *
   * @example
   *
   *   new Date().isBetween('yesterday', 'tomorrow')    -> true
   *   new Date().isBetween('last year', '2 years ago') -> false
   *
   * @param {string|number|Date} d1
   * @param {string|number|Date} d2
   * @param {number} [margin]
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
  'isLeapYear': function(date) {
    var year = getYear(date);
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
  'daysInMonth': function(date) {
    return getDaysInMonth(date);
  },

  /***
   * @method format([f], [localeCode] = currentLocaleCode)
   * @returns String
   * @short Returns the date as a string using the format `f`.
   * @extra `f` is a string that contains tokens in either LDML format using
   *        curly braces, or "strftime" format using a percent sign. If `f` is
   *        not specified, the locale specific `{long}` format is used. [localeCode]
   *        is a locale code to use (if not specified the current locale is
   *        used). For more, see `date formatting`.
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
   * @param {string} f
   * @param {string} [localeCode]
   *
   ***
   * @method short([localeCode] = currentLocaleCode)
   * @returns String
   * @short Outputs the date in the short format for the current locale.
   * @extra [localeCode] overrides the current locale code if passed.
   *
   * @example
   *
   *   new Date().short()     -> ex. 02/13/2016
   *   new Date().short('fi') -> ex. 13.2.2016
   *
   * @param {string} [localeCode]
   *
   ***
   * @method medium([localeCode] = currentLocaleCode)
   * @returns String
   * @short Outputs the date in the medium format for the current locale.
   * @extra [localeCode] overrides the current locale code if passed.
   *
   * @example
   *
   *   new Date().medium()     -> ex. February 13, 2016
   *   new Date().medium('ja') -> ex. 2016年2月13日
   *
   * @param {string} [localeCode]
   *
   ***
   * @method long([localeCode] = currentLocaleCode)
   * @returns String
   * @short Outputs the date in the long format for the current locale.
   * @extra [localeCode] overrides the current locale code if passed.
   *
   * @example
   *
   *   new Date().long()     -> ex. February 13, 2016 6:22 PM
   *   new Date().long('es') -> ex. 13 de febrero de 2016 18:22
   *
   * @param {string} [localeCode]
   *
   ***
   * @method full([localeCode] = currentLocaleCode)
   * @returns String
   * @short Outputs the date in the full format for the current locale.
   * @extra [localeCode] overrides the current locale code if passed.
   *
   * @example
   *
   *   new Date().full()     -> ex. Saturday, February 13, 2016 6:23 PM
   *   new Date().full('ru') -> ex. суббота, 13 февраля 2016 г., 18:23
   *
   * @param {string} [localeCode]
   *
   ***/
  'format': function(date, f, localeCode) {
    return dateFormat(date, f, localeCode);
  },

  /***
   * @method relative([localeCode] = currentLocaleCode, [relativeFn])
   * @returns String
   * @short Returns the date in a text format relative to the current time,
   *        such as "5 minutes ago".
   * @extra [relativeFn] is a function that can be passed to provide more granular
   *        control over the resulting string. Its return value will be passed
   *        to `format`. If nothing is returned, the relative format will be
   *        used. [relativeFn] can be passed as the first argument in place of
   *        [locale]. For more about formats, see `date formatting`.
   *
   * @callback relativeFn
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
   * @signature relative([relativeFn])
   * @param {string} [localeCode]
   * @param {relativeFn} [relativeFn]
   * @callbackParam {number} num
   * @callbackParam {number} unit
   * @callbackParam {number} ms
   * @callbackParam {Locale} loc
   * @callbackReturns {string} relativeFn
   *
   ***/
  'relative': function(date, localeCode, relativeFn) {
    return dateRelative(date, null, localeCode, relativeFn);
  },

  /***
   * @method relativeTo(d, [localeCode] = currentLocaleCode)
   * @returns String
   * @short Returns the date in a text format relative to `d`, such as
   *        "5 minutes".
   * @extra `d` will accept a date object, timestamp, or string. [localeCode]
   *        applies to the method output, not `d`.
   *
   * @example
   *
   *   jan.relativeTo(jul)                 -> 5 months
   *   yesterday.relativeTo('today', 'ja') -> 一日
   *
   * @param {string|number|Date} d
   * @param {string} localeCode
   *
   *
   ***/
  'relativeTo': function(date, d, localeCode) {
    return dateRelative(date, createDate(d), localeCode);
  },

  /***
   * @method is(d, [margin] = 0)
   * @returns Boolean
   * @short Returns true if the date matches `d`.
   * @extra `d` will accept a date object, timestamp, or text format. In the
   *        case of objects and text formats, `is` will additionally compare
   *        based on the precision implied in the input. In the case of text
   *        formats `d` will use the currently set locale. [margin] allows an
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
   * @param {string|number|Date} d
   * @param {number} [margin]
   *
   ***/
  'is': function(date, d, margin) {
    return fullCompareDate(date, d, margin);
  },

  /***
   * @method reset([unit] = 'day', [localeCode] = currentLocaleCode)
   * @returns Date
   * @short Resets the date to the beginning of [unit].
   * @extra This method effectively resets all smaller units, pushing the date
   *        to the beginning of [unit]. Default is `day`, which effectively
   *        resets the time. [localeCode] is provided for resetting weeks, which
   *        is locale dependent. This method modifies the date!
   *
   * @example
   *
   *   new Date().reset('day')   -> Beginning of the day
   *   new Date().reset('month') -> Beginning of the month
   *
   * @param {string} [unit]
   * @param {string} [localeCode]
   *
   ***/
  'reset': function(date, unit, localeCode) {
    var unitIndex = unit ? getUnitIndexForParamName(unit) : DAY_INDEX;
    moveToBeginningOfUnit(date, unitIndex, localeCode);
    return date;
  },

  /***
   * @method clone()
   * @returns Date
   * @short Clones the date.
   * @extra Note that the UTC flag will be preserved if set. This flag is
   *        set via the `setUTC` method or an option on `Date.create`.
   *
   * @example
   *
   *   new Date().clone() -> Copy of now
   *
   ***/
  'clone': function(date) {
    return cloneDate(date);
  },

  /***
   * @method iso()
   * @alias toISOString
   *
   ***/
  'iso': function(date) {
    return date.toISOString();
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
  'getWeekday': function(date) {
    return getWeekday(date);
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
  'getUTCWeekday': function(date) {
    return date.getUTCDay();
  }

});


/*** @namespace Number ***/

/***
 * @method [dateUnit]()
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
 * @method [dateUnit]Before(d, [options])
 * @returns Date
 * @short Returns a date that is `n` units before [d], where `n` is the number.
 * @extra [d] will accept a date object, timestamp, or text format. Note that
 *        "months" is ambiguous as a unit of time. If the target date falls on a
 *        day that does not exist (i.e. August 31 -> February 31), the date will
 *        be shifted to the last day of the month. Be careful using
 *        `monthsBefore` if you need exact precision. [options] can be an object
 *        or a locale code as a string. See `create` for more.
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
 * @param {string|number|Date} d
 * @param {DateCreateOptions} options
 *
 ***
 * @method [dateUnit]Ago()
 * @returns Date
 * @short Returns a date that is `n` units ago.
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
 * @method [dateUnit]After(d, [options])
 * @returns Date
 * @short Returns a date `n` units after [d], where `n` is the number.
 * @extra [d] will accept a date object, timestamp, or text format. Note that
 *        "months" is ambiguous as a unit of time. If the target date falls on a
 *        day that does not exist (i.e. August 31 -> February 31), the date will
 *        be shifted to the last day of the month. Be careful using
 *        `monthsAfter` if you need exact precision. [options] can be an object
 *        or a locale code as a string. See `create` for more.
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
 * @param {string|number|Date} d
 * @param {DateCreateOptions} options
 *
 ***
 * @method [dateUnit]FromNow()
 * @returns Date
 * @short Returns a date `n` units from now.
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
  defineInstanceSimilar(sugarNumber, DateUnits, function(methods, unit) {
    var name = unit.name, base, after, before;
    base = function(n) {
      return round(n * unit.multiplier);
    };
    after = function(n, d, options) {
      return advanceDate(createDate(d, options, true), name, n);
    };
    before = function(n, d, options) {
      return advanceDate(createDate(d, options, true), name, -n);
    };
    methods[name] = base;
    methods[name + 's'] = base;
    methods[name + 'Before'] = before;
    methods[name + 'sBefore'] = before;
    methods[name + 'Ago'] = before;
    methods[name + 'sAgo'] = before;
    methods[name + 'After'] = after;
    methods[name + 'sAfter'] = after;
    methods[name + 'FromNow'] = after;
    methods[name + 'sFromNow'] = after;
  });
}

defineInstance(sugarNumber, {

  /***
   * @method duration([localeCode] = currentLocaleCode)
   * @returns String
   * @short Takes the number as milliseconds and returns a localized string.
   * @extra This method is the same as `Date#relative` without the localized
   *        equivalent of "from now" or "ago". [localeCode] can be passed as the
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
   * @param {string} [localeCode]
   *
   ***/
  'duration': function(n, localeCode) {
    return localeManager.get(localeCode).getDuration(n);
  }

});


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
    '(?:just)? now',
    '{shift} {unit:5-7}',
    '{months?} {year}',
    '{midday} {4?} {day|weekday}',
    '{months},?[-.\\/\\s]?{year?}',
    '{edge} of (?:day)? {day|weekday}',
    '{0} {num}{1?} {weekday} {2} {months},? {year?}',
    '{shift?} {day?} {weekday?} (?:at)? {midday}',
    '{sign?} {3?} {half} {3?} {unit:3-4|unit:7} {sign?}',
    '{0?} {edge} {weekday?} {2} {shift?} {unit:4-7?} {months?},? {year?}'
  ],
  'timeParse': [
    '{day|weekday}',
    '{shift} {unit:5?} {weekday}',
    '{0?} {date}{1?} {2?} {months?}',
    '{weekday} {2?} {shift} {unit:5}',
    '{0?} {num} {2?} {months}\\.?,? {year?}',
    '{num?} {unit:4-5} {sign} {day|weekday}',
    '{0|months} {date?}{1?} of {shift} {unit:6-7}',
    '{0?} {num}{1?} {weekday} of {shift} {unit:6}',
    '{year?}[-.\\/\\s]?{months}[-.\\/\\s]{date}',
    '{date}[-.\\/\\s]{months}(?:[-.\\/\\s]{year|yy})?',
    '{weekday?}\\.?,? {months}\\.?,? {date}{1?},? {year?}',
    '{weekday?}\\.?,? {date} {months} {year}'
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

buildLocales();
buildDateFormatTokens();
buildDateFormatMatcher();
buildDateUnitMethods();
buildNumberUnitMethods();
buildRelativeAliases();
setDateChainableConstructor();
