'use strict';

/***
 * @module Date
 * @description Date parsing and formatting, relative formats like "1 minute ago", Number methods like "daysAgo", locale support with default English locale definition.
 *
 ***/

var TIME_FORMAT = ['ampm','hour','minute','second','ampm','utc','offsetSign','offsetHours','offsetMinutes','ampm'];
var LOCALE_FIELDS = ['months','weekdays','units','numbers','articles','tokens','timeMarker','ampm','timeSuffixes','parse','timeParse','modifiers'];

var DECIMAL_REG       = '(?:[,.]\\d+)?';
var REQUIRED_TIME_REG = '({t})?\\s*(\\d{1,2}{d})(?:{h}([0-5]\\d{d})?{m}(?::?([0-5]\\d'+DECIMAL_REG+'){s})?\\s*(?:({t})|(Z)|(?:([+-])(\\d{2,2})(?::?(\\d{2,2}))?)?)?|\\s*({t}))';

var COMPILED_FORMAT_REG = /(\{\w+\})|%\w+|%%|[^{}%]+/g;
var DATE_FORMAT_TOKEN_REG = /\{(\w+)\}|%(%|\w+)/;

var TIMEZONE_ABBREVIATION_REG = /(\w{3})[()\s\d]*$/;

var MINUTE = 60 * 1000;

var CONSTANT_FORMATS = {
  'ISO8601': '{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{SSS}{Z}',
  'RFC1123': '{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {tz}',
  'RFC1036': '{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {tz}'
};

// ISO Defaults
var ISO_FIRST_DAY_OF_WEEK = 1,
    ISO_FIRST_DAY_OF_WEEK_YEAR = 4;

// CJK digits
var cjkDigitMap, cjkDigitReg;

// A hash of date units by name
var dateUnitsByName;

// Output formats are lazily compiled, so store references here.
var compiledOutputFormats = {};

// Format tokens by name
var ldmlTokens = {},
    strfTokens = {};

// Core formats common to every locale
var CoreDateFormats = [
  {
    iso: true,
    time: true,
    match: 'yearSign,year,month,date',
    src:'([+-])?(\\d{4,4})[-.\\/]?{fullMonth}[-.]?(\\d{1,2})?'
  },
  {
    time: true,
    variant: true,
    match: 'date,month,year',
    src: '(\\d{1,2})[-.\\/]{fullMonth}(?:[-.\\/](\\d{2,4}))?'
  },
  {
    match: 'month,year',
    src: '{fullMonth}[-.](\\d{4,4})'
  },
  {
    match: 'timestamp',
    src: '\\/Date\\((\\d+(?:[+-]\\d{4,4})?)\\)\\/'
  }
];

var FormatTokensBase = [
  {
    ldml: 'Dow',
    strf: 'a',
    lowerToken: 'dow',
    get: function(d, localeCode) {
      return localeManager.get(localeCode).getAbbreviatedWeekdayName(getWeekday(d));
    }
  },
  {
    ldml: 'Weekday',
    strf: 'A',
    lowerToken: 'weekday',
    get: function(d, localeCode) {
      return localeManager.get(localeCode).getWeekdayName(getWeekday(d));
    }
  },
  {
    ldml: 'Mon',
    strf: 'b,h',
    lowerToken: 'mon',
    get: function(d, localeCode) {
      return localeManager.get(localeCode).getAbbreviatedMonthName(getMonth(d));
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
    method: 'Date',
    higher: true,
    resetValue: 1,
    multiplier: 24 * 60 * 60 * 1000,
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
    start: 0
  }
];

// General helpers

function tzOffset(d) {
  return d.getTimezoneOffset();
}

function arrayToAlternates(arr) {
  return filter(arr, function(el) {
    return !!el;
  }).join('|');
}

function getNewDate() {
  return _newDateInternal()();
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

function isValid(d) {
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

// Date argument helpers

function collectDateArguments(args, duration) {
  var arg1 = args[0], arg2 = args[1];
  if (duration && isString(arg1)) {
    return [getDateParamsFromString(arg1), arg2];
  } else if (isNumber(arg1) && isNumber(arg2)) {
    return collectParamsFromArguments(args);
  } else {
    if (isObjectType(arg1)) {
      args[0] = simpleClone(arg1);
    }
    return args;
  }
}

function collectParamsFromArguments(args) {
  var obj = {}, u = dateUnitsByName['year'];
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
  if (isUndefined(to)) to = 7;
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
  iterateOverDateUnits(fn, 7, 0);
}

// Days -> Years
function iterateOverHigherDateUnits(fn) {
  iterateOverDateUnits(fn, 4, 7);
}

// Seconds -> Hours
function iterateOverLowerDateUnits(fn) {
  iterateOverDateUnits(fn, 1, 3);
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
  return setUnitAndLowerToEdge(d, dateUnitsByName[unit || 'hours']);
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
  return params[dateParamKey(params, key)];
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

function setWeekday(d, dow, forward) {
  if (!isNumber(dow)) return;
  // Dates like "the 2nd Tuesday of June" need to be set forward
  // so make sure that the day of the week reflects that here.
  if (forward && dow % 7 < getWeekday(d)) {
    dow += 7;
  }
  return setDate(d, getDate(d) + dow - getWeekday(d));
}

function moveToEdgeOfUnit(d, unit, localeCode, edgeOfWeek, end) {
  var lower;
  if (unit === 'week') {
    edgeOfWeek(d, localeManager.get(localeCode).getFirstDayOfWeek());
    lower = dateUnitsByName['hours'];
  } else {
    lower = dateUnitsByName[unit].lower;
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
  return getTimeDistanceForUnit(d1, d2, dateUnitsByName['day']);
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

// Date parsing helpers

function getFormatMatch(match, arr) {
  var obj = {}, value, num;
  forEach(arr, function(key, i) {
    value = match[i + 1];
    if (isUndefined(value) || value === '') return;
    if (key === 'year') {
      obj.yearAsString = value.replace(/'/, '');
    }
    num = parseFloat(value.replace(/'/, '').replace(/,/, HALF_WIDTH_PERIOD));
    obj[key] = !isNaN(num) ? num : value.toLowerCase();
  });
  return obj;
}

function cleanDateInput(str) {
  str = trim(str).replace(/^just (?=now)|\.+$/i, '');
  return convertAsianDigits(str);
}

function convertAsianDigits(str) {
  return str.replace(cjkDigitReg, function(full, disallowed, match) {
    var sum = 0, place = 1, lastWasHolder, lastHolder;
    if (disallowed) return full;
    forEach(match.split('').reverse(), function(letter) {
      var value = cjkDigitMap[letter], holder = value > 9;
      if (holder) {
        if (lastWasHolder) sum += place;
        place *= value / (lastHolder || 1);
        lastHolder = value;
      } else {
        if (lastWasHolder === false) {
          place *= 10;
        }
        sum += place * value;
      }
      lastWasHolder = holder;
    });
    if (lastWasHolder) sum += place;
    return sum;
  });
}

function getDateOptions(opt) {
  var options = isString(opt) ? { locale: opt } : opt || {};
  options.prefer = +!!options.future - +!!options.past;
  return options;
}

function getExtendedDate(contextDate, d, opt) {

  var date, set, options, baseLocale, afterCallbacks, weekdayForward;

  afterCallbacks = [];
  options = getDateOptions(opt);

  function afterDateSet(fn) {
    afterCallbacks.push(fn);
  }

  function fireCallbacks() {
    forEach(afterCallbacks, function(fn) {
      fn.call();
    });
  }

  function getWeekdayWithMultiplier(w) {
    var num = set.num && !set.unit ? set.num : 1;
    return (7 * (num - 1)) + w;
  }


  function handleRelativeUnit(loc) {
    var unitName, unitIndex, num, tmp;
    num = loc.getNumber(set.num);
    unitIndex = loc.getUnitIndex(set.unit);
    unitName  = English.unitsLower[unitIndex];

    // Relative date units such as "tomorrow" have already had their
    // "day" set above so assume 0 shift unless they are explicitly
    // using a shift or have a have a "sign" such as the form
    // "the day after tomorrow".
    if (!set.sign && !set.shift && unitIndex === 4) {
      num = 0;
    }

    // Formats like "the 15th of last month" or "6:30pm of next week"
    // contain absolute units in addition to relative ones, so separate
    // them here, remove them from the params, and set up a callback to
    // set them after the relative ones have been set.
    separateAbsoluteUnits(loc, unitIndex);

    if (set.shift) {
      // Shift and unit, ie "next month", "last week", etc.
      tmp = loc.modifiersByName[set.shift];
      if (tmp) {
        num *= tmp.value;
      }
    }

    if (set.sign && (tmp = loc.modifiersByName[set.sign])) {
      // Unit and sign, ie "months ago", "weeks from now", etc.
      num *= tmp.value;
    }

    if (isDefined(set.weekday)) {
      // Units can be with non-relative dates, set here. ie "the day after monday"
      updateDate(date, { weekday: set.weekday }, true);
      delete set.weekday;
    }

    // Finally shift the unit.
    set[unitName] = (set[unitName] || 0) + num;
  }

  function separateAbsoluteUnits(loc, unitIndex) {
    var params;
    iterateOverDateUnits(function(name, u, i) {
      if (name === 'day') name = 'date';
      if (dateParamIsDefined(set, name)) {
        // If there is a time unit set that is more specific than
        // the matched unit we have a string like "5:30am in 2 minutes",
        // which is meaningless, so invalidate the date.
        if (i >= unitIndex) {
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
        updateDate(date, params, true);
      });
      if (set.edge) {
        // Allow formats like "the end of March of next year"
        params.edge = set.edge;
        afterDateSet(function() {
          setUnitEdge(loc, params);
        });
        delete set.edge;
      }
    }
  }

  function setUnitEdge(loc, params) {
    var modifier = loc.modifiersByName[params.edge], localeCode, unit;
    localeCode = options.locale;
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
    if (modifier.value < 0) {
      moveToEndOfUnit(date, unit, localeCode);
    } else {
      moveToBeginningOfUnit(date, unit, localeCode);
    }
    // This value of -2 is arbitrary but it's a clean way to hook into this system.
    if (modifier.value === -2) {
      resetTime(date);
    }
  }

  function handleAmericanVariant(loc, set) {
    if(!isString(set.month) && (isString(set.date) || loc.isMDY())) {
      var tmp = set.month;
      set.month = set.date;
      set.date  = tmp;
    }
  }

  function handleLocalizedRelativeDay(loc, mod) {
    resetTime(date);
    set.unit = loc.unitsLower[4];
    set.day = mod.value;
  }

  function handleLocalizedWeekday(loc, weekday) {
    // If the day is a weekday, then set that instead.
    delete set.day;
    delete set.weekday;
    set.weekday = getWeekdayWithMultiplier(weekday);
    // The unit is now set to "day" so that shifting can occur.
    if (set.shift && !set.unit) {
      set.unit = loc.unitsLower[5];
    }
    if (set.num && set.month) {
      // If we have "the 2nd Tuesday of June", then pass the "weekdayForward" flag
      // along to updateDate so that the date does not accidentally traverse into
      // the previous month. This needs to be independent of the "prefer" flag because
      // we are only ensuring that the weekday is in the future, not the entire date.
      weekdayForward = true;
    }
  }

  function handleLocalizedHours(hours) {
    set.hours = hours % 24;
    if (hours > 23) {
      // If the date has hours past 24, we need to prevent it from traversing
      // into a new day as that trigger it being part of a new week in ambiguous
      // dates such as "Monday".
      afterDateSet(function() {
        advanceDate(date, 'date', trunc(hours / 24));
      });
    }
  }

  function handleTimezoneOffset() {
    // Adjust for timezone offset
    _utc(date, true);
    set.offsetMinutes = set.offsetMinutes || 0;
    set.offsetMinutes += set.offsetHours * 60;
    if (set.offsetSign === '-') {
      set.offsetMinutes *= -1;
    }
    set.minute -= set.offsetMinutes;
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

  if (contextDate && d) {
    // If a context date is passed, (in the case of "get"
    // and "[unit]FromNow") then use it as the starting point.
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

    // The act of getting the locale will pre-initialize
    // if it is missing and add the required formats.
    baseLocale = localeManager.get(options.locale);

    // Clean the input and convert CJK based numerals if they exist.
    d = cleanDateInput(d);

    if (baseLocale) {
      iterateOverObject(baseLocale.getFormats(), function(i, dif) {
        var match = d.match(dif.reg), loc, tmp;
        if (match) {

          loc = dif.locale;
          set = getFormatMatch(match, dif.to, loc);
          loc.cachedFormat = dif;

          if (set.utc) {
            _utc(date, true);
          }

          if (set.timestamp) {
            set = set.timestamp;
            return false;
          }

          if (dif.variant) {
            handleAmericanVariant(loc, set);
          }

          if (hasAbbreviatedYear(set)) {
            // If the year is 2 digits then get the implied century.
            set.year = getYearFromAbbreviation(date, set.year);
          }

          if (set.month) {
            // Set the month which may be localized.
            set.month = loc.getMonthValue(set.month);
            if (set.shift && !set.unit) set.unit = loc.unitsLower[7];
          }

          if (set.hours && (tmp = loc.modifiersByName[set.hours])) {
            handleLocalizedHours(tmp.value);
          }

          if (set.day && (tmp = loc.modifiersByName[set.day])) {
            // Relative day localizations such as "today" and "tomorrow".
            handleLocalizedRelativeDay(loc, tmp);
          } else if ((tmp = loc.getWeekdayValue(set.weekday || set.day)) > -1) {
            handleLocalizedWeekday(loc, tmp);
          }

          if (set.date && !isNumber(set.date)) {
            set.date = loc.getNumericDate(set.date);
          }

          if (loc.matchPM(set.ampm) && set.hour < 12) {
            // If the time is 1pm-11pm advance the time by 12 hours.
            set.hour += 12;
          } else if (loc.matchAM(set.ampm) && set.hour === 12) {
            // If it is 12:00am then set the hour to 0.
            set.hour = 0;
          }

          if (isNumber(set.offsetHours) || isNumber(set.offsetMinutes)) {
            handleTimezoneOffset();
          }

          if (set.unit) {
            handleRelativeUnit(loc);
          }

          if (set.edge) {
            // If there is an "edge" it needs to be set after the
            // other fields are set. ie "the end of February"
            afterDateSet(function() {
              setUnitEdge(loc, set);
            });
          }

          if (set.yearSign === '-') {
            set.year *= -1;
          }

          handleFractionalTime();

          return false;
        }
      });
    }
    if (!set) {
      // The Date constructor does something tricky like checking the number
      // of arguments so simply passing in undefined won't work.
      if (!/^now$/i.test(d)) {
        date = new Date(d);
      }
      if (options.fromUTC) {
        // Falling back to system date here which cannot be parsed as UTC,
        // so if we're forcing UTC then simply add the offset.
        date.setTime(date.getTime() + (tzOffset(date) * MINUTE));
      }
    } else if (set.unit) {
      // If a set has a unit ("days", etc), then it is relative to the current date.
      updateDate(date, set, false, 1);
    } else {
      if (_utc(date)) {
        // UTC times can traverse into other days or even months,
        // so preemtively reset the time here to prevent this.
        resetTime(date);
      }
      updateDate(date, set, true, 0, options.prefer, weekdayForward);
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

function hasAbbreviatedYear(obj) {
  return obj.yearAsString && obj.yearAsString.length === 2;
}

// If the year is two digits, add the most appropriate century prefix.
function getYearFromAbbreviation(d, year) {
  return round(getYear(d) / 100) * 100 - round(year / 100) * 100 + year;
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

// Gets the adjusted unit using the [unit]FromNow methods,
// which use internal date methods that neatly avoid vaguely
// defined units of time (days in month, leap years, etc).
function getAdjustedUnitForDate(d) {
  var ms = d - new Date();
  if (d > new Date) {

    // This adjustment is solely to allow
    // Date.create('1 year from now').relative() to remain
    // "1 year from now" instead of "11 months from now",
    // as it would be due to the fact that the internal
    // "now" date in "relative" is created slightly after
    // that in "create".
    d = new Date(d.getTime() + 10);
  }
  return getAdjustedUnit(ms, function(u) {
    return abs(getTimeDistanceForUnit(d, getNewDate(), u));
  });
}

function getMeridianForDate(d, localeCode) {
  var hours = getHours(d);
  return localeManager.get(localeCode).get('ampm')[trunc(hours / 12)] || '';
}

// Date formatting helpers

function getCompiledTokens(str) {
  var compiled = [];
  forEach(str.match(COMPILED_FORMAT_REG), function(p) {
    var match = p.match(DATE_FORMAT_TOKEN_REG), token, format;
    if (match) {
      token = match[1] || match[2];
      format = match[1] ? ldmlTokens[token] : strfTokens[token];
      if (format) {
        compiled.push(format);
      } else {
        compiled.push(token);
      }
      return;
    }
    compiled.push(p);
  });
  return compiled;
}

function executeCompiledOutputFormat(d, format, localeCode) {
  var compiledFormat, length, i, t, result = '';
  compiledFormat = compiledOutputFormats[format];
  if (!compiledFormat) {
    compiledFormat = compiledOutputFormats[format] = getCompiledTokens(format);
  }
  for(i = 0, length = compiledFormat.length; i < length; i++) {
    t = compiledFormat[i];
    result += isFunction(t) ? t(d, localeCode) : t;
  }
  return result;
}

function formatDate(d, format, relative, localeCode) {
  var adu;
  if (!isValid(d)) {
    return 'Invalid Date';
  } else if (isFunction(format)) {
    adu = getAdjustedUnitForDate(d);
    format = format.apply(d, adu.concat(localeManager.get(localeCode)));
  }
  if (!format && relative) {
    adu = adu || getAdjustedUnitForDate(d);
    // Adjust up if time is in ms, as this doesn't
    // look very good for a standard relative date.
    if (adu[1] === 0) {
      adu[1] = 1;
      adu[0] = 1;
    }
    return localeManager.get(localeCode).getRelativeFormat(adu);
  }
  return executeCompiledOutputFormat(d, getDateFormat(format), localeCode);
}

function getDateFormat(format) {
  return CONSTANT_FORMATS[format] || format || '{long}';
}

// Date comparison helpers

function fullCompareDate(date, d, margin) {
  var tmp;
  if (!isValid(date)) return;
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
      case (tmp = indexOf(English.weekdaysLower, d) % 7) > -1: return getWeekday(date) === tmp;
      case (tmp = indexOf(English.monthsLower, d) % 12) > -1:  return getMonth(date) === tmp;
    }
  }
  return compareDate(date, d, margin);
}

function compareDate(date, d, margin, options) {
  var p, t, min, max, override, loMargin = 0, hiMargin = 0;

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
  if (!isValid(p.date)) return false;
  if (p.set && p.set.specificity) {
    if (p.set.edge || p.set.shift) {
      moveToBeginningOfUnit(p.date, p.set.specificity);
    }
    if (p.set.specificity === 'month') {
      max = moveToEndOfUnit(cloneDate(p.date), p.set.specificity).getTime();
    } else {
      max = getMaxBySpecificity();
    }
    if (!override && p.set.sign && p.set.specificity !== 'millisecond') {
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
  return (tzOffset(p.date) - tzOffset(d)) * MINUTE;
}

function updateDate(d, params, reset, advance, prefer, weekdayForward) {
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
    setWeekday(d, getParam('weekday'), weekdayForward);
  }

  // If no action has been taken on the date
  // then it should be considered invalid.
  if (noop && !params.specificity) {
    invalidateDate(d);
    return d;
  }

  // If past or future is preferred, then the process of "disambiguation" will
  // ensure that an ambiguous time/date ("4pm", "thursday", "June", etc.) will
  // be in the past or future. Weeks are only considered ambiguous if there is
  // a weekday, ie. "thursday" is an ambiguous week, but "the 4th" is an
  // ambiguous month.
  if (canDisambiguate()) {
    iterateOverDateUnits(function(name, u) {
      var ambiguous = u.higher && (name !== 'week' || paramExists('weekday'));
      if (ambiguous && !uniqueParamExists(name, name === 'day')) {
        setUnit(u, prefer, 1);
        return false;
      } else if (name === 'year' && hasAbbreviatedYear(params)) {
        setUnit(dateUnitsByName['year'], 100 * prefer, 1);
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

function createDate(contextDate, d, options) {
  return getExtendedDate(contextDate, d, options).date;
}

function invalidateDate(d) {
  d.setTime(NaN);
}

function buildDateUnits() {
  dateUnitsByName = {};
  forEach(DateUnits, function(u, i) {
    var name = u.name;
    // Skip week entirely.
    if (name !== 'week') {
      dateUnitsByName[name] = u;
      dateUnitsByName[name + 's'] = u;
      // Build a chain of lower units.
      u.lower = DateUnits[i - (name === 'month' ? 2 : 1)];
    }
  });
  dateUnitsByName['date'] = dateUnitsByName['day'];
}

/***
 * @method [units]Since([d], [options])
 * @returns Number
 * @short Returns the time since [d].
 * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %[unit]Ago% is provided as an alias to make this more readable when [d] is assumed to be the current date. See %date_options% for options.

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
 *   Date.create().millisecondsSince('1 hour ago') -> 3,600,000
 *   Date.create().daysSince('1 week ago')         -> 7
 *   Date.create().yearsSince('15 years ago')      -> 15
 *   Date.create('15 years ago').yearsAgo()        -> 15
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
 *   Date.create('last year').millisecondsAgo() -> 3,600,000
 *   Date.create('last year').daysAgo()         -> 7
 *   Date.create('last year').yearsAgo()        -> 15
 *
 ***
 * @method [units]Until([d], [options])
 * @returns Number
 * @short Returns the time until [d].
 * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %[unit]FromNow% is provided as an alias to make this more readable when [d] is assumed to be the current date. See %date_options% for options.

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
 *   Date.create().millisecondsUntil('1 hour from now') -> 3,600,000
 *   Date.create().daysUntil('1 week from now')         -> 7
 *   Date.create().yearsUntil('15 years from now')      -> 15
 *   Date.create('15 years from now').yearsFromNow()    -> 15
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
 *   Date.create('next year').millisecondsFromNow() -> 3,600,000
 *   Date.create('next year').daysFromNow()         -> 7
 *   Date.create('next year').yearsFromNow()        -> 15
 *
 ***
 * @method add[Units](<num>, [reset] = false)
 * @returns Date
 * @short Adds <num> of the unit to the date. If [reset] is true, all lower units will be reset.
 * @extra Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Don't use %addMonths% if you need precision.
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
 *   Date.create().addMilliseconds(5) -> current time + 5 milliseconds
 *   Date.create().addDays(5)         -> current time + 5 days
 *   Date.create().addYears(5)        -> current time + 5 years
 *
 ***
 * @method isLast[Unit]()
 * @returns Boolean
 * @short Returns true if the date is last week/month/year.
 *
 * @set
 *   isLastWeek
 *   isLastMonth
 *   isLastYear
 *
 * @example
 *
 *   Date.create('yesterday').isLastWeek()  -> true or false?
 *   Date.create('yesterday').isLastMonth() -> probably not...
 *   Date.create('yesterday').isLastYear()  -> even less likely...
 *
 ***
 * @method isThis[Unit]()
 * @returns Boolean
 * @short Returns true if the date is this week/month/year.
 *
 * @set
 *   isThisWeek
 *   isThisMonth
 *   isThisYear
 *
 * @example
 *
 *   Date.create('tomorrow').isThisWeek()  -> true or false?
 *   Date.create('tomorrow').isThisMonth() -> probably...
 *   Date.create('tomorrow').isThisYear()  -> signs point to yes...
 *
 ***
 * @method isNext[Unit]()
 * @returns Boolean
 * @short Returns true if the date is next week/month/year.
 *
 * @set
 *   isNextWeek
 *   isNextMonth
 *   isNextYear
 *
 * @example
 *
 *   Date.create('tomorrow').isNextWeek()  -> true or false?
 *   Date.create('tomorrow').isNextMonth() -> probably not...
 *   Date.create('tomorrow').isNextYear()  -> even less likely...
 *
 ***
 * @method beginningOf[Unit]([locale])
 * @returns Date
 * @short Sets the date to the beginning of the appropriate unit.
 * @extra Takes an optional locale code as "week" varies by locale, otherwise uses the current locale.
 *
 * @set
 *   beginningOfDay
 *   beginningOfWeek
 *   beginningOfMonth
 *   beginningOfYear
 *
 * @example
 *
 *   Date.create().beginningOfDay()   -> the beginning of today (resets the time)
 *   Date.create().beginningOfWeek()  -> the beginning of the week
 *   Date.create().beginningOfMonth() -> the beginning of the month
 *   Date.create().beginningOfYear()  -> the beginning of the year
 *
 ***
 * @method endOf[Unit]([locale])
 * @returns Date
 * @short Sets the date to the end of the appropriate unit.
 * @extra Takes an optional locale code as "week" varies by locale, otherwise uses the current locale.
 *
 * @set
 *   endOfDay
 *   endOfWeek
 *   endOfMonth
 *   endOfYear
 *
 * @example
 *
 *   Date.create().endOfDay()   -> the end of today (sets the time to 23:59:59.999)
 *   Date.create().endOfWeek()  -> the end of the week
 *   Date.create().endOfMonth() -> the end of the month
 *   Date.create().endOfYear()  -> the end of the year
 *
 ***/
function buildDateUnitMethods() {

  defineInstanceSimilar(sugarDate, DateUnits, function(methods, u, i) {
    var name = u.name, caps = simpleCapitalize(name);

    if (i > 4) {
      forEach(['Last','This','Next'], function(shift) {
        methods['is' + shift + caps] = function(d) {
          return compareDate(d, shift + ' ' + name, 0, { locale: 'en' });
        };
      });
    }
    if (i > 3) {
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
      return getTimeDistanceForUnit(date, createDate(date, d, options), u);
    };
    var until = function(date, d, options) {
      return getTimeDistanceForUnit(createDate(date, d, options), date, u);
    };

    methods[u.name + 'sAgo']   = methods[u.name + 'sUntil']   = until;
    methods[u.name + 'sSince'] = methods[u.name + 'sFromNow'] = since;

    buildNumberMethods(u, u.multiplier);
  });

}

function buildFormatTokens() {

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
      return executeCompiledOutputFormat(d, alias, localeCode);
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
      return executeCompiledOutputFormat(d, loc[name], localeCode);
    };
  }

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

  iterateOverObject(CONSTANT_FORMATS, function(name, src) {
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

function buildCJKDigits() {
  cjkDigitMap = {};
  var digits = '〇一二三四五六七八九十百千万';
  forEach(digits.split(''), function(digit, value) {
    if (value > 9) {
      value = pow(10, value - 9);
    }
    cjkDigitMap[digit] = value;
  });
  simpleMerge(cjkDigitMap, fullWidthNumberMap);
  // CJK numerals may also be included in phrases which are text-based rather
  // than actual numbers such as Chinese weekdays (上周三), and "the day before
  // yesterday" (一昨日) in Japanese, so don't match these.
  cjkDigitReg = RegExp('([期週周])?([' + digits + fullWidthNumbers + ']+)(?!昨)', 'g');
}

 /***
 * @method is[Day]()
 * @returns Boolean
 * @short Returns true if the date falls on that day.
 * @extra Also available: %isYesterday%, %isToday%, %isTomorrow%, %isWeekday%, and %isWeekend%.
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
 *   Date.create('tomorrow').isToday() -> false
 *   Date.create('thursday').isTomorrow() -> ?
 *   Date.create('yesterday').isWednesday() -> ?
 *   Date.create('today').isWeekend() -> ?
 *
 ***
 * @method isFuture()
 * @returns Boolean
 * @short Returns true if the date is in the future.
 * @example
 *
 *   Date.create('next week').isFuture() -> true
 *   Date.create('last week').isFuture() -> false
 *
 ***
 * @method isPast()
 * @returns Boolean
 * @short Returns true if the date is in the past.
 * @example
 *
 *   Date.create('last week').isPast() -> true
 *   Date.create('next week').isPast() -> false
 *
 ***/
function buildRelativeAliases() {
  var special  = commaSplit('Today,Yesterday,Tomorrow,Weekday,Weekend,Future,Past');
  var weekdays = English.weekdays.slice(0, 7);
  var months   = English.months.slice(0, 12);
  defineInstanceSimilar(sugarDate, special.concat(weekdays).concat(months), function(methods, name) {
    methods['is'+ name] = function(d) {
      return fullCompareDate(d, name);
    };
  });
}

/**
 * @method Date.newDateInternal([fn])
 * @returns Mixed
 * @short Gets or sets Sugar's internal date constructor.
 * @extra Many methods construct a `new Date()` internally as a reference point (`isToday`, relative formats like `tomorrow`, etc). You can override this here if you need it to be something else. Most commonly, this allows you to return a shifted date to simulate a specific timezone, as dates in Javascript are always local. Setting to `null` restores the default.
 *
 **/

var _newDateInternal = defineAccessor(sugarDate, 'newDateInternal', defaultNewDate);

defineStatic(sugarDate, {

   /***
   * @method Date.create(<d>, [options])
   * @returns Date
   * @short Alternate date constructor which accepts many different text formats, a timestamp, or another date.
   * @extra If no argument is given, the date is assumed to be now.
   * @options
   *
   *   locale   A locale code to parse the date in. This can also be passed as
   *            the second argument to this method. Default is the current
   *            locale, which is English if none is set.
   *            (Default = 'en')
   *
   *   past     If `true`, ambiguous dates like `Sunday` will be parsed as
   *            `last Sunday`. Note that this does not guarantee that non-
   *            ambiguous dates will be in the past.
   *            (Default = `false`)
   *
   *   future   If `true`, ambiguous dates like `Sunday` will be parsed as
   *            `next Sunday`. Note that this does not guarantee that non-
   *            ambiguous dates will be in the future.
   *            (Default = `false`)
   *
   *   fromUTC  If `true`, the date will be parsed as UTC time (no timezone
   *            offset). This is useful for server timestamps, etc.
   *            (Default = `false`)
   *
   *   setUTC   If `true` this will set the date's internal `utc` flag, which
   *            tells it to use UTC based methods like `setUTCHours` when
   *            handling the date. Note that this is different from `fromUTC`
   *            which parses a date string as being UTC time, but creates a
   *            standard local Javascript date object. Also note that native
   *            methods like `setHours` will still return a local non-UTC value.
   *            (Default = `false`)
   *
   * @example
   *
   *   Date.create('July')          -> July of this year
   *   Date.create('1776')          -> 1776
   *   Date.create('today')         -> today
   *   Date.create('wednesday')     -> This wednesday
   *   Date.create('next friday')   -> Next friday
   *   Date.create('July 4, 1776')  -> July 4, 1776
   *   Date.create(-446806800000)   -> November 5, 1955
   *   Date.create(1776, 6, 4)      -> July 4, 1776
   *   Date.create('1776年07月04日', 'ja') -> July 4, 1776
   *   Date.create('Thursday at 3:00pm', '{ fromUTC: true }) -> Thursday at 3:00pm UTC time
   *
   ***/
  'create': function(d, options) {
    return createDate(null, d, options);
  },

   /***
   * @method Date.getLocale([code] = current)
   * @returns Locale
   * @short Gets the locale for the given code, or the current locale.
   * @extra The resulting locale object can be manipulated to provide more control over date localizations. For more about locales, see %date_format%.
   *
   ***/
  'getLocale': function(code) {
    return localeManager.get(code, !code);
  },

   /***
   * @method Date.getAllLocales()
   * @returns Object
   * @short Returns all available locales.
   *
   ***/
  'getAllLocales': function() {
    return localeManager.getAll();
  },

   /***
   * @method Date.getAllLocaleCodes()
   * @returns Array
   * @short Returns all available locale names as an array of strings.
   *
   ***/
  'getAllLocaleCodes': function() {
    return getKeys(localeManager.getAll());
  },

   /***
   * @method Date.setLocale(<code>)
   * @returns Locale
   * @short Sets the current locale to be used with dates.
   * @extra Sugar has native support for 17 major locales. In addition, you can define a new locale with %Date.addLocale%. For more see %date_format%.
   *
   ***/
  'setLocale': function(code) {
    return localeManager.set(code);
  },

   /***
   * @method Date.addLocale(<code>, <set>)
   * @returns Locale
   * @short Adds a locale <set> to the locales understood by Sugar.
   * @extra For more see %date_format%.
   *
   ***/
  'addLocale': function(code, set) {
    return localeManager.add(code, set);
  },

   /***
   * @method Date.removeLocale(<code>)
   * @returns Locale
   * @short Deletes the the locale by <code> from Sugar's known locales.
   *
   ***/
  'removeLocale': function(code) {
    return localeManager.remove(code);
  },

  /**
   * @method Date.addFormat(<format>, <match>, [code] = null)
   * @returns Nothing
   * @short Manually adds a new date input format.
   * @extra This method allows fine grained control for alternate formats. <format> is a string that can have regex tokens inside. <match> is an array of the tokens that each regex capturing group will map to, for example %year%, %date%, etc. For more, see %date_format%.
   *
   **/
  'addFormat': function(format, match, localeCode) {
    localeManager.get(localeCode).addRawFormat(format, match);
  }


});

defineInstanceWithArguments(sugarDate, {

   /***
   * @method set(<set>, [reset] = false)
   * @returns Date
   * @short Sets the date object.
   * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). If [reset] is %true%, any units more specific than those passed will be reset. If a month is set to a date that does not exist, it will rewind to the last day of the month.
   *
   * @example
   *
   *   new Date().set({ year: 2011, month: 11, day: 31 }) -> December 31, 2011
   *   new Date().set(2011, 11, 31)                       -> December 31, 2011
   *   new Date().set(86400000)                           -> 1 day after Jan 1, 1970
   *   new Date().set({ year: 2004, month: 6 }, true)     -> June 1, 2004, 00:00:00.000
   *
   ***/
  'set': function(d, args) {
    args = collectDateArguments(args);
    return updateDate(d, args[0], args[1]);
  },

   /***
   * @method advance(<set>, [reset] = false)
   * @returns Date
   * @short Sets the date forward.
   * @extra This method can accept multiple formats including an object, a string in the format %3 days%, a single number as milliseconds, or enumerated parameters (as with the Date constructor). If [reset] is %true%, any units more specific than those passed will be reset. For more see %date_format%.
   * @example
   *
   *   new Date().advance({ year: 2 }) -> 2 years in the future
   *   new Date().advance('2 days')    -> 2 days in the future
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
   * @short Sets the date back.
   * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). If [reset] is %true%, any units more specific than those passed will be reset. For more see %date_format%.
   * @example
   *
   *   new Date().rewind({ year: 2 }) -> 2 years in the past
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
   * @extra This method is identical to %Date.create%, except that relative formats like `next month` are relative to the date instance rather than the current date.
   * @options
   *
   *   locale   A locale code to parse the date in. This can also be passed as
   *            the second argument to this method. Default is the current
   *            locale, which is English if none is set.
   *            (Default = 'en')
   *
   *   past     If `true`, ambiguous dates like `Sunday` will be before the
   *            context date. Note that this does not guarantee that non-
   *            ambiguous dates will be before it.
   *            (Default = `false`)
   *
   *   future   If `true`, ambiguous dates like `Sunday` will be after the
   *            context date. Note that this does not guarantee that non-
   *            ambiguous dates will be after it.
   *            (Default = `false`)
   *
   *   fromUTC  If `true`, the date will be parsed as UTC time (no timezone
   *            offset). This is useful for server timestamps, etc.
   *            (Default = `false`)
   *
   *   setUTC   If `true` this will set the date's internal `utc` flag, which
   *            tells it to use UTC based methods like `setUTCHours` when
   *            handling the date. Note that this is different from `fromUTC`
   *            which parses a date string as being UTC time, but creates a
   *            standard local Javascript date object. Also note that native
   *            methods like `setHours` will still return a local non-UTC value.
   *            (Default = `false`)
   *
   * @example
   *
   *   new Date(2010, 0).get('next week')      -> 1 week after 2010-01-01
   *   new Date(2004, 4).get('2 years before') -> 2 years before May, 2004
   *
   ***/
  'get': function(date, d, options) {
    return createDate(date, d, options);
  },

   /***
   * @method setWeekday(<dow>)
   * @returns Nothing
   * @short Sets the weekday of the date.
   * @extra In order to maintain a parallel with %getWeekday% (which itself is an alias for Javascript native %getDay%), Sunday is considered day %0%. This contrasts with ISO8601 standard (used in %getISOWeek% and %setISOWeek%) which places Sunday at the end of the week (day 7). This effectively means that passing %0% to this method while in the middle of a week will rewind the date, where passing %7% will advance it.
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
   * @returns Nothing
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
   * @extra Note that this standard places Sunday at the end of the week (day 7). If %utc% is set on the date, the week will be according to UTC time.
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
   * @short Set the date to the beginning of week as defined by this ISO8601 standard.
   * @extra Note that this standard places Monday at the start of the week.
   * @example
   *
   *   Date.create().beginningOfISOWeek() -> Monday
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
   * @example
   *
   *   Date.create().endOfISOWeek() -> Sunday
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
   * @short Returns a string representation of the offset from UTC time. If [iso] is true the offset will be in ISO8601 format.
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
   * @short Sets the internal utc flag for the date. When on, UTC based methods like `setUTCHours` will be called internally.
   * @extra Note that native methods like `setHours` will still a local non-UTC value.
   * @example
   *
   *   new Date().setUTC(true)
   *   new Date().setUTC(false)
   *
   ***/
  'setUTC': function(d, on) {
    return _utc(d, on);
  },

   /***
   * @method isUTC()
   * @returns Boolean
   * @short Returns true if the date has no timezone offset.
   * @extra This will also return true for dates whose internal utc flag is set with %setUTC%. Note that even if the utc flag is set, %getTimezoneOffset% will always report the same thing as Javascript always reports that based on the environment's locale.
   * @example
   *
   *   new Date().isUTC()              -> true or false?
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
   * @example
   *
   *   new Date().isValid()         -> true
   *   new Date('flexor').isValid() -> false
   *
   ***/
  'isValid': function(d) {
    return isValid(d);
  },

   /***
   * @method isAfter(<d>, [margin] = 0)
   * @returns Boolean
   * @short Returns true if the date is after the <d>.
   * @extra [margin] is to allow extra margin of error (in ms). <d> will accept a date object, timestamp, or text format. If not specified, <d> is assumed to be now. See %date_format% for more.
   * @example
   *
   *   new Date().isAfter('tomorrow')  -> false
   *   new Date().isAfter('yesterday') -> true
   *
   ***/
  'isAfter': function(date, d, margin) {
    return date.getTime() > createDate(null, d).getTime() - (margin || 0);
  },

   /***
   * @method isBefore(<d>, [margin] = 0)
   * @returns Boolean
   * @short Returns true if the date is before <d>.
   * @extra [margin] is to allow extra margin of error (in ms). <d> will accept a date object, timestamp, or text format. If not specified, <d> is assumed to be now. See %date_format% for more.
   * @example
   *
   *   new Date().isBefore('tomorrow')  -> true
   *   new Date().isBefore('yesterday') -> false
   *
   ***/
  'isBefore': function(date, d, margin) {
    return date.getTime() < createDate(null, d).getTime() + (margin || 0);
  },

   /***
   * @method isBetween(<d1>, <d2>, [margin] = 0)
   * @returns Boolean
   * @short Returns true if the date is later or equal to <d1> and before or equal to <d2>.
   * @extra [margin] is to allow extra margin of error (in ms). <d1> and <d2> will accept a date object, timestamp, or text format. If not specified, they are assumed to be now. See %date_format% for more.
   * @example
   *
   *   new Date().isBetween('yesterday', 'tomorrow')    -> true
   *   new Date().isBetween('last year', '2 years ago') -> false
   *
   ***/
  'isBetween': function(date, d1, d2, margin) {
    var t  = date.getTime();
    var t1 = createDate(null, d1).getTime();
    var t2 = createDate(null, d2).getTime();
    var lo = min(t1, t2);
    var hi = max(t1, t2);
    margin = margin || 0;
    return (lo - margin <= t) && (hi + margin >= t);
  },

   /***
   * @method isLeapYear()
   * @returns Boolean
   * @short Returns true if the date is a leap year.
   * @example
   *
   *   Date.create('2000').isLeapYear() -> true
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
   * @example
   *
   *   Date.create('May').daysInMonth()            -> 31
   *   Date.create('February, 2000').daysInMonth() -> 29
   *
   ***/
  'daysInMonth': function(d) {
    return daysInMonth(d);
  },

   /***
   * @method format(<format>, [locale] = currentLocale)
   * @returns String
   * @short Formats and outputs the date.
   * @extra <format> can be a number of pre-determined formats or a string of tokens. Locale-specific formats are %short%, %long%, and %full% which have their own aliases and can be called with %date.short()%, etc. If <format> is not specified the %long% format is assumed. [locale] specifies a locale code to use (if not specified the current locale is used). See %date_format% for more details.
   *
   * @set
   *   short
   *   medium
   *   long
   *   full
   *
   * @example
   *
   *   Date.create().format()                                   -> ex. July 4, 2003
   *   Date.create().format('{Weekday} {d} {Month}, {yyyy}')    -> ex. Monday July 4, 2003
   *   Date.create().format('{hh}:{mm}')                        -> ex. 15:57
   *   Date.create().format('{12hr}:{mm}{tt}')                  -> ex. 3:57pm
   *   Date.create().format('ISO8601')                          -> ex. 2011-07-05 12:24:55.528Z
   *   Date.create('last week').format('short', 'ja')           -> ex. 先週
   *   Date.create('yesterday').format(function(value,unit,ms,loc) {
   *     // value = 1, unit = 3, ms = -86400000, loc = [current locale object]
   *   });                                                      -> ex. 1 day ago
   *
   ***/
  'format': function(d, f, localeCode) {
    return formatDate(d, f, false, localeCode);
  },

   /***
   * @method relative([fn], [locale] = currentLocale)
   * @returns String
   * @short Returns a relative date string offset to the current time.
   * @extra [fn] can be passed to provide for more granular control over the resulting string. [fn] is passed 4 arguments: the adjusted value, unit, offset in milliseconds, and a locale object. As an alternate syntax, [locale] can also be passed as the first (and only) parameter. For more, see %date_format%.
   * @example
   *
   *   Date.create('90 seconds ago').relative() -> 1 minute ago
   *   Date.create('January').relative()        -> ex. 5 months ago
   *   Date.create('January').relative('ja')    -> 3ヶ月前
   *   Date.create('120 minutes ago').relative(function(val,unit,ms,loc) {
   *     // value = 2, unit = 3, ms = -7200, loc = [current locale object]
   *   });                                      -> ex. 5 months ago
   *
   ***/
  'relative': function(d, fn, localeCode) {
    if (isString(fn)) {
      localeCode = fn;
      fn = null;
    }
    return formatDate(d, fn, true, localeCode);
  },

   /***
   * @method is(<f>, [margin] = 0)
   * @returns Boolean
   * @short Returns true if the date is <f>.
   * @extra <f> will accept a date object, timestamp, or text format. %is% additionally understands more generalized expressions like month/weekday names, 'today', etc, and compares to the precision implied in <f>. [margin] allows an extra margin of error in milliseconds. For more, see %date_format%.
   * @example
   *
   *   Date.create().is('July')               -> true or false?
   *   Date.create().is('1776')               -> false
   *   Date.create().is('today')              -> true
   *   Date.create().is('weekday')            -> true or false?
   *   Date.create().is('July 4, 1776')       -> false
   *   Date.create().is(-6106093200000)       -> false
   *   Date.create().is(new Date(1776, 6, 4)) -> false
   *
   ***/
  'is': function(date, d, margin) {
    return fullCompareDate(date, d, margin);
  },

   /***
   * @method reset([unit] = 'hours')
   * @returns Date
   * @short Resets the unit passed and all smaller units. Default is "hours", effectively resetting the time.
   * @example
   *
   *   Date.create().reset('day')   -> Beginning of today
   *   Date.create().reset('month') -> 1st of the month
   *
   ***/
  'reset': function(d, unit) {
    return resetUnitAndLower(d, unit);
  },

   /***
   * @method clone()
   * @returns Date
   * @short Clones the date.
   * @example
   *
   *   Date.create().clone() -> Copy of now
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
   * @short Alias for %getDay%.
   * @set
   *   getUTCWeekday
   *
   * @example
   *
   +   Date.create().getWeekday();    -> (ex.) 3
   +   Date.create().getUTCWeekday();    -> (ex.) 3
   *
   ***/
  'getWeekday': function(d) {
    return getWeekday(d);
  },

  'getUTCWeekday': function(d) {
    return d.getUTCDay();
  }

});


/***
 * @namespace Number
 *
 ***/

/***
 * @method [unit]()
 * @returns Number
 * @short Takes the number as a corresponding unit of time and converts to milliseconds.
 * @extra Method names can be singular or plural.  Note that as "a month" is ambiguous as a unit of time, %months% will be equivalent to 30.4375 days, the average number in a month. Be careful using %months% if you need exact precision.
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
 * @extra [d] will accept a date object, timestamp, or text format. Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Be careful using %monthsBefore% if you need exact precision. See %date_options% for options.

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
 * @extra Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Be careful using %monthsAgo% if you need exact precision.
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
 * @extra [d] will accept a date object, timestamp, or text format. Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Be careful using %monthsAfter% if you need exact precision. See %date_options% for options.
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
 * @extra Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Be careful using %monthsFromNow% if you need exact precision.
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
function buildNumberMethods(u, multiplier) {
  var base, after, before, name = u.name, methods = {};
  base = function(n) {
    return round(n * multiplier);
  };
  after = function(n, d, options) {
    return advanceDate(createDate(null, d, options), u.name, n);
  };
  before = function(n, d, options) {
    return advanceDate(createDate(null, d, options), u.name, -n);
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
  defineInstance(sugarNumber, methods);
}

defineInstance(sugarNumber, {

   /***
   * @method duration([locale] = currentLocale)
   * @returns String
   * @short Takes the number as milliseconds and returns a unit-adjusted localized string.
   * @extra This method is the same as %Date#relative% without the localized equivalent of "from now" or "ago". [locale] can be passed as the first (and only) parameter. Note that this method is only available when the dates module is included.
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

/***
 * @module Locales
 * @description Locale definitions French (fr), Italian (it), Spanish (es), Portuguese (pt), German (de), Russian (ru), Polish (pl), Swedish (sv), Japanese (ja), Korean (ko), Simplified Chinese (zh-CN), and Traditional Chinese (zh-TW). Locales can also be included individually. See @date_locales for more.
 *
 ***/

function getEnglishVariant(v) {
  return simpleMerge(simpleClone(EnglishLocaleBaseDefinition), v);
}


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
    var loc = def.compiledFormats ? def : new Locale(def);
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

function Locale(def) {
  this.init(def);
}

Locale.prototype = {

  get: function(prop) {
    return this[prop] || '';
  },

  fetch: function(prop, args) {
    return isFunction(prop) ? prop.apply(this, args || []) : prop;
  },

  getMonthValue: function(n) {
    if (isNumber(n)) {
      return n - 1;
    } else if (n) {
      return indexOf(this.monthsLower, n) % 12;
    }
    return -1;
  },

  getWeekdayValue: function(n) {
    if (n) {
      return indexOf(this.weekdaysLower, n) % 7;
    }
    return -1;
  },

  getMonthName: function(n, mult) {
    if (mult) {
      n += (mult - 1) * 12;
    }
    return this.months[n];
  },

  getAbbreviatedMonthName: function(n) {
    return this.getAbbreviatedName(this.months, n, 12);
  },

  getWeekdayName: function(n) {
    return this.weekdays[n];
  },

  getAbbreviatedWeekdayName: function(n) {
    return this.getAbbreviatedName(this.weekdays, n, 7);
  },

  getAbbreviatedName: function(arr, n, offset) {
    return arr[n + offset] || arr[n];
  },

  getNumber: function(n, digit) {
    var mapped = this.ordinalNumberMap[n];
    if (isNumber(mapped)) {
      if (digit) {
        mapped = mapped % 10;
      }
      return mapped;
    }
    return isNumber(n) ? n : 1;
  },

  getOrdinal: function(n) {
    var suffix = this.fetch(this.ordinalSuffix, [n]);
    return suffix || getOrdinalSuffix(n);
  },

  getNumericDate: function(n) {
    var self = this;
    return n.replace(RegExp(this.num, 'g'), function(d) {
      var num = self.getNumber(d, true);
      return num || '';
    });
  },

  getUnitIndex: function(n) {
    return indexOf(this.unitsLower, n) % 8;
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

  isMDY: function() {
    // mm/dd/yyyy format.
    return !!this.mdy;
  },

  matchAM: function(str) {
    return this.matchMeridian(str, 0);
  },

  matchPM: function(str) {
    return this.matchMeridian(str, 1);
  },

  matchMeridian: function(str, index) {
    return some(this.get('ampmLower'), function(token, i) {
      return token === str && (i % 2) === index;
    });
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
    sign = filter(this.modifiers, function(m) {
      return m.name == 'sign' && m.value == (ms > 0 ? 1 : -1);
    })[0];
    return format.replace(/\{(.*?)\}/g, function(full, match) {
      switch(match) {
        case 'num': return num;
        case 'unit': return unit;
        case 'sign': return sign.src;
      }
    });
  },

  getFormats: function() {
    return this.cachedFormat ?
      [this.cachedFormat].concat(this.compiledFormats) :
      this.compiledFormats;
  },

  addFormat: function(src, allowsTime, match, variant, iso) {
    var to = match || [], loc = this, time;

    function getTimeFirst(src, time) {
      return '(?:' + time + ')[,\\s\\u3000]+?' + src;
    }

    function getTimeLast(src, time) {
      var req = /\\d\{\d,\d\}\)+\??$/.test(src) ? '+' : '*';
      var timeMarkers = ['T','[\\s\\u3000]'].concat(loc.get('timeMarker'));
      return src + '(?:[,\\s]*(?:' + timeMarkers.join('|') + req + ')' + time + ')?';
    }

    src = src.replace(/\s+/g, '[,. ]*');
    src = src.replace(/\{([^,]+?)\}/g, function(all, k) {
      var value, result,
          opt   = k.match(/\?$/),
          nc    = k.match(/^(\d+)\??$/),
          slice = k.match(/(\d)(?:-(\d))?/),
          key   = k.replace(/[^a-z]+$/, '');
      if (nc) {
        value = loc.get('tokens')[nc[1]];
      } else if (loc[key]) {
        value = loc[key];
      } else if (loc[key + 's']) {
        value = loc[key + 's'];
        if (slice) {
          value = filter(value, function(m, i) {
            var mod = i % (loc.units ? 8 : value.length);
            return mod >= slice[1] && mod <= (slice[2] || slice[1]);
          });
        }
        value = arrayToAlternates(value);
      }
      if (!value) {
        return '';
      }
      if (nc) {
        result = '(?:' + value + ')';
      } else {
        if (!match) {
          to.push(key);
        }
        result = '(' + value + ')';
      }
      if (opt) {
        result += '?';
      }
      return result;
    });
    if (allowsTime) {
      time = loc.prepareTimeFormat(iso);
      loc.addRawFormat(getTimeFirst(src, time), TIME_FORMAT.concat(to), variant);
      loc.addRawFormat(getTimeLast(src, time), to.concat(TIME_FORMAT), variant);
    } else {
      loc.addRawFormat(src, to, variant);
    }
  },

  addRawFormat: function(format, match, variant) {
    this.compiledFormats.unshift({
      variant: !!variant,
      locale: this,
      reg: RegExp('^' + format + '$', 'i'),
      to: match
    });
  },

  addTimeFormat: function() {
    this.addFormat(this.prepareTimeFormat(), false, TIME_FORMAT);
  },

  prepareTimeFormat: function(iso) {
    var loc = this, timeSuffixMapping = {'h':0,'m':1,'s':2}, src;
    return REQUIRED_TIME_REG.replace(/{([a-z])}/g, function(full, token) {
      // The ISO format allows times without ":",
      // so make sure that these markers are optional.
      var add, separators = [],
          isHourSuffix = token === 'h',
          tokenIsRequired = isHourSuffix && !iso;
      if (token === 'd') {
        // ISO8601 allows decimals in both hours and minutes,
        // so add that suffix if the format is marked as iso
        return iso ? DECIMAL_REG : '';
      } else if (token === 't') {
        return loc.get('ampm').join('|');
      } else {
        if (isHourSuffix) {
          separators.push(':');
        }
        if (add = loc.timeSuffixes[timeSuffixMapping[token]]) {
          separators.push(add + '\\s*');
        }
        src = '(?:' + separators.join('|') + ')' + (tokenIsRequired ? '' : '?');
        return separators.length === 0 ? '' : src;
      }
    });
  },

  init: function(def) {
    var loc = this;

    function initFormats() {
      loc.compiledFormats = [];
    }

    function initDefinition() {
      simpleMerge(loc, def);
    }

    function initArrayFields() {
      forEach(LOCALE_FIELDS, function(name) {
        var val = loc[name];
        if (isString(val)) {
          loc[name] = commaSplit(val);
        } else if (!val) {
          loc[name] = [];
        }
      });
    }

    function eachAlternate(str, fn) {
      str = map(str.split('+'), function(split) {
        return split.replace(/(.+):(.+)$/, function(full, base, suffixes) {
          return map(suffixes.split('|'), function(suffix) {
            return base + suffix;
          }).join('|');
        });
      }).join('|');
      return forEach(str.split('|'), fn);
    }

    function setArray(name, multiple) {
      var arr = [];
      forEach(loc[name], function(full, i) {
        eachAlternate(full, function(alt, j) {
          arr[j * multiple + i] = alt;
        });
      });
      loc[name] = arr;
      loc[name + 'Lower'] = arr.map(function(t) {
        return t.toLowerCase();
      });
    }

    function getDigit(start, stop, allowNumbers) {
      var str = '\\d{' + start + HALF_WIDTH_COMMA + stop + '}';
      if (allowNumbers) str += '|(?:' + arrayToAlternates(loc.get('numbers')) + ')+';
      return str;
    }

    function getNum() {
      var numbers = loc.get('numbers');
      var arr = ['-?\\d+'].concat(loc.get('articles'));
      if (numbers) {
        arr = arr.concat(numbers);
      }
      return arrayToAlternates(arr);
    }

    function setDefault(name, value) {
      loc[name] = loc[name] || value;
    }

    function buildNumbers() {
      var map = loc.ordinalNumberMap = {}, all = [];
      forEach(loc.numbers, function(full, i) {
        eachAlternate(full, function(alt) {
          all.push(alt);
          map[alt] = i;
        });
      });
      loc.numbers = all;
    }

    function buildModifiers() {
      var arr = [];
      loc.modifiersByName = {};
      forEach(loc.modifiers, function(modifier) {
        var name = modifier.name;
        eachAlternate(modifier.src, function(t) {
          var locEntry = loc[name];
          loc.modifiersByName[t] = modifier;
          arr.push({ name: name, src: t, value: modifier.value });
          loc[name] = locEntry ? locEntry + '|' + t : t;
        });
      });
      loc.day += '|' + arrayToAlternates(loc.weekdaysLower);
      loc.modifiers = arr;
    }

    initFormats();
    initDefinition();
    initArrayFields();

    buildNumbers();

    setArray('months', 12);
    setArray('weekdays', 7);
    setArray('units', 8);
    setArray('ampm', 2);

    setDefault('date', getDigit(1,2, loc.digitDate));
    setDefault('year', "'\\d{2}|" + getDigit(4,4));
    setDefault('num', getNum());

    buildModifiers();

    if (loc.monthSuffix) {
      loc.month = getDigit(1,2);
      loc.months = map(commaSplit('1,2,3,4,5,6,7,8,9,10,11,12'), function(n) {
        return n + loc.monthSuffix;
      });
    }
    loc.fullMonth = getDigit(1,2) + '|' + arrayToAlternates(loc.months);

    // The order of these formats is very important. Order is reversed so
    // formats that are initialized later will take precedence. This generally
    // means that more specific formats should come later, however, the {year}
    // format should come before {day}, as 2011 needs to be parsed as a year
    // (2011) and not date (20) + hours (11), etc.

    loc.addTimeFormat();

    loc.addFormat('{day}', true);
    loc.addFormat('{month}' + (loc.monthSuffix || ''));
    loc.addFormat('{year}' + (loc.yearSuffix || ''));

    forEach(loc.parse, function(src) {
      loc.addFormat(src);
    });

    forEach(loc.timeParse, function(src) {
      loc.addFormat(src, true);
    });

    forEach(CoreDateFormats, function(df) {
      var match = commaSplit(df.match);
      loc.addFormat(df.src, df.time, match, df.variant, df.iso);
    });

  }

};

var EnglishLocaleBaseDefinition = {
  'code':       'en',
  'timeMarker': 'at',
  'ampm':       'AM,PM,a,p',
  'months':     'Jan:uary|,Feb:ruary|,Mar:ch|,Apr:il|,May,Jun:e|,Jul:y|,Aug:ust|,Sep:tember|t|,Oct:ober|,Nov:ember|,Dec:ember|',
  'weekdays':   'Sun:day|,Mon:day|,Tue:sday|,Wed:nesday|,Thu:rsday|,Fri:day|,Sat:urday|',
  'units':      'millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s',
  'numbers':    'zero,one,two,three,four,five,six,seven,eight,nine,ten',
  'articles':   'a,an,the',
  'tokens':     'the,st|nd|rd|th,of',
  'time':       '{H}:{mm}',
  'past':       '{num} {unit} {sign}',
  'future':     '{num} {unit} {sign}',
  'duration':   '{num} {unit}',
  'plural':     true,
  'modifiers': [
    { 'name': 'hours', 'src': 'noon', 'value': 12 },
    { 'name': 'hours', 'src': 'midnight', 'value': 24 },
    { 'name': 'day',   'src': 'yesterday', 'value': -1 },
    { 'name': 'day',   'src': 'today|tonight', 'value': 0 },
    { 'name': 'day',   'src': 'tomorrow', 'value': 1 },
    { 'name': 'sign',  'src': 'ago|before', 'value': -1 },
    { 'name': 'sign',  'src': 'from now|after|from|in|later', 'value': 1 },
    { 'name': 'edge',  'src': 'last day', 'value': -2 },
    { 'name': 'edge',  'src': 'end', 'value': -1 },
    { 'name': 'edge',  'src': 'first day|first|beginning', 'value': 1 },
    { 'name': 'shift', 'src': 'last', 'value': -1 },
    { 'name': 'shift', 'src': 'the|this', 'value': 0 },
    { 'name': 'shift', 'src': 'next', 'value': 1 }
  ],
  'parse': [
    '{month} {year}',
    '{shift} {unit=5-7}',
    '{0?} {date}{1}',
    '{hours} {day}',
    '{shift?} {day?} {timeMarker?} {hours}',
    '{0?} {edge} of {shift?} {unit=4-7?} {month?} {year?}'
  ],
  'timeParse': [
    '{num} {unit} {sign}',
    '{sign} {num} {unit}',
    '{0} {num}{1} {day} of {month} {year?}',
    '{weekday?} {month} {date}{1?} {year?}',
    '{date} {month} {year}',
    '{date} {month}',
    '{shift} {weekday}',
    '{shift} week {weekday}',
    '{weekday} {2?} {shift} week',
    '{num?} {unit=4-5} {sign} {day}',
    '{0?} {date}{1} of {month}',
    '{0?}{month?} {date?}{1?} of {shift} {unit=6-7}',
    '{edge} of {day}'
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

// Sorry about this guys
var English = new Locale(AmericanEnglishDefinition);
var localeManager = new LocaleManager(English);

buildDateUnits();
buildCJKDigits();
buildFormatTokens();
buildDateUnitMethods();
buildRelativeAliases();
