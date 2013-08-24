
  'use strict';

  /***
   * @package Range
   * @dependency core
   * @description Ranges allow creating spans of numbers, strings, or dates. They can enumerate over specific points within that range, and be manipulated and compared.
   *
   ***/

  function Range(start, end) {
    this.start = cloneRangeMember(start);
    this.end   = cloneRangeMember(end);
  };

  function getRangeMemberNumericValue(m) {
    return isString(m) ? m.charCodeAt(0) : m;
  }

  function getRangeMemberPrimitiveValue(m) {
    if(m == null) return m;
    return isDate(m) ? m.getTime() : m.valueOf();
  }

  function cloneRangeMember(m) {
    if(isDate(m)) {
      return new date(m.getTime());
    } else {
      return getRangeMemberPrimitiveValue(m);
    }
  }

  function isValidRangeMember(m) {
    var val = getRangeMemberPrimitiveValue(m);
    return !!val || val === 0;
  }

  function getDuration(amt) {
    var match, val, unit;
    if(isNumber(amt)) {
      return amt;
    }
    match = amt.toLowerCase().match(/^(\d+)?\s?(\w+?)s?$/i);
    val = parseInt(match[1]) || 1;
    unit = match[2].slice(0,1).toUpperCase() + match[2].slice(1);
    if(unit.match(/hour|minute|second/i)) {
      unit += 's';
    } else if(unit === 'Year') {
      unit = 'FullYear';
    } else if(unit === 'Day') {
      unit = 'Date';
    }
    return [val, unit];
  }

  function incrementDate(current, amount) {
    var num, unit, val, d;
    if(isNumber(amount)) {
      return new date(current.getTime() + amount);
    }
    num  = amount[0];
    unit = amount[1];
    val  = callDateGet(current, unit);
    d    = new date(current.getTime());
    callDateSet(d, unit, val + num);
    return d;
  }

  function incrementString(current, amount) {
    return string.fromCharCode(current.charCodeAt(0) + amount);
  }

  function incrementNumber(current, amount) {
    return current + amount;
  }

  /***
   * @method toString()
   * @returns String
   * @short Returns a string representation of the range.
   * @example
   *
   *   Number.range(1, 5).toString()                               -> 1..5
   *   Date.range(new Date(2003, 0), new Date(2005, 0)).toString() -> January 1, 2003..January 1, 2005
   *
   ***/

  // Note: 'toString' doesn't appear in a for..in loop in IE even though
  // hasOwnProperty reports true, so extend() can't be used here.
  // Also tried simply setting the prototype = {} up front for all
  // methods but GCC very oddly started dropping properties in the
  // object randomly (maybe because of the global scope?) hence
  // the need for the split logic here.
  Range.prototype.toString = function() {
    return this.isValid() ? this.start + ".." + this.end : 'Invalid Range';
  };

  extend(Range, true, true, {

    /***
     * @method isValid()
     * @returns Boolean
     * @short Returns true if the range is valid, false otherwise.
     * @example
     *
     *   Date.range(new Date(2003, 0), new Date(2005, 0)).isValid() -> true
     *   Number.range(NaN, NaN).isValid()                           -> false
     *
     ***/
    'isValid': function() {
      return isValidRangeMember(this.start) && isValidRangeMember(this.end) && typeof this.start === typeof this.end;
    },

    /***
     * @method span()
     * @returns Number
     * @short Returns the span of the range. If the range is a date range, the value is in milliseconds.
     * @extra The span includes both the start and the end.
     * @example
     *
     *   Number.range(5, 10).span()                              -> 6
     *   Date.range(new Date(2003, 0), new Date(2005, 0)).span() -> 94694400000
     *
     ***/
    'span': function() {
      return this.isValid() ? abs(
        getRangeMemberNumericValue(this.end) - getRangeMemberNumericValue(this.start)
      ) + 1 : NaN;
    },

    /***
     * @method contains(<obj>)
     * @returns Boolean
     * @short Returns true if <obj> is contained inside the range. <obj> may be a value or another range.
     * @example
     *
     *   Number.range(5, 10).contains(7)                                              -> true
     *   Date.range(new Date(2003, 0), new Date(2005, 0)).contains(new Date(2004, 0)) -> true
     *
     ***/
    'contains': function(obj) {
      var self = this, arr;
      if(obj == null) return false;
      if(obj.start && obj.end) {
        return obj.start >= this.start && obj.start <= this.end &&
               obj.end   >= this.start && obj.end   <= this.end;
      } else {
        return obj >= this.start && obj <= this.end;
      }
    },

    /***
     * @method every(<amount>, [fn])
     * @returns Array
     * @short Iterates through the range for every <amount>, calling [fn] if it is passed. Returns an array of each increment visited.
     * @extra In the case of date ranges, <amount> can also be a string, in which case it will increment a number of  units. Note that %(2).months()% first resolves to a number, which will be interpreted as milliseconds and is an approximation, so stepping through the actual months by passing %"2 months"% is usually preferable.
     * @example
     *
     *   Number.range(2, 8).every(2)                                       -> [2,4,6,8]
     *   Date.range(new Date(2003, 1), new Date(2003,3)).every("2 months") -> [...]
     *
     ***/
    'every': function(amount, fn) {
      var increment,
          start   = this.start,
          end     = this.end,
          inverse = end < start,
          current = start,
          index   = 0,
          result  = [];

      if(isFunction(amount)) {
        fn = amount;
        amount = null;
      }
      amount = amount || 1;
      if(isNumber(start)) {
        increment = incrementNumber;
      } else if(isString(start)) {
        increment = incrementString;
      } else if(isDate(start)) {
        amount    = getDuration(amount);
        increment = incrementDate;
      }
      // Avoiding infinite loops
      if(inverse && amount > 0) {
        amount *= -1;
      }
      while(inverse ? current >= end : current <= end) {
        result.push(current);
        if(fn) {
          fn(current, index);
        }
        current = increment(current, amount);
        index++;
      }
      return result;
    },

    /***
     * @method union(<range>)
     * @returns Range
     * @short Returns a new range with the earliest starting point as its start, and the latest ending point as its end. If the two ranges do not intersect this will effectively remove the "gap" between them.
     * @example
     *
     *   Number.range(1, 3).union(Number.range(2, 5)) -> 1..5
     *   Date.range(new Date(2003, 1), new Date(2005, 1)).union(Date.range(new Date(2004, 1), new Date(2006, 1))) -> Jan 1, 2003..Jan 1, 2006
     *
     ***/
    'union': function(range) {
      return new Range(
        this.start < range.start ? this.start : range.start,
        this.end   > range.end   ? this.end   : range.end
      );
    },

    /***
     * @method intersect(<range>)
     * @returns Range
     * @short Returns a new range with the latest starting point as its start, and the earliest ending point as its end. If the two ranges do not intersect this will effectively produce an invalid range.
     * @example
     *
     *   Number.range(1, 5).intersect(Number.range(4, 8)) -> 4..5
     *   Date.range(new Date(2003, 1), new Date(2005, 1)).intersect(Date.range(new Date(2004, 1), new Date(2006, 1))) -> Jan 1, 2004..Jan 1, 2005
     *
     ***/
    'intersect': function(range) {
      if(range.start > this.end || range.end < this.start) {
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
     * @example
     *
     *   Number.range(1, 5).clone() -> Returns a copy of the range.
     *
     ***/
    'clone': function(range) {
      return new Range(this.start, this.end);
    },

    /***
     * @method clamp(<obj>)
     * @returns Mixed
     * @short Clamps <obj> to be within the range if it falls outside.
     * @example
     *
     *   Number.range(1, 5).clamp(8) -> 5
     *   Date.range(new Date(2010, 0), new Date(2012, 0)).clamp(new Date(2013, 0)) -> 2012-01
     *
     ***/
    'clamp': function(obj) {
      var clamped,
          start = this.start,
          end = this.end,
          min = end < start ? end : start,
          max = start > end ? start : end;
      if(obj < min) {
        clamped = min;
      } else if(obj > max) {
        clamped = max;
      } else {
        clamped = obj;
      }
      return cloneRangeMember(clamped);
    }

  });


  /***
   * Number module
   ***
   * @method Number.range([start], [end])
   * @returns Range
   * @short Creates a new range between [start] and [end]. See @ranges for more.
   * @example
   *
   *   Number.range(5, 10)
   *
   ***
   * String module
   ***
   * @method String.range([start], [end])
   * @returns Range
   * @short Creates a new range between [start] and [end]. See @ranges for more.
   * @example
   *
   *   String.range('a', 'z')
   *
   ***
   * Date module
   ***
   * @method Date.range([start], [end])
   * @returns Range
   * @short Creates a new range between [start] and [end].
   * @extra If either [start] or [end] are null, they will default to the current date. See @ranges for more.
   * @example
   *
   *   Date.range('today', 'tomorrow')
   *
   ***/
  [number, string, date].forEach(function(klass) {
     extend(klass, false, true, {

      'range': function(start, end) {
        if(klass.create) {
          start = klass.create(start);
          end   = klass.create(end);
        }
        return new Range(start, end);
      }

    });

  });

  /***
   * Number module
   *
   ***/

  extend(number, true, true, {

    /***
     * @method upto(<num>, [fn], [step] = 1)
     * @returns Array
     * @short Returns an array containing numbers from the number up to <num>.
     * @extra Optionally calls [fn] callback for each number in that array. [step] allows multiples greater than 1.
     * @example
     *
     *   (2).upto(6) -> [2, 3, 4, 5, 6]
     *   (2).upto(6, function(n) {
     *     // This function is called 5 times receiving n as the value.
     *   });
     *   (2).upto(8, null, 2) -> [2, 4, 6, 8]
     *
     ***/
    'upto': function(num, fn, step) {
      return number.range(this, num).every(step, fn);
    },

     /***
     * @method clamp([start] = Infinity, [end] = Infinity)
     * @returns Number
     * @short Constrains the number so that it is between [start] and [end].
     * @extra This will build a range object that has an equivalent %clamp% method.
     * @example
     *
     *   (3).clamp(50, 100)  -> 50
     *   (85).clamp(50, 100) -> 85
     *
     ***/
    'clamp': function(start, end) {
      return new Range(start, end).clamp(this);
    },

     /***
     * @method cap([max] = Infinity)
     * @returns Number
     * @short Constrains the number so that it is no greater than [max].
     * @extra This will build a range object that has an equivalent %cap% method.
     * @example
     *
     *   (100).cap(80) -> 80
     *
     ***/
    'cap': function(max) {
      return this.clamp(Undefined, max);
    }

  });

  extend(number, true, true, {

    /***
     * @method downto(<num>, [fn], [step] = 1)
     * @returns Array
     * @short Returns an array containing numbers from the number down to <num>.
     * @extra Optionally calls [fn] callback for each number in that array. [step] allows multiples greater than 1.
     * @example
     *
     *   (8).downto(3) -> [8, 7, 6, 5, 4, 3]
     *   (8).downto(3, function(n) {
     *     // This function is called 6 times receiving n as the value.
     *   });
     *   (8).downto(2, null, 2) -> [8, 6, 4, 2]
     *
     ***/
    'downto': number.prototype.upto

  });


  /***
   * Array module
   *
   ***/

  extend(array, false, function(a) { return a instanceof Range; }, {

    'create': function(range) {
      return range.every();
    }

  });

