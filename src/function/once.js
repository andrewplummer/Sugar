/**
 * Creates a function that will execute only once and store the result.
 *
 * @extra `once` is useful for creating functions that will cache the result
 *        of an expensive operation and use it on subsequent calls. Also it
 *        can be useful for creating initialization functions that only need
 *        to be run once.
 *
 * @param {Function} fn - The function to cache.
 *
 * @example
 *
 *   var fn = logHello.once();
 *   runTenTimes(fn); -> logs once
 *
 **/
export default function once(fn) {
  let val;
  let called = false;
  return function memoized() {
    if (called) {
      return val;
    } else {
      called = true;
      val = fn.apply(this, arguments);
      return val;
    }
  }
}
