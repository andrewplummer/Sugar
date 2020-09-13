import { isTypedArray as _isTypedArray } from '../util/typeChecks';

/**
 * Returns `true` if the passed argument is a typed array.
 *
 * @extra This does not include plain arrays. For this use `isArray` instead.
 *
 * @param {Object} obj - The object to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isTypedArray(new Uint8Array()) -> true
 *   Object.isTypedArray([]) -> false
 *   Object.isTypedArray({}) -> false
 *
 **/
export default function isTypedArray(obj) {
  return _isTypedArray(obj);
}
