import { isClass, getClassTag } from './class';
import { TYPED_ARRAY_CLASS_TAGS } from './tags';

// TODO: rename to types.js??

export const isBoolean = buildPrimitiveClassCheck('Boolean');
export const isNumber = buildPrimitiveClassCheck('Number');
export const isString = buildPrimitiveClassCheck('String');

export const isDate = buildClassCheck('Date');
export const isRegExp = buildClassCheck('RegExp');

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
  return (
    obj == null || type === 'string' || type === 'number' || type === 'boolean'
  );
}

export function isWrappedPrimitive(obj) {
  return (
    typeof obj === 'object' &&
    (isString(obj) || isNumber(obj) || isBoolean(obj))
  );
}

export function isObject(obj, type) {
  type = type || typeof obj;
  // Protect against null. Functions extend from Object and are
  // considered objects here.
  return !!obj && (type === 'object' || type === 'function');
}

export function isArrayOrTypedArray(obj) {
  return isArray(obj) || isTypedArray(obj);
}

export function isTypedArray(obj) {
  return TYPED_ARRAY_CLASS_TAGS.has(getClassTag(obj));
}

function buildPrimitiveClassCheck(classTag) {
  const type = classTag.toLowerCase();
  return function (obj) {
    const t = typeof obj;
    return t === type || (t === 'object' && isClass(obj, classTag));
  };
}

function buildClassCheck(className, Constructor) {
  if (Constructor && isClass(new Constructor(), 'Object')) {
    // Map and Set may be [object Object] in IE 11.
    // In this case we need to perform a check using the constructor
    // instead of Object.prototype.toString.
    return getConstructorClassCheck(Constructor);
  } else {
    return getToStringClassCheck(className);
  }
}

function getToStringClassCheck(className) {
  return function (obj, classTag) {
    // perf: Returning up front on instanceof appears to be slower.
    return isClass(obj, className, classTag);
  };
}

function getConstructorClassCheck(obj) {
  const ctorStr = String(obj);
  return function (obj) {
    return String(obj.constructor) === ctorStr;
  };
}
