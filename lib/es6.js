'use strict';

/***
 * @module ES6
 * @description Polyfills that provide basic ES6 compatibility. This module
 *              provides the base for Sugar functionality, but is not a full
 *              polyfill suite.
 *
 ***/


/*** @namespace String ***/

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
   * @method includes(search, [pos] = 0)
   * @returns Boolean
   * @polyfill ES6
   * @short Returns true if `search` is contained within the string.
   * @extra Search begins at [pos], which defaults to the beginning of the
   *        string. Sugar enhances this method to allow matching a regex.
   *
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
   * @method startsWith(search, [pos] = 0)
   * @returns Boolean
   * @polyfill ES6
   * @short Returns true if the string starts with substring `search`.
   * @extra Search begins at [pos], which defaults to the entire string length.
   *
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
   * @method endsWith(search, [pos] = length)
   * @returns Boolean
   * @polyfill ES6
   * @short Returns true if the string ends with substring `search`.
   * @extra Search ends at [pos], which defaults to the entire string length.
   *
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
   * @polyfill ES6
   * @short Returns the string repeated [num] times.
   *
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


/*** @namespace Number ***/

// istanbul ignore next
defineStaticPolyfill(sugarNumber, {

  /***
   * @method isNaN(value)
   * @returns Boolean
   * @polyfill ES6
   * @static
   * @short Returns true only if the number is `NaN`.
   * @extra This is differs from the global `isNaN`, which returns true for
   *        anything that is not a number.
   *
   * @example
   *
   *   Number.isNaN(NaN) -> true
   *   Number.isNaN('n') -> false
   *
   ***/
  'isNaN': function(obj) {
    return isRealNaN(obj);
  }

});


/*** @namespace Array ***/

function getCoercedObject(obj) {
  if (obj == null) {
    throw new TypeError('Object required.');
  }
  return coercePrimitiveToObject(obj);
}

defineStaticPolyfill(sugarArray, {

  /***
   * @method from(a, [mapFn], [context])
   * @returns Mixed
   * @polyfill ES6
   * @static
   * @short Creates an array from an array-like object.
   * @extra If [mapFn] is passed, it will be map each element of the array.
   *        [context] is the `this` object if passed.
   *
   * @callback mapFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   Array.from({0:'a',1:'b',length:2}); -> ['a','b']
   *
   ***/
  'from': function(a) {
    // Force compiler to respect argument length.
    var argLen = arguments.length, mapFn = arguments[1], context = arguments[2];
    var len, arr;
    if (isDefined(mapFn)) {
      assertCallable(mapFn);
    }
    a = getCoercedObject(a);
    len = trunc(max(0, a.length || 0));
    if (!isArrayIndex(len)) {
      throw new RangeError('Invalid array length');
    }
    if (isFunction(this)) {
      arr = new this(len);
      arr.length = len;
    } else {
      arr = new Array(len);
    }
    for (var i = 0; i < len; i++) {
      setProperty(arr, i, isDefined(mapFn) ? mapFn.call(context, a[i], i) : a[i], true);
    }
    return arr;
  }

});

defineInstancePolyfill(sugarArray, {

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
