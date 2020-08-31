import { assertArray } from '../util/assertions';

/**
 * Returns a random element from the array.
 *
 * @param {Array} arr - The array.
 * @param {boolean} [remove = false] - When true the sampled element will be
 *   removed from the array.
 *
 * @returns {any}
 *
 * @example
 *
 *   [1,2,3,4].sample()     -> ?
 *   [1,2,3,4].sample(true) -> ? (returned value will be removed)
 *
 **/
export default function sample(arr, remove = false) {
  assertArray(arr);
  const index = Math.floor(Math.random() * arr.length);
  const el = arr[index];
  if (remove) {
    arr.splice(index, 1);
  }
  return el;
}
