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
  var globalContext = typeof global !== 'undefined' ? global : this;

  // No conflict mode
  var noConflict = true;

  // Internal hasOwnProperty
  var internalHasOwnProperty = object.prototype.hasOwnProperty;

  // defineProperty exists in IE8 but will error when trying to define a property on
  // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
  var definePropertySupport = object.defineProperty && object.defineProperties;

  // Natives by name.
  var natives = 'Boolean,Number,String,Array,Date,RegExp,Function'.split(',');

  // Proxy objects by class.
  var proxies = {};

  function initializeGlobal() {
    extend(Sugar, {
      'noConflict': noConflict,
      'extend': extend,
      'revert': revert,
      'restore': restore,
      'iterate': iterateOverObject,
      'define': defineProperty,
      'global': globalContext,
      'natives': natives,
      'has': hasOwnProperty
    }, false);
    globalContext['Sugar'] = Sugar;
  }

  function initializeNatives() {
    iterateOverObject(natives.concat('Object'), function(i, name) {
      proxies[globalContext[name]] = name;
      Sugar[name] = {};
    });
  }

  // Class extending methods

  function extend(klass, methods, instance, polyfill, override) {
    var extendee;
    instance = instance !== false;
    extendee = instance ? klass.prototype : klass;
    iterateOverObject(methods, function(name, prop) {
      var original = extendee[name],
          existed  = name in extendee;
      if(typeof polyfill === 'function' && original) {
        prop = wrapNative(original, prop, polyfill);
      }
      defineProxy(klass, name, instance, original, prop, existed);
      if(canDefineOnNative(klass, polyfill, original, override)) {
        defineProperty(extendee, name, prop);
      }
    });
  }

  function alias(klass, target, source) {
    var method = getProxy(klass)[source];
    var obj = {};
    obj[target] = method['method'];
    extend(klass, obj, method['instance']);
  }

  function restore(klass, methods) {
    return batchMethodExecute(klass, methods, function(target, name, m) {
      defineProperty(target, name, m.method);
    });
  }

  function revert(klass, methods) {
    return batchMethodExecute(klass, methods, function(target, name, m) {
      if(m['existed']) {
        defineProperty(target, name, m['original']);
      } else {
        delete target[name];
      }
    });
  }

  function batchMethodExecute(klass, methods, fn) {
    var all = !methods, changed = false;
    if(typeof methods === 'string') methods = [methods];
    iterateOverObject(getProxy(klass), function(name, m) {
      if(all || methods.indexOf(name) !== -1) {
        changed = true;
        fn(m['instance'] ? klass.prototype : klass, name, m);
      }
    });
    return changed;
  }

  function canDefineOnNative(klass, polyfill, original, override) {
    if(override) {
      return true;
    } else if(polyfill === true) {
      return !original;
    }
    return !noConflict || !proxies[klass];
  }

  function wrapNative(originalFn, extendedFn, condition) {
    return function(a) {
      return condition.apply(this, arguments) ?
             extendedFn.apply(this, arguments) :
             originalFn.apply(this, arguments);
    }
  }

  function wrapNoConflict(fn) {
    return function(native) {
      var args = Array.prototype.slice.call(arguments, 1);
      return fn.apply(native, args);
    };
  }

  function defineProxy(klass, name, instance, original, prop, existed) {
    var proxy = proxies[klass], meta, prop;
    if(!proxy || (klass === object && instance)) return;
    prop = instance ? wrapNoConflict(prop) : prop;
    defineProperty(getProxy(klass), name, prop, true);
    if(typeof prop === 'function') {
      defineProperty(prop, 'original', original);
      defineProperty(prop, 'method', prop);
      defineProperty(prop, 'existed', existed);
      defineProperty(prop, 'instance', instance);
    }
  }

  function getProxy(klass) {
    return Sugar[proxies[klass]];
  }

  function defineProperty(target, name, method, enumerable) {
    if(definePropertySupport) {
      object.defineProperty(target, name, {
        'value': method,
        'enumerable': !!enumerable,
        'configurable': true,
        'writable': true
      });
    } else {
      target[name] = method;
    }
  }

  function iterateOverObject(obj, fn) {
    var key;
    for(key in obj) {
      if(!hasOwnProperty(obj, key)) continue;
      if(fn.call(obj, key, obj[key], obj) === false) break;
    }
  }

  function hasOwnProperty(obj, prop) {
    return !!obj && internalHasOwnProperty.call(obj, prop);
  }

  initializeGlobal();
  initializeNatives();

