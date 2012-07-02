// Google Closure Compiler will output a wrapping function here.

  // A few optimizations for Google Closure Compiler will save us a couple kb in the release script.
  var object = Object, array = Array, regexp = RegExp, date = Date, string = String, number = Number, Undefined;

  // defineProperty exists in IE8 but will error when trying to define a property on
  // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
  var definePropertySupport = object.defineProperty && object.defineProperties;

  // Class extending methods

  function extend(klass, instance, override, methods) {
    var extendee = instance ? klass.prototype : klass, original;
    initializeClass(klass, instance, methods);
    iterateOverObject(methods, function(name, method) {
      original = extendee[name];
      if(typeof override === 'function') {
        method = wrapNative(extendee[name], method, override);
      }
      if(override !== false || !extendee[name]) {
        defineProperty(extendee, name, method);
      }
      // If the method is internal to Sugar, then store a reference so it can be restored later.
      klass['SugarMethods'][name] = { instance: instance, method: method, original: original };
    });
  }

  function initializeClass(klass) {
    if(klass['SugarMethods']) return;
    defineProperty(klass, 'SugarMethods', {});
    extend(klass, false, false, {
      'restore': function() {
        var all = arguments.length === 0, methods = array.create(arguments);
        iterateOverObject(klass['SugarMethods'], function(name, m) {
          if(all || methods.some(name)) {
            defineProperty(m.instance ? klass.prototype : klass, name, m.method);
          }
        });
      },
      'extend': function(methods, override, instance) {
        if(klass === object && arguments.length === 0) {
          mapObjectPrototypeMethods();
        } else {
          extend(klass, instance !== false, override, methods);
        }
      }
    });
  }

  function wrapNative(nativeFn, extendedFn, condition) {
    return function() {
      if(nativeFn && (condition === true || !condition.apply(this, arguments))) {
        return nativeFn.apply(this, arguments);
      } else {
        return extendedFn.apply(this, arguments);
      }
    }
  }

  function defineProperty(target, name, method) {
    if(definePropertySupport) {
      object.defineProperty(target, name, { 'value': method, 'configurable': true, 'enumerable': false, 'writable': true });
    } else {
      target[name] = method;
    }
  }


  // Argument helpers

  function transformArgument(el, map, context, mapArgs) {
    if(isUndefined(map)) {
      return el;
    } else if(object.isFunction(map)) {
      return map.apply(context, mapArgs || []);
    } else if(object.isFunction(el[map])) {
      return el[map].call(el);
    } else {
      return el[map];
    }
  }

  function getArgs(args, index) {
    return Array.prototype.slice.call(args, index);
  }

  function multiArgs(args, fn) {
    arrayEach(args, fn);
  }

  // Used for both arrays and strings

  function entryAtIndex(arr, args, str) {
    var result = [], length = arr.length, loop = args[args.length - 1] !== false, r;
    multiArgs(args, function(index) {
      if(object.isBoolean(index)) return false;
      if(loop) {
        index = index % length;
        if(index < 0) index = length + index;
      }
      r = str ? arr.charAt(index) || '' : arr[index];
      result.push(r);
    });
    return result.length < 2 ? result[0] : result;
  }

  // General helpers

  function isDefined(o) {
    return o !== Undefined;
  }

  function isUndefined(o) {
    return o === Undefined;
  }

  function isClass(obj, str) {
    return object.prototype.toString.call(obj) === '[object '+str+']';
  }

  function hasOwnProperty(obj, key) {
    return object.prototype.hasOwnProperty.call(obj, key);
  }

  function multiMatch(el, match, scope, params) {
    var result = true, isObjectPrimitive = typeof el === 'object';
    if(el === match) {
      // Match strictly equal values up front.
      return true;
    } else if(object.isRegExp(match) && !isObjectPrimitive) {
      // Match against a regexp
      return regexp(match).test(el);
    } else if(object.isFunction(match)) {
      // Match against a filtering function
      return match.apply(scope, [el].concat(params));
    } else if(object.isObject(match) && isObjectPrimitive) {
      // Match against a hash or array.
      iterateOverObject(match, function(key, value) {
        if(!multiMatch(el[key], match[key], scope, params)) {
          result = false;
        }
      });
      return object.keys(match).length > 0 && result;
    } else {
      return object.equal(el, match);
    }
  }

  /***
   * Object module
   *
   ***/



  // Object helpers

  function iterateOverObject(obj, fn) {
    var key;
    for(key in obj) {
      if(!hasOwnProperty(obj, key)) continue;
      fn.call(obj, key, obj[key]);
    }
  }

  function stringify(thing, stack) {
    var value, klass, isObject, isArray, arr, i, key, type = typeof thing;

    // Return quickly if string to save cycles
    if(type === 'string') return thing;

    klass    = object.prototype.toString.call(thing)
    isObject = klass === '[object Object]';
    isArray  = klass === '[object Array]';

    if(thing != null && isObject || isArray) {
      // This method for checking for cyclic structures was egregiously stolen from
      // the ingenious method by @kitcambridge from the Underscore script:
      // https://github.com/documentcloud/underscore/issues/240
      if(!stack) stack = [];
      // Allowing a step into the structure before triggering this
      // script to save cycles on standard JSON structures and also to
      // try as hard as possible to catch basic properties that may have
      // been modified.
      if(stack.length > 1) {
        i = stack.length;
        while (i--) {
          if (stack[i] === thing) {
            return 'CYC';
          }
        }
      }
      stack.push(thing);
      value = string(thing.constructor);
      arr = isArray ? thing : object.keys(thing).sort();
      for(i = 0; i < arr.length; i++) {
        key = isArray ? i : arr[i];
        value += key + stringify(thing[key], stack);
      }
      stack.pop();
    } else if(1 / thing === -Infinity) {
      value = '-0';
    } else {
      value = string(thing && thing.valueOf());
    }
    return type + klass + value;
  }

  /***
   * @method is[Type](<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is an object of that type.
   * @extra %isObject% will return false on anything that is not an object literal, including instances of inherited classes. Note also that %isNaN% will ONLY return true if the object IS %NaN%. It does not mean the same as browser native %isNaN%, which returns true for anything that is "not a number". Type methods are available as instance methods on extended objects.
   * @example
   *
   *   Object.isArray([1,2,3])            -> true
   *   Object.isDate(3)                   -> false
   *   Object.isRegExp(/wasabi/)          -> true
   *   Object.isObject({ broken:'wear' }) -> true
   *
   ***
   * @method isArray()
   * @set isType
   ***
   * @method isBoolean()
   * @set isType
   ***
   * @method isDate()
   * @set isType
   ***
   * @method isFunction()
   * @set isType
   ***
   * @method isNumber()
   * @set isType
   ***
   * @method isString()
   * @set isType
   ***
   * @method isRegExp()
   * @set isType
   ***/
  var ObjectTypeMethods = 'isObject,isNaN'.split(',');

  function buildTypeMethods() {
    var methods = {}, name;
    arrayEach(['Array','Boolean','Date','Function','Number','String','RegExp'], function(type) {
      name = 'is' + type;
      ObjectTypeMethods.push(name);
      methods[name] = function(obj) {
        return isClass(obj, type);
      }
    });
    extend(object, false, false, methods);
  }

  extend(object, false, function() { return arguments.length > 1; }, {

    /***
     * @method keys(<obj>, [fn])
     * @returns Array
     * @short Returns an array containing the keys in <obj>. Optionally calls [fn] for each key.
     * @extra This method is provided for browsers that don't support it natively, and additionally is enhanced to accept the callback [fn]. Returned keys are in no particular order. %keys% is available as an instance method on extended objects.
     * @example
     *
     *   Object.keys({ broken: 'wear' }) -> ['broken']
     *   Object.keys({ broken: 'wear' }, function(key, value) {
     *     // Called once for each key.
     *   });
     *   Object.extended({ broken: 'wear' }).keys() -> ['broken']
     *
     ***/
    'keys': function(obj, fn) {
      if(obj == null || typeof obj != 'object' && !object.isRegExp(obj) && !object.isFunction(obj)) {
        throw new TypeError('Object required');
      }
      var keys = [];
      iterateOverObject(obj, function(key, value) {
        keys.push(key);
        if(fn) fn.call(obj, key, value);
      });
      return keys;
    }

  });

  extend(object, false, false, {

    /***
     * @method values(<obj>, [fn])
     * @returns Array
     * @short Returns an array containing the values in <obj>. Optionally calls [fn] for each value.
     * @extra Returned values are in no particular order. %values% is available as an instance method on extended objects.
     * @example
     *
     *   Object.values({ broken: 'wear' }) -> ['wear']
     *   Object.values({ broken: 'wear' }, function(value) {
     *     // Called once for each value.
     *   });
     *   Object.extended({ broken: 'wear' }).values() -> ['wear']
     *
     ***/
    'values': function(obj, fn) {
      var values = [];
      iterateOverObject(obj, function(k,v) {
        values.push(v);
        if(fn) fn.call(obj,v);
      });
      return values;
    },

    /***
     * @method isObject()
     * @set isType
     ***/
    'isObject': function(obj) {
      if(obj == null) {
        return false;
      } else {
        // === on the constructor is not safe across iframes
        return isClass(obj, 'Object') && string(obj.constructor) === string(object);
      }
    },

    /***
     * @method isNaN()
     * @set isType
     ***/
    'isNaN': function(obj) {
      // This is only true of NaN
      return object.isNumber(obj) && obj.valueOf() !== obj.valueOf();
    },

    /***
     * @method merge(<target>, <source>, [deep] = false, [resolve] = true)
     * @returns Merged object
     * @short Merges all the properties of <source> into <target>.
     * @extra Merges are shallow unless [deep] is %true%. Properties of <source> will win in the case of conflicts, unless [resolve] is %false%. [resolve] can also be a function that resolves the conflict. In this case it will be passed 3 arguments, %key%, %targetVal%, and %sourceVal%, with the context set to <source>. This will allow you to solve conflict any way you want, ie. adding two numbers together, etc. %merge% is available as an instance method on extended objects.
     * @example
     *
     *   Object.merge({a:1},{b:2}) -> { a:1, b:2 }
     *   Object.merge({a:1},{a:2}, false, false) -> { a:1 }
     +   Object.merge({a:1},{a:2}, false, function(key, a, b) {
     *     return a + b;
     *   }); -> { a:3 }
     *   Object.extended({a:1}).merge({b:2}) -> { a:1, b:2 }
     *
     ***/
    'merge': function(target, source, deep, resolve) {
      var key, val;
      // Strings cannot be reliably merged thanks to
      // their properties not being enumerable in < IE8.
      if(target && typeof source != 'string') {
        for(key in source) {
          if(!hasOwnProperty(source, key) || !target) continue;
          val = source[key];
          // Conflict!
          if(target[key] !== Undefined) {
            // Do not merge.
            if(resolve === false) {
              continue;
            }
            // Use the result of the callback as the result.
            if(object.isFunction(resolve)) {
              val = resolve.call(source, key, target[key], source[key])
            }
          }
          // Deep merging.
          if(deep === true && val && typeof val === 'object') {
            if(object.isDate(val)) {
              val = new Date(val.getTime());
            } else if(object.isRegExp(val)) {
              val = new RegExp(val.source, val.getFlags());
            } else {
              if(!target[key]) target[key] = array.isArray(val) ? [] : {};
              object.merge(target[key], source[key], deep, resolve);
              continue;
            }
          }
          target[key] = val;
        }
      }
      return target;
    },

    /***
     * @method each(<obj>, [fn])
     * @returns Object
     * @short Iterates over each property in <obj> calling [fn] on each iteration.
     * @extra %each% is available as an instance method on extended objects.
     * @example
     *
     *   Object.each({ broken:'wear' }, function(key, value) {
     *     // Iterates over each key/value pair.
     *   });
     *   Object.extended({ broken:'wear' }).each(function(key, value) {
     *     // Iterates over each key/value pair.
     *   });
     *
     ***/
    'each': function(obj, fn) {
      if(fn) {
        iterateOverObject(obj, function(k,v) {
          fn.call(obj, k, v, obj);
        });
      }
      return obj;
    },

    /***
     * @method equal(<a>, <b>)
     * @returns Boolean
     * @short Returns true if <a> and <b> are equal.
     * @extra %equal% in Sugar is "egal", meaning the values are equal if they are "not observably distinguishable". Note that on extended objects the name is %equals% for readability.
     * @example
     *
     *   Object.equal({a:2}, {a:2}) -> true
     *   Object.equal({a:2}, {a:3}) -> false
     *   Object.extended({a:2}).equals({a:3}) -> false
     *
     ***/
    'equal': function(a, b) {
      return stringify(a) === stringify(b);
    }


  });


  /***
   * Array module
   *
   ***/


  // ECMA5 methods

  function arrayEach(arr, fn, startIndex, loop, sparse) {
    var length, index, i;
    checkCallback(fn);
    if(startIndex < 0) startIndex = arr.length + startIndex;
    i = toIntegerWithDefault(startIndex, 0);
    length = loop === true ? arr.length + i : arr.length;
    while(i < length) {
      index = i % arr.length;
      if(!(index in arr) && sparse === true) {
        return iterateOverSparseArray(arr, fn, i, loop);
      } else if(fn.call(arr, arr[index], index, arr) === false) {
        break;
      }
      i++;
    }
  }

  function iterateOverSparseArray(arr, fn, fromIndex, loop) {
    var indexes = [], i;
    for(i in arr) {
      if(isArrayIndex(arr, i) && i >= fromIndex) {
        indexes.push(i.toNumber());
      }
    }
    indexes.sort().each(function(index) {
      return fn.call(arr, arr[index], index, arr);
    });
    return arr;
  }

  function arrayFind(arr, f, startIndex, loop, returnIndex) {
    var result, index;
    arrayEach(arr, function(el, i, arr) {
      if(multiMatch(el, f, arr, [i, arr])) {
        result = el;
        index = i;
        return false;
      }
    }, startIndex, loop);
    return returnIndex ? index : result;
  }

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
    var length = arr.length, count = 0, defined = initialValue !== Undefined, result, index;
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
        result = fn.call(Undefined, result, arr[index], index, arr);
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

  function isArrayIndex(arr, i) {
    return i in arr && toUInt32(i) == i && i != 0xffffffff;
  }

  function toUInt32(i) {
    return i >>> 0;
  }

  function checkCallback(fn) {
    if(!fn || !fn.call) {
      throw new TypeError('Callback is not callable');
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
     * @method Array.create(<obj1>, <obj2>, ...)
     * @returns Array
     * @short Alternate array constructor.
     * @extra This method will create a single array by calling %concat% on all arguments passed. In addition to ensuring that an unknown variable is in a single, flat array (the standard constructor will create nested arrays, this one will not), it is also a useful shorthand to convert a function's arguments object into a standard array.
     * @example
     *
     *   Array.create('one', true, 3)   -> ['one', true, 3]
     *   Array.create(['one', true, 3]) -> ['one', true, 3]
     +   Array.create(function(n) {
     *     return arguments;
     *   }('howdy', 'doody'));
     *
     ***/
    'create': function(obj) {
      var result = [];
      multiArgs(arguments, function(a) {
        if(a && a.callee) a = getArgs(a);
        result = result.concat(a);
      });
      return result;
    },

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
      return isClass(obj, 'Array');
    }

  });


  extend(array, true, function() { var a = arguments; return a.length > 0 && !object.isFunction(a[0]); }, {

    /***
     * @method every(<f>, [scope])
     * @returns Boolean
     * @short Returns true if all elements in the array match <f>.
     * @extra [scope] is the %this% object. In addition to providing this method for browsers that don't support it natively, this enhanced method also directly accepts strings, numbers, deep objects, and arrays for <f>. %all% is provided an alias.
     * @example
     *
     +   ['a','a','a'].every(function(n) {
     *     return n == 'a';
     *   });
     *   ['a','a','a'].every('a')   -> true
     *   [{a:2},{a:2}].every({a:2}) -> true
     *
     ***/
    'every': function(f, scope) {
      var length = this.length, index = 0;
      checkFirstArgumentExists(arguments);
      while(index < length) {
        if(index in this && !multiMatch(this[index], f, scope, [index, this])) {
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
     * @extra [scope] is the %this% object. In addition to providing this method for browsers that don't support it natively, this enhanced method also directly accepts strings, numbers, deep objects, and arrays for <f>. %any% and %has% are provided as aliases.
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
     *
     ***/
    'some': function(f, scope) {
      var length = this.length, index = 0;
      checkFirstArgumentExists(arguments);
      while(index < length) {
        if(index in this && multiMatch(this[index], f, scope, [index, this])) {
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
     * @extra [scope] is the %this% object. In addition to providing this method for browsers that don't support it natively, this enhanced method also directly accepts a string, which is a shortcut for a function that gets that property (or invokes a function) on each element. %collect% is provided as an alias.
     * @example
     *
     +   [1,2,3].map(function(n) {
     *     return n * 3;
     *   });                                  -> [3,6,9]
     *   ['one','two','three'].map(function(n) {
     *     return n.length;
     *   });                                  -> [3,3,5]
     *   ['one','two','three'].map('length')  -> [3,3,5]
     *
     ***/
    'map': function(map, scope) {
      var length = this.length, index = 0, el, result = new Array(length);
      checkFirstArgumentExists(arguments);
      while(index < length) {
        if(index in this) {
          el = this[index];
          result[index] = transformArgument(el, map, scope, [el, index, this]);
        }
        index++;
      }
      return result;
    },

    /***
     * @method filter(<f>, [scope])
     * @returns Array
     * @short Returns any elements in the array that match <f>.
     * @extra [scope] is the %this% object. In addition to providing this method for browsers that don't support it natively, this enhanced method also directly accepts strings, numbers, deep objects, and arrays for <f>.
     * @example
     *
     +   [1,2,3].filter(function(n) {
     *     return n > 1;
     *   });
     *   [1,2,2,4].filter(2) -> 2
     *
     ***/
    'filter': function(f, scope) {
      var length = this.length, index = 0, result = [];
      checkFirstArgumentExists(arguments);
      while(index < length) {
        if(index in this && multiMatch(this[index], f, scope, [index, this])) {
          result.push(this[index]);
        }
        index++;
      }
      return result;
    }

  });

  extend(array, true, false, {

    /***
     * @method indexOf(<search>, [fromIndex])
     * @returns Number
     * @short Searches the array and returns the first index where <search> occurs, or -1 if the element is not found.
     * @extra [fromIndex] is the index from which to begin the search. This method performs a simple strict equality comparison on <search>. It does not support enhanced functionality such as searching the contents against a regex, callback, or deep comparison of objects. For such functionality, use the %find% method instead.
     * @example
     *
     *   [1,2,3].indexOf(3)           -> 1
     *   [1,2,3].indexOf(7)           -> -1
     *
     ***/
    'indexOf': function(search, fromIndex) {
      if(object.isString(this)) return this.indexOf(search, fromIndex);
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
    'lastIndexOf': function(search, fromIndex) {
      if(object.isString(this)) return this.lastIndexOf(search, fromIndex);
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
    'forEach': function(fn, scope) {
      var length = this.length, index = 0;
      checkCallback(fn);
      while(index < length) {
        if(index in this) {
          fn.call(scope, this[index], index, this);
        }
        index++;
      }
    },

    /***
     * @method reduce([fn], [init])
     * @returns Mixed
     * @short Reduces the array to a single result.
     * @extra By default this method calls [fn] n - 1 times, where n is the length of the array. On the first call it is passed the first and second elements in the array. The result of that callback will then be passed into the next iteration until it reaches the end, where the accumulated value will be returned as the final result. If [init] is passed, it will call [fn] one extra time in the beginning passing in [init] along with the first element. This method is only provided for those browsers that do not support it natively.
     * @example
     *
     +   [1,2,3,4].reduce(function(a, b) {
     *     return a + b;
     *   });
     +   [1,2,3,4].reduce(function(a, b) {
     *     return a + b;
     *   }, 100);
     *
     ***/
    'reduce': function(fn, init) {
      return arrayReduce(this, fn, init);
    },

    /***
     * @method reduceRight([fn], [init])
     * @returns Mixed
     * @short Reduces the array to a single result by stepping through it from the right.
     * @extra By default this method calls [fn] n - 1 times, where n is the length of the array. On the first call it is passed the last and second to last elements in the array. The result of that callback will then be passed into the next iteration until it reaches the beginning, where the accumulated value will be returned as the final result. If [init] is passed, it will call [fn] one extra time in the beginning passing in [init] along with the last element. This method is only provided for those browsers that do not support it natively.
     * @example
     *
     +   [1,2,3,4].reduceRight(function(a, b) {
     *     return a - b;
     *   });
     *
     ***/
    'reduceRight': function(fn, init) {
      return arrayReduce(this, fn, init, true);
    },

    /***
     * @method each(<fn>, [index] = 0, [loop] = false)
     * @returns Array
     * @short Runs <fn> against elements in the array. Enhanced version of %Array#forEach%.
     * @extra Parameters passed to <fn> are identical to %forEach%, ie. the first parameter is the current element, second parameter is the current index, and third parameter is the array itself. If <fn> returns %false% at any time it will break out of the loop. Once %each% finishes, it will return the array. If [index] is passed, <fn> will begin at that index and work its way to the end. If [loop] is true, it will then start over from the beginning of the array and continue until it reaches [index] - 1.
     * @example
     *
     *   [1,2,3,4].each(function(n) {
     *     // Called 4 times: 1, 2, 3, 4
     *   });
     *   [1,2,3,4].each(function(n) {
     *     // Called 4 times: 3, 4, 1, 2
     *   }, 2, true);
     *
     ***/
    'each': function(fn, index, loop) {
      arrayEach(this, fn, index, loop, true);
      return this;
    },

    /***
     * @method remove([f1], [f2], ...)
     * @returns Array
     * @short Removes any element in the array that matches [f1], [f2], etc.
     * @extra Will match a string, number, array, object, or alternately test against a function or regex. This method will change the array! Use %exclude% for a non-destructive alias.
     * @example
     *
     *   [1,2,3].remove(3)         -> [1,2]
     *   ['a','b','c'].remove(/b/) -> ['a','c']
     +   [{a:1},{b:2}].remove(function(n) {
     *     return n['a'] == 1;
     *   });                       -> [{b:2}]
     *
     ***/
    'remove': function() {
      var i, arr = this;
      multiArgs(arguments, function(f) {
        i = 0;
        while(i < arr.length) {
          if(multiMatch(arr[i], f, arr, [i, arr])) {
            arr.splice(i, 1);
          } else {
            i++;
          }
        }
      });
      return arr;
    },

    /***
     * @method add(<el>, [index])
     * @returns Array
     * @short Adds <el> to the array.
     * @extra If [index] is specified, it will add at [index], otherwise adds to the end of the array. %add% behaves like %concat% in that if <el> is an array it will be joined, not inserted. This method will change the array! Use %include% for a non-destructive alias. Also, %insert% is provided as an alias that reads better when using an index.
     * @example
     *
     *   [1,2,3,4].add(5)       -> [1,2,3,4,5]
     *   [1,2,3,4].add([5,6,7]) -> [1,2,3,4,5,6,7]
     *   [1,2,3,4].insert(8, 1) -> [1,8,2,3,4]
     *
     ***/
    'add': function(el, index) {
      if(!object.isNumber(number(index)) || isNaN(index) || index == -1) index = this.length;
      else if(index < -1) index += 1;
      array.prototype.splice.apply(this, [index, 0].concat(el));
      return this;
    },

    /***
     * @method compact([all] = false)
     * @returns Array
     * @short Removes all instances of %undefined%, %null%, and %NaN% from the array.
     * @extra If [all] is %true%, all "falsy" elements will be removed. This includes empty strings, 0, and false.
     * @example
     *
     *   [1,null,2,undefined,3].compact() -> [1,2,3]
     *   [1,'',2,false,3].compact()       -> [1,'',2,false,3]
     *   [1,'',2,false,3].compact(true)   -> [1,2,3]
     *
     ***/
    'compact': function(all) {
      var result = [];
      arrayEach(this, function(el, i) {
        if(object.isArray(el)) {
          result.push(el.compact());
        } else if(all && el) {
          result.push(el);
        } else if(!all && el != null && !object.isNaN(el)) {
          result.push(el);
        }
      });
      return result;
    },

    /***
     * @method groupBy(<map>, [fn])
     * @returns Object
     * @short Groups the array by <map>.
     * @extra Will return an object with keys equal to the grouped values. <map> may be a mapping function, or a string acting as a shortcut. Optionally calls [fn] for each group.
     * @example
     *
     *   ['fee','fi','fum'].groupBy('length') -> { 2: ['fi'], 3: ['fee','fum'] }
     +   [{age:35,name:'ken'},{age:15,name:'bob'}].groupBy(function(n) {
     *     return n.age;
     *   });                                  -> { 35: [{age:35,name:'ken'}], 15: [{age:15,name:'bob'}] }
     *
     ***/
    'groupBy': function(map, fn) {
      var arr = this, result = {}, key;
      arrayEach(arr, function(el, index) {
        key = transformArgument(el, map, arr, [el, index, arr]);
        if(!result[key]) result[key] = [];
        result[key].push(el);
      });
      return object.each(result, fn);
    }

  });






  /***
   * Number module
   *
   ***/


  function getRange(start, stop, fn, step) {
    var arr = [], i = parseInt(start), up = step > 0;
    while((up && i <= stop) || (!up && i >= stop)) {
      arr.push(i);
      if(fn) fn.call(this, i);
      i += step;
    }
    return arr;
  }

  function round(val, precision, method) {
    var fn = Math[method || 'round'];
    var multiplier = Math.pow(10, (precision || 0).abs());
    if(precision < 0) multiplier = 1 / multiplier;
    return fn(val * multiplier) / multiplier;
  }


  /***
   * @method ceil([precision] = 0)
   * @returns Number
   * @short Rounds the number up. [precision] will round to the given precision.
   * @example
   *
   *   (4.434).ceil()  -> 5
   *   (-4.434).ceil() -> -4
   *   (44.17).ceil(1) -> 44.2
   *   (4417).ceil(-2) -> 4500
   *
   ***
   * @method floor([precision] = 0)
   * @returns Number
   * @short Rounds the number down. [precision] will round to the given precision.
   * @example
   *
   *   (4.434).floor()  -> 4
   *   (-4.434).floor() -> -5
   *   (44.17).floor(1) -> 44.1
   *   (4417).floor(-2) -> 4400
   *
   ***
   * @method round(<precision> = 0)
   * @returns Number
   * @short Rounds a number to the precision of <precision>.
   * @example
   *
   *   (3.241).round()  -> 3
   *   (3.841).round()  -> 4
   *   (-3.241).round() -> -3
   *   (-3.841).round() -> -4
   *   (3.241).round(2) -> 3.24
   *   (3748).round(-2) -> 3800
   *
   ***
   * @method abs()
   * @returns Number
   * @short Returns the absolute value for the number.
   * @example
   *
   *   (3).abs()  -> 3
   *   (-3).abs() -> 3
   *
   ***
   * @method pow(<p> = 1)
   * @returns Number
   * @short Returns the number to the power of <p>.
   * @example
   *
   *   (3).pow(2) -> 9
   *   (3).pow(3) -> 27
   *   (3).pow()  -> 3
   *
   ***
   * @method sin()
   * @returns Number
   * @short Returns the sine of the number.
   * @example
   *
   *   (1).sin()         -> 0.8414709848078965
   *   (0).sin()         -> 0
   *   (Math.PI/2).sin() -> 1
   *
   ***
   * @method cos()
   * @returns Number
   * @short Returns the cosine of the number.
   * @example
   *
   *   (0).cos()         -> 1
   *   (Math.PI).cos()   -> -1
   *   (Math.PI*2).cos() -> 1
   *
   ***
   * @method tan()
   * @returns Number
   * @short Returns the tangent of the number.
   * @example
   *
   *   (0).tan()  -> 0
   *   (45).tan() -> 1.6197751905438615
   *   (90).tan() -> -1.995200412208242
   *
   ***
   * @method asin()
   * @returns Number
   * @short Returns the arcsine of the number.
   * @example
   *
   *   (0).asin() -> 0
   *   (1).asin() -> 1.5707963267948966
   *   (2).asin() -> NaN
   *
   ***
   * @method acos()
   * @returns Number
   * @short Returns the arccosine of the number.
   * @example
   *
   *   (1).acos() -> 0
   *   (0).acos() -> 1.5707963267948966
   *
   ***
   * @method atan()
   * @returns Number
   * @short Returns the arctangent of the number.
   * @example
   *
   *   (0).atan()  -> 0
   *   (45).atan() -> 1.5485777614681775
   *
   ***
   * @method exp()
   * @returns Number
   * @short Returns Math.E raised to the power of the number.
   * @example
   *
   *   (1).exp() -> 2.718281828459045
   *   (0).exp() -> 1
   *
   ***
   * @method sqrt()
   * @returns Number
   * @short Returns the square root of the number.
   * @example
   *
   *   (9).sqrt()    -> 3
   *   (1024).sqrt() -> 32
   *
   ***/

  function buildNumber() {
    var methods = {};
    'round,floor,ceil'.split(',').each(function(m) {
      methods[m] = function(precision) {
        return round(this, precision, m);
      }
    });
    'abs,pow,sin,asin,cos,acos,tan,atan,exp,pow,sqrt'.split(',').each(function(m) {
      methods[m] = function(a, b) {
        return Math[m](this, a, b);
      }
    });
    number.extend(methods);
  }

  extend(number, true, false, {

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
      return getRange(this, num, fn, step || 1);
    },

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
    'downto': function(num, fn, step) {
      return getRange(this, num, fn, -(step || 1));
    },

    /***
     * @method times(<fn>)
     * @returns Number
     * @short Calls <fn> a number of times equivalent to the number.
     * @example
     *
     *   (8).times(function(i) {
     *     // This function is called 8 times.
     *   });
     *
     ***/
    'times': function(fn) {
      if(fn) {
        for(var i = 0; i < this; i++) {
          fn.call(this, i);
        }
      }
      return this.toNumber();
    },

    /***
     * @method chr()
     * @returns String
     * @short Returns a string at the code point of the number.
     * @example
     *
     *   (65).chr() -> "A"
     *   (75).chr() -> "K"
     *
     ***/
    'chr': function() {
      return string.fromCharCode(this);
    },

    /***
     * @method pad(<place> = 0, [sign] = false, [base] = 10)
     * @returns String
     * @short Pads a number with "0" to <place>.
     * @extra [sign] allows you to force the sign as well (+05, etc). [base] can change the base for numeral conversion.
     * @example
     *
     *   (5).pad(2)        -> '05'
     *   (-5).pad(4)       -> '-0005'
     *   (82).pad(3, true) -> '+082'
     *
     ***/
    'pad': function(place, sign, base) {
      base = base || 10;
      var str = this.toNumber() === 0 ? '' : this.toString(base).replace(/^-/, '');
      str = padString(str, '0', place - str.replace(/\.\d+$/, '').length, 0);
      if(sign || this < 0) {
        str = (this < 0 ? '-' : '+') + str;
      }
      return str;
    },

    /***
     * @method ordinalize()
     * @returns String
     * @short Returns an ordinalized (English) string, i.e. "1st", "2nd", etc.
     * @example
     *
     *   (1).ordinalize() -> '1st';
     *   (2).ordinalize() -> '2nd';
     *   (8).ordinalize() -> '8th';
     *
     ***/
    'ordinalize': function() {
      var suffix, num = this.abs(), last = parseInt(num.toString().last(2));
      if(last >= 11 && last <= 13) {
        suffix = 'th';
      } else {
        switch(num % 10) {
          case 1:  suffix = 'st'; break;
          case 2:  suffix = 'nd'; break;
          case 3:  suffix = 'rd'; break;
          default: suffix = 'th';
        }
      }
      return this.toString() + suffix;
    },

    /***
     * @method toNumber()
     * @returns Number
     * @short Returns a number. This is mostly for compatibility reasons.
     * @example
     *
     *   (420).toNumber() -> 420
     *
     ***/
    'toNumber': function() {
      return parseFloat(this, 10);
    }


  });



  /***
   * String module
   *
   ***/


  function padString(str, p, left, right) {
    var padding = String(p);
    if(padding != p) {
      padding = '';
    }
    if(!object.isNumber(left))  left = 1;
    if(!object.isNumber(right)) right = 1;
    return padding.repeat(left) + str + padding.repeat(right);
  }


  extend(string, true, false, {

    /***
     * @method pad[Side](<padding> = '', [num] = 1)
     * @returns String
     * @short Pads either/both sides of the string.
     * @extra [num] is the number of characters on each side, and [padding] is the character to pad with.
     * @example
     *
     *   'wasabi'.pad('-')         -> '-wasabi-'
     *   'wasabi'.pad('-', 2)      -> '--wasabi--'
     *   'wasabi'.padLeft('-', 2)  -> '--wasabi'
     *   'wasabi'.padRight('-', 2) -> 'wasabi--'
     *
     ***
     * @method pad()
     * @set padSide
     ***/
    'pad': function(padding, num) {
      return padString(this, padding, num, num);
    },

    /***
     * @method padLeft()
     * @set padSide
     ***/
    'padLeft': function(padding, num) {
      return padString(this, padding, num, 0);
    },

    /***
     * @method padRight()
     * @set padSide
     ***/
    'padRight': function(padding, num) {
      return padString(this, padding, 0, num);
    },

    /***
     * @method first([n] = 1)
     * @returns String
     * @short Returns the first [n] characters of the string.
     * @example
     *
     *   'lucky charms'.first()   -> 'l'
     *   'lucky charms'.first(3)  -> 'luc'
     *
     ***/
    'first': function(num) {
      if(isUndefined(num)) num = 1;
      return this.substr(0, num);
    },

    /***
     * @method last([n] = 1)
     * @returns String
     * @short Returns the last [n] characters of the string.
     * @example
     *
     *   'lucky charms'.last()   -> 's'
     *   'lucky charms'.last(3)  -> 'rms'
     *
     ***/
    'last': function(num) {
      if(isUndefined(num)) num = 1;
      var start = this.length - num < 0 ? 0 : this.length - num;
      return this.substr(start);
    },

    /***
     * @method repeat([num] = 0)
     * @returns String
     * @short Returns the string repeated [num] times.
     * @example
     *
     *   'jumpy'.repeat(2) -> 'jumpyjumpy'
     *   'a'.repeat(5)     -> 'aaaaa'
     *
     ***/
    'repeat': function(num) {
      var str = '', i = 0;
      if(object.isNumber(num) && num > 0) {
        while(i < num) {
          str += this;
          i++;
        }
      }
      return str;
    },

    /***
     * @method toNumber([base] = 10)
     * @returns Number
     * @short Converts the string into a number.
     * @extra Any value with a "." fill be converted to a floating point value, otherwise an integer.
     * @example
     *
     *   '153'.toNumber()    -> 153
     *   '12,000'.toNumber() -> 12000
     *   '10px'.toNumber()   -> 10
     *   'ff'.toNumber(16)   -> 255
     *
     ***/
    'toNumber': function(base) {
      var str = this.replace(/,/g, '');
      return str.match(/\./) ? parseFloat(str) : parseInt(str, base || 10);
    },

    /***
     * @method capitalize([all] = false)
     * @returns String
     * @short Capitalizes the first character in the string.
     * @extra If [all] is true, all words in the string will be capitalized.
     * @example
     *
     *   'hello'.capitalize()           -> 'hello'
     *   'hello kitty'.capitalize()     -> 'hello kitty'
     *   'hello kitty'.capitalize(true) -> 'hello kitty'
     *
     *
     ***/
    'capitalize': function(all) {
      var lastResponded;
      return this.toLowerCase().replace(all ? /[\s\S]/g : /^\S/, function(lower) {
        var upper = lower.toUpperCase(), result;
        result = lastResponded ? lower : upper;
        lastResponded = upper !== lower;
        return result;
      });
    }


  });




  /***
   * RegExp module
   *
   * Note here that methods on the RegExp class like .exec and .test will fail in the current version of SpiderMonkey being
   * used by CouchDB when using shorthand regex notation like /foo/. This is the reason for the intermixed use of shorthand
   * and compiled regexes here. If you're using JS in CouchDB, it is safer to ALWAYS compile your regexes from a string.
   *
   ***/

  regexp.NPCGSupport = isUndefined(regexp('()??').exec('')[1]); // NPCG: nonparticipating capturing group

  function getFlags(reg, flag) {
    var flags = '';
    if(flag == 'g' || reg.global)     flags += 'g';
    if(flag == 'i' || reg.ignoreCase) flags += 'i';
    if(flag == 'm' || reg.multiline)  flags += 'm';
    if(flag == 'y' || reg.sticky)     flags += 'y';
    return flags;
  }

  extend(regexp, false, false, {

   /***
    * @method RegExp.escape(<str> = '')
    * @returns String
    * @short Escapes all RegExp tokens in a string.
    * @example
    *
    *   RegExp.escape('really?')      -> 'really\?'
    *   RegExp.escape('yes.')         -> 'yes\.'
    *   RegExp.escape('(not really)') -> '\(not really\)'
    *
    ***/
    'escape': function(str) {
      if(!object.isString(str)) str = String(str);
      return str.replace(/([\\/'*+?|()\[\]{}.^$])/g,'\\$1');
    }

  });

  extend(regexp, true, false, {

   /***
    * @method getFlags()
    * @returns String
    * @short Returns the flags of the regex as a string.
    * @example
    *
    *   /texty/gim.getFlags('testy') -> 'gim'
    *
    ***/
    'getFlags': function() {
      return getFlags(this);
    },

   /***
    * @method setFlags(<flags>)
    * @returns RegExp
    * @short Sets the flags on a regex and retuns a copy.
    * @example
    *
    *   /texty/.setFlags('gim') -> now has global, ignoreCase, and multiline set
    *
    ***/
    'setFlags': function(flags) {
      return regexp(this.source, flags);
    },

   /***
    * @method addFlag(<flag>)
    * @returns RegExp
    * @short Adds <flag> to the regex.
    * @example
    *
    *   /texty/.addFlag('g') -> now has global flag set
    *
    ***/
    'addFlag': function(flag) {
      return this.setFlags(getFlags(this, flag));
    },

   /***
    * @method removeFlag(<flag>)
    * @returns RegExp
    * @short Removes <flag> from the regex.
    * @example
    *
    *   /texty/g.removeFlag('g') -> now has global flag removed
    *
    ***/
    'removeFlag': function(flag) {
      return this.setFlags(getFlags(this).replace(flag, ''));
    }

  });



  /***
   * Function module
   *
   ***/


  function buildFunction() {
    var support = false;
    if(Function.prototype.bind) {
      function F() {};
      var B = F.bind();
      support = (new B instanceof B) && !(new F instanceof B);
    }
    extend(Function, true, !support, {

       /***
       * @method bind(<scope>, [arg1], ...)
       * @returns Function
       * @short Binds <scope> as the %this% object for the function when it is called. Also allows currying an unlimited number of parameters.
       * @extra "currying" means setting parameters ([arg1], [arg2], etc.) ahead of time so that they are passed when the function is called later. If you pass additional parameters when the function is actually called, they will be added will be added to the end of the curried parameters.
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
        var fn = this, args = getArgs(arguments, 1), nop, bound;
        if(!object.isFunction(this)) {
          throw new TypeError('Function.prototype.bind called on a non-function');
        }
        bound = function() {
          return fn.apply(fn.prototype && this instanceof fn ? this : scope, args.concat(getArgs(arguments)));
        }
        nop = function() {};
        nop.prototype = this.prototype;
        bound.prototype = new nop();
        return bound;
      }

    });
  }


  // Initialize
  buildNumber();
  buildFunction();
  buildTypeMethods();
  initializeClass(date);

