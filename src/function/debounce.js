import { assertFunction, assertPositiveInteger } from '../util/assertions';

/**
 * Creates a "debounced" function that invokes only the last (or optionally
 * first) execution in a given period of `ms` milliseconds.
 *
 * @extra This method is useful to execute a function after things have
 * "settled down". A good example of this is when a user tabs quickly through
 * form fields, an action can be taken once they have settled on a field.
 * Note that this is similar to `throttle` with a limit of 1, with the
 * exception that a debounced function will receive the last arguments
 * supplied, while a throttled function will receive the first.
 *
 * @param {Function} fn - The function to debounce.
 * @param {number} [ms] - The delay to debounce the function by. Default is `1`.
 * @param {boolean} [immediate] - Whether to execute immediately before waiting.
 *   Default is `false`.
 *
 * @example
 *
 *   var fn = debounce(logHello, 250)
 *   runTenTimes(fn); -> called once 250ms later
 *
 * @returns {Function}
 *
 */
export default function debounce(fn, ms = 1, immediate = false) {
  assertFunction(fn);
  assertPositiveInteger(ms);

  let timer = null;
  let returnValue = null;

  function wait(fn) {
    timer = setTimeout(() => {
      timer = null;
      if (fn) {
        returnValue = fn();
      }
    }, ms);
  }

  function isWaiting() {
    return timer !== null;
  }

  const debounced = function () {
    if (immediate && !isWaiting()) {
      returnValue = fn.apply(this, arguments);
      wait();
    } else {
      clearTimeout(timer);
      wait(fn.bind(this, ...arguments));
    }
    return returnValue;
  };

  debounced.cancel = () => {
    clearTimeout(timer);
  };

  return debounced;
}
