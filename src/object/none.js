import { assertObject } from '../util/assertions';
import some from './some';

/**
 * Returns true if no value in the object matches input.
 *
 * @param {Object} obj - The object.
 * @param {any|searchFn} match - A matcher to determine how values are checked.
 * When a function is passed a truthy return value will match. Primitives will
 * directly match values. Can also be a Date object to match dates, a RegExp
 * which will test against strings, or a plain object which will perform a
 * "fuzzy match" on specific properties. Values of a fuzzy match can be any of
 * the matcher types listed above.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.none({a:1,b:2}, 1) -> false
 *   Object.none({a:1,b:2}, 3) -> true
 *   Object.none({a:'a',b:'b'}, /[a-f]) -> false
 *   Object.none(usersById, user => {
 *     return user.age > 30;
 *   }); -> true if no users are older than 30
 *
 **/
export default function none(obj, ...args) {
  assertObject(obj);
  return !some(obj, ...args);
}
