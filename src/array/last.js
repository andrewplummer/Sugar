import { assertArray, assertPositiveInteger } from '../util/assertions';

/**
 * Returns the last element(s) of the array.
 *
 * @param {Array} arr - The array.
 * @param {number} [n] - When passed returns the last `n` elements in the
 *   array, otherwise returns the last element. Must be a positive integer.
 *
 * @returns {any}
 *
 * @example
 *
 *   [1,2,3].last()  -> 3
 *   [1,2,3].last(2) -> [2,3]
 *
 **/
export default function last(arr, n) {
  assertArray(arr);
  if (arguments.length === 2) {
    assertPositiveInteger(n);
    return arr.slice(-n);
  } else {
    return arr[arr.length - 1];
  }
}
