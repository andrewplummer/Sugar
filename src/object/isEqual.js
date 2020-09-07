import { isEqual as _isEqual } from '../util/equality';

/**
 * Returns true if both objects are deeply equal.
 *
 * @extra Objects that cannot be observably distinguished from one another will
 * be considered equal. Note that functions, class instances, browser host
 * objects, and symbols are equal only by reference. Object members are deeply
 * checked based on their non-inherited, enumerable properties.
 *
 * @param {Object} [obj1] - The first object to compare. `undefined` if not passed.
 * @param {Object} [obj2] - The second object to compare. `undefined` if not passed.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isEqual(1, 1)         -> true
 *   Object.isEqual(1, 2)         -> false
 *   Object.isEqual([1], [1])     -> true
 *   Object.isEqual([1], [2])     -> false
 *   Object.isEqual({a:1}, {a:1}) -> true
 *   Object.isEqual({a:1}, {a:2}) -> false
 *
 **/
export default function isEqual(obj1, obj2) {
  return _isEqual(obj1, obj2);
}
