import { isPrimitive as _isPrimitive } from '../util/typeChecks';

/**
 * Returns `true` if the passed argument is a primitive.
 *
 * @extra This notably includes `null`, `undefined`, and `NaN`. It does not
 *   include wrapped primitives created with `new String()`, `new Number()`, etc.
 *
 * @param {Object} obj - The object to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.isPrimitive('a') -> true
 *   Object.isPrimitive(5) -> true
 *   Object.isPrimitive(true) -> true
 *   Object.isPrimitive(null) -> true
 *   Object.isPrimitive({}) -> true
 *
 **/
export default function isPrimitive(obj) {
  if (!arguments.length) {
    return false;
  }
  return _isPrimitive(obj);
}
