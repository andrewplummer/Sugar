import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';
import { getMatcher } from '../util/matchers';

/**
 * Returns a new object with properties matching input.
 *
 * @param {Object} obj - The object.
 * @param {any|searchFn} match - A matcher to determine how values are checked.
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
 *   Object.filterValues({a:1,b:2}, 1) -> {a:1}
 *   Object.filterValues({a:1,b:1}, 3) -> {}
 *   Object.filterValues({a:'a',b:'b'}, /[a-f]) -> {a:'a',b:'b'}
 *   Object.filterValues(usersById, user => {
 *     return user.age > 30;
 *   }); -> an object with all users over 30
 *
 **/
export default function filterValues(obj, match) {
  assertObject(obj);
  if (arguments.length === 1) {
    throw new Error('Match parameter required');
  }
  const matcher = getMatcher(match);
  const result = {};
  forEachProperty(obj, (key, val) => {
    if (matcher(val, key, obj)) {
      result[key] = val;
    }
  });
  return result;
}
