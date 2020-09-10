import { assertObject } from '../util/assertions';
import { getKeyMatcher } from '../util/keys';
import { forEachProperty } from '../util/helpers';

/**
 * Returns a new object with keys matching input.
 *
 * @param {Object} obj - The object.
 * @param {string|matchFn|RegExp|Array<string>} match - The key(s) to be
 *   selected. May be an array or a regex to test keys. When a function is
 *   passed a truthy return value will match.
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
 *   Object.selectKeys({a:1,b:2}, 'a') -> {a:1}
 *   Object.selectKeys({a:1,b:2}, 'a', 'b') -> {a:1,b:2}
 *   Object.selectKeys({a:1,b:1}, ['a', 'b']) -> {a:1,b:2}
 *
 **/
export default function selectKeys(obj, match) {
  assertObject(obj);
  const result = {};
  const matcher = getKeyMatcher(match);
  forEachProperty(obj, (key, val) => {
    if (matcher(key, obj[key], obj)) {
      result[key] = val;
    }
  });
  return result;
}
