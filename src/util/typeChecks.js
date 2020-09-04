import { isClass } from './class';

export const isBoolean = buildPrimitiveClassCheck('Boolean');
export const isNumber  = buildPrimitiveClassCheck('Number');
export const isString  = buildPrimitiveClassCheck('String');

export const isDate   = buildClassCheck('Date');
export const isRegExp = buildClassCheck('RegExp');

export const isError = buildClassCheck('Error');

export const isArray = Array.isArray;
export const isNaN = Number.isNaN;

export const isSet = buildClassCheck('Set', typeof Set !== 'undefined' && Set);
export const isMap = buildClassCheck('Map', typeof Map !== 'undefined' && Map);

// Wanted to enhance performance here by using simply "typeof"
// but Firefox has two major issues that make this impossible,
// one fixed, the other not, so perform a full class check here.
//
// 1. Regexes can be typeof "function" in FF < 3
//    https://bugzilla.mozilla.org/show_bug.cgi?id=61911 (fixed)
//
// 2. HTMLEmbedElement and HTMLObjectElement are be typeof "function"
//    https://bugzilla.mozilla.org/show_bug.cgi?id=268945 (won't fix)
export const isFunction = buildClassCheck('Function');

export function isPrimitive(obj, type) {
  type = type || typeof obj;
  return obj == null || type === 'string' || type === 'number' || type === 'boolean';
}

export function isObject(obj, type) {
  // Protect against null.
  return !!obj && (type || typeof obj) === 'object';
}

function buildPrimitiveClassCheck(className) {
  const type = className.toLowerCase();
  return function(obj) {
    const t = typeof obj;
    return t === type || t === 'object' && isClass(obj, className);
  };
}

function buildClassCheck(className, Constructor) {
  if (Constructor && isClass(new Constructor, 'Object')) {
    // Map and Set may be [object Object] in IE 11.
    // In this case we need to perform a check using the constructor
    // instead of Object.prototype.toString.
    return getConstructorClassCheck(Constructor);
  } else {
    return getToStringClassCheck(className);
  }
}

function getToStringClassCheck(className) {
  return function(obj, str) {
    // perf: Returning up front on instanceof appears to be slower.
    return isClass(obj, className, str);
  };
}

function getConstructorClassCheck(obj) {
  const ctorStr = String(obj);
  return function(obj) {
    return String(obj.constructor) === ctorStr;
  };
}
