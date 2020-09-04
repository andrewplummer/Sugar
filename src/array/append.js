import { assertArray } from '../util/assertions';

/**
 * Pushes all elements in the second array into the first.
 *
 * @extra Use `Array#add` for an alias that does not modify the original array.
 *
 * @param {Array} arr1 - The array.
 * @param {Array} arr2 - The array whose elements will be appended.
 *
 * @returns {Array}
 *
 * @example
 *
 *   [1,2].append([2,3]) -> [1,2,2,3]
 *   [user1, user2].append([user2, user3]) -> [user1, user2, user2, user3]
 *
 **/
export default function append(arr1, arr2) {
  assertArray(arr1);
  assertArray(arr2);
  arr1.push(...arr2);
  return arr1;
}
