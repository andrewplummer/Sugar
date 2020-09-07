import { assertArray } from '../util/assertions';

/**
 * Returns a shallow copy of the array.
 *
 * @extra This method is intended as a more readable alias for `Array#concat`.
 * Use `Object.clone` instead for a deep clone.
 *
 * @param {Array} arr - The array to clone.
 *
 * @returns {Array}
 *
 * @example
 *
 *   [1,2].clone() -> [1,2]
 *
 **/
export default function clone(arr) {
  assertArray(arr);
  return arr.concat();
}
