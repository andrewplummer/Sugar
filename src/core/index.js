const SUGAR = 'Sugar';

// TODO: test browserify
// TODO: test broccoli
// TODO: test rhino
// TODO: test QML
const IS_BROWSER = typeof window !== 'undefined';

const hasOwnProperty = Object.prototype.hasOwnProperty;
const globalContext = getGlobalContext();

function hasOwn(obj, prop) {
  return !!obj && hasOwnProperty.call(obj, prop);
}

function forEachProperty(obj, fn) {
  for(let key in obj) {
    if (!hasOwn(obj, key)) continue;
    if (fn.call(obj, key, obj[key], obj) === false) break;
  }
}

function getGlobalContext() {
  // Get global context by keyword here to avoid issues with libraries
  // that can potentially alter this script's context object.
  return testGlobalContext(typeof global !== 'undefined' && global) ||
         testGlobalContext(typeof window !== 'undefined' && window) ||
         testGlobalContext(typeof self   !== 'undefined' && self);
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
  return methodName === 'constructor' ||
         methodName === 'valueOf' ||
         methodName === '__proto__';
}

function mapNativeToChainable(namespace, name) {

  const proto = globalContext[name].prototype;

  Object.getOwnPropertyNames(proto).forEach(methodName => {
    // TODO: not toString??
    if (nativeMethodProhibitedOnChainable(methodName)) {
      return;
    }
    try {
      var fn = proto[methodName];
      if (typeof fn !== 'function') {
        // Bail on anything not a function.
        return;
      }
    } catch (e) {
      // Function.prototype has properties that
      // will throw errors when accessed.
      return;
    }
    return namespace.prototype[methodName] = wrapChainableResult(fn);
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
    let namespace = Sugar[name];
    if (!namespace && (!ctor || ctor === globalContext[name])) {
      namespace = createNamespace(name);
    }
    return namespace ? new namespace(result) : result;
  }
}

function createExport() {
  const obj = {
    VERSION: VERSION,
    extend: extend,
    toString: toString,
    createNamespace: createNamespace
  };

  if (IS_BROWSER) {
    try {
    // Reuse already defined Sugar global object.
      globalContext[SUGAR] = globalContext[SUGAR] || obj;
    } catch(e) {
      console.error(e);
      // Contexts such as QML have a read-only global context.
    }
  }

  return obj;
}

function methodIsIncluded(methodName, opt) {
  return !opt.methods || opt.methods.includes(methodName);
}

function methodIsExcluded(methodName, opt) {
  return opt.exclude && opt.exclude.includes(methodName);
}

function methodCanBeExtended(methodName, opt) {
  return !opt || (methodIsIncluded(methodName, opt) && !methodIsExcluded(methodName, opt));
}

function collectExtendOptions(args) {
  if (args.length) {
    if (typeof args[0] == 'string') {
      return {
        methods: args
      };
    } else {
      return args[0];
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


export function extend(...args) {
  forEachProperty(Sugar, (key, val) => {
    if (val.prototype instanceof SugarNamespace) {
      extendNamespace(val, key, args);
    }
  });
}

export function extendNamespace(namespace, name, args) {
  const native = globalContext[name];
  const opt = collectExtendOptions(args);

  forEachProperty(namespace, (methodName, fn) => {
    if (methodCanBeExtended(methodName, opt)) {
      const instanceFn = getInstanceMethod(namespace, methodName);
      if (instanceFn && canExtendNativePrototype(native)) {
        extendNative(native.prototype, methodName, instanceFn);
      } else {
        extendNative(native, methodName, fn);
      }
    }
  });
}

function canExtendNativePrototype(native) {
  return native !== Object;
}

function extendNative(target, methodName, fn) {
  // Built-in methods MUST be configurable, writable, and non-enumerable.
  Object.defineProperty(target, methodName, {
    writable: true,
    configurable: true,
    value: fn
  });
}

const methodsById = {};

function getInstanceMethod(namespace, methodName) {
  return methodsById[getMethodId(namespace, methodName)];
}

function storeInstanceMethod(namespace, methodName, fn) {
  methodsById[getMethodId(namespace, methodName)] = fn;
}

function clearInstanceMethod(namespace, methodName) {
  delete methodsById[getMethodId(namespace, methodName)];
}

function getMethodId(namespace, methodName) {
  // Only need to store instance methods.
  return namespace.toString() + '#' + methodName;
}

function assertMethodDoesNotExist(namespace, methodName) {
  if (namespace[methodName]) {
    throw new Error(ERROR_METHOD_DEFINED);
  }
}

function defineStatic(namespace, methodName, staticFn) {
  assertMethodDoesNotExist(namespace, methodName);
  // Clear an instance method that previously exists.
  // Sugar will error when redefining methods, so this
  // is mostly for the test suite.
  clearInstanceMethod(namespace, methodName);
  namespace[methodName] = staticFn;
}

function defineInstance(namespace, methodName, staticFn) {
  assertMethodDoesNotExist(namespace, methodName);
  const instanceFn = wrapStaticMethodAsInstance(namespace, staticFn);
  storeInstanceMethod(namespace, methodName, instanceFn);
  namespace.prototype[methodName] = wrapChainableResult(instanceFn);
  namespace[methodName] = staticFn;
}

function wrapStaticMethodAsInstance(namespace, fn) {
  return function(...args) {
    args.unshift(this);
    return fn.apply(namespace, args);
  }
}

function defineWithArgs(namespace, defineMethod, args) {
  if (typeof args[0] === 'object') {
    forEachProperty(args[0], (methodName, fn) => {
      defineMethod(namespace, methodName, fn);
    })
  } else {
    return defineMethod(namespace, args[0], args[1]);
  }
}

function defineAliases(namespace, defineMethod, str, fn) {
  str.split(' ').forEach(methodName => {
    defineMethod(namespace, methodName, fn(methodName));
  });
}

const ERROR_METHOD_DEFINED = 'Method already defined';
const ERROR_NATIVE_UNKNOWN = 'Native class does not exist';

const INSTANCE = 0x1;
const STATIC   = 0x2;

export const VERSION = 'edge';

export function createNamespace(name) {

  if (!globalContext[name]) {
    throw new Error(ERROR_NATIVE_UNKNOWN);
  }

  if (Sugar[name]) {
    return Sugar[name];
  }

  class SugarChainable extends SugarNamespace {

    static extend(...args) {
      extendNamespace(SugarChainable, name, args);
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

const Sugar = createExport();
export default Sugar;
