import { createNamespace } from '../core';

export const Array = createNamespace('Array');

export const {
  extend,
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Array;
