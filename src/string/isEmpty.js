import coerce from './util/coerce';

/**
 * Returns true if the string has length 0.
 *
 * @param {string} str - The string.
 *
 * @example
 *
   *   ''.isEmpty()  -> true
   *   'a'.isEmpty() -> false
   *   ' '.isEmpty() -> false
 *
 * @returns {boolean}
 *
 **/
export default function isBlank(str) {
  str = coerce(str);
  return str.length === 0;
}
