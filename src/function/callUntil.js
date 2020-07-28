import filter from './filter';
import createLockFilter from './util/createLockFilter';

/**
 * Calls the function until a specific condition is reached.
 *
 * @param {Function} fn - The function to filter.
 * @param {Function|number} condition - Can be either a function or a positive
 *   integer. If a function is passed `fn` will be called until it returns true.
 *   If a number is passed, `fn` will be called until that many invocations
 *   (>= the number) of the returned function.
 *
 * @returns {Function}
 *
 * @example
 *
 *   var fn = logArgs.callUntil((n) => n > 1);
 *   fn(1); -> called
 *   fn(2); -> not called
 *   fn(1); -> not called
 *
 *   var fn = logArgs.callUntil(3):
 *   fn(); -> called
 *   fn(); -> called
 *   fn(); -> not called
 *   fn(); -> not called
 *
 **/
export default function callUntil(fn, condition) {
  return filter(fn, createLockFilter(condition, false));
}
