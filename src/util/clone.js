import { isPrimitive, isWrappedPrimitive, isDate, isSet, isMap, isRegExp, isArrayOrTypedArray } from './typeChecks';
import { isPlainObject } from './object';
import { cloneDate } from './date';
import { cloneArray } from './array';

export function clone(obj) {
  if (isPrimitive(obj)) {
    return obj;
  } else if (isPlainObject(obj)) {
    return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
  } else if (isArrayOrTypedArray(obj)) {
    return cloneArray(obj);
  } else if (isDate(obj)) {
    return cloneDate(obj);
  } else if (isSet(obj)) {
    return cloneSet(obj);
  } else if (isMap(obj)) {
    return cloneMap(obj);
  } else if (isRegExp(obj)) {
    return cloneRegExp(obj);
  } else if (isWrappedPrimitive(obj)) {
    return cloneWrappedPrimitive(obj);
  } else {
    throw new TypeError(`${obj} cannot be cloned`);
  }
}

function cloneSet(set) {
  return new Set(Array.from(set));
}

function cloneMap(map) {
  return new Map(Array.from(map));
}

function cloneRegExp(reg) {
  return RegExp(reg.source, reg.flags);
}

function cloneWrappedPrimitive(obj) {
  return new obj.constructor(obj.valueOf());
}
