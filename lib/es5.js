
  'use strict';

  /***
   * @package ES5
   * @description Shim methods that provide ES5 compatible functionality. This package can be excluded if you do not require legacy browser support (IE8 and below).
   *
   ***/


  /***
   * Object module
   *
   ***/

  extend(object, false, false, {

    'keys': function(obj) {
      var keys = [];
      if(!isObjectType(obj) && !isRegExp(obj) && !isFunction(obj)) {
        throw new TypeError('Object required');
      }
      iterateOverObject(obj, function(key, value) {
        keys.push(key);
      });
      return keys;
    }

  });


  /***
   * Array module
   *
   ***/

  // ECMA5 methods

  function arrayIndexOf(arr, search, fromIndex, increment) {
    var length = arr.length,
        fromRight = increment == -1,
        start = fromRight ? length - 1 : 0,
        index = toIntegerWithDefault(fromIndex, start);
    if(index < 0) {
      index = length + index;
    }
    if((!fromRight && index < 0) || (fromRight && index >= length)) {
      index = start;
    }
    while((fromRight && index >= 0) || (!fromRight && index < length)) {
      if(arr[index] === search) {
        return index;
      }
      index += increment;
    }
    return -1;
  }

  function arrayReduce(arr, fn, initialValue, fromRight) {
    var length = arr.length, count = 0, defined = isDefined(initialValue), result, index;
    checkCallback(fn);
    if(length == 0 && !defined) {
      throw new TypeError('Reduce called on empty array with no initial value');
    } else if(defined) {
      result = initialValue;
    } else {
      result = arr[fromRight ? length - 1 : count];
      count++;
    }
    while(count < length) {
      index = fromRight ? length - count - 1 : count;
      if(index in arr) {
        result = fn(result, arr[index], index, arr);
      }
      count++;
    }
    return result;
  }

  function toIntegerWithDefault(i, d) {
    if(isNaN(i)) {
      return d;
    } else {
      return parseInt(i >> 0);
    }
  }

  function checkFirstArgumentExists(args) {
    if(args.length === 0) {
      throw new TypeError('First argument must be defined');
    }
  }




  extend(array, false, false, {

    /***
     *
     * @method Array.isArray(<obj>)
     * @returns Boolean
     * @short Returns true if <obj> is an Array.
     * @extra This method is provided for browsers that don't support it internally.
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


  extend(array, true, false, {

    /***
     * @method every(<f>, [scope])
     * @returns Boolean
     * @short Returns true if all elements in the array match <f>.
     * @extra [scope] is the %this% object. %all% is provided an alias. In addition to providing this method for browsers that don't support it natively, this method also implements @array_matching.
     * @example
     *
     +   ['a','a','a'].every(function(n) {
     *     return n == 'a';
     *   });
     *   ['a','a','a'].every('a')   -> true
     *   [{a:2},{a:2}].every({a:2}) -> true
     ***/
    'every': function(fn, scope) {
      var length = this.length, index = 0;
      checkFirstArgumentExists(arguments);
      while(index < length) {
        if(index in this && !fn.call(scope, this[index], index, this)) {
          return false;
        }
        index++;
      }
      return true;
    },

    /***
     * @method some(<f>, [scope])
     * @returns Boolean
     * @short Returns true if any element in the array matches <f>.
     * @extra [scope] is the %this% object. %any% is provided as an alias. In addition to providing this method for browsers that don't support it natively, this method also implements @array_matching.
     * @example
     *
     +   ['a','b','c'].some(function(n) {
     *     return n == 'a';
     *   });
     +   ['a','b','c'].some(function(n) {
     *     return n == 'd';
     *   });
     *   ['a','b','c'].some('a')   -> true
     *   [{a:2},{b:5}].some({a:2}) -> true
     ***/
    'some': function(fn, scope) {
      var length = this.length, index = 0;
      checkFirstArgumentExists(arguments);
      while(index < length) {
        if(index in this && fn.call(scope, this[index], index, this)) {
          return true;
        }
        index++;
      }
      return false;
    },

    /***
     * @method map(<map>, [scope])
     * @returns Array
     * @short Maps the array to another array containing the values that are the result of calling <map> on each element.
     * @extra [scope] is the %this% object. When <map> is a function, it receives three arguments: the current element, the current index, and a reference to the array. In addition to providing this method for browsers that don't support it natively, this enhanced method also directly accepts a string, which is a shortcut for a function that gets that property (or invokes a function) on each element.
     * @example
     *
     *   [1,2,3].map(function(n) {
     *     return n * 3;
     *   });                                  -> [3,6,9]
     *   ['one','two','three'].map(function(n) {
     *     return n.length;
     *   });                                  -> [3,3,5]
     *   ['one','two','three'].map('length')  -> [3,3,5]
     *
     ***/
    'map': function(fn, scope) {
      var scope = arguments[1], length = this.length, index = 0, result = new Array(length);
      checkFirstArgumentExists(arguments);
      while(index < length) {
        if(index in this) {
          result[index] = fn.call(scope, this[index], index, this);
        }
        index++;
      }
      return result;
    },

    /***
     * @method filter(<f>, [scope])
     * @returns Array
     * @short Returns any elements in the array that match <f>.
     * @extra [scope] is the %this% object. In addition to providing this method for browsers that don't support it natively, this method also implements @array_matching.
     * @example
     *
     +   [1,2,3].filter(function(n) {
     *     return n > 1;
     *   });
     *   [1,2,2,4].filter(2) -> 2
     *
     ***/
    'filter': function(fn) {
      var scope = arguments[1];
      var length = this.length, index = 0, result = [];
      checkFirstArgumentExists(arguments);
      while(index < length) {
        if(index in this && fn.call(scope, this[index], index, this)) {
          result.push(this[index]);
        }
        index++;
      }
      return result;
    },

    /***
     * @method indexOf(<search>, [fromIndex])
     * @returns Number
     * @short Searches the array and returns the first index where <search> occurs, or -1 if the element is not found.
     * @extra [fromIndex] is the index from which to begin the search. This method performs a simple strict equality comparison on <search>. It does not support enhanced functionality such as searching the contents against a regex, callback, or deep comparison of objects. For such functionality, use the %findIndex% method instead.
     * @example
     *
     *   [1,2,3].indexOf(3)           -> 1
     *   [1,2,3].indexOf(7)           -> -1
     *
     ***/
    'indexOf': function(search) {
      var fromIndex = arguments[1];
      if(isString(this)) return this.indexOf(search, fromIndex);
      return arrayIndexOf(this, search, fromIndex, 1);
    },

    /***
     * @method lastIndexOf(<search>, [fromIndex])
     * @returns Number
     * @short Searches the array and returns the last index where <search> occurs, or -1 if the element is not found.
     * @extra [fromIndex] is the index from which to begin the search. This method performs a simple strict equality comparison on <search>.
     * @example
     *
     *   [1,2,1].lastIndexOf(1)                 -> 2
     *   [1,2,1].lastIndexOf(7)                 -> -1
     *
     ***/
    'lastIndexOf': function(search) {
      var fromIndex = arguments[1];
      if(isString(this)) return this.lastIndexOf(search, fromIndex);
      return arrayIndexOf(this, search, fromIndex, -1);
    },

    /***
     * @method forEach([fn], [scope])
     * @returns Nothing
     * @short Iterates over the array, calling [fn] on each loop.
     * @extra This method is only provided for those browsers that do not support it natively. [scope] becomes the %this% object.
     * @example
     *
     *   ['a','b','c'].forEach(function(a) {
     *     // Called 3 times: 'a','b','c'
     *   });
     *
     ***/
    'forEach': function(fn) {
      var length = this.length, index = 0, scope = arguments[1];
      checkCallback(fn);
      while(index < length) {
        if(index in this) {
          fn.call(scope, this[index], index, this);
        }
        index++;
      }
    },

    /***
     * @method reduce(<fn>, [init])
     * @returns Mixed
     * @short Reduces the array to a single result.
     * @extra If [init] is passed as a starting value, that value will be passed as the first argument to the callback. The second argument will be the first element in the array. From that point, the result of the callback will then be used as the first argument of the next iteration. This is often refered to as "accumulation", and [init] is often called an "accumulator". If [init] is not passed, then <fn> will be called n - 1 times, where n is the length of the array. In this case, on the first iteration only, the first argument will be the first element of the array, and the second argument will be the second. After that callbacks work as normal, using the result of the previous callback as the first argument of the next. This method is only provided for those browsers that do not support it natively.
     *
     * @example
     *
     +   [1,2,3,4].reduce(function(a, b) {
     *     return a - b;
     *   });
     +   [1,2,3,4].reduce(function(a, b) {
     *     return a - b;
     *   }, 100);
     *
     ***/
    'reduce': function(fn) {
      return arrayReduce(this, fn, arguments[1]);
    },

    /***
     * @method reduceRight([fn], [init])
     * @returns Mixed
     * @short Identical to %Array#reduce%, but operates on the elements in reverse order.
     * @extra This method is only provided for those browsers that do not support it natively.
     *
     *
     *
     *
     * @example
     *
     +   [1,2,3,4].reduceRight(function(a, b) {
     *     return a - b;
     *   });
     *
     ***/
    'reduceRight': function(fn) {
      return arrayReduce(this, fn, arguments[1], true);
    }


  });




  /***
   * String module
   *
   ***/


  function buildTrim() {
    var support = getTrimmableCharacters().match(/^\s+$/);
    try { string.prototype.trim.call([1]); } catch(e) { support = false; }
    extend(string, true, !support, {

      /***
       * @method trim[Side]()
       * @returns String
       * @short Removes leading and/or trailing whitespace from the string.
       * @extra Whitespace is defined as line breaks, tabs, and any character in the "Space, Separator" Unicode category, conforming to the the ES5 spec. The standard %trim% method is only added when not fully supported natively.
       *
       * @set
       *   trim
       *   trimLeft
       *   trimRight
       *
       * @example
       *
       *   '   wasabi   '.trim()      -> 'wasabi'
       *   '   wasabi   '.trimLeft()  -> 'wasabi   '
       *   '   wasabi   '.trimRight() -> '   wasabi'
       *
       ***/
      'trim': function() {
        return this.toString().trimLeft().trimRight();
      },

      'trimLeft': function() {
        return this.replace(regexp('^['+getTrimmableCharacters()+']+'), '');
      },

      'trimRight': function() {
        return this.replace(regexp('['+getTrimmableCharacters()+']+$'), '');
      }
    });
  }



  /***
   * Function module
   *
   ***/


  extend(Function, true, false, {

     /***
     * @method bind(<scope>, [arg1], ...)
     * @returns Function
     * @short Binds <scope> as the %this% object for the function when it is called. Also allows currying an unlimited number of parameters.
     * @extra "currying" means setting parameters ([arg1], [arg2], etc.) ahead of time so that they are passed when the function is called later. If you pass additional parameters when the function is actually called, they will be added will be added to the end of the curried parameters. This method is provided for browsers that don't support it internally.
     * @example
     *
     +   (function() {
     *     return this;
     *   }).bind('woof')(); -> returns 'woof'; function is bound with 'woof' as the this object.
     *   (function(a) {
     *     return a;
     *   }).bind(1, 2)();   -> returns 2; function is bound with 1 as the this object and 2 curried as the first parameter
     *   (function(a, b) {
     *     return a + b;
     *   }).bind(1, 2)(3);  -> returns 5; function is bound with 1 as the this object, 2 curied as the first parameter and 3 passed as the second when calling the function
     *
     ***/
    'bind': function(scope) {
      var fn = this, args = multiArgs(arguments, null, 1), bound;
      if(!isFunction(this)) {
        throw new TypeError('Function.prototype.bind called on a non-function');
      }
      bound = function() {
        return fn.apply(fn.prototype && this instanceof fn ? this : scope, args.concat(multiArgs(arguments)));
      }
      bound.prototype = this.prototype;
      return bound;
    }

  });

  /***
   * Date module
   *
   ***/

   /***
   * @method toISOString()
   * @returns String
   * @short Formats the string to ISO8601 format.
   * @extra This will always format as UTC time. Provided for browsers that do not support this method.
   * @example
   *
   *   Date.create().toISOString() -> ex. 2011-07-05 12:24:55.528Z
   *
   ***
   * @method toJSON()
   * @returns String
   * @short Returns a JSON representation of the date.
   * @extra This is effectively an alias for %toISOString%. Will always return the date in UTC time. Provided for browsers that do not support this method.
   * @example
   *
   *   Date.create().toJSON() -> ex. 2011-07-05 12:24:55.528Z
   *
   ***/

  extend(date, false, false, {

     /***
     * @method Date.now()
     * @returns String
     * @short Returns the number of milliseconds since January 1st, 1970 00:00:00 (UTC time).
     * @extra Provided for browsers that do not support this method.
     * @example
     *
     *   Date.now() -> ex. 1311938296231
     *
     ***/
    'now': function() {
      return new date().getTime();
    }

  });

   function buildISOString() {
    var d = new date(date.UTC(1999, 11, 31)), target = '1999-12-31T00:00:00.000Z';
    var support = d.toISOString && d.toISOString() === target;
    extendSimilar(date, true, !support, 'toISOString,toJSON', function(methods, name) {
      methods[name] = function() {
        return padNumber(this.getUTCFullYear(), 4) + '-' +
               padNumber(this.getUTCMonth() + 1, 2) + '-' +
               padNumber(this.getUTCDate(), 2) + 'T' +
               padNumber(this.getUTCHours(), 2) + ':' +
               padNumber(this.getUTCMinutes(), 2) + ':' +
               padNumber(this.getUTCSeconds(), 2) + '.' +
               padNumber(this.getUTCMilliseconds(), 3) + 'Z';
      }
    });
   }

  // Initialize
  buildTrim();
  buildISOString();

