import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';
import { getMapper } from '../util/mappers';

/**
 * Creates a new object with keys that are the result of each enumerable
 * property running against a mapping function.
 *
 * @param {Object} obj - The object.
 * @param {string|mapFn} [map] - Determines the keys to be mapped. `map` may
 * be a string serving as a shortcut. Implements deep property mapping.
 *
 * @returns {Object}
 *
 * @callback mapFn
 *
 *   key  The key of the current entry.
 *   val  The value of the current entry.
 *   obj  A reference to the object.
 *
 * @example
 *
 *   Object.mapKeys({1:{name:'John'},2:{name:'Frank'}}, (key, val) => val.name)
 *   Object.mapKeys({1:{name:'John'},2:{name:'Frank'}}, 'name')
 *
 **/
export default function mapKeys(obj, map) {
  assertObject(obj);
  if (arguments.length === 1) {
    throw new Error('Map parameter required');
  }
  const mapper = getMapper(map);
  const result = {};
  forEachProperty(obj, (key, val) => {
    result[mapper(val, key, obj)] = val;
  });
  return result;
}
