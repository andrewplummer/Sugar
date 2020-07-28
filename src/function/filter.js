import { assertFunction } from '../util/assertions';

/**
 * Filters calls to a function.
 *
 * @param {Function} fn - The function to filter.
 * @param {Function} filter - The filter function. When this function returns a
 *   truthy value, `fn` will be called with the same arguments and context. If
 *   it returns a falsy value the call will be ignored.
 *
 * @example
 *
 *   logArgs.filter((n) => n > 1)(0) -> ignored
 *   logArgs.filter((n) => n > 1)(5) -> logs
 *
 **/
export default function filter(fn, filter) {
  assertFunction(fn);
  assertFunction(filter);
  return function() {
    if (filter.apply(this, arguments)) {
      return fn.apply(this, arguments);
    }
  }
}
