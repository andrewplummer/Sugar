(function() {

  var extend = function(klass, instance, methods) {
    var extendee = instance ? klass.prototype : klass;
    iterateOverObject(methods, function(name, method) {
      if(!extendee[name]) {
        defineProperty(extendee, name, method);
      }
    });
  };

  var extendWithNativeCondition = function(klass, instance, condition, methods) {
    var extendee = instance ? klass.prototype : klass;
    iterateOverObject(methods, function(name, fn) {
      defineProperty(extendee, name, wrapNative(extendee[name], fn, condition));
    });
  };

  var wrapNative = function(nativeFn, extendedFn, condition) {
    return function() {
      if(nativeFn && (condition === true || condition.apply(this, arguments))) {
        return nativeFn.apply(this, arguments);
      } else {
        return extendedFn.apply(this, arguments);
      }
    }
  };

  var defineProperty = function(target, name, method) {
    // defineProperty exists in IE8 but will error when trying to define a property on
    // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
    if(Object.defineProperty && Object.defineProperties){
      Object.defineProperty(target, name, { value: method, configurable: true, enumerable: false, writeable: true });
    } else {
      target[name] = method;
    }
  };

  var iterateOverObject = function(obj, fn) {
    var count = 0;
    for(var key in obj) {
      if(!obj.hasOwnProperty(key)) continue;
      fn.call(obj, key, obj[key], count);
      count++;
    }
  };

  var collectDateArguments = function(args) {
    if(typeof args[0] === 'object') {
      return args;
    } else if (args.length == 1 && Object.isNumber(args[0])) {
      return [args[0]];
    }
    var result = {};
    var format = Array.prototype.slice.call(arguments, 1);
    for(var i = 0; i < args.length; i++) {
      result[format[i]] = args[i];
    }
    return [result];
  };

  var deepEquals = function(a,b) {
    if(typeof a == 'object' && typeof b == 'object') {
      var checked = false;
      for(var key in a) {
        if(!a.hasOwnProperty(key)) continue;
        if(!deepEquals(a[key], b[key])) {
          return false;
        }
        checked = true;
      }
      if(!checked) {
        for(var key in b) {
          if(!b.hasOwnProperty(key)) continue;
          return false;
        }
      }
      return true;
    } else {
      return a === b;
    }
  };

  var multiMatch = function(el, match, scope, params) {
    if(Object.isRegExp(match)) {
      // Match against a regexp
      return match.test(el);
    } else if(Object.isFunction(match)) {
      // Match against a filtering function
      return match.apply(scope, [el].concat(params));
    } else if(typeof match === 'object') {
      // Match against a hash or array.
      return deepEquals(match, el);
    } else if(match !== undefined) {
      // Do a one-to-one equals
      return match === el;
    } else {
      // If undefined, match if truthy.
      return !!el;
    }
  };

  var transformArgument = function(argument, transform, scope, params) {
    if(Object.isFunction(transform)) {
      return transform.apply(scope, [argument].concat(params));
    } else if(transform === undefined) {
      return argument;
    } else if(typeof argument[transform] == 'function') {
      return argument[transform].call(argument);
    } else {
      return argument[transform];
    }
  };

  var getMinOrMax = function(obj, which, transform) {
    var max = which === 'max', min = which === 'min';
    var edge = max ? -Infinity : Infinity;
    var result = [];
    for(var key in obj) {
      if(!obj.hasOwnProperty(key)) continue;
      var entry = obj[key];
      var test = transformArgument(entry, transform);
      if(test === undefined || test === null) {
        continue;
      } else if(test === edge) {
        result.push(entry);
      } else if((max && test > edge) || (min && test < edge)) {
        result = [entry];
        edge = test;
      }
    }
    return result;
  };

  var getFromIndexes = function(obj, args, str) {
    var loop = args[args.length - 1] !== false,
        result = [],
        index, i;
    for(i = 0; i < args.length; i++) {
      index = args[i];
      if(index === true || index === false) break;
      if(loop) {
        index = index % obj.length;
        if(index < 0) index = obj.length + index;
      }
      if(index >= 0 && index < obj.length) {
        result.push(str ? obj.charAt(index) : obj[index]);
      }
    }
    if(result.length == 0) {
      return str ? '' : null;
    } else if(result.length == 1) {
      return result[0];
    } else {
      return result;
    }
  };

  var toInteger = function(i) {
    return parseInt(i >> 0);
  }

  var isArrayIndex = function(i) {
    return ToUint32(i) == i && i != 0xffffffff;
  }

  var ToUint32 = function(i) {
    return i >>> 0;
  }



  /***
   * Object module
   *
   * Much thanks to "kangax" for his informative aricle about how problems with instanceof and constructor
   * http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
   *
   ***/

  var instance = function(obj, str) {
    return Object.prototype.toString.call(obj) === '[object '+str+']';
  };


  /***
   * @method Object.clone(<obj> = {})
   * @returns Cloned object
   * @short Creates a deep clone (copy) of <obj>.
   * @example
   *
   *   Object.clone({foo:'bar'}) -> { foo: 'bar' }
   *   Object.clone({})          -> {}
   *
   ***
   * @method clone()
   * @returns Cloned object
   * @short Creates a deep clone (copy) of the object.
   * @extra This method is only available on extended objects created with %Object.extended%.
   * @example
   *
   *   Object.extended({foo:'bar'}).clone() -> { foo: 'bar' }
   *   Object.extended({}).clone()          -> {}
   *
   ***/
  var cloneObject = function(obj, extend) {
    var result;
    if(Object.isArray(obj)) {
      result = [];
    } else if(extend) {
      result = Object.extended({});
    } else {
      result = {};
    }
    iterateOverObject(obj, function(k,v) {
      if(Object.isObject(v) || Object.isArray(v)) {
        result[k] = cloneObject(v, extend);
      } else {
        result[k] = v;
      }
    });
    return result;
  };

  var Hash = function(obj) {
    var self = this;
    iterateOverObject(obj, function(key, value) {
      self[key] = value;
    });
  }

  Hash.prototype.constructor = Object;

  var typeMethods = ['Array','Boolean','Date','Function','Number','String','RegExp'];
  var hashMethods = ['keys','values','each','merge','isEmpty','equals'];

  /***
   * @method Object.isArray(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is an Array.
   * @example
   *
   *   Object.isArray(3)        -> false
   *   Object.isArray(true)     -> false
   *   Object.isArray('wasabi') -> false
   *   Object.isArray([1,2,3])  -> true
   *
   ***
   * @method Object.isBoolean(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a Boolean.
   * @example
   *
   *   Object.isBoolean(3)        -> false
   *   Object.isBoolean(true)     -> true
   *   Object.isBoolean('wasabi') -> false
   *
   ***
   * @method Object.isDate(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a Date.
   * @example
   *
   *   Object.isDate(3)          -> false
   *   Object.isDate(true)       -> false
   *   Object.isDate('wasabi')   -> false
   *   Object.isDate(new Date()) -> true
   *
   ***
   * @method Object.isFunction(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a Function.
   * @example
   *
   *   Object.isFunction(3)            -> false
   *   Object.isFunction(true)         -> false
   *   Object.isFunction('wasabi')     -> false
   *   Object.isFunction(function() {}) -> true
   *
   ***
   * @method Object.isNumber(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a Number.
   * @example
   *
   *   Object.isNumber(3)        -> true
   *   Object.isNumber(true)     -> false
   *   Object.isNumber('wasabi') -> false
   *
   ***
   * @method Object.isString(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a String.
   * @example
   *
   *   Object.isString(3)        -> false
   *   Object.isString(true)     -> false
   *   Object.isString('wasabi') -> true
   *
   ***
   * @method Object.isRegExp(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a RegExp.
   * @example
   *
   *   Object.isRegExp(3)        -> false
   *   Object.isRegExp(true)     -> false
   *   Object.isRegExp('wasabi') -> false
   *   Object.isRegExp(/wasabi/) -> true
   *
   ***/

  var buildObject = function() {
    typeMethods.slice(1).each(function(m) {
      defineProperty(Object, 'is'+m, function(obj) {
        return instance(obj, m);
      });
    });
    defineProperty(Object, 'isArray', Array.isArray || function(obj){
      return instance(obj, 'Array');
    });
    hashMethods.each(function(m) {
      defineProperty(Hash.prototype, m, function() {
        return Object[m].apply(null, [this].concat(Array.prototype.slice.call(arguments)));
      });
    });
    defineProperty(Object, 'clone', cloneObject);
    defineProperty(Hash.prototype, 'clone', function(){
      return cloneObject(this, true);
    });
    defineProperty(Object, 'enableSugar', function() {
      typeMethods.each(function(m) {
        defineProperty(Object.prototype, 'is'+m, function() {
          return Object['is'+m](this);
        });
      });
      hashMethods.each(function(m) {
        defineProperty(Object.prototype, m, Hash.prototype[m]);
      });
      defineProperty(Object.prototype, 'clone', function(){
        return cloneObject(this, true);
      });
    });
  };

  extend(Object, false, {

    /***
     * @method Object.extended(<obj> = {})
     * @returns Extended object
     * @short Creates a new object with extended hash-like methods.
     * @extra This is equivalent to the standard Object constructor %new Object()% but additionally returns an object with extended hash methods.
     * @example
     *
     *   Object.extended()
     *   Object.extended({ happy:true, pappy:false })
     *
     ***/
    'extended': function(obj) {
      return new Hash(obj);
    }

  });


  extend(Object, false, {

    /***
     * @method Object.isObject(<obj>)
     * @returns Boolean
     * @short Returns true if <obj> is an object literal or "plain object".
     * @extra Anything that is not an object literal will return false, including instances of inherited classes.
     * @example
     *
     *   Object.isObject({})                -> true
     *   Object.isObject({ broken:'wear' }) -> true
     *   Object.isObject('wasabi')          -> false
     *   Object.isObject(3)                 -> false
     *
     ***/
    'isObject': function(o) {
      if(o === null || o === undefined || arguments.length === 0) {
        return false;
      } else {
        return instance(o, 'Object') && o.constructor === Object;
      }
    },

    /***
     * @method Object.each(<obj>, [fn])
     * @returns Object
     * @short Iterates over each property in <obj> calling [fn] on each iteration.
     * @example
     *
     *   Object.each({ broken:'wear' }, function(key, value) {
     *     // Iterates over each key/value pair.
     *   });
     *
     ***
     * @method each([fn])
     * @returns Object
     * @short Iterates over each property in the object calling [fn] on each iteration.
     * @extra This method is only available on extended objects created with %Object.extended%.
     * @example
     *
     *   Object.extended({ broken: 'wear' }).each(function(key, value) {
     *     // Iterates over each key/value pair.
     *   });
     *
     ***/
    'each': function(obj, fn) {
      iterateOverObject(obj, function(k,v) {
        if(fn) fn.call(obj, k, v, obj);
      });
      return obj;
    },

    /***
     * @method Object.merge(<obj1>, <obj2>, ...)
     * @returns Merged object
     * @short Accepts an arbitrary number of objects as arguments and merges them all into <obj1>.
     * @example
     *
     *   Object.merge({a:1},{b:2}) -> { a:1, b:2 }
     *
     ***
     * @method merge(<obj1>, <obj2>, ...)
     * @returns Merged object
     * @short Accepts an arbitrary number of objects as arguments and merges them all into itself.
     * @extra This method is only available on extended objects created with %Object.extended%.
     * @example
     *
     *   Object.extended({a:1}).merge({b:2}) -> { a:1, b:2 }
     *
     ***/
    'merge': function() {
      var target = arguments[0];
      for(var i = 1; i < arguments.length; i++) {
        var obj = arguments[i];
        for(var key in obj) {
          if(!obj.hasOwnProperty(key)) continue;
          target[key] = obj[key];
        }
      }
      return target;
    },

    /***
     * @method Object.isEmpty(<obj>)
     * @returns Boolean
     * @short Returns true if <obj> is empty.
     * @example
     *
     *   Object.isEmpty({})          -> true
     *   Object.isEmpty({foo:'bar'}) -> false
     *
     ***
     * @method isEmpty()
     * @returns Boolean
     * @short Returns true if the object is empty.
     * @extra This method is only available on extended objects created with %Object.extended%.
     * @example
     *
     *   Object.extended({}).isEmpty()          -> true
     *   Object.extended({foo:'bar'}).isEmpty() -> false
     *
     ***/
    'isEmpty': function(obj) {
      return deepEquals(obj, {});
    },

    /***
     * @method Object.equals(<a>, <b>)
     * @returns Boolean
     * @short Returns true if <a> and <b> are equal.
     * @example
     *
     *   Object.equals({a:2}, {a:2}) -> true
     *   Object.equals({a:2}, {a:3}) -> false
     *
     ***
     * @method equals(<obj>)
     * @returns Boolean
     * @short Returns true if <obj> is equal to the object.
     * @extra This method is only available on extended objects created with %Object.extended%.
     * @example
     *
     *   Object.extended({a:2}).equals({a:2}) -> true
     *   Object.extended({a:2}).equals({a:3}) -> false
     *
     ***/
    'equals': function(a, b) {
      return deepEquals(a, b);
    }

  });


  extendWithNativeCondition(Object, false, function() { return arguments.length == 1; }, {

    /***
     * @method Object.keys(<obj>, [fn])
     * @returns Array
     * @short Returns an array containing the keys in <obj>. Optionally calls [fn] for each key.
     * @extra Note that this method provides added functionality over the browser native %keys% method, which will not accept [fn].
     * @example
     *
     *   Object.keys({ broken: 'wear' }) -> ['broken']
     *   Object.keys({ broken: 'wear' }, function(key, value) {
     *     // Called once for each key.
     *   });
     *
     ***
     * @method keys([fn])
     * @returns Array
     * @short Returns an array containing the keys in the object. Optionally calls [fn] for each key.
     * @extra This method is only available on extended objects created with %Object.extended%.
     * @example
     *
     *   Object.extended({ broken: 'wear' }).keys() -> ['broken']
     *   Object.extended({ broken: 'wear' }).keys(function(key, value) {
     *     // Called once for each key.
     *   });
     *
     ***/
    'keys': function(obj, fn) {
      var keys = [];
      iterateOverObject(obj, function(k,v) {
        keys.push(k);
        if(fn) fn.call(obj, k);
      });
      return keys;
    },

    /***
     * @method Object.values(<obj>, [fn])
     * @returns Array
     * @short Returns an array containing the values in <obj>. Optionally calls [fn] for each value.
     * @example
     *
     *   Object.values({ broken: 'wear' }) -> ['wear']
     *   Object.values({ broken: 'wear' }, function(value) {
     *     // Called once for each value.
     *   });
     *
     ***
     * @method values([fn])
     * @returns Array
     * @short Returns an array containing the values in the object. Optionally calls [fn] for each value.
     * @extra This method is only available on extended objects created with %Object.extended%.
     * @example
     *
     *   Object.extended({ broken: 'wear' }).values() -> ['wear']
     *   Object.extended({ broken: 'wear' }).values(function(value) {
     *     // Called once for each value.
     *   });
     *
     ***/
    'values': function(obj, fn) {
      var values = [];
      iterateOverObject(obj, function(k,v) {
        values.push(v);
        if(fn) fn.call(obj,v);
      });
      return values;
    }


  });








  /***
   * Array module
   *
   ***/



  extendWithNativeCondition(Array, true, function(){ return false; }, {

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
      var length = this.length, i = 0;
      if(!fn || !fn.call) {
        throw new TypeError();
      }
      while(i < length) {
        if(isArrayIndex(i) && this.hasOwnProperty(i)) {
          fn.call(scope, this[i], i, this);
        }
        i++;
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
      var result = init === undefined ? this[0] : init;
      for(var i= init ? 0 : 1,len=this.length; i < len; i++) {
        result = fn.call(null, result, this[i], i, this);
      }
      return result;
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
      var result = init === undefined ? this[this.length - 1] : init;
      for(var i = init ? this.length - 1 : this.length - 2; i >= 0; i--) {
        result = fn.call(null, result, this[i], i, this);
      }
      return result;
    }

  });


  extendWithNativeCondition(Array, true, function(a) { return false; return !Object.isObject(a) && !Object.isFunction(a); }, {

    /***
     * @method indexOf(<f>, [offset])
     * @returns Number
     * @short Searches the array and returns the first index where <f> occurs, or -1 if the element is not found.
     * @extra [offset] is the index from which to begin the search. In addition to providing this method for browsers that don't support it natively, this enhanced method can also perform deep finds on objects or arrays, and accept an iterating function on which to perform the search.
     * @example
     *
     *   [1,2,3].indexOf(3)           -> 1
     *   [1,2,3].indexOf(7)           -> -1
     +   [1,2,3].indexOf(function(n) {
     *     return n > 1;
     *   });
     *   [{a:4},{b:2}].indexOf({a:4}) -> 0
     *
     ***/
    'indexOf': function(search, fromIndex) {
      fromIndex = toInteger(fromIndex) || 0;
      if(fromIndex < 0) {
        fromIndex = Math.max(this.length + fromIndex, 0);
      }
      if(this.length == 0 || fromIndex > this.length) {
        return -1;
      }
      for(key in this) {
        if(isArrayIndex(key) && key >= fromIndex && multiMatch(this[key], search, this, [key, this])) {
          return parseInt(key);
        }
      }
      return -1;
    },

    /***
     * @method lastIndexOf(<f>, [offset])
     * @returns Number
     * @short Searches the array and returns the last index where <f> occurs, or -1 if the element is not found.
     * @extra [offset] is the index from which to begin the search. In addition to providing this method for browsers that don't support it natively, this enhanced method can also perform deep finds on objects or arrays, and accept an iterating function on which to perform the search.
     * @example
     *
     *   [1,2,1].lastIndexOf(1)                 -> 2
     *   [1,2,1].lastIndexOf(7)                 -> -1
     +   [1,2,1].lastIndexOf(function(n) {
     *     return n == 1;
     *   });
     *   [{a:4},{b:2},{a:4}].lastIndexOf({a:4}) -> 2
     *
     ***/
    'lastIndexOf': function(f, offset) {
      if(offset < 0) offset = this.length + offset;
      else if(offset === undefined || offset > this.length) offset = this.length - 1;
      for(var i=offset; i >= 0; i--) {
        if(multiMatch(this[i], f, this, [i, this])) return i;
      }
      return -1;
    }

  });


  extendWithNativeCondition(Array, true, function() { return Object.isFunction(arguments[0]); }, {

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
      for(var i=0,len=this.length; i < len; i++) {
        var match = multiMatch(this[i], f, scope, [i, this]);
        if(!match) {
          return false;
        }
      }
      return true;
    },

    /***
     * @method some(<fn>, [scope])
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
      for(var i=0,len=this.length; i < len; i++) {
        var match = multiMatch(this[i], f, scope, [i, this]);
        if(match) {
          return true;
        }
      }
      return false;
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
      var result = [];
      for(var i=0,len=this.length; i < len; i++) {
        var match = multiMatch(this[i], f, scope, [i, this]);
        if(match) {
          result.push(this[i]);
        }
      }
      return result;
    },

    /***
     * @method map(<fn>, [scope])
     * @returns Array
     * @short Maps the array to another array containing the values that are the result of calling <fn> on each element.
     * @extra [scope] is the %this% object. In addition to providing this method for browsers that don't support it natively, this enhanced method also directly accepts a string, which is a shortcut for a function that gets that property on each element. %collect% is provided as an alias.
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
    'map': function(fn, scope) {
      var result = [];
      for(var i=0,len=this.length; i < len; i++) {
        result.push(transformArgument(this[i], fn, scope, [i, this]));
      }
      return result;
    }


  });


  extend(Array, true, {

    /***
     * @method find(<f>, [index] = 0, [loop] = false)
     * @returns Mixed
     * @short Returns the first element that matches <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Starts at [index], and will continue from index = 0 if [loop] is true.
     * @example
     *
     +   [{a:1,b:2},{a:1,b:3},{a:1,b:4}].find(function(n) {
     *     return n['a'] == 1;
     *   });                                     -> {a:1,b:3}
     *   ['cuba','japan','canada'].find(/^c/, 2) -> 'canada'
     *
     ***/
    'find': function(f, index, loop) {
      var result = this.findAll(f, index, loop);
      return result.length > 0 ? result[0] : undefined;
    },

    /***
     * @method findAll(<f>, [index] = 0, [loop] = false)
     * @returns Array
     * @short Returns all elements that match <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Starts at [index], and will continue from index = 0 if [loop] is true.
     * @example
     *
     +   [{a:1,b:2},{a:1,b:3},{a:2,b:4}].findAll(function(n) {
     *     return n['a'] == 1;
     *   });                                        -> [{a:1,b:3},{a:1,b:4}]
     *   ['cuba','japan','canada'].findAll(/^c/, 2) -> 'canada'
     *
     ***/
    'findAll': function(f, index, loop) {
      var result = [], arr = this;
      index = index || 0;
      this.eachFromIndex(index, function(el, i) {
        if(multiMatch(el, f, arr, [i, arr])) {
          result.push(el);
        }
      }, loop);
      return result;
    },

    /***
     * @method eachFromIndex(<index>, <fn>, [loop] = false)
     * @returns Array
     * @short Runs <fn> against elements in the array starting at <index>.
     * @extra Will run a full loop starting over at index = 0 if [loop] is true.
     * @example
     *
     *   [1,2,3,4].eachFromIndex(2, function(n) {
     *     // Called 2 times: 3, 4
     *   });
     *   [1,2,3,4].eachFromIndex(2, function(n) {
     *     // Called 4 times: 3, 4, 1, 2
     *   }, true);
     *
     ***/
    'eachFromIndex': function(index, fn, loop) {
      var length = loop ? this.length : this.length - index;
      for(var cur, i = 0; i < length; i++) {
        cur = (index + i) % this.length;
        fn.call(this, this[cur], cur);
      }
    },

    /***
     * @method count(<f>)
     * @returns Number
     * @short Counts all elements in the array that match <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex.
     * @example
     *
     *   [1,2,3,1].count(1)       -> 2
     *   ['a','b','c'].count(/b/) -> 1
     +   [{a:1},{b:2}].count(function(n) {
     *     return n['a'] > 1;
     *   });                      -> 0
     *
     ***/
    'count': function(f) {
      if(f === undefined) return this.length;
      return this.findAll(f).length;
    },

    /***
     * @method none(<f>)
     * @returns Boolean
     * @short Returns true if none of the elements in the array match <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex.
     * @example
     *
     *   [1,2,3].none(5)         -> true
     *   ['a','b','c'].none(/b/) -> false
     +   [{a:1},{b:2}].none(function(n) {
     *     return n['a'] > 1;
     *   });                     -> true
     *
     ***/
    'none': function(f) {
      return !this.any(f);
    },

    /***
     * @method remove(<f>)
     * @returns Array
     * @short Removes any element in the array that matches <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. This method will change the array! Use %exclude% for a non-destructive alias.
     * @example
     *
     *   [1,2,3].remove(3)         -> [1,2]
     *   ['a','b','c'].remove(/b/) -> ['a','c']
     +   [{a:1},{b:2}].remove(function(n) {
     *     return n['a'] == 1;
     *   });                       -> [{b:2}]
     *
     ***/
    'remove': function(f) {
      var i = 0;
      while(f && i < this.length) {
        if(multiMatch(this[i], f, this, [i, this])) {
          this.splice(i, 1);
        } else {
          i++;
        }
      }
      return this;
    },

    /***
     * @method removeAtIndex(<start>, [end])
     * @returns Array
     * @short Removes element at <start>. If [end] is specified, removes the range between <start> and [end]. This method will change the array! If you don't intend the array to be changed use %clone% first.
     * @example
     *
     *   ['a','b','c'].removeAtIndex(0) -> ['b','c']
     *   [1,2,3,4].removeAtIndex(1, 3)  -> [1]
     *
     ***/
    'removeAtIndex': function(start, end) {
      if(start === undefined) return this;
      if(end === undefined) end = start;
      for(var i = 0; i <= (end - start); i++) {
        this.splice(start, 1);
      }
      return this;
    },

    /***
     * @method add(<el>, [index])
     * @returns Array
     * @short Adds <el> to the array.
     * @extra If [index] is specified, it will add at [index], otherwise adds to the end of the array. %add% behaves like %concat% in that if <el> is an array it will be joined, not inserted. This method will change the array! Use %include% for a non-destructive alias.
     * @example
     *
     *   [1,2,3,4].add(5)       -> [1,2,3,4,5]
     *   [1,2,3,4].add(8, 1)    -> [1,8,2,3,4]
     *   [1,2,3,4].add([5,6,7]) -> [1,2,3,4,5,6,7]
     *
     ***/
    'add': function(el, index) {
      if(!Object.isNumber(index) || isNaN(index)) index = this.length;
      Array.prototype.splice.apply(this, [index, 0].concat(el));
      return this;
    },

    /***
     * @method include(<el>, [index])
     * @returns Array
     * @short Adds <el> to the array.
     * @extra This is a non-destructive alias for %add%. It will not change the original array.
     * @example
     *
     *   [1,2,3,4].include(5)       -> [1,2,3,4,5]
     *   [1,2,3,4].include(8, 1)    -> [1,8,2,3,4]
     *   [1,2,3,4].include([5,6,7]) -> [1,2,3,4,5,6,7]
     *
     ***/
    'include': function(el, index) {
      return this.clone().add(el, index);
    },

    /***
     * @method exclude(<f>)
     * @returns Array
     * @short Removes any element in the array that matches <f>.
     * @extra This is a non-destructive alias for %remove%. It will not change the original array.
     * @example
     *
     *   [1,2,3].exclude(3)         -> [1,2]
     *   ['a','b','c'].exclude(/b/) -> ['a','c']
     +   [{a:1},{b:2}].exclude(function(n){
     *     return n['a'] == 1;
     *   });                       -> [{b:2}]
     *
     ***/
    'exclude': function(f) {
      return this.clone().remove(f);
    },

    /***
     * @method clone()
     * @returns Array
     * @short Clones the array.
     * @example
     *
     *   [1,2,3].clone() -> [1,2,3]
     *
     ***/
    'clone': function() {
      return this.concat();
    },

    /***
     * @method unique()
     * @returns Array
     * @short Removes all duplicate elements in the array.
     * @example
     *
     *   [1,2,2,3].unique()                 -> [1,2,3]
     *   [{foo:'bar'},{foo:'bar'}].unique() -> [{foo:'bar'}]
     *
     ***/
    'unique': function() {
      var result = [];
      this.each(function(el) {
        if(result.indexOf(el) === -1) result.push(el);
      });
      return result;
    },

    /***
     * @method union(<a>)
     * @returns Array
     * @short Returns an array containing all elements in both arrays with duplicates removed.
     * @example
     *
     *   [1,3,5].union([5,7,9])     -> [1,3,5,7,9]
     *   ['a','b'].union(['b','c']) -> ['a','b','c']
     *
     ***/
    'union': function(a) {
      return this.concat(a).unique();
    },

    /***
     * @method intersect(<a>)
     * @returns Array
     * @short Returns an array containing the elements both arrays have in common.
     * @example
     *
     *   [1,3,5].intersect([5,7,9])   -> [5]
     *   ['a','b'].intersect('b','c') -> ['b']
     *
     ***/
    'intersect': function(a) {
      var result = [];
      if(!Object.isArray(a)) a = [a];
      this.each(function(el) {
        if(a.indexOf(el) !== -1) {
          result.push(el);
        }
      });
      return result.unique();
    },

    /***
     * @method subtract(<a>)
     * @returns Array
     * @short Returns an array containing only the elements that do not exist in <a>.
     * @example
     *
     *   [1,3,5].subtract([5,7,9])   -> [1,3,7,9]
     *   ['a','b'].subtract('b','c') -> ['a','c']
     *
     ***/
    'subtract': function(a) {
      var result = [];
      if(!Object.isArray(a)) a = [a];
      this.each(function(el) {
        if(a.indexOf(el) === -1) {
          result.push(el);
        }
      });
      return result;
    },

    /***
     * @method at(<index>, [loop] = true)
     * @returns Mixed
     * @short Gets the element(s) at a given index.
     * @extra When [loop] is true, overshooting the end of the array (or the beginning) will begin counting from the other end. As an alternate syntax, passing multiple indexes will get the elements at those indexes.
     * @example
     *
     *   [1,2,3].at(0)        -> 1
     *   [1,2,3].at(2)        -> 3
     *   [1,2,3].at(4)        -> 2
     *   [1,2,3].at(4, false) -> null
     *   [1,2,3].at(-1)       -> 3
     *   [1,2,3].at(0,1)      -> [1,2]
     *
     ***/
    'at': function() {
      return getFromIndexes(this, arguments, false);
    },

    /***
     * @method first([num] = 1)
     * @returns Mixed
     * @short Returns the first element(s) in the array.
     * @extra When <num> is passed, returns the first <num> elements in the array.
     * @example
     *
     *   [1,2,3].first()        -> 1
     *   [1,2,3].first(2)       -> [1,2]
     *
     ***/
    'first': function(num) {
      if(num === undefined) return this[0];
      if(num < 0) num = 0;
      return this.slice(0, num);
    },

    /***
     * @method last([num] = 1)
     * @returns Mixed
     * @short Returns the last element(s) in the array.
     * @extra When <num> is passed, returns the last <num> elements in the array.
     * @example
     *
     *   [1,2,3].last()        -> 3
     *   [1,2,3].last(2)       -> [2,3]
     *
     ***/
    'last': function(num) {
      if(num === undefined) return this[this.length - 1];
      var start = this.length - num < 0 ? 0 : this.length - num;
      return this.slice(start);
    },

    /***
     * @method from(<index>)
     * @returns Array
     * @short Returns a slice of the array from <index>.
     * @example
     *
     *   [1,2,3].from(1)  -> [2,3]
     *   [1,2,3].from(2)  -> [3]
     *
     ***/
    'from': function(num) {
      return this.slice(num);
    },

    /***
     * @method to(<index>)
     * @returns Array
     * @short Returns a slice of the array up to <index>.
     * @example
     *
     *   [1,2,3].to(1)  -> [1]
     *   [1,2,3].to(2)  -> [1,2]
     *
     ***/
    'to': function(num) {
      if(num === undefined) num = this.length;
      return this.slice(0, num);
    },

    /***
     * @method min([map])
     * @returns Array
     * @short Returns the elements in the array with the lowest value.
     * @extra [map] may be a function mapping the value to be checked or a string acting as a shortcut.
     * @example
     *
     *   [1,2,3].min()                    -> [1]
     *   ['fee','fo','fum'].min('length') -> ['fo']
     +   ['fee','fo','fum'].min(function(n) {
     *     return n.length;
     *   });                              -> ['fo']
     +   [{a:3,a:2}].min(function(n) {
     *     return n['a'];
     *   });                              -> [{a:2}]
     *
     ***/
    'min': function(map) {
      return getMinOrMax(this, 'min', map).unique();
    },

    /***
     * @method max(<map>)
     * @returns Array
     * @short Returns the elements in the array with the greatest value.
     * @extra <map> may be a function mapping the value to be checked or a string acting as a shortcut.
     * @example
     *
     *   [1,2,3].max()                    -> [3]
     *   ['fee','fo','fum'].max('length') -> ['fee','fum']
     +   [{a:3,a:2}].max(function(n) {
     *     return n['a'];
     *   });                              -> [{a:3}]
     *
     ***/
    'max': function(map) {
      return getMinOrMax(this, 'max', map).unique();
    },

    /***
     * @method least(<map>)
     * @returns Array
     * @short Returns the elements in the array with the least commonly occuring value.
     * @extra <map> may be a function mapping the value to be checked or a string acting as a shortcut.
     * @example
     *
     *   [3,2,2].least()                   -> [3]
     *   ['fe','fo','fum'].least('length') -> ['fum']
     +   [{age:35,name:'ken'},{age:12,name:'bob'},{age:12,name:'ted'}].least(function(n) {
     *     return n.age;
     *   });                               -> [{age:35,name:'ken'}]
     *
     ***/
    'least': function(map) {
      var result = getMinOrMax(this.groupBy(map), 'min', 'length').flatten();
      return result.length === this.length ? [] : result.unique();
    },

    /***
     * @method most(<map>)
     * @returns Array
     * @short Returns the elements in the array with the most commonly occuring value.
     * @extra <map> may be a function mapping the value to be checked or a string acting as a shortcut.
     * @example
     *
     *   [3,2,2].most()                   -> [2]
     *   ['fe','fo','fum'].most('length') -> ['fe','fo']
     +   [{age:35,name:'ken'},{age:12,name:'bob'},{age:12,name:'ted'}].most(function(n) {
     *     return n.age;
     *   });                              -> [{age:12,name:'bob'},{age:12,name:'ted'}]
     *
     ***/
    'most': function(map) {
      var result = getMinOrMax(this.groupBy(map), 'max', 'length').flatten();
      return result.length === this.length ? [] : result.unique();
    },

    /***
     * @method sum(<map>)
     * @returns Number
     * @short Sums all values in the array.
     * @extra <map> may be a function mapping the value to be summed or a string acting as a shortcut.
     * @example
     *
     *   [1,2,2].sum()                           -> 5
     +   [{age:35},{age:12},{age:12}].sum(function(n) {
     *     return n.age;
     *   });                                     -> 59
     *   [{age:35},{age:12},{age:12}].sum('age') -> 59
     *
     ***/
    'sum': function(map) {
      var arr = map ? this.map(map) : this;
      return arr.length > 0 ? arr.reduce(function(a,b) { return a + b; }) : 0;
    },

    /***
     * @method average(<map>)
     * @returns Number
     * @short Averages all values in the array.
     * @extra <map> may be a function mapping the value to be averaged or a string acting as a shortcut.
     * @example
     *
     *   [1,2,3].average()                           -> 2
     +   [{age:35},{age:11},{age:11}].average(function(n) {
     *     return n.age;
     *   });                                         -> 19
     *   [{age:35},{age:11},{age:11}].average('age') -> 19
     *
     ***/
    'average': function(map) {
      var arr = map ? this.map(map) : this;
      return arr.length > 0 ? arr.sum() / arr.length : 0;
    },

    /***
     * @method groupBy(<property>)
     * @returns Object
     * @short Groups the array by <property>.
     * @extra Will return an object with keys equal to the grouped values. <property> may be a mapping function, or a string acting as a shortcut.
     * @example
     *
     *   ['fee','fi','fum'].groupBy('length') -> { 2: ['fi'], 3: ['fee','fum'] }
     +   [{age:35,name:'ken'},{age:15,name:'bob'}].groupBy(function(n) {
     *     return n.age;
     *   });                                  -> { 'ken': [{age:35,name:'ken'}], 'bob': [{age:15,name:'bob'}] }
     *
     ***/
    'groupBy': function(map) {
      var result = {};
      this.each(function(el) {
        var key = transformArgument(el, map);
        if(!result[key]) result[key] = [];
        result[key].push(el);
      });
      return result;
    },

    /***
     * @method inGroups(<num>, [padding])
     * @returns Array
     * @short Groups the array into <num> arrays.
     * @extra [padding] specifies a value with which to pad the last array so that they are all equal length.
     * @example
     *
     *   [1,2,3,4,5,6,7].inGroups(3)         -> [ [1,2,3], [4,5,6], [7] ]
     *   [1,2,3,4,5,6,7].inGroups(3, 'none') -> [ [1,2,3], [4,5,6], [7,'none','none'] ]
     *
     ***/
    'inGroups': function(num, padding) {
      var pad = arguments.length > 1;
      var arr = this;
      var result = [];
      var divisor = Math.ceil(this.length / num);
      (0).upto(num - 1, function(i) {
        var index = i * divisor;
        var group = arr.slice(index, index + divisor);
        if(pad && group.length < divisor) {
          (divisor - group.length).times(function() {
            group = group.add(padding);
          });
        }
        result.push(group);
      });
      return result;
    },

    /***
     * @method inGroupsOf(<num>, [padding] = null)
     * @returns Array
     * @short Groups the array into arrays of <num> elements each.
     * @extra [padding] specifies a value with which to pad the last array so that they are all equal length.
     * @example
     *
     *   [1,2,3,4,5,6,7].inGroupsOf(4)         -> [ [1,2,3,4], [5,6,7] ]
     *   [1,2,3,4,5,6,7].inGroupsOf(4, 'none') -> [ [1,2,3,4], [5,6,7,'none'] ]
     *
     ***/
    'inGroupsOf': function(num, padding) {
      if(this.length === 0 || num === 0) return this;
      if(num === undefined) num = 1;
      if(padding === undefined) padding = null;
      var result = [];
      var group = null;
      var len = this.length;
      this.each(function(el, i) {
        if((i % num) === 0) {
          if(group) result.push(group);
          group = [];
        }
        if(el === undefined) el = padding;
        group.push(el);
      });
      if(!this.length.isMultipleOf(num)) {
        (num - (this.length % num)).times(function() {
          group.push(padding);
        });
        this.length = this.length + (num - (this.length % num));
      }
      if(group.length > 0) result.push(group);
      return result;
    },

    /***
     * @method split(<f>)
     * @returns Array
     * @short Splits the array on any element that matches <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex.
     * @example
     *
     *   [1,2,3,4,5,6].split(3) -> [[1,2], [4,5,6]]
     +   [{a:3},{a:4},{a:1}].split(function(n) {
     *     return n['a'] == 1;
     *   });                    -> [{a:3},{a:4}]
     *
     ***/
    'split': function(split) {
      var result = [], tmp = [];
      this.forEach(function(el, i, arr) {
        var match = multiMatch(el, split, arr, [i, arr]);
        if(!match) tmp.push(el);
        if(tmp.length > 0 && (match || i == arr.length - 1)) {
          result.push(tmp);
          tmp = [];
        }
      });
      return result;
    },

    /***
     * @method compact()
     * @returns Array
     * @short Removes all instances of %undefined%, %null%, and %NaN% from the array.
     * @extra Empty strings and %false% are left untouched.
     * @example
     *
     *   [1,null,2,undefined,3].compact() -> [1,2,3]
     *   [1,'',2,false,3].compact()       -> [1,'',2,false,3]
     *
     ***/
    'compact': function() {
      var result = [];
      this.each(function(el, i) {
        if(Object.isArray(el)) {
          result.push(el.compact());
        } else if(el !== undefined && el !== null && !isNaN(el)) {
          result.push(el);
        }
      });
      return result;
    },

    /***
     * @method isEmpty()
     * @returns Boolean
     * @short Returns true if the array is empty.
     * @extra This is true if the array has a length of zero, or contains only %undefined%, %null%, or %NaN%.
     * @example
     *
     *   [].isEmpty()               -> true
     *   [null,undefined].isEmpty() -> true
     *
     ***/
    'isEmpty': function() {
      return this.compact().length == 0;
    },

    /***
     * @method flatten()
     * @returns Array
     * @short Returns a flattened, one-dimensional copy of the array.
     * @example
     *
     *   [[1], 2, [3]].flatten()      -> [1,2,3]
     *   [['a'],[],'b','c'].flatten() -> ['a','b','c']
     *
     ***/
    'flatten': function() {
      var result = [];
      this.each(function(el) {
        if(Object.isArray(el)) {
          result = result.concat(el.flatten());
        } else {
          result.push(el);
        }
      });
      return result;
    },

    /***
     * @method sortBy(<property>, [desc] = false)
     * @returns Array
     * @short Sorts the array by <property>.
     * @extra <property> may be a function or a string acting as a shortcut. [desc] will sort the array in descending order.
     * @example
     *
     *   ['world','a','new'].sortBy('length')       -> ['a','new','world']
     *   ['world','a','new'].sortBy('length', true) -> ['world','new','a']
     +   [{age:72},{age:13},{age:18}].sortBy(function(n) {
     *     return n.age;
     *   });                                        -> [{age:13},{age:18},{age:72}]
     *
     ***/
    'sortBy': function(map, desc) {
      var arr = this;
      arr.sort(function(a, b) {
        var aProperty = transformArgument(a, map);
        var bProperty = transformArgument(b, map);
        var numeric = typeof aProperty == 'number';
        if(numeric && desc) return bProperty - aProperty;
        else if(numeric && !desc) return aProperty - bProperty;
        else if(aProperty === bProperty) return 0;
        else if(desc) return aProperty < bProperty ?  1 : -1;
        else return aProperty < bProperty ? -1 :  1;
      });
      return arr;
    },

    /***
     * @method randomize()
     * @returns Array
     * @short Randomizes the array.
     * @extra Uses Fisher-Yates algorithm. %shuffle% provided as an alias.
     * @example
     *
     *   [1,2,3,4].randomize()  -> [?,?,?,?]
     *
     ***/
    'randomize': function() {
      var a = this.concat();
      for(var j, x, i = a.length; i; j = parseInt(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x) {};
      return a;
    }

  });


  // Aliases
  extend(Array, true, {
    /***
     * @method collect()
     * @alias map
     *
     ***
     * @method shuffle()
     * @alias randomize
     *
     ***
     * @method each()
     * @alias forEach
     *
     ***
     * @method all()
     * @alias every
     *
     ***
     * @method any()
     * @alias some
     *
     ***
     * @method has()
     * @alias some
     *
     ***
     * @method insert()
     * @alias add
     *
     ***/
    'collect': Array.prototype.map,
    'shuffle': Array.prototype.randomize,
    'each': Array.prototype.forEach,
    'all': Array.prototype.every,
    'any': Array.prototype.some,
    'has': Array.prototype.some,
    'insert': Array.prototype.add
  });










  /***
   * Number module
   *
   ***/

  var round = function(val, precision, method) {
    var fn = Math[method];
    var multiplier = Math.pow(10, Math.abs(precision || 0));
    if(precision < 0) multiplier = 1 / multiplier;
    return fn(val * multiplier) / multiplier;
  }


  /***
   * @method milliseconds()
   * @returns Number
   * @short Takes the number as milliseconds and returns milliseconds.
   * @extra This method is included for completeness and effectively just rounds the number. %millisecond% is provided as an alias.
   * @example
   *
   *   (5).milliseconds() -> 5
   *   (1).millisecond() -> 1
   *
   ***
   * @method millisecondsBefore([d])
   * @returns Date
   * @short Returns a date <n> milliseconds before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %millisecondsAgo% is provided as an alias. Also accepts %millisecondBefore% and %millisecondAgo%.
   * @example
   *
   *   (5).millisecondsBefore('3:00pm') -> "5 milliseconds before 3pm"
   *   (5).millisecondsAgo()            -> "5 milliseconds ago"
   *
   ***
   * @method millisecondsAfter([d])
   * @returns Date
   * @short Returns a date <n> milliseconds after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %millisecondsFromNow% is provided as an alias. Also accepts %millisecondAfter% and %millisecondFromNow%.
   * @example
   *
   *   (5).millisecondsAfter('3:00pm') -> "5 milliseconds after 3pm"
   *   (5).millisecondsFromNow()       -> "5 milliseconds from now"
   *
   ***
   * @method millisecondsAgo()
   * @alias millisecondsBefore
   *
   ***
   * @method millisecondsFromNow()
   * @alias millisecondsAfter
   *
   ***
   * @method seconds()
   * @returns Number
   * @short Takes the number as seconds and returns milliseconds.
   * @extra %second% is provided as an alias.
   * @example
   *
   *   (5).seconds() -> 5000
   *   (1).second()  -> 1000
   *
   ***
   * @method secondsBefore([d])
   * @returns Date
   * @short Returns a date <n> seconds before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %secondsAgo% is provided as an alias. Also accepts %secondBefore% and %secondAgo%.
   * @example
   *
   *   (5).secondsBefore('3:00pm') -> "5 seconds before 3pm"
   *   (5).secondsAgo()            -> "5 seconds ago"
   *
   ***
   * @method secondsAfter([d])
   * @returns Date
   * @short Returns a date <n> seconds after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %secondsFromNow% is provided as an alias. Also accepts %secondAfter% and %secondFromNow%.
   * @example
   *
   *   (5).secondsAfter('3:00pm') -> "5 seconds after 3pm"
   *   (5).secondsFromNow()       -> "5 seconds from now"
   *
   ***
   * @method secondsAgo()
   * @alias secondsBefore
   *
   ***
   * @method secondsFromNow()
   * @alias secondsAfter
   *
   ***
   * @method minutes()
   * @returns Number
   * @short Takes the number as minutes and returns milliseconds.
   * @extra %minute% is provided as an alias.
   * @example
   *
   *   (5).minutes() -> 300000
   *   (1).minute()  -> 60000
   *
   ***
   * @method minutesBefore([d])
   * @returns Date
   * @short Returns a date <n> minutes before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %minutesAgo% is provided as an alias. Also accepts %minuteBefore% and %minuteAgo%.
   * @example
   *
   *   (5).minutesBefore('3:00pm') -> "5 minutes before 3pm"
   *   (5).minutesAgo()            -> "5 minutes ago"
   *
   ***
   * @method minutesAfter([d])
   * @returns Date
   * @short Returns a date <n> minutes after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %minutesFromNow% is provided as an alias. Also accepts %minuteAfter% and %minuteFromNow%.
   * @example
   *
   *   (5).minutesAfter('3:00pm') -> "5 minutes after 3pm"
   *   (5).minutesFromNow()       -> "5 minutes from now"
   *
   ***
   * @method minutesAgo()
   * @alias minutesBefore
   *
   ***
   * @method minutesFromNow()
   * @alias minutesAfter
   *
   ***
   * @method hours()
   * @returns Number
   * @short Takes the number as hours and returns milliseconds.
   * @extra %hour% is provided as an alias.
   * @example
   *
   *   (5).hours() -> 18000000
   *   (1).hour()  -> 3600000
   *
   ***
   * @method hoursBefore([d])
   * @returns Date
   * @short Returns a date <n> hours before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %hoursAgo% is provided as an alias. Also accepts %hourBefore% and %hourAgo%.
   * @example
   *
   *   (5).hoursBefore('3:00pm') -> "5 hours before 3pm"
   *   (5).hoursAgo()            -> "5 hours ago"
   *
   ***
   * @method hoursAfter([d])
   * @returns Date
   * @short Returns a date <n> hours after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %hoursFromNow% is provided as an alias. Also accepts %hourAfter% and %hourFromNow%.
   * @example
   *
   *   (5).hoursAfter('3:00pm') -> "5 hours after 3pm"
   *   (5).hoursFromNow()       -> "5 hours from now"
   *
   ***
   * @method hoursAgo()
   * @alias hoursBefore
   *
   ***
   * @method hoursFromNow()
   * @alias hoursAfter
   *
   ***
   * @method days()
   * @returns Number
   * @short Takes the number as days and returns milliseconds.
   * @extra %day% is provided as an alias.
   * @example
   *
   *   (5).days() -> 432000000
   *   (1).day()  -> 86400000
   *
   ***
   * @method daysBefore([d])
   * @returns Date
   * @short Returns a date <n> days before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %daysAgo% is provided as an alias. Also accepts %dayBefore% and %dayAgo%.
   * @example
   *
   *   (5).daysBefore('June 2nd') -> "5 days before June 2nd"
   *   (5).daysAgo()              -> "5 days ago"
   *
   ***
   * @method daysAfter([d])
   * @returns Date
   * @short Returns a date <n> days after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %daysFromNow% is provided as an alias. Also accepts %dayAfter% and %dayFromNow%.
   * @example
   *
   *   (5).daysAfter('June 2nd') -> "5 days after June 2nd"
   *   (5).daysFromNow()         -> "5 days from now"
   *
   ***
   * @method daysAgo()
   * @alias daysBefore
   *
   ***
   * @method daysFromNow()
   * @alias daysAfter
   *
   ***
   * @method weeks()
   * @returns Number
   * @short Takes the number as weeks and returns milliseconds.
   * @extra %week% is provided as an alias.
   * @example
   *
   *   (5).weeks() -> 3024000000
   *   (1).week()  -> 604800000
   *
   ***
   * @method weeksBefore([d])
   * @returns Date
   * @short Returns a date <n> weeks before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %weeksAgo% is provided as an alias. Also accepts %weekBefore% and %weekAgo%.
   * @example
   *
   *   (5).weeksBefore('June 2nd') -> "5 weeks before June 2nd"
   *   (5).weeksAgo()              -> "5 weeks ago"
   *
   ***
   * @method weeksAfter([d])
   * @returns Date
   * @short Returns a date <n> weeks after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %weeksFromNow% is provided as an alias. Also accepts %weekAfter% and %weekFromNow%.
   * @example
   *
   *   (5).weeksAfter('June 2nd') -> "5 weeks after June 2nd"
   *   (5).weeksFromNow()         -> "5 weeks from now"
   *
   ***
   * @method weeksAgo()
   * @alias weeksBefore
   *
   ***
   * @method weeksFromNow()
   * @alias weeksAfter
   *
   ***
   * @method months()
   * @returns Number
   * @short Takes the number as months and returns milliseconds.
   * @extra %month% is provided as an alias. Note that "a month" as a unit of time has inherent ambiguity. When no specific month can be infered, the value 30.4375 is used, which is the average number of days in a month.
   * @example
   *
   *   (5).months() -> 13149000000
   *   (1).month()  -> 2629800000
   *
   ***
   * @method monthsBefore([d])
   * @returns Date
   * @short Returns a date <n> months before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %monthsAgo% is provided as an alias. Also accepts %monthBefore% and %monthAgo%.
   * @example
   *
   *   (5).monthsBefore('July') -> "February"
   *   (5).monthsAgo()          -> "5 months ago"
   *
   ***
   * @method monthsAfter([d])
   * @returns Date
   * @short Returns a date <n> months after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %monthsFromNow% is provided as an alias. Also accepts %monthAfter% and %monthFromNow%.
   * @example
   *
   *   (5).monthsAfter('July') -> "December"
   *   (5).monthsFromNow()     -> "5 months from now"
   *
   ***
   * @method monthsAgo()
   * @alias monthsBefore
   *
   ***
   * @method monthsFromNow()
   * @alias monthsAfter
   *
   ***
   * @method years()
   * @returns Number
   * @short Takes the number as years and returns milliseconds.
   * @extra %year% is provided as an alias. Note that "a year" as a unit of time has inherent ambiguity. When no specific year can be infered, a calculation of 365.25 days is used, however exact calculations that take leap years into consideration should not use these methods.
   * @example
   *
   *   (5).years() -> 157788000000
   *   (1).year()  -> 31557600000
   *
   ***
   * @method yearsBefore([d])
   * @returns Date
   * @short Returns a date <n> years before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %yearsAgo% is provided as an alias. Also accepts %yearBefore% and %yearAgo%.
   * @example
   *
   *   (5).yearsBefore('2011') -> "2006"
   *   (5).yearsAgo()          -> "5 years ago"
   *
   ***
   * @method yearsAfter([d])
   * @returns Date
   * @short Returns a date <n> years after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %yearsFromNow% is provided as an alias. Also accepts %yearAfter% and %yearFromNow%.
   * @example
   *
   *   (5).yearsAfter(2011) -> "2016"
   *   (5).yearsFromNow()   -> "5 years from now"
   *
   ***
   * @method yearsAgo()
   * @alias yearsBefore
   *
   ***
   * @method yearsFromNow()
   * @alias yearsAfter
   *
   ***/
  var buildNumberToDateAlias = function(unit, multiplier) {
    var base   = function() {  return Math.round(this * multiplier); }
    var before = function() { return getOffsetDate(this, arguments, unit, 'rewind'); }
    var after  = function() { return getOffsetDate(this, arguments, unit, 'advance'); }
    defineProperty(Number.prototype, unit, base);
    defineProperty(Number.prototype, unit + 's', base);
    defineProperty(Number.prototype, unit + 'Before', before);
    defineProperty(Number.prototype, unit + 'sBefore', before);
    defineProperty(Number.prototype, unit + 'Ago', before);
    defineProperty(Number.prototype, unit + 'sAgo', before);
    defineProperty(Number.prototype, unit + 'After', after);
    defineProperty(Number.prototype, unit + 'sAfter', after);
    defineProperty(Number.prototype, unit + 'FromNow', after);
    defineProperty(Number.prototype, unit + 'sFromNow', after);
  }





  extend(Number, false, {

    /***
     * @method Number.random([n1], [n2])
     * @returns Number
     * @short Returns a random integer between [n1] and [n2].
     * @extra If only 1 number is passed, the other will be 0. If none are passed, the number will be either 0 or 1.
     * @example
     *
     *   Number.random(50, 100) -> ex. 85
     *   Number.random(50)      -> ex. 27
     *   Number.random()        -> ex. 0
     *
     ***/
    'random': function(n1, n2) {
      if(arguments.length == 1) n2 = n1, n1 = 0;
      min = Math.min(n1 || 0, n2 || 1);
      max = Math.max(n1 || 0, n2 || 1);
      return Math.round((Math.random() * (max - min)) + min);
    }

  });

  extend(Number, true, {

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
    },

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
     ***/
    'ceil': function(precision) {
      return round(this, precision, 'ceil');
    },

    /***
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
     ***/
    'floor': function(precision) {
      return round(this, precision, 'floor');
    },

    /***
     * @method abs()
     * @returns Number
     * @short Returns the absolute value for the number.
     * @example
     *
     *   (3).abs()  -> 3
     *   (-3).abs() -> 3
     *
     ***/
    'abs': function() {
      return Math.abs(this);
    },

    /***
     * @method pow(<p> = 1)
     * @returns Number
     * @short Returns the number to the power of <p>.
     * @example
     *
     *   (3).pow(2) -> 9
     *   (3).pow(3) -> 27
     *   (3).pow()  -> 3
     *
     ***/
    'pow': function(power) {
      if(power === undefined || power == null) power = 1;
      return Math.pow(this, power);
    },

    /***
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
     ***/
    'round': function(precision) {
      return round(this, precision, 'round');
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
      return String.fromCharCode(this);
    },

    /***
     * @method isOdd()
     * @returns Boolean
     * @short Returns true if the number is odd.
     * @example
     *
     *   (3).isOdd()  -> true
     *   (18).isOdd() -> false
     *
     ***/
    'isOdd': function() {
      return !this.isMultipleOf(2);
    },

    /***
     * @method isEven()
     * @returns Boolean
     * @short Returns true if the number is even.
     * @example
     *
     *   (6).isEven()  -> true
     *   (17).isEven() -> false
     *
     ***/
    'isEven': function() {
      return this.isMultipleOf(2);
    },

    /***
     * @method isMultipleOf(<num>)
     * @returns Boolean
     * @short Returns true if the number is a multiple of <num>.
     * @example
     *
     *   (6).isMultipleOf(2)  -> true
     *   (17).isMultipleOf(2) -> false
     *   (32).isMultipleOf(4) -> true
     *   (34).isMultipleOf(4) -> false
     *
     ***/
    'isMultipleOf': function(num) {
      return this % num === 0;
    },

    /***
     * @method upto(<num>, [fn])
     * @returns Array
     * @short Returns an array containing numbers from the number up to <num>. Optionally calls [fn] callback for each number in that array.
     * @example
     *
     *   (2).upto(6) -> [2, 3, 4, 5, 6]
     *   (2).upto(6, function(n) {
     *     // This function is called 5 times receiving n as the value.
     *   });
     *
     ***/
    'upto': function(num, fn) {
      var arr = [];
      for(var i = parseInt(this); i <= num; i++) {
        arr.push(i);
        if(fn) fn.call(this, i);
      }
      return arr;
    },

    /***
     * @method downto(<num>, [fn])
     * @returns Array
     * @short Returns an array containing numbers from the number down to <num>. Optionally calls [fn] callback for each number in that array.
     * @example
     *
     *   (8).downto(3) -> [8, 7, 6, 5, 4, 3]
     *   (8).upto(3, function(n) {
     *     // This function is called 6 times receiving n as the value.
     *   });
     *
     ***/
    'downto': function(num, fn) {
      var arr = [];
      for(var i = parseInt(this); i >= num; i--) {
        arr.push(i);
        if(fn) fn.call(this, i);
      }
      return arr;
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
      var suffix;
      if(this >= 11 && this <= 13) {
        suffix = 'th';
      } else {
        switch(this % 10) {
          case 1:  suffix = 'st'; break;
          case 2:  suffix = 'nd'; break;
          case 3:  suffix = 'rd'; break;
          default: suffix = 'th';
        }
      }
      return this.toString() + suffix;
    },


    /***
     * @method pad(<place> = 0, [sign] = false)
     * @returns String
     * @short Pads a number with "0" to <place>.
     * @extra [sign] allows you to force the sign as well (+05, etc).
     * @example
     *
     *   (5).pad(2)        -> '05'
     *   (-5).pad(4)       -> '-0005'
     *   (82).pad(3, true) -> '+082'
     *
     ***/
    'pad': function(place, sign) {
      var str  = this.toNumber() === 0 ? '' : this.toString().replace(/^-/, '');
      str = str.padLeft(place - str.length, '0');
      if(sign || this < 0) {
        str = (this < 0 ? '-' : '+') + str;
      }
      return str;
    },

    /***
     * @method format([comma] = ',', [period] = '.')
     * @returns String
     * @short Formats the number to a readable string.
     * @extra [comma] is the character used for the thousands separator. [period] is the character used for the decimal point.
     * @example
     *
     *   (56782).format()           -> '56,782'
     *   (4388.43).format()         -> '4,388.43'
     *   (4388.43).format(' ')      -> '4 388.43'
     *   (4388.43).format('.', ',') -> '4.388,43'
     *
     ***/
    'format': function(comma, period) {
      comma = comma || ',';
      period = period || '.';
      var split = this.toString().split('.');
      var numeric = split[0];
      var decimal = split.length > 1 ? period + split[1] : '';
      var reg = /(\d+)(\d{3})/;
      while (reg.test(numeric)) {
        numeric = numeric.replace(reg, '$1' + comma + '$2');
      }
      return numeric + decimal;
    },

    /***
     * @method hex()
     * @returns String
     * @short Converts the number to hexidecimal.
     * @example
     *
     *   (255).hex()   -> 'ff';
     *   (23654).hex() -> '5c66';
     *
     ***/
    'hex': function() {
      return this.toString(16);
    }

  });






  /***
   * String module
   *
   ***/


  var fullWidthTable;
  var halfWidthTable;
  var hiraganaTable;
  var katakanaTable;


  // Unsure of the author's name, but much thanks to this blog for helping
  // with the exact characters here http://lehelk.com/2011/05/06/script-to-remove-diacritics/

  var accentedCharacters = [
    { base: 'A',  reg: /[AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ]/g },
    { base: 'B',  reg: /[BⒷＢḂḄḆɃƂƁ]/g },
    { base: 'C',  reg: /[CⒸＣĆĈĊČÇḈƇȻꜾ]/g },
    { base: 'D',  reg: /[DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ]/g },
    { base: 'E',  reg: /[EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ]/g },
    { base: 'F',  reg: /[FⒻＦḞƑꝻ]/g },
    { base: 'G',  reg: /[GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ]/g },
    { base: 'H',  reg: /[HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ]/g },
    { base: 'I',  reg: /[IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ]/g },
    { base: 'J',  reg: /[JⒿＪĴɈ]/g },
    { base: 'K',  reg: /[KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ]/g },
    { base: 'L',  reg: /[LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ]/g },
    { base: 'M',  reg: /[MⓂＭḾṀṂⱮƜ]/g },
    { base: 'N',  reg: /[NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ]/g },
    { base: 'O',  reg: /[OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ]/g },
    { base: 'P',  reg: /[PⓅＰṔṖƤⱣꝐꝒꝔ]/g },
    { base: 'Q',  reg: /[QⓆＱꝖꝘɊ]/g },
    { base: 'R',  reg: /[RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ]/g },
    { base: 'S',  reg: /[SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ]/g },
    { base: 'T',  reg: /[TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ]/g },
    { base: 'U',  reg: /[UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ]/g },
    { base: 'V',  reg: /[VⓋＶṼṾƲꝞɅ]/g },
    { base: 'W',  reg: /[WⓌＷẀẂŴẆẄẈⱲ]/g },
    { base: 'X',  reg: /[XⓍＸẊẌ]/g },
    { base: 'Y',  reg: /[YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ]/g },
    { base: 'Z',  reg: /[ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ]/g },
    { base: 'a',  reg: /[aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ]/g },
    { base: 'b',  reg: /[bⓑｂḃḅḇƀƃɓ]/g },
    { base: 'c',  reg: /[cⓒｃćĉċčçḉƈȼꜿↄ]/g },
    { base: 'd',  reg: /[dⓓｄḋďḍḑḓḏđƌɖɗꝺ]/g },
    { base: 'e',  reg: /[eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ]/g },
    { base: 'f',  reg: /[fⓕｆḟƒꝼ]/g },
    { base: 'g',  reg: /[gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ]/g },
    { base: 'h',  reg: /[hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ]/g },
    { base: 'i',  reg: /[iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı]/g },
    { base: 'j',  reg: /[jⓙｊĵǰɉ]/g },
    { base: 'k',  reg: /[kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ]/g },
    { base: 'l',  reg: /[lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ]/g },
    { base: 'm',  reg: /[mⓜｍḿṁṃɱɯ]/g },
    { base: 'n',  reg: /[nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ]/g },
    { base: 'o',  reg: /[oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ]/g },
    { base: 'p',  reg: /[pⓟｐṕṗƥᵽꝑꝓꝕ]/g },
    { base: 'q',  reg: /[qⓠｑɋꝗꝙ]/g },
    { base: 'r',  reg: /[rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ]/g },
    { base: 's',  reg: /[sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ]/g },
    { base: 't',  reg: /[tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ]/g },
    { base: 'u',  reg: /[uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ]/g },
    { base: 'v',  reg: /[vⓥｖṽṿʋꝟʌ]/g },
    { base: 'w',  reg: /[wⓦｗẁẃŵẇẅẘẉⱳ]/g },
    { base: 'x',  reg: /[xⓧｘẋẍ]/g },
    { base: 'y',  reg: /[yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ]/g },
    { base: 'z',  reg: /[zⓩｚźẑżžẓẕƶȥɀⱬꝣ]/g },
    { base: 'AA', reg: /[Ꜳ]/g },
    { base: 'AE', reg: /[ÆǼǢ]/g },
    { base: 'AO', reg: /[Ꜵ]/g },
    { base: 'AU', reg: /[Ꜷ]/g },
    { base: 'AV', reg: /[ꜸꜺ]/g },
    { base: 'AY', reg: /[Ꜽ]/g },
    { base: 'DZ', reg: /[ǱǄ]/g },
    { base: 'Dz', reg: /[ǲǅ]/g },
    { base: 'LJ', reg: /[Ǉ]/g },
    { base: 'Lj', reg: /[ǈ]/g },
    { base: 'NJ', reg: /[Ǌ]/g },
    { base: 'Nj', reg: /[ǋ]/g },
    { base: 'OI', reg: /[Ƣ]/g },
    { base: 'OO', reg: /[Ꝏ]/g },
    { base: 'OU', reg: /[Ȣ]/g },
    { base: 'TZ', reg: /[Ꜩ]/g },
    { base: 'VY', reg: /[Ꝡ]/g },
    { base: 'aa', reg: /[ꜳ]/g },
    { base: 'ae', reg: /[æǽǣ]/g },
    { base: 'ao', reg: /[ꜵ]/g },
    { base: 'au', reg: /[ꜷ]/g },
    { base: 'av', reg: /[ꜹꜻ]/g },
    { base: 'ay', reg: /[ꜽ]/g },
    { base: 'dz', reg: /[ǳǆ]/g },
    { base: 'hv', reg: /[ƕ]/g },
    { base: 'lj', reg: /[ǉ]/g },
    { base: 'nj', reg: /[ǌ]/g },
    { base: 'oi', reg: /[ƣ]/g },
    { base: 'ou', reg: /[ȣ]/g },
    { base: 'oo', reg: /[ꝏ]/g },
    { base: 'tz', reg: /[ꜩ]/g },
    { base: 'vy', reg: /[ꝡ]/g }];


  var variableWidthChars = [

    { full:'　', half:' ',  type: 'p' },
    { full:'、', half:'､',  type: 'p' },
    { full:'。', half:'｡',  type: 'p' },
    { full:'，', half:',',  type: 'p' },
    { full:'．', half:'.',  type: 'p' },
    { full:'・', half:'･',  type: 'p' },
    { full:'：', half:':',  type: 'p' },
    { full:'；', half:';',  type: 'p' },
    { full:'？', half:'?',  type: 'p' },
    { full:'！', half:'!',  type: 'p' },
    { full:'‘',  half:'\'', type: 'p' },
    { full:'’',  half:'\'', type: 'p' },
    { full:'“',  half:'"',  type: 'p' },
    { full:'”',  half:'"',  type: 'p' },
    { full:'ー', half:'ｰ',  type: 'p' },
    { full:'～', half:'~',  type: 'p' },
    { full:'゛', half:'ﾞ',  type: 's' },
    { full:'゜', half:'ﾟ',  type: 's' },
    { full:'＾', half:'^',  type: 's' },
    { full:'‐',  half:'-',  type: 's' },
    { full:'／', half:'/',  type: 's' },
    { full:'｜', half:'|',  type: 's' },
    { full:'（', half:'(',  type: 's' },
    { full:'）', half:')',  type: 's' },
    { full:'［', half:'[',  type: 's' },
    { full:'］', half:']',  type: 's' },
    { full:'｛', half:'{',  type: 's' },
    { full:'｝', half:'}',  type: 's' },
    { full:'「', half:'｢',  type: 's' },
    { full:'」', half:'｣',  type: 's' },
    { full:'〈', half:'<',  type: 's' },
    { full:'〉', half:'>',  type: 's' },
    { full:'《', half:'«',  type: 's' },
    { full:'》', half:'»',  type: 's' },
    { full:'＋', half:'+',  type: 's' },
    { full:'－', half:'-',  type: 's' },
    { full:'＝', half:'=',  type: 's' },
    { full:'＜', half:'<',  type: 's' },
    { full:'＞', half:'>',  type: 's' },
    { full:'℃',  half:'°C', type: 's' },
    { full:'￥', half:'¥',  type: 's' },
    { full:'＄', half:'$',  type: 's' },
    { full:'￠', half:'¢',  type: 's' },
    { full:'￡', half:'£',  type: 's' },
    { full:'％', half:'%',  type: 's' },
    { full:'＃', half:'#',  type: 's' },
    { full:'＆', half:'&',  type: 's' },
    { full:'＊', half:'*',  type: 's' },
    { full:'＠', half:'@',  type: 's' },
    { full:'０', half:'0',  type: 'n' },
    { full:'１', half:'1',  type: 'n' },
    { full:'２', half:'2',  type: 'n' },
    { full:'３', half:'3',  type: 'n' },
    { full:'４', half:'4',  type: 'n' },
    { full:'５', half:'5',  type: 'n' },
    { full:'６', half:'6',  type: 'n' },
    { full:'７', half:'7',  type: 'n' },
    { full:'８', half:'8',  type: 'n' },
    { full:'９', half:'9',  type: 'n' },
    { full:'Ａ', half:'A',  type: 'a' },
    { full:'Ｂ', half:'B',  type: 'a' },
    { full:'Ｃ', half:'C',  type: 'a' },
    { full:'Ｄ', half:'D',  type: 'a' },
    { full:'Ｅ', half:'E',  type: 'a' },
    { full:'Ｆ', half:'F',  type: 'a' },
    { full:'Ｇ', half:'G',  type: 'a' },
    { full:'Ｈ', half:'H',  type: 'a' },
    { full:'Ｉ', half:'I',  type: 'a' },
    { full:'Ｊ', half:'J',  type: 'a' },
    { full:'Ｋ', half:'K',  type: 'a' },
    { full:'Ｌ', half:'L',  type: 'a' },
    { full:'Ｍ', half:'M',  type: 'a' },
    { full:'Ｎ', half:'N',  type: 'a' },
    { full:'Ｏ', half:'O',  type: 'a' },
    { full:'Ｐ', half:'P',  type: 'a' },
    { full:'Ｑ', half:'Q',  type: 'a' },
    { full:'Ｒ', half:'R',  type: 'a' },
    { full:'Ｓ', half:'S',  type: 'a' },
    { full:'Ｔ', half:'T',  type: 'a' },
    { full:'Ｕ', half:'U',  type: 'a' },
    { full:'Ｖ', half:'V',  type: 'a' },
    { full:'Ｗ', half:'W',  type: 'a' },
    { full:'Ｘ', half:'X',  type: 'a' },
    { full:'Ｙ', half:'Y',  type: 'a' },
    { full:'Ｚ', half:'Z',  type: 'a' },
    { full:'ａ', half:'a',  type: 'a' },
    { full:'ｂ', half:'b',  type: 'a' },
    { full:'ｃ', half:'c',  type: 'a' },
    { full:'ｄ', half:'d',  type: 'a' },
    { full:'ｅ', half:'e',  type: 'a' },
    { full:'ｆ', half:'f',  type: 'a' },
    { full:'ｇ', half:'g',  type: 'a' },
    { full:'ｈ', half:'h',  type: 'a' },
    { full:'ｉ', half:'i',  type: 'a' },
    { full:'ｊ', half:'j',  type: 'a' },
    { full:'ｋ', half:'k',  type: 'a' },
    { full:'ｌ', half:'l',  type: 'a' },
    { full:'ｍ', half:'m',  type: 'a' },
    { full:'ｎ', half:'n',  type: 'a' },
    { full:'ｏ', half:'o',  type: 'a' },
    { full:'ｐ', half:'p',  type: 'a' },
    { full:'ｑ', half:'q',  type: 'a' },
    { full:'ｒ', half:'r',  type: 'a' },
    { full:'ｓ', half:'s',  type: 'a' },
    { full:'ｔ', half:'t',  type: 'a' },
    { full:'ｕ', half:'u',  type: 'a' },
    { full:'ｖ', half:'v',  type: 'a' },
    { full:'ｗ', half:'w',  type: 'a' },
    { full:'ｘ', half:'x',  type: 'a' },
    { full:'ｙ', half:'y',  type: 'a' },
    { full:'ｚ', half:'z',  type: 'a' },
    { full:'ァ', half:'ｧ',  type: 'k' },
    { full:'ア', half:'ｱ',  type: 'k' },
    { full:'ィ', half:'ｨ',  type: 'k' },
    { full:'イ', half:'ｲ',  type: 'k' },
    { full:'ゥ', half:'ｩ',  type: 'k' },
    { full:'ウ', half:'ｳ',  type: 'k' },
    { full:'ェ', half:'ｪ',  type: 'k' },
    { full:'エ', half:'ｴ',  type: 'k' },
    { full:'ォ', half:'ｫ',  type: 'k' },
    { full:'オ', half:'ｵ',  type: 'k' },
    { full:'カ', half:'ｶ',  type: 'k' },
    { full:'ガ', half:'ｶﾞ', type: 'k' },
    { full:'キ', half:'ｷ',  type: 'k' },
    { full:'ギ', half:'ｷﾞ', type: 'k' },
    { full:'ク', half:'ｸ',  type: 'k' },
    { full:'グ', half:'ｸﾞ', type: 'k' },
    { full:'ケ', half:'ｹ',  type: 'k' },
    { full:'ゲ', half:'ｹﾞ', type: 'k' },
    { full:'コ', half:'ｺ',  type: 'k' },
    { full:'ゴ', half:'ｺﾞ', type: 'k' },
    { full:'サ', half:'ｻ',  type: 'k' },
    { full:'ザ', half:'ｻﾞ', type: 'k' },
    { full:'シ', half:'ｼ',  type: 'k' },
    { full:'ジ', half:'ｼﾞ', type: 'k' },
    { full:'ス', half:'ｽ',  type: 'k' },
    { full:'ズ', half:'ｽﾞ', type: 'k' },
    { full:'セ', half:'ｾ',  type: 'k' },
    { full:'ゼ', half:'ｾﾞ', type: 'k' },
    { full:'ソ', half:'ｿ',  type: 'k' },
    { full:'ゾ', half:'ｿﾞ', type: 'k' },
    { full:'タ', half:'ﾀ',  type: 'k' },
    { full:'ダ', half:'ﾀﾞ', type: 'k' },
    { full:'チ', half:'ﾁ',  type: 'k' },
    { full:'ヂ', half:'ﾁﾞ', type: 'k' },
    { full:'ッ', half:'ｯ',  type: 'k' },
    { full:'ツ', half:'ﾂ',  type: 'k' },
    { full:'ヅ', half:'ﾂﾞ', type: 'k' },
    { full:'テ', half:'ﾃ',  type: 'k' },
    { full:'デ', half:'ﾃﾞ', type: 'k' },
    { full:'ト', half:'ﾄ',  type: 'k' },
    { full:'ド', half:'ﾄﾞ', type: 'k' },
    { full:'ナ', half:'ﾅ',  type: 'k' },
    { full:'ニ', half:'ﾆ',  type: 'k' },
    { full:'ヌ', half:'ﾇ',  type: 'k' },
    { full:'ネ', half:'ﾈ',  type: 'k' },
    { full:'ノ', half:'ﾉ',  type: 'k' },
    { full:'ハ', half:'ﾊ',  type: 'k' },
    { full:'バ', half:'ﾊﾞ', type: 'k' },
    { full:'パ', half:'ﾊﾟ', type: 'k' },
    { full:'ヒ', half:'ﾋ',  type: 'k' },
    { full:'ビ', half:'ﾋﾞ', type: 'k' },
    { full:'ピ', half:'ﾋﾟ', type: 'k' },
    { full:'フ', half:'ﾌ',  type: 'k' },
    { full:'ブ', half:'ﾌﾞ', type: 'k' },
    { full:'プ', half:'ﾌﾟ', type: 'k' },
    { full:'ヘ', half:'ﾍ',  type: 'k' },
    { full:'ベ', half:'ﾍﾞ', type: 'k' },
    { full:'ペ', half:'ﾍﾟ', type: 'k' },
    { full:'ホ', half:'ﾎ',  type: 'k' },
    { full:'ボ', half:'ﾎﾞ', type: 'k' },
    { full:'ポ', half:'ﾎﾟ', type: 'k' },
    { full:'マ', half:'ﾏ',  type: 'k' },
    { full:'ミ', half:'ﾐ',  type: 'k' },
    { full:'ム', half:'ﾑ',  type: 'k' },
    { full:'メ', half:'ﾒ',  type: 'k' },
    { full:'モ', half:'ﾓ',  type: 'k' },
    { full:'ャ', half:'ｬ',  type: 'k' },
    { full:'ヤ', half:'ﾔ',  type: 'k' },
    { full:'ュ', half:'ｭ',  type: 'k' },
    { full:'ユ', half:'ﾕ',  type: 'k' },
    { full:'ョ', half:'ｮ',  type: 'k' },
    { full:'ヨ', half:'ﾖ',  type: 'k' },
    { full:'ラ', half:'ﾗ',  type: 'k' },
    { full:'リ', half:'ﾘ',  type: 'k' },
    { full:'ル', half:'ﾙ',  type: 'k' },
    { full:'レ', half:'ﾚ',  type: 'k' },
    { full:'ロ', half:'ﾛ',  type: 'k' },
    { full:'ワ', half:'ﾜ',  type: 'k' },
    { full:'ヲ', half:'ｦ',  type: 'k' },
    { full:'ン', half:'ﾝ',  type: 'k' }

  ];


  var kana = [

    { hira:'ぁ', kata:'ァ' },
    { hira:'あ', kata:'ア' },
    { hira:'ぃ', kata:'ィ' },
    { hira:'い', kata:'イ' },
    { hira:'ぅ', kata:'ゥ' },
    { hira:'う', kata:'ウ' },
    { hira:'ぇ', kata:'ェ' },
    { hira:'え', kata:'エ' },
    { hira:'ぉ', kata:'ォ' },
    { hira:'お', kata:'オ' },
    { hira:'か', kata:'カ' },
    { hira:'が', kata:'ガ' },
    { hira:'き', kata:'キ' },
    { hira:'ぎ', kata:'ギ' },
    { hira:'く', kata:'ク' },
    { hira:'ぐ', kata:'グ' },
    { hira:'け', kata:'ケ' },
    { hira:'げ', kata:'ゲ' },
    { hira:'こ', kata:'コ' },
    { hira:'ご', kata:'ゴ' },
    { hira:'さ', kata:'サ' },
    { hira:'ざ', kata:'ザ' },
    { hira:'し', kata:'シ' },
    { hira:'じ', kata:'ジ' },
    { hira:'す', kata:'ス' },
    { hira:'ず', kata:'ズ' },
    { hira:'せ', kata:'セ' },
    { hira:'ぜ', kata:'ゼ' },
    { hira:'そ', kata:'ソ' },
    { hira:'ぞ', kata:'ゾ' },
    { hira:'た', kata:'タ' },
    { hira:'だ', kata:'ダ' },
    { hira:'ち', kata:'チ' },
    { hira:'ぢ', kata:'ヂ' },
    { hira:'っ', kata:'ッ' },
    { hira:'つ', kata:'ツ' },
    { hira:'づ', kata:'ヅ' },
    { hira:'て', kata:'テ' },
    { hira:'で', kata:'デ' },
    { hira:'と', kata:'ト' },
    { hira:'ど', kata:'ド' },
    { hira:'な', kata:'ナ' },
    { hira:'に', kata:'ニ' },
    { hira:'ぬ', kata:'ヌ' },
    { hira:'ね', kata:'ネ' },
    { hira:'の', kata:'ノ' },
    { hira:'は', kata:'ハ' },
    { hira:'ば', kata:'バ' },
    { hira:'ぱ', kata:'パ' },
    { hira:'ひ', kata:'ヒ' },
    { hira:'び', kata:'ビ' },
    { hira:'ぴ', kata:'ピ' },
    { hira:'ふ', kata:'フ' },
    { hira:'ぶ', kata:'ブ' },
    { hira:'ぷ', kata:'プ' },
    { hira:'へ', kata:'ヘ' },
    { hira:'べ', kata:'ベ' },
    { hira:'ぺ', kata:'ペ' },
    { hira:'ほ', kata:'ホ' },
    { hira:'ぼ', kata:'ボ' },
    { hira:'ぽ', kata:'ポ' },
    { hira:'ま', kata:'マ' },
    { hira:'み', kata:'ミ' },
    { hira:'む', kata:'ム' },
    { hira:'め', kata:'メ' },
    { hira:'も', kata:'モ' },
    { hira:'ゃ', kata:'ャ' },
    { hira:'や', kata:'ヤ' },
    { hira:'ゅ', kata:'ュ' },
    { hira:'ゆ', kata:'ユ' },
    { hira:'ょ', kata:'ョ' },
    { hira:'よ', kata:'ヨ' },
    { hira:'ら', kata:'ラ' },
    { hira:'り', kata:'リ' },
    { hira:'る', kata:'ル' },
    { hira:'れ', kata:'レ' },
    { hira:'ろ', kata:'ロ' },
    { hira:'ゎ', kata:'ヮ' },
    { hira:'わ', kata:'ワ' },
    { hira:'ゐ', kata:'ヰ' },
    { hira:'ゑ', kata:'ヱ' },
    { hira:'を', kata:'ヲ' },
    { hira:'ん', kata:'ン' }

  ];

  var unicodeScripts = [
    { names: ['Greek'],       source: '\\u0370-\\u03FF' },
    { names: ['Cyrillic'],    source: '\\u0400-\\u04FF' },
    { names: ['Armenian'],    source: '\\u0530-\\u058F' },
    { names: ['Hebrew'],      source: '\\u0590-\\u05FF' },
    { names: ['Arabic'],      source: '\\u0600-\\u06FF' },
    { names: ['Thai'],        source: '\\u0E00-\\u0E7F' },
    { names: ['Tibetan'],     source: '\\u0F00-\\u0FFF' },
    { names: ['Georgian'],    source: '\\u10A0-\\u10FF' },
    { names: ['Tagalog'],     source: '\\u1700-\\u171F' },
    { names: ['Mongolian'],   source: '\\u1800-\\u18AF' },
    { names: ['Hiragana'],    source: '\\u3040-\\u309F\\u30FB-\\u30FC' },
    { names: ['Katakana'],    source: "\\u30A0-\\u30FF\\uFF61-\\uFF9F" },
    { names: ['Kana'],        source: '\\u3040-\\u30FF\\uFF61-\\uFF9F' },
    { names: ['Bopomofo'],    source: '\\u3100-\\u312F' },
    { names: ['Hangul'],      source: '\\uAC00-\\uD7AF\\u1100-\\u11FF' },
    { names: ['Han','Kanji'], source: '\\u4E00-\\u9FFF\\uF900-\\uFAFF' }
  ];

  var buildVariableWidthTables = function() {
    fullWidthTable = {};
    halfWidthTable = {};
    for(var i=0; i<variableWidthChars.length; i++) {
      var c = variableWidthChars[i];
      fullWidthTable[c.half] = c;
      halfWidthTable[c.full] = c;
    }
  }

  var buildKanaTables = function() {
    hiraganaTable = {};
    katakanaTable = {};
    for(var i=0; i<kana.length; i++) {
      var k = kana[i];
      hiraganaTable[k.kata] = k;
      katakanaTable[k.hira] = k;
    }
  }

  var buildUnicodeScripts = function() {
    unicodeScripts.each(function(s) {
      var is = new RegExp('^['+s.source+'\\s]+$');
      var has = new RegExp('['+s.source+']');
      s.names.each(function(name) {
        defineProperty(String.prototype, 'is' + name, function() { return !!this.trim().match(is); });
        defineProperty(String.prototype, 'has' + name, function() { return !!this.match(has); });
      });
    });
  }

  var variableWidthMode = function(mode) {
    /* hankaku/zenkaku transposition arguments default to everything */
    if(!mode || mode == 'all') return { 'a':true,'n':true,'k':true,'s':true,'p':true };
    var result = {};
    if(mode.length < 6) {
      for(var i=0; i < mode.length; i++) {
        result[mode.charAt(i)] = true;
      }
    } else {
      if(mode === 'alphabet')    result.a = true;
      if(mode === 'numbers')     result.n = true;
      if(mode === 'katakana')    result.k = true;
      if(mode === 'special')     result.s = true;
      if(mode === 'punctuation') result.p = true;
    }
    return result;
  }

  var padString = function(str, num, padding, direction) {
    num = num || 0;
    padding = padding || ' ';
    direction = direction || 'both';
    for(var i=0; i<num; i++) {
      if(direction === 'left'  || direction === 'both') str = padding + str;
      if(direction === 'right' || direction === 'both') str = str + padding;
    }
    return str.toString();
  }

   // Match patched to support non-participating capturing groups.
   var NPCGMatch = function(str, reg) {
     var match = str.match(reg);
     if(match && !RegExp.NPCGSupport && !reg.global) {
        for(var i = 1; i < match.length; i++) {
          if(match[i] === '') match[i] = undefined;
        }
     }
     return match;
   }

   var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

   if(typeof btoa === 'undefined') {
     btoa = function(str) {
       var output = '';
       var chr1, chr2, chr3 = '';
       var enc1, enc2, enc3, enc4 = '';
       var i = 0;
       do {
         chr1 = str.charCodeAt(i++);
         chr2 = str.charCodeAt(i++);
         chr3 = str.charCodeAt(i++);
         enc1 = chr1 >> 2;
         enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
         enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
         enc4 = chr3 & 63;
         if (isNaN(chr2)) {
           enc3 = enc4 = 64;
         } else if (isNaN(chr3)) {
           enc4 = 64;
         }
         output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
         chr1 = chr2 = chr3 = '';
         enc1 = enc2 = enc3 = enc4 = '';
       } while (i < str.length);
       return output;
     }
   }

   if(typeof atob === 'undefined') {

     atob = function(input) {
       var output = '';
       var chr1, chr2, chr3 = '';
       var enc1, enc2, enc3, enc4 = '';
       var i = 0;

       var base64test = /[^A-Za-z0-9\+\/\=]/g;
       if(base64test.test(input)) {
         throw new Error('String contains invalid base64 characters');
       }
       input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
       do {
         enc1 = keyStr.indexOf(input.charAt(i++));
         enc2 = keyStr.indexOf(input.charAt(i++));
         enc3 = keyStr.indexOf(input.charAt(i++));
         enc4 = keyStr.indexOf(input.charAt(i++));
         chr1 = (enc1 << 2) | (enc2 >> 4);
         chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
         chr3 = ((enc3 & 3) << 6) | enc4;
         output = output + String.fromCharCode(chr1);
         if (enc3 != 64) {
           output = output + String.fromCharCode(chr2);
         }
         if (enc4 != 64) {
           output = output + String.fromCharCode(chr3);
         }
         chr1 = chr2 = chr3 = "";
         enc1 = enc2 = enc3 = enc4 = "";
       } while (i < input.length);
       return unescape(output);
     }
   }

  var buildString = function() {
    buildKanaTables();
    buildVariableWidthTables();
    buildUnicodeScripts();
  }



  extend(String, true, {

     /***
      * @method escapeRegExp()
      * @returns String
      * @short Escapes all RegExp tokens in the string.
      * @example
      *
      *   'really?'.escapeRegExp()       -> 'really\?'
      *   'yes.'.escapeRegExp()         -> 'yes\.'
      *   '(not really)'.escapeRegExp() -> '\(not really\)'
      *
      ***/
    'escapeRegExp': function() {
      return RegExp.escape(this);
    },

     /***
      * @method escapeURL([param] = false)
      * @returns String
      * @short Escapes characters in a string to make a valid URL.
      * @extra If [param] is true, it will also escape valid URL characters for use as a URL parameter.
      * @example
      *
      *   'http://foo.com/"bar"'.escapeURL()     -> 'http://foo.com/%22bar%22'
      *   'http://foo.com/"bar"'.escapeURL(true) -> 'http%3A%2F%2Ffoo.com%2F%22bar%22'
      *
      ***/
    'escapeURL': function(param) {
      return param ? encodeURIComponent(this) : encodeURI(this);
    },

     /***
      * @method unescapeURL([partial] = false)
      * @returns String
      * @short Restores escaped characters in a URL escaped string.
      * @extra If [partial] is true, it will only unescape non-valid URL characters. [partial] is included here for completeness, but should very rarely be needed.
      * @example
      *
      *   'http%3A%2F%2Ffoo.com%2Fthe%20bar'.unescapeURL()     -> 'http://foo.com/the bar'
      *   'http%3A%2F%2Ffoo.com%2Fthe%20bar'.unescapeURL(true) -> 'http%3A%2F%2Ffoo.com%2Fthe bar'
      *
      ***/
    'unescapeURL': function(param) {
      return param ? decodeURI(this) : decodeURIComponent(this);
    },

     /***
      * @method encodeBase64()
      * @returns String
      * @short Encodes the string into base 64 encoding.
      * @extra This methods wraps the browser native %btoa% when available, and uses a custom implementation when not available.
      * @example
      *
      *   'gonna get encoded!'.encodeBase64()  -> 'Z29ubmEgZ2V0IGVuY29kZWQh'
      *   'http://twitter.com/'.encodeBase64() -> 'aHR0cDovL3R3aXR0ZXIuY29tLw=='
      *
      ***/
    'encodeBase64': function() {
      return btoa(this);
    },

     /***
      * @method decodeBase64()
      * @returns String
      * @short Decodes the string from base 64 encoding.
      * @extra This methods wraps the browser native %atob% when available, and uses a custom implementation when not available.
      * @example
      *
      *   'aHR0cDovL3R3aXR0ZXIuY29tLw=='.decodeBase64() -> 'http://twitter.com/'
      *   'anVzdCBnb3QgZGVjb2RlZA=='.decodeBase64()     -> 'just got decoded!'
      *
      ***/
    'decodeBase64': function() {
      return atob(this);
    },

    /***
     * @method capitalize()
     * @returns String
     * @short Capitalizes the first character in the string.
     * @example
     *
     *   'hello'.capitalize()              -> 'Hello'
     *   'why hello there...'.capitalize() -> 'Why hello there...'
     *
     *
     ***/
    'capitalize': function() {
      return this.substr(0,1).toUpperCase() + this.substr(1).toLowerCase();
    },

    /***
     * @method trim()
     * @returns String
     * @short Removes leading and trailing whitespace from the string.
     * @example
     *
     *   '   wasabi   '.trim()   -> 'wasabi'
     *   "   wasabi  \n ".trim() -> 'wasabi'
     *
     ***/
    'trim': function() {
      return this.trimLeft().trimRight();
    },

    /***
     * @method trimLeft()
     * @returns String
     * @short Removes leading whitespace from the string.
     * @example
     *
     *   '   wasabi   '.trimLeft()   -> 'wasabi   '
     *   " \n  wasabi   ".trimLeft() -> 'wasabi   '
     *
     ***/
    'trimLeft': function() {
      return this.replace(/^[\s　][\s　]*/, '');
    },

    /***
     * @method trimRight()
     * @returns String
     * @short Removes trailing whitespace from the string.
     * @example
     *
     *   '   wasabi   '.trimRight()   -> '   wasabi'
     *   "   wasabi  \n ".trimRight() -> '   wasabi'
     *
     ***/
    'trimRight': function() {
      return this.replace(/[\s　][\s　]*$/, '');
    },

    /***
     * @method pad([num] = 0, [padding] = ' ')
     * @returns String
     * @short Pads both sides of the string.
     * @extra [num] is the number of characters on each side, and [padding] is the character to pad with.
     * @example
     *
     *   'wasabi'.pad(2)               -> '  wasabi  '
     *   'wasabi'.pad(2, '--')         -> '--wasabi--'
     *   'wasabi'.pad(2).pad(3, '---') -> '---  wasabi  ---'
     *
     ***/
    'pad': function(num, padding) {
      return this.padLeft(num, padding).padRight(num, padding);
    },

    /***
     * @method padLeft([num] = 0, [padding] = ' ')
     * @returns String
     * @short Pads the left side of the string.
     * @extra [num] is the number of characters, and [padding] is the character to pad with.
     * @example
     *
     *   'wasabi'.padLeft(2)       -> '  wasabi'
     *   'wasabi'.padLeft(2, '--') -> '--wasabi'
     *
     ***/
    'padLeft': function(num, padding) {
      return padString(this, num, padding, 'left');
    },

    /***
     * @method padRight([num] = 0, [padding] = ' ')
     * @returns String
     * @short Pads the right side of the string.
     * @extra [num] is the number of characters, and [padding] is the character to pad with.
     * @example
     *
     *   'wasabi'.padRight(2)       -> 'wasabi  '
     *   'wasabi'.padRight(2, '--') -> 'wasabi--'
     *
     ***/
    'padRight': function(num, padding) {
      return padString(this, num, padding, 'right');
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
      num = num || 0;
      if(num < 0) return this;
      var str = '';
      for(var i=0; i<num; i++) {
        str += this;
      }
      return str;
    },

    /***
     * @method each([search], [fn])
     * @returns Array
     * @short Runs callback [fn] against each occurence of [search].
     * @extra Returns an array of matches. [search] may be either a string or regex, and defaults to every character in the string.
     * @example
     *
     *   'jumpy'.each() -> ['j','u','m','p','y']
     *   'jumpy'.each(/[r-z]/) -> ['u','y']
     *   'jumpy'.each(/[r-z]/, function(m) {
     *     // Called twice: "u", "y"
     *   });
     *
     ***/
    'each': function(search, fn) {
      if(Object.isFunction(search)) {
        fn = search;
        search = /./g;
      } else if(!search) {
        search = /./g
      } else if(Object.isString(search)) {
        search = new RegExp(RegExp.escape(search), 'gi');
      } else if(Object.isRegExp(search)) {
        search = search.addFlag('g');
      }
      var match = this.match(search) || [];
      if(fn) {
        for(var i=0; i<match.length; i++) {
          match[i] = fn.call(this, match[i], i) || match[i];
        }
      }
      return match;
    },


    /***
     * @method codes([fn])
     * @returns Array
     * @short Runs callback [fn] against each character code in the string. Returns an array of character codes.
     * @example
     *
     *   'jumpy'.codes() -> [106,117,109,112,121]
     *   'jumpy'.codes(function(c) {
     *     // Called 5 times: 106, 117, 109, 112, 121
     *   });
     *
     ***/
    'codes': function(fn) {
      var codes = [];
      for(var i=0; i<this.length; i++) {
        var code = this.charCodeAt(i);
        codes.push(code);
        if(fn) fn.call(this, code, i);
      }
      return codes;
    },

    /***
     * @method chars([fn])
     * @returns Array
     * @short Runs callback [fn] against each character in the string. Returns an array of characters.
     * @example
     *
     *   'jumpy'.chars() -> ['j','u','m','p','y']
     *   'jumpy'.chars(function(c) {
     *     // Called 5 times: "j","u","m","p","y"
     *   });
     *
     ***/
    'chars': function(fn) {
      return this.trim().each(fn);
    },

    /***
     * @method words([fn])
     * @returns Array
     * @short Runs callback [fn] against each word in the string. Returns an array of words.
     * @extra A "word" here is defined as any sequence of non-whitespace characters.
     * @example
     *
     *   'broken wear'.words() -> ['broken','wear']
     *   'broken wear'.words(function(w) {
     *     // Called twice: "broken", "wear"
     *   });
     *
     ***/
    'words': function(fn) {
      return this.trim().each(/\S+/g, fn);
    },

    /***
     * @method lines([fn])
     * @returns Array
     * @short Runs callback [fn] against each line in the string. Returns an array of lines.
     * @example
     *
     *   'broken wear\nand\njumpy jump'.lines() -> ['broken wear','and','jumpy jump']
     *   'broken wear\nand\njumpy jump'.lines(function(l) {
     *     // Called three times: "broken wear", "and", "jumpy jump"
     *   });
     *
     ***/
    'lines': function(fn) {
      return this.trim().each(/^.*$/gm, fn);
    },

    /***
     * @method paragraphs([fn])
     * @returns Array
     * @short Runs callback [fn] against each paragraph in the string. Returns an array of paragraphs.
     * @extra A paragraph here is defined as a block of text bounded by two or more line breaks.
     * @example
     *
     *   'Once upon a time.\n\nIn the land of oz...'.paragraphs() -> ['Once upon a time.','In the land of oz...']
     *   'Once upon a time.\n\nIn the land of oz...'.paragraphs(function(p) {
     *     // Called twice: "Once upon a time.", "In teh land of oz..."
     *   });
     *
     ***/
    'paragraphs': function(fn) {
      var paragraphs = this.trim().split(/[\r\n]{2,}/);
      paragraphs = paragraphs.map(function(p) {
        if(fn) var s = fn.call(p);
        return s ? s : p;
      });
      return paragraphs;
    },

    /***
     * @method normalize()
     * @returns String
     * @short Returns the string with accented and non-standard Latin-based characters converted into standard letters.
     * @example
     *
     *   'á'.normalize()                  -> 'a'
     *   'Ménage à trois'.normalize()     -> 'Menage a trois'
     *   'Volkswagen'.normalize()         -> 'Volkswagen'
     *   'ＦＵＬＬＷＩＤＴＨ'.normalize() -> 'FULLWIDTH'
     *
     ***/
    'normalize': function() {
      var text = this.toString();
      accentedCharacters.each(function(d) {
        text = text.replace(d.reg, d.base);
      });
      return text;
    },

    /***
     * @method startsWith(<find>, [caseSensitive] = true)
     * @returns Boolean
     * @short Returns true if the string starts with <find>.
     * @extra <find> may be either a string or regex.
     * @example
     *
     *   'hello'.startsWith('hell')        -> true
     *   'hello'.startsWith(/[a-h]/)       -> true
     *   'hello'.startsWith('HELL')        -> false
     *   'hello'.startsWith('HELL', false) -> true
     *
     ***/
    'startsWith': function(reg, caseSensitive) {
      if(caseSensitive === undefined) caseSensitive = true;
      var source = Object.isRegExp(reg) ? reg.source.replace('^', '') : RegExp.escape(reg);
      return new RegExp('^' + source, caseSensitive ? '' : 'i').test(this);
    },

    /***
     * @method endsWith(<find>, [caseSensitive] = true)
     * @returns Boolean
     * @short Returns true if the string ends with <find>.
     * @extra <find> may be either a string or regex.
     * @example
     *
     *   'jumpy'.endsWith('py')         -> true
     *   'jumpy'.endsWith(/[q-z]/)      -> true
     *   'jumpy'.endsWith('MPY')        -> false
     *   'jumpy'.endsWith('MPY', false) -> true
     *
     ***/
    'endsWith': function(reg, caseSensitive) {
      if(caseSensitive === undefined) caseSensitive = true;
      var source = Object.isRegExp(reg) ? reg.source.replace('$', '') : RegExp.escape(reg);
      return new RegExp(source + '$', caseSensitive ? '' : 'i').test(this);
    },

    /***
     * @method isBlank()
     * @returns Boolean
     * @short Returns true if the string has a length of 0 or contains only whitespace.
     * @example
     *
     *   ''.isBlank()      -> true
     *   '   '.isBlank()   -> true
     *   'noway'.isBlank() -> false
     *
     ***/
    'isBlank': function() {
      return this.trim().length === 0;
    },

    /***
     * @method has(<find>)
     * @returns Boolean
     * @short Returns true if the string matches <find>.
     * @extra <find> may be a string or regex.
     * @example
     *
     *   'jumpy'.has('py')     -> true
     *   'broken'.has(/[a-n]/) -> true
     *   'broken'.has(/[s-z]/) -> false
     *
     ***/
    'has': function(find) {
      return this.search(find) !== -1;
    },


    /***
     * @method add(<str>, [index] = 0)
     * @returns String
     * @short Adds <str> at [index]. Negative values are also allowed.
     * @example
     *
     *   'five'.add('schfifty ')      -> schfifty five
     *   'dopamine'.add('e', 3)       -> dopeamine
     *   'spelling eror'.add('r', -3) -> spelling error
     *
     ***/
    'add': function(str, index) {
      index = index || 0;
      if(index < 0) index = this.length + index + 1;
      if(index < 0 || index > this.length) return this;
      return this.substr(0, index) + str + this.substr(index);
    },

    /***
     * @method hankaku([mode] = 'all')
     * @returns String
     * @short Converts full-width characters (zenkaku) to half-width (hankaku).
     * @extra [mode] accepts any combination of "a" (alphabet), "n" (numbers), "k" (katakana), "s" (spaces), "p" (punctuation), or "all".
     * @example
     *
     *   'タロウ　ＹＡＭＡＤＡです！'.hankaku()    -> 'ﾀﾛｳ YAMADAです!'
     *   'タロウ　ＹＡＭＡＤＡです！'.hankaku('a') -> 'タロウ　YAMADAです！'
     *   'タロウ　ＹＡＭＡＤＡです！'.hankaku('k') -> 'ﾀﾛｳ　ＹＡＭＡＤＡです！'
     *
     ***/
    'hankaku': function(mode) {
      mode = variableWidthMode(mode);
      var text = '';
      for(var i=0; i<this.length; i++) {
        var character = this.charAt(i);
        if(halfWidthTable[character] && mode[halfWidthTable[character]['type']]) {
          text += halfWidthTable[character]['half'];
        } else {
          text += character;
        }
      }
      return text;
    },

    /***
     * @method zenkaku([mode] = 'all')
     * @returns String
     * @short Converts half-width characters (hankaku) to full-width (zenkaku).
     * @extra [mode] accepts any combination of "a" (alphabet), "n" (numbers), "k" (katakana), "s" (spaces), "p" (punctuation), or "all".
     * @example
     *
     *   'ﾀﾛｳ YAMADAです!'.zenkaku()    -> 'タロウ　ＹＡＭＡＤＡです！'
     *   'ﾀﾛｳ YAMADAです!'.zenkaku('a') -> 'ﾀﾛｳ ＹＡＭＡＤＡです!'
     *   'ﾀﾛｳ YAMADAです!'.zenkaku('k') -> 'タロウ YAMADAです!'
     *
     ***/
    'zenkaku': function(mode) {
      mode = variableWidthMode(mode);
      var text = '';
      for(var i=0; i<this.length; i++) {
        var character = this.charAt(i);
        var nextCharacter = this.charAt(i+1);
        if(nextCharacter && fullWidthTable[character + nextCharacter]) {
          text += fullWidthTable[character + nextCharacter]['full'];
          i++;
        } else if(fullWidthTable[character] && mode[fullWidthTable[character]['type']]) {
          text += fullWidthTable[character]['full'];
        } else {
          text += character;
        }
      }
      return text;
    },

    /***
     * @method hiragana([all] = true)
     * @returns String
     * @short Converts katakana into hiragana.
     * @extra If [all] is false, only convert full-width katakana, otherwise convert all.
     * @example
     *
     *   'カタカナ'.hiragana()   -> 'かたかな'
     *   'コンニチハ'.hiragana() -> 'こんにちは'
     *   'ｶﾀｶﾅ'.hiragana()       -> 'かたかな'
     *   'ｶﾀｶﾅ'.hiragana(false)  -> 'ｶﾀｶﾅ'
     *
     ***/
    'hiragana': function(convertWidth) {
      var str = convertWidth === false ? this : this.zenkaku('k');
      var text = '';
      for(var i=0; i<str.length; i++) {
        var character = str.charAt(i);
        if(hiraganaTable[character]) {
          text += hiraganaTable[character]['hira'];
        } else {
          text += character;
        }
      }
      return text;
    },

    /***
     * @method katakana()
     * @returns String
     * @short Converts hiragana into katakana.
     * @example
     *
     *   'かたかな'.katakana()   -> 'カタカナ'
     *   'こんにちは'.katakana() -> 'コンニチハ'
     *
     ***/
    'katakana': function() {
      var text = '';
      for(var i=0; i<this.length; i++) {
        var character = this.charAt(i);
        if(katakanaTable[character]) {
          text += katakanaTable[character]['kata'];
        } else {
          text += character;
        }
      }
      return text;
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
     * @method reverse()
     * @returns String
     * @short Reverses the string.
     * @example
     *
     *   'jumpy'.reverse()        -> 'ypmuj'
     *   'lucky charms'.reverse() -> 'smrahc ykcul'
     *
     ***/
    'reverse': function() {
      return this.split('').reverse().join('');
    },

    /***
     * @method compact()
     * @returns String
     * @short Compacts all white space in the string to a single space and trims the ends.
     * @example
     *
     *   'too \n much \n space'.compact() -> 'too much space'
     *   'enough \n '.compact()           -> 'enought'
     *
     ***/
    'compact': function() {
      var str = this.replace(/[\r\n]/g, '');
      return str.trim().replace(/([\s　])+/g, '$1');
    },

    /***
     * @method at(<index>, [loop] = true)
     * @returns String or Array
     * @short Gets the character(s) at a given index.
     * @extra When [loop] is true, overshooting the end of the string (or the beginning) will begin counting from the other end. As an alternate syntax, passing multiple indexes will get the characters at those indexes.
     * @example
     *
     *   'jumpy'.at(0)               -> 'j'
     *   'jumpy'.at(2)               -> 'm'
     *   'jumpy'.at(5)               -> 'j'
     *   'jumpy'.at(5, false)        -> ''
     *   'jumpy'.at(-1)              -> 'y'
     *   'luckly charms'.at(1,3,5,7) -> ['u','k','y',c']
     *
     ***/
    'at': function() {
      return getFromIndexes(this, arguments, true);
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
      num = num  === undefined ? 1 : num;
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
      num = num  === undefined ? 1 : num;
      var start = this.length - num < 0 ? 0 : this.length - num;
      return this.substr(start);
    },

    /***
     * @method from([index] = 0)
     * @returns String
     * @short Returns a section of the string starting from [index].
     * @example
     *
     *   'lucky charms'.from()   -> 'lucky charms'
     *   'lucky charms'.from(7)  -> 'harms'
     *
     ***/
    'from': function(num) {
      return this.slice(num);
    },

    /***
     * @method to([index] = end)
     * @returns String
     * @short Returns a section of the string ending at [index].
     * @example
     *
     *   'lucky charms'.to()   -> 'lucky charms'
     *   'lucky charms'.to(7)  -> 'lucky ch'
     *
     ***/
    'to': function(num) {
      if(num === undefined) num = this.length;
      return this.slice(0, num);
    },

    /***
     * @method toDate()
     * @returns Date
     * @short Creates a date from the string.
     * @extra Accepts a wide range of input. See @date_format for more information.
     * @example
     *
     *   'January 25, 2015'.toDate() -> same as Date.create('January 25, 2015')
     *   'yesterday'.toDate()        -> same as Date.create('yesterday')
     *   'next Monday'.toDate()      -> same as Date.create('next Monday')
     *
     ***/
    'toDate': function() {
      return createDate([this.toString()]);
    },

    /***
     * @method dasherize()
     * @returns String
     * @short Converts underscores and camel casing to hypens.
     * @example
     *
     *   'a_farewell_to_arms'.dasherize() -> 'a-farewell-to-arms'
     *   'capsLock'.dasherize()           -> 'caps-lock'
     *
     ***/
    'dasherize': function() {
      return this.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
    },

    /***
     * @method underscore()
     * @returns String
     * @short Converts hyphens and camel casing to underscores.
     * @example
     *
     *   'a-farewell-to-arms'.underscore() -> 'a_farewell_to_arms'
     *   'capsLock'.underscore()           -> 'caps_lock'
     *
     ***/
    'underscore': function() {
      return this.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
    },

    /***
     * @method camelize([first] = true)
     * @returns String
     * @short Converts underscores and hyphens to camel case. If [first] is true the first letter will also be capitalized.
     * @example
     *
     *   'caps_lock'.camelize()              -> 'CapsLock'
     *   'moz-border-radius'.camelize()      -> 'MozBorderRadius'
     *   'moz-border-radius'.camelize(false) -> 'mozBorderRadius'
     *
     ***/
    'camelize': function(first) {
      var split = this.dasherize().split('-');
      var text = '';
      for(var i=0; i<split.length; i++) {
        if(first === false && i === 0) text += split[i].toLowerCase();
        else text += split[i].substr(0, 1).toUpperCase() + split[i].substr(1).toLowerCase();
      }
      return text;
    },

    /***
     * @method titleize()
     * @returns String
     * @short Capitalizes all first letters.
     * @example
     *
     *   'what a title'.titleize() -> 'What A Title'
     *   'no way'.titleize()       -> 'No Way'
     *
     ***/
    'titleize': function() {
      return this.trim().words(function(s) { return s.capitalize(); }).join(' ');
    },

    /***
     * @method stripTags([tag1], [tag2], ...)
     * @returns String
     * @short Strips all HTML tags from the string.
     * @extra Tags to strip may be enumerated in the parameters, otherwise will strip all.
     * @example
     *
     *   '<p>just <b>some</b> text</p>'.stripTags()    -> 'just some text'
     *   '<p>just <b>some</b> text</p>'.stripTags('p') -> 'just <b>some</b> text'
     *
     ***/
    'stripTags': function() {
      args = arguments.length > 0 ? arguments : [''];
      var str = this.toString();
      for(var i=0; i < args.length; i++) {
        var tag = args[i];
        var reg = new RegExp('<\/?' + tag.escapeRegExp() + '[^<>]*>', 'gi');
        str = str.replace(reg, '');
      }
      return str;
    },

    /***
     * @method removeTags([tag1], [tag2], ...)
     * @returns String
     * @short Removes all HTML tags and their contents from the string.
     * @extra Tags to remove may be enumerated in the parameters, otherwise will remove all.
     * @example
     *
     *   '<p>just <b>some</b> text</p>'.removeTags()    -> ''
     *   '<p>just <b>some</b> text</p>'.removeTags('b') -> '<p>just text</p>'
     *
     ***/
    'removeTags': function() {
      var str = this.toString();
      if(arguments.length == 0) {
        str = str.replace(/<.+?\/>/g, '');
        str = str.replace(/<.+?>.*<\/.+?>/g, '');
      } else {
        for(var i=0; i < arguments.length; i++) {
          var match = arguments[i].escapeRegExp();
          str = str.replace(new RegExp('<' + match + '[^<>]*?\/>', 'gi'), '');
          str = str.replace(new RegExp('<' + match + '[^<>]*>.*?<\/' + match + '>', 'gi'), '');
        }
      }
      return str;
    },

    /***
     * @method toObject(<sep1> = '&', <sep2> = '=')
     * @returns Object
     * @short Converts a string into an object.
     * @extra Conversion is based on a compound set of separators, such as would be found in URL params. Defaults are set up to quickly convert the URL query string.
     * @example
     *
     *   'foo=bar&broken=wear'.toObject()       -> { foo: 'bar', broken: 'wear' }
     *   'a|few,more|params'.toObject(',', '|') -> { a: 'few', more: 'params' }
     *
     ***/
    'toObject': function(sep1, sep2) {
      var result = {};
      this.split(sep1 || '&').each(function(el) {
        var split   = el.split(sep2 || '=');
        var key     = split[0];
        var value   = split[1];
        var numeric = parseInt(split[1]);
        if(numeric) {
          value = numeric;
        } else if(value === 'true') {
          value = true;
        } else if(value === 'false') {
          value = false;
        }
        result[key] = value;
      });
      return result;
    }

  });


  extendWithNativeCondition(String, true, function(s) { return !Object.isRegExp(s); }, {

    /*
     * Many thanks to Steve Levithan here for a ton of inspiration and work dealing with
     * cross browser Regex splitting.  http://blog.stevenlevithan.com/archives/cross-browser-split
     */

    /***
     * @method split([separator], [limit])
     * @returns Array
     * @short Splits the string by [separator] into an Array.
     * @extra This method is native to Javascript, but Sugar patches it to provide cross-browser reliability when splitting on a regex.
     * @example
     *
     *   'comma,separated,values'.split(',') -> ['comma','separated','values']
     *   'a,b|c>d'.split(/[,|>]/)            -> ['multi','separated','values']
     *
     ***/
    'split': function(separator, limit) {
      var output = [];
      var lastLastIndex = 0;
      var flags = (separator.ignoreCase ? "i" : "") + (separator.multiline  ? "m" : "") + (separator.sticky     ? "y" : "");
      var separator = separator.addFlag('g'); // make `global` and avoid `lastIndex` issues by working with a copy
      var separator2, match, lastIndex, lastLength;
      if(!RegExp.NPCGSupport) {
        separator2 = RegExp("^" + separator.source + "$(?!\\s)", flags); // doesn't need /g or /y, but they don't hurt
      }
      if(limit === undefined || +limit < 0) {
        limit = Infinity;
      } else {
        limit = Math.floor(+limit);
        if(!limit) return [];
      }

      while (match = separator.exec(this)) {
        lastIndex = match.index + match[0].length; // `separator.lastIndex` is not reliable cross-browser
        if(lastIndex > lastLastIndex) {
          output.push(this.slice(lastLastIndex, match.index));
          // fix browsers whose `exec` methods don't consistently return `undefined` for nonparticipating capturing groups
          if(!RegExp.NPCGSupport && match.length > 1) {
            match[0].replace(separator2, function () {
              for (var i = 1; i < arguments.length - 2; i++) {
                if(arguments[i] === undefined) {
                  match[i] = undefined;
                }
              }
            });
          }
          if(match.length > 1 && match.index < this.length) {
            Array.prototype.push.apply(output, match.slice(1));
          }
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if(output.length >= limit) {
            break;
          }
        }
        if(separator.lastIndex === match.index) {
          separator.lastIndex++; // avoid an infinite loop
        }
      }
      if(lastLastIndex === this.length) {
        if(lastLength || !separator.test("")) output.push("");
      } else {
        output.push(this.slice(lastLastIndex));
      }
      return output.length > limit ? output.slice(0, limit) : output;
    }
  });




  // Aliases

  extend(String, true, {

    /***
     * @method insert()
     * @alias add
     *
     ***/
    'insert': String.prototype.add
  });




  /***
   * Date module
   *
   ***/

  var abbreviatedMonths;
  var abbreviatedWeekdays;
  var months      = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  var weekdays    = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  var textNumbers = ['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
  var timeArray   = ['hour','minute','second','millisecond','meridian','utc','offset_sign','offset_hours','offset_minutes']
  var optionalTime  = '(?:(?:\\s+|t)(\\d{1,2}):?(\\d{2})?:?(\\d{2})?(\\.\\d{1,6})?(am|pm)?(?:(Z)|(?:([+-])(\\d{2})(?::?(\\d{2}))?)?)?)?$';

  var dateInputFormats = [
    // @date_format 2010
    { reg: '(\\d{4})', to: ['year'] },
    // @date_format 2010-05
    // @date_format 2010.05
    { reg: '(\\d{4})[-/.](\\d{1,2})', to: ['year','month'] },
    // @date_format 2010-05-25 (ISO8601)
    // @date_format 2010-05-25T12:30:40.299Z (ISO8601)
    // @date_format 2010-05-25T12:30:40.299+01:00 (ISO8601)
    // @date_format 2010.05.25
    // @date_format 2010/05/25
    { reg: '([+-])?(\\d{4})[-/.]?(\\d{1,2})[-/.]?(\\d{1,2})', to: ['year_sign','year','month','day'] },
    // @date_format 10-05-25 (ISO8601)
    { reg: '(\\d{2})-?(\\d{2})-?(\\d{2})', to: ['year','month','day'] },
    // @date_format 05-25
    // @date_format 05/25
    // @date_format 05.25
    { reg: '(\\d{1,2})[\\-/.](\\d{1,2})', to: ['month','day'], variant: true },
    // @date_format 05-25-2010
    // @date_format 05/25/2010
    // @date_format 05.25.2010
    { reg: '(\\d{1,2})[\\-/.](\\d{1,2})[\\-/.](\\d{2,4})', to: ['month','day','year'], variant: true },
    // @date_format May 2010
    { reg: '({MONTHS})[\\s\\-.](\\d{4})', to: ['month','year'] },
    // @date_format Tuesday May 25th, 2010
    { reg: '(?:{WEEKDAYS})?\\s*({MONTHS})[\\s\\-.]?(?:(\\d{1,2})(?:st|nd|rd|th)?)?,?[\\s\\-.]?(\\d{2,4})?', to: ['month','day','year'] },
    // @date_format 25 May 2010
    { reg: '(\\d{1,2}) ({MONTHS}),? (\\d{4})', to: ['day','month','year'] },
    // @date_format the day after tomorrow
    // @date_format one day before yesterday
    // @date_format 2 days after monday
    // @date_format 2 weeks/months/years from monday
    { reg: '(?:(the|a|{NUMBER}|\\d+) (day|week|month|year)s? (before|after|from)\\s+)?(today|tomorrow|yesterday|{WEEKDAYS})(?: at)?', to: ['modifier_amount','modifier_unit','modifier_sign','fuzzy_day'] },
    // @date_format a second ago
    // @date_format two days from now
    // @date_format 25 minutes/hours/days/weeks/months/years from now
    { reg: '(a|{NUMBER}|\\d+) (millisecond|second|minute|hour|day|week|month|year)s? (from now|ago)', to: ['modifier_amount','modifier_unit','modifier_sign'], relative: true },
    // @date_format last wednesday
    // @date_format next friday
    // @date_format this week tuesday
    { reg: '(this|next|last)?\\s*(?:week\\s*)?({WEEKDAYS})(?: at)?', to: ['modifier_sign','fuzzy_day'] },
    // @date_format monday of this/next/last week
    { reg: '({WEEKDAYS}) (?:of\\s*)?(this|next|last) week', to: ['fuzzy_day','modifier_sign'] },
    // @date_format May 25th of this/next/last year
    { reg: '({MONTHS})(?: (\\d{1,2})(?:st|nd|rd|th)?)? of (this|next|last) (year)', to: ['month','day','modifier_sign','modifier_unit'] },
    // @date_format the first day of the month
    // @date_format the last day of March
    // @date_format the 23rd of last month
    { reg: '(?:the\\s)?(first day|last day)?(\\d{1,2}(?:st|nd|rd|th))? of (?:(the|this|next|last) (month)|({MONTHS}))', to: ['modifier_edge', 'day','modifier_sign','modifier_unit','month'] },
    // @date_format the beginning of this week/month/year
    // @date_format the end of next month
    { reg: '(?:the\\s)?(beginning|end|first day|last day) of (?:(the|this|next|last) (week|month|year)|(\\d{4})|({MONTHS}))', to: ['modifier_edge','modifier_sign','modifier_unit','year','month'] },
    // @date_format this week
    // @date_format last month
    // @date_format next year
    { reg: '(this|next|last) (week|month|year)', to: ['modifier_sign','modifier_unit'], relative: true },
    // @date_format noon
    // @date_format midnight tonight
    { reg: '(midnight|noon)(?: (tonight|today|tomorrow|yesterday|{WEEKDAYS}))?', to: ['hour','fuzzy_day'], timeIncluded: true },
    // @date_format 12pm
    // @date_format 12:30pm
    // @date_format 12:30:40
    // @date_format 12:30:40.299
    // @date_format 12:30:40.299+01:00
    { reg: '^(?:(\\d{1,2}):?(\\d{2})?:?(\\d{2})?(\\.\\d{1,6})?(am|pm)?(?:(Z)|(?:([+-])(\\d{2})(?::?(\\d{2}))?)?)?)$', to: timeArray, today: true, timeIncluded: true }
  ];

  var dateOutputFormats = [
    {
      token: 'millisec(?:onds?)?|ms(?:ms)?',
      pad: 3,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Milliseconds');
      }
    },
    {
      token: 's(?:s|ec(?:onds?)?)?',
      pad: 2,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Seconds');
      }
    },
    {
      token: 'm(?:m|in(?:utes?)?)?',
      pad: 2,
      caps: true,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Minutes');
      }
    },
    {
      token: 'h(?:h|(?:ours?))?|24hr',
      pad: 2,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Hours');
      }
    },
    {
      token: '12hr',
      pad: 2,
      format: function(d, utc) {
        return getShortHour(d, utc);
      }
    },
    {
      token: 'd(?:d|ate|ays?)?',
      pad: 2,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Date');
      }
    },
    {
      token: 'dow|weekday(?: short)?',
      weekdays: true,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Day');
      }
    },
    {
      token: 'MM?',
      pad: 2,
      caps: true,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Month') + 1;
      }
    },
    {
      token: 'mon(th)?(?: short)?',
      months: true,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Month');
      }
    },
    {
      token: 'yy',
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'FullYear').toString().from(2);
      }
    },
    {
      token: 'yyyy|year',
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'FullYear');
      }
    },
    {
      token: 't{1,2}',
      meridian: true,
      format: function(d, utc) {
        return getMeridian(d, utc);
      }
    },
    {
      token: 'tz|timezone',
      format: function(d, utc) {
        return d.getUTCOffset();
      }
    },
    {
      token: 'iso(tz|timezone)',
      format: function(d, utc) {
        return d.getUTCOffset(true);
      }
    },
    {
      token: 'ord',
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Date').ordinalize();
      }
    }
  ];

  var dateUnits = [
    {
      unit: 'year',
      method: 'FullYear',
      multiplier: function(d) {
        var adjust = d ? (d.isLeapYear() ? 1 : 0) : 0.25;
        return (365 + adjust) * 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'month',
      method: 'Month',
      multiplier: function(d) {
        var days = d ? d.daysInMonth() : 30.4375;
        return days * 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'week',
      method: 'Week',
      multiplier: function(d) {
        return 7 * 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'day',
      method: 'Date',
      multiplier: function(d) {
        return 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'hour',
      method: 'Hours',
      multiplier: function(d) {
        return 60 * 60 * 1000;
      }
    },
    {
      unit: 'minute',
      method: 'Minutes',
      multiplier: function(d) {
        return 60 * 1000;
      }
    },
    {
      unit: 'second',
      method: 'Seconds',
      multiplier: function(d) {
        return 1000;
      }
    },
    {
      unit: 'millisecond',
      method: 'Milliseconds',
      multiplier: function(d) {
        return 1;
      }
    }
  ];


  var getFormatMatch = function(match, arr) {
    var obj = {};
    arr.each(function(key, i) {
      var value = match[i + 1];
      if(typeof value === 'string') value = value.toLowerCase();
      obj[key] = value;
    });
    return obj;
  }

  var getExtendedDate = function(f) {
    var match, format = {}, set = {};
    var utc = false;
    var d = new Date();

    if(Object.isObject(f)) {
      set = f;
      d = new Date().set(f, true);
    } else if(Object.isNumber(f)) {
      d = new Date(f);
    } else if(Object.isDate(f)) {
      d = f;
    } else if(Object.isString(f)) {
      f = f.trim().replace(/\.+$/,'').replace(/^now$/, '');
      dateInputFormats.each(function(df) {
        if(match) return;
        match = NPCGMatch(f, df.reg);
        if(match) {
          format = df;
          var m = getFormatMatch(match, format.to);

          if(Date.allowVariant && format.variant) {
            // If there's a European variant, swap the month and day.
            var tmp = m.month;
            m.month = m.day;
            m.day = tmp;
          }

          if(m.year) {
            if(!m.modifier_unit) {
              m.modifier_unit = 'year';
            }
            if(m.year.length === 2) {
              m.year = getYearFromAbbreviation(m.year.toNumber());
            }
          }
          if(m.month) {
            var num = m.month.toNumber();
            if(isNaN(num)) {
              // If the month is not a number, find it in the array of text months.
              m.month = abbreviatedMonths.indexOf(m.month.to(3));
            } else {
              // Otherwise decrement by 1.
              m.month = num - 1;
            }
          }
          if(m.hour === 'noon' || m.hour === 'midnight') {
            m.hour = m.hour === 'noon' ? 12 : 24;
            if(!set.day && !m.fuzzy_day) m.fuzzy_day = 'today';
          }
          if(m.fuzzy_day) {
            // Fuzzy day can be today, tomorrow, yesterday, or a day of the week.
            // This resolves to an offset of the current date.
            var dayOffset = 0;
            var fuzzy = m.fuzzy_day;
            var weekday;
            if(fuzzy === 'yesterday') {
              dayOffset = -1;
            } else if(fuzzy === 'tomorrow') {
              dayOffset = 1;
            } else if((weekday = abbreviatedWeekdays.indexOf(fuzzy.to(3))) !== -1) {
              d.setWeekday(weekday);
              dayOffset = 0;
              if(m.modifier_sign && !m.modifier_unit && !m.modifier_amount) {
                m.modifier_unit = 'week';
              }
            }
            set.year  = d.getFullYear();
            set.month = d.getMonth();
            set.day  = d.getDate() + dayOffset;
          }
          if(m.millisecond) {
            // Round the milliseconds out to 4 digits
            m.millisecond = (parseFloat(m.millisecond, 10) * 1000).round();
          }

          // Now turn this into actual numbers
          dateUnits.each(function(u) {
            var unit = u.unit;
            if(m[unit] !== undefined) {
              set[unit] = m[unit].toNumber();
            }
          });

          if(m.meridian) {
            // If the time is after 1pm-11pm advance the time by 12 hours.
            if(m.meridian === 'pm' && m.hour < 12) set.hour  += 12;
          }
          if(m.utc || m.offset_hours || m.offset_minutes) {
            utc = true;
            // Adjust for timezone offset
            var offset = 0;
            if(m.offset_hours) {
              offset += m.offset_hours.toNumber() * 60;
            }
            if(m.offset_minutes) {
              offset += m.offset_minutes.toNumber();
            }
            if(m.offset_sign && m.offset_sign === '-') {
              offset *= -1;
            }
            set.minute -= offset;
          }
          if(m.modifier_unit && m.modifier_sign) {
            var amt  = m.modifier_amount || 1;
            var unit = m.modifier_unit;
            var textNumIndex;
            if(amt === 'the' || amt === 'a') {
              amt = 1;
            } else if((textNumIndex = textNumbers.indexOf(amt)) !== -1) {
              amt = textNumIndex;
            } else {
              amt = amt.toNumber();
            }
            if(m.modifier_sign === 'before' || m.modifier_sign === 'ago' || m.modifier_sign === 'last') {
              amt *= -1;
            } else if(m.modifier_sign === 'this' || m.modifier_sign === 'the') {
              amt = 0;
            }
            if(unit === 'year' && !format.relative) {
              set.year = d.getFullYear();
            } else if(unit === 'month' && !format.relative) {
              set.month = d.getMonth();
            } else if(unit === 'week' && !format.relative) {
              set.day = d.getDate();
              unit = 'day';
              amt *= 7;
            }
            if(set[unit] === undefined) {
              set[unit] = 0;
            }
            set[unit] += amt;
          }
          if(m.modifier_edge) {
            var edge = m.modifier_edge;
            if(edge === 'beginning' || edge === 'first' || edge === 'first day') {
              if(m.modifier_unit === 'week') {
                set.month = d.getMonth();
                set.weekday = 0;
              } else if(m.modifier_unit === 'month' || m.month) {
                set.day = 1;
              }
              if(!edge.match(/day/)) {
                set.hour        = 0;
                set.minute      = 0;
                set.second      = 0;
                set.millisecond = 0;
              }
            } else if(edge === 'end' || edge === 'last' || edge === 'last day') {
              if(m.modifier_unit === 'week') {
                set.month = d.getMonth();
                set.weekday = 6;
              } else if(m.modifier_unit === 'month' || m.month) {
                set.day = 32 - new Date(d.getFullYear(), set.month, 32).getDate();
              } else if(m.modifier_unit === 'year') {
                set.month = 11;
                set.day  = 31;
              }
              if(!edge.match(/day/)) {
                set.hour        = 23;
                set.minute      = 59;
                set.second      = 59;
                set.millisecond = 999;
              }
            }

          }
          if(m.year_sign && m.year_sign === '-') {
            set.year *= -1;
          }
          if(format.today) {
            set.year  = d.getFullYear();
            set.month = d.getMonth();
            set.day  = d.getDate();
          }
        }
      });
      if(!match) {
        // The Date constructor does something tricky like checking the number
        // of arguments so simply passing in undefined won't work.
        d = f ? new Date(f) : new Date();
      } else if(format.relative) {
        d.advance(set);
      } else if(utc) {
        d.setUTC(set, true);
      } else {
        d.set(set, true);
      }
    }
    return {
      date: d,
      set: set,
      format: format
    }
  }

  var compareDate = function(d, find, buffer, dir, edges) {
    var unit, accuracy;
    var p = getExtendedDate(find);
    buffer = buffer > 0 ? buffer : 0;
    if(!p.date.isValid()) return false;
    dateUnits.each(function(u) {
      if(p.set[u.unit] !== undefined || p.set[u.unit + 's'] !== undefined) {
        unit = u.unit;
        accuracy = u.multiplier(p.date) - 1;
      }
    });
    if(p.format.relative) {
      var beginning = p.date['beginningOf'+unit.capitalize()];
      if(beginning) {
        beginning.call(p.date);
      } else {
        buffer = buffer || Math.round(accuracy / 2);
        accuracy = 0;
      }
    }
    accuracy = accuracy || 0;
    var t   = d.getTime();
    var min = p.date.getTime();
    var max = min + accuracy;
    if(dir === 'after') {
      return edges ? (t - buffer > min) : (t > max + buffer);
    } else if(dir === 'before') {
      return edges ? (t < max + buffer) : (t - buffer < min);
    } else {
      return t >= (min - buffer) && t < (max + buffer + 1);
    }
  }

  var updateDate = function(date, params, reset, utc, advance) {
    utc = utc === true ? 'UTC' : '';
    if(Object.isNumber(params) && !advance) {
      // If the update is a straight number and we're setting the
      // date, simply directly set the time.
      date.setTime(params);
      return date;
    } else if(Object.isNumber(params) && advance) {
      // If the update is a straight number and we're advancing the
      // date, the number is presumed to be milliseconds.
      params = { milliseconds: params };
    }
    if(params.date) params.day = params.date;
    // If the date is 1/31, setMonth(1) will set the month to March, not February.
    // This is definitely not what we want for rest dates (i.e. non-relative), so
    // pre-emptively set the date here. Also, setting to the middle of the month
    // so that timezone offset's can't traverse dates, which is also not what we want.
    if(reset) {
      date.setDate(15);
    }
    dateUnits.each(function(u) {
      var unit   = u.unit;
      var method = u.method;
      var value = getDateValue(params, unit, reset);
      if(value === undefined) return;
      if(advance) {
        if(unit === 'week') {
          value  = (params.day || 0) + (value * 7);
          method = 'Date';
        }
        value = (value * advance) + callDateMethod(date, 'get', '', method);
      }
      callDateMethod(date, 'set', utc, method, value);
    });
    if(!advance) {
      var weekday = getDateValue(params, 'weekday', reset);
      if(weekday !== undefined) {
        callDateMethod(date, 'set', utc, 'Weekday', weekday)
      }
    }
    return date;
  }

  var getDateValue = function(params, unit, reset) {
    var value = params[unit];
    if(value === undefined) value = params[unit + 's'];
    if(value === undefined && reset) {
      switch(unit) {
        case 'day': value = 1;  break;
        case 'year': case 'week': case 'weekday': break; // assign no value
        default: value = 0;
      }
    }
    return value;
  }

  var callDateMethod = function(d, g, utc, method, value) {
    return d[g + utc + method].call(d, value);
  }

  // If the year is two digits, add the most appropriate century prefix.
  // Duplicating the .round() function here because we don't want the
  // Date class to break if it is overwritten.
  var getYearFromAbbreviation = function(year) {
    return Math.round(new Date().getFullYear() / 100) * 100 - Math.round(year / 100) * 100 + year;
  }


  var getMonth = function(s) {
    if(/\w+\s+\w+/.test(s)) return null;
    var index = abbreviatedMonths.indexOf(s.toLowerCase().to(3));
    return index === -1 ? null : index;
  }

  var getWeekday = function(s) {
    if(/\w+\s+\w+/.test(s)) return null;
    var index = abbreviatedWeekdays.indexOf(s.toLowerCase().to(3));
    return index === -1 ? null : index;
  }

  var getShortHour = function(d, utc) {
    var hours = callDateMethod(d, 'get', utc, 'Hours');
    return hours === 0 ? 12 : hours - (Math.floor(hours / 13) * 12);
  }

  var getMeridian = function(d, utc) {
    var hours = callDateMethod(d, 'get', utc, 'Hours');
    return hours < 12 ? 'am' : 'pm';
  }

  var getOffsetDate = function(num, args, unit, method) {
    var d = createDate(args);
    var set = {};
    set[unit] = num;
    return d[method].call(d, set);
  }

  var getAdjustedDateUnit = function(d) {
    var next, ago = d.millisecondsAgo(), ms = Math.abs(ago), value = ms, dir = (ago >= 0 ? -1 : 1), unit = 'millisecond';
    dateUnits.concat().reverse().slice(1).each(function(u) {
      next = Math.floor(ms / u.multiplier(d));
      if(next >= 1) {
        value = next;
        unit = u.unit;
      }
    });
    if(value != 1) unit += 's';
    return [value, unit, ms, dir];
  }

  var createDate = function(args) {
    var f;
    if(args.length >= 2 && Object.isNumber(args[0])) {
      // If there are 2 or more paramters we have an enumerated constructor type as in "new Date(2003, 2, 12);"
      f = collectDateArguments(args,'year','month','day','hour','minute','second','millisecond')[0];
    } else {
      f = args[0];
    }
    return getExtendedDate(f).date;
  }




   /***
   * @method millisecondsSince([d])
   * @returns Number
   * @short Returns the number of milliseconds since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %millisecondsFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().millisecondsSince('1 hour ago')         -> 3,600,000
   *   Date.create('1 hour from now').millisecondsFromNow()  -> 3,600,000
   *
   ***
   * @method secondsSince([d])
   * @returns Number
   * @short Returns the number of seconds since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %secondsFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().secondsSince('1 hour ago')        -> 3600
   *   Date.create('1 hour from now').secondsFromNow() -> 3600
   *
   ***
   * @method minutesSince([d])
   * @returns Number
   * @short Returns the number of minutes since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %minutesFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().minutesSince('1 hour ago')        -> 60
   *   Date.create('1 hour from now').minutesFromNow() -> 60
   *
   ***
   * @method hoursSince([d])
   * @returns Number
   * @short Returns the number of hours since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %hoursFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().hoursSince('1 hour ago')        -> 1
   *   Date.create('1 hour from now').hoursFromNow() -> 1
   *
   ***
   * @method daysSince([d])
   * @returns Number
   * @short Returns the number of days since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %daysFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().daysSince('1 week ago')        -> 7
   *   Date.create('1 week from now').daysFromNow() -> 7
   *
   ***
   * @method weeksSince([d])
   * @returns Number
   * @short Returns the number of weeks since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %weeksFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().weeksSince('1 month ago')        -> 4
   *   Date.create('1 month from now').weeksFromNow() -> 4
   *
   ***
   * @method monthsSince([d])
   * @returns Number
   * @short Returns the number of months since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %monthsFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().monthsSince('1 year ago')        -> 12
   *   Date.create('1 year from now').monthsFromNow() -> 12
   *
   ***
   * @method yearsSince([d])
   * @returns Number
   * @short Returns the number of years since [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %yearsFromNow% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().yearsSince('5 years ago')        -> 5
   *   Date.create('5 years from now').yearsFromNow() -> 5
   *
   ***
   * @method millisecondsUntil([d])
   * @returns Number
   * @short Returns the number of milliseconds until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %millisecondsAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().millisecondsUntil('1 hour from now') -> 3,600,000
   *   Date.create('1 hour ago').millisecondsAgo()        -> 3,600,000
   *
   ***
   * @method secondsUntil([d])
   * @returns Number
   * @short Returns the number of seconds until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %secondsAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().secondsUntil('1 hour from now') -> 3600
   *   Date.create('1 hour ago').secondsAgo()        -> 3600
   *
   ***
   * @method minutesUntil([d])
   * @returns Number
   * @short Returns the number of minutes until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %minutesAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().minutesUntil('1 hour from now') -> 60
   *   Date.create('1 hour ago').minutesAgo()        -> 60
   *
   ***
   * @method hoursUntil([d])
   * @returns Number
   * @short Returns the number of hours until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %hoursAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().hoursUntil('1 hour from now') -> 1
   *   Date.create('1 hour ago').hoursAgo()        -> 1
   *
   ***
   * @method daysUntil([d])
   * @returns Number
   * @short Returns the number of days until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %daysAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().daysUntil('1 week from now') -> 7
   *   Date.create('1 week ago').daysAgo()        -> 7
   *
   ***
   * @method weeksUntil([d])
   * @returns Number
   * @short Returns the number of weeks until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %weeksAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().weeksUntil('1 month from now') -> 4
   *   Date.create('1 month ago').weeksAgo()      -> 4
   *
   ***
   * @method monthsUntil([d])
   * @returns Number
   * @short Returns the number of months until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %monthsAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().monthsUntil('1 year from now') -> 12
   *   Date.create('1 year ago').monthsAgo()        -> 12
   *
   ***
   * @method yearsUntil([d])
   * @returns Number
   * @short Returns the number of years until [d].
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %yearsAgo% provided as an alias. For more see @date_format.
   * @example
   *
   *   Date.create().yearsUntil('5 years from now') -> 5
   *   Date.create('5 years ago').yearsAgo()      -> 5
   *
   ***
   * @method millisecondsAgo()
   * @alias millisecondsUntil
   *
   ***
   * @method millisecondsFromNow()
   * @alias millisecondsSince
   *
   ***
   * @method secondsAgo()
   * @alias secondsUntil
   *
   ***
   * @method secondsFromNow()
   * @alias secondsSince
   *
   ***
   * @method minutesAgo()
   * @alias minutesUntil
   *
   ***
   * @method minutesFromNow()
   * @alias minutesSince
   *
   ***
   * @method hoursAgo()
   * @alias hoursUntil
   *
   ***
   * @method hoursFromNow()
   * @alias hoursSince
   *
   ***
   * @method daysAgo()
   * @alias daysUntil
   *
   ***
   * @method daysFromNow()
   * @alias daysSince
   *
   ***
   * @method weeksAgo()
   * @alias weeksUntil
   *
   ***
   * @method weeksFromNow()
   * @alias weeksSince
   *
   ***
   * @method monthsAgo()
   * @alias monthsUntil
   *
   ***
   * @method monthsFromNow()
   * @alias monthsSince
   *
   ***
   * @method yearsAgo()
   * @alias yearsUntil
   *
   ***
   * @method yearsFromNow()
   * @alias yearsSince
   *
   ***
   * @method addMilliseconds(<num>)
   * @returns Date
   * @short Adds <num> milliseconds to the date.
   * @example
   *
   *   Date.create().addMilliseconds(5) -> current time + 5 milliseconds
   *
   ***
   * @method addSeconds(<num>)
   * @returns Date
   * @short Adds <num> seconds to the date.
   * @example
   *
   *   Date.create().addSeconds(5) -> current time + 5 seconds
   *
   ***
   * @method addMinutes(<num>)
   * @returns Date
   * @short Adds <num> minutes to the date.
   * @example
   *
   *   Date.create().addMinutes(5) -> current time + 5 minutes
   *
   ***
   * @method addHours(<num>)
   * @returns Date
   * @short Adds <num> hours to the date.
   * @example
   *
   *   Date.create().addHours(5) -> current time + 5 hours
   *
   ***
   * @method addDays(<num>)
   * @returns Date
   * @short Adds <num> days to the date.
   * @example
   *
   *   Date.create().addDays(5) -> current time + 5 days
   *
   ***
   * @method addWeeks(<num>)
   * @returns Date
   * @short Adds <num> weeks to the date.
   * @example
   *
   *   Date.create().addWeeks(5) -> current time + 5 weeks
   *
   ***
   * @method addMonths(<num>)
   * @returns Date
   * @short Adds <num> months to the date.
   * @example
   *
   *   Date.create().addMonths(5) -> current time + 5 months
   *
   ***
   * @method addYears(<num>)
   * @returns Date
   * @short Adds <num> years to the date.
   * @example
   *
   *   Date.create().addYears(5) -> current time + 5 years
   *
   ***
   * @method isLastWeek()
   * @returns Boolean
   * @short Returns true if the date is last week.
   * @example
   *
   *   Date.create('yesterday').isLastWeek() -> true or false?
   *
   ***
   * @method isThisWeek()
   * @returns Boolean
   * @short Returns true if the date is this week.
   * @example
   *
   *   Date.create('today').isThisWeek() -> true
   *
   ***
   * @method isNextWeek()
   * @returns Boolean
   * @short Returns true if the date is next week.
   * @example
   *
   *   Date.create('tomorrow').isNextWeek() -> true or false?
   *
   ***
   * @method isLastMonth()
   * @returns Boolean
   * @short Returns true if the date is last month.
   * @example
   *
   *   Date.create('yesterday').isLastMonth() -> true or false?
   *
   ***
   * @method isThisMonth()
   * @returns Boolean
   * @short Returns true if the date is this month.
   * @example
   *
   *   Date.create('today').isThisMonth() -> true
   *
   ***
   * @method isNextMonth()
   * @returns Boolean
   * @short Returns true if the date is next month.
   * @example
   *
   *   Date.create('tomorrow').isNextMonth() -> true or false?
   *
   ***
   * @method isLastYear()
   * @returns Boolean
   * @short Returns true if the date is last year.
   * @example
   *
   *   Date.create('yesterday').isLastYear() -> true or false?
   *
   ***
   * @method isThisYear()
   * @returns Boolean
   * @short Returns true if the date is this year.
   * @example
   *
   *   Date.create('today').isThisYear() -> true
   *
   ***
   * @method isNextYear()
   * @returns Boolean
   * @short Returns true if the date is next year.
   * @example
   *
   *   Date.create('tomorrow').isNextYear() -> true or false?
   *
   ***
   * @method beginningOfDay()
   * @returns Date
   * @short Sets the date to the beginning of the day.
   * @example
   *
   *   Date.create().beginningOfDay() -> the beginning of today
   *
   ***
   * @method endOfDay()
   * @returns Date
   * @short Sets the date to the end of the day.
   * @example
   *
   *   Date.create().endOfDay() -> the end of today
   *
   ***
   * @method beginningOfWeek()
   * @returns Date
   * @short Sets the date to the beginning of the week.
   * @example
   *
   *   Date.create().beginningOfWeek() -> the beginning of this week
   *
   ***
   * @method endOfWeek()
   * @returns Date
   * @short Sets the date to the end of the week.
   * @example
   *
   *   Date.create().endOfWeek() -> the end of this week
   *
   ***
   * @method beginningOfMonth()
   * @returns Date
   * @short Sets the date to the beginning of the month.
   * @example
   *
   *   Date.create().beginningOfMonth() -> the beginning of this month
   *
   ***
   * @method endOfMonth()
   * @returns Date
   * @short Sets the date to the end of the month.
   * @example
   *
   *   Date.create().endOfMonth() -> the end of this month
   *
   ***
   * @method beginningOfYear()
   * @returns Date
   * @short Sets the date to the beginning of the year.
   * @example
   *
   *   Date.create().beginningOfYear() -> the beginning of this year
   *
   ***
   * @method endOfYear()
   * @returns Date
   * @short Sets the date to the end of the year.
   * @example
   *
   *   Date.create().endOfYear() -> the end of this year
   *
   ***/
  var buildDateMethods = function() {
    dateUnits.each(function(u, i) {
      var unit = u.unit;
      var caps = unit.capitalize();
      var multiplier = u.multiplier();
      defineProperty(Date.prototype, unit+'sSince', function(f) {
        return ((this.getTime() - Date.create(f).getTime()) / multiplier).round();
      });
      defineProperty(Date.prototype, unit+'sUntil', function(f) {
        return ((Date.create(f).getTime() - this.getTime()) / multiplier).round();
      });
      defineProperty(Date.prototype, unit+'sAgo', Date.prototype[unit+'sUntil']);
      defineProperty(Date.prototype, unit+'sFromNow', Date.prototype[unit+'sSince']);
      defineProperty(Date.prototype, 'add'+caps+'s', function(num) {
        var set = {};
        set[unit] = num;
        return this.advance(set);
      });
      buildNumberToDateAlias(unit, multiplier);
      if(i < 3) {
        defineProperty(Date.prototype, 'isLast'+caps, function() {
          return this.is('last ' + unit);
        });
        defineProperty(Date.prototype, 'isThis'+caps, function() {
          return this.is('this ' + unit);
        });
        defineProperty(Date.prototype, 'isNext'+caps, function() {
          return this.is('next ' + unit);
        });
      }
      if(i < 4) {
        defineProperty(Date.prototype, 'beginningOf'+caps, function(reset) {
          if(reset === undefined || unit == 'day') reset = true;
          var set = { month: 0, day: 1 };
          switch(unit) {
            case 'week':  set.weekday = 0;
            case 'day':   set.day = this.getDate();
            case 'month': set.month = this.getMonth();
          }
          return this.set(set, reset);
        });
        defineProperty(Date.prototype, 'endOf'+caps, function(reset) {
          if(reset === undefined || unit == 'day') reset = true;
          var set = reset ? { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 } : {};
          set.day   = this.getDate();
          set.month = this.getMonth();
          switch(unit) {
            case 'year':  set.month = 11; set.day = 31; break;
            case 'month': set.day = this.daysInMonth(); break;
            case 'week':  set.weekday = 6; break;
          }
          return this.set(set, reset);
        });
      }
    });
  }

  var buildFormatRegExp = function() {

    abbreviatedMonths   = months.map(function(m) { return m.to(3); });
    abbreviatedWeekdays = weekdays.map(function(m) { return m.to(3); });

    var monthReg   = months.map(function(m) { return m.to(3)+'(?:\\.|'+m.from(3)+')?'; }).join('|');
    var weekdayReg = weekdays.map(function(m) { return m.to(3)+'(?:\\.|'+m.from(3)+')?'; }).join('|');
    var numberReg  = textNumbers.join('|');

    dateInputFormats.each(function(m) {
      var src = '^' + m.reg;
      src = src.replace(/{WEEKDAYS}/, weekdayReg);
      src = src.replace(/{MONTHS}/, monthReg);
      src = src.replace(/{NUMBER}/, numberReg);
      if(!m.timeIncluded) {
        src = src + optionalTime;
        m.to = m.to.concat(['hour','minute','second','millisecond','meridian','utc','offset_sign','offset_hours','offset_minutes']);
      }
      m.reg = new RegExp(src, 'i');
    });
  }

   /***
   * @method isToday()
   * @returns Boolean
   * @short Returns true if the date is today.
   * @example
   *
   *   Date.create().isToday()           -> true
   *   Date.create('tomorrow').isToday() -> false
   *
   ***
   * @method isYesterday()
   * @returns Boolean
   * @short Returns true if the date is yesterday.
   * @example
   *
   *   Date.create().isYesterday()            -> false
   *   Date.create('yesterday').isYesterday() -> true
   *
   ***
   * @method isTomorrow()
   * @returns Boolean
   * @short Returns true if the date is tomorrow.
   * @example
   *
   *   Date.create().isTomorrow()           -> false
   *   Date.create('tomorrow').isTomorrow() -> true
   *
   ***
   * @method isWeekday()
   * @returns Boolean
   * @short Returns true if the date is a weekday.
   * @example
   *
   *   Date.create('monday').isWeekday() -> true
   *   Date.create('sunday').isWeekday() -> false
   *
   ***
   * @method isWeekend()
   * @returns Boolean
   * @short Returns true if the date is a weekend.
   * @example
   *
   *   Date.create('saturday').isWeekend() -> true
   *   Date.create('thursday').isWeekend() -> false
   *
   ***
   * @method isFuture()
   * @returns Boolean
   * @short Returns true if the date is in the future.
   * @example
   *
   *   Date.create('next week').isFuture() -> true
   *   Date.create('last week').isFuture() -> false
   *
   ***
   * @method isPast()
   * @returns Boolean
   * @short Returns true if the date is in the past.
   * @example
   *
   *   Date.create('last week').isPast() -> true
   *   Date.create('next week').isPast() -> false
   *
   ***/
  var buildRelativeAliases = function() {
    ['today','yesterday','tomorrow','weekday','weekend','future','past'].concat(weekdays).concat(months).each(function(s) {
      defineProperty(Date.prototype, 'is'+s.capitalize(), function() {
        return this.is(s);
      });
    });
  }

  var buildDate = function() {
    buildDateMethods();
    buildFormatRegExp();
    buildRelativeAliases();
  }


  extend(Date, false, {
    'make': function() {
      return createDate(arguments);
    },
    'DSTOffset': (new Date(2000, 6, 1).getTimezoneOffset() - new Date(2000, 0, 1).getTimezoneOffset()) * 60 * 1000,
    'INTERNATIONAL_TIME': '{h}:{mm}:{ss}',
    'RFC1123': '{Dow}, {dd} {Mon} {yyyy} {hh}:{mm}:{ss} GMT{tz}',
    'RFC1036': '{Weekday}, {dd}-{Mon}-{yy} {hh}:{mm}:{ss} GMT{tz}',
    'ISO8601_DATE': '{yyyy}-{MM}-{dd}',
    'ISO8601_DATETIME': '{yyyy}-{MM}-{dd}T{hh}:{mm}:{ss}.{ms}{isotz}'
  });

  extend(Date, true, {

     /***
     * @method set(<set>, [reset] = false)
     * @returns Date
     * @short Sets the date object.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). If [reset] is set, the time will also be reset to 00:00:00.000 For more see @date_format.
     * @example
     *
     *   new Date().set({ year: 2011, month: 11, day: 31 }) -> December 31, 2011
     *   new Date().set(2011, 11, 31)                       -> December 31, 2011
     *   new Date().set(86400000)                           -> 1 day after Jan 1, 1970
     *
     ***/
    'set': function() {
      var args = collectDateArguments(arguments,'year','month','day','hour','minute','second','millisecond');
      return updateDate(this, args[0], args[1])
    },

     /***
     * @method setUTC()
     * @returns Date
     * @short Sets the date object according to universal time.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor).
     * @example
     *
     *   new Date().setUTC({ year: 2011, month: 11, day: 31 }) -> December 31, 2011
     *   new Date().setUTC(2011, 11, 31)                       -> December 31, 2011
     *   new Date().setUTC(86400000)                           -> 1 day after Jan 1, 1970
     *
     ***/
    'setUTC': function() {
      var args = collectDateArguments(arguments,'year','month','day','hour','minute','second','millisecond');
      return updateDate(this, args[0], args[1], true)
    },

     /***
     * @method setWeekday()
     * @returns Nothing
     * @short Sets the weekday of the date.
     * @example
     *
     *   new Date().setWeekday(1) -> Monday of this week
     *   new Date().setWeekday(6) -> Saturday of this week
     *
     ***/
    'setWeekday': function(dow) {
      if(dow === undefined) return;
      this.setDate(this.getDate() + dow - this.getDay());
    },

     /***
     * @method setUTCWeekday()
     * @returns Nothing
     * @short Sets the weekday of the date according to universal time.
     * @example
     *
     *   new Date().setUTCWeekday(1) -> Monday of this week
     *   new Date().setUTCWeekday(6) -> Saturday of this week
     *
     ***/
    'setUTCWeekday': function(dow) {
      if(dow === undefined) return;
      this.setDate(this.getUTCDate() + dow - this.getDay());
    },

     /***
     * @method setWeek()
     * @returns Nothing
     * @short Sets the week (of the year).
     * @example
     *
     *   Date.create('January 1').setWeek(15) -> 15th week of the year
     *
     ***/
    'setWeek': function(week) {
      if(week === undefined) return;
      var date = this.getDate();
      this.setMonth(0);
      this.setDate((week * 7) + 1);
    },

     /***
     * @method setUTCWeek()
     * @returns Nothing
     * @short Sets the week (of the year) according to universal time.
     * @example
     *
     *   Date.create('January 1').setUTCWeek(15) -> 15th week of the year
     *
     ***/
    'setUTCWeek': function(week) {
      if(week === undefined) return;
      var date = this.getUTCDate();
      this.setMonth(0);
      this.setUTCDate((week * 7) + 1);
    },

     /***
     * @method getWeek()
     * @returns Number
     * @short Gets the date's week (of the year).
     * @example
     *
     *   new Date().getWeek() -> today's week of the year
     *
     ***/
    'getWeek': function() {
      var d = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((this.getTime() - d.getTime() + 1) / (7 * 24 * 60 * 60 * 1000));
    },

     /***
     * @method getUTCWeek()
     * @returns Number
     * @short Gets the date's week (of the year) according to universal time.
     * @example
     *
     *   new Date().getUTCWeek() -> today's week of the year
     *
     ***/
    'getUTCWeek': function() {
      var d = new Date().setUTC(this.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      return Math.ceil((this.getTime() - d.getTime() + 1) / (7 * 24 * 60 * 60 * 1000));
    },

     /***
     * @method getUTCOffset([iso])
     * @returns String
     * @short Returns a string representation of the offset from UTC time. If [iso] is true the offset will be in ISO8601 format.
     * @example
     *
     *   new Date().getUTCOffset()     -> "+0900"
     *   new Date().getUTCOffset(true) -> "+09:00"
     *
     ***/
    'getUTCOffset': function(iso) {
      var offset = this.utc ? 0 : this.getTimezoneOffset();
      var colon  = iso === true ? ':' : '';
      if(!offset && iso) return 'Z';
      return Math.round(-offset / 60).pad(2, true) + colon + (offset % 60).pad(2);
    },

     /***
     * @method toUTC()
     * @returns Date
     * @short Converts the date to UTC time, effectively subtracting the timezeone offset.
     * @extra Note here that the method %getTimezoneOffset% will still show an offset even after this method is called, as this method effectively just rewinds the date. %format% however, will correctly set the %{tz}% (timezone) token as UTC once this method has been called on the date.
     * @example
     *
     *   new Date().toUTC() -> current time in UTC
     *
     ***/
    'toUTC': function() {
      if(this.utc) return this;
      var d = this.clone().addMinutes(this.getTimezoneOffset());
      d.utc = true;
      return d;
    },

     /***
     * @method isUTC()
     * @returns Boolean
     * @short Returns true if the date has no timezone offset.
     * @example
     *
     *   new Date().isUTC() -> true or false?
     *
     ***/
    'isUTC': function() {
      return this.utc || this.getTimezoneOffset() === 0;
    },

     /***
     * @method advance()
     * @returns Date
     * @short Sets the date forward.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). For more see @date_format.
     * @example
     *
     *   new Date().advance({ year: 2 }) -> 2 years in the future
     *   new Date().advance(0, 2, 3)     -> 2 months 3 days in the future
     *   new Date().advance(86400000)    -> 1 day in the future
     *
     ***/
    'advance': function(params) {
      var args = collectDateArguments(arguments,'year','month','day','hour','minute','second','millisecond');
      return updateDate(this, args[0], false, false, 1, true);
    },

     /***
     * @method rewind()
     * @returns Date
     * @short Sets the date back.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). For more see @date_format.
     * @example
     *
     *   new Date().rewind({ year: 2 }) -> 2 years in the past
     *   new Date().rewind(0, 2, 3)     -> 2 months 3 days in the past
     *   new Date().rewind(86400000)    -> 1 day in the past
     *
     ***/
    'rewind': function(params) {
      var args = collectDateArguments(arguments,'year','month','day','hour','minute','second','millisecond');
      return updateDate(this, args[0], false, false, -1);
    },

     /***
     * @method isValid()
     * @returns Boolean
     * @short Returns true if the date is valid.
     * @example
     *
     *   new Date().isValid()         -> true
     *   new Date('flexor').isValid() -> false
     *
     ***/
    'isValid': function() {
      return !isNaN(this.getTime());
    },

     /***
     * @method isAfter(<d>, [margin])
     * @returns Boolean
     * @short Returns true if the date is after the <d>.
     * @extra [margin] is to allow extra margin of error (in ms). <d> will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, <d> is assumed to be now.
     * @example
     *
     *   new Date().isAfter('tomorrow')  -> false
     *   new Date().isAfter('yesterday') -> true
     *
     ***/
    'isAfter': function(d, margin) {
      return compareDate(this, d, margin, 'after');
    },

     /***
     * @method isBefore(<d>, [margin])
     * @returns Boolean
     * @short Returns true if the date is before <d>.
     * @extra [margin] is to allow extra margin of error (in ms). <d> will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, <d> is assumed to be now.
     * @example
     *
     *   new Date().isBefore('tomorrow')  -> true
     *   new Date().isBefore('yesterday') -> false
     *
     ***/
    'isBefore': function(d, margin) {
      return compareDate(this, d, margin, 'before');
    },

     /***
     * @method isBetween(<d1>, <d2>, [margin])
     * @returns Boolean
     * @short Returns true if the date falls between <d1> and <d2>.
     * @extra [margin] is to allow extra margin of error (in ms). <d1> and <d2> will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, they are assumed to be now.
     * @example
     *
     *   new Date().isBetween('yesterday', 'tomorrow')    -> true
     *   new Date().isBetween('last year', '2 years ago') -> false
     *
     ***/
    'isBetween': function(first, second, margin) {
      if(compareDate(this, first, margin, 'after', true) && compareDate(this, second, margin, 'before', true)) {
        return true;
      } else {
        return compareDate(this, second, margin, 'after', true) && compareDate(this, first, margin, 'before', true);
      }
    },

     /***
     * @method isLeapYear()
     * @returns Boolean
     * @short Returns true if the date is a leap year.
     * @example
     *
     *   Date.create('2000').isLeapYear() -> true
     *
     ***/
    'isLeapYear': function() {
      var year = this.getFullYear();
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    },

     /***
     * @method daysInMonth()
     * @returns Number
     * @short Returns the number of days in the date's month.
     * @example
     *
     *   Date.create('May').daysInMonth()            -> 31
     *   Date.create('February, 2000').daysInMonth() -> 29
     *
     ***/
    'daysInMonth': function() {
      return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
    },

     /***
     * @method format(<format>)
     * @returns String
     * @short Formats the date for the given <format>.
     * @extra <format> will accept a number of tokens as well as pre-determined formats. It can also be %'relative'%, which will construct a relative, unit-adjusted offset to the current time. A function may also be passed here to allow more localization and more granular control. %relative% is provided as an alias. See @date_format for more details.
     * @example
     *
     *   Date.create().format('{d} {Month}, {YYYY}')              -> ex. July 4, 2003
     *   Date.create().format('{hh}:{mm}')                        -> ex. 15:57
     *   Date.create().format('{12hr}:{mm}{tt}')                  -> ex. 3:57pm
     *   Date.create().format(Date.AMERICAN_DATETIME)             -> ex. 3/15/2005 3:15pm
     *   Date.create().format(Date.INTERNATIONAL_TIME)            -> ex. 21:55:03
     *   Date.create().format(Date.RFC1123)                       -> ex. Tue, 05 Jul 2011 04:04:22 GMT+0900
     *   Date.create().format(Date.ISO8601)                       -> ex. 2011-07-05 12:24:55.528Z
     *   Date.create('1995').format('{years ago}')                -> ex. 15 years ago
     *   Date.create('beginning of this week').format('relative') -> ex. 3 days ago
     +   Date.create('yesterday').format(function(value,unit,ms,dir) {
     *     // value = 1, unit = 'day', ms = 86400000, dir = -1
     *   });                                                      -> ex. 1 day ago
     *
     ***/
    'format': function(f) {
      var d = this, adu;
      if(!d.isValid()) {
        return 'Invalid Date';
      } else if(!f) {
        return this.toString();
      } else if(Date[f]) {
        f = Date[f];
      } else if(Object.isFunction(f)) {
        adu = getAdjustedDateUnit(d);
        f = f.apply(d, adu) || 'relative';
      }
      if(f == 'relative') {
        adu = adu || getAdjustedDateUnit(d);
        if(adu[2] < 1000) {
          adu[0] = 1;
          adu[1] = 'second';
        }
        return adu[0] + ' ' + adu[1] + ' ' + (adu[3] < 0 ? 'ago' : 'from now');
      }
      dateOutputFormats.each(function(dof) {
        if(!f) return;
        f = f.replace(new RegExp('\\{('+dof.token+')(?: (pad))?\\}', dof.caps ? '' : 'i'), function(m,t,p) {
          var value = dof.format.call(null, d, '');
          if(dof.pad && (t.length === 2 || p === 'pad')) {
            value = value.pad(dof.pad);
          }
          if(dof.weekdays) {
            var l = t.toLowerCase();
            var abbreviated = l === 'dow' || l === 'weekday short';
            value = abbreviated ? abbreviatedWeekdays[value] : weekdays[value];
            if(t.first().toUpperCase() === t.first()) value = value.capitalize();
          }
          if(dof.months) {
            var l = t.toLowerCase();
            var abbreviated = l === 'mon' || l === 'month short';
            value = abbreviated ? abbreviatedMonths[value] : months[value];
            if(t.first().toUpperCase() === t.first()) value = value.capitalize();
          }
          if(dof.meridian) {
            if(t.length === 1) value = value.to(1);
            if(t.toUpperCase() === t) value = value.toUpperCase();
          }
          return value;
        });
      });
      return f;
    },

     /***
     * @method relative([fn])
     * @returns String
     * @short Shortcut for %format('relative')%.
     * @extra [fn] is a callback that can be used for more granular control over the resulting string. [fn] is passed 4 arguments: the adjusted value, adjusted unit, offset in milliseconds, and %dir%, which is -1 if the string is in the past and 1 if it is in the future. For more information, see @date_format.
     * @example
     *
     *   Date.create('90 seconds ago').relative() -> 1 minute ago
     *   Date.create('January').relative()        -> ex. 5 months ago
     +   Date.create('120 minutes ago').relative(function(val, unit, ms, dir) {
     *    return val + ' ' + unit + ' ago';
     *   });                                      -> ex. 5 months ago
     *
     ***/
    'relative': function(fn) {
      return this.format(fn || 'relative');
    },

     /***
     * @method is(<d>, [margin])
     * @returns Boolean
     * @short Returns true if the date is <d>.
     * @extra [margin] is to allow extra margin of error (in ms). <d> will accept a date object, timestamp, or text format. If not specified, <d> is assumed to be now. %is% additionally understands more generalized expressions like month/weekday names, 'today', etc. Dates will be compared to the precision implied in <d>. For more information, see @date_format.
     * @example
     *
     *   Date.create().is('July')               -> true or false?
     *   Date.create().is('1776')               -> false
     *   Date.create().is('today')              -> true
     *   Date.create().is('weekday')            -> true or false?
     *   Date.create().is('July 4, 1776')       -> false
     *   Date.create().is(-6106093200000)       -> false
     *   Date.create().is(new Date(1776, 6, 4)) -> false
     *
     ***/
    'is': function(d, margin) {
      var month, weekday;
      if(Object.isString(margin)) {
        var f = dateUnits.find(function(u) {
          return u.unit === margin;
        });
        if(f) {
          margin = f.multiplier();
        }
      }
      margin = margin > 0 ? margin : 0;
      if(!Object.isString(d)) {
        d = Date.create(d);
        margin = margin || 0;
        var t = this.getTime();
        var f = d.getTime();
        return t >= (f - margin) && t < (f + 1 + margin);
      } else {
        d = d.trim();
        if(d === 'future') {
          return this.getTime() > new Date().getTime();
        } else if(d === 'past') {
          return this.getTime() < new Date().getTime();
        } else if(d === 'weekday') {
          return !(this.getDay() === 0 || this.getDay() === 6);
        } else if(d === 'weekend') {
          return this.getDay() === 0 || this.getDay() === 6;
        } else if(weekday = getWeekday(d)) {
          return this.getDay() === weekday;
        } else if(month = getMonth(d)) {
          return this.getMonth() === month;
        } else {
          return compareDate(this, d, margin);
        }
      }
    },

     /***
     * @method resetTime()
     * @returns Date
     * @short Resets the time in the date to 00:00:00.000.
     * @example
     *
     *   Date.create().resetTime()  -> Beginning of today
     *
     ***/
    'resetTime': function() {
      return this.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    },

     /***
     * @method clone()
     * @returns Date
     * @short Clones the date.
     * @example
     *
     *   Date.create().clone() -> Copy of now
     *
     ***/
    'clone': function() {
      return new Date(this.getTime());
    },

     /***
     * @method toISOString()
     * @returns String
     * @short Formats the string to ISO8601 format.
     * @extra This will always format as UTC time. Provided for browsers that do not support this method.
     * @example
     *
     *   Date.create().toISOString() -> ex. 2011-07-05 12:24:55.528Z
     *
     ***/
    'toISOString': function(utc) {
      return this.toUTC().format(Date.ISO8601_DATETIME);
    }

  });

  // Class aliases
  // Creating "create" as an alias as there are instances where it may be overwritten.
  extend(Date, false, {

    'ISO8601': Date.ISO8601_DATETIME,

     /***
     * @method Date.create(<d>)
     * @returns Date
     * @short Alternate Date constructor which understands various formats.
     * @extra Accepts a multitude of text formats, a timestamp, or another date. If no argument is given, date is assumed to be now. %Date.create% additionally can accept enumerated parameters as with the standard date constructor. For more information, see @date_format.
     * @example
     *
     *   Date.create('July')          -> July of this year
     *   Date.create('1776')          -> 1776
     *   Date.create('today')         -> today
     *   Date.create('wednesday')     -> This wednesday
     *   Date.create('next friday')   -> Next friday
     *   Date.create('July 4, 1776')  -> July 4, 1776
     *   Date.create(-446806800000)   -> November 5, 1955
     *   Date.create(1776, 6, 4)      -> July 4, 1776
     *
     ***/
    'create': Date.make

  });

  // Instance aliases
  extend(Date, true, {

     /***
     * @method getWeekday()
     * @alias getDay
     *
     ***/
    'getWeekday':    Date.prototype.getDay,

     /***
     * @method getUTCWeekday()
     * @alias getUTCDay
     *
     ***/
    'getUTCWeekday':    Date.prototype.getUTCDay,

     /***
     * @method iso()
     * @alias toISOString
     *
     ***/
    'iso':    Date.prototype.toISOString

  });






  /***
   * RegExp module
   *
   ***/

  RegExp.NPCGSupport = /()??/.exec('')[1] === undefined; // NPCG: nonparticipating capturing group


  extend(RegExp, false, {

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
      return str.replace(/([/'*+?|()\[\]{}.^$])/g,'\\$1');
    }

  });

  extend(RegExp, true, {

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
      return new RegExp(this.source, flags);
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
      var flags = '';
      if(this.global || flag == 'g') flags += 'g';
      if(this.ignoreCase || flag == 'i') flags += 'i';
      if(this.multiline || flag == 'm') flags += 'm';
      if(this.sticky || flag == 'y') flags += 'y';
      return this.setFlags(flags);
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
      var flags = '';
      if(this.global && flag != 'g') flags += 'g';
      if(this.ignoreCase && flag != 'i') flags += 'i';
      if(this.multiline && flag != 'm') flags += 'm';
      if(this.sticky && flag != 'y') flags += 'y';
      return this.setFlags(flags);
    }

  });




  /***
   * Function module
   *
   ***/

  extend(Function, false, {

     /***
     * @method Function.lazy(<fn>, [throttle] = 1)
     * @returns Function
     * @short Creates lazy functions for non-blocking operations.
     * @extra This class method will return a function that when called will execute after the CPU is free, preventing "freezing" on heavy operations. Although this will work for a single function, it is best when used in conjunction with loops like %each%. In such situations, the returned function will be called multiple times. By default each iteration of <fn> will be called 1ms after the last, or the iteration number * [throttle]. By passing in a smaller value for [throttle] (can be a decimal < 1), you can "tighen up" the execution time so that the iterations happen faster. By passing in a greater value for [throttle], you can space the function execution out to prevent thread blocking. Playing with this number is the easiest way to strike a balance for heavier operations.
     * @example
     *
     *   Function.lazy(function() {
     *     // Executes 1ms later
     *   })();
     *   [1,2,3].each(Function.lazy(function() {
     *     // Executes 3 times, each 1ms later than the other.
     *   }));
     *   [1,2,3].each(Function.lazy(function() {
     *     // Executes 3 times, each 20ms later than the other.
     *   }, 20));
     *
     ***/
    'lazy': function(fn, throttle) {
      if(throttle === undefined) throttle = 1;
      var run = 0;
      return function() {
        var self = this, args = arguments;
        setTimeout(function() {
          return fn.apply(self, args);
        }, Math.round(++run * throttle));
      }
    }

  });

  extend(Function, true, {

     /***
     * @method bind(<scope>, [arg1], [arg2], ...)
     * @returns Function
     * @short Binds <scope> as the %this% object for the function when it is called. Also allows currying an unlimited number of parameters.
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
      var fn = this;
      var args = Array.prototype.slice.call(arguments, 1);
      return function() {
        return fn.apply(scope, args.concat(Array.prototype.slice.call(arguments)));
      }
    },

     /***
     * @method delay(<duration>)
     * @returns Number
     * @short Delays the function for <duration> milliseconds. Returns the timer to be used with %clearTimeout%.
     * @extra In addition to the timer returned, functions using the delay method can be canceled using the %cancel% method. Can also curry arguments passed in after the duration.
     * @example
     *
     *   (function(arg1) {
     *     // called 1s later
     *   }).delay(1000, 'arg1');    -> returns a timer to clear the function. Called 5 seconds later.
     *
     ***/
    'delay': function(duration) {
      var fn = this;
      var args = Array.prototype.slice.call(arguments, 1);
      this.timer = setTimeout(function() {
        return fn.apply(fn, args);
      }, duration);
      return this.timer;
    },

     /***
     * @method defer()
     * @returns Function
     * @short Defers the function to be called after the stack is empty.
     * @extra Defer can also curry arguments passed in.
     * @example
     *
     *   (function(arg1) {
     *     // called when CPU becomes idle
     *   }).defer('arg1');     -> returns the function
     *
     ***/
    'defer': function() {
      this.delay.apply(this, [0].concat(Array.prototype.slice.call(arguments)));
      return this;
    },

     /***
     * @method cancel()
     * @returns Nothing
     * @short Cancels a function scheduled to be called with %delay%.
     * @extra Note: This method won't work when using certain other frameworks like Prototype, as they will retain their %delay% method.
     * @example
     *
     *   var f = (function() {
     *     alert('hay'); // Never called
     *   }); f.delay(500); f.cancel();
     *
     ***/
    'cancel': function() {
      return clearTimeout(this.timer);
    }

  });



  // Initializer
  function initialize() {
    buildObject();
    buildString();
    buildDate();
  }

  initialize();



})();

