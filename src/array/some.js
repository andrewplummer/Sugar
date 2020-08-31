import { getMatcher } from '../util/matchers';
import { assertArray } from '../util/assertions';

const nativeFn = Array.prototype.some;

/**
 * Returns true if any element in the array matches input.
 *
 * @param {Array} arr - The array.
 * @param {any|searchFn} match - A matcher to determine elements that will be
 * checked. When a function is passed a truthy return value will match the
 * element. Primitives will directly match elements. Can also be a Date object
 * to match dates, a RegExp which will test against strings, or a plain object
 * which will perform a "fuzzy match" on specific properties. Values of a fuzzy
 * match can be any of the matcher types listed above.
 * @param {any} [context] - The `this` argument to be passed to the matching
 * function.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   ['a','b','c'].some('a') -> true
 *   ['a','b','c'].some('d') -> false
 *   ['a','b','c'].some(/a-f/) -> true
 *   users.some(function(user) {
 *     return user.age > 30;
 *   }); -> true if any user is older than 30
 *
 **/
export default function some(arr, match, context) {
  assertArray(arr);
  if (arguments.length === 1) {
    throw new Error('Match parameter is required');
  }
  return nativeFn.call(arr, getMatcher(match, context));
}

