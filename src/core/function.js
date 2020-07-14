import { createNamespace } from '../core';

export const Function = createNamespace('Function');

export const {
  extend,
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Function;
