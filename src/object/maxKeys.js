import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';
import { getMapper } from '../util/mappers';

/**
 * Gets the keys of the properties in the object with the maximum value.
 *
 * @param {Object} obj - The object.
 * @param {string|mapFn} [map] - Determines the value to be checked. `map` may
 * be a string serving as a shortcut. Implements deep property mapping.
 *
 * @returns {Array<string>}
 *
 * @callback mapFn
 *
 *   key  The key of the current entry.
 *   val  The value of the current entry.
 *   obj  A reference to the object.
 *
 * @example
 *
 *   Object.maxKeys({a:1,b:79,c:80}) -> ['c']
 *   Object.maxKeys({a:1,b:2,c:2}) -> ['b','c']
 *   Object.maxKeys({1:{likes:28},2:{likes:10},3:{likes:4}}, (key, val) => val.likes) -> ['1']
 *   Object.maxKeys({1:{likes:28},2:{likes:10},3:{likes:4}}, 'likes') -> ['1']
 *   Object.maxKeys(usersById, 'profile.likes') -> keys of the users with the most profile likes
 *
 **/
export default function maxKeys(obj, map) {
  assertObject(obj);
  const mapper = getMapper(map);
  let maxVal;
  let maxKeys;
  forEachProperty(obj, (key, val) => {
    val = mapper(val, key, obj);
    if (!maxKeys || val > maxVal) {
      maxVal = val;
      maxKeys = [key];
    } else if (val === maxVal) {
      maxKeys.push(key);
    }
  });
  return maxKeys || [];
}
