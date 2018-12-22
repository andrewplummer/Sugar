
export function hasOwnProperty(obj, prop) {
  return !!obj && Object.prototype.hasOwnProperty.call(obj, prop);
}

export function forEachProperty(obj, fn) {
  for (let key in obj) {
    if (!hasOwnProperty(obj, key)) continue;
    if (fn.call(obj, key, obj[key], obj) === false) break;
  }
}

export function arrayIncludes(arr, el) {
  return arr.includes ? arr.includes(el) : arr.indexOf(el) !== -1;
}
