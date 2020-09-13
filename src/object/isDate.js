import { isDate as _isDate } from '../util/typeChecks';

/**
 * Returns `true` if the passed argument is a Date.
 *
 * @param {Object} obj - The object to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isDate(new Date()) -> true
 *   Object.isDate(5) -> false
 *
 **/
export default function isDate(obj) {
  return _isDate(obj);
}
