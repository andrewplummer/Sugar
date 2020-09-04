import { assertArray } from '../util/assertions';
import unique from './unique';

/**
 * Returns a new array containing elements in all passed arrays with duplicates
 * removed.
 *
 * @param {Array} arr - The array.
 * @param {...Array} - Arrays passed as arguments here will be merged into the
 * result containing the elements of the first array. Elements are deeply
 * checked in a way that any plain objects that cannot be observably
 * distinguished are considered unique. Note that functions, class instances,
 * and browser host objects are not serialized and are only unique by reference.
 *
 * @returns {Array}
 *
 * @example
 *
 *   [1,2].union([2,3]) -> [1,2,3]
 *   [user1, user2].union([user2, user3]) -> [user1, user2, user3]
 *   [user1].union([user2], [user3]) -> [user1, user2, user3]
 *
 **/
export default function union(...args) {
  for (let arg of args) {
    assertArray(arg);
  }
  return unique([].concat(...args));
}
