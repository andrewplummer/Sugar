import { createNamespace } from '../core';

/**
 * Creates a new wrapped RegExp chainable.
 *
 * @param {RegExp} reg - The regex to wrap. Will throw an error if not
 *   provided.
 *
 * @returns {SugarChainable<RegExp>}
 *
 * @example
 *
 *   new Sugar.RegExp(/abc/);
 *
 **/
const Namespace = createNamespace('RegExp', (reg) => {
  if (!reg) {
    throw new TypeError('RegExp required');
  }
  return reg;
});

export const {
  extend,
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Namespace;
export { Namespace as RegExp };
