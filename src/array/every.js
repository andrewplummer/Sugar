import { getMatcher } from '../util/matchers';
import { assertArray } from '../util/assertions';

const nativeFn = Array.prototype.every;

/**
 * Returns true if every element in the array matches input.
 *
 * @param {Array} arr - The array.
 * @param {any|matchFn} match - A matcher to determine elements that will be
 * checked. When a function is passed a truthy return value will match the
 * element. Primitives will directly match elements. Can also be a Date object
 * to match dates, a RegExp which will test against strings, or a plain object
 * which will perform a "fuzzy match" on specific properties. Values of a fuzzy
 * match can be any of the matcher types listed above.
 *
 * @returns {boolean}
 *
 * @callback matchFn
 *
 *   el   The element of the current iteration.
 *   i    The index of the current iteration.
 *   arr  A reference to the array.
 *
 * @example
 *
 *   ['a','b','c'].every('a') -> false
 *   ['a','a','a'].every('a') -> true
 *   ['a','b','c'].every(/a-f/) -> true
 *   users.every(function(user) {
 *     return user.age > 30;
 *   }); -> true if every user is older than 30
 *
 **/
export default function every(arr, match, context) {
  assertArray(arr);
  if (arguments.length === 1) {
    throw new Error('Match parameter is required');
  }
  return nativeFn.call(arr, getMatcher(match, context));
}

