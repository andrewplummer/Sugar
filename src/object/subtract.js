import { assertObject } from '../util/assertions';
import { hasOwnProperty } from '../util/helpers';
import { isEqual } from '../util/equality';
import rejectKeys from './rejectKeys';

/**
 * Returns a new object with properties in the second object removed.
 *
 * @extra Both keys and values must be equal for the property to be removed.
 *   Values will be tested for deep equality.
 *
 * @param {Object} obj1 - The first object.
 * @param {Object} obj2 - The second object.
 *
 * @returns {Object}
 *
 * @example
 *
 *   Object.subtract({a:1,b:2}, {b:2}) -> {a:1}
 *   Object.subtract({a:1}, {a:2}) -> {a:1}
 *
 **/
export default function subtract(obj1, obj2) {
  assertObject(obj1);
  assertObject(obj2);
  return rejectKeys(obj1, (key, val) => {
    return hasOwnProperty(obj2, key) && isEqual(val, obj2[key]);
  });
}
