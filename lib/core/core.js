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

  function extend(klass, methods, instance, polyfill) {
    var extendee;
    instance = instance !== false;
    extendee = instance ? klass.prototype : klass;
    iterateOverObject(methods, function(name, extendedFn) {
      var nativeFn = extendee[name],
          existed  = name in extendee;
      if(typeof polyfill === 'function' && nativeFn) {
        extendedFn = wrapNative(nativeFn, extendedFn, polyfill);
      }
      defineProxy(klass, name, instance, nativeFn, extendedFn, existed);
      if(canDefineOnNative(klass, polyfill, nativeFn)) {
        defineProperty(extendee, name, extendedFn);
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

  function canDefineOnNative(klass, polyfill, nativeFn) {
    if(polyfill) {
      return !nativeFn;
    }
    return !noConflict || !proxies[klass];
  }

  function wrapNative(nativeFn, extendedFn, condition) {
    return function(a) {
      return condition.apply(this, arguments) ?
             extendedFn.apply(this, arguments) :
             nativeFn.apply(this, arguments);
    }
  }

  function wrapNoConflict(fn) {
    return function(native) {
      var args = Array.prototype.slice.call(arguments, 1);
      return fn.apply(native, args);
    };
  }

  function defineProxy(klass, name, instance, nativeFn, extendedFn, existed) {
    var proxy = proxies[klass], meta, fn;
    if(!proxy) return;
    fn = instance ? wrapNoConflict(extendedFn) : extendedFn;
    defineProperty(getProxy(klass), name, fn);
    defineProperty(fn, 'original', nativeFn);
    defineProperty(fn, 'method', extendedFn);
    defineProperty(fn, 'existed', existed);
    defineProperty(fn, 'instance', instance);
  }

  function getProxy(klass) {
    return Sugar[proxies[klass]];
  }

  function defineProperty(target, name, method) {
    if(definePropertySupport) {
      object.defineProperty(target, name, {
        'value': method,
        'configurable': true,
        'enumerable': false,
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

