import coerce from './util/coerce';

const WHITESPACE_REG = /\s+/g;
const NON_SPACE_REG = /[^\u0020\u3000]/;

/**
 * Compacts whitespace in the string to a single space and trims the ends.
 *
 * @param {string} str - The string.
 *
 * @example
 *
   *   'too \n much \n space'.compact() -> 'too much space'
   *   'enough \n '.compact()           -> 'enough'
 *
 * @returns {strin}
 *
 **/
export default function compact(str) {
  str = coerce(str);
  return str.trim().replace(WHITESPACE_REG, (whitespace) => {
    return whitespace.replace(NON_SPACE_REG, '').charAt(0) || ' ';
  });
}
