import { isNaN } from '../util/typeChecks';
import { assertArray } from '../util/assertions';

/**
 * Returns a new array with all instances of `null`, `undefined`, and `NaN`
 * removed.
 *
 * @param {Array} arr - The array.
 *
 * @returns {Array}
 *
 * @example
 *
 *   [1,null,2].compact() -> [1,2]
 *   [1,NaN,2].compact() -> [1,2]
 *   [1,undefined,2].compact() -> [1,2]
 *   [0,1,2].compact() -> [0,1,2]
 *
 **/
export default function compact(arr) {
  assertArray(arr);
  return arr.filter((el) => el != null && !isNaN(el));
}
