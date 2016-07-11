  'use strict';

  /***
   * @module Core
   * @description Core method extension and restoration.
   ***/

  // The global context
  var globalContext = typeof global !== 'undefined' && global.Object ? global : this;

  // Internal hasOwnProperty
  var internalHasOwnProperty = Object.prototype.hasOwnProperty;

  // Property descriptors exist in IE8 but will error when trying to define a property on
  // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
  var propertyDescriptorSupport = !!(Object.defineProperty && Object.defineProperties);

  // Natives by name.
  var natives = 'Boolean,Number,String,Array,Date,RegExp,Function'.split(',');

  // A hash of all methods by Native class
  var SugarMethods = {};

  // Class extending methods

  function initializeClasses() {
    initializeClass(Object);
    iterateOverObject(natives, function(i, name) {
      initializeClass(globalContext[name]);
    });
  }

  function initializeClass(klass) {
    extend(klass, {
      'extend': function(methods, instance) {
        extend(klass, methods, instance !== false);
      },
      'sugarRestore': function(methods) {
        restore(klass, methods);
      },
      'sugarRevert': function(methods) {
        revert(klass, methods);
      }
    }, false);
  }

  function extend(klass, methods, instance, polyfill, override) {
    var extendee;
    instance = instance !== false;
    extendee = instance ? klass.prototype : klass;
    iterateOverObject(methods, function(name, prop) {
      var existing = extendee[name],
          original = checkOriginalMethod(klass, name);
      if (typeof polyfill === 'function' && existing) {
        prop = wrapExisting(existing, prop, polyfill);
      }
      storeMethod(klass, name, instance, existing, prop, polyfill);
      if (polyfill !== true || !existing) {
        setProperty(extendee, name, prop);
      }
    });
  }

  function alias(klass, target, source) {
    var method = SugarMethods[klass][source];
    var obj = {};
    obj[target] = method.fn;
    extend(klass, obj, method.instance);
  }

  function restore(klass, methods) {
    return batchMethodExecute(klass, methods, function(target, name, m) {
      setProperty(target, name, m.fn);
    });
  }

  function revert(klass, methods) {
    return batchMethodExecute(klass, methods, function(target, name, m) {
      var original = checkOriginalMethod(klass, name);
      if (m.original) {
        setProperty(target, name, m.original);
      } else {
        delete target[name];
      }
    });
  }

  function batchMethodExecute(klass, methods, fn) {
    var all = !methods, changed = false;
    if (typeof methods === 'string') methods = [methods];
    iterateOverObject(SugarMethods[klass], function(name, m) {
      if (all || methods.indexOf(name) !== -1) {
        changed = true;
        fn(m.instance ? klass.prototype : klass, name, m);
      }
    });
    return changed;
  }

  function checkOriginalMethod(klass, name) {
    var methods = SugarMethods[klass];
    var method = methods && methods[name];
    return method && method.original;
  }

  function wrapExisting(originalFn, extendedFn, condition) {
    return function(a) {
      return condition.apply(this, arguments) ?
             extendedFn.apply(this, arguments) :
             originalFn.apply(this, arguments);
    }
  }

  function wrapInstanceMethod(fn) {
    return function(obj) {
      var args = arguments, newArgs = [], i;
      for(i = 1;i < args.length;i++) {
        newArgs.push(args[i]);
      }
      return fn.apply(obj, newArgs);
    };
  }

  function storeMethod(klass, name, instance, existing, prop, polyfill) {
    var result = instance ? wrapInstanceMethod(prop) : prop;
    var methods = SugarMethods[klass];
    if (!methods) {
      methods = SugarMethods[klass] = {};
    }
    setProperty(methods, name, result, true);
    if (typeof prop === 'function') {
      setProperty(result, 'fn', prop);
      setProperty(result, 'original', existing);
      setProperty(result, 'instance', instance);
      setProperty(result, 'polyfill', polyfill);
    }
  }

  function setProperty(target, name, property, enumerable) {
    if (propertyDescriptorSupport) {
      Object.defineProperty(target, name, {
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

  initializeClasses();
