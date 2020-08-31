import { isPrimitive, isRegExp, isDate, isFunction, isObjectType } from './typeChecks';
import { forEachProperty } from './helpers';

export function getMatcher(obj, context) {
  if (!isPrimitive(obj)) {
    if (isRegExp(obj)) {
      return getRegexMatcher(obj);
    } else if (isDate(obj)) {
      return getDateMatcher(obj);
    } else if (isFunction(obj)) {
      return getFunctionMatcher(obj, context);
    } else {
      return getFuzzyMatcher(obj);
    }
  }
  return getDefaultMatcher(obj);
}

function getRegexMatcher(reg) {
  return (el) => {
    return reg.test(el);
  };
}

function getDateMatcher(date) {
  const time = date.getTime();
  return (el) => {
    return isDate(el) && el.getTime() == time;
  };
}

function getFunctionMatcher(fn, context) {
  return (el, i, arr) => {
    // Return true up front if match by reference
    return el === fn || fn.call(context || arr, el, i, arr);
  };
}

function getDefaultMatcher(obj) {
  return (el) => {
    return el === obj;
  };
}

function getFuzzyMatcher(obj) {
  const matchers = new Map();
  return (el, i, arr) => {
    if (!isObjectType(el)) {
      return false;
    }
    let matched = true;
    forEachProperty(obj, (key, val) => {
      matchers[key] = matchers[key] || getMatcher(val);
      if (matchers[key].call(arr, el[key], i, arr) === false) {
        matched = false;
      }
      return matched;
    });
    return matched;
  };
}
