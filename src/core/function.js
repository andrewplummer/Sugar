import { createNamespace } from '../core';


/**
 * @class Function
 * @memberof module:function
 */
export const Function = createNamespace('Function');

export const {
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Function;
