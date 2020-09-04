import { assertArray } from '../util/assertions';

/**
 * Merges multiple arrays together in a "zipper" fashion where the elements of
 * the resulting array are "all elements at index 0", "all elements at index 1",
 * etc.
 *
 * @extra Useful when you have associated data that is split over separated
 *   arrays. If the arrays passed have more elements than the original array,
 *   they will be discarded. If they have fewer elements, the missing elements
 *   will filled with `null`.
 *
 * @returns {Array}
 *
 * @example
 *
 *   [1,2,3].zip([4,5,6]) -> [[1,2], [3,4], [5,6]]
 *
 **/
export default function zip(arr, ...args) {
  assertArray(arr);
  return arr.map((el, i) => {
    return [el, ...args.map((arr) => {
      return (i in arr) ? arr[i] : null;
    })];
  });
}
