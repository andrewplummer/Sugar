import { createNamespace } from '../core';

export const Number = createNamespace('Number')

export const {
  extend,
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Number;
