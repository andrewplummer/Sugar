import { isObject as _isObject } from '../util/typeChecks';

/**
 * Returns `true` if the passed argument is a plain object or any type that
 *   extends from `Object`.
 *
 * @extra This includes any plain objects, built-in objects such as arrays,
 *   dates, map, set, functions, wrapped primitives and class instances. Not
 *   included are primitives including `null`, `undefined`, and `NaN`.
 *
 * @param {Object} obj - The object to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isObject({}) -> true
 *   Object.isObject('a') -> false
 *   Object.isObject(null) -> false
 *
 **/
export default function isObject(obj) {
  return _isObject(obj);
}
