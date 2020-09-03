import { assertObject, assertFunction } from '../util/assertions';
import { forEachProperty } from '../util/helpers';

/**
 * Executes a reducer function for each property of the object, resulting in a
 * single output value.
 *
 * @param {Object} obj - The object.
 * @param {eachFn} fn - The function to be called for each iteration.
 * @param {any} [initial] - The value to be used as the initial accumulator on
 *   the first iteration. If no argument is passed, the first value encountered
 *   will be used. If no argument is passed and the object is empty, will throw
 *   a TypeError.
 *
 * @returns {any}
 *
 * @callback reduceFn
 * @param {any} acc - The accumulator value of the current iteration.
 * @param {string} key - The key of the current iteration.
 * @param {any} val - The value of the current iteration.
 * @param {Object} obj - A reference to the object.
 *
 * @example
 *
 *   Object.reduce({a:1,b:2,c:3}, (acc, key, val) => {
 *     return acc + val;
 *   }, 0); -> 6
 *
 **/
export default function reduce(obj, fn, initial) {
  assertObject(obj);
  assertFunction(fn);
  let acc = initial;
  let assign = arguments.length === 2;
  forEachProperty(obj, (key, val) => {
    if (assign) {
      acc = val;
      assign = false;
    } else {
      acc = fn(acc, key, val, obj);
    }
  });
  if (assign) {
    throw new TypeError('Empty object with no initial value');
  }
  return acc;
}
