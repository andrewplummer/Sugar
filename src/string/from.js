import coerce from './util/coerce';
import getIndex from './util/getIndex';

/**
 * Returns a substring starting from a specific index.
 *
 * @param {string} str - The string.
 * @param {number|string} [from] - The index to begin the substring. May also
 *   be a string will be searched on to get the index.
 *
 *
 * @example
 *
 *   'lucky charms'.from()     -> 'lucky charms'
 *   'lucky charms'.from(7)    -> 'harms'
 *   'lucky charms'.from('ch') -> 'charms'
 *
 * @returns {string}
 *
 **/
export default function from(str, from = 0) {
  str = coerce(str);
  return str.slice(getIndex(str, from, true));
}
