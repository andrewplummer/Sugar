
  'use strict';

  /***
   * @package Date
   * @dependency core
   * @description Date parsing and formatting, relative formats like "1 minute ago", Number methods like "daysAgo", localization support with default English locale definition.
   *
   ***/

  var English;
  var CurrentLocalization;

  var TimeFormat = ['ampm','hour','minute','second','ampm','utc','offset_sign','offset_hours','offset_minutes','ampm'];
  var DecimalReg = '(?:[,.]\\d+)?';
  var HoursReg   = '\\d{1,2}' + DecimalReg;
  var SixtyReg   = '[0-5]\\d' + DecimalReg;
  var RequiredTime = '({t})?\\s*('+HoursReg+')(?:{h}('+SixtyReg+')?{m}(?::?('+SixtyReg+'){s})?\\s*(?:({t})|(Z)|(?:([+-])(\\d{2,2})(?::?(\\d{2,2}))?)?)?|\\s*({t}))';

  var KanjiDigits = '〇一二三四五六七八九十百千万';
  var AsianDigitMap = {};
  var AsianDigitReg;

  var DateArgumentUnits;
  var DateUnitsReversed;
  var CoreDateFormats = [];
  var CompiledOutputFormats = {};

  var DateFormatTokens = {

    'yyyy': function(d) {
      return callDateGet(d, 'FullYear');
    },

    'yy': function(d) {
      return callDateGet(d, 'FullYear') % 100;
    },

    'ord': function(d) {
      var date = callDateGet(d, 'Date');
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

  var DateUnits = [
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




  // Date Localization

  var Localizations = {};

  // Localization object

  function Localization(l) {
    simpleMerge(this, l);
    this.compiledFormats = CoreDateFormats.concat();
  }

  Localization.prototype = {

    get: function(prop) {
      return this[prop] || '';
    },

    getMonth: function(n) {
      if(isNumber(n)) {
        return n - 1;
      } else {
        return this['months'].indexOf(n) % 12;
      }
    },

    getWeekday: function(n) {
      return this['weekdays'].indexOf(n) % 7;
    },

    getNumber: function(n, digit) {
      var mapped = this.ordinalNumberMap[n];
      if(mapped) {
        if(digit) {
          mapped = mapped % 10;
        }
        return mapped;
      }
      return isNumber(n) ? n : 1;
    },

    getNumericDate: function(n) {
      var self = this;
      return n.replace(regexp(this['num'], 'g'), function(d) {
        var num = self.getNumber(d, true);
        return num || '';
      });
    },

    getUnitIndex: function(n) {
      return this['units'].indexOf(n) % 8;
    },

    getRelativeFormat: function(adu) {
      return this.convertAdjustedToFormat(adu, adu[2] > 0 ? 'future' : 'past');
    },

    getDuration: function(ms) {
      return this.convertAdjustedToFormat(getAdjustedUnitForNumber(ms), 'duration');
    },

    hasVariant: function(code) {
      code = code || this.code;
      return code === 'en' || code === 'en-US' ? true : this['variant'];
    },

    matchAM: function(str) {
      return str === this.get('ampm')[0];
    },

    matchPM: function(str) {
      return str && str === this.get('ampm')[1];
    },

    convertAdjustedToFormat: function(adu, mode) {
      var sign, unit, mult,
          num    = adu[0],
          u      = adu[1],
          ms     = adu[2],
          format = this[mode] || this['relative'];
      if(isFunction(format)) {
        return format.call(this, num, u, ms, mode);
      }
      mult = !this['plural'] || num === 1 ? 0 : 1;
      unit = this['units'][mult * 8 + u] || this['units'][u];
      if(this['capitalizeUnit']) unit = simpleCapitalize(unit);
      sign = this['modifiers'].filter(function(m) { return m.name == 'sign' && m.value == (ms > 0 ? 1 : -1); })[0];
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
        if(nc) {
          value = loc.get('tokens')[nc[1]];
        } else if(loc[key]) {
          value = loc[key];
        } else if(loc[key + 's']) {
          value = loc[key + 's'];
          if(slice) {
            // Can't use filter here as Prototype hijacks the method and doesn't
            // pass an index, so use a simple loop instead!
            arr = [];
            value.forEach(function(m, i) {
              var mod = i % (loc['units'] ? 8 : value.length);
              if(mod >= slice[1] && mod <= (slice[2] || slice[1])) {
                arr.push(m);
              }
            });
            value = arr;
          }
          value = arrayToAlternates(value);
        }
        if(!value) {
          return '';
        }
        if(nc) {
          result = '(?:' + value + ')';
        } else {
          if(!match) {
            to.push(key);
          }
          result = '(' + value + ')';
        }
        if(opt) {
          result += '?';
        }
        return result;
      });
      if(allowsTime) {
        time = prepareTime(RequiredTime, loc, iso);
        timeMarkers = ['t','[\\s\\u3000]'].concat(loc.get('timeMarker'));
        lastIsNumeral = src.match(/\\d\{\d,\d\}\)+\??$/);
        addDateInputFormat(loc, '(?:' + time + ')[,\\s\\u3000]+?' + src, TimeFormat.concat(to), variant);
        addDateInputFormat(loc, src + '(?:[,\\s]*(?:' + timeMarkers.join('|') + (lastIsNumeral ? '+' : '*') +')' + time + ')?', to.concat(TimeFormat), variant);
      } else {
        addDateInputFormat(loc, src, to, variant);
      }
    }

  };


  // Localization helpers

  function getLocalization(localeCode, fallback) {
    var loc;
    if(!isString(localeCode)) localeCode = '';
    loc = Localizations[localeCode] || Localizations[localeCode.slice(0,2)];
    if(fallback === false && !loc) {
      throw new TypeError('Invalid locale.');
    }
    return loc || CurrentLocalization;
  }

  function setLocalization(localeCode, set) {
    var loc;

    function initializeField(name) {
      var val = loc[name];
      if(isString(val)) {
        loc[name] = val.split(',');
      } else if(!val) {
        loc[name] = [];
      }
    }

    function eachAlternate(str, fn) {
      str = str.split('+').map(function(split) {
        return split.replace(/(.+):(.+)$/, function(full, base, suffixes) {
          return suffixes.split('|').map(function(suffix) {
            return base + suffix;
          }).join('|');
        });
      }).join('|');
      return str.split('|').forEach(fn);
    }

    function setArray(name, abbreviationSize, multiple) {
      var arr = [];
      loc[name].forEach(function(full, i) {
        if(abbreviationSize) {
          full += '+' + full.slice(0, abbreviationSize);
        }
        eachAlternate(full, function(alt, j) {
          arr[j * multiple + i] = alt.toLowerCase();
        });
      });
      loc[name] = arr;
    }

    function getDigit(start, stop, allowNumbers) {
      var str = '\\d{' + start + ',' + stop + '}';
      if(allowNumbers) str += '|(?:' + arrayToAlternates(loc.get('numbers')) + ')+';
      return str;
    }

    function getNum() {
      var numbers = loc.get('numbers');
      var arr = ['-?\\d+'].concat(loc.get('articles'));
      if(numbers) {
        arr = arr.concat(numbers);
      }
      return arrayToAlternates(arr);
    }

    function getAbbreviationSize(type) {
      // Month suffixes like those found in Asian languages
      // serve as a good proxy to detect month/weekday abbreviations.
      var hasMonthSuffix = !!loc['monthSuffix'];
      return loc[type + 'Abbreviate'] || (hasMonthSuffix ? null : 3);
    }

    function setDefault(name, value) {
      loc[name] = loc[name] || value;
    }

    function buildNumbers() {
      var map = loc.ordinalNumberMap = {}, all = [];
      loc['numbers'].forEach(function(full, i) {
        eachAlternate(full, function(alt) {
          all.push(alt);
          map[alt] = i + 1;
        });
      });
      loc['numbers'] = all;
    }

    function buildModifiers() {
      var arr = [];
      loc.modifiersByName = {};
      loc['modifiers'].push({ 'name': 'day', 'src': 'yesterday', 'value': -1 });
      loc['modifiers'].push({ 'name': 'day', 'src': 'today', 'value': 0 });
      loc['modifiers'].push({ 'name': 'day', 'src': 'tomorrow', 'value': 1 });
      loc['modifiers'].forEach(function(modifier) {
        var name = modifier.name;
        eachAlternate(modifier.src, function(t) {
          var locEntry = loc[name];
          loc.modifiersByName[t] = modifier;
          arr.push({ name: name, src: t, value: modifier.value });
          loc[name] = locEntry ? locEntry + '|' + t : t;
        });
      });
      loc['day'] += '|' + arrayToAlternates(loc['weekdays']);
      loc['modifiers'] = arr;
    }

    // Initialize the locale
    loc = new Localization(set);
    initializeField('modifiers');
    'months,weekdays,units,numbers,articles,tokens,timeMarker,ampm,timeSuffixes,dateParse,timeParse'.split(',').forEach(initializeField);

    buildNumbers();

    setArray('months', getAbbreviationSize('month'), 12);
    setArray('weekdays', getAbbreviationSize('weekday'), 7);
    setArray('units', false, 8);

    setDefault('code', localeCode);
    setDefault('date', getDigit(1,2, loc['digitDate']));
    setDefault('year', "'\\d{2}|" + getDigit(4,4));
    setDefault('num', getNum());

    buildModifiers();

    if(loc['monthSuffix']) {
      loc['month'] = getDigit(1,2);
      loc['months'] = '1,2,3,4,5,6,7,8,9,10,11,12'.split(',').map(function(n) { return n + loc['monthSuffix']; });
    }
    loc['full_month'] = getDigit(1,2) + '|' + arrayToAlternates(loc['months']);

    // The order of these formats is very important. Order is reversed so formats that come
    // later will take precedence over formats that come before. This generally means that
    // more specific formats should come later, however, the {year} format should come before
    // {day}, as 2011 needs to be parsed as a year (2011) and not date (20) + hours (11)

    // If the locale has time suffixes then add a time only format for that locale
    // that is separate from the core English-based one.
    if(loc['timeSuffixes'].length > 0) {
      loc.addFormat(prepareTime(RequiredTime, loc), false, TimeFormat);
    }

    loc.addFormat('{day}', true);
    loc.addFormat('{month}' + (loc['monthSuffix'] || ''));
    loc.addFormat('{year}' + (loc['yearSuffix'] || ''));

    loc['timeParse'].forEach(function(src) {
      loc.addFormat(src, true);
    });

    loc['dateParse'].forEach(function(src) {
      loc.addFormat(src);
    });

    return Localizations[localeCode] = loc;
  }


  // General helpers

  function addDateInputFormat(locale, format, match, variant) {
    locale.compiledFormats.unshift({
      variant: !!variant,
      locale: locale,
      reg: regexp('^' + format + '$', 'i'),
      to: match
    });
  }

  function simpleCapitalize(str) {
    return str.slice(0,1).toUpperCase() + str.slice(1);
  }

  function arrayToAlternates(arr) {
    return arr.filter(function(el) {
      return !!el;
    }).join('|');
  }

  function getNewDate() {
    var fn = sugarDate['newDateInternal'];
    return fn ? fn() : new date;
  }

  function cloneDate(d) {
    var cloned = new date(d.getTime());
    setUTC(cloned, !!d._utc);
    return cloned;
  }

  // Normal callDateSet method with ability
  // to handle ISOWeek setting as well.
  function callDateSetWithWeek(d, method, value) {
    if(method === 'ISOWeek') {
      return setWeekNumber(d, value);
    } else {
      return callDateSet(d, method, value);
    }
  }

  function isValid(d) {
    return !isNaN(d.getTime());
  }

  function isLeapYear(d) {
    var year = callDateGet(d, 'FullYear');
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  // UTC helpers

  function setUTC(d, force) {
    setProperty(d, '_utc', !!force);
    return d;
  }

  function isUTC(d) {
    return !!d._utc || d.getTimezoneOffset() === 0;
  }

  function getUTCOffset(d, iso) {
    var offset = d._utc ? 0 : d.getTimezoneOffset();
    var colon  = iso === true ? ':' : '';
    if(!offset && iso) return 'Z';
    return padNumber(floor(-offset / 60), 2, true) + colon + padNumber(abs(offset % 60), 2);
  }

  // Date argument helpers

  function collectDateArguments(args, allowDuration) {
    var obj;
    if(isObjectType(args[0])) {
      return args;
    } else if (isNumber(args[0]) && !isNumber(args[1])) {
      return [args[0]];
    } else if (isString(args[0]) && allowDuration) {
      return [getDateParamsFromString(args[0]), args[1]];
    }
    obj = {};
    DateArgumentUnits.forEach(function(u,i) {
      obj[u.name] = args[i];
    });
    return [obj];
  }

  function getDateParamsFromString(str, num) {
    var match, num, params = {};
    match = str.match(/^(-?\d+)?\s?(\w+?)s?$/i);
    if(match) {
      if(isUndefined(num)) {
        num = parseInt(match[1]);
        if(isNaN(num)) {
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
    if(isUndefined(to)) to = DateUnitsReversed.length;
    for(i = from || 0; i < to; i++) {
      unit = DateUnitsReversed[i];
      if(fn(unit.name, unit, i) === false) {
        break;
      }
    }
  }

  // Date shifting helpers

  function advanceDate(d, args) {
    var args = collectDateArguments(args, true);
    return updateDate(d, args[0], args[1], 1);
  }

  function setDate(d, args) {
    var args = collectDateArguments(args);
    return updateDate(d, args[0], args[1])
  }

  function resetDate(d, unit) {
    var params = {}, recognized;
    unit = unit || 'hours';
    if(unit === 'date') unit = 'days';
    recognized = DateUnits.some(function(u) {
      return unit === u.name || unit === u.name + 's';
    });
    params[unit] = unit.match(/^days?/) ? 1 : 0;
    return recognized ? setDate(d, [params, true]) : d;
  }

  function setWeekday(d, dow, forward) {
    if(isUndefined(dow)) return;
    // Dates like "the 2nd Tuesday of June" need to be set forward
    // so make sure that the day of the week reflects that here.
    if (forward && dow % 7 < d.getDay()) {
      dow += 7;
    }
    return callDateSet(d, 'Date', callDateGet(d, 'Date') + dow - callDateGet(d, 'Day'));
  }

  function moveToBeginningOfUnit(d, unit) {
    var set = {};
    switch(unit) {
      case 'year':  set['year']    = callDateGet(d, 'FullYear'); break;
      case 'month': set['month']   = callDateGet(d, 'Month');    break;
      case 'day':   set['day']     = callDateGet(d, 'Date');     break;
      case 'week':  set['weekday'] = 0; break;
    }
    return setDate(d, [set, true]);
  }

  function moveToEndOfUnit(d, unit) {
    var set = { 'hours': 23, 'minutes': 59, 'seconds': 59, 'milliseconds': 999 };
    switch(unit) {
      case 'year':  set['month']   = 11; set['day'] = 31; break;
      case 'month': set['day']     = getDaysInMonth(d);  break;
      case 'week':  set['weekday'] = 6;                   break;
    }
    return setDate(d, [set, true]);
  }

  // Date parsing helpers

  function getFormatMatch(match, arr) {
    var obj = {}, value, num;
    arr.forEach(function(key, i) {
      value = match[i + 1];
      if(isUndefined(value) || value === '') return;
      if(key === 'year') {
        obj.yearAsString = value.replace(/'/, '');
      }
      num = parseFloat(value.replace(/'/, '').replace(/,/, '.'));
      obj[key] = !isNaN(num) ? num : value.toLowerCase();
    });
    return obj;
  }

  function cleanDateInput(str) {
    str = str.trim().replace(/^just (?=now)|\.+$/i, '');
    return convertAsianDigits(str);
  }

  function convertAsianDigits(str) {
    return str.replace(AsianDigitReg, function(full, disallowed, match) {
      var sum = 0, place = 1, lastWasHolder, lastHolder;
      if(disallowed) return full;
      match.split('').reverse().forEach(function(letter) {
        var value = AsianDigitMap[letter], holder = value > 9;
        if(holder) {
          if(lastWasHolder) sum += place;
          place *= value / (lastHolder || 1);
          lastHolder = value;
        } else {
          if(lastWasHolder === false) {
            place *= 10;
          }
          sum += place * value;
        }
        lastWasHolder = holder;
      });
      if(lastWasHolder) sum += place;
      return sum;
    });
  }

  function getExtendedDate(contextDate, f, localeCode, prefer, forceUTC) {
    // TODO can we split this up into smaller methods?
    var d, relative, baseLocalization, afterCallbacks, loc, set, unit, unitIndex, weekday, num, tmp, weekdayForward;

    d = getNewDate();
    afterCallbacks = [];

    function afterDateSet(fn) {
      afterCallbacks.push(fn);
    }

    function fireCallbacks() {
      afterCallbacks.forEach(function(fn) {
        fn.call();
      });
    }

    function getWeekdayWithMultiplier(w) {
      var num = set['num'] && !set['unit'] ? set['num'] : 1;
      return (7 * (num - 1)) + w;
    }

    function setWeekdayOfMonth() {
      setWeekday(d, set['weekday'], true);
    }

    function setUnitEdge() {
      var modifier = loc.modifiersByName[set['edge']];
      iterateOverDateUnits(function(name) {
        if(isDefined(set[name])) {
          unit = name;
          return false;
        }
      }, 4);
      if(unit === 'year') {
        set.specificity = 'month';
      } else if(unit === 'month' || unit === 'week') {
        set.specificity = 'day';
      }
      if(modifier.value < 0) {
        moveToEndOfUnit(d, unit);
      } else {
        moveToBeginningOfUnit(d, unit);
      }
      // This value of -2 is arbitrary but it's a nice clean way to hook into this system.
      if(modifier.value === -2) resetDate(d);
    }

    function separateAbsoluteUnits() {
      var params;
      iterateOverDateUnits(function(name, u, i) {
        if(name === 'day') name = 'date';
        if(isDefined(set[name])) {
          // If there is a time unit set that is more specific than
          // the matched unit we have a string like "5:30am in 2 minutes",
          // which is meaningless, so invalidate the date...
          if(i >= unitIndex) {
            invalidateDate(d);
            return false;
          }
          // ...otherwise set the params to set the absolute date
          // as a callback after the relative date has been set.
          params = params || {};
          params[name] = set[name];
          delete set[name];
        }
      });
      if(params) {
        afterDateSet(function() {
          setDate(d, [params, true]);
        });
      }
    }

    setUTC(d, forceUTC);

    if(isDate(f)) {
      // If the source here is already a date object, then the operation
      // is the same as cloning the date, which preserves the UTC flag.
      setUTC(d, isUTC(f)).setTime(f.getTime());
    } else if(isNumber(f) || f === null) {
      d.setTime(f);
    } else if(isObjectType(f)) {
      setDate(d, [f, true]);
      set = f;
    } else if(isString(f)) {

      // The act of getting the localization will pre-initialize
      // if it is missing and add the required formats.
      baseLocalization = getLocalization(localeCode);

      // Clean the input and convert Kanji based numerals if they exist.
      f = cleanDateInput(f);

      if(baseLocalization) {
        iterateOverObject(baseLocalization.getFormats(), function(i, dif) {
          var match = f.match(dif.reg);
          if(match) {

            loc = dif.locale;
            set = getFormatMatch(match, dif.to, loc);
            loc.cachedFormat = dif;

            if(set['utc']) {
              setUTC(d, true);
            }

            if(set.timestamp) {
              set = set.timestamp;
              return false;
            }

            if(dif.variant && !isString(set['month']) && (isString(set['date']) || baseLocalization.hasVariant(localeCode))) {
              // If there's a variant (crazy Endian American format), swap the month and day.
              tmp = set['month'];
              set['month'] = set['date'];
              set['date']  = tmp;
            }

            if(hasAbbreviatedYear(set)) {
              // If the year is 2 digits then get the implied century.
              set['year'] = getYearFromAbbreviation(set['year']);
            }

            if(set['month']) {
              // Set the month which may be localized.
              set['month'] = loc.getMonth(set['month']);
              if(set['shift'] && !set['unit']) set['unit'] = loc['units'][7];
            }

            if(set['weekday'] && set['date']) {
              // If there is both a weekday and a date, the date takes precedence.
              delete set['weekday'];
            } else if(set['weekday']) {
              // Otherwise set a localized weekday.
              set['weekday'] = loc.getWeekday(set['weekday']);
              if(set['shift'] && !set['unit']) {
                set['unit'] = loc['units'][5];
              }
            }

            if(set['day'] && (tmp = loc.modifiersByName[set['day']])) {
              // Relative day localizations such as "today" and "tomorrow".
              set['day'] = tmp.value;
              resetDate(d);
              relative = true;
            } else if(set['day'] && (weekday = loc.getWeekday(set['day'])) > -1) {
              // If the day is a weekday, then set that instead.
              delete set['day'];
              set['weekday'] = getWeekdayWithMultiplier(weekday);
              if(set['num'] && set['month']) {
                // If we have "the 2nd Tuesday of June", then pass the "weekdayForward" flag
                // along to updateDate so that the date does not accidentally traverse into
                // the previous month. This needs to be independent of the "prefer" flag because
                // we are only ensuring that the weekday is in the future, not the entire date.
                weekdayForward = true;
              }
            }

            if(set['date'] && !isNumber(set['date'])) {
              set['date'] = loc.getNumericDate(set['date']);
            }

            if(loc.matchPM(set['ampm']) && set['hour'] < 12) {
              // If the time is 1pm-11pm advance the time by 12 hours.
              set['hour'] += 12;
            } else if(loc.matchAM(set['ampm']) && set['hour'] === 12) {
              // If it is 12:00am then set the hour to 0.
              set['hour'] = 0;
            }

            if('offset_hours' in set || 'offset_minutes' in set) {
              // Adjust for timezone offset
              setUTC(d, true);
              set['offset_minutes'] = set['offset_minutes'] || 0;
              set['offset_minutes'] += set['offset_hours'] * 60;
              if(set['offset_sign'] === '-') {
                set['offset_minutes'] *= -1;
              }
              set['minute'] -= set['offset_minutes'];
            }

            if(set['unit']) {
              // Date has a unit like "days", "months", etc. are all relative to the current date.
              relative  = true;
              num       = loc.getNumber(set['num']);
              unitIndex = loc.getUnitIndex(set['unit']);
              unit      = English['units'][unitIndex];

              // Formats like "the 15th of last month" or "6:30pm of next week"
              // contain absolute units in addition to relative ones, so separate
              // them here, remove them from the params, and set up a callback to
              // set them after the relative ones have been set.
              separateAbsoluteUnits();

              if(set['shift']) {
                // Shift and unit, ie "next month", "last week", etc.
                num *= (tmp = loc.modifiersByName[set['shift']]) ? tmp.value : 0;
              }

              if(set['sign'] && (tmp = loc.modifiersByName[set['sign']])) {
                // Unit and sign, ie "months ago", "weeks from now", etc.
                num *= tmp.value;
              }

              if(isDefined(set['weekday'])) {
                // Units can be with non-relative dates, set here. ie "the day after monday"
                setDate(d, [{'weekday': set['weekday'] }, true]);
                delete set['weekday'];
              }

              // Finally shift the unit.
              set[unit] = (set[unit] || 0) + num;
            }

            if(set['edge']) {
              // If there is an "edge" it needs to be set after the
              // other fields are set. ie "the end of February"
              afterDateSet(setUnitEdge);
            }

            if(set['year_sign'] === '-') {
              set['year'] *= -1;
            }

            iterateOverDateUnits(function(name, unit, i) {
              var value = set[name], fraction = value % 1;
              if(fraction) {
                set[DateUnitsReversed[i - 1].name] = round(fraction * (name === 'second' ? 1000 : 60));
                set[name] = floor(value);
              }
            }, 1, 4);
            return false;
          }
        });
      }
      if(!set) {
        // The Date constructor does something tricky like checking the number
        // of arguments so simply passing in undefined won't work.
        if(!/^now$/i.test(f)) {
          d = new date(f);
        }
        if(forceUTC) {
          // Falling back to system date here which cannot be parsed as UTC,
          // so if we're forcing UTC then simply add the offset.
          d.addMinutes(-d.getTimezoneOffset());
        }
      } else if(relative) {
        if (contextDate) {
          // If this is a relative date and is being created via an instance
          // method (usually "[unit]FromNow", etc), then use the original date
          // (that the instance method was called on) as the starting point
          // rather than the freshly created date above to avoid subtle
          // discrepancies due to the fact that the fresh date was created
          // slightly later.
          d = cloneDate(contextDate);
        }
        advanceDate(d, [set]);
      } else {
        if(d._utc) {
          // UTC times can traverse into other days or even months,
          // so preemtively reset the time here to prevent this.
          resetDate(d);
        }
        updateDate(d, set, true, false, prefer, weekdayForward);
      }
      fireCallbacks();
      // A date created by parsing a string presumes that the format *itself* is UTC, but
      // not that the date, once created, should be manipulated as such. In other words,
      // if you are creating a date object from a server time "2012-11-15T12:00:00Z",
      // in the majority of cases you are using it to create a date that will, after creation,
      // be manipulated as local, so reset the utc flag here.
      setUTC(d, false);
    }
    return {
      date: d,
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
    var hours = callDateGet(d, 'Hours');
    return hours === 0 ? 12 : hours - (floor(hours / 13) * 12);
  }

  // weeksSince won't work here as the result needs to be floored, not rounded.
  function getWeekNumber(date) {
    date = cloneDate(date);
    var dow = callDateGet(date, 'Day') || 7;
    resetDate(advanceDate(date, [(4 - dow) + ' days']));
    return 1 + floor(sugarDate.daysSince(date, moveToBeginningOfUnit(cloneDate(date), 'year')) / 7);
  }

  function setWeekNumber(date, num) {
    var weekday = callDateGet(date, 'Day') || 7;
    if(isUndefined(num)) return;
    setDate(date, [{ 'month': 0, 'date': 4 }]);
    setDate(date, [{ 'weekday': 1 }]);
    if(num > 1) {
      advanceDate(date, [{ 'weeks': num - 1 }]);
    }
    if(weekday !== 1) {
      advanceDate(date, [{ 'days': weekday - 1 }]);
    }
    return date.getTime();
  }

  function getDaysInMonth(d) {
    return 32 - callDateGet(new date(callDateGet(d, 'FullYear'), callDateGet(d, 'Month'), 32), 'Date');
  }

  // Gets an "adjusted date unit" which is a way of representing
  // the largest possible meaningful unit. In other words, if passed
  // 3600000, this will return an array which represents "1 hour".
  function getAdjustedUnit(ms, fn) {
    var unitIndex = 0, value = 0;
    iterateOverObject(DateUnits, function(i, unit) {
      value = abs(fn(unit));
      if(value >= 1) {
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
      return floor(withPrecision(ms / unit.multiplier, 1));
    });
  }

  // Gets the adjusted unit using the [unit]FromNow methods,
  // which use internal date methods that neatly avoid vaguely
  // defined units of time (days in month, leap years, etc).
  function getAdjustedUnitForDate(d) {
    var ms = sugarDate.millisecondsFromNow(d);
    if (d.getTime() > date.now()) {

      // This adjustment is solely to allow
      // Date.create('1 year from now').relative() to remain
      // "1 year from now" instead of "11 months from now",
      // as it would be due to the fact that the internal
      // "now" date in "relative" is created slightly after
      // that in "create".
      d = new date(d.getTime() + 10);
    }
    return getAdjustedUnit(ms, function(unit) {
      return abs(sugarDate[unit.name + 'sFromNow'](d));
    });
  }

  // Date format token helpers

  function createMeridianTokens(slice, caps) {
    var fn = function(d, localeCode) {
      var hours = callDateGet(d, 'Hours');
      return getLocalization(localeCode).get('ampm')[floor(hours / 12)] || '';
    }
    createFormatToken('t', fn, 1);
    createFormatToken('tt', fn);
    createFormatToken('T', fn, 1, 1);
    createFormatToken('TT', fn, null, 2);
  }

  function createWeekdayTokens(slice, caps) {
    var fn = function(d, localeCode) {
      var dow = callDateGet(d, 'Day');
      return getLocalization(localeCode)['weekdays'][dow];
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
      var month = callDateGet(d, 'Month');
      return getLocalization(localeCode)['months'][month + (multiplier * 12)];
    };
    createFormatToken(token, fn, slice);
    createFormatToken(simpleCapitalize(token), fn, slice, 1);
  }

  function createFormatToken(t, fn, slice, caps) {
    DateFormatTokens[t] = function(d, localeCode) {
      var str = fn(d, localeCode);
      if(slice) str = str.slice(0, slice);
      if(caps)  str = str.slice(0, caps).toUpperCase() + str.slice(caps);
      return str;
    }
  }

  function createPaddedToken(t, fn, ms) {
    DateFormatTokens[t] = fn;
    DateFormatTokens[t + t] = function (d, localeCode) {
      return padNumber(fn(d, localeCode), 2);
    };
    if(ms) {
      DateFormatTokens[t + t + t] = function (d, localeCode) {
        return padNumber(fn(d, localeCode), 3);
      };
      DateFormatTokens[t + t + t + t] = function (d, localeCode) {
        return padNumber(fn(d, localeCode), 4);
      };
    }
  }


  // Date formatting helpers

  function buildCompiledOutputFormat(format) {
    var match = format.match(/(\{\w+\})|[^{}]+/g);
    CompiledOutputFormats[format] = match.map(function(p) {
      p.replace(/\{(\w+)\}/, function(full, token) {
        p = DateFormatTokens[token] || token;
        return token;
      });
      return p;
    });
  }

  function executeCompiledOutputFormat(date, format, localeCode) {
    var compiledFormat, length, i, t, result = '';
    compiledFormat = CompiledOutputFormats[format];
    for(i = 0, length = compiledFormat.length; i < length; i++) {
      t = compiledFormat[i];
      result += isFunction(t) ? t(date, localeCode) : t;
    }
    return result;
  }

  function formatDate(date, format, relative, localeCode) {
    var adu;
    if(!isValid(date)) {
      return 'Invalid Date';
    } else if(isString(sugarDate[format])) {
      format = sugarDate[format];
    } else if(isFunction(format)) {
      adu = getAdjustedUnitForDate(date);
      format = format.apply(date, adu.concat(getLocalization(localeCode)));
    }
    if(!format && relative) {
      adu = adu || getAdjustedUnitForDate(date);
      // Adjust up if time is in ms, as this doesn't
      // look very good for a standard relative date.
      if(adu[1] === 0) {
        adu[1] = 1;
        adu[0] = 1;
      }
      return getLocalization(localeCode).getRelativeFormat(adu);
    }
    format = format || 'long';
    if(format === 'short' || format === 'long' || format === 'full') {
      format = getLocalization(localeCode)[format];
    }

    if(!CompiledOutputFormats[format]) {
      buildCompiledOutputFormat(format);
    }

    return executeCompiledOutputFormat(date, format, localeCode);
  }

  // Date comparison helpers

  function fullCompareDate(d, f, margin, utc) {
    var tmp, comp;
    if(!isValid(d)) return;
    if(isString(f)) {
      f = f.trim().toLowerCase();
      comp = setUTC(cloneDate(d), utc);
      switch(true) {
        case f === 'future':  return d.getTime() > getNewDate().getTime();
        case f === 'past':    return d.getTime() < getNewDate().getTime();
        case f === 'weekday': return callDateGet(comp, 'Day') > 0 && callDateGet(comp, 'Day') < 6;
        case f === 'weekend': return callDateGet(comp, 'Day') === 0 || callDateGet(comp, 'Day') === 6;
        case (tmp = English['weekdays'].indexOf(f) % 7) > -1: return callDateGet(comp, 'Day') === tmp;
        case (tmp = English['months'].indexOf(f) % 12) > -1:  return callDateGet(comp, 'Month') === tmp;
      }
    }
    return compareDate(d, f, null, margin, utc);
  }

  function compareDate(d, find, localeCode, buffer, forceUTC) {
    var p, t, min, max, override, accuracy = 0, loBuffer = 0, hiBuffer = 0;
    p = getExtendedDate(null, find, localeCode, null, forceUTC);
    if(buffer > 0) {
      loBuffer = hiBuffer = buffer;
      override = true;
    }
    if(!isValid(p.date)) return false;
    if(p.set && p.set.specificity) {
      if(p.set['edge'] || p.set['shift']) {
        moveToBeginningOfUnit(p.date, p.set.specificity);
      }
      if(p.set.specificity === 'month') {
        max = moveToEndOfUnit(cloneDate(p.date), p.set.specificity).getTime();
      } else {
        max = advanceDate(cloneDate(p.date), ['1 ' + p.set.specificity]).getTime() - 1;
      }
      if(!override && p.set['sign'] && p.set.specificity !== 'millisecond') {
        // If the time is relative, there can occasionally be an disparity between the relative date
        // and "now", which it is being compared to, so set an extra buffer to account for this.
        loBuffer = 50;
        hiBuffer = -50;
      }
    }
    t   = d.getTime();
    min = p.date.getTime();
    max = max || (min + accuracy);
    max = compensateForTimezoneTraversal(d, min, max);
    return t >= (min - loBuffer) && t <= (max + hiBuffer);
  }

  function compensateForTimezoneTraversal(d, min, max) {
    var dMin, dMax, minOffset, maxOffset;
    dMin = new date(min);
    dMax = setUTC(new date(max), isUTC(d));
    if(callDateGet(dMax, 'Hours') !== 23) {
      minOffset = dMin.getTimezoneOffset();
      maxOffset = dMax.getTimezoneOffset();
      if(minOffset !== maxOffset) {
        max += (maxOffset - minOffset).minutes();
      }
    }
    return max;
  }

  function updateDate(d, params, reset, advance, prefer, weekdayForward) {
    var specificityIndex;

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

    if(isNumber(params) && advance) {
      // If param is a number and we're advancing, the number is presumed to be milliseconds.
      params = { 'milliseconds': params };
    } else if(isNumber(params)) {
      // Otherwise just set the timestamp and return.
      d.setTime(params);
      return d;
    }

    // "date" can also be passed for the day
    if(isDefined(params['date'])) {
      params['day'] = params['date'];
    }

    // Reset any unit lower than the least specific unit set. Do not do this for weeks
    // or for years. This needs to be performed before the acutal setting of the date
    // because the order needs to be reversed in order to get the lowest specificity,
    // also because higher order units can be overwritten by lower order units, such
    // as setting hour: 3, minute: 345, etc.
    iterateOverDateUnits(function(name, unit, i) {
      var isDay = name === 'day';
      if(uniqueParamExists(name, isDay)) {
        params.specificity = name;
        specificityIndex = +i;
        return false;
      } else if(reset && name !== 'week' && (!isDay || !paramExists('week'))) {
        // Days are relative to months, not weeks, so don't reset if a week exists.
        callDateSet(d, unit.method, (isDay ? 1 : 0));
      }
    });

    // Now actually set or advance the date in order, higher units first.
    DateUnits.forEach(function(u, i) {
      var name = u.name, method = u.method, higherUnit = DateUnits[i - 1], value;
      value = getParam(name)
      if(isUndefined(value)) return;
      if(advance) {
        if(name === 'week') {
          value *= 7;
          method = 'Date';
        }
        value = (value * advance) + callDateGet(d, method);
      } else if(name === 'month' && paramExists('day')) {
        // When setting the month, there is a chance that we will traverse into a new month.
        // This happens in DST shifts, for example June 1st DST jumping to January 1st
        // (non-DST) will have a shift of -1:00 which will traverse into the previous year.
        // Prevent this by proactively setting the day when we know it will be set again anyway.
        // It can also happen when there are not enough days in the target month. This second
        // situation is identical to checkMonthTraversal below, however when we are advancing
        // we want to reset the date to "the last date in the target month". In the case of
        // DST shifts, however, we want to avoid the "edges" of months as that is where this
        // unintended traversal can happen. This is the reason for the different handling of
        // two similar but slightly different situations.
        //
        // TL;DR This method avoids the edges of a month IF not advancing and the date is going
        // to be set anyway, while checkMonthTraversal resets the date to the last day if advancing.
        //
        callDateSet(d, 'Date', 15);
      }
      callDateSetWithWeek(d, method, value);
      if(advance && name === 'month') {
        checkMonthTraversal(d, value);
      }
    });

    // If a weekday is included in the params and no 'date' parameter
    // is overriding, set it here after all other units have been set.
    // Note that the date has to be perfectly set before disambiguation
    // so that a proper comparison can be made.
    if(!advance && !paramExists('day') && paramExists('weekday')) {
      setWeekday(d, getParam('weekday'), weekdayForward);
    }

    // If past or future is preferred, then the process of "disambiguation" will ensure that an
    // ambiguous time/date ("4pm", "thursday", "June", etc.) will be in the past or future.
    if(canDisambiguate()) {
      iterateOverDateUnits(function(name, u) {
        var ambiguous = u.ambiguous || (name === 'week' && paramExists('weekday'));
        if(ambiguous && !uniqueParamExists(name, name === 'day')) {
          sugarDate[u.addMethod](d, prefer);
          return false;
        } else if(name === 'year' && hasAbbreviatedYear(params)) {
          advanceDate(d, [{'years': 100 * prefer}]);
        }
      }, specificityIndex + 1);
    }
    return d;
  }

  // The ISO format allows times strung together without a demarcating ":", so make sure
  // that these markers are now optional.
  function prepareTime(format, loc, iso) {
    var timeSuffixMapping = {'h':0,'m':1,'s':2}, add;
    loc = loc || English;
    return format.replace(/{([a-z])}/g, function(full, token) {
      var separators = [],
          isHours = token === 'h',
          tokenIsRequired = isHours && !iso;
      if(token === 't') {
        return loc.get('ampm').join('|');
      } else {
        if(isHours) {
          separators.push(':');
        }
        if(add = loc['timeSuffixes'][timeSuffixMapping[token]]) {
          separators.push(add + '\\s*');
        }
        return separators.length === 0 ? '' : '(?:' + separators.join('|') + ')' + (tokenIsRequired ? '' : '?');
      }
    });
  }

  // If the month is being set, then we don't want to accidentally
  // traverse into a new month just because the target month doesn't have enough
  // days. In other words, "5 months ago" from July 30th is still February, even
  // though there is no February 30th, so it will of necessity be February 28th
  // (or 29th in the case of a leap year).
  function checkMonthTraversal(date, targetMonth) {
    if(targetMonth < 0) {
      targetMonth = targetMonth % 12 + 12;
    }
    if(targetMonth % 12 !== callDateGet(date, 'Month')) {
      callDateSet(date, 'Date', 0);
    }
  }

  function createDateFromArgs(contextDate, args, prefer, forceUTC) {
    var f, localeCode;
    if(isNumber(args[1])) {
      // If the second argument is a number, then we have an
      // enumerated constructor type as in "new Date(2003, 2, 12);"
      f = collectDateArguments(args)[0];
    } else {
      f = args[0];
      localeCode = args[1];
    }
    return createDate(contextDate, f, localeCode, prefer, forceUTC);
  }

  function createDate(contextDate, f, localeCode, prefer, forceUTC) {
    return getExtendedDate(contextDate, f, localeCode, prefer, forceUTC).date;
  }

  function invalidateDate(d) {
    d.setTime(NaN);
  }

  function buildDateUnits() {
    DateUnitsReversed = DateUnits.concat().reverse();
    DateArgumentUnits = DateUnits.concat();
    DateArgumentUnits.splice(2,1);
  }


  /***
   * @method [units]Since([d], [locale] = currentLocale)
   * @returns Number
   * @short Returns the time since [d] in the appropriate unit.
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. [locale] can be passed to specify the locale that the date is in. %[unit]Ago% is provided as an alias to make this more readable when [d] is assumed to be the current date. For more see @date_format.
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
   * @method [units]Until([d], [locale] = currentLocale)
   * @returns Number
   * @short Returns the time until [d] in the appropriate unit.
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. [locale] can be passed to specify the locale that the date is in. %[unit]FromNow% is provided as an alias to make this more readable when [d] is assumed to be the current date. For more see @date_format.
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

  function buildDateMethods() {
    extendSimilar(date, DateUnits, function(methods, u, i) {
      var name = u.name, caps = simpleCapitalize(name), since, until;
      u.addMethod = 'add' + caps + 's';

      function add(num, reset) {
        var set = {};
        set[name] = num;
        return advanceDate(this, [set, reset]);
      }

      function timeDistanceNumeric(d1, d2) {
        var n = (d1.getTime() - d2.getTime()) / u.multiplier;
        return n < 0 ? ceil(n) : floor(n);
      }

      function addUnit(d, n, dsc) {
        var d2;
        add.call(d, n);
        // "dsc" = "date shift compensation"
        // This number should only be passed when traversing months to
        // compensate for date shifting. For example, calling "1 month ago"
        // on March 30th will result in February 28th, as there are not enough
        // days. This is not an issue when creating new dates, as "2 months ago"
        // gives an exact target to set, and the date shift is expected. However,
        // when counting months using unit traversal, the date needs to stay the
        // same if possible. To compensate for this, we need to try to reset the
        // date after every iteration, and use the result if possible.
        if (dsc && callDateGet(d, 'Date') !== dsc) {
          d2 = cloneDate(d);
          callDateSet(d2, 'Date', dsc);
          if (callDateGet(d2, 'Date') === dsc) {
            return d2;
          }
        }
        return d;
      }

      function timeDistanceTraversal(d1, d2) {
        var d, inc, n, dsc, count = 0;
        d = cloneDate(d1);
        inc = d1 < d2;
        n = inc ? 1 : -1
        dsc = name === 'month' && callDateGet(d, 'Date');
        d = addUnit(d, n, dsc);
        while (inc ? d <= d2 : d >= d2) {
          count += -n;
          d = addUnit(d, n, dsc);
        }
        return count;
      }

      function compareSince(fn, d, args) {
        return fn(d, createDateFromArgs(d, args, 0, false));
      }

      function compareUntil(fn, d, args) {
        return fn(createDateFromArgs(d, args, 0, false), d);
      }

      if(i < 3) {
        ['Last','This','Next'].forEach(function(shift) {
          methods['is' + shift + caps] = function() {
            return compareDate(this, shift + ' ' + name, 'en');
          };
        });
      }
      if(i < 4) {
        methods['beginningOf' + caps] = function() {
          return moveToBeginningOfUnit(this, name);
        };
        methods['endOf' + caps] = function() {
          return moveToEndOfUnit(this, name);
        };
        since = function() {
          return compareSince(timeDistanceTraversal, this, arguments);
        };
        until = function() {
          return compareUntil(timeDistanceTraversal, this, arguments);
        };
      } else {
        since = function() {
          return compareSince(timeDistanceNumeric, this, arguments);
        };
        until = function() {
          return compareUntil(timeDistanceNumeric, this, arguments);
        };
      }
      methods[name + 'sAgo']     = until;
      methods[name + 'sUntil']   = until;
      methods[name + 'sSince']   = since;
      methods[name + 'sFromNow'] = since;

      methods[u.addMethod] = add;
      buildNumberToDateAlias(u, u.multiplier);
    });
  }

  function buildCoreInputFormats() {
    English.addFormat('([+-])?(\\d{4,4})[-.\\/]?{full_month}[-.]?(\\d{1,2})?', true, ['year_sign','year','month','date'], false, true);
    English.addFormat('(\\d{1,2})[-.\\/]{full_month}(?:[-.\\/](\\d{2,4}))?', true, ['date','month','year'], true);
    English.addFormat('{full_month}[-.](\\d{4,4})', false, ['month','year']);
    English.addFormat('\\/Date\\((\\d+(?:[+-]\\d{4,4})?)\\)\\/', false, ['timestamp'])
    English.addFormat(prepareTime(RequiredTime, English), false, TimeFormat)

    // When a new locale is initialized it will have the CoreDateFormats initialized by default.
    // From there, adding new formats will push them in front of the previous ones, so the core
    // formats will be the last to be reached. However, the core formats themselves have English
    // months in them, which means that English needs to first be initialized and creates a race
    // condition. I'm getting around this here by adding these generalized formats in the order
    // specific -> general, which will mean they will be added to the English localization in
    // general -> specific order, then chopping them off the front and reversing to get the correct
    // order. Note that there are 7 formats as 2 have times which adds a front and a back format.
    CoreDateFormats = English.compiledFormats.slice(0,7).reverse();
    English.compiledFormats = English.compiledFormats.slice(7).concat(CoreDateFormats);
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
      return callDateGet(d, 'Hours') % 12 || 12;
    });

    createPaddedToken('H', function(d) {
      return callDateGet(d, 'Hours');
    });

    createPaddedToken('d', function(d) {
      return callDateGet(d, 'Date');
    });

    createPaddedToken('M', function(d) {
      return callDateGet(d, 'Month') + 1;
    });

    createMeridianTokens();
    createWeekdayTokens();
    createMonthTokens();

    // Aliases
    DateFormatTokens['ms']           = DateFormatTokens['f'];
    DateFormatTokens['milliseconds'] = DateFormatTokens['f'];
    DateFormatTokens['seconds']      = DateFormatTokens['s'];
    DateFormatTokens['minutes']      = DateFormatTokens['m'];
    DateFormatTokens['hours']        = DateFormatTokens['h'];
    DateFormatTokens['24hr']         = DateFormatTokens['H'];
    DateFormatTokens['12hr']         = DateFormatTokens['h'];
    DateFormatTokens['date']         = DateFormatTokens['d'];
    DateFormatTokens['day']          = DateFormatTokens['d'];
    DateFormatTokens['year']         = DateFormatTokens['yyyy'];

  }

  function buildFormatShortcuts() {
    extendSimilar(date, 'short,long,full', function(methods, name) {
      methods[name] = function(localeCode) {
        return formatDate(this, name, false, localeCode);
      }
    });
  }

  function buildAsianDigits() {
    KanjiDigits.split('').forEach(function(digit, value) {
      var holder;
      if(value > 9) {
        value = pow(10, value - 9);
      }
      AsianDigitMap[digit] = value;
    });
    simpleMerge(AsianDigitMap, NumberNormalizeMap);
    // Kanji numerals may also be included in phrases which are text-based rather
    // than actual numbers such as Chinese weekdays (上周三), and "the day before
    // yesterday" (一昨日) in Japanese, so don't match these.
    AsianDigitReg = regexp('([期週周])?([' + KanjiDigits + FullWidthDigits + ']+)(?!昨)', 'g');
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
    var special  = 'today,yesterday,tomorrow,weekday,weekend,future,past'.split(',');
    var weekdays = English['weekdays'].slice(0,7);
    var months   = English['months'].slice(0,12);
    extendSimilar(date, special.concat(weekdays).concat(months), function(methods, name) {
      methods['is'+ simpleCapitalize(name)] = function(utc) {
        return fullCompareDate(this, name, 0, utc);
      };
    });
  }

  function buildUTCAliases() {
    extend(date, {
      'utc': {
        'create': function() {
          return createDateFromArgs(null, arguments, 0, true);
        },

        'past': function() {
          return createDateFromArgs(null, arguments, -1, true);
        },

        'future': function() {
          return createDateFromArgs(null, arguments, 1, true);
        }
      }
    }, false);
  }

  function setDateProperties() {
    extend(date, {
      'RFC1123': '{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {tz}',
      'RFC1036': '{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {tz}',
      'ISO8601_DATE': '{yyyy}-{MM}-{dd}',
      'ISO8601_DATETIME': '{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{fff}{isotz}'
    }, false);
  }


  extend(date, {

     /***
     * @method Date.create(<d>, [locale] = currentLocale)
     * @returns Date
     * @short Alternate Date constructor which understands many different text formats, a timestamp, or another date.
     * @extra If no argument is given, date is assumed to be now. %Date.create% additionally can accept enumerated parameters as with the standard date constructor. [locale] can be passed to specify the locale that the date is in. When unspecified, the current locale (default is English) is assumed. UTC-based dates can be created through the %utc% object. For more see @date_format.
     * @set
     *   Date.utc.create
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
     *   Date.utc.create('July 4, 1776', 'en')  -> July 4, 1776
     *
     ***/
    'create': function() {
      return createDateFromArgs(null, arguments);
    },

     /***
     * @method Date.past(<d>, [locale] = currentLocale)
     * @returns Date
     * @short Alternate form of %Date.create% with any ambiguity assumed to be the past.
     * @extra For example %"Sunday"% can be either "the Sunday coming up" or "the Sunday last" depending on context. Note that dates explicitly in the future ("next Sunday") will remain in the future. This method simply provides a hint when ambiguity exists. UTC-based dates can be created through the %utc% object. For more, see @date_format.
     * @set
     *   Date.utc.past
     *
     * @example
     *
     *   Date.past('July')          -> July of this year or last depending on the current month
     *   Date.past('Wednesday')     -> This wednesday or last depending on the current weekday
     *
     ***/
    'past': function() {
      return createDateFromArgs(null, arguments, -1);
    },

     /***
     * @method Date.future(<d>, [locale] = currentLocale)
     * @returns Date
     * @short Alternate form of %Date.create% with any ambiguity assumed to be the future.
     * @extra For example %"Sunday"% can be either "the Sunday coming up" or "the Sunday last" depending on context. Note that dates explicitly in the past ("last Sunday") will remain in the past. This method simply provides a hint when ambiguity exists. UTC-based dates can be created through the %utc% object. For more, see @date_format.
     * @set
     *   Date.utc.future
     *
     * @example
     *
     *   Date.future('July')          -> July of this year or next depending on the current month
     *   Date.future('Wednesday')     -> This wednesday or next depending on the current weekday
     *
     ***/
    'future': function() {
      return createDateFromArgs(null, arguments, 1);
    },

     /***
     * @method Date.addLocale(<code>, <set>)
     * @returns Locale
     * @short Adds a locale <set> to the locales understood by Sugar.
     * @extra For more see @date_format.
     *
     ***/
    'addLocale': function(localeCode, set) {
      return setLocalization(localeCode, set);
    },

     /***
     * @method Date.setLocale(<code>)
     * @returns Locale
     * @short Sets the current locale to be used with dates.
     * @extra Sugar has support for 13 locales that are available through the "Date Locales" package. In addition you can define a new locale with %Date.addLocale%. For more see @date_format.
     *
     ***/
    'setLocale': function(localeCode, set) {
      var loc = getLocalization(localeCode, false);
      CurrentLocalization = loc;
      // The code is allowed to be more specific than the codes which are required:
      // i.e. zh-CN or en-US. Currently this only affects US date variants such as 8/10/2000.
      if(localeCode && localeCode !== loc['code']) {
        loc['code'] = localeCode;
      }
      return loc;
    },

     /***
     * @method Date.getLocale([code] = current)
     * @returns Locale
     * @short Gets the locale for the given code, or the current locale.
     * @extra The resulting locale object can be manipulated to provide more control over date localizations. For more about locales, see @date_format.
     *
     ***/
    'getLocale': function(localeCode) {
      return !localeCode ? CurrentLocalization : getLocalization(localeCode, false);
    },

     /**
     * @method Date.addFormat(<format>, <match>, [code] = null)
     * @returns Nothing
     * @short Manually adds a new date input format.
     * @extra This method allows fine grained control for alternate formats. <format> is a string that can have regex tokens inside. <match> is an array of the tokens that each regex capturing group will map to, for example %year%, %date%, etc. For more, see @date_format.
     *
     **/
    'addFormat': function(format, match, localeCode) {
      addDateInputFormat(getLocalization(localeCode), format, match);
    }

  }, false);

  extend(date, {

     /***
     * @method set(<set>, [reset] = false)
     * @returns Date
     * @short Sets the date object.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). If [reset] is %true%, any units more specific than those passed will be reset.
     *
     * @example
     *
     *   new Date().set({ year: 2011, month: 11, day: 31 }) -> December 31, 2011
     *   new Date().set(2011, 11, 31)                       -> December 31, 2011
     *   new Date().set(86400000)                           -> 1 day after Jan 1, 1970
     *   new Date().set({ year: 2004, month: 6 }, true)     -> June 1, 2004, 00:00:00.000
     *
     ***/
    'set': function() {
      return setDate(this, arguments);
    },

     /***
     * @method setWeekday()
     * @returns Nothing
     * @short Sets the weekday of the date.
     * @extra In order to maintain a parallel with %getWeekday% (which itself is an alias for Javascript native %getDay%), Sunday is considered day %0%. This contrasts with ISO-8601 standard (used in %getISOWeek% and %setISOWeek%) which places Sunday at the end of the week (day 7). This effectively means that passing %0% to this method while in the middle of a week will rewind the date, where passing %7% will advance it.
     *
     * @example
     *
     *   d = new Date(); d.setWeekday(1); d; -> Monday of this week
     *   d = new Date(); d.setWeekday(6); d; -> Saturday of this week
     *
     ***/
    'setWeekday': function(dow) {
      return setWeekday(this, dow);
    },

     /***
     * @method setISOWeek(<num>)
     * @returns Nothing
     * @short Sets the week (of the year) as defined by the ISO-8601 standard.
     * @extra Note that this standard places Sunday at the end of the week (day 7).
     *
     * @example
     *
     *   d = new Date(); d.setISOWeek(15); d; -> 15th week of the year
     *
     ***/
    'setISOWeek': function(num) {
      return setWeekNumber(this, num);
    },

     /***
     * @method getISOWeek()
     * @returns Number
     * @short Gets the date's week (of the year) as defined by the ISO-8601 standard.
     * @extra Note that this standard places Sunday at the end of the week (day 7). If %utc% is set on the date, the week will be according to UTC time.
     *
     * @example
     *
     *   new Date().getISOWeek()    -> today's week of the year
     *
     ***/
    'getISOWeek': function() {
      return getWeekNumber(this);
    },

     /***
     * @method beginningOfISOWeek()
     * @returns Date
     * @short Set the date to the beginning of week as defined by this ISO-8601 standard.
     * @extra Note that this standard places Monday at the start of the week.
     * @example
     *
     *   Date.create().beginningOfISOWeek() -> Monday
     *
     ***/
    'beginningOfISOWeek': function() {
      var day = this.getDay();
      if(day === 0) {
        day = -6;
      } else if(day !== 1) {
        day = 1;
      }
      setWeekday(this, day);
      return resetDate(this);
    },

     /***
     * @method endOfISOWeek()
     * @returns Date
     * @short Set the date to the end of week as defined by this ISO-8601 standard.
     * @extra Note that this standard places Sunday at the end of the week.
     * @example
     *
     *   Date.create().endOfISOWeek() -> Sunday
     *
     ***/
    'endOfISOWeek': function() {
      if(this.getDay() !== 0) {
        setWeekday(this, 7);
      }
      return moveToEndOfUnit(this, 'day');
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
    'getUTCOffset': function(iso) {
      return getUTCOffset(this, iso);
    },

     /***
     * @method setUTC([on] = false)
     * @returns Date
     * @short Sets the internal utc flag for the date. When on, UTC-based methods will be called internally.
     * @extra For more see @date_format.
     * @example
     *
     *   new Date().setUTC(true)
     *   new Date().setUTC(false)
     *
     ***/
    'setUTC': function(set) {
      return setUTC(this, set);
    },

     /***
     * @method isUTC()
     * @returns Boolean
     * @short Returns true if the date has no timezone offset.
     * @extra This will also return true for utc-based dates (dates that have the %utc% method set true). Note that even if the utc flag is set, %getTimezoneOffset% will always report the same thing as Javascript always reports that based on the environment's locale.
     * @example
     *
     *   new Date().isUTC()           -> true or false?
     *   new Date().utc(true).isUTC() -> true
     *
     ***/
    'isUTC': function() {
      return isUTC(this);
    },

     /***
     * @method advance(<set>, [reset] = false)
     * @returns Date
     * @short Sets the date forward.
     * @extra This method can accept multiple formats including an object, a string in the format %3 days%, a single number as milliseconds, or enumerated parameters (as with the Date constructor). If [reset] is %true%, any units more specific than those passed will be reset. For more see @date_format.
     * @example
     *
     *   new Date().advance({ year: 2 }) -> 2 years in the future
     *   new Date().advance('2 days')    -> 2 days in the future
     *   new Date().advance(0, 2, 3)     -> 2 months 3 days in the future
     *   new Date().advance(86400000)    -> 1 day in the future
     *
     ***/
    'advance': function() {
      return advanceDate(this, arguments);
    },

     /***
     * @method rewind(<set>, [reset] = false)
     * @returns Date
     * @short Sets the date back.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). If [reset] is %true%, any units more specific than those passed will be reset. For more see @date_format.
     * @example
     *
     *   new Date().rewind({ year: 2 }) -> 2 years in the past
     *   new Date().rewind(0, 2, 3)     -> 2 months 3 days in the past
     *   new Date().rewind(86400000)    -> 1 day in the past
     *
     ***/
    'rewind': function() {
      var args = collectDateArguments(arguments, true);
      return updateDate(this, args[0], args[1], -1);
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
    'isValid': function() {
      return isValid(this);
    },

     /***
     * @method isAfter(<d>, [margin] = 0)
     * @returns Boolean
     * @short Returns true if the date is after the <d>.
     * @extra [margin] is to allow extra margin of error (in ms). <d> will accept a date object, timestamp, or text format. If not specified, <d> is assumed to be now. See @date_format for more.
     * @example
     *
     *   new Date().isAfter('tomorrow')  -> false
     *   new Date().isAfter('yesterday') -> true
     *
     ***/
    'isAfter': function(d, margin, utc) {
      return this.getTime() > createDate(null, d).getTime() - (margin || 0);
    },

     /***
     * @method isBefore(<d>, [margin] = 0)
     * @returns Boolean
     * @short Returns true if the date is before <d>.
     * @extra [margin] is to allow extra margin of error (in ms). <d> will accept a date object, timestamp, or text format. If not specified, <d> is assumed to be now. See @date_format for more.
     * @example
     *
     *   new Date().isBefore('tomorrow')  -> true
     *   new Date().isBefore('yesterday') -> false
     *
     ***/
    'isBefore': function(d, margin) {
      return this.getTime() < createDate(null, d).getTime() + (margin || 0);
    },

     /***
     * @method isBetween(<d1>, <d2>, [margin] = 0)
     * @returns Boolean
     * @short Returns true if the date falls between <d1> and <d2>.
     * @extra [margin] is to allow extra margin of error (in ms). <d1> and <d2> will accept a date object, timestamp, or text format. If not specified, they are assumed to be now. See @date_format for more.
     * @example
     *
     *   new Date().isBetween('yesterday', 'tomorrow')    -> true
     *   new Date().isBetween('last year', '2 years ago') -> false
     *
     ***/
    'isBetween': function(d1, d2, margin) {
      var t  = this.getTime();
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
    'isLeapYear': function() {
      return isLeapYear(this);
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
    'daysInMonth': function() {
      return getDaysInMonth(this);
    },

     /***
     * @method format(<format>, [locale] = currentLocale)
     * @returns String
     * @short Formats and outputs the date.
     * @extra <format> can be a number of pre-determined formats or a string of tokens. Locale-specific formats are %short%, %long%, and %full% which have their own aliases and can be called with %date.short()%, etc. If <format> is not specified the %long% format is assumed. [locale] specifies a locale code to use (if not specified the current locale is used). See @date_format for more details.
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
     *   Date.create('last week').format('short', 'ja')                -> ex. 先週
     *   Date.create('yesterday').format(function(value,unit,ms,loc) {
     *     // value = 1, unit = 3, ms = -86400000, loc = [current locale object]
     *   });                                                      -> ex. 1 day ago
     *
     ***/
    'format': function(f, localeCode) {
      return formatDate(this, f, false, localeCode);
    },

     /***
     * @method relative([fn], [locale] = currentLocale)
     * @returns String
     * @short Returns a relative date string offset to the current time.
     * @extra [fn] can be passed to provide for more granular control over the resulting string. [fn] is passed 4 arguments: the adjusted value, unit, offset in milliseconds, and a localization object. As an alternate syntax, [locale] can also be passed as the first (and only) parameter. For more, see @date_format.
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
    'relative': function(fn, localeCode) {
      if(isString(fn)) {
        localeCode = fn;
        fn = null;
      }
      return formatDate(this, fn, true, localeCode);
    },

     /***
     * @method is(<f>, [margin] = 0, [utc] = false)
     * @returns Boolean
     * @short Returns true if the date is <f>.
     * @extra <f> will accept a date object, timestamp, or text format. %is% additionally understands more generalized expressions like month/weekday names, 'today', etc, and compares to the precision implied in <f>. [margin] allows an extra margin of error in milliseconds. [utc] will treat the compared date as UTC. For more, see @date_format.
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
    'is': function(f, margin, utc) {
      return fullCompareDate(this, f, margin, utc);
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
    'reset': function(unit) {
      return resetDate(this, unit);
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
    'clone': function() {
      return cloneDate(this);
    },

     /***
     * @method iso()
     * @alias toISOString
     *
     ***/
    'iso': function() {
      return this.toISOString();
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
    'getWeekday': function() {
      return this.getDay();
    },

    'getUTCWeekday': function() {
      return this.getUTCDay();
    }

  });


  /***
   * Number module
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
   * @method [unit]Before([d], [locale] = currentLocale)
   * @returns Date
   * @short Returns a date that is <n> units before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Be careful using %monthsBefore% if you need exact precision. See @date_format for more.
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
   * @method [unit]After([d], [locale] = currentLocale)
   * @returns Date
   * @short Returns a date <n> units after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Be careful using %monthsAfter% if you need exact precision. See @date_format for more.
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
  function buildNumberToDateAlias(u, multiplier) {
    var name = u.name, methods = {};
    function base() {
      return round(this * multiplier);
    }
    function after() {
      return sugarDate[u.addMethod](createDateFromArgs(null, arguments), this);
    }
    function before() {
      return sugarDate[u.addMethod](createDateFromArgs(null, arguments), -this);
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
    extend(number, methods);
  }

  extend(number, {

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
    'duration': function(localeCode) {
      return getLocalization(localeCode).getDuration(this);
    }

  });


  English = CurrentLocalization = sugarDate.addLocale('en', {
    'plural':     true,
    'timeMarker': 'at',
    'ampm':       'am,pm',
    'months':     'January,February,March,April,May,June,July,August,September,October,November,December',
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
      { 'name': 'sign',  'src': 'ago|before', 'value': -1 },
      { 'name': 'sign',  'src': 'from now|after|from|in|later', 'value': 1 },
      { 'name': 'edge',  'src': 'last day', 'value': -2 },
      { 'name': 'edge',  'src': 'end', 'value': -1 },
      { 'name': 'edge',  'src': 'first day|beginning', 'value': 1 },
      { 'name': 'shift', 'src': 'last', 'value': -1 },
      { 'name': 'shift', 'src': 'the|this', 'value': 0 },
      { 'name': 'shift', 'src': 'next', 'value': 1 }
    ],
    'dateParse': [
      '{month} {year}',
      '{shift} {unit=5-7}',
      '{0?} {date}{1}',
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
      '{num} {unit=4-5} {sign} {day}',
      '{0?} {date}{1} of {month}',
      '{0?}{month?} {date?}{1?} of {shift} {unit=6-7}',
      '{edge} of {day}'
    ]
  });

  buildDateUnits();
  buildDateMethods();
  buildCoreInputFormats();
  buildFormatTokens();
  buildFormatShortcuts();
  buildAsianDigits();
  buildRelativeAliases();
  buildUTCAliases();
  setDateProperties();

