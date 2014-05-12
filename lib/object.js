
  'use strict';

  /***
   * @package Object
   * @dependency core
   * @description Object manipulation, type checking (isNumber, isString, ...), extended objects with hash-like methods available as instance methods.
   *
   * Much thanks to kangax for his informative aricle about how problems with instanceof and constructor
   * http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
   *
   ***/

  var ObjectTypeMethods = 'isObject,isNaN'.split(',');
  var ObjectHashMethods = 'equals,keys,values,select,reject,each,map,size,merge,clone,watch,tap,has,toQueryString'.split(',');

  function setParamsObject(obj, param, value, castBoolean) {
    var reg = /^(.+?)(\[.*\])$/, paramIsArray, match, allKeys, key;
    if(match = param.match(reg)) {
      key = match[1];
      allKeys = match[2].replace(/^\[|\]$/g, '').split('][');
      allKeys.forEach(function(k) {
        paramIsArray = !k || k.match(/^\d+$/);
        if(!key && isArray(obj)) key = obj.length;
        if(!hasOwnProperty(obj, key)) {
          obj[key] = paramIsArray ? [] : {};
        }
        obj = obj[key];
        key = k;
      });
      if(!key && paramIsArray) key = obj.length.toString();
      setParamsObject(obj, key, value, castBoolean);
    } else if(castBoolean && value === 'true') {
      obj[param] = true;
    } else if(castBoolean && value === 'false') {
      obj[param] = false;
    } else {
      obj[param] = value;
    }
  }

  function objectToQueryString(base, obj) {
    var tmp;
    // If a custom toString exists bail here and use that instead
    if(isArray(obj) || (isObjectType(obj) && obj.toString === internalToString)) {
      tmp = [];
      iterateOverObject(obj, function(key, value) {
        if(base) {
          key = base + '[' + key + ']';
        }
        tmp.push(objectToQueryString(key, value));
      });
      return tmp.join('&');
    } else {
      if(!base) return '';
      return sanitizeURIComponent(base) + '=' + (isDate(obj) ? obj.getTime() : sanitizeURIComponent(obj));
    }
  }

  function sanitizeURIComponent(obj) {
    // undefined, null, and NaN are represented as a blank string,
    // while false and 0 are stringified. "+" is allowed in query string
    return !obj && obj !== false && obj !== 0 ? '' : encodeURIComponent(obj).replace(/%20/g, '+');
  }

  function matchInObject(match, key, value) {
    if(isRegExp(match)) {
      return match.test(key);
    } else if(isObjectType(match)) {
      return match[key] === value;
    } else {
      return key === string(match);
    }
  }

  function selectFromObject(obj, args, select) {
    var match, result = obj instanceof Hash ? new Hash : {};
    iterateOverObject(obj, function(key, value) {
      match = false;
      flattenedArgs(args, function(arg) {
        if(matchInObject(arg, key, value)) {
          match = true;
        }
      }, 1);
      if(match === select) {
        result[key] = value;
      }
    });
    return result;
  }

  // Object merging

  var getOwnPropertyNames      = object.getOwnPropertyNames;
  var defineProperty           = propertyDescriptorSupport ? object.defineProperty : definePropertyShim;
  var getOwnPropertyDescriptor = propertyDescriptorSupport ? object.getOwnPropertyDescriptor : getOwnPropertyDescriptorShim;
  var iterateOverProperties    = propertyDescriptorSupport ? iterateOverPropertyNames : iterateOverObject;

  function iterateOverPropertyNames(obj, fn) {
    getOwnPropertyNames(obj).forEach(fn);
  }

  function getOwnPropertyDescriptorShim(obj, prop) {
    return obj.hasOwnProperty(prop) ? { 'value': obj[prop] } : Undefined;
  }

  function definePropertyShim(obj, prop, descriptor) {
    obj[prop] = descriptor['value'];
  }

  function mergeObject(target, source, deep, resolve) {

    // Will not merge a primitive type.
    if(!isObjectType(source)) return target;

    iterateOverProperties(source, function(prop) {

      var resolved;
      var sourceDescriptor = getOwnPropertyDescriptor(source, prop);
      var targetDescriptor = getOwnPropertyDescriptor(target, prop);
      var sourceVal        = sourceDescriptor && sourceDescriptor.value;
      var targetVal        = targetDescriptor && targetDescriptor.value;
      var sourceIsObject   = isObjectType(sourceVal);
      var goingDeep        = deep && sourceIsObject;
      var conflict         = isDefined(targetDescriptor) && targetDescriptor.value != null;

      if(conflict) {
        if(!goingDeep && resolve === false) {
          return;
        } else if(isFunction(resolve)) {
          resolved = resolve.call(source, prop, targetVal, sourceVal);
          if(isDefined(resolved)) {
            // If the source returns anything except undefined, then the conflict has
            // been resovled, so don't continue traversing into the object.
            sourceDescriptor.value = resolved;
            goingDeep = false;
          }
        }
      }

      if(goingDeep) {
        sourceDescriptor.value = handleDeepMerge(targetVal, sourceVal, deep, resolve);
      }

      defineProperty(target, prop, sourceDescriptor);
    });
    return target;
  }

  function handleDeepMerge(targetVal, sourceVal, deep, resolve) {
    if(isDate(sourceVal)) {
      return new date(sourceVal.getTime());
    } else if(isRegExp(sourceVal)) {
      return new regexp(sourceVal.source, getRegExpFlags(sourceVal));
    } else {
      if(!isObjectType(targetVal)) targetVal = isArray(sourceVal) ? [] : {};
      return mergeObject(targetVal, sourceVal, deep, resolve);
    }
  }

  // Extending all

  function mapAllObject() {
    buildObjectInstanceMethods(getObjectInstanceMethods(), object);
  }

  function unmapAllObject() {
    var objProto = object.prototype, methods = getObjectInstanceMethods();
    methods.forEach(function(name) {
      if(objProto[name]) {
        delete objProto[name];
      }
    });
  }

  function getObjectInstanceMethods() {
    return ObjectTypeMethods.concat(ObjectHashMethods);
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
  function buildTypeMethods() {
    extendSimilar(object, natives, function(methods, name) {
      var method = 'is' + name;
      ObjectTypeMethods.push(method);
      methods[method] = typeChecks[name];
    }, false);
  }

  extend(object, {
      /***
       * @method watch(<obj>, <prop>, <fn>)
       * @returns Boolean
       * @short Watches a property of <obj> and runs <fn> when it is updated.
       * @extra <fn> is passed three arguments: the property <prop>, the old value, and the new value. The return value of [fn] will be set as the new value. Properties that are non-configurable or already have getters or setters cannot be watched. Return value is whether or not the watch operation succeeded. This method is useful for things such as validating or cleaning the value when it is set. Warning: this method WILL NOT work in browsers that don't support %Object.defineProperty% (IE 8 and below). This is the only method in Sugar that is not fully compatible with all browsers. %watch% is available as an instance method on extended objects.
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
      if(!propertyDescriptorSupport) return false;
      descriptor = getOwnPropertyDescriptor(obj, prop);
      if(descriptor && (!descriptor.configurable || descriptor.get || descriptor.set)) {
        return false;
      }
      value = obj[prop];
      defineProperty(obj, prop, {
        'configurable': true,
        'enumerable'  : !descriptor || descriptor.enumerable,
        'get': function() {
          return value;
        },
        'set': function(to) {
          value = fn.call(obj, prop, value, to);
        }
      });
      return true;
    },

      /***
       * @method unwatch(<obj>, <prop>)
       * @returns Nothing.
       * @short Removes a watcher previously set.
       * @extra Return value is whether or not the watch operation succeeded. %unwatch% is available as an instance method on extended objects.
       ***/
    'unwatch': function(obj, prop) {
      var descriptor;
      if(!propertyDescriptorSupport) return false;
      descriptor = getOwnPropertyDescriptor(obj, prop);
      if(!descriptor.configurable) {
        return;
      }
      defineProperty(obj, prop, {
        'configurable': true,
        'value': 3
      });
    }
  }, false, true, true);

  extend(object, {

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
      var keys = object.keys(obj);
      keys.forEach(function(key) {
        fn.call(obj, key, obj[key]);
      });
      return keys;
    }

  }, false, function() { return arguments.length > 1; });

  extend(object, {

    'isArguments': function(obj) {
      return isArgumentsObject(obj);
    },

    'isObject': function(obj) {
      return isPlainObject(obj);
    },

    'isNaN': function(obj) {
      // This is only true of NaN
      return isNumber(obj) && obj.valueOf() !== obj.valueOf();
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
      return isEqual(a, b);
    },

    /***
     * @method Object.extended(<obj> = {})
     * @returns Extended object
     * @short Creates a new object, equivalent to %new Object()% or %{}%, but with extended methods.
     * @extra See extended objects for more.
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
     * @method merge(<target>, <source>, [deep] = false, [resolve] = true)
     * @returns Merged object
     * @short Merges all the properties of <source> into <target>.
     * @extra Merges are shallow unless [deep] is %true%. Properties of <target> that are either null or undefined will be treated as if they don't exist. Properties of <source> will win in the case of conflicts, unless [resolve] is %false%. [resolve] can also be a function that resolves the conflict. In this case it will be passed 3 arguments, %key%, %targetVal%, and %sourceVal%. %merge% is available as an instance method on extended objects. For more, see @object_merging.
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
      return mergeObject(target, source, deep, resolve);
    },

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
     * @method clone(<obj> = {}, [deep] = false)
     * @returns Cloned object
     * @short Creates a clone (copy) of <obj>.
     * @extra Default is a shallow clone, unless [deep] is true. %clone% is available as an instance method on extended objects.
     * @example
     *
     *   Object.clone({foo:'bar'})            -> { foo: 'bar' }
     *   Object.clone()                       -> {}
     *   Object.extended({foo:'bar'}).clone() -> { foo: 'bar' }
     *
     ***/
    'clone': function(obj, deep) {
      var target, klass;
      if(!isObjectType(obj)) {
        return obj;
      }
      klass = className(obj);
      if(isDate(obj, klass) && sugarDate.clone) {
        // Preserve internal UTC flag when possible.
        return sugarDate.clone(obj);
      } else if(isDate(obj, klass) || isRegExp(obj, klass)) {
        return new obj.constructor(obj);
      } else if(obj instanceof Hash) {
        target = new Hash;
      } else if(isArray(obj, klass)) {
        target = [];
      } else if(isPlainObject(obj, klass)) {
        target = {};
      } else {
        throw new TypeError('Clone must be a basic data type.');
      }
      return mergeObject(target, obj, deep);
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
        if(split.length !== 2) return;
        setParamsObject(result, split[0], decodeURIComponent(split[1]), castBoolean);
      });
      return result;
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
      return objectToQueryString(namespace, obj);
    },

    /***
     * @method tap(<obj>, <fn>)
     * @returns Object
     * @short Runs <fn> and returns <obj>.
     * @extra  A string can also be used as a shortcut to a method. This method is used to run an intermediary function in the middle of method chaining. As a standalone method on the Object class it doesn't have too much use. The power of %tap% comes when using extended objects or modifying the Object prototype with Object.extend().
     * @example
     *
     *   Object.extend();
     *   [2,4,6].map(Math.exp).tap(function(arr) {
     *     arr.pop()
     *   });
     *   [2,4,6].map(Math.exp).tap('pop').map(Math.round); ->  [7,55]
     *
     ***/
    'tap': function(obj, arg) {
      var fn = arg;
      if(!isFunction(arg)) {
        fn = function() {
          if(arg) obj[arg]();
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
    'has': function (obj, key) {
      return hasOwnProperty(obj, key);
    },

    /***
     * @method select(<obj>, <find>, ...)
     * @returns Object
     * @short Builds a new object containing the values specified in <find>.
     * @extra When <find> is a string, that single key will be selected. It can also be a regex, selecting any key that matches, or an object which will effectively do an "intersect" operation on that object. Multiple selections may also be passed as an array or directly as enumerated arguments. %select% is available as an instance method on extended objects.
     * @example
     *
     *   Object.select({a:1,b:2}, 'a')        -> {a:1}
     *   Object.select({a:1,b:2}, /[a-z]/)    -> {a:1,ba:2}
     *   Object.select({a:1,b:2}, {a:1})      -> {a:1}
     *   Object.select({a:1,b:2}, 'a', 'b')   -> {a:1,b:2}
     *   Object.select({a:1,b:2}, ['a', 'b']) -> {a:1,b:2}
     *
     ***/
    'select': function (obj) {
      return selectFromObject(obj, arguments, true);
    },

    /***
     * @method reject(<obj>, <find>, ...)
     * @returns Object
     * @short Builds a new object containing all values except those specified in <find>.
     * @extra When <find> is a string, that single key will be rejected. It can also be a regex, rejecting any key that matches, or an object which will match if the key also exists in that object, effectively "subtracting" that object. Multiple selections may also be passed as an array or directly as enumerated arguments. %reject% is available as an instance method on extended objects.
     * @example
     *
     *   Object.reject({a:1,b:2}, 'a')        -> {b:2}
     *   Object.reject({a:1,b:2}, /[a-z]/)    -> {}
     *   Object.reject({a:1,b:2}, {a:1})      -> {b:2}
     *   Object.reject({a:1,b:2}, 'a', 'b')   -> {}
     *   Object.reject({a:1,b:2}, ['a', 'b']) -> {}
     *
     ***/
    'reject': function (obj) {
      return selectFromObject(obj, arguments, false);
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
        if(!hasOwnProperty(obj, key)) continue;
        value = obj[key];
        result[key] = transformArgument(value, map, obj, [key, value, obj]);
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
      checkCallback(fn);
      iterateOverObject(obj, fn);
      return obj;
    },

    /***
     * @method size(<obj>)
     * @returns Number
     * @short Returns the number of properties in <obj>.
     * @extra %size% is available as an instance method on extended objects.
     * @example
     *
     *   Object.size({ foo: 'bar' }) -> 1
     *
     ***/
    'size': function (obj) {
      return keysWithObjectCoercion(obj).length;
    }

  }, false);

  extend(Sugar, {

    'extendObject': function(on) {
      if(on !== false) {
        mapAllObject();
      } else {
        unmapAllObject();
      }
      return true;
    }

  }, false);


  buildTypeMethods();
  buildObjectInstanceMethods(ObjectHashMethods, Hash);
