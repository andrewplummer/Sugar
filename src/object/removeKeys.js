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
 * @param {...string|RegExp|Array<string>} - The keys to be removed. May be an array
 *   or a regex to test keys.
 *
 * @returns {Object}
 *
 * @example
 *
 *   Object.removeKeys({a:1,b:2}, 'a') -> {b:2}
 *   Object.removeKeys({a:1,b:2}, 'a', 'b') -> {}
 *   Object.removeKeys({a:1,b:1}, ['a', 'b']) -> {}
 *
 **/
export default function removeKeys(obj, ...args) {
  assertObject(obj);
  const matcher = getKeyMatcher(args);
  forEachProperty(obj, (key) => {
    if (matcher(key, obj)) {
      delete obj[key];
    }
  });
  return obj;
}
