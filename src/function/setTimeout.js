import { assertFunction, assertNonNegativeInteger } from '../util/assertions';

export default ((globalSetTimeout) => {

  /**
   * Executes the function after `ms` milliseconds.
   *
   * @extra This method can be thought of as an enhanced form of native
   * `setTimeout`. It will return a promise that can be used with async/await.
   * Additionally the returned promise will have a `cancel` method on it that
   * can be used to cancel the timeout.
   *
   * @param {Function} fn - The function to execute.
   * @param {number} [ms] - The number of milliseconds to delay before executing
   *   the function. Must be a positive integer. Default is `0`.
   * @param {...any} [args] - Any arguments passed in after `ms` will be applied
   *   when executing the function.
   *
   * @returns {CancelablePromise} - The returned promise has a `cancel` method
   *   on it that will cancel the execution and resolve the promise as well as
   *   a `canceled` property to determine if the timeout was canceled.
   *
   * @example
   *
   *   logHello.setTimeout(500)     -> logs after 500ms
   *   logArgs.setTimeout(500, 'a') -> logs "a" after 500ms
   *   await logHello.setTimeout(500) -> will await the delay
   *   logHello.setTimeout(500).cancel() -> nothing happens
   *
   * @typedef {Promise} CancelablePromise
   * @property {Function} cancel - Will cancel the timeout and resolve the
   * @property {boolean} canceled - Whether the promise was canceled.
   *
   **/
  return function setTimeout(fn, ms = 0, ...args) {
    let cancel;
    assertFunction(fn);
    assertNonNegativeInteger(ms);

    const promise = new Promise((resolve, reject) => {
      const timer = globalSetTimeout(() => {
        try {
          fn.apply(null, args);
          resolve();
        } catch(err) {
          reject(err);
        }
      }, ms);
      cancel = () => {
        clearTimeout(timer);
        promise.canceled = true;
        resolve();
      }
    });

    promise.cancel = cancel;
    promise.canceled = false;

    return promise;
  }
})(setTimeout);
