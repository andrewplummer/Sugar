import { isFunction, isArray } from './typeChecks';
import { deepGetProperty } from './deepProperties';

export function getObjectMapper(obj) {
  if (isFunction(obj)) {
    return getFunctionMapper(obj);
  } else if (obj) {
    return getObjectPropertyMapper(String(obj));
  }
  return defaultMapper;
}

export function getMapper(obj, context) {
  if (isFunction(obj)) {
    return getFunctionMapper(obj, context);
  } else if (isArray(obj)) {
    return getArrayMapper(obj);
  } else if (obj) {
    return getArrayPropertyMapper(String(obj));
  }
  return defaultMapper;
}

function getFunctionMapper(fn, context = null) {
  if (context) {
    fn = fn.bind(context);
  }
  return fn;
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

function getArrayPropertyMapper(str) {
  return (el) => {
    return deepGetProperty(el, str);
  };
}

function getObjectPropertyMapper(str) {
  return (key, val) => {
    return deepGetProperty(val, str);
  };
}

function defaultMapper(obj) {
  return obj;
}
