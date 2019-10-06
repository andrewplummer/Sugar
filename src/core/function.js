import { createNamespace } from '../core';

export const Function = createNamespace('Function');

export const {
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Function;
