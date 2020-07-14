import { createNamespace } from '../core';

export const RegExp = createNamespace('RegExp');

export const {
  extend,
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = RegExp;
