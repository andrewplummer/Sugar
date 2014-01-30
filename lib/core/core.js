  'use strict';

  /***
   * @package Core
   * @description Core method extension and restoration.
   ***/

  // The global to export.
  var Sugar = {};

  // A lookup of all methods mapped.
  var SugarMethods = {};

  // An optimization for GCC.
  var object = Object;

  // The global context
  var globalContext = typeof global !== 'undefined' ? global : this;

  // Internal hasOwnProperty
  var internalHasOwnProperty = object.prototype.hasOwnProperty;

  // defineProperty exists in IE8 but will error when trying to define a property on
  // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
  var definePropertySupport = object.defineProperty && object.defineProperties;

  function initializeGlobal() {
    extend(Sugar, {
      'extend': extend,
      'revert': revert,
      'restore': restore,
      'iterate': iterateOverObject,
      'define': defineProperty,
      'global': globalContext,
      'has': hasOwnProperty
    }, true, false);
    globalContext['Sugar'] = Sugar;
  }

  // Class extending methods

  function extend(klass, methods, override, instance) {
    var extendee;
    instance = instance !== false;
    extendee = instance ? klass.prototype : klass;
    iterateOverObject(methods, function(name, extendedFn) {
      var nativeFn = extendee[name],
          existed  = name in extendee;
      if(typeof override === 'function' && nativeFn) {
        extendedFn = wrapNative(nativeFn, extendedFn, override);
      }
      if(override !== false || !nativeFn) {
        defineProperty(extendee, name, extendedFn);
      }
      // Store a reference to the method so it can be restored later.
      if(!SugarMethods[klass]) SugarMethods[klass] = {};
      SugarMethods[klass][name] = {
        'method':   extendedFn,
        'existed':  existed,
        'original': nativeFn,
        'instance': instance
      };
    });
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
    iterateOverObject(SugarMethods[klass], function(name, m) {
      if(all || methods.indexOf(name) !== -1) {
        changed = true;
        fn(m['instance'] ? klass.prototype : klass, name, m);
      }
    });
    return changed;
  }

  function wrapNative(nativeFn, extendedFn, condition) {
    return function(a) {
      return condition.apply(this, arguments) ?
             extendedFn.apply(this, arguments) :
             nativeFn.apply(this, arguments);
    }
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

