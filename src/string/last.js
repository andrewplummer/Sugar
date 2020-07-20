import { assertInteger } from '../util/assertions';
import coerce from './util/coerce';

/**
 * Returns the last n characters of the string.
 *
 * @param {string} str - The string.
 * @param {number} [n] - The target string length. Default is `1`.
 *
 * @example
 *
 *   'lucky charms'.first()  -> 'l'
 *   'lucky charms'.first(3) -> 'luc'
 *
 * @returns {string}
 *
 **/
export default function first(str, n = 1) {
  assertInteger(n);
  str = coerce(str);
  const start = str.length - n < 0 ? 0 : str.length - n;
  return str.substr(start);
}
