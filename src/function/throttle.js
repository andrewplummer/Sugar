import {
  assertPositiveInteger,
  assertPositiveIntegerOrInfinity,
} from '../util/assertions';

const DEFAULT_OPTIONS = {
  limit: Infinity,
  immediate: false,
};

/**
 * Creates a "throttled" version of the function that will only be executed
 * `limit` times per `ms` milliseconds. `throttle` is useful when multiple
 * heavy operations need to be spaced out or execution of a function needs
 * to be locked for a given time period.
 *
 * Note that `throttle` is subtly different to `debounce`, as the function
 * will receive the first arguments before it was locked, where `debounce`
 * will receive the last.
 *
 * @param {Function} fn - The function to throttle.
 * @param {number} ms - The delay to throttle the function by.
 * @param {Object} [options] - Options to be passed to throttle.
 *
 * @param {number} [options.limit = 1] - The number of executions allowed before
 *   waiting.
 * @param {string} [options.immediate = false] - Whether to perform the initial
 *   execution immediately before waiting.
 *
 * @example
 *
 *   var fn = throttle(logHello, 50);
 *   runTenTimes(fn); // Will only log once
 *
 * @returns {Function}
 *
 */
export default function throttle(fn, ms = 0, options) {

  const opt = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  assertPositiveInteger(ms);
  assertPositiveIntegerOrInfinity(opt.limit);

  const queue = [];
  let timer = null;
  let returnValue = null;

  function exec() {
    timer = null;
    const queuedFn = queue.shift();
    if (queuedFn) {
      returnValue = queuedFn();
    }
    if (queue.length) {
      wait();
    }
  }

  function wait() {
    if (!isWaiting()) {
      timer = setTimeout(exec, ms);
    }
  }

  function isWaiting() {
    return timer !== null;
  }

  const throttled = function() {
    if (opt.immediate && !isWaiting()) {
      returnValue = fn.apply(this, arguments);
      wait();
    } else if (queue.length < opt.limit - (opt.immediate ? 1 : 0)) {
      queue.push(fn.bind(this, ...arguments));
      wait();
    }
    return returnValue;
  };

  throttled.cancel = () => {
    clearTimeout(timer);
  };

  return throttled;
}
