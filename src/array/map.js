import { assertArray } from '../util/assertions';
import { getMapper } from '../util/mappers';

/**
 * Creates a new array whose values of are the result of a mapper function or
 * shortcut.
 *
 * @param {Array} arr - The array.
 * @param {string|mapFn} [map] - Determines the values to be mapped. `map` may
 * be a string serving as a shortcut. Implements deep property mapping.
 * @param {any} [context] - The `this` argument to be passed to the mapping
 * function.
 *
 * @returns {Array}
 *
 * @callback mapFn
 *
 *   el   The element of the current iteration.
 *   i    The index of the current iteration.
 *   arr  A reference to the array.
 *
 * @example
 *
 *   [1,2,3].map(n => n * 2) -> [2,4,6]
 *   ['a','aa','aaa'].map('length') -> [1,2,3]
 *   users.map('age') -> an array containing user ages
 *   users.map('profile.likes') -> an array containing profile like counts
 *
 **/
export default function map(arr, map, context) {
  assertArray(arr);
  if (arguments.length === 1) {
    throw new Error('Map parameter is required');
  }
  return arr.map(getMapper(map), context);
}

