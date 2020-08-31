import { assertArray } from '../util/assertions';
import { getMapper } from '../util/mappers';

/**
 * Sums values in the array.
 *
 * @param {Array} arr - The array.
 * @param {string|mapFn} [map] - When passed, determines the values to sum. A
 * function may be passed here similar to `Array#map` or a string acting as a
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
 *   [1,2,3].sum(); -> 6
 *   users.sum((user) => user.votes) -> // total user votes
 *   users.sum('votes')              -> // total user votes
 *   users.sum('profile.likes')      -> // total profile likes
 *
 **/
export default function sum(arr, map, context) {
  assertArray(arr);
  let sum = 0;
  const mapper = getMapper(map, context);
  arr.forEach((el, i) => {
    sum += mapper(el, i, arr);
  });
  return sum;
}
