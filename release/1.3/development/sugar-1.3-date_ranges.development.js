
  /***
   * DateRange module
   * @dependency date
   *
   ***/

  var DateRange = function(start, end) {
    this.start = isDate(start) ? start.clone() : new date();
    this.end   = isDate(end)   ? end.clone()   : new date();
  };

  // 'toString' doesn't appear in a for..in loop in IE even though
  // hasOwnProperty reports true, so extend() can't be used here.
  // Also tried simply setting the prototype = {} up front for all
  // methods but GCC very oddly started dropping properties in the
  // object randomly (maybe because of the global scope?) hence
  // the need for the split logic here.
  DateRange.prototype.toString = function() {
    /***
     * @method toString()
     * @returns String
     * @short Returns a string representation of the DateRange.
     * @example
     *
     *   Date.range(Date.create('2003'), Date.create('2005')).toString() -> January 1, 2003..January 1, 2005
     *
     ***/
    return this.isValid() ? this.start.full() + '..' + this.end.full() : 'Invalid DateRange';
  };

  extend(DateRange, true, false, {

    /***
     * @method isValid()
     * @returns Boolean
     * @short Return true if the DateRange is valid, false otherwise.
     * @example
     *
     *   Date.range(Date.create('2003'), Date.create('2005')).isValid() -> true
     *   Date.range(Date.create('2005'), Date.create('2003')).isValid() -> false
     *
     ***/
    'isValid': function() {
      return this.start < this.end;
    },

    /***
     * @method duration()
     * @returns Number
     * @short Return the duration of the DateRange in milliseconds.
     * @example
     *
     *   Date.range(Date.create('2003'), Date.create('2005')).duration() -> 94694400000
     *
     ***/
    'duration': function() {
      return this.isValid() ? this.end.getTime() - this.start.getTime() : NaN;
    },

    /***
     * @method contains(<d>)
     * @returns Boolean
     * @short Return true if the <d> is contained inside the DateRange. <d> may be a date or another DateRange.
     * @example
     *
     *   Date.range(Date.create('2003'), Date.create('2005')).contains(Date.create('2004')) -> true
     *
     ***/
    'contains': function(obj) {
      var self = this, arr = obj.start && obj.end ? [obj.start, obj.end] : [obj];
      return arr.every(function(d) {
        return d >= self.start && d <= self.end;
      });
    },

    /***
     * @method every(<increment>, [fn])
     * @returns Array
     * @short Iterates through the DateRange for every <increment>, calling [fn] if it is passed. Returns an array of each increment visited.
     * @extra When <increment> is a number, increments will be to the exact millisecond. <increment> can also be a string in the format %{number} {unit}s%, in which case it will increment in the unit specified. Note that a discrepancy exists in the case of months, as %2.months()% is an approximation. Stepping through the actual months by passing %"2 months"% is usually preferable in this case.
     * @example
     *
     *   Date.range(new Date(2003, 1), new Date(2003, 3)).every("2 months") -> [...]
     *
     ***/
    'every': function(increment, fn) {
      var current = this.start.clone(), result = [], index = 0, params;
      if(isString(increment)) {
        current.advance(getDateParamsFromString(increment, 0), true);
        params = getDateParamsFromString(increment);
      } else {
        params = { 'milliseconds': increment };
      }
      while(current <= this.end) {
        result.push(current);
        if(fn) fn(current, index);
        current = current.clone().advance(params, true);
        index++;
      }
      return result;
    },

    /***
     * @method union(<range>)
     * @returns DateRange
     * @short Returns a new DateRange with the earliest starting point as its start, and the latest ending point as its end. If the two ranges do not intersect this will effecctively remove the "gap" between them.
     * @example
     *
     *   Date.range(new Date(2003, 1), new Date(2005, 1)).union(Date.range(new Date(2004, 1), new Date(2006, 1))) -> Jan 1, 2003..Jan 1, 2006
     *
     ***/
    'union': function(range) {
      return new DateRange(
        this.start < range.start ? this.start : range.start,
        this.end   > range.end   ? this.end   : range.end
      );
    },

    /***
     * @method intersect(<range>)
     * @returns DateRange
     * @short Returns a new DateRange with the latest starting point as its start, and the earliest ending point as its end. If the two ranges do not intersect this will effecctively produce an invalid range.
     * @example
     *
     *   Date.range(new Date(2003, 1), new Date(2005, 1)).intersect(Date.range(new Date(2004, 1), new Date(2006, 1))) -> Jan 1, 2004..Jan 1, 2005
     *
     ***/
    'intersect': function(range) {
      return new DateRange(
        this.start > range.start ? this.start : range.start,
        this.end   < range.end   ? this.end   : range.end
      );
    }

  });

  /***
   * @method each[Unit]([fn])
   * @returns Date
   * @short Increments through the date range for each [unit], calling [fn] if it is passed. Returns an array of each increment visited.
   *
   * @set
   *   eachMillisecond()
   *   eachSecond()
   *   eachMinute()
   *   eachHour()
   *   eachDay()
   *   eachWeek()
   *   eachMonth()
   *   eachYear()
   *
   * @example
   *
   *   Date.range(new Date(2003, 1), new Date(2003, 3)).eachMonth() -> [...]
   *   Date.range(new Date(2003, 1), new Date(2003, 3)).eachDay()   -> [...]
   *
   ***/
  extendSimilar(DateRange, true, false, 'Millisecond,Second,Minute,Hour,Day,Week,Month,Year', function(methods, name) {
    methods['each' + name] = function(fn) { return this.every(name, fn); }
  });

  extend(date, false, false, {

     /***
     * @method Date.range([start], [end])
     * @returns Nothing
     * @short Creates a new date range.
     * @extra If either [start] or [end] are null, they will default to the current date.
     *
     ***/
    'range': function(start, end) {
      return new DateRange(start, end);
    }

  });

