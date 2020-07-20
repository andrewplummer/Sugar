import coerce from './util/coerce';
import getIndex from './util/getIndex';

/**
 * Returns a substring ending at a specific index.
 *
 * @param {string} str - The string.
 * @param {number|string} [to] - The index to end the substring. May also
 *   be a string will be searched on to get the index.
 *
 *
 * @example
 *
 *   'lucky charms'.to()    -> 'lucky charms'
 *   'lucky charms'.to(7)   -> 'lucky ch'
 *   'lucky charms'.to('y') -> 'luck'
 *
 * @returns {string}
 *
 **/
export default function to(str, to = str.length) {
  str = coerce(str);
  return str.slice(0, getIndex(str, to, false));
}
