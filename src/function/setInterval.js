import { assertFunction, assertNonNegativeInteger } from '../util/assertions';

/**
 * Executes the function every `ms` milliseconds.
 *
 * @extra This method can be thought of as an enhanced form of native
 * `setInterval`. It implements `setTimeout` under the hood which guarantees the
 * same period of idle time after execution has finished. Compare this to native
 * `setInterval` which runs the function every `ms`, even when execution itself
 * takes up a portion of that time. In most cases avoiding `setInterval` is
 * preferable as calls won't "back up" when the CPU is under strain, however
 * this also means that calls are less likely to happen at exact intervals,
 * so use case should be considered.
 *
 * @param {Function} fn - The function to execute.
 * @param {number} [ms] - The number of milliseconds to delay for each
 *   execution. Must be a positive integer. Default is `0`.
 * @param {...any} [args] - Any arguments passed in after `ms` will be applied
 *   when executing the function.
 *
 * @returns {CancelablePromise} - The returned promise has a `cancel` method
 *   on it that will cancel the execution and resolve the promise as well as
 *   a `canceled` property to determine if the interval was canceled. Note that
 *   the promise will never resolve unless canceled, however it may be rejected
 *   if an error in execution is encountered.
 *
 * @example
 *
 *   logHello.setInterval(500)     -> logs every 500ms
 *   logArgs.setInterval(500, 'a') -> logs "a" every 500ms
 *   await logHello.setInterval(500) -> will never resolve unless canceled
 *   logHello.setInterval(500).cancel() -> nothing happens
 *
 * @typedef {Promise} CancelablePromise
 * @property {Function} cancel - Will cancel the interval and resolve the
 * @property {boolean} canceled - Whether the promise was canceled.
 *
 **/
export default function setInterval(fn, ms = 0, ...args) {
  let cancel;

  assertFunction(fn);
  assertNonNegativeInteger(ms);

  const promise = new Promise((resolve, reject) => {
    let timer;

    function awaitNext() {
      timer = setTimeout(() => {
        try {
          fn.apply(null, args);
          if (!promise.canceled) {
            awaitNext();
          }
        } catch(err) {
          reject(err);
        }
      }, ms);
    }

    cancel = () => {
      clearTimeout(timer);
      promise.canceled = true;
      resolve();
    }

    awaitNext();
  });

  promise.cancel = cancel;
  promise.canceled = false;

  return promise;
}

