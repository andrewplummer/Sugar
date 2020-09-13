import { isArray as _isArray } from '../util/typeChecks';

/**
 * Returns `true` if the passed argument is a plain array.
 *
 * @extra This does not include typed arrays. For this use `isTypedArray`
 *   instead. This method is included for parity with other type check
 *   methods and is an alias for `Array.isArray`.
 *
 * @param {Object} obj - The object to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isArray([]) -> true
 *   Object.isArray({}) -> false
 *   Object.isArray(new Uint8Array()) -> false
 *
 **/
export default function isArray(obj) {
  return _isArray(obj);
}
