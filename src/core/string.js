import { createNamespace } from '../core';

/**
 * Creates a new wrapped String chainable.
 *
 * @param {any} [n] - The string to wrap. Non-strings will be coerced.
 *   `0` by default.
 *
 * @returns {SugarChainable<string>}
 *
 * @example
 *
 *   new Sugar.String();
 *   new Sugar.String('a');
 *   new Sugar.String(5);
 *
 **/
const Namespace = createNamespace('String', (str = '') => {
  return String(str);
});

export const {
  extend,
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Namespace;
export { Namespace as String };
