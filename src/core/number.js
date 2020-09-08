import { createNamespace } from '../core';

/**
 * Creates a new wrapped Number chainable.
 *
 * @param {any} [n] - The number to wrap. Non-numbers will be coerced.
 *   `0` by default.
 *
 * @returns {SugarChainable<number>}
 *
 * @example
 *
 *   new Sugar.Number();
 *   new Sugar.Number(5);
 *   new Sugar.Number('5');
 *
 **/
const Namespace = createNamespace('Number', (n = 0) => {
  return Number(n);
})

export const {
  extend,
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Namespace;
export { Namespace as Number };
