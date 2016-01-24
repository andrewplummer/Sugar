'use strict';

/***
 * @module Core
 * @description Core module allows custom methods to be defined on the Sugar global and extended onto natives later.
 ***/

// The global to export.
var Sugar;

// The name of Sugar in the global namespace.
var SUGAR_GLOBAL = 'Sugar';

// Natives by name.
var NATIVES = ['Number','String','Array','Date','RegExp','Function','Object'];

// defineProperty exists in IE8 but errors when defining a property on native
// objects. IE8 does not have defineProperies, so this check saves a try/catch.
var PROPERTY_DESCRIPTOR_SUPPORT = !!(Object.defineProperty && Object.defineProperties);

// Static method flag
var STATIC   = 0x1;

// Instance method flag
var INSTANCE = 0x2;

// defineProperty with a simple shim
var defineProperty = PROPERTY_DESCRIPTOR_SUPPORT ?  Object.defineProperty : definePropertyShim;

// The global context. Rhino shadows "global" with it's own keyword so
// do an extra check to be sure that it's actually the global context.
var globalContext = typeof global !== 'undefined' && global.Object ? global : this;

// Is the environment node?
var hasExports = typeof module !== 'undefined' && module.exports;

// Internal toString
var internalToString = Object.prototype.toString;

// Internal hasOwnProperty
var internalHasOwnProperty = Object.prototype.hasOwnProperty;

// Whether object instance methods can be mapped to the prototype.
var allowObjectPrototype = false;

// A map from  [object Object] to Object
var classShortNameMap = {};

// A chainable object. The silly song and dance on the line below this and in
// getNewChainableClass is simply to force GCC to respect this token on output.
var SugarChainable;

// A chainable object for unknown types.
var UnknownChainable = SugarChainable;

function setupGlobal() {
  var existingSugar = globalContext[SUGAR_GLOBAL];
  // Re-use already defined Sugar global object
  // but only if not using exports!
  if (!hasExports && existingSugar) {
    Sugar = existingSugar;
    return;
  }
  Sugar = function(arg) {
    iterateOverObject(Sugar, function(name) {
      Sugar[name].extend(arg);
    });
  };

  // There are 2 identical methods for extending with Sugar:
  // 1. Sugar.extend();
  // 2. require('sugar')();
  // The "extend" method is more explicit and preferred, but the
  // namespace itself is also available for cleaner npm modules.
  setProperty(Sugar, 'extend', Sugar);
  iterateOverObject(NATIVES, function(i, name) {
    createNamespace(name, name === 'Object');
  });
  if (hasExports) {
    module.exports = Sugar;
  } else {
    globalContext[SUGAR_GLOBAL] = Sugar;
  }
  UnknownChainable = getNewChainableClass('SugarChainable');
  setGlobalProperties();
}

/***
 * @method createNamespace(<name>)
 * @returns Self
 * @short Creates a new namespace.
 * @extra This method is for plugin developers who want to define methods to be
 *        used with natives that Sugar does not handle by default, for example
 *        Set, WeakArray, etc. <name> will appear on the `Sugar` global with all
 *        the methods of normal namespaces, as well as the ability to define new
 *        methods. The global method `Sugar.extend()` will allow extension of
 *        methods in the new namespace as well.
 ***/
function createNamespace(name, isObject) {
  var namespace, extend;

  namespace = getNewChainableClass(SUGAR_GLOBAL + name);

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
  extend = function (arg) {
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

    iterateOverObject(methodsByName || namespace, function(methodName, method) {
      if (methodsByName) {
        // If we have method names passed in an array,
        // then we need to flip the key and value here
        // and find the method in the Sugar namespace.
        methodName = method;
        method = namespace[methodName];
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
      setProperty(namespace, 'active', true);
    }
    // return self
    return namespace;
  };

  function defineWithOptionCollect(methodName, instance, args) {
    setProperty(namespace, methodName, function(arg1, arg2, arg3) {
      var opts = collectDefineOptions(arg1, arg2, arg3);
      defineMethods(namespace, opts.methods, instance, args, opts.last);
      return namespace;
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
  setProperty(namespace, 'alias', function(name, source) {
    var method = typeof source === 'string' ? namespace[source] : source;
    setMethod(namespace, name, method);
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
  setProperty(namespace, 'defineStaticPolyfill', function(arg1, arg2, arg3) {
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
  setProperty(namespace, 'defineInstancePolyfill', function(arg1, arg2, arg3) {
    var opts = collectDefineOptions(arg1, arg2, arg3);
    extendNative(globalContext[name].prototype, opts.methods, true, opts.last);
  });

  // The namespace is also the chainable class: Sugar.Array, etc.
  Sugar[name] = namespace;

  // Each namespace can extend only itself through its .extend method.
  setProperty(namespace, 'extend', extend);

  // Store the long class name for future use.
  classShortNameMap['[object ' + name + ']'] = name;

  return namespace;
}

function toString() {
  return SUGAR_GLOBAL;
}

function setGlobalProperties() {
  setProperty(Sugar, 'VERSION', 'edge');
  setProperty(Sugar, 'hasOwn', hasOwn);
  setProperty(Sugar, 'toString', toString);
  setProperty(Sugar, 'className', className);
  setProperty(Sugar, 'setProperty', setProperty);
  setProperty(Sugar, 'defineProperty', defineProperty);
  setProperty(Sugar, 'createNamespace', createNamespace);
  setProperty(Sugar, 'iterateOverObject', iterateOverObject);
  setProperty(Sugar, 'wrapInstanceMethod', wrapInstanceMethod);
}

function extendNative(extendee, source, polyfill, override) {
  iterateOverObject(source, function(name, method) {
    if (polyfill && !override && extendee[name]) {
      // Polyfill exists, so bail.
      return;
    }
    setProperty(extendee, name, method);
  });
}

function definePropertyShim(obj, prop, descriptor) {
  obj[prop] = descriptor.value;
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
      // If the namespace has been activated (all methods mapped)
      // then map this method as well.
      sugarNamespace.extend(methodName);
    }
  });
}

function setMethod(namespace, methodName, method) {
  namespace[methodName] = method;
  if (method.instance) {
    setMethodOnChainable(namespace, methodName, method.instance);
  }
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

// Chaining

function getNewChainableClass(className) {
  var fn = SugarChainable = function (obj) {
    if (!(this instanceof fn)) {
      return new fn(obj);
    }
    this.raw = obj;
  }
  setProperty(fn, 'toString', function() {
    return className;
  });
  setProperty(fn.prototype, 'toString', function() {
    return className + ': ' + this.raw;
  });
  setProperty(fn.prototype, 'valueOf', function() {
    return this.raw;
  });
  return fn;
}

function setMethodOnChainable(sugarNamespace, methodName, method) {
  var wrapped = wrapWithChainableResult(method), proto = UnknownChainable.prototype;
  sugarNamespace.prototype[methodName] = wrapped;
  proto[methodName] = proto[methodName] ? disambiguate(methodName) : wrapped;
}

function wrapWithChainableResult(method) {
  return function() {
    return new UnknownChainable(method.apply(this.raw, arguments));
  }
}

function disambiguate(methodName) {
  return function() {
    var raw = this.raw, ns;
    if (raw != null) {
      ns = Sugar[classShortNameMap[className(raw)]];
    }
    if (!ns) {
      throw new Error('Cannot determine namespace for ' + raw);
    }
    return new ns(raw)[methodName].apply(this, arguments);
  }
}

// Util

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

function className(obj) {
  return internalToString.call(obj);
}

function hasOwn(obj, prop) {
  return !!obj && internalHasOwnProperty.call(obj, prop);
}

setupGlobal();
