import { assertArray } from '../util/assertions';
import { forEachSparse } from '../util/array';
import { getMapper } from '../util/mappers';

/**
 * Sums values in the array.
 *
 * @param {Array} arr - The array.
 * @param {string|mapFn} [map] - When passed, determines the values to sum. A
 * function may be passed here similar to `Array#map` or a string acting as a
 * shortcut. Strings implement deep property matching.
 *
 * @returns {number}
 *
 * @callback mapFn
 *
 *   el   The element of the current iteration.
 *   i    The index of the current iteration.
 *   arr  A reference to the array.
 *
 * @example
 *
 *   [1,2,3].sum(); -> 6
 *   users.sum((user) => user.votes) -> // total user votes
 *   users.sum('votes')              -> // total user votes
 *   users.sum('profile.likes')      -> // total profile likes
 *
 **/
export default function sum(arr, map) {
  assertArray(arr);
  let sum = 0;
  const mapper = getMapper(map);
  forEachSparse(arr, (el, i) => {
    sum += mapper(arr[i], i, arr);
  });
  return sum;
}
