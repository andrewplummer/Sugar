  'use strict';

  /***
   * @package ES6
   * @description Methods that provide some basic ES6 compatibility. This package is intended to provide the base for Sugar functionality, not as a full polyfill suite.
   *
   ***/

  /*** @namespace String */

  function getCoercedStringSubject(obj) {
    if (obj == null) {
      throw new TypeError('String required.');
    }
    return String(obj);
  }

  function getCoercedSearchString(obj) {
    if (isRegExp(obj)) {
      throw new TypeError();
    }
    return String(obj);
  }

  defineInstancePolyfill(sugarString, {

    /***
     * @method includes(<search>, [pos] = 0)
     * @returns Boolean
     * @short Returns true if <search> is contained within the string.
     * @extra Search begins at [pos], which defaults to the entire string length.
     * @example
     *
     *   'jumpy'.includes('py')      -> true
     *   'broken'.includes('ken', 3) -> true
     *   'broken'.includes('bro', 3) -> false
     *
     ***/
    'includes': function(searchString) {
      // Force compiler to respect argument length.
      var argLen = arguments.length, pos = arguments[1];
      var str = getCoercedStringSubject(this);
      searchString = getCoercedSearchString(searchString);
      return str.indexOf(searchString, pos) !== -1;
    },

    /***
     * @method startsWith(<search>, [pos] = 0)
     * @returns Boolean
     * @short Returns true if the string starts with <search>, which must be a string.
     * @extra Search begins at [pos], which defaults to the entire string length.
     * @example
     *
     *   'hello'.startsWith('hell')   -> true
     *   'hello'.startsWith('HELL')   -> false
     *   'hello'.startsWith('ell', 1) -> true
     *
     ***/
    'startsWith': function(searchString) {
      // Force compiler to respect argument length.
      var argLen = arguments.length, position = arguments[1];
      var str, start, pos, len, searchLength;
      str = getCoercedStringSubject(this);
      searchString = getCoercedSearchString(searchString);
      pos = +position || 0;
      len = str.length;
      start = min(max(pos, 0), len);
      searchLength = searchString.length;
      if (searchLength + start > len) {
        return false;
      }
      if (str.substr(start, searchLength) === searchString) {
        return true;
      }
      return false;
    },

    /***
     * @method endsWith(<search>, [pos] = length)
     * @returns Boolean
     * @short Returns true if the string ends with <search>, which must be a string.
     * @extra Search ends at [pos], which defaults to the entire string length.
     * @example
     *
     *   'jumpy'.endsWith('py')    -> true
     *   'jumpy'.endsWith('MPY')   -> false
     *   'jumpy'.endsWith('mp', 4) -> false
     *
     ***/
    'endsWith': function(searchString) {
      // Force compiler to respect argument length.
      var argLen = arguments.length, endPosition = arguments[1];
      var str, start, end, pos, len, searchLength;
      str = getCoercedStringSubject(this);
      searchString = getCoercedSearchString(searchString);
      len = str.length;
      pos = len;
      if (isDefined(endPosition)) {
        pos = +endPosition || 0;
      }
      end = min(max(pos, 0), len);
      searchLength = searchString.length;
      start = end - searchLength;
      if (start < 0) {
        return false;
      }
      if (str.substr(start, searchLength) === searchString) {
        return true;
      }
      return false;
    },

    /***
     * @method repeat([num] = 0)
     * @returns String
     * @short Returns the string repeated [num] times.
     * @example
     *
     *   'jumpy'.repeat(2) -> 'jumpyjumpy'
     *   'a'.repeat(5)     -> 'aaaaa'
     *   'a'.repeat(0)     -> ''
     *
     ***/
    'repeat': function(num) {
      num = coercePositiveInteger(num);
      return repeatString(this, num);
    }

  });


  /*** @namespace Number */

  defineStaticPolyfill(sugarNumber, {

    /***
     * @method Number.isNaN(<value>)
     * @returns Boolean
     * @short Returns true only if the number is %NaN%.
     * @extra This is differs from the global %isNaN%, which returns true for anything that is not a number.
     * @example
     *
     *   Number.isNaN(NaN) -> true
     *   Number.isNaN('n') -> false
     *
     ***/
    'isNaN': function(value) {
      return value !== value;
    }

  })



  /*** @namespace Array */

  function getCoercedObject(obj) {
    if (obj == null) {
      throw new TypeError('Object required.');
    }
    return coercePrimitiveToObject(obj);
  }

  defineStaticPolyfill(sugarArray, {

    /***
     * @method Array.from(<a>, [map], [context])
     * @returns Mixed
     * @short Creates an array from an array-like object.
     * @extra If a function is passed for [map], it will be map each element of the array. [context] is the %this% object if passed.
     * @example
     *
     *   Array.from({0:'a',1:'b',length:2}); -> ['a','b']
     *
     ***/
    'from': function(a) {
      // Force compiler to respect argument length.
      var argLen = arguments.length, map = arguments[1], context = arguments[2];
      var len, arr;
      if (isDefined(map)) {
        assertCallable(map);
      }
      a = getCoercedObject(a);
      len = trunc(max(0, a.length || 0));
      if (!isArrayIndex(len)) {
        throw new RangeError('Invalid array length');
      }
      if (isFunction(this)) {
        arr = new this(len)
        arr.length = len;
      } else {
        arr = new Array(len);
      }
      for (var i = 0; i < len; i++) {
        setProperty(arr, i, isDefined(map) ? map.call(context, a[i], i) : a[i], true);
      }
      return arr;
    }

  });

  defineInstancePolyfill(sugarArray, {

    /***
     * @method find(<f>, [context])
     * @returns Mixed
     * @short Returns the first element that matches <f>.
     * @extra [context] is the %this% object if passed. When <f> is a function, will use native implementation if it exists. <f> will also match a string, number, array, object, or alternately test against a function or regex. This method implements %array_matching%.
     * @example
     *
     *   [{a:1,b:2},{a:1,b:3},{a:1,b:4}].find(function(n) {
     *     return n['a'] == 1;
     *   });                                  -> {a:1,b:3}
     *   ['cuba','japan','canada'].find(/^c/) -> 'cuba'
     *
     ***/
    'find': function(f) {
      // Force compiler to respect argument length.
      var argLen = arguments.length, context = arguments[1];
      assertCallable(f);
      for (var i = 0, len = this.length; i < len; i++) {
        if (f.call(context, this[i], i, this)) {
          return this[i];
        }
      }
    },

    /***
     * @method findIndex(<f>, [context])
     * @returns Number
     * @short Returns the index of the first element that matches <f> or -1 if not found.
     * @extra [context] is the %this% object if passed. When <f> is a function, will use native implementation if it exists. <f> will also match a string, number, array, object, or alternately test against a function or regex. This method implements %array_matching%.
     *
     * @example
     *
     *   [1,2,3,4].findIndex(function(n) {
     *     return n % 2 == 0;
     *   }); -> 1
     *   [1,2,3,4].findIndex(3);               -> 2
     *   ['one','two','three'].findIndex(/t/); -> 1
     *
     ***/
    'findIndex': function(f) {
      // Force compiler to respect argument length.
      var argLen = arguments.length, context = arguments[1];
      assertCallable(f);
      for (var i = 0, len = this.length; i < len; i++) {
        if (f.call(context, this[i], i, this)) {
          return i;
        }
      }
      return -1;
    }

  });
