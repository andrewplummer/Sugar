import { assertObject } from '../util/assertions';

/**
 * Returns true if the object has no non-inherited, enumerable properties.
 *
 * @param {Object} obj - The object.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isEmpty({})    -> true
 *   Object.isEmpty({a:1}) -> false
 *
 **/
export default function isEmpty(obj) {
  assertObject(obj);
  return Object.keys(obj).length === 0;
}
