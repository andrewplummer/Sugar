import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';
import { getMapper } from '../util/mappers';

/**
 * Gets the keys of the properties in the object with the minimum value.
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
 *   Object.minKeys({a:1,b:79,c:80}) -> ['a']
 *   Object.minKeys({a:1,b:1,c:2}) -> ['a','b']
 *   Object.minKeys({1:{likes:28},2:{likes:10},3:{likes:4}}, (key, val) => val.likes) -> ['3']
 *   Object.minKeys({1:{likes:28},2:{likes:10},3:{likes:4}}, 'likes') -> ['3']
 *   Object.minKeys(usersById, 'profile.likes') -> keys of the users with the fewest profile likes
 *
 **/
export default function minKeys(obj, map) {
  assertObject(obj);
  const mapper = getMapper(map);
  let minVal;
  let minKeys;
  forEachProperty(obj, (key, val) => {
    val = mapper(val, key, obj);
    if (!minKeys || val < minVal) {
      minVal = val;
      minKeys = [key];
    } else if (val === minVal) {
      minKeys.push(key);
    }
  });
  return minKeys || [];
}
