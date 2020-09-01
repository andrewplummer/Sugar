import { isFunction, isArray } from './typeChecks';
import { deepGetProperty } from './deepProperties';

export function getMapper(obj, context) {
  if (isFunction(obj)) {
    return getFunctionMapper(obj, context);
  } else if (isArray(obj)) {
    return getArrayMapper(obj);
  } else if (obj) {
    return getPropertyMapper(String(obj));
  }
  return defaultMapper;
}

function getFunctionMapper(fn, context) {
  return (val, key, obj) => {
    if (isArray(obj)) {
      return fn.call(context || obj, val, key, obj);
    } else {
      return fn.call(context || obj, key, val, obj);
    }
  };
}


function getArrayMapper(obj) {
  const mappers = obj.map((el) => {
    return getMapper(el);
  });
  return (val) => {
    return mappers.map((mapper) => {
      return mapper(val);
    });
  };
}

function getPropertyMapper(str) {
  return (val) => {
    return deepGetProperty(val, str);
  };
}

function defaultMapper(obj) {
  return obj;
}
