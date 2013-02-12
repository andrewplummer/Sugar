

  /***
   * @package Range
   * @dependency core
   * @description Ranges allow creating spans of numbers, strings, or dates. They can enumerate over specific points within that range, and be manipulated and compared.
   *
   ***/

  function Range(start, end) {
    var tmp;
    if(start > end) {
      tmp   = start;
      start = end;
      end   = tmp;
    }
    this.start = cloneRangeMember(start);
    this.end   = cloneRangeMember(end);
  };

  function getRangeMemberValue(m) {
    return isString(m) ? m.charCodeAt(0) : m;
  }

  function cloneRangeMember(obj) {
    if(isDate(obj)) {
      return new date(obj.getTime());
    } else {
      return obj ? obj.valueOf() : obj;
    }
  }

  function isValidRangeMember(m) {
    return !!m || m === 0;
  }

  function incrementRangeMember(obj, increment) {
    if(isDate(obj)) {
      return advanceDate(obj, increment);
    } else if(isString(obj)) {
      return string.fromCharCode(m.charCodeAt(0) + increment);
    } else if(isNumber(obj)) {
      return obj + increment;
    }
  }

  function advanceDate(current, increment) {
    var unit, amt = increment, tmp, val, d;
    if(isString(increment)) {
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

  extend(Range, true, false, {

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
      return isValidRangeMember(this.start) &&
             isValidRangeMember(this.end) &&
             this.start < this.end &&
             typeof this.start === typeof this.end;
    },

    /***
     * @method size()
     * @returns Number
     * @short Return the size of the range. If the range is a date range, the value is in milliseconds.
     * @extra The size includes both the start and the end.
     * @example
     *
     *   Number.range(5, 10).size()                              -> 6
     *   Date.range(new Date(2003, 0), new Date(2005, 0)).size() -> 94694400000
     *
     ***/
    'size': function() {
      return this.isValid() ? getRangeMemberValue(this.end) - getRangeMemberValue(this.start) + 1 : NaN;
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
      arr = obj.start && obj.end ? [obj.start, obj.end] : [obj];
      return arr.every(function(d) {
        return d >= self.start && d <= self.end;
      });
    },

    /***
     * @method every(<increment>, [fn])
     * @returns Array
     * @short Iterates through the range for every <increment>, calling [fn] if it is passed. Returns an array of each increment visited.
     * @extra When <increment> is a number, increments will be to the exact millisecond. In the case of date ranges, <increment> can also be a string in the format %{number} {unit}s%, in which case it will increment in the unit specified. Note that a discrepancy exists in the case of months, as %(2).months()% is an approximation. Stepping through the actual months by passing %"2 months"% is usually preferable in this case.
     * @example
     *
     *   Number.range(2, 8).every(2)                                       -> [2,4,6,8]
     *   Date.range(new Date(2003, 1), new Date(2003,3)).every("2 months") -> [...]
     *
     ***/
    'every': function(increment, fn) {
      var current = this.start, result = [], index = 0;
      if(isFunction(increment)) {
        fn = increment;
        increment = 1;
      }
      while(current <= this.end) {
        result.push(current);
        if(fn) {
          fn(current, index);
        }
        current = incrementRangeMember(current, increment);
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
     *   Number.range(1, 3).union(Number.range(2, 5) -> 1..5
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
     *   Number.range(1, 5).intersect(Number.range(4, 8) -> 4..5
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
      var clamped;
      if(obj < this.start) {
        clamped = this.start;
      } else if(obj > this.end) {
        clamped = this.end;
      } else {
        clamped = obj;
      }
      return cloneRangeMember(clamped);
    }

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
        if(klass.create) {
          start = klass.create(start);
          end   = klass.create(end);
        }
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
        return new Range(start, end).clamp(this);
      }

    });
  });


