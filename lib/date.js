
  'use strict';

  /***
   * @package Date
   * @dependency core
   * @description Date parsing and formatting, relative formats like "1 minute ago", Number methods like "daysAgo", locale support with default English locale definition.
   *
   ***/

  var TIME_FORMAT = ['ampm','hour','minute','second','ampm','utc','offsetSign','offsetHours','offsetMinutes','ampm'];
  var LOCALE_FIELDS = ['months','weekdays','units','numbers','articles','tokens','timeMarker','ampm','timeSuffixes','parse','timeParse','modifiers'];

  var DECIMAL_REG       = '(?:[,.]\\d+)?';
  var REQUIRED_TIME_REG = '({t})?\\s*(\\d{1,2}{d})(?:{h}([0-5]\\d{d})?{m}(?::?([0-5]\\d'+DECIMAL_REG+'){s})?\\s*(?:({t})|(Z)|(?:([+-])(\\d{2,2})(?::?(\\d{2,2}))?)?)?|\\s*({t}))';

  var MINUTE = 60 * 1000;
  var HOUR   = 60 * 60 * 1000;

  // English default Locale
  var English;

  // The current locale
  var currentLocale;

  // Handling CJK digits
  var cjkDigitMap = {};
  var cjkDigitReg;

  // Basic date units and options
  var dateArgumentUnits;
  var dateUnitsReversed;
  var coreDateFormats       = [];
  var compiledOutputFormats = {};
  var allowedDateOptions    = {};

  var dateFormatTokens = {

    'yyyy': function(d) {
      return getYear(d);
    },

    'yy': function(d) {
      return getYear(d).toString().slice(-2);
    },

    'ord': function(d) {
      var date = getDate(d);
      return date + getOrdinalizedSuffix(date);
    },

    'tz': function(d) {
      return getUTCOffset(d);
    },

    'isotz': function(d) {
      return getUTCOffset(d, true);
    },

    'Z': function(d) {
      return getUTCOffset(d);
    },

    'ZZ': function(d) {
      return getUTCOffset(d).replace(/(\d{2})$/, ':$1');
    }

  };

  var dateUnits = [
    {
      name: 'year',
      method: 'FullYear',
      ambiguous: true,
      multiplier: 365.25 * 24 * 60 * 60 * 1000
    },
    {
      name: 'month',
      method: 'Month',
      ambiguous: true,
      multiplier: 30.4375 * 24 * 60 * 60 * 1000
    },
    {
      name: 'week',
      method: 'ISOWeek',
      multiplier: 7 * 24 * 60 * 60 * 1000
    },
    {
      name: 'day',
      method: 'Date',
      ambiguous: true,
      multiplier: 24 * 60 * 60 * 1000
    },
    {
      name: 'hour',
      method: 'Hours',
      multiplier: 60 * 60 * 1000
    },
    {
      name: 'minute',
      method: 'Minutes',
      multiplier: 60 * 1000
    },
    {
      name: 'second',
      method: 'Seconds',
      multiplier: 1000
    },
    {
      name: 'millisecond',
      method: 'Milliseconds',
      multiplier: 1
    }
  ];

  // Date Locales

  var locales = {};

  // Locale object

  function Locale(l) {
    simpleMerge(this, l);
    this.compiledFormats = coreDateFormats.concat();
  }

  Locale.prototype = {

    get: function(prop) {
      return this[prop] || '';
    },

    getMonth: function(n) {
      if (isNumber(n)) {
        return n - 1;
      } else {
        return indexOf(this.months, n) % 12;
      }
    },

    getWeekday: function(n) {
      return indexOf(this.weekdays, n) % 7;
    },

    getNumber: function(n, digit) {
      var mapped = this.ordinalNumberMap[n];
      if (mapped) {
        if (digit) {
          mapped = mapped % 10;
        }
        return mapped;
      }
      return isNumber(n) ? n : 1;
    },

    getNumericDate: function(n) {
      var self = this;
      return n.replace(RegExp(this.num, 'g'), function(d) {
        var num = self.getNumber(d, true);
        return num || '';
      });
    },

    getUnitIndex: function(n) {
      return indexOf(this.units, n) % 8;
    },

    getRelativeFormat: function(adu) {
      return this.convertAdjustedToFormat(adu, adu[2] > 0 ? 'future' : 'past');
    },

    getDuration: function(ms) {
      return this.convertAdjustedToFormat(getAdjustedUnitForNumber(max(0, ms)), 'duration');
    },

    hasVariant: function(code) {
      code = code || this.code;
      return code === 'en' || code === 'en-US' ? true : this.variant;
    },

    matchAM: function(str) {
      return this.matchMeridian(str, 0);
    },

    matchPM: function(str) {
      return this.matchMeridian(str, 1);
    },

    matchMeridian: function(str, index) {
      return some(this.get('ampm'), function(token, i) {
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
      if (this.capitalizeUnit) unit = simpleCapitalize(unit);
      sign = filter(this.modifiers, function(m) { return m.name == 'sign' && m.value == (ms > 0 ? 1 : -1); })[0];
      return format.replace(/\{(.*?)\}/g, function(full, match) {
        switch(match) {
          case 'num': return num;
          case 'unit': return unit;
          case 'sign': return sign.src;
        }
      });
    },

    getFormats: function() {
      return this.cachedFormat ? [this.cachedFormat].concat(this.compiledFormats) : this.compiledFormats;
    },

    addFormat: function(src, allowsTime, match, variant, iso) {
      var to = match || [], loc = this, time, timeMarkers, lastIsNumeral;

      src = src.replace(/\s+/g, '[,. ]*');
      src = src.replace(/\{([^,]+?)\}/g, function(all, k) {
        var value, arr, result,
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
        time = prepareTime(REQUIRED_TIME_REG, loc, iso);
        timeMarkers = ['T','[\\s\\u3000]'].concat(loc.get('timeMarker'));
        lastIsNumeral = /\\d\{\d,\d\}\)+\??$/.test(src);
        addDateInputFormat(loc, '(?:' + time + ')[,\\s\\u3000]+?' + src, TIME_FORMAT.concat(to), variant);
        addDateInputFormat(loc, src + '(?:[,\\s]*(?:' + timeMarkers.join('|') + (lastIsNumeral ? '+' : '*') +')' + time + ')?', to.concat(TIME_FORMAT), variant);
      } else {
        addDateInputFormat(loc, src, to, variant);
      }
    }

  };


  // Locale helpers

  function getLocale(code, fallback) {
    var loc;
    if (!isString(code)) code = '';
    loc = locales[code] || locales[code.slice(0,2)];
    if (fallback === false && !loc) {
      throw new TypeError('Invalid locale.');
    }
    return loc || currentLocale;
  }

  function addLocale(arg1, arg2) {
    var loc, code, set;

    if (arg2) {
      code = arg1;
      set  = arg2;
    } else {
      code = arg1.code;
      set  = arg1;
    }

    function initializeField(name) {
      var val = loc[name];
      if (isString(val)) {
        loc[name] = commaSplit(val);
      } else if (!val) {
        loc[name] = [];
      }
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

    function setArray(name, abbreviationSize, multiple) {
      var arr = [];
      forEach(loc[name], function(full, i) {
        if (abbreviationSize) {
          full += '+' + full.slice(0, abbreviationSize);
        }
        eachAlternate(full, function(alt, j) {
          arr[j * multiple + i] = alt.toLowerCase();
        });
      });
      loc[name] = arr;
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

    function getAbbreviationSize(type) {
      // Month suffixes like those found in Asian languages
      // serve as a good proxy to detect month/weekday abbreviations.
      var hasMonthSuffix = !!loc.monthSuffix;
      return loc[type + 'Abbreviate'] || (hasMonthSuffix ? null : 3);
    }

    function setDefault(name, value) {
      loc[name] = loc[name] || value;
    }

    function buildNumbers() {
      var map = loc.ordinalNumberMap = {}, all = [];
      forEach(loc.numbers, function(full, i) {
        eachAlternate(full, function(alt) {
          all.push(alt);
          map[alt] = i + 1;
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
      loc.day += '|' + arrayToAlternates(loc.weekdays);
      loc.modifiers = arr;
    }

    // Initialize the locale
    loc = new Locale(set);
    forEach(LOCALE_FIELDS, initializeField);

    buildNumbers();

    setArray('months', getAbbreviationSize('month'), 12);
    setArray('weekdays', getAbbreviationSize('weekday'), 7);
    setArray('units', false, 8);
    setArray('ampm', 1, 2);

    setDefault('code', code);
    setDefault('date', getDigit(1,2, loc.digitDate));
    setDefault('year', "'\\d{2}|" + getDigit(4,4));
    setDefault('num', getNum());

    buildModifiers();

    if (loc.monthSuffix) {
      loc.month = getDigit(1,2);
      loc.months = map(commaSplit('1,2,3,4,5,6,7,8,9,10,11,12'), function(n) { return n + loc.monthSuffix; });
    }
    loc.fullMonth = getDigit(1,2) + '|' + arrayToAlternates(loc.months);

    // The order of these formats is very important. Order is reversed so formats that come
    // later will take precedence over formats that come before. This generally means that
    // more specific formats should come later, however, the {year} format should come before
    // {day}, as 2011 needs to be parsed as a year (2011) and not date (20) + hours (11)

    // If the locale has time suffixes then add a time only format for that locale
    // that is separate from the core English-based one.
    if (loc.timeSuffixes.length > 0) {
      loc.addFormat(prepareTime(REQUIRED_TIME_REG, loc), false, TIME_FORMAT);
    }

    loc.addFormat('{day}', true);
    loc.addFormat('{month}' + (loc.monthSuffix || ''));
    loc.addFormat('{year}' + (loc.yearSuffix || ''));

    forEach(loc.parse, function(src) {
      loc.addFormat(src);
    });

    forEach(loc.timeParse, function(src) {
      loc.addFormat(src, true);
    });

    return locales[code] = loc;
  }


  // General helpers

  function tzOffset(d) {
    return d.getTimezoneOffset();
  }

  function addDateInputFormat(locale, format, match, variant) {
    locale.compiledFormats.unshift({
      variant: !!variant,
      locale: locale,
      reg: RegExp('^' + format + '$', 'i'),
      to: match
    });
  }

  function simpleCapitalize(str) {
    return str.slice(0,1).toUpperCase() + str.slice(1);
  }

  function arrayToAlternates(arr) {
    return filter(arr, function(el) {
      return !!el;
    }).join('|');
  }

  function getNewDate() {
    var fn = sugarDate.newDateInternal;
    return fn ? fn() : new Date;
  }

  function cloneDate(d) {
    // Rhino environments have a bug where new Date(d) truncates
    // milliseconds so need to call getTime() here.
    var clone = new Date(d.getTime());
    setUTC(clone, !!d._utc);
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

  // Normal callDateSet method with ability
  // to handle ISOWeek setting as well.
  function callDateSetWithWeek(d, method, value) {
    if (method === 'ISOWeek') {
      return setWeekNumber(d, value);
    } else {
      return callDateSet(d, method, value);
    }
  }

  function isValid(d) {
    return !isNaN(d.getTime());
  }

  // UTC helpers

  function setUTC(d, force) {
    setProperty(d, '_utc', !!force);
    return d;
  }

  function isUTC(d) {
    return !!d._utc || tzOffset(d) === 0;
  }

  function getUTCOffset(d, iso) {
    var offset = d._utc ? 0 : tzOffset(d);
    var colon  = iso === true ? ':' : '';
    if (!offset && iso) return 'Z';
    return padNumber(trunc(-offset / 60), 2, true) + colon + padNumber(abs(offset % 60), 2);
  }

  // Date argument helpers

  function collectDateArguments(args, duration) {
    var arg1 = args[0], arg2 = args[1];
    if (duration && isString(arg1)) {
      return [getDateParamsFromString(arg1), arg2];
    } else if (isNumber(arg1) && isNumber(arg2)) {
      return collectParamsFromArguments(args);
    } else {
      // Fast check to see if a non-date object has been passed.
      if (isObjectType(arg1) && !arg1.setTime) {
        args[0] = simpleClone(arg1);
      }
      return args;
    }
  }

  function collectParamsFromArguments(args) {
    var obj = {}, i = 0;
    while (isNumber(args[0])) {
      obj[dateArgumentUnits[i++].name] = args[0];
      args.splice(0, 1);
    }
    args.unshift(obj);
    return args;
  }

  function getDateParamsFromString(str, num) {
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

  function iterateOverDateUnits(fn, from, to) {
    var i, unit;
    if (isUndefined(to)) to = dateUnitsReversed.length;
    for(i = from || 0; i < to; i++) {
      unit = dateUnitsReversed[i];
      if (fn(unit.name, unit, i) === false) {
        break;
      }
    }
  }

  // Date shifting helpers

  function advanceDate(d, args) {
    var set = collectDateArguments(args, true);
    return updateDate(d, set[0], set[1], 1);
  }

  function resetDate(d, unit) {
    var params = {}, recognized;
    unit = unit || 'hours';
    if (unit === 'date') unit = 'days';
    recognized = some(dateUnits, function(u) {
      return unit === u.name || unit === u.name + 's';
    });
    params[unit] = unit.match(/^days?/) ? 1 : 0;
    return recognized ? updateDate(d, params, true) : d;
  }

  function setWeekday(d, dow, forward) {
    if (!isNumber(dow)) return;
    // Dates like "the 2nd Tuesday of June" need to be set forward
    // so make sure that the day of the week reflects that here.
    if (forward && dow % 7 < getWeekday(d)) {
      dow += 7;
    }
    return callDateSet(d, 'Date', getDate(d) + dow - getWeekday(d));
  }

  function moveToBeginningOfUnit(d, unit) {
    var set = {};
    switch(unit) {
      case 'year':  set.year    = getYear(d);     break;
      case 'month': set.month   = getMonth(d);    break;
      case 'day':   set.day     = getDate(d);     break;
      case 'week':  set.weekday = 0; break;
    }
    return updateDate(d, set, true);
  }

  function moveToEndOfUnit(d, unit) {
    var set = { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 };
    switch(unit) {
      case 'year':  set.month   = 11; set.day = 31; break;
      case 'month': set.day     = daysInMonth(d);   break;
      case 'week':  set.weekday = 6;                break;
    }
    return updateDate(d, set, true);
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

    // TODO can we split this up into smaller methods?
    var date, relative, baseLocale, afterCallbacks, loc, set, unit, unitIndex, weekday, num, tmp, weekdayForward;

    var options = getDateOptions(opt);

    afterCallbacks = [];

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

    function setUnitEdge() {
      var modifier = loc.modifiersByName[set.edge];
      iterateOverDateUnits(function(name) {
        if (isDefined(set[name])) {
          unit = name;
          return false;
        }
      }, 4);
      if (unit === 'year') {
        set.specificity = 'month';
      } else if (unit === 'month' || unit === 'week') {
        set.specificity = 'day';
      }
      if (modifier.value < 0) {
        moveToEndOfUnit(date, unit);
      } else {
        moveToBeginningOfUnit(date, unit);
      }
      // This value of -2 is arbitrary but it's a nice clean way to hook into this system.
      if (modifier.value === -2) {
        resetDate(date);
      }
    }

    function separateAbsoluteUnits() {
      var params;
      iterateOverDateUnits(function(name, u, i) {
        if (name === 'day') name = 'date';
        if (isDefined(set[name])) {
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
          params[name] = set[name];
          delete set[name];
        }
      });
      if (params) {
        afterDateSet(function() {
          updateDate(date, params, true);
        });
      }
    }

    // Clone date will set the utc flag, but it will
    // be overriden later, so set option flags instead.
    function cloneDateByFlag(d) {
      var clone = new Date(d.getTime()), utc = isUTC(d);
      if (d._utc && !isDefined(options.fromUTC)) {
        options.fromUTC = true;
      }
      if (d._utc && !isDefined(options.setUTC)) {
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

    setUTC(date, options.fromUTC);

    if (isDate(d)) {
      date = cloneDateByFlag(d);
    } else if (isNumber(d) || d === null) {
      date.setTime(d);
    } else if (isObjectType(d)) {
      set = simpleClone(d);
      updateDate(date, set, true);
    } else if (isString(d)) {

      // The act of getting the locale will pre-initialize
      // if it is missing and add the required formats.
      baseLocale = getLocale(options.locale);

      // Clean the input and convert CJK based numerals if they exist.
      d = cleanDateInput(d);

      if (baseLocale) {
        iterateOverObject(baseLocale.getFormats(), function(i, dif) {
          var match = d.match(dif.reg);
          if (match) {

            loc = dif.locale;
            set = getFormatMatch(match, dif.to, loc);
            loc.cachedFormat = dif;

            if (set.utc) {
              setUTC(date, true);
            }

            if (set.timestamp) {
              set = set.timestamp;
              return false;
            }

            if (dif.variant && !isString(set.month) && (isString(set.date) || baseLocale.hasVariant(options.locale))) {
              // If there's a variant (crazy Endian American format), swap the month and day.
              tmp = set.month;
              set.month = set.date;
              set.date  = tmp;
            }

            if (hasAbbreviatedYear(set)) {
              // If the year is 2 digits then get the implied century.
              set.year = getYearFromAbbreviation(set.year);
            }

            if (set.month) {
              // Set the month which may be localized.
              set.month = loc.getMonth(set.month);
              if (set.shift && !set.unit) set.unit = loc.units[7];
            }

            if (set.hours && (tmp = loc.modifiersByName[set.hours])) {
              // Set hour tokens like "noon"
              set.hours = tmp.value;
            }

            if (set.day && (tmp = loc.modifiersByName[set.day])) {
              // Relative day localizations such as "today" and "tomorrow".
              resetDate(date);
              set.unit = loc.units[4];
              set.day = tmp.value;
            } else if ((weekday = loc.getWeekday(set.weekday || set.day)) > -1) {
              // If the day is a weekday, then set that instead.
              delete set.day;
              delete set.weekday;
              set.weekday = getWeekdayWithMultiplier(weekday);
              // The unit is now set to "day" so that shifting can occur.
              if (set.shift && !set.unit) {
                set.unit = loc.units[5];
              }
              if (set.num && set.month) {
                // If we have "the 2nd Tuesday of June", then pass the "weekdayForward" flag
                // along to updateDate so that the date does not accidentally traverse into
                // the previous month. This needs to be independent of the "prefer" flag because
                // we are only ensuring that the weekday is in the future, not the entire date.
                weekdayForward = true;
              }
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
              // Adjust for timezone offset
              setUTC(date, true);
              set.offsetMinutes = set.offsetMinutes || 0;
              set.offsetMinutes += set.offsetHours * 60;
              if (set.offsetSign === '-') {
                set.offsetMinutes *= -1;
              }
              set.minute -= set.offsetMinutes;
            }

            if (set.unit) {
              // Date has a unit like "days", "months", etc. are all relative to the current date.
              relative  = true;
              num       = loc.getNumber(set.num);
              unitIndex = loc.getUnitIndex(set.unit);
              unit      = English.units[unitIndex];

              // Relative date units such as "tomorrow" have already had their
              // "day" set above so assume 0 shift UNLESS they have a "sign"
              // such as the form "the day after tomorrow", in which case it
              // will need to be added below.
              if (!set.sign && unitIndex === 4) {
                num = 0;
              }

              // Formats like "the 15th of last month" or "6:30pm of next week"
              // contain absolute units in addition to relative ones, so separate
              // them here, remove them from the params, and set up a callback to
              // set them after the relative ones have been set.
              separateAbsoluteUnits();

              if (set.shift) {
                // Shift and unit, ie "next month", "last week", etc.
                num *= (tmp = loc.modifiersByName[set.shift]) ? tmp.value : 0;
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
              set[unit] = (set[unit] || 0) + num;
            }

            if (set.edge) {
              // If there is an "edge" it needs to be set after the
              // other fields are set. ie "the end of February"
              afterDateSet(setUnitEdge);
            }

            if (set.yearSign === '-') {
              set.year *= -1;
            }

            iterateOverDateUnits(function(name, unit, i) {
              var value = set[name] || 0, fraction = value % 1;
              if (fraction) {
                set[dateUnitsReversed[i - 1].name] = round(fraction * (name === 'second' ? 1000 : 60));
                set[name] = trunc(value);
              }
            }, 1, 4);
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
      } else if (relative) {
        updateDate(date, set, false, 1);
      } else {
        if (date._utc) {
          // UTC times can traverse into other days or even months,
          // so preemtively reset the time here to prevent this.
          resetDate(date);
        }
        updateDate(date, set, true, false, options.prefer, weekdayForward);
      }
      fireCallbacks();
    }
    // A date created by parsing a string presumes that the format *itself* is UTC, but
    // not that the date, once created, should be manipulated as such. In other words,
    // if you are creating a date object from a server time "2012-11-15T12:00:00Z",
    // in the majority of cases you are using it to create a date that will, after creation,
    // be manipulated as local, so reset the utc flag here unless "setUTC" is also set.
    setUTC(date, !!options.setUTC);
    return {
      date: date,
      set: set
    }
  }

  function hasAbbreviatedYear(obj) {
    return obj.yearAsString && obj.yearAsString.length === 2;
  }

  // If the year is two digits, add the most appropriate century prefix.
  function getYearFromAbbreviation(year) {
    return round(callDateGet(getNewDate(), 'FullYear') / 100) * 100 - round(year / 100) * 100 + year;
  }

  function getShortHour(d) {
    var hours = getHours(d);
    return hours === 0 ? 12 : hours - (trunc(hours / 13) * 12);
  }

  function setWeekNumber(d, num) {
    var weekday = getWeekday(d) || 7;
    if (isUndefined(num)) return;
    updateDate(d, { month: 0, date: 4 });
    updateDate(d, { weekday: 1 });
    if (num > 1) {
      updateDate(d, { weeks: num - 1 }, false, 1);
    }
    if (weekday !== 1) {
      updateDate(d, { days: weekday - 1 }, false, 1);
    }
    return d.getTime();
  }

  function daysInMonth(d) {
    return 32 - callDateGet(new Date(getYear(d), getMonth(d), 32), 'Date');
  }

  // Gets an "adjusted date unit" which is a way of representing
  // the largest possible meaningful unit. In other words, if passed
  // 3600000, this will return an array which represents "1 hour".
  function getAdjustedUnit(ms, fn) {
    var unitIndex = 0, value = 0;
    iterateOverObject(dateUnits, function(i, unit) {
      value = abs(fn(unit));
      if (value >= 1) {
        unitIndex = 7 - i;
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
    var ms = sugarDate.millisecondsFromNow(d);
    if (d > new Date) {

      // This adjustment is solely to allow
      // Date.create('1 year from now').relative() to remain
      // "1 year from now" instead of "11 months from now",
      // as it would be due to the fact that the internal
      // "now" date in "relative" is created slightly after
      // that in "create".
      d = new Date(d.getTime() + 10);
    }
    return getAdjustedUnit(ms, function(unit) {
      return abs(sugarDate[unit.name + 'sFromNow'](d));
    });
  }

  // Date format token helpers

  function createMeridianTokens(slice, caps) {
    var fn = function(d, localeCode) {
      var hours = getHours(d);
      return getLocale(localeCode).get('ampm')[trunc(hours / 12)] || '';
    }
    createFormatToken('t', fn, 1);
    createFormatToken('tt', fn);
    createFormatToken('T', fn, 1, 1);
    createFormatToken('TT', fn, null, 2);
  }

  function createWeekdayTokens(slice, caps) {
    var fn = function(d, localeCode) {
      var dow = getWeekday(d);
      return getLocale(localeCode).weekdays[dow];
    }
    createFormatToken('do', fn, 2);
    createFormatToken('Do', fn, 2, 1);
    createFormatToken('dow', fn, 3);
    createFormatToken('Dow', fn, 3, 1);
    createFormatToken('weekday', fn);
    createFormatToken('Weekday', fn, null, 1);
  }

  function createMonthTokens(slice, caps) {
    createMonthToken('mon', 0, 3);
    createMonthToken('month', 0);

    // For inflected month forms, namely Russian.
    createMonthToken('month2', 1);
    createMonthToken('month3', 2);
  }

  function createMonthToken(token, multiplier, slice) {
    var fn = function(d, localeCode) {
      var month = getMonth(d);
      return getLocale(localeCode).months[month + (multiplier * 12)];
    };
    createFormatToken(token, fn, slice);
    createFormatToken(simpleCapitalize(token), fn, slice, 1);
  }

  function createFormatToken(t, fn, slice, caps) {
    dateFormatTokens[t] = function(d, localeCode) {
      var str = fn(d, localeCode);
      if (slice) str = str.slice(0, slice);
      if (caps)  str = str.slice(0, caps).toUpperCase() + str.slice(caps);
      return str;
    }
  }

  function createPaddedToken(t, fn, ms) {
    dateFormatTokens[t] = fn;
    dateFormatTokens[t + t] = function(d, localeCode) {
      return padNumber(fn(d, localeCode), 2);
    };
    if (ms) {
      dateFormatTokens[t + t + t] = function(d, localeCode) {
        return padNumber(fn(d, localeCode), 3);
      };
      dateFormatTokens[t + t + t + t] = function(d, localeCode) {
        return padNumber(fn(d, localeCode), 4);
      };
    }
  }


  // Date formatting helpers

  function buildCompiledOutputFormat(format) {
    var match = format.match(/(\{\w+\})|[^{}]+/g);
    compiledOutputFormats[format] = map(match, function(p) {
      p.replace(/\{(\w+)\}/, function(full, token) {
        p = dateFormatTokens[token] || token;
        return token;
      });
      return p;
    });
  }

  function executeCompiledOutputFormat(d, format, localeCode) {
    var compiledFormat, length, i, t, result = '';
    compiledFormat = compiledOutputFormats[format];
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
    } else if (isString(sugarDate[format])) {
      format = sugarDate[format];
    } else if (isFunction(format)) {
      adu = getAdjustedUnitForDate(d);
      format = format.apply(d, adu.concat(getLocale(localeCode)));
    }
    if (!format && relative) {
      adu = adu || getAdjustedUnitForDate(d);
      // Adjust up if time is in ms, as this doesn't
      // look very good for a standard relative date.
      if (adu[1] === 0) {
        adu[1] = 1;
        adu[0] = 1;
      }
      return getLocale(localeCode).getRelativeFormat(adu);
    }
    format = format || 'long';
    if (format === 'short' || format === 'long' || format === 'full') {
      format = getLocale(localeCode)[format];
    }

    if (!compiledOutputFormats[format]) {
      buildCompiledOutputFormat(format);
    }

    return executeCompiledOutputFormat(d, format, localeCode);
  }

  // Date comparison helpers

  function fullCompareDate(date, d, margin) {
    var tmp, comp;
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
        case (tmp = indexOf(English.weekdays, d) % 7) > -1: return getWeekday(date) === tmp;
        case (tmp = indexOf(English.months, d) % 12) > -1:  return getMonth(date) === tmp;
      }
    }
    return compareDate(date, d, margin);
  }

  function compareDate(date, d, margin, options) {
    var p, t, min, max, override, loMargin = 0, hiMargin = 0;

    function getMaxBySpecificity() {
      var params = getDateParamsFromString('1 ' + p.set.specificity)
      return updateDate(cloneDate(p.date), params, false, 1).getTime() - 1;
    }

    if (date._utc) {
      options = options || {};
      options.fromUTC = true;
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
        // If the time is relative, there can occasionally be an disparity between the relative date
        // and "now", which it is being compared to, so set an extra margin to account for this.
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
      callDateSet(comp, 'Date', getDate(comp) + shift);
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
      return isDefined(params[key]) ? params[key] : params[key + 's'];
    }

    function paramExists(key) {
      return isDefined(getParam(key));
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

    if (isNumber(params) && advance) {
      // If param is a number and we're advancing, the number is presumed to be milliseconds.
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
    // weeks or for years. This needs to be performed before the acutal setting
    // of the date because the order needs to be reversed in order to get the
    // lowest specificity, also because higher order units can be overridden by
    // lower order units, such as setting hour: 3, minute: 345, etc.
    iterateOverDateUnits(function(name, unit, i) {
      var isDay = name === 'day';
      if (uniqueParamExists(name, isDay)) {
        params.specificity = name;
        specificityIndex = +i;
        return false;
      } else if (reset && name !== 'week' && (!isDay || !paramExists('week'))) {
        // Days are relative to months, not weeks, so don't reset if a week exists.
        callDateSet(d, unit.method, (isDay ? 1 : 0));
      }
    });

    // Now actually set or advance the date in order, higher units first.
    forEach(dateUnits, function(u, i) {
      var name = u.name, method = u.method, value, checkMonth;
      value = getParam(name)
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
      // rolling back, a date at 1:00am that has setHours(2) called on it will
      // jump forward and extra hour as the period between 1:00am and 1:59am
      // occurs twice. This ambiguity is unavoidable when setting dates as the
      // notation is ambiguous. However, when advancing we clearly want the
      // resulting date to be an acutal hour ahead, which can only accomplished
      // by setting the absolute time. Conversely, any unit higher than "hours"
      // MUST use the internal set methods, as they are ambiguous as absolute
      // units of time. Years may be 365 or 366 days depending on leap years,
      // months are all over the place, and even days may be 23-25 hours
      // depending on DST shifts.
      if (advance && i > 3) {
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
        callDateSet(d, 'Date', 0);
      }
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
    // be in the past or future.
    if (canDisambiguate()) {
      iterateOverDateUnits(function(name, u) {
        var ambiguous = u.ambiguous || (name === 'week' && paramExists('weekday'));
        if (ambiguous && !uniqueParamExists(name, name === 'day')) {
          sugarDate[u.addMethod](d, prefer);
          return false;
        } else if (name === 'year' && hasAbbreviatedYear(params)) {
          updateDate(d, { years: 100 * prefer }, false, 1);
        }
      }, specificityIndex + 1);
    }
    return d;
  }

  // The ISO format allows times strung together without a demarcating ":", so
  // make sure that these markers are now optional.
  function prepareTime(format, loc, iso) {
    var timeSuffixMapping = {'h':0,'m':1,'s':2}, add;
    loc = loc || English;
    return format.replace(/{([a-z])}/g, function(full, token) {
      var separators = [],
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
        return separators.length === 0 ? '' : '(?:' + separators.join('|') + ')' + (tokenIsRequired ? '' : '?');
      }
    });
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
    dateUnitsReversed = dateUnits.concat().reverse();
    dateArgumentUnits = dateUnits.concat();
    dateArgumentUnits.splice(2,1);
  }

  /***
   * @method [units]Since([d], [options])
   * @returns Number
   * @short Returns the time since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %[unit]Ago% is provided as an alias to make this more readable when [d] is assumed to be the current date. See %date_options% for options.

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
   * @method beginningOf[Unit]()
   * @returns Date
   * @short Sets the date to the beginning of the appropriate unit.
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
   * @method endOf[Unit]()
   * @returns Date
   * @short Sets the date to the end of the appropriate unit.
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
    defineInstanceSimilar(sugarDate, dateUnits, function(methods, u, i) {
      var name = u.name, caps = simpleCapitalize(name);
      u.addMethod = 'add' + caps + 's';

      if (i < 3) {
        forEach(['Last','This','Next'], function(shift) {
          methods['is' + shift + caps] = function(d) {
            return compareDate(d, shift + ' ' + name, 0, { locale: 'en' });
          };
        });
      }
      if (i < 4) {
        methods['beginningOf' + caps] = function(d) {
          return moveToBeginningOfUnit(d, name);
        };
        methods['endOf' + caps] = function(d) {
          return moveToEndOfUnit(d, name);
        };
      }

      methods[u.addMethod] = function(d, num, reset) {
        var set = {};
        set[name] = num;
        return advanceDate(d, [set, reset]);
      }

      buildNumberMethods(u, u.multiplier);
    });

    defineInstanceSimilar(sugarDate, dateUnits, function(methods, u, i) {
      var since, until, higher = i < 4;

      // Higher order units use traversal with "set" methods. Traversing is
      // required due to ambiguity, but it opens up an edge case where a date
      // can shift forward an hour if it hits the middle of a DST forward shift,
      // as the target time does not exist. Compensate for that here by shifting
      // back an hour if detected. "hours" and lower use absolute time so they
      // don't need to be concerned with this problem.
      function safeAddUnit(d, n) {
        var h, check = higher;
        if (check) {
          h = getHours(d);
        }
        sugarDate[u.addMethod](d, n);
        if (check && getHours(d) !== h) {
          d.setTime(d.getTime() - HOUR);
        }
      }

      function getDistance(d1, d2) {
        var fwd = d2 > d1, n, tmp;
        if (!fwd) {
          tmp = d2;
          d2  = d1;
          d1  = tmp;
        }
        n = d2 - d1;
        if (u.multiplier > 1) {
          n = trunc(n / u.multiplier);
        }
        // As higher order units have potential ambiguity, use the numeric
        // calculation as a starting point, then iterate until we pass the
        // target date 
        if (higher) {
          safeAddUnit(d1, n);
          while (d1 < d2) {
            safeAddUnit(d1, 1);
            if (d1 > d2) {
              break;
            }
            n += 1;
          }
        }
        return fwd ? -n : n;
      }

      since = function(date, d, options) {
        return getDistance(cloneDate(date), createDate(date, d, options));
      };
      until = function(date, d, options) {
        return getDistance(createDate(date, d, options), cloneDate(date));
      };

      methods[u.name + 'sAgo']   = methods[u.name + 'sUntil']   = until;
      methods[u.name + 'sSince'] = methods[u.name + 'sFromNow'] = since;
    });
  }

  function buildCoreInputFormats() {
    // ISO8601 format
    English.addFormat('([+-])?(\\d{4,4})[-.\\/]?{fullMonth}[-.]?(\\d{1,2})?', true, ['yearSign','year','month','date'], false, true);
    English.addFormat('(\\d{1,2})[-.\\/]{fullMonth}(?:[-.\\/](\\d{2,4}))?', true, ['date','month','year'], true);
    English.addFormat('{fullMonth}[-.](\\d{4,4})', false, ['month','year']);
    English.addFormat('\\/Date\\((\\d+(?:[+-]\\d{4,4})?)\\)\\/', false, ['timestamp'])
    English.addFormat(prepareTime(REQUIRED_TIME_REG, English), false, TIME_FORMAT)

    // When a new locale is initialized it will have the coreDateFormats initialized by default.
    // From there, adding new formats will push them in front of the previous ones, so the core
    // formats will be the last to be reached. However, the core formats themselves have English
    // months in them, which means that English needs to first be initialized and creates a race
    // condition. I'm getting around this here by adding these generalized formats in the order
    // specific -> general, which will mean they will be added to the English locale in
    // general -> specific order, then chopping them off the front and reversing to get the correct
    // order. Note that there are 7 formats as 2 have times which adds a front and a back format.
    coreDateFormats = English.compiledFormats.slice(0,7).reverse();
    English.compiledFormats = English.compiledFormats.slice(7).concat(coreDateFormats);
  }

  function buildFormatTokens() {

    createPaddedToken('f', function(d) {
      return callDateGet(d, 'Milliseconds');
    }, true);

    createPaddedToken('s', function(d) {
      return callDateGet(d, 'Seconds');
    });

    createPaddedToken('m', function(d) {
      return callDateGet(d, 'Minutes');
    });

    createPaddedToken('h', function(d) {
      return getHours(d) % 12 || 12;
    });

    createPaddedToken('H', function(d) {
      return getHours(d);
    });

    createPaddedToken('d', function(d) {
      return getDate(d);
    });

    createPaddedToken('M', function(d) {
      return getMonth(d) + 1;
    });

    createMeridianTokens();
    createWeekdayTokens();
    createMonthTokens();

    // Aliases
    dateFormatTokens['ms']           = dateFormatTokens['f'];
    dateFormatTokens['milliseconds'] = dateFormatTokens['f'];
    dateFormatTokens['seconds']      = dateFormatTokens['s'];
    dateFormatTokens['minutes']      = dateFormatTokens['m'];
    dateFormatTokens['hours']        = dateFormatTokens['h'];
    dateFormatTokens['24hr']         = dateFormatTokens['H'];
    dateFormatTokens['12hr']         = dateFormatTokens['h'];
    dateFormatTokens['date']         = dateFormatTokens['d'];
    dateFormatTokens['day']          = dateFormatTokens['d'];
    dateFormatTokens['year']         = dateFormatTokens['yyyy'];

  }

  function buildFormatShortcuts() {
    defineInstanceSimilar(sugarDate, 'short,long,full', function(methods, name) {
      methods[name] = function(d, localeCode) {
        return formatDate(d, name, false, localeCode);
      }
    });
  }

  function buildCJKDigits() {
    var digits = '〇一二三四五六七八九十百千万';
    forEach(digits.split(''), function(digit, value) {
      var holder;
      if (value > 9) {
        value = pow(10, value - 9);
      }
      cjkDigitMap[digit] = value;
    });
    simpleMerge(cjkDigitMap, numberNormalizeMap);
    // CJK numerals may also be included in phrases which are text-based rather
    // than actual numbers such as Chinese weekdays (上周三), and "the day before
    // yesterday" (一昨日) in Japanese, so don't match these.
    cjkDigitReg = RegExp('([期週周])?([' + digits + fullWidthDigits + ']+)(?!昨)', 'g');
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
    var special  = commaSplit('today,yesterday,tomorrow,weekday,weekend,future,past');
    var weekdays = English.weekdays.slice(0,7);
    var months   = English.months.slice(0,12);
    defineInstanceSimilar(sugarDate, special.concat(weekdays).concat(months), function(methods, name) {
      methods['is'+ simpleCapitalize(name)] = function(d) {
        return fullCompareDate(d, name);
      };
    });
  }

  function buildAllowedDateOptions() {
    forEach(['fromUTC','setUTC','past','future','locale'], function(name) {
      allowedDateOptions[name] = true;
    });;
  }

  function setDateProperties() {
    defineStaticProperties(sugarDate, {
      'RFC1123': '{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {tz}',
      'RFC1036': '{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {tz}',
      'ISO8601_DATE': '{yyyy}-{MM}-{dd}',
      'ISO8601_DATETIME': '{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{fff}{isotz}'
    });
  }


  defineStatic(sugarDate, {

     /***
     * @method Date.create(<d>, [options])
     * @returns Date
     * @short Alternate date constructor which acepts many different text formats, a timestamp, or another date.
     * @extra If no argument is given, the date is assumed to be now. See %date_options% for options.

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
     * @method Date.addLocale(<code>, <set>)
     * @returns Locale
     * @short Adds a locale <set> to the locales understood by Sugar.
     * @extra For more see %date_format%.
     *
     ***/
    'addLocale': function(code, set) {
      return addLocale(code, set);
    },

     /***
     * @method Date.setLocale(<code>)
     * @returns Locale
     * @short Sets the current locale to be used with dates.
     * @extra Sugar has support for 13 locales that are available through the "Date Locales" package. In addition you can define a new locale with %Date.addLocale%. For more see %date_format%.
     *
     ***/
    'setLocale': function(code) {
      var loc = getLocale(code, false);
      currentLocale = loc;
      // The code is allowed to be more specific than the codes which are required:
      // i.e. zh-CN or en-US. Currently this only affects US date variants such as 8/10/2000.
      if (code && code !== loc.code) {
        loc.code = code;
      }
      return loc;
    },

     /***
     * @method Date.getLocale([code] = current)
     * @returns Locale
     * @short Gets the locale for the given code, or the current locale.
     * @extra The resulting locale object can be manipulated to provide more control over date localizations. For more about locales, see %date_format%.
     *
     ***/
    'getLocale': function(code) {
      return !code ? currentLocale : getLocale(code, false);
    },

     /**
     * @method Date.addFormat(<format>, <match>, [code] = null)
     * @returns Nothing
     * @short Manually adds a new date input format.
     * @extra This method allows fine grained control for alternate formats. <format> is a string that can have regex tokens inside. <match> is an array of the tokens that each regex capturing group will map to, for example %year%, %date%, etc. For more, see %date_format%.
     *
     **/
    'addFormat': function(format, match, localeCode) {
      addDateInputFormat(getLocale(localeCode), format, match);
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
      var args = collectDateArguments(args);
      return updateDate(d, args[0], args[1])
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
      return advanceDate(d, args);
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
      var args = collectDateArguments(args, true);
      return updateDate(d, args[0], args[1], -1);
    }

  });

  defineInstance(sugarDate, {

     /***
     * @method get(<d>, [options])
     * @returns Date
     * @short Gets a new date using the current one as a starting point.
     * @extra For most purposes, this method is identical to %Date.create%, except that if a relative format such as "next week" is passed, it will be relative to the instance rather than the current time. See %date_options% for options.

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
      return setWeekNumber(d, num);
    },

     /***
     * @method getISOWeek()
     * @returns Number
     * @short Gets the date's week (of the year) as defined by the ISO8601 standard.
     * @extra Note that this standard places Sunday at the end of the week (day 7). If %utc% is set on the date, the week will be according to UTC time.
     *
     * @example
     *
     *   new Date().getISOWeek()    -> today's week of the year
     *
     ***/
    'getISOWeek': function(d) {
      d = cloneDate(d);
      var dow = getWeekday(d) || 7;
      resetDate(updateDate(d, getDateParamsFromString((4 - dow) + ' days'), false, 1));
      return 1 + trunc(sugarDate.daysSince(d, moveToBeginningOfUnit(cloneDate(d), 'year')) / 7);
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
      return resetDate(d);
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
     * @short Sets the internal utc flag for the date. When on, UTC-based methods will be called internally.
     * @extra For more see %date_format%.
     * @example
     *
     *   new Date().setUTC(true)
     *   new Date().setUTC(false)
     *
     ***/
    'setUTC': function(d, on) {
      return setUTC(d, on);
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
     * @short Returns true if the date falls between <d1> and <d2>.
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
      return (lo - margin < t) && (hi + margin > t);
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
     *   long
     *   full
     *
     * @example
     *
     *   Date.create().format()                                   -> ex. July 4, 2003
     *   Date.create().format('{Weekday} {d} {Month}, {yyyy}')    -> ex. Monday July 4, 2003
     *   Date.create().format('{hh}:{mm}')                        -> ex. 15:57
     *   Date.create().format('{12hr}:{mm}{tt}')                  -> ex. 3:57pm
     *   Date.create().format(Date.ISO8601_DATETIME)              -> ex. 2011-07-05 12:24:55.528Z
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
      return resetDate(d, unit);
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
    var base, after, before, name = u.name, methods = {}, methodsWithArgs = {};
    base = function(n) {
      return round(n * multiplier);
    }
    after = function(n, d, options) {
      return sugarDate[u.addMethod](createDate(null, d, options), n);
    }
    before = function(n, d, options) {
      return sugarDate[u.addMethod](createDate(null, d, options), -n);
    }
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
     * @extra This method is the same as %Date#relative% without the localized equivalent of "from now" or "ago". [locale] can be passed as the first (and only) parameter. Note that this method is only available when the dates package is included.
     * @example
     *
     *   (500).duration() -> '500 milliseconds'
     *   (1200).duration() -> '1 second'
     *   (75).minutes().duration() -> '1 hour'
     *   (75).minutes().duration('es') -> '1 hora'
     *
     ***/
    'duration': function(n, localeCode) {
      return getLocale(localeCode).getDuration(n);
    }

  });

  /***
   * @package Locales
   * @dependency date
   * @description Locale definitions French (fr), Italian (it), Spanish (es), Portuguese (pt), German (de), Russian (ru), Polish (pl), Swedish (sv), Japanese (ja), Korean (ko), Simplified Chinese (zh-CN), and Traditional Chinese (zh-TW). Locales can also be included individually. See @date_locales for more.
   *
   ***/

  English = currentLocale = sugarDate.addLocale('en', {
    'plural':     true,
    'timeMarker': 'at',
    'ampm':       'am,pm',
    'months':     'January,February,March,April,May,June,July,August,Sept:ember|,October,November,December',
    'weekdays':   'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
    'units':      'millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s',
    'numbers':    'one,two,three,four,five,six,seven,eight,nine,ten',
    'articles':   'a,an,the',
    'tokens':     'the,st|nd|rd|th,of',
    'short':      '{Month} {d}, {yyyy}',
    'long':       '{Month} {d}, {yyyy} {h}:{mm}{tt}',
    'full':       '{Weekday} {Month} {d}, {yyyy} {h}:{mm}:{ss}{tt}',
    'past':       '{num} {unit} {sign}',
    'future':     '{num} {unit} {sign}',
    'duration':   '{num} {unit}',
    'modifiers': [
      { 'name': 'hours',  'src': 'midnight', 'value': 0 },
      { 'name': 'hours',  'src': 'noon', 'value': 12 },
      { 'name': 'day',  'src': 'yesterday', 'value': -1 },
      { 'name': 'day',  'src': 'today', 'value': 0 },
      { 'name': 'day',  'src': 'tomorrow', 'value': 1 },
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
  });

  buildDateUnits();
  buildDateUnitMethods();
  buildCoreInputFormats();
  buildFormatTokens();
  buildFormatShortcuts();
  buildCJKDigits();
  buildRelativeAliases();
  buildAllowedDateOptions();
  setDateProperties();
