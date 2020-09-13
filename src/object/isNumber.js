import { isNumber as _isNumber } from '../util/typeChecks';

/**
 * Returns `true` if the passed argument is of number type.
 *
 * @extra This notably (and somewhat confusingly) includes `NaN`. It also
 * includes wrapped primitives created with `new Number()`.
 *
 * @param {Object} obj - The object to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isNumber(5) -> true
 *   Object.isNumber(NaN) -> true
 *   Object.isNumber(new Number(5)) -> true
 *   Object.isNumber('a') -> false
 *
 **/
export default function isNumber(obj) {
  return _isNumber(obj);
}
