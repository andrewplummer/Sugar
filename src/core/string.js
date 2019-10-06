import { createNamespace } from '../core';

export const String = createNamespace('String');

export const {
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = String;
