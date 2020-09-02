import { assertObject } from '../util/assertions';
import { hasOwnProperty } from '../util/helpers';

/**
 * Returns a new object with keys matching input.
 *
 * @param {Object} obj - The object.
 * @param {...string|Array} - The keys to be included. May be an array.
 *
 * @returns {Object}
 *
 * @example
 *
 *   Object.filter({a:1,b:2}, 'a') -> {a:1}
 *   Object.filter({a:1,b:2}, 'a', 'b') -> {a:1,b:2}
 *   Object.filter({a:1,b:1}, ['a', 'b']) -> {a:1,b:2}
 *
 **/
export default function filter(obj, ...args) {
  assertObject(obj);
  args = args.flat();
  const result = {};
  for (let arg of args) {
    if (hasOwnProperty(obj, arg)) {
      result[arg] = obj[arg];
    }
  }
  return result;
}
