  'use strict';

  // An optimization for GCC.
  var object = Object;

  // defineProperty exists in IE8 but will error when trying to define a property on
  // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
  var definePropertySupport = object.defineProperty && object.defineProperties;

  function initializeClass(klass) {
    defineProperty(klass, 'SugarMethods', {});
    extend.call(klass, {
      'extend': extend,
      'sugarRevert': revert,
      'sugarRestore': restore
    }, true, false);
  }

  function initializeObject() {
    initializeClass(object);
    object.extend({
      'sugarInitialize': initializeClass
    }, true, false);
  }

  // Class extending methods

  function extend(methods, override, instance) {
    var klass = this, extendee;
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
      // If the method is internal to Sugar, then
      // store a reference so it can be restored later.
      klass['SugarMethods'][name] = {
        'method':   extendedFn,
        'existed':  existed,
        'original': nativeFn,
        'instance': instance
      };
    });
  }

  function restore() {
    return batchMethodExecute(this, this, arguments, function(target, name, m) {
      defineProperty(target, name, m.method);
    });
  }

  function revert() {
    return batchMethodExecute(this, this, arguments, function(target, name, m) {
      if(m['existed']) {
        defineProperty(target, name, m['original']);
      } else {
        delete target[name];
      }
    });
  }

  function batchMethodExecute(target, klass, args, fn) {
    var all = args.length === 0, methods = multiArgs(args), changed = false;
    iterateOverObject(klass['SugarMethods'], function(name, m) {
      if(all || methods.indexOf(name) !== -1) {
        changed = true;
        fn(m['instance'] ? target.prototype : target, name, m);
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


  // Argument helpers

  function multiArgs(args, fn, from) {
    var result = [], i = from || 0, len;
    for(len = args.length; i < len; i++) {
      result.push(args[i]);
      if(fn) fn.call(args, args[i], i);
    }
    return result;
  }

  function iterateOverObject(obj, fn) {
    var key;
    for(key in obj) {
      if(!obj.hasOwnProperty(key)) continue;
      if(fn.call(obj, key, obj[key], obj) === false) break;
    }
  }

  initializeObject();
  initializeClass(Boolean);
  initializeClass(Number);
  initializeClass(String);
  initializeClass(Array);
  initializeClass(Date);
  initializeClass(RegExp);
  initializeClass(Function);

