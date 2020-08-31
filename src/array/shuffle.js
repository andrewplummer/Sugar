import { assertArray } from '../util/assertions';

/**
 * Returns a copy of the array with the elements randomized.
 *
 * @extra Uses Fisher-Yates algorithm.
 *
 * @param {Array} arr - The array.
 * @returns {Array}
 *
 * @example
 *
 *   [1,2,3,4].shuffle()  -> [?,?,?,?]
 *
 **/
export default function shuffle(arr) {
  assertArray(arr);
  arr = [...arr];
  let i = arr.length;
  let j;
  let x;
  while(i) {
    j = (Math.random() * i) | 0;
    x = arr[--i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
}
