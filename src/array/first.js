import { assertArray, assertPositiveInteger } from '../util/assertions';

/**
 * Returns the first element(s) of the array.
 *
 * @param {Array} arr - The array.
 * @param {number} [n] - When passed returns the first `n` elements in the
 *   array, otherwise returns the first element. Must be a positive integer.
 *
 * @returns {any}
 *
 * @example
 *
 *   [1,2,3].first()  -> 1
 *   [1,2,3].first(2) -> [1,2]
 *
 **/
export default function first(arr, n) {
  assertArray(arr);
  if (arguments.length === 2) {
    assertPositiveInteger(n);
    return arr.slice(0, n);
  } else {
    return arr[0];
  }
}
