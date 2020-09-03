import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';
import { getMapper } from '../util/mappers';

/**
 * Sums values in the object.
 *
 * @param {Object} obj - The object.
 * @param {string|mapFn} [map] - Determines the values to be summed. `map` may
 * be a string serving as a shortcut. Implements deep property mapping.
 *
 * @returns {number}
 *
 * @callback mapFn
 *
 *   key  The key of the current entry.
 *   val  The value of the current entry.
 *   obj  A reference to the object.
 *
 * @example
 *
 *   Object.sum({a:1,b:2}) -> 3
 *   Object.sum({1:{likes:28},2:{likes:15}}, (key, val) => val.likes) -> 43
 *   Object.sum({1:{likes:28},2:{likes:15}}, 'likes') -> 43
 *   Object.sum(usersById, 'profile.likes') -> sum of profile likes
 *
 **/
export default function sum(obj, map) {
  assertObject(obj);
  const mapper = getMapper(map);
  let sum = 0;
  forEachProperty(obj, (key, val) => {
    sum += mapper(val, key, obj);
  });
  return sum;
}
