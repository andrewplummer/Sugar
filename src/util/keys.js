import { isArray, isFunction, isRegExp } from './typeChecks';

export function getKeyMatcher(arg) {
  if (isFunction(arg)) {
    return arg;
  } else if (isArray(arg)) {
    return getArrayMatcher(arg);
  } else if (isRegExp(arg)) {
    return getRegExpMatcher(arg);
  } else {
    return getDefaultMatcher(arg);
  }
}

function getArrayMatcher(arr) {
  return (key) => {
    return arr.includes(key);
  }
}

function getRegExpMatcher(reg) {
  return (key) => {
    return reg.test(key);
  }
}

function getDefaultMatcher(arg) {
  return (key) => {
    return key === arg;
  }
}
