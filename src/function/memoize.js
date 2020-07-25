import { hasOwnProperty } from '../util/helpers';

/**
 * Creates a function that will memoize results for unique calls.
 *
 * @extra `memoize` can be thought of as a more powerful `once`. Where `once`
 * will only call a function once ever, memoized functions will be
 * called once per "unique" call, which can be customized.
 *
 * @param {Function} fn - The function to memoize.
 * @param {Function} [hashFn] - The hash function. This function should return
 *   a string that will become the cache key. If the result of a previous call
 *   to the returned function has the same key, the cached value will be used.
 *   By default the first argument will coerced to a string and used as the
 *   cache key.
 *
 * @returns {Function}
 *
 * @callback hashFn
 * @param {...any} args - The arguments passed to the input function.
 * @returns {string}    - The string that will determine the cache key.
 *
 * @example
 *
 *   var fn = logHello.memoize();
 *   fn(1); fn(1); fn(2); -> logs twice, memoizing once
 *
 *   var fn = calculateUserBalance.memoize('id');
 *   fn(Harry); fn(Mark); fn(Mark); -> logs twice, memoizing once
 *
 */
export default function memoize(fn, hashFn) {
  const cache = {};
  hashFn = hashFn || defaultHashFn;
  return function memoized() {
    const key = hashFn.apply(this, arguments);
    if (hasOwnProperty(cache, key)) {
      return cache[key];
    }
    return cache[key] = fn.apply(this, arguments);
  };
}

function defaultHashFn(arg) {
  return arg;
}
