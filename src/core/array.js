import { createNamespace } from '../core';

export const Array = createNamespace('Array');

export const {
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Array;
