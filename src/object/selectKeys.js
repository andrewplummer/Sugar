import { assertObject } from '../util/assertions';
import { getKeyMatcher } from '../util/keys';
import { forEachProperty } from '../util/helpers';

/**
 * Returns a new object with keys matching input.
 *
 * @param {Object} obj - The object.
 * @param {...string|RegExp|Array<string>} - The keys to be selected. May be an array
 *   or a regex to test keys.
 *
 * @returns {Object}
 *
 * @example
 *
 *   Object.selectKeys({a:1,b:2}, 'a') -> {a:1}
 *   Object.selectKeys({a:1,b:2}, 'a', 'b') -> {a:1,b:2}
 *   Object.selectKeys({a:1,b:1}, ['a', 'b']) -> {a:1,b:2}
 *
 **/
export default function selectKeys(obj, ...args) {
  assertObject(obj);
  const result = {};
  const matcher = getKeyMatcher(args);
  forEachProperty(obj, (key, val) => {
    if (matcher(key, obj)) {
      result[key] = val;
    }
  });
  return result;
}
