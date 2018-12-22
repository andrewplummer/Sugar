import { createNamespace } from '../core';

const namespace = createNamespace('Number');

export const {
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = namespace;

export default namespace;
