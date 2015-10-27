
  'use strict';

  /***
   * @package Object
   * @dependency core
   * @description Object manipulation, type checking (isNumber, isString, ...), %extended objects% with hash-like methods available as instance methods.
   *
   * Much thanks to kangax for his informative aricle about how problems with instanceof and constructor
   * http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
   *
   ***/

  var HASH_METHODS = [
    'keys',
    'values',
    'merge',
    'clone',
    'isEqual',
    'has',
    'tap',
    'map',
    'each',
    'size',
    'select',
    'reject',
    'toQueryString'
  ];

  var DONT_ENUM_PROPS = [
    'valueOf',
    'toString',
    'constructor',
    'isPrototypeOf',
    'hasOwnProperty',
    'toLocaleString',
    'propertyIsEnumerable'
  ];

  var HAS_DONT_ENUM_BUG = hasDontEnumBug();

  function hasDontEnumBug() {
    for (var prop in { toString: true }) {
      return false;
    }
    return true;
  }

  // Matches bracket-style query strings like user[name]
  var DEEP_QUERY_STRING_REG = /^(.+?)(\[.*\])$/;

  // Matches any character not allowed in a decimal number.
  var NON_DECIMAL_REG = /[^\d.-]/;

  function parseQueryComponent(obj, key, value, deep, smart, separator, cast) {
    var match;

    if (separator) {
      key = mapSeparatorToKeys(key, separator);
      deep = true;
    }

    if (deep === true && (match = key.match(DEEP_QUERY_STRING_REG))) {
      return parseDeepQueryComponent(obj, match, value, deep, smart, separator, cast);
    }
    obj[key] = getCastValue(obj, key, value, smart, cast);
  }

  function mapSeparatorToKeys(key, separator) {
    var split = key.split(separator), result = split[0];
    for (var i = 1, len = split.length; i < len; i++) {
      result += '[' + split[i] + ']';
    }
    return result;
  }

  function getCastValue(obj, key, value, smart, cast) {
    var fnValue;
    if (cast) {
      fnValue = cast(key, value, obj);
      if (isDefined(fnValue)) {
        return fnValue;
      }
    }
    return smart ? getCastValueSmart(obj, key, value) : value;
  }

  function getCastValueSmart(obj, key, value) {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    }
    var num = +value;
    if (!isNaN(num) && stringIsDecimal(value)) {
      return num;
    }
    var existing = obj[key];
    if (value && existing) {
      return isArray(existing) ? existing.concat(value) : [existing, value];
    }
    return value ? value : null;
  }

  function stringIsDecimal(str) {
    return str !== '' && !NON_DECIMAL_REG.test(str);
  }

  function parseDeepQueryComponent(obj, match, value, deep, smart, separator, cast) {
    var key = match[1];
    var inner = match[2].slice(1,-1).split('][');
    forEach(inner, function(k) {
      if (!obj[key]) {
        obj[key] = k ? {} : [];
      }
      obj = obj[key];
      key = k ? k : obj.length.toString();
    });
    parseQueryComponent(obj, key, value, deep, smart, separator, cast);
  }

  function toQueryString(obj, deep, getValue, prefix, separator) {
    // If a custom toString exists bail and use that instead
    if (isArray(obj)) {
      return collectArrayAsQueryString(obj, deep, getValue, prefix, separator);
    } else if (isObjectType(obj) && obj.toString === internalToString) {
      return collectObjectAsQueryString(obj, deep, getValue, prefix, separator);
    } else if (prefix) {
      return getURIComponentValue(obj, prefix, getValue);
    }
    return '';
  }

  function collectArrayAsQueryString(arr, deep, getValue, prefix, separator) {
    return map(arr, function(el) {
      var key = prefix + (prefix && deep ? '[]' : '');
      if (!key && !isObjectType(el)) {
        // If there is no key, then the values of the array should be
        // considered as null keys, so use them instead;
        return sanitizeURIComponent(el);
      }
      return toQueryString(el, deep, getValue, key, separator);
    }).join('&');
  }

  function collectObjectAsQueryString(obj, deep, getValue, prefix, separator) {
    var result = [];
    iterateOverObject(obj, function(key, value) {
      var fullKey;
      if (prefix && deep) {
        fullKey = prefix + '[' + key + ']';
      } else if (prefix) {
        fullKey = prefix + separator + key;
      } else {
        fullKey = key;
      }
      result.push(toQueryString(value, deep, getValue, fullKey, separator));
    });
    return result.join('&');
  }

  function getURIComponentValue(obj, prefix, getValue) {
    var value;
    if (getValue) {
      value = getValue(obj);
    } else if (isDate(obj)) {
      value = obj.getTime();
    } else {
      value = obj;
    }
    return sanitizeURIComponent(prefix) + '=' + sanitizeURIComponent(value);
  }

  function sanitizeURIComponent(obj) {
    // undefined, null, and NaN are represented as a blank string,
    // while false and 0 are stringified.
    return !obj && obj !== false && obj !== 0 ? '' : encodeURIComponent(obj);
  }

  function matchInObject(match, key, value) {
    if (isRegExp(match)) {
      return match.test(key);
    } else if (isObjectType(match)) {
      return match[key] === value;
    } else {
      return key === String(match);
    }
  }

  function selectFromObject(obj, f, select) {
    var match, result = obj instanceof Hash ? new Hash : {};
    f = [].concat(f);
    iterateOverObject(obj, function(key, value) {
      match = false;
      for (var i = 0; i < f.length; i++) {
        if (matchInObject(f[i], key, value)) {
          match = true;
        }
      }
      if (match === select) {
        result[key] = value;
      }
    });
    return result;
  }

  // Object merging

  var getOwnPropertyNames      = Object.getOwnPropertyNames;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  function iterateOverProperties(hidden, obj, fn) {
    if (getOwnPropertyNames && hidden) {
      iterateOverPropertyNames(obj, fn);
    } else {
      iterateOverObjectSafe(obj, fn);
    }
  }

  function iterateOverPropertyNames(obj, fn) {
    var names = getOwnPropertyNames(obj), name;
    for (var i = 0, len = names.length; i < len; i++) {
      name = names[i]
      fn(name, obj[name]);
    }
  }

  // Iterate over an object with support for the
  // DontEnum bug in < IE9
  function iterateOverObjectSafe(obj, fn) {
    iterateOverObject(obj, fn);
    iterateOverDontEnumProperties(obj, fn);
  }

  function iterateOverDontEnumProperties(obj, fn) {
    if (!HAS_DONT_ENUM_BUG) return;
    forEach(DONT_ENUM_PROPS, function(key) {
      if (hasOwnProperty(obj, key)) {
        fn.call(obj, key, obj[key], obj);
      }
    });
  }

  function getKeysWithCallback(obj, fn) {
    var keys = getKeys(obj);
    if (fn) {
      forEach(keys, function(key) {
        fn.call(obj, key, obj[key]);
      });
    }
    return keys;
  }

  function mergeByPropertyDescriptor(target, source, prop, sourceVal) {
    var descriptor = getOwnPropertyDescriptor(source, prop);
    if (isDefined(descriptor.value)) {
      descriptor.value = sourceVal;
    }
    defineProperty(target, prop, descriptor);
  }

  function objectMerge(target, source, deep, resolve, hidden, descriptor) {
    var resolveByFunction = isFunction(resolve);

    // Will not merge a primitive type.
    if (isPrimitiveType(target)) {
      return target;
    }

    // If the source object is a primitive type
    // then coerce it into an object.
    if (isPrimitiveType(source)) {
      source = coercePrimitiveToObject(source);
    }

    iterateOverProperties(hidden, source, function(prop) {
      var sourceVal, targetVal, resolved, goDeep, result;

      sourceVal = source[prop];

      // We are iterating over properties of the source, so hasOwnProperty on
      // it is guaranteed to always be true. However, the target may happen to
      // have properties in its prototype chain that should not be considered
      // as conflicts.
      if (hasOwnProperty(target, prop)) {
        targetVal = target[prop];
      }

      if (resolveByFunction) {
        result = resolve(prop, targetVal, sourceVal, target, source);
        if (isDefined(result)) {
          // If the source returns anything except undefined, then the conflict has
          // been resolved, so don't continue traversing into the object.
          sourceVal = result;
          resolved = true;
        }
      } else if (isUndefined(sourceVal)) {
        return;
      }

      goDeep = !resolved && deep && isObjectType(sourceVal);

      if (!goDeep && resolve === false && isDefined(targetVal)) {
        return;
      }

      if (goDeep) {
        sourceVal = getMergedObject(targetVal, sourceVal, deep, resolve, hidden, descriptor);
      }

      if (PROPERTY_DESCRIPTOR_SUPPORT && descriptor) {
        mergeByPropertyDescriptor(target, source, prop, sourceVal);
      } else {
        target[prop] = sourceVal;
      }

    });
    return target;
  }

  function getMergedObject(target, source, deep, resolve, hidden, descriptor) {
    var klass = className(source);
    // Dates and Regexes are pre-defined classes that we know how to
    // reconstruct ahead of time, so we can do that here if necessary.
    if (resolve !== false) {
      if (isDate(source, klass)) {
        target = new Date(source.getTime());
      } else if (isRegExp(source, klass)) {
        target = RegExp(source.source, getRegExpFlags(source));
      }
    }
    if (!isObjectType(target)) {
      if (source instanceof Hash) {
        target = new Hash;
      } else if (isArray(source, klass)) {
        target = [];
      } else if (isPlainObject(source, klass)) {
        target = {};
      } else {
        // If the object is not of a known type, then simply merging its
        // properties into a plain object will result in something different
        // (it will not respond to instanceof operator etc). Similarly we don't
        // want to call a constructor here as we can't know for sure what the
        // original constructor was called with (Events etc), so throw an
        // error here instead. Non-standard types can be handled if either they
        // already exist and simply have their properties merged, if the merge
        // is not deep so their references will simply be copied over, or if a
        // resolve function is used to assist the merge.
        throw new TypeError('Must be a basic data type');
      }
    }
    return objectMerge(target, source, deep, resolve, hidden, descriptor);
  }


  // deepGetProperty defined in lib/common.js

  function deepSetProperty(obj, prop, val) {
    var ns = obj, key, split, last;
    if (prop == null) return obj;
    split = periodSplit(String(prop));
    last = split.pop();
    for (var i = 0, len = split.length; i < len; i++) {
      key = split[i];
      if (!hasOwnProperty(ns, key)) {
        ns[key] = {};
      }
      ns = ns[key];
    }
    if (isPrimitiveType(ns)) {
      // If strict mode is active then primitives will throw an
      // error when attempting to write properties. We can't be
      // sure if strict mode is available, so pre-emptively
      // throw an error here to ensure consistent behavior.
      throw new TypeError('Property cannot be written.');
    }
    ns[last] = val;
    return obj;
  }

  defineStatic(sugarObject, {

    /***
     * @method Object.get(<obj>, <prop>)
     * @returns Mixed
     * @short Gets a property of <obj>. If <prop> contains dot notation, the nested property will be returned.
     * @example
     *
     *   Object.get({a:'b'}, 'a');       -> 'b'
     *   Object.get({a:{b:'c'}}, 'a.b'); -> 'c'
     *
     ***/
    'get': function(obj, prop) {
      return deepGetProperty(obj, prop);
    },

    /***
     * @method Object.set(<obj>, <prop>, <val>)
     * @returns Object
     * @short Sets a property on <obj>. If <prop> contains dot notation, the nested property will be set.
     * @extra The original object passed will be returned.
     * @example
     *
     *   Object.set({}, 'a', 'c');   -> {a:'c'}
     *   Object.get({}, 'a.b', 'c'); -> {a:{b:'c'}}
     *
     ***/
    'set': function(obj, prop, val) {
      return deepSetProperty(obj, prop, val);
    },

    /***
     * @method Object.extended(<obj> = {})
     * @returns Extended object
     * @short Creates a new object, equivalent to %new Object()% or %{}%, but with extended methods.
     * @extra See %extended objects% for more.
     * @example
     *
     *   Object.extended()
     *   Object.extended({ happy:true, pappy:false }).keys() -> ['happy','pappy']
     *   Object.extended({ happy:true, pappy:false }).values() -> [true, false]
     *
     ***/
    'extended': function(obj) {
      return new Hash(obj);
    },

    /***
     * @method Object.fromQueryString(<str>, [options] = {})
     * @returns Object
     * @short Converts the query string of a URL into an object.
     * @extra Options can be passed with [options] for more control over the result. For more see %query strings%.
     * @example
     *
     *   Object.fromQueryString('foo=bar&broken=wear') -> { foo: 'bar', broken: 'wear' }
     *   Object.fromQueryString('foo[]=1&foo[]=2')     -> { foo: ['1','2'] }
     *
     ***/
    'fromQueryString': function(obj, options) {
      var str = String(obj || '').replace(/^.*?\?/, ''), result = {};
      options = options || {};
      if (str) {
        forEach(str.split('&'), function(p) {
          var split = p.split('=');
          var key = decodeURIComponent(split[0]);
          var val = split.length === 2 ? decodeURIComponent(split[1]) : null;
          parseQueryComponent(result, key, val, options.deep, options.smart !== false, options.separator, options.cast);
        });
      }
      return result;
    }

  });


  defineInstance(sugarObject, {

    /***
     * @method Object.isEqual(<a>, <b>)
     * @returns Boolean
     * @short Returns true if <a> and <b> are equal.
     * @extra %isEqual% in Sugar is "egal", meaning the values are equal if they are "not observably distinguishable".
     * @example
     *
     *   Object.isEqual({a:2}, {a:2}) -> true
     *   Object.isEqual({a:2}, {a:3}) -> false
     *   Object.extended({a:2}).isEqual({a:3}) -> false
     *
     ***/
    'isEqual': function(a, b) {
      return isEqual(a, b);
    },

    /***
     * @method Object.merge(<target>, <source>, [options] = {})
     * @returns Merged object
     * @short Merges properties from <source> into <target>.
     * @extra 4 options exist: %deep% performs deep merging (default is %false%), %hidden% merges non-enumerable properties (default is %false%), %descriptor% merges by property descriptor (default is %false%), and %resolve% determines which property wins in the case of a conflict (default is %true%, meaning source wins). If a function is passed for %resolve%, the return value will become the final value. Supports %extended objects%. For more, see %object_merging%.
     *
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
    'merge': function(target, source, opts) {
      opts = opts || {};
      return objectMerge(target, source, opts.deep, opts.resolve, opts.hidden, opts.descriptor);
    },

    /***
     * @method Object.clone(<obj> = {}, [deep] = false)
     * @returns Cloned object
     * @short Creates a clone (copy) of <obj>.
     * @extra Default is a shallow clone, unless [deep] is true. Supports %extended objects%.
     * @example
     *
     *   Object.clone({foo:'bar'})            -> { foo: 'bar' }
     *   Object.clone()                       -> {}
     *   Object.extended({foo:'bar'}).clone() -> { foo: 'bar' }
     *
     ***/
    'clone': function(obj, deep) {
      if (isPrimitiveType(obj)) {
        return obj;
      }
      return getMergedObject(undefined, obj, deep, true, true, true);
    },

    /***
     * @method Object.values(<obj>, [fn])
     * @returns Array
     * @short Returns an array containing the values in <obj>. Optionally calls [fn] for each value.
     * @extra Returned values are in no particular order. %values% is available as an instance method on %extended objects%.
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
        if (fn) fn.call(obj,v);
      });
      return values;
    },

    /***
     * @method Object.toQueryString(<obj>, [options] = {})
     * @returns Object
     * @short Converts the object into a query string.
     * @extra Accepts deep objects and arrays. Options can be passed with [options] for more control over the result. For more see %query strings%.
     * @example
     *
     *   Object.toQueryString({foo:'bar'})                  -> 'foo=bar'
     *   Object.toQueryString({foo:['a','b']})              -> 'foo=a&foo=b'
     *   Object.toQueryString({foo:['a','b']}, {deep:true}) -> 'foo[]=a&foo[]=b'
     *
     ***/
    'toQueryString': function(obj, options) {
      options = options || {};
      return toQueryString(obj, options.deep, options.getValue, options.prefix || '', options.separator || '_');
    },

    /***
     * @method Object.tap(<obj>, <fn>)
     * @returns Object
     * @short Runs <fn> and returns <obj>.
     * @extra  A string can also be used as a shortcut to a method. This method is used to run an intermediary function in the middle of method chaining. As a standalone method on the Object class it doesn't have too much use. The power of %tap% comes when using %extended objects% or modifying the Object prototype with %Sugar.Object.extend()%.
     * @example
     *
     *   Sugar.Object.extend();
     *   [2,4,6].map(Math.exp).tap(function(arr) {
     *     arr.pop()
     *   });
     *   [2,4,6].map(Math.exp).tap('pop').map(Math.round); ->  [7,55]
     *
     ***/
    'tap': function(obj, arg) {
      var fn = arg;
      if (!isFunction(arg)) {
        fn = function() {
          if (arg) obj[arg]();
        }
      }
      fn.call(obj, obj);
      return obj;
    },

    /***
     * @method Object.has(<obj>, <key>)
     * @returns Boolean
     * @short Checks if <obj> has <key> using hasOwnProperty from Object.prototype.
     * @extra This method is considered safer than %Object#hasOwnProperty% when using objects as hashes. See http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/ for more.
     * @example
     *
     *   Object.has({ foo: 'bar' }, 'foo') -> true
     *   Object.has({ foo: 'bar' }, 'baz') -> false
     *   Object.has({ hasOwnProperty: true }, 'foo') -> false
     *
     ***/
    'has': function(obj, key) {
      return hasOwnProperty(obj, key);
    },

    /***
     * @method Object.map(<obj>, <map>)
     * @returns Object
     * @short Maps the object to another object.
     * @extra When <map> is a function, the first argument will be the object's key and the second will be its value. The third argument will be the object itself. The resulting object values will be those which were returned from <map>.
     *
     * @example
     *
     *   Object.map({ foo: 'bar' }, function(lhs, rhs) {
     *     return 'ha';
     *   }); -> Returns { foo: 'ha' }
     *
     ***/
    'map': function(obj, map) {
      var result = {}, key, value;
      for(key in obj) {
        if (!hasOwnProperty(obj, key)) continue;
        value = obj[key];
        result[key] = mapWithShortcuts(value, map, obj, [key, value, obj]);
      }
      return result;
    },

    /***
     * @method Object.each(<obj>, <fn>)
     * @returns Object
     * @short Runs <fn> against each property in the object, passing in the key as the first argument, and the value as the second.
     * @extra If <fn> returns %false% at any time it will break out of the loop. Returns <obj>.
     * @example
     *
     *   Object.each({ foo: 'bar' }, function(k, v) {
     *     console.log('key is ', k, ' and value is ', v);
     *   });
     *
     ***/
    'each': function(obj, fn) {
      assertCallable(fn);
      iterateOverObject(obj, fn);
      return obj;
    },

    /***
     * @method Object.size(<obj>)
     * @returns Number
     * @short Returns the number of properties in <obj>.
     * @extra %size% is available as an instance method on %extended objects%.
     * @example
     *
     *   Object.size({ foo: 'bar' }) -> 1
     *
     ***/
    'size': function(obj) {
      return keysWithObjectCoercion(obj).length;
    },

    /***
     * @method Object.select(<obj>, <find>, ...)
     * @returns Object
     * @short Builds a new object containing the values specified in <find>.
     * @extra When <find> is a string, that single key will be selected. It can also be a regex, selecting any key that matches, or an object which will effectively do an "intersect" operation on that object. Multiple selections may also be passed as an array or directly as enumerated arguments. %select% is available as an instance method on %extended objects%.
     * @example
     *
     *   Object.select({a:1,b:2}, 'a')        -> {a:1}
     *   Object.select({a:1,b:2}, /[a-z]/)    -> {a:1,ba:2}
     *   Object.select({a:1,b:2}, {a:1})      -> {a:1}
     *   Object.select({a:1,b:2}, 'a', 'b')   -> {a:1,b:2}
     *   Object.select({a:1,b:2}, ['a', 'b']) -> {a:1,b:2}
     *
     ***/
    'select': function(obj, f) {
      return selectFromObject(obj, f, true);
    },

    /***
     * @method Object.reject(<obj>, <find>, ...)
     * @returns Object
     * @short Builds a new object containing all values except those specified in <find>.
     * @extra When <find> is a string, that single key will be rejected. It can also be a regex, rejecting any key that matches, or an object which will match if the key also exists in that object, effectively "subtracting" that object. Multiple selections may also be passed as an array or directly as enumerated arguments. %reject% is available as an instance method on %extended objects%.
     * @example
     *
     *   Object.reject({a:1,b:2}, 'a')        -> {b:2}
     *   Object.reject({a:1,b:2}, /[a-z]/)    -> {}
     *   Object.reject({a:1,b:2}, {a:1})      -> {b:2}
     *   Object.reject({a:1,b:2}, 'a', 'b')   -> {}
     *   Object.reject({a:1,b:2}, ['a', 'b']) -> {}
     *
     ***/
    'reject': function(obj, f) {
      return selectFromObject(obj, f, false);
    },

    'isArguments': function(obj) {
      return isArgumentsObject(obj);
    },

    'isNaN': function(obj) {
      // This is only true of NaN
      return isNumber(obj) && obj.valueOf() !== obj.valueOf();
    },

    'isObject': function(obj) {
      return isPlainObject(obj);
    }

  });


  /***
   * @method Object.is[Type](<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is an object of that type.
   * @extra %isObject% will return false on anything that is not an object literal, including instances of inherited classes. Note also that %isNaN% will ONLY return true if the object IS %NaN%. It does not mean the same as browser native %isNaN%, which returns true for anything that is "not a number".
   *
   * @set
   *   isArray
   *   isArguments
   *   isObject
   *   isBoolean
   *   isDate
   *   isFunction
   *   isNaN
   *   isNumber
   *   isString
   *   isRegExp
   *
   * @example
   *
   *   Object.isArray([1,2,3])            -> true
   *   Object.isDate(3)                   -> false
   *   Object.isRegExp(/wasabi/)          -> true
   *   Object.isObject({ broken:'wear' }) -> true
   *
   ***/
  function buildTypeCheckMethods() {
    defineInstanceSimilar(sugarObject, NATIVES, function(methods, name) {
      methods['is' + name] = typeChecks[name];
    });
  }

  function buildHashMethods() {
    forEach(HASH_METHODS, function(name) {
      setProperty(Hash.prototype, name, sugarObject[name].instance);
    });
    setProperty(Hash.prototype, 'get', wrapInstanceMethodFixed(sugarObject.get));
    setProperty(Hash.prototype, 'set', wrapInstanceMethodFixed(sugarObject.set));
  }

  function flagInstanceMethodsAsStatic() {
    iterateOverObject(sugarObject, function(name, method) {
      if (method.instance) {
        // Instance methods on Object also do double duty as static methods as well.
        setProperty(method, 'static', true);
      }
    });
  }

  function buildObjectKeys() {
    var method = function(obj) {
      // Force compiler to respect argument length.
      var argLen = arguments.length, fn = arguments[1];
      return getKeysWithCallback(obj, fn);
    }
    method.instance = function(fn) {
      return getKeysWithCallback(this, fn);
    }
    defineStatic(sugarObject, {

      /***
       * @method Object.keys(<obj>, [fn])
       * @returns Array
       * @short Returns an array containing the keys in <obj>. Optionally calls [fn] for each key.
       * @extra This method is provided for browsers that don't support it natively, and additionally is enhanced to accept the callback [fn]. Returned keys are in no particular order. %keys% is available as an instance method on %extended objects%.
       * @example
       *
       *   Object.keys({ broken: 'wear' }) -> ['broken']
       *   Object.keys({ broken: 'wear' }, function(key, value) {
       *     // Called once for each key.
       *   });
       *   Object.extended({ broken: 'wear' }).keys() -> ['broken']
       *
       ***/
      'keys': method

    });
  }


  buildObjectKeys();
  buildTypeCheckMethods();
  buildHashMethods();
  flagInstanceMethodsAsStatic();
