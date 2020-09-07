import { assertNonNegativeInteger, assertFunction } from '../util/assertions';

/**
 * Constructs an array of `n` length from the values returned by the provided
 * function.
 *
 * @param {number} n - The intended length of the array.
 * @param {indexMapFn} fn - The function whose return values determine resulting
 *   elements in the array.
 *
 * @returns {Array}
 *
 * @callback indexMapFn
 *
 *   i  The index of the current iteration.
 *
 * @example
 *
 *   Array.construct(4, (i) => {
 *     return i * i;
 *   }); -> [0, 1, 4]
 *
 **/
export default function construct(n, fn) {
  assertNonNegativeInteger(n);
  assertFunction(fn);
  return Array.from(new Array(n), (el, i) => fn(i));
}
