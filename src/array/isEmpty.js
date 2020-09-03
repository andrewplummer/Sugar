import { assertArray } from '../util/assertions';

/**
 * Returns true if the array length is zero.
 *
 * @param {Array} arr - The array.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   [].isEmpty()    -> true
 *   ['a'].isEmpty() -> false
 *
 **/
export default function isEmpty(arr) {
  assertArray(arr);
  return arr.length === 0;
}
