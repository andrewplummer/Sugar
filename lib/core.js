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
var NATIVE_NAMES = 'Object Number String Array Date RegExp Function';

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

// A default chainable class for unknown types.
var DefaultChainable = getNewChainableClass('Chainable');


// Global methods

function setupGlobal() {
  Sugar = globalContext[SUGAR_GLOBAL];
  // istanbul ignore if
  if (Sugar) {
    // Reuse already defined Sugar global object.
    return;
  }
  Sugar = function(arg) {
    forEachProperty(Sugar, function(sugarNamespace, name) {
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
  // istanbul ignore else
  if (hasExports) {
    module.exports = Sugar;
  } else {
    try {
      globalContext[SUGAR_GLOBAL] = Sugar;
    } catch (e) {
      // Contexts such as QML have a read-only global context.
    }
  }
  forEachProperty(NATIVE_NAMES.split(' '), function(name) {
    createNamespace(name);
  });
  setGlobalProperties();
}

/***
 * @method createNamespace(name)
 * @returns SugarNamespace
 * @namespace Sugar
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
 * @param {string} name - The namespace name.
 *
 ***/
function createNamespace(name) {

  // Is the current namespace Object?
  var isObject = name === 'Object';

  // A Sugar namespace is also a chainable class: Sugar.Array, etc.
  var sugarNamespace = getNewChainableClass(name, true);

  /***
   * @method extend([opts])
   * @returns Sugar
   * @namespace Sugar
   * @short Extends Sugar defined methods onto natives.
   * @extra This method can be called on individual namespaces like
   *        `Sugar.Array` or on the `Sugar` global itself, in which case
   *        [opts] will be forwarded to each `extend` call. For more,
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
   * @option {Array<string>} [methods]
   * @option {Array<string|NativeConstructor>} [except]
   * @option {Array<NativeConstructor>} [namespaces]
   * @option {boolean} [enhance]
   * @option {boolean} [enhanceString]
   * @option {boolean} [enhanceArray]
   * @option {boolean} [objectPrototype]
   * @param {ExtendOptions} [opts]
   *
   ***
   * @method extend([opts])
   * @returns SugarNamespace
   * @namespace SugarNamespace
   * @short Extends Sugar defined methods for a specific namespace onto natives.
   * @param {ExtendOptions} [opts]
   *
   ***/
  var extend = function (opts) {

    var nativeClass = globalContext[name], nativeProto = nativeClass.prototype;
    var staticMethods = {}, instanceMethods = {}, methodsByName;

    function objectRestricted(name, target) {
      return isObject && target === nativeProto &&
             (!allowObjectPrototype || name === 'get' || name === 'set');
    }

    function arrayOptionExists(field, val) {
      var arr = opts[field];
      if (arr) {
        for (var i = 0, el; el = arr[i]; i++) {
          if (el === val) {
            return true;
          }
        }
      }
      return false;
    }

    function arrayOptionExcludes(field, val) {
      return opts[field] && !arrayOptionExists(field, val);
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
      return arrayOptionExists('except', nativeClass) ||
             arrayOptionExcludes('namespaces', nativeClass);
    }

    function methodIsExcepted(methodName) {
      return arrayOptionExists('except', methodName);
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

    forEachProperty(methodsByName || sugarNamespace, function(method, methodName) {
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
   * @method defineStatic(methods)
   * @returns SugarNamespace
   * @namespace SugarNamespace
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
   * @signature defineStatic(methodName, methodFn)
   * @param {Object} methods - Methods to be defined.
   * @param {string} methodName - Name of a single method to be defined.
   * @param {Function} methodFn - Function body of a single method to be defined.
   ***/
  defineWithOptionCollect('defineStatic', STATIC);

  /***
   * @method defineInstance(methods)
   * @returns SugarNamespace
   * @namespace SugarNamespace
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
   * @signature defineInstance(methodName, methodFn)
   * @param {Object} methods - Methods to be defined.
   * @param {string} methodName - Name of a single method to be defined.
   * @param {Function} methodFn - Function body of a single method to be defined.
   ***/
  defineWithOptionCollect('defineInstance', INSTANCE);

  /***
   * @method defineInstanceAndStatic(methods)
   * @returns SugarNamespace
   * @namespace SugarNamespace
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
   * @signature defineInstanceAndStatic(methodName, methodFn)
   * @param {Object} methods - Methods to be defined.
   * @param {string} methodName - Name of a single method to be defined.
   * @param {Function} methodFn - Function body of a single method to be defined.
   ***/
  defineWithOptionCollect('defineInstanceAndStatic', INSTANCE | STATIC);


  /***
   * @method defineStaticWithArguments(methods)
   * @returns SugarNamespace
   * @namespace SugarNamespace
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
   * @signature defineStaticWithArguments(methodName, methodFn)
   * @param {Object} methods - Methods to be defined.
   * @param {string} methodName - Name of a single method to be defined.
   * @param {Function} methodFn - Function body of a single method to be defined.
   ***/
  defineWithOptionCollect('defineStaticWithArguments', STATIC, true);

  /***
   * @method defineInstanceWithArguments(methods)
   * @returns SugarNamespace
   * @namespace SugarNamespace
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
   * @signature defineInstanceWithArguments(methodName, methodFn)
   * @param {Object} methods - Methods to be defined.
   * @param {string} methodName - Name of a single method to be defined.
   * @param {Function} methodFn - Function body of a single method to be defined.
   ***/
  defineWithOptionCollect('defineInstanceWithArguments', INSTANCE, true);

  /***
   * @method defineStaticPolyfill(methods)
   * @returns SugarNamespace
   * @namespace SugarNamespace
   * @short Defines static methods that are mapped onto the native if they do
   *        not already exist.
   * @extra Intended only for use creating polyfills that follow the ECMAScript
   *        spec. Accepts either a single object mapping names to functions, or
   *        name and function as two arguments. Note that polyfill methods will
   *        be immediately mapped onto their native prototype regardless of the
   *        use of `extend`.
   *
   * @example
   *
   *   Sugar.Object.defineStaticPolyfill({
   *     keys: function (obj) {
   *       // get keys!
   *     }
   *   });
   *
   * @signature defineStaticPolyfill(methodName, methodFn)
   * @param {Object} methods - Methods to be defined.
   * @param {string} methodName - Name of a single method to be defined.
   * @param {Function} methodFn - Function body of a single method to be defined.
   ***/
  setProperty(sugarNamespace, 'defineStaticPolyfill', function(arg1, arg2, arg3) {
    var opts = collectDefineOptions(arg1, arg2, arg3);
    extendNative(globalContext[name], opts.methods, true, opts.last);
    return sugarNamespace;
  });

  /***
   * @method defineInstancePolyfill(methods)
   * @returns SugarNamespace
   * @namespace SugarNamespace
   * @short Defines instance methods that are mapped onto the native prototype
   *        if they do not already exist.
   * @extra Intended only for use creating polyfills that follow the ECMAScript
   *        spec. Accepts either a single object mapping names to functions, or
   *        name and function as two arguments. This method differs from
   *        `defineInstance` as there is no static signature (as the method
   *        is mapped as-is to the native), so it should refer to its `this`
   *        object. Note that polyfill methods will be immediately mapped onto
   *        their native prototype regardless of the use of `extend`.
   *
   * @example
   *
   *   Sugar.Array.defineInstancePolyfill({
   *     indexOf: function (arr, el) {
   *       // index finding code here!
   *     }
   *   });
   *
   * @signature defineInstancePolyfill(methodName, methodFn)
   * @param {Object} methods - Methods to be defined.
   * @param {string} methodName - Name of a single method to be defined.
   * @param {Function} methodFn - Function body of a single method to be defined.
   ***/
  setProperty(sugarNamespace, 'defineInstancePolyfill', function(arg1, arg2, arg3) {
    var opts = collectDefineOptions(arg1, arg2, arg3);
    extendNative(globalContext[name].prototype, opts.methods, true, opts.last);
    // Map instance polyfills to chainable as well.
    forEachProperty(opts.methods, function(fn, methodName) {
      defineChainableMethod(sugarNamespace, methodName, fn);
    });
    return sugarNamespace;
  });

  /***
   * @method alias(toName, from)
   * @returns SugarNamespace
   * @namespace SugarNamespace
   * @short Aliases one Sugar method to another.
   *
   * @example
   *
   *   Sugar.Array.alias('all', 'every');
   *
   * @signature alias(toName, fn)
   * @param {string} toName - Name for new method.
   * @param {string|Function} from - Method to alias, or string shortcut.
   ***/
  setProperty(sugarNamespace, 'alias', function(name, source) {
    var method = typeof source === 'string' ? sugarNamespace[source] : source;
    setMethod(sugarNamespace, name, method);
    return sugarNamespace;
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
  setProperty(Sugar, 'VERSION', '{VERSION}');
  setProperty(Sugar, 'extend', Sugar);
  setProperty(Sugar, 'toString', toString);
  setProperty(Sugar, 'createNamespace', createNamespace);

  setProperty(Sugar, 'util', {
    'hasOwn': hasOwn,
    'getOwn': getOwn,
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
  forEachProperty(methods, function(method, methodName) {
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
  forEachProperty(source, function(method, name) {
    if (polyfill && !override && target[name]) {
      // Method exists, so bail.
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
  var fn = function SugarChainable(obj, arg) {
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
  forEachProperty(Sugar.Object && Sugar.Object.prototype, function(val, methodName) {
    if (typeof val === 'function') {
      setObjectChainableOnNamespace(sugarNamespace, methodName, val);
    }
  });
}

function mapObjectChainableToAllNamespaces(methodName, fn) {
  forEachProperty(namespacesByName, function(sugarNamespace) {
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
    var raw = this.raw, sugarNamespace;
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

    return new sugarNamespace(raw)[methodName].apply(this, arguments);
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

  forEachProperty(methodNames, function(methodName) {
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

// Defining this as a variable here as the ES5 module
// overwrites it to patch DONTENUM.
var forEachProperty = function (obj, fn) {
  for(var key in obj) {
    if (!hasOwn(obj, key)) continue;
    if (fn.call(obj, obj[key], key, obj) === false) break;
  }
};

// istanbul ignore next
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

function getOwn(obj, prop) {
  if (hasOwn(obj, prop)) {
    return obj[prop];
  }
}

setupGlobal();
