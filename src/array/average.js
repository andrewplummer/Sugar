import { assertArray } from '../util/assertions';
import { forEachSparse } from '../util/array';
import { getMapper } from '../util/mappers';

/**
 * Gets the mean average for values in the array.
 *
 * @param {Array} arr - The array.
 * @param {string|mapFn} [map] - When passed, determines the values to average.
 * A function may be passed here similar to `Array#map` or a string acting as a
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
 *   [1,2,3].average(); -> 2
 *   users.average((user) => user.votes) -> // average user votes
 *   users.average('votes')              -> // average user votes
 *   users.average('profile.likes')      -> // average profile likes
 *
 **/
export default function average(arr, map) {
  assertArray(arr);
  if (arr.length === 0) {
    return 0;
  }
  let sum = 0;
  const mapper = getMapper(map);
  forEachSparse(arr, (el, i) => {
    sum += mapper(arr[i], i, arr);
  });
  return sum / arr.length;
}
