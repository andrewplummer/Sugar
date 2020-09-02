import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';
import { getMatcher } from '../util/matchers';

/**
 * Returns the first key whose value matches input.
 *
 * @param {Object} obj - The object.
 * @param {any|searchFn} match - A matcher to determine how values are checked.
 * When a function is passed a truthy return value will match. Primitives will
 * directly match values. Can also be a Date object to match dates, a RegExp
 * which will test against strings, or a plain object which will perform a
 * "fuzzy match" on specific properties. Values of a fuzzy match can be any of
 * the matcher types listed above.
 *
 * @returns {string|undefined}
 *
 * @example
 *
 *   Object.findKey({a:1,b:2}, 1) -> 'a'
 *   Object.findKey({a:1,b:1}, 3) -> undefined
 *   Object.findKey({a:'a',b:'b'}, /[a-f]) -> 'a'
 *   Object.findKey(usersById, user => {
 *     return user.age > 30;
 *   }); -> the id of the first user older than 30
 *
 **/
export default function findKey(obj, match) {
  assertObject(obj);
  if (arguments.length === 1) {
    throw new Error('Match parameter required');
  }
  const matcher = getMatcher(match);
  let found;
  forEachProperty(obj, (key, val) => {
    if (matcher(val, key, obj)) {
      found = key;
    }
    return !found;
  });
  return found;
}
