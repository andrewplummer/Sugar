import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';
import { getMapper } from '../util/mappers';

/**
 * Gets the mean average for values in the object.
 *
 * @param {Object} obj - The object.
 * @param {string|mapFn} [map] - Determines the values to be averaged. `map` may
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
 *   Object.average({a:1,b:2,c:3}) -> 2
 *   Object.average({1:{likes:28},2:{likes:16}}, (key, val) => val.likes) -> 22
 *   Object.average({1:{likes:28},2:{likes:16}}, 'likes') -> 22
 *   Object.average(usersById, 'profile.likes') -> average of profile likes
 *
 **/
export default function average(obj, map) {
  assertObject(obj);
  const mapper = getMapper(map);
  let sum = 0;
  let count = 0;
  forEachProperty(obj, (key, val) => {
    sum += mapper(val, key, obj);
    count += 1;
  });
  if (count === 0) {
    return 0;
  }
  return sum / count;
}
