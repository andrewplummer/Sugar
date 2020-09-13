import { isBoolean as _isBoolean } from '../util/typeChecks';

/**
 * Returns `true` if the passed argument is of boolean type.
 *
 * @extra This notably includes wrapped primitives created with `new Boolean()`.
 *
 * @param {Object} obj - The object to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isBoolean(true) -> true
 *   Object.isBoolean(false) -> true
 *   Object.isBoolean(new Boolean(true)) -> true
 *   Object.isBoolean('a') -> false
 *   Object.isBoolean(5) -> false
 *
 **/
export default function isBoolean(obj) {
  return _isBoolean(obj);
}
