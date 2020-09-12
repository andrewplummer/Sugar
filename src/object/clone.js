import { clone as _clone } from '../util/clone';

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
  return _clone(obj);
}
