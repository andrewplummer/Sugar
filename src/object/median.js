import { assertObject } from '../util/assertions';
import { forEachProperty } from '../util/helpers';
import { getMapper } from '../util/mappers';

/**
 * Gets the median average for values in the object.
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
 *   Object.median({a:1,b:79,c:80}) -> 79
 *   Object.median({1:{likes:28},2:{likes:10},3:{likes:4}}, (key, val) => val.likes) -> 10
 *   Object.median({1:{likes:28},2:{likes:10},3:{likes:4}}, 'likes') -> 10
 *   Object.median(usersById, 'profile.likes') -> median average of profile likes
 *
 **/
export default function median(obj, map) {
  assertObject(obj);
  const mapper = getMapper(map);
  const values = [];
  forEachProperty(obj, (key, val) => {
    values.push(mapper(val, key, obj));
  });
  if (values.length === 0) {
    return 0;
  }
  values.sort((a, b) => {
    return a - b;
  });
  const mid = Math.trunc(values.length / 2);
  if (values.length % 2 === 0) {
    return (values[mid - 1] + values[mid]) / 2;
  } else {
    return values[mid];
  }
}
