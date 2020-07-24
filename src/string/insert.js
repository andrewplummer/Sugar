import coerce from './util/coerce';
import { coalesceNull } from '../util/lang';

/**
 * Inserts a substring within a string.
 *
 * @param {string} str - The string.
 * @param {string} substr - The substring to be inserted.
 * @param {number} [index] - The index to insert the string at. When negative
 *   will insert from the end of the string. When omitted will concat to the
 *   end of the string.
 *
 * @example
 *
 *   'dopamine'.insert('e', 3)       -> dopeamine
 *   'spelling eror'.insert('r', -3) -> spelling error
 *
 **/
export default function insert(str, substr = '', index) {
  str = coerce(str);
  index = coalesceNull(index, str.length);
  return str.slice(0, index) + substr + str.slice(index);
}
