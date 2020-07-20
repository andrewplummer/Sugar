import coerce from './util/coerce';
import { normalizeFullWidth } from '../util/fullWidth';

/**
 * Converts the string into a number.
 *
 * @extra This method exists primarily to smooth over edge cases when parsing
 * numbers. It will attempt to quickly parse the number up front and fall back
 * to a more robust algorithm. Its (slightly) slower form has built-in behavior
 * of handling trailing characters, hex notation (0xFF), and scientific notation
 * (1e10), and can additionally handle numbers with thousands separators as well
 * as full-width numbers.
 *
 * @param {string} str - The string.
 * @param {number} [base] - An integer between 2 and 36 that represents the base
 *   (radix) of the string.
 *
 * @example
 *
 *   '153'.toNumber()    -> 153
 *   '12,000'.toNumber() -> 12000
 *   '10px'.toNumber()   -> 10
 *   '0xFF'.toNumber(16) -> 255
 *   'ff'.toNumber(16)   -> 255
 *
 **/
export default function toNumber(str, base) {
  let n;
  if (!base || base === 10) {
    // Try to return up front quickly.
    n = +str;
  }
  if (!n) {
    // If parsing fails then try a more thorough
    // check. Note that number coercion can also
    // fail with a result of 0, so ensure that
    // is checked as well.
    n = toNumberSlower(str, base);
  }
  return n;
}

function toNumberSlower(str, base) {
  str = coerce(str);
  str = str.replace(/,/g, '');
  str = normalizeFullWidth(str);
  if (base) {
    return parseInt(str, base);
  } else {
    return parseFloat(str);
  }
}
