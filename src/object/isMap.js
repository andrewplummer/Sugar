import { isMap as _isMap } from '../util/typeChecks';

/**
 * Returns `true` if the passed argument is a Map.
 *
 * @param {Object} obj - The object to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isMap(new Map()) -> true
 *   Object.isMap({}) -> false
 *
 **/
export default function isMap(obj) {
  return _isMap(obj);
}
