import { assertArray } from '../util/assertions';

/**
 * Returns a new array with all elements in the second array added.
 *
 * @extra Use `Array#append` to modify the first array.
 *
 * @param {Array} arr1 - The array.
 * @param {Array} arr2 - The array whose elements will be added.
 *
 * @returns {Array}
 *
 * @example
 *
 *   [1,2].add([2,3]) -> [1,2,2,3]
 *   [user1, user2].add([user2, user3]) -> [user1, user2, user2, user3]
 *
 **/
export default function add(arr1, arr2) {
  assertArray(arr1);
  assertArray(arr2);
  return [...arr1, ...arr2];
}
