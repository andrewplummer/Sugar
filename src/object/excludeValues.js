import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';
import { getMatcher } from '../util/matchers';

/**
 * Returns a new object without properties matching input.
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
 *   Object.excludeValues({a:1,b:2}, 1) -> {b:2}
 *   Object.excludeValues({a:1,b:1}, 3) -> {a:1,b:1}
 *   Object.excludeValues({a:'a',b:'b'}, /[a-f]) -> {}
 *   Object.excludeValues(usersById, user => {
 *     return user.age > 30;
 *   }); -> an object with all users under 30
 *
 **/
export default function excludeValues(obj, match) {
  assertObject(obj);
  if (arguments.length === 1) {
    throw new Error('Match parameter required');
  }
  const matcher = getMatcher(match);
  const result = {};
  forEachProperty(obj, (key, val) => {
    if (!matcher(val, key, obj)) {
      result[key] = val;
    }
  });
  return result;
}
