(function(globalContext) {

  var nativeMethods = {
    Array: {
      concat: true,
      every: true,
      filter: true,
      find: true,
      findIndex: true,
      forEach: true,
      indexOf: true,
      isArray: true,
      lastIndexOf: true,
      map: true,
      reduce: true,
      reduceRight: true,
      some: true
    },
    Date: {
      now: true,
      toISOString: true,
      toJSON: true
    },
    Function: {
      bind: true
    },
    Number: {
      isNaN: true,
      isFinite: true
    },
    String: {
      charAt: true,
      charCodeAt: true,
      concat: true,
      indexOf: true,
      lastIndexOf: true,
      match: true,
      replace: true,
      search: true,
      slice: true,
      split: true,
      substring: true,
      trim: true
    },
    Object: {
      keys: true
    }
  }

  function storeNativeMethods() {
    testIterateOverObject(nativeMethods, function(namespace, methods) {
      var native = globalContext[namespace];
      testIterateOverObject(methods, function(name, method) {
        var obj = {};
        if (native.prototype[name]) {
          obj.instance = true;
          obj.method = native.prototype[name];
        } else if (native[name]) {
          obj.instance = false;
          obj.method = native[name];
        }
        methods[name] = obj;
      });
    });
  }

  function getNativeMethod(namespace, methodName) {
    return nativeMethods[namespace] && nativeMethods[namespace][methodName];
  }

  assertNoMethodsMapped = function() {
    assertMethodsNotMappedToNatives('all');
  }

  assertMethodsMappedToNatives = function(namespaces, assert) {
    var isDefault = namespaces === 'default';
    var isAll = namespaces === 'all';
    if (isDefault || isAll) {
      namespaces = ['Boolean', 'Number', 'String', 'Array', 'Date', 'RegExp', 'Function'];
    }
    if (isAll) {
      namespaces.push('Object');
    }
    if (typeof namespaces === 'string') {
      namespaces = [namespaces];
    }
    for (var i = 0; i < namespaces.length; i++) {
      assertMethodsMappedToNative(namespaces[i], assert);
    }
  }

  assertMethodsNotMappedToNatives = function(namespaces) {
    assertMethodsMappedToNatives(namespaces, false);
  }

  assertMethodsMappedToNative = function(namespace, assert) {
    var sugarNamespace = Sugar[namespace],
        native = globalContext[namespace],
        count = 0, mappedCount = 0, polyfillCount = 0;

    function methodIsMapped(method, name) {
      return (method.instance && method.instance === native.prototype[name]) || method === native[name];
    }

    testIterateOverObject(sugarNamespace, function(name, method) {
      // Not a sugar method (either a native method,
      // or a non-method property), so doesn't count.
      if (!method.instance && !method.static) {
        return;
      }
      count++;
      if (methodIsMapped(method, name)) {
        mappedCount++;
      }
    });
    if (assert === false) {
      equal(mappedCount, 0, namespace + ' methods not mapped.');
    } else {
      equal(mappedCount, count, 'All methods mapped to ' + namespace + '.');
    }
  }

  revertNamespaceExtend = function(namespace) {
    var native = globalContext[namespace];
    testIterateOverObject(Sugar[namespace], function(name, method) {
      var originalMethod = getNativeMethod(namespace, name), target;
      if (namespace === 'Object') {
        // Static object methods may have been mapped onto
        // the object prototype, so remove them here.
        delete native.prototype[name];
      }
      if (method.instance) {
        target = native.prototype;
      } else {
        target = native;
      }
      if (originalMethod && originalMethod.instance === !!method.instance) {
        target[name] = originalMethod.method;
      } else {
        delete target[name];
      }
    });
    Sugar[namespace].active = false;
  }

  revertGlobalExtend = function() {
    var ns = ['Boolean', 'Number', 'String', 'Array', 'Date', 'RegExp', 'Function'];
    for (var i = 0; i < ns.length; i++) {
      revertNamespaceExtend(ns[i]);
    }
  }

  // Note that this file (core-helpers.js) should be included AFTER Sugar has
  // been loaded as Sugar adds polyfill methods that should be saved here to be
  // correctly restored later.
  storeNativeMethods();

})(this);
