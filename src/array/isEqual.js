import { isEqual as _isEqual } from '../util/equality';

/**
 * Returns true if both arrays are deeply equal.
 *
 * @extra This function is an alias for `Object.isEqual`. Nested objects that
 * cannot be observably distinguished from one another will be considered equal.
 * Note that functions, class instances, browser host objects, and symbols are
 * equal only by reference. Object members are deeply checked based on their
 * non-inherited, enumerable properties.
 *
 * @param {Object} [arr1] - The first array to compare. `undefined` if not passed.
 * @param {Object} [arr2] - The second array to compare. `undefined` if not passed.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   [1].isEqual([1])   -> true
 *   [1].isEqual([2])   -> false
 *   [1].isEqual([1,2]) -> false
 *
 **/
export default function isEqual(arr1, arr2) {
  return _isEqual(arr1, arr2);
}
