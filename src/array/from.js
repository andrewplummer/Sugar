import { assertArray, assertInteger } from '../util/assertions';

/**
 * Returns elements in the array from the given index.
 *
 * @param {Array} arr - The array.
 * @param {number} n - The index of the array to start at. May be negative.
 *   Must be an integer.
 *
 * @returns {Array}
 *
 * @example
 *
 *   [1,2,3].from(1) -> [2,3]
 *   [1,2,3].from(2) -> [3]
 *
 **/
export default function from(arr, n) {
  assertArray(arr);
  assertInteger(n);
  return arr.slice(n);
}
