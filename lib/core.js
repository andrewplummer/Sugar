  'use strict';

  /***
   * @package Core
   * @description Core package allows custom methods to be defined on the Sugar global and extended onto natives later.
   ***/

  // The global to export.
  var Sugar;

  // Natives by name.
  var NATIVES = 'Boolean,Number,String,Array,Date,RegExp,Function'.split(',');

  // Natives including Object
  var NATIVES_WITH_OBJECT = NATIVES.concat('Object');

  // Property descriptors exist in IE8 but will error when trying to define a property on native objects.
  // IE8 does not have defineProperies, however, so this check saves a try/catch block.
  var PROPERTY_DESCRIPTOR_SUPPORT = !!(Object.defineProperty && Object.defineProperties);

  // Basic defineProperty with shim
  var defineProperty = PROPERTY_DESCRIPTOR_SUPPORT ? Object.defineProperty : definePropertyShim;
 
  // The global context. Rhino shadows "global" with it's own keyword so do an extra check to be sure
  // that it's actually the global context.
  var globalContext = typeof global !== 'undefined' && global.Object ? global : this;

  // Is the environment node?
  var hasExports = typeof module !== 'undefined' && module.exports;

  // Internal hasOwnProperty
  var internalHasOwnProperty = Object.prototype.hasOwnProperty;

  // Whether object instance methods can be mapped to the prototype.
  var allowObjectInstance = false;


  function setupGlobal() {
    Sugar = function(arg) {
      for (var i = 0; i < NATIVES_WITH_OBJECT.length; i++) {
        Sugar[NATIVES_WITH_OBJECT[i]].extend(arg);
      }
      // return self
      return Sugar;
    };
    // There are 2 identical methods for extending with Sugar:
    // 1. Sugar.extendAll();
    // 2. require('sugar')();
    // The "extend" method is more explicit and preferred, but the
    // namespace itself is also available for cleaner npm modules.
    setProperty(Sugar, 'extendAll', Sugar);
    iterateOverObject(NATIVES_WITH_OBJECT, setupNamespace);
    if (hasExports) {
      module.exports = Sugar;
    } else {
      globalContext['Sugar'] = Sugar;
    }
  }

  function setupNamespace(i, name) {
    var nativeClass = globalContext[name], isObject = nativeClass === Object, namespace;

    namespace = function(arg) {
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
        return (!isObject || allowObjectInstance) && !disallowedByFlags(method.flags);
      }

      if (typeof arg === 'string') {
        methodsByName = [arg];
      } else if (arg && arg.length) {
        methodsByName = arg;
      } else if (arg) {
        opts = arg;
        methodsByName = opts.methods;
        if (isObject && typeof opts.objectInstance === 'boolean') {
          // Store "objectInstance" flag for future reference.
          allowObjectInstance = opts.objectInstance;
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
        if (hasOwnProperty(method, 'instance') && canExtendPrototype(method)) {
          instanceMethods[methodName] = method.instance;
        }
        if(hasOwnProperty(method, 'static')) {
          staticMethods[methodName] = method;
        }
      });
      extendNative(nativeClass, staticMethods);
      extendNative(nativeClass.prototype, instanceMethods);
      if (!methodsByName) {
        // If there are no method names passed, then
        // all methods in the namespace will be extended
        // to the native. This includes all future defined
        // methods, so add a flag here to check later.
        setProperty(namespace, 'active', true);
      }
      // return self
      return namespace;
    }

    // Extending by namespace:
    // 1. Sugar.Array.extend();
    // 2. require('sugar-array')();
    Sugar[name] = namespace;
    setProperty(namespace, 'extend', namespace);

    setProperty(namespace, 'defineStatic', function(methods) {
      defineMethods(namespace, methods);
    });

    setProperty(namespace, 'defineStaticWithArguments', function(methods) {
      defineMethods(namespace, methods, false, true);
    });

    setProperty(namespace, 'defineInstance', function(methods) {
      defineMethods(namespace, methods, true);
    });

    setProperty(namespace, 'defineInstanceWithArguments', function(methods) {
      defineMethods(namespace, methods, true, true);
    });

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

  function setProperty(target, name, value, enumerable) {
    defineProperty(target, name, {
      value: value,
      enumerable: !!enumerable,
      configurable: true,
      writable: true
    });
  }

  function definePropertyShim(obj, prop, descriptor) {
    obj[prop] = descriptor.value;
  }


  // Defining Methods

  // Identical to exported methods on the Sugar global but a
  // bit simplified and saves a few bytes in the minified script.

  function defineStatic(sugarNamespace, methods) {
    defineMethods(sugarNamespace, methods);
  }

  function defineStaticWithArguments(sugarNamespace, methods) {
    defineMethods(sugarNamespace, methods, false, true);
  }

  function defineInstance(sugarNamespace, methods, flags) {
    defineMethods(sugarNamespace, methods, true, false, flags);
  }

  function defineInstanceWithArguments(sugarNamespace, methods, flags) {
    defineMethods(sugarNamespace, methods, true, true, flags);
  }

  function alias(namespace, toName, fromName) {
    setProperty(namespace, toName, namespace[fromName], true);
  }

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
      if (instance && !method.instance) {
        if (args) {
          instanceMethod = wrapMethodWithArguments(method, true);
        } else {
          instanceMethod = wrapInstanceMethodFixed(method);
        }
        setProperty(staticMethod, 'instance', instanceMethod);
      } else {
        setProperty(staticMethod, 'static', true);
      }
      if (sugarNamespace.active) {
        // If the namespace has been activated (all methods mapped)
        // then map this method as well.
        sugarNamespace(methodName);
      }
    });
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
    }
  }

  function wrapInstanceMethodFixed(fn) {
    switch(fn.length) {
      // case 0:
      // Wrapped instance methods will always be passed the instance
      // as the first argument, but requiring the argument to be defined
      // may cause confusion here, so return the same wrapped function regardless.
      case 0:
      case 1:
        return function() {
          return fn(this);
        }
      case 2:
        return function(a) {
          return fn(this, a);
        }
      case 3:
        return function(a, b) {
          return fn(this, a, b);
        }
      case 4:
        return function(a, b, c) {
          return fn(this, a, b, c);
        }
      case 5:
        return function(a, b, c, d) {
          return fn(this, a, b, c, d);
        }
    }
  }


  // Polyfills are directly mapped to the prototype.

  function defineStaticPolyfill(globalNamespace, methods) {
    extendNative(globalNamespace, methods, true);
  }

  function defineInstancePolyfill(globalNamespace, methods, override) {
    extendNative(globalNamespace.prototype, methods, true, override);
  }

  // Properties are simply set on the Sugar namespace
  // and do not get extended across.

  function defineStaticProperties(sugarNamespace, props) {
    iterateOverObject(props, function(name, prop) {
      setProperty(sugarNamespace, name, prop, true);
    });
  }


  // Util

  function iterateOverObject(obj, fn) {
    for(var key in obj) {
      if (!hasOwnProperty(obj, key)) continue;
      if (fn.call(obj, key, obj[key], obj) === false) break;
    }
  }

  function hasOwnProperty(obj, prop) {
    return !!obj && internalHasOwnProperty.call(obj, prop);
  }

  setupGlobal();
