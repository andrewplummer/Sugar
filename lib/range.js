'use strict';

/***
 * @module Range
 * @description Date, Number, and String ranges that can be manipulated and compared,
 *              or enumerate over specific points within the range.
 *
 ***/

var DURATION_UNITS = 'year|month|week|day|hour|minute|second|millisecond';
var DURATION_REG   = RegExp('(\\d+)?\\s*('+ DURATION_UNITS +')s?', 'i');

var MULTIPLIERS = {
  'Hours': 60 * 60 * 1000,
  'Minutes': 60 * 1000,
  'Seconds': 1000,
  'Milliseconds': 1
};

var PrimitiveRangeConstructor = function(start, end) {
  return new Range(start, end);
};

function Range(start, end) {
  this.start = cloneRangeMember(start);
  this.end   = cloneRangeMember(end);
}

function getRangeMemberNumericValue(m) {
  return isString(m) ? m.charCodeAt(0) : m;
}

function getRangeMemberPrimitiveValue(m) {
  if (m == null) return m;
  return isDate(m) ? m.getTime() : m.valueOf();
}

function getPrecision(n) {
  var split = periodSplit(n.toString());
  return split[1] ? split[1].length : 0;
}

function getGreaterPrecision(n1, n2) {
  return max(getPrecision(n1), getPrecision(n2));
}

function cloneRangeMember(m) {
  if (isDate(m)) {
    return new Date(m.getTime());
  } else {
    return getRangeMemberPrimitiveValue(m);
  }
}

function isValidRangeMember(m) {
  var val = getRangeMemberPrimitiveValue(m);
  return (!!val || val === 0) && valueIsNotInfinite(m);
}

function valueIsNotInfinite(m) {
  return m !== -Infinity && m !== Infinity;
}

function rangeIsValid(range) {
  return isValidRangeMember(range.start) &&
         isValidRangeMember(range.end) &&
         typeof range.start === typeof range.end;
}

function rangeEvery(range, step, countOnly, fn) {
  var increment,
      precision,
      dio,
      unit,
      start   = range.start,
      end     = range.end,
      inverse = end < start,
      current = start,
      index   = 0,
      result  = [];

  if (!rangeIsValid(range)) {
    return countOnly ? NaN : [];
  }
  if (isFunction(step)) {
    fn = step;
    step = null;
  }
  step = step || 1;
  if (isNumber(start)) {
    precision = getGreaterPrecision(start, step);
    increment = function() {
      return incrementNumber(current, step, precision);
    };
  } else if (isString(start)) {
    increment = function() {
      return incrementString(current, step);
    };
  } else if (isDate(start)) {
    dio  = getDateIncrementObject(step);
    step = dio[0];
    unit = dio[1];
    increment = function() {
      return incrementDate(current, step, unit);
    };
  }
  // Avoiding infinite loops
  if (inverse && step > 0) {
    step *= -1;
  }
  while(inverse ? current >= end : current <= end) {
    if (!countOnly) {
      result.push(current);
    }
    if (fn) {
      fn(current, index, range);
    }
    current = increment();
    index++;
  }
  return countOnly ? index - 1 : result;
}

function getDateIncrementObject(amt) {
  var match, val, unit;
  if (isNumber(amt)) {
    return [amt, 'Milliseconds'];
  }
  match = amt.match(DURATION_REG);
  val = +match[1] || 1;
  unit = simpleCapitalize(match[2].toLowerCase());
  if (unit.match(/hour|minute|second/i)) {
    unit += 's';
  } else if (unit === 'Year') {
    unit = 'FullYear';
  } else if (unit === 'Week') {
    unit = 'Date';
    val *= 7;
  } else if (unit === 'Day') {
    unit = 'Date';
  }
  return [val, unit];
}

function incrementDate(src, amount, unit) {
  var mult = MULTIPLIERS[unit], d;
  if (mult) {
    d = new Date(src.getTime() + (amount * mult));
  } else {
    d = new Date(src);
    callDateSet(d, unit, callDateGet(src, unit) + amount);
  }
  return d;
}

function incrementString(current, amount) {
  return chr(current.charCodeAt(0) + amount);
}

function incrementNumber(current, amount, precision) {
  return withPrecision(current + amount, precision);
}

function rangeClamp(range, obj) {
  var clamped,
      start = range.start,
      end = range.end,
      min = end < start ? end : start,
      max = start > end ? start : end;
  if (obj < min) {
    clamped = min;
  } else if (obj > max) {
    clamped = max;
  } else {
    clamped = obj;
  }
  return cloneRangeMember(clamped);
}

defineOnPrototype(Range, {

  /***
   * @method toString()
   * @returns String
   * @short Returns a string representation of the range.
   *
   * @example
   *
   *   Number.range(1, 5).toString() -> 1..5
   *   janToMay.toString()           -> January 1, xxxx..May 1, xxxx
   *
   ***/
  'toString': function() {
    return rangeIsValid(this) ? this.start + '..' + this.end : 'Invalid Range';
  },

  /***
   * @method isValid()
   * @returns Boolean
   * @short Returns true if the range is valid, false otherwise.
   *
   * @example
   *
   *   janToMay.isValid() -> true
   *   Number.range(NaN, NaN).isValid()                           -> false
   *
   ***/
  'isValid': function() {
    return rangeIsValid(this);
  },

  /***
   * @method span()
   * @returns Number
   * @short Returns the span of the range. If the range is a date range, the
   *        value is in milliseconds.
   * @extra The span includes both the start and the end.
   *
   * @example
   *
   *   Number.range(5, 10).span()  -> 6
   *   Number.range(40, 25).span() -> 16
   *   janToMay.span()             -> 10368000001 (or more depending on leap year)
   *
   ***/
  'span': function() {
    var n = getRangeMemberNumericValue(this.end) - getRangeMemberNumericValue(this.start);
    return rangeIsValid(this) ? abs(n) + 1 : NaN;
  },

  /***
   * @method contains(el)
   * @returns Boolean
   * @short Returns true if `el` is contained inside the range. `el` may be a
   *        value or another range.
   *
   * @example
   *
   *   Number.range(5, 10).contains(7)         -> true
   *   Number.range(5, 10).contains(2)         -> false
   *   janToMay.contains(mar)                  -> true
   *   janToMay.contains(marToAug)             -> false
   *   janToMay.contains(febToApr)             -> true
   *
   * @param {RangeElement} el
   *
   ***/
  'contains': function(el) {
    if (el == null) return false;
    if (el.start && el.end) {
      return el.start >= this.start && el.start <= this.end &&
             el.end   >= this.start && el.end   <= this.end;
    } else {
      return el >= this.start && el <= this.end;
    }
  },

  /***
   * @method every(amount, [everyFn])
   * @returns Array
   * @short Iterates through the range by `amount`, calling [everyFn] for each step.
   * @extra Returns an array of each increment visited. For date ranges,
   *        `amount` can also be a string like `"2 days"`. This will step
   *        through the range by incrementing a date object by that specific
   *        unit, and so is generally preferable for vague units such as
   *        `"2 months"`.
   *
   * @callback everyFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   r    A reference to the range.
   *
   * @example
   *
   *   Number.range(2, 8).every(2) -> [2,4,6,8]
   *   janToMay.every('2 months')  -> [Jan 1, Mar 1, May 1]
   *
   *   sepToOct.every('week', function() {
   *     // Will be called every week from September to October
   *   })
   *
   * @param {string|number} amount
   * @param {everyFn} [everyFn]
   * @callbackParam {RangeElement} el
   * @callbackParam {number} i
   * @callbackParam {Range} r
   *
   ***/
  'every': function(amount, everyFn) {
    return rangeEvery(this, amount, false, everyFn);
  },

  /***
   * @method toArray()
   * @returns Array
   * @short Creates an array from the range.
   * @extra If the range is a date range, every millisecond between the start
   *        and end dates will be returned. To control this use `every` instead.
   *
   * @example
   *
   *   Number.range(1, 5).toArray() -> [1,2,3,4,5]
   *   Date.range('1 millisecond ago', 'now').toArray() -> [1ms ago, now]
   *
   ***/
  'toArray': function() {
    return rangeEvery(this);
  },

  /***
   * @method union(range)
   * @returns Range
   * @short Returns a new range with the earliest starting point as its start,
   *        and the latest ending point as its end. If the two ranges do not
   *        intersect this will effectively remove the "gap" between them.
   *
   * @example
   *
   *   oneToTen.union(fiveToTwenty) -> 1..20
   *   janToMay.union(marToAug)     -> Jan 1, xxxx..Aug 1, xxxx
   *
   * @param {Range} range
   *
   ***/
  'union': function(range) {
    return new Range(
      this.start < range.start ? this.start : range.start,
      this.end   > range.end   ? this.end   : range.end
    );
  },

  /***
   * @method intersect(range)
   * @returns Range
   * @short Returns a new range with the latest starting point as its start,
   *        and the earliest ending point as its end. If the two ranges do not
   *        intersect this will effectively produce an invalid range.
   *
   * @example
   *
   *   oneToTen.intersect(fiveToTwenty) -> 5..10
   *   janToMay.intersect(marToAug)     -> Mar 1, xxxx..May 1, xxxx
   *
   * @param {Range} range
   *
   ***/
  'intersect': function(range) {
    if (range.start > this.end || range.end < this.start) {
      return new Range(NaN, NaN);
    }
    return new Range(
      this.start > range.start ? this.start : range.start,
      this.end   < range.end   ? this.end   : range.end
    );
  },

  /***
   * @method clone()
   * @returns Range
   * @short Clones the range.
   * @extra Members of the range will also be cloned.
   *
   * @example
   *
   *   Number.range(1, 5).clone() -> Returns a copy of the range.
   *
   ***/
  'clone': function() {
    return new Range(this.start, this.end);
  },

  /***
   * @method clamp(el)
   * @returns Mixed
   * @short Clamps `el` to be within the range if it falls outside.
   *
   * @example
   *
   *   Number.range(1, 5).clamp(8)     -> 5
   *   janToMay.clamp(aug) -> May 1, xxxx
   *
   * @param {RangeElement} el
   *
   ***/
  'clamp': function(el) {
    return rangeClamp(this, el);
  }

});


/*** @namespace Number ***/

defineStatic(sugarNumber, {

  /***
   * @method range([start], [end])
   * @returns Range
   * @static
   * @short Creates a new number range between [start] and [end]. See `ranges`
   *        for more.
   *
   * @example
   *
   *   Number.range(5, 10)
   *   Number.range(20, 15)
   *
   * @param {number} [start]
   * @param {number} [end]
   *
   ***/
  'range': PrimitiveRangeConstructor

});

defineInstance(sugarNumber, {

  /***
   * @method upto(num, [step] = 1, [everyFn])
   * @returns Array
   * @short Returns an array containing numbers from the number up to `num`.
   * @extra Optionally calls [everyFn] for each number in that array. [step] allows
   *        multiples other than 1. [everyFn] can be passed in place of [step].
   *
   * @callback everyFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   r    A reference to the range.
   *
   * @example
   *
   *   (2).upto(6) -> [2, 3, 4, 5, 6]
   *   (2).upto(6, function(n) {
   *     // This function is called 5 times receiving n as the value.
   *   });
   *   (2).upto(8, 2) -> [2, 4, 6, 8]
   *
   * @signature upto(num, [everyFn])
   * @param {number} num
   * @param {number} [step]
   * @param {everyFn} [everyFn]
   * @callbackParam {RangeElement} el
   * @callbackParam {number} i
   * @callbackParam {Range} r
   *
   ***/
  'upto': function(n, num, step, everyFn) {
    return rangeEvery(new Range(n, num), step, false, everyFn);
  },

  /***
   * @method clamp([start] = Infinity, [end] = Infinity)
   * @returns Number
   * @short Constrains the number so that it falls on or between [start] and
   *        [end].
   * @extra This will build a range object that has an equivalent `clamp` method.
   *
   * @example
   *
   *   (3).clamp(50, 100)  -> 50
   *   (85).clamp(50, 100) -> 85
   *
   * @param {number} [start]
   * @param {number} [end]
   *
   ***/
  'clamp': function(n, start, end) {
    return rangeClamp(new Range(start, end), n);
  },

  /***
   * @method cap([max] = Infinity)
   * @returns Number
   * @short Constrains the number so that it is no greater than [max].
   * @extra This will build a range object that has an equivalent `cap` method.
   *
   * @example
   *
   *   (100).cap(80) -> 80
   *
   * @param {number} [max]
   *
   ***/
  'cap': function(n, max) {
    return rangeClamp(new Range(undefined, max), n);
  }

});

/***
 * @method downto(num, [step] = 1, [everyFn])
 * @returns Array
 * @short Returns an array containing numbers from the number down to `num`.
 * @extra Optionally calls [everyFn] for each number in that array. [step] allows
 *        multiples other than 1. [everyFn] can be passed in place of [step].
 *
 * @callback everyFn
 *
 *   el   The element of the current iteration.
 *   i    The index of the current iteration.
 *   r    A reference to the range.
 *
 * @example
 *
 *   (8).downto(3) -> [8, 7, 6, 5, 4, 3]
 *   (8).downto(3, function(n) {
 *     // This function is called 6 times receiving n as the value.
 *   });
 *   (8).downto(2, 2) -> [8, 6, 4, 2]
 *
 * @signature upto(num, [everyFn])
 * @param {number} num
 * @param {number} [step]
 * @param {everyFn} [everyFn]
 * @callbackParam {RangeElement} el
 * @callbackParam {number} i
 * @callbackParam {Range} r
 *
 ***/
alias(sugarNumber, 'downto', 'upto');


/*** @namespace String ***/

defineStatic(sugarString, {

  /***
   * @method range([start], [end])
   * @returns Range
   * @static
   * @short Creates a new string range between [start] and [end]. See `ranges`
   *        for more.
   *
   * @example
   *
   *   String.range('a', 'z')
   *   String.range('t', 'm')
   *
   * @param {string} [start]
   * @param {string} [end]
   *
   ***/
  'range': PrimitiveRangeConstructor

});


/*** @namespace Date ***/


var FULL_CAPTURED_DURATION = '((?:\\d+)?\\s*(?:' + DURATION_UNITS + '))s?';

// Duration text formats
var RANGE_REG_FROM_TO        = /(?:from)?\s*(.+)\s+(?:to|until)\s+(.+)$/i,
    RANGE_REG_REAR_DURATION  = RegExp('(.+)\\s*for\\s*' + FULL_CAPTURED_DURATION, 'i'),
    RANGE_REG_FRONT_DURATION = RegExp('(?:for)?\\s*'+ FULL_CAPTURED_DURATION +'\\s*(?:starting)?\\s(?:at\\s)?(.+)', 'i');

var DateRangeConstructor = function(start, end) {
  if (arguments.length === 1 && isString(start)) {
    return createDateRangeFromString(start);
  }
  return new Range(getDateForRange(start), getDateForRange(end));
};

function createDateRangeFromString(str) {
  var match, datetime, duration, dio, start, end;
  if (sugarDate.get && (match = str.match(RANGE_REG_FROM_TO))) {
    start = getDateForRange(match[1].replace('from', 'at'));
    end = sugarDate.get(start, match[2]);
    return new Range(start, end);
  }
  if (match = str.match(RANGE_REG_FRONT_DURATION)) {
    duration = match[1];
    datetime = match[2];
  }
  if (match = str.match(RANGE_REG_REAR_DURATION)) {
    datetime = match[1];
    duration = match[2];
  }
  if (datetime && duration) {
    start = getDateForRange(datetime);
    dio = getDateIncrementObject(duration);
    end = incrementDate(start, dio[0], dio[1]);
  } else {
    start = str;
  }
  return new Range(getDateForRange(start), getDateForRange(end));
}

function getDateForRange(d) {
  if (isDate(d)) {
    return d;
  } else if (d == null) {
    return new Date();
  } else if (sugarDate.create) {
    return sugarDate.create(d);
  }
  return new Date(d);
}

/***
 * @method [dateUnit]()
 * @returns Number
 * @namespace Range
 * @short Returns the span of a date range in the given unit.
 * @extra Higher order units ("days" and greater) walk the date to avoid
 *        discrepancies with ambiguity. Lower order units simply subtract the
 *        start from the end.
 *
 * @set
 *   milliseconds
 *   seconds
 *   minutes
 *   hours
 *   days
 *   weeks
 *   months
 *   years
 *
 * @example
 *
 *   janToMay.months()  -> 4
 *   janToMay.days()    -> 121
 *   janToMay.hours()   -> 2904
 *   janToMay.minutes() -> 220320
 *
 ***/
function buildDateRangeUnits() {
  var methods = {};
  forEach(DURATION_UNITS.split('|'), function(unit, i) {
    var name = unit + 's', mult, fn;
    if (i < 4) {
      fn = function() {
        return rangeEvery(this, unit, true);
      };
    } else {
      mult = MULTIPLIERS[simpleCapitalize(name)];
      fn = function() {
        return trunc((this.end - this.start) / mult);
      };
    }
    methods[name] = fn;
  });
  defineOnPrototype(Range, methods);
}

defineStatic(sugarDate,   {

  /***
   * @method range([start], [end])
   * @returns Range
   * @namespace Date
   * @static
   * @short Creates a new date range between [start] and [end].
   * @extra Arguments may be either dates or strings which will be forwarded to
   *        the date constructor (`create` will be used if present in the build).
   *        If either [start] or [end] are undefined, they will default to the
   *        current date. This method also accepts an alternate syntax of a
   *        single string describing the range in natural language. See `ranges`
   *        for more.
   *
   * @example
   *
   *   Date.range(jan, may)
   *   Date.range('today', 'tomorrow')
   *   Date.range('now', '5 days ago')
   *   Date.range('last Monday')
   *   Date.range('Monday to Friday')
   *   Date.range('tomorrow from 3pm to 5pm')
   *   Date.range('1 hour starting at 5pm Tuesday')
   *
   * @param {string|Date} [start]
   * @param {string|Date} [end]
   *
   ***/
  'range': DateRangeConstructor

});

buildDateRangeUnits();
