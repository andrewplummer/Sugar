import { assertObject } from '../util/assertions';
import { getKeyMatcher } from '../util/keys';
import { forEachProperty } from '../util/helpers';

/**
 * Returns a new object with keys not matching input.
 *
 * @extra This method will modify the object! For a non-destructive alias, use
 * `exclude`.
 *
 * @param {Object} obj - The object.
 * @param {string|matchFn|RegExp|Array<string>} match - The key(s) to be
 *   removed. May be an array or a regex to test keys. When a function is
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
 *   Object.removeKeys({a:1,b:2}, 'a') -> {b:2}
 *   Object.removeKeys({a:1,b:2}, 'a', 'b') -> {}
 *   Object.removeKeys({a:1,b:1}, ['a', 'b']) -> {}
 *
 **/
export default function removeKeys(obj, match) {
  assertObject(obj);
  const matcher = getKeyMatcher(match);
  forEachProperty(obj, (key) => {
    if (matcher(key, obj[key], obj)) {
      delete obj[key];
    }
  });
  return obj;
}
