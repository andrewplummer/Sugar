/*
 *  Sugar Library edge
 *
 *  Freely distributable and licensed under the MIT-style license.
 *  Copyright (c) 2016 Andrew Plummer
 *  http://sugarjs.com/
 *
 * ---------------------------- */
(function() {
  'use strict';

  /***
   * @module Core
   * @description Core module allows custom methods to be defined on the Sugar
   *              global and extended onto natives later.
   *
   ***/

  // The global to export.
  var Sugar;

  // The name of Sugar in the global namespace.
  var SUGAR_GLOBAL = 'Sugar';

  // Natives available on initialization. Letting Object go first to ensure its
  // global is set by the time the rest are checking for chainable Object methods.
  var NATIVE_NAMES = 'Object,Number,String,Array,Date,RegExp,Function';

  // Static method flag
  var STATIC   = 0x1;

  // Instance method flag
  var INSTANCE = 0x2;

  // IE8 has a broken defineProperty but no defineProperties so this saves a try/catch.
  var PROPERTY_DESCRIPTOR_SUPPORT = !!(Object.defineProperty && Object.defineProperties);

  // The global context. Rhino uses a different "global" keyword so
  // do an extra check to be sure that it's actually the global context.
  var globalContext = typeof global !== 'undefined' && global.Object === Object ? global : this;

  // Is the environment node?
  var hasExports = typeof module !== 'undefined' && module.exports;

  // Whether object instance methods can be mapped to the prototype.
  var allowObjectPrototype = false;

  // A map from Array to SugarArray.
  var namespacesByName = {};

  // A map from [object Object] to namespace.
  var namespacesByClassName = {};

  // Defining properties.
  var defineProperty = PROPERTY_DESCRIPTOR_SUPPORT ?  Object.defineProperty : definePropertyShim;

  // A default chainable class for unknown types. The silly "SugarChainable" here
  // is simply to force GCC to respect this token on output.
  var SugarChainable, DefaultChainable = SugarChainable || getNewChainableClass('Chainable');


  // Global methods

  function setupGlobal() {
    var existingSugar = globalContext[SUGAR_GLOBAL];
    // Re-use already defined Sugar global object
    // but only if not using exports!
    if (!hasExports && existingSugar) {
      Sugar = existingSugar;
      return;
    }
    Sugar = function(arg) {
      iterateOverObject(Sugar, function(name, sugarNamespace) {
        // Although only the only enumerable properties on the global
        // object are Sugar namespaces, environments that can't set
        // non-enumerable properties will step through the utility methods
        // as well here, so use this check to only allow true namespaces.
        if (hasOwn(namespacesByName, name)) {
          sugarNamespace.extend(arg);
        }
      });
    };
    if (hasExports) {
      module.exports = Sugar;
    } else {
      try {
        globalContext[SUGAR_GLOBAL] = Sugar;
      } catch (e) {
        // Contexts such as QML have a read-only global context.
      }
    }
    iterateOverObject(NATIVE_NAMES.split(','), function(i, name) {
      createNamespace(name);
    });
    setGlobalProperties();
  }

  /***
   * @method createNamespace(<name>)
   * @returns Namespace
   * @static
   * @global
   * @short Creates a new Sugar namespace.
   * @extra This method is for plugin developers who want to define methods to be
   *        used with natives that Sugar does not handle by default. The new
   *        namespace will appear on the `Sugar` global with all the methods of
   *        normal namespaces, including the ability to define new methods. When
   *        extended, any defined methods will be mapped to `name` in the global
   *        context.
   ***/
  function createNamespace(name) {

    // Is the current namespace Object?
    var isObject = name === 'Object';

    // A Sugar namespace is also a chainable class: Sugar.Array, etc.
    var sugarNamespace = getNewChainableClass(name, true);

    /***
     * @method extend([opt])
     * @returns Sugar
     * @static
     * @global
     * @namespace
     * @short Extends natives with methods defined on the namespace.
     * @extra [opt] may be a single method name as a string, an array of method
     *        names, or an options object (options listed below). This method can
     *        be called on individual namespaces like `Sugar.Array` or on the
     *        global itself, in which case [options] will be forwarded to each
     *        `extend` call.
     *
     * @options
     *
     *   methods           An array of method names to explicitly extend.
     *
     *   except            An array of method names to explicitly exclude.
     *
     *   enhance           A shortcut to disallow all "enhance" flags at once
     *                     (flags listed below). Default is `true`.
     *
     *   enhanceString     A boolean allowing String enhancements (allowing a
     *                     regex in `String#includes`). Default is `true`.
     *
     *   enhanceArray      A boolean allowing Array enhancements such as passing
     *                     shortcuts to matching functions in `every`, `some`,
     *                     `filter`, `find`, and `findIndex`, and passing a
     *                     shortcut for a mapping function in `map`. See each
     *                     method's docs for more. Default is `true`.
     *
     *   enhanceObject     A boolean allowing Object enhancements (optional
     *                     callback function for `Object.keys`). Default is `true`.
     *
     *   objectPrototype   A boolean allowing Sugar to extend Object.prototype
     *                     with instance methods. This option is off by default
     *                     and should be used with extreme caution as it may have
     *                     unintended consequences and result in issues that are
     *                     difficult to debug. For more, see `extending natives`.
     *
     ***/
    var extend = function (arg) {
      var staticMethods = {}, instanceMethods = {}, opts = {}, methodsByName;

      function objectRestricted(name, instance) {
        return isObject && instance && (!allowObjectPrototype || name === 'get' || name === 'set');
      }

      function disallowedByFlags(flags) {
        if (!flags) return;
        for (var i = 0; i < flags.length; i++) {
          if (opts[flags[i]] === false) {
            return true;
          }
        }
      }

      function methodExcepted(methodName) {
        return opts.except && opts.except.indexOf(methodName) !== -1;
      }

      function canExtend(methodName, method, instance) {
        return !objectRestricted(methodName, instance) &&
               !disallowedByFlags(method.flags) &&
               !methodExcepted(methodName);
      }

      if (typeof arg === 'string') {
        methodsByName = [arg];
      } else if (arg && arg.length) {
        methodsByName = arg;
      } else if (arg) {
        opts = arg;
        methodsByName = opts.methods;
        if (isObject && typeof opts.objectPrototype === 'boolean') {
          // Store "objectPrototype" flag for future reference.
          allowObjectPrototype = opts.objectPrototype;
        }
      }

      iterateOverObject(methodsByName || sugarNamespace, function(methodName, method) {
        if (methodsByName) {
          // If we have method names passed in an array,
          // then we need to flip the key and value here
          // and find the method in the Sugar namespace.
          methodName = method;
          method = sugarNamespace[methodName];
        }
        if (hasOwn(method, 'instance') && canExtend(methodName, method, true)) {
          instanceMethods[methodName] = method.instance;
        }
        if(hasOwn(method, 'static') && canExtend(methodName, method)) {
          staticMethods[methodName] = method;
        }
      });

      // Accessing the extend target each time instead of holding a reference as
      // it may have been overwritten (for example Date by Sinon). Also need to
      // access through the global to allow extension of user-defined namespaces.
      extendNative(globalContext[name], staticMethods);
      extendNative(globalContext[name].prototype, instanceMethods);

      if (!methodsByName) {
        // If there are no method names passed, then
        // all methods in the namespace will be extended
        // to the native. This includes all future defined
        // methods, so add a flag here to check later.
        setProperty(sugarNamespace, 'active', true);
      }
      return Sugar;
    };

    function defineWithOptionCollect(methodName, instance, args) {
      setProperty(sugarNamespace, methodName, function(arg1, arg2, arg3) {
        var opts = collectDefineOptions(arg1, arg2, arg3);
        defineMethods(sugarNamespace, opts.methods, instance, args, opts.last);
        return sugarNamespace;
      });
    }

    /***
     * @method defineStatic(...)
     * @returns Namespace
     * @namespace
     * @static
     * @short Defines static methods on the namespace that can later be extended
     *        onto the native globals.
     * @extra Accepts either a single object mapping names to functions, or name
     *        and function as two arguments.
     *
     * @example
     *
     *   Sugar.Number.defineStatic({
     *     isOdd: function (num) {
     *       return num % 2 === 1;
     *     }
     *   });
     *
     ***/
    defineWithOptionCollect('defineStatic', STATIC);

    /***
     * @method defineInstance(...)
     * @returns Namespace
     * @namespace
     * @static
     * @short Defines methods on the namespace that can later be extended as
     *        instance methods onto the native prototype.
     * @extra Accepts either a single object mapping names to functions, or name
     *        and function as two arguments. All functions should accept the
     *        native for which they are mapped as their first argument, and should
     *        never refer to `this`. Additionally, functions cannot accept more
     *        than 4 arguments in addition to the native (5 arguments total). Any
     *        additional arguments will not be mapped. If more options are
     *        required, use an options object instead.
     *
     * @example
     *
     *   Sugar.Number.defineInstance({
     *     square: function (num) {
     *       return num * num;
     *     }
     *   });
     *
     ***/
    defineWithOptionCollect('defineInstance', INSTANCE);

    /***
     * @method defineInstanceAndStatic(...)
     * @returns Namespace
     * @namespace
     * @static
     * @short A shortcut to define both static and instance methods on the namespace.
     * @extra This method is intended for use with `Object` instance methods. Sugar
     *        will not map any methods to `Object.prototype` by default, so defining
     *        instance methods as static helps facilitate their proper use.
     *
     * @example
     *
     *   Sugar.Object.defineInstanceAndStatic({
     *     isAwesome: function (obj) {
     *       // check if obj is awesome!
     *     }
     *   });
     *
     ***/
    defineWithOptionCollect('defineInstanceAndStatic', INSTANCE | STATIC);


    /***
     * @method defineStaticWithArguments(...)
     * @returns Namespace
     * @namespace
     * @static
     * @short Defines static methods that collect arguments.
     * @extra This method is identical to `defineStatic`, except that when defined
     *        methods are called, they will collect any arguments past `n - 1`,
     *        where `n` is the number of arguments that the method accepts.
     *        Collected arguments will be passed to the method in an array
     *        as the last argument defined on the function.
     *
     * @example
     *
     *   Sugar.Number.defineStaticWithArguments({
     *     addAll: function (num, args) {
     *       for (var i = 0; i < args.length; i++) {
     *         num += args[i];
     *       }
     *       return num;
     *     }
     *   });
     *
     ***/
    defineWithOptionCollect('defineStaticWithArguments', STATIC, true);

    /***
     * @method defineInstanceWithArguments(...)
     * @returns Namespace
     * @namespace
     * @static
     * @short Defines instance methods that collect arguments.
     * @extra This method is identical to `defineInstance`, except that when
     *        defined methods are called, they will collect any arguments past
     *        `n - 1`, where `n` is the number of arguments that the method
     *        accepts. Collected arguments will be passed to the method as the
     *        last argument defined on the function.
     *
     * @example
     *
     *   Sugar.Number.defineInstanceWithArguments({
     *     addAll: function (num, args) {
     *       for (var i = 0; i < args.length; i++) {
     *         num += args[i];
     *       }
     *       return num;
     *     }
     *   });
     *
     ***/
    defineWithOptionCollect('defineInstanceWithArguments', INSTANCE, true);

    /***
     * @method defineStaticPolyfill(...)
     * @returns Namespace
     * @namespace
     * @static
     * @short Defines static methods that are mapped onto the native if they do
     *        not already exist.
     * @extra Intended only for use creating polyfills that follow the ECMAScript
     *        spec. Accepts either a single object mapping names to functions, or
     *        name and function as two arguments.
     *
     * @example
     *
     *   Sugar.Object.defineStaticPolyfill({
     *     keys: function (obj) {
     *       // get keys!
     *     }
     *   });
     *
     ***/
    setProperty(sugarNamespace, 'defineStaticPolyfill', function(arg1, arg2, arg3) {
      var opts = collectDefineOptions(arg1, arg2, arg3);
      extendNative(globalContext[name], opts.methods, true, opts.last);
    });

    /***
     * @method defineInstancePolyfill(...)
     * @returns Namespace
     * @namespace
     * @static
     * @short Defines instance methods that are mapped onto the native prototype
     *        if they do not already exist.
     * @extra Intended only for use creating polyfills that follow the ECMAScript
     *        spec. Accepts either a single object mapping names to functions, or
     *        name and function as two arguments. `defineInstancePolyfill` differs
     *        from `defineInstance` as there is no static signature (as the method
     *        is mapped as-is to the native), so it should refer to its `this`
     *        object.
     *
     * @example
     *
     *   Sugar.Array.defineInstancePolyfill({
     *     indexOf: function (arr, el) {
     *       // index finding code here!
     *     }
     *   });
     *
     ***/
    setProperty(sugarNamespace, 'defineInstancePolyfill', function(arg1, arg2, arg3) {
      var opts = collectDefineOptions(arg1, arg2, arg3);
      extendNative(globalContext[name].prototype, opts.methods, true, opts.last);
      // Map instance polyfills to chainable as well.
      iterateOverObject(opts.methods, function(methodName, fn) {
        defineChainableMethod(sugarNamespace, methodName, fn);
      });
    });

    /***
     * @method alias(<toName>, <fromName>)
     * @returns Namespace
     * @namespace
     * @static
     * @short Aliases one Sugar method to another.
     *
     * @example
     *
     *   Sugar.Array.alias('all', 'every');
     *
     ***/
    setProperty(sugarNamespace, 'alias', function(name, source) {
      var method = typeof source === 'string' ? sugarNamespace[source] : source;
      setMethod(sugarNamespace, name, method);
    });

    // Each namespace can extend only itself through its .extend method.
    setProperty(sugarNamespace, 'extend', extend);

    // Cache the class to namespace relationship for later use.
    namespacesByName[name] = sugarNamespace;
    namespacesByClassName['[object ' + name + ']'] = sugarNamespace;

    mapNativeToChainable(name);
    mapObjectChainablesToNamespace(sugarNamespace);

    // Export
    return Sugar[name] = sugarNamespace;
  }

  function setGlobalProperties() {
    setProperty(Sugar, 'VERSION', 'edge');
    setProperty(Sugar, 'extend', Sugar);
    setProperty(Sugar, 'hasOwn', hasOwn);
    setProperty(Sugar, 'toString', toString);
    setProperty(Sugar, 'className', className);
    setProperty(Sugar, 'setProperty', setProperty);
    setProperty(Sugar, 'defineProperty', defineProperty);
    setProperty(Sugar, 'createNamespace', createNamespace);
    setProperty(Sugar, 'iterateOverObject', iterateOverObject);
    setProperty(Sugar, 'mapNativeToChainable', mapNativeToChainable);
  }

  function toString() {
    return SUGAR_GLOBAL;
  }


  // Defining Methods

  function defineMethods(sugarNamespace, methods, type, args, flags) {
    iterateOverObject(methods, function(methodName, method) {
      var instanceMethod, staticMethod = method;
      if (args) {
        staticMethod = wrapMethodWithArguments(method);
      }
      if (flags) {
        staticMethod.flags = flags;
      }

      // A method may define its own custom implementation, so
      // make sure that's not the case before creating one.
      if (type & INSTANCE && !method.instance) {
        instanceMethod = wrapInstanceMethod(method, args);
        setProperty(staticMethod, 'instance', instanceMethod);
      }

      if (type & STATIC) {
        setProperty(staticMethod, 'static', true);
      }

      setMethod(sugarNamespace, methodName, staticMethod);

      if (sugarNamespace.active) {
        // If the namespace has been activated (.extend has been called),
        // then map this method as well.
        sugarNamespace.extend(methodName);
      }
    });
  }

  function collectDefineOptions(arg1, arg2, arg3) {
    var methods, last;
    if (typeof arg1 === 'string') {
      methods = {};
      methods[arg1] = arg2;
      last = arg3;
    } else {
      methods = arg1;
      last = arg2;
    }
    return {
      last: last,
      methods: methods
    };
  }

  function wrapInstanceMethod(fn, args) {
    return args ? wrapMethodWithArguments(fn, true) : wrapInstanceMethodFixed(fn);
  }

  function wrapMethodWithArguments(fn, instance) {
    // Functions accepting enumerated arguments will always have "args" as the
    // last argument, so subtract one from the function length to get the point
    // at which to start collecting arguments. If this is an instance method on
    // a prototype, then "this" will be pushed into the arguments array so start
    // collecting 1 argument earlier.
    var startCollect = fn.length - 1 - (instance ? 1 : 0);
    return function() {
      var args = [], collectedArgs = [], len;
      if (instance) {
        args.push(this);
      }
      len = Math.max(arguments.length, startCollect);
      // Optimized: no leaking arguments
      for (var i = 0; i < len; i++) {
        if (i < startCollect) {
          args.push(arguments[i]);
        } else {
          collectedArgs.push(arguments[i]);
        }
      }
      args.push(collectedArgs);
      return fn.apply(null, args);
    };
  }

  function wrapInstanceMethodFixed(fn) {
    switch(fn.length) {
      // Wrapped instance methods will always be passed the instance
      // as the first argument, but requiring the argument to be defined
      // may cause confusion here, so return the same wrapped function regardless.
      case 0:
      case 1:
        return function() {
          return fn(this);
        };
      case 2:
        return function(a) {
          return fn(this, a);
        };
      case 3:
        return function(a, b) {
          return fn(this, a, b);
        };
      case 4:
        return function(a, b, c) {
          return fn(this, a, b, c);
        };
      case 5:
        return function(a, b, c, d) {
          return fn(this, a, b, c, d);
        };
    }
  }

  // Method helpers

  function extendNative(target, source, polyfill, override) {
    iterateOverObject(source, function(name, method) {
      if (polyfill && !override && target[name]) {
        // Polyfill exists, so bail.
        return;
      }
      setProperty(target, name, method);
    });
  }

  function setMethod(sugarNamespace, methodName, method) {
    sugarNamespace[methodName] = method;
    if (method.instance) {
      defineChainableMethod(sugarNamespace, methodName, method.instance, true);
    }
  }


  // Chainables

  function getNewChainableClass(name, inherits) {
    var fn = SugarChainable = function (obj, arg) {
      if (!(this instanceof fn)) {
        return new fn(obj, arg);
      }
      if (this.constructor !== DefaultChainable) {
        // Allow modules to define their own constructors.
        obj = this.constructor.apply(obj, arguments);
      }
      this.raw = obj;
    };
    if (inherits) {
      fn.prototype = new DefaultChainable;
    }
    setProperty(fn, 'toString', function() {
      return SUGAR_GLOBAL + name;
    });
    setProperty(fn.prototype, 'valueOf', function() {
      return this.raw;
    });
    return fn;
  }

  function defineChainableMethod(sugarNamespace, methodName, fn, internal) {
    var wrapped = wrapWithChainableResult(fn, internal), existing, collision, dcp;
    dcp = DefaultChainable.prototype;
    existing = dcp[methodName];

    // If the method was previously defined on the default chainable, then a
    // collision exists, so set the method to a disambiguation function that
    // will lazily evaluate the object and find it's associated chainable.
    collision = existing && existing !== Object.prototype[methodName];

    // The disambiguation function is only required once.
    if (!existing || !existing.disambiguate) {
      dcp[methodName] = collision ? disambiguateMethod(methodName) : wrapped;
    }

    // The target chainable always receives the wrapped method. Additionally,
    // if the target chainable is Sugar.Object, then map the wrapped method
    // to all other namespaces as well if they do not define their own method
    // of the same name. This way, a Sugar.Number will have methods like
    // isEqual that can be called on any object without having to traverse up
    // the prototype chain and perform disambiguation, which costs cycles.
    // Note that the "if" block below actually does nothing on init as Object
    // goes first and no other namespaces exist yet. However it needs to be
    // here as Object instance methods defined later also need to be mapped
    // back onto existing namespaces.
    sugarNamespace.prototype[methodName] = wrapped;
    if (sugarNamespace === Sugar.Object) {
      mapObjectChainableToAllNamespaces(methodName, wrapped);
    }
  }

  function mapObjectChainablesToNamespace(sugarNamespace) {
    iterateOverObject(Sugar.Object && Sugar.Object.prototype, function(methodName, val) {
      if (typeof val === 'function') {
        setObjectChainableOnNamespace(sugarNamespace, methodName, val);
      }
    });
  }

  function mapObjectChainableToAllNamespaces(methodName, fn) {
    iterateOverObject(namespacesByName, function(name, sugarNamespace) {
      setObjectChainableOnNamespace(sugarNamespace, methodName, fn);
    });
  }

  function setObjectChainableOnNamespace(sugarNamespace, methodName, fn) {
    var proto = sugarNamespace.prototype;
    if (!hasOwn(proto, methodName)) {
      proto[methodName] = fn;
    }
  }

  function wrapWithChainableResult(fn, internal) {
    return function() {
      return new DefaultChainable(fn.apply(this.raw, arguments));
    };
  }

  function disambiguateMethod(methodName) {
    var fn = function() {
      var raw = this.raw, sugarNamespace, fn;
      if (raw != null) {
        // Find the Sugar namespace for this unknown.
        sugarNamespace = namespacesByClassName[className(raw)];
      }
      if (!sugarNamespace) {
        // If no sugarNamespace can be resolved, then default
        // back to Sugar.Object so that undefined and other
        // non-supported types can still have basic object
        // methods called on them, such as type checks.
        sugarNamespace = Sugar.Object;
      }

      fn = new sugarNamespace(raw)[methodName];

      if (fn.disambiguate) {
        // If the method about to be called on this chainable is
        // itself a disambiguation method, then throw an error to
        // prevent infinite recursion.
        throw new TypeError('Cannot resolve namespace for ' + raw);
      }

      return fn.apply(this, arguments);
    };
    fn.disambiguate = true;
    return fn;
  }

  function mapNativeToChainable(name, methodNames) {
    var sugarNamespace = namespacesByName[name],
        nativeProto = globalContext[name].prototype;

    if (!methodNames && ownPropertyNames) {
      methodNames = ownPropertyNames(nativeProto);
    }

    iterateOverObject(methodNames, function(i, methodName) {
      if (nativeMethodProhibited(methodName)) {
        // Sugar chainables have their own constructors as well as "valueOf"
        // methods, so exclude them here. The __proto__ argument should be trapped
        // by the function check below, however simply accessing this property on
        // Object.prototype causes QML to segfault, so pre-emptively excluding it.
        return;
      }
      try {
        var fn = nativeProto[methodName];
        if (typeof fn !== 'function') {
          // Bail on anything not a function.
          return;
        }
      } catch (e) {
        // Function.prototype has properties that
        // will throw errors when accessed.
        return;
      }
      defineChainableMethod(sugarNamespace, methodName, fn);
    });
  }

  function nativeMethodProhibited(methodName) {
    return methodName === 'constructor' ||
           methodName === 'valueOf' ||
           methodName === '__proto__';
  }


  // Util

  // Internal references
  var ownPropertyNames = Object.getOwnPropertyNames,
      internalToString = Object.prototype.toString,
      internalHasOwnProperty = Object.prototype.hasOwnProperty;

  function definePropertyShim(obj, prop, descriptor) {
    obj[prop] = descriptor.value;
  }

  function setProperty(target, name, value, enumerable) {
    defineProperty(target, name, {
      value: value,
      enumerable: !!enumerable,
      configurable: true,
      writable: true
    });
  }

  function iterateOverObject(obj, fn) {
    for(var key in obj) {
      if (!hasOwn(obj, key)) continue;
      if (fn.call(obj, key, obj[key], obj) === false) break;
    }
  }

  // PERF: Attempts to speed this method up get very Heisenbergy. Quickly
  // returning based on typeof works for primitives, but slows down object
  // types. Even === checks on null and undefined (no typeof) will end up
  // basically breaking even. This seems to be as fast as it can go.
  function className(obj) {
    return internalToString.call(obj);
  }

  function hasOwn(obj, prop) {
    return !!obj && internalHasOwnProperty.call(obj, prop);
  }

  setupGlobal();
  'use strict';


  /***
   * @module Common
   * @description Internal utility and common methods.
   ***/

  // Flag allowing native methods to be enhanced
  var ENHANCEMENTS_FLAG = 'enhance';

  // Excludes object as this is more nuanced.
  var TYPE_CHECK_NAMES = ['Boolean','Number','String','Array','Date','RegExp','Function'];

  // Do strings have no keys?
  var NO_KEYS_IN_STRING_OBJECTS = !('0' in Object('a'));

  // Classes that can be matched by value
  var MATCHED_BY_VALUE_REG = /^\[object Date|Array|String|Number|RegExp|Boolean|Arguments\]$/;

  // Prefix for private properties
  var PRIVATE_PROP_PREFIX = '_sugar_';

  // Matches 1..2 style ranges in properties
  var PROPERTY_RANGE_REG = /^(.*?)\[([-\d]*)\.\.([-\d]*)\](.*)$/;

  // WhiteSpace/LineTerminator as defined in ES5.1 plus Unicode characters in the Space, Separator category.
  var TRIM_CHARS = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF';

  // Regex for matching a formatted string
  var STRING_FORMAT_REG = /([{}])\1|\{([^}]*)\}|(%)%|(%(\w*))/g;

  var HALF_WIDTH_ZERO = 0x30;
  var FULL_WIDTH_ZERO = 0xff10;

  var HALF_WIDTH_PERIOD   = '.';
  var FULL_WIDTH_PERIOD   = '．';
  var HALF_WIDTH_COMMA    = ',';

  var OPEN_BRACE  = '{';
  var CLOSE_BRACE = '}';

  // Namespace aliases
  var sugarObject   = Sugar.Object,
      sugarArray    = Sugar.Array,
      sugarDate     = Sugar.Date,
      sugarString   = Sugar.String,
      sugarNumber   = Sugar.Number,
      sugarFunction = Sugar.Function,
      sugarRegExp   = Sugar.RegExp;

  // Core utility aliases
  var hasOwn             = Sugar.hasOwn,
      className          = Sugar.className,
      setProperty        = Sugar.setProperty,
      defineProperty     = Sugar.defineProperty,
      iterateOverObject  = Sugar.iterateOverObject;


  // Type Checks
  var isBoolean, isNumber, isString, isArray, isDate, isRegExp, isFunction, isSet;

  function buildClassChecks() {

    function buildClassCheck(klass) {
      return klass === 'Array' && Array.isArray || function(obj, cached) {
        return isClass(obj, klass, cached);
      };
    }

    function buildPrimitiveClassCheck(klass) {
      var type = klass.toLowerCase();
      return function(obj) {
        var t = typeof obj;
        return t === type || t === 'object' && isClass(obj, klass);
      };
    }

    isBoolean  = buildPrimitiveClassCheck(TYPE_CHECK_NAMES[0]);
    isNumber   = buildPrimitiveClassCheck(TYPE_CHECK_NAMES[1]);
    isString   = buildPrimitiveClassCheck(TYPE_CHECK_NAMES[2]);

    isArray    = buildClassCheck(TYPE_CHECK_NAMES[3]);
    isDate     = buildClassCheck(TYPE_CHECK_NAMES[4]);
    isRegExp   = buildClassCheck(TYPE_CHECK_NAMES[5]);
    isSet      = buildClassCheck('Set');

    // Wanted to enhance performance here by using simply "typeof"
    // but Firefox has two major issues that make this impossible,
    // one fixed, the other not, so perform a full class check here.
    //
    // 1. Regexes can be typeof "function" in FF < 3
    //    https://bugzilla.mozilla.org/show_bug.cgi?id=61911 (fixed)
    //
    // 2. HTMLEmbedElement and HTMLObjectElement are be typeof "function"
    //    https://bugzilla.mozilla.org/show_bug.cgi?id=268945 (won't fix)
    isFunction = buildClassCheck(TYPE_CHECK_NAMES[6]);

  }

  function isClass(obj, klass, cached) {
    var k = cached || className(obj);
    return k === '[object '+ klass +']';
  }

  // Wrapping the core's "define" methods to
  // save a few bytes in the minified script.

  function wrapNamespace(method) {
    return function(sugarNamespace, arg1, arg2) {
      sugarNamespace[method](arg1, arg2);
    };
  }

  // Define aliases
  var alias                       = wrapNamespace('alias'),
      defineStatic                = wrapNamespace('defineStatic'),
      defineInstance              = wrapNamespace('defineInstance'),
      defineStaticPolyfill        = wrapNamespace('defineStaticPolyfill'),
      defineInstancePolyfill      = wrapNamespace('defineInstancePolyfill'),
      defineInstanceAndStatic     = wrapNamespace('defineInstanceAndStatic'),
      defineStaticWithArguments   = wrapNamespace('defineStaticWithArguments'),
      defineInstanceWithArguments = wrapNamespace('defineInstanceWithArguments');

  function defineInstanceSimilar(sugarNamespace, set, fn, flags) {
    defineInstance(sugarNamespace, collectSimilarMethods(set, fn), flags);
  }

  function defineInstanceAndStaticSimilar(sugarNamespace, set, fn, flags) {
    defineInstanceAndStatic(sugarNamespace, collectSimilarMethods(set, fn), flags);
  }

  function collectSimilarMethods(set, fn) {
    var methods = {};
    if (isString(set)) {
      set = commaSplit(set);
    }
    iterateOverObject(set, function(i, name) {
      fn(methods, name, i);
    });
    return methods;
  }

  // This song and dance is to fix methods to a different length
  // from what they actually accept in order to stay in line with
  // spec. Additinally passing argument length, as some methods
  // throw assertion errors based on this (undefined check is not
  // enough). Fortunately for now spec is such that passing 3
  // actual arguments covers all requirements. Note that passing
  // the argument length also forces the compiler to not rewrite
  // length of the compiled function.
  function fixArgumentLength(fn, staticOnly) {
    var staticFn = function(a) {
      var args = arguments;
      return fn(a, args[1], args[2], args.length - 1);
    };
    if (!staticOnly) {
      staticFn.instance = function(b) {
        var args = arguments;
        return fn(this, b, args[1], args.length);
      };
    }
    return staticFn;
  }

  function defineAccessor(namespace, name, globalDefault) {
    var local, accessor;
    accessor = function(val) {
      if (arguments.length > 0) {
        local = val;
      }
      return local != null ? local : globalDefault;
    };
    setProperty(namespace, name, accessor);
    return accessor;
  }

  // Argument helpers

  function assertCallable(fn) {
    if (!isFunction(fn)) {
      throw new TypeError('Function is not callable');
    }
  }

  function assertWritable(obj) {
    if (isPrimitive(obj)) {
      // If strict mode is active then primitives will throw an
      // error when attempting to write properties. We can't be
      // sure if strict mode is available, so pre-emptively
      // throw an error here to ensure consistent behavior.
      throw new TypeError('Property cannot be written.');
    }
  }


  // Coerces an object to a positive integer.
  // Does not allow NaN, or Infinity.
  function coercePositiveInteger(n) {
    n = +n || 0;
    if (n < 0 || !isNumber(n) || !isFinite(n)) {
      throw new RangeError('Invalid number');
    }
    return trunc(n);
  }


  // General helpers

  function isDefined(o) {
    return o !== undefined;
  }

  function isUndefined(o) {
    return o === undefined;
  }

  function privatePropertyAccessor(key) {
    var privateKey = PRIVATE_PROP_PREFIX + key;
    return function(obj, val) {
      if (arguments.length > 1) {
        setProperty(obj, privateKey, val);
        return obj;
      }
      return obj[privateKey];
    };
  }

  function setChainableConstructor(sugarNamespace, passCheck, createFn) {
    sugarNamespace.prototype.constructor = function(obj) {
      return passCheck(obj) ? obj : createFn.apply(this, arguments);
    };
  }

  // Fuzzy matching helpers

  function getMatcher(f, k) {
    if (!isPrimitive(f)) {
      var klass = className(f);
      if (isRegExp(f, klass)) {
        return regexMatcher(f);
      } else if (isDate(f, klass)) {
        return dateMatcher(f);
      } else if (isFunction(f, klass)) {
        // Match against a filtering function
        if (k) {
          return invertedArgsFunctionMatcher(f);
        } else {
          return functionMatcher(f);
        }
      } else if (isPlainObject(f, klass)) {
        return fuzzyMatcher(f, k);
      }
    }
    // Default is standard isEqual
    return defaultMatcher(f);
  }

  function defaultMatcher(f) {
    return function(el) {
      return isEqual(el, f);
    };
  }

  function regexMatcher(reg) {
    reg = RegExp(reg);
    return function(el) {
      return reg.test(el);
    };
  }

  function dateMatcher(d) {
    var ms = d.getTime();
    return function(el) {
      return !!(el && el.getTime) && el.getTime() === ms;
    };
  }

  function functionMatcher(fn) {
    return function(el, i, arr) {
      // Return true up front if match by reference
      return el === fn || fn.call(arr, el, i, arr);
    };
  }

  function invertedArgsFunctionMatcher(fn) {
    return function(value, key, obj) {
      // Return true up front if match by reference
      return value === fn || fn.call(obj, key, value, obj);
    };
  }

  function fuzzyMatcher(obj, k) {
    var matchers = {};
    return function(el, i, arr) {
      var matched = true;
      if (!isObjectType(el)) {
        return false;
      }
      iterateOverObject(obj, function(key, val) {
        matchers[key] = matchers[key] || getMatcher(val, k);
        if (matchers[key].call(arr, el[key], i, arr) === false) {
          matched = false;
        }
        return matched;
      });
      return matched;
    };
  }

  // Object helpers

  var getKeys = Object.keys;

  function deepHasProperty(obj, key) {
    return handleDeepProperty(obj, key, true);
  }

  function deepGetProperty(obj, key) {
    return handleDeepProperty(obj, key, false);
  }

  function deepSetProperty(obj, key, val) {
    handleDeepProperty(obj, key, false, true, false, val);
    return obj;
  }

  function handleDeepProperty(obj, key, has, fill, fillLast, val) {
    var ns, bs, ps, cbi, set, isLast, isPush, isIndex, nextIsIndex, exists;
    ns = obj || undefined;
    if (key == null) return;

    if (isObjectType(key)) {
      // Allow array and array-like accessors
      bs = [key];
    } else {
      key = String(key);
      if (key.indexOf('..') !== -1) {
        return handleArrayIndexRange(obj, key, val);
      }
      bs = key.split('[');
    }

    set = isDefined(val);

    for (var i = 0, blen = bs.length; i < blen; i++) {
      ps = bs[i];

      if (isString(ps)) {
        ps = periodSplit(ps);
      }

      for (var j = 0, plen = ps.length; j < plen; j++) {
        key = ps[j];

        // Is this the last key?
        isLast = i === blen - 1 && j === plen - 1;

        // Index of the closing ]
        cbi = key.indexOf(']');

        // Is the key an array index?
        isIndex = cbi !== -1;

        // Is this array push syntax "[]"?
        isPush = set && cbi === 0;

        // If the bracket split was successful and this is the last element
        // in the dot split, then we know the next key will be an array index.
        nextIsIndex = blen > 1 && j === plen - 1;

        if (isPush) {
          // Set the index to the end of the array
          key = ns.length;
        } else if (isIndex) {
          // Remove the closing ]
          key = key.slice(0, -1);
        }

        // If the array index is less than 0, then
        // add its length to allow negative indexes.
        if (isIndex && key < 0) {
          key = +key + ns.length;
        }

        // Bracket keys may look like users[5] or just [5], so the leading
        // characters are optional. We can enter the namespace if this is the
        // 2nd part, if there is only 1 part, or if there is an explicit key.
        if (i || key || blen === 1) {

          // Non-existent namespaces are only filled if they are intermediate
          // (not at the end) or explicitly filling the last.
          if (fill && (!isLast || fillLast) && !(key in ns)) {
            // For our purposes, last only needs to be an array.
            ns[key] = nextIsIndex || (fillLast && isLast) ? [] : {};
          }

          if (has) {
            exists = key in ns;
            if (isLast || !exists) {
              return exists;
            }
          } else if (set && isLast) {
            assertWritable(ns);
            ns[key] = val;
          }

          ns = ns && ns[key];
        }

      }
    }
    return ns;
  }

  // Get object property with support for 0..1 style range notation.
  function handleArrayIndexRange(obj, key, val) {
    var match, start, end, leading, trailing, set;
    set = isDefined(val);
    match = key.match(PROPERTY_RANGE_REG);
    if (!match) {
      return;
    }
    leading  = match[1];
    trailing = match[4];
    start    = match[2] ? +match[2] : 0;
    end      = match[3] ? +match[3] : obj.length;

    // A range of 0..1 is inclusive, so we need to add 1 to the end. If this
    // pushes the index from -1 to 0, then set it to the full length of the
    // array, otherwise it will return nothing.
    end = end === -1 ? obj.length : end + 1;

    if (leading) {
      obj = handleDeepProperty(obj, leading, false, set ? true : false, true);
    }

    if (set) {
      for (var i = start; i < end; i++) {
        handleDeepProperty(obj, i + trailing, false, true, false, val);
      }
    } else {
      obj = obj.slice(start, end);

      // If there are trailing properties, then they need to be mapped for each
      // element in the array.
      if (trailing) {
        if (trailing.charAt(0) === HALF_WIDTH_PERIOD) {
          // Need to chomp the period if one is trailing after the range. We
          // can't do this at the regex level because it will be required if
          // we're setting the value as it needs to be concatentated together
          // with the array index to be set.
          trailing = trailing.slice(1);
        }
        return obj.map(function(el) {
          return handleDeepProperty(el, trailing);
        });
      }
    }
    return obj;
  }

  function hasProperty(obj, prop) {
    return !isPrimitive(obj) && prop in obj;
  }

  function isObjectType(obj, type) {
    return !!obj && (type || typeof obj) === 'object';
  }

  function isPrimitive(obj, type) {
    type = type || typeof obj;
    return obj == null || type === 'string' || type === 'number' || type === 'boolean';
  }

  function isPlainObject(obj, klass) {
    return isObjectType(obj) &&
           isClass(obj, 'Object', klass) &&
           hasValidPlainObjectPrototype(obj) &&
           hasOwnEnumeratedProperties(obj);
  }

  function hasValidPlainObjectPrototype(obj) {
    var hasToString = 'toString' in obj;
    var hasConstructor = 'constructor' in obj;
    // An object created with Object.create(null) has no methods in the
    // prototype chain, so check if any are missing. The additional hasToString
    // check is for false positives on some host objects in old IE which have
    // toString but no constructor. If the object has an inherited constructor,
    // then check if it is Object (the "isPrototypeOf" tapdance here is a more
    // robust way of ensuring this if the global has been hijacked). Note that
    // accessing the constructor directly (without "in" or "hasOwnProperty")
    // will throw a permissions error in IE8 on cross-domain windows.
    return (!hasConstructor && !hasToString) ||
            (hasConstructor && !hasOwn(obj, 'constructor') &&
             hasOwn(obj.constructor.prototype, 'isPrototypeOf'));
  }

  function hasOwnEnumeratedProperties(obj) {
    // Plain objects are generally defined as having enumerated properties
    // all their own, however in early IE environments without defineProperty,
    // there may also be enumerated methods in the prototype chain, so check
    // for both of these cases.
    var objectProto = Object.prototype;
    for (var key in obj) {
      var val = obj[key];
      if (!hasOwn(obj, key) && val !== objectProto[key]) {
        return false;
      }
    }
    return true;
  }

  function simpleRepeat(n, fn) {
    for (var i = 0; i < n; i++) {
      fn(i);
    }
  }

  function simpleClone(obj) {
    return simpleMerge({}, obj);
  }

  function simpleMerge(target, source) {
    iterateOverObject(source, function(key) {
      target[key] = source[key];
    });
    return target;
  }

  // Make primtives types like strings into objects.
  function coercePrimitiveToObject(obj) {
    if (isPrimitive(obj)) {
      obj = Object(obj);
    }
    if (NO_KEYS_IN_STRING_OBJECTS && isString(obj)) {
      forceStringCoercion(obj);
    }
    return obj;
  }

  // Force strings to have their indexes set in
  // environments that don't do this automatically.
  function forceStringCoercion(obj) {
    var i = 0, chr;
    while (chr = obj.charAt(i)) {
      obj[i++] = chr;
    }
  }

  // Equality helpers

  function isEqual(a, b, stack) {
    var aClass, bClass;
    if (a === b) {
      // Return quickly up front when matched by reference,
      // but be careful about 0 !== -0.
      return a !== 0 || 1 / a === 1 / b;
    }
    aClass = className(a);
    bClass = className(b);
    if (aClass !== bClass) {
      return false;
    }

    if (isSet(a, aClass) && isSet(b, bClass)) {
      return setIsEqual(a, b);
    } else if (canCompareValue(a, aClass) && canCompareValue(b, bClass)) {
      return objectIsEqual(a, b, aClass, stack);
    }
    return false;
  }

  function canCompareValue(obj, klass) {
    // Only known objects are matched by value. This is notably excluding
    // functions, DOM Elements, and instances of user-created classes. The latter
    // can arguably be matched by value, but distinguishing between these and host
    // objects -- which should never be compared by value -- is very tricky so not
    // dealing with it here.
    klass = klass || className(obj);
    return MATCHED_BY_VALUE_REG.test(klass) || isPlainObject(obj, klass);
  }

  function objectIsEqual(a, b, aClass, stack) {
    var aType = typeof a, bType = typeof b, propsEqual, lenEqual, arrayLike, count;
    if (aType !== bType) {
      return false;
    }
    if (isObjectType(a.valueOf())) {
      count = 0;
      propsEqual = true;
      arrayLike = isArrayLike(a, aClass);
      iterateWithCyclicCheck(a, arrayLike, false, stack, function(key, val, cyc, stack) {
        if (!cyc && (!(key in b) || !isEqual(val, b[key], stack))) {
          propsEqual = false;
        }
        count++;
        return propsEqual;
      });
      lenEqual = arrayLike ? a.length === b.length : count === getKeys(b).length;
      if (!propsEqual || !lenEqual) {
        return false;
      }
    }
    // Stringifying the value handles NaN, wrapped primitives, and dates in one go.
    return a.valueOf().toString() === b.valueOf().toString();
  }

  function setIsEqual(s1, s2) {
    var equal = true;
    // iOS8 supports sets but has an incomplete implementation of Iterators so
    // avoiding .next syntax here. Also can't use for..of as it would be a
    // syntax error in ES5 environments.
    s1.forEach(function(v) {
      if (equal && !s2.has(v)) {
        equal = false;
      }
    });
    return equal && s1.size === s2.size;
  }

  function stringify(obj, stack) {
    var type = typeof obj, arrayLike, klass, value;

    // Return quickly for primitives to save cycles
    if (isPrimitive(obj, type) && !isRealNaN(obj)) {
      return type + obj;
    }

    klass = className(obj);
    arrayLike = isArrayLike(obj, klass);

    if (arrayLike || isPlainObject(obj, klass)) {
      value = stringifyDeep(obj, arrayLike, stack);
    } else if (1 / obj === -Infinity) {
      value = '-0';
    } else if (obj.valueOf) {
      value = obj.valueOf();
    }
    return type + klass + value;
  }

  function stringifyDeep(obj, arrayLike, stack) {
    var result = '';
    iterateWithCyclicCheck(obj, arrayLike, true, stack, function(key, val, cyc, stack) {
      result += cyc ? 'CYC' : key + stringify(val, stack);
    });
    return result;
  }

  function iterateWithCyclicCheck(obj, arrayLike, sortedKeys, stack, fn) {

    function next(key, val) {
      var cyc = false;

      // Allowing a step into the structure before triggering this check to save
      // cycles on standard JSON structures and also to try as hard as possible to
      // catch basic properties that may have been modified.
      if (stack.length > 1) {
        var i = stack.length;
        while (i--) {
          if (stack[i] === val) {
            cyc = true;
          }
        }
      }

      stack.push(val);
      fn(key, val, cyc, stack);
      stack.pop();
    }

    function iterateArrayLike(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (i in arr) {
          next(i, arr[i]);
        }
      }
    }

    function iterateWithSortedKeys() {
      // Sorted keys is required for stringify, where object order
      // does not matter but stringified order does.
      var arr = getKeys(obj).sort(), key;
      for (var i = 0; i < arr.length; i++) {
        key = arr[i];
        next(arr[i], obj[key]);
      }
    }

    // This method for checking for cyclic structures was egregiously stolen from
    // the ingenious method by @kitcambridge from the Underscore script:
    // https://github.com/documentcloud/underscore/issues/240
    if (!stack) stack = [];

    if (arrayLike) {
      iterateArrayLike(obj);
    } else if (sortedKeys) {
      iterateWithSortedKeys();
    } else {
      iterateOverObject(obj, next);
    }
  }


  // Array helpers

  function isArrayIndex(n) {
    return n >>> 0 == n && n != 0xFFFFFFFF;
  }

  function isArrayLike(obj, klass) {
    return isArray(obj, klass) || isArguments(obj, klass);
  }

  function isArguments(obj, klass) {
    klass = klass || className(obj);
    // .callee exists on Arguments objects in < IE8
    return hasProperty(obj, 'length') && (klass === '[object Arguments]' || !!obj.callee);
  }

  function iterateOverSparseArray(arr, fn, fromIndex, loop) {
    var indexes = getSparseArrayIndexes(arr, fromIndex, loop), index;
    for (var i = 0, len = indexes.length; i < len; i++) {
      index = indexes[i];
      fn.call(arr, arr[index], index, arr);
    }
    return arr;
  }

  // It's unclear whether or not sparse arrays qualify as "simple enumerables".
  // If they are not, however, the wrapping function will be deoptimized, so
  // isolate here (also to share between es5 and array modules).
  function getSparseArrayIndexes(arr, fromIndex, loop, fromRight) {
    var indexes = [], i;
    for (i in arr) {
      if (isArrayIndex(i) && (loop || (fromRight ? i <= fromIndex : i >= fromIndex))) {
        indexes.push(+i);
      }
    }
    indexes.sort(function(a, b) {
      var aLoop = a > fromIndex;
      var bLoop = b > fromIndex;
      if (aLoop !== bLoop) {
        return aLoop ? -1 : 1;
      }
      return a - b;
    });
    return indexes;
  }

  function getEntriesForIndexes(obj, find, loop, isString) {
    var result, length = obj.length;
    if (!isArray(find)) {
      return entryAtIndex(obj, find, length, loop, isString);
    }
    result = [];
    forEach(find, function(index) {
      result.push(entryAtIndex(obj, index, length, loop, isString));
    });
    return result;
  }

  function entryAtIndex(obj, index, length, loop, isString) {
    if (index && loop) {
      index = index % length;
    }
    if (index < 0) index = length + index;
    return isString ? obj.charAt(index) : obj[index];
  }

  function mapWithShortcuts(el, f, context, mapArgs) {
    if (!f) {
      return el;
    } else if (f.apply) {
      return f.apply(context, mapArgs || []);
    } else if (isArray(f)) {
      return f.map(function(m) {
        return mapWithShortcuts(el, m, context, mapArgs);
      });
    } else if (isFunction(el[f])) {
      return el[f].call(el);
    } else {
      return deepGetProperty(el, f);
    }
  }

  function commaSplit(arr) {
    return arr.split(HALF_WIDTH_COMMA);
  }

  function periodSplit(arr) {
    return arr.split(HALF_WIDTH_PERIOD);
  }

  function forEach(arr, fn) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (!(i in arr)) {
        return iterateOverSparseArray(arr, fn, i);
      }
      fn(arr[i], i);
    }
  }

  function filter(arr, fn) {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      var el = arr[i];
      if (i in arr && fn(el, i)) {
        result.push(el);
      }
    }
    return result;
  }

  function some(arr, fn) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (i in arr && fn(arr[i], i)) {
        return true;
      }
    }
    return false;
  }

  function map(arr, fn) {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      if (i in arr) {
        result.push(fn(arr[i], i));
      }
    }
    return result;
  }

  function indexOf(arr, el) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (i in arr && arr[i] === el) return i;
    }
    return -1;
  }

  // Number helpers

  var trunc = Math.trunc || function(n) {
    if (n === 0 || !isFinite(n)) return n;
    return n < 0 ? ceil(n) : floor(n);
  };

  function isRealNaN(obj) {
    // This is only true of NaN
    return obj != null && obj !== obj;
  }

  function withPrecision(val, precision, fn) {
    var multiplier = pow(10, abs(precision || 0));
    fn = fn || round;
    if (precision < 0) multiplier = 1 / multiplier;
    return fn(val * multiplier) / multiplier;
  }

  function padNumber(num, place, sign, base, replacement) {
    var str = abs(num).toString(base || 10);
    str = repeatString(replacement || '0', place - str.replace(/\.\d+/, '').length) + str;
    if (sign || num < 0) {
      str = (num < 0 ? '-' : '+') + str;
    }
    return str;
  }

  function getOrdinalSuffix(num) {
    if (num >= 11 && num <= 13) {
      return 'th';
    } else {
      switch(num % 10) {
        case 1:  return 'st';
        case 2:  return 'nd';
        case 3:  return 'rd';
        default: return 'th';
      }
    }
  }

  // Fullwidth number helpers
  var fullWidthNumberReg, fullWidthNumberMap, fullWidthNumbers;

  function buildFullWidthNumber() {
    var fwp = FULL_WIDTH_PERIOD, hwp = HALF_WIDTH_PERIOD, hwc = HALF_WIDTH_COMMA, fwn = '';
    fullWidthNumberMap = {};
    for (var i = 0, digit; i <= 9; i++) {
      digit = chr(i + FULL_WIDTH_ZERO);
      fwn += digit;
      fullWidthNumberMap[digit] = chr(i + HALF_WIDTH_ZERO);
    }
    fullWidthNumberMap[hwc] = '';
    fullWidthNumberMap[fwp] = hwp;
    // Mapping this to itself to capture it easily
    // in stringToNumber to detect decimals later.
    fullWidthNumberMap[hwp] = hwp;
    fullWidthNumberReg = allCharsReg(fwn + fwp + hwc + hwp);
    fullWidthNumbers = fwn;
  }

  // Takes into account full-width characters, commas, and decimals.
  function stringToNumber(str, base) {
    var sanitized, isDecimal;
    sanitized = str.replace(fullWidthNumberReg, function(chr) {
      var replacement = fullWidthNumberMap[chr];
      if (replacement === HALF_WIDTH_PERIOD) {
        isDecimal = true;
      }
      return replacement;
    });
    return isDecimal ? parseFloat(sanitized) : parseInt(sanitized, base || 10);
  }

  // Math aliases
  var abs   = Math.abs,
      pow   = Math.pow,
      min   = Math.min,
      max   = Math.max,
      ceil  = Math.ceil,
      floor = Math.floor,
      round = Math.round;


  // String helpers

  var chr = String.fromCharCode;

  function trim(str) {
    return str.trim();
  }

  function repeatString(str, num) {
    var result = '';
    str = str.toString();
    while (num > 0) {
      if (num & 1) {
        result += str;
      }
      if (num >>= 1) {
        str += str;
      }
    }
    return result;
  }

  function simpleCapitalize(str) {
    return str.slice(0,1).toUpperCase() + str.slice(1).toLowerCase();
  }

  function capitalizeWithoutDowncasing(word) {
    return word.replace(/^\W*[a-z]/, function(w) {
      return w.toUpperCase();
    });
  }

  function createFormatMatcher(bracketMatcher, percentMatcher, precheck) {

    var reg = STRING_FORMAT_REG;
    var compiledFormats = {};

    function getToken(format, match) {
      var get, token, literal, fn;
      var bKey = match[2];
      var pLit = match[3];
      var pKey = match[5];
      if (match[4] && percentMatcher) {
        token = pKey;
        get = percentMatcher;
      } else if (bKey) {
        token = bKey;
        get = bracketMatcher;
      } else if (pLit && percentMatcher) {
        literal = pLit;
      } else {
        literal = match[1] || match[0];
      }
      if (get) {
        assertPassesPrecheck(precheck, bKey, pKey);
        fn = function(obj, opt) {
          return get(obj, token, opt);
        }
      }
      format.push(fn || getLiteral(literal));
    }

    function getSubstring(format, str, start, end) {
      if (end > start) {
        var sub = str.slice(start, end);
        assertNoUnmatched(sub, OPEN_BRACE);
        assertNoUnmatched(sub, CLOSE_BRACE);
        format.push(function() {
          return sub;
        });
      }
    }

    function getLiteral(str) {
      return function() {
        return str;
      }
    }

    function assertPassesPrecheck(precheck, bt, pt) {
      if (precheck && !precheck(bt, pt)) {
        throw new TypeError('Invalid token '+ (bt || pt) +' in format string.');
      }
    }

    function assertNoUnmatched(str, chr) {
      if (str.indexOf(chr) !== -1) {
        throw new TypeError('Unmatched '+ chr +' in format string.');
      }
    }

    function compile(str) {
      var format = [], lastIndex = 0, match;
      reg.lastIndex = 0;
      while(match = reg.exec(str)) {
        getSubstring(format, str, lastIndex, match.index);
        getToken(format, match);
        lastIndex = reg.lastIndex;
      }
      getSubstring(format, str, lastIndex, str.length);
      return compiledFormats[str] = format;
    }

    return function(str, obj, opt) {
      var format = compiledFormats[str] || compile(str), result = '';
      for (var i = 0; i < format.length; i++) {
        result += format[i](obj, opt);
      }
      return result;
    }
  }

  // RegExp helpers

  function allCharsReg(src) {
    return RegExp('[' + src + ']', 'g');
  }

  function getRegExpFlags(reg, add) {
    var flags = '';
    add = add || '';
    function checkFlag(prop, flag) {
      if (prop || add.indexOf(flag) > -1) {
        flags += flag;
      }
    }
    checkFlag(reg.multiline, 'm');
    checkFlag(reg.ignoreCase, 'i');
    checkFlag(reg.global, 'g');
    checkFlag(reg.sticky, 'y');
    return flags;
  }

  function escapeRegExp(str) {
    if (!isString(str)) str = String(str);
    return str.replace(/([\\\/\'*+?|()\[\]{}.^$-])/g,'\\$1');
  }


  // Date helpers

  var _utc = privatePropertyAccessor('utc');

  function callDateGet(d, method) {
    return d['get' + (_utc(d) ? 'UTC' : '') + method]();
  }

  function callDateSet(d, method, value) {
    if (value === callDateGet(d, method, value)) {
      // Do not set the date if the value is the same as what is currently set.
      // Setting should in theory be a noop, but causes unintentional timezone
      // shifts when in the middle of a DST fallback.
      return d.getTime();
    }
    return d['set' + (_utc(d) ? 'UTC' : '') + method](value);
  }


  buildClassChecks();
  buildFullWidthNumber();
  'use strict';

  /***
   * @module ES6
   * @description Methods that provide some basic ES6 compatibility. This module
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
     * @method includes(<search>, [pos] = 0)
     * @returns Boolean
     * @polyfill es6
     * @short Returns true if <search> is contained within the string.
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
     * @method startsWith(<search>, [pos] = 0)
     * @returns Boolean
     * @polyfill es6
     * @short Returns true if the string starts with substring <search>.
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
     * @method endsWith(<search>, [pos] = length)
     * @returns Boolean
     * @polyfill es6
     * @short Returns true if the string ends with substring <search>.
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
     * @polyfill es6
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

  defineStaticPolyfill(sugarNumber, {

    /***
     * @method isNaN(<value>)
     * @returns Boolean
     * @polyfill es6
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
     * @method Array.from(<a>, [map], [context])
     * @returns Mixed
     * @polyfill es6
     * @short Creates an array from an array-like object.
     * @extra If a function is passed for [map], it will be map each element of
     *        the array. [context] is the `this` object if passed.
     *
     * @callback map
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
        arr = new this(len);
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
  'use strict';

  /***
   * @module ES7
   * @description Methods that provide some basic ES7 compatibility. This module
   *              provides the base for Sugar functionality, but is not a full
   *              polyfill suite.
   *
   ***/


  /*** @namespace Array ***/

  function sameValueZero(a, b) {
    if (isRealNaN(a)) {
      return isRealNaN(b);
    }
    return a === b ? a !== 0 || 1 / a === 1 / b : false;
  }

  defineInstancePolyfill(sugarArray, {

    /***
     * @method includes(<search>, [fromIndex] = 0)
     * @returns Boolean
     * @polyfill es7
     * @short Returns true if <search> is contained within the array.
     * @extra Search begins at [fromIndex], which defaults to the beginning of the
     *        array.
     *
     * @example
     *
     *   [1,2,3].includes(2)    -> true
     *   [1,2,3].includes(4)    -> false
     *   [1,2,3].includes(2, 3) -> false
     *
     ***/
    'includes': function(search) {
      // Force compiler to respect argument length.
      var argLen = arguments.length, fromIndex = arguments[1];
      var arr = this, len;
      if (isString(arr)) return arr.includes(search, fromIndex);
      fromIndex = fromIndex ? fromIndex.valueOf() : 0;
      len = arr.length;
      if (fromIndex < 0) {
        fromIndex = max(0, fromIndex + len);
      }
      for (var i = fromIndex; i < len; i++) {
        if (sameValueZero(search, arr[i])) {
          return true;
        }
      }
      return false;
    }

  });
  'use strict';

  /***
   * @module Date
   * @description Date parsing and formatting, relative formats like "1 minute ago",
   *              Number methods like "daysAgo", locale support with default English
   *              locale definition.
   *
   ***/

  var TIME_FORMAT = ['ampm','hour','minute','second','ampm','utc','offsetSign','offsetHours','offsetMinutes','ampm'];
  var LOCALE_FIELDS = ['months','weekdays','units','numbers','articles','tokens','timeMarker','ampm','timeSuffixes','parse','timeParse','modifiers'];

  var DECIMAL_REG       = '(?:[,.]\\d+)?';
  var REQUIRED_TIME_REG = '({t})?\\s*(\\d{1,2}{d})(?:{h}([0-5]\\d{d})?{m}(?::?([0-5]\\d'+DECIMAL_REG+'){s})?\\s*(?:({t})|(Z)|(?:([+-])(\\d{2,2})(?::?(\\d{2,2}))?)?)?|\\s*({t}))';

  var TIMEZONE_ABBREVIATION_REG = /(\w{3})[()\s\d]*$/;

  var MINUTE = 60 * 1000;

  var CONSTANT_FORMATS = {
    'ISO8601': '{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{SSS}{Z}',
    'RFC1123': '{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {tz}',
    'RFC1036': '{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {tz}'
  };

  // ISO Defaults
  var ISO_FIRST_DAY_OF_WEEK = 1,
      ISO_FIRST_DAY_OF_WEEK_YEAR = 4;

  // CJK digits
  var cjkDigitMap, cjkDigitReg;

  // A hash of date units by name
  var dateUnitsByName;

  // Format tokens by name
  var ldmlTokens = {},
      strfTokens = {};

  // Core formats common to every locale
  var CoreDateFormats = [
    {
      iso: true,
      time: true,
      match: 'yearSign,year,month,date',
      src:'([+-])?(\\d{4,4})[-.\\/]?{fullMonth}[-.]?(\\d{1,2})?'
    },
    {
      time: true,
      variant: true,
      match: 'date,month,year',
      src: '(\\d{1,2})[-.\\/]{fullMonth}(?:[-.\\/](\\d{2,4}))?'
    },
    {
      match: 'month,year',
      src: '{fullMonth}[-.](\\d{4,4})'
    },
    {
      match: 'timestamp',
      src: '\\/Date\\((\\d+(?:[+-]\\d{4,4})?)\\)\\/'
    }
  ];

  var FormatTokensBase = [
    {
      ldml: 'Dow',
      strf: 'a',
      lowerToken: 'dow',
      get: function(d, localeCode) {
        return localeManager.get(localeCode).getAbbreviatedWeekdayName(getWeekday(d));
      }
    },
    {
      ldml: 'Weekday',
      strf: 'A',
      lowerToken: 'weekday',
      get: function(d, localeCode) {
        return localeManager.get(localeCode).getWeekdayName(getWeekday(d));
      }
    },
    {
      ldml: 'Mon',
      strf: 'b,h',
      lowerToken: 'mon',
      get: function(d, localeCode) {
        return localeManager.get(localeCode).getAbbreviatedMonthName(getMonth(d));
      }
    },
    {
      ldml: 'Month',
      strf: 'B',
      lowerToken: 'month',
      allowAlternates: true,
      get: function(d, localeCode, alternate) {
        return localeManager.get(localeCode).getMonthName(getMonth(d), alternate);
      }
    },
    {
      strf: 'C',
      get: function(d) {
        return getYear(d).toString().slice(0, 2);
      }
    },
    {
      ldml: 'd,date,day',
      strf: 'd',
      strfPadding: 2,
      ldmlPaddedToken: 'dd',
      ordinalToken: 'do',
      get: function(d) {
        return getDate(d);
      }
    },
    {
      strf: 'e',
      get: function(d) {
        return padNumber(getDate(d), 2, false, 10, ' ');
      }
    },
    {
      ldml: 'H,24hr',
      strf: 'H',
      strfPadding: 2,
      ldmlPaddedToken: 'HH',
      get: function(d) {
        return getHours(d);
      }
    },
    {
      ldml: 'h,hours,12hr',
      strf: 'I',
      strfPadding: 2,
      ldmlPaddedToken: 'hh',
      get: function(d) {
        return getHours(d) % 12 || 12;
      }
    },
    {
      ldml: 'D',
      strf: 'j',
      strfPadding: 3,
      ldmlPaddedToken: 'DDD',
      get: function(d) {
        var s = resetUnitAndLower(cloneDate(d), 'month');
        return daysSince(d, s) + 1;
      }
    },
    {
      ldml: 'M',
      strf: 'm',
      strfPadding: 2,
      ordinalToken: 'Mo',
      ldmlPaddedToken: 'MM',
      get: function(d) {
        return getMonth(d) + 1;
      }
    },
    {
      ldml: 'm,minutes',
      strf: 'M',
      strfPadding: 2,
      ldmlPaddedToken: 'mm',
      get: function(d) {
        return callDateGet(d, 'Minutes');
      }
    },
    {
      ldml: 'Q',
      get: function(d) {
        return ceil((getMonth(d) + 1) / 3);
      }
    },
    {
      ldml: 'TT',
      strf: 'p',
      get: function(d, localeCode) {
        return getMeridianForDate(d, localeCode);
      }
    },
    {
      ldml: 'tt',
      strf: 'P',
      get: function(d, localeCode) {
        return getMeridianForDate(d, localeCode).toLowerCase();
      }
    },
    {
      ldml: 'T',
      lowerToken: 't',
      get: function(d, localeCode) {
        return getMeridianForDate(d, localeCode).charAt(0);
      }
    },
    {
      ldml: 's,seconds',
      strf: 'S',
      strfPadding: 2,
      ldmlPaddedToken: 'ss',
      get: function(d) {
        return callDateGet(d, 'Seconds');
      }
    },
    {
      ldml: 'S,ms',
      strfPadding: 3,
      ldmlPaddedToken: 'SSS',
      get: function(d) {
        return callDateGet(d, 'Milliseconds');
      }
    },
    {
      ldml: 'e',
      strf: 'u',
      ordinalToken: 'eo',
      get: function(d) {
        return getWeekday(d) || 7;
      }
    },
    {
      strf: 'U',
      strfPadding: 2,
      get: function(d) {
        // Sunday first, 0-53
        return getWeekNumber(d, false, 0);
      }
    },
    {
      ldml: 'W',
      strf: 'V',
      strfPadding: 2,
      ordinalToken: 'Wo',
      ldmlPaddedToken: 'WW',
      get: function(d) {
        // Monday first, 1-53 (ISO8601)
        return getWeekNumber(d, true);
      }
    },
    {
      strf: 'w',
      get: function(d) {
        return getWeekday(d);
      }
    },
    {
      ldml: 'w',
      ordinalToken: 'wo',
      ldmlPaddedToken: 'ww',
      get: function(d, localeCode) {
        // Locale dependent, 1-53
        var loc = localeManager.get(localeCode),
            dow = loc.getFirstDayOfWeek(localeCode),
            doy = loc.getFirstDayOfWeekYear(localeCode);
        return getWeekNumber(d, true, dow, doy);
      }
    },
    {
      strf: 'W',
      strfPadding: 2,
      get: function(d) {
        // Monday first, 0-53
        return getWeekNumber(d, false);
      }
    },
    {
      ldmlPaddedToken: 'gggg',
      ldmlTwoDigitToken: 'gg',
      get: function(d, localeCode) {
        return getWeekYear(d, localeCode);
      }
    },
    {
      strf: 'G',
      strfPadding: 4,
      strfTwoDigitToken: 'g',
      ldmlPaddedToken: 'GGGG',
      ldmlTwoDigitToken: 'GG',
      get: function(d, localeCode) {
        return getWeekYear(d, localeCode, true);
      }
    },
    {
      ldml: 'year',
      ldmlPaddedToken: 'yyyy',
      ldmlTwoDigitToken: 'yy',
      strf: 'Y',
      strfPadding: 4,
      strfTwoDigitToken: 'y',
      get: function(d) {
        return getYear(d);
      }
    },
    {
      ldml: 'tz,ZZ',
      strf: 'z',
      get: function(d) {
        return getUTCOffset(d);
      }
    },
    {
      ldml: 'X',
      get: function(d) {
        return trunc(d.getTime() / 1000);
      }
    },
    {
      ldml: 'x',
      get: function(d) {
        return d.getTime();
      }
    },
    {
      ldml: 'Z',
      get: function(d) {
        return getUTCOffset(d, true);
      }
    },
    {
      ldml: 'z',
      strf: 'Z',
      get: function(d) {
        // Note that this is not accurate in all browsing environments!
        // https://github.com/moment/moment/issues/162
        // It will continue to be supported for Node and usage with the
        // understanding that it may be blank.
        var match = d.toString().match(TIMEZONE_ABBREVIATION_REG);
        return match ? match[1]: '';
      }
    },
    {
      strf: 'D',
      alias: '%m/%d/%y'
    },
    {
      strf: 'F',
      alias: '%Y-%m-%d'
    },
    {
      strf: 'r',
      alias: '%I:%M:%S %p'
    },
    {
      strf: 'R',
      alias: '%H:%M'
    },
    {
      strf: 'T',
      alias: '%H:%M:%S'
    },
    {
      strf: 'x',
      alias: '{short}'
    },
    {
      strf: 'X',
      alias: '{time}'
    },
    {
      strf: 'c',
      alias: '{stamp}'
    }
  ];

  var DateUnits = [
    {
      name: 'millisecond',
      method: 'Milliseconds',
      multiplier: 1,
      start: 0,
      end: 999
    },
    {
      name: 'second',
      method: 'Seconds',
      multiplier: 1000,
      start: 0,
      end: 59
    },
    {
      name: 'minute',
      method: 'Minutes',
      multiplier: 60 * 1000,
      start: 0,
      end: 59
    },
    {
      name: 'hour',
      method: 'Hours',
      multiplier: 60 * 60 * 1000,
      start: 0,
      end: 23
    },
    {
      name: 'day',
      method: 'Date',
      higher: true,
      resetValue: 1,
      multiplier: 24 * 60 * 60 * 1000,
      start: 1,
      end: function(d) {
        return daysInMonth(d);
      }
    },
    {
      name: 'week',
      method: 'ISOWeek',
      higher: true,
      resetValue: 1,
      multiplier: 7 * 24 * 60 * 60 * 1000
    },
    {
      name: 'month',
      method: 'Month',
      higher: true,
      multiplier: 30.4375 * 24 * 60 * 60 * 1000,
      start: 0,
      end: 11
    },
    {
      name: 'year',
      method: 'FullYear',
      higher: true,
      multiplier: 365.25 * 24 * 60 * 60 * 1000,
      start: 0
    }
  ];


  /***
   * @method newDateInternal([fn])
   * @returns Mixed
   * @accessor
   * @short Gets or sets Sugar's internal date constructor.
   * @extra Many methods construct a `new Date()` internally as a reference point
   *        (`isToday`, relative formats like `tomorrow`, etc). You can override
   *        this here if you need it to be something else. Most commonly, this
   *        allows you to return a shifted date to simulate a specific timezone,
   *        as dates in Javascript are always local. Setting to `null` restores
   *        the default.
   *
   * @example
   *
   *   Sugar.Date.newDateInternal(function() {
   *     var d = new Date(), offset;
   *     offset = (d.getTimezoneOffset() - 600) * 60 * 1000;
   *     d.setTime(d.getTime() + offset); // Hawaii time!
   *     return d;
   *   });
   *
   ***/
  var _newDateInternal = defineAccessor(sugarDate, 'newDateInternal', defaultNewDate);


  function setDateChainableConstructor() {
    setChainableConstructor(sugarDate, isDate, createDate);
  }

  // General helpers

  function tzOffset(d) {
    return d.getTimezoneOffset();
  }

  function arrayToAlternates(arr) {
    return filter(arr, function(el) {
      return !!el;
    }).join('|');
  }

  function getNewDate() {
    return _newDateInternal()();
  }

  function getNewDateIsDefault() {
    return _newDateInternal() === defaultNewDate;
  }

  function defaultNewDate() {
    return new Date;
  }

  function cloneDate(d) {
    // Rhino environments have a bug where new Date(d) truncates
    // milliseconds so need to call getTime() here.
    var clone = new Date(d.getTime());
    _utc(clone, !!_utc(d));
    return clone;
  }

  function getHours(d) {
    return callDateGet(d, 'Hours');
  }

  function getWeekday(d) {
    return callDateGet(d, 'Day');
  }

  function getDate(d) {
    return callDateGet(d, 'Date');
  }

  function getMonth(d) {
    return callDateGet(d, 'Month');
  }

  function getYear(d) {
    return callDateGet(d, 'FullYear');
  }

  function setDate(d, val) {
    return callDateSet(d, 'Date', val);
  }

  function setMonth(d, val) {
    return callDateSet(d, 'Month', val);
  }

  function setYear(d, val) {
    return callDateSet(d, 'FullYear', val);
  }

  // Normal callDateSet method with ability
  // to handle ISOWeek setting as well.
  function callDateSetWithWeek(d, method, value) {
    if (method === 'ISOWeek') {
      return setISOWeekNumber(d, value);
    } else {
      return callDateSet(d, method, value);
    }
  }

  function isValid(d) {
    return !isNaN(d.getTime());
  }

  // UTC helpers

  function isUTC(d) {
    return !!_utc(d) || tzOffset(d) === 0;
  }

  function getUTCOffset(d, iso) {
    var offset = _utc(d) ? 0 : tzOffset(d), hours, mins, colon;
    colon  = iso === true ? ':' : '';
    if (!offset && iso) return 'Z';
    hours = padNumber(trunc(-offset / 60), 2, true);
    mins = padNumber(abs(offset % 60), 2);
    return  hours + colon + mins;
  }

  // Date argument helpers

  function collectDateArguments(args, duration) {
    var arg1 = args[0], arg2 = args[1];
    if (duration && isString(arg1)) {
      return [getDateParamsFromString(arg1), arg2];
    } else if (isNumber(arg1) && isNumber(arg2)) {
      return collectParamsFromArguments(args);
    } else {
      if (isObjectType(arg1)) {
        args[0] = simpleClone(arg1);
      }
      return args;
    }
  }

  function collectParamsFromArguments(args) {
    var obj = {}, u = dateUnitsByName['year'];
    while (u && isNumber(args[0])) {
      obj[u.name] = args[0];
      args.splice(0, 1);
      u = u.lower;
    }
    args.unshift(obj);
    return args;
  }

  function getDateParamsFromString(str) {
    var match, num, params = {};
    match = str.match(/^(-?\d+)?\s?(\w+?)s?$/i);
    if (match) {
      if (isUndefined(num)) {
        num = +match[1];
        if (isNaN(num)) {
          num = 1;
        }
      }
      params[match[2].toLowerCase()] = num;
    }
    return params;
  }

  // Date iteration helpers

  // Milliseconds -> Years
  function iterateOverDateUnits(fn, from, to) {
    var i = from || 0, inc, unit, result;
    if (isUndefined(to)) to = 7;
    inc = i > to ? -1 : 1;
    while (result !== false) {
      unit = DateUnits[i];
      result = fn(unit.name, unit, i);
      if (i === to) {
        break;
      }
      i += inc;
    }
  }

  // Years -> Milliseconds
  function iterateOverDateUnitsReverse(fn) {
    iterateOverDateUnits(fn, 7, 0);
  }

  // Days -> Years
  function iterateOverHigherDateUnits(fn) {
    iterateOverDateUnits(fn, 4, 7);
  }

  // Seconds -> Hours
  function iterateOverLowerDateUnits(fn) {
    iterateOverDateUnits(fn, 1, 3);
  }

  // Date shifting helpers

  function advanceDate(d, unit, num, reset) {
    var set = {};
    set[unit] = num;
    return updateDate(d, set, reset, 1);
  }

  function advanceDateWithArgs(d, args, dir) {
    var set = collectDateArguments(args, true);
    return updateDate(d, set[0], set[1], dir);
  }

  // Ex. "hours" -> "milliseconds"
  function resetUnitAndLower(d, unit) {
    return setUnitAndLowerToEdge(d, dateUnitsByName[unit || 'hours']);
  }

  // Ex. set "month" to either 0 or 11. Note that "moveToEdgeOfUnit" is similar
  // to this, only one unit higher, ie moving to the beginning of the year is
  // equivalent to setting the months to 0. However, this method does not support
  // weeks, as 1) this decouples locale considerations, and 2) although moving to
  // the edge of a week shifts the day, moving the day as a unit implies months
  // as the higher unit, not weeks. Making this separation means we can handle
  // weeks only if required.
  function setUnitAndLowerToEdge(d, u, end) {
    while (u) {
      var val = end ? u.end : u.start;
      if (isFunction(val)) {
        val = val(d);
      }
      callDateSet(d, u.method, val);
      u = u.lower;
    }
    return d;
  }

  function dateParamKey(params, key) {
    return isDefined(params[key]) ? key : key + 's';
  }

  function getDateParam(params, key) {
    return params[dateParamKey(params, key)];
  }

  function deleteDateParam(params, key) {
    delete params[dateParamKey(params, key)];
  }

  function dateParamIsDefined(params, key) {
    return isDefined(getDateParam(params, key));
  }

  function resetTime(d) {
    callDateSet(d, 'Hours', 0);
    callDateSet(d, 'Minutes', 0);
    callDateSet(d, 'Seconds', 0);
    callDateSet(d, 'Milliseconds', 0);
    return d;
  }

  function setWeekday(d, dow, dir) {
    if (!isNumber(dow)) return;
    var currentWeekday = getWeekday(d);
    if (dir) {
      // Allow a "direction" parameter to determine whether a weekday can
      // be set beyond the current weekday in either direction.
      var ndir = dir > 0 ? 1 : -1;
      var offset = dow % 7 - currentWeekday;
      if (offset && offset / abs(offset) !== ndir) {
        dow += 7 * ndir;
      }
    }
    return setDate(d, getDate(d) + dow - currentWeekday);
  }

  function moveToEdgeOfUnit(d, unit, localeCode, edgeOfWeek, end) {
    var lower;
    if (unit === 'week') {
      edgeOfWeek(d, localeManager.get(localeCode).getFirstDayOfWeek());
      lower = dateUnitsByName['hours'];
    } else {
      lower = dateUnitsByName[unit].lower;
    }
    return setUnitAndLowerToEdge(d, lower, end);
  }

  function moveToBeginningOfUnit(d, unit, localeCode) {
    return moveToEdgeOfUnit(d, unit, localeCode, moveToBeginningOfWeek);
  }

  function moveToEndOfUnit(d, unit, localeCode) {
    return moveToEdgeOfUnit(d, unit, localeCode, moveToEndOfWeek, true);
  }

  function daysSince(d1, d2) {
    return getTimeDistanceForUnit(d1, d2, dateUnitsByName['day']);
  }

  function getTimeDistanceForUnit(d1, d2, u) {
    var fwd = d2 > d1, num, tmp;
    if (!fwd) {
      tmp = d2;
      d2  = d1;
      d1  = tmp;
    }
    num = d2 - d1;
    if (u.multiplier > 1) {
      num = trunc(num / u.multiplier);
    }
    // For higher order with potential ambiguity, use the numeric calculation
    // as a starting point, then iterate until we pass the target date.
    if (u.higher) {
      d1 = cloneDate(d1);
      advanceDate(d1, u.name, num);
      while (d1 < d2) {
        advanceDate(d1, u.name, 1);
        if (d1 > d2) {
          break;
        }
        num += 1;
      }
    }
    return fwd ? -num : num;
  }

  // Date parsing helpers

  function getFormatMatch(match, arr) {
    var obj = {}, value, num;
    forEach(arr, function(key, i) {
      value = match[i + 1];
      if (isUndefined(value) || value === '') return;
      if (key === 'year') {
        obj.yearAsString = value.replace(/'/, '');
      }
      num = parseFloat(value.replace(/'/, '').replace(/,/, HALF_WIDTH_PERIOD));
      obj[key] = !isNaN(num) ? num : value.toLowerCase();
    });
    return obj;
  }

  function cleanDateInput(str) {
    str = trim(str).replace(/^just (?=now)|\.+$/i, '');
    return convertAsianDigits(str);
  }

  function convertAsianDigits(str) {
    return str.replace(cjkDigitReg, function(full, disallowed, match) {
      var sum = 0, place = 1, lastWasHolder, lastHolder;
      if (disallowed) return full;
      forEach(match.split('').reverse(), function(letter) {
        var value = cjkDigitMap[letter], holder = value > 9;
        if (holder) {
          if (lastWasHolder) sum += place;
          place *= value / (lastHolder || 1);
          lastHolder = value;
        } else {
          if (lastWasHolder === false) {
            place *= 10;
          }
          sum += place * value;
        }
        lastWasHolder = holder;
      });
      if (lastWasHolder) sum += place;
      return sum;
    });
  }

  function getDateOptions(opt) {
    var options = isString(opt) ? { locale: opt } : opt || {};
    options.prefer = +!!options.future - +!!options.past;
    return options;
  }

  function getExtendedDate(contextDate, d, opt) {

    var date, set, options, baseLocale, afterCallbacks, weekdayDir;

    afterCallbacks = [];
    options = getDateOptions(opt);

    function afterDateSet(fn) {
      afterCallbacks.push(fn);
    }

    function fireCallbacks() {
      forEach(afterCallbacks, function(fn) {
        fn.call();
      });
    }

    function getWeekdayWithMultiplier(weekday, loc) {
      var num;
      if (set.num && !set.unit) {
        num = loc.getNumber(set.num);
      }
      num = num && !set.unit ? num : 1;
      return (7 * (num - 1)) + weekday;
    }


    function handleRelativeUnit(loc) {
      var unitName, unitIndex, num, tmp;
      num = loc.getNumber(set.num);
      unitIndex = loc.getUnitIndex(set.unit);
      unitName  = English.unitsLower[unitIndex];

      // Relative date units such as "tomorrow" have already had their
      // "day" set above so assume 0 shift unless they are explicitly
      // using a shift or have a have a "sign" such as the form
      // "the day after tomorrow".
      if (!set.sign && !set.shift && unitIndex === 4) {
        num = 0;
      }

      // Formats like "the 15th of last month" or "6:30pm of next week"
      // contain absolute units in addition to relative ones, so separate
      // them here, remove them from the params, and set up a callback to
      // set them after the relative ones have been set.
      separateAbsoluteUnits(loc, unitIndex);

      if (set.shift) {
        // Shift and unit, ie "next month", "last week", etc.
        tmp = loc.findModifier(set, 'shift');
        if (tmp) {
          num *= tmp.value;
        }
      }

      if (set.sign && (tmp = loc.findModifier(set, 'sign'))) {
        // Unit and sign, ie "months ago", "weeks from now", etc.
        num *= tmp.value;
      }

      if (isDefined(set.weekday)) {
        // Units can be with non-relative dates, set here. ie "the day after monday"
        updateDate(date, { weekday: set.weekday }, true);
        delete set.weekday;
      }

      // Finally shift the unit.
      set[unitName] = (set[unitName] || 0) + num;
    }

    function handleUnitEdge(loc) {
      // If there is an "edge" it needs to be set after the other fields are set.
      // ie "the end of February". If there are any weekdays to be set, then they
      // need to be removed until after the edge is set.
      var weekday = set.weekday;
      delete set.weekday;
      afterDateSet(function() {
        if (isDefined(weekday)) {
          set.weekday = weekday;
        }
        setUnitEdge(loc, set);
      });
    }

    function separateAbsoluteUnits(loc, unitIndex) {
      var params;
      iterateOverDateUnits(function(name, u, i) {
        if (name === 'day') name = 'date';
        if (dateParamIsDefined(set, name)) {
          // If there is a time unit set that is more specific than
          // the matched unit we have a string like "5:30am in 2 minutes",
          // which is meaningless, so invalidate the date.
          if (i >= unitIndex) {
            invalidateDate(date);
            return false;
          }
          // ...otherwise set the params to set the absolute date
          // as a callback after the relative date has been set.
          params = params || {};
          params[name] = getDateParam(set, name);
          deleteDateParam(set, name);
        }
      });
      if (params) {
        afterDateSet(function() {
          updateDate(date, params, true);
        });
        if (set.edge) {
          // Allow formats like "the end of March of next year"
          params.edge = set.edge;
          afterDateSet(function() {
            setUnitEdge(loc, params);
          });
          delete set.edge;
        }
      }
    }

    function setUnitEdge(loc, params) {
      var val = loc.findModifier(params, 'edge').value, localeCode, unit;
      localeCode = options.locale;
      iterateOverHigherDateUnits(function(name) {
        if (isDefined(params[name])) {
          unit = name;
          return false;
        }
      });
      if (unit === 'year') {
        params.specificity = 'month';
      } else if (unit === 'month' || unit === 'week') {
        params.specificity = 'day';
      }
      // "edge" values that are at the very edge are "2" so the beginning of the
      // year is -2 and the end of the year is 2. Conversely, the "last day" is
      // actually 00:00am so it is 1. -1 is reserved but unused for now.
      if (val < 0) {
        moveToBeginningOfUnit(date, unit, localeCode);
      } else {
        moveToEndOfUnit(date, unit, localeCode);
        if (val === 1) {
          resetTime(date);
        }
      }
      if (isDefined(params.weekday)) {
        // If a weekday is defined then set it here. If we are at the end of the
        // month, then force a previous weekday otherwise force the next weekday.
        setWeekday(date, params.weekday, -val);
        resetTime(date);
      }
    }

    function handleAmericanVariant(loc, set) {
      if(!isString(set.month) && (isString(set.date) || loc.isMDY())) {
        var tmp = set.month;
        set.month = set.date;
        set.date  = tmp;
      }
    }

    function handleLocalizedRelativeDay(loc, mod) {
      resetTime(date);
      set.unit = loc.unitsLower[4];
      set.day = mod.value;
    }

    function handleLocalizedWeekday(loc, weekday) {
      // If the day is a weekday, then set that instead.
      delete set.day;
      delete set.weekday;
      set.weekday = getWeekdayWithMultiplier(weekday, loc);
      // The unit is now set to "day" so that shifting can occur.
      if (set.shift && !set.unit) {
        set.unit = loc.unitsLower[5];
      }
      if (set.num && set.month) {
        // If we have "the 2nd Tuesday of June", then pass the "weekdayDir"
        // flag along to updateDate so that the date does not accidentally traverse
        // into the previous month. This needs to be independent of the "prefer"
        // flag because we are only ensuring that the weekday is in the future, not
        // the entire date.
        weekdayDir = 1;
      }
    }

    function handleLocalizedHours(hours) {
      set.hours = hours % 24;
      if (hours > 23) {
        // If the date has hours past 24, we need to prevent it from traversing
        // into a new day as that trigger it being part of a new week in ambiguous
        // dates such as "Monday".
        afterDateSet(function() {
          advanceDate(date, 'date', trunc(hours / 24));
        });
      }
    }

    function handleTimezoneOffset() {
      // Adjust for timezone offset
      _utc(date, true);
      set.offsetMinutes = set.offsetMinutes || 0;
      set.offsetMinutes += set.offsetHours * 60;
      if (set.offsetSign === '-') {
        set.offsetMinutes *= -1;
      }
      set.minute -= set.offsetMinutes;
    }

    function handleFractionalTime() {
      iterateOverLowerDateUnits(function(name, u) {
        var value = set[name] || 0, fraction = value % 1;
        if (fraction) {
          set[u.lower.name] = round(fraction * (name === 'second' ? 1000 : 60));
          set[name] = trunc(value);
        }
      });
    }

    // Clone date will set the utc flag, but it will
    // be overriden later, so set option flags instead.
    function cloneDateByFlag(d) {
      var clone = new Date(d.getTime());
      if (_utc(d) && !isDefined(options.fromUTC)) {
        options.fromUTC = true;
      }
      if (_utc(d) && !isDefined(options.setUTC)) {
        options.setUTC = true;
      }
      return clone;
    }

    if (contextDate && d) {
      // If a context date is passed, (in the case of "get"
      // and "[unit]FromNow") then use it as the starting point.
      date = cloneDateByFlag(contextDate);
    } else {
      date = getNewDate();
    }

    _utc(date, options.fromUTC);

    if (isDate(d)) {
      date = cloneDateByFlag(d);
    } else if (isObjectType(d)) {
      set = simpleClone(d);
      updateDate(date, set, true);
    } else if (isNumber(d) || d === null) {
      date.setTime(d);
    } else if (isString(d)) {

      // The act of getting the locale will pre-initialize
      // if it is missing and add the required formats.
      baseLocale = localeManager.get(options.locale);

      // Clean the input and convert CJK based numerals if they exist.
      d = cleanDateInput(d);

      if (baseLocale) {

        iterateOverObject(baseLocale.getFormats(), function(i, dif) {
          var match = d.match(dif.reg), loc, tmp;
          if (match) {

            loc = dif.locale;
            set = getFormatMatch(match, dif.to, loc);
            loc.setCachedFormat(dif);

            if (set.utc) {
              _utc(date, true);
            }

            if (set.timestamp) {
              set = set.timestamp;
              return false;
            }

            if (dif.variant) {
              handleAmericanVariant(loc, set);
            }

            if (hasAbbreviatedYear(set)) {
              // If the year is 2 digits then get the implied century.
              set.year = getYearFromAbbreviation(date, set.year);
            }

            if (set.month) {
              // Set the month which may be localized.
              set.month = loc.getMonthValue(set.month);
              if (set.shift && !set.unit) set.unit = loc.unitsLower[7];
            }

            if (set.hours && (tmp = loc.findModifier(set, 'hours'))) {
              handleLocalizedHours(tmp.value);
            }

            if (set.day && (tmp = loc.findModifier(set, 'day'))) {
              // Relative day localizations such as "today" and "tomorrow".
              handleLocalizedRelativeDay(loc, tmp);
            } else if ((tmp = loc.getWeekdayValue(set.weekday || set.day)) > -1) {
              handleLocalizedWeekday(loc, tmp);
            }

            if (set.date && !isNumber(set.date)) {
              set.date = loc.getNumericDate(set.date);
            }

            if (loc.matchPM(set.ampm) && set.hour < 12) {
              // If the time is 1pm-11pm advance the time by 12 hours.
              set.hour += 12;
            } else if (loc.matchAM(set.ampm) && set.hour === 12) {
              // If it is 12:00am then set the hour to 0.
              set.hour = 0;
            }

            if (isNumber(set.offsetHours) || isNumber(set.offsetMinutes)) {
              handleTimezoneOffset();
            }

            if (set.unit) {
              handleRelativeUnit(loc);
            }

            if (set.edge) {
              handleUnitEdge(loc);
            }

            if (set.yearSign === '-') {
              set.year *= -1;
            }

            handleFractionalTime();

            return false;
          }
        });
      }
      if (!set) {
        // The Date constructor does something tricky like checking the number
        // of arguments so simply passing in undefined won't work.
        if (!/^now$/i.test(d)) {
          date = new Date(d);
        }
        if (options.fromUTC) {
          // Falling back to system date here which cannot be parsed as UTC,
          // so if we're forcing UTC then simply add the offset.
          date.setTime(date.getTime() + (tzOffset(date) * MINUTE));
        }
      } else if (set.unit) {
        // If a set has a unit ("days", etc), then it is relative to the current date.
        updateDate(date, set, false, 1);
      } else {
        if (_utc(date)) {
          // UTC times can traverse into other days or even months,
          // so preemtively reset the time here to prevent this.
          resetTime(date);
        }
        updateDate(date, set, true, 0, options.prefer, weekdayDir);
      }
      fireCallbacks();
    }
    // A date created by parsing a string presumes that the format *itself* is
    // UTC, but not that the date, once created, should be manipulated as such. In
    // other words, if you are creating a date object from a server time
    // "2012-11-15T12:00:00Z", in the majority of cases you are using it to create
    // a date that will, after creation, be manipulated as local, so reset the utc
    // flag here unless "setUTC" is also set.
    _utc(date, !!options.setUTC);
    return {
      date: date,
      set: set
    };
  }

  function hasAbbreviatedYear(obj) {
    return obj.yearAsString && obj.yearAsString.length === 2;
  }

  // If the year is two digits, add the most appropriate century prefix.
  function getYearFromAbbreviation(d, year) {
    return round(getYear(d) / 100) * 100 - round(year / 100) * 100 + year;
  }

  function setISOWeekNumber(d, num) {
    if (isNumber(num)) {
      // Consciously avoiding updateDate here to prevent circular dependencies.
      var isoWeek = cloneDate(d), dow = getWeekday(d);
      moveToFirstDayOfWeekYear(isoWeek, ISO_FIRST_DAY_OF_WEEK, ISO_FIRST_DAY_OF_WEEK_YEAR);
      setDate(isoWeek, getDate(isoWeek) + 7 * (num - 1));
      setYear(d, getYear(isoWeek));
      setMonth(d, getMonth(isoWeek));
      setDate(d, getDate(isoWeek));
      setWeekday(d, dow || 7);
    }
    return d.getTime();
  }

  function getWeekNumber(d, allowPrevious, firstDayOfWeek, firstDayOfWeekYear) {
    var isoWeek, n = 0;
    if (isUndefined(firstDayOfWeek)) {
      firstDayOfWeek = ISO_FIRST_DAY_OF_WEEK;
    }
    if (isUndefined(firstDayOfWeekYear)) {
      firstDayOfWeekYear = ISO_FIRST_DAY_OF_WEEK_YEAR;
    }
    // Moving to the end of the week allows for forward year traversal, ie
    // Dec 29 2014 is actually week 01 of 2015.
    isoWeek = moveToEndOfWeek(cloneDate(d), firstDayOfWeek);
    moveToFirstDayOfWeekYear(isoWeek, firstDayOfWeek, firstDayOfWeekYear);
    if (allowPrevious && d < isoWeek) {
      // If the date is still before the start of the year, then it should be
      // the last week of the previous year, ie Jan 1 2016 is actually week 53
      // of 2015, so move to the beginning of the week to traverse the year.
      isoWeek = moveToBeginningOfWeek(cloneDate(d), firstDayOfWeek);
      moveToFirstDayOfWeekYear(isoWeek, firstDayOfWeek, firstDayOfWeekYear);
    }
    while (isoWeek <= d) {
      // Doing a very simple walk to get the week number.
      setDate(isoWeek, getDate(isoWeek) + 7);
      n++;
    }
    return n;
  }

  function getWeekYear(d, localeCode, iso) {
    var year, month, firstDayOfWeek, firstDayOfWeekYear, week, loc;
    year = getYear(d);
    month = getMonth(d);
    if (month === 0 || month === 11) {
      if (!iso) {
        loc = localeManager.get(localeCode);
        firstDayOfWeek = loc.getFirstDayOfWeek(localeCode);
        firstDayOfWeekYear = loc.getFirstDayOfWeekYear(localeCode);
      }
      week = getWeekNumber(d, false, firstDayOfWeek, firstDayOfWeekYear);
      if (month === 0 && week === 0) {
        year -= 1;
      } else if (month === 11 && week === 1) {
        year += 1;
      }
    }
    return year;
  }

  function moveToEndOfWeek(d, firstDayOfWeek) {
    var target = firstDayOfWeek - 1;
    setWeekday(d, ceil((getWeekday(d) - target) / 7) * 7 + target);
    return d;
  }

  function moveToBeginningOfWeek(d, firstDayOfWeek) {
    setWeekday(d, floor((getWeekday(d) - firstDayOfWeek) / 7) * 7 + firstDayOfWeek);
    return d;
  }

  function moveToFirstDayOfWeekYear(d, firstDayOfWeek, firstDayOfWeekYear) {
    resetUnitAndLower(d, 'month');
    setDate(d, firstDayOfWeekYear);
    moveToBeginningOfWeek(d, firstDayOfWeek);
  }

  function daysInMonth(d) {
    return 32 - callDateGet(new Date(getYear(d), getMonth(d), 32), 'Date');
  }

  // Gets an "adjusted date unit" which is a way of representing
  // the largest possible meaningful unit. In other words, if passed
  // 3600000, this will return an array which represents "1 hour".
  function getAdjustedUnit(ms, fn) {
    var unitIndex = 0, value = 0;
    iterateOverDateUnitsReverse(function(name, u, i) {
      value = abs(fn(u));
      if (value >= 1) {
        unitIndex = i;
        return false;
      }
    });
    return [value, unitIndex, ms];
  }

  // Gets the adjusted unit based on simple division by
  // date unit multiplier.
  function getAdjustedUnitForNumber(ms) {
    return getAdjustedUnit(ms, function(unit) {
      return trunc(withPrecision(ms / unit.multiplier, 1));
    });
  }

  // Gets the adjusted unit using the [unit]FromNow methods,
  // which use internal date methods that neatly avoid vaguely
  // defined units of time (days in month, leap years, etc).
  function getAdjustedUnitForDate(d) {
    var compareDate = getNewDate(), ms;
    if (getNewDateIsDefault() && d > compareDate) {
      // If the internal getNewDate is default and the incoming date is
      // greater than it, that means that we are comparing some time in
      // the future to right now. However, commonly the incoming date
      // was created in the same cycle as our comparison, but our
      // getNewDate will have been created an instant after it, creating
      // situations where "5 minutes from now" becomes "4 minutes from now"
      // in the same tick. To prevent this, subtract 10ms to compensate.
      // Note that even with this compensation, some slower environments
      // will still report false test failures, but accepting this for now.
      compareDate = new Date(compareDate.getTime() - 10);
    }
    ms = d - compareDate;
    return getAdjustedUnit(ms, function(u) {
      return abs(getTimeDistanceForUnit(d, compareDate, u));
    });
  }

  function getMeridianForDate(d, localeCode) {
    var hours = getHours(d);
    return localeManager.get(localeCode).get('ampm')[trunc(hours / 12)] || '';
  }

  // Date formatting helpers


  // Format matcher for LDML or STRF tokens.
  var dateFormatMatcher = createFormatMatcher(getLdml, getStrf, checkDateToken);

  function checkDateToken(ldml, strf) {
    return ldmlTokens[ldml] || strfTokens[strf];
  }

  function getLdml(d, token, localeCode) {
    return ldmlTokens[token](d, localeCode);
  }

  function getStrf(d, token, localeCode) {
    return strfTokens[token](d, localeCode);
  }

  function formatDate(d, format, relative, localeCode) {
    var adu;
    if (!isValid(d)) {
      return 'Invalid Date';
    } else if (relative && isFunction(format)) {
      adu = getAdjustedUnitForDate(d);
      format = format.apply(d, adu.concat(localeManager.get(localeCode)));
    }
    if (relative && !format) {
      adu = adu || getAdjustedUnitForDate(d);
      // Adjust up if time is in ms, as this doesn't
      // look very good for a standard relative date.
      if (adu[1] === 0) {
        adu[1] = 1;
        adu[0] = 1;
      }
      return localeManager.get(localeCode).getRelativeFormat(adu);
    }
    format = CONSTANT_FORMATS[format] || format || '{long}';
    return dateFormatMatcher(format, d, localeCode);
  }

  // Date comparison helpers

  function fullCompareDate(date, d, margin) {
    var tmp;
    if (!isValid(date)) return;
    if (isString(d)) {
      d = trim(d).toLowerCase();
      switch(true) {
        case d === 'future':    return date.getTime() > getNewDate().getTime();
        case d === 'past':      return date.getTime() < getNewDate().getTime();
        case d === 'today':     return compareDay(date);
        case d === 'tomorrow':  return compareDay(date,  1);
        case d === 'yesterday': return compareDay(date, -1);
        case d === 'weekday':   return getWeekday(date) > 0 && getWeekday(date) < 6;
        case d === 'weekend':   return getWeekday(date) === 0 || getWeekday(date) === 6;

        case (tmp = indexOf(English.weekdaysLower, d) % 7) > -1:
          return getWeekday(date) === tmp;
        case (tmp = indexOf(English.monthsLower, d) % 12) > -1:
          return getMonth(date) === tmp;
      }
    }
    return compareDate(date, d, margin);
  }

  function compareDate(date, d, margin, options) {
    var p, t, min, max, override, loMargin = 0, hiMargin = 0;

    function getMaxBySpecificity() {
      var params = getDateParamsFromString('1 ' + p.set.specificity);
      return updateDate(cloneDate(p.date), params, false, 1).getTime() - 1;
    }

    if (_utc(date)) {
      options = options || {};
      options.fromUTC = true;
      options.setUTC = true;
    }
    p = getExtendedDate(null, d, options);

    if (margin > 0) {
      loMargin = hiMargin = margin;
      override = true;
    }
    if (!isValid(p.date)) return false;
    if (p.set && p.set.specificity) {
      if (p.set.edge || p.set.shift) {
        moveToBeginningOfUnit(p.date, p.set.specificity);
      }
      if (p.set.specificity === 'month') {
        max = moveToEndOfUnit(cloneDate(p.date), p.set.specificity).getTime();
      } else {
        max = getMaxBySpecificity();
      }
      if (!override && p.set.sign && p.set.specificity !== 'millisecond') {
        // If the time is relative, there can occasionally be an disparity between
        // the relative date and "now", which it is being compared to, so set an
        // extra margin to account for this.
        loMargin = 50;
        hiMargin = -50;
      }
    }
    t   = date.getTime();
    min = p.date.getTime();
    max = max || min;
    var timezoneShift = getTimezoneShift(date, p);
    if (timezoneShift) {
      min -= timezoneShift;
      max -= timezoneShift;
    }
    return t >= (min - loMargin) && t <= (max + hiMargin);
  }

  function compareDay(d, shift) {
    var comp = getNewDate();
    if (shift) {
      setDate(comp, getDate(comp) + shift);
    }
    return getYear(d) === getYear(comp) &&
           getMonth(d) === getMonth(comp) &&
           getDate(d) === getDate(comp);
  }

  function getTimezoneShift(d, p) {
    // If there is any specificity in the date then we're implicitly not
    // checking absolute time, so ignore timezone shifts.
    if (p.set && p.set.specificity) {
      return 0;
    }
    return (tzOffset(p.date) - tzOffset(d)) * MINUTE;
  }

  function updateDate(d, params, reset, advance, prefer, weekdayDir) {
    var specificityIndex, noop = true;

    function getParam(key) {
      return getDateParam(params, key);
    }

    function paramExists(key) {
      return dateParamIsDefined(params, key);
    }

    function uniqueParamExists(key, isDay) {
      return paramExists(key) || (isDay && paramExists('weekday') && !paramExists('month'));
    }

    function canDisambiguate() {
      switch(prefer) {
        case -1: return d > getNewDate();
        case  1: return d < getNewDate();
      }
    }

    function setUnit(u, advance, value) {
      var name = u.name, method = u.method, checkMonth;
      if (isUndefined(value)) return;

      noop = false;
      checkMonth = name === 'month' && getDate(d) > 28;

      // If we are advancing or rewinding, then we need we need to set the
      // absolute time if the unit is "hours" or less. This is due to the fact
      // that setting by method is ambiguous during DST shifts. For example,
      // 1:00am on November 1st 2015 occurs twice in North American timezones
      // with DST, the second time being after the clocks are rolled back at
      // 2:00am. When springing forward this is automatically handled as there
      // is no 2:00am so the date automatically jumps to 3:00am. However, when
      // rolling back, setHours(2) will always choose the first "2am" even if
      // the date is currently set to the second, causing unintended jumps.
      // This ambiguity is unavoidable when setting dates as the notation is
      // ambiguous. However when advancing, we clearly want the resulting date
      // to be an acutal hour ahead, which can only accomplished by setting the
      // absolute time. Conversely, any unit higher than "hours" MUST use the
      // internal set methods, as they are ambiguous as absolute units of time.
      // Years may be 365 or 366 days depending on leap years, months are all
      // over the place, and even days may be 23-25 hours depending on DST shifts.
      // Finally, the kind of jumping described above will happen if ANY "set"
      // method is called on the date, so compensating for this in callDateSet
      // by not calling any set methods if the value is the same.
      if (advance && !u.higher) {
        d.setTime(d.getTime() + (value * advance * u.multiplier));
        return;
      } else if (advance) {
        if (name === 'week') {
          value *= 7;
          method = 'Date';
        }
        value = (value * advance) + callDateGet(d, method);
      }
      callDateSetWithWeek(d, method, value);
      if (checkMonth && monthHasShifted(d, value)) {
        // As we are setting the units in reverse order, there is a chance that
        // our date may accidentally traverse into a new month, such as setting
        // { month: 1, date 15 } on January 31st. Check for this here and reset
        // the date to the last day of the previous month if this has happened.
        setDate(d, 0);
      }
    }

    if (isNumber(params) && advance) {
      // If param is a number and advancing, the number is in milliseconds.
      params = { milliseconds: params };
    } else if (isNumber(params)) {
      // Otherwise just set the timestamp and return.
      d.setTime(params);
      return d;
    }

    // "date" can also be passed for the day
    if (isDefined(params.date)) {
      params.day = params.date;
    }

    // Reset any unit lower than the least specific unit set. Do not do this for
    // weeks or for years. This needs to be performed before actually setting the
    // date because the order needs to be reversed in order to get the lowest
    // specificity, also because higher order units can be overridden by lower
    // order units, such as setting hour: 3, minute: 345, etc.
    iterateOverDateUnits(function(name, u, i) {
      var isDay = name === 'day';
      if (uniqueParamExists(name, isDay)) {
        params.specificity = name;
        specificityIndex = i;
        return false;
      } else if (reset && name !== 'week' && (!isDay || !paramExists('week'))) {
        // Days are relative to months, not weeks, so don't reset if a week exists.
        callDateSet(d, u.method, u.resetValue || 0);
      }
    });

    // Now actually set or advance the date in order, higher units first.
    iterateOverDateUnitsReverse(function(name, u) {
      setUnit(u, advance, getParam(name));
    });

    // If a weekday is included in the params and no 'date' parameter is
    // overriding, set it here after all other units have been set. Note that
    // the date has to be perfectly set before disambiguation so that a proper
    // comparison can be made.
    if (!advance && !paramExists('day') && paramExists('weekday')) {
      setWeekday(d, getParam('weekday'), weekdayDir);
    }

    // If no action has been taken on the date
    // then it should be considered invalid.
    if (noop && !params.specificity) {
      invalidateDate(d);
      return d;
    }

    // If past or future is preferred, then the process of "disambiguation" will
    // ensure that an ambiguous time/date ("4pm", "thursday", "June", etc.) will
    // be in the past or future. Weeks are only considered ambiguous if there is
    // a weekday, ie. "thursday" is an ambiguous week, but "the 4th" is an
    // ambiguous month.
    if (canDisambiguate()) {
      iterateOverDateUnits(function(name, u) {
        var ambiguous = u.higher && (name !== 'week' || paramExists('weekday'));
        if (ambiguous && !uniqueParamExists(name, name === 'day')) {
          setUnit(u, prefer, 1);
          return false;
        } else if (name === 'year' && hasAbbreviatedYear(params)) {
          setUnit(dateUnitsByName['year'], 100 * prefer, 1);
        }
      }, specificityIndex + 1);
    }
    return d;
  }

  function monthHasShifted(d, targetMonth) {
    if (targetMonth < 0) {
      targetMonth = targetMonth % 12 + 12;
    }
    return targetMonth % 12 !== getMonth(d);
  }

  function createDate(d, options) {
    return getExtendedDate(null, d, options).date;
  }

  function createDateWithContext(contextDate, d, options) {
    return getExtendedDate(contextDate, d, options).date;
  }

  function invalidateDate(d) {
    d.setTime(NaN);
  }

  function buildDateUnits() {
    dateUnitsByName = {};
    forEach(DateUnits, function(u, i) {
      var name = u.name;
      // Skip week entirely.
      if (name !== 'week') {
        dateUnitsByName[name] = u;
        dateUnitsByName[name + 's'] = u;
        // Build a chain of lower units.
        u.lower = DateUnits[i - (name === 'month' ? 2 : 1)];
      }
    });
    dateUnitsByName['date'] = dateUnitsByName['day'];
  }

  /***
   * @method [units]Since([d], [options])
   * @returns Number
   * @short Returns the time since [d].
   * @extra [d] will accept a date object, timestamp, or string. If not specified,
   *        [d] is assumed to be now. `[unit]Ago` is provided as an alias to make
   *        this more readable when [d] is assumed to be the current date. See
   *        `Date.create` for options.

   * @set
   *   millisecondsSince
   *   secondsSince
   *   minutesSince
   *   hoursSince
   *   daysSince
   *   weeksSince
   *   monthsSince
   *   yearsSince
   *
   * @example
   *
   *   now.millisecondsSince('1 hour ago') -> 3,600,000
   *   now.daysSince('1 week ago')         -> 7
   *   now.yearsSince('15 years ago')      -> 15
   *   lastYear.yearsAgo()                 -> 1
   *
   ***
   * @method [units]Ago()
   * @returns Number
   * @short Returns the time ago in the appropriate unit.
   *
   * @set
   *   millisecondsAgo
   *   secondsAgo
   *   minutesAgo
   *   hoursAgo
   *   daysAgo
   *   weeksAgo
   *   monthsAgo
   *   yearsAgo
   *
   * @example
   *
   *   lastYear.millisecondsAgo() -> 3,600,000
   *   lastYear.daysAgo()         -> 7
   *   lastYear.yearsAgo()        -> 15
   *
   ***
   * @method [units]Until([d], [options])
   * @returns Number
   * @short Returns the time until [d].
   * @extra [d] will accept a date object, timestamp, or string. If not specified,
   *        [d] is assumed to be now. `[unit]FromNow` is provided as an alias to
   *        make this more readable when [d] is assumed to be the current date.
   *        See `Date.create` for options.

   *
   * @set
   *   millisecondsUntil
   *   secondsUntil
   *   minutesUntil
   *   hoursUntil
   *   daysUntil
   *   weeksUntil
   *   monthsUntil
   *   yearsUntil
   *
   * @example
   *
   *   now.millisecondsUntil('1 hour from now') -> 3,600,000
   *   now.daysUntil('1 week from now')         -> 7
   *   now.yearsUntil('15 years from now')      -> 15
   *   nextYear.yearsFromNow()                  -> 1
   *
   ***
   * @method [units]FromNow()
   * @returns Number
   * @short Returns the time from now in the appropriate unit.
   *
   * @set
   *   millisecondsFromNow
   *   secondsFromNow
   *   minutesFromNow
   *   hoursFromNow
   *   daysFromNow
   *   weeksFromNow
   *   monthsFromNow
   *   yearsFromNow
   *
   * @example
   *
   *   nextYear.millisecondsFromNow() -> 3,600,000
   *   nextYear.daysFromNow()         -> 7
   *   nextYear.yearsFromNow()        -> 15
   *
   ***
   * @method add[Units](<num>, [reset] = false)
   * @returns Date
   * @short Adds <num> units to the date. If [reset] is true, all lower units will
   *        be reset.
   * @extra Note that "months" is ambiguous as a unit of time. If the target date
   *        falls on a day that does not exist (ie. August 31 -> February 31), the
   *        date will be shifted to the last day of the month.
   *        Don't use `addMonths` if you need precision.
   *
   * @set
   *   addMilliseconds
   *   addSeconds
   *   addMinutes
   *   addHours
   *   addDays
   *   addWeeks
   *   addMonths
   *   addYears
   *
   * @example
   *
   *   now.addMilliseconds(5) -> current time + 5 milliseconds
   *   now.addDays(5)         -> current time + 5 days
   *   now.addYears(5)        -> current time + 5 years
   *
   ***
   * @method isLast[Unit]()
   * @returns Boolean
   * @short Returns true if the date is last week/month/year.
   *
   * @set
   *   isLastWeek
   *   isLastMonth
   *   isLastYear
   *
   * @example
   *
   *   yesterday.isLastWeek()  -> true or false?
   *   yesterday.isLastMonth() -> probably not...
   *   yesterday.isLastYear()  -> even less likely...
   *
   ***
   * @method isThis[Unit]()
   * @returns Boolean
   * @short Returns true if the date is this week/month/year.
   *
   * @set
   *   isThisWeek
   *   isThisMonth
   *   isThisYear
   *
   * @example
   *
   *   tomorrow.isThisWeek()  -> true or false?
   *   tomorrow.isThisMonth() -> probably...
   *   tomorrow.isThisYear()  -> signs point to yes...
   *
   ***
   * @method isNext[Unit]()
   * @returns Boolean
   * @short Returns true if the date is next week/month/year.
   *
   * @set
   *   isNextWeek
   *   isNextMonth
   *   isNextYear
   *
   * @example
   *
   *   tomorrow.isNextWeek()  -> true or false?
   *   tomorrow.isNextMonth() -> probably not...
   *   tomorrow.isNextYear()  -> even less likely...
   *
   ***
   * @method beginningOf[Unit]([locale])
   * @returns Date
   * @short Sets the date to the beginning of the appropriate unit.
   * @extra Takes an optional locale code as "week" varies by locale, otherwise
   *        uses the current locale.
   *
   * @set
   *   beginningOfDay
   *   beginningOfWeek
   *   beginningOfMonth
   *   beginningOfYear
   *
   * @example
   *
   *   now.beginningOfDay()   -> the beginning of today (resets the time)
   *   now.beginningOfWeek()  -> the beginning of the week
   *   now.beginningOfMonth() -> the beginning of the month
   *   now.beginningOfYear()  -> the beginning of the year
   *
   ***
   * @method endOf[Unit]([locale])
   * @returns Date
   * @short Sets the date to the end of the appropriate unit.
   * @extra Takes an optional locale code as "week" varies by locale, otherwise
   *        uses the current locale.
   *
   * @set
   *   endOfDay
   *   endOfWeek
   *   endOfMonth
   *   endOfYear
   *
   * @example
   *
   *   now.endOfDay()   -> the end of today (sets the time to 23:59:59.999)
   *   now.endOfWeek()  -> the end of the week
   *   now.endOfMonth() -> the end of the month
   *   now.endOfYear()  -> the end of the year
   *
   ***/
  function buildDateUnitMethods() {

    defineInstanceSimilar(sugarDate, DateUnits, function(methods, u, i) {
      var name = u.name, caps = simpleCapitalize(name);

      if (i > 4) {
        forEach(['Last','This','Next'], function(shift) {
          methods['is' + shift + caps] = function(d) {
            return compareDate(d, shift + ' ' + name, 0, { locale: 'en' });
          };
        });
      }
      if (i > 3) {
        methods['beginningOf' + caps] = function(d, localeCode) {
          return moveToBeginningOfUnit(d, name, localeCode);
        };
        methods['endOf' + caps] = function(d, localeCode) {
          return moveToEndOfUnit(d, name, localeCode);
        };
      }

      methods['add' + caps + 's'] = function(d, num, reset) {
        return advanceDate(d, name, num, reset);
      };

      var since = function(date, d, options) {
        return getTimeDistanceForUnit(date, createDateWithContext(date, d, options), u);
      };
      var until = function(date, d, options) {
        return getTimeDistanceForUnit(createDateWithContext(date, d, options), date, u);
      };

      methods[u.name + 'sAgo']   = methods[u.name + 'sUntil']   = until;
      methods[u.name + 'sSince'] = methods[u.name + 'sFromNow'] = since;

      buildNumberMethods(u, u.multiplier);
    });

  }

  function buildFormatTokens() {

    function addFormats(target, tokens, fn) {
      if (tokens) {
        forEach(commaSplit(tokens), function(token) {
          target[token] = fn;
        });
      }
    }

    function buildLowercase(get) {
      return function(d, localeCode) {
        return get(d, localeCode).toLowerCase();
      };
    }

    function buildOrdinal(get) {
      return function(d, localeCode) {
        var n = get(d, localeCode);
        return n + localeManager.get(localeCode).getOrdinal(n);
      };
    }

    function buildPadded(get, padding) {
      return function(d, localeCode) {
        return padNumber(get(d, localeCode), padding);
      };
    }

    function buildTwoDigits(get) {
      return function(d, localeCode) {
        return get(d, localeCode) % 100;
      };
    }

    function buildAlias(alias) {
      return function(d, localeCode) {
        return dateFormatMatcher(alias, d, localeCode);
      };
    }

    function buildAlternates(f) {
      for (var n = 1; n <= 5; n++) {
        buildAlternate(f, n);
      }
    }

    function buildAlternate(f, n) {
      var alternate = function(d, localeCode) {
        return f.get(d, localeCode, n);
      };
      addFormats(ldmlTokens, f.ldml + n, alternate);
      if (f.lowerToken) {
        ldmlTokens[f.lowerToken + n] = buildLowercase(alternate);
      }
    }

    function getIdentityFormat(name) {
      return function(d, localeCode) {
        var loc = localeManager.get(localeCode);
        return dateFormatMatcher(loc[name], d, localeCode);
      };
    }

    forEach(FormatTokensBase, function(f) {
      var get = f.get, getPadded;
      if (f.lowerToken) {
        ldmlTokens[f.lowerToken] = buildLowercase(get);
      }
      if (f.ordinalToken) {
        ldmlTokens[f.ordinalToken] = buildOrdinal(get, f);
      }
      if (f.ldmlPaddedToken) {
        ldmlTokens[f.ldmlPaddedToken] = buildPadded(get, f.ldmlPaddedToken.length);
      }
      if (f.ldmlTwoDigitToken) {
        ldmlTokens[f.ldmlTwoDigitToken] = buildPadded(buildTwoDigits(get), 2);
      }
      if (f.strfTwoDigitToken) {
        strfTokens[f.strfTwoDigitToken] = buildPadded(buildTwoDigits(get), 2);
      }
      if (f.strfPadding) {
        getPadded = buildPadded(get, f.strfPadding);
      }
      if (f.alias) {
        get = buildAlias(f.alias);
      }
      if (f.allowAlternates) {
        buildAlternates(f);
      }
      addFormats(ldmlTokens, f.ldml, get);
      addFormats(strfTokens, f.strf, getPadded || get);
    });

    iterateOverObject(CONSTANT_FORMATS, function(name, src) {
      addFormats(ldmlTokens, name, buildAlias(src));
    });

    defineInstanceSimilar(sugarDate, 'short,medium,long,full', function(methods, name) {
      var fn = getIdentityFormat(name);
      addFormats(ldmlTokens, name, fn);
      methods[name] = fn;
    });

    addFormats(ldmlTokens, 'time', getIdentityFormat('time'));
    addFormats(ldmlTokens, 'stamp', getIdentityFormat('stamp'));
  }

  function buildCJKDigits() {
    cjkDigitMap = {};
    var digits = '〇一二三四五六七八九十百千万';
    forEach(digits.split(''), function(digit, value) {
      if (value > 9) {
        value = pow(10, value - 9);
      }
      cjkDigitMap[digit] = value;
    });
    simpleMerge(cjkDigitMap, fullWidthNumberMap);
    // CJK numerals may also be included in phrases which are text-based rather
    // than actual numbers such as Chinese weekdays (上周三), and "the day before
    // yesterday" (一昨日) in Japanese, so don't match these.
    cjkDigitReg = RegExp('([期週周])?([' + digits + fullWidthNumbers + ']+)(?!昨)', 'g');
  }

   /***
   * @method is[Day]()
   * @returns Boolean
   * @short Returns true if the date falls on that day.
   * @extra Also available: `isYesterday`, `isToday`, `isTomorrow`, `isWeekday`,
   *        and `isWeekend`.
   *
   * @set
   *   isToday
   *   isYesterday
   *   isTomorrow
   *   isWeekday
   *   isWeekend
   *   isSunday
   *   isMonday
   *   isTuesday
   *   isWednesday
   *   isThursday
   *   isFriday
   *   isSaturday
   *
   * @example
   *
   *   tomorrow.isToday() -> false
   *   thursday.isTomorrow() -> ?
   *   yesterday.isWednesday() -> ?
   *   today.isWeekend() -> ?
   *
   ***
   * @method isFuture()
   * @returns Boolean
   * @short Returns true if the date is in the future.
   *
   * @example
   *
   *   lastWeek.isFuture() -> false
   *   nextWeek.isFuture() -> true
   *
   ***
   * @method isPast()
   * @returns Boolean
   * @short Returns true if the date is in the past.
   *
   * @example
   *
   *   lastWeek.isPast() -> true
   *   nextWeek.isPast() -> false
   *
   ***/
  function buildRelativeAliases() {
    var special  = commaSplit('Today,Yesterday,Tomorrow,Weekday,Weekend,Future,Past');
    var weekdays = English.weekdays.slice(0, 7);
    var months   = English.months.slice(0, 12);
    var together = special.concat(weekdays).concat(months)
    defineInstanceSimilar(sugarDate, together, function(methods, name) {
      methods['is'+ name] = function(d) {
        return fullCompareDate(d, name);
      };
    });
  }

  defineStatic(sugarDate, {

     /***
     * @method create(<d>, [options])
     * @returns Date
     * @static
     * @short Alternate date constructor which accepts many different text formats, a timestamp, or another date.
     * @extra If no argument is given, the date is assumed to be now.
     *
     * @options
     *
     *   locale     A locale code to parse the date in. This can also be passed as
     *              the second argument to this method. Default is the current
     *              locale, which is English if none is set.
     *              (Default = 'en')
     *
     *   past       If `true`, ambiguous dates like `Sunday` will be parsed as
     *              `last Sunday`. Note that this does not guarantee that non-
     *              ambiguous dates will be in the past.
     *              (Default = `false`)
     *
     *   future     If `true`, ambiguous dates like `Sunday` will be parsed as
     *              `next Sunday`. Note that this does not guarantee that non-
     *              ambiguous dates will be in the future.
     *              (Default = `false`)
     *
     *   fromUTC    If `true`, the date will be parsed as UTC time (no timezone
     *              offset). This is useful for server timestamps, etc.
     *              (Default = `false`)
     *
     *   setUTC     If `true` this will set the date's internal `utc` flag, which
     *              tells it to use UTC based methods like `setUTCHours` when
     *              handling the date. Note that this is different from `fromUTC`
     *              which parses a date string as being UTC time, but creates a
     *              standard local Javascript date object. Also note that native
     *              methods like `setHours` will still return a local non-UTC value.
     *              (Default = `false`)
     *
     * @example
     *
     *   Date.create('July')          -> July of this year
     *   Date.create('1776')          -> 1776
     *   Date.create('today')         -> today
     *   Date.create('wednesday')     -> This wednesday
     *   Date.create('next friday')   -> Next friday
     *   Date.create('July 4, 1776')  -> July 4, 1776
     *   Date.create(-446806800000)   -> November 5, 1955
     *   Date.create('1776年07月04日', 'ja') -> July 4, 1776
     *   Date.create('Thursday', {fromUTC: true}) -> Thursday at 12:00am UTC time
     *
     ***/
    'create': function(d, options) {
      return createDate(d, options);
    },

     /***
     * @method getLocale([code] = current)
     * @returns Locale
     * @static
     * @short Gets the locale for the given code, or the current locale.
     * @extra The resulting locale object can be manipulated to provide more control
     *        over date localizations. For more about locales, see `date locales`.
     *
     ***/
    'getLocale': function(code) {
      return localeManager.get(code, !code);
    },

     /***
     * @method getAllLocales()
     * @returns Object
     * @static
     * @short Returns all available locales.
     * @example
     *
     *   Date.getAllLocales()
     *
     ***/
    'getAllLocales': function() {
      return localeManager.getAll();
    },

     /***
     * @method getAllLocaleCodes()
     * @returns Array
     * @static
     * @short Returns all available locale names as an array of strings.
     * @example
     *
     *   Date.getAllLocaleCodes()
     *
     ***/
    'getAllLocaleCodes': function() {
      return getKeys(localeManager.getAll());
    },

     /***
     * @method setLocale(<code>)
     * @returns Locale
     * @static
     * @short Sets the current locale to be used with dates.
     * @extra Sugar has native support for 17 major locales. In addition, you can
     *        define a new locale with `Date.addLocale`. For more see `date locales`.
     *
     ***/
    'setLocale': function(code) {
      return localeManager.set(code);
    },

     /***
     * @method addLocale(<code>, <set>)
     * @returns Locale
     * @static
     * @short Adds a locale <set> to the locales understood by Sugar.
     * @extra For more see `date locales`.
     * @example
     *
     *   Date.addLocale('foo', {})
     *
     ***/
    'addLocale': function(code, set) {
      return localeManager.add(code, set);
    },

     /***
     * @method removeLocale(<code>)
     * @returns Locale
     * @static
     * @short Deletes the the locale by <code> from Sugar's known locales.
     *
     ***/
    'removeLocale': function(code) {
      return localeManager.remove(code);
    }

  });

  defineInstanceWithArguments(sugarDate, {

     /***
     * @method set(<set>, [reset] = false)
     * @returns Date
     * @short Sets the date object.
     * @extra This method can accept multiple formats including a single number as
     *        a timestamp, an object, or enumerated parameters (as with the Date
     *        constructor). If [reset] is `true`, any units more specific than
     *        those passed will be reset. If a month is set to a date that does
     *        not exist, it will rewind to the last day of the month.
     *
     * @example
     *
     *   new Date().set({year:2011,month:11,day:31}) -> December 31, 2011
     *   new Date().set(2011, 11, 31)                -> December 31, 2011
     *   new Date().set(86400000)                    -> 1 day after Jan 1, 1970
     *   new Date().set({year:2004,month:6}, true)   -> June 1, 2004, 00:00:00.000
     *
     ***/
    'set': function(d, args) {
      args = collectDateArguments(args);
      return updateDate(d, args[0], args[1]);
    },

     /***
     * @method advance(<set>, [reset] = false)
     * @returns Date
     * @short Sets the date forward.
     * @extra This method can accept multiple formats including an object, a string
     *        in the format `3 days`, a single number as milliseconds, or enumerated
     *        parameters (as with the Date constructor). If [reset] is `true`, any
     *        units more specific than those passed will be reset. This method
     *        modifies the date!
     *
     * @example
     *
     *   new Date().advance({ year: 2 }) -> 2 years in the future
     *   new Date().advance('2 days')    -> 2 days in the future
     *   new Date().advance(0, 2, 3)     -> 2 months 3 days in the future
     *   new Date().advance(86400000)    -> 1 day in the future
     *
     ***/
    'advance': function(d, args) {
      return advanceDateWithArgs(d, args, 1);
    },

     /***
     * @method rewind(<set>, [reset] = false)
     * @returns Date
     * @short Sets the date back.
     * @extra This method can accept multiple formats including a single number as
     *        a timestamp, an object, or enumerated parameters (as with the Date
     *        constructor). If [reset] is `true`, any units more specific than
     *        those passed will be reset. This method modifies the date!
     *
     * @example
     *
     *   new Date().rewind({ year: 2 }) -> 2 years in the past
     *   new Date().rewind(0, 2, 3)     -> 2 months 3 days in the past
     *   new Date().rewind(86400000)    -> 1 day in the past
     *
     ***/
    'rewind': function(d, args) {
      return advanceDateWithArgs(d, args, -1);
    }

  });

  defineInstance(sugarDate, {

     /***
     * @method get(<d>, [options])
     * @returns Date
     * @short Gets a new date using the current one as a starting point.
     * @extra This method is identical to `Date.create`, except that relative
     *        formats like `next month` are relative to the date instance rather
     *        than the current date. See `Date.create` for options.
     *
     * @example
     *
     *   nextYear.get('monday') -> monday of the week exactly 1 year from now
     *   millenium.get('2 years before') -> 2 years before Jan 1, 2000.
     *
     ***/
    'get': function(date, d, options) {
      return createDateWithContext(date, d, options);
    },

     /***
     * @method setWeekday(<dow>)
     * @returns Nothing
     * @short Sets the weekday of the date.
     * @extra In order to maintain a parallel with `getWeekday` (which itself is
     *        an alias for Javascript native `getDay`), Sunday is considered day
     *        `0`. This contrasts with ISO8601 standard (used in `getISOWeek` and
     *        `setISOWeek`) which places Sunday at the end of the week (day 7).
     *        This means that passing `0` to this method while in the middle of a
     *        week will rewind the date, where passing `7` will advance it.
     *
     * @example
     *
     *   d = new Date(); d.setWeekday(1); d; -> Monday of this week
     *   d = new Date(); d.setWeekday(6); d; -> Saturday of this week
     *
     ***/
    'setWeekday': function(d, dow) {
      return setWeekday(d, dow);
    },

     /***
     * @method setISOWeek(<num>)
     * @returns Nothing
     * @short Sets the week (of the year) as defined by the ISO8601 standard.
     * @extra Note that this standard places Sunday at the end of the week (day 7).
     *
     * @example
     *
     *   d = new Date(); d.setISOWeek(15); d; -> 15th week of the year
     *
     ***/
    'setISOWeek': function(d, num) {
      return setISOWeekNumber(d, num);
    },

     /***
     * @method getISOWeek()
     * @returns Number
     * @short Gets the date's week (of the year) as defined by the ISO8601 standard.
     * @extra Note that this standard places Sunday at the end of the week (day 7).
     *        If `utc` is set on the date, the week will be according to UTC time.
     *
     * @example
     *
     *   now.getISOWeek() -> today's week of the year
     *
     ***/
    'getISOWeek': function(d) {
      return getWeekNumber(d, true);
    },

     /***
     * @method beginningOfISOWeek()
     * @returns Date
     * @short Set the date to the beginning of week as defined by ISO8601.
     * @extra Note that this standard places Monday at the start of the week.
     *
     * @example
     *
     *   now.beginningOfISOWeek() -> Monday
     *
     ***/
    'beginningOfISOWeek': function(d) {
      var day = getWeekday(d);
      if (day === 0) {
        day = -6;
      } else if (day !== 1) {
        day = 1;
      }
      setWeekday(d, day);
      return resetTime(d);
    },

     /***
     * @method endOfISOWeek()
     * @returns Date
     * @short Set the date to the end of week as defined by this ISO8601 standard.
     * @extra Note that this standard places Sunday at the end of the week.
     *
     * @example
     *
     *   now.endOfISOWeek() -> Sunday
     *
     ***/
    'endOfISOWeek': function(d) {
      if (getWeekday(d) !== 0) {
        setWeekday(d, 7);
      }
      return moveToEndOfUnit(d, 'day');
    },

     /***
     * @method getUTCOffset([iso])
     * @returns String
     * @short Returns a string representation of the offset from UTC time. If [iso]
     *        is true the offset will be in ISO8601 format.
     *
     * @example
     *
     *   now.getUTCOffset()     -> "+0900"
     *   now.getUTCOffset(true) -> "+09:00"
     *
     ***/
    'getUTCOffset': function(d, iso) {
      return getUTCOffset(d, iso);
    },

     /***
     * @method setUTC([on] = false)
     * @returns Date
     * @short Sets the internal utc flag for the date. When on, UTC based methods
     *        like `setUTCHours` will be called internally.
     * @extra Note that native methods like `getHours` will still retur a local
     *        non-UTC value.
     *
     * @example
     *
     *   new Date().setUTC(true)
     *   new Date().setUTC(false)
     *
     ***/
    'setUTC': function(d, on) {
      return _utc(d, on);
    },

     /***
     * @method isUTC()
     * @returns Boolean
     * @short Returns true if the date has no timezone offset.
     * @extra This will also return true for dates whose internal utc flag is set
     *        with `setUTC`. Even if the utc flag is set, `getTimezoneOffset`
     *        will always report the same thing as Javascript always reports that
     *        based on the environment's locale.
     *
     * @example
     *
     *   new Date().isUTC() -> true or false (depends on the local offset)
     *   new Date().setUTC(true).isUTC() -> true
     *
     ***/
    'isUTC': function(d) {
      return isUTC(d);
    },

     /***
     * @method isValid()
     * @returns Boolean
     * @short Returns true if the date is valid.
     *
     * @example
     *
     *   new Date().isValid()         -> true
     *   new Date('flexor').isValid() -> false
     *
     ***/
    'isValid': function(d) {
      return isValid(d);
    },

     /***
     * @method isAfter(<d>, [margin] = 0)
     * @returns Boolean
     * @short Returns true if the date is after the <d>.
     * @extra [margin] is to allow extra margin of error (in ms). <d> will accept
     *        a date object, timestamp, or string. If not specified, <d> is
     *        assumed to be now. See `Date.create` for formats.
     *
     * @example
     *
     *   today.isAfter('tomorrow')  -> false
     *   today.isAfter('yesterday') -> true
     *
     ***/
    'isAfter': function(date, d, margin) {
      return date.getTime() > createDate(d).getTime() - (margin || 0);
    },

     /***
     * @method isBefore(<d>, [margin] = 0)
     * @returns Boolean
     * @short Returns true if the date is before <d>.
     * @extra [margin] is to allow extra margin of error (in ms). <d> will accept
     *        a date object, timestamp, or text format. If not specified, <d> is
     *        assumed to be now. See `Date.create` for formats.
     *
     * @example
     *
     *   today.isBefore('tomorrow')  -> true
     *   today.isBefore('yesterday') -> false
     *
     ***/
    'isBefore': function(date, d, margin) {
      return date.getTime() < createDate(d).getTime() + (margin || 0);
    },

     /***
     * @method isBetween(<d1>, <d2>, [margin] = 0)
     * @returns Boolean
     * @short Returns true if the date is later or equal to <d1> and before or equal to <d2>.
     * @extra [margin] is to allow extra margin of error (in ms). <d1> and <d2> will
     *        accept a date object, timestamp, or text format. If not specified,
     *        they are assumed to be now.  See `Date.create` for formats.
     *
     * @example
     *
     *   now.isBetween('yesterday', 'tomorrow')    -> true
     *   now.isBetween('last year', '2 years ago') -> false
     *
     ***/
    'isBetween': function(date, d1, d2, margin) {
      var t  = date.getTime();
      var t1 = createDate(d1).getTime();
      var t2 = createDate(d2).getTime();
      var lo = min(t1, t2);
      var hi = max(t1, t2);
      margin = margin || 0;
      return (lo - margin <= t) && (hi + margin >= t);
    },

     /***
     * @method isLeapYear()
     * @returns Boolean
     * @short Returns true if the date is a leap year.
     *
     * @example
     *
     *   millenium.isLeapYear() -> true
     *
     ***/
    'isLeapYear': function(d) {
      var year = getYear(d);
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    },

     /***
     * @method daysInMonth()
     * @returns Number
     * @short Returns the number of days in the date's month.
     *
     * @example
     *
     *   may.daysInMonth() -> 31
     *   feb.daysInMonth() -> 28 or 29
     *
     ***/
    'daysInMonth': function(d) {
      return daysInMonth(d);
    },

     /***
     * @method format(<f>, [locale] = currentLocale)
     * @returns String
     * @short Returns the date as a string following the format <f>.
     * @extra <f> is a string that contains formatting tokens demarcated by either
     *        curly braces `{}` or a percent sign `%`. <f> may also have locale-
     *        specific aliases `short`, `medium`, `long`, and `full`, are also
     *        aliased as methods. If <f> is not specified, the `long` format is
     *        assumed. [locale] specifies a locale code to use (if not specified
     *        the current locale is used). See `date formatting` for more details.
     *
     * @example
     *
     *   now.format()                        -> ex. February 13, 2012 11:21 AM
     *   now.format('{Weekday} {d} {Month}') -> ex. Monday July 4
     *   now.format('{hh}:{mm}')             -> ex. 15:57
     *   now.format('{12hr}:{mm}{tt}')       -> ex. 3:57pm
     *   now.format('ISO8601')               -> ex. 2011-07-05 12:24:55.528Z
     *   lastWeek.format('short', 'ja')      -> ex. 先週
     *
     ***
     * @method short([locale] = currentLocale)
     * @returns String
     * @short Outputs the date in the short format for the current locale.
     * @extra [locale] overrides the current locale if passed.
     *
     * @example
     *
     *   now.short()     -> ex. 02/13/2016
     *   now.short('fi') -> ex. 13.2.2016
     *
     ***
     * @method medium([locale] = currentLocale)
     * @returns String
     * @short Outputs the date in the medium format for the current locale.
     * @extra [locale] overrides the current locale if passed.
     *
     * @example
     *
     *   now.medium()     -> ex. February 13, 2016
     *   now.medium('ja') -> ex. 2016年2月13日
     *
     ***
     * @method long([locale] = currentLocale)
     * @returns String
     * @short Outputs the date in the long format for the current locale.
     * @extra [locale] overrides the current locale if passed.
     *
     * @example
     *
     *   now.long()     -> ex. February 13, 2016 6:22 PM
     *   now.long('es') -> ex. 13 de febrero de 2016 18:22
     *
     ***
     * @method full([locale] = currentLocale)
     * @returns String
     * @short Outputs the date in the full format for the current locale.
     * @extra [locale] overrides the current locale if passed.
     *
     * @example
     *
     *   now.full()     -> ex. Saturday, February 13, 2016 6:23 PM
     *   now.full('ru') -> ex. суббота, 13 февраля 2016 г., 18:23
     *
     ***/
    'format': function(d, f, localeCode) {
      return formatDate(d, f, false, localeCode);
    },

     /***
     * @method relative([fn], [locale] = currentLocale)
     * @returns String
     * @short Returns the date in a text format relative to the current time,
     *        such as `5 minutes ago`.
     * @extra [fn] is a function that can be passed to provide more granular control
     *        over the resulting string. Its return value will be passed to `format`.
     *        If nothing is returned, the relative format will be used. [locale] may
     *        also be passed in place of [fn]. For more, see `date formatting`.
     *
     * @callback fn
     *
     *   val   The offset value in `unit`.
     *   unit  The numeric unit that `val` is in, starting at 0 for ms.
     *   ms    The absolute offset in milliseconds.
     *   loc   The locale object, either specified by [locale] or default.
     *
     * @example
     *
     *   hourAgo.relative() -> 1 hour ago
     *   jan.relative()     -> ex. 5 months ago
     *   jan.relative('ja') -> 3ヶ月前
     *   now.relative(function(val, unit, ms, loc) {
     *     // value = 2, unit = 3, ms = -7200, loc = [current locale object]
     *   }); -> ex. 5 months ago
     *
     ***/
    'relative': function(d, fn, localeCode) {
      if (isString(fn)) {
        localeCode = fn;
        fn = null;
      }
      return formatDate(d, fn, true, localeCode);
    },

     /***
     * @method is(<f>, [margin] = 0)
     * @returns Boolean
     * @short Returns true if the date is <f>.
     * @extra <f> will accept a date object, timestamp, or text format. `is`
     *        additionally understands more generalized expressions like month/weekday
     *        names, 'today', etc, and compares to the precision implied in <f>.
     *        [margin] allows an extra margin of error in milliseconds. See
     *        `Date.create` for formats.
     *
     * @example
     *
     *   now.is('July')               -> true or false?
     *   now.is('1776')               -> false
     *   now.is('today')              -> true
     *   now.is('weekday')            -> true or false?
     *   now.is('July 4, 1776')       -> false
     *   now.is(-6106093200000)       -> false
     *   now.is(new Date(1776, 6, 4)) -> false
     *
     ***/
    'is': function(date, d, margin) {
      return fullCompareDate(date, d, margin);
    },

     /***
     * @method reset([unit] = 'hours')
     * @returns Date
     * @short Resets the unit passed and all smaller units. Default is "hours",
     *        effectively resetting the time.
     * @extra This method modifies the array!
     *
     * @example
     *
     *   new Date().reset('day')   -> Beginning of today
     *   new Date().reset('month') -> 1st of the month
     *
     ***/
    'reset': function(d, unit) {
      return resetUnitAndLower(d, unit);
    },

     /***
     * @method clone()
     * @returns Date
     * @short Clones the date.
     *
     * @example
     *
     *   now.clone() -> Copy of now
     *
     ***/
    'clone': function(d) {
      return cloneDate(d);
    },

     /***
     * @method iso()
     * @alias toISOString
     *
     ***/
    'iso': function(d) {
      return d.toISOString();
    },

     /***
     * @method getWeekday()
     * @returns Number
     * @short Alias for `getDay`.
     * @set
     *   getUTCWeekday
     *
     * @example
     *
     *   now.getWeekday();    -> (ex.) 3
     *   now.getUTCWeekday(); -> (ex.) 3
     *
     ***/
    'getWeekday': function(d) {
      return getWeekday(d);
    },

    'getUTCWeekday': function(d) {
      return d.getUTCDay();
    }

  });


  /***
   * @namespace Number
   *
   ***/

  /***
   * @method [unit]()
   * @returns Number
   * @short Takes the number as a unit of time and converts to milliseconds.
   * @extra Method names can be singular or plural.  Note that as "a month" is
   *        ambiguous as a unit of time, `months` will be equivalent to 30.4375
   *        days, the average number in a month. Be careful using `months` if you
   *        need exact precision.
   *
   * @set
   *   millisecond
   *   milliseconds
   *   second
   *   seconds
   *   minute
   *   minutes
   *   hour
   *   hours
   *   day
   *   days
   *   week
   *   weeks
   *   month
   *   months
   *   year
   *   years
   *
   * @example
   *
   *   (5).milliseconds() -> 5
   *   (10).hours()       -> 36000000
   *   (1).day()          -> 86400000
   *
   ***
   * @method [unit]Before([d], [options])
   * @returns Date
   * @short Returns a date that is <n> units before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. Note that
   *        "months" is ambiguous as a unit of time. If the target date falls on a
   *        day that does not exist (ie. August 31 -> February 31), the date will
   *        be shifted to the last day of the month. Be careful using `monthsBefore`
   *        if you need exact precision. See `Date.create` for options.

   *
   * @set
   *   millisecondBefore
   *   millisecondsBefore
   *   secondBefore
   *   secondsBefore
   *   minuteBefore
   *   minutesBefore
   *   hourBefore
   *   hoursBefore
   *   dayBefore
   *   daysBefore
   *   weekBefore
   *   weeksBefore
   *   monthBefore
   *   monthsBefore
   *   yearBefore
   *   yearsBefore
   *
   * @example
   *
   *   (5).daysBefore('tuesday')          -> 5 days before tuesday of this week
   *   (1).yearBefore('January 23, 1997') -> January 23, 1996
   *
   ***
   * @method [unit]Ago()
   * @returns Date
   * @short Returns a date that is <n> units ago.
   * @extra Note that "months" is ambiguous as a unit of time. If the target date
   *        falls on a day that does not exist (ie. August 31 -> February 31), the
   *        date will be shifted to the last day of the month. Be careful using
   *        `monthsAgo` if you need exact precision.
   *
   * @set
   *   millisecondAgo
   *   millisecondsAgo
   *   secondAgo
   *   secondsAgo
   *   minuteAgo
   *   minutesAgo
   *   hourAgo
   *   hoursAgo
   *   dayAgo
   *   daysAgo
   *   weekAgo
   *   weeksAgo
   *   monthAgo
   *   monthsAgo
   *   yearAgo
   *   yearsAgo
   *
   * @example
   *
   *   (5).weeksAgo() -> 5 weeks ago
   *   (1).yearAgo()  -> January 23, 1996
   *
   ***
   * @method [unit]After([d], [options])
   * @returns Date
   * @short Returns a date <n> units after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. Note that
   *        "months" is ambiguous as a unit of time. If the target date falls on a
   *        day that does not exist (ie. August 31 -> February 31), the date will
   *        be shifted to the last day of the month. Be careful using `monthsAfter`
   *        if you need exact precision. See `Date.create` for options.
   *
   * @set
   *   millisecondAfter
   *   millisecondsAfter
   *   secondAfter
   *   secondsAfter
   *   minuteAfter
   *   minutesAfter
   *   hourAfter
   *   hoursAfter
   *   dayAfter
   *   daysAfter
   *   weekAfter
   *   weeksAfter
   *   monthAfter
   *   monthsAfter
   *   yearAfter
   *   yearsAfter
   *
   * @example
   *
   *   (5).daysAfter('tuesday')          -> 5 days after tuesday of this week
   *   (1).yearAfter('January 23, 1997') -> January 23, 1998
   *
   ***
   * @method [unit]FromNow()
   * @returns Date
   * @short Returns a date <n> units from now.
   * @extra Note that "months" is ambiguous as a unit of time. If the target date
   *        falls on a day that does not exist (ie. August 31 -> February 31), the
   *        date will be shifted to the last day of the month. Be careful using
   *        `monthsFromNow` if you need exact precision.
   *
   * @set
   *   millisecondFromNow
   *   millisecondsFromNow
   *   secondFromNow
   *   secondsFromNow
   *   minuteFromNow
   *   minutesFromNow
   *   hourFromNow
   *   hoursFromNow
   *   dayFromNow
   *   daysFromNow
   *   weekFromNow
   *   weeksFromNow
   *   monthFromNow
   *   monthsFromNow
   *   yearFromNow
   *   yearsFromNow
   *
   * @example
   *
   *   (5).weeksFromNow() -> 5 weeks ago
   *   (1).yearFromNow()  -> January 23, 1998
   *
   ***/
  function buildNumberMethods(u, multiplier) {
    var base, after, before, name = u.name, methods = {};
    base = function(n) {
      return round(n * multiplier);
    };
    after = function(n, d, options) {
      return advanceDate(createDate(d, options), u.name, n);
    };
    before = function(n, d, options) {
      return advanceDate(createDate(d, options), u.name, -n);
    };
    methods[name] = base;
    methods[name + 's'] = base;
    methods[name + 'Before'] = before;
    methods[name + 'sBefore'] = before;
    methods[name + 'Ago'] = before;
    methods[name + 'sAgo'] = before;
    methods[name + 'After'] = after;
    methods[name + 'sAfter'] = after;
    methods[name + 'FromNow'] = after;
    methods[name + 'sFromNow'] = after;
    defineInstance(sugarNumber, methods);
  }

  defineInstance(sugarNumber, {

     /***
     * @method duration([locale] = currentLocale)
     * @returns String
     * @short Takes the number as milliseconds and returns a localized string.
     * @extra This method is the same as `Date#relative` without the localized
     *        equivalent of "from now" or "ago". [locale] can be passed as the
     *        first (and only) parameter. Note that this method is only available
     *        when the dates module is included.
     *
     * @example
     *
     *   (500).duration() -> '500 milliseconds'
     *   (1200).duration() -> '1 second'
     *   (75).minutes().duration() -> '1 hour'
     *   (75).minutes().duration('es') -> '1 hora'
     *
     ***/
    'duration': function(n, localeCode) {
      return localeManager.get(localeCode).getDuration(n);
    }

  });


  // Locales

  function getEnglishVariant(v) {
    return simpleMerge(simpleClone(EnglishLocaleBaseDefinition), v);
  }


  function LocaleManager(loc) {
    this.locales = {};
    this.add(loc);
  }

  LocaleManager.prototype = {

    get: function(code, fallback) {
      var loc = this.locales[code];
      if (!loc && LazyLoadedLocales[code]) {
        loc = this.add(code, LazyLoadedLocales[code]);
      } else if (!loc && code) {
        loc = this.locales[code.slice(0, 2)];
      }
      return loc || fallback === false ? loc : this.current;
    },

    getAll: function() {
      return this.locales;
    },

    set: function(code) {
      var loc = this.get(code, false);
      if (!loc) {
        throw new TypeError('Invalid Locale: ' + code);
      }
      return this.current = loc;
    },

    add: function(code, def) {
      if (!def) {
        def = code;
        code = def.code;
      } else {
        def.code = code;
      }
      var loc = def.compiledFormats ? def : new Locale(def);
      this.locales[code] = loc;
      if (!this.current) {
        this.current = loc;
      }
      return loc;
    },

    remove: function(code) {
      if (this.current.code === code) {
        this.current = this.get('en');
      }
      return delete this.locales[code];
    }

  };

  function Locale(def) {
    this.init(def);
  }

  Locale.prototype = {

    get: function(prop) {
      return this[prop] || '';
    },

    fetch: function(prop, args) {
      return isFunction(prop) ? prop.apply(this, args || []) : prop;
    },

    getMonthValue: function(n) {
      if (isNumber(n)) {
        return n - 1;
      } else if (n) {
        return indexOf(this.monthsLower, n) % 12;
      }
      return -1;
    },

    getWeekdayValue: function(n) {
      if (n) {
        return indexOf(this.weekdaysLower, n) % 7;
      }
      return -1;
    },

    getMonthName: function(n, mult) {
      if (mult) {
        n += (mult - 1) * 12;
      }
      return this.months[n];
    },

    getAbbreviatedMonthName: function(n) {
      return this.getAbbreviatedName(this.months, n, 12);
    },

    getWeekdayName: function(n) {
      return this.weekdays[n];
    },

    getAbbreviatedWeekdayName: function(n) {
      return this.getAbbreviatedName(this.weekdays, n, 7);
    },

    getAbbreviatedName: function(arr, n, offset) {
      return arr[n + offset] || arr[n];
    },

    getNumber: function(n, digit) {
      var mapped = this.ordinalNumberMap[n];
      if (isNumber(mapped)) {
        if (digit) {
          mapped = mapped % 10;
        }
        return mapped;
      }
      return isNumber(n) ? n : 1;
    },

    getOrdinal: function(n) {
      var suffix = this.fetch(this.ordinalSuffix, [n]);
      return suffix || getOrdinalSuffix(n);
    },

    getNumericDate: function(n) {
      var self = this;
      return n.replace(RegExp(this.num, 'g'), function(d) {
        var num = self.getNumber(d, true);
        return num || '';
      });
    },

    getUnitIndex: function(n) {
      return indexOf(this.unitsLower, n) % 8;
    },

    getRelativeFormat: function(adu) {
      return this.convertAdjustedToFormat(adu, adu[2] > 0 ? 'future' : 'past');
    },

    getDuration: function(ms) {
      return this.convertAdjustedToFormat(getAdjustedUnitForNumber(max(0, ms)), 'duration');
    },

    getFirstDayOfWeek: function() {
      var val = this.firstDayOfWeek;
      return isDefined(val) ? val : ISO_FIRST_DAY_OF_WEEK;
    },

    getFirstDayOfWeekYear: function() {
      return this.firstDayOfWeekYear || ISO_FIRST_DAY_OF_WEEK_YEAR;
    },

    isMDY: function() {
      // mm/dd/yyyy format.
      return !!this.mdy;
    },

    matchAM: function(str) {
      return this.matchMeridian(str, 0);
    },

    matchPM: function(str) {
      return this.matchMeridian(str, 1);
    },

    matchMeridian: function(str, index) {
      return some(this.get('ampmLower'), function(token, i) {
        return token === str && (i % 2) === index;
      });
    },

    convertAdjustedToFormat: function(adu, mode) {
      var sign, unit, mult,
          num    = adu[0],
          u      = adu[1],
          ms     = adu[2],
          format = this[mode] || this.relative;
      if (isFunction(format)) {
        return format.call(this, num, u, ms, mode);
      }
      mult = !this.plural || num === 1 ? 0 : 1;
      unit = this.units[mult * 8 + u] || this.units[u];
      sign = filter(this.modifiers, function(m) {
        return m.name == 'sign' && m.value == (ms > 0 ? 1 : -1);
      })[0];
      return format.replace(/\{(.*?)\}/g, function(full, match) {
        switch(match) {
          case 'num': return num;
          case 'unit': return unit;
          case 'sign': return sign.src;
        }
      });
    },

    getFormats: function() {
      return this.cachedFormats || this.compiledFormats;
    },

    setCachedFormat: function(dif) {
      var arr = filter(this.compiledFormats, function(f) {
        return f !== dif;
      });
      arr.unshift(dif);
      this.cachedFormats = arr;
    },

    addFormat: function(src, allowsTime, match, variant, iso) {
      var to = match || [], loc = this, time;

      function getTimeFirst(src, time) {
        return '(?:' + time + ')[,\\s\\u3000]+?' + src;
      }

      function getTimeLast(src, time) {
        var req = /\\d\{\d,\d\}\)+\??$/.test(src) ? '+' : '*';
        var timeMarkers = ['T','[\\s\\u3000]'].concat(loc.get('timeMarker'));
        return src + '(?:[,\\s]*(?:' + timeMarkers.join('|') + req + ')' + time + ')?';
      }

      src = src.replace(/\s+/g, '[,. ]*');
      src = src.replace(/\{([^,]+?)\}/g, function(all, k) {
        var value, result,
            opt   = k.match(/\?$/),
            nc    = k.match(/^(\d+)\??$/),
            slice = k.match(/(\d)(?:-(\d))?/),
            key   = k.replace(/[^a-z]+$/, '');
        if (nc) {
          value = loc.get('tokens')[nc[1]];
        } else if (loc[key]) {
          value = loc[key];
        } else if (loc[key + 's']) {
          value = loc[key + 's'];
          if (slice) {
            value = filter(value, function(m, i) {
              var mod = i % (loc.units ? 8 : value.length);
              return mod >= slice[1] && mod <= (slice[2] || slice[1]);
            });
          }
          value = arrayToAlternates(value);
        }
        if (!value) {
          return '';
        }
        if (nc) {
          result = '(?:' + value + ')';
        } else {
          if (!match) {
            to.push(key);
          }
          result = '(' + value + ')';
        }
        if (opt) {
          result += '?';
        }
        return result;
      });
      if (allowsTime) {
        time = loc.prepareTimeFormat(iso);
        loc.addRawFormat(getTimeFirst(src, time), TIME_FORMAT.concat(to), variant);
        loc.addRawFormat(getTimeLast(src, time), to.concat(TIME_FORMAT), variant);
      } else {
        loc.addRawFormat(src, to, variant);
      }
    },

    findModifier: function (obj, name) {
      var val = obj[name];
      if (val) {
        var key = name + '|' + val;
        return this.modifiersByKey[key];
      }
    },

    addRawFormat: function(format, match, variant) {
      this.compiledFormats.unshift({
        variant: !!variant,
        locale: this,
        reg: RegExp('^' + format + '$', 'i'),
        to: match
      });
      this.cachedFormats = null;
    },

    addTimeFormat: function() {
      this.addFormat(this.prepareTimeFormat(), false, TIME_FORMAT);
    },

    prepareTimeFormat: function(iso) {
      var loc = this, timeSuffixMapping = {'h':0,'m':1,'s':2}, src;
      return REQUIRED_TIME_REG.replace(/{([a-z])}/g, function(full, token) {
        // The ISO format allows times without ":",
        // so make sure that these markers are optional.
        var add, separators = [],
            isHourSuffix = token === 'h',
            tokenIsRequired = isHourSuffix && !iso;
        if (token === 'd') {
          // ISO8601 allows decimals in both hours and minutes,
          // so add that suffix if the format is marked as iso
          return iso ? DECIMAL_REG : '';
        } else if (token === 't') {
          return loc.get('ampm').join('|');
        } else {
          if (isHourSuffix) {
            separators.push(':');
          }
          if (add = loc.timeSuffixes[timeSuffixMapping[token]]) {
            separators.push(add + '\\s*');
          }
          src = '(?:' + separators.join('|') + ')' + (tokenIsRequired ? '' : '?');
          return separators.length === 0 ? '' : src;
        }
      });
    },

    init: function(def) {
      var loc = this;

      function initFormats() {
        loc.compiledFormats = [];
      }

      function initDefinition() {
        simpleMerge(loc, def);
      }

      function initArrayFields() {
        forEach(LOCALE_FIELDS, function(name) {
          var val = loc[name];
          if (isString(val)) {
            loc[name] = commaSplit(val);
          } else if (!val) {
            loc[name] = [];
          }
        });
      }

      function eachAlternate(str, fn) {
        str = map(str.split('+'), function(split) {
          return split.replace(/(.+):(.+)$/, function(full, base, suffixes) {
            return map(suffixes.split('|'), function(suffix) {
              return base + suffix;
            }).join('|');
          });
        }).join('|');
        return forEach(str.split('|'), fn);
      }

      function setArray(name, multiple) {
        var arr = [];
        forEach(loc[name], function(full, i) {
          eachAlternate(full, function(alt, j) {
            arr[j * multiple + i] = alt;
          });
        });
        loc[name] = arr;
        loc[name + 'Lower'] = arr.map(function(t) {
          return t.toLowerCase();
        });
      }

      function getDigit(start, stop, allowNumbers) {
        var str = '\\d{' + start + HALF_WIDTH_COMMA + stop + '}';
        if (allowNumbers) str += '|(?:' + arrayToAlternates(loc.get('numbers')) + ')+';
        return str;
      }

      function getNum() {
        var numbers = loc.get('numbers');
        var arr = ['-?\\d+'].concat(loc.get('articles'));
        if (numbers) {
          arr = arr.concat(numbers);
        }
        return arrayToAlternates(arr);
      }

      function setDefault(name, value) {
        loc[name] = loc[name] || value;
      }

      function buildNumbers() {
        var map = loc.ordinalNumberMap = {}, all = [];
        forEach(loc.numbers, function(full, i) {
          eachAlternate(full, function(alt) {
            all.push(alt);
            map[alt] = i;
          });
        });
        loc.numbers = all;
      }

      function buildModifiers() {
        var arr = [];
        loc.modifiersByKey = {};
        forEach(loc.modifiers, function(modifier) {
          var name = modifier.name;
          eachAlternate(modifier.src, function(t) {
            var key = name + '|' + t;
            var locEntry = loc[name];
            loc.modifiersByKey[key] = modifier;
            arr.push({ name: name, src: t, value: modifier.value });
            loc[name] = locEntry ? locEntry + '|' + t : t;
          });
        });
        loc.modifiers = arr;
      }

      initFormats();
      initDefinition();
      initArrayFields();

      buildNumbers();

      setArray('months', 12);
      setArray('weekdays', 7);
      setArray('units', 8);
      setArray('ampm', 2);

      setDefault('date', getDigit(1,2, loc.digitDate));
      setDefault('year', "'\\d{2}|" + getDigit(4,4));
      setDefault('num', getNum());

      loc.day = arrayToAlternates(loc.weekdaysLower);
      loc.fullMonth = getDigit(1,2) + '|' + arrayToAlternates(loc.months);

      buildModifiers();

      if (loc.monthSuffix) {
        loc.month = getDigit(1,2);
        loc.months = map(commaSplit('1,2,3,4,5,6,7,8,9,10,11,12'), function(n) {
          return n + loc.monthSuffix;
        });
      }

      // The order of these formats is very important. Order is reversed so
      // formats that are initialized later will take precedence. This generally
      // means that more specific formats should come later, however, the {year}
      // format should come before {day}, as 2011 needs to be parsed as a year
      // (2011) and not date (20) + hours (11), etc.

      loc.addTimeFormat();

      loc.addFormat('{day}', true);
      loc.addFormat('{month}' + (loc.monthSuffix || ''));
      loc.addFormat('{year}' + (loc.yearSuffix || ''));

      forEach(loc.parse, function(src) {
        loc.addFormat(src);
      });

      forEach(loc.timeParse, function(src) {
        loc.addFormat(src, true);
      });

      forEach(CoreDateFormats, function(df) {
        var match = commaSplit(df.match);
        loc.addFormat(df.src, df.time, match, df.variant, df.iso);
      });

    }

  };

  var EnglishLocaleBaseDefinition = {
    'code':       'en',
    'timeMarker': 'at',
    'ampm':       'AM,PM,a,p',
    'months':     'Jan:uary|,Feb:ruary|,Mar:ch|,Apr:il|,May,Jun:e|,Jul:y|,Aug:ust|,Sep:tember|t|,Oct:ober|,Nov:ember|,Dec:ember|',
    'weekdays':   'Sun:day|,Mon:day|,Tue:sday|,Wed:nesday|,Thu:rsday|,Fri:day|,Sat:urday|+weekend',
    'units':      'millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s',
    'numbers':    'zero,one|first,two|second,three|third,four|fourth,five|fifth,six|sixth,seven|seventh,eight|eighth,nine|ninth,ten|tenth',
    'articles':   'a,an,the',
    'tokens':     'the,st|nd|rd|th,of|in',
    'time':       '{H}:{mm}',
    'past':       '{num} {unit} {sign}',
    'future':     '{num} {unit} {sign}',
    'duration':   '{num} {unit}',
    'plural':     true,
    'modifiers': [
      { 'name': 'hours', 'src': 'noon', 'value': 12 },
      { 'name': 'hours', 'src': 'midnight', 'value': 24 },
      { 'name': 'day',   'src': 'yesterday', 'value': -1 },
      { 'name': 'day',   'src': 'today|tonight', 'value': 0 },
      { 'name': 'day',   'src': 'tomorrow', 'value': 1 },
      { 'name': 'sign',  'src': 'ago|before', 'value': -1 },
      { 'name': 'sign',  'src': 'from now|after|from|in|later', 'value': 1 },
      { 'name': 'edge',  'src': 'first day|first|beginning', 'value': -2 },
      { 'name': 'edge',  'src': 'last day', 'value': 1 },
      { 'name': 'edge',  'src': 'end|last', 'value': 2 },
      { 'name': 'shift', 'src': 'last', 'value': -1 },
      { 'name': 'shift', 'src': 'the|this', 'value': 0 },
      { 'name': 'shift', 'src': 'next', 'value': 1 }
    ],
    'parse': [
      '{month} {year}',
      '{shift} {unit:5-7}',
      '{0?} {date}{1}',
      '{hours} {day}',
      '{shift?} {day?} {timeMarker?} {hours}',
      '{0?} {edge} {weekday?} {2} {shift?} {unit:4-7?} {month?} {year?}'
    ],
    'timeParse': [
      '{num} {unit} {sign}',
      '{sign} {num} {unit}',
      '{0} {num}{1}? {day} {2} {month} {year?}',
      '{weekday?} {month} {date}{1?} {year?}',
      '{date} {month} {year}',
      '{date} {month}',
      '{shift} {weekday}',
      '{shift} week {weekday}',
      '{weekday} {2?} {shift} week',
      '{num?} {unit:4-5} {sign} {day}',
      '{0?} {date}{1} of {month}',
      '{0?}{month?} {date?}{1?} of {shift} {unit:6-7}',
      '{edge} of {day}'
    ]
  };

  var AmericanEnglishDefinition = getEnglishVariant({
    'mdy': true,
    'firstDayOfWeek': 0,
    'firstDayOfWeekYear': 1,
    'short':  '{MM}/{dd}/{yyyy}',
    'medium': '{Month} {d}, {yyyy}',
    'long':   '{Month} {d}, {yyyy} {time}',
    'full':   '{Weekday}, {Month} {d}, {yyyy} {time}',
    'stamp':  '{Dow} {Mon} {d} {yyyy} {time}',
    'time':   '{h}:{mm} {TT}'
  });

  var BritishEnglishDefinition = getEnglishVariant({
    'short':  '{dd}/{MM}/{yyyy}',
    'medium': '{d} {Month} {yyyy}',
    'long':   '{d} {Month} {yyyy} {H}:{mm}',
    'full':   '{Weekday}, {d} {Month}, {yyyy} {time}',
    'stamp':  '{Dow} {d} {Mon} {yyyy} {time}'
  });

  var CanadianEnglishDefinition = getEnglishVariant({
    'short':  '{yyyy}-{MM}-{dd}',
    'medium': '{d} {Month}, {yyyy}',
    'long':   '{d} {Month}, {yyyy} {H}:{mm}',
    'full':   '{Weekday}, {d} {Month}, {yyyy} {time}',
    'stamp':  '{Dow} {d} {Mon} {yyyy} {time}'
  });

  var LazyLoadedLocales = {
    'en-US': AmericanEnglishDefinition,
    'en-GB': BritishEnglishDefinition,
    'en-AU': BritishEnglishDefinition,
    'en-CA': CanadianEnglishDefinition
  };


  // Sorry about this guys...

  var English = new Locale(AmericanEnglishDefinition);
  var localeManager = new LocaleManager(English);


  buildDateUnits();
  buildCJKDigits();
  buildFormatTokens();
  buildDateUnitMethods();
  buildRelativeAliases();
  setDateChainableConstructor();
  'use strict';

  /***
   * @module String
   * @description String manupulation, encoding, truncation, and formatting.
   *
   ***/

  // Flag allowing native string methods to be enhanced
  var STRING_ENHANCEMENTS_FLAG = 'enhanceString';

  // Regex matching any HTML entity.
  var HTML_ENTITY_REG = /&#?(x)?([\w\d]{0,5});/gi;

  // Very basic HTML escaping regex.
  var HTML_ESCAPE_REG = /[&<>]/g;

  // Special HTML entities.
  var HTML_FROM_ENTITY_MAP = {
    'lt':    '<',
    'gt':    '>',
    'amp':   '&',
    'nbsp':  ' ',
    'quot':  '"',
    'apos':  "'"
  };

  var HTML_TO_ENTITY_MAP;

  // Regex matching camelCase.
  var CAMELIZE_REG = /(^|_)([^_]+)/g;

  // Words that should not be capitalized in titles
  var DOWNCASED_WORDS = [
    'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at',
    'by', 'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over',
    'with', 'for'
  ];

  // HTML tags that do not have inner content.
  var HTML_VOID_ELEMENTS = [
    'area','base','br','col','command','embed','hr','img',
    'input','keygen','link','meta','param','source','track','wbr'
  ];

  var LEFT_TRIM_REG  = RegExp('^['+ TRIM_CHARS +']+');
  var RIGHT_TRIM_REG = RegExp('['+ TRIM_CHARS +']+$');
  var TRUNC_REG      = RegExp('(?=[' + TRIM_CHARS + '])');

  // Reference to native String#includes to enhance later.
  var nativeIncludes = String.prototype.includes;

  // Base64
  var encodeBase64, decodeBase64;

  // Format matcher for String#format.
  var stringFormatMatcher = createFormatMatcher(deepGetProperty);

  function getAcronym(str) {
    var inflector = sugarString.Inflector;
    var word = inflector && inflector.acronyms[str];
    if (isString(word)) {
      return word;
    }
  }

  function padString(num, padding) {
    return repeatString(isDefined(padding) ? padding : ' ', num);
  }

  function spacify(str) {
    return underscore(str).replace(/_/g, ' ');
  }

  function truncateString(str, length, from, ellipsis, split) {
    var str1, str2, len1, len2;
    if (str.length <= length) {
      return str.toString();
    }
    ellipsis = isUndefined(ellipsis) ? '...' : ellipsis;
    switch(from) {
      case 'left':
        str2 = split ? truncateOnWord(str, length, true) : str.slice(str.length - length);
        return ellipsis + str2;
      case 'middle':
        len1 = ceil(length / 2);
        len2 = floor(length / 2);
        str1 = split ? truncateOnWord(str, len1) : str.slice(0, len1);
        str2 = split ? truncateOnWord(str, len2, true) : str.slice(str.length - len2);
        return str1 + ellipsis + str2;
      default:
        str1 = split ? truncateOnWord(str, length) : str.slice(0, length);
        return str1 + ellipsis;
    }
  }

  function stringEach(str, search, fn) {
    var i, len, chunks, chunk, ret, result = [];
    if (isFunction(search)) {
      fn = search;
      search = /[\s\S]/g;
    } else if (!search) {
      search = /[\s\S]/g;
    } else if (isString(search)) {
      search = RegExp(escapeRegExp(search), 'gi');
    } else if (isRegExp(search)) {
      search = RegExp(search.source, getRegExpFlags(search, 'g'));
    }
    // Can't use exec as we need to pass the entire array into
    // the callback if it exists.
    chunks = str.match(search);
    // < IE9 has enumable properties on regex matches that will
    // confuse for..in loops, so need to dump to an array.
    if (chunks) {
      for(i = 0, len = chunks.length; i < len; i++) {
        chunk = chunks[i];
        result[i] = chunk;
        if (fn) {
          ret = fn.call(str, chunk, i, chunks);
          if (ret === false) {
            break;
          } else if (isDefined(ret)) {
            result[i] = ret;
          }
        }
      }
    }
    return result;
  }

  function eachWord(str, fn) {
    return stringEach(trim(str), /\S+/g, fn);
  }

  function stringCodes(str, fn) {
    var codes = [], i, len;
    for(i = 0, len = str.length; i < len; i++) {
      var code = str.charCodeAt(i);
      codes.push(code);
      if (fn) fn.call(str, code, i, str);
    }
    return codes;
  }

  function underscore(str) {
    var inflector = sugarString.Inflector;
    return str
      .replace(/[-\s]+/g, '_')
      .replace(inflector && inflector.acronymRegExp, function(acronym, index) {
        return (index > 0 ? '_' : '') + acronym.toLowerCase();
      })
      .replace(/([A-Z\d]+)([A-Z][a-z])/g,'$1_$2')
      .replace(/([a-z\d])([A-Z])/g,'$1_$2')
      .toLowerCase();
  }

  function capitalize(str, all) {
    var lastResponded;
    // Identical to /[^']/g. Trying not to break Github's syntax highlighter.
    return str.toLowerCase().replace(all ? /[^\u0027]/g : /^\S/, function(lower) {
      var upper = lower.toUpperCase(), result;
      result = lastResponded ? lower : upper;
      lastResponded = upper !== lower;
      return result;
    });
  }

  function reverseString(str) {
    return str.split('').reverse().join('');
  }

  function truncateOnWord(str, limit, fromLeft) {
    if (fromLeft) {
      return reverseString(truncateOnWord(reverseString(str), limit));
    }
    var words = str.split(TRUNC_REG);
    var count = 0;
    return filter(words, function(word) {
      count += word.length;
      return count <= limit;
    }).join('');
  }

  function unescapeHTML(str) {
    return str.replace(HTML_ENTITY_REG, function(full, hex, code) {
      var special = HTML_FROM_ENTITY_MAP[code];
      return special || chr(hex ? parseInt(code, 16) : +code);
    });
  }

  function tagIsVoid(tag) {
    return indexOf(HTML_VOID_ELEMENTS, tag.toLowerCase()) !== -1;
  }

  function stringReplaceAll(str, f, replace) {
    var i = 0, tokens;
    if (isString(f)) {
      f = RegExp(escapeRegExp(f), 'g');
    } else if (f && !f.global) {
      f = RegExp(f.source, getRegExpFlags(f, 'g'));
    }
    if (!replace) {
      replace = '';
    } else {
      tokens = replace;
      replace = function() {
        var t = tokens[i++];
        return t != null ? t : '';
      };
    }
    return str.replace(f, replace);
  }

  function replaceTags(str, find, replacement, strip) {
    var tags = isString(find) ? [find] : find, reg, src;
    tags = map(tags || [], function(t) {
      return escapeRegExp(t);
    }).join('|');
    src = tags.replace('all', '') || '[^\\s>]+';
    src = '<(\\/)?(' + src + ')(\\s+[^<>]*?)?\\s*(\\/)?>';
    reg = RegExp(src, 'gi');
    return runTagReplacements(str.toString(), reg, strip, replacement);
  }

  function runTagReplacements(str, reg, strip, replacement, fullString) {

    var match;
    var result = '';
    var currentIndex = 0;
    var openTagName;
    var openTagAttributes;
    var openTagCount = 0;

    function processTag(index, tagName, attributes, tagLength, isVoid) {
      var content = str.slice(currentIndex, index), s = '', r = '';
      if (isString(replacement)) {
        r = replacement;
      } else if (replacement) {
        r = replacement.call(fullString, tagName, content, attributes, fullString) || '';
      }
      if (strip) {
        s = r;
      } else {
        content = r;
      }
      if (content) {
        content = runTagReplacements(content, reg, strip, replacement, fullString);
      }
      result += s + content + (isVoid ? '' : s);
      currentIndex = index + (tagLength || 0);
    }

    fullString = fullString || str;
    reg = RegExp(reg.source, 'gi');

    while(match = reg.exec(str)) {

      var tagName         = match[2];
      var attributes      = (match[3]|| '').slice(1);
      var isClosingTag    = !!match[1];
      var isSelfClosing   = !!match[4];
      var tagLength       = match[0].length;
      var isVoid          = tagIsVoid(tagName);
      var isOpeningTag    = !isClosingTag && !isSelfClosing && !isVoid;
      var isSameAsCurrent = tagName === openTagName;

      if (!openTagName) {
        result += str.slice(currentIndex, match.index);
        currentIndex = match.index;
      }

      if (isOpeningTag) {
        if (!openTagName) {
          openTagName = tagName;
          openTagAttributes = attributes;
          openTagCount++;
          currentIndex += tagLength;
        } else if (isSameAsCurrent) {
          openTagCount++;
        }
      } else if (isClosingTag && isSameAsCurrent) {
        openTagCount--;
        if (openTagCount === 0) {
          processTag(match.index, openTagName, openTagAttributes, tagLength, isVoid);
          openTagName       = null;
          openTagAttributes = null;
        }
      } else if (!openTagName) {
        processTag(match.index, tagName, attributes, tagLength, isVoid);
      }
    }
    if (openTagName) {
      processTag(str.length, openTagName, openTagAttributes);
    }
    result += str.slice(currentIndex);
    return result;
  }

  function numberOrIndex(str, n, from) {
    if (isString(n)) {
      n = str.indexOf(n);
      if (n === -1) {
        n = from ? str.length : 0;
      }
    }
    return n;
  }

  function buildBase64() {
    var encodeAscii, decodeAscii;

    function catchEncodingError(fn) {
      return function(str) {
        try {
          return fn(str);
        } catch(e) {
          return '';
        }
      };
    }

    if (typeof Buffer !== 'undefined') {
      encodeBase64 = function(str) {
        return new Buffer(str).toString('base64');
      };
      decodeBase64 = function(str) {
        return new Buffer(str, 'base64').toString('utf8');
      };
      return;
    }
    if (typeof btoa !== 'undefined') {
      encodeAscii = catchEncodingError(btoa);
      decodeAscii = catchEncodingError(atob);
    } else {
      var key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      var base64reg = /[^A-Za-z0-9\+\/\=]/g;
      encodeAscii = function(str) {
        var output = '';
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
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
          output += key.charAt(enc1);
          output += key.charAt(enc2);
          output += key.charAt(enc3);
          output += key.charAt(enc4);
          chr1 = chr2 = chr3 = '';
          enc1 = enc2 = enc3 = enc4 = '';
        } while (i < str.length);
        return output;
      };
      decodeAscii = function(input) {
        var output = '';
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        if (input.match(base64reg)) {
          return '';
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        do {
          enc1 = key.indexOf(input.charAt(i++));
          enc2 = key.indexOf(input.charAt(i++));
          enc3 = key.indexOf(input.charAt(i++));
          enc4 = key.indexOf(input.charAt(i++));
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
          output = output + chr(chr1);
          if (enc3 != 64) {
            output = output + chr(chr2);
          }
          if (enc4 != 64) {
            output = output + chr(chr3);
          }
          chr1 = chr2 = chr3 = '';
          enc1 = enc2 = enc3 = enc4 = '';
        } while (i < input.length);
        return output;
      };
    }
    encodeBase64 = function(str) {
      return encodeAscii(unescape(encodeURIComponent(str)));
    };
    decodeBase64 = function(str) {
      return decodeURIComponent(escape(decodeAscii(str)));
    };
  }

  function buildEntities() {
    HTML_TO_ENTITY_MAP = {};
    iterateOverObject(HTML_FROM_ENTITY_MAP, function(k, v) {
      HTML_TO_ENTITY_MAP[v] = '&' + k + ';';
    });
  }

  function callIncludesWithRegexSupport(str, search, position) {
    if (!isRegExp(search)) {
      return nativeIncludes.call(str, search, position);
    }
    if (position) {
      str = str.slice(position);
    }
    return search.test(str);
  }

  defineInstance(sugarString, {

    // Enhancment to String#includes to allow a regex.
    'includes': fixArgumentLength(callIncludesWithRegexSupport)

  }, [ENHANCEMENTS_FLAG, STRING_ENHANCEMENTS_FLAG]);

  defineInstance(sugarString, {

    /***
     * @method at(<index>, [loop] = false)
     * @returns String or Array
     * @short Gets the character(s) at a given index.
     * @extra When [loop] is true, overshooting the end of the string (or the
     *        beginning) will begin counting from the other end. If <index> is an
     *        array, multiple elements will be returned.
     * @example
     *
     *   'jumpy'.at(0)             -> 'j'
     *   'jumpy'.at(2)             -> 'm'
     *   'jumpy'.at(5)             -> ''
     *   'jumpy'.at(5, true)       -> 'j'
     *   'jumpy'.at(-1)            -> 'y'
     *   'lucky charms'.at([2, 4]) -> ['u','k']
     *
     ***/
    'at': function(str, index, loop) {
      return getEntriesForIndexes(str, index, loop, true);
    },

     /***
      * @method escapeURL([param] = false)
      * @returns String
      * @short Escapes characters in a string to make a valid URL.
      * @extra If [param] is true, it will also escape valid URL characters. Use
      *        this when the entire string is meant for use in a query string.
      *
      * @example
      *
      *   'a, b, and c'.escapeURL() -> 'a,%20b,%20and%20c'
      *   'http://foo.com/'.escapeURL(true) -> 'http%3A%2F%2Ffoo.com%2F'
      *
      ***/
    'escapeURL': function(str, param) {
      return param ? encodeURIComponent(str) : encodeURI(str);
    },

     /***
      * @method unescapeURL([partial] = false)
      * @returns String
      * @short Restores escaped characters in a URL escaped string.
      * @extra If [partial] is true, it will only unescape non-valid URL tokens,
      *        and is included here for completeness, but should be rarely needed.
      *
      * @example
      *
      *   'http%3A%2F%2Ffoo.com%2F'.unescapeURL()     -> 'http://foo.com/'
      *   'http%3A%2F%2Ffoo.com%2F'.unescapeURL(true) -> 'http%3A%2F%2Ffoo.com%2F'
      *
      ***/
    'unescapeURL': function(str, param) {
      return param ? decodeURI(str) : decodeURIComponent(str);
    },

     /***
      * @method escapeHTML()
      * @returns String
      * @short Converts HTML characters to their entity equivalents.
      *
      * @example
      *
      *   '<p>some text</p>'.escapeHTML() -> '&lt;p&gt;some text&lt;/p&gt;'
      *   'one & two'.escapeHTML()        -> 'one &amp; two'
      *
      ***/
    'escapeHTML': function(str) {
      return str.replace(HTML_ESCAPE_REG, function(chr) {
        return HTML_TO_ENTITY_MAP[chr];
      });
    },

     /***
      * @method unescapeHTML()
      * @returns String
      * @short Restores escaped HTML characters.
      *
      * @example
      *
      *   '&lt;p&gt;some text&lt;/p&gt;'.unescapeHTML() -> '<p>some text</p>'
      *   'one &amp; two'.unescapeHTML()                -> 'one & two'
      *
      ***/
    'unescapeHTML': function(str) {
      return unescapeHTML(str);
    },

    /***
     * @method stripTags([tag] = 'all', [replace])
     * @returns String
     * @short Strips HTML tags from the string.
     * @extra [tag] may be an array of tags or 'all', in which case all tags will
     *        be stripped. [replace] will replace what was stripped, and may be a
     *        string or a function to handle replacements. If this function returns
     *        a string, then it will be used for the replacement. If it returns
     *        `undefined`, the tags will be stripped normally.
     *
     * @callback replace
     *
     *   tag     The tag name.
     *   inner   The tag content.
     *   attr    The attributes on the tag, if any, as a string.
     *   outer   The entire matched tag string.
     *
     * @example
     *
     *   '<p>just <b>some</b> text</p>'.stripTags()    -> 'just some text'
     *   '<p>just <b>some</b> text</p>'.stripTags('p') -> 'just <b>some</b> text'
     *   '<p>hi!</p>'.stripTags('p', function('all', content) {
     *     return '|' + content + '|';
     *   }); -> '|hi!|'
     *
     ***/
    'stripTags': function(str, tag, replace) {
      return replaceTags(str, tag, replace, true);
    },

    /***
     * @method removeTags([tag] = 'all', [replace])
     * @returns String
     * @short Removes HTML tags and their contents from the string.
     * @extra [tag] may be an array of tags or 'all', in which case all tags will
     *        be removed. [replace] will replace what was removed, and may be a
     *        string or a function to handle replacements. If this function returns
     *        a string, then it will be used for the replacement. If it returns
     *        `undefined`, the tags will be removed normally.
     *
     * @callback replace
     *
     *   tag     The tag name.
     *   inner   The tag content.
     *   attr    The attributes on the tag, if any, as a string.
     *   outer   The entire matched tag string.
     *
     * @example
     *
     *   '<p>just <b>some</b> text</p>'.removeTags()    -> ''
     *   '<p>just <b>some</b> text</p>'.removeTags('b') -> '<p>just text</p>'
     *   '<p>hi!</p>'.removeTags('p', function('all', content) {
     *     return 'bye!';
     *   }); -> 'bye!'
     *
     ***/
    'removeTags': function(str, tag, replace) {
      return replaceTags(str, tag, replace, false);
    },

     /***
      * @method encodeBase64()
      * @returns String
      * @short Encodes the string into base64 encoding.
      * @extra This method wraps native methods when available, and uses a custom
      *        implementation when not available. It can also handle Unicode
      *        string encodings.
      *
      * @example
      *
      *   'gonna get encoded!'.encodeBase64()  -> 'Z29ubmEgZ2V0IGVuY29kZWQh'
      *   'http://twitter.com/'.encodeBase64() -> 'aHR0cDovL3R3aXR0ZXIuY29tLw=='
      *
      ***/
    'encodeBase64': function(str) {
      return encodeBase64(str);
    },

     /***
      * @method decodeBase64()
      * @returns String
      * @short Decodes the string from base64 encoding.
      * @extra This method wraps native methods when available, and uses a custom
      *        implementation when not available. It can also handle Unicode string
      *        encodings.
      *
      * @example
      *
      *   'aHR0cDovL3R3aXR0ZXIuY29tLw=='.decodeBase64() -> 'http://twitter.com/'
      *   'anVzdCBnb3QgZGVjb2RlZA=='.decodeBase64()     -> 'just got decoded!'
      *
      ***/
    'decodeBase64': function(str) {
      return decodeBase64(str);
    },

    /***
     * @method each([search], [fn])
     * @returns Array
     * @short Runs callback [fn] against each occurence of [search] or each
     *        character if [search] is not provided.
     * @extra Returns an array of matches. [search] may be either a string or
     *        regex, and defaults to every character in the string. If [fn]
     *        returns false at any time it will break out of the loop.
     *
     * @callback fn
     *
     *   match  The current match.
     *   i      The current index.
     *   arr    An array of all matches.
     *
     * @example
     *
     *   'jumpy'.each() -> ['j','u','m','p','y']
     *   'jumpy'.each(/[r-z]/) -> ['u','y']
     *   'jumpy'.each(/[r-z]/, function(m) {
     *     // Called twice: "u", "y"
     *   });
     *
     ***/
    'each': function(str, search, fn) {
      return stringEach(str, search, fn);
    },

    /***
     * @method chars([fn])
     * @returns Array
     * @short Runs [fn] against each character in the string, and returns an array.
     *
     * @callback fn
     *
     *   code  The current character.
     *   i     The current index.
     *   arr   An array of all characters.
     *
     * @example
     *
     *   'jumpy'.chars() -> ['j','u','m','p','y']
     *   'jumpy'.chars(function(c) {
     *     // Called 5 times: "j","u","m","p","y"
     *   });
     *
     ***/
    'chars': function(str, search, fn) {
      return stringEach(str, search, fn);
    },

    /***
     * @method words([fn])
     * @returns Array
     * @short Runs [fn] against each word in the string, and returns an array.
     * @extra A "word" is defined as any sequence of non-whitespace characters.
     *
     * @callback fn
     *
     *   word  The current word.
     *   i     The current index.
     *   arr   An array of all words.
     *
     * @example
     *
     *   'broken wear'.words() -> ['broken','wear']
     *   'broken wear'.words(function(w) {
     *     // Called twice: "broken", "wear"
     *   });
     *
     ***/
    'words': function(str, fn) {
      return stringEach(trim(str), /\S+/g, fn);
    },

    /***
     * @method lines([fn])
     * @returns Array
     * @short Runs [fn] against each line in the string, and returns an array.
     *
     * @callback fn
     *
     *   line  The current line.
     *   i     The current index.
     *   arr   An array of all lines.
     *
     * @example
     *
     *   longText.lines() -> array of lines
     *   longText.lines(function(l) {
     *     // Called once per line
     *   });
     *
     ***/
    'lines': function(str, fn) {
      return stringEach(trim(str), /^.*$/gm, fn);
    },

    /***
     * @method paragraphs([fn])
     * @returns Array
     * @short Runs [fn] against each paragraph in the string, and returns an array.
     * @extra A paragraph is defined as a block of text bounded by two or more
     *        line breaks.
     *
     * @callback fn
     *
     *   p     The current paragraph.
     *   i     The current index.
     *   arr   An array of all paragraphs.
     *
     * @example
     *
     *   longText.paragraphs() -> array of paragraphs
     *   longText.paragraphs(function(p) {
     *     // Called once per paragraph
     *   });
     *
     ***/
    'paragraphs': function(str, fn) {
      var paragraphs = trim(str).split(/[\r\n]{2,}/);
      paragraphs = map(paragraphs, function(p, i) {
        if (fn) {
          var s = fn.call(p, p, i, paragraphs);
        }
        return s ? s : p;
      });
      return paragraphs;
    },

    /***
     * @method codes([fn])
     * @returns Array
     * @short Runs callback [fn] against each character code in the string.
     *        Returns an array of character codes.
     *
     * @callback fn
     *
     *   code  The current character code.
     *   i     The current index.
     *   str   The string being operated on.
     *
     * @example
     *
     *   'jumpy'.codes() -> [106,117,109,112,121]
     *   'jumpy'.codes(function(c) {
     *     // Called 5 times: 106, 117, 109, 112, 121
     *   });
     *
     ***/
    'codes': function(str, fn) {
      return stringCodes(str, fn);
    },

    /***
     * @method shift(<n>)
     * @returns Array
     * @short Shifts each character in the string <n> places in the character map.
     *
     * @example
     *
     *   'a'.shift(1)  -> 'b'
     *   'ク'.shift(1) -> 'グ'
     *
     ***/
    'shift': function(str, n) {
      var result = '';
      n = n || 0;
      stringCodes(str, function(c) {
        result += chr(c + n);
      });
      return result;
    },

    /***
     * @method isBlank()
     * @returns Boolean
     * @short Returns true if the string has length 0 or contains only whitespace.
     *
     * @example
     *
     *   ''.isBlank()      -> true
     *   '   '.isBlank()   -> true
     *   'noway'.isBlank() -> false
     *
     ***/
    'isBlank': function(str) {
      return trim(str).length === 0;
    },

    /***
     * @method add(<str>, [index] = length)
     * @returns String
     * @short Adds <str> at [index]. Negative values are also allowed.
     * @extra `insert` is provided as an alias, and is generally more readable
     *        when using an index.
     *
     * @example
     *
     *   'schfifty'.add(' five')      -> schfifty five
     *   'dopamine'.insert('e', 3)       -> dopeamine
     *   'spelling eror'.insert('r', -3) -> spelling error
     *
     ***/
    'add': function(str, addStr, index) {
      index = isUndefined(index) ? str.length : index;
      return str.slice(0, index) + addStr + str.slice(index);
    },

    /***
     * @method remove(<f>)
     * @returns String
     * @short Removes the first occurrence of <f> in the string.
     * @extra <f> can be a either case-sensitive string or a regex. In either case
     *        only the first match will be removed. To remove multiple occurrences,
     *        use `removeAll`.
     *
     * @example
     *
     *   'schfifty five'.remove('f')      -> 'schifty five'
     *   'schfifty five'.remove(/[a-f]/g) -> 'shfifty five'
     *
     ***/
    'remove': function(str, f) {
      return str.replace(f, '');
    },

    /***
     * @method removeAll(<f>)
     * @returns String
     * @short Removes any occurences of <f> in the string.
     * @extra <f> can be either a case-sensitive string or a regex. In either case
     *        all matches will be removed. To remove only a single occurence, use
     *        `remove`.
     *
     * @example
     *
     *   'schfifty five'.removeAll('f')     -> 'schity ive'
     *   'schfifty five'.removeAll(/[a-f]/) -> 'shity iv'
     *
     ***/
    'removeAll': function(str, f) {
      return stringReplaceAll(str, f);
    },

    /***
     * @method reverse()
     * @returns String
     * @short Reverses the string.
     *
     * @example
     *
     *   'jumpy'.reverse()        -> 'ypmuj'
     *   'lucky charms'.reverse() -> 'smrahc ykcul'
     *
     ***/
    'reverse': function(str) {
      return reverseString(str);
    },

    /***
     * @method compact()
     * @returns String
     * @short Compacts whitespace in the string to a single space and trims the ends.
     *
     * @example
     *
     *   'too \n much \n space'.compact() -> 'too much space'
     *   'enough \n '.compact()           -> 'enought'
     *
     ***/
    'compact': function(str) {
      return trim(str).replace(/([\r\n\s　])+/g, function(match, whitespace) {
        return whitespace === '　' ? whitespace : ' ';
      });
    },

    /***
     * @method from([index] = 0)
     * @returns String
     * @short Returns a section of the string starting from [index].
     *
     * @example
     *
     *   'lucky charms'.from()   -> 'lucky charms'
     *   'lucky charms'.from(7)  -> 'harms'
     *
     ***/
    'from': function(str, from) {
      return str.slice(numberOrIndex(str, from, true));
    },

    /***
     * @method to([index] = end)
     * @returns String
     * @short Returns a section of the string ending at [index].
     *
     * @example
     *
     *   'lucky charms'.to()   -> 'lucky charms'
     *   'lucky charms'.to(7)  -> 'lucky ch'
     *
     ***/
    'to': function(str, to) {
      if (isUndefined(to)) to = str.length;
      return str.slice(0, numberOrIndex(str, to));
    },

    /***
     * @method dasherize()
     * @returns String
     * @short Converts underscores and camel casing to hypens.
     *
     * @example
     *
     *   'a_farewell_to_arms'.dasherize() -> 'a-farewell-to-arms'
     *   'capsLock'.dasherize()           -> 'caps-lock'
     *
     ***/
    'dasherize': function(str) {
      return underscore(str).replace(/_/g, '-');
    },

    /***
     * @method underscore()
     * @returns String
     * @short Converts hyphens and camel casing to underscores.
     *
     * @example
     *
     *   'a-farewell-to-arms'.underscore() -> 'a_farewell_to_arms'
     *   'capsLock'.underscore()           -> 'caps_lock'
     *
     ***/
    'underscore': function(str) {
      return underscore(str);
    },

    /***
     * @method camelize([first] = true)
     * @returns String
     * @short Converts underscores and hyphens to camel case. If [first] is true,
     *        the first letter will also be capitalized.
     * @extra If the Inflections module is included acryonyms can also be defined
     *        that will be used when camelizing.
     *
     * @example
     *
     *   'caps_lock'.camelize()              -> 'CapsLock'
     *   'moz-border-radius'.camelize()      -> 'MozBorderRadius'
     *   'moz-border-radius'.camelize(false) -> 'mozBorderRadius'
     *
     ***/
    'camelize': function(str, first) {
      str = underscore(str);
      return str.replace(CAMELIZE_REG, function(match, pre, word, index) {
        var acronym = getAcronym(word), cap = first !== false || index > 0;
        if (acronym) return cap ? acronym : acronym.toLowerCase();
        return cap ? capitalize(word) : word;
      });
    },

    /***
     * @method spacify()
     * @returns String
     * @short Converts camelcase, underscores, and hyphens to spaces.
     *
     * @example
     *
     *   'camelCase'.spacify()                         -> 'camel case'
     *   'an-ugly-string'.spacify()                    -> 'an ugly string'
     *   'oh-no_youDid-not'.spacify().capitalize(true) -> 'something else'
     *
     ***/
    'spacify': function(str) {
      return underscore(str).replace(/_/g, ' ');
    },

    /***
     * @method titleize()
     * @returns String
     * @short Creates a title version of the string.
     * @extra Capitalizes all the words and replaces some characters in the string
     *        to create a nicer looking title. String#titleize is meant for
     *        creating pretty output.
     *
     * @example
     *
     *   'man from the boondocks'.titleize() -> 'Man from the Boondocks'
     *   'x-men: apocalypse'.titleize() -> 'X Men: Apocalypse'
     *   'TheManWithoutAPast'.titleize() -> 'The Man Without a Past'
     *   'raiders_of_the_lost_ark'.titleize() -> 'Raiders of the Lost Ark'
     *
     ***/
    'titleize': function(str) {
      var fullStopPunctuation = /[.:;!]$/, lastHadPunctuation;
      str = spacify(str);
      if (sugarString.Inflector) {
        str = Inflector.humanize(str);
      }
      return eachWord(str, function(word, index, words) {
        var hasPunctuation, isFirstOrLast;
        var first = index == 0, last = index == words.length - 1;
        hasPunctuation = fullStopPunctuation.test(word);
        isFirstOrLast = first || last || hasPunctuation || lastHadPunctuation;
        lastHadPunctuation = hasPunctuation;
        if (isFirstOrLast || indexOf(DOWNCASED_WORDS, word) === -1) {
          return capitalizeWithoutDowncasing(word, true);
        } else {
          return word;
        }
      }).join(' ');
    },

    /***
     * @method parameterize()
     * @returns String
     * @short Replaces special characters in a string so that it may be used as
     *        part of a pretty URL.
     *
     * @example
     *
     *   'hell, no!'.parameterize() -> 'hell-no'
     *
     ***/
    'parameterize': function(str, separator) {
      var reg;
      if (sugarString.toAscii) {
        str = sugarString.toAscii(str);
      }
      if (separator === undefined) separator = '-';
      str = str.replace(/[^a-z0-9\-_]+/gi, separator);
      if (separator) {
        reg = RegExp('^{s}+|{s}+$|({s}){s}+'.split('{s}').join(escapeRegExp(separator)), 'g');
        str = str.replace(reg, '$1');
      }
      return encodeURI(str.toLowerCase());
    },

    /***
     * @method truncate(<length>, [from] = 'right', [ellipsis] = '...')
     * @returns String
     * @short Truncates a string.
     * @extra [from] can be `'right'`, `'left'`, or `'middle'`. If the string is
     *        shorter than <length>, [ellipsis] will not be added.
     *
     * @example
     *
     *   'sittin on the dock'.truncate(10)           -> 'sittin on ...'
     *   'sittin on the dock'.truncate(10, 'left')   -> '...n the dock'
     *   'sittin on the dock'.truncate(10, 'middle') -> 'sitti... dock'
     *
     ***/
    'truncate': function(str, length, from, ellipsis) {
      return truncateString(str, length, from, ellipsis);
    },

    /***
     * @method truncateOnWord(<length>, [from] = 'right', [ellipsis] = '...')
     * @returns String
     * @short Truncates a string without splitting up words.
     * @extra [from] can be `'right'`, `'left'`, or `'middle'`. If the string is
     *        shorter than <length>, [ellipsis] will not be added.
     *
     * @example
     *
     *   'here we go'.truncateOnWord(5)         -> 'here...'
     *   'here we go'.truncateOnWord(5, 'left') -> '...we go'
     *
     ***/
    'truncateOnWord': function(str, length, from, ellipsis) {
      return truncateString(str, length, from, ellipsis, true);
    },

    /***
     * @method pad[Side](<num> = null, [padding] = ' ')
     * @returns String
     * @short Pads the string out with [padding] to be exactly <num> characters.
     *
     * @set
     *   pad
     *   padLeft
     *   padRight
     *
     * @example
     *
     *   'wasabi'.pad(8)           -> ' wasabi '
     *   'wasabi'.padLeft(8)       -> '  wasabi'
     *   'wasabi'.padRight(8)      -> 'wasabi  '
     *   'wasabi'.padRight(8, '-') -> 'wasabi--'
     *
     ***/
    'pad': function(str, num, padding) {
      var half, front, back;
      num   = coercePositiveInteger(num);
      half  = max(0, num - str.length) / 2;
      front = floor(half);
      back  = ceil(half);
      return padString(front, padding) + str + padString(back, padding);
    },

    'padLeft': function(str, num, padding) {
      num = coercePositiveInteger(num);
      return padString(max(0, num - str.length), padding) + str;
    },

    'padRight': function(str, num, padding) {
      num = coercePositiveInteger(num);
      return str + padString(max(0, num - str.length), padding);
    },

    /***
     * @method first([n] = 1)
     * @returns String
     * @short Returns the first [n] characters of the string.
     *
     * @example
     *
     *   'lucky charms'.first()  -> 'l'
     *   'lucky charms'.first(3) -> 'luc'
     *
     ***/
    'first': function(str, num) {
      if (isUndefined(num)) num = 1;
      return str.substr(0, num);
    },

    /***
     * @method last([n] = 1)
     * @returns String
     * @short Returns the last [n] characters of the string.
     *
     * @example
     *
     *   'lucky charms'.last()  -> 's'
     *   'lucky charms'.last(3) -> 'rms'
     *
     ***/
    'last': function(str, num) {
      if (isUndefined(num)) num = 1;
      var start = str.length - num < 0 ? 0 : str.length - num;
      return str.substr(start);
    },

    /***
     * @method toNumber([base] = 10)
     * @returns Number
     * @short Converts the string into a number.
     * @extra Any value with a "." fill be converted to a floating point value,
     *        otherwise an integer.
     *
     * @example
     *
     *   '153'.toNumber()    -> 153
     *   '12,000'.toNumber() -> 12000
     *   '10px'.toNumber()   -> 10
     *   'ff'.toNumber(16)   -> 255
     *
     ***/
    'toNumber': function(str, base) {
      return stringToNumber(str, base);
    },

    /***
     * @method capitalize([all] = false)
     * @returns String
     * @short Capitalizes the first character of the string and downcases the rest.
     * @extra If [all] is true, all words in the string will be capitalized.
     *
     * @example
     *
     *   'hello'.capitalize()           -> 'Hello'
     *   'hello kitty'.capitalize()     -> 'Hello kitty'
     *   'hello kitty'.capitalize(true) -> 'Hello Kitty'
     *
     *
     ***/
    'capitalize': function(str, all) {
      return capitalize(str, all);
    },

    /***
     * @method trim[Side]()
     * @returns String
     * @short Removes leading or trailing whitespace from the string.
     * @extra Whitespace is defined as line breaks, tabs, and any character in the
     *        "Space, Separator" Unicode category, conforming to the the ES5 spec.
     *
     * @set
     *   trimLeft
     *   trimRight
     *
     * @example
     *
     *   '   wasabi   '.trimLeft()  -> 'wasabi   '
     *   '   wasabi   '.trimRight() -> '   wasabi'
     *
     ***/

    'trimLeft': function(str) {
      return str.replace(LEFT_TRIM_REG, '');
    },

    'trimRight': function(str) {
      return str.replace(RIGHT_TRIM_REG, '');
    }

  });


  defineInstanceWithArguments(sugarString, {

    /***
     * @method replaceAll(<f>, [str1], [str2], ...)
     * @returns String
     * @short Replaces all occurences of <f> with arguments passed.
     * @extra This method is intended to be a quick way to perform multiple string
     *        replacements quickly when the replacement token differs depending on
     *        position. <f> can be either a case-sensitive string or a regex.
     *        In either case all matches will be replaced.
     *
     * @example
     *
     *   '-x -y -z'.replaceAll('-', 1, 2, 3)              -> '1x 2y 3z'
     *   'one and two'.replaceAll(/one|two/, '1st', 2nd') -> '1st and 2nd'
     *
     ***/
    'replaceAll': function(str, f, args) {
      return stringReplaceAll(str, f, args);
    },

    /***
     * @method format(<obj1>, <obj2>, ...)
     * @returns String
     * @short Replaces `{}` tokens in the string with arguments or properties.
     * @extra Tokens support `deep properties`. If a single object is passed, its
     *        properties can be accessed by keywords such as `{name}`. If multiple
     *        objects or a non-object are passed, they can be accessed by the
     *        argument position like `{0}`. Literal braces in the string can be
     *        escaped by repeating them.
     *
     * @example
     *
     *   'Welcome, {name}.'.format({name:'Bill'}) -> 'Welcome, Bill.'
     *   'You are {0} years old today.'.format(5) -> 'You are 5 years old today.'
     *   '{0.name} and {1.name}'.format(users)    -> logs first two users' names
     *
     ***/
    'format': function(str, args) {
      var arg1 = args[0] && args[0].valueOf();
      // Unwrap if a single object is passed in.
      if (args.length === 1 && isObjectType(arg1)) {
        args = arg1;
      }
      return stringFormatMatcher(str, args);
    }

  });


  /***
   * @method insert()
   * @alias add
   *
   ***/
  alias(sugarString, 'insert', 'add');

  buildBase64();
  buildEntities();
  'use strict';

  /***
   * @module Array
   * @description Array manipulation and traversal, alphanumeric sorting and collation.
   *
   ***/

  var HALF_WIDTH_NINE = 0x39;
  var FULL_WIDTH_NINE = 0xff19;

  /***
   * @method sortIgnore([reg] = null)
   * @returns Mixed
   * @accessor
   * @short Gets or sets a regex to ignore when sorting.
   * @extra Used by `Array#sortBy`.
   * @example
   *
   *   Sugar.Array.sortIgnore(/\d/)
   *
   ***
   * @method sortIgnoreCase([bool] = true)
   * @returns Mixed
   * @accessor
   * @short Gets or sets a boolean that ignores case when sorting.
   * @extra Used by `Array#sortBy`.
   * @example
   *
   *   Sugar.Array.sortIgnoreCase(true)
   *
   ***
   * @method sortNatural([bool] = true)
   * @returns Mixed
   * @accessor
   * @short Gets or sets a boolean that turns on natural sort mode.
   * @extra Used by `Array#sortBy`. "Natural sort" means that numerals like "10"
   *        will be sorted naturally after "9" instead of after "1".
   * @example
   *
   *   Sugar.Array.sortNatural(true)
   *
   ***
   * @method sortCollate([fn])
   * @returns Mixed
   * @accessor
   * @short Gets or sets the collation function used when sorting strings.
   * @extra Used by `Array#sortBy`. The default is a natural string sort based on
   *        other `sort` options. Setting the collation function directly here will
   *        override all these options. Setting to `null` restores the default.
   * @example
   *
   *   Sugar.Array.sortCollate(fn)
   *
   ***
   * @method sortOrder([str])
   * @returns Mixed
   * @accessor
   * @short Gets or sets a string of characters to use as the base sort order.
   * @extra Used by `Array#sortBy`. The default is an order natural to most major
   *        world languages, but can be modified as needed. Setting to `null`
   *        restores the default.
   *
   * @example
   *
   *   Sugar.Array.sortOrder('zyxw...')
   *
   ***
   * @method sortEquivalents([obj])
   * @returns Mixed
   * @accessor
   * @short Gets or sets a table of characters that should be considered equivalent
   *        when sorting (for example "é" and "e").
   * @extra Used by `Array#sortBy`. The default table produces a natural sort order
   *        for most world languages, however can be modified for others. For
   *        example, setting "ä" and "ö" to `null` in the table would produce a
   *        Scandanavian sort order. Setting [obj] to `null` restores the default,
   *        however if the table is mutated changes will persist.
   *
   * @example
   *
   *   Sugar.Array.sortEquivalents({ 'é': 'e' })
   *
   ***/
  var _sortIgnore      = defineAccessor(sugarArray, 'sortIgnore');
  var _sortNatural     = defineAccessor(sugarArray, 'sortNatural', true);
  var _sortIgnoreCase  = defineAccessor(sugarArray, 'sortIgnoreCase', true);
  var _sortOrder       = defineAccessor(sugarArray, 'sortOrder', getSortOrder());
  var _sortCollate     = defineAccessor(sugarArray, 'sortCollate', collateStrings);
  var _sortEquivalents = defineAccessor(sugarArray, 'sortEquivalents', getSortEquivalents());


  function setArrayChainableConstructor() {
    setChainableConstructor(sugarArray, isArrayOrInherited, arrayCreateFromArrayLike);
  }

  function isArrayOrInherited(obj) {
    return obj && obj.constructor && isArray(obj.constructor.prototype);
  }

  function arrayCreateFromArrayLike(obj) {
    if (isObjectType(obj) || isString(obj)) {
      return Array.from(obj);
    }
    return isDefined(obj) ? [obj] : [];
  }

  function arrayClone(arr) {
    var clone = [], i = arr.length;
    while(i--) {
      if (i in arr) {
        clone[i] = arr[i];
      }
    }
    return clone;
  }

  function arrayConcatAll(arr, args) {
    // Array#concat has some edge case issues with
    // arrays of undefined in < IE8 so avoiding them
    // here by doing a double push.
    var result = arrayClone(arr);
    forEach(args, function(arg) {
      forEach(arg, function(el) {
        result.push(el);
      });
    });
    return result;
  }

  function arrayAppend(arr, el, index) {
    index = +index;
    if (isNaN(index)) {
      index = arr.length;
    }
    arr.splice.apply(arr, [index, 0].concat(el));
    return arr;
  }

  function arrayRemove(arr, f) {
    var matcher = getMatcher(f), i = 0;
    while(i < arr.length) {
      if (matcher(arr[i], i, arr)) {
        arr.splice(i, 1);
      } else {
        i++;
      }
    }
    return arr;
  }

  function arrayExclude(arr, f) {
    var result = [], matcher = getMatcher(f);
    for (var i = 0; i < arr.length; i++) {
      if (!matcher(arr[i], i, arr)) {
        result.push(arr[i]);
      }
    }
    return result;
  }

  function arrayUnique(arr, map) {
    var result = [], o = {}, transformed;
    forEach(arr, function(el, i) {
      transformed = map ? mapWithShortcuts(el, map, arr, [el, i, arr]) : el;
      if (!checkForElementInHashAndSet(o, transformed)) {
        result.push(el);
      }
    });
    return result;
  }

  function arrayFlatten(arr, level, current) {
    level = level || Infinity;
    current = current || 0;
    var result = [];
    forEach(arr, function(el) {
      if (isArray(el) && current < level) {
        result = result.concat(arrayFlatten(el, level, current + 1));
      } else {
        result.push(el);
      }
    });
    return result;
  }

  function arrayCompact(arr, all) {
    var result = [];
    forEach(arr, function(el) {
      if (all && el) {
        result.push(el);
      } else if (!all && el != null && el.valueOf() === el.valueOf()) {
        result.push(el);
      }
    });
    return result;
  }

  function arrayShuffle(arr) {
    arr = arrayClone(arr);
    var i = arr.length, j, x;
    while(i) {
      j = (Math.random() * i) | 0;
      x = arr[--i];
      arr[i] = arr[j];
      arr[j] = x;
    }
    return arr;
  }

  function arrayGroupBy(arr, map, fn) {
    var result = {}, key;
    forEach(arr, function(el, index) {
      key = mapWithShortcuts(el, map, arr, [el, index, arr]);
      if (!result[key]) result[key] = [];
      result[key].push(el);
    });
    if (fn) {
      iterateOverObject(result, fn);
    }
    return result;
  }

  function arrayIntersectOrSubtract(arr1, args, subtract) {
    var result = [], o = {}, arr2 = arrayConcatAll([], args);
    forEach(arr2, function(el) {
      checkForElementInHashAndSet(o, el);
    });
    forEach(arr1, function(el) {
      var stringified = stringify(el),
          isReference = !canCompareValue(el);
      // Add the result to the array if:
      // 1. Subtracting intersections or doesn't already exist in the result
      // 2. Exists and we're adding, or doesn't exist and we're removing.
      if (elementExistsInHash(o, stringified, el, isReference) !== subtract) {
        discardElementFromHash(o, stringified, el, isReference);
        result.push(el);
      }
    });
    return result;
  }

  // Array diff helpers

  function elementExistsInHash(obj, key, el, isReference) {
    var exists;
    if (isReference) {
      if (!obj[key]) {
        obj[key] = [];
      }
      exists = indexOf(obj[key], el) !== -1;
    } else {
      exists = hasOwn(obj, key);
    }
    return exists;
  }

  function checkForElementInHashAndSet(obj, el) {
    var stringified = stringify(el),
        isReference = !canCompareValue(el),
        exists      = elementExistsInHash(obj, stringified, el, isReference);
    if (isReference) {
      obj[stringified].push(el);
    } else {
      obj[stringified] = el;
    }
    return exists;
  }

  function discardElementFromHash(obj, key, element, isReference) {
    var arr, i = 0;
    if (isReference) {
      arr = obj[key];
      while(i < arr.length) {
        if (arr[i] === element) {
          arr.splice(i, 1);
        } else {
          i += 1;
        }
      }
    } else {
      delete obj[key];
    }
  }

  // Collation helpers

  function compareValue(aVal, bVal) {
    var cmp, i, collate;
    if (isString(aVal) && isString(bVal)) {
      collate = _sortCollate();
      return collate(aVal, bVal);
    } else if (isArray(aVal) && isArray(bVal)) {
      if (aVal.length < bVal.length) {
        return -1;
      } else if (aVal.length > bVal.length) {
        return 1;
      } else {
        for(i = 0; i < aVal.length; i++) {
          cmp = compareValue(aVal[i], bVal[i]);
          if (cmp !== 0) {
            return cmp;
          }
        }
        return 0;
      }
    }
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  }

  function codeIsNumeral(code) {
    return (code >= HALF_WIDTH_ZERO && code <= HALF_WIDTH_NINE) ||
           (code >= FULL_WIDTH_ZERO && code <= FULL_WIDTH_NINE);
  }

  function collateStrings(a, b) {
    var aValue, bValue, aChar, bChar, aEquiv, bEquiv, index = 0, tiebreaker = 0;

    var sortOrder       = _sortOrder();
    var sortIgnore      = _sortIgnore();
    var naturalSort     = _sortNatural();
    var sortIgnoreCase  = _sortIgnoreCase();
    var sortEquivalents = _sortEquivalents();

    a = getCollationReadyString(a, sortIgnore, sortIgnoreCase);
    b = getCollationReadyString(b, sortIgnore, sortIgnoreCase);

    do {

      aChar  = getCollationCharacter(a, index, sortEquivalents);
      bChar  = getCollationCharacter(b, index, sortEquivalents);
      aValue = getSortOrderIndex(aChar, sortOrder);
      bValue = getSortOrderIndex(bChar, sortOrder);

      if (aValue === -1 || bValue === -1) {
        aValue = a.charCodeAt(index) || null;
        bValue = b.charCodeAt(index) || null;
        if (naturalSort && codeIsNumeral(aValue) && codeIsNumeral(bValue)) {
          aValue = stringToNumber(a.slice(index));
          bValue = stringToNumber(b.slice(index));
        }
      } else {
        aEquiv = aChar !== a.charAt(index);
        bEquiv = bChar !== b.charAt(index);
        if (aEquiv !== bEquiv && tiebreaker === 0) {
          tiebreaker = aEquiv - bEquiv;
        }
      }
      index += 1;
    } while(aValue != null && bValue != null && aValue === bValue);
    if (aValue === bValue) return tiebreaker;
    return aValue - bValue;
  }

  function getCollationReadyString(str, sortIgnore, sortIgnoreCase) {
    if (!isString(str)) str = String(str);
    if (sortIgnoreCase) {
      str = str.toLowerCase();
    }
    if (sortIgnore) {
      str = str.replace(sortIgnore, '');
    }
    return str;
  }

  function getCollationCharacter(str, index, sortEquivalents) {
    var chr = str.charAt(index);
    return sortEquivalents[chr] || chr;
  }

  function getSortOrderIndex(chr, sortOrder) {
    if (!chr) {
      return null;
    } else {
      return sortOrder.indexOf(chr);
    }
  }

  function getSortOrder() {
    var order = 'AÁÀÂÃĄBCĆČÇDĎÐEÉÈĚÊËĘFGĞHıIÍÌİÎÏJKLŁMNŃŇÑOÓÒÔPQRŘSŚŠŞTŤUÚÙŮÛÜVWXYÝZŹŻŽÞÆŒØÕÅÄÖ';
    return map(order.split(''), function(str) {
      return str + str.toLowerCase();
    }).join('');
  }

  function getSortEquivalents() {
    var equivalents = {};
    forEach(commaSplit('AÁÀÂÃÄ,CÇ,EÉÈÊË,IÍÌİÎÏ,OÓÒÔÕÖ,Sß,UÚÙÛÜ'), function(set) {
      var first = set.charAt(0);
      forEach(set.slice(1).split(''), function(chr) {
        equivalents[chr] = first;
        equivalents[chr.toLowerCase()] = first.toLowerCase();
      });
    });
    return equivalents;
  }


  defineStatic(sugarArray, {

    /***
     *
     * @method create(<obj>, [clone] = false)
     * @returns Array
     * @static
     * @short Creates an array from an unknown <obj>.
     * @extra This method is similar to native `Array.from` but is faster when
     *        <obj> is already an array. When [clone] is true, the array will be
     *        shallow cloned. Additionally, it will not fail on `undefined`,
     *        `null`, or numbers, producing an empty array in the case of
     *        `undefined` and wrapping <obj> otherwise.
     *
     * @example
     *
     *   Array.create()          -> []
     *   Array.create(8)         -> [8]
     *   Array.create('abc')     -> ['a','b','c']
     *   Array.create([1,2,3])   -> [1, 2, 3]
     *   Array.create(undefined) -> []
     *
     ***/
    'create': function(obj, clone) {
      if (!isArrayOrInherited(obj)) {
        obj = arrayCreateFromArrayLike(obj);
      } else if (clone) {
        obj = arrayClone(obj);
      }
      return obj;
    },

    /***
     *
     * @method construct(<n>, <fn>)
     * @returns Array
     * @static
     * @short Constructs an array of <n> length from the values of <fn>.
     *
     * @callback fn
     *
     *   i   The index of the current iteration.
     *
     * @example
     *
     *   Array.construct(3, parseInt) -> [0, 1, 2]
     *   Array.construct(3, function(i) {
     *     return i * i;
     *   }); -> [0, 1, 4]
     *
     ***/
    'construct': function(n, fn) {
      return Array.from(new Array(+n), function(el, i) {
        return fn && fn(i);
      });
    }

  });

  defineInstance(sugarArray, {

    /***
     * @method isEmpty()
     * @returns Boolean
     * @short Returns true if the array has a length of zero.
     *
     * @example
     *
     *   [].isEmpty()    -> true
     *   ['a'].isEmpty() -> false
     *
     ***/
    'isEmpty': function(arr) {
      return arr.length === 0;
    },

    /***
     * @method isEqual(<arr>)
     * @returns Boolean
     * @short Returns true if the array equal to <arr>.
     * @extra `isEqual` in Sugar is "egal", meaning the values are equal if they
     *        are "not observably distinguishable". This method is identical to,
     *        and a shortcut for `Object.isEqual()`.
     *
     * @example
     *
     *   ['a','b'].isEqual(['a','b']) -> true
     *   ['a','b'].isEqual(['a','c']) -> false
     *   [{a:'a'}].isEqual({a:'a'})   -> true
     *
     ***/
    'isEqual': function(a, b) {
      return isEqual(a, b);
    },

    /***
     * @method clone()
     * @returns Array
     * @short Makes a shallow clone of the array.
     *
     * @example
     *
     *   [1,2,3].clone() -> [1,2,3]
     *
     ***/
    'clone': function(arr) {
      return arrayClone(arr);
    },

    /***
     * @method at(<index>, [loop] = false)
     * @returns Mixed
     * @short Gets the element(s) at <index>.
     * @extra When [loop] is true, overshooting the end of the array will begin
     *        counting from the other end. If <index> is an array, multiple
     *        elements will be returned.
     *
     * @example
     *
     *   [1,2,3].at(0)       -> 1
     *   [1,2,3].at(2)       -> 3
     *   [1,2,3].at(4)       -> undefined
     *   [1,2,3].at(4, true) -> 2
     *   [1,2,3].at(-1)      -> 3
     *   [1,2,3].at([0, 1])  -> [1, 2]
     *
     ***/
    'at': function(arr, index, loop) {
      return getEntriesForIndexes(arr, index, loop);
    },

    /***
     * @method add(<item>, [index])
     * @returns Array
     * @short Adds <item> to the array and returns the result as a new array.
     * @extra If <item> is also an array, it will be concatenated instead of
     *        inserted. Use `append` to change the original array.
     *
     * @example
     *
     *   [1,2,3,4].add(5)       -> [1,2,3,4,5]
     *   [1,2,3,4].add(8, 1)    -> [1,8,2,3,4]
     *   [1,2,3,4].add([5,6,7]) -> [1,2,3,4,5,6,7]
     *
     ***/
    'add': function(arr, item, index) {
      return arrayAppend(arrayClone(arr), item, index);
    },

    /***
     * @method append(<item>, [index])
     * @returns Array
     * @short Appends <item> to the array.
     * @extra If <item> is also an array, it will be concatenated instead of
     *        inserted. This method changes the array! Use `add` to create a new
     *        array. Additionally, `insert` is provided as an alias that reads
     *        better when using an index.
     *
     * @example
     *
     *   [1,2,3,4].append(5)       -> [1,2,3,4,5]
     *   [1,2,3,4].append([5,6,7]) -> [1,2,3,4,5,6,7]
     *   [1,2,3,4].append(8, 1)    -> [1,8,2,3,4]
     *
     ***/
    'append': function(arr, item, index) {
      return arrayAppend(arr, item, index);
    },

    /***
     * @method removeAt(<start>, [end])
     * @returns Array
     * @short Removes element at <start>. If [end] is specified, removes the range
     *        between <start> and [end]. This method will change the array! If you
     *        don't intend the array to be changed use `clone` first.
     *
     * @example
     *
     *   ['a','b','c'].removeAt(0) -> ['b','c']
     *   [1,2,3,4].removeAt(1, 3)  -> [1]
     *
     ***/
    'removeAt': function(arr, start, end) {
      if (isUndefined(start)) return arr;
      if (isUndefined(end))   end = start;
      arr.splice(start, end - start + 1);
      return arr;
    },

    /***
     * @method unique([map])
     * @returns Array
     * @short Removes all duplicate elements in the array.
     * @extra [map] may be a function returning the value to be uniqued or a
     *        string acting as a shortcut. This is most commonly used when you
     *        have a key that ensures the object's uniqueness, and don't need to
     *        check all fields. This method will also correctly operate on arrays
     *        of objects. <map> supports `deep properties`.
     *
     * @callback map
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [1,2,2,3].unique()            -> [1,2,3]
     *   [{a:'a'},{a:'a'}].unique()    -> [{a:'a'}]
     *   [{a:'a'},{a:'a'}].unique('a') -> [{a:'a'}]
     *   users.unique(function(user) {
     *     return user.id;
     *   }); -> users array uniqued by id
     *
     ***/
    'unique': function(arr, map) {
      return arrayUnique(arr, map);
    },

    /***
     * @method flatten([limit] = Infinity)
     * @returns Array
     * @short Returns a flattened, one-dimensional copy of the array.
     * @extra You can optionally specify a [limit], which will only flatten that depth.
     *
     * @example
     *
     *   [[1], 2, [3]].flatten() -> [1,2,3]
     *   [[1],[],2,3].flatten()  -> [1,2,3]
     *
     ***/
    'flatten': function(arr, limit) {
      return arrayFlatten(arr, limit);
    },

    /***
     * @method first([num] = 1)
     * @returns Mixed
     * @short Returns the first element(s) in the array.
     * @extra When <num> is passed, returns the first <num> elements in the array.
     *
     * @example
     *
     *   [1,2,3].first()  -> 1
     *   [1,2,3].first(2) -> [1,2]
     *
     ***/
    'first': function(arr, num) {
      if (isUndefined(num)) return arr[0];
      if (num < 0) num = 0;
      return arr.slice(0, num);
    },

    /***
     * @method last([num] = 1)
     * @returns Mixed
     * @short Returns the last element(s) in the array.
     * @extra When <num> is passed, returns the last <num> elements in the array.
     *
     * @example
     *
     *   [1,2,3].last()  -> 3
     *   [1,2,3].last(2) -> [2,3]
     *
     ***/
    'last': function(arr, num) {
      if (isUndefined(num)) return arr[arr.length - 1];
      var start = arr.length - num < 0 ? 0 : arr.length - num;
      return arr.slice(start);
    },

    /***
     * @method from(<index>)
     * @returns Array
     * @short Returns a slice of the array from <index>.
     *
     * @example
     *
     *   [1,2,3].from(1) -> [2,3]
     *   [1,2,3].from(2) -> [3]
     *
     ***/
    'from': function(arr, num) {
      return arr.slice(num);
    },

    /***
     * @method to(<index>)
     * @returns Array
     * @short Returns a slice of the array up to <index>.
     *
     * @example
     *
     *   [1,3,5].to(1) -> [1]
     *   [1,3,5].to(2) -> [1,3]
     *
     ***/
    'to': function(arr, num) {
      if (isUndefined(num)) num = arr.length;
      return arr.slice(0, num);
    },

    /***
     * @method compact([all] = false)
     * @returns Array
     * @short Removes all instances of `undefined`, `null`, and `NaN` from the array.
     * @extra If [all] is `true`, all "falsy" elements will be removed. This
     *        includes empty strings, `0`, and `false`.
     *
     * @example
     *
     *   [1,null,2,undefined,3].compact() -> [1,2,3]
     *   [1,'',2,false,3].compact()       -> [1,'',2,false,3]
     *   [1,'',2,false,3].compact(true)   -> [1,2,3]
     *   [null, [null, 'bye']].compact()  -> ['hi', [null, 'bye']]
     *
     ***/
    'compact': function(arr, all) {
      return arrayCompact(arr, all);
    },

    /***
     * @method groupBy(<map>, [fn])
     * @returns Object
     * @short Groups the array by <map>.
     * @extra Will return an object with keys equal to the grouped values. <map>
     *        may be a mapping function, or a string acting as a shortcut. <map>
     *        supports `deep properties`. Optionally calls [fn] for each group.
     *
     * @callback map
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @callback fn
     *
     *   key  The unique key of the current group.
     *   arr  The current group as an array.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   ['a','aa','aaa'].groupBy('length') -> { 1: ['a'], 2: ['aa'], 3: ['aaa'] }
     *   users.groupBy(function(n) {
     *     return n.age;
     *   }); -> users array grouped by age
     *
     ***/
    'groupBy': function(arr, map, fn) {
      return arrayGroupBy(arr, map, fn);
    },

    /***
     * @method inGroups(<num>, [padding] = None)
     * @returns Array
     * @short Groups the array into <num> arrays.
     * @extra [padding] specifies a value with which to pad the last array so that
     *        they are all equal length.
     *
     * @example
     *
     *   [1,2,3,4,5,6,7].inGroups(3)         -> [[1,2,3],[4,5,6],[7]]
     *   [1,2,3,4,5,6,7].inGroups(3, 'none') -> [[1,2,3],[4,5,6],[7,'none','none']]
     *
     ***/
    'inGroups': function(arr, num, padding) {
      var pad = isDefined(padding);
      var result = [];
      var divisor = ceil(arr.length / num);
      simpleRepeat(num, function(i) {
        var index = i * divisor;
        var group = arr.slice(index, index + divisor);
        if (pad && group.length < divisor) {
          simpleRepeat(divisor - group.length, function() {
            group.push(padding);
          });
        }
        result.push(group);
      });
      return result;
    },

    /***
     * @method inGroupsOf(<num>, [padding] = None)
     * @returns Array
     * @short Groups the array into arrays of <num> elements each.
     * @extra [padding] specifies a value with which to pad the last array so that
     *        they are all equal length.
     *
     * @example
     *
     *   [1,2,3,4,5,6,7].inGroupsOf(4)         -> [ [1,2,3,4], [5,6,7] ]
     *   [1,2,3,4,5,6,7].inGroupsOf(4, 'none') -> [ [1,2,3,4], [5,6,7,'none'] ]
     *
     ***/
    'inGroupsOf': function(arr, num, padding) {
      var result = [], len = arr.length, group;
      if (len === 0 || num === 0) return arr;
      if (isUndefined(num)) num = 1;
      if (isUndefined(padding)) padding = null;
      simpleRepeat(ceil(len / num), function(i) {
        group = arr.slice(num * i, num * i + num);
        while(group.length < num) {
          group.push(padding);
        }
        result.push(group);
      });
      return result;
    },

    /***
     * @method shuffle()
     * @returns Array
     * @short Returns a copy of the array with the elements randomized.
     * @extra Uses Fisher-Yates algorithm.
     *
     * @example
     *
     *   [1,2,3,4].shuffle()  -> [?,?,?,?]
     *
     ***/
    'shuffle': function(arr) {
      return arrayShuffle(arr);
    },

    /***
     * @method sample([num] = 1, [remove] = false)
     * @returns Mixed
     * @short Returns a random element from the array.
     * @extra If [num] is passed, will return an array of [num] elements. If
     *        [remove] is true, sampled elements will also be removed from the
     *        array. [remove] can also be passed in place of [num].
     *
     * @example
     *
     *   [1,2,3,4,5].sample()  -> // Random element
     *   [1,2,3,4,5].sample(3) -> // Array of 3 random elements
     *
     ***/
    'sample': function(arr, arg1, arg2) {
      var result = [], num, remove, single;
      if (isBoolean(arg1)) {
        remove = arg1;
      } else {
        num = arg1;
        remove = arg2;
      }
      if (isUndefined(num)) {
        num = 1;
        single = true;
      }
      if (!remove) {
        arr = arrayClone(arr);
      }
      num = min(num, arr.length);
      for (var i = 0, index; i < num; i++) {
        index = trunc(Math.random() * arr.length);
        result.push(arr[index]);
        arr.splice(index, 1);
      }
      return single ? result[0] : result;
    },

    /***
     * @method sortBy(<map>, [desc] = false)
     * @returns Array
     * @short Returns a copy of the array sorted by <map>.
     * @extra <map> may be a function, a string acting as a shortcut, an array
     *        (comparison by multiple values), or blank (direct comparison of
     *        array values). <map> supports `deep properties`. [desc] will sort
     *        the array in descending order. When the field being sorted on is
     *        a string, the resulting order will be determined by an internal
     *        collation algorithm that is optimized for major Western languages,
     *        but can be customized using sorting accessors such as `sortIgnore`
     *        (listed above).
     *
     * @callback map
     *
     *   el   An array element.
     *
     * @example
     *
     *   ['world','a','new'].sortBy('length')       -> ['a','new','world']
     *   ['world','a','new'].sortBy('length', true) -> ['world','new','a']
     *   users.sortBy(function(n) {
     *     return n.age;
     *   }); -> users array sorted by age
     *   users.sortBy('age') -> users array sorted by age
     *
     ***/
    'sortBy': function(arr, map, desc) {
      arr = arrayClone(arr);
      arr.sort(function(a, b) {
        var aProperty = mapWithShortcuts(a, map, arr, [a]);
        var bProperty = mapWithShortcuts(b, map, arr, [b]);
        return compareValue(aProperty, bProperty) * (desc ? -1 : 1);
      });
      return arr;
    },

    /***
     * @method remove(<search>)
     * @returns Array
     * @short Removes any element in the array that matches <search>.
     * @extra This method will change the array! Use `exclude` for a
     *        non-destructive alias. This method implements `enhanced matching`.
     *
     * @callback search
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [1,2,3].remove(3)         -> [1,2]
     *   ['a','b','c'].remove(/b/) -> ['a','c']
     *   [{a:1},{b:2}].remove(function(n) {
     *     return n['a'] == 1;
     *   }); -> [{b:2}]
     *
     ***/
    'remove': function(arr, f) {
      return arrayRemove(arr, f);
    },

    /***
     * @method exclude(<search>)
     * @returns Array
     * @short Returns a new array with every element matching <search> removed.
     * @extra This is a non-destructive alias for `remove`. It will not change the
     *        original array. This method implements `enhanced matching`.
     *
     * @callback search
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [1,2,3].exclude(3)         -> [1,2]
     *   ['a','b','c'].exclude(/b/) -> ['a','c']
     *   [{a:1},{b:2}].exclude(function(n) {
     *     return n['a'] == 1;
     *   }); -> [{b:2}]
     *
     ***/
    'exclude': function(arr, f) {
      return arrayExclude(arr, f);
    }

  });


  defineInstanceWithArguments(sugarArray, {

    /***
     * @method union([a1], [a2], ...)
     * @returns Array
     * @short Returns an array containing elements in all arrays with duplicates removed.
     * @extra This method will also correctly operate on arrays of objects.
     *
     * @example
     *
     *   [1,3,5].union([5,7,9])     -> [1,3,5,7,9]
     *   ['a','b'].union(['b','c']) -> ['a','b','c']
     *
     ***/
    'union': function(arr, args) {
      return arrayUnique(arrayConcatAll(arr, args));
    },

    /***
     * @method intersect([a1], [a2], ...)
     * @returns Array
     * @short Returns a new array containing the elements all arrays have in common.
     * @extra This method will also correctly operate on arrays of objects.
     *
     * @example
     *
     *   [1,3,5].intersect([5,7,9])     -> [5]
     *   ['a','b'].intersect(['b','c']) -> ['b']
     *
     ***/
    'intersect': function(arr, args) {
      return arrayIntersectOrSubtract(arr, args, false);
    },

    /***
     * @method subtract([a1], [a2], ...)
     * @returns Array
     * @short Subtracts from the array all elements in [a1], [a2], etc.
     * @extra This method will also correctly operate on arrays of objects.
     *
     * @example
     *
     *   [1,3,5].subtract([5,7,9])     -> [1,3]
     *   [1,3,5].subtract([3],[5])     -> [1]
     *   ['a','b'].subtract(['b','c']) -> ['a']
     *
     ***/
    'subtract': function(arr, args) {
      return arrayIntersectOrSubtract(arr, args, true);
    },

    /***
     * @method zip([arr1], [arr2], ...)
     * @returns Array
     * @short Merges multiple arrays together.
     * @extra This method "zips up" smaller arrays into one large whose elements
     *        are "all elements at index 0", "all elements at index 1", etc.
     *        Useful when you have associated data that is split over separated
     *        arrays. If the arrays passed have more elements than the original
     *        array, they will be discarded. If they have fewer elements, the
     *        missing elements will filled with `null`.
     *
     * @example
     *
     *   [1,2,3].zip([4,5,6]) -> [[1,2], [3,4], [5,6]]
     *
     ***/
    'zip': function(arr, args) {
      return arr.map(function(el, i) {
        return [el].concat(map(args, function(k) {
          return (i in k) ? k[i] : null;
        }));
      });
    }

  });


  /***
   * @method insert(<item>, [index])
   * @returns Array
   * @short Appends <item> to the array at [index].
   * @extra This method is simply a more readable alias for `append` when passing
   *        an index. If <el> is an array it will be joined. This method changes
   *        the array! Use `add` as a non-destructive alias.
   *
   * @example
   *
   *   [1,3,4,5].insert(2, 1)     -> [1,2,3,4,5]
   *   [1,4,5,6].insert([2,3], 1) -> [1,2,3,4,5,6]
   *
   ***/
  alias(sugarArray, 'insert', 'append');

  setArrayChainableConstructor();
  'use strict';

  /***
   * @module Object
   * @description Object creation, manipulation, comparison, and type checking.
   *
   * Much thanks to kangax for his informative aricle about how problems with
   * instanceof and constructor: http://bit.ly/1Qds27W
   *
   ***/

  // Flag allowing Object.keys to be enhanced
  var OBJECT_ENHANCEMENTS_FLAG = 'enhanceObject';

  var DONT_ENUM_PROPS = [
    'valueOf',
    'toString',
    'constructor',
    'isPrototypeOf',
    'hasOwnProperty',
    'toLocaleString',
    'propertyIsEnumerable'
  ];

  // Matches bracket-style query strings like user[name]
  var DEEP_QUERY_STRING_REG = /^(.+?)(\[.*\])$/;

  // Matches any character not allowed in a decimal number.
  var NON_DECIMAL_REG = /[^\d.-]/;

  // Native methods for merging by descriptor when available.
  var getOwnPropertyNames      = Object.getOwnPropertyNames;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // Internal reference to check if an object can be serialized.
  var internalToString = Object.prototype.toString;

  // Iterate over an object with support
  // for the DontEnum bug in < IE9
  var iterateOverObjectSafe;

  function buildSafeIterate() {
    var hasDontEnumBug = true, prop;
    for (prop in { toString: true }) hasDontEnumBug = false;
    iterateOverObjectSafe = hasDontEnumBug ? iterateOverObjectDontEnum : iterateOverObject;
  }

  function iterateOverObjectDontEnum(obj, fn) {
    iterateOverObject(obj, fn);
    forEach(DONT_ENUM_PROPS, function(key) {
      if (hasOwn(obj, key)) {
        fn.call(obj, key, obj[key], obj);
      }
    });
  }

  // Create

  // Query Strings | Creating

  function toQueryStringWithOptions(obj, opts) {
    opts = opts || {};
    if (isUndefined(opts.separator)) {
      opts.separator = '_';
    }
    return toQueryString(obj, opts.deep, opts.transform, opts.prefix || '', opts.separator);
  }

  function toQueryString(obj, deep, transform, prefix, separator) {
    if (isArray(obj)) {
      return collectArrayAsQueryString(obj, deep, transform, prefix, separator);
    } else if (isObjectType(obj) && obj.toString === internalToString) {
      return collectObjectAsQueryString(obj, deep, transform, prefix, separator);
    } else if (prefix) {
      return getURIComponentValue(obj, prefix, transform);
    }
    return '';
  }

  function collectArrayAsQueryString(arr, deep, transform, prefix, separator) {
    var el, qc, key, result = [];
    // Intentionally treating sparse arrays as dense here by avoiding map,
    // otherwise indexes will shift during the process of serialization.
    for (var i = 0, len = arr.length; i < len; i++) {
      el = arr[i];
      key = prefix + (prefix && deep ? '[]' : '');
      if (!key && !isObjectType(el)) {
        // If there is no key, then the values of the array should be
        // considered as null keys, so use them instead;
        qc = sanitizeURIComponent(el);
      } else {
        qc = toQueryString(el, deep, transform, key, separator);
      }
      result.push(qc);
    }
    return result.join('&');
  }

  function collectObjectAsQueryString(obj, deep, transform, prefix, separator) {
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
      result.push(toQueryString(value, deep, transform, fullKey, separator));
    });
    return result.join('&');
  }

  function getURIComponentValue(obj, prefix, transform) {
    var value;
    if (transform) {
      value = transform(prefix, obj);
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


  // Query Strings | Parsing

  function fromQueryStringWithOptions(obj, opts) {
    var str = String(obj || '').replace(/^.*?\?/, ''), result = {}, auto;
    opts = opts || {};
    if (str) {
      forEach(str.split('&'), function(p) {
        var split = p.split('=');
        var key = decodeURIComponent(split[0]);
        var val = split.length === 2 ? decodeURIComponent(split[1]) : '';
        auto = opts.auto !== false;
        parseQueryComponent(result, key, val, opts.deep, auto, opts.separator, opts.transform);
      });
    }
    return result;
  }

  function parseQueryComponent(obj, key, value, deep, auto, separator, transform) {
    var match;
    if (separator) {
      key = mapQuerySeparatorToKeys(key, separator);
      deep = true;
    }
    if (deep === true && (match = key.match(DEEP_QUERY_STRING_REG))) {
      parseDeepQueryComponent(obj, match, value, deep, auto, separator, transform);
    } else {
      setQueryProperty(obj, key, value, auto, transform);
    }
  }

  function parseDeepQueryComponent(obj, match, value, deep, auto, separator, transform) {
    var key = match[1];
    var inner = match[2].slice(1, -1).split('][');
    forEach(inner, function(k) {
      if (!hasOwn(obj, key)) {
        obj[key] = k ? {} : [];
      }
      obj = obj[key];
      key = k ? k : obj.length.toString();
    });
    setQueryProperty(obj, key, value, auto, transform);
  }

  function mapQuerySeparatorToKeys(key, separator) {
    var split = key.split(separator), result = split[0];
    for (var i = 1, len = split.length; i < len; i++) {
      result += '[' + split[i] + ']';
    }
    return result;
  }

  function setQueryProperty(obj, key, value, auto, transform) {
    var fnValue;
    if (transform) {
      fnValue = transform(key, value, obj);
    }
    if (isDefined(fnValue)) {
      value = fnValue;
    } else if (auto) {
      value = getQueryValueAuto(obj, key, value);
    }
    obj[key] = value;
  }

  function getQueryValueAuto(obj, key, value) {
    if (!value) {
      return null;
    } else if (value === 'true') {
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
    return value;
  }

  function stringIsDecimal(str) {
    return str !== '' && !NON_DECIMAL_REG.test(str);
  }


  // Object Merging

  function mergeWithOptions(target, source, opts) {
    opts = opts || {};
    return objectMerge(target, source, opts.deep, opts.resolve, opts.hidden, opts.descriptor);
  }

  function defaults(target, sources, opts) {
    opts = opts || {};
    opts.resolve = opts.resolve || false;
    return mergeAll(target, sources, opts);
  }

  function mergeAll(target, sources, opts) {
    if (!isArray(sources)) {
      sources = [sources];
    }
    forEach(sources, function(source) {
      return mergeWithOptions(target, source, opts);
    });
    return target;
  }

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
      name = names[i];
      fn(name, obj[name]);
    }
  }

  function mergeByPropertyDescriptor(target, source, prop, sourceVal) {
    var descriptor = getOwnPropertyDescriptor(source, prop);
    if (isDefined(descriptor.value)) {
      descriptor.value = sourceVal;
    }
    defineProperty(target, prop, descriptor);
  }

  function objectMerge(target, source, deep, resolve, hidden, descriptor) {
    var resolveByFunction = isFunction(resolve), resolveConflicts = resolve !== false;

    if (isUndefined(target)) {
      target = getNewObjectForMerge(source);
    } else if (resolveConflicts && isDate(target) && isDate(source)) {
      // A date's timestamp is a property that can only be reached through its
      // methods, so actively set it up front if both are dates.
      target.setTime(source.getTime());
    }

    if (isPrimitive(target)) {
      // Will not merge into a primitive type, so simply override.
      return source;
    }

    // If the source object is a primitive
    // type then coerce it into an object.
    if (isPrimitive(source)) {
      source = coercePrimitiveToObject(source);
    }

    iterateOverProperties(hidden, source, function(prop) {
      var sourceVal, targetVal, resolved, goDeep, result;

      sourceVal = source[prop];

      // We are iterating over properties of the source, so hasOwnProperty on
      // it is guaranteed to always be true. However, the target may happen to
      // have properties in its prototype chain that should not be considered
      // as conflicts.
      if (hasOwn(target, prop)) {
        targetVal = target[prop];
      }

      if (resolveByFunction) {
        result = resolve(prop, targetVal, sourceVal, target, source);
        if (isUndefined(result)) {
          // Result is undefined so do not merge this property.
          return;
        } else if (isDefined(result) && result !== Sugar) {
          // If the source returns anything except undefined, then the conflict
          // has been resolved, so don't continue traversing into the object. If
          // the returned value is the Sugar global object, then allowing Sugar
          // to resolve the conflict, so continue on.
          sourceVal = result;
          resolved = true;
        }
      } else if (isUndefined(sourceVal)) {
        // Will not merge undefined.
        return;
      }

      // Regex properties are read-only, so intentionally disallowing deep
      // merging for now. Instead merge by reference even if deep.
      goDeep = !resolved && deep && isObjectType(sourceVal) && !isRegExp(sourceVal);

      if (!goDeep && !resolveConflicts && isDefined(targetVal)) {
        return;
      }

      if (goDeep) {
        sourceVal = objectMerge(targetVal, sourceVal, deep, resolve, hidden, descriptor);
      }

      // getOwnPropertyNames is standing in as
      // a test for property descriptor support
      if (getOwnPropertyNames && descriptor) {
        mergeByPropertyDescriptor(target, source, prop, sourceVal);
      } else {
        target[prop] = sourceVal;
      }

    });
    return target;
  }

  function getNewObjectForMerge(source) {
    var klass = className(source);
    // Primitive types, dates, and regexes have no "empty" state. If they exist
    // at all, then they have an associated value. As we are only creating new
    // objects when they don't exist in the target, these values can come alone
    // for the ride when created.
    if (isArray(source, klass)) {
      return [];
    } else if (isPlainObject(source, klass)) {
      return {};
    } else if (isDate(source, klass)) {
      return new Date(source.getTime());
    } else if (isRegExp(source, klass)) {
      return RegExp(source.source, getRegExpFlags(source));
    } else if (isPrimitive(source && source.valueOf())) {
      return source;
    }
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

  function clone(source, deep) {
    var target = getNewObjectForMerge(source);
    return objectMerge(target, source, deep, true, true, true);
  }


  // Keys/Values

  function objectSize(obj) {
    return keysWithObjectCoercion(obj).length;
  }

  function keysWithObjectCoercion(obj) {
    return getKeys(coercePrimitiveToObject(obj));
  }

  function getKeysWithCallback(obj, fn) {
    var keys = getKeys(obj);
    if (isFunction(fn)) {
      forEach(keys, function(key) {
        fn.call(obj, key, obj);
      });
    }
    return keys;
  }

  function getValuesWithCallback(obj, fn) {
    var values = [];
    iterateOverObject(obj, function(key, val) {
      values.push(val);
      if (isFunction(fn)) {
        fn.call(obj, val, obj);
      }
    });
    return values;
  }

  function tap(obj, arg) {
    var fn = arg;
    if (!isFunction(arg)) {
      fn = function() {
        if (arg) obj[arg]();
      };
    }
    fn.call(obj, obj);
    return obj;
  }

  // Select/Reject

  function objectSelect(obj, f) {
    return selectFromObject(obj, f, true);
  }

  function objectReject(obj, f) {
    return selectFromObject(obj, f, false);
  }

  function selectFromObject(obj, f, select) {
    var match, result = {};
    f = [].concat(f);
    iterateOverObject(obj, function(key, value) {
      match = false;
      for (var i = 0; i < f.length; i++) {
        if (matchInObject(f[i], key)) {
          match = true;
        }
      }
      if (match === select) {
        result[key] = value;
      }
    });
    return result;
  }

  function matchInObject(match, key) {
    if (isRegExp(match)) {
      return match.test(key);
    } else if (isObjectType(match)) {
      return key in match;
    } else {
      return key === String(match);
    }
  }

  // Remove/Exclude

  function objectRemove(obj, f) {
    var matcher = getMatcher(f, true);
    iterateOverObject(obj, function(key, val) {
      if (matcher(val, key, obj)) {
        delete obj[key];
      }
    });
    return obj;
  }

  function objectExclude(obj, f) {
    var result = {};
    var matcher = getMatcher(f, true);
    iterateOverObject(obj, function(key, val) {
      if (!matcher(val, key, obj)) {
        result[key] = val;
      }
    });
    return result;
  }

  function objectIntersectOrSubtract(obj1, obj2, subtract) {
    if (!isObjectType(obj1)) {
      return subtract ? obj1 : {};
    }
    obj2 = coercePrimitiveToObject(obj2);
    function resolve(key, val, val1) {
      var exists = key in obj2 && isEqual(val1, obj2[key]);
      if (exists !== subtract) {
        return val1;
      }
    }
    return objectMerge({}, obj1, false, resolve);
  }

  /***
   * @method isArray(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is an array.
   *
   * @example
   *
   *   Object.isArray([3]) -> true
   *   Object.isArray(3)   -> false
   *
  /***
   * @method isBoolean(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a boolean.
   *
   * @example
   *
   *   Object.isBoolean(true)   -> true
   *   Object.isBoolean('true') -> false
   *
  /***
   * @method isDate(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a date.
   *
   * @example
   *
   *   Object.isDate(now)   -> true
   *   Object.isDate('now') -> false
   *
  /***
   * @method isFunction(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a function.
   *
   * @example
   *
   *   Object.isFunction(function(){}) -> true
   *   Object.isFunction('function')   -> false
   *
  /***
   * @method isNumber(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a number.
   *
   * @example
   *
   *   Object.isNumber(3)   -> false
   *   Object.isNumber([3]) -> false
   *
  /***
   * @method isString(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a string.
   *
   * @example
   *
   *   Object.isRegExp('wasabi') -> true
   *   Object.isRegExp(/wasabi/) -> false
   *
  /***
   * @method isRegExp(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a regex.
   *
   * @example
   *
   *   Object.isRegExp(/wasabi/) -> true
   *   Object.isRegExp('wasabi') -> false
   *
   ***/
  function buildTypeCheckMethods() {
    var checks = [isBoolean, isNumber, isString, isArray, isDate, isRegExp, isFunction];
    defineInstanceAndStaticSimilar(sugarObject, TYPE_CHECK_NAMES, function(methods, name, i) {
      methods['is' + name] = checks[i];
    });
  }


  defineInstanceAndStatic(sugarObject, {

    /***
     * @method keys(<obj>, [fn])
     * @returns Array
     * @short Returns an array containing the keys in <obj>. Optionally calls [fn]
     *        for each key.
     * @extra Sugar provides a polyfill for browsers that don't support this
     *        method natively. Additionally it optionally enhances it to allow the
     *        callback function [fn]. Order of returned keys is not guaranteed.
     *
     * @callback fn
     *
     *   key  The key of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.keys({ broken: 'wear' }) -> ['broken']
     *   Object.keys({ broken: 'wear' }, function(key) {
     *     // Called once for each key.
     *   });
     *
     ***/
    'keys': fixArgumentLength(getKeysWithCallback)

  }, [ENHANCEMENTS_FLAG, OBJECT_ENHANCEMENTS_FLAG]);


  defineStatic(sugarObject, {

    /***
     * @method fromQueryString(<str>, [options])
     * @returns Object
     * @short Converts the query string of a URL into an object.
     * @extra Options can be passed with [options] for more control over the result.
     *
     * @options
     *
     *   deep        If the string contains "deep" syntax (`foo[]`), this will
     *               be automatically converted to an array. (Default `false`)
     *
     *   auto        If `true`, booleans (`true`/`false`), numbers, and arrays
     *               (repeated keys) will be automatically cast to native
     *               values. (Default `true`)
     *
     *   transform   A function whose return value becomes the final value. If
     *               the function returns `undefined`, then the original value
     *               will be used. This allows the function to intercept only
     *               certain keys or values. (No Default)
     *
     *   separator   If passed, keys will be split on this string to extract
     *               deep values. (Default `null`)
     *
     * @callback transform
     *
     *   key   The key component of the query string (before `=`).
     *   val   The value component of the query string (after `=`).
     *   obj   A reference to the object being built.
     *
     * @example
     *
     *   Object.fromQueryString('a=1&b=2')                 -> {a:1,b:2}
     *   Object.fromQueryString('a[]=1&a[]=2',{deep:true}) -> {a:['1','2']}
     *   Object.fromQueryString('a_b=c',{separator:'_'})   -> {a:{b:'c'}}
     *
     ***/
    'fromQueryString': function(obj, options) {
      return fromQueryStringWithOptions(obj, options);
    }

  });


  defineInstanceAndStatic(sugarObject, {

    /***
     * @method get(<obj>, <key>)
     * @returns Mixed
     * @short Gets a property of <obj>.
     * @extra Allows deep properties.
     *
     * @example
     *
     *   Object.get({name:'Harry'}, 'name');           -> 'Harry'
     *   Object.get({user:{name:'Bob'}}, 'user.name')  -> 'Bob'
     *   Object.get({users:users}, 'users[3].name')    -> User 3's name
     *   Object.get({users:users}, 'users[1..2]')      -> Users 1 and 2
     *   Object.get({users:users}, 'users[1..2].name') -> Names of users 1 and 2
     *   Object.get({users:users}, 'users[-2..-1]')    -> Last 2 users
     *
     ***/
    'get': function(obj, prop) {
      return deepGetProperty(obj, prop);
    },

    /***
     * @method set(<obj>, <key>, <val>)
     * @returns Object
     * @short Sets a property on <obj>.
     * @extra Using a dot or square bracket in <key> is considered "deep" syntax,
     *        and will attempt to traverse into <obj> to set the property,
     *        creating namespaces that do not exist along the way. When using
     *        bracket syntax, the newly created namespace will be an empty array,
     *        otherwise it will be an empty object. Additionally, the special
     *        token `[]` means "the last index + 1", and will effectively push
     *        <val> onto the end of the array. Lastly, a `..` separator inside the
     *        brackets is "range" notation, and will set properties on all
     *        elements in the specified range. Range members may be negative,
     *        which will be offset from the end of the array. Returns the object.
     *
     * @example
     *
     *   Object.set({}, 'name', 'Harry');         -> {name:'Harry'}
     *   Object.set({}, 'user.name', 'Harry');    -> {user:{name:'Harry'}}
     *   Object.set({}, 'users[].name', 'Bob')    -> {users:[{name:'Bob'}}
     *   Object.set({}, 'users[1].name','Bob')    -> {users:[undefined, {name:'Bob'}]}
     *   Object.set({}, 'users[0..1].name','Bob') -> {users:[{name:'Bob'},{name:'Bob'}]}
     *
     ***/
    'set': function(obj, key, val) {
      return deepSetProperty(obj, key, val);
    },

    /***
     * @method size(<obj>)
     * @returns Number
     * @short Returns the number of properties in <obj>.
     *
     * @example
     *
     *   Object.size({foo:'bar'}) -> 1
     *
     ***/
    'size': function(obj) {
      return objectSize(obj);
    },

    /***
     * @method isEmpty(<obj>)
     * @returns Boolean
     * @short Returns true if the number of properties in <obj> is zero.
     *
     * @example
     *
     *   Object.isEmpty({})    -> true
     *   Object.isEmpty({a:1}) -> false
     *
     ***/
    'isEmpty': function(obj) {
      return objectSize(obj) === 0;
    },

    /***
     * @method toQueryString(<obj>, [options])
     * @returns Object
     * @short Converts the object into a query string.
     * @extra Accepts deep objects and arrays. Options can be passed with [options]
     *        for more control over the result.
     *
     * @options
     *
     *   deep        If `true`, non-standard "deep" syntax (`foo[]`) will be
     *               used for output. Note that `separator` will be ignored,
     *               as this option overrides shallow syntax. (Default `false`)
     *
     *   prefix      If passed, this string will be prefixed to all keys,
     *               separated by the `separator`. (Default `''`).
     *
     *   transform   A function whose return value becomes the final value
     *               in the string. (No Default)
     *
     *   separator   A string that is used to separate keys, either for deep
     *               objects, or when `prefix` is passed.(Default `_`).
     *
     * @callback transform
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.toQueryString({foo:'bar'})                  -> 'foo=bar'
     *   Object.toQueryString({foo:['a','b']})              -> 'foo=a&foo=b'
     *   Object.toQueryString({foo:['a','b']}, {deep:true}) -> 'foo[]=a&foo[]=b'
     *
     ***/
    'toQueryString': function(obj, options) {
      return toQueryStringWithOptions(obj, options);
    },

    /***
     * @method isEqual(<a>, <b>)
     * @returns Boolean
     * @short Returns true if <a> and <b> are equal.
     * @extra `isEqual` in Sugar is "egal", meaning the values are equal if they
     *        are "not observably distinguishable".
     *
     * @example
     *
     *   Object.isEqual({a:2}, {a:2}) -> true
     *   Object.isEqual({a:2}, {a:3}) -> false
     *
     ***/
    'isEqual': function(a, b) {
      return isEqual(a, b);
    },

    /***
     * @method merge(<target>, <source>, [options])
     * @returns Merged object
     * @short Merges properties from <source> into <target>.
     *
     * @options
     *
     *   deep         If `true` deep properties are merged recursively.
     *                (Default = `false`)
     *
     *   resolve      Determines which property wins in the case of conflicts.
     *                If `true`, <source> wins. If `false`, <target> wins. If a
     *                function is passed, its return value will decide the result.
     *                Any non-undefined return value will resolve the conflict
     *                for that property (will not continue if `deep`). Returning
     *                `undefined` will do nothing (no merge). Finally, returning
     *                the global object `Sugar` will allow Sugar to handle the
     *                merge as normal. (Default = `true`)
     *
     *   hidden       If `true`, non-enumerable properties will be merged as well.
     *                (Default = `false`)
     *
     *   descriptor   If `true`, properties will be merged by property descriptor.
     *                Use this option to merge getters or setters, or to preserve
     *                `enumerable`, `configurable`, etc.
     *                (Default = `false`)
     *
     * @callback resolve
     *
     *   key        The key of the current iteration.
     *   targetVal  The current value for the key in <target>.
     *   sourceVal  The current value for the key in <source>.
     *   target     The target object.
     *   source     The source object.
     *
     * @example
     *
     *   Object.merge({one:1},{two:2})                 -> {one:1,two:2}
     *   Object.merge({one:1},{one:9,two:2})           -> {one:9,two:2}
     *   Object.merge({x:{a:1}},{x:{b:2}},{deep:true}) -> {x:{a:1,b:2}}
     *   Object.merge({a:1},{a:2},{resolve:mergeAdd})  -> {a:3}
     *
     ***/
    'merge': function(target, source, opts) {
      return mergeWithOptions(target, source, opts);
    },

    /***
     * @method mergeAll(<target>, <sources>, [options])
     * @returns Merged object
     * @short Merges properties from multiple <sources> into <target>.
     * @extra See `Object.merge` for options.
     *
     * @example
     *
     *   Object.mergeAll({one:1},[{two:2},{three:3}]) -> {one:9,two:2}
     *   Object.mergeAll({x:{a:1}},[{x:{b:2}},{x:{c:3}}],{deep:true}) -> {x:{a:1,b:2,c:3}}
     *
     ***/
    'mergeAll': function(target, sources, opts) {
      return mergeAll(target, sources, opts);
    },

    /***
     * @method add(<obj1>, <obj2>, [options])
     * @returns Object
     * @short Merges properties in <obj1> and <obj2> and returns a new object.
     * @extra See `Object.merge` for options.
     *
     * @example
     *
     *   Object.add({one:1},{two:2})                 -> {one:1,two:2}
     *   Object.add({one:1},{one:9,two:2})           -> {one:9,two:2}
     *   Object.add({x:{a:1}},{x:{b:2}},{deep:true}) -> {x:{a:1,b:2}}
     *   Object.add({a:1},{a:2},{resolve:mergeAdd})  -> {a:3}
     *
     ***/
    'add': function(obj1, obj2, opts) {
      return mergeWithOptions(clone(obj1), obj2, opts);
    },

    /***
     * @method intersect(<obj1>, <obj2>)
     * @returns Object
     * @short Returns a new object whose properties are those that both <obj1> and
     *        <obj2> have in common.
     * @extra If both key and value do not match, then the property will not be included.
     *
     * @example
     *
     *   Object.intersect({a:'a'},{b:'b'}) -> {}
     *   Object.intersect({a:'a'},{a:'b'}) -> {}
     *   Object.intersect({a:'a',b:'b'},{b:'b',z:'z'}) -> {b:'b'}
     *
     ***/
    'intersect': function(obj1, obj2) {
      return objectIntersectOrSubtract(obj1, obj2, false);
    },

    /***
     * @method subtract(<obj1>, <obj2>)
     * @returns Object
     * @short Returns a clone of <obj1> with any properties shared by <obj2> excluded.
     * @extra If both key and value do not match, then the property will not be excluded.
     *
     * @example
     *
     *   Object.subtract({a:'a',b:'b'},{b:'b'}) -> {a:'a'}
     *   Object.subtract({a:'a',b:'b'},{a:'b'}) -> {a:'a',b:'b'}
     *
     ***/
    'subtract': function(obj1, obj2) {
      return objectIntersectOrSubtract(obj1, obj2, true);
    },

    /***
     * @method defaults(<target>, <sources>, [options])
     * @returns Merged object
     * @short Merges properties from one or multiple <sources> into <target> while
     *        preserving <target>'s properties.
     * @extra See `Object.merge` for options.
     *
     * @example
     *
     *   Object.defaults({one:1},[{one:9},{two:2}])                   -> {one:1,two:2}
     *   Object.defaults({x:{a:1}},[{x:{a:9}},{x:{b:2}}],{deep:true}) -> {x:{a:1,b:2}}
     *
     ***/
    'defaults': function(target, sources, opts) {
      return defaults(target, sources, opts);
    },

    /***
     * @method clone(<obj>, [deep] = false)
     * @returns Cloned object
     * @short Creates a clone (copy) of <obj>.
     * @extra Default is a shallow clone, unless [deep] is true.
     *
     * @example
     *
     *   Object.clone({foo:'bar'})       // creates shallow clone
     *   Object.clone({foo:'bar'}, true) // creates a deep clone
     *
     ***/
    'clone': function(obj, deep) {
      return clone(obj, deep);
    },

    /***
     * @method values(<obj>, [fn])
     * @returns Array
     * @short Returns an array containing the values in <obj>. Optionally calls
     *        [fn] for each value.
     * @extra Returned values are in no particular order.
     *
     * @callback fn
     *
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.values({ broken: 'wear' }) -> ['wear']
     *   Object.values({ broken: 'wear' }, function(value) {
     *     // Called once for each value.
     *   });
     *
     ***/
    'values': function(obj, fn) {
      return getValuesWithCallback(obj, fn);
    },

    /***
     * @method invert(<obj>, [multi] = false)
     * @returns Object
     * @short Creates a new object with the keys and values of <obj> swapped.
     * @extra If [multi] is true, values will be an array of all keys, othewise
     *        collisions will be overwritten.
     *
     * @example
     *
     *   Object.invert({foo:'bar'})     -> {bar:'foo'}
     *   Object.invert({a:1,b:1}, true) -> {1:['a','b']}
     *
     ***/
    'invert': function(obj, multi) {
      var result = {};
      multi = multi === true;
      iterateOverObject(obj, function(key, val) {
        if (result[val] && multi) {
          result[val].push(key);
        } else if (multi) {
          result[val] = [key];
        } else {
          result[val] = key;
        }
      });
      return result;
    },

    /***
     * @method tap(<obj>, <fn>)
     * @returns Object
     * @short Runs <fn> and returns <obj>.
     * @extra A string can also be used as a shortcut to a method. This method is
     *        designed to run an intermediary function that "taps into" a method
     *        chain. As such, it is fairly useless as a static method. However it
     *        can be quite useful when combined with chainables.
     *
     * @callback
     *
     *   obj  A reference to <obj>.
     *
     * @example
     *
     *   Sugar.Array([1,4,9]).map(Math.sqrt).tap('pop') -> [1,2]
     *   Sugar.Object({a:'a'}).tap(log).merge({b:'b'})  -> {a:'a',b:'b'}
     *
     ***/
    'tap': function(obj, arg) {
      return tap(obj, arg);
    },

    /***
     * @method has(<obj>, <prop>)
     * @returns Boolean
     * @short Checks if <obj> has property <prop>, which may be a `deep property`
     *        using dot or bracket notation.
     * @extra Note that this method does not care of <prop> is a direct property
     *        of <obj> or in the prototype. To check that use `hasOwn` instead.
     *
     * @example
     *
     *   Object.has({a:'a'}, 'a')       -> true
     *   Object.has({a:{b:'b'}}, 'a.b') -> true
     *   Object.has({a:{b:'b'}}, 'b.b') -> false
     *
     ***/
    'has': function(obj, prop) {
      return deepHasProperty(obj, prop);
    },

    /***
     * @method hasOwn(<obj>, <prop>)
     * @returns Boolean
     * @short Checks if <obj> has its own property <prop> using hasOwnProperty
     *        from Object.prototype.
     * @extra This method is considered safer than `Object#hasOwnProperty` when
     *        using objects as data stores. Note that this method will *not* work
     *        with `deep properties`.
     *
     * @example
     *
     *   Object.hasOwn({foo:'bar'}, 'foo') -> true
     *   Object.hasOwn({foo:'bar'}, 'baz') -> false
     *   Object.hasOwn({hasOwnProperty:true}, 'foo') -> false
     *
     ***/
    'hasOwn': function(obj, prop) {
      return hasOwn(obj, prop);
    },

    /***
     * @method isArguments(<obj>)
     * @returns Boolean
     * @short Returns true if <obj> is an arguments object.
     *
     * @example
     *
     *   Object.isArguments([1]) -> false
     *
     ***/
    'isArguments': function(obj) {
      return isArguments(obj);
    },

    /***
     * @method isNaN(<obj>)
     * @returns Boolean
     * @short Returns true if <obj> is `NaN`.
     * @extra This is different from `isNaN`, which returns true for anything that
     *        is "not a number".
     *
     * @example
     *
     *   Object.isNaN(NaN) -> true
     *   Object.isNaN('5') -> false
     *
     ***/
    'isNaN': function(obj) {
      // Note that Object.isNaN intentionally unwraps non-primitives, but
      // Number.isNaN does not (ES6 spec). The reason for this is that certain
      // environments (< IE9) will auto-wrap instances, so opting for cross-
      // platform consistency here.
      return isRealNaN(obj && obj.valueOf());
    },

    /***
     * @method isObject(<obj>)
     * @returns Boolean
     * @short Returns true if <obj> is a plain object.
     * @extra Does not include instances of classes or "host" objects, such as
     *        Elements, Events, etc.
     *
     * @example
     *
     *   Object.isObject({ broken:'wear' }) -> true
     *
     ***/
    'isObject': function(obj) {
      return isPlainObject(obj);
    },

    /***
     * @method remove(<obj>, <search>)
     * @returns Object
     * @short Deletes all properties in <obj> matching <search>.
     * @extra This method implements `enhanced matching`.
     *
     * @callback search
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.remove({a:'a',b:'b'}, 'a');           -> {b:'b'}
     *   Object.remove({a:'a',b:'b',z:'z'}, /[a-f]/); -> {z:'z'}
     *
     ***/
    'remove': function(obj, f) {
      return objectRemove(obj, f);
    },

    /***
     * @method exclude(<obj>, <search>)
     * @returns Object
     * @short Returns a new object with all properties matching <search> removed.
     * @extra This is a non-destructive version of `remove`. This method
     *        implements `enhanced matching`.
     *
     * @callback search
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.exclude({a:'a',b:'b'}, 'a');           -> {b:'b'}
     *   Object.exclude({a:'a',b:'b',z:'z'}, /[a-f]/); -> {z:'z'}
     *
     ***/
    'exclude': function(obj, f) {
      return objectExclude(obj, f);
    },

    /***
     * @method select(<obj>, <find>)
     * @returns Object
     * @short Builds a new object containing the keys specified in <find>.
     * @extra When <find> is a string, a single key will be selected. Arrays or
     *        objects match multiple keys, and a regex will match keys by regex.
     *
     * @example
     *
     *   Object.select({a:1,b:2}, 'a')           -> {a:1}
     *   Object.select({a:1,b:2}, ['a', 'b'])    -> {a:1,b:2}
     *   Object.select({a:1,b:2}, /[a-z]/)       -> {a:1,b:2}
     *   Object.select({a:1,b:2}, {a:'a',b:'b'}) -> {a:1,b:2}
     *
     ***/
    'select': function(obj, f) {
      return objectSelect(obj, f);
    },

    /***
     * @method reject(<obj>, <find>)
     * @returns Object
     * @short Builds a new object containing all keys except those in <find>.
     * @extra When <find> is a string, a single key will be rejected. Arrays or
     *        objects match multiple keys, and a regex will match keys by regex.
     *
     * @example
     *
     *   Object.reject({a:1,b:2}, 'a')        -> {b:2}
     *   Object.reject({a:1,b:2}, /[a-z]/)    -> {}
     *   Object.reject({a:1,b:2}, {a:'a'})    -> {b:2}
     *   Object.reject({a:1,b:2}, ['a', 'b']) -> {}
     *
     ***/
    'reject': function(obj, f) {
      return objectReject(obj, f);
    }

  });

  buildSafeIterate();
  buildTypeCheckMethods();
  'use strict';

  /***
   * @module Enumerable
   * @description Counting, mapping, and finding methods on both arrays and objects.
   *
   ***/

  function sum(obj, map, k) {
    var sum = 0;
    enumerateWithMapping(obj, map, function(val) {
      sum += val;
    }, k);
    return sum;
  }

  function average(obj, map, k) {
    var sum = 0, count = 0;
    enumerateWithMapping(obj, map, function(val) {
      sum += val;
      count++;
    }, k);
    // Prevent divide by 0
    return sum / (count || 1);
  }

  function median(obj, map, k) {
    var result = [], middle, len;
    enumerateWithMapping(obj, map, function(val) {
      result.push(val);
    }, k);
    len = result.length;
    if (!len) return 0;
    result.sort(function(a, b) {
      // IE7 will throw errors on non-numbers!
      return (a || 0) - (b || 0);
    });
    middle = trunc(len / 2);
    return len % 2 ? result[middle] : (result[middle - 1] + result[middle]) / 2;
  }

  function getMinOrMax(obj, map, all, max, k) {
    var result = [], edge;
    enumerateWithMapping(obj, map, function(val, key) {
      if (isUndefined(val)) {
        throw new TypeError('Cannot compare with undefined');
      }
      if (val === edge) {
        result.push(key);
      } else if (isUndefined(edge) || (max && val > edge) || (!max && val < edge)) {
        result = [key];
        edge = val;
      }
    }, k);
    return getReducedMinMaxResult(result, obj, all, k);
  }

  function getLeastOrMost(obj, map, all, most, k) {
    var groupedByValue = {}, result, minMaxResult;
    enumerateWithMapping(obj, map, function(val, key) {
      var str = stringify(val);
      var arr = groupedByValue[str] || [];
      arr.push(key);
      groupedByValue[str] = arr;
    }, k);
    minMaxResult = getMinOrMax(groupedByValue, 'length', all, most, true);
    if (all) {
      result = [];
      // Flatten result
      iterateOverObject(minMaxResult, function(key, val) {
        result = result.concat(val);
      });
    } else {
      result = groupedByValue[minMaxResult];
    }
    return getReducedMinMaxResult(result, obj, all, k);
  }


  // Support

  function getReducedMinMaxResult(result, obj, all, k) {
    if (k && all) {
      // The method has returned an array of keys so use this array
      // to build up the resulting object in the form we want it in.
      return result.reduce(function(o, key) {
        o[key] = obj[key];
        return o;
      }, {});
    } else if (result && !all) {
      result = result[0];
    }
    return result;
  }

  function enumerateWithMapping(obj, map, fn, k) {
    iterateOverObject(obj, function(key, val) {
      if (!k && !isArrayIndex(key)) {
        return;
      }
      var args = k ? [key, val, obj] : [val, +key, obj];
      var mapped = mapWithShortcuts(val, map, obj, args);
      fn(mapped, k ? key : val);
    });
  }

  /***
   * @namespace Array
   *
   ***/

  // Flag allowing native array methods to be enhanced
  var ARRAY_ENHANCEMENTS_FLAG = 'enhanceArray';

  // Enhanced Natives
  var enhancedMap       = wrapMapWithShortcuts(),
      enhancedFind      = wrapNativeWithMatcher('find'),
      enhancedSome      = wrapNativeWithMatcher('some'),
      enhancedEvery     = wrapNativeWithMatcher('every'),
      enhancedFilter    = wrapNativeWithMatcher('filter'),
      enhancedFindIndex = wrapNativeWithMatcher('findIndex');

  function arrayEach(arr, fn, fromIndex, loop) {
    var index, i, length = +arr.length;
    if (fromIndex < 0) fromIndex = max(0, arr.length + fromIndex);
    i = isNaN(fromIndex) ? 0 : fromIndex;
    if (loop === true) {
      length += i;
    }
    while(i < length) {
      index = i % arr.length;
      if (!(index in arr)) {
        return iterateOverSparseArray(arr, fn, i, loop);
      } else if (fn.call(arr, arr[index], index, arr) === false) {
        break;
      }
      i++;
    }
    return arr;
  }

  function arrayFindFrom(arr, f, fromIndex, loop, all, findIndex) {
    var result = [], matcher;
    if (arr.length > 0) {
      matcher = getMatcher(f);
      arrayEach(arr, function(el, i) {
        if (matcher.call(arr, el, i, arr)) {
          result.push(findIndex ? i : el);
          return all;
        }
      }, fromIndex, loop);
    }
    return all ? result : result[0];
  }

  function arrayNone(arr, f, context, argLen) {
    return !enhancedSome(arr, f, context, argLen);
  }

  function arrayCount(arr, f) {
    if (isUndefined(f)) return arr.length;
    return enhancedFilter(arr, f).length;
  }

  // Support

  function wrapMapWithShortcuts() {
    var nativeMap = Array.prototype.map;
    return function(arr, map, context) {
      var args = [];
      if (isFunction(map)) {
        args.push(map);
      } else if (map) {
        args.push(function(el, index) {
          return mapWithShortcuts(el, map, context, [el, index, arr]);
        });
      }
      args.push(context);
      return nativeMap.apply(arr, args);
    };
  }

  function wrapNativeWithMatcher(name) {
    var nativeFn = Array.prototype[name];
    return function(arr, f, context, argLen) {
      var args = [], matcher;
      if (argLen === 0) {
        throw new TypeError('First argument required');
      }
      if (isFunction(f)) {
        args.push(f);
      } else {
        matcher = getMatcher(f);
        args.push(function(el, index, arr) {
          return matcher(el, index, arr);
        });
      }
      args.push(context);
      return nativeFn.apply(arr, args);
    };
  }

  defineInstance(sugarArray, {

    /***
     * @method find(<search>, [context])
     * @returns Mixed
     * @polyfill es6
     * @short Returns the first element in the array that matches <search>.
     * @extra This method implements `enhanced matching`.
     *
     * @callback search
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   users.find(function(user) {
     *     return user.name = 'Harry';
     *   }); -> harry!
     *
     *   users.find({ name: 'Harry' }); -> harry!
     *   users.find({ name: /^[A-H]/ });  -> First user with name starting with A-H
     *   users.find({ titles: ['Ms', 'Dr'] }); -> not harry!
     *
     *
     ***/
    'find': fixArgumentLength(enhancedFind),

    /***
     * @method map(<map>, [context])
     * @returns Array
     * @polyfill es5
     * @short Maps the array to another array whose elements are those returned by
     *        the <map> callback.
     * @extra [context] is the `this` object. Sugar enhances this method to accept
     *        a string for <map>, which is a shortcut for a function that gets
     *        that property (or invokes a function) on each element.
     *        <map> supports `deep properties`.
     *
     * @callback map
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [1,2,3].map(function(n) {
     *     return n * 3;
     *   }); -> [3,6,9]
     *
     *   ['a','aa','aaa'].map('length') -> [1,2,3]
     *   ['A','B','C'].map('toLowerCase') -> ['a','b','c']
     *   users.map('name') -> array of user names
     *
     ***/
    'map': fixArgumentLength(enhancedMap),

    /***
     * @method every(<search>, [context])
     * @returns Boolean
     * @polyfill es5
     * @alias all
     * @short Returns true if <search> is true for all elements of the array.
     * @extra [context] is the `this` object. This method implements `enhanced
     *        matching`.
     *
     * @callback search
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   ['a','a','a'].every(function(n) {
     *     return n == 'a';
     *   });
     *   ['a','a','a'].every('a')   -> true
     *   [{a:2},{a:2}].every({a:2}) -> true
     *   users.every({ name: /^H/ }) -> true if all have a name starting with H
     *
     ***/
    'every': fixArgumentLength(enhancedEvery),

    /***
     * @method some(<search>, [context])
     * @returns Boolean
     * @polyfill es5
     * @alias any
     * @short Returns true if <search> is true for any element in the array.
     * @extra [context] is the `this` object. This method implements `enhanced
     *        matching`.
     *
     * @callback search
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   ['a','b','c'].some(function(n) {
     *     return n == 'a';
     *   });
     *   ['a','b','c'].some(function(n) {
     *     return n == 'd';
     *   });
     *   ['a','b','c'].some('a')    -> true
     *   [{a:2},{b:5}].some({a:2})  -> true
     *   users.some({ name: /^H/ }) -> true if any have a name starting with H
     *
     ***/
    'some': fixArgumentLength(enhancedSome),

    /***
     * @method filter(<search>, [context])
     * @returns Array
     * @polyfill es5
     * @short Returns any elements in the array that match <search>.
     * @extra [context] is the `this` object. This method implements `enhanced
     *        matching`.
     *
     * @callback search
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [1,2,3].filter(function(n) {
     *     return n > 1;
     *   });
     *   [1,2,2,4].filter(2) -> 2
     *   users.filter({ name: /^H/ }) -> all users with a name starting with H
     *
     ***/
    'filter': fixArgumentLength(enhancedFilter),

    /***
     * @method findIndex(<search>, [context])
     * @returns Number
     * @polyfill es6
     * @short Returns the index of the first element in the array that matches
     *        <search>, or `-1` if none.
     * @extra [context] is the `this` object. This method implements `enhanced
     *        matching`.
     *
     * @callback search
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [1,2,3,4].findIndex(function(n) {
     *     return n % 2 == 0;
     *   }); -> 1
     *   ['a','b','c'].findIndex('c');        -> 2
     *   ['cuba','japan','canada'].find(/^c/) -> 0
     *
     ***/
    'findIndex': fixArgumentLength(enhancedFindIndex)

  }, [ENHANCEMENTS_FLAG, ARRAY_ENHANCEMENTS_FLAG]);

  /***
   * @method all()
   * @alias every
   *
   ***/
  alias(sugarArray, 'all', 'every');

  /***
   * @method any()
   * @alias some
   *
   ***/
  alias(sugarArray, 'any', 'some');


  defineInstance(sugarArray, {

    /***
     * @method none(<search>)
     * @returns Boolean
     * @short Returns true if none of the elements in the array match <search>.
     * @extra This method implements `enhanced matching`.
     *
     * @callback search
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [1,2,3].none(5)         -> true
     *   ['a','b','c'].none(/b/) -> false
     *   users.none(function(user) {
     *     return user.name == 'Wolverine';
     *   }); -> probably true
     *
     ***/
    'none': fixArgumentLength(arrayNone),

    /***
     * @method findFrom(<search>, [fromIndex] = 0, [loop] = false)
     * @returns Array
     * @short Returns any element that matches <search>, beginning from [fromIndex].
     * @extra Will continue from `index = 0` if [loop] is true. This method
     *        implements `enhanced matching`.
     *
     * @callback search
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   ['cuba','japan','canada'].findFrom(/^c/, 2) -> 'canada'
     *
     ***/
    'findFrom': function(arr, f, fromIndex, loop) {
      return arrayFindFrom(arr, f, fromIndex, loop);
    },

    /***
     * @method filterFrom(<search>, [fromIndex] = 0, [loop] = false)
     * @returns Array
     * @short Returns any elements that match <search>, beginning from [fromIndex].
     * @extra Will continue from `index = 0` if [loop] is true. This method
     *        implements `enhanced matching`.
     *
     * @callback search
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   ['cuba','canada','chile'].filterFrom(/^c/, 2)       -> ['canada','chile']
     *   ['cuba','canada','chile'].filterFrom(/^c/, 2, true) -> ['canada','chile','cuba']
     *
     ***/
    'filterFrom': function(arr, f, fromIndex, loop) {
      return arrayFindFrom(arr, f, fromIndex, loop, true);
    },

    /***
     * @method findIndexFrom(<search>, [fromIndex] = 0, [loop] = false)
     * @returns Array
     * @short Returns the index of any element that matches <search>, starting from [fromIndex].
     * @extra Will continue from `index = 0` if [loop] is true. This method
     *        implements `enhanced matching`.
     *
     * @callback search
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   ['cuba','japan','canada'].findIndexFrom(/^c/, 2) -> 2
     *
     ***/
    'findIndexFrom': function(arr, f, fromIndex, loop) {
      var index = arrayFindFrom(arr, f, fromIndex, loop, false, true);
      return isUndefined(index) ? -1 : index;
    },

    /***
     * @method each(<fn>, [index] = 0, [loop] = false)
     * @returns Array
     * @short Enhanced `forEach`.
     * @extra If <fn> returns `false` at any time it will break out of the loop.
     *        If [index] is passed, <fn> will begin at that index and work its way
     *        to the end. If [loop] is true, it will then start over from the
     *        beginning of the array and continue until it reaches `index - 1`.
     *
     * @callback fn
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [1,2,3,4].each(function(n) {
     *     console.log(n); // Called 4 times: 1, 2, 3, 4
     *   });
     *
     *   [1,2,3,4].each(function(n) {
     *     console.log(n); // Called 4 times: 3, 4, 1, 2
     *   }, 2, true);
     *
     ***/
    'each': function(arr, fn, index, loop) {
      return arrayEach(arr, fn, index, loop);
    },

    /***
     * @method min([map], [all] = false)
     * @returns Mixed
     * @short Returns the element in the array with the lowest value.
     * @extra [map] may be a function mapping the value to be checked or a string
     *        acting as a shortcut. If [all] is true, will return all min values
     *        in an array. [map] supports `deep properties`.
     *
     * @callback map
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [1,2,3].min()                          -> 1
     *   ['fee','fo','fum'].min('length')       -> 'fo'
     *   ['fee','fo','fum'].min('length', true) -> ['fo']
     *   users.min('age')                       -> youngest guy!
     *
     *   ['fee','fo','fum'].min(function(n) {
     *     return n.length;
     *   }, true); -> ['fo']
     *
     *
     ***/
    'min': function(arr, map, all) {
      return getMinOrMax(arr, map, all);
    },

    /***
     * @method max([map], [all] = false)
     * @returns Mixed
     * @short Returns the element in the array with the greatest value.
     * @extra [map] may be a function mapping the value to be checked or a string
     *        acting as a shortcut. If [all] is true, will return all max values
     *        in an array. [map] supports `deep properties`.
     *
     * @callback map
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [1,2,3].max()                          -> 3
     *   ['fee','fo','fum'].max('length')       -> 'fee'
     *   ['fee','fo','fum'].max('length', true) -> ['fee','fum']
     *   users.max('age')                       -> oldest guy!
     *
     *   ['fee','fo','fum'].max(function(n) {
     *     return n.length;
     *   }, true); -> ['fee', 'fum']
     *
     ***/
    'max': function(arr, map, all) {
      return getMinOrMax(arr, map, all, true);
    },

    /***
     * @method least([map], [all] = false)
     * @returns Array
     * @short Returns the elements in the array with the least commonly occuring value.
     * @extra [map] may be a function mapping the value to be checked or a string
     *        acting as a shortcut. If [all] is true, will return multiple values
     *        in an array. [map] supports `deep properties`.
     *
     * @callback map
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [3,2,2].least() -> 3
     *   ['fe','fo','fum'].least('length', true) -> ['fum']
     *
     ***/
    'least': function(arr, map, all) {
      return getLeastOrMost(arr, map, all);
    },

    /***
     * @method most([map], [all] = false)
     * @returns Array
     * @short Returns the elements in the array with the most commonly occuring value.
     * @extra [map] may be a function mapping the value to be checked or a string
     *        acting as a shortcut. If [all] is true, will return multiple values
     *        in an array. [map] supports `deep properties`.
     *
     * @callback map
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [3,2,2].most(2) -> 2
     *   ['fe','fo','fum'].most('length', true) -> ['fe','fo']
     *
     ***/
    'most': function(arr, map, all) {
      return getLeastOrMost(arr, map, all, true);
    },

    /***
     * @method count(<search>)
     * @returns Number
     * @short Counts all elements in the array that match <search>.
     * @extra This method implements `enhanced matching`.
     *
     * @callback search
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   ['a','b','a'].count('a') -> 2
     *   ['a','b','c'].count(/b/) -> 1
     *   users.count(function(user) {
     *     return user.age > 30;
     *   }); -> number of users older than 30
     *
     ***/
    'count': function(arr, f) {
      return arrayCount(arr, f);
    },

    /***
     * @method sum([map])
     * @returns Number
     * @short Sums all values in the array.
     * @extra [map] may be a function mapping the value to be summed or a string
     *        acting as a shortcut.
     *
     * @callback map
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [1,2,2].sum() -> 5
     *   users.sum(function(user) {
     *     return user.votes;
     *   }); -> total votes!
     *   users.sum('votes') -> total votes!
     *
     ***/
    'sum': function(arr, map) {
      return sum(arr, map);
    },

    /***
     * @method average([map])
     * @returns Number
     * @short Gets the mean average for all values in the array.
     * @extra [map] may be a function mapping the value to be averaged or a string
     *        acting as a shortcut.
     *
     * @callback map
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [1,2,3].average() -> 2
     *   users.average(function(user) {
     *     return user.age;
     *   }); -> average user age
     *   users.average('age') -> average user age
     *
     ***/
    'average': function(arr, map) {
      return average(arr, map);
    },

    /***
     * @method median([map])
     * @returns Number
     * @short Gets the median average for all values in the array.
     * @extra [map] may be a function mapping the value to be averaged or a string
     *        acting as a shortcut.
     *
     * @callback map
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   arr  A reference to the array.
     *
     * @example
     *
     *   [1,2,2].median() -> 2
     *   [{a:1},{a:2},{a:2}].median('a') -> 2
     *
     ***/
    'median': function(arr, map) {
      return median(arr, map);
    }

  });

  /***
   * @method forEachFrom(<fn>, [index] = 0, [loop] = false)
   * @returns Array
   * @short Runs <fn> for each value in the array.
   * @extra This method is simply a more readable alias for `each` when passing
   *        an index. If <fn> returns `false` at any time it will break out of
   *        the loop. If [index] is passed, <fn> will begin at that index and
   *        work its way to the end. If [loop] is true, it will then start over
   *        from the beginning of the array and continue until it reaches
   *        `index - 1`.
   *
   * @callback fn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3,4].forEachFrom(function(n) {
   *     console.log(n); // Called 4 times: 3, 4, 1, 2
   *   }, 2, true);
   *
   ***/
  alias(sugarArray, 'forEachFrom', 'each');



  /***
   * @namespace Object
   *
   ***/


  // Object matchers
  var objectSome  = wrapObjectMatcher('some'),
      objectFind  = wrapObjectMatcher('find'),
      objectEvery = wrapObjectMatcher('every');


  function objectEach(obj, fn) {
    assertCallable(fn);
    iterateOverObject(obj, fn);
    return obj;
  }

  function objectMap(obj, map) {
    var result = {};
    iterateOverObject(obj, function(key, val) {
      result[key] = mapWithShortcuts(val, map, obj, [key, val, obj]);
    });
    return result;
  }

  function objectReduce(obj, fn, acc) {
    var init = isDefined(acc);
    iterateOverObject(obj, function(key, val) {
      if (!init) {
        acc = val;
        init = true;
        return;
      }
      acc = fn(acc, val, key, obj);
    });
    return acc;
  }

  function objectNone(obj, f) {
    return !objectSome(obj, f);
  }

  function objectFilter(obj, f) {
    var matcher = getMatcher(f, true), result = {};
    iterateOverObject(obj, function(key, val) {
      if (matcher(val, key, obj)) {
        result[key] = val;
      }
    });
    return result;
  }

  function objectCount(obj, f) {
    var matcher = getMatcher(f, true), count = 0;
    iterateOverObject(obj, function(key, val) {
      if (matcher(val, key, obj)) {
        count++;
      }
    });
    return count;
  }

  // Support

  function wrapObjectMatcher(name) {
    var nativeFn = Array.prototype[name];
    return function(obj, f) {
      var matcher = getMatcher(f, true);
      return nativeFn.call(getKeys(obj), function(key) {
        return matcher(obj[key], key, obj);
      });
    };
  }

  defineInstanceAndStatic(sugarObject, {

    /***
     * @method map(<obj>, <map>)
     * @returns Object
     * @short Maps the object to another object whose properties are the values
     *        returned by <map>.
     * @extra <map> can also be a string, which is a shortcut for a function that
     *        gets that property (or invokes a function) on each element. <map>
     *        supports `deep properties`.
     *
     * @callback map
     *
     *   key  The key of the current property.
     *   val  The value of the current property.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.map({a:'b'}, function(key, val) {
     *     return 'b';
     *   }); -> {a:'b'}
     *
     ***/
    'map': function(obj, map) {
      return objectMap(obj, map);
    },

    /***
     * @method reduce(<obj>, <fn>, [init])
     * @returns Mixed
     * @short Reduces the object to a single result.
     * @extra This operation is sometimes called "accumulation", as it takes the
     *        result of the last iteration of <fn> and passes it as the first
     *        argument to the next iteration, "accumulating" that value as it goes.
     *        The return value of this method will be the return value of the final
     *        iteration of <fn>. If [init] is passed, it will be the initial
     *        "accumulator" (the first argument). If [init] is not passed, then a
     *        property of the object will be used instead and <fn> will not be
     *        called for that property. Note that object properties have no order,
     *        and this may lead to bugs (for example if performing division or
     *        subtraction operations on a value). If order is important, use an
     *        array instead!
     *
     * @callback fn
     *
     *   acc  The "accumulator", either [init], the result of the last iteration
     *        of <fn>, or a property of <obj>.
     *   val  The value of the current property called for <fn>.
     *   key  The key of the current property called for <fn>.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.reduce({a:2,b:4}, function() {
     *     return a * b;
     *   }); -> 8
     *
     *   Object.reduce({a:2,b:4}, function() {
     *     return a * b;
     *   }, 10); -> 80
     *
     *
     ***/
    'reduce': function(obj, fn, init) {
      return objectReduce(obj, fn, init);
    },

    /***
     * @method each(<obj>, <fn>)
     * @returns Object
     * @short Runs <fn> against each property in the object.
     * @extra Does not iterate over inherited properties. If <fn> returns `false`
     *        at any time it will break out of the loop. Returns <obj>.
     *
     * @callback fn
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.each({a:'b'}, function(key, val) {
     *     console.log(key, val); // a, b
     *   });
     *
     ***/
    'each': function(obj, fn) {
      return objectEach(obj, fn);
    },

    /***
     * @method sum(<obj>, [map])
     * @returns Number
     * @short Sums all properties in the object.
     * @extra [map] may be a function mapping the value to be summed or a string
     *        acting as a shortcut.
     *
     * @callback map
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.sum({a:35,b:13}); -> 48
     *
     ***/
    'sum': function(obj, map) {
      return sum(obj, map, true);
    },

    /***
     * @method average(<obj>, [map])
     * @returns Number
     * @short Gets the mean average of all properties in the object.
     * @extra [map] may be a function mapping the value to be averaged or a string
     *        acting as a shortcut.
     *
     * @callback map
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.average({a:35,b:11}); -> 23
     *
     ***/
    'average': function(obj, map) {
      return average(obj, map, true);
    },

    /***
     * @method median(<obj>, [map])
     * @returns Number
     * @short Gets the median average of all properties in the object.
     * @extra [map] may be a function mapping the value to be averaged or a string
     *        acting as a shortcut.
     *
     * @callback map
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.median({a:1,b:2,c:2}) -> 2
     *
     ***/
    'median': function(obj, map) {
      return median(obj, map, true);
    },

    /***
     * @method min(<obj>, [map], [all] = false)
     * @returns Mixed
     * @short Returns the key of the property in the object with the lowest value.
     * @extra If [all] is true, will return an object with all properties in the
     *        object with the lowest value. [map] may be a function mapping the
     *        value to be checked or a string acting as a shortcut.
     *
     * @callback map
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.min({a:1,b:2,c:3})                    -> 'a'
     *   Object.min({a:'aaa',b:'bb',c:'c'}, 'length') -> 'c'
     *   Object.min({a:1,b:1,c:3}, null, true)        -> {a:1,b:1}
     *
     ***/
    'min': function(obj, map, all) {
      return getMinOrMax(obj, map, all, false, true);
    },

    /***
     * @method max(<obj>, [map], [all] = false)
     * @returns Mixed
     * @short Returns the key of the property in the object with the highest value.
     * @extra If [all] is true, will return an object with all properties in the
     *        object with the highest value. [map] may be a function mapping the
     *        value to be checked or a string acting as a shortcut.
     *
     * @callback map
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.max({a:1,b:2,c:3})                    -> 'c'
     *   Object.max({a:'aaa',b:'bb',c:'c'}, 'length') -> 'a'
     *   Object.max({a:1,b:3,c:3}, null, true)        -> {b:3,c:3}
     *
     ***/
    'max': function(obj, map, all) {
      return getMinOrMax(obj, map, all, true, true);
    },

    /***
     * @method least(<obj>, [map], [all] = false)
     * @returns Mixed
     * @short Returns the key of the property in the object with the least commonly
     *        occuring value.
     * @extra If [all] is true, will return an object with all properties in the
     *        object with the least common value. [map] may be a function mapping
     *        the value to be checked or a string acting as a shortcut.
     *
     * @callback map
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.least({a:1,b:3,c:3})                   -> 'a'
     *   Object.least({a:'aa',b:'bb',c:'c'}, 'length') -> 'c'
     *   Object.least({a:1,b:3,c:3}, null, true)       -> {a:1}
     *
     ***/
    'least': function(obj, map, all) {
      return getLeastOrMost(obj, map, all, false, true);
    },

    /***
     * @method most(<obj>, [map], [all] = false)
     * @returns Mixed
     * @short Returns the key of the property in the object with the most commonly
     *        occuring value.
     * @extra If [all] is true, will return an object with all properties in the
     *        object with the most common value. [map] may be a function mapping
     *        the value to be checked or a string acting as a shortcut.
     *
     * @callback map
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.most({a:1,b:3,c:3})                   -> 'b'
     *   Object.most({a:'aa',b:'bb',c:'c'}, 'length') -> 'a'
     *   Object.most({a:1,b:3,c:3}, null, true)       -> {b:3,c:3}
     *
     ***/
    'most': function(obj, map, all) {
      return getLeastOrMost(obj, map, all, true, true);
    },

    /***
     * @method some(<obj>, <search>)
     * @returns Boolean
     * @alias any
     * @short Returns true if <search> is true for any property in the object.
     * @extra This method implements `enhanced matching`.
     *
     * @callback search
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.some({a:1,b:2}, function(key, val) {
     *     return val == 1;
     *   }); -> true
     *   Object.some({a:1,b:2}, 1); -> true
     *
     ***/
    'some': objectSome,

    /***
     * @method every(<obj>, <search>)
     * @returns Boolean
     * @alias all
     * @short Returns true if <search> is true for all properties in the object.
     * @extra This method implements `enhanced matching`.
     *
     * @callback search
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.every({a:1,b:2}, function(key, val) {
     *     return val > 0;
     *   }); -> true
     *   Object.every({a:'a',b:'b'}, /[a-z]/); -> true
     *
     ***/
    'every': objectEvery,

    /***
     * @method find(<obj>, <search>)
     * @returns Boolean
     * @short Returns the first key whose value matches <search>.
     * @extra This method implements `enhanced matching`. Note that "first" is
     *        implementation-dependent. If order is important an array should be
     *        used instead.
     *
     * @callback search
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.find({a:1,b:2}, function(key, val) {
     *     return val == 2;
     *   }); -> 'b'
     *   Object.find({a:'a',b:'b'}, /[a-z]/); -> 'a'
     *
     ***/
    'find': objectFind,

    /***
     * @method filter(<obj>, <search>)
     * @returns Array
     * @short Returns a new object with properties that match <search>.
     * @extra This method implements `enhanced matching`.
     *
     * @callback search
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.filter({a:1,b:2}, function(key, val) {
     *     return val == 1;
     *   }); -> {a:1}
     *   Object.filter({a:'a',z:'z'}, /[a-f]/); -> {a:'a'}
     *   Object.filter(usersByName, /^H/); -> all users with names starting with H
     *
     ***/
    'filter': function(obj, f) {
      return objectFilter(obj, f);
    },

    /***
     * @method count(<obj>, <search>)
     * @returns Number
     * @short Counts all properties in the object that match <search>.
     * @extra This method implements `enhanced matching`.
     *
     * @callback search
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.count({a:'a',b:'b',c:'a'}, 'a') -> 2
     *
     *   Object.count(usersByName.count(function(key, user) {
     *     return user.age > 30;
     *   }); -> number of users older than 30
     *
     ***/
    'count': function(obj, f) {
      return objectCount(obj, f);
    },

    /***
     * @method none(<obj>, <search>)
     * @returns Boolean
     * @short Returns true if none of the properties in the object match <search>.
     * @extra This method implements `enhanced matching`.
     *
     * @callback search
     *
     *   key  The key of the current iteration.
     *   val  The value of the current iteration.
     *   obj  A reference to the object.
     *
     * @example
     *
     *   Object.none({a:1,b:2}, 3); -> true
     *
     *   Object.none(usersByName, function(key, user) {
     *     return user.name == 'Wolverine';
     *   }); -> probably true
     *
     ***/
    'none': function(obj, f) {
      return objectNone(obj, f);
    }

  });

  /***
   * @method all()
   * @alias every
   *
   ***/
  alias(sugarObject, 'all', 'every');

  /***
   * @method any()
   * @alias some
   *
   ***/
  alias(sugarObject, 'any', 'some');
  'use strict';

  /***
   * @module Function
   * @description Lazy, throttled, and memoized functions, delayed functions and
   *              handling of timers, argument currying.
   *
   ***/

  var _lock     = privatePropertyAccessor('lock');
  var _timers   = privatePropertyAccessor('timers');
  var _partial  = privatePropertyAccessor('partial');
  var _canceled = privatePropertyAccessor('canceled');

  function setDelay(fn, ms, after, scope, args) {
    // Delay of infinity is never called of course...
    ms = coercePositiveInteger(ms || 0);
    if (!_timers(fn)) {
      _timers(fn, []);
    }
    // This is a workaround for <= IE8, which apparently has the
    // ability to call timeouts in the queue on the same tick (ms?)
    // even if functionally they have already been cleared.
    _canceled(fn, false);
    _timers(fn).push(setTimeout(function() {
      if (!_canceled(fn)) {
        after.apply(scope, args || []);
      }
    }, ms));
  }

  function cancelFunction(fn) {
    var timers = _timers(fn), timer;
    if (isArray(timers)) {
      while(timer = timers.shift()) {
        clearTimeout(timer);
      }
    }
    _canceled(fn, true);
    return fn;
  }

  function createLazyFunction(fn, ms, immediate, limit) {
    var queue = [], locked = false, execute, rounded, perExecution, result;
    ms = ms || 1;
    limit = limit || Infinity;
    rounded = ceil(ms);
    perExecution = round(rounded / ms) || 1;
    execute = function() {
      var queueLength = queue.length, maxPerRound;
      if (queueLength == 0) return;
      // Allow fractions of a millisecond by calling
      // multiple times per actual timeout execution
      maxPerRound = max(queueLength - perExecution, 0);
      while(queueLength > maxPerRound) {
        // Getting uber-meta here...
        result = Function.prototype.apply.apply(fn, queue.shift());
        queueLength--;
      }
      setDelay(lazy, rounded, function() {
        locked = false;
        execute();
      });
    };
    function lazy() {
      // If the execution has locked and it's immediate, then
      // allow 1 less in the queue as 1 call has already taken place.
      if (queue.length < limit - (locked && immediate ? 1 : 0)) {
        // Optimized: no leaking arguments
        var args = []; for(var $i = 0, $len = arguments.length; $i < $len; $i++) args.push(arguments[$i]);
        queue.push([this, args]);
      }
      if (!locked) {
        locked = true;
        if (immediate) {
          execute();
        } else {
          setDelay(lazy, rounded, execute);
        }
      }
      // Return the memoized result
      return result;
    }
    return lazy;
  }

  function stringifyArguments() {
    var str = '';
    for (var i = 0; i < arguments.length; i++) {
      str += stringify(arguments[i]);
    }
    return str;
  }

  function createMemoizedFunction(fn, hashFn) {
    var cache = {}, key;
    if (!hashFn) {
      hashFn = stringifyArguments;
    } else if(isString(hashFn)) {
      key = hashFn;
      hashFn = function(arg) {
        return deepGetProperty(arg, key);
      };
    }
    return function memoized() {
      var key = hashFn.apply(this, arguments);
      if (hasOwn(cache, key)) {
        return cache[key];
      }
      return cache[key] = fn.apply(this, arguments);
    };
  }

  var createInstanceFromPrototype = Object.create || function(prototype) {
    var ctor = function() {};
    ctor.prototype = prototype;
    return new ctor;
  };

  defineInstance(sugarFunction, {

     /***
     * @method lazy([ms] = 1, [immediate] = false, [limit] = Infinity)
     * @returns Function
     * @short Creates a lazy function that, when called repeatedly, will queue
     *        execution and wait [ms] milliseconds to execute.
     * @extra If [immediate] is `true`, first execution will happen immediately,
     *        then lock. If [limit] is a fininte number, calls past [limit] will
     *        be ignored while execution is locked. Compare this to `throttle`,
     *        which will execute only once per [ms] milliseconds. Note that [ms]
     *        can also be a fraction. Calling `cancel` on a lazy function will
     *        clear the entire queue.
     *
     * @example
     *
     *   logHello.lazy()()    // Logs after a delay
     *   logHello.lazy(500)() // Logs after 500ms
     *
     *   (3).times(logHello.lazy(500));
     *   -> Logs 3 times with each execution 500ms after the last
     *
     *   (100).times(logHello.lazy(500, false, 10));
     *   -> Logs 10 times with each execution 500ms after the last
     *
     ***/
    'lazy': function(fn, ms, immediate, limit) {
      return createLazyFunction(fn, ms, immediate, limit);
    },

     /***
     * @method throttle([ms] = 1)
     * @returns Function
     * @short Creates a "throttled" version of the function that will only be
     *        executed once per <ms> milliseconds.
     * @extra This is functionally equivalent to calling `lazy` with a [limit] of
     *        `1` and [immediate] as `true`. `throttle` is appropriate when you
     *        want to make sure a function is only executed at most once for a
     *        given duration.
     *
     * @example
     *
     *   (3).times(logHello.throttle(50)) 
     *   -> called only once. will wait 50ms until it responds again
     *
     ***/
    'throttle': function(fn, ms) {
      return createLazyFunction(fn, ms, true, 1);
    },

     /***
     * @method debounce([ms] = 1)
     * @returns Function
     * @short Creates a "debounced" function that postpones its execution until
     *        after <ms> milliseconds have passed.
     * @extra This method is useful to execute a function after things have
     *        "settled down". A good example of this is when a user tabs quickly
     *        through form fields, execution of a heavy operation should happen
     *        after a few milliseconds when they have "settled" on a field.
     *
     * @example
     *
     *   (3).times(logHello.debounce(50)) // called once 50ms later
     *
     ***/
    'debounce': function(fn, ms) {
      function debounced() {
        // Optimized: no leaking arguments
        var args = []; for(var $i = 0, $len = arguments.length; $i < $len; $i++) args.push(arguments[$i]);
        cancelFunction(debounced);
        setDelay(debounced, ms, fn, this, args);
      }
      return debounced;
    },

     /***
     * @method cancel()
     * @returns Function
     * @short Cancels a delayed function scheduled to be run.
     * @extra `delay`, `lazy`, `throttle`, and `debounce` can all set delays.
     *
     * @example
     *
     *   logHello.delay(500).cancel() // never logs
     *
     ***/
    'cancel': function(fn) {
      return cancelFunction(fn);
    },

     /***
     * @method after(<n>)
     * @returns Function
     * @short Creates a function that will execute after <n> calls.
     * @extra `after` is useful for running a final callback after a specific
     *        number of operations, often when the order in which the operations
     *        will complete is unknown. The created function will be passed an
     *        array of the arguments that it has collected from each after <n>.
     *        Note that the function will execute on every call after <n>.
     *        Use `once` in conjunction with this method to prevent being
     *        triggered by subsequent calls.
     *
     * @example
     *
     *   (5).times(logHello.after(2));       // logs four times
     *   (5).times(logHello.once().after(2)) // logs once
     *
     ***/
    'after': function(fn, num) {
      var count = 0, collectedArgs = [];
      num = coercePositiveInteger(num);
      return function() {
        // Optimized: no leaking arguments
        var args = []; for(var $i = 0, $len = arguments.length; $i < $len; $i++) args.push(arguments[$i]);
        collectedArgs.push(args);
        count++;
        if (count >= num) {
          return fn.call(this, collectedArgs);
        }
      };
    },

     /***
     * @method once()
     * @returns Function
     * @short Creates a function that will execute only once and store the result.
     * @extra `once` is useful for creating functions that will cache the result
     *        of an expensive operation and use it on subsequent calls. Also it
     *        can be useful for creating initialization functions that only need
     *        to be run once.
     *
     * @example
     *
     *   (5).times(logHello.once()) -> logs once
     *
     ***/
    'once': function(fn) {
      // noop always returns "undefined" as the cache key.
      return createMemoizedFunction(fn, function() {});
    },

     /***
     * @method memoize([hashFn])
     * @returns Function
     * @short Creates a function that will cache results for unique calls.
     * @extra `memoize` can be thought of as a more power `once`. Where `once`
     *        will only call a function once ever, memoized functions will be
     *        called once per unique call. A "unique call" is determined by the
     *        return value of [hashFn], which is passed the arguments of each call.
     *        If [hashFn] is undefined, it will stringify all arguments, such that
     *        any different argument signature will result in a unique call.
     *        Passing a string for [hashFn] is a shortcut that will get that
     *        property from the first argument. <hashFn> supports `deep properties`.
     *
     * @example
     *
     *   fn = logHello.memoize();fn(1);fn(2);fn(1);
     *   -> logs twice, returning the memoized result of the first call
     *
     *   (5).times(logHello.memoize())
     *   -> will log 5 times as each call is passed different arguments by "times"
     *
     ***/
    'memoize': function(fn, hashFn) {
      return createMemoizedFunction(fn, hashFn);
    },

     /***
     * @method lock([n])
     * @returns Function
     * @short Locks the number of arguments accepted by the function.
     * @extra If not passed, [n] will be the length of the function. This method
     *        can be called on functions created by `partial`, in which case it
     *        will lock the total arguments during execution.
     *
     * @example
     *
     *   parseInt.lock(1)('10', 16)  -> 10 (only 1 argument passed to parseInt)
     *   logArguments.lock(2)(1,2,3) -> logs 1,2
     *
     ***/
    'lock': function(fn, n) {
      var lockedFn;
      if (_partial(fn)) {
        _lock(fn, isNumber(n) ? n : null);
        return fn;
      }
      lockedFn = function() {
        arguments.length = min(_lock(lockedFn), arguments.length);
        return fn.apply(this, arguments);
      };
      _lock(lockedFn, isNumber(n) ? n : fn.length);
      return lockedFn;
    }

  });


  defineInstanceWithArguments(sugarFunction, {

     /***
     * @method partial(<arg1>, <arg2>, ...)
     * @returns Function
     * @short Returns a new version of the function which has part of its arguments
     *        pre-emptively filled in, also known as "currying".
     * @extra `undefined` can be passed as any argument, and is a placeholder that
     *        will be replaced with arguments passed when the function is executed.
     *        This allows currying of arguments even when they occur toward the end
     *        of an argument list (the example demonstrates this more clearly).
     *
     * @example
     *
     *   logArguments.partial(undefined, 'b')('a')    // logs a, b
     *   setTimeout.partial(undefined, 500)(logHello) // logs after 500ms
     *
     ***/
    'partial': function(fn, curriedArgs) {
      var curriedLen = curriedArgs.length;
      var partialFn = function() {
        var argIndex = 0, applyArgs = [], self = this, lock = _lock(partialFn), result, i;
        for (i = 0; i < curriedLen; i++) {
          var arg = curriedArgs[i];
          if (isDefined(arg)) {
            applyArgs[i] = arg;
          } else {
            applyArgs[i] = arguments[argIndex++];
          }
        }
        for (i = argIndex; i < arguments.length; i++) {
          applyArgs.push(arguments[i]);
        }
        if (lock === null) {
          lock = curriedLen;
        }
        if (isNumber(lock)) {
          applyArgs.length = min(applyArgs.length, lock);
        }
        // If the bound "this" object is an instance of the partialed
        // function, then "new" was used, so preserve the prototype
        // so that constructor functions can also be partialed.
        if (self instanceof partialFn) {
          self = createInstanceFromPrototype(fn.prototype);
          result = fn.apply(self, applyArgs);
          // An explicit return value is allowed from constructors
          // as long as they are of "object" type, so return the
          // correct result here accordingly.
          return isObjectType(result) ? result : self;
        }
        return fn.apply(self, applyArgs);
      };
      _partial(partialFn, true);
      return partialFn;
    },

     /***
     * @method delay([ms] = 1, [arg1], ...)
     * @returns Function
     * @short Executes the function after <ms> milliseconds.
     * @extra Returns a reference to itself. `delay` is also a way to execute non-
     *        blocking operations that will wait until the CPU is free. Delayed
     *        functions can be canceled using the `cancel` method. Can also curry
     *        arguments passed in after <ms>.
     *
     * @example
     *
     *   logHello.delay(500)          // logs after 500ms
     *   logArguments.delay(500, 'a') // logs "a" after 500ms
     *
     ***/
    'delay': function(fn, ms, args) {
      setDelay(fn, ms, fn, fn, args);
      return fn;
    },

     /***
     * @method every([ms] = 1, [arg1], ...)
     * @returns Function
     * @short Executes the function every <ms> milliseconds.
     * @extra Returns a reference to itself. `every` uses `setTimeout`, which
     *        means that you are guaranteed a period of idle time equal to [ms]
     *        after execution has finished. Compare this to `setInterval` which
     *        will try to run a function every [ms], even when execution itself
     *        takes up a portion of that time. In most cases avoiding `setInterval`
     *        is better as calls won't "back up" when the CPU is under strain,
     *        however this also means that calls are less likely to happen at
     *        exact intervals of [ms], so the use case here should be considered.
     *        Additionally, `every` can curry arguments passed in after [ms], and
     *        also be canceled with `cancel`.
     *
     * @example
     *
     *   logEvery = logHello.every(1000) // logs every second
     *   logEvery.cancel() // cancel it!!
     *
     ***/
    'every': function(fn, ms, args) {
      function execute () {
        // Set the delay first here, so that cancel
        // can be called within the executing function.
        setDelay(fn, ms, execute);
        fn.apply(fn, args);
      }
      setDelay(fn, ms, execute);
      return fn;
    }

  });
  'use strict';

  /***
   * @module Number
   * @description Number formatting, precision rounding, Math aliases, etc.
   *
   ***/

  // Abbreviation Units
  var BASIC_UNITS         = '|kmbt',
      MEMORY_UNITS        = '|KMGTPE',
      MEMORY_BINARY_UNITS = '|,Ki,Mi,Gi,Ti,Pi,Ei',
      METRIC_UNITS_SHORT  = 'nμm|k',
      METRIC_UNITS_FULL   = 'yzafpnμm|KMGTPEZY';


  /***
   * @method thousands([str])
   * @returns Mixed
   * @accessor
   * @short Gets or sets a string to be used as the thousands marker (default ",").
   * @extra Used by `Number#format`, `Nubmer#abbr`, `Number#metric`, and
   *        `Number#bytes`. Setting to `null` restores the default.
   * @example
   *
   *   Sugar.Number.thousands('.');
   *
   ***
   * @method decimal([str])
   * @returns Mixed
   * @accessor
   * @short Gets or sets a string to be used as the decimal marker (default ".").
   * @extra Used by `Number#format`, `Nubmer#abbr`, `Number#metric`, and
   *        `Number#bytes`. Setting to `null` restores the default.
   *
   * @example
   *
   *   Sugar.Number.thousands(',');
   *
   ***/
  var _thousands = defineAccessor(sugarNumber, 'thousands', HALF_WIDTH_COMMA);
  var _decimal   = defineAccessor(sugarNumber, 'decimal', HALF_WIDTH_PERIOD);


  function abbreviateNumber(num, precision, ustr, bytes) {
    var fixed        = num.toFixed(20),
        decimalPlace = fixed.search(/\./),
        numeralPlace = fixed.search(/[1-9]/),
        significant  = decimalPlace - numeralPlace,
        units, unit, mid, i, divisor;
    if (significant > 0) {
      significant -= 1;
    }
    units = commaSplit(ustr);
    if (units.length === 1) {
      units = ustr.split('');
    }
    mid = units.indexOf('|');
    if (mid === -1) {
      // Skipping the placeholder means the units should start from zero,
      // otherwise assume they end at zero.
      mid = units[0] === '_' ? 0 : units.length;
    }
    i = max(min(floor(significant / 3), units.length - mid - 1), -mid);
    unit = units[i + mid];
    while (unit === '_') {
      i += i < 0 ? -1 : 1;
      unit = units[i + mid];
    }
    if (unit === '|') {
      unit = '';
    }
    if (significant < -9) {
      precision = abs(significant) - 9;
    }
    divisor = bytes ? pow(2, 10 * i) : pow(10, i * 3);
    return numberFormat(withPrecision(num / divisor, precision || 0)) + unit;
  }

  function numberFormat(num, place) {
    var i, str, split, integer, fraction, result = '', p = isNumber(place);
    str = p ? withPrecision(num, place || 0).toFixed(max(place, 0)) : num.toString();
    str = str.replace(/^-/, '');
    split    = periodSplit(str);
    integer  = split[0];
    fraction = split[1];
    if (/e/.test(str)) {
      result = str;
    } else {
      for(i = integer.length; i > 0; i -= 3) {
        if (i < integer.length) {
          result = _thousands() + result;
        }
        result = integer.slice(max(0, i - 3), i) + result;
      }
    }
    if (fraction) {
      result += _decimal() + repeatString('0', (place || 0) - fraction.length) + fraction;
    }
    return (num < 0 ? '-' : '') + result;
  }

  function isInteger(n) {
    return n % 1 === 0;
  }

  function isMultipleOf(n1, n2) {
    return n1 % n2 === 0;
  }

  function createRoundingFunction(fn) {
    return function(n, precision) {
      return precision ? withPrecision(n, precision, fn) : fn(n);
    };
  }

  defineStatic(sugarNumber, {

    /***
     * @method random([n1], [n2])
     * @returns Number
     * @static
     * @short Returns a random integer between [n1] and [n2].
     * @extra If only 1 number is passed, the other will be 0. If none are passed,
     *        the number will be either 0 or 1.
     *
     * @example
     *
     *   Number.random(50, 100) -> ex. 85
     *   Number.random(50)      -> ex. 27
     *   Number.random()        -> ex. 0
     *
     ***/
    'random': function(n1, n2) {
      var minNum, maxNum;
      if (arguments.length == 1) n2 = n1, n1 = 0;
      minNum = min(n1 || 0, isUndefined(n2) ? 1 : n2);
      maxNum = max(n1 || 0, isUndefined(n2) ? 1 : n2) + 1;
      return trunc((Math.random() * (maxNum - minNum)) + minNum);
    }

  });

  defineInstance(sugarNumber, {

    /***
     * @method isInteger()
     * @returns Boolean
     * @short Returns true if the number has no trailing decimal.
     *
     * @example
     *
     *   (420).isInteger() -> true
     *   (4.5).isInteger() -> false
     *
     ***/
    'isInteger': function(n) {
      return isInteger(n);
    },

    /***
     * @method isOdd()
     * @returns Boolean
     * @short Returns true if the number is odd.
     *
     * @example
     *
     *   (3).isOdd()  -> true
     *   (18).isOdd() -> false
     *
     ***/
    'isOdd': function(n) {
      return isInteger(n) && !isMultipleOf(n, 2);
    },

    /***
     * @method isEven()
     * @returns Boolean
     * @short Returns true if the number is even.
     *
     * @example
     *
     *   (6).isEven()  -> true
     *   (17).isEven() -> false
     *
     ***/
    'isEven': function(n) {
      return isMultipleOf(n, 2);
    },

    /***
     * @method isMultipleOf(<num>)
     * @returns Boolean
     * @short Returns true if the number is a multiple of <num>.
     *
     * @example
     *
     *   (6).isMultipleOf(2)  -> true
     *   (17).isMultipleOf(2) -> false
     *   (32).isMultipleOf(4) -> true
     *   (34).isMultipleOf(4) -> false
     *
     ***/
    'isMultipleOf': function(n, num) {
      return isMultipleOf(n, num);
    },

    /***
     * @method log(<base> = Math.E)
     * @returns Number
     * @short Returns the logarithm of the number with base <base>, or natural
     *        logarithm of the number if <base> is undefined.
     *
     * @example
     *
     *   (64).log(2) -> 6
     *   (9).log(3)  -> 2
     *   (5).log()   -> 1.6094379124341003
     *
     ***/
    'log': function(n, base) {
      return Math.log(n) / (base ? Math.log(base) : 1);
    },

    /***
     * @method abbr([precision] = 0)
     * @returns String
     * @short Returns an abbreviated form of the number ("k" for thousand, "m"
     *        for million, etc).
     * @extra [precision] will round to the given precision. `Sugar.thousands` and
     *        `Sugar.decimal` allow custom markers to be used.
     *
     * @example
     *
     *   (1000).abbr()    -> "1k"
     *   (1000000).abbr() -> "1m"
     *   (1280).abbr(1)   -> "1.3k"
     *
     ***/
    'abbr': function(n, precision) {
      return abbreviateNumber(n, precision, BASIC_UNITS);
    },

    /***
     * @method metric([precision] = 0, [units] = "nμm|k")
     * @returns String
     * @short Returns the number as a string in metric notation.
     * @extra [precision] will round to the given precision (can be negative).
     *        [units] is a string that determines both the unit notation and the
     *        min/max unit allowed. The default is natural notation for common
     *        units (meters, grams, etc). "all" can be passed for [units] and is a
     *        shortcut to all standard SI units. The token `,` if present separates
     *        units, otherwise each character is a unit. The token `|` if present
     *        marks where fractional units end, otherwise no fractional units are
     *        used. Finally, the token `_` if present is a placeholder for no unit.
     *
     * @example
     *
     *   (1000).metric()        -> "1k"
     *   (1000000).metric()     -> "1,000k"
     *   (1249).metric(2) + 'g' -> "1.25kg"
     *   (0.025).metric() + 'm' -> "25mm"
     *   (1000000).metric(0, 'nμm|kM') -> "1M"
     *
     ***/
    'metric': function(n, precision, units) {
      if (units === 'all') {
        units = METRIC_UNITS_FULL;
      } else if (!units) {
        units = METRIC_UNITS_SHORT;
      }
      return abbreviateNumber(n, precision, units);
    },

    /***
     * @method bytes([precision] = 0, [si] = false, [units] = '|KMGTPE')
     * @returns String
     * @short Returns an abbreviated form of the number, with 'B' on the end for "bytes".
     * @extra [precision] will round to the given precision. If [si] is `true`,
     *        the standard SI units of 1000 will be used instead of 1024. [units]
     *        is a string that determines both the unit notation and the min/max
     *        unit allowed. See `Number#metric` for more.
     *
     * @example
     *
     *   (1000).bytes()                 -> "1kB"
     *   (1000).bytes(2)                -> "0.98kB"
     *   ((10).pow(20)).bytes()         -> "90,949,470TB"
     *   ((10).pow(20)).bytes(0, false) -> "87EB"
     *
     ***/
    'bytes': function(n, precision, si, units) {
      if (units === 'binary') {
        units = MEMORY_BINARY_UNITS;
      } else if(!units) {
        units = MEMORY_UNITS;
      }
      return abbreviateNumber(n, precision, units, !si) + 'B';
    },

    /***
     * @method format([place] = 0)
     * @returns String
     * @short Formats the number to a readable string.
     * @extra If [place] is `undefined`, the place will automatically be determined.
     *        `Sugar.thousands` and `Sugar.decimal` allow custom markers to be used.
     *
     * @example
     *
     *   (56782).format()    -> '56,782'
     *   (56782).format(2)   -> '56,782.00'
     *   (4388.43).format(2) -> '4,388.43'
     *
     ***/
    'format': function(n, place) {
      return numberFormat(n, place);
    },

    /***
     * @method hex([pad] = 1)
     * @returns String
     * @short Converts the number to hexidecimal.
     * @extra [pad] will pad the resulting string to that many places.
     *
     * @example
     *
     *   (255).hex()   -> 'ff';
     *   (255).hex(4)  -> '00ff';
     *   (23654).hex() -> '5c66';
     *
     ***/
    'hex': function(n, pad) {
      return padNumber(n, pad || 1, false, 16);
    },

    /***
     * @method times(<fn>)
     * @returns Mixed
     * @short Calls <fn> a number of times equivalent to the number.
     * @extra Any non-undefined return values of <fn> will be collected and
     *        returned in an array.
     *
     * @callback fn
     *
     *   i   The index of the current iteration.
     *
     * @example
     *
     *   (8).times(logHello) // logs "hello" 8 times
     *
     ***/
    'times': function(n, fn) {
      var arr, result;
      for(var i = 0; i < n; i++) {
        result = fn.call(n, i);
        if (isDefined(result)) {
          if (!arr) {
            arr = [];
          }
          arr.push(result);
        }
      }
      return arr;
    },

    /***
     * @method chr()
     * @returns String
     * @short Returns a string at the code point of the number.
     *
     * @example
     *
     *   (65).chr() -> "A"
     *   (75).chr() -> "K"
     *
     ***/
    'chr': function(n) {
      return chr(n);
    },

    /***
     * @method pad(<place> = 0, [sign] = false, [base] = 10)
     * @returns String
     * @short Pads a number with "0" to <place>.
     * @extra [sign] allows you to force the sign as well (+05, etc). [base] can
     *        change the base for numeral conversion.
     *
     * @example
     *
     *   (5).pad(2)        -> '05'
     *   (-5).pad(4)       -> '-0005'
     *   (82).pad(3, true) -> '+082'
     *
     ***/
    'pad': function(n, place, sign, base) {
      return padNumber(n, place, sign, base);
    },

    /***
     * @method ordinalize()
     * @returns String
     * @short Returns an ordinalized (English) string, i.e. "1st", "2nd", etc.
     *
     * @example
     *
     *   (1).ordinalize() -> '1st';
     *   (2).ordinalize() -> '2nd';
     *   (8).ordinalize() -> '8th';
     *
     ***/
    'ordinalize': function(n) {
      var num = abs(n), last = +num.toString().slice(-2);
      return n + getOrdinalSuffix(last);
    },

    /***
     * @method toNumber()
     * @returns Number
     * @short Identity function for compatibilty.
     *
     * @example
     *
     *   (420).toNumber() -> 420
     *
     ***/
    'toNumber': function(n) {
      return n.valueOf();
    },

    /***
     * @method round(<precision> = 0)
     * @returns Number
     * @short Shortcut for `Math.round` that also allows a <precision>.
     *
     * @example
     *
     *   (3.241).round()  -> 3
     *   (-3.841).round() -> -4
     *   (3.241).round(2) -> 3.24
     *   (3748).round(-2) -> 3800
     *
     ***/
    'round': createRoundingFunction(round),

    /***
     * @method ceil(<precision> = 0)
     * @returns Number
     * @short Shortcut for `Math.ceil` that also allows a <precision>.
     *
     * @example
     *
     *   (3.241).ceil()  -> 4
     *   (-3.241).ceil() -> -3
     *   (3.241).ceil(2) -> 3.25
     *   (3748).ceil(-2) -> 3800
     *
     ***/
    'ceil': createRoundingFunction(ceil),

    /***
     * @method floor(<precision> = 0)
     * @returns Number
     * @short Shortcut for `Math.floor` that also allows a <precision>.
     *
     * @example
     *
     *   (3.241).floor()  -> 3
     *   (-3.841).floor() -> -4
     *   (3.241).floor(2) -> 3.24
     *   (3748).floor(-2) -> 3700
     *
     ***/
    'floor': createRoundingFunction(floor)

  });

  /***
   * @method [math]()
   * @returns Number
   * @short Math related functions are mapped as shortcuts to numbers and are
   *        identical. Note that `Number#log` provides some special defaults.
   *
   * @set
   *   abs
   *   sin
   *   asin
   *   cos
   *   acos
   *   tan
   *   atan
   *   sqrt
   *   exp
   *   pow
   *
   * @example
   *
   *   (3).pow(3) -> 27
   *   (-3).abs() -> 3
   *   (1024).sqrt() -> 32
   *
   ***/
  function buildMathAliases() {
    defineInstanceSimilar(sugarNumber, 'abs,pow,sin,asin,cos,acos,tan,atan,exp,pow,sqrt', function(methods, name) {
      methods[name] = function(n, arg) {
        // Note that .valueOf() here is only required due to a
        // very strange bug in iOS7 that only occurs occasionally
        // in which Math.abs() called on non-primitive numbers
        // returns a completely different number (Issue #400)
        return Math[name](n.valueOf(), arg);
      };
    });
  }

  buildMathAliases();
  'use strict';

  /***
   * @module RegExp
   * @description Escaping regexes and manipulating their flags.
   *
   * Note here that methods on the RegExp class like .exec and .test will fail in
   * the current version of SpiderMonkey being used by CouchDB when using
   * shorthand regex notation like /foo/. This is the reason for the intermixed
   * use of shorthand and compiled regexes here. If you're using JS in CouchDB, it
   * is safer to ALWAYS compile your regexes from a string.
   *
   ***/

  defineStatic(sugarRegExp, {

   /***
    * @method escape(<str> = '')
    * @returns String
    * @static
    * @short Escapes all RegExp tokens in a string.
    *
    * @example
    *
    *   RegExp.escape('really?')      -> 'really\?'
    *   RegExp.escape('yes.')         -> 'yes\.'
    *   RegExp.escape('(not really)') -> '\(not really\)'
    *
    ***/
    'escape': function(str) {
      return escapeRegExp(str);
    }

  });

  defineInstance(sugarRegExp, {

   /***
    * @method getFlags()
    * @returns String
    * @short Returns the flags of the regex as a string.
    *
    * @example
    *
    *   /texty/gim.getFlags() -> 'gim'
    *
    ***/
    'getFlags': function(r) {
      return getRegExpFlags(r);
    },

   /***
    * @method setFlags(<flags>)
    * @returns RegExp
    * @short Sets the flags on a regex and retuns a copy.
    *
    * @example
    *
    *   /texty/.setFlags('gim') -> now has global, ignoreCase, and multiline set
    *
    ***/
    'setFlags': function(r, flags) {
      return RegExp(r.source, flags);
    },

   /***
    * @method addFlags(<flags>)
    * @returns RegExp
    * @short Adds any flag in the <flags> string to the regex.
    *
    * @example
    *
    *   /texty/.addFlags('g')  -> /texty/g
    *   /texty/.addFlags('im') -> /texty/im
    *
    ***/
    'addFlags': function(r, flags) {
      return RegExp(r.source, getRegExpFlags(r, flags));
    },

   /***
    * @method removeFlags(<flags>)
    * @returns RegExp
    * @short Removes any flag in the <flags> string from the regex.
    *
    * @example
    *
    *   /texty/gim.removeFlags('g')  -> /texty/im
    *   /texty/gim.removeFlags('im') -> /texty/g
    *
    ***/
    'removeFlags': function(r, flags) {
      var reg = allCharsReg(flags);
      return RegExp(r.source, getRegExpFlags(r).replace(reg, ''));
    }

  });
  'use strict';

  /***
   * @module Range
   * @description Ranges allow creating spans of numbers, strings, or dates.
   *              They can enumerate over specific points within that range,
   *              and be manipulated and compared.
   *
   ***/

  var DURATION_UNITS           = 'year|month|week|day|hour|minute|(?:milli)?second';
  var FULL_CAPTURED_DURATION   = '((?:\\d+)?\\s*(?:' + DURATION_UNITS + '))s?';

  // Duration Formats
  var DURATION_REG             = RegExp('(\\d+)?\\s*('+ DURATION_UNITS +')s?', 'i'),
      RANGE_REG_FROM_TO        = /(?:from)?\s*(.+)\s+(?:to|until)\s+(.+)$/i,
      RANGE_REG_REAR_DURATION  = RegExp('(.+)\\s*for\\s*' + FULL_CAPTURED_DURATION, 'i'),
      RANGE_REG_FRONT_DURATION = RegExp('(?:for)?\\s*'+ FULL_CAPTURED_DURATION +'\\s*(?:starting)?\\s*at\\s*(.+)', 'i');

  var MULTIPLIERS = {
    'Hours': 60 * 60 * 1000,
    'Minutes': 60 * 1000,
    'Seconds': 1000,
    'Milliseconds': 1
  };

  var PrimitiveRangeConstructor = function(start, end) {
    return new Range(start, end);
  };

  var DateRangeConstructor = function(start, end) {
    if (arguments.length === 1 && isString(start)) {
      return createDateRangeFromString(start);
    }
    return new Range(getDateForRange(start), getDateForRange(end));
  };

  function Range(start, end) {
    this.start = cloneRangeMember(start);
    this.end   = cloneRangeMember(end);
  }

  function getRangeMemberNumericValue(m) {
    return isString(m) ? m.charCodeAt(0) : m;
  }

  function getRangeMemberPrimitiveValue(m) {
    if (m == null) return m;
    return isDate(m) ? m.getTime() : m.valueOf();
  }

  function getPrecision(n) {
    var split = periodSplit(n.toString());
    return split[1] ? split[1].length : 0;
  }

  function getGreaterPrecision(n1, n2) {
    return max(getPrecision(n1), getPrecision(n2));
  }

  function getDateForRange(d) {
    if (isDate(d)) {
      return d;
    } else if (sugarDate.create) {
      return sugarDate.create(d);
    } else {
      // Needed as argument numbers are checked internally here.
      return d === undefined ? new Date() : new Date(d);
    }
  }

  function createDateRangeFromString(str) {
    var match, datetime, duration, dio, start, end;
    if (sugarDate.get && (match = str.match(RANGE_REG_FROM_TO))) {
      start = getDateForRange(match[1].replace('from', 'at'));
      end = sugarDate.get(start, match[2]);
      return new Range(start, end);
    }
    if (match = str.match(RANGE_REG_FRONT_DURATION)) {
      duration = match[1];
      datetime = match[2];
    }
    if (match = str.match(RANGE_REG_REAR_DURATION)) {
      datetime = match[1];
      duration = match[2];
    }
    if (datetime && duration) {
      start = getDateForRange(datetime);
      dio = getDateIncrementObject(duration);
      end = incrementDate(start, dio[0], dio[1]);
    }
    return new Range(getDateForRange(start), getDateForRange(end));
  }

  function cloneRangeMember(m) {
    if (isDate(m)) {
      return new Date(m.getTime());
    } else {
      return getRangeMemberPrimitiveValue(m);
    }
  }

  function isValidRangeMember(m) {
    var val = getRangeMemberPrimitiveValue(m);
    return (!!val || val === 0) && valueIsNotInfinite(m);
  }

  function valueIsNotInfinite(m) {
    return m !== -Infinity && m !== Infinity;
  }

  function getDateIncrementObject(amt) {
    var match, val, unit;
    if (isNumber(amt)) {
      return [amt, 'Milliseconds'];
    }
    match = amt.match(DURATION_REG);
    val = +match[1] || 1;
    unit = simpleCapitalize(match[2]);
    if (unit.match(/hour|minute|second/i)) {
      unit += 's';
    } else if (unit === 'Year') {
      unit = 'FullYear';
    } else if (unit === 'Day') {
      unit = 'Date';
    }
    return [val, unit];
  }

  function incrementDate(src, amount, unit) {
    var mult = MULTIPLIERS[unit], d;
    if (mult) {
      d = new Date(src.getTime() + (amount * mult));
    } else {
      d = new Date(src);
      callDateSet(d, unit, callDateGet(src, unit) + amount);
    }
    return d;
  }

  function incrementString(current, amount) {
    return chr(current.charCodeAt(0) + amount);
  }

  function incrementNumber(current, amount, precision) {
    return withPrecision(current + amount, precision);
  }

  Range.prototype = {

    /***
     * @method toString()
     * @returns String
     * @short Returns a string representation of the range.
     *
     * @example
     *
     *   Number.range(1, 5).toString() -> 1..5
     *   janToMay.toString()           -> January 1, xxxx..May 1, xxxx
     *
     ***/
    'toString': function() {
      return this.isValid() ? this.start + '..' + this.end : 'Invalid Range';
    },

    /***
     * @method isValid()
     * @returns Boolean
     * @short Returns true if the range is valid, false otherwise.
     *
     * @example
     *
     *   janToMay.isValid() -> true
     *   Number.range(NaN, NaN).isValid()                           -> false
     *
     ***/
    'isValid': function() {
      return isValidRangeMember(this.start) &&
             isValidRangeMember(this.end) &&
             typeof this.start === typeof this.end;
    },

    /***
     * @method span()
     * @returns Number
     * @short Returns the span of the range. If the range is a date range, the
     *        value is in milliseconds.
     * @extra The span includes both the start and the end.
     *
     * @example
     *
     *   Number.range(5, 10).span() -> 6
     *   janToMay.span()            -> 10368000001 (or more depending on leap year)
     *
     ***/
    'span': function() {
      var n = getRangeMemberNumericValue(this.end) - getRangeMemberNumericValue(this.start);
      return this.isValid() ? abs(n) + 1 : NaN;
    },

    /***
     * @method contains(<obj>)
     * @returns Boolean
     * @short Returns true if <obj> is contained inside the range. <obj> may be a
     *        value or another range.
     *
     * @example
     *
     *   Number.range(5, 10).contains(7)         -> true
     *   janToMay.contains(Date.create('March')) -> true
     *
     ***/
    'contains': function(obj) {
      if (obj == null) return false;
      if (obj.start && obj.end) {
        return obj.start >= this.start && obj.start <= this.end &&
               obj.end   >= this.start && obj.end   <= this.end;
      } else {
        return obj >= this.start && obj <= this.end;
      }
    },

    /***
     * @method every(<amount>, [fn])
     * @returns Array
     * @short Iterates through the range for every <amount>, calling [fn] if it is
     *        passed. Returns an array of each increment visited.
     * @extra In the case of date ranges, <amount> can also be a string, in which
     *        case it will increment a number of  units. Note that `(2).months()`
     *        first resolves to a number, which will be interpreted as milliseconds
     *        and is an approximation, so stepping through the actual months by
     *        passing `"2 months"` is usually preferable.
     *
     * @callback fn
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   r    A reference to the range.
     *
     * @example
     *
     *   Number.range(2, 8).every(2) -> [2,4,6,8]
     *   janToMay.every('month')     -> [Jan 1, Feb 1, Mar 1, Apr 1, May 1]
     *
     ***/
    'every': function(amount, fn) {
      var increment,
          precision,
          dio,
          unit,
          start   = this.start,
          end     = this.end,
          inverse = end < start,
          current = start,
          index   = 0,
          result  = [];

      if (!this.isValid()) {
        return [];
      }
      if (isFunction(amount)) {
        fn = amount;
        amount = null;
      }
      amount = amount || 1;
      if (isNumber(start)) {
        precision = getGreaterPrecision(start, amount);
        increment = function() {
          return incrementNumber(current, amount, precision);
        };
      } else if (isString(start)) {
        increment = function() {
          return incrementString(current, amount);
        };
      } else if (isDate(start)) {
        dio    = getDateIncrementObject(amount);
        amount = dio[0];
        unit   = dio[1];
        increment = function() {
          return incrementDate(current, amount, unit);
        };
      }
      // Avoiding infinite loops
      if (inverse && amount > 0) {
        amount *= -1;
      }
      while(inverse ? current >= end : current <= end) {
        result.push(current);
        if (fn) {
          fn(current, index, this);
        }
        current = increment();
        index++;
      }
      return result;
    },

    /***
     * @method toArray()
     * @returns Array
     * @short Creates an array from the range.
     * @extra If the range is a date range, every millisecond between the start
     *        and end dates will be returned. To control this use `every` instead.
     *
     * @example
     *
     *   Number.range(1, 5).toArray() -> [1,2,3,4,5]
     *   Date.range('1 second ago', 'now').toArray() -> [1000ms ago, 999ms ago, ...]
     *
     ***/
    'toArray': function() {
      return this.every();
    },

    /***
     * @method union(<range>)
     * @returns Range
     * @short Returns a new range with the earliest starting point as its start,
     *        and the latest ending point as its end. If the two ranges do not
     *        intersect this will effectively remove the "gap" between them.
     *
     * @example
     *
     *   oneToTen.union(fiveToTwenty) -> 1..20
     *   janToMay.union(marToAug)     -> Jan 1, xxxx..Aug 1, xxxx
     *
     ***/
    'union': function(range) {
      return new Range(
        this.start < range.start ? this.start : range.start,
        this.end   > range.end   ? this.end   : range.end
      );
    },

    /***
     * @method intersect(<range>)
     * @returns Range
     * @short Returns a new range with the latest starting point as its start,
     *        and the earliest ending point as its end. If the two ranges do not
     *        intersect this will effectively produce an invalid range.
     *
     * @example
     *
     *   oneToTen.intersect(fiveToTwenty) -> 5..10
     *   janToMay.intersect(marToAug)     -> Mar 1, xxxx..May 1, xxxx
     *
     ***/
    'intersect': function(range) {
      if (range.start > this.end || range.end < this.start) {
        return new Range(NaN, NaN);
      }
      return new Range(
        this.start > range.start ? this.start : range.start,
        this.end   < range.end   ? this.end   : range.end
      );
    },

    /***
     * @method clone()
     * @returns Range
     * @short Clones the range.
     * @extra Members of the range will also be cloned.
     *
     * @example
     *
     *   Number.range(1, 5).clone() -> Returns a copy of the range.
     *
     ***/
    'clone': function() {
      return new Range(this.start, this.end);
    },

    /***
     * @method clamp(<obj>)
     * @returns Mixed
     * @short Clamps <obj> to be within the range if it falls outside.
     *
     * @example
     *
     *   Number.range(1, 5).clamp(8)     -> 5
     *   Date.range(janToMay).clamp(aug) -> May 1, xxxx
     *
     ***/
    'clamp': function(obj) {
      var clamped,
          start = this.start,
          end = this.end,
          min = end < start ? end : start,
          max = start > end ? start : end;
      if (obj < min) {
        clamped = min;
      } else if (obj > max) {
        clamped = max;
      } else {
        clamped = obj;
      }
      return cloneRangeMember(clamped);
    }

  };


  /*** @namespace Number ***/

  defineStatic(sugarNumber, {

    /***
     * @method range([start], [end])
     * @returns Range
     * @static
     * @short Creates a new range between [start] and [end]. See `ranges` for more.
     *
     * @example
     *
     *   Number.range(5, 10)
     *
     ***/
    'range': PrimitiveRangeConstructor

  });

  defineInstance(sugarNumber, {

    /***
     * @method upto(<num>, [fn], [step] = 1)
     * @returns Array
     * @short Returns an array containing numbers from the number up to <num>.
     * @extra Optionally calls [fn] callback for each number in that array.
     *        [step] allows multiples greater than 1.
     *
     * @callback fn
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   r    A reference to the range.
     *
     * @example
     *
     *   (2).upto(6) -> [2, 3, 4, 5, 6]
     *   (2).upto(6, function(n) {
     *     // This function is called 5 times receiving n as the value.
     *   });
     *   (2).upto(8, null, 2) -> [2, 4, 6, 8]
     *
     ***/
    'upto': function(n, num, fn, step) {
      return new Range(n, num).every(step, fn);
    },

     /***
     * @method clamp([start] = Infinity, [end] = Infinity)
     * @returns Number
     * @short Constrains the number so that it is between [start] and [end].
     * @extra This will build a range object that has an equivalent `clamp` method.
     *
     * @example
     *
     *   (3).clamp(50, 100)  -> 50
     *   (85).clamp(50, 100) -> 85
     *
     ***/
    'clamp': function(n, start, end) {
      return new Range(start, end).clamp(n);
    },

     /***
     * @method cap([max] = Infinity)
     * @returns Number
     * @short Constrains the number so that it is no greater than [max].
     * @extra This will build a range object that has an equivalent `cap` method.
     *
     * @example
     *
     *   (100).cap(80) -> 80
     *
     ***/
    'cap': function(n, max) {
      return new Range(undefined, max).clamp(n);
    }

  });

  /***
   * @method downto(<num>, [fn], [step] = 1)
   * @returns Array
   * @short Returns an array containing numbers from the number down to <num>.
   * @extra Optionally calls [fn] callback for each number in that array. [step]
   *        allows multiples greater than 1.
   *
     * @callback fn
     *
     *   el   The element of the current iteration.
     *   i    The index of the current iteration.
     *   r    A reference to the range.
     *
   * @example
   *
   *   (8).downto(3) -> [8, 7, 6, 5, 4, 3]
   *   (8).downto(3, function(n) {
   *     // This function is called 6 times receiving n as the value.
   *   });
   *   (8).downto(2, null, 2) -> [8, 6, 4, 2]
   *
   ***/
  alias(sugarNumber, 'downto', 'upto');


  /*** @namespace String ***/

  defineStatic(sugarString, {

    /***
     * @method range([start], [end])
     * @returns Range
     * @static
     * @short Creates a new range between [start] and [end]. See `ranges` for more.
     *
     * @example
     *
     *   String.range('a', 'z')
     *
     ***/
    'range': PrimitiveRangeConstructor

  });


  /*** @namespace Date ***/

  defineStatic(sugarDate,   {

    /***
     * @method range([start], [end])
     * @returns Range
     * @static
     * @short Creates a new range between [start] and [end].
     * @extra If either [start] or [end] are null, they will default to the
     *        current date. See `ranges` for more.
     *
     * @example
     *
     *   Date.range('today', 'tomorrow')
     *
     ***/
    'range': DateRangeConstructor

  });

}).call(this);