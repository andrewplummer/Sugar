import { createNamespace } from '../core';

// Webpack has an issue with calling Object()
// on exported modules, creating a conflict
// here, so need to rename.
const Namespace = createNamespace('Object');

export const {
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Namespace;

export { Namespace as Object }
