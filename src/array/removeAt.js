import { assertArray, assertInteger } from '../util/assertions';

/**
 * Removes element(s) from the array by index.
 *
 * @extra This method will modify the array!
 *
 * @param {Array} arr - The array.
 * @param {number} start - The index of the array to start at. May be negative.
 *   Must be an integer.
 * @param {number} [end] - The index of the array to end at. If not passed,
 *   will remove a single element. May be negative. Must be an integer.
 *
 * @returns {Array}
 *
 * @example
 *
 *   [1,2,3].removeAt(0) -> [2, 3]
 *   [1,2,3,4].removeAt(1, 2) -> [1, 4]
 *
 **/
export default function removeAt(arr, start, end) {
  assertArray(arr);
  if (arguments.length === 2) {
    end = start;
  }
  assertInteger(start);
  assertInteger(end);
  arr.splice(start, end - start + 1);
  if (start < 0 && end >= 0) {
    arr.splice(0, end);
  }
  return arr;
}
