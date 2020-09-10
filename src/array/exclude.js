import { getMatcher } from '../util/matchers';
import { assertArray } from '../util/assertions';

/**
 * Returns a new array with elements removed.
 *
 * @extra This method can be thought of as the inverse of `Array#filter`. It
 *        will not modify the original array, Use `remove` to modify the
 *        array in place.
 *
 * @param {Array} arr - The array.
 * @param {any|matchFn} match - A matcher to find the elements to exclude. When a
 * function is passed a truthy return value will match the element. Primitives
 * will directly match elements. Can also be a Date object to match dates, a
 * RegExp which will test against strings, or a plain object which will perform
 * a "fuzzy match" on specific properties. Values of a fuzzy match can be any of
 * the matcher types listed above.
 * @param {any} [context] - The `this` argument to be passed to the matching
 * function.
 *
 * @returns {Array}
 *
 * @callback matchFn
 *
 *   el   The element of the current iteration.
 *   i    The index of the current iteration.
 *   arr  A reference to the array.
 *
 * @example
 *
 *   [1,2,3].exclude(3)         -> [1,2]
 *   ['a','b','c'].exclude(/b/) -> ['a','c']
 *   [{a:1},{b:2}].exclude(function(n) {
 *     return n['a'] == 1;
 *   }); -> [{b:2}]
 *
 **/
export default function exclude(arr, match, context) {
  assertArray(arr);
  const matcher = getMatcher(match, context);
  return arr.filter((el, i) => {
    return !matcher(el, i, arr);
  });
}
