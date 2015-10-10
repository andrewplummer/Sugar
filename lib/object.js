
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

  function setParamsObject(obj, param, value, castBoolean) {
    var reg = /^(.+?)(\[.*\])$/, paramIsArray, match, allKeys, key;
    if (match = param.match(reg)) {
      key = match[1];
      allKeys = match[2].replace(/^\[|\]$/g, '').split('][');
      allKeys.forEach(function(k) {
        paramIsArray = !k || k.match(/^\d+$/);
        if (!key && isArray(obj)) key = obj.length;
        if (!hasOwnProperty(obj, key)) {
          obj[key] = paramIsArray ? [] : {};
        }
        obj = obj[key];
        key = k;
      });
      if (!key && paramIsArray) key = obj.length.toString();
      setParamsObject(obj, key, value, castBoolean);
    } else if (castBoolean && value === 'true') {
      obj[param] = true;
    } else if (castBoolean && value === 'false') {
      obj[param] = false;
    } else {
      obj[param] = value;
    }
  }

  function toQueryString(obj, base) {
    var tmp;
    // If a custom toString exists bail here and use that instead
    if (isArray(obj) || (isObjectType(obj) && obj.toString === internalToString)) {
      tmp = [];
      iterateOverObject(obj, function(key, value) {
        if (base) {
          key = base + '[' + key + ']';
        }
        tmp.push(toQueryString(value, key));
      });
      return tmp.join('&');
    } else {
      if (!base) return '';
      return sanitizeURIComponent(base) + '=' + (isDate(obj) ? obj.getTime() : sanitizeURIComponent(obj));
    }
  }

  function sanitizeURIComponent(obj) {
    // undefined, null, and NaN are represented as a blank string,
    // while false and 0 are stringified. "+" is allowed in query string
    return !obj && obj !== false && obj !== 0 ? '' : encodeURIComponent(obj).replace(/%20/g, '+');
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
  var defineProperty           = PROPERTY_DESCRIPTOR_SUPPORT ? Object.defineProperty : definePropertyShim;
  var getOwnPropertyDescriptor = PROPERTY_DESCRIPTOR_SUPPORT ? Object.getOwnPropertyDescriptor : getOwnPropertyDescriptorShim;
  var iterateOverProperties    = PROPERTY_DESCRIPTOR_SUPPORT ? iterateOverPropertyNames : iterateOverObject;

  function iterateOverPropertyNames(obj, fn) {
    getOwnPropertyNames(obj).forEach(fn);
  }

  function getOwnPropertyDescriptorShim(obj, prop) {
    return obj.hasOwnProperty(prop) ? { value: obj[prop] } : undefined;
  }

  function definePropertyShim(obj, prop, descriptor) {
    obj[prop] = descriptor.value;
  }

  function objectMerge(target, source, deep, resolve) {

    // Will not merge a primitive type.
    if (!isObjectType(source)) return target;

    iterateOverProperties(source, function(prop) {

      var resolved;
      var sourceDescriptor = getOwnPropertyDescriptor(source, prop);
      var targetDescriptor = getOwnPropertyDescriptor(target, prop);
      var sourceVal        = sourceDescriptor && sourceDescriptor.value;
      var targetVal        = targetDescriptor && targetDescriptor.value;
      var sourceIsObject   = isObjectType(sourceVal);
      var goingDeep        = deep && sourceIsObject;
      var conflict         = isDefined(targetDescriptor) && targetDescriptor.value != null;

      if (conflict) {
        if (!goingDeep && resolve === false) {
          return;
        } else if (isFunction(resolve)) {
          resolved = resolve.call(source, prop, targetVal, sourceVal);
          if (isDefined(resolved)) {
            // If the source returns anything except undefined, then the conflict has
            // been resovled, so don't continue traversing into the object.
            sourceDescriptor.value = resolved;
            goingDeep = false;
          }
        }
      }

      if (goingDeep) {
        sourceDescriptor.value = handleDeepMerge(targetVal, sourceVal, deep, resolve);
      }

      defineProperty(target, prop, sourceDescriptor);
    });
    return target;
  }

  function handleDeepMerge(targetVal, sourceVal, deep, resolve) {
    if (isDate(sourceVal)) {
      return new Date(sourceVal.getTime());
    } else if (isRegExp(sourceVal)) {
      return RegExp(sourceVal.source, getRegExpFlags(sourceVal));
    } else {
      if (!isObjectType(targetVal)) targetVal = isArray(sourceVal) ? [] : {};
      return objectMerge(targetVal, sourceVal, deep, resolve);
    }
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
     * @method get(<obj>, <prop>)
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
     * @method set(<obj>, <prop>, <val>)
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
     * @method Object.fromQueryString(<str>, [booleans] = false)
     * @returns Object
     * @short Converts the query string of a URL into an object.
     * @extra If [booleans] is true, then %"true"% and %"false"% will be cast into booleans. All other values, including numbers will remain their string values.
     * @example
     *
     *   Object.fromQueryString('foo=bar&broken=wear') -> { foo: 'bar', broken: 'wear' }
     *   Object.fromQueryString('foo[]=1&foo[]=2')     -> { foo: ['1','2'] }
     *   Object.fromQueryString('foo=true', true)      -> { foo: true }
     *
     ***/
    'fromQueryString': function(str, castBoolean) {
      var result = new Hash, split;
      str = str && str.toString ? str.toString() : '';
      str.replace(/^.*?\?/, '').split('&').forEach(function(p) {
        var split = p.split('=');
        if (split.length !== 2) return;
        setParamsObject(result, split[0], decodeURIComponent(split[1]), castBoolean);
      });
      return result;
    }

  });


  defineInstance(sugarObject, {

    /***
     * @method watch(<obj>, <prop>, <fn>)
     * @returns Boolean
     * @short Watches property <prop> of <obj> and runs <fn> when it changes.
     * @extra <fn> is passed three arguments: the property <prop>, the old value, and the new value. The return value of [fn] will be set as the new value. Properties that are non-configurable or already have getters or setters cannot be watched. Return value is whether or not the watch operation succeeded. This method is useful for things such as validating or cleaning the value when it is set. Warning: this method WILL NOT work in browsers that don't support %Object.defineProperty% (IE 8 and below). This is the only method in Sugar that is not fully compatible with all browsers. %watch% is available as an instance method on %extended objects%.
     * @example
     *
     *   Object.watch({ foo: 'bar' }, 'foo', function(prop, oldVal, newVal) {
     *     // Will be run when the property 'foo' is set on the object.
     *   });
     *   Object.extended().watch({ foo: 'bar' }, 'foo', function(prop, oldVal, newVal) {
     *     // Will be run when the property 'foo' is set on the object.
     *   });
     *
     ***/
    'watch': function(obj, prop, fn) {
      var value, descriptor;
      if (!PROPERTY_DESCRIPTOR_SUPPORT) return false;
      descriptor = getOwnPropertyDescriptor(obj, prop);
      if (descriptor && (!descriptor.configurable || descriptor.get || descriptor.set)) {
        return false;
      }
      value = obj[prop];
      defineProperty(obj, prop, {
        configurable: true,
        enumerable  : !descriptor || descriptor.enumerable,
        get: function() {
          return value;
        },
        set: function(to) {
          value = fn.call(obj, prop, value, to);
        }
      });
      return true;
    },

    /***
     * @method unwatch(<obj>, <prop>)
     * @returns Nothing.
     * @short Removes a watcher previously set.
     * @extra Return value is whether or not the watch operation succeeded. %unwatch% is available as an instance method on %extended objects%.
     ***/
    'unwatch': function(obj, prop) {
      var descriptor;
      if (!PROPERTY_DESCRIPTOR_SUPPORT) return false;
      descriptor = getOwnPropertyDescriptor(obj, prop);
      if (!descriptor || !descriptor.configurable || !descriptor.get || !descriptor.set) {
        return false;
      }
      defineProperty(obj, prop, {
        writable: true,
        configurable: true,
        enumerable: descriptor.enumerable,
        value: obj[prop]
      });
      return true;
    },

    /***
     * @method isEqual(<a>, <b>)
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
     * @method merge(<target>, <source>, [deep] = false, [resolve] = true)
     * @returns Merged object
     * @short Merges all the properties of <source> into <target>.
     * @extra Merges are shallow unless [deep] is %true%. Properties of <target> that are either null or undefined will be treated as if they don't exist. Properties of <source> will win in the case of conflicts, unless [resolve] is %false%. [resolve] can also be a function that resolves the conflict. In this case it will be passed 3 arguments, %key%, %targetVal%, and %sourceVal%. %merge% is available as an instance method on %extended objects%. For more, see %object_merging%.
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
      return objectMerge(target, source, deep, resolve);
    },

    /***
     * @method values(<obj>, [fn])
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
     * @method clone(<obj> = {}, [deep] = false)
     * @returns Cloned object
     * @short Creates a clone (copy) of <obj>.
     * @extra Default is a shallow clone, unless [deep] is true. %clone% is available as an instance method on %extended objects%.
     * @example
     *
     *   Object.clone({foo:'bar'})            -> { foo: 'bar' }
     *   Object.clone()                       -> {}
     *   Object.extended({foo:'bar'}).clone() -> { foo: 'bar' }
     *
     ***/
    'clone': function(obj, deep) {
      var target, klass;
      if (!isObjectType(obj)) {
        return obj;
      }
      klass = className(obj);
      if (isDate(obj, klass) && sugarDate.clone) {
        // Preserve internal UTC flag when possible.
        return sugarDate.clone(obj);
      } else if (isDate(obj, klass) || isRegExp(obj, klass)) {
        return new obj.constructor(obj);
      } else if (obj instanceof Hash) {
        target = new Hash;
      } else if (isArray(obj, klass)) {
        target = [];
      } else if (isPlainObject(obj, klass)) {
        target = {};
      } else {
        throw new TypeError('Clone must be a basic data type.');
      }
      return objectMerge(target, obj, deep);
    },

    /***
     * @method Object.toQueryString(<obj>, [namespace] = null)
     * @returns Object
     * @short Converts the object into a query string.
     * @extra Accepts deep nested objects and arrays. If [namespace] is passed, it will be prefixed to all param names.
     * @example
     *
     *   Object.toQueryString({foo:'bar'})          -> 'foo=bar'
     *   Object.toQueryString({foo:['a','b','c']})  -> 'foo[0]=a&foo[1]=b&foo[2]=c'
     *   Object.toQueryString({name:'Bob'}, 'user') -> 'user[name]=Bob'
     *
     ***/
    'toQueryString': function(obj, namespace) {
      return toQueryString(obj, namespace);
    },

    /***
     * @method tap(<obj>, <fn>)
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
     * @method has(<obj>, <key>)
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
     * @method map(<obj>, <map>)
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
     * @method each(<obj>, <fn>)
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
      checkCallable(fn);
      iterateOverObject(obj, fn);
      return obj;
    },

    /***
     * @method size(<obj>)
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
     * @method select(<obj>, <find>, ...)
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
     * @method reject(<obj>, <find>, ...)
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

  function buildObjectKeys() {
    var nativeFn = Object.keys;

    defineInstance(sugarObject, {

      /***
       * @method keys(<obj>, [fn])
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
      'keys': function(obj, fn) {
        var keys = nativeFn(obj);
        if (fn) {
          keys.forEach(function(key) {
            fn.call(obj, key, obj[key]);
          });
        }
        return keys;
      }

    });
  }

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
    iterateOverObject(sugarObject, function(name, method) {
      if (method.instance) {
        setProperty(Hash.prototype, name, method.instance);
      }
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

  buildObjectKeys();
  buildTypeCheckMethods();
  buildHashMethods();
  flagInstanceMethodsAsStatic();
