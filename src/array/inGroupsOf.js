import { assertArray, assertPositiveInteger } from '../util/assertions';

/**
 * Groups the array into arrays of `n` elements.
 *
 * @param {Array} arr - The array.
 * @param {number} n - The number of elements in the resulting groups. Must be a
 *   positive integer.
 * @param {any} [padding] - When passed, will pad the last array to be of equal
 *   length as the rest.
 *
 * @returns {Array}
 *
 * @example
 *
 *   [1,2,3,4].inGroupsOf(2) -> [[1,2], [3,4]]
 *   [1,2,3,4,5].inGroupsOf(2) -> [[1,2], [3,4], [5]]
 *   [1,2,3,4,5].inGroupsOf(2, null) -> [[1,2], [3,4], [5,null]]
 *
 **/
export default function inGroupsOf(arr, n, padding) {
  assertArray(arr);
  assertPositiveInteger(n);
  const result = [];
  const len = Math.ceil(arr.length / n);
  const pad = arguments.length === 3;
  for (let i = 0; i < len; i++) {
    const group = [];
    for (let j = 0; j < n; j++) {
      const idx = i * n + j;
      if (idx in arr) {
        group.push(arr[idx]);
      } else if (pad) {
        group.push(padding);
      }
    }
    result.push(group);
  }
  return result;
}
