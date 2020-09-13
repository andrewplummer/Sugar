import { isFunction as _isFunction } from '../util/typeChecks';

/**
 * Returns `true` if the passed argument is a Function.
 *
 * @param {Object} obj - The object to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isFunction(() => {}) -> true
 *   Object.isFunction('a') -> false
 *
 **/
export default function isFunction(obj) {
  return _isFunction(obj);
}
