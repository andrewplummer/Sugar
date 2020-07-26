import {
  assertFunction,
  assertPositiveInteger,
  assertPositiveIntegerOrInfinity,
} from '../util/assertions';

const DEFAULT_OPTIONS = {
  limit: Infinity,
  immediate: true,
};

/**
 * Creates a "throttled" version of the function that will only be executed
 * once per `ms` milliseconds.
 *
 * @extra `throttle` is useful when multiple heavy operations need to be spaced
 * out or execution of a function needs to be locked for a given time period.
 *
 * @param {Function} fn - The function to throttle.
 * @param {number} ms - The delay to throttle the function by. Default is `1`.
 * @param {Object} [options] - Options to be passed to throttle.
 *
 * @param {number} [options.limit = Infinity] - The number of executions allowed
 *   in the queue while waiting. Set this option to a finite number if
 *   operations can be disregarded, effectively "locking" execution. Note that
 *   although debounce is nearly identical to a throttled function with a limit
 *   of `1`, the behavior is subtly different in that debounce will always take
 *   the arguments of the last execution, where a limit of `1` here will
 *   disregard them.
 * @param {boolean} [options.immediate = true] - Whether to perform the initial
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
export default function throttle(fn, ms = 1, options) {
  assertFunction(fn);
  assertPositiveInteger(ms);

  const opt = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  assertPositiveIntegerOrInfinity(opt.limit);

  const queue = [];
  let timer = null;
  let returnValue = null;

  function exec() {
    timer = null;
    const queuedFn = queue.shift();
    if (queuedFn) {
      returnValue = queuedFn();
      if (queue.length || opt.immediate) {
        wait();
      }
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
    } else if (queue.length < opt.limit - (opt.immediate ? 1 : 0)) {
      queue.push(fn.bind(this, ...arguments));
    }
    wait();
    return returnValue;
  };

  throttled.cancel = () => {
    clearTimeout(timer);
  };

  return throttled;
}
