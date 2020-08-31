import { isFunction, isArray } from './typeChecks';
import { deepGetProperty } from './deepProperties';

export function getMapper(obj) {
  if (isFunction(obj)) {
    return obj;
  } else if (isArray(obj)) {
    return getArrayMapper(obj);
  } else if (obj) {
    return getPropertyMapper(obj);
  }
  return defaultMapper;
}

function getArrayMapper(obj) {
  const mappers = obj.map((el) => {
    return getMapper(el);
  });
  return (el) => {
    return mappers.map((mapper) => {
      return mapper(el);
    });
  };
}

function getPropertyMapper(str) {
  return (el) => {
    return deepGetProperty(el, str);
  };
}

function defaultMapper(el) {
  return el;
}
