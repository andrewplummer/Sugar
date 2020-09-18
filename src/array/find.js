import { getMatcher } from '../util/matchers';
import { assertArray } from '../util/assertions';
import { forEachSparse } from './util/sparse';

/**
 * Returns the first element in the array that matches input.
 *
 * @param {Array} arr - The array.
 * @param {any|matchFn} match - A matcher to find the elements to include. When a
 * function is passed a truthy return value will match the element. Primitives
 * will directly match elements. Can also be a Date object to match dates, a
 * RegExp which will test against strings, or a plain object which will perform
 * a "fuzzy match" on specific properties. Values of a fuzzy match can be any of
 * the matcher types listed above.
 * @param {any} [context] - The `this` argument to be passed to the matching
 * function.
 *
 * @returns {any}
 *
 * @callback matchFn
 *
 *   el   The element of the current iteration.
 *   i    The index of the current iteration.
 *   arr  A reference to the array.
 *
 * @example
 *
 *   [1,2,3].find(2)         -> 2
 *   ['a','b','c'].find(/[ac]/) -> 'a'
 *   [{a:1},{b:2}].find(function(n) {
 *     return n['a'] == 1;
 *   }); -> {a:1}
 *   [{a:1},{b:2}].find({a:1}); -> {a:1}
 *
 **/
export default function find(arr, match, context) {
  assertArray(arr);
  const matcher = getMatcher(match, context);
  let result;
  let found = false;
  // Native find visits all elements in sparse arrays
  // so using helper here instead.
  forEachSparse(arr, (el, i) => {
    if (matcher(el, i, arr)) {
      result = el;
      found = true;
    }
    return !found;
  })
  return result;
}
