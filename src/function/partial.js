import { assertFunction } from '../util/assertions';

const PLACEHOLDER = Symbol('placeholder');

/**
 * Returns a new version of the function which has part of its arguments
 * pre-emptively filled in, also known as "currying".
 *
 * @extra Optionally allows a placeholder to be replaced with invoked arguments.
 * This allows currying of arguments even when they occur toward the end of an
 * argument list.
 *
 * @param {Function} fn - The function to apply arguments to.
 * @param {...any} [args] - The arguments to curry to the resulting function. If
 *   any of these arguments are equal to `partial.replace` they will serve a
 *   placeholder.
 *
 * @example
 *
 *   logArgs.partial('a')('b') -> logs a, b
 *   logArgs.partial(logArgs.partial.replace, 'b')('a') -> logs a, b
 *
 **/
export default function partial(fn, ...curriedArgs) {
  assertFunction(fn);

  const partialFn = function(...invokedArgs) {
    const args = [];
    let startIndex = 0;

    for (let arg of curriedArgs) {
      if (arg === PLACEHOLDER) {
        args.push(invokedArgs[startIndex++]);
      } else {
        args.push(arg);
      }
    }

    for (let i = startIndex; i < invokedArgs.length; i++) {
      args.push(invokedArgs[i]);
    }

    // If the bound "this" object is an instance of the partialed
    // function, then "new" was used, so preserve the prototype
    // so that constructor functions can also be partialed.
    if (this instanceof partialFn) {
      const self = Object.create(fn.prototype);
      const result = fn.apply(self, args);
      // An explicit return value is allowed from constructors
      // as long as they are of "object" type, so return the
      // correct result here accordingly.
      return typeof result === 'object' ? result : self;
    }

    return fn.apply(this, args);
  }

  return partialFn;
}

partial.replace = PLACEHOLDER;
