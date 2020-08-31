import { assertArray } from '../util/assertions';
import { getMapper } from '../util/mappers';

/**
 * Gets the mean average for values in the array.
 *
 * @param {Array} arr - The array.
 * @param {string|mapFn} [map] - When passed, determines the values to average.
 * A function may be passed here similar to `Array#map` or a string acting as a
 * shortcut. Strings implement deep property matching.
 * @param {any} [context] - The `this` argument to be passed to the mapping
 * function.
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
export default function average(arr, map, context) {
  assertArray(arr);
  if (arr.length === 0) {
    return 0;
  }
  let sum = 0;
  const mapper = getMapper(map, context);
  arr.forEach((el, i) => {
    sum += mapper(el, i, arr);
  });
  return sum / arr.length;
}
