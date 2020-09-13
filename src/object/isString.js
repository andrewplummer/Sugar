import { isString as _isString } from '../util/typeChecks';

/**
 * Returns `true` if the passed argument is of string type.
 *
 * @extra This notably includes wrapped primitives created with `new String()`.
 *
 * @param {Object} obj - The object to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isString('a') -> true
 *   Object.isString('') -> true
 *   Object.isString(new String('a')) -> true
 *   Object.isString(5) -> false
 *
 **/
export default function isString(obj) {
  return _isString(obj);
}
