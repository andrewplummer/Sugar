import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';

/**
 * Returns a new object with keys not matching input.
 *
 * @param {Object} obj - The object.
 * @param {...string|Array} - The keys to be excluded. May be an array.
 *
 * @returns {Object}
 *
 * @example
 *
 *   Object.exclude({a:1,b:2}, 'a') -> {b:2}
 *   Object.exclude({a:1,b:2}, 'a', 'b') -> {}
 *   Object.exclude({a:1,b:1}, ['a', 'b']) -> {}
 *
 **/
export default function exclude(obj, ...args) {
  assertObject(obj);
  args = args.flat();
  const result = {};
  forEachProperty(obj, (key, val) => {
    if (!args.includes(key)) {
      result[key] = val;
    }
  });
  return result;
}
