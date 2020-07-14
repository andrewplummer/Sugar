import { createNamespace } from '../core';

export const String = createNamespace('String');

export const {
  extend,
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = String;
