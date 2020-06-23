/** @module */

/**
 * Creates a function that will memoize results for unique calls.
 * `memoize` can be thought of as a more powerful `once`. Where `once`
 * will only call a function once ever, memoized functions will be
 * called once per unique call. A "unique call" is determined by the
 * return value of [hashFn], which is passed the arguments of each call.
 * If [hashFn] is undefined, it will deeply serialize all arguments,
 * such that any different argument signature will result in a unique
 * call. [hashFn] may be a string (allows `deep properties`) that acts
 * as a shortcut to return a property of the first argument passed.
 * [limit] sets an upper limit on memoized results. The default is no
 * limit, meaning that unique calls will continue to memoize results.
 * For most use cases this is fine, however [limit] is useful for more
 * persistent (often server-side) applications for whom memory leaks
 * are a concern.
 *
 * @example
 *
 *   var fn = logHello.memoize();
 *   fn(1); fn(1); fn(2); -> logs twice, memoizing once
 *
 *   var fn = calculateUserBalance.memoize('id');
 *   fn(Harry); fn(Mark); fn(Mark); -> logs twice, memoizing once
 *
 * @param {Function} fn - The function to memoize.
 * @param {Function} [hashFn] - The function to memoize.
 *
 * @method memoize
 * @static
 *
 */
export default function memoize(fn, hashFn) {
  const cache = {};
  hashFn = hashFn || defaultHashFn;
  return function memoized() {
    const key = hashFn.apply(this, arguments);
    if (cache.hasOwnProperty(key)) {
      return cache[key];
    }
    return cache[key] = fn.apply(this, arguments);
  };
}

function defaultHashFn(arg) {
  return arg;
}
