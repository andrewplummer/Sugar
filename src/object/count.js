import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';
import { getMatcher } from '../util/matchers';

/**
 * Counts properties in the object matching input.
 *
 * @param {Object} obj - The object.
 * @param {any|searchFn} match - A matcher to determine how values are counted.
 * When a function is passed a truthy return value will match. Primitives will
 * directly match values. Can also be a Date object to match dates, a RegExp
 * which will test against strings, or a plain object which will perform a
 * "fuzzy match" on specific properties. Values of a fuzzy match can be any of
 * the matcher types listed above.
 *
 * @returns {Object}
 *
 * @example
 *
 *   Object.count({a:1,b:2}, 1) -> 1
 *   Object.count({a:1,b:1}, 3) -> 0
 *   Object.count({a:'a',b:'b'}, /[a-f]) -> 2
 *   Object.count(usersById, user => {
 *     return user.age > 30;
 *   }); -> returns the number of users over 30
 *
 **/
export default function count(obj, match) {
  assertObject(obj);
  if (arguments.length === 1) {
    throw new Error('Match parameter required');
  }
  const matcher = getMatcher(match);
  let count = 0;
  forEachProperty(obj, (key, val) => {
    if (matcher(val, key, obj)) {
      count += 1;
    }
  });
  return count;
}