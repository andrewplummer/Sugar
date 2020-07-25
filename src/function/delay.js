import scheduleDelay from './util/scheduleDelay';

/**
 * Executes the function after `ms` milliseconds.
 *
 * @extra Returns a reference to itself. `delay` is also a way to execute non-
 *        blocking operations that will wait until the CPU is free.
 *
 * @param {Function} fn - The function to execute.
 * @param {number} [ms] - The number of milliseconds to delay before executing
 *   the function. Must be a positive integer. Default is `0`.
 * @param {...any} [args] - Any arguments passed in after the delay will be
 *   applied when executing the function.
 *
 * @returns {Function} - The returned function has a `cancel` method on it that
 *   will cancel the execution.
 *
 * @example
 *
 *   logHello.delay(500)     -> logs after 500ms
 *   logArgs.delay(500, 'a') -> logs "a" after 500ms
 *
 **/
export default function delay(fn, ms = 0, ...args) {
  return scheduleDelay(fn, ms, args);
}
