import { isPrimitive, isObject, isRealNaN } from '../typeChecks';
import { isSerializable, iterateWithCyclicCheck } from './object';
import { classToString } from './class';

// Serializes an object in a way that will provide a token unique
// to the type, class, and value of an object. Host objects, class
// instances etc, are not serializable, and are held in an array
// of references that will return the index as a unique identifier
// for the object. This array is passed from outside so that the
// calling function can decide when to dispose of this array.
export function serialize(obj, refs, stack) {
  var type = typeof obj, sign = '', className, value, ref;

  // Check for -0
  if (1 / obj === -Infinity) {
    sign = '-';
  }

  // Return quickly for primitives to save cycles
  if (isPrimitive(obj, type) && !isRealNaN(obj)) {
    return type + sign + obj;
  }

  className = classToString(obj);

  if (!isSerializable(obj, className)) {
    ref = refs.indexOf(obj);
    if (ref === -1) {
      ref = refs.length;
      refs.push(obj);
    }
    return ref;
  } else if (isObject(obj)) {
    value = serializeDeep(obj, refs, stack) + obj.toString();
  } else if (obj.valueOf) {
    value = obj.valueOf();
  }
  return type + className + sign + value;
}

function serializeDeep(obj, refs, stack) {
  var result = '';
  iterateWithCyclicCheck(obj, true, stack, function(key, val, cyc, stack) {
    result += cyc ? 'CYC' : key + serialize(val, refs, stack);
  });
  return result;
}

