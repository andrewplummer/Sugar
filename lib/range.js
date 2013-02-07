

  /***
   * @package Range
   * @dependency date
   * @description Date Ranges define a range of time. They can enumerate over specific points within that range, and be manipulated and compared.
   *
   ***/

  function Range(start, end) {
    this.start    = start;
    this.end      = end;
    this.startVal = start.valueOf();
    this.endVal   = end.valueOf();
  };

  function getRangeMemberValue(m) {
    if(typeof m === 'string') {
      return m.charCodeAt(0);
    } else {
      return m.valueOf();
    }
  }

  function cloneRangeMember(obj) {
    // TODO: Arbitrary objects??????????????
    if(isDate(obj)) {
      return new date(obj.getTime());
    } else {
      return obj;
    }
  }


  function advanceCurrent(current, increment) {
    if(isDate(current)) {
      return advanceDate(current, increment);
    } else if(typeof current === 'string') {
      return string.fromCharCode(m.charCodeAt(0) + increment);
    } else if(typeof current === 'number') {
      return current + increment;
    } else if(typeof current['advance'] === 'function') {
      // hmmmm....
    } else {
      throw new Error('Value cannot be incremented.');
    }
  }

  function advanceDate(current, increment) {
    var unit, amt = increment, tmp, val, d;
    if(typeof increment === 'string') {
      tmp  = extractDurationFromString(increment);
      amt  = tmp[0];
      unit = tmp[1];
      val  = callDateGet(current, unit);
      d    = new date(current.getTime());
      callDateSet(d, unit, val + amt);
      return d;
    } else {
      return new date(current.getTime() + increment);
    }
  }

  /*
  var current = this.start.clone(), result = [], index = 0, params, isDay;
  if(isString(increment)) {
    current.advance(getDateParamsFromString(increment, 0), true);
    params = getDateParamsFromString(increment);
    isDay = increment.toLowerCase() === 'day';
  } else {
    params = { 'milliseconds': increment };
  }
  while(current <= this.end) {
    result.push(current);
    if(fn) fn(current, index);
    if(isDay && callDateGet(current, 'Hours') === 23) {
      // When DST traversal happens at 00:00 hours, the time is effectively
      // pushed back to 23:00, meaning 1) 00:00 for that day does not exist,
      // and 2) there is no difference between 23:00 and 00:00, as you are
      // "jumping" around in time. Hours here will be reset before the date
      // is advanced and the date will never in fact advance, so set the hours
      // directly ahead to the next day to avoid this problem.
      current = current.clone();
      callDateSet(current, 'Hours', 48);
    } else {
      current = current.clone().advance(params, true);
    }
    index++;
  }
  return result;
  */

  // 'toString' doesn't appear in a for..in loop in IE even though
  // hasOwnProperty reports true, so extend() can't be used here.
  // Also tried simply setting the prototype = {} up front for all
  // methods but GCC very oddly started dropping properties in the
  // object randomly (maybe because of the global scope?) hence
  // the need for the split logic here.
  //Range.prototype.toString = function() {
    /***
     * @method toString()
     * @returns String
     * @short Returns a string representation of the Range.
     * @example
     *
     *   Date.range('2003', '2005').toString() -> January 1, 2003..January 1, 2005
     *
     ***/
    //return this.isValid() ? this.start.full() + '..' + this.end.full() : 'Invalid Range';
  //};

  extend(Range, true, true, {

    toString: function() {
      return this.start + ".." + this.end;
    }

  });

  extend(Range, true, false, {

    /***
     * @method isValid()
     * @returns Boolean
     * @short Returns true if the Range is valid, false otherwise.
     * @example
     *
     *   Date.range('2003', '2005').isValid() -> true
     *   Date.range('2005', '2003').isValid() -> false
     *
     ***/
    'isValid': function() {
      return this.start < this.end && typeof this.start === typeof this.end;
    },

    /***
     * @method size()
     * @returns Number
     * @short Return the size of the Range. If the range contains dates, the value is in milliseconds.
     * @example
     *
     *   Date.range('2003', '2005').size() -> 94694400000
     *
     ***/
    'size': function() {
      return this.isValid() ? getRangeMemberValue(this.end) - getRangeMemberValue(this.start) : NaN;
    },

    /***
     * @method contains(<d>)
     * @returns Boolean
     * @short Returns true if <d> is contained inside the Range. <d> may be a date or another Range.
     * @example
     *
     *   Date.range('2003', '2005').contains(Date.create('2004')) -> true
     *
     ***/
    'contains': function(obj) {
      var self = this, arr;
      if(obj == null) return false;
      arr = obj.start && obj.end ? [obj.start, obj.end] : [obj];
      return arr.every(function(d) {
        return d >= self.start && d <= self.end;
      });
    },

    /***
     * @method every(<increment>, [fn])
     * @returns Array
     * @short Iterates through the Range for every <increment>, calling [fn] if it is passed. Returns an array of each increment visited.
     * @extra When <increment> is a number, increments will be to the exact millisecond. <increment> can also be a string in the format %{number} {unit}s%, in which case it will increment in the unit specified. Note that a discrepancy exists in the case of months, as %(2).months()% is an approximation. Stepping through the actual months by passing %"2 months"% is usually preferable in this case.
     * @example
     *
     *   Date.range('2003-01', '2003-03').every("2 months") -> [...]
     *
     ***/
    'every': function(increment, fn) {
      var current = this.start, result = [], index = 0;
      if(typeof increment !== 'number') {
        fn = increment;
        increment = 1;
      }

      while(current <= this.end) {
        result.push(current);
        if(fn) {
          fn(current, index);
        }
        current = advanceCurrent(current, increment);
        index++;
      }
      return result;



      /*
      var current = this.start.clone(), result = [], index = 0, params, isDay;
      if(isString(increment)) {
        current.advance(getDateParamsFromString(increment, 0), true);
        params = getDateParamsFromString(increment);
        isDay = increment.toLowerCase() === 'day';
      } else {
        params = { 'milliseconds': increment };
      }
      while(current <= this.end) {
        result.push(current);
        if(fn) fn(current, index);
        if(isDay && callDateGet(current, 'Hours') === 23) {
          // When DST traversal happens at 00:00 hours, the time is effectively
          // pushed back to 23:00, meaning 1) 00:00 for that day does not exist,
          // and 2) there is no difference between 23:00 and 00:00, as you are
          // "jumping" around in time. Hours here will be reset before the date
          // is advanced and the date will never in fact advance, so set the hours
          // directly ahead to the next day to avoid this problem.
          current = current.clone();
          callDateSet(current, 'Hours', 48);
        } else {
          current = current.clone().advance(params, true);
        }
        index++;
      }
      return result;
      */
    },

    /***
     * @method union(<range>)
     * @returns Range
     * @short Returns a new Range with the earliest starting point as its start, and the latest ending point as its end. If the two ranges do not intersect this will effectively remove the "gap" between them.
     * @example
     *
     *   Date.range('2003=01', '2005-01').union(Date.range('2004-01', '2006-01')) -> Jan 1, 2003..Jan 1, 2006
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
     * @short Returns a new Range with the latest starting point as its start, and the earliest ending point as its end. If the two ranges do not intersect this will effectively produce an invalid range.
     * @example
     *
     *   Date.range('2003-01', '2005-01').intersect(Date.range('2004-01', '2006-01')) -> Jan 1, 2004..Jan 1, 2005
     *
     ***/
    'intersect': function(range) {
      return new Range(
        this.start > range.start ? this.start : range.start,
        this.end   < range.end   ? this.end   : range.end
      );
    },

    /***
     * @method clone()
     * @returns Range
     * @short Clones the Range.
     * @example
     *
     *   Date.range('2003-01', '2005-01').intersect(Date.range('2004-01', '2006-01')) -> Jan 1, 2004..Jan 1, 2005
     *
     ***/
    'clone': function(range) {
      return new Range(this.start, this.end);
    },

    /***
     * @method clamp(<obj>)
     * @returns Mixed
     * @short Clamps <obj> to be within the range.
     * @example
     *
     *   // TODO
     *   Date.range('2003-01', '2005-01').intersect(Date.range('2004-01', '2006-01')) -> Jan 1, 2004..Jan 1, 2005
     *
     ***/
    'clamp': function(obj) {
      var val = obj.valueOf(), clamped;
      if(val < this.startVal) {
        clamped = this.start;
      } else if(val > this.endVal) {
        clamped = this.end;
      } else {
        clamped = obj;
      }
      return cloneRangeMember(clamped);
    }

  });

  /***
   * @method each[Unit]([fn])
   * @returns Date
   * @short Increments through the date range for each [unit], calling [fn] if it is passed. Returns an array of each increment visited.
   *
   * @set
   *   eachMillisecond
   *   eachSecond
   *   eachMinute
   *   eachHour
   *   eachDay
   *   eachWeek
   *   eachMonth
   *   eachYear
   *
   * @example
   *
   *   Date.range('2003-01', '2003-02').eachMonth()     -> [...]
   *   Date.range('2003-01-15', '2003-01-16').eachDay() -> [...]
   *
   ***/
  extendSimilar(Range, true, false, 'Millisecond,Second,Minute,Hour,Day,Week,Month,Year', function(methods, name) {
    methods['each' + name] = function(fn) { return this.every(name, fn); }
  });

  extend(Range, true, false, {

     /***
     * @method step()
     * @returns Array
     * @short Alias for %every%.
     *
     * @example
     *
     +   range.step(fn);    -> iterates over every step
     +   range.step(2, fn); -> iterates over every 2 steps
     *
     ***/
    'step': Range.prototype.every

  });


  /***
   * Date module
   ***/

  [number, string, date].forEach(function(klass) {
     extend(klass, false, false, {

       /***
       * @method Date.range([start], [end])
       * @returns Range
       * @short Creates a new date range.
       * @extra If either [start] or [end] are null, they will default to the current date.
       *
       ***/
      'range': function(start, end) {
        return new Range(start, end);
      }

    });

    extend(klass, true, false, {

       /***
       * @method Number.clampXXXXXXXXXXXXXXXxx([start], [end])
       * @returns Range
       * @short Creates a new date range.
       * @extra If either [start] or [end] are null, they will default to the current date.
       *
       ***/
      'clamp': function(start, end) {
        return new Range(start, end).clamp(this.valueOf());
      }

    });
  });


