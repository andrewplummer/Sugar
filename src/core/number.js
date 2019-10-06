import { createNamespace } from '../core';

export const Number = createNamespace('Number')

export const {
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Number;
