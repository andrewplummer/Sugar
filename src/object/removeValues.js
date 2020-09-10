import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';
import { getMatcher } from '../util/matchers';

/**
 * Returns a new object without properties matching input.
 *
 * @extra This method will modify the object! For a non-destructive alias, use
 * `excludeValues`.
 *
 * @param {Object} obj - The object.
 * @param {any|matchFn} match - A matcher to determine how values are checked.
 * When a function is passed a truthy return value will match. Primitives will
 * directly match values. Can also be a Date object to match dates, a RegExp
 * which will test against strings, or a plain object which will perform a
 * "fuzzy match" on specific properties. Values of a fuzzy match can be any of
 * the matcher types listed above.
 *
 * @returns {Object}
 *
 * @callback matchFn
 *
 *   key  The key of the current entry.
 *   val  The value of the current entry.
 *   obj  A reference to the object.
 *
 * @example
 *
 *   Object.removeValues({a:1,b:2}, 1) -> {b:2}
 *   Object.removeValues({a:1,b:1}, 3) -> {a:1,b:1}
 *   Object.removeValues({a:'a',b:'b'}, /[a-f]) -> {}
 *   Object.removeValues(usersById, user => {
 *     return user.age > 30;
 *   }); -> an object with all users under 30
 *
 **/
export default function removeValues(obj, match) {
  assertObject(obj);
  if (arguments.length === 1) {
    throw new Error('Match parameter required');
  }
  const matcher = getMatcher(match);
  forEachProperty(obj, (key, val) => {
    if (matcher(val, key, obj)) {
      delete obj[key];
    }
  });
  return obj;
}
