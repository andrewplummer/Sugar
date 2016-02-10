'use strict';

/***
 * @module Core
 * @description Core module allows custom methods to be defined on the Sugar global and extended onto natives later.
 ***/

// The global to export.
var Sugar;

// The name of Sugar in the global namespace.
var SUGAR_GLOBAL = 'Sugar';

// Natives available on initialization.
var NATIVE_NAMES = 'Number,String,Array,Date,RegExp,Function,Object';

// defineProperty exists in IE8 but errors when defining a property on native
// objects. IE8 does not have defineProperies, so this check saves a try/catch.
var PROPERTY_DESCRIPTOR_SUPPORT = !!(Object.defineProperty && Object.defineProperties);

// Static method flag
var STATIC   = 0x1;

// Instance method flag
var INSTANCE = 0x2;

// defineProperty with a simple shim
var defineProperty = PROPERTY_DESCRIPTOR_SUPPORT ?  Object.defineProperty : definePropertyShim;

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

// A default chainable class for unknown types. The silly "SugarChainable" here
// is simply to force GCC to respect this token on output.
var SugarChainable, DefaultChainable = SugarChainable || getNewChainableClass('Chainable');

// Internal references
var ownPropertyNames = Object.getOwnPropertyNames,
    internalToString = Object.prototype.toString,
    internalHasOwnProperty = Object.prototype.hasOwnProperty;


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
 * @returns Self
 * @short Creates a new Sugar namespace.
 * @extra This method is for plugin developers who want to define methods to be
 *        used with natives that Sugar does not handle by default, for example
 *        Set, WeakMap, etc. <name> will appear on the `Sugar` global with all
 *        the methods of normal namespaces, as well as the ability to define new
 *        methods. Defined methods will appear on the namespace as static
 *        methods, but can also be used in chainables following the format:
 *        new Sugar.<name>() or Sugar.<name>(). Lastly, the global method
 *        `Sugar.extend()` allows end users to extend native prototypes with
 *        defined methods.
 ***/
function createNamespace(name) {

  // A Sugar namespace is also a chainable class: Sugar.Array, etc.
  var sugarNamespace = getNewChainableClass(name);

  // Is the current namespace Object?
  var isObject = name === 'Object';

  /***
   * @method extend([opt])
   * @returns Self
   * @short Extends natives with methods defined on the namespace.
   * @extra [opt] may be a string as a single method name, an array of method
   *        names, or an options object (options listed below). This method can
   *        be called on individual namespaces like `Sugar.Array` or on the
   *        global itself, in which case [options] will be forwarded to each
   *        `extend` call.
   *
   * @options
   *
   *   methods:          An array of method names to explicitly extend.
   *
   *   except:           An array of method names to explicitly exclude.
   *
   *   enhance:          A shortcut to disallow all "enhance" flags, which are
   *                     listed below and on by default.
   *
   *   enhanceString:    Sugar enhances `String#includes` to allow testing
   *                     against a regex.
   *
   *   enhanceArray:     Sugar enhances array methods `every`, `some`, `filter`,
   *                     `find`, and `findIndex` to allow passing shortcuts to
   *                     matching functions, as well as a shortcut for mapping
   *                     with `Array#map`. See each method's docs for more.
   *
   *   enhanceObject:    Sugar enhances `Object.keys` to run a callback for each
   *                     of the object's keys.
   *
   *   objectPrototype:  If `true`, this option will Object.prototype with
   *                     instance methods. This option is off by default as it
   *                     can have unintended consequences. For more, see
   *                     `extending natives`.
   *
   ***/
  var extend = function (arg) {
    var staticMethods = {}, instanceMethods = {}, opts = {}, methodsByName;

    function objectRestricted(name) {
      return isObject && (!allowObjectPrototype || name === 'get' || name === 'set');
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

    function canExtend(methodName, method) {
      return !objectRestricted(methodName) &&
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
      if (hasOwn(method, 'instance') && canExtend(methodName, method)) {
        instanceMethods[methodName] = method.instance;
      }
      if(hasOwn(method, 'static')) {
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
    // return self
    return sugarNamespace;
  };

  function defineWithOptionCollect(methodName, instance, args) {
    setProperty(sugarNamespace, methodName, function(arg1, arg2, arg3) {
      var opts = collectDefineOptions(arg1, arg2, arg3);
      defineMethods(sugarNamespace, opts.methods, instance, args, opts.last);
      return sugarNamespace;
    });
  }

  /***
   * @method defineStatic()
   * @returns SugarNamespace
   * @short Defines static methods on the namespace that can later be extended
   *        onto the native globals.
   * @extra Accepts either a single object mapping names to functions, or name
   *        and function as two arguments.
   ***/
  defineWithOptionCollect('defineStatic', STATIC);

  /***
   * @method defineInstance()
   * @returns SugarNamespace
   * @short Defines methods on the namespace that can later be extended as
   *        instance methods onto the native prototype.
   * @extra Accepts either a single object mapping names to functions, or name
   *        and function as two arguments. All functions should accept the
   *        native for which they are mapped as their first argument, and should
   *        never refer to their `this`. This allows the end user to decide if
   *        they want to use the method in static or instance form. Additionally,
   *        functions should never accept more than 4 arguments in addition to
   *        the native (5 arguments total), as any additional arguments will not
   *        be mapped. If more options are required, accept an options object instead.
   ***/
  defineWithOptionCollect('defineInstance', INSTANCE);

  /***
   * @method defineInstanceAndStatic()
   * @returns SugarNamespace
   * @short A shortcut to define both static and instance methods on the namespace.
   * @extra This method is intended for use with `Object`. As Sugar will not map
   *        instance methods to `Object.prototype` by default, defining intended
   *        instance methods as both promotes the use of static methods instead.
   *        See the `Object` docs for examples of this.
   ***/
  defineWithOptionCollect('defineInstanceAndStatic', INSTANCE | STATIC);

  /***
   * @method defineStaticWithArguments()
   * @returns SugarNamespace
   * @short Defines static methods that collect arguments.
   * @extra This method is identical to `defineStatic`, except that when defined
   *        methods are called, they will collect any arguments past `n - 1`,
   *        where `n` is the number of arguments that the method accepts.
   *        Collected arguments will be passed to the method as the last argument
   *        defined on the function.
   ***/
  defineWithOptionCollect('defineStaticWithArguments', STATIC, true);

  /***
   * @method defineInstanceWithArguments()
   * @returns SugarNamespace
   * @short Defines instance methods that collect arguments.
   * @extra This method is identical to `defineInstance`, except that when
   *        defined methods are called, they will collect any arguments past
   *        `n - 1`, where `n` is the number of arguments that the method
   *        accepts. Collected arguments will be passed to the method as the
   *        last argument defined on the function.
   ***/
  defineWithOptionCollect('defineInstanceWithArguments', INSTANCE, true);

  /***
   * @method alias(<fromName>, <toName>)
   * @returns SugarNamespace
   * @short Aliases one Sugar method to another.
   ***/
  setProperty(sugarNamespace, 'alias', function(name, source) {
    var method = typeof source === 'string' ? sugarNamespace[source] : source;
    setMethod(sugarNamespace, name, method);
  });

  /***
   * @method defineStaticPolyfill()
   * @returns SugarNamespace
   * @short Defines static methods that are immediately mapped onto the native
   *        if they do not already exist.
   * @extra Intended only for use creating polyfills that follow the ECMAScript
   *        spec. Accepts either a single object mapping names to functions, or
   *        name and function as two arguments.
   ***/
  setProperty(sugarNamespace, 'defineStaticPolyfill', function(arg1, arg2, arg3) {
    var opts = collectDefineOptions(arg1, arg2, arg3);
    extendNative(globalContext[name], opts.methods, true, opts.last);
  });

  /***
   * @method defineInstancePolyfill()
   * @returns SugarNamespace
   * @short Defines instance methods that are immediately mapped onto the native
   *        prototype if they do not already exist.
   * @extra Intended only for use creating polyfills that follow the ECMAScript
   *        spec. Accepts either a single object mapping names to functions, or
   *        name and function as two arguments.
   ***/
  setProperty(sugarNamespace, 'defineInstancePolyfill', function(arg1, arg2, arg3) {
    var opts = collectDefineOptions(arg1, arg2, arg3);
    extendNative(globalContext[name].prototype, opts.methods, true, opts.last);
    // Map instance polyfills to chainable as well.
    iterateOverObject(opts.methods, function(methodName, fn) {
      setMethodOnChainable(sugarNamespace, methodName, fn);
    });
  });

  // Each namespace can extend only itself through its .extend method.
  setProperty(sugarNamespace, 'extend', extend);

  // Cache the class to namespace relationship for later use.
  namespacesByName[name] = sugarNamespace;
  namespacesByClassName['[object ' + name + ']'] = sugarNamespace;

  // Export
  Sugar[name] = sugarNamespace;

  mapNativeToChainable(name);

  return sugarNamespace;
}

function setGlobalProperties() {
  setProperty(Sugar, 'VERSION', 'edge');
  // The extend method is an alias to the global function
  // to allow two methods of extending:
  // Sugar.extend();
  // require('sugar')();
  setProperty(Sugar, 'extend', Sugar);
  setProperty(Sugar, 'hasOwn', hasOwn);
  setProperty(Sugar, 'toString', toString);
  setProperty(Sugar, 'className', className);
  setProperty(Sugar, 'setProperty', setProperty);
  setProperty(Sugar, 'defineProperty', defineProperty);
  setProperty(Sugar, 'createNamespace', createNamespace);
  setProperty(Sugar, 'iterateOverObject', iterateOverObject);
  setProperty(Sugar, 'wrapInstanceMethod', wrapInstanceMethod);
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
    setMethodOnChainable(sugarNamespace, methodName, method.instance);
  }
}


// Chainables

function getNewChainableClass(name) {
  var fn = SugarChainable = function (obj) {
    if (!(this instanceof fn)) {
      return new fn(obj);
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

function setMethodOnChainable(sugarNamespace, methodName, fn) {
  var wrapped = wrapWithChainableResult(fn), existing, collision, dcp;
  dcp = DefaultChainable.prototype;
  existing = dcp[methodName];

  // If the method was previously defined on the default chainable, then a
  // collision exists, so set the method to a disambiguation function that
  // will lazily evaluate the object and find it's associated chainable.
  collision = existing && existing !== Object.prototype[methodName];
  dcp[methodName] = collision ? disambiguateMethod(methodName) : wrapped;

  // The non-default chainable will always receive the wrapped method.
  sugarNamespace.prototype[methodName] = wrapped;
}

function wrapWithChainableResult(fn) {
  return function() {
    return new DefaultChainable(fn.apply(this.raw, arguments));
  };
}

function disambiguateMethod(methodName) {
  return function() {
    var raw = this.raw, sugarNamespace;
    if (raw != null) {
      sugarNamespace = namespacesByClassName[className(raw)];
    }
    if (!sugarNamespace) {
      throw new Error('Cannot determine namespace for ' + raw);
    }
    return new sugarNamespace(raw)[methodName].apply(this, arguments);
  };
}

function mapNativeToChainable(name, methodNames) {
  var sugarNamespace = namespacesByName[name],
      nativeProto = globalContext[name].prototype;

  if (!methodNames && ownPropertyNames) {
    methodNames = ownPropertyNames(nativeProto);
  }

  iterateOverObject(methodNames, function(i, methodName) {
    if (methodName === 'valueOf' || methodName === 'constructor') {
      // Both "valueOf" and "constructor" have their own definitions
      // for chainables, so do not forward those methods here.
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
    setMethodOnChainable(sugarNamespace, methodName, fn);
  });
}


// Util

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
