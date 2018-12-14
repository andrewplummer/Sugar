
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

const ERROR_METHOD_DEFINED = 'Method already defined';
const ERROR_NATIVE_UNKNOWN = 'Native class does not exist';

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

function mapNativeToChainable(Namespace, name) {

  const proto = globalContext[name].prototype;

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
    return Namespace.prototype[methodName] = wrapChainableResult(fn);
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
    const name = ctor ? ctor.name : 'Object';
    let Namespace = Sugar[name];
    if (!Namespace && (!ctor || ctor === globalContext[name])) {
      Namespace = createNamespace(name);
    }
    return Namespace ? new Namespace(result) : result;
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

class SugarNamespace {

  constructor(raw) {
    this.raw = raw;
  }

  valueOf() {
    return this.raw;
  }

}

export function extend(opt) {
  try {
    forEachNamespace((Namespace, name) => {
      if (namespaceIsAllowed(Namespace, opt)) {
        extendNamespace(Namespace, name, opt);
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

function namespaceIsAllowed(Namespace, opt) {
  // TODO: me!
  return true;
}

function forEachNamespace(fn) {
  forEachProperty(Sugar, (key, val) => {
    if (val.prototype instanceof SugarNamespace) {
      fn(val, key);
    }
  });
}

function extendNamespace(Namespace, name, opt) {
  try {
    if (Array.isArray(opt)) {
      opt = {
        include: opt
      };
    }
    forEachNamespaceMethod(Namespace, name, (native, methodName, fn, isInstance) => {
      if (methodAllowedByArgs(methodName, opt)) {
        extendNative(native, methodName, fn, isInstance);
      }
    });
  } catch (e) {
    restoreNamespace(Namespace, name);
    throw e;
  }
}

function restoreNamespace(Namespace, name) {
  forEachNamespaceMethod(Namespace, name, restoreNative);
}

function forEachNamespaceMethod(Namespace, name, fn) {
  const native = globalContext[name];
  forEachProperty(Namespace, (methodName, staticFn) => {
    const instanceFn = instanceMethods.get(methodName, true);
    if (instanceFn) {
      fn(native.prototype, methodName, instanceFn, true);
    } else {
      fn(native, methodName, staticFn, false);
    }
  });
}

function extendNative(native, methodName, fn, isInstance) {
  if (canExtendNative(native)) {
    if (hasOwnProperty(native, methodName)) {
      const descriptor = Object.getOwnPropertyDescriptor(native, methodName);
      nativeDescriptors.set(methodName, descriptor, isInstance);
    }
    // Built-in methods MUST be configurable, writable, and non-enumerable.
    Object.defineProperty(native, methodName, {
      writable: true,
      configurable: true,
      value: fn
    });
  }
}

function restoreNative(native, methodName, fn, isInstance) {
  if (native[methodName] === fn) {
    if (nativeDescriptors.has(methodName, isInstance)) {
      const descriptor = nativeDescriptors.get(methodName, isInstance);
      Object.defineProperty(native, methodName, descriptor);
      nativeDescriptors.remove(methodName, isInstance);
    } else {
      delete native[methodName];
    }
  }
}

function methodIsIncluded(methodName, opt) {
  return !opt.methods || opt.methods.includes(methodName);
}

function methodIsExcluded(methodName, opt) {
  return opt.exclude && opt.exclude.includes(methodName);
}

function methodAllowedByArgs(methodName, opt) {
  return !opt || (methodIsIncluded(methodName, opt) && !methodIsExcluded(methodName, opt));
}

function canExtendNative(native) {
  return native !== Object.prototype;
}

function assertMethodDoesNotExist(Namespace, methodName) {
  if (Namespace[methodName]) {
    throw new Error(ERROR_METHOD_DEFINED);
  }
}

function defineStatic(Namespace, methodName, staticFn) {
  assertMethodDoesNotExist(Namespace, methodName);
  // Clear an instance method that previously exists.
  // Sugar will error when redefining methods, so this
  // is mostly for the test suite.
  instanceMethods.remove(methodName, true);
  Namespace[methodName] = staticFn;
}

function defineInstance(Namespace, methodName, staticFn) {
  assertMethodDoesNotExist(Namespace, methodName);
  const instanceFn = wrapStaticMethodAsInstance(Namespace, staticFn);
  instanceMethods.set(methodName, instanceFn, true);
  Namespace.prototype[methodName] = wrapChainableResult(instanceFn);
  Namespace[methodName] = staticFn;
}

function wrapStaticMethodAsInstance(Namespace, fn) {
  return function(...args) {
    args.unshift(this);
    return fn.apply(Namespace, args);
  };
}

function defineWithArgs(Namespace, defineMethod, args) {
  if (typeof args[0] !== 'object') {
    return defineMethod(Namespace, args[0], args[1]);
  }
  forEachProperty(args[0], (methodName, fn) => {
    defineMethod(Namespace, methodName, fn);
  });
}

function defineAliases(Namespace, defineMethod, str, fn) {
  str.split(' ').forEach(methodName => {
    defineMethod(Namespace, methodName, fn(methodName));
  });
}

export function createNamespace(name) {

  if (!globalContext[name]) {
    throw new Error(ERROR_NATIVE_UNKNOWN);
  }

  if (Sugar[name]) {
    return Sugar[name];
  }

  class SugarChainable extends SugarNamespace {

    static extend(opt) {
      extendNamespace(SugarChainable, name, opt);
    }

    static defineStatic(...args) {
      return defineWithArgs(SugarChainable, defineStatic, args);
    }

    static defineInstance(...args) {
      return defineWithArgs(SugarChainable, defineInstance, args);
    }

    static defineStaticAlias(str, fn) {
      return defineAliases(SugarChainable, defineStatic, str, fn);
    }

    static defineInstanceAlias(str, fn) {
      return defineAliases(SugarChainable, defineInstance, str, fn);
    }

    static toString() {
      return SUGAR + name;
    }

  }

  mapNativeToChainable(SugarChainable, name);

  return Sugar[name] = SugarChainable;
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
