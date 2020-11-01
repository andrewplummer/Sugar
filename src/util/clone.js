export function cloneArray(arr) {
  // Slice will work on Array as well as typed arrays.
  return arr.slice();
}
export function cloneDate(date) {
  return new Date(date.getTime());
}

export function cloneRegExp(reg) {
  return RegExp(reg.source, reg.flags);
}

export function cloneSet(set) {
  return new Set(Array.from(set));
}

export function cloneMap(map) {
  return new Map(Array.from(map));
}

export function cloneWrappedPrimitive(obj) {
  return new obj.constructor(obj.valueOf());
}
