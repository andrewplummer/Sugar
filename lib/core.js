  'use strict';

  /***
   * @package Core
   * @description Core method extension and restoration.
   ***/

  // The global to export.
  var Sugar;

  // An optimization for GCC.
  var object = Object;

  // The global context
  var globalContext = typeof global !== 'undefined' ? global : window;

  // Internal hasOwnProperty
  var internalHasOwnProperty = object.prototype.hasOwnProperty;

  // Property descriptors exist in IE8 but will error when trying to define a property on
  // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
  var propertyDescriptorSupport = !!(object.defineProperty && object.defineProperties);

  // Natives by name.
  var natives = 'Boolean,Number,String,Array,Date,RegExp,Function,Object'.split(',');

  // Whether object instance methods can be mapped to the prototype.
  var allowObjectInstance = false;

  function setupGlobal() {
    Sugar = function extend() {
      for (var i = 0; i < natives.length; i++) {
        Sugar[natives[i]].extend();
      }
      // return self
      return Sugar;
    };
    // There are 2 identical methods for extending with Sugar:
    // 1. Sugar.extend();
    // 2. require('sugar')();
    // The "extend" method is more explicit and preferred, but the
    // namespace itself is also available for cleaner npm modules.
    setProperty(Sugar, 'extend', Sugar);
    iterateOverObject(natives, setupNamespace);
    globalContext.Sugar = Sugar; // npm ignore
  }

  function setupNamespace(i, namespace) {
    var nativeClass = globalContext[namespace],
        isObject = nativeClass === object;

    // Namespace method, i.e. Sugar.Array() or Sugar.Array.extend()
    function extend(arg1, arg2) {
      var staticMethods = {}, instanceMethods = {}, methodsByName, flag;

      function canExtendPrototype() {
        return !isObject || allowObjectInstance;
      }

      if (arg1 && typeof arg1 !== 'boolean') {
        methodsByName = typeof arg1 === 'string' ? [arg1] : arg1;
        flag = arg2;
      } else {
        flag = arg1;
      }

      if (isObject && typeof flag === 'boolean') {
        // If a boolean flag was passed as the last argument,
        // Object.prototype will also be extended when applicable.
        allowObjectInstance = flag;
      }

      iterateOverObject(methodsByName || Sugar[namespace], function(methodName, method) {
        if (methodsByName) {
          // If we have method names passed in an array,
          // then we need to flip the key and value here
          // and find the method in the Sugar namespace.
          methodName = method;
          method = Sugar[namespace][methodName];
        }
        if (hasOwnProperty(method, 'instance') && canExtendPrototype()) {
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
        // all methods in then namespace will be extended
        // to the native. This includes all future defined
        // methods, so add a flag here to check later.
        setProperty(extend, 'active', true);
      }
      // return self
      return extend;
    }

    // Extending by namespace:
    // 1. Sugar.Array.extend();
    // 2. require('sugar-array')();
    Sugar[namespace] = extend;
    setProperty(extend, 'extend', extend);

    setProperty(extend, 'defineStatic', function(methods) {
      defineMethods(extend, methods);
    });

    setProperty(extend, 'defineStaticWithArguments', function(methods) {
      defineMethods(extend, methods, false, true);
    });

    setProperty(extend, 'defineInstance', function(methods) {
      defineMethods(extend, methods, true);
    });

    setProperty(extend, 'defineInstanceWithArguments', function(methods) {
      defineMethods(extend, methods, true, true);
    });

  }

  function extendNative(extendee, source, polyfill) {
    iterateOverObject(source, function(name, method) {
      if (polyfill && extendee[name]) {
        // Polyfill exists, so bail.
        return;
      }
      setProperty(extendee, name, method);
    });
  }

  function setProperty(target, name, property, enumerable) {
    if (propertyDescriptorSupport) {
      object.defineProperty(target, name, {
        value: property,
        enumerable: !!enumerable,
        configurable: true,
        writable: true
      });
    } else {
      target[name] = property;
    }
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

  function defineInstance(sugarNamespace, methods) {
    defineMethods(sugarNamespace, methods, true);
  }

  function defineInstanceWithArguments(sugarNamespace, methods) {
    defineMethods(sugarNamespace, methods, true, true);
  }

  function alias(namespace, toName, fromName) {
    setProperty(namespace, toName, namespace[fromName], true);
  }

  function defineMethods(sugarNamespace, methods, instance, args) {
    iterateOverObject(methods, function(methodName, method) {
      var instanceMethod, staticMethod = method;
      if (args) {
        staticMethod = wrapMethodWithArguments(method);
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
    return function withArgs() {
      var args = [], collectedArgs = [];
      if (instance) {
        args.push(this);
      }
      // Optimized: no leaking arguments
      for (var i = 0; i < arguments.length; i++) {
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
        return function wrap() {
          return fn(this);
        }
      case 2:
        return function wrap(a) {
          return fn(this, a);
        }
      case 3:
        return function wrap(a, b) {
          return fn(this, a, b);
        }
      case 4:
        return function wrap(a, b, c) {
          return fn(this, a, b, c);
        }
      case 5:
        return function wrap(a, b, c, d) {
          return fn(this, a, b, c, d);
        }
    }
  }


  // Polyfills are directly mapped to the prototype.

  function defineStaticPolyfill(globalNamespace, methods) {
    extendNative(globalNamespace, methods, true);
  }

  function defineInstancePolyfill(globalNamespace, methods) {
    extendNative(globalNamespace.prototype, methods, true);
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
