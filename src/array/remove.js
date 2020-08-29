import { getMatcher } from '../util/matchers';
import { assertArray } from '../util/assertions';
import { forEachSparse } from '../util/array';

/**
 * Removes an element from the array.
 *
 * @extra This method will modify the array! Use `exclude` for a
 *   non-destructive alias.
 *
 * @param {Array} arr - The array.
 * @param {any|searchFn} match - A matcher to find the elements to remove. When
 * a function is passed a truthy return value will match the element. Primitives
 * will directly match elements. Can also be a Date object to match dates, a
 * RegExp which will test against strings, or a plain object which will perform
 * a "fuzzy match" on specific properties. Values of a fuzzy match can be any of
 * the matcher types listed above.
 *
 * @returns {Array}
 *
 * @callback searchFn
 *
 *   el   The element of the current iteration.
 *   i    The index of the current iteration.
 *   arr  A reference to the array.
 *
 * @example
 *
 *   [1,2,3].remove(3)         -> [1,2]
 *   ['a','b','c'].remove(/b/) -> ['a','c']
 *   [{a:1},{b:2}].remove(function(n) {
 *     return n['a'] == 1;
 *   }); -> [{b:2}]
 *
 **/
export default function remove(arr, match) {
  assertArray(arr);
  const matcher = getMatcher(match);
  const indexes = [];
  forEachSparse(arr, (el, i) => {
    if (matcher(arr[i], i, arr)) {
      indexes.push(i);
    }
  });
  for (let i = 0, len = indexes.length; i < len; i++) {
    const idx = indexes[i];
    arr.splice(idx - i, 1);
  }
  return arr;
}
