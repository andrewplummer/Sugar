import { createNamespace } from '../core';

/**
 * Creates a new wrapped Array chainable.
 *
 * @param {any} [arr] - The array to wrap. If a non-array iterable such as a
 *   string is passed it will be converted to an array with `Array.from`.
 *   Default is an empty array.
 *
 * @returns {SugarChainable<Array>}
 *
 * @example
 *
 *   new Sugar.Array();
 *   new Sugar.Array([1,2,3]);
 *   new Sugar.Array('abc');
 *
 **/
const Namespace = createNamespace('Array', (...args) => {
  if (args.length) {
    return Array.from(args.length > 1 ? args : args[0]);
  }
  return [];
});

export const {
  extend,
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Namespace;
export { Namespace as Array };
