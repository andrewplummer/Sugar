import coerce from './util/coerce';

/**
 * Returns true if the string has length 0 or contains only whitespace.
 *
 * @param {string} str - The string.
 *
 * @example
 *
 *   ''.isBlank()    -> true
 *   '   '.isBlank() -> true
 *   'foo'.isBlank() -> false
 *
 * @returns {boolean}
 *
 **/
export default function isBlank(str) {
  str = coerce(str);
  return str.trim().length === 0;
}
