// TODO: revisit this
export * from '../core/util/helpers';
import { hasOwnProperty } from '../core/util/helpers';

const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

export function forEachProperty(obj, fn) {
  for (let key in obj) {
    if (!hasOwnProperty(obj, key)) continue;
    if (fn(key, obj[key], obj) === false) {
      break;
    }
  }
}

export function forEachSymbol(obj, fn) {
  for (let sym of Object.getOwnPropertySymbols(obj)) {
    if (propertyIsEnumerable.call(obj, sym)) {
      if (fn.call(obj, sym, obj[sym], obj) === false) {
        break;
      }
    }
  }
}
