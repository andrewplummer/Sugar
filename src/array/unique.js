import { assertArray } from '../util/assertions';
import { getSerializer } from '../util/object';
import { getMapper } from '../util/mappers';

/**
 * Removes all duplicate elements in the array.
 *
 * @param {Array} arr - The array.
 * @param {string|mapFn} [map] - When passed, determines the values to unique
 * by. A function may be passed here similar to `Array#map` or a string acting
 * as a shortcut. Strings implement deep property matching. Default is a
 * function that will deeply serialize objects in a way that any plain objects
 * that cannot be observably distinguished are considered unique. Note that
 * class instances as well as browser host objects are not serialized and are
 * only unique by reference.
 *
 * @returns {Array}
 *
 * @callback mapFn
 *
 *   el   The element of the current iteration.
 *   i    The index of the current iteration.
 *   arr  A reference to the array.
 *
 * @example
 *
 *   [1,2,2,3].unique()            -> [1,2,3]
 *   [{a:'a'},{a:'a'}].unique()    -> [{a:'a'}]
 *   users.unique((user) => {
 *     return user.id;
 *   }); -> unique users by id
 *   users.unique('id') -> unique users by id
 *
 **/
export default function unique(arr, map = getSerializer()) {
  assertArray(arr);
  const values = new Set();
  const mapper = getMapper(map);
  return arr.filter((el, i) => {
    const val = mapper(el, i, arr);
    if (!values.has(val)) {
      values.add(val);
      return true;
    }
    return false;
  });
}
