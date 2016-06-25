'use strict';

/***
 * @module Core
 * @description Core functionality including the ability to define methods and
 *              extend onto natives.
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
var namespacesByClassString = {};

// Defining properties.
var defineProperty = PROPERTY_DESCRIPTOR_SUPPORT ?  Object.defineProperty : definePropertyShim;

// A default chainable class for unknown types. The silly "SugarChainable" here
// is simply to force GCC to respect this token on output.
var SugarChainable, DefaultChainable = SugarChainable || getNewChainableClass('Chainable');


// Global methods

function setupGlobal() {
  Sugar = globalContext[SUGAR_GLOBAL];
  if (Sugar) {
    // Reuse already defined Sugar global object.
    return;
  }
  Sugar = function(arg) {
    forEachProperty(Sugar, function(name, sugarNamespace) {
      // Although only the only enumerable properties on the global
      // object are Sugar namespaces, environments that can't set
      // non-enumerable properties will step through the utility methods
      // as well here, so use this check to only allow true namespaces.
      if (hasOwn(namespacesByName, name)) {
        sugarNamespace.extend(arg);
      }
    });
    return Sugar;
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
  forEachProperty(NATIVE_NAMES.split(','), function(i, name) {
    createNamespace(name);
  });
  setGlobalProperties();
}

/***
 * @method createNamespace(<name>)
 * @returns Namespace
 * @global
 * @short Creates a new Sugar namespace.
 * @extra This method is for plugin developers who want to define methods to be
 *        used with natives that Sugar does not handle by default. The new
 *        namespace will appear on the `Sugar` global with all the methods of
 *        normal namespaces, including the ability to define new methods. When
 *        extended, any defined methods will be mapped to `name` in the global
 *        context.
 *
 * @example
 *
 *   Sugar.createNamespace('Boolean');
 *
 ***/
function createNamespace(name) {

  // Is the current namespace Object?
  var isObject = name === 'Object';

  // A Sugar namespace is also a chainable class: Sugar.Array, etc.
  var sugarNamespace = getNewChainableClass(name, true);

  /***
   * @method extend([options])
   * @returns Sugar
   * @global
   * @namespace
   * @short Extends Sugar defined methods onto natives.
   * @extra This method can be called on individual namespaces like
   *        `Sugar.Array` or on the `Sugar` global itself, in which case
   *        [options] will be forwarded to each `extend` call. For more,
   *        see `extending`.
   *
   * @options
   *
   *   methods           An array of method names to explicitly extend.
   *
   *   except            An array of method names or global namespaces (`Array`,
   *                     `String`) to explicitly exclude. Namespaces should be the
   *                     actual global objects, not strings.
   *
   *   namespaces        An array of global namespaces (`Array`, `String`) to
   *                     explicitly extend. Namespaces should be the actual
   *                     global objects, not strings.
   *
   *   enhance           A shortcut to disallow all "enhance" flags at once
   *                     (flags listed below). For more, see `enhanced methods`.
   *                     Default is `true`.
   *
   *   enhanceString     A boolean allowing String enhancements. Default is `true`.
   *
   *   enhanceArray      A boolean allowing Array enhancements. Default is `true`.
   *
   *   enhanceObject     A boolean allowing Object enhancements. Default is `true`.
   *
   *   objectPrototype   A boolean allowing Sugar to extend Object.prototype
   *                     with instance methods. This option is off by default
   *                     and should generally not be used except with caution.
   *                     For more, see `object methods`.
   *
   * @example
   *
   *   Sugar.Array.extend();
   *   Sugar.extend();
   *
   ***/
  var extend = function (opts) {

    var nativeClass = globalContext[name], nativeProto = nativeClass.prototype;
    var staticMethods = {}, instanceMethods = {}, methodsByName;

    function objectRestricted(name, target) {
      return isObject && target === nativeProto &&
             (!allowObjectPrototype || name === 'get' || name === 'set');
    }

    function disallowedByFlags(methodName, target, flags) {
      // Disallowing methods by flag currently only applies if methods already
      // exist to avoid enhancing native methods, as aliases should still be
      // extended (i.e. Array#all should still be extended even if Array#every
      // is being disallowed by a flag).
      if (!target[methodName] || !flags) {
        return false;
      }
      for (var i = 0; i < flags.length; i++) {
        if (opts[flags[i]] === false) {
          return true;
        }
      }
    }

    function namespaceIsExcepted() {
      return (opts.except && opts.except.indexOf(nativeClass) !== -1) ||
             (opts.namespaces && opts.namespaces.indexOf(nativeClass) === -1);
    }

    function methodIsExcepted(methodName) {
      return opts.except && opts.except.indexOf(methodName) !== -1;
    }

    function canExtend(methodName, method, target) {
      return !objectRestricted(methodName, target) &&
             !disallowedByFlags(methodName, target, method.flags) &&
             !methodIsExcepted(methodName);
    }

    opts = opts || {};
    methodsByName = opts.methods;

    if (namespaceIsExcepted()) {
      return;
    } else if (isObject && typeof opts.objectPrototype === 'boolean') {
      // Store "objectPrototype" flag for future reference.
      allowObjectPrototype = opts.objectPrototype;
    }

    forEachProperty(methodsByName || sugarNamespace, function(methodName, method) {
      if (methodsByName) {
        // If we have method names passed in an array,
        // then we need to flip the key and value here
        // and find the method in the Sugar namespace.
        methodName = method;
        method = sugarNamespace[methodName];
      }
      if (hasOwn(method, 'instance') && canExtend(methodName, method, nativeProto)) {
        instanceMethods[methodName] = method.instance;
      }
      if(hasOwn(method, 'static') && canExtend(methodName, method, nativeClass)) {
        staticMethods[methodName] = method;
      }
    });

    // Accessing the extend target each time instead of holding a reference as
    // it may have been overwritten (for example Date by Sinon). Also need to
    // access through the global to allow extension of user-defined namespaces.
    extendNative(nativeClass, staticMethods);
    extendNative(nativeProto, instanceMethods);

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
   * @short Defines static methods on the namespace that can later be extended
   *        onto the native globals.
   * @extra Accepts either a single object mapping names to functions, or name
   *        and function as two arguments. If `extend` was previously called
   *        with no arguments, the method will be immediately mapped to its
   *        native when defined.
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
   * @short Defines methods on the namespace that can later be extended as
   *        instance methods onto the native prototype.
   * @extra Accepts either a single object mapping names to functions, or name
   *        and function as two arguments. All functions should accept the
   *        native for which they are mapped as their first argument, and should
   *        never refer to `this`. If `extend` was previously called with no
   *        arguments, the method will be immediately mapped to its native when
   *        defined.
   *
   *        Methods cannot accept more than 4 arguments in addition to the
   *        native (5 arguments total). Any additional arguments will not be
   *        mapped. If the method needs to accept unlimited arguments, use
   *        `defineInstanceWithArguments`. Otherwise if more options are
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
   * @short Defines instance methods that are mapped onto the native prototype
   *        if they do not already exist.
   * @extra Intended only for use creating polyfills that follow the ECMAScript
   *        spec. Accepts either a single object mapping names to functions, or
   *        name and function as two arguments. This method differs from
   *        `defineInstance` as there is no static signature (as the method
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
    forEachProperty(opts.methods, function(methodName, fn) {
      defineChainableMethod(sugarNamespace, methodName, fn);
    });
  });

  /***
   * @method alias(<toName>, <fromName>)
   * @returns Namespace
   * @namespace
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
  namespacesByClassString['[object ' + name + ']'] = sugarNamespace;

  mapNativeToChainable(name);
  mapObjectChainablesToNamespace(sugarNamespace);


  // Export
  return Sugar[name] = sugarNamespace;
}

function setGlobalProperties() {
  setProperty(Sugar, 'VERSION', 'edge');

  setProperty(Sugar, 'extend', Sugar);
  setProperty(Sugar, 'toString', toString);
  setProperty(Sugar, 'createNamespace', createNamespace);

  setProperty(Sugar, 'util', {
    'hasOwn': hasOwn,
    'setProperty': setProperty,
    'classToString': classToString,
    'defineProperty': defineProperty,
    'forEachProperty': forEachProperty,
    'mapNativeToChainable': mapNativeToChainable
  });
}

function toString() {
  return SUGAR_GLOBAL;
}


// Defining Methods

function defineMethods(sugarNamespace, methods, type, args, flags) {
  forEachProperty(methods, function(methodName, method) {
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
    return fn.apply(this, args);
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
  forEachProperty(source, function(name, method) {
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

function getNewChainableClass(name) {
  var fn = SugarChainable = function (obj, arg) {
    if (!(this instanceof fn)) {
      return new fn(obj, arg);
    }
    if (this.constructor !== fn) {
      // Allow modules to define their own constructors.
      obj = this.constructor.apply(obj, arguments);
    }
    this.raw = obj;
  };
  setProperty(fn, 'toString', function() {
    return SUGAR_GLOBAL + name;
  });
  setProperty(fn.prototype, 'valueOf', function() {
    return this.raw;
  });
  return fn;
}

function defineChainableMethod(sugarNamespace, methodName, fn) {
  var wrapped = wrapWithChainableResult(fn), existing, collision, dcp;
  dcp = DefaultChainable.prototype;
  existing = dcp[methodName];

  // If the method was previously defined on the default chainable, then a
  // collision exists, so set the method to a disambiguation function that will
  // lazily evaluate the object and find it's associated chainable. An extra
  // check is required to avoid false positives from Object inherited methods.
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
  forEachProperty(Sugar.Object && Sugar.Object.prototype, function(methodName, val) {
    if (typeof val === 'function') {
      setObjectChainableOnNamespace(sugarNamespace, methodName, val);
    }
  });
}

function mapObjectChainableToAllNamespaces(methodName, fn) {
  forEachProperty(namespacesByName, function(name, sugarNamespace) {
    setObjectChainableOnNamespace(sugarNamespace, methodName, fn);
  });
}

function setObjectChainableOnNamespace(sugarNamespace, methodName, fn) {
  var proto = sugarNamespace.prototype;
  if (!hasOwn(proto, methodName)) {
    proto[methodName] = fn;
  }
}

function wrapWithChainableResult(fn) {
  return function() {
    return new DefaultChainable(fn.apply(this.raw, arguments));
  };
}

function disambiguateMethod(methodName) {
  var fn = function() {
    var raw = this.raw, sugarNamespace, fn;
    if (raw != null) {
      // Find the Sugar namespace for this unknown.
      sugarNamespace = namespacesByClassString[classToString(raw)];
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

  forEachProperty(methodNames, function(i, methodName) {
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

function forEachProperty(obj, fn) {
  for(var key in obj) {
    if (!hasOwn(obj, key)) continue;
    if (fn.call(obj, key, obj[key], obj) === false) break;
  }
}

// PERF: Attempts to speed this method up get very Heisenbergy. Quickly
// returning based on typeof works for primitives, but slows down object
// types. Even === checks on null and undefined (no typeof) will end up
// basically breaking even. This seems to be as fast as it can go.
function classToString(obj) {
  return internalToString.call(obj);
}

function hasOwn(obj, prop) {
  return !!obj && internalHasOwnProperty.call(obj, prop);
}

setupGlobal();
