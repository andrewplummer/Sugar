import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';
import { getMapper } from '../util/mappers';

/**
 * Gets the key of the property in the object with the minimum value.
 *
 * @param {Object} obj - The object.
 * @param {string|mapFn} [map] - Determines the value to be checked. `map` may
 * be a string serving as a shortcut. Implements deep property mapping.
 *
 * @returns {string}
 *
 * @callback mapFn
 *
 *   key  The key of the current entry.
 *   val  The value of the current entry.
 *   obj  A reference to the object.
 *
 * @example
 *
 *   Object.minKey({a:1,b:79,c:80}) -> 'a'
 *   Object.minKey({1:{likes:28},2:{likes:10},3:{likes:4}}, (key, val) => val.likes) -> '3'
 *   Object.minKey({1:{likes:28},2:{likes:10},3:{likes:4}}, 'likes') -> '3'
 *   Object.minKey(usersById, 'profile.likes') -> key of the user with the fewest profile likes
 *
 **/
export default function minKey(obj, map) {
  assertObject(obj);
  const mapper = getMapper(map);
  let minVal;
  let minKey;
  forEachProperty(obj, (key, val) => {
    val = mapper(val, key, obj);
    if (!minKey || val < minVal) {
      minVal = val;
      minKey = key;
    }
  });
  return minKey;
}
