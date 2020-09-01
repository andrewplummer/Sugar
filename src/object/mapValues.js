import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';
import { getMapper } from '../util/mappers';

/**
 * Creates a new object with values that are the result of each enumerable
 * property running against a mapping function.
 *
 * @param {Object} obj - The object.
 * @param {string|mapFn} [map] - Determines the values to be mapped. `map` may
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
 *   Object.mapValues({1:{name:'John'},2:{name:'Frank'}}, (key, val) => val.name)
 *   Object.mapValues({1:{name:'John'},2:{name:'Frank'}}, 'name')
 *
 **/
export default function mapValues(obj, map) {
  assertObject(obj);
  if (arguments.length === 1) {
    throw new Error('Map parameter required');
  }
  const mapper = getMapper(map);
  const result = {};
  forEachProperty(obj, (key, val) => {
    result[key] = mapper(val, key, obj);
  });
  return result;
}
