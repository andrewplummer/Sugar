import { assertArray } from '../util/assertions';
import { getMapper } from '../util/mappers';

/**
 * Returns the element in the array with the highest value.
 *
 * @param {Array} arr - The array.
 * @param {string|mapFn} [map] - When passed, determines the values to compare.
 * A function may be passed here similar to `Array#map` or a string acting as a
 * shortcut. Strings implement deep property matching.
 * @param {any} [context] - The `this` argument to be passed to the mapping
 * function.
 *
 * @returns {any}
 *
 * @callback mapFn
 *
 *   el   The element of the current iteration.
 *   i    The index of the current iteration.
 *   arr  A reference to the array.
 *
 * @example
 *
 *   [1,2,3].max(); -> 3
 *   users.max((user) => user.votes) -> // user object with max votes
 *   users.max('votes')              -> // user object with max votes
 *   users.max('profile.likes')      -> // user object with max profile likes
 *
 **/
export default function max(arr, map, context) {
  assertArray(arr);
  let max;
  let found;
  const mapper = getMapper(map, context);
  arr.forEach((el, i) => {
    const val = mapper(el, i, arr);
    if (i === 0 || val > max) {
      max = val;
      found = el;
    }
  });
  return found;
}
