import { assertArray } from '../util/assertions';
import { getMapper } from '../util/mappers';

/**
 * Gets the median average for values in the array.
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
 *   [1,2,5].median(); -> 2
 *   users.median((user) => user.votes) -> // median user votes
 *   users.median('votes')              -> // median user votes
 *   users.median('profile.likes')      -> // median profile likes
 *
 **/
export default function median(arr, map, context) {
  assertArray(arr);
  const len = arr.length;
  if (len === 0) {
    return 0;
  }
  const values = [];
  const mapper = getMapper(map, context);
  arr.forEach((el, i) => {
    values.push(mapper(el, i, arr));
  });
  values.sort((a, b) => {
    return a - b;
  });
  const mid = Math.trunc(len / 2);
  if (arr.length % 2 === 0) {
    return (values[mid - 1] + values[mid]) / 2;
  } else {
    return values[mid];
  }
}
