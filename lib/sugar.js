(function() {

  var extend = function(klass, instance, override, methods) {
    var extendee = instance ? klass.prototype : klass;
    storeMethods(klass, instance, methods);
    iterateOverObject(methods, function(name, method) {
      if(typeof override === 'function') {
        defineProperty(extendee, name, wrapNative(extendee[name], method, override));
      } else if(override === true || !extendee[name]) {
        defineProperty(extendee, name, method);
      }
      klass.SugarMethods[name] = { instance: instance, method: method };
    });
  };

  var storeMethods = function(klass, instance, methods) {
    if(klass.SugarMethods) return;
    klass.SugarMethods = {};
    defineProperty(klass, 'sugar', function() {
      var args = arguments, all = args.length === 0;
      iterateOverObject(klass.SugarMethods, function(name, m) {
        if(all || arrayFind(args, name)) {
          defineProperty(m.instance ? klass.prototype : klass, name, m.method);
        }
      });
    });
  }

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
    if(Object.defineProperty && Object.defineProperties) {
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

  var iterateOverSparseArray = function(arr, fn, fromIndex, loop) {
    var indexes = [], i;
    for(i in arr) {
      if(isArrayIndex(arr, i) && i >= fromIndex) {
        indexes.push(i.toNumber());
      }
    }
    indexes.sort();
    indexes.each(function(index) {
      return fn.call(arr, arr[index], index, arr);
    });
    return arr;
  };

  var deepEquals = function(a,b) {
    if(typeof a == 'object' && typeof b == 'object' && a !== null && b !== null) {
      for(var key in a) {
        if(!a.hasOwnProperty(key)) continue;
        if(!b.hasOwnProperty(key) || !deepEquals(a[key], b[key])) {
          return false;
        }
      }
      return Object.keys(a).length === Object.keys(b).length;
    } else {
      return a === b;
    }
  };

  var multiMatch = function(el, match, scope, params) {
    if(el === match) {
      // Return if exact match
      return true;
    } else if(Object.isRegExp(match)) {
      // Match against a regexp
      return match.test(el);
    } else if(Object.isFunction(match)) {
      // Match against a filtering function
      return match.apply(scope, [el].concat(params));
    } else if(typeof match === 'object') {
      // Match against a hash or array.
      return deepEquals(match, el);
    } else {
      // Otherwise false
      return false;
    }
  };

  var transformArgument = function(args, el, scope, params) {
    var transform = args[0];
    if(args.length === 0) {
      return el;
    } else if(!Object.isFunction(transform) && !Object.isString(transform)) {
      throw new TypeError('First argument must be a function or a string');
    }
    if(Object.isFunction(transform)) {
      return transform.apply(scope, [el].concat(params));
    } else if(typeof el[transform] == 'function') {
      return el[transform].call(el);
    } else {
      return el[transform];
    }
  };

  var multiArgs = function(args, fn) {
    arrayEach(Array.prototype.slice.call(args).flatten(), fn);
  };

  var getMinOrMax = function(obj, args, which, el) {
    var max = which === 'max', min = which === 'min';
    var edge = max ? -Infinity : Infinity;
    var result = [];
    iterateOverObject(obj, function(key) {
      var entry = obj[key];
      var test = transformArgument(args, entry, el);
      if(test === undefined || test === null) {
        return;
      } else if(test === edge) {
        result.push(entry);
      } else if((max && test > edge) || (min && test < edge)) {
        result = [entry];
        edge = test;
      }
    });
    return result;
  };

  var getAtIndexes = function(obj, args, str) {
    var loop = args[args.length - 1] !== false, result = [], index, i;
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

  var arrayFind = function(arr, f, fromIndex, loop, returnIndex) {
    var result, index;
    arrayEach(arr, function(el, i, arr) {
      if(multiMatch(el, f, arr, [i, arr])) {
        result = el;
        index = i;
        return false;
      }
    }, fromIndex, loop);
    return returnIndex ? index : result;
  };

  var arrayEach = function(arr, fn, index, loop) {
    var length, index, i;
    checkCallback(fn);
    i = toIntegerWithDefault(index, 0);
    length = loop === true ? arr.length + i : arr.length;
    while(i < length) {
      index = i % arr.length;
      if(!(index in arr)) {
        return iterateOverSparseArray(arr, fn, i, loop);
      } else if(fn.call(arr, arr[index], index, arr) === false) {
        break;
      }
      i++;
    }
  };

  var arrayUnique = function(arr) {
    var result = [];
    arr.each(function(el) {
      if(arrayFind(result, el) === undefined) result.push(el);
    });
    return result;
  };


  var getRange = function(start, stop, fn, step) {
    var arr = [], i = parseInt(start), up = step > 0;
    while((up && i <= stop) || (!up && i >= stop)) {
      arr.push(i);
      if(fn) fn.call(this, i);
      i += step;
    }
    return arr;
  };

  var toIntegerWithDefault = function(i, d) {
    if(isNaN(i)) {
      return d;
    } else {
      return parseInt(i >> 0);
    }
  };

  var isArrayIndex = function(arr, i) {
    return i in arr && toUInt32(i) == i && i != 0xffffffff;
  };

  var toUInt32 = function(i) {
    return i >>> 0;
  };

  var checkCallback = function(fn) {
    if(!fn || !fn.call) {
      throw new TypeError('Callback is not callable');
    }
  };

  var checkFirstArgumentExists = function(args) {
    if(args.length === 0) {
      throw new TypeError('First argument must be defined');
    }
  };


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

  var cloneObject = function(obj, deep, extend) {
    var result;
    if(Array.isArray(obj)) {
      result = [];
    } else if(extend) {
      result = Object.extended({});
    } else {
      result = {};
    }
    iterateOverObject(obj, function(k,v) {
      if(deep && (Object.isObject(v) || Array.isArray(v))) {
        result[k] = cloneObject(v, deep, extend);
      } else {
        result[k] = v;
      }
    });
    return result;
  };

  var setParamsObject = function(obj, param, value, deep) {
    var reg = /^(.+?)(\[.*\])$/, isArray, match, allKeys, key;
    if(deep !== false && (match = param.match(reg))) {
      key = match[1];
      allKeys = match[2].replace(/^\[|\]$/g, '').split('][');
      arrayEach(allKeys, function(k) {
        isArray = !k || k.match(/^\d+$/);
        if(!key && Object.isArray(obj)) key = obj.length;
        if(!obj[key]) {
          obj[key] = isArray ? [] : {};
        }
        obj = obj[key];
        key = k;
      });
      if(!key && isArray) key = obj.length.toString();
      setParamsObject(obj, key, value);
    } else if(value.match(/^\d+$/)) {
      obj[param] = parseInt(value);
    } else if(value === 'true') {
      obj[param] = true;
    } else if(value === 'false') {
      obj[param] = false;
    } else {
      obj[param] = value;
    }
  };

  var Hash = function(obj) {
    var self = this;
    iterateOverObject(obj, function(key, value) {
      self[key] = value;
    });
  }

  Hash.prototype.constructor = Object;

  extend(Hash, true, false, {
    'clone': function(deep) {
      return cloneObject(this, deep, true);
    }
  });

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
   * @extra Be careful here, as NaN is also a number in Javascript!
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

  var buildTypeMethods = function() {
    var methods = {};
    typeMethods.slice(1).forEach(function(m) {
      methods['is' + m] = function(obj) {
        return instance(obj, m);
      };
    });
    extend(Object, false, false, methods);
  };

  var buildHashMethods = function() {
    hashMethods.forEach(function(m) {
      defineProperty(Hash.prototype, m, function() {
        return Object[m].apply(null, [this].concat(Array.prototype.slice.call(arguments)));
      });
    });
  };

  var buildObject = function() {
    extend(Object, false, false, { isArray: Array.isArray });
    buildTypeMethods();
    buildHashMethods();
  }


  extend(Object, false, false, {

    // Not going to document this for now.
    'enableSugar': function() {
      typeMethods.each(function(m) {
        defineProperty(Object.prototype, 'is'+m, function() {
          return Object['is'+m](this);
        });
      });
      hashMethods.each(function(m) {
        defineProperty(Object.prototype, m, Hash.prototype[m]);
      });
      defineProperty(Object.prototype, 'clone', function(deep) {
        return cloneObject(this, deep, true);
      });
    },

    /***
     * @method Object.extended(<obj> = {})
     * @returns Extended object
     * @short Creates a new object with extended hash-like methods.
     * @extra This is equivalent to the standard Object constructor %new Object()% but additionally returns an object with extended hash methods.
     * @example
     *
     *   Object.extended()
     *   Object.extended({ happy:true, pappy:false })
     *   Object.extended({ happy:true, pappy:false }).keys() -> ['happy','pappy']
     *
     ***/
    'extended': function(obj) {
      return new Hash(obj);
    },

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
     * @extra All arguments must be actual objects.
     * @example
     *
     *   Object.merge({a:1},{b:2}) -> { a:1, b:2 }
     *
     ***
     * @method merge(<obj1>, <obj2>, ...)
     * @returns Merged object
     * @short Accepts an arbitrary number of objects as arguments and merges them all into itself.
     * @extra All arguments must be actual objects. This method is only available on extended objects created with %Object.extended%.
     * @example
     *
     *   Object.extended({a:1}).merge({b:2}) -> { a:1, b:2 }
     *
     ***/
    'merge': function() {
      var target = arguments[0];
      multiArgs(arguments, function(a) {
        if(typeof a !== 'object') return;
        iterateOverObject(a, function(key, value) {
          target[key] = value;
        });
      }, 1);
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
      if(!obj) return true;
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
    },

    /***
     * @method Object.values(<obj>, [fn])
     * @returns Array
     * @short Returns an array containing the values in <obj>. Optionally calls [fn] for each value.
     * @extra Returned values are in no particular order.
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
     * @extra This method is only available on extended objects created with %Object.extended%. Returned values are in no particular order.
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
    },

    /***
     * @method Object.clone(<obj> = {}, [deep] = false)
     * @returns Cloned object
     * @short Creates a clone (copy) of <obj>.
     * @extra Default is a shallow clone, unless [deep] is true.
     * @example
     *
     *   Object.clone({foo:'bar'}) -> { foo: 'bar' }
     *   Object.clone({})          -> {}
     *
     ***
     * @method clone([deep] = false)
     * @returns Cloned object
     * @short Creates a clone (copy) of the object.
     * @extra Default is a shallow clone, unless [deep] is true. This method is only available on extended objects created with %Object.extended%.
     * @example
     *
     *   Object.extended({foo:'bar'}).clone() -> { foo: 'bar' }
     *   Object.extended({}).clone()          -> {}
     *
     ***/
    'clone': cloneObject,

    /***
     * @method Object.fromQueryString(<str>, [deep] = true)
     * @returns Object
     * @short Converts the query string of a URL into an object.
     * @extra If [deep] is %false%, conversion will only accept shallow params (ie. no object or arrays with %[]% syntax) as these are not universally supported.
     * @example
     *
     *   Object.fromQueryString('foo=bar&broken=wear') -> { foo: 'bar', broken: 'wear' }
     *   Object.fromQueryString('foo[]=1&foo[]=2')     -> { foo: [1,2] }
     *
     ***/
    'fromQueryString': function(str, deep) {
      var result = Object.extended(), split;
      str = str && str.toString ? str.toString() : '';
      str.replace(/^.*?\?/, '').unescapeURL().split('&').each(function(p) {
        var split = p.split('=');
        if(split.length !== 2) return;
        setParamsObject(result, split[0], split[1], deep);
      });
      return result;
    }


  });


  extend(Object, false, function() { return arguments.length < 2; }, {

    /***
     * @method Object.keys(<obj>, [fn])
     * @returns Array
     * @short Returns an array containing the keys in <obj>. Optionally calls [fn] for each key.
     * @extra Note that this method provides added functionality over the browser native %keys% method, which will not accept [fn]. Returned keys are in no particular order.
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
     * @extra This method is only available on extended objects created with %Object.extended%. Returned keys are in no particular order.
     * @example
     *
     *   Object.extended({ broken: 'wear' }).keys() -> ['broken']
     *   Object.extended({ broken: 'wear' }).keys(function(key, value) {
     *     // Called once for each key.
     *   });
     *
     ***/
    'keys': function(obj, fn) {
      if(obj === null || typeof obj != 'object') {
        throw new TypeError('Object required');
      }
      var keys = [];
      iterateOverObject(obj, function(k,v) {
        keys.push(k);
        if(fn) fn.call(obj, k);
      });
      return keys;
    }

  });








  /***
   * Array module
   *
   ***/



  extend(Array, false, false, {

    /***
     *
     * @method Array.isArray(<obj>)
     * @returns Boolean
     * @short Returns true if <obj> is an Array.
     * @example
     *
     *   Array.isArray(3)        -> false
     *   Array.isArray(true)     -> false
     *   Array.isArray('wasabi') -> false
     *   Array.isArray([1,2,3])  -> true
     *
     ***/
    'isArray': function(obj) {
      return instance(obj, 'Array');
    }

  });



  extend(Array, true, function() { return arguments.length === 0 || Object.isFunction(arguments[0]); }, {

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
     * @method map(<f>, [scope])
     * @returns Array
     * @short Maps the array to another array containing the values that are the result of calling <f> on each element.
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
    'map': function(f, scope) {
      var length = this.length, index = 0, result = new Array(length);
      checkFirstArgumentExists(arguments);
      while(index < length) {
        if(index in this) {
          result[index] = transformArgument(arguments, this[index], scope, [index, this]);
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


  extend(Array, true, false, {

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
      var length = this.length, index = toIntegerWithDefault(fromIndex, 0);
      if(Object.isString(this)) {
        return this.indexOf(search, fromIndex);
      }
      if(index < 0) {
        index = Math.max(length + index, 0);
      }
      if(length == 0 || index > length) {
        return -1;
      }
      while(index < length) {
        if(index in this && this[index] === search) {
          return index;
        }
        index++;
      }
      return -1;
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
      var length = this.length, index = toIntegerWithDefault(fromIndex, length);
      if(Object.isString(this)) {
        return this.lastIndexOf(search, fromIndex);
      }
      if(index < 0) {
        index = length + index;
      }
      if(length == 0 || index < 0) {
        return -1;
      }
      while(index >= 0) {
        if(index in this && this[index] === search) {
          return index;
        }
        index--;
      }
      return -1;
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
      var length = this.length, index = 0, initialValue = arguments.length > 1 && init, result;
      checkCallback(fn);
      if(length == 0 && !initialValue) {
        throw new TypeError('Reduce called on empty array with no initial value');
      } else if(initialValue) {
        result = initialValue;
      } else {
        result = this[index];
        index++;
      }
      while(index < length) {
        if(index in this) {
          result = fn.call(undefined, result, this[index], index, this);
        }
        index++;
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
      var length = this.length, index = length - 1, initialValue = arguments.length > 1 && init, result;
      checkCallback(fn);
      if(length == 0 && !initialValue) {
        throw new TypeError('Reduce called on empty array with no initial value');
      } else if(initialValue) {
        result = initialValue;
      } else {
        result = this[index];
        index--;
      }
      while(index >= 0) {
        if(index in this) {
          result = fn.call(undefined, result, this[index], index, this);
        }
        index--;
      }
      return result;
    },

    /***
     * @method each(<fn>, [index] = 0, [loop] = false)
     * @returns Array
     * @short Runs <fn> against elements in the array.
     * @extra Parameters passed to <fn> are identical to %forEach%, ie. the first parameter is the current element, second parameter is the current index, and third parameter is the array itself. If <fn> returns %false% at any time it will break out of the loop. Once %each% finishes, it will return the array. If [index] is passed, <fn> will begin at that index and work its way to the end. If [loop] is true, it will then start over from the beginning of the array and continue until it reaches [index] - 1.
     * @example
     *
     *   [1,2,3,4].each(function(n) {
     *     // Called 4 times: 1, 2, 3, 4
     *   });
     *   [1,2,3,4].each(function(n) {
     *     // Called 4 times: 3, 4, 1, 2
     *   }, true);
     *
     ***/
    'each': function(fn, index, loop) {
      arrayEach(this, fn, index, loop);
      return this;
    },

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
      return arrayFind(this, f, index, loop);
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
      var result = [];
      arrayEach(this, function(el, i, arr) {
        if(multiMatch(el, f, arr, [i, arr])) {
          result.push(el);
        }
      }, index, loop);
      return result;
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
    'none': function() {
      return !this.any.apply(this, arguments);
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
     * @method removeAt(<start>, [end])
     * @returns Array
     * @short Removes element at <start>. If [end] is specified, removes the range between <start> and [end]. This method will change the array! If you don't intend the array to be changed use %clone% first.
     * @example
     *
     *   ['a','b','c'].removeAt(0) -> ['b','c']
     *   [1,2,3,4].removeAt(1, 3)  -> [1]
     *
     ***/
    'removeAt': function(start, end) {
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
     * @method exclude([f1], [f2], ...)
     * @returns Array
     * @short Removes any element in the array that matches [f1], [f2], etc.
     * @extra This is a non-destructive alias for %remove%. It will not change the original array.
     * @example
     *
     *   [1,2,3].exclude(3)         -> [1,2]
     *   ['a','b','c'].exclude(/b/) -> ['a','c']
     +   [{a:1},{b:2}].exclude(function(n) {
     *     return n['a'] == 1;
     *   });                       -> [{b:2}]
     *
     ***/
    'exclude': function() {
      return Array.prototype.remove.apply(this.clone(), arguments);
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
      return arrayUnique(this);
    },

    /***
     * @method union([a1], [a2], ...)
     * @returns Array
     * @short Returns an array containing all elements in all arrays with duplicates removed.
     * @example
     *
     *   [1,3,5].union([5,7,9])     -> [1,3,5,7,9]
     *   ['a','b'].union(['b','c']) -> ['a','b','c']
     *
     ***/
    'union': function() {
      var arr = this;
      multiArgs(arguments, function(a) {
        arr = arr.concat(a);
      });
      return arrayUnique(arr);
    },

    /***
     * @method intersect([a1], [a2], ...)
     * @returns Array
     * @short Returns an array containing the elements all arrays have in common.
     * @example
     *
     *   [1,3,5].intersect([5,7,9])   -> [5]
     *   ['a','b'].intersect('b','c') -> ['b']
     *
     ***/
    'intersect': function() {
      var result = [], args = arguments;
      this.each(function(el, i) {
        multiArgs(args, function(merge) {
          if(!Array.isArray(merge)) merge = [merge];
          if(arrayFind(result, el) === undefined && arrayFind(merge, el) !== undefined) {
            result.push(el);
          }
        });
      });
      return result;
    },

    /***
     * @method subtract([a1], [a2], ...)
     * @returns Array
     * @short Subtracts from the array all elements in [a1], [a2], etc.
     * @example
     *
     *   [1,3,5].subtract([5,7,9])   -> [1,3]
     *   [1,3,5].subtract([3],[5])   -> [1]
     *   ['a','b'].subtract('b','c') -> ['a']
     *
     ***/
    'subtract': function(a) {
      var arr = this.clone(), index;
      multiArgs(arguments, function(subtract) {
        if(!Array.isArray(subtract)) subtract = [subtract];
        subtract.each(function(el) {
          arr.remove(el);
        });
      });
      return arr;
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
      return getAtIndexes(this, arguments, false);
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
    'min': function() {
      return arrayUnique(getMinOrMax(this, arguments, 'min'));
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
      return arrayUnique(getMinOrMax(this, arguments, 'max'));
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
    'least': function() {
      var result = getMinOrMax(this.groupBy.apply(this, arguments), ['length'], 'min').flatten();
      return result.length === this.length ? [] : arrayUnique(result);
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
    'most': function() {
      var result = getMinOrMax(this.groupBy.apply(this, arguments), ['length'], 'max').flatten();
      return result.length === this.length ? [] : arrayUnique(result);
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
     *   });                                  -> { 35: [{age:35,name:'ken'}], 15: [{age:15,name:'bob'}] }
     *
     ***/
    'groupBy': function() {
      var result = {}, args = arguments, key;
      this.each(function(el) {
        key = transformArgument(args, el);
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
     * @method compact([all])
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
      this.each(function(el, i) {
        if(Array.isArray(el)) {
          result.push(el.compact());
        } else if(all && el) {
          result.push(el);
        } else if(!all && el !== undefined && el !== null && (typeof el != 'number' || !isNaN(el))) {
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
        if(Array.isArray(el)) {
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
      var arr = this, args = arguments;
      arr.sort(function(a, b) {
        var aProperty = transformArgument(args, a);
        var bProperty = transformArgument(args, b);
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
  extend(Array, true, false, {

    /***
     * @method all()
     * @alias every
     *
     ***/
    'all': Array.prototype.every,

    /*** @method any()
     * @alias some
     *
     ***/
    'any': Array.prototype.some,

    /***
     * @method has()
     * @alias some
     *
     ***/
    'has': Array.prototype.some,

    /***
     * @method insert()
     * @alias add
     *
     ***/
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


  extend(Number, false, false, {

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
      var min, max;
      if(arguments.length == 1) n2 = n1, n1 = 0;
      min = Math.min(n1 || 0, n2 || 1);
      max = Math.max(n1 || 0, n2 || 1);
      return Math.round((Math.random() * (max - min)) + min);
    }

  });

  extend(Number, true, false, {

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
     * @method downto(<num>, [fn])
     * @returns Array
     * @short Returns an array containing numbers from the number down to <num>. Optionally calls [fn] callback for each number in that array.
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
     * @method hex([pad] = 1)
     * @returns String
     * @short Converts the number to hexidecimal.
     * @extra [pad] will pad the resulting string to that many places.
     * @example
     *
     *   (255).hex()   -> 'ff';
     *   (255).hex(4)  -> '00ff';
     *   (23654).hex() -> '5c66';
     *
     ***/
    'hex': function(pad) {
      return this.pad(pad || 1, false, 16);
    }

  });






  /***
   * String module
   *
   ***/


  // WhiteSpace/LineTerminator as defined in ES5.1 plus Unicode characters in the Space, Separator category.
  var trimmableCharacters = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF';

  /***
   * @method hasArabic()
   * @returns Boolean
   * @short Returns true if the string contains any Arabic characters.
   * @example
   *
   *   'أتكلم'.hasArabic()   -> true
   *
   ***
   * @method isArabic()
   * @returns Boolean
   * @short Returns true if the string contains only Arabic characters.
   * @example
   *
   *   'أتكلم'.isArabic()   -> true
   *
   ****
   * @method hasCyrillic()
   * @returns Boolean
   * @short Returns true if the string contains any Cyrillic characters.
   * @example
   *
   *   'визит'.hasCyrillic() -> true
   *
   ***
   * @method isCyrillic()
   * @returns Boolean
   * @short Returns true if the string contains only Cyrillic characters.
   * @example
   *
   *   'визит'.isCyrillic() -> true
   *
   ****
   * @method hasGreek()
   * @returns Boolean
   * @short Returns true if the string contains any Greek characters.
   * @example
   *
   *   'Ελληνικά'.hasGreek() -> true
   *
   ***
   * @method isGreek()
   * @returns Boolean
   * @short Returns true if the string contains only Greek characters.
   * @example
   *
   *   'Ελληνικά'.isGreek() -> true
   *
   ****
   * @method hasHangul()
   * @returns Boolean
   * @short Returns true if the string contains any Hangul characters.
   * @example
   *
   *   '잘 먹겠습니다!'.hasHangul() -> true
   *
   ***
   * @method isHangul()
   * @returns Boolean
   * @short Returns true if the string contains only Hangul characters.
   * @example
   *
   *   '잘 먹겠습니다!'.isHangul() -> true
   *
   ****
   * @method hasHan()
   * @returns Boolean
   * @short Returns true if the string contains any Han (Chinese) characters.
   * @example
   *
   *   '乾杯'.hasHan() -> true
   *
   ***
   * @method isHan()
   * @returns Boolean
   * @short Returns true if the string contains only Han (Chinese) characters.
   * @example
   *
   *   '乾杯'.isHan() -> true
   *
   ****
   * @method hasKanji()
   * @returns Boolean
   * @short Returns true if the string contains any Kanji.
   * @example
   *
   *   '乾杯 '.hasKanji() -> true
   *
   ***
   * @method isKanji()
   * @returns Boolean
   * @short Returns true if the string contains only Kanji.
   * @example
   *
   *   '乾杯 '.isKanji() -> true
   *
   ****
   * @method hasHebrew()
   * @returns Boolean
   * @short Returns true if the string contains any Hebrew characters.
   * @example
   *
   *   'עִבְרִית'.hasHebrew() -> true
   *
   ***
   * @method isHebrew()
   * @returns Boolean
   * @short Returns true if the string contains only Hebrew characters.
   * @example
   *
   *   'עִבְרִית'.isHebrew() -> true
   *
   ****
   * @method hasHiragana()
   * @returns Boolean
   * @short Returns true if the string contains any Hiragana characters.
   * @example
   *
   *   'こんにちは'.hasHiragana() -> true
   *
   ***
   * @method isHiragana()
   * @returns Boolean
   * @short Returns true if the string contains only Hiragana characters.
   * @example
   *
   *   'こんにちは'.isHiragana() -> true
   *
   ****
   * @method hasKana()
   * @returns Boolean
   * @short Returns true if the string contains any Kana characters.
   * @example
   *
   *   'ミックスです'.hasKana() -> true
   *
   ***
   * @method isKana()
   * @returns Boolean
   * @short Returns true if the string contains only Kana characters.
   * @example
   *
   *   'ミックスです'.isKana() -> true
   *
   ****
   * @method hasKatakana()
   * @returns Boolean
   * @short Returns true if the string contains any Katakana characters.
   * @example
   *
   *   'オーマイガー'.hasKatakana() -> true
   *
   ***
   * @method isKatakana()
   * @returns Boolean
   * @short Returns true if the string contains only Katakana characters.
   * @example
   *
   *   'オーマイガー '.isKatakana() -> true
   *
   ****
   * @method hasThai()
   * @returns Boolean
   * @short Returns true if the string contains any Thai characters.
   * @example
   *
   *   'ภาษาไทย'.hasThai() -> true
   *
   ***
   * @method isThai()
   * @returns Boolean
   * @short Returns true if the string contains only Thai characters.
   * @example
   *
   *   'ภาษาไทย'.isThai() -> true
   *
   ****
   * @method hasDevanagari()
   * @returns Boolean
   * @short Returns true if the string contains any Devanagari characters.
   * @example
   *
   *   'सभी मनुष्यों'.hasDevanagari() -> true
   *
   ***
   * @method isDevanagari()
   * @returns Boolean
   * @short Returns true if the string contains only Devanagari characters.
   * @example
   *
   *   'सभी मनुष्यों'.isDevanagari() -> true
   *
   ***/
  var unicodeScripts = [
    { names: ['Arabic'],      source: '\u0600-\u06FF' },
    { names: ['Cyrillic'],    source: '\u0400-\u04FF' },
    { names: ['Devanagari'],  source: '\u0900-\u097F' },
    { names: ['Greek'],       source: '\u0370-\u03FF' },
    { names: ['Hangul'],      source: '\uAC00-\uD7AF\u1100-\u11FF' },
    { names: ['Han','Kanji'], source: '\u4E00-\u9FFF\uF900-\uFAFF' },
    { names: ['Hebrew'],      source: '\u0590-\u05FF' },
    { names: ['Hiragana'],    source: '\u3040-\u309F\u30FB-\u30FC' },
    { names: ['Kana'],        source: '\u3040-\u30FF\uFF61-\uFF9F' },
    { names: ['Katakana'],    source: "\u30A0-\u30FF\uFF61-\uFF9F" },
    { names: ['Thai'],        source: '\u0E00-\u0E7F' }
  ];

  var buildUnicodeScripts = function() {
    unicodeScripts.each(function(s) {
      var is = new RegExp('^['+s.source+'\\s]+$');
      var has = new RegExp('['+s.source+']');
      s.names.each(function(name) {
        defineProperty(String.prototype, 'is' + name, function() { return is.test(this.trim()); });
        defineProperty(String.prototype, 'has' + name, function() { return has.test(this); });
      });
    });
  }

  var convertCharacterWidth = function(str, args, reg, table) {
    var mode = Array.prototype.slice.call(args).join('');
    mode = mode.replace(/all/, '').replace(/(\w)lphabet|umbers?|atakana|paces?|unctuation/g, '$1');
    return str.replace(reg, function(c) {
      if(table[c] && (!mode || mode.has(table[c]['type']))) {
        return table[c]['to'];
      } else {
        return c;
      }
    });
  }

  var widthConversionRanges = [
    { type: 'a', shift: 65248, start: 65,  end: 90  },
    { type: 'a', shift: 65248, start: 97,  end: 122 },
    { type: 'n', shift: 65248, start: 48,  end: 57  },
    { type: 'p', shift: 65248, start: 33,  end: 47  },
    { type: 'p', shift: 65248, start: 58,  end: 64  },
    { type: 'p', shift: 65248, start: 91,  end: 96  },
    { type: 'p', shift: 65248, start: 123, end: 126 }
  ];

  var ZenkakuTable = {};
  var HankakuTable = {};
  var allHankaku   = /[\u0020-\u00A5]|[\uFF61-\uFF9F][ﾞﾟ]?/g;
  var allZenkaku   = /[\u3000-\u301C]|[\u301A-\u30FC]|[\uFF01-\uFF60]|[\uFFE0-\uFFE6]/g;
  var hankakuPunctuation  = '｡､｢｣¥¢£';
  var zenkakuPunctuation  = '。、「」￥￠￡';
  var voicedKatakana      = /[カキクケコサシスセソタチツテトハヒフヘホ]/;
  var semiVoicedKatakana  = /[ハヒフヘホヲ]/;
  var hankakuKatakana     = 'ｱｲｳｴｵｧｨｩｪｫｶｷｸｹｺｻｼｽｾｿﾀﾁﾂｯﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔｬﾕｭﾖｮﾗﾘﾙﾚﾛﾜｦﾝｰ･';
  var zenkakuKatakana     = 'アイウエオァィゥェォカキクケコサシスセソタチツッテトナニヌネノハヒフヘホマミムメモヤャユュヨョラリルレロワヲンー・';


  var buildWidthConversionTables = function() {
    var hankaku;
    widthConversionRanges.each(function(r) {
      r.start.upto(r.end, function(n) {
        setWidthConversion(r.type, n.chr(), (n + r.shift).chr());
      });
    });
    zenkakuKatakana.each(function(c, i) {
      hankaku = hankakuKatakana.charAt(i);
      setWidthConversion('k', hankaku, c);
      if(voicedKatakana.test(c)) {
        setWidthConversion('k', hankaku + 'ﾞ', c.shift(1));
      }
      if(semiVoicedKatakana.test(c)) {
        setWidthConversion('k', hankaku + 'ﾟ', c.shift(2));
      }
    });
    zenkakuPunctuation.each(function(c, i) {
      setWidthConversion('p', hankakuPunctuation.charAt(i), c);
    });
    setWidthConversion('k', 'ｳﾞ', 'ヴ');
    setWidthConversion('k', 'ｦﾞ', 'ヺ');
    setWidthConversion('s', ' ', '　');
  }

  var setWidthConversion = function(type, half, full) {
    ZenkakuTable[half] = { type: type, to: full };
    HankakuTable[full] = { type: type, to: half };
  };

  var padString = function(str, p, left, right) {
    var padding = String(p);
    if(padding != p) {
      padding = '';
    }
    if(!Object.isNumber(left))  left = 1;
    if(!Object.isNumber(right)) right = 1;
    return padding.repeat(left) + str + padding.repeat(right);
  };

  // Match patched to support non-participating capturing groups.
  var NPCGMatch = function(str, reg) {
    if(!str || !str.match) return null;
    var match = str.match(reg);
    if(match && !RegExp.NPCGSupport && !reg.global) {
      for(var i = 1; i < match.length; i++) {
        if(match[i] === '') match[i] = undefined;
      }
    }
    return match;
  };

  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  var buildBtoA = function() {
    if(typeof btoa !== 'undefined') return;
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

  var buildAtoB = function() {
    if(typeof atob !== 'undefined') return;
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
        output = output + chr1.chr();
        if (enc3 != 64) {
          output = output + chr2.chr();
        }
        if (enc4 != 64) {
          output = output + chr3.chr();
        }
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);
      return unescape(output);
    }
  }



  var buildTrim = function() {
    var support = /^\s+$/.test(trimmableCharacters);
    try { String.prototype.trim.call([1]); } catch(e) { support = false; }
    var trimL = new RegExp('^['+trimmableCharacters+']+');
    var trimR = new RegExp('['+trimmableCharacters+']+$');
    extend(String, true, !support, {

      /***
       * @method trim()
       * @returns String
       * @short Removes leading and trailing whitespace from the string.
       * @extra Whitespace is defined as line breaks, tabs, and any character in the "Space, Separator" Unicode category, conforming to the the ES5 spec. This method is only added when not fully supported natively.
       * @example
       *
       *   '   wasabi   '.trim()   -> 'wasabi'
       *   "   wasabi  \n ".trim() -> 'wasabi'
       *
       ***/
      'trim': function() {
        return this.toString().trimLeft().trimRight();
      },

      /***
       * @method trimLeft()
       * @returns String
       * @short Removes leading whitespace from the string.
       * @extra Whitespace is defined as line breaks, tabs, and any character in the "Space, Separator" Unicode category, conforming to the the ES5 spec.
       * @example
       *
       *   '   wasabi   '.trimLeft()   -> 'wasabi   '
       *   " \n  wasabi   ".trimLeft() -> 'wasabi   '
       *
       ***/
      'trimLeft': function() {
        return this.replace(trimL, '');
      },

      /***
       * @method trimRight()
       * @returns String
       * @short Removes trailing whitespace from the string.
       * @extra Whitespace is defined as line breaks, tabs, and any character in the "Space, Separator" Unicode category, conforming to the the ES5 spec.
       * @example
       *
       *   '   wasabi   '.trimRight()   -> '   wasabi'
       *   "   wasabi  \n ".trimRight() -> '   wasabi'
       *
       ***/
      'trimRight': function() {
        return this.replace(trimR, '');
      }
    });
  }

  var buildString = function() {
    buildWidthConversionTables();
    buildUnicodeScripts();
    buildBtoA();
    buildAtoB();
    buildTrim();
  }



  extend(String, true, false, {

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
      * @method escapeHTML()
      * @returns String
      * @short Converts HTML characters to their entity equivalents.
      * @example
      *
      *   '<p>some text</p>'.escapeHTML() -> '&lt;p&gt;some text&lt;/p&gt;'
      *   'one & two'.escapeHTML()        -> 'one &amp; two'
      *
      ***/
    'escapeHTML': function(param) {
      return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

     /***
      * @method unescapeHTML([partial] = false)
      * @returns String
      * @short Restores escaped HTML characters.
      * @example
      *
      *   '&lt;p&gt;some text&lt;/p&gt;'.unescapeHTML() -> '<p>some text</p>'
      *   'one &amp; two'.unescapeHTML()                -> 'one & two'
      *
      ***/
    'unescapeHTML': function(param) {
      return this.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
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
      var reg = all ? /\b[a-z]/g : /^[a-z]/;
      return this.toLowerCase().replace(reg, function(letter) {
        return letter.toUpperCase();
      });
    },

    /***
     * @method pad(<padding> = '', [num] = 1)
     * @returns String
     * @short Pads both sides of the string.
     * @extra [num] is the number of characters on each side, and [padding] is the character to pad with.
     * @example
     *
     *   'wasabi'.pad('-')                -> '-wasabi-'
     *   'wasabi'.pad('-', 2)             -> '--wasabi--'
     *   'wasabi'.pad(' ', 2).pad('-', 3) -> '---  wasabi  ---'
     *
     ***/
    'pad': function(padding, num) {
      return padString(this, padding, num, num);
    },

    /***
     * @method padLeft(<padding> = '', [num] = 1)
     * @returns String
     * @short Pads the left side of the string.
     * @extra [num] is the number of characters, and [padding] is the character to pad with.
     * @example
     *
     *   'wasabi'.padLeft('-')    -> '-wasabi'
     *   'wasabi'.padLeft('-', 2) -> '--wasabi'
     *
     ***/
    'padLeft': function(padding, num) {
      return padString(this, padding, num, 0);
    },

    /***
     * @method padRight(<padding> = '', [num] = 1)
     * @returns String
     * @short Pads the right side of the string.
     * @extra [num] is the number of characters, and [padding] is the character to pad with.
     * @example
     *
     *   'wasabi'.padRight('-')    -> 'wasabi-'
     *   'wasabi'.padRight('-', 2) -> 'wasabi--'
     *
     ***/
    'padRight': function(padding, num) {
      return padString(this, padding, 0, num);
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
      if(!Object.isNumber(num) || num < 1) {
        return '';
      }
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
     * @method shift(<n>)
     * @returns Array
     * @short Shifts each character in the string <n> places in the character map.
     * @example
     *
     *   'a'.shift(1)  -> 'b'
     *   'ク'.shift(1) -> 'グ'
     *
     ***/
    'shift': function(n) {
      var result = '';
      n = n || 0;
      this.codes(function(c) {
        result += (c + n).chr();
      });
      return result;
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
      return this.split('').add(str, index).join('');
    },

    /***
     * @method remove(<f>)
     * @returns String
     * @short Removes any part of the string that matches <f>.
     * @extra <f> can be a string or a regex.
     * @example
     *
     *   'schfifty five'.remove('f')     -> 'schity ive'
     *   'schfifty five'.remove(/[a-f]/) -> 'shity iv'
     *
     ***/
    'remove': function(f) {
      return this.replace(f, '');
    },

    /***
     * @method hankaku([mode] = 'all')
     * @returns String
     * @short Converts full-width characters (zenkaku) to half-width (hankaku).
     * @extra [mode] accepts any combination of "a" (alphabet), "n" (numbers), "k" (katakana), "s" (spaces), "p" (punctuation), or "all".
     * @example
     *
     *   'タロウ　ＹＡＭＡＤＡです！'.hankaku()                      -> 'ﾀﾛｳ YAMADAです!'
     *   'タロウ　ＹＡＭＡＤＡです！'.hankaku('a')                   -> 'タロウ　YAMADAです！'
     *   'タロウ　ＹＡＭＡＤＡです！'.hankaku('alphabet')            -> 'タロウ　YAMADAです！'
     *   'タロウです！　２５歳です！'.hankaku('katakana', 'numbers') -> 'ﾀﾛｳです！　25歳です！'
     *   'タロウです！　２５歳です！'.hankaku('k', 'n')              -> 'ﾀﾛｳです！　25歳です！'
     *   'タロウです！　２５歳です！'.hankaku('kn')                  -> 'ﾀﾛｳです！　25歳です！'
     *   'タロウです！　２５歳です！'.hankaku('sp')                  -> 'タロウです! ２５歳です!'
     *
     ***/
    'hankaku': function() {
      return convertCharacterWidth(this, arguments, allZenkaku, HankakuTable);
    },

    /***
     * @method zenkaku([mode] = 'all')
     * @returns String
     * @short Converts half-width characters (hankaku) to full-width (zenkaku).
     * @extra [mode] accepts any combination of "a" (alphabet), "n" (numbers), "k" (katakana), "s" (spaces), "p" (punctuation), or "all".
     * @example
     *
     *   'ﾀﾛｳ YAMADAです!'.zenkaku()                         -> 'タロウ　ＹＡＭＡＤＡです！'
     *   'ﾀﾛｳ YAMADAです!'.zenkaku('a')                      -> 'ﾀﾛｳ ＹＡＭＡＤＡです!'
     *   'ﾀﾛｳ YAMADAです!'.zenkaku('alphabet')               -> 'ﾀﾛｳ ＹＡＭＡＤＡです!'
     *   'ﾀﾛｳです! 25歳です!'.zenkaku('katakana', 'numbers') -> 'タロウです! ２５歳です!'
     *   'ﾀﾛｳです! 25歳です!'.zenkaku('k', 'n')              -> 'タロウです! ２５歳です!'
     *   'ﾀﾛｳです! 25歳です!'.zenkaku('kn')                  -> 'タロウです! ２５歳です!'
     *   'ﾀﾛｳです! 25歳です!'.zenkaku('sp')                  -> 'ﾀﾛｳです！　25歳です！'
     *
     ***/
    'zenkaku': function() {
      return convertCharacterWidth(this, arguments, allHankaku, ZenkakuTable);
    },

    /***
     * @method hiragana([all] = true)
     * @returns String
     * @short Converts katakana into hiragana.
     * @extra If [all] is false, only full-width katakana will be converted.
     * @example
     *
     *   'カタカナ'.hiragana()   -> 'かたかな'
     *   'コンニチハ'.hiragana() -> 'こんにちは'
     *   'ｶﾀｶﾅ'.hiragana()       -> 'かたかな'
     *   'ｶﾀｶﾅ'.hiragana(false)  -> 'ｶﾀｶﾅ'
     *
     ***/
    'hiragana': function(all) {
      var str = this;
      if(all !== false) {
        str = str.zenkaku('k');
      }
      return str.replace(/[\u30A1-\u30F6]/g, function(c) {
        return c.shift(-96);
      });
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
      return this.replace(/[\u3041-\u3096]/g, function(c) {
        return c.shift(96);
      });
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
      return getAtIndexes(this, arguments, true);
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
     * @method toDate([code])
     * @returns Date
     * @short Creates a date from the string.
     * @extra Accepts a wide range of input. [code] allows you to specify a locale code. See @date_format for more information.
     * @example
     *
     *   'January 25, 2015'.toDate() -> same as Date.create('January 25, 2015')
     *   'yesterday'.toDate()        -> same as Date.create('yesterday')
     *   'next Monday'.toDate()      -> same as Date.create('next Monday')
     *
     ***/
    'toDate': function(code) {
      return createDate([this.toString(), code]);
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
      return this.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]/g, '-').toLowerCase();
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
      return this.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[-\s]/g, '_').toLowerCase();
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
      var str = this, args = arguments.length > 0 ? arguments : [''];
      multiArgs(args, function(tag) {
        str = str.replace(new RegExp('<\/?' + tag.escapeRegExp() + '[^<>]*>', 'gi'), '');
      });
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
      var str = this, args = arguments.length > 0 ? arguments : ['\\S+'];
      multiArgs(args, function(t) {
        var r = new RegExp('<(' + t + ')[^<>]*(?:\\/>|>.*?<\\/\\1>)', 'gi');
        str = str.replace(r, '');
      });
      return str;
    },

    /***
     * @method truncate(<length>, [append] = '...', [split] = false)
     * @returns Object
     * @short Truncates a string.
     * @extra Unless [split] is true, %truncate% will not split words up, and instead discard the word where the truncation occurred.
     * @example
     *
     *   'just sittin on the dock of the bay'.truncate(20)                -> 'just sittin on the...'
     *   'just sittin on the dock of the bay'.truncate(20, '...', true)   -> 'just sittin on the do...'
     *   'just sittin on the dock of the bay'.truncate(20, ' >>>', false) -> 'just sittin on the >>>'
     *
     ***/
    'truncate': function(length, append, split) {
      var reg, a;
      append = (append === undefined) ? '...' : String(append);
      length -= append.length;
      if(this.length <= length) return this.toString();
      a = /^(.)\1+$/.test(append) ? append.slice(0,1) : '';
      reg = new RegExp('[^' + trimmableCharacters + a + '][' + trimmableCharacters + a + ']');
      while(length > 0 && !reg.test(this.slice(length - 1, length + 1)) && split !== true) {
        length--;
      }
      return this.slice(0, length) + (length > 0 ? append : '');
    },

    /***
     * @method assign(TODO)
     * @returns String
     * @short TODO
     * @extra TODO
     * @example
     *
     *   'just sittin on the dock of the bay'.truncate(20)                -> 'just sittin on the...'
     *   'just sittin on the dock of the bay'.truncate(20, '...', true)   -> 'just sittin on the do...'
     *   'just sittin on the dock of the bay'.truncate(20, ' >>>', false) -> 'just sittin on the >>>'
     *
     ***/
    'assign': function() {
      var assign = Object.extended();
      multiArgs(arguments, function(a, i) {
        if(Object.isObject(a)) {
          assign.merge(a);
        } else {
          assign[i+1] = a;
        }
      });
      return this.replace(/\{(.+?)\}/g, function(m, key) {
        return assign[key];
      });
    }

  });


  extend(String, true, function(s) { return !Object.isRegExp(s); }, {

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

  extend(String, true, false, {

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
   * Note: The Date module depends on a number of Sugar methods. It can be used on its own, but you will
   * have to keep the following dependencies in addition to this module. The Array Module's polyfill methods can be
   * skipped if you don't care about < IE8 or if you are using another library that provides them. Finally, you
   * must keep "buildDate" in the initialization script at the very bottom of the file.
   *
   *
   *  ### Global private methods (at the top of the file)
   *
   *  - extend
   *  - wrapNative
   *  - defineProperty
   *  - iterateOverObject
   *
   *  ### Object private methods
   *
   *  - instance
   *  - typeMethods
   *  - buildTypeMethods
   *
   *  ### Number instance methods
   *
   *  - ordinalize
   *  - pad
   *
   *  ### String private methods
   *
   *  - padstring
   *  - NPCGMatch
   *
   *  ### String instance methods
   *
   *  - capitalize
   *  - first
   *  - from
   *  - repeat
   *  - to
   *
   *  ### Array instance methods (polyfill)
   *
   *  - indexOf
   *  - map
   *
   ***/

  var timeArray = ['hour','minute','second','millisecond','meridian','utc','offset_sign','offset_hours','offset_minutes']
  var timeReg = '(\\d{1,2}):?(\\d{2})?:?(\\d{2})?(?:\\.(\\d{1,6}))?(am|pm)?(?:(Z)|(?:([+-])(\\d{2})(?::?(\\d{2}))?)?)?';
  var optionalTime = '\\s*(?:(?:t|at |\\s+)' + timeReg + ')?';
  var dateInputFormats = [];

  var StaticInputFormats = [
    // @date_format 2010
    { src: '(\\d{4})', to: ['year'] },
    // @date_format 2010-05
    // @date_format 2010.05
    // @date_format 2010/05
    // @date_format 2010-05-25 (ISO8601)
    // @date_format 2010-05-25T12:30:40.299Z (ISO8601)
    // @date_format 2010-05-25T12:30:40.299+01:00 (ISO8601)
    // @date_format 2010.05.25
    // @date_format 2010/05/25
    { src: '([+-])?(\\d{4})[-.]?({month})[-.]?(\\d{1,2})?', to: ['year_sign','year','month','date'] },
    // @date_format 05-25
    // @date_format 05/25
    // @date_format 05.25
    // @date_format 05-25-2010
    // @date_format 05/25/2010
    // @date_format 05.25.2010
    { src: '(\\d{1,2})[-.\\/]({month})[-.\\/]?(\\d{2,4})?', to: ['month','date','year'], variant: true }
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
      token: 'dow|weekday',
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
      token: 'mon(th)?',
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
      multiplier: function(d, ms) {
        var days = 30.4375, inMonth;
        if(d) {
          inMonth = d.daysInMonth();
          if(ms <= inMonth.days()) {
            days = inMonth;
          }
        }
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




  // Date Localization

  var currentLocale;
  var Localizations = {};

  var getLocalization = function(code) {
    return Localizations[code] || Localizations[currentLocale];
  };

  var CommonFormats = [
    '{num}{unit}{sign}',
    '{year}年{month?}月?{date?}日?',
    '{month}月{date?}日?',
    '{date}日'
  ];

  var CommonLocales = {


    'en': '4;January,February,March,April,May,June,July,August,September,October,November,December;Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday;millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s;one,two,three,four,five,six,seven,eight,nine,ten;a,an,the;the,st|nd|rd|th,of;,yesterday,today,tomorrow;,ago|before,,from now|after|from;,last,the|this,next;last day,end,,first day|beginning; {num} {unit} {sign},{num} {unit4} {sign} {day},{weekday?} {month} {date}{2} {year?} {time?},{date} {month} {year},{month} {year},{shift?} {weekday} {time?},{shift} week {weekday?} {time?},{shift} {unit=5-7},{1} {edge} of {shift?} {unit=4-7?}{month?}{year?},{weekday} {3} {shift} week,{1} {date}{2} of {month},{1}{month?} {date?}{2} of {shift} {unit=6-7},{day} at {time?},{time} {day}',


    'ja': '3;;日曜日,月曜日,火曜日,水曜日,木曜日,金曜日,土曜日;ミリ秒,秒,分,時間,日,週間|週,ヶ月|ヵ月|月,年;一,二,三,四,五,六,七,八,九,十;;;一昨日,昨日,今日,明日,明後日;,前,,後;,去|先,,来;;{shift}{unit=5-7}{weekday?}',
    /*
    'ja': {
      numbersAreOrdinal: true,
      monthSuffix: '月',
      weekdays: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
      units: ['ミリ秒','秒','分','時間','日','週間|週','ヶ月|ヵ月|月','年'],
      numbers: ['一','二','三','四','五','六','七','八','九','十'],
      modifiers: [
        { name: 'day', text: '一昨日', value: -2 },
        { name: 'day', text: '昨日', value: -1 },
        { name: 'day', text: '今日', value: 0 },
        { name: 'day', text: '明日', value: 1 },
        { name: 'day', text: '明後日', value: 2 },
        { name: 'sign', text: '前', value: -1 },
        { name: 'sign', text: '後', value:  1 },
        { name: 'shift', text: '去|先', value: -1 },
        { name: 'shift', text: '来', value:  1 }
      ],
      formats: [
        '{num}{unit}{sign}',
        '{year}年{month?}月?{date?}日?',
        '{month}月{date?}日?',
        '{shift}{unit=5-7}{weekday?}',
        '{date}日'
      ]
    },


        '{num}{unit}{sign}',
        '星期{weekday}',
        '{shift}{unit=5-7}',
        '{shift}{unit=5}{weekday}',
        '{year}年{month?}月?{date?}日?',
        '{month}月{date?}日?',
        '{date}日'

        */






    /*
    'en': {
      hasPlural: true,
      months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      units: ['millisecond:|s','second:|s','minute:|s','hour:|s','day:|s','week:|s','month:|s','year:|s'],
      numbers: ['one','two','three','four','five','six','seven','eight','nine','ten'],
      optionals: ['the','st|nd|rd|th','of'],
      modifiers: [
        { name: 'day', text: 'yesterday', value: -1 },
        { name: 'day', text: 'today', value: 0 },
        { name: 'day', text: 'tomorrow', value: 1 },
        { name: 'sign', text: 'ago|before', value: -1 },
        { name: 'sign', text: 'from now|after|from', value: 1 },
        { name: 'edge', text: 'last day', value: -2 },
        { name: 'edge', text: 'end', value: -1 },
        { name: 'edge', text: 'first day|beginning', value: 1 },
        { name: 'shift', text: 'last', value: -1 },
        { name: 'shift', text: 'the|this', value: 0 },
        { name: 'shift', text: 'next', value: 1 }
      ],
      articles: ['a','an','the'],
      formats: [
        '{num} {unit} {sign}',
        '{num} {unit4} {sign} {day}',
        '{weekday?} {month} {date}{2} {year?} {time?}',
        '{date} {month} {year}',
        '{month} {year}',
        '{shift?} {weekday} {time?}',
        '{shift} week {weekday?} {time?}',
        '{shift} {unit=5-7}',
        '{1} {edge} of {shift?} {unit=4-7?}{month?}{year?}',
        '{weekday} {3} {shift} week',
        '{1} {date}{2} of {month}',
        '{1}{month?} {date?}{2} of {shift} {unit=6-7}',
        '{day} at {time?}',
        '{time} {day}'
      ]
    },
    'es': {
      hasPlural: true,
      futureRelativeFormat: 1,
      months: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
      weekdays: ['domingo','lunes','martes','miércoles|miercoles','jueves','viernes','sábado|sabado'],
      units: ['milisegundo:|s','segundo:|s','minuto:|s','hora:|s','día|días|dia|dias','semana:|s','mes:|es','año|años|ano|anos'],
      numbers: ['uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez'],
      optionals: ['el','de'],
      modifiers: [
        { name: 'day', text: 'anteayer', value: -2 },
        { name: 'day', text: 'ayer', value: -1 },
        { name: 'day', text: 'hoy', value: 0 },
        { name: 'day', text: 'mañana|manana', value: 1 },
        { name: 'sign', text: 'hace', value: -1 },
        { name: 'sign', text: 'de ahora', value: 1 },
        { name: 'shift', text: 'pasad:o|a', value: -1 },
        { name: 'shift', text: 'próximo|próxima|proximo|proxima', value: 1 }
      ],
      formats: [
        '{sign} {num} {unit}',
        '{num} {unit} {sign}',
        '{date?} {2} {month} {2} {year?}',
        '{1} {unit=5-7} {shift}',
        '{1} {shift} {unit=5-7}'
      ]
    },
    'pt': {
      hasPlural: true,
      futureRelativeFormat: 1,
      months: ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],
      weekdays: ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado|sabado'],
      units: ['milisegundo:|s','segundo:|s','minuto:|s','hora:|s','dia:|s','semana:|s','mês|mêses|mes|meses','ano:|s'],
      numbers: ['um','dois','três|tres','quatro','cinco','seis','sete','oito','nove','dez','uma','duas'],
      optionals: ['a','de'],
      modifiers: [
        { name: 'day', text: 'anteontem', value: -2 },
        { name: 'day', text: 'ontem', value: -1 },
        { name: 'day', text: 'hoje', value: 0 },
        { name: 'day', text: 'amanh:ã|a', value: 1 },
        { name: 'sign', text: 'atrás|atras|há|ha', value: -1 },
        { name: 'sign', text: 'daqui a', value: 1 },
        { name: 'shift', text: 'passad:o|a', value: -1 },
        { name: 'shift', text: 'próximo|próxima|proximo|proxima', value: 1 }
      ],
      formats: [
        '{num} {unit} {sign}',
        '{sign} {num} {unit}',
        '{date?} {2} {month} {2} {year?}',
        '{1} {unit=5-7} {shift}',
        '{1} {shift} {unit=5-7}'
      ]
    },
    'fr': {
      hasPlural: true,
      months: ['janvier','février|fevrier','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre'],
      weekdays: ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],
      units: ['milliseconde:|s','seconde:|s','minute:|s','heure:|s','jour:|s','semaine:|s','mois','an:|s|née|nee'],
      numbers: ['un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','une'],
      optionals: ["l'|la|le"],
      modifiers: [
        { name: 'day', text: 'hier', value: -1 },
        { name: 'day', text: "aujourd'hui", value: 0 },
        { name: 'day', text: 'demain', value: 1 },
        { name: 'sign', text: 'il y a', value: -1 },
        { name: 'sign', text: "dans|d'ici", value: 1 },
        { name: 'shift', text: 'derni:er|ère|ere', value: -1 },
        { name: 'shift', text: 'prochain:|e', value: 1 }
      ],
      formats: [
        '{sign} {num} {unit}',
        '{1} {date?} {month} {year?}',
        '{1} {unit=5-7} {shift}'
      ]
    },
    'de': {
      hasPlural: true,
      capitalizeUnit: true,
      futureRelativeFormat: 1,
      months: ['Januar','Februar','März|Marz','April','Mai','Juni','Juli','August','September','November','Dezember'],
      weekdays: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
      units: ['Millisekunde:|n','Sekunde:|n','Minute:|n','Stunde:|n','Tag:|en','Woche:|n','Monat:|en','Jahr:|en'],
      numbers: ['eine:|r|m','zwei','drei','vier','fuenf','sechs','sieben','acht','neun','zehn'],
      optionals: ['der'],
      modifiers: [
        { name: 'day', text: 'vorgestern', value: -2 },
        { name: 'day', text: 'gestern', value: -1 },
        { name: 'day', text: 'heute', value: 0 },
        { name: 'day', text: 'morgen', value: 1 },
        { name: 'day', text: 'übermorgen|ubermorgen', value: 2 },
        { name: 'sign', text: 'vor', value: -1 },
        { name: 'sign', text: 'in', value: 1 },
        { name: 'shift', text: 'letzte:|r|n|s', value: -1 },
        { name: 'shift', text: 'nächste|nächster|nächsten|nachste|nachster|nachsten', value: 1 }
      ],
      formats: [
        '{num} {unit} {sign}',
        '{sign} {num} {unit}',
        '{weekday?} {date?} {month} {year?}',
        '{shift} {unit=5-7}'
      ]
    },
    'it': {
      hasPlural: true,
      months: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
      weekdays: ['Domenica','Luned:ì|i','Marted:ì|i','Mercoled:ì|i','Gioved:ì|i','Venerd:ì|i','Sabato'],
      units: ['millisecond:o|i','second:o|i','minut:o|i','or:a|e','giorn:o|i','settiman:a|e','mes:e|i','ann:o|i'],
      numbers: ['un:|a|o','due','tre','quattro','cinque','sei','sette','otto','nove','dieci'],
      optionals: ["l'|la|il"],
      modifiers: [
        { name: 'day', text: 'ieri', value: -1 },
        { name: 'day', text: 'oggi', value: 0 },
        { name: 'day', text: 'domani', value: 1 },
        { name: 'day', text: 'dopodomani', value: 2 },
        { name: 'sign', text: 'fa', value: -1 },
        { name: 'sign', text: 'da adesso', value: 1 },
        { name: 'shift', text: 'scors:o|a', value: -1 },
        { name: 'shift', text: 'prossim:o|a', value: 1 }
      ],
      formats: [
        '{num} {unit} {sign}',
        '{weekday?} {date?} {month} {year?}',
        '{1} {unit=5-7} {shift}',
        '{1} {shift} {unit=5-7}'
      ]
    },
    'ru': {
      futureRelativeFormat: 1,
      months: ['Январ:я|ь','Феврал:я|ь','Март:а|','Апрел:я|ь','Ма:я|й','Июн:я|ь','Июл:я|ь','Август:а|','Сентябр:я|ь','Октябр:я|ь','Ноябр:я|ь','Декабр:я|ь'],
      weekdays: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
      units: ['миллисекунд:а|у|ы|','секунд:а|у|ы|','минут:а|у|ы|','час:||а|ов','день|день|дня|дней','недел:я|ю|и|ь|е','месяц:||а|ев|е','год|год|года|лет|году'],
      numbers: ['од:ин|ну','дв:а|е','три','четыре','пять','шесть','семь','восемь','девять','десять'],
      optionals: ['в|на'],
      modifiers: [
        { name: 'day', text: 'позавчера', value: -2 },
        { name: 'day', text: 'вчера', value: -1 },
        { name: 'day', text: 'сегодня', value: 0 },
        { name: 'day', text: 'завтра', value: 1 },
        { name: 'day', text: 'послезавтра', value: 2 },
        { name: 'sign', text: 'назад', value: -1 },
        { name: 'sign', text: 'через', value: 1 },
        { name: 'shift', text: 'прошло:й|м', value: -1 },
        { name: 'shift', text: 'следующе:й|м', value: 1 }
      ],
      formats: [
        '{num} {unit} {sign}',
        '{sign} {num} {unit}',
        '{date} {month} {year?}',
        '{month} {year}',
        '{1} {shift} {unit=5-7}'
      ]
    },
    'ja': {
      numbersAreOrdinal: true,
      monthSuffix: '月',
      weekdays: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
      units: ['ミリ秒','秒','分','時間','日','週間|週','ヶ月|ヵ月|月','年'],
      numbers: ['一','二','三','四','五','六','七','八','九','十'],
      modifiers: [
        { name: 'day', text: '一昨日', value: -2 },
        { name: 'day', text: '昨日', value: -1 },
        { name: 'day', text: '今日', value: 0 },
        { name: 'day', text: '明日', value: 1 },
        { name: 'day', text: '明後日', value: 2 },
        { name: 'sign', text: '前', value: -1 },
        { name: 'sign', text: '後', value:  1 },
        { name: 'shift', text: '去|先', value: -1 },
        { name: 'shift', text: '来', value:  1 }
      ],
      formats: [
        '{num}{unit}{sign}',
        '{year}年{month?}月?{date?}日?',
        '{month}月{date?}日?',
        '{shift}{unit=5-7}{weekday?}',
        '{date}日'
      ]
    },
    'zh-CN': {
      numbersAreOrdinal: true,
      monthSuffix: '月',
      weekdays: ['日','一','二','三','四','五','六'],
      units: ['毫秒','秒钟','分钟','小时','天','个星期|周','个月','年'],
      numbers: ['一','二','三','四','五','六','七','八','九','十'],
      modifiers: [
        { name: 'day', text: '前天', value: -2 },
        { name: 'day', text: '昨天', value: -1 },
        { name: 'day', text: '今天', value: 0 },
        { name: 'day', text: '明天', value: 1 },
        { name: 'day', text: '后天', value: 2 },
        { name: 'sign', text: '前', value: -1 },
        { name: 'sign', text: '后', value:  1 },
        { name: 'shift', text: '上|去', value: -1 },
        { name: 'shift', text: '这', value:  0 },
        { name: 'shift', text: '下|明', value:  1 }
      ],
      formats: [
        '{num}{unit}{sign}',
        '星期{weekday}',
        '{shift}{unit=5-7}',
        '{shift}{unit=5}{weekday}',
        '{year}年{month?}月?{date?}日?',
        '{month}月{date?}日?',
        '{date}日'
      ]
    },
    'zh-TW': {
      numbersAreOrdinal: true,
      monthSuffix: '月',
      weekdays: ['日','一','二','三','四','五','六'],
      units: ['毫秒','秒鐘','分鐘','小時','天','個星期|週','個月','年'],
      numbers: ['一','二','三','四','五','六','七','八','九','十'],
      modifiers: [
        { name: 'day', text: '前天', value: -2 },
        { name: 'day', text: '昨天', value: -1 },
        { name: 'day', text: '今天', value: 0 },
        { name: 'day', text: '明天', value: 1 },
        { name: 'day', text: '後天', value: 2 },
        { name: 'sign', text: '前', value: -1 },
        { name: 'sign', text: '後', value: 1 },
        { name: 'shift', text: '上|去', value: -1 },
        { name: 'shift', text: '這', value:  0 },
        { name: 'shift', text: '下|明', value:  1 }
      ],
      formats: [
        '{num}{unit}{sign}',
        '星期{weekday}',
        '{shift}{unit=5-7}',
        '{shift}{unit=5}{weekday}',
        '{year}年{month?}月?{date?}日?',
        '{month}月{date?}日?',
        '{date}日'
      ]
    },
    'ko': {
      numbersAreOrdinal: true,
      monthSuffix: '월',
      weekdays: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
      units: ['밀리초','초','분','시간','일','주','개월|달','년'],
      numbers: ['일|한','이','삼','사','오','육','칠','팔','구','십'],
      modifiers: [
        { name: 'day', text: '그저께', value: -2 },
        { name: 'day', text: '어제', value: -1 },
        { name: 'day', text: '오늘', value: 0 },
        { name: 'day', text: '내일', value: 1 },
        { name: 'day', text: '모레', value: 2 },
        { name: 'sign', text: '전', value: -1 },
        { name: 'sign', text: '후', value:  1 },
        { name: 'shift', text: '지난|작', value: -1 },
        { name: 'shift', text: '이번', value: 0 },
        { name: 'shift', text: '다음|내', value: 1 }
      ],
      formats: [
        '{num}{unit} {sign}',
        '{shift} {unit=5-7}',
        '{shift} {unit=5?} {weekday}',
        '{year}년{month?}월?{date?}일?',
        '{month}월{date?}일?',
        '{date}일'
      ]
    }
    */
  };

  var setLocaleFormats = function(code) {
    if(!code || !Object.isString(code)) code = 'en';
    var set = initializeLocale(code);
    if(set.formatsAdded) return;
    var addFormat = function(src, to) {
      dateInputFormats.unshift({
        reg: new RegExp('^' + src + '$', 'i'),
        lang: code,
        to: to
      });
    }
    addFormat('(' + set.months.join('|') + ')', ['month']);
    addFormat('(' + set.weekdays.join('|') + ')', ['weekday']);
    addFormat('(' + set.modifiers.filter(function(m){ return m.name === 'day'; }).map('text').join('|') + ')', ['day']);
    arrayEach(set.formats, function(src) {
      var to = [];
      src = src.replace(/\s+/g, '[-,. ]*');
      src = src.replace(/\{(.+?)\}/g, function(all, k) {
        var opt = k.match(/\?$/), slice = k.match(/(\d)(?:-(\d))?/), nc = k.match(/^\d+$/), key = k.replace(/[^a-z]+$/, ''), value, len;
        if(key === 'time') {
          to = to.concat(timeArray);
          return opt ? optionalTime : timeReg;
        }
        if(nc) {
          value = set.optionals[nc[0] - 1];
        } else if(set[key]) {
          value = set[key];
        } else if(set[key + 's']) {
          value = set[key + 's'];
          if(slice) {
            len = value === set.units ? 8 : value.length;
            value = value.filter(function(m,i){
              var mod = i % len;
              return mod >= slice[1] && mod <= (slice[2] || slice[1]);
            });
          }
          value = value.compact().join('|');
        }
        if(nc) {
          return '(?:' + value + ')?';
        } else {
          if(key === 'yyyy') key = 'year';
          to.push(key);
          return '(' + value + ')' + (opt ? '?' : '');
        }
      });
      addFormat(src, to);
    });
    /* REMOVE ME
    dateInputFormats.each(function(dif) {
      console.info(dif.reg.source);
    });
    */
    set.formatsAdded = true;
  };

  var initializeLocale = function(code, set, current) {
    if(current) currentLocale = code;
    if(Localizations[code]) return Localizations[code];
    set = set || getLocalizationSet(code);
    if(!set) {
      throw new Error('Invalid language.');
    }

    var eachAlternate = function(n, fn) {
      n = n.replace(/(.+):(.+)$/, function(full, base, suffixes) {
        return suffixes.split('|').map(function(s) {
          return base + s;
        }).join('|');
      });
      return arrayEach(n.split('|'), fn);
    }

    var setArray = function(name, abbreviate, multiple) {
      var arr = [];
      if(!set[name]) return;
      arrayEach(set[name], function(a, i) {
        eachAlternate(a, function(b, j) {
          arr[j * multiple + i] = b.toLowerCase();
        });
      });
      if(abbreviate) arr = arr.concat(set[name].map(function(m) {
        return m.slice(0,3).toLowerCase();
      }));
      return set[name] = arr;
    }

    var getDigit = function(start, stop) {
      var str = '[0-9０-９]' + (start ? '{' + start + ',' + stop + '}' : '+');
      if(set.numbersAreOrdinal) str += '|[' + set.numbers.join('') + ']+';
      return str;
    }

    var getNum = function() {
      var arr = [getDigit()].concat(set.articles);
      if(!set.numbersAreOrdinal) arr = arr.concat(set.numbers);
      return arr.compact().join('|');
    }

    var setModifiers = function() {
      var arr = [];
      set.modifiersByName = {};
      arrayEach(set.modifiers, function(n) {
        eachAlternate(n.text, function(m) {
          set.modifiersByName[m] = n;
          arr.push({ name: n.name, text: m, value: n.value });
        });
      });
      Object.each(arr.groupBy('name'), function(name, m) {
        m = m.map('text');
        if(name === 'day') m = m.concat(set.weekdays);
        set[name] = m.join('|');
      });
      set.modifiers = arr;
    }

    setArray('months', true, 12);
    setArray('weekdays', true, 7);
    setArray('units', false, 8);
    setArray('numbers', false, 10);

    set.code = code;
    set.date = getDigit(1,2);
    set.year = getDigit(4,4);
    set.num  = getNum();

    setModifiers();

    if(set.monthSuffix) {
      set.month = getDigit(1,2);
      set.months = (1).upto(12).map(function(n) { return n + set.monthSuffix; });
    }
    Localizations[code] = new Localization(set);
    return Localizations[code];
  };

  /*
  var CommonFormats = [
    '{num}{unit}{sign}',
    '{year}年{month?}月?{date?}日?',
    '{month}月{date?}日?',
    '{date}日'
  ];
  */

  var getLocalizationSet = function(code) {
    var set = { modifiers: [], pastRelativeFormat: 0 }, pre = CommonLocales[code].split(';'), bool = pre[0];
    var fill = function(name, index) {
      var arr = pre[index].split(',');
      if(arr[0] != '') set[name] = arr;
    }
    fill('months',    1);
    fill('weekdays',  2);
    fill('units',     3);
    fill('numbers',   4);
    fill('articles',  5);
    fill('optionals', 6);
    fill('formats',   11);
    arrayEach(['day','sign','shift','edge'], function(name, i) {
      arrayEach(pre[7 + i].split(','), function(t, j) {
        if(t) set.modifiers.push({ name: name, text: t, value: j - 2 });
      });
    });
    if(bool & 1) {
      set.numbersAreOrdinal = true;
      set.monthSuffix = bool & 2 ? '月' : '월';
      set.formats = CommonFormats.slice(0,3).concat(set.formats);
    }
    set.hasPlural = bool & 3 ? 0 : 1;
    set.futureRelativeFormat = bool & 4 ? 1 : 0;
    console.info("HOHAA", set, pre[11]);
    return set;
  };

  var Localization = function(l) {
    Object.merge(this, l);
  };

  extend(Localization, true, false, {

    'getMonth': function(n) {
      if(Object.isNumber(n)) {
        return n - 1;
      } else {
        return arrayFind(this.months, new RegExp(n, 'i'), 0, false, true) % 12;
      }
    },

    'getWeekday': function(n) {
      if(Object.isNumber(n)) {
        return parseInt(n);
      } else {
        return arrayFind(this.weekdays, new RegExp(n, 'i'), 0, false, true) % 7;
      }
    },

    'getNumber': function(n) {
      var i;
      if(Object.isNumber(n)) {
        return n;
      } else if((i = this.numbers.indexOf(n)) !== -1) {
        return (i + 1) % 10;
      } else {
        return 1;
      }
    },

    'getNumericDate': function(n) {
      var self = this;
      return n.replace(this.numbers[9], '').each(function(d) {
        return self.getNumber(d);
      }).join('');
    },

    'getEnglishUnit': function(n) {
      var i;
      if((i = this.units.indexOf(n) % 8) !== -1) {
        return Localizations['en']['units'][i % 8];
      }
    },

    'relativeFormat': function(num, u, dir) {
      var format, sign, unit, last, mult;
      format = this.formats[dir > 0 ? this.futureRelativeFormat : this.pastRelativeFormat].replace(/\{\d+\}/g, '');
      if(this.code == 'ru') {
        last = num.toString().slice(-1);
        switch(true) {
          case last == 1: mult = 1; break;
          case last >= 2 && last <= 4: mult = 2; break;
          default: mult = 3;
        }
      } else {
        mult = this.hasPlural && num > 1 ? 1 : 0;
      }
      unit = this.units[mult * 8 + u] || this.units[u];
      if(this.capitalizeUnit) unit = unit.capitalize();
      sign = arrayFind(this.modifiers, function(m) { return m.name == 'sign' && m.value == dir; });
      return format.assign({ num: num, unit: unit, sign: sign.text });
    }

  });

  var collectDateArguments = function(args) {
    var obj, arr, value;
    if(typeof args[0] === 'object') {
      return args;
    } else if (args.length == 1 && Object.isNumber(args[0])) {
      return [args[0]];
    }
    obj = {};
    arr = dateUnits.slice(0,2).concat(dateUnits.slice(3));
    arrayEach(arr, function(u,i) {
      obj[u.unit] = args[i];
    });
    return [obj];
  };

  var getFormatMatch = function(match, arr) {
    var obj = {}, value, num;
    arrayEach(arr, function(key, i) {
      value = match[i + 1];
      if(value === undefined) return;
      if(value.match(/^[０-９]+$/)) value = value.hankaku('n');
      if(key === 'year') obj.yearAsString = value;
      if(key === 'millisecond') value = value * Math.pow(10, 3 - value.length);
      num = parseFloat(value);
      obj[key] = !isNaN(num) ? num : value.toLowerCase();
    });
    return obj;
  }

  var getExtendedDate = function(f, code) {
    var d = new Date(), relative = false, format, set, loc, tmp;
    if(Object.isDate(f)) {
      d = f;
    } else if(Object.isNumber(f)) {
      d = new Date(f);
    } else if(Object.isObject(f)) {
      d = new Date().set(f, true);
      set = f;
    } else if(Object.isString(f)) {
      // Pre-initialize the localization formats.
      setLocaleFormats(code);
      f = f.trim().replace(/\.+$/,'').replace(/^now$/, '');
      arrayEach(dateInputFormats, function(dif) {
        var match = NPCGMatch(f, dif.reg);
        if(match) {
          format = dif;
          set = getFormatMatch(match, format.to);
          loc = getLocalization(format.lang);

          // If there's a European variant, swap the month and day.
          if(set.date && NPCGMatch(set.date, /^[a-z]+$/) || (Date.allowVariant && format.variant)) {
            tmp = set.month;
            set.month = set.date;
            set.date = tmp;
          }

          // If the year is 2 digits then get the implied century.
          if(set.year && set.yearAsString.length === 2) {
            set.year = getYearFromAbbreviation(set.year);
          }

          // Set the month which may be localized.
          if(set.month) {
            set.month = loc.getMonth(set.month);
            if(set.shift && !set.unit) set.unit = 'year';
          }

          // If there is both a weekday and a date, the date takes precedence.
          if(set.weekday && set.date) {
            delete set.weekday;
          // Otherwise set a localized weekday.
          } else if(set.weekday) {
            set.weekday = loc.getWeekday(set.weekday);
            if(set.shift && !set.unit) set.unit = 'week';
          }

          // Relative day localizations such as "today" and "tomorrow".
          if(set.day && (tmp = loc.modifiersByName[set.day])) {
            set.day = tmp.value;
            d.resetTime();
            relative = true;
          // If the day is a weekday, then set that instead.
          } else if(set.day && (tmp = loc.getWeekday(set.day)) > -1) {
            delete set.day;
            set.weekday = tmp;
          }

          if(set.date && !Object.isNumber(set.date) && loc.numbersAreOrdinal) {
            set.date = loc.getNumericDate(set.date);
          }

          // If the time is 1pm-11pm advance the time by 12 hours.
          if(set.meridian) {
            if(set.meridian === 'pm' && set.hour < 12) set.hour += 12;
          }

          // Adjust for timezone offset
          if(set.offset_hours || set.offset_minutes) {
            set.utc = true;
            set.offset_minutes = set.offset_minutes || 0;
            set.offset_minutes += set.offset_hours * 60;
            if(set.offset_sign === '-') {
              set.offset_minutes *= -1;
            }
            set.minute -= set.offset_minutes;
          }

          // Date has a unit like "days", "months", etc. are all relative to the current date.
          if(set.unit) {
            relative = true;
            var amt = loc.getNumber(set.num);
            var unit = loc.getEnglishUnit(set.unit);

            // Shift and unit, ie "next month", "last week", etc.
            if(set.shift && (tmp = loc.modifiersByName[set.shift])) {
              amt *= tmp.value || 0;

              // Relative month and static date: "the 15th of last month"
              if(unit === 'month' && set.date !== undefined) {
                d.set({ day: set.date }, true);
                delete set.date;
              }

              // Relative year and static month/date: "June 15th of last year"
              if(unit === 'year' && set.month !== undefined) {
                d.set({ month: set.month, day: set.date }, true);
                delete set.month;
                delete set.date;
              }
            }

            // Unit and sign, ie "months ago", "weeks from now", etc.
            if(set.sign && (tmp = loc.modifiersByName[set.sign])) {
              amt *= tmp.value;
            }

            // Units can be with non-relative dates, set here. ie "the day after monday"
            if(set.weekday !== undefined) {
              d.set({ weekday: set.weekday }, true);
              delete set.weekday;
            }
            /* Might not need me??
            if(set.month !== undefined) {
              d.set({ month: set.month }, true);
              delete set.month;
            }
            /*/

            // Finally shift the unit.
            set[unit] = (set[unit] || 0) + amt;
          }
          if(set.year_sign === '-') {
            set.year *= -1;
          }
          return false;
        }
      });
      if(!format) {
        // The Date constructor does something tricky like checking the number
        // of arguments so simply passing in undefined won't work.
        d = f ? new Date(f) : new Date();
      } else if(relative) {
        d.advance(set);
      } else if(set.utc) {
        d.setUTC(set, true);
      } else {
        d.set(set, true);
      }

      // If there is an "edge" it needs to be set after the
      // other fields are set. ie "the end of February"
      if(set && set.edge) {
        tmp = loc.modifiersByName[set.edge];
        arrayEach(dateUnits.slice(0,4).reverse(), function(u) {
          if(set[u.unit] !== undefined) unit = u.unit;
        });
        if(unit === 'year') set.specificity = 'month';
        else if(unit === 'month' || unit === 'week') set.specificity = 'day';
        d[(tmp.value < 0 ? 'endOf' : 'beginningOf') + unit.capitalize()]();
        // This value of -2 is arbitrary but it's a nice clean way to hook into this system.
        if(tmp.value === -2) d.resetTime();
      }
    }
    return {
      date: d,
      set: set,
      format: format
    }
  }

  var formatDate = function(date, f, lang) {
    var adu, loc = getLocalization(lang);
    if(!f) {
      throw new TypeError('No date format provided');
    } else if(!date.isValid()) {
      return 'Invalid Date';
    } else if(Date[f]) {
      f = Date[f];
    } else if(typeof f == 'function') {
      adu = getAdjustedDateUnit(date);
      f = f.apply(date, adu) || 'relative';
    }
    if(f == 'relative') {
      adu = adu || getAdjustedDateUnit(date);
      // Adjust up if time is in ms, as this doesn't
      // look very good for a standard relative date.
      if(adu[1] === 0) {
        adu[1] = 1;
        adu[0] = 1;
      }
      return loc.relativeFormat(adu[0],adu[1],adu[3]);
    }
    arrayEach(dateOutputFormats, function(dof) {
      if(!f) return;
      f = f.replace(new RegExp('\\{('+dof.token+')(?: (pad))?\\}', dof.caps ? '' : 'i'), function(m,t,p) {
        var value = dof.format.call(null, date, '');
        if(dof.pad && (t.length === 2 || p === 'pad')) {
          value = value.pad(dof.pad);
        }
        if(dof.weekdays) {
          var l = t.toLowerCase();
          value = loc.weekdays[value];
          if(l === 'dow') value = value.slice(0,3);
          if(t.first().toUpperCase() === t.first()) value = value.capitalize();
        }
        if(dof.months) {
          var l = t.toLowerCase();
          value = loc.months[value];
          if(l === 'mon') value = value.slice(0,3);
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
  };

  var compareDate = function(d, find, buffer) {
    var p = getExtendedDate(find), accuracy = 0;
    buffer = buffer > 0 ? buffer : 0;
    if(!p.date.isValid()) return false;
    if(p.set && p.set.specificity) {
      arrayEach(dateUnits, function(u) {
        if(u.unit === p.set.specificity) {
          accuracy = u.multiplier(p.date, d - p.date) - 1;
        }
      });
      if(p.set.edge || p.set.shift) {
        p.date['beginningOf' + p.set.specificity.capitalize()]();
      }
    }
    var t   = d.getTime();
    var min = p.date.getTime();
    var max = min + accuracy;
    return t >= (min - buffer) && t < (max + buffer + 1);
  }

  var updateDate = function(date, params, reset, utc, advance) {
    if(Object.isNumber(params) && advance) {
      // If param is a number and we're advancing, the number is presumed to be milliseconds.
      params = { milliseconds: params };
    } else if(Object.isNumber(params)) {
      // Otherwise just set the timestamp and return.
      date.setTime(params);
      return date;
    }
    // .date can also be passed for the day
    if(params.date) params.day = params.date;
    // If a weekday is included in the params, set it ahead of time and set the params
    // to reflect the updated date so that resetting works properly.
    if(!advance && params.day === undefined && params.weekday !== undefined) {
      callDateMethod(date, 'set', utc, 'Weekday', params.weekday)
      params.day = callDateMethod(date, 'get', utc, 'Date');
      delete params.weekday;
    }
    // Reset any unit lower than the least specific unit set. Do not do this for weeks
    // or for years. This needs to be performed before the acutal setting of the date
    // because the order needs to be reversed in order to get the lowest specificity.
    // The order of the date setting is also fixed because higher order units can be
    // overwritten by lower order units, such as setting hour: 3, minute: 345, etc.
    // Also we need to actually SET the date here (rather than just adding to the params)
    // for the sake of the edge case of setting a month on a date whose date does not
    // exist in the target month. For example, setting month: 1 (February) on a date
    // that is already January 31st will effectively make the month March, as this day
    // does not exist in February. Any date that is resetting (especially date creation)
    // wants to avoid this situation, so set all the defaults ahead.
    arrayEach(dateUnits.clone().reverse(), function(u) {
      if(params[u.unit] !== undefined || params[u.unit + 's'] !== undefined) {
        params.specificity = u.unit;
        return false;
      } else if(reset && u.unit !== 'week' && u.unit !== 'year') {
        callDateMethod(date, 'set', utc, u.method, (u.unit === 'day') ? 1 : 0);
      }
    });
    // If the we're advancing the date by months then we don't want to accidentally
    // traverse into a new month just because the target month doesn't have enough
    // days. In other words, "5 months ago" from July 30th is still February, even
    // though there is no February 30th, so it will of necessity be February 28th
    // (or 29th in the case of a leap year). This is just what you'll have to expect
    // when dealing with a unit as ambiguous as months.
    if(advance && params.month !== undefined) {
      checkMonthTraversal(date, params, advance);
    }
    // Now actually set or advance the date in order, higher units first.
    arrayEach(dateUnits, function(u,i) {
      var unit   = u.unit;
      var method = u.method;
      var value = params[unit] !== undefined ? params[unit] : params[unit + 's'];
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
    return date;
  }

  var callDateMethod = function(d, g, utc, method, value) {
    return d[g + (utc ? 'UTC' : '') + method](value);
  }

  // If the year is two digits, add the most appropriate century prefix.
  var getYearFromAbbreviation = function(year) {
    return Math.round(new Date().getFullYear() / 100) * 100 - Math.round(year / 100) * 100 + year;
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
    var next, ago = d.millisecondsAgo(), ms = Math.abs(ago), value = ms, dir = (ago >= 0 ? -1 : 1), unit = 0;
    arrayEach(dateUnits.concat().reverse().slice(1), function(u, i) {
      next = Math.floor((ms / u.multiplier()).round(1));
      if(next >= 1) {
        value = next;
        unit = i + 1;
      }
    });
    return [value, unit, ms, dir];
  }

  var checkMonthTraversal = function(d, set, advance) {
    var targetDate = d.getDate(), daysInTargetMonth;
    // Don't compensate if there is more specificity than just "months", as this could have unintended consequences.
    if(targetDate < 29 || (set.specificity != 'month' && set.specificity != 'year')) return;
    daysInTargetMonth = new Date(d.getFullYear() + ((set.year * advance) || 0), d.getMonth() + (set.month * advance)).daysInMonth();
    if(daysInTargetMonth < targetDate) {
      d.setDate(daysInTargetMonth);
    }
  }

  var createDate = function(args) {
    var f;
    if(Object.isNumber(args[1])) {
      // If the second argument is a number, then we have an enumerated constructor type as in "new Date(2003, 2, 12);"
      f = collectDateArguments(args)[0];
    } else {
      f = args[0];
    }
    return getExtendedDate(f, args[1]).date;
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
   * @extra %month% is provided as an alias. Note that "a month" is ambiguous as a unit of time. When no specific month can be infered (as in this method), the value 30.4375 is used, which is the average number of days in a month.
   * @example
   *
   *   (5).months() -> 13149000000
   *   (1).month()  -> 2629800000
   *
   ***
   * @method monthsBefore([d])
   * @returns Date
   * @short Returns a date <n> months before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %monthsAgo% is provided as an alias. Also accepts %monthBefore% and %monthAgo%. Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Don't use this method if you need precision.
   * @example
   *
   *   (5).monthsBefore('July') -> "February"
   *   (5).monthsAgo()          -> "5 months ago"
   *
   ***
   * @method monthsAfter([d])
   * @returns Date
   * @short Returns a date <n> months after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %monthsFromNow% is provided as an alias. Also accepts %monthAfter% and %monthFromNow%. Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Don't use this method if you need precision.
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
    var base   = function() { return Math.round(this * multiplier); }
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
   * @extra Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Don't use this method if you need precision.
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
    arrayEach(dateUnits, function(u, i) {
      var unit = u.unit;
      var caps = unit.capitalize();
      var multiplier = u.multiplier();
      defineProperty(Date.prototype, unit+'sSince', function(f) {
        return Math.round((this.getTime() - Date.create(f).getTime()) / multiplier);
      });
      defineProperty(Date.prototype, unit+'sUntil', function(f) {
        return Math.round((Date.create(f).getTime() - this.getTime()) / multiplier);
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
        defineProperty(Date.prototype, 'beginningOf'+caps, function() {
          var set = {};
          switch(unit) {
            case 'year':  set.year = this.getFullYear(); break;
            case 'month': set.month = this.getMonth(); break;
            case 'day':   set.day = this.getDate(); break;
            case 'week':  set.weekday = 0; break;
          }
          return this.set(set, true);
        });
        defineProperty(Date.prototype, 'endOf'+caps, function() {
          var set = { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 };
          switch(unit) {
            case 'year':  set.month = 11; set.day = 31; break;
            case 'month': set.day = this.daysInMonth(); break;
            case 'week':  set.weekday = 6; break;
          }
          return this.set(set, true);
        });
      }
    });
  }

  var buildDateInputFormats = function() {
    var monthReg = '\\d{1,2}|' + Localizations['en'].months.join('|');
    arrayEach(StaticInputFormats, function(f) {
      f.src = f.src.replace(/\{month\}/, monthReg);
      f.reg = new RegExp('^' + f.src + optionalTime + '$', 'i');
      f.to = f.to.concat(timeArray);
      dateInputFormats.push(f);
    });
    dateInputFormats.push({ reg: new RegExp('^' + timeReg + '$', 'i'), to: timeArray });
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
    var weekdays = Localizations['en'].weekdays.slice(0,7);
    var months = Localizations['en'].months.slice(0,12);
    arrayEach(['today','yesterday','tomorrow','weekday','weekend','future','past'].concat(weekdays).concat(months), function(s) {
      defineProperty(Date.prototype, 'is'+ s.capitalize(), function() {
        return this.is(s);
      });
    });
  }

  var checkISOString = function() {
    var d = new Date(1999, 11, 31), support = d.toISOString && d.ISOString === '1999-12-31T00:00:00.000Z';
    extend(Date, true, !support, {

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
        return formatDate(this.toUTC(), Date.ISO8601_DATETIME);
      }

    });
    extend(Date, true, false, {
       /***
       * @method iso()
       * @alias toISOString
       *
       ***/
      'iso':    Date.prototype.toISOString
    });
  }

  var checkToJSON = function() {
    var d = new Date(1999, 11, 31), support = d.toJSON && d.toJSON === '1999-12-31T00:00:00.000Z';
    extend(Date, true, !support, {

       /***
       * @method toJSON()
       * @returns String
       * @short Returns a JSON representation of the date.
       * @extra This is effectively an alias for %toISOString%. Will always return the date in UTC time. Implemented for browsers that do not support it.
       * @example
       *
       *   Date.create().toJSON() -> ex. 2011-07-05 12:24:55.528Z
       *
       ***/
      'toJSON': Date.prototype.toISOString

    });
  };

  var setDateProperties = function() {
    Date.DSTOffset = (new Date(2000, 6, 1).getTimezoneOffset() - new Date(2000, 0, 1).getTimezoneOffset()) * 60 * 1000;
    Date.INTERNATIONAL_TIME = '{h}:{mm}:{ss}';
    Date.RFC1123 = '{Dow}, {dd} {Mon} {yyyy} {hh}:{mm}:{ss} GMT{tz}';
    Date.RFC1036 = '{Weekday}, {dd}-{Mon}-{yy} {hh}:{mm}:{ss} GMT{tz}';
    Date.ISO8601_DATE = '{yyyy}-{MM}-{dd}';
    Date.ISO8601_DATETIME = '{yyyy}-{MM}-{dd}T{hh}:{mm}:{ss}.{ms}{isotz}';
    Date.ISO8601 = Date.ISO8601_DATETIME;
  };


  var buildDate = function() {
    initializeLocale('en', null, true);
    buildDateMethods();
    buildDateInputFormats();
    buildRelativeAliases();
    checkISOString();
    checkToJSON();
    setDateProperties();
  }

  extend(Date, false, false, {

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
    'create': function() {
      return createDate(arguments);
    },

     /***
     * @method now()
     * @returns String
     * @short Returns the number of milliseconds since January 1st, 1970 00:00:00 (UTC time).
     * @example
     *
     *   Date.now() -> ex. 1311938296231
     *
     ***/
    'now': function() {
      return new Date().getTime();
    },

     /***
     * @method setLocale(<code>, [set])
     * @returns String
     * @short Sets the locale to be used with dates.
     * @extra Predefined locales are: English (en), French (fr), Italian (it), Spanish (es), Portuguese (pt), German (de), Russian (ru), Japanese (ja), Korean (ko), Simplified Chinese (zh-CN), and Traditional Chinese (zh-TW). In addition to available major locales, you can define a new local here by passing an object for [set]. For more see @date_format.
     * @example
     *
     *   Date.setLocale('en')
     *
     ***/
    'setLocale': function(code, set) {
      initializeLocale(code, set, true);
      setLocaleFormats(code);
    }

  });

  extend(Date, true, false, {

     /***
     * @method set(<set>, [reset] = false)
     * @returns Date
     * @short Sets the date object.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). If [reset] is %true%, any units more specific than those passed will be reset.
     * @example
     *
     *   new Date().set({ year: 2011, month: 11, day: 31 }) -> December 31, 2011
     *   new Date().set(2011, 11, 31)                       -> December 31, 2011
     *   new Date().set(86400000)                           -> 1 day after Jan 1, 1970
     *   new Date().set({ year: 2004, month: 6 }, true)     -> June 1, 2004, 00:00:00.000
     *
     ***/
    'set': function() {
      var args = collectDateArguments(arguments);
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
      var args = collectDateArguments(arguments);
      return updateDate(this, args[0], args[1], true)
    },

     /***
     * @method setWeekday()
     * @returns Nothing
     * @short Sets the weekday of the date.
     * @example
     *
     *   d = new Date(); d.setWeekday(1); d; -> Monday of this week
     *   d = new Date(); d.setWeekday(6); d; -> Saturday of this week
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
     *   d = new Date(); d.setUTCWeekday(1); d; -> Monday of this week
     *   d = new Date(); d.setUTCWeekday(6); d; -> Saturday of this week
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
     *   d = new Date(); d.setWeek(15); d; -> 15th week of the year
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
     *   d = new Date(); d.setUTCWeek(15); d; -> 15th week of the year
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
     * @short Converts the date to UTC time, effectively subtracting the timezone offset.
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
      var args = collectDateArguments(arguments);
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
      var args = collectDateArguments(arguments);
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
      return this.getTime() > Date.create(d).getTime() - (margin || 0);
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
      return this.getTime() < Date.create(d).getTime() + (margin || 0);
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
    'isBetween': function(d1, d2, margin) {
      var t  = this.getTime();
      var t1 = Date.create(d1).getTime();
      var t2 = Date.create(d2).getTime();
      var lo = Math.min(t1, t2);
      var hi = Math.max(t1, t2);
      margin = margin || 0;
      return (lo - margin < t) && (hi + margin > t);
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
     *   Date.create().format(Date.RFC1123)                       -> ex. Tue, 05 Jul 2011 04:04:22 GMT+0900
     *   Date.create().format(Date.ISO8601)                       -> ex. 2011-07-05 12:24:55.528Z
     *   Date.create('beginning of this week').format('relative') -> ex. 3 days ago
     *   Date.create('yesterday').format(function(value,unit,ms,dir) {
     *     // value = 1, unit = 'day', ms = 86400000, dir = -1
     *   });                                                      -> ex. 1 day ago
     *
     ***/
    'format': function(f, lang) {
      return formatDate(this, f, lang);
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
    'relative': function(fn, lang) {
      return formatDate(this, fn || 'relative', lang);
    },

     /***
     * @method is(<d>, [buffer])
     * @returns Boolean
     * @short Returns true if the date is <d>.
     * @extra <d> will accept a date object, timestamp, or text format. %is% additionally understands more generalized expressions like month/weekday names, 'today', etc, and compares to the precision implied in <d>. [buffer] allows an extra buffer of error in milliseconds.  For more information, see @date_format.
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
    'is': function(d, buffer) {
      var tmp;
      if(Object.isString(d)) {
        d = d.trim().toLowerCase();
        switch(true) {
          case d === 'future':  return this.getTime() > new Date().getTime();
          case d === 'past':    return this.getTime() < new Date().getTime();
          case d === 'weekday': return this.getDay() > 0 && this.getDay() < 6;
          case d === 'weekend': return this.getDay() === 0 || this.getDay() === 6;
          case (tmp = Localizations['en']['weekdays'].indexOf(d) % 7) > -1: return this.getDay() === tmp;
          case (tmp = Localizations['en']['months'].indexOf(d) % 12) > -1:  return this.getMonth() === tmp;
        }
      }
      return compareDate(this, d, buffer);
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
    }

  });


  // Instance aliases
  extend(Date, true, false, {

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
    'getUTCWeekday':    Date.prototype.getUTCDay

  });






  /***
   * RegExp module
   *
   ***/

  RegExp.NPCGSupport = /()??/.exec('')[1] === undefined; // NPCG: nonparticipating capturing group


  extend(RegExp, false, false, {

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

  extend(RegExp, true, false, {

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

  var setDelay = function(fn, wait, after) {
    if(!fn.timers) fn.timers = [];
    fn.timers.push(setTimeout(after, wait));
  };

  var buildBind = function() {
    var support = false;
    if(Function.prototype.bind) {
      var F = function() {};
      var B = F.bind();
      support = (new B instanceof B) && !(new F instanceof B);
    }
    extend(Function, true, !support, {

       /***
       * @method bind(<scope>, [arg1], [arg2], ...)
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
        var fn = this, args = Array.prototype.slice.call(arguments, 1), nop, bound;
        if(!Object.isFunction(this)) {
          throw new TypeError('Function.prototype.bind called on a non-function');
        }
        bound = function() {
          return fn.apply(fn.prototype && this instanceof fn ? this : scope, args.concat(Array.prototype.slice.call(arguments)));
        }
        nop = function() {};
        nop.prototype = this.prototype;
        bound.prototype = new nop();
        return bound;
      }

    });
  };

  var buildFunction = function() {
    buildBind();
  };


  extend(Function, true, false, {

     /***
     * @method lazy([wait] = 1)
     * @returns Function
     * @short Creates lazy functions for non-blocking operations.
     * @extra This method will wrap the function inside another that when executed will wait until the CPU is free. When executed repeatedly in a loop, each iteration of a lazy function will execute [wait] milliseconds after the last (aka. "function throttling"). By passing in a smaller value for [wait] (can be a decimal < 1), you can "tighen up" the execution time so that the iterations happen faster. By passing in a larger value for [wait], you can space the function execution out to prevent thread blocking. Playing with this number is the easiest way to strike a balance for heavier operations. Lazy functions can be canceled during execution using the %cancel% method.
     * @example
     *
     *   (function() {
     *     // Executes 1ms later
     *   }).lazy()();
     *   [1,2,3].each(function() {
     *     // Executes 3 times, each 1ms later than the other.
     *   }.lazy());
     *   [1,2,3].each(function() {
     *     // Executes 3 times, each 20ms later than the other.
     *   }.lazy(20));
     *
     ***/
    'lazy': function(wait) {
      var fn = this;
      if(wait === undefined) wait = 0;
      var run = 0;
      var lazy = function() {
        var scope = this, args = arguments;
        setDelay(lazy, Math.round(++run * wait), function() {
          return fn.apply(scope, args);
        });
      }
      return lazy;
    },

     /***
     * @method delay([wait] = 1, [arg1], ...)
     * @returns Function
     * @short Executes the function after <wait> milliseconds.
     * @extra Returns a reference to itself. %delay% is also a way to execute non-blocking operations that will wait until the CPU is free. Delayed functions can be canceled using the %cancel% method. Can also curry arguments passed in after <wait>.
     * @example
     *
     *   (function(arg1) {
     *     // called 1s later
     *   }).delay(1000, 'arg1');
     *
     ***/
    'delay': function(wait) {
      var fn = this;
      if(!Object.isNumber(wait)) wait = 0;
      var args = Array.prototype.slice.call(arguments, 1);
      setDelay(fn, wait, function() {
        return fn.apply(fn, args);
      });
      return fn;
    },

     /***
     * @method debounce(<wait>)
     * @returns Function
     * @short "Smooths out" functions by calling them only once after <wait> ms have elapsed.
     * @extra This method is useful when you want execution to happen when things have "settled down". A good example of this is when a user tabs quickly through form fields, and execution should happen after a few milliseconds after they have "settled" on a field.
     * @example
     *
     *   var f = (function(arg1) {
     *     // called once 50ms later
     *   }).debounce(50); f() f() f();
     *
     ***/
    'debounce': function(wait) {
      var fn = this;
      return function() {
        var scope = this, args = arguments;
        fn.cancel();
        setDelay(fn, wait, function() {
          fn.apply(scope, args);
        });
      };
    },

     /***
     * @method cancel()
     * @returns Function
     * @short Cancels a delayed function scheduled to be run.
     * @extra %delay%, %lazy%, and %debounce% can all set delays. Note that this method won't work when using certain other frameworks like Prototype, as they will retain their %delay% method.
     * @example
     *
     *   (function() {
     *     alert('hay'); // Never called
     *   }).delay(500).cancel();
     *
     ***/
    'cancel': function() {
      if(Object.isArray(this.timers)) {
        arrayEach(this.timers, clearTimeout);
        this.timers = [];
      }
      return this;
    },

     /***
     * @method after([num])
     * @returns Function
     * @short Creates a function that will execute after [num] calls.
     * @extra %after% is useful for running a final callback after a series of asynchronous operations, when the order in which the operations will complete is unknown.
     * @example
     *
     *   var f = (function() {
     *     // Will be executed once only
     *   }).after(3); f(); f(); f();
     *
     ***/
    'after': function(num) {
      var fn = this, counter = 0;
      if(!Object.isNumber(num)) num = 1;
      return function() {
        counter++;
        if(counter == num) {
          counter = 0;
          return fn.apply(this, arguments);
        }
      };
    },

     /***
     * @method once()
     * @returns Function
     * @short Creates a function that will execute only once and store the result.
     * @extra %once% is useful for creating functions that will cache the result of an expensive operation and use it on subsequent calls. Also it can be useful for creating initialization functions that only need to be run once.
     * @example
     *
     *   var f = (function() {
     *     // Will be executed once only
     *   }).once(); f(); f(); f();
     *
     ***/
    'once': function(num) {
      var fn = this;
      return function() {
        return fn.hasOwnProperty('memo') ? fn.memo : fn.memo = fn.apply(this, arguments);
      };
    }

  });



  // Initializer
  function initialize() {
    buildObject();
    buildString();
    buildDate();
    buildFunction();
  }

  initialize();



})();

