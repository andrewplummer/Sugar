
const hasOwn = Object.prototype.hasOwnProperty;
const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

export function hasOwnProperty(obj, prop) {
  return !!obj && hasOwn.call(obj, prop);
}

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
