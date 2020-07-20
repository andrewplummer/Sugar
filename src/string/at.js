import { getEntryAtIndex } from '../util/index';
import coerce from './util/coerce';

/**
 * Gets the character(s) at a given index.
 *
 * @param {string} str - The string to convert.
 * @param {number|Array<number>} index - The index to get the character(s) at.
 *   Will search from the end of the string when negative. An array may also be
 *   passed which will return an array of entries at all indexes.
 * @param {boolean} [loop] - When `true` will loop from the beginning/end of
 *   the string. When `false` overshooting string bounds will return an empty
 *   string. Default is `false`.
 *
 * @example
 *
 *   'jumpy'.at(0)             -> 'j'
 *   'jumpy'.at(2)             -> 'm'
 *   'jumpy'.at(5)             -> ''
 *   'jumpy'.at(5, true)       -> 'j'
 *   'jumpy'.at(-1)            -> 'y'
 *   'lucky charms'.at([2, 4]) -> ['u','k']
 *
 * @returns {string|Array<string>}
 *
 **/
export default  function at(str, index, loop) {
  str = coerce(str);
  return getEntryAtIndex(str, index, loop);
}
