import some from './some';

/**
 * Returns true if no elements in the array match input.
 *
 * @param {Array} arr - The array.
 * @param {any|searchFn} match - A matcher to determine elements that will be
 * checked. When a function is passed a truthy return value will match the
 * element. Primitives will directly match elements. Can also be a Date object
 * to match dates, a RegExp which will test against strings, or a plain object
 * which will perform a "fuzzy match" on specific properties. Values of a fuzzy
 * match can be any of the matcher types listed above.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   ['a','b','c'].none('a') -> false
 *   ['a','b','c'].none('d') -> true
 *   ['a','b','c'].none(/n-z/) -> true
 *   users.none(function(user) {
 *     return user.age > 30;
 *   }); -> true if no users are older than 30
 *
 **/
export default function none(...args) {
  return !some(...args);
}

