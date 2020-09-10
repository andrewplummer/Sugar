import { getMatcher } from '../util/matchers';
import { assertArray } from '../util/assertions';

const nativeFn = Array.prototype.filter;

/**
 * Returns a new array with matched elements.
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
 *   [1,2,3].filter(2)         -> [2]
 *   ['a','b','c'].filter(/[ac]/) -> ['a','c']
 *   [{a:1},{b:2}].filter(function(n) {
 *     return n['a'] == 1;
 *   }); -> [{a:1}]
 *   [{a:1},{b:2}].filter({a:1}); -> [{a:1}]
 *
 **/
export default function filter(arr, match, context) {
  assertArray(arr);
  return nativeFn.call(arr, getMatcher(match, context));
}
