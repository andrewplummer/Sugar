import { isObjectType } from './typeChecks';
import { hasOwnProperty, forEachProperty } from './helpers';
import { isClass } from './class';

export function isPlainObject(obj, classTag) {
  return isObjectType(obj)
      && isClass(obj, 'Object', classTag)
      && hasValidPlainObjectPrototype(obj)
      && hasOwnEnumeratedProperties(obj);
}

export function isSerializable(obj, classTag) {
  // Only known objects can be serialized. This notably excludes functions,
  // host objects, Symbols (which are matched by reference), and instances
  // of classes. The latter can arguably be matched by value, but
  // distinguishing between these and host objects -- which should never be
  // compared by value -- is very tricky so not dealing with it here.
  return isKnownClassTag(classTag) || isPlainObject(obj, classTag);
}

export function iterateWithCyclicCheck(obj, sortedKeys, stack, fn) {

  function next(val, key) {
    var cyc = false;

    // Allowing a step into the structure before triggering this check to save
    // cycles on standard JSON structures and also to try as hard as possible to
    // catch basic properties that may have been modified.
    if (stack.length > 1) {
      var i = stack.length;
      while (i--) {
        if (stack[i] === val) {
          cyc = true;
        }
      }
    }

    stack.push(val);
    fn(key, val, cyc, stack);
    stack.pop();
  }

  function iterateWithSortedKeys() {
    // Sorted keys is required for serialization, where object order
    // does not matter but stringified order does.
    var arr = Object.keys(obj).sort(), key;
    for (var i = 0; i < arr.length; i++) {
      key = arr[i];
      next(obj[key], arr[i]);
    }
  }

  // This method for checking for cyclic structures was egregiously stolen from
  // the ingenious method by @kitcambridge from the Underscore script:
  // https://github.com/documentcloud/underscore/issues/240
  if (!stack) {
    stack = [];
  }

  if (sortedKeys) {
    iterateWithSortedKeys();
  } else {
    forEachProperty(obj, next);
  }
}

// Add core types as known so that they can be checked by value below,
// notably excluding Functions and adding Arguments and Error.
const KNOWN_CLASS_TAGS = [
  'Arguments',
  'Boolean',
  'Number',
  'String',
  'Date',
  'RegExp',
  'Error',
  'Array',
  'Set',
  'Map',
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
].reduce((tags, className) => {
  tags[`[object ${className}]`] = true;
  return tags;
}, {});

function isKnownClassTag(classTag) {
  return !!KNOWN_CLASS_TAGS[classTag];
}

function hasValidPlainObjectPrototype(obj) {
  var hasToString = 'toString' in obj;
  var hasConstructor = 'constructor' in obj;
  // An object created with Object.create(null) has no methods in the
  // prototype chain, so check if any are missing. The additional hasToString
  // check is for false positives on some host objects in old IE which have
  // toString but no constructor. If the object has an inherited constructor,
  // then check if it is Object (the "isPrototypeOf" tapdance here is a more
  // robust way of ensuring this if the global has been hijacked). Note that
  // accessing the constructor directly (without "in" or "hasOwnProperty")
  // will throw a permissions error in IE8 on cross-domain windows.
  return (!hasConstructor && !hasToString)
      || (hasConstructor && !hasOwnProperty(obj, 'constructor')
      && hasOwnProperty(obj.constructor.prototype, 'isPrototypeOf'));
}

function hasOwnEnumeratedProperties(obj) {
  // Plain objects are generally defined as having enumerated properties
  // all their own, however in early IE environments without defineProperty,
  // there may also be enumerated methods in the prototype chain, so check
  // for both of these cases.
  var objectProto = Object.prototype;
  for (var key in obj) {
    var val = obj[key];
    if (!hasOwnProperty(obj, key) && val !== objectProto[key]) {
      return false;
    }
  }
  return true;
}
