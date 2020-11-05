import globalContext from './util/globalContext';
import ChainableBase from './util/ChainableBase';
import MethodStore from './util/MethodStore';
import { extendNative, restoreNative } from './util/extend';
import { hasOwnProperty } from './util/helpers';

/**
 * Creates a new Sugar namespace. This will be exposed on the Sugar object via
 * `globalName`. The namespace also functions as the chainable constructor whose
 * prototype has methods that forwards the chainable value to native methods of
 * the same type. After creation, a namespace can go on to define new methods
 * via `defineStatic` or `defineInstance`.
 *
 * @param {string} globalName - The name of the namespace to be created. This
 * must match the name on the global context, for example `"Number"`.
 *
 * @returns {Chainable}
 *
 * @example
 *
 *   Sugar.createNamespace('Number');
 *
 *   -> new Sugar.Number(2).toFixed(2); // Returns "2.00"
 *   -> Sugar.Number.defineInstance('add', (a, b) => a + b);
 *   -> new Sugar.Number(2).add(3); // Returns 5
 *
 */
export function createNamespace(globalName, factory) {

  if (!globalContext[globalName]) {
    throw new Error(`Built-in class ${globalName} does not exist`);
  }

  if (Sugar[globalName]) {
    return Sugar[globalName];
  }

  class Chainable extends ChainableBase {

    /**
     * Defines static methods or properties. Effectively this simply assigns the
     * function or property onto the namespace.
     *
     * @param {string|Object} arg - Name of the static method or property to be
     *   to be defined or an object mapping multiple properties.
     * @param {any} [val] - Function or property to be added when the first
     *   argument is a string.
     *
     * @example
     *
     * Sugar.Number.defineStatic('add', (a, b) => a + b); // With 2 arguments
     * Sugar.Number.defineStatic({
     *   add: (a, b) => a + b,
     * }); // With an object
     *
     * -> Sugar.Number.add(1, 2) // returns 3;
     *
     */
    static defineStatic(...args) {
      defineWithArgs(globalName, defineStatic, args);
    }

    /**
     * Defines instance methods. Accepts static function(s) that will be defined
     * on the namespace as in `defineStatic`. Additionally, an instance method
     * will be defined on the chainable prototype that forwards the chainable
     * value to the static function as the first argument, allowing it to
     * operate with chainables.
     *
     * @param {string|Object} arg - Name of the method to be defined or an object
     *   mapping multiple methods.
     * @param {Function} [staticFn] - The static function to be added. This
     *   function must accept at least one argument of a type corresponding to
     *   the namespace, allowing it to work with chainables. For example when
     *   calling `Sugar.Number.defineInstance`, `staticFn` must expect its first
     *   argument to be of type `number`.
     *
     * @example
     *
     * Sugar.Number.defineInstance('add', (a, b) => a + b); // With 2 arguments
     * Sugar.Number.defineInstance({
     *   add: (a, b) => a + b,
     * }); // With an object
     *
     * -> new Sugar.Number(1).add(2) // returns 3;
     *
     */
    static defineInstance(...args) {
      defineWithArgs(globalName, defineInstance, args);
    }

    /**
     * Extends Sugar defined methods onto built-in objects for this type.
     *
     * @param {Object} [options] - Options to control what methods are extended.
     * @param {Array<string>} [options.include] - An array of methods to include
     *   when extending. Cannot be used together with `options.exclude`.
     * @param {Array<string>} [options.exclude] - An array of methods to exclude
     *   when extending. Cannot be used together with `options.include`.
     * @param {boolean} [options.existing] - Whether or not to override existing
     *   methods when extending. This allows enhancements such as
     *   `['a','b','c'].find('a')`. Default is false.
     *
     * @example
     *
     *   Sugar.Array.extend();
     *
     */
    static extend(opt) {
      extendNamespace(globalName, opt);
    }

    constructor(...args) {
      if (factory) {
        super(factory(...args));
      } else {
        super(...args);
      }
    }
  }

  mapNativeToChainable(globalName, Chainable);

  Sugar[globalName] = Chainable;

  return Chainable;
}

// --- Defining methods

const instanceMethods = new MethodStore();

function defineWithArgs(globalName, defineFn, args) {
  if (args.length === 1) {
    for (let [key, val] of Object.entries(args[0])) {
      defineFn(globalName, key, val);
    }
  } else {
    defineFn(globalName, args[0], args[1]);
  }
}

function defineStatic(globalName, methodName, staticFn) {
  const namespace = Sugar[globalName];

  assertMethodName(methodName);
  assertMethodDoesNotExist(namespace, methodName);

  namespace[methodName] = staticFn;
}

function defineInstance(globalName, methodName, staticFn) {
  assertFunction(staticFn);

  defineStatic(globalName, methodName, staticFn);

  const namespace = Sugar[globalName];
  const instanceFn = wrapStaticMethodAsInstance(namespace, staticFn);
  instanceMethods.set(globalName, methodName, instanceFn);
  namespace.prototype[methodName] = wrapReturnWithChainable(instanceFn);
}

function assertMethodName(methodName) {
  if (typeof methodName !== 'string') {
    throw new Error('Method name must be a string');
  }
}

function assertFunction(fn) {
  if (typeof fn !== 'function') {
    throw new Error('Argument must be a function');
  }
}

function assertMethodDoesNotExist(namespace, methodName) {
  if (namespace[methodName]) {
    throw new Error(`Method ${methodName} is already defined`);
  }
}

function wrapStaticMethodAsInstance(namespace, fn) {
  return function (...args) {
    args.unshift(this);
    return fn.apply(namespace, args);
  };
}

// --- Extending

/**
 * Extends Sugar defined methods onto all built-in objects.
 *
 * @param {Object} [options] - Options to control what methods are extended.
 * @param {Array<string>} [options.include] - An array of methods to include
 *   when extending. Cannot be used together with `options.exclude`.
 * @param {Array<string>} [options.exclude] - An array of methods to exclude
 *   when extending. Cannot be used together with `options.include`.
 * @param {boolean} [options.existing] - Whether or not to override existing
 *   methods when extending. This allows enhancements such as
 *   `['a','b','c'].find('a')`. Default is false.
 *
 * @example
 *
 *   Sugar.extend();
 *
 */
export function extend(opt) {
  try {
    opt = collectExtendOptions(opt);
    forEachNamespace((globalName) => {
      if (extendIsAllowed(globalName, opt)) {
        extendNamespace(globalName, {
          existing: opt && opt.existing,
        });
      }
    });
  } catch (e) {
    restore();
    throw e;
  }
}

/**
 * Restores all built-ins to their original state, removing all Sugar defined
 * methods.
 *
 * @example
 *
 *   Sugar.restore();
 *
 */
export function restore() {
  forEachNamespace(restoreNamespace);
}

function forEachNamespace(fn) {
  for (let [key, val] of Object.entries(Sugar)) {
    if (val.prototype instanceof ChainableBase) {
      fn(key);
    }
  }
}

function collectExtendOptions(opt) {
  return Array.isArray(opt) ? { include: opt } : opt;
}

function extendIsAllowed(name, opt) {
  const included = extendOptionsInclude(name, opt);
  const excluded = extendOptionsExclude(name, opt);
  if (included && excluded) {
    throw new Error('Extend options cannot have both include and exclude');
  }
  const isImplicitlyIncluded = !opt || !opt.include;
  return included || (isImplicitlyIncluded && !excluded);
}

function extendOptionsInclude(name, opt) {
  return opt && opt.include && opt.include.includes(name);
}

function extendOptionsExclude(name, opt) {
  return opt && opt.exclude && opt.exclude.includes(name);
}

// --- Extending via namespace

function extendNamespace(globalName, opt) {
  try {
    opt = collectExtendOptions(opt);
    forEachNamespaceMethod(globalName, (native, methodName, fn, isInstance) => {
      if (canExtendMethod(methodName, native, opt)) {
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
  const namespace = Sugar[globalName];
  for (let [methodName, staticFn] of Object.entries(namespace)) {
    const instanceFn = instanceMethods.get(globalName, methodName);
    if (instanceFn) {
      fn(native.prototype, methodName, instanceFn, true);
    } else {
      fn(native, methodName, staticFn, false);
    }
  }
}

function canExtendMethod(methodName, native, opt) {
  if (isDisallowedEnhancement(methodName, native, opt)) {
    return false;
  }
  return extendIsAllowed(methodName, opt);
}

function isDisallowedEnhancement(methodName, native, opt) {
  if (extendOptionsDisallowExisting(opt)) {
    return hasOwnProperty(native, methodName);
  }
  return false;
}

function extendOptionsDisallowExisting(opt) {
  return opt && opt.existing === false;
}

// --- Chainables

function wrapReturnWithChainable(fn) {
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
      createNamespace(globalName);
      SugarChainable = Sugar[globalName];
    }
    return SugarChainable ? new SugarChainable(result) : result;
  };
}

function canWrapChainable(obj) {
  return obj != null && obj !== true && obj !== false;
}

function mapNativeToChainable(globalName, Chainable) {
  const native = globalContext[globalName];

  // Object is a special case.as it has deprecated methods:
  // TODO: figure this out:
  // __defineGetter__ Object
  // __defineSetter__ Object
  // __lookupGetter__ Object
  // __lookupSetter__ Object
  // hasOwnProperty Object
  // isPrototypeOf Object
  // propertyIsEnumerable Object

  if (native === Object) {
    return;
  }

  const nativeProto = native.prototype;
  const chainableProto = Chainable.prototype;

  for (let name of Object.getOwnPropertyNames(nativeProto)) {
    try {
      if (!isProhibitedMethod(name) && typeof nativeProto[name] === 'function') {
        const fn = nativeProto[name];
        // TODO: revisit this!
        chainableProto[name] = wrapReturnWithChainable(fn);
      }
    } catch {
      // Do nothing
    }
  }
}

// Sugar chainables have their own constructors as well as "valueOf"
// methods, so exclude them here. The __proto__ argument should be
// trapped by the function check, however simply accessing this property
// on Object.prototype causes QML to segfault, so pre-emptively excluding
// it. Note we're intentionally allowing toString through to allow
// it to be wrapped as a chainable.
const PROHIBITED_METHODS = [
  'constructor',
  'arguments',
  'toString',
  'valueOf',
  'caller',
  //'toString',
  //'valueOf',
  //'valueOf',
];

function isProhibitedMethod(name) {
  // Sugar chainables have their own constructors as well as "valueOf"
  // methods, so exclude them here. The __proto__ argument should be
  // trapped by the function check, however simply accessing this property
  // on Object.prototype causes QML to segfault, so pre-emptively excluding
  // it. Note we're intentionally allowing toString through to allow
  // it to be wrapped as a chainable.
  return PROHIBITED_METHODS.includes(name);
}

// --- Default Export

const Sugar = {
  /* eslint-disable-next-line no-undef */
  VERSION,
  extend,
  restore,
  createNamespace,
};

export default Sugar;
