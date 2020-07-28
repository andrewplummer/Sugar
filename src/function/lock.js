import { assertFunction } from '../util/assertions';

/**
 * Locks the number of arguments accepted by the function.
 *
 * @extra Note that when using with other methods that bind arguments such as
 * `Function#bind` or `partial` this method needs to be called first in the
 * chain to prevent bound arguments from being passed.
 *
 * @param {Function} fn - The function to lock.
 * @param {number} [n] - The arity (number of arguments) to lock the function
 *   to. If not passed it will be the `.length` of the function.
 *
 * @example
 *
 *   logArgs.lock(2)(1,2,3) -> logs 1,2
 *
 **/
export default function lock(fn, n = fn.length) {
  assertFunction(fn);
  return function(...args) {
    return fn.apply(this, args.slice(0, n));
  }
}
