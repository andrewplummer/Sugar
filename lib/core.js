'use strict';

/***
 * @package Core
 * @description Core package allows custom methods to be defined on the Sugar global and extended onto natives later.
 ***/

// The global to export.
var Sugar;

// The name of Sugar in the global namespace.
var SUGAR_GLOBAL = 'Sugar';

// Natives by name.
var NATIVES = ['Number','String','Array','Date','RegExp','Function','Object'];

// Property descriptors exist in IE8 but will error when trying to define a property on native objects.
// IE8 does not have defineProperies, however, so this check saves a try/catch block.
var PROPERTY_DESCRIPTOR_SUPPORT = !!(Object.defineProperty && Object.defineProperties);

// Static method flag
var STATIC   = 0x1;

// Instance method flag
var INSTANCE = 0x2;

// defineProperty with a simple shim
var defineProperty = PROPERTY_DESCRIPTOR_SUPPORT ? Object.defineProperty : definePropertyShim;

// The global context. Rhino shadows "global" with it's own keyword so do an extra check to be sure
// that it's actually the global context.
var globalContext = typeof global !== 'undefined' && global.Object ? global : this;

// Is the environment node?
var hasExports = typeof module !== 'undefined' && module.exports;

// Internal hasOwnProperty
var internalHasOwnProperty = Object.prototype.hasOwnProperty;

// Whether object instance methods can be mapped to the prototype.
var allowObjectPrototype = false;


function setupGlobal() {
  var existingSugar = globalContext[SUGAR_GLOBAL];
  if (existingSugar) {
    Sugar = existingSugar;
    return;
  }
  Sugar = function(arg) {
    for (var i = 0; i < NATIVES.length; i++) {
      Sugar[NATIVES[i]].extend(arg);
    }
  };

  // There are 2 identical methods for extending with Sugar:
  // 1. Sugar.extendAll();
  // 2. require('sugar')();
  // The "extend" method is more explicit and preferred, but the
  // namespace itself is also available for cleaner npm modules.
  setProperty(Sugar, 'extendAll', Sugar);
  iterateOverObject(NATIVES, function(i, name) {
    createNamespace(name, name === 'Object');
  });
  if (hasExports) {
    module.exports = Sugar;
  } else {
    globalContext[SUGAR_GLOBAL] = Sugar;
  }
  setGlobalProperties();
}

function createNamespace(name, isObject) {

  var toString = function() {
    // Print out something nicer than just a garbage function.
    return SUGAR_GLOBAL + name;
  }

  var namespace = function(arg) {
    var staticMethods = {}, instanceMethods = {}, opts = {}, methodsByName;

    function disallowedByFlags(flags) {
      if (!flags) return;
      for (var i = 0; i < flags.length; i++) {
        if (opts[flags[i]] === false) {
          return true;
        }
      }
    }

    function canExtendPrototype(method) {
      return (!isObject || allowObjectPrototype) && !disallowedByFlags(method.flags);
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
      if (hasOwn(method, 'instance') && canExtendPrototype(method)) {
        instanceMethods[methodName] = method.instance;
      }
      if(hasOwn(method, 'static')) {
        staticMethods[methodName] = method;
      }
    });
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
    });
  }

  // Extending by namespace:
  // 1. Sugar.Array.extend();
  // 2. require('sugar-array')();
  Sugar[name] = namespace;
  setProperty(namespace, 'extend', namespace);
  setProperty(namespace, 'toString', toString);

  defineWithOptionCollect('defineStatic', STATIC);
  defineWithOptionCollect('defineInstance', INSTANCE);
  defineWithOptionCollect('defineInstanceAndStatic', INSTANCE | STATIC);
  defineWithOptionCollect('defineStaticWithArguments', STATIC, true);
  defineWithOptionCollect('defineInstanceWithArguments', INSTANCE, true);

  setProperty(namespace, 'alias', function(name, source) {
    var method = typeof source === 'string' ? namespace[source] : source;
    setProperty(namespace, name, method, true);
  });

  setProperty(namespace, 'defineStaticPolyfill', function(arg1, arg2, arg3) {
    var opts = collectDefineOptions(arg1, arg2, arg3);
    extendNative(globalContext[name], opts.methods, true, opts.last);
  });

  setProperty(namespace, 'defineInstancePolyfill', function(arg1, arg2, arg3) {
    var opts = collectDefineOptions(arg1, arg2, arg3);
    extendNative(globalContext[name].prototype, collectDefineOptions(arg1, arg2).methods, true, opts.last);
  });

}

function toString() {
  return SUGAR_GLOBAL;
}

function setGlobalProperties() {
  setProperty(Sugar, 'version', 'VERSION');

  setProperty(Sugar, 'hasOwn', hasOwn);
  setProperty(Sugar, 'toString', toString);
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

function defineMethods(sugarNamespace, methods, instance, args, flags) {
  iterateOverObject(methods, function(methodName, method) {
    var instanceMethod, staticMethod = method;
    if (args) {
      staticMethod = wrapMethodWithArguments(method);
    }
    if (flags) {
      staticMethod.flags = flags;
    }
    setProperty(sugarNamespace, methodName, staticMethod, true);

    // A method may define its own custom implementation, so
    // make sure that's not the case before creating one.
    if (instance & INSTANCE && !method.instance) {
      instanceMethod = wrapInstanceMethod(method, args);
      setProperty(staticMethod, 'instance', instanceMethod);
    }

    if (instance & STATIC) {
      setProperty(staticMethod, 'static', true);
    }

    if (sugarNamespace.active) {
      // If the namespace has been activated (all methods mapped)
      // then map this method as well.
      sugarNamespace(methodName);
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

function hasOwn(obj, prop) {
  return !!obj && internalHasOwnProperty.call(obj, prop);
}

setupGlobal();
