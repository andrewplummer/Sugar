import { assertArray, assertPositiveInteger } from '../util/assertions';

/**
 * Groups the array into `n` arrays.
 *
 * @param {Array} arr - The array.
 * @param {number} n - The number of groups. Must be a positive integer.
 * @param {any} [padding] - When passed, will pad the last array to be of equal
 *   length as the rest.
 *
 * @returns {Array}
 *
 * @example
 *
 *   [1,2,3,4,5,6].inGroups(2) -> [[1,2,3], [4,5,6]]
 *   [1,2,3,4,5,6].inGroups(3) -> [[1,2], [3,4], [5,6]]
 *   [1,2,3,4,5,6].inGroups(3, null) -> [[1,2], [3,4], [5,null]]
 *
 **/
export default function inGroups(arr, n, padding) {
  assertArray(arr);
  assertPositiveInteger(n);
  const result = [];
  const pad = arguments.length === 3;
  const size = Math.ceil(arr.length / n);
  for (let i = 0; i < n; i++) {
    const group = [];
    for (let j = 0; j < size; j++) {
      const idx = i * size + j;
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
