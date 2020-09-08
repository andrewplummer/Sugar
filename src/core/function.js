import { createNamespace } from '../core';

/**
 * Creates a new wrapped Function chainable.
 *
 * @param {Function} fn - The function to wrap. Will throw an error if not
 *   provided.
 *
 * @returns {SugarChainable<Function>}
 *
 * @example
 *
 *   new Sugar.Function(() => {});
 *
 **/
const Namespace = createNamespace('Function', (fn) => {
  if (!fn) {
    throw new Error('Function required');
  }
  return fn;
});

export const {
  extend,
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Namespace;
export { Namespace as Function };
