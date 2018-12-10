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

export function extend() {
  console.info('EXTENDINNNNNNNn');
}

function assertMethodDoesNotExist(namespace, methodName) {
  if (namespace[methodName]) {
    throw new Error(ERROR_METHOD_DEFINED);
  }
}

function defineStatic(namespace, methodName, fn) {
  assertMethodDoesNotExist(namespace, methodName);
  return namespace[methodName] = fn;
}

function defineInstance(namespace, methodName, fn) {
  assertMethodDoesNotExist(namespace, methodName);
  const instance = wrapStaticMethodAsInstance(namespace, fn);
  namespace[methodName] = fn;
  namespace.prototype[methodName] = wrapChainableResult(instance);
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

  class SugarChainable {

    constructor(raw) {
      this.raw = raw;
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

    valueOf() {
      return this.raw;
    }

  }

  mapNativeToChainable(SugarChainable, name);

  return Sugar[name] = SugarChainable;
}

const Sugar = createExport();
export default Sugar;
