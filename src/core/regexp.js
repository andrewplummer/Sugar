import { createNamespace } from '../core';

export const RegExp = createNamespace('RegExp');

export const {
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = RegExp;
