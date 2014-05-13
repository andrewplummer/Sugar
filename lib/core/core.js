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
  var noConflict = hasExports && typeof process !== 'undefined' ? process.env['SUGAR_NO_CONFLICT'] : false;

  // Internal hasOwnProperty
  var internalHasOwnProperty = object.prototype.hasOwnProperty;

  // Property descriptors exist in IE8 but will error when trying to define a property on
  // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
  var propertyDescriptorSupport = !!(object.defineProperty && object.defineProperties);

  // Natives by name.
  var natives = 'Boolean,Number,String,Array,Date,RegExp,Function'.split(',');

  // Proxy objects by class.
  var proxies = {};

  function initializeGlobal() {
    Sugar = {
      /***
       * @method Sugar.extend(<target>, <methods>, [instance] = true)
       * @short This method exposes Sugar's core ability to extend Javascript natives, and is useful for creating custom plugins.
       * @extra <target> should be the Javascript native function such as %String%, %Number%, etc. <methods> is an object containing the methods to extend. When [instance] is true the methods will be mapped to <target>'s prototype, if false they will be mapped onto <target> itself. For more see @global.
       ***/
      'extend': extend,

      /***
       * @method Sugar.restore(<target>, ...)
       * @short Restores Sugar methods that may have been overwritten by other scripts.
       * @extra <target> should be the Javascript native function such as %String%, %Number%, etc. Arguments after this may be an enumerated list of method names to restore or can be omitted to restore all.
       ***/
      'restore': restore,

      /***
       * @method Sugar.revert(<target>, ...)
       * @short Reverts Sugar methods to what the were before they were added.
       * @extra This method can be useful if Sugar methods are causing conflicts with other scripts. <target> should be the Javascript native function such as %String%, %Number%, etc. Arguments after this may be an enumerated list of method names to revert or can be omitted to revert all.
       * @short Reverts stuff.
       ***/
      'revert': revert,

      'noConflict': noConflict
    };
    if (hasExports) {
      module.exports = Sugar;
    } else {
      globalContext['Sugar'] = Sugar;
    }
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
      var existing = checkGlobal('method', klass, name, extendee),
          original = checkGlobal('original', klass, name, extendee),
          existed  = name in extendee;
      if(typeof polyfill === 'function' && existing) {
        prop = wrapExisting(existing, prop, polyfill);
      }
      defineOnGlobal(klass, name, instance, original, prop, existed);
      if(canDefineOnNative(klass, polyfill, existing, override)) {
        setProperty(extendee, name, prop);
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
    if(noConflict) return;
    return batchMethodExecute(klass, methods, function(target, name, m) {
      setProperty(target, name, m.method);
    });
  }

  function revert(klass, methods) {
    return batchMethodExecute(klass, methods, function(target, name, m) {
      if(m['existed']) {
        setProperty(target, name, m['original']);
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

  function checkGlobal(type, klass, name, extendee) {
    var proxy = getProxy(klass), methodExists;
    methodExists = proxy && hasOwnProperty(proxy, name);
    if(methodExists) {
      return proxy[name][type];
    } else {
      return extendee[name];
    }
  }

  function canDefineOnNative(klass, polyfill, existing, override) {
    if(override) {
      return true;
    } else if(polyfill === true) {
      return !existing;
    }
    return !noConflict || !proxies[klass];
  }

  function wrapExisting(originalFn, extendedFn, condition) {
    return function(a) {
      return condition.apply(this, arguments) ?
             extendedFn.apply(this, arguments) :
             originalFn.apply(this, arguments);
    }
  }

  function wrapInstanceAsClass(fn) {
    return function(obj) {
      var args = arguments, newArgs = [], i;
      for(i = 1;i < args.length;i++) {
        newArgs.push(args[i]);
      }
      return fn.apply(obj, newArgs);
    };
  }

  function defineOnGlobal(klass, name, instance, original, prop, existed) {
    var proxy = getProxy(klass), result;
    if(!proxy) return;
    result = instance ? wrapInstanceAsClass(prop) : prop;
    setProperty(proxy, name, result, true);
    if(typeof prop === 'function') {
      setProperty(result, 'original', original);
      setProperty(result, 'method', prop);
      setProperty(result, 'existed', existed);
      setProperty(result, 'instance', instance);
    }
  }

  function getProxy(klass) {
    return Sugar[proxies[klass]];
  }

  function setProperty(target, name, property, enumerable) {
    if(propertyDescriptorSupport) {
      object.defineProperty(target, name, {
        'value': property,
        'enumerable': !!enumerable,
        'configurable': true,
        'writable': true
      });
    } else {
      target[name] = property;
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

