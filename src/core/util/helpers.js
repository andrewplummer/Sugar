const hasOwn = Object.prototype.hasOwnProperty;

export function hasOwnProperty(obj, prop) {
  return !!obj && hasOwn.call(obj, prop);
}
