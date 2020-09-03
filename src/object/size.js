import { assertObject } from '../util/assertions';

/**
 * Returns the number of non-inherited, enumerable properties in the object.
 *
 * @param {Object} obj - The object.
 *
 * @returns {number}
 *
 * @example
 *
 *   Object.size({})        -> 0
 *   Object.size({a:1})     -> 1
 *   Object.size({a:1,b:2}) -> 2
 *
 **/
export default function size(obj) {
  assertObject(obj);
  return Object.keys(obj).length;
}
