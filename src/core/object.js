import { isMap, isObject } from '../util/typeChecks';
import { createNamespace } from '../core';

/**
 * Creates a new wrapped Object chainable.
 *
 * @param {Object} [obj] - The object to wrap. Will convert Map to an object.
 *   Will throw an error if a non-object is passed. Default is an empty object.
 *
 * @returns {SugarChainable<Object>}
 *
 * @example
 *
 *   new Sugar.Object();
 *   new Sugar.Object({a:1});
 *
 **/
const Namespace = createNamespace('Object', (obj = {}) => {
  if (isMap(obj)) {
    return Object.fromEntries(obj.entries());
  } else if (!isObject(obj)) {
    throw new Error('Object required');
  }
  return obj;
});

export const {
  extend,
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Namespace;
export { Namespace as Object };
