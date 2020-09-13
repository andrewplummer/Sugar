import { isSet as _isSet } from '../util/typeChecks';

/**
 * Returns `true` if the passed argument is a Set.
 *
 * @param {Object} obj - The object to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isSet(new Set()) -> true
 *   Object.isSet({}) -> false
 *
 **/
export default function isSet(obj) {
  return _isSet(obj);
}
