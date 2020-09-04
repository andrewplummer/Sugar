import { assertArray } from '../util/assertions';
import { getSerializer } from '../util/object';

/**
 * Returns a new array with all elements in the second array removed.
 *
 * @param {Array} arr1 - The array.
 * @param {Array} arr2 - The array whose values will be removed. Elements are
 * deeply checked in a way that any plain objects that cannot be observably
 * distinguished are considered unique. Note that functions, class instances,
 * and browser host objects are not serialized and are only unique by reference.
 *
 * @returns {Array}
 *
 * @example
 *
 *   [1,2].subtract([2,3]) -> [1]
 *   [user1, user2].subtract([user2, user3]) -> [user1]
 *
 **/
export default function subtract(arr1, arr2) {
  assertArray(arr1);
  assertArray(arr2);
  const serializer = getSerializer();
  return arr1.filter((el) => {
    const str = serializer(el)
    return !arr2.some((el) => {
      return serializer(el) === str;
    });
  });
}
