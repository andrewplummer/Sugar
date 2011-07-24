
  /***
   * Date module
   *
   ***/

  var abbreviatedMonths;
  var abbreviatedWeekdays;
  var months      = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  var weekdays    = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  var textNumbers = ['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
  var timeArray   = ['hour','minute','second','millisecond','meridian','utc','offset_sign','offset_hours','offset_minutes']
  var optionalTime  = '(?:(?:\\s+|t)(\\d{1,2}):?(\\d{2})?:?(\\d{2})?(\\.\\d{1,6})?(am|pm)?(?:(Z)|(?:([+-])(\\d{2})(?::?(\\d{2}))?)?)?)?$';

  var dateInputFormats = [
    // @date_format 2010
    { reg: '(\\d{4})', to: ['year'] },
    // @date_format 2010-05
    // @date_format 2010.05
    { reg: '(\\d{4})[-/.](\\d{1,2})', to: ['year','month'] },
    // @date_format 2010-05-25 (ISO8601)
    // @date_format 2010-05-25T12:30:40.299Z (ISO8601)
    // @date_format 2010-05-25T12:30:40.299+01:00 (ISO8601)
    // @date_format 2010.05.25
    // @date_format 2010/05/25
    { reg: '([+-])?(\\d{4})[-/.]?(\\d{1,2})[-/.]?(\\d{1,2})', to: ['year_sign','year','month','day'] },
    // @date_format 10-05-25 (ISO8601)
    { reg: '(\\d{2})-?(\\d{2})-?(\\d{2})', to: ['year','month','day'] },
    // @date_format 05-25
    // @date_format 05/25
    // @date_format 05.25
    { reg: '(\\d{1,2})[\\-/.](\\d{1,2})', to: ['month','day'], variant: true },
    // @date_format 05-25-2010
    // @date_format 05/25/2010
    // @date_format 05.25.2010
    { reg: '(\\d{1,2})[\\-/.](\\d{1,2})[\\-/.](\\d{2,4})', to: ['month','day','year'], variant: true },
    // @date_format May 2010
    { reg: '({MONTHS})[\\s\\-.](\\d{4})', to: ['month','year'] },
    // @date_format Tuesday May 25th, 2010
    { reg: '(?:{WEEKDAYS})?\\s*({MONTHS})[\\s\\-.]?(?:(\\d{1,2})(?:st|nd|rd|th)?)?,?[\\s\\-.]?(\\d{2,4})?', to: ['month','day','year'] },
    // @date_format 25 May 2010
    { reg: '(\\d{1,2}) ({MONTHS}),? (\\d{4})', to: ['day','month','year'] },
    // @date_format the day after tomorrow
    // @date_format one day before yesterday
    // @date_format 2 days after monday
    // @date_format 2 weeks/months/years from monday
    { reg: '(?:(the|a|{NUMBER}|\\d+) (day|week|month|year)s? (before|after|from)\\s+)?(today|tomorrow|yesterday|{WEEKDAYS})(?: at)?', to: ['modifier_amount','modifier_unit','modifier_sign','fuzzy_day'] },
    // @date_format a second ago
    // @date_format two days from now
    // @date_format 25 minutes/hours/days/weeks/months/years from now
    { reg: '(a|{NUMBER}|\\d+) (millisecond|second|minute|hour|day|week|month|year)s? (from now|ago)', to: ['modifier_amount','modifier_unit','modifier_sign'], relative: true },
    // @date_format last wednesday
    // @date_format next friday
    // @date_format this week tuesday
    { reg: '(this|next|last)?\\s*(?:week\\s*)?({WEEKDAYS})(?: at)?', to: ['modifier_sign','fuzzy_day'] },
    // @date_format monday of this/next/last week
    { reg: '({WEEKDAYS}) (?:of\\s*)?(this|next|last) week', to: ['fuzzy_day','modifier_sign'] },
    // @date_format May 25th of this/next/last year
    { reg: '({MONTHS})(?: (\\d{1,2})(?:st|nd|rd|th)?)? of (this|next|last) (year)', to: ['month','day','modifier_sign','modifier_unit'] },
    // @date_format the first day of the month
    // @date_format the last day of March
    // @date_format the 23rd of last month
    { reg: '(?:the\\s)?(first day|last day)?(\\d{1,2}(?:st|nd|rd|th))? of (?:(the|this|next|last) (month)|({MONTHS}))', to: ['modifier_edge', 'day','modifier_sign','modifier_unit','month'] },
    // @date_format the beginning of this week/month/year
    // @date_format the end of next month
    { reg: '(?:the\\s)?(beginning|end|first day|last day) of (?:(the|this|next|last) (week|month|year)|(\\d{4})|({MONTHS}))', to: ['modifier_edge','modifier_sign','modifier_unit','year','month'] },
    // @date_format this week
    // @date_format last month
    // @date_format next year
    { reg: '(this|next|last) (week|month|year)', to: ['modifier_sign','modifier_unit'], relative: true },
    // @date_format noon
    // @date_format midnight tonight
    { reg: '(midnight|noon)(?: (tonight|today|tomorrow|yesterday|{WEEKDAYS}))?', to: ['hour','fuzzy_day'], timeIncluded: true },
    // @date_format 12pm
    // @date_format 12:30pm
    // @date_format 12:30:40
    // @date_format 12:30:40.299
    // @date_format 12:30:40.299+01:00
    { reg: '^(?:(\\d{1,2}):?(\\d{2})?:?(\\d{2})?(\\.\\d{1,6})?(am|pm)?(?:(Z)|(?:([+-])(\\d{2})(?::?(\\d{2}))?)?)?)$', to: timeArray, today: true, timeIncluded: true }
  ];

  var dateOutputFormats = [
    {
      token: 'millisec(?:onds?)?|ms(?:ms)?',
      pad: 3,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Milliseconds');
      }
    },
    {
      token: 's(?:s|ec(?:onds?)?)?',
      pad: 2,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Seconds');
      }
    },
    {
      token: 'm(?:m|in(?:utes?)?)?',
      pad: 2,
      caps: true,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Minutes');
      }
    },
    {
      token: 'h(?:h|(?:ours?))?|24hr',
      pad: 2,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Hours');
      }
    },
    {
      token: '12hr',
      pad: 2,
      format: function(d, utc) {
        return getShortHour(d, utc);
      }
    },
    {
      token: 'd(?:d|ate|ays?)?',
      pad: 2,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Date');
      }
    },
    {
      token: 'dow|weekday(?: short)?',
      weekdays: true,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Day');
      }
    },
    {
      token: 'MM?',
      pad: 2,
      caps: true,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Month') + 1;
      }
    },
    {
      token: 'mon(th)?(?: short)?',
      months: true,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Month');
      }
    },
    {
      token: 'yy',
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'FullYear').toString().from(2);
      }
    },
    {
      token: 'yyyy|year',
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'FullYear');
      }
    },
    {
      token: 't{1,2}',
      meridian: true,
      format: function(d, utc) {
        return getMeridian(d, utc);
      }
    },
    {
      token: 'tz|timezone',
      format: function(d, utc) {
        return d.getUTCOffset();
      }
    },
    {
      token: 'iso(tz|timezone)',
      format: function(d, utc) {
        return d.getUTCOffset(true);
      }
    },
    {
      token: 'ord',
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Date').ordinalize();
      }
    }
  ];

  var dateUnits = [
    {
      unit: 'year',
      method: 'FullYear',
      multiplier: function(d) {
        var adjust = d ? (d.isLeapYear() ? 1 : 0) : 0.25;
        return (365 + adjust) * 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'month',
      method: 'Month',
      multiplier: function(d) {
        var days = d ? d.daysInMonth() : 30.4375;
        return days * 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'week',
      method: 'Week',
      multiplier: function(d) {
        return 7 * 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'day',
      method: 'Date',
      multiplier: function(d) {
        return 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'hour',
      method: 'Hours',
      multiplier: function(d) {
        return 60 * 60 * 1000;
      }
    },
    {
      unit: 'minute',
      method: 'Minutes',
      multiplier: function(d) {
        return 60 * 1000;
      }
    },
    {
      unit: 'second',
      method: 'Seconds',
      multiplier: function(d) {
        return 1000;
      }
    },
    {
      unit: 'millisecond',
      method: 'Milliseconds',
      multiplier: function(d) {
        return 1;
      }
    }
  ];


  var getFormatMatch = function(match, arr) {
    var obj = {};
    arr.each(function(key, i) {
      var value = match[i + 1];
      if(typeof value === 'string') value = value.toLowerCase();
      obj[key] = value;
    });
    return obj;
  }

  var getExtendedDate = function(f) {
    var match, format = {}, set = {};
    var utc = false;
    var d = new Date();

    if(Object.isObject(f)) {
      set = f;
      d = new Date().set(f, true);
    } else if(Object.isNumber(f)) {
      d = new Date(f);
    } else if(Object.isDate(f)) {
      d = f;
    } else if(Object.isString(f)) {
      f = f.trim().replace(/\.+$/,'').replace(/^now$/, '');
      dateInputFormats.each(function(df) {
        if(match) return;
        match = NPCGMatch(f, df.reg);
        if(match) {
          format = df;
          var m = getFormatMatch(match, format.to);

          if(Date.allowVariant && format.variant) {
            // If there's a European variant, swap the month and day.
            var tmp = m.month;
            m.month = m.day;
            m.day = tmp;
          }

          if(m.year) {
            if(!m.modifier_unit) {
              m.modifier_unit = 'year';
            }
            if(m.year.length === 2) {
              m.year = getYearFromAbbreviation(m.year.toNumber());
            }
          }
          if(m.month) {
            var num = m.month.toNumber();
            if(isNaN(num)) {
              // If the month is not a number, find it in the array of text months.
              m.month = abbreviatedMonths.indexOf(m.month.to(3));
            } else {
              // Otherwise decrement by 1.
              m.month = num - 1;
            }
          }
          if(m.hour === 'noon' || m.hour === 'midnight') {
            m.hour = m.hour === 'noon' ? 12 : 24;
            if(!set.day && !m.fuzzy_day) m.fuzzy_day = 'today';
          }
          if(m.fuzzy_day) {
            // Fuzzy day can be today, tomorrow, yesterday, or a day of the week.
            // This resolves to an offset of the current date.
            var dayOffset = 0;
            var fuzzy = m.fuzzy_day;
            var weekday;
            if(fuzzy === 'yesterday') {
              dayOffset = -1;
            } else if(fuzzy === 'tomorrow') {
              dayOffset = 1;
            } else if((weekday = abbreviatedWeekdays.indexOf(fuzzy.to(3))) !== -1) {
              d.setWeekday(weekday);
              dayOffset = 0;
              if(m.modifier_sign && !m.modifier_unit && !m.modifier_amount) {
                m.modifier_unit = 'week';
              }
            }
            set.year  = d.getFullYear();
            set.month = d.getMonth();
            set.day  = d.getDate() + dayOffset;
          }
          if(m.millisecond) {
            // Round the milliseconds out to 4 digits
            m.millisecond = (parseFloat(m.millisecond, 10) * 1000).round();
          }

          // Now turn this into actual numbers
          dateUnits.each(function(u) {
            var unit = u.unit;
            if(m[unit] !== undefined) {
              set[unit] = m[unit].toNumber();
            }
          });

          if(m.meridian) {
            // If the time is after 1pm-11pm advance the time by 12 hours.
            if(m.meridian === 'pm' && m.hour < 12) set.hour  += 12;
          }
          if(m.utc || m.offset_hours || m.offset_minutes) {
            utc = true;
            // Adjust for timezone offset
            var offset = 0;
            if(m.offset_hours) {
              offset += m.offset_hours.toNumber() * 60;
            }
            if(m.offset_minutes) {
              offset += m.offset_minutes.toNumber();
            }
            if(m.offset_sign && m.offset_sign === '-') {
              offset *= -1;
            }
            set.minute -= offset;
          }
          if(m.modifier_unit && m.modifier_sign) {
            var amt  = m.modifier_amount || 1;
            var unit = m.modifier_unit;
            var textNumIndex;
            if(amt === 'the' || amt === 'a') {
              amt = 1;
            } else if((textNumIndex = textNumbers.indexOf(amt)) !== -1) {
              amt = textNumIndex;
            } else {
              amt = amt.toNumber();
            }
            if(m.modifier_sign === 'before' || m.modifier_sign === 'ago' || m.modifier_sign === 'last') {
              amt *= -1;
            } else if(m.modifier_sign === 'this' || m.modifier_sign === 'the') {
              amt = 0;
            }
            if(unit === 'year' && !format.relative) {
              set.year = d.getFullYear();
            } else if(unit === 'month' && !format.relative) {
              set.month = d.getMonth();
            } else if(unit === 'week' && !format.relative) {
              set.day = d.getDate();
              unit = 'day';
              amt *= 7;
            }
            if(set[unit] === undefined) {
              set[unit] = 0;
            }
            set[unit] += amt;
          }
          if(m.modifier_edge) {
            var edge = m.modifier_edge;
            if(edge === 'beginning' || edge === 'first' || edge === 'first day') {
              if(m.modifier_unit === 'week') {
                set.month = d.getMonth();
                set.weekday = 0;
              } else if(m.modifier_unit === 'month' || m.month) {
                set.day = 1;
              }
              if(!edge.match(/day/)) {
                set.hour        = 0;
                set.minute      = 0;
                set.second      = 0;
                set.millisecond = 0;
              }
            } else if(edge === 'end' || edge === 'last' || edge === 'last day') {
              if(m.modifier_unit === 'week') {
                set.month = d.getMonth();
                set.weekday = 6;
              } else if(m.modifier_unit === 'month' || m.month) {
                set.day = 32 - new Date(d.getFullYear(), set.month, 32).getDate();
              } else if(m.modifier_unit === 'year') {
                set.month = 11;
                set.day  = 31;
              }
              if(!edge.match(/day/)) {
                set.hour        = 23;
                set.minute      = 59;
                set.second      = 59;
                set.millisecond = 999;
              }
            }

          }
          if(m.year_sign && m.year_sign === '-') {
            set.year *= -1;
          }
          if(format.today) {
            set.year  = d.getFullYear();
            set.month = d.getMonth();
            set.day  = d.getDate();
          }
        }
      });
      if(!match) {
        // The Date constructor does something tricky like checking the number
        // of arguments so simply passing in undefined won't work.
        d = f ? new Date(f) : new Date();
      } else if(format.relative) {
        d.advance(set);
      } else if(utc) {
        d.setUTC(set, true);
      } else {
        d.set(set, true);
      }
    }
    return {
      date: d,
      set: set,
      format: format
    }
  }

  var compareDate = function(d, find, buffer, dir, edges) {
    var unit, accuracy;
    var p = getExtendedDate(find);
    buffer = buffer > 0 ? buffer : 0;
    if(!p.date.isValid()) return false;
    dateUnits.each(function(u) {
      if(p.set[u.unit] !== undefined || p.set[u.unit + 's'] !== undefined) {
        unit = u.unit;
        accuracy = u.multiplier(p.date) - 1;
      }
    });
    if(p.format.relative) {
      var beginning = p.date['beginningOf'+unit.capitalize()];
      if(beginning) {
        beginning.call(p.date);
      } else {
        buffer = buffer || Math.round(accuracy / 2);
        accuracy = 0;
      }
    }
    accuracy = accuracy || 0;
    var t   = d.getTime();
    var min = p.date.getTime();
    var max = min + accuracy;
    if(dir === 'after') {
      return edges ? (t - buffer > min) : (t > max + buffer);
    } else if(dir === 'before') {
      return edges ? (t < max + buffer) : (t - buffer < min);
    } else {
      return t >= (min - buffer) && t < (max + buffer + 1);
    }
  }

  var updateDate = function(date, params, reset, utc, advance) {
    utc = utc === true ? 'UTC' : '';
    if(Object.isNumber(params) && !advance) {
      // If the update is a straight number and we're setting the
      // date, simply directly set the time.
      date.setTime(params);
      return date;
    } else if(Object.isNumber(params) && advance) {
      // If the update is a straight number and we're advancing the
      // date, the number is presumed to be milliseconds.
      params = { milliseconds: params };
    }
    if(params.date) params.day = params.date;
    // If the date is 1/31, setMonth(1) will set the month to March, not February.
    // This is definitely not what we want for rest dates (i.e. non-relative), so
    // pre-emptively set the date here. Also, setting to the middle of the month
    // so that timezone offset's can't traverse dates, which is also not what we want.
    if(reset) {
      date.setDate(15);
    }
    dateUnits.each(function(u) {
      var unit   = u.unit;
      var method = u.method;
      var value = getDateValue(params, unit, reset);
      if(value === undefined) return;
      if(advance) {
        if(unit === 'week') {
          value  = (params.day || 0) + (value * 7);
          method = 'Date';
        }
        value = (value * advance) + callDateMethod(date, 'get', '', method);
      }
      callDateMethod(date, 'set', utc, method, value);
    });
    if(!advance) {
      var weekday = getDateValue(params, 'weekday', reset);
      if(weekday !== undefined) {
        callDateMethod(date, 'set', utc, 'Weekday', weekday)
      }
    }
    return date;
  }

  var getDateValue = function(params, unit, reset) {
    var value = params[unit];
    if(value === undefined) value = params[unit + 's'];
    if(value === undefined && reset) {
      switch(unit) {
        case 'day': value = 1;  break;
        case 'year': case 'week': case 'weekday': break; // assign no value
        default: value = 0;
      }
    }
    return value;
  }

  var callDateMethod = function(d, g, utc, method, value) {
    return d[g + utc + method].call(d, value);
  }

  // If the year is two digits, add the most appropriate century prefix.
  // Duplicating the .round() function here because we don't want the
  // Date class to break if it is overwritten.
  var getYearFromAbbreviation = function(year) {
    return Math.round(new Date().getFullYear() / 100) * 100 - Math.round(year / 100) * 100 + year;
  }


  var getMonth = function(s) {
    if(/\w+\s+\w+/.test(s)) return null;
    var index = abbreviatedMonths.indexOf(s.toLowerCase().to(3));
    return index === -1 ? null : index;
  }

  var getWeekday = function(s) {
    if(/\w+\s+\w+/.test(s)) return null;
    var index = abbreviatedWeekdays.indexOf(s.toLowerCase().to(3));
    return index === -1 ? null : index;
  }

  var getShortHour = function(d, utc) {
    var hours = callDateMethod(d, 'get', utc, 'Hours');
    return hours === 0 ? 12 : hours - (Math.floor(hours / 13) * 12);
  }

  var getMeridian = function(d, utc) {
    var hours = callDateMethod(d, 'get', utc, 'Hours');
    return hours < 12 ? 'am' : 'pm';
  }

  var getOffsetDate = function(num, args, unit, method) {
    var d = createDate(args);
    var set = {};
    set[unit] = num;
    return d[method].call(d, set);
  }

  var getAdjustedDateUnit = function(d) {
    var next, ago = d.millisecondsAgo(), ms = Math.abs(ago), value = ms, dir = (ago >= 0 ? -1 : 1), unit = 'millisecond';
    dateUnits.concat().reverse().slice(1).each(function(u) {
      next = Math.floor(ms / u.multiplier(d));
      if(next >= 1) {
        value = next;
        unit = u.unit;
      }
    });
    if(value != 1) unit += 's';
    return [value, unit, ms, dir];
  }

  var createDate = function(args) {
    var f;
    if(args.length >= 2 && Object.isNumber(args[0])) {
      // If there are 2 or more paramters we have an enumerated constructor type as in "new Date(2003, 2, 12);"
      f = collectDateArguments(args,'year','month','day','hour','minute','second','millisecond')[0];
    } else {
      f = args[0];
    }
    return getExtendedDate(f).date;
  }




   /***
   * @method millisecondsSince([d])
   * @returns Number
   * @short Returns the number of milliseconds since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %millisecondsFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().millisecondsSince('1 hour ago')         -> 3,600,000
   *   Date.create('1 hour from now').millisecondsFromNow()  -> 3,600,000
   *
   ***
   * @method secondsSince([d])
   * @returns Number
   * @short Returns the number of seconds since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %secondsFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().secondsSince('1 hour ago')        -> 3600
   *   Date.create('1 hour from now').secondsFromNow() -> 3600
   *
   ***
   * @method minutesSince([d])
   * @returns Number
   * @short Returns the number of minutes since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %minutesFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().minutesSince('1 hour ago')        -> 60
   *   Date.create('1 hour from now').minutesFromNow() -> 60
   *
   ***
   * @method hoursSince([d])
   * @returns Number
   * @short Returns the number of hours since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %hoursFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().hoursSince('1 hour ago')        -> 1
   *   Date.create('1 hour from now').hoursFromNow() -> 1
   *
   ***
   * @method daysSince([d])
   * @returns Number
   * @short Returns the number of days since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %daysFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().daysSince('1 week ago')        -> 7
   *   Date.create('1 week from now').daysFromNow() -> 7
   *
   ***
   * @method weeksSince([d])
   * @returns Number
   * @short Returns the number of weeks since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %weeksFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().weeksSince('1 month ago')        -> 4
   *   Date.create('1 month from now').weeksFromNow() -> 4
   *
   ***
   * @method monthsSince([d])
   * @returns Number
   * @short Returns the number of months since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %monthsFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().monthsSince('1 year ago')        -> 12
   *   Date.create('1 year from now').monthsFromNow() -> 12
   *
   ***
   * @method yearsSince([d])
   * @returns Number
   * @short Returns the number of years since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %yearsFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().yearsSince('5 years ago')        -> 5
   *   Date.create('5 years from now').yearsFromNow() -> 5
   *
   ***
   * @method millisecondsUntil([d])
   * @returns Number
   * @short Returns the number of milliseconds until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %millisecondsAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().millisecondsUntil('1 hour from now') -> 3,600,000
   *   Date.create('1 hour ago').millisecondsAgo()        -> 3,600,000
   *
   ***
   * @method secondsUntil([d])
   * @returns Number
   * @short Returns the number of seconds until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %secondsAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().secondsUntil('1 hour from now') -> 3600
   *   Date.create('1 hour ago').secondsAgo()        -> 3600
   *
   ***
   * @method minutesUntil([d])
   * @returns Number
   * @short Returns the number of minutes until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %minutesAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().minutesUntil('1 hour from now') -> 60
   *   Date.create('1 hour ago').minutesAgo()        -> 60
   *
   ***
   * @method hoursUntil([d])
   * @returns Number
   * @short Returns the number of hours until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %hoursAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().hoursUntil('1 hour from now') -> 1
   *   Date.create('1 hour ago').hoursAgo()        -> 1
   *
   ***
   * @method daysUntil([d])
   * @returns Number
   * @short Returns the number of days until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %daysAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().daysUntil('1 week from now') -> 7
   *   Date.create('1 week ago').daysAgo()        -> 7
   *
   ***
   * @method weeksUntil([d])
   * @returns Number
   * @short Returns the number of weeks until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %weeksAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().weeksUntil('1 month from now') -> 4
   *   Date.create('1 month ago').weeksAgo()      -> 4
   *
   ***
   * @method monthsUntil([d])
   * @returns Number
   * @short Returns the number of months until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %monthsAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().monthsUntil('1 year from now') -> 12
   *   Date.create('1 year ago').monthsAgo()        -> 12
   *
   ***
   * @method yearsUntil([d])
   * @returns Number
   * @short Returns the number of years until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %yearsAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().yearsUntil('5 years from now') -> 5
   *   Date.create('5 years ago').yearsAgo()      -> 5
   *
   ***
   * @method millisecondsAgo()
   * @alias millisecondsUntil
   *
   ***
   * @method millisecondsFromNow()
   * @alias millisecondsSince
   *
   ***
   * @method secondsAgo()
   * @alias secondsUntil
   *
   ***
   * @method secondsFromNow()
   * @alias secondsSince
   *
   ***
   * @method minutesAgo()
   * @alias minutesUntil
   *
   ***
   * @method minutesFromNow()
   * @alias minutesSince
   *
   ***
   * @method hoursAgo()
   * @alias hoursUntil
   *
   ***
   * @method hoursFromNow()
   * @alias hoursSince
   *
   ***
   * @method daysAgo()
   * @alias daysUntil
   *
   ***
   * @method daysFromNow()
   * @alias daysSince
   *
   ***
   * @method weeksAgo()
   * @alias weeksUntil
   *
   ***
   * @method weeksFromNow()
   * @alias weeksSince
   *
   ***
   * @method monthsAgo()
   * @alias monthsUntil
   *
   ***
   * @method monthsFromNow()
   * @alias monthsSince
   *
   ***
   * @method yearsAgo()
   * @alias yearsUntil
   *
   ***
   * @method yearsFromNow()
   * @alias yearsSince
   *
   ***
   * @method addMilliseconds(<num>)
   * @returns Date
   * @short Adds <num> milliseconds to the date.
   * @example
   *
   *   Date.create().addMilliseconds(5) -> current time + 5 milliseconds
   *
   ***
   * @method addSeconds(<num>)
   * @returns Date
   * @short Adds <num> seconds to the date.
   * @example
   *
   *   Date.create().addSeconds(5) -> current time + 5 seconds
   *
   ***
   * @method addMinutes(<num>)
   * @returns Date
   * @short Adds <num> minutes to the date.
   * @example
   *
   *   Date.create().addMinutes(5) -> current time + 5 minutes
   *
   ***
   * @method addHours(<num>)
   * @returns Date
   * @short Adds <num> hours to the date.
   * @example
   *
   *   Date.create().addHours(5) -> current time + 5 hours
   *
   ***
   * @method addDays(<num>)
   * @returns Date
   * @short Adds <num> days to the date.
   * @example
   *
   *   Date.create().addDays(5) -> current time + 5 days
   *
   ***
   * @method addWeeks(<num>)
   * @returns Date
   * @short Adds <num> weeks to the date.
   * @example
   *
   *   Date.create().addWeeks(5) -> current time + 5 weeks
   *
   ***
   * @method addMonths(<num>)
   * @returns Date
   * @short Adds <num> months to the date.
   * @example
   *
   *   Date.create().addMonths(5) -> current time + 5 months
   *
   ***
   * @method addYears(<num>)
   * @returns Date
   * @short Adds <num> years to the date.
   * @example
   *
   *   Date.create().addYears(5) -> current time + 5 years
   *
   ***
   * @method isLastWeek()
   * @returns Boolean
   * @short Returns true if the date is last week.
   * @example
   *
   *   Date.create('yesterday').isLastWeek() -> true or false?
   *
   ***
   * @method isThisWeek()
   * @returns Boolean
   * @short Returns true if the date is this week.
   * @example
   *
   *   Date.create('today').isThisWeek() -> true
   *
   ***
   * @method isNextWeek()
   * @returns Boolean
   * @short Returns true if the date is next week.
   * @example
   *
   *   Date.create('tomorrow').isNextWeek() -> true or false?
   *
   ***
   * @method isLastMonth()
   * @returns Boolean
   * @short Returns true if the date is last month.
   * @example
   *
   *   Date.create('yesterday').isLastMonth() -> true or false?
   *
   ***
   * @method isThisMonth()
   * @returns Boolean
   * @short Returns true if the date is this month.
   * @example
   *
   *   Date.create('today').isThisMonth() -> true
   *
   ***
   * @method isNextMonth()
   * @returns Boolean
   * @short Returns true if the date is next month.
   * @example
   *
   *   Date.create('tomorrow').isNextMonth() -> true or false?
   *
   ***
   * @method isLastYear()
   * @returns Boolean
   * @short Returns true if the date is last year.
   * @example
   *
   *   Date.create('yesterday').isLastYear() -> true or false?
   *
   ***
   * @method isThisYear()
   * @returns Boolean
   * @short Returns true if the date is this year.
   * @example
   *
   *   Date.create('today').isThisYear() -> true
   *
   ***
   * @method isNextYear()
   * @returns Boolean
   * @short Returns true if the date is next year.
   * @example
   *
   *   Date.create('tomorrow').isNextYear() -> true or false?
   *
   ***
   * @method beginningOfDay()
   * @returns Date
   * @short Sets the date to the beginning of the day.
   * @example
   *
   *   Date.create().beginningOfDay() -> the beginning of today
   *
   ***
   * @method endOfDay()
   * @returns Date
   * @short Sets the date to the end of the day.
   * @example
   *
   *   Date.create().endOfDay() -> the end of today
   *
   ***
   * @method beginningOfWeek()
   * @returns Date
   * @short Sets the date to the beginning of the week.
   * @example
   *
   *   Date.create().beginningOfWeek() -> the beginning of this week
   *
   ***
   * @method endOfWeek()
   * @returns Date
   * @short Sets the date to the end of the week.
   * @example
   *
   *   Date.create().endOfWeek() -> the end of this week
   *
   ***
   * @method beginningOfMonth()
   * @returns Date
   * @short Sets the date to the beginning of the month.
   * @example
   *
   *   Date.create().beginningOfMonth() -> the beginning of this month
   *
   ***
   * @method endOfMonth()
   * @returns Date
   * @short Sets the date to the end of the month.
   * @example
   *
   *   Date.create().endOfMonth() -> the end of this month
   *
   ***
   * @method beginningOfYear()
   * @returns Date
   * @short Sets the date to the beginning of the year.
   * @example
   *
   *   Date.create().beginningOfYear() -> the beginning of this year
   *
   ***
   * @method endOfYear()
   * @returns Date
   * @short Sets the date to the end of the year.
   * @example
   *
   *   Date.create().endOfYear() -> the end of this year
   *
   ***/
  var buildDateMethods = function() {
    dateUnits.each(function(u, i) {
      var unit = u.unit;
      var caps = unit.capitalize();
      var multiplier = u.multiplier();
      defineProperty(Date.prototype, unit+'sSince', function(f) {
        return ((this.getTime() - Date.create(f).getTime()) / multiplier).round();
      });
      defineProperty(Date.prototype, unit+'sUntil', function(f) {
        return ((Date.create(f).getTime() - this.getTime()) / multiplier).round();
      });
      defineProperty(Date.prototype, unit+'sAgo', Date.prototype[unit+'sUntil']);
      defineProperty(Date.prototype, unit+'sFromNow', Date.prototype[unit+'sSince']);
      defineProperty(Date.prototype, 'add'+caps+'s', function(num) {
        var set = {};
        set[unit] = num;
        return this.advance(set);
      });
      buildNumberToDateAlias(unit, multiplier);
      if(i < 3) {
        defineProperty(Date.prototype, 'isLast'+caps, function() {
          return this.is('last ' + unit);
        });
        defineProperty(Date.prototype, 'isThis'+caps, function() {
          return this.is('this ' + unit);
        });
        defineProperty(Date.prototype, 'isNext'+caps, function() {
          return this.is('next ' + unit);
        });
      }
      if(i < 4) {
        defineProperty(Date.prototype, 'beginningOf'+caps, function(reset) {
          if(reset === undefined || unit == 'day') reset = true;
          var set = { month: 0, day: 1 };
          switch(unit) {
            case 'week':  set.weekday = 0;
            case 'day':   set.day = this.getDate();
            case 'month': set.month = this.getMonth();
          }
          return this.set(set, reset);
        });
        defineProperty(Date.prototype, 'endOf'+caps, function(reset) {
          if(reset === undefined || unit == 'day') reset = true;
          var set = reset ? { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 } : {};
          set.day   = this.getDate();
          set.month = this.getMonth();
          switch(unit) {
            case 'year':  set.month = 11; set.day = 31; break;
            case 'month': set.day = this.daysInMonth(); break;
            case 'week':  set.weekday = 6; break;
          }
          return this.set(set, reset);
        });
      }
    });
  }

  var buildFormatRegExp = function() {

    abbreviatedMonths   = months.map(function(m) { return m.to(3); });
    abbreviatedWeekdays = weekdays.map(function(m) { return m.to(3); });

    var monthReg   = months.map(function(m) { return m.to(3)+'(?:\\.|'+m.from(3)+')?'; }).join('|');
    var weekdayReg = weekdays.map(function(m) { return m.to(3)+'(?:\\.|'+m.from(3)+')?'; }).join('|');
    var numberReg  = textNumbers.join('|');

    dateInputFormats.each(function(m) {
      var src = '^' + m.reg;
      src = src.replace(/{WEEKDAYS}/, weekdayReg);
      src = src.replace(/{MONTHS}/, monthReg);
      src = src.replace(/{NUMBER}/, numberReg);
      if(!m.timeIncluded) {
        src = src + optionalTime;
        m.to = m.to.concat(['hour','minute','second','millisecond','meridian','utc','offset_sign','offset_hours','offset_minutes']);
      }
      m.reg = new RegExp(src, 'i');
    });
  }

   /***
   * @method isToday()
   * @returns Boolean
   * @short Returns true if the date is today.
   * @example
   *
   *   Date.create().isToday()           -> true
   *   Date.create('tomorrow').isToday() -> false
   *
   ***
   * @method isYesterday()
   * @returns Boolean
   * @short Returns true if the date is yesterday.
   * @example
   *
   *   Date.create().isYesterday()            -> false
   *   Date.create('yesterday').isYesterday() -> true
   *
   ***
   * @method isTomorrow()
   * @returns Boolean
   * @short Returns true if the date is tomorrow.
   * @example
   *
   *   Date.create().isTomorrow()           -> false
   *   Date.create('tomorrow').isTomorrow() -> true
   *
   ***
   * @method isWeekday()
   * @returns Boolean
   * @short Returns true if the date is a weekday.
   * @example
   *
   *   Date.create('monday').isWeekday() -> true
   *   Date.create('sunday').isWeekday() -> false
   *
   ***
   * @method isWeekend()
   * @returns Boolean
   * @short Returns true if the date is a weekend.
   * @example
   *
   *   Date.create('saturday').isWeekend() -> true
   *   Date.create('thursday').isWeekend() -> false
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
  var buildRelativeAliases = function() {
    ['today','yesterday','tomorrow','weekday','weekend','future','past'].concat(weekdays).concat(months).each(function(s) {
      defineProperty(Date.prototype, 'is'+s.capitalize(), function() {
        return this.is(s);
      });
    });
  }

  var buildDate = function() {
    buildDateMethods();
    buildFormatRegExp();
    buildRelativeAliases();
  }


  extend(Date, false, {
    'make': function() {
      return createDate(arguments);
    },
    'DSTOffset': (new Date(2000, 6, 1).getTimezoneOffset() - new Date(2000, 0, 1).getTimezoneOffset()) * 60 * 1000,
    'INTERNATIONAL_TIME': '{h}:{mm}:{ss}',
    'RFC1123': '{Dow}, {dd} {Mon} {yyyy} {hh}:{mm}:{ss} GMT{tz}',
    'RFC1036': '{Weekday}, {dd}-{Mon}-{yy} {hh}:{mm}:{ss} GMT{tz}',
    'ISO8601_DATE': '{yyyy}-{MM}-{dd}',
    'ISO8601_DATETIME': '{yyyy}-{MM}-{dd}T{hh}:{mm}:{ss}.{ms}{isotz}'
  });

  extend(Date, true, {

     /***
     * @method set(<set>, [reset] = false)
     * @returns Date
     * @short Sets the date object.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). If [reset] is set, the time will also be reset to 00:00:00.000 For more see @date_format.
     * @example
     *
     *   new Date().set({ year: 2011, month: 11, day: 31 }) -> December 31, 2011
     *   new Date().set(2011, 11, 31)                       -> December 31, 2011
     *   new Date().set(86400000)                           -> 1 day after Jan 1, 1970
     *
     ***/
    'set': function() {
      var args = collectDateArguments(arguments,'year','month','day','hour','minute','second','millisecond');
      return updateDate(this, args[0], args[1])
    },

     /***
     * @method setUTC()
     * @returns Date
     * @short Sets the date object according to universal time.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor).
     * @example
     *
     *   new Date().setUTC({ year: 2011, month: 11, day: 31 }) -> December 31, 2011
     *   new Date().setUTC(2011, 11, 31)                       -> December 31, 2011
     *   new Date().setUTC(86400000)                           -> 1 day after Jan 1, 1970
     *
     ***/
    'setUTC': function() {
      var args = collectDateArguments(arguments,'year','month','day','hour','minute','second','millisecond');
      return updateDate(this, args[0], args[1], true)
    },

     /***
     * @method setWeekday()
     * @returns Nothing
     * @short Sets the weekday of the date.
     * @example
     *
     *   new Date().setWeekday(1) -> Monday of this week
     *   new Date().setWeekday(6) -> Saturday of this week
     *
     ***/
    'setWeekday': function(dow) {
      if(dow === undefined) return;
      this.setDate(this.getDate() + dow - this.getDay());
    },

     /***
     * @method setUTCWeekday()
     * @returns Nothing
     * @short Sets the weekday of the date according to universal time.
     * @example
     *
     *   new Date().setUTCWeekday(1) -> Monday of this week
     *   new Date().setUTCWeekday(6) -> Saturday of this week
     *
     ***/
    'setUTCWeekday': function(dow) {
      if(dow === undefined) return;
      this.setDate(this.getUTCDate() + dow - this.getDay());
    },

     /***
     * @method setWeek()
     * @returns Nothing
     * @short Sets the week (of the year).
     * @example
     *
     *   Date.create('January 1').setWeek(15) -> 15th week of the year
     *
     ***/
    'setWeek': function(week) {
      if(week === undefined) return;
      var date = this.getDate();
      this.setMonth(0);
      this.setDate((week * 7) + 1);
    },

     /***
     * @method setUTCWeek()
     * @returns Nothing
     * @short Sets the week (of the year) according to universal time.
     * @example
     *
     *   Date.create('January 1').setUTCWeek(15) -> 15th week of the year
     *
     ***/
    'setUTCWeek': function(week) {
      if(week === undefined) return;
      var date = this.getUTCDate();
      this.setMonth(0);
      this.setUTCDate((week * 7) + 1);
    },

     /***
     * @method getWeek()
     * @returns Number
     * @short Gets the date's week (of the year).
     * @example
     *
     *   new Date().getWeek() -> today's week of the year
     *
     ***/
    'getWeek': function() {
      var d = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((this.getTime() - d.getTime() + 1) / (7 * 24 * 60 * 60 * 1000));
    },

     /***
     * @method getUTCWeek()
     * @returns Number
     * @short Gets the date's week (of the year) according to universal time.
     * @example
     *
     *   new Date().getUTCWeek() -> today's week of the year
     *
     ***/
    'getUTCWeek': function() {
      var d = new Date().setUTC(this.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      return Math.ceil((this.getTime() - d.getTime() + 1) / (7 * 24 * 60 * 60 * 1000));
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
      var offset = this.utc ? 0 : this.getTimezoneOffset();
      var colon  = iso === true ? ':' : '';
      if(!offset && iso) return 'Z';
      return Math.round(-offset / 60).pad(2, true) + colon + (offset % 60).pad(2);
    },

     /***
     * @method toUTC()
     * @returns Date
     * @short Converts the date to UTC time, effectively subtracting the timezeone offset.
     * @extra Note here that the method %getTimezoneOffset% will still show an offset even after this method is called, as this method effectively just rewinds the date. %format% however, will correctly set the %{tz}% (timezone) token as UTC once this method has been called on the date.
     * @example
     *
     *   new Date().toUTC() -> current time in UTC
     *
     ***/
    'toUTC': function() {
      if(this.utc) return this;
      var d = this.clone().addMinutes(this.getTimezoneOffset());
      d.utc = true;
      return d;
    },

     /***
     * @method isUTC()
     * @returns Boolean
     * @short Returns true if the date has no timezone offset.
     * @example
     *
     *   new Date().isUTC() -> true or false?
     *
     ***/
    'isUTC': function() {
      return this.utc || this.getTimezoneOffset() === 0;
    },

     /***
     * @method advance()
     * @returns Date
     * @short Sets the date forward.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). For more see @date_format.
     * @example
     *
     *   new Date().advance({ year: 2 }) -> 2 years in the future
     *   new Date().advance(0, 2, 3)     -> 2 months 3 days in the future
     *   new Date().advance(86400000)    -> 1 day in the future
     *
     ***/
    'advance': function(params) {
      var args = collectDateArguments(arguments,'year','month','day','hour','minute','second','millisecond');
      return updateDate(this, args[0], false, false, 1, true);
    },

     /***
     * @method rewind()
     * @returns Date
     * @short Sets the date back.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). For more see @date_format.
     * @example
     *
     *   new Date().rewind({ year: 2 }) -> 2 years in the past
     *   new Date().rewind(0, 2, 3)     -> 2 months 3 days in the past
     *   new Date().rewind(86400000)    -> 1 day in the past
     *
     ***/
    'rewind': function(params) {
      var args = collectDateArguments(arguments,'year','month','day','hour','minute','second','millisecond');
      return updateDate(this, args[0], false, false, -1);
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
      return !isNaN(this.getTime());
    },

     /***
     * @method isAfter(<d>, [margin])
     * @returns Boolean
     * @short Returns true if the date is after the <d>.
     * @extra [margin] is to allow extra margin of error (in ms). <d> will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, <d> is assumed to be now.
     * @example
     *
     *   new Date().isAfter('tomorrow')  -> false
     *   new Date().isAfter('yesterday') -> true
     *
     ***/
    'isAfter': function(d, margin) {
      return compareDate(this, d, margin, 'after');
    },

     /***
     * @method isBefore(<d>, [margin])
     * @returns Boolean
     * @short Returns true if the date is before <d>.
     * @extra [margin] is to allow extra margin of error (in ms). <d> will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, <d> is assumed to be now.
     * @example
     *
     *   new Date().isBefore('tomorrow')  -> true
     *   new Date().isBefore('yesterday') -> false
     *
     ***/
    'isBefore': function(d, margin) {
      return compareDate(this, d, margin, 'before');
    },

     /***
     * @method isBetween(<d1>, <d2>, [margin])
     * @returns Boolean
     * @short Returns true if the date falls between <d1> and <d2>.
     * @extra [margin] is to allow extra margin of error (in ms). <d1> and <d2> will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, they are assumed to be now.
     * @example
     *
     *   new Date().isBetween('yesterday', 'tomorrow')    -> true
     *   new Date().isBetween('last year', '2 years ago') -> false
     *
     ***/
    'isBetween': function(first, second, margin) {
      if(compareDate(this, first, margin, 'after', true) && compareDate(this, second, margin, 'before', true)) {
        return true;
      } else {
        return compareDate(this, second, margin, 'after', true) && compareDate(this, first, margin, 'before', true);
      }
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
      var year = this.getFullYear();
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
    'daysInMonth': function() {
      return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
    },

     /***
     * @method format(<format>)
     * @returns String
     * @short Formats the date for the given <format>.
     * @extra <format> will accept a number of tokens as well as pre-determined formats. It can also be %'relative'%, which will construct a relative, unit-adjusted offset to the current time. A function may also be passed here to allow more localization and more granular control. %relative% is provided as an alias. See @date_format for more details.
     * @example
     *
     *   Date.create().format('{d} {Month}, {YYYY}')              -> ex. July 4, 2003
     *   Date.create().format('{hh}:{mm}')                        -> ex. 15:57
     *   Date.create().format('{12hr}:{mm}{tt}')                  -> ex. 3:57pm
     *   Date.create().format(Date.AMERICAN_DATETIME)             -> ex. 3/15/2005 3:15pm
     *   Date.create().format(Date.INTERNATIONAL_TIME)            -> ex. 21:55:03
     *   Date.create().format(Date.RFC1123)                       -> ex. Tue, 05 Jul 2011 04:04:22 GMT+0900
     *   Date.create().format(Date.ISO8601)                       -> ex. 2011-07-05 12:24:55.528Z
     *   Date.create('1995').format('{years ago}')                -> ex. 15 years ago
     *   Date.create('beginning of this week').format('relative') -> ex. 3 days ago
     +   Date.create('yesterday').format(function(value,unit,ms,dir) {
     *     // value = 1, unit = 'day', ms = 86400000, dir = -1
     *   });                                                      -> ex. 1 day ago
     *
     ***/
    'format': function(f) {
      var d = this, adu;
      if(!d.isValid()) {
        return 'Invalid Date';
      } else if(!f) {
        return this.toString();
      } else if(Date[f]) {
        f = Date[f];
      } else if(Object.isFunction(f)) {
        adu = getAdjustedDateUnit(d);
        f = f.apply(d, adu) || 'relative';
      }
      if(f == 'relative') {
        adu = adu || getAdjustedDateUnit(d);
        if(adu[2] < 1000) {
          adu[0] = 1;
          adu[1] = 'second';
        }
        return adu[0] + ' ' + adu[1] + ' ' + (adu[3] < 0 ? 'ago' : 'from now');
      }
      dateOutputFormats.each(function(dof) {
        if(!f) return;
        f = f.replace(new RegExp('\\{('+dof.token+')(?: (pad))?\\}', dof.caps ? '' : 'i'), function(m,t,p) {
          var value = dof.format.call(null, d, '');
          if(dof.pad && (t.length === 2 || p === 'pad')) {
            value = value.pad(dof.pad);
          }
          if(dof.weekdays) {
            var l = t.toLowerCase();
            var abbreviated = l === 'dow' || l === 'weekday short';
            value = abbreviated ? abbreviatedWeekdays[value] : weekdays[value];
            if(t.first().toUpperCase() === t.first()) value = value.capitalize();
          }
          if(dof.months) {
            var l = t.toLowerCase();
            var abbreviated = l === 'mon' || l === 'month short';
            value = abbreviated ? abbreviatedMonths[value] : months[value];
            if(t.first().toUpperCase() === t.first()) value = value.capitalize();
          }
          if(dof.meridian) {
            if(t.length === 1) value = value.to(1);
            if(t.toUpperCase() === t) value = value.toUpperCase();
          }
          return value;
        });
      });
      return f;
    },

     /***
     * @method relative([fn])
     * @returns String
     * @short Shortcut for %format('relative')%.
     * @extra [fn] is a callback that can be used for more granular control over the resulting string. [fn] is passed 4 arguments: the adjusted value, adjusted unit, offset in milliseconds, and %dir%, which is -1 if the string is in the past and 1 if it is in the future. For more information, see @date_format.
     * @example
     *
     *   Date.create('90 seconds ago').relative() -> 1 minute ago
     *   Date.create('January').relative()        -> ex. 5 months ago
     +   Date.create('120 minutes ago').relative(function(val, unit, ms, dir) {
     *    return val + ' ' + unit + ' ago';
     *   });                                      -> ex. 5 months ago
     *
     ***/
    'relative': function(fn) {
      return this.format(fn || 'relative');
    },

     /***
     * @method is(<d>, [margin])
     * @returns Boolean
     * @short Returns true if the date is <d>.
     * @extra [margin] is to allow extra margin of error (in ms). <d> will accept a date object, timestamp, or text format. If not specified, <d> is assumed to be now. %is% additionally understands more generalized expressions like month/weekday names, 'today', etc. Dates will be compared to the precision implied in <d>. For more information, see @date_format.
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
    'is': function(d, margin) {
      var month, weekday;
      if(Object.isString(margin)) {
        var f = dateUnits.find(function(u) {
          return u.unit === margin;
        });
        if(f) {
          margin = f.multiplier();
        }
      }
      margin = margin > 0 ? margin : 0;
      if(!Object.isString(d)) {
        d = Date.create(d);
        margin = margin || 0;
        var t = this.getTime();
        var f = d.getTime();
        return t >= (f - margin) && t < (f + 1 + margin);
      } else {
        d = d.trim();
        if(d === 'future') {
          return this.getTime() > new Date().getTime();
        } else if(d === 'past') {
          return this.getTime() < new Date().getTime();
        } else if(d === 'weekday') {
          return !(this.getDay() === 0 || this.getDay() === 6);
        } else if(d === 'weekend') {
          return this.getDay() === 0 || this.getDay() === 6;
        } else if(weekday = getWeekday(d)) {
          return this.getDay() === weekday;
        } else if(month = getMonth(d)) {
          return this.getMonth() === month;
        } else {
          return compareDate(this, d, margin);
        }
      }
    },

     /***
     * @method resetTime()
     * @returns Date
     * @short Resets the time in the date to 00:00:00.000.
     * @example
     *
     *   Date.create().resetTime()  -> Beginning of today
     *
     ***/
    'resetTime': function() {
      return this.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
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
      return new Date(this.getTime());
    },

     /***
     * @method toISOString()
     * @returns String
     * @short Formats the string to ISO8601 format.
     * @extra This will always format as UTC time. Provided for browsers that do not support this method.
     * @example
     *
     *   Date.create().toISOString() -> ex. 2011-07-05 12:24:55.528Z
     *
     ***/
    'toISOString': function(utc) {
      return this.toUTC().format(Date.ISO8601_DATETIME);
    }

  });

  // Class aliases
  // Creating "create" as an alias as there are instances where it may be overwritten.
  extend(Date, false, {

    'ISO8601': Date.ISO8601_DATETIME,

     /***
     * @method Date.create(<d>)
     * @returns Date
     * @short Alternate Date constructor which understands various formats.
     * @extra Accepts a multitude of text formats, a timestamp, or another date. If no argument is given, date is assumed to be now. %Date.create% additionally can accept enumerated parameters as with the standard date constructor. For more information, see @date_format.
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
     *
     ***/
    'create': Date.make

  });

  // Instance aliases
  extend(Date, true, {

     /***
     * @method getWeekday()
     * @alias getDay
     *
     ***/
    'getWeekday':    Date.prototype.getDay,

     /***
     * @method getUTCWeekday()
     * @alias getUTCDay
     *
     ***/
    'getUTCWeekday':    Date.prototype.getUTCDay,

     /***
     * @method iso()
     * @alias toISOString
     *
     ***/
    'iso':    Date.prototype.toISOString

  });

