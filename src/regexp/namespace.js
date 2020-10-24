import { createNamespace } from '../core';
import { isRegExp } from '../util/typeChecks';
import { escapeRegExp } from '../util/regexp';

/**
 * Creates a new wrapped RegExp chainable.
 *
 * @param {RegExp} reg - The regex to wrap. Will throw an error if not
 *   provided.
 *
 * @returns {SugarChainable<RegExp>}
 *
 * @example
 *
 *   new Sugar.RegExp(/abc/);
 *
 **/
const Namespace = createNamespace('RegExp', (arg) => {
  if (!arg) {
    throw new TypeError('RegExp required');
  } else if (!isRegExp(arg)) {
    return RegExp(escapeRegExp(String(arg)));
  } else {
    return arg;
  }
});

export const {
  extend,
  defineStatic,
  defineInstance,
  defineStaticAlias,
  defineInstanceAlias,
} = Namespace;
export { Namespace as RegExp };
