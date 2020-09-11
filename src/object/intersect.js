import { assertObject } from '../util/assertions';
import { hasOwnProperty, forEachProperty } from '../util/helpers';

/**
 * Returns a new object with only properties that both objects have in common.
 *
 * @param {Object} obj1 - The first object.
 * @param {Object} obj2 - The second object.
 * @param {resolverFn} [resolver] - A function to determine the value when an
 *   intersection occurs. If this is not provided will take the value of the
 *   second object.
 *
 * @returns {Object}
 *
 * @callback resolverFn
 *
 *   key  The key of the current entry.
 *   val1 The value in `obj1` for the current entry.
 *   val2 The value in `obj2` for the current entry.
 *   obj1 A reference to `obj1`.
 *   obj2 A reference to `obj2`.
 *
 * @example
 *
 *   Object.intersect({a:1}, {a:1,b:2}) -> {a:1}
 *   Object.intersect({a:1}, {a:2}) -> {a:1}
 *   Object.intersect({a:1}, {a:2}, (key, n1, n2) => n1 + n2) -> {a:3}
 *
 **/
export default function intersect(obj1, obj2, resolver) {
  assertObject(obj1);
  assertObject(obj2);
  const result = {};
  forEachProperty(obj1, (key) => {
    if (hasOwnProperty(obj2, key)) {
      let val;
      if (resolver) {
        val = resolver(key, obj1[key], obj2[key], obj1, obj2);
      } else {
        val = obj2[key];
      }
      result[key] = val;
    }
  });
  return result;
}
