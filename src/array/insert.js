import { isArray } from '../util/typeChecks';
import { assertArray } from '../util/assertions';

/**
 * Inserts an element(s) into the array at a specific index.
 *
 * @param {Array} arr - The array.
 * @param {any} insert - The element to be inserted. If an array, multiple
 *   elements will be inserted.
 * @param {number} [index] - The index to insert the element(s) at. By default
 *   will add elements to the end of the array.
 *
 * @returns {Array}
 *
 * @example
 *
 *   [1,3].insert(2, 1)     -> [1,2,3]
 *   [1,4].insert([2,3], 1) -> [1,2,3,4]
 *
 **/
export default function insert(arr, insert, index) {
  assertArray(arr);
  if (!isArray(insert)) {
    insert = [insert];
  }
  if (isNaN(index)) {
    index = arr.length;
  }
  insert.forEach((el, i) => {
    arr.splice(index + i, 0, el);
  });
  return arr;
}
