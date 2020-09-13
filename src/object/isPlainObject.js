import { isPlainObject as _isPlainObject } from '../util/object';

/**
 * Returns `true` if the passed argument is a "plain" object, created with
 *   bracket syntax.
 *
 * @extra This notably does not include arrays, dates, map, set, functions,
 *   wrapped primitives, class instances, `null`, `undefined`, or `NaN`.
 *
 * @param {Object} obj - The object to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isPlainObject({}) -> true
 *   Object.isPlainObject('a') -> false
 *   Object.isPlainObject(null) -> false
 *   Object.isPlainObject(new Map()) -> false
 *
 **/
export default function isPlainObject(obj) {
  return _isPlainObject(obj);
}
