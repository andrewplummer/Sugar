/**
 * Creates a function that will memoize results for unique calls.
 *
 * @extra `memoize` can be thought of as a more powerful `once`. Where `once`
 * will only call a function once ever, memoized functions will be
 * called once per "unique" call, which can be customized. Custom cache control
 * can also be achieved by the `cache` property on the memoized function.
 *
 * @param {Function} fn - The function to memoize.
 * @param {Function} [hashFn] - The hash function. This function should return
 *   a string that will become the cache key. If the result of a previous call
 *   to the returned function has the same key, the cached value will be used.
 *   By default the first argument will coerced to a string and used as the
 *   cache key.
 *
 * @returns {Function} - The returned function will have a `cache` property
 *   defined on it of type Map, allowing clearing, setting, or removing items
 *   from the cache.
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
  const cache = new Map();
  hashFn = hashFn || defaultHashFn;
  const memoizedFn = function memoized() {
    const key = hashFn.apply(this, arguments);
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      const val = fn.apply(this, arguments);
      cache.set(key, val);
      return val;
    }
  };
  memoizedFn.cache = cache;
  return memoizedFn;
}

function defaultHashFn(arg) {
  return arg;
}
