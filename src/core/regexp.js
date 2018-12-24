import Sugar, { createNamespace } from '../core';

createNamespace('RegExp');

export const {
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Sugar.RegExp;

export default Sugar.RegExp;
