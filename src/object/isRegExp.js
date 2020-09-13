import { isRegExp as _isRegExp } from '../util/typeChecks';

/**
 * Returns `true` if the passed argument is a RegExp.
 *
 * @param {Object} obj - The object to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isRegExp(/abc/) -> true
 *   Object.isRegExp({}) -> false
 *
 **/
export default function isRegExp(obj) {
  return _isRegExp(obj);
}
