import { isFunction, isString } from './typeChecks';
import { deepGetProperty } from './deepProperties';

export function getMapper(obj) {
  if (isFunction(obj)) {
    return obj;
  } else if (isString(obj)) {
    return getPropertyMapper(obj);
  }
  return defaultMapper;
}

function getPropertyMapper(str) {
  return (el) => {
    return deepGetProperty(el, str);
  };
}

function defaultMapper(el) {
  return el;
}
