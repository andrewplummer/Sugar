import { assertObject } from '../util/assertions';
import { getKeyMatcher } from '../util/keys';
import { forEachProperty } from '../util/helpers';

/**
 * Returns a new object with keys not matching input.
 *
 * @param {Object} obj - The object.
 * @param {...string|RegExp|Array<string>} - The keys to be rejected. May be an array
 *   or a regex to test keys.
 *
 * @returns {Object}
 *
 * @example
 *
 *   Object.rejectKeys({a:1,b:2}, 'a') -> {b:2}
 *   Object.rejectKeys({a:1,b:2}, 'a', 'b') -> {}
 *   Object.rejectKeys({a:1,b:1}, ['a', 'b']) -> {}
 *
 **/
export default function rejectKeys(obj, ...args) {
  assertObject(obj);
  const result = {};
  const matcher = getKeyMatcher(args);
  forEachProperty(obj, (key, val) => {
    if (!matcher(key, obj)) {
      result[key] = val;
    }
  });
  return result;
}
