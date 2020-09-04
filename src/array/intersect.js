import { assertArray } from '../util/assertions';
import { getSerializer } from '../util/object';

/**
 * Returns a new array containing all elements common to all arrays.
 *
 * @param {Array} arr - The array.
 * @param {...Array} - Arrays passed as arguments here will determine the
 * result. Elements are deeply checked in a way that any plain objects that
 * cannot be observably distinguished are considered unique. Note that
 * functions, class instances, and browser host objects are not serialized
 * and are only unique by reference.
 *
 * @returns {Array}
 *
 * @example
 *
 *   [1,2].intersect([2,3]) -> [2]
 *   [user1, user2].intersect([user2, user3]) -> [user2]
 *   [user1].intersect([user2], [user3]) -> [user2]
 *
 **/
export default function intersect(arr, ...args) {
  assertArray(arr);
  const values = new Set();
  const serializer = getSerializer();
  return arr.filter((el) => {
    const val = serializer(el)
    if (!values.has(val)) {
      values.add(val);
      return args.every((arr) => {
        return arr.some((el) => {
          return values.has(serializer(el));
        });
      });
    }
    return false;
  });
}
