import NamespaceStore from './NamespaceStore';

const SUGAR = 'Sugar';

// TODO: test browserify
// TODO: test broccoli
// TODO: test rhino
// TODO: test QML
const IS_BROWSER = typeof window !== 'undefined';

const globalContext = getGlobalContext();

const nativeDescriptors = new NamespaceStore();
const instanceMethods   = new NamespaceStore();

const ERROR_METHOD_DEFINED  = 'Method already defined';
const ERROR_NATIVE_UNKNOWN  = 'Native class does not exist';
const ERROR_EXTEND_CONFLICT = 'Method cannot be both included and excluded';

export const VERSION = 'edge';

function hasOwnProperty(obj, prop) {
  return !!obj && Object.prototype.hasOwnProperty.call(obj, prop);
}

function forEachProperty(obj, fn) {
  for (let key in obj) {
    if (!hasOwnProperty(obj, key)) continue;
    if (fn.call(obj, key, obj[key], obj) === false) break;
  }
}

function arrayIncludes(arr, el) {
  return arr.includes ? arr.includes(el) : arr.indexOf(el) !== -1;
}

function getGlobalContext() {
  // Get global context by keyword here to avoid issues with libraries
  // that can potentially alter this script's context object.
  return testGlobalContext(typeof global !== 'undefined' && global)
         || testGlobalContext(typeof window !== 'undefined' && window)
         || testGlobalContext(typeof self   !== 'undefined' && self);
}

function testGlobalContext(obj) {
  // Note that Rhino uses a different "global" keyword so perform an
  // extra check here to ensure that it's actually the global object.
  // TODO: test this!
  return obj && obj.Object === Object ? obj : null;
}

function toString() {
  return SUGAR;
}
// TODO: rinse arrow functions
// TODO: need to export anything?

function nativeMethodProhibitedOnChainable(methodName) {
  // Sugar chainables have their own constructors as well as "valueOf"
  // methods, so exclude them here. The __proto__ argument should be
  // trapped by the function check, however simply accessing this property
  // on Object.prototype causes QML to segfault, so pre-emptively excluding
  // it. Note we're intentionally allowing toString through to allow
  // it to be wrapped as a chainable.
  return methodName === 'constructor'
         || methodName === 'valueOf'
         || methodName === '__proto__';
}

function mapNativeToChainable(globalName, SugarChainable) {

  const proto = globalContext[globalName].prototype;

  Object.getOwnPropertyNames(proto).forEach(methodName => {
    var fn;
    // TODO: not toString??
    if (nativeMethodProhibitedOnChainable(methodName)) {
      return;
    }
    try {
      fn = proto[methodName];
      if (typeof fn !== 'function') {
        // Bail on anything not a function.
        return;
      }
    } catch (e) {
      // Function.prototype has properties that
      // will throw errors when accessed.
      return;
    }
    return SugarChainable.prototype[methodName] = wrapChainableResult(fn);
  });
}

function canWrapChainable(obj) {
  return obj != null && obj !== true && obj !== false;
}

function wrapChainableResult(fn) {
  return function() {
    const result = fn.apply(this.raw, arguments);
    if (!canWrapChainable(result)) {
      return result;
    }
    // Objects may not have prototypes.
    const ctor = result.constructor;
    const globalName = ctor ? ctor.name : 'Object';
    let SugarChainable = Sugar[globalName];
    if (!SugarChainable && (!ctor || ctor === globalContext[globalName])) {
      SugarChainable = createNamespace(globalName);
    }
    return SugarChainable ? new SugarChainable(result) : result;
  };
}

function exportGlobal(obj) {
  if (IS_BROWSER) {
    try {
    // Reuse already defined Sugar global object.
      globalContext[SUGAR] = globalContext[SUGAR] || obj;
    } catch (e) {
      // Contexts such as QML have a read-only global context.
    }
  }
}

class SugarChainableBase {

  constructor(raw) {
    this.raw = raw;
  }

  valueOf() {
    return this.raw;
  }

}

export function extend(opt) {
  try {
    opt = collectExtendOptions(opt);
    forEachNamespace(globalName => {
      if (methodAllowedByArgs(globalName, opt)) {
        extendNamespace(globalName);
      }
    });
  } catch (e) {
    restore();
    throw e;
  }
}

export function restore() {
  forEachNamespace(restoreNamespace);
}

function forEachNamespace(fn) {
  forEachProperty(Sugar, (key, val) => {
    if (val.prototype instanceof SugarChainableBase) {
      fn(key);
    }
  });
}

function collectExtendOptions(opt) {
  return Array.isArray(opt) ? { include: opt } : opt;
}

function extendNamespace(globalName, opt) {
  try {
    opt = collectExtendOptions(opt);
    forEachNamespaceMethod(globalName, (native, methodName, fn, isInstance) => {
      if (methodAllowedByArgs(methodName, opt)) {
        extendNative(native, globalName, methodName, fn, isInstance);
      }
    });
  } catch (e) {
    restoreNamespace(globalName);
    throw e;
  }
}

function restoreNamespace(globalName) {
  forEachNamespaceMethod(globalName, (native, methodName, fn, isInstance) => {
    restoreNative(native, globalName, methodName, fn, isInstance);
  });
}

function forEachNamespaceMethod(globalName, fn) {
  const native = globalContext[globalName];
  forEachProperty(Sugar[globalName], (methodName, staticFn) => {
    const instanceFn = instanceMethods.get(globalName, methodName, true);
    if (instanceFn) {
      fn(native.prototype, methodName, instanceFn, true);
    } else {
      fn(native, methodName, staticFn, false);
    }
  });
}

function extendNative(native, globalName, methodName, fn, isInstance) {
  if (canExtendNative(native)) {
    if (hasOwnProperty(native, methodName)) {
      const descriptor = Object.getOwnPropertyDescriptor(native, methodName);
      nativeDescriptors.set(globalName, methodName, descriptor, isInstance);
    }
    try {
      // Built-in methods MUST be configurable, writable, and non-enumerable.
      Object.defineProperty(native, methodName, {
        writable: true,
        configurable: true,
        value: fn
      });
    } catch (e) {
      // The extend operation may fail if a non-configurable property
      // is set on the native.
      nativeDescriptors.remove(globalName, methodName, isInstance);
      throw e;
    }
  }
}

function restoreNative(native, globalName, methodName, fn, isInstance) {
  if (native[methodName] === fn) {
    if (nativeDescriptors.has(globalName, methodName, isInstance)) {
      const descriptor = nativeDescriptors.get(globalName, methodName, isInstance);
      Object.defineProperty(native, methodName, descriptor);
      nativeDescriptors.remove(globalName, methodName, isInstance);
    } else {
      delete native[methodName];
    }
  }
}

// TODO: rename me to be more generic!
function methodIsIncluded(methodName, opt) {
  return opt.include && arrayIncludes(opt.include, methodName);
}

function methodIsExcluded(methodName, opt) {
  return opt.exclude && arrayIncludes(opt.exclude, methodName);
}

function methodAllowedByArgs(methodName, opt) {
  if (!opt) {
    return true;
  }
  const included = methodIsIncluded(methodName, opt);
  const excluded = methodIsExcluded(methodName, opt);
  if (included && excluded) {
    throw new Error(ERROR_EXTEND_CONFLICT);
  }
  return included || (!opt.include && !excluded);
}

function canExtendNative(native) {
  return native !== Object.prototype;
}

function assertMethodDoesNotExist(SugarChainable, methodName) {
  if (SugarChainable[methodName]) {
    throw new Error(ERROR_METHOD_DEFINED);
  }
}

function defineStatic(globalName, methodName, staticFn) {
  const SugarChainable = Sugar[globalName];
  assertMethodDoesNotExist(SugarChainable, methodName);
  // Clear an instance method that previously exists.
  // Sugar will error when redefining methods, so this
  // is mostly for the test suite.
  instanceMethods.remove(globalName, methodName, true);
  SugarChainable[methodName] = staticFn;
}

function defineInstance(globalName, methodName, staticFn) {
  const SugarChainable = Sugar[globalName];
  assertMethodDoesNotExist(SugarChainable, methodName);
  const instanceFn = wrapStaticMethodAsInstance(SugarChainable, staticFn);
  instanceMethods.set(globalName, methodName, instanceFn, true);
  SugarChainable.prototype[methodName] = wrapChainableResult(instanceFn);
  SugarChainable[methodName] = staticFn;
}

function wrapStaticMethodAsInstance(SugarChainable, fn) {
  return function(...args) {
    args.unshift(this);
    return fn.apply(SugarChainable, args);
  };
}

function defineWithArgs(globalName, defineMethod, args) {
  if (typeof args[0] !== 'object') {
    return defineMethod(globalName, args[0], args[1]);
  }
  forEachProperty(args[0], (methodName, fn) => {
    defineMethod(globalName, methodName, fn);
  });
}

function defineAliases(globalName, defineMethod, str, fn) {
  str.split(' ').forEach(methodName => {
    defineMethod(globalName, methodName, fn(methodName));
  });
}

export function createNamespace(globalName) {

  if (!globalContext[globalName]) {
    throw new Error(ERROR_NATIVE_UNKNOWN);
  }

  if (Sugar[globalName]) {
    return Sugar[globalName];
  }

  class SugarChainable extends SugarChainableBase {

    static extend(opt) {
      extendNamespace(globalName, opt);
    }

    static defineStatic(...args) {
      return defineWithArgs(globalName, defineStatic, args);
    }

    static defineInstance(...args) {
      return defineWithArgs(globalName, defineInstance, args);
    }

    static defineStaticAlias(str, fn) {
      return defineAliases(globalName, defineStatic, str, fn);
    }

    static defineInstanceAlias(str, fn) {
      return defineAliases(globalName, defineInstance, str, fn);
    }

  }

  mapNativeToChainable(globalName, SugarChainable);

  return Sugar[globalName] = SugarChainable;
}

const Sugar = {
  VERSION,
  extend,
  restore,
  toString,
  createNamespace
};

exportGlobal(Sugar);
export default Sugar;
