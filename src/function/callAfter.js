import filter from './filter';
import createLockFilter from './util/createLockFilter';

/**
 * Calls the function after a specific condition is reached.
 *
 * @param {Function} fn - The function to filter.
 * @param {Function|number} condition - Can be either a function or a positive
 *   integer. If a function is passed `fn` will be called after it returns true.
 *   If a number is passed, `fn` will be called after that many invocations
 *   (>= the number) of the returned function.
 *
 * @returns {Function}
 *
 * @example
 *
 *   var fn = logArgs.callAfter((n) => n > 1);
 *   fn(1); -> not called
 *   fn(2); -> called
 *   fn(1); -> called
 *
 *   var fn = logArgs.callAfter(3):
 *   fn(); -> not called
 *   fn(); -> not called
 *   fn(); -> called
 *   fn(); -> called
 *
 **/
export default function callAfter(fn, condition) {
  return filter(fn, createLockFilter(condition, true));
}
