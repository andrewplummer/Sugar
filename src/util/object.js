import {
  isPrimitive,
  isObject,
  isSet,
  isMap,
  isNaN,
} from './typeChecks';
import { SERIALIZABLE_CLASS_TAGS } from './tags';
import { hasOwnProperty, forEachProperty, forEachSymbol } from './helpers';
import { isClass, getClassTag } from './class';

export function isPlainObject(obj, classTag) {
  return (
    isObject(obj)
    && isClass(obj, 'Object', classTag)
    && hasValidPlainObjectPrototype(obj)
  );
}

export function assertPlainObject(obj) {
  if (!isPlainObject(obj)) {
    throw new TypeError('Plain object required');
  }
}

// A function that will serialize objects holding an array of refs
// to distinguish non-serializable objects (class instances, host objects, etc).
export function getSerializer() {
  const refs = [];
  return (obj) => {
    return serialize(obj, refs);
  };
}

export function isSerializable(obj, classTag) {
  // Only known objects can be serialized. This notably excludes functions,
  // host objects, Symbols (which are matched by reference), and instances
  // of classes. The latter can arguably be matched by value, but
  // distinguishing between these and host objects -- which should never be
  // compared by value -- is very tricky so not dealing with it here.
  return isSerializableClassTag(classTag) || isPlainObject(obj, classTag);
}

// This method for checking for cyclic structures was egregiously stolen from
// the ingenious method by @kitcambridge from the Underscore script:
// https://github.com/documentcloud/underscore/issues/240
export function iterateWithCyclicCheck(obj, stack, fn) {
  function next(key, val) {

    // Allowing a step into the structure before triggering this check to save
    // cycles on standard JSON structures and also to try as hard as possible to
    // catch basic properties that may have been modified.
    if (stack.length > 1) {
      let i = stack.length;
      while (i--) {
        if (stack[i] === val) {
          throw new TypeError('Cannot iterate cyclic structure');
        }
      }
    }

    stack.push(val);
    const ret = fn(key, val);
    stack.pop();
    return ret;
  }

  forEachProperty(obj, next);
  forEachSymbol(obj, next);
}

// Serializes an object in a way that will provide a token unique
// to the type, class, and value of an object. Host objects, class
// instances etc are not serializable, and are held in an array
// of references that will return the index as a unique identifier
// for the object. This array is passed from outside so that the
// calling function can decide how to dispose of this array.
function serialize(obj, refs = [], stack = []) {
  const type = typeof obj;

  // Check for -0
  const sign = 1 / obj === -Infinity ? '-' : '';

  // Return quickly for primitives to save cycles
  if (isPrimitive(obj, type) && !isNaN(obj)) {
    return type + sign + obj;
  }

  const classTag = getClassTag(obj);

  let value = '';
  if (!isSerializable(obj, classTag)) {
    return serializeRef(obj, refs);
  } else if (isSet(obj) || isMap(obj)) {
    value = serialize(Array.from(obj), refs, stack);
  } else if (isObject(obj)) {
    value = serializeDeep(obj, refs, stack) + obj.toString();
  } else if (obj.valueOf) {
    value = obj.valueOf();
  }
  return type + classTag + sign + value;
}

function serializeDeep(obj, refs, stack) {
  try {
    // Sorted keys are required for serialization, where object order
    // does not matter but stringified order does. Symbols need to be
    // serialized first before sorting.
    const entries = [];
    iterateWithCyclicCheck(obj, stack, (key, val) => {
      entries.push([serializeKey(key, refs), serialize(val, refs, stack)]);
    });
    entries.sort((a, b) => {
      return a[0] < b[0] ? -1 : 1;
    });
    return entries.map((entry) => {
      return entry.join(':');
    }).join(',');
  } catch(err) {
    return 'CYC';
  }
}

function serializeKey(key, refs) {
  if (typeof key === 'symbol') {
    return 'sym' + serializeRef(key, refs);
  } else {
    return 'str' + key;
  }
}

function serializeRef(obj, refs) {
  let index = refs.indexOf(obj);
  if (index === -1) {
    index = refs.length;
    refs.push(obj);
  }
  return `ref${index}`;
}

function isSerializableClassTag(classTag) {
  return SERIALIZABLE_CLASS_TAGS.has(classTag);
}

function hasValidPlainObjectPrototype(obj) {
  const hasToString = 'toString' in obj;
  const hasConstructor = 'constructor' in obj;
  // An object created with Object.create(null) has no methods in the
  // prototype chain, so check if any are missing. The additional hasToString
  // check is for false positives on some host objects in old IE which have
  // toString but no constructor. If the object has an inherited constructor,
  // then check if it is Object (the "isPrototypeOf" tapdance here is a more
  // robust way of ensuring this if the global has been hijacked). Note that
  // accessing the constructor directly (without "in" or "hasOwnProperty")
  // will throw a permissions error in IE8 on cross-domain windows.
  return (
    (!hasConstructor && !hasToString) ||
    (hasConstructor &&
      !hasOwnProperty(obj, 'constructor') &&
      hasOwnProperty(obj.constructor.prototype, 'isPrototypeOf'))
  );
}
