import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';
import { getMatcher } from '../util/matchers';

/**
 * Returns true if any value in the object matches input.
 *
 * @param {Object} obj - The object.
 * @param {any|matchFn} match - A matcher to determine how values are checked.
 * When a function is passed a truthy return value will match. Primitives will
 * directly match values. Can also be a Date object to match dates, a RegExp
 * which will test against strings, or a plain object which will perform a
 * "fuzzy match" on specific properties. Values of a fuzzy match can be any of
 * the matcher types listed above.
 *
 * @returns {boolean}
 *
 * @callback matchFn
 *
 *   key  The key of the current entry.
 *   val  The value of the current entry.
 *   obj  A reference to the object.
 *
 * @example
 *
 *   Object.some({a:1,b:2}, 1) -> true
 *   Object.some({a:1,b:2}, 3) -> false
 *   Object.some({a:'a',b:'b'}, /[a-f]) -> true
 *   Object.some(usersById, user => {
 *     return user.age > 30;
 *   }); -> true if any user is older than 30
 *
 **/
export default function some(obj, match) {
  assertObject(obj);
  if (arguments.length === 1) {
    throw new Error('Match parameter required');
  }
  const matcher = getMatcher(match);
  let result = false;
  forEachProperty(obj, (key, val) => {
    if (matcher(val, key, obj)) {
      result = true;
    }
    return !result;
  });
  return result;
}
