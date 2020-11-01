import {
  isDate,
  isSet,
  isMap,
  isRegExp,
  isPrimitive,
  isWrappedPrimitive,
  isArrayOrTypedArray,
} from '../util/typeChecks';
import {
  cloneSet,
  cloneMap,
  cloneDate,
  cloneArray,
  cloneRegExp,
  cloneWrappedPrimitive,
} from '../util/clone';
import { isPlainObject } from '../util/object';

/**
 * Performs a shallow clone of the object.
 *
 * @extra All properties will be cloned including inherited and non-enumerable
 *   properties. Built-in objects such as primitives, Object, Array, Date,
 *   RegExp, Set, Map, and typed arrays will be cloned. Objects that cannot be
 *   cloned including functions, Symbol, WeakSet, WeakMap, Error, and class
 *   instances will throw an error.
 *
 * @param {Object} obj - The object to clone.
 *
 * @returns {any}
 *
 * @example
 *
 *   Object.clone({a:1}) -> {a:1}
 *   Object.clone([1,2,3]) -> [1,2,3]
 *   Object.clone('a') -> 'a'
 *
 **/
export default function clone(obj) {
  if (isPrimitive(obj)) {
    return obj;
  } else if (isPlainObject(obj)) {
    return Object.create(
      Object.getPrototypeOf(obj),
      Object.getOwnPropertyDescriptors(obj)
    );
  } else if (isArrayOrTypedArray(obj)) {
    return cloneArray(obj);
  } else if (isDate(obj)) {
    return cloneDate(obj);
  } else if (isSet(obj)) {
    return cloneSet(obj);
  } else if (isMap(obj)) {
    return cloneMap(obj);
  } else if (isRegExp(obj)) {
    return cloneRegExp(obj);
  } else if (isWrappedPrimitive(obj)) {
    return cloneWrappedPrimitive(obj);
  } else {
    throw new TypeError(`${obj} cannot be cloned`);
  }
}
