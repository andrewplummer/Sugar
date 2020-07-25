import coerce from './util/coerce';

const PLANE_MAX = Math.pow(2, 16);

/**
 * Converts the string to an array of character codes. Handles multi-byte
 * unicode sequences.
 *
 * @extra Note that this method requires `String#toCodePoint`,
 * which may require a polyfill in some environments.
 *
 * @param {string} str - The string.
 *
 * @example
 *
 *   'foo'.toCodes() -> [102, 111, 111]
 *   '🍺'.toCodes()  -> [127866]
 *
 **/
export default function toCodes(str = '') {
  str = coerce(str);
  const codes = [];
  for (let i = 0, len = str.length; i < len; i++) {
    const code = str.codePointAt(i);
    codes.push(code);
    if (code >= PLANE_MAX) {
      // Increment the index again if the character is multi-byte.
      i += 1;
    }
  }
  return codes;
}
