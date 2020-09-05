import { assertArray, assertInteger } from '../util/assertions';

/**
 * Returns elements in the array up to the given index.
 *
 * @param {Array} arr - The array.
 * @param {number} n - The index of the array to end at. May be negative.
 *   Must be an integer.
 *
 * @returns {Array}
 *
 * @example
 *
 *   [1,2,3].to(1) -> [1]
 *   [1,2,3].to(2) -> [1,2]
 *
 **/
export default function to(arr, n) {
  assertArray(arr);
  assertInteger(n);
  return arr.slice(0, n);
}
