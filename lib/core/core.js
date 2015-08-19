  'use strict';

  /***
   * @package Core
   * @description Core method extension and restoration.
   ***/

  // The global to export.
  var Sugar = {};

  // An optimization for GCC.
  var object = Object;

  // The global context
  var globalContext = typeof global !== 'undefined' ? global : window;

  // Is the environment node?
  var hasExports = typeof module !== 'undefined' && module.exports;

  // No conflict mode
  // var noConflict = hasExports && typeof process !== 'undefined' ? process.env['SUGAR_NO_CONFLICT'] : false;

  // Internal hasOwnProperty
  var internalHasOwnProperty = object.prototype.hasOwnProperty;

  // Property descriptors exist in IE8 but will error when trying to define a property on
  // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
  var propertyDescriptorSupport = !!(object.defineProperty && object.defineProperties);

  // Natives by name.
  var natives = 'Boolean,Number,String,Array,Date,RegExp,Function'.split(',');

  // Proxy objects by class.
  var sugarNamespacesByClass = {};

  function initializeGlobal() {
    Sugar = {
      /***
       * @method Sugar.extend(<target>, <methods>, [instance] = true)
       * @short This method exposes Sugar's core ability to extend Javascript natives, and is useful for creating custom plugins.
       * @extra <target> should be the Javascript native function such as %String%, %Number%, etc. <methods> is an object containing the methods to extend. When [instance] is true the methods will be mapped to <target>'s prototype, if false they will be mapped onto <target> itself. For more see %global%.
       ***/
      //'extend': extend,

      /***
       * @method Sugar.restore(<target>, ...)
       * @short Restores Sugar methods that may have been overwritten by other scripts.
       * @extra <target> should be the Javascript native function such as %String%, %Number%, etc. Arguments after this may be an enumerated list of method names to restore or can be omitted to restore all.
       ***/
      //'restore': restore,

      /***
       * @method Sugar.revert(<target>, ...)
       * @short Reverts Sugar methods to what the were before they were added.
       * @extra This method can be useful if Sugar methods are causing conflicts with other scripts. <target> should be the Javascript native function such as %String%, %Number%, etc. Arguments after this may be an enumerated list of method names to revert or can be omitted to revert all.
       * @short Reverts stuff.
       ***/
      //'revert': revert,

      //'noConflict': noConflict
    };
    if (hasExports) {
      module.exports = Sugar;
    } else {
      globalContext.Sugar = Sugar;
    }
  }

  function initializeNatives() {
    iterateOverObject(natives.concat('Object'), function(i, name) {
      //sugarNamespacesByClass[globalContext[className]] = className;
      var ns = function extend(obj) {
        namespaceExtend(name, obj);
      }
      Sugar[name] = ns;
      setProperty(ns, 'extend', ns);
    });
  }

  function extend2(globalNamespace, name, method, instance) {
    setProperty(instance ? globalNamesapce.prototype : globalNamesapce, name, method);
  }


  function extend3(globalNamespace, source, instance, polyfill) {
    iterateOverObject(source, function(name, method) {
      var extendee = instance || method.instance ? globalNamespace.prototype : globalNamespace;
      if (polyfill && extendee[name]) {
        // Bail
        return;
      }
      if (method.instance) {
        method = method.instance;
      }
      setProperty(extendee, name, method);
    });
  }


  // Class extending methods

  function namespaceExtend(name, methods) {
    var sugarNamespace = Sugar[name], source;
    if (methods) {
      iterateOverObject(source, function(name, method) {
        if (typeof method === 'string') {
          methods[name] = sugarNamespace[name];
        }
      });
    }
    extend3(globalContext[name], methods || sugarNamespace);
  }

  function defineStatic(sugarNamespace, methods) {
    defineMethods(sugarNamespace, methods);
  }

  function defineInstance(sugarNamespace, methods) {
    defineMethods(sugarNamespace, methods, true);
  }

  function defineInstanceWithArguments(sugarNamespace, methods) {
    defineMethods(sugarNamespace, methods, true, true);
  }

  function defineStaticPolyfill(globalNamespace, methods) {
    extend3(globalNamespace, methods, false, true);
  }

  function defineInstancePolyfill(globalNamespace, methods) {
    extend3(globalNamespace, methods, true, true);
  }

  function defineMethods(sugarNamespace, methods, instance, args) {
    iterateOverObject(methods, function(name, method) {
      var staticMethod, instanceMethod;
      if (args) {
        staticMethod = wrapStaticMethodWithArguments(method);
      } else {
        staticMethod = method;
      }
      setProperty(sugarNamespace, name, staticMethod, true);
      if (instance) {
        if (args) {
          instanceMethod = wrapInstanceMethodWithArguments(method);
        } else {
          instanceMethod = wrapInstanceMethodFixed(method);
        }
        setProperty(method, 'instance', instanceMethod);
      }
    });
  }

  function wrapInstanceMethodWithArguments(fn) {
    return function withArgs() {
      var applyArgs = [this], args = [];
      // Optimized: no leaking arguments
      for (var i = 0; i < arguments.length; i++) {
        // Unwrapped function will have minimum 2 arguments, the instance and
        // "args", so if there are any left over, apply them to the function
        // itself and collect whatever's left.
        if (i <= fn.length - 2) {
          applyArgs.push(arguments[i]);
        } else {
          args.push(arguments[i]);
        }
      }
      applyArgs.push(args);
      return fn.apply(null, applyArgs);
    }
  }

  function wrapStaticMethodWithArguments(fn) {
    return function withArgs(instance) {
      var applyArgs = [instance], args = [];
      // Optimized: no leaking arguments
      for (var i = 1; i < arguments.length; i++) {
        // Unwrapped function will have minimum 2 arguments, the instance and
        // "args", so start with the 2nd argument, push to the main function
        // if it has defined args, and collect whatever's left.
        if (i <= fn.length - 2) {
          applyArgs.push(arguments[i]);
        } else {
          args.push(arguments[i]);
        }
      }
      applyArgs.push(args);
      return fn.apply(null, applyArgs);
    }
  }

  function wrapInstanceMethodFixed(fn) {
    switch(fn.length) {
      case 0:
        return function wrap() {
          return fn(this);
        }
      case 1:
        return function wrap(a){
          return fn(this, a);
        }
      case 2:
        return function wrap(a, b) {
          return fn(this, a, b);
        }
      case 3:
        return function wrap(a, b, c) {
          return fn(this, a, b, c);
        }
    }
  }

  function extend(klass, methods, instance, polyfill, override) {
    var extendee;
    instance = instance !== false;
    extendee = instance ? klass.prototype : klass;
    iterateOverObject(methods, function(name, prop) {
      var existing = checkGlobal('fn', klass, name, extendee),
          original = checkGlobal('original', klass, name, extendee),
          existed  = name in extendee;
      defineMethodOnNamespace(klass, name, instance, original, prop, existed, polyfill);
      if (canDefineOnNative(klass, polyfill, existing, override)) {
        setProperty(extendee, name, prop);
      }
    });
  }

  function alias(namespace, toName, fromName) {
    //var method = getSugarNamespace(klass)[source];
    //var obj = {};
    //obj[target] = method.fn;
    //extend(klass, obj, method.instance);
//
    setProperty(namespace, toName, namespace[fromName], true);

  }

  /*
  function restore(klass, methods) {
    if (noConflict) return;
    return batchMethodExecute(klass, methods, function(target, name, m) {
      setProperty(target, name, m.fn);
    });
  }

  function revert(klass, methods) {
    return batchMethodExecute(klass, methods, function(target, name, m) {
      if (m.existed) {
        setProperty(target, name, m.original);
      } else {
        delete target[name];
      }
    });
  }
 */

  function batchMethodExecute(klass, methods, fn) {
    var all = !methods, changed = false;
    if (typeof methods === 'string') methods = [methods];
    iterateOverObject(getSugarNamespace(klass), function(name, m) {
      if (all || methods.indexOf(name) !== -1) {
        changed = true;
        fn(m.instance ? klass.prototype : klass, name, m);
      }
    });
    return changed;
  }

  function checkGlobal(type, klass, name, extendee) {
    var proxy = getSugarNamespace(klass), methodExists;
    methodExists = proxy && hasOwnProperty(proxy, name) && !proxy[name].polyfill;
    if (methodExists) {
      return proxy[name][type];
    } else {
      return extendee[name];
    }
  }

  function canDefineOnNative(klass, polyfill, existing, override) {
    if (override) {
      return true;
    } else if (polyfill === true) {
      return !existing;
    }
    return !noConflict || !proxies[klass];
  }

  function defineMethodOnNamespace(klass, name, instance, original, prop, existed, polyfill, existing) {
    var proxy = getSugarNamespace(klass), result;
    if (!proxy) return;
    result = instance ? wrapInstanceMethod(prop, klass, name) : prop;
    if (result) {
      setProperty(proxy, name, result, true);
      //if (typeof prop === 'function') {
        //setProperty(result, 'unwrapped', prop);
        //setProperty(result, 'original', original);
        //setProperty(result, 'existed', existed);
        //setProperty(result, 'existing', existing);
        //setProperty(result, 'instance', instance);
        //setProperty(result, 'polyfill', polyfill);
      //}
    }

  }

  function getSugarNamespace(klass) {
    return Sugar[proxies[klass]];
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

  function iterateOverObject(obj, fn) {
    var key;
    for(key in obj) {
      if (!hasOwnProperty(obj, key)) continue;
      if (fn.call(obj, key, obj[key], obj) === false) break;
    }
  }

  function hasOwnProperty(obj, prop) {
    return !!obj && internalHasOwnProperty.call(obj, prop);
  }

  initializeGlobal();
  initializeNatives();

