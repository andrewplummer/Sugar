import { assertPlainObject } from '../util/object';
import { forEachProperty } from '../util/helpers';

/**
 * Creates a new object with the keys and values swapped.
 *
 * @extra If duplicated values exist the keys will be overwritten.
 *
 * @param {Object} obj - The object. Will throw an error if not a plain object.
 *
 * @returns {Object}
 *
 * @example
 *
 *   Object.invert({a:1}) -> {1:'a'}
 *
 **/
export default function invert(obj) {
  assertPlainObject(obj);
  const result = {};
  forEachProperty(obj, (key, val) => {
    result[val] = key;
  });
  return result;
}
