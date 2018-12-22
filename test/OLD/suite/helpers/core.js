(function(context) {

  // The global context
  var globalContext = typeof global !== 'undefined' && global.Object ? global : context;
  var nativeStates = [];

  var USE_PROPERTY_DESCRIPTORS = !!Object.defineProperty && !!Object.defineProperties;


  // Storing/reverting global state

  function forEachNamespace(fn) {
    testIterateOverObject(Sugar, function(key, val) {
      // In environments that can't set non-enumerable properties, other props
      // may accidentally get iterated over here. Fortunately, all Sugar
      // namespaces have custom toString methods that we can leverage here to
      // separate namespaces from utility functions.
      if (typeof val === 'function' && val.toString() === 'Sugar' + key) {
        fn(key, val);
      }
    });
  }

  // Iterate over non-enumerable properties if possible.
  function iterateOverNonEnumerable(obj, fn) {
    if (Object.getOwnPropertyNames) {
      var names = Object.getOwnPropertyNames(obj), name;
      while (name = names.pop()) {
        fn(name);
      }
    } else {
      testIterateOverObject(obj, fn);
    }
  }

  function getFunctionProperty(obj, key) {
    if (USE_PROPERTY_DESCRIPTORS) {
      var descriptor = Object.getOwnPropertyDescriptor(obj, key);
      if (descriptor && typeof descriptor.value === 'function') {
        return descriptor;
      }
    } else if (typeof obj[key] === 'function') {
      return obj[key];
    }
  }

  function restoreProp(target, key, stored) {
    var restoreFn = USE_PROPERTY_DESCRIPTORS ? restorePropByDescriptor : restorePropEnumerable;
    return restoreFn(target, key, stored);
  }

  function restorePropByDescriptor(target, key, descriptor) {
    var hasOwn = testHasOwn(target, key);
    if (hasOwn && !descriptor) {
      delete target[key];
    } else if (hasOwn && target[key] !== descriptor.value) {
      Object.defineProperty(target, key, descriptor);
    }
  }

  function restorePropEnumerable(target, key, val) {
    if (testHasOwn(target, key) && target[key] !== val) {
      if (!val) {
        delete target[key];
      } else {
        target[key] = val;
      }
    }
  }

  function getState(obj) {
    var state = {};
    iterateOverNonEnumerable(obj, function(key) {
      var prop = getFunctionProperty(obj, key);
      if (prop) {
        state[key] = prop;
      }
    });
    return state;
  }

  function restoreState(target, state) {
    // First iterate over the state object,
    // restoring anything that has been changed.
    testIterateOverObject(state, function(key) {
      restoreProp(target, key, state[key]);
    });
    // Once that has been done any function properties
    // left on the target must have been added later,
    // so revert those as well;
    iterateOverNonEnumerable(target, function(key) {
      var prop = getFunctionProperty(target, key);
      if (prop) {
        // In an environment with a potentially dirty Object.prototype state,
        // the state hash may be inheriting properties, so be careful.
        var val = testHasOwn(state, key) ? state[key] : undefined;
        restoreProp(target, key, val);
      }
    });
  }


  // Asserting on extended namespaces

  function assertNamespaces(namespaces, assert, checkStatic, checkInstance) {
    for (var i = 0; i < namespaces.length; i++) {
      assertNamespace(namespaces[i], assert, checkStatic, checkInstance);
    }
  }

  function assertNamespace(namespace, assert, checkStatic, checkInstance) {
    var sugarNamespace = Sugar[namespace],
        nativeClass = globalContext[namespace],
        count = 0, mappedCount = 0;

    function methodIsMapped(method, name) {
      return (method.instance && method.instance === nativeClass.prototype[name]) || method === nativeClass[name];
    }

    function checkMethod() {
      return (!!method.instance && checkInstance) || (method.static && checkStatic);
    }

    testIterateOverObject(sugarNamespace, function(name, method) {
      if (!checkMethod(method)) {
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


  // Public

  testGetDefaultChainablePrototype = function () {
    // The DefaultChainable prototype can be reached through Sugar.Object
    // as it inherits from DefaultChainable and does not define its own
    // constructor. If this changes this module will fail, so be careful!
    return Sugar.Object.prototype.constructor.prototype;
  }

  assertAllMethodsMappedToNative = function(namespaces) {
    assertNamespaces(namespaces, true, true, true);
  }

  assertNoMethodsMappedToNative = function(namespaces) {
    assertNamespaces(namespaces, false, true, true);
  }

  assertStaticMethodsMappedToNative = function(namespaces) {
    assertNamespaces(namespaces, true, true, false);
  }

  assertStaticMethodsNotMappedToNative = function(namespaces) {
    assertNamespaces(namespaces, false, true, false);
  }

  assertInstanceMethodsMappedToNative = function(namespaces) {
    assertNamespaces(namespaces, true, false, true);
  }

  assertInstanceMethodsNotMappedToNative = function(namespaces) {
    assertNamespaces(namespaces, false, false, true);
  }

  storeNativeState = function() {
    var nativeState = {};
    nativeState['DefaultChainableState'] = getState(testGetDefaultChainablePrototype());
    forEachNamespace(function(name, namespace) {
      nativeState[name + 'Active'] = namespace.active;
      nativeState[name + 'State'] = getState(namespace);
      nativeState[name + 'ProtoState'] = getState(namespace.prototype);
      nativeState[name + 'GlobalState'] = getState(globalContext[name]);
      nativeState[name + 'GlobalProtoState'] = getState(globalContext[name].prototype);
    });
    nativeStates.push(nativeState);
  }

  restoreNativeState = function() {
    // "objectPrototype" preserves state for future
    // method definitions, so reset that flag here.
    Sugar.Object.extend({
      methods: [],
      objectPrototype: false
    });

    var nativeState = nativeStates.pop();

    // First restore each namespace.
    forEachNamespace(function(name, namespace) {
      namespace.active = nativeState[name + 'Active'];
      restoreState(namespace, nativeState[name + 'State']);
      restoreState(namespace.prototype, nativeState[name + 'ProtoState']);
      restoreState(globalContext[name], nativeState[name + 'GlobalState']);
      restoreState(globalContext[name].prototype, nativeState[name + 'GlobalProtoState']);
    });

    // Then restore the default chainble state.
    restoreState(testGetDefaultChainablePrototype(), nativeState['DefaultChainableState']);
  }

})(this);
