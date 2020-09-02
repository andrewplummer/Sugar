import { assertObject } from '../util/assertions';
import { hasOwnProperty } from '../util/helpers';

/**
 * Returns a new object with keys not matching input.
 *
 * @extra This method will modify the object! For a non-destructive alias, use
 * `exclude`.
 *
 * @param {Object} obj - The object.
 * @param {...string|Array} - The keys to be removed. May be an array.
 *
 * @returns {Object}
 *
 * @example
 *
 *   Object.remove({a:1,b:2}, 'a') -> {b:2}
 *   Object.remove({a:1,b:2}, 'a', 'b') -> {}
 *   Object.remove({a:1,b:1}, ['a', 'b']) -> {}
 *
 **/
export default function remove(obj, ...args) {
  assertObject(obj);
  args = args.flat();
  for (let arg of args) {
    if (hasOwnProperty(obj, arg)) {
      delete obj[arg];
    }
  }
  return obj;
}
