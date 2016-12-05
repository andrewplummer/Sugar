'use strict';

/***
 * @module ES5
 * @description Functions and polyfill methods that fix ES5 functionality. This
 *              module is excluded from default builds, and can be included if
 *              you need legacy browser support (IE8 and below).
 *
 ***/

// Non-enumerable properties on Object.prototype. In early JScript implementations
// (< IE9) these will shadow object properties and break for..in loops.
var DONT_ENUM_PROPS = [
  'valueOf',
  'toString',
  'constructor',
  'isPrototypeOf',
  'hasOwnProperty',
  'toLocaleString',
  'propertyIsEnumerable'
];

/***
 * @fix
 * @short Fixes DontEnum bug for iteration methods in < IE9.
 ***/
function buildDontEnumFix() {
  if (!({toString:1}).propertyIsEnumerable('toString')) {
    var forEachEnumerableProperty = forEachProperty;
    forEachProperty = function(obj, fn) {
      forEachEnumerableProperty(obj, fn);
      for (var i = 0, key; key = DONT_ENUM_PROPS[i]; i++) {
        if (hasOwn(obj, key)) {
          if(fn.call(obj, obj[key], key, obj) === false) break;
        }
      }
    };
  }
}

/***
 * @fix
 * @short Adds native methods to chainables in < IE9.
 ***/
function buildChainableNativeMethodsFix() {
  if (!Object.getOwnPropertyNames) {
    defineNativeMethodsOnChainable();
  }
}

// Polyfilled methods will automatically be added to the chainable prototype.
// However, Object.getOwnPropertyNames cannot be shimmed for non-enumerable
// properties, so if it does not exist, then the only way to access native
// methods previous to ES5 is to provide them as a list of tokens here.
function defineNativeMethodsOnChainable() {

  var nativeTokens = {
    'Function': 'apply,call',
    'RegExp':   'compile,exec,test',
    'Number':   'toExponential,toFixed,toLocaleString,toPrecision',
    'Object':   'hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString',
    'Array':    'concat,join,pop,push,reverse,shift,slice,sort,splice,toLocaleString,unshift',
    'Date':     'getTime,getTimezoneOffset,setTime,toDateString,toGMTString,toLocaleDateString,toLocaleString,toLocaleTimeString,toTimeString,toUTCString',
    'String':   'anchor,big,blink,bold,charAt,charCodeAt,concat,fixed,fontcolor,fontsize,indexOf,italics,lastIndexOf,link,localeCompare,match,replace,search,slice,small,split,strike,sub,substr,substring,sup,toLocaleLowerCase,toLocaleUpperCase,toLowerCase,toUpperCase'
  };

  var dateTokens = 'FullYear,Month,Date,Hours,Minutes,Seconds,Milliseconds'.split(',');

  function addDateTokens(prefix, arr) {
    for (var i = 0; i < dateTokens.length; i++) {
      arr.push(prefix + dateTokens[i]);
    }
  }

  forEachProperty(nativeTokens, function(str, name) {
    var tokens = str.split(',');
    if (name === 'Date') {
      addDateTokens('get', tokens);
      addDateTokens('set', tokens);
      addDateTokens('getUTC', tokens);
      addDateTokens('setUTC', tokens);
    }
    tokens.push('toString');
    mapNativeToChainable(name, tokens);
  });

}


buildDontEnumFix();
buildChainableNativeMethodsFix();


/*** @namespace Object ***/

function assertNonNull(obj) {
  if (obj == null) {
    throw new TypeError('Object required');
  }
}

defineStaticPolyfill(sugarObject, {

  'keys': function(obj) {
    var keys = [];
    assertNonNull(obj);
    forEachProperty(coercePrimitiveToObject(obj), function(val, key) {
      keys.push(key);
    });
    return keys;
  }

});


/*** @namespace Array ***/

function arrayIndexOf(arr, search, fromIndex, fromRight) {
  var length = arr.length, defaultFromIndex, index, increment;

  increment = fromRight ? -1 : 1;
  defaultFromIndex = fromRight ? length - 1 : 0;
  fromIndex = trunc(fromIndex);
  if (!fromIndex && fromIndex !== 0) {
    fromIndex = defaultFromIndex;
  }
  if (fromIndex < 0) {
    fromIndex = length + fromIndex;
  }
  if ((!fromRight && fromIndex < 0) || (fromRight && fromIndex >= length)) {
    fromIndex = defaultFromIndex;
  }

  index = fromIndex;

  while((fromRight && index >= 0) || (!fromRight && index < length)) {
    if (!(index in arr)) {
      return sparseIndexOf(arr, search, fromIndex, fromRight);
    }
    if (isArrayIndex(index) && arr[index] === search) {
      return index;
    }
    index += increment;
  }
  return -1;
}

function sparseIndexOf(arr, search, fromIndex, fromRight) {
  var indexes = getSparseArrayIndexes(arr, fromIndex, false, fromRight), index;
  indexes.sort(function(a, b) {
    return fromRight ? b - a : a - b;
  });
  while ((index = indexes.shift()) !== undefined) {
    if (arr[index] === search) {
      return +index;
    }
  }
  return -1;
}

function arrayReduce(arr, fn, initialValue, fromRight) {
  var length = arr.length, count = 0, defined = isDefined(initialValue), result, index;
  assertCallable(fn);
  if (length == 0 && !defined) {
    throw new TypeError('Reduce called on empty array with no initial value');
  } else if (defined) {
    result = initialValue;
  } else {
    result = arr[fromRight ? length - 1 : count];
    count++;
  }
  while(count < length) {
    index = fromRight ? length - count - 1 : count;
    if (index in arr) {
      result = fn(result, arr[index], index, arr);
    }
    count++;
  }
  return result;
}

defineStaticPolyfill(sugarArray, {

  /***
   *
   * @method isArray(obj)
   * @returns Boolean
   * @polyfill ES5
   * @static
   * @short Returns true if `obj` is an Array.
   *
   * @example
   *
   *   Array.isArray(3)        -> false
   *   Array.isArray(true)     -> false
   *   Array.isArray('wasabi') -> false
   *   Array.isArray([1,2,3])  -> true
   *
   ***/
  'isArray': function(obj) {
    return isArray(obj);
  }

});

defineInstancePolyfill(sugarArray, {

  'every': function(fn) {
    // Force compiler to respect argument length.
    var argLen = arguments.length, context = arguments[1];
    var length = this.length, index = 0;
    assertCallable(fn);
    while(index < length) {
      if (index in this && !fn.call(context, this[index], index, this)) {
        return false;
      }
      index++;
    }
    return true;
  },

  'some': function(fn) {
    // Force compiler to respect argument length.
    var argLen = arguments.length, context = arguments[1];
    var length = this.length, index = 0;
    assertCallable(fn);
    while(index < length) {
      if (index in this && fn.call(context, this[index], index, this)) {
        return true;
      }
      index++;
    }
    return false;
  },

  'map': function(fn) {
    // Force compiler to respect argument length.
    var argLen = arguments.length, context = arguments[1];
    var length = this.length, index = 0, result = new Array(length);
    assertCallable(fn);
    while(index < length) {
      if (index in this) {
        result[index] = fn.call(context, this[index], index, this);
      }
      index++;
    }
    return result;
  },

  'filter': function(fn) {
    // Force compiler to respect argument length.
    var argLen = arguments.length, context = arguments[1];
    var length = this.length, index = 0, result = [];
    assertCallable(fn);
    while(index < length) {
      if (index in this && fn.call(context, this[index], index, this)) {
        result.push(this[index]);
      }
      index++;
    }
    return result;
  },

  /***
   * @method indexOf(search, [fromIndex] = 0)
   * @returns Number
   * @polyfill ES5
   * @short Searches the array and returns the first index where `search` occurs,
   *        or `-1` if the element is not found.
   * @extra [fromIndex] is the index from which to begin the search. This
   *        method performs a simple strict equality comparison on `search`.
   *        Sugar does not enhance this method to support `enhanced matching`.
   *        For such functionality, use the `findIndex` method instead.
   *
   * @example
   *
   *   [1,2,3].indexOf(3) -> 1
   *   [1,2,3].indexOf(7) -> -1
   *
   ***/
  'indexOf': function(search) {
    // Force compiler to respect argument length.
    var argLen = arguments.length, fromIndex = arguments[1];
    if (isString(this)) return this.indexOf(search, fromIndex);
    return arrayIndexOf(this, search, fromIndex);
  },

  /***
   * @method lastIndexOf(search, [fromIndex] = array.length - 1)
   * @returns Number
   * @polyfill ES5
   * @short Searches the array from the end and returns the first index where
   *        `search` occurs, or `-1` if the element is not found.
   * @extra [fromIndex] is the index from which to begin the search. This method
   *        performs a simple strict equality comparison on `search`.
   *        Sugar does not enhance this method to support `enhanced matching`.
   *
   * @example
   *
   *   [1,2,1].lastIndexOf(1) -> 2
   *   [1,2,1].lastIndexOf(7) -> -1
   *
   ***/
  'lastIndexOf': function(search) {
    // Force compiler to respect argument length.
    var argLen = arguments.length, fromIndex = arguments[1];
    if (isString(this)) return this.lastIndexOf(search, fromIndex);
    return arrayIndexOf(this, search, fromIndex, true);
  },

  /***
   * @method forEach([eachFn], [context])
   * @polyfill ES5
   * @short Iterates over the array, calling [eachFn] on each loop.
   * @extra [context] becomes the `this` object.
   *
   * @callback eachFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   ['a','b','c'].forEach(function(a) {
   *     // Called 3 times: 'a','b','c'
   *   });
   *
   ***/
  'forEach': function(eachFn) {
    // Force compiler to respect argument length.
    var argLen = arguments.length, context = arguments[1];
    var length = this.length, index = 0;
    assertCallable(eachFn);
    while(index < length) {
      if (index in this) {
        eachFn.call(context, this[index], index, this);
      }
      index++;
    }
  },

  /***
   * @method reduce(reduceFn, [init])
   * @returns Mixed
   * @polyfill ES5
   * @short Reduces the array to a single result.
   * @extra This operation is sometimes called "accumulation", as it takes the
   *        result of the last iteration of `reduceFn` and passes it as the first
   *        argument to the next iteration, "accumulating" that value as it goes.
   *        The return value of this method will be the return value of the final
   *        iteration of `reduceFn`. If [init] is passed, it will be the initial
   *        "accumulator" (the first argument). If [init] is not passed, then it
   *        will take the first element in the array, and `reduceFn` will not be
   *        called for that element.
   *
   * @callback reduceFn
   *
   *   acc  The "accumulator". Either [init], the result of the last iteration
   *        of `reduceFn`, or the first element of the array.
   *   el   The current element for this iteration.
   *   idx  The current index for this iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3].reduce(function(a, b) {
   *     return a - b; // 1 - 2 - 3
   *   });
   *
   *   [1,2,3].reduce(function(a, b) {
   *     return a - b; // 100 - 1 - 2 - 3
   *   }, 100);
   *
   ***/
  'reduce': function(reduceFn) {
    // Force compiler to respect argument length.
    var argLen = arguments.length, context = arguments[1];
    return arrayReduce(this, reduceFn, context);
  },

  /***
   * @method reduceRight([reduceFn], [init])
   * @returns Mixed
   * @polyfill ES5
   * @short Similar to `Array#reduce`, but operates on the elements in reverse.
   *
   * @callback reduceFn
   *
   *   acc  The "accumulator", either [init], the result of the last iteration
   *        of `reduceFn`, or the last element of the array.
   *   el   The current element for this iteration.
   *   idx  The current index for this iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3].reduceRight(function(a, b) {
   *     return a - b; // 3 - 2 - 1
   *   });
   *
   *   [1,2,3].reduceRight(function(a, b) {
   *     return a - b; // 100 - 3 - 2 - 1
   *   }, 100);
   *
   *
   ***/
  'reduceRight': function(reduceFn) {
    // Force compiler to respect argument length.
    var argLen = arguments.length, context = arguments[1];
    return arrayReduce(this, reduceFn, context, true);
  }

});


/*** @namespace String ***/

var TRIM_REG = RegExp('^[' + TRIM_CHARS + ']+|['+ TRIM_CHARS +']+$', 'g');

defineInstancePolyfill(sugarString, {
  /***
   * @method trim()
   * @returns String
   * @polyfill ES5
   * @short Removes leading and trailing whitespace from the string.
   * @extra Whitespace is defined as line breaks, tabs, and any character in the
   *        "Space, Separator" Unicode category, conforming to the the ES5 spec.
   *
   * @example
   *
   *   '   wasabi   '.trim()      -> 'wasabi'
   *   '   wasabi   '.trimLeft()  -> 'wasabi   '
   *   '   wasabi   '.trimRight() -> '   wasabi'
   *
   ***/
  'trim': function() {
    return this.toString().replace(TRIM_REG, '');
  }
});


/*** @namespace Function ***/

defineInstancePolyfill(sugarFunction, {

   /***
   * @method bind(context, [arg1], ...)
   * @returns Function
   * @polyfill ES5
   * @short Binds `context` as the `this` object for the function when it is
   *        called. Also allows currying an unlimited number of parameters.
   * @extra "currying" means setting parameters ([arg1], [arg2], etc.) ahead of
   *        time so that they are passed when the function is called later. If
   *        you pass additional parameters when the function is actually called,
   *        they will be added to the end of the curried parameters.
   *
   * @example
   *
   *   logThis.bind('woof')()   -> logs 'woof' as its this object
   *   addArgs.bind(1, 2, 3)()  -> returns 5 with 1 as the this object
   *   addArgs.bind(1)(2, 3, 4) -> returns 9
   *
   ***/
  'bind': function(context) {
    // Optimized: no leaking arguments
    var boundArgs = []; for(var $i = 1, $len = arguments.length; $i < $len; $i++) boundArgs.push(arguments[$i]);
    var fn = this, bound;
    assertCallable(this);
    bound = function() {
      // Optimized: no leaking arguments
      var args = []; for(var $i = 0, $len = arguments.length; $i < $len; $i++) args.push(arguments[$i]);
      return fn.apply(fn.prototype && this instanceof fn ? this : context, boundArgs.concat(args));
    };
    bound.prototype = this.prototype;
    return bound;
  }

});


/*** @namespace Date ***/

defineStaticPolyfill(sugarDate, {

   /***
   * @method now()
   * @returns String
   * @polyfill ES5
   * @static
   * @short Returns the current time as a Unix timestamp.
   * @extra The number of milliseconds since January 1st, 1970 00:00:00 (UTC).
   *
   * @example
   *
   *   Date.now() -> ex. 1311938296231
   *
   ***/
  'now': function() {
    return new Date().getTime();
  }

});

function hasISOSupport() {
  var d = new Date(Date.UTC(2000, 0));
  return !!d.toISOString && d.toISOString() === '2000-01-01T00:00:00.000Z';
}

defineInstancePolyfill(sugarDate, {

   /***
   * @method toISOString()
   * @returns String
   * @polyfill ES5
   * @short Formats the string to ISO8601 format.
   * @extra This will always format as UTC time.
   *
   * @example
   *
   *   Date.create().toISOString() -> ex. 2011-07-05 12:24:55.528Z
   *
   ***/
  'toISOString': function() {
    return padNumber(this.getUTCFullYear(), 4) + '-' +
           padNumber(this.getUTCMonth() + 1, 2) + '-' +
           padNumber(this.getUTCDate(), 2) + 'T' +
           padNumber(this.getUTCHours(), 2) + ':' +
           padNumber(this.getUTCMinutes(), 2) + ':' +
           padNumber(this.getUTCSeconds(), 2) + '.' +
           padNumber(this.getUTCMilliseconds(), 3) + 'Z';
  },

   /***
   * @method toJSON([key])
   * @returns String
   * @polyfill ES5
   * @short Returns a JSON representation of the date.
   * @extra This is effectively an alias for `toISOString`. Will always return
   *        the date in UTC time. [key] is ignored.
   *
   * @example
   *
   *   Date.create().toJSON() -> ex. 2011-07-05 12:24:55.528Z
   *
   ***/
  'toJSON': function(key) {
    // Force compiler to respect argument length.
    var argLen = arguments.length;
    return this.toISOString(key);
  }

}, !hasISOSupport());
