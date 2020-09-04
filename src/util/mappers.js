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
  return (...args) => {
    const obj = args[args.length - 1];
    if (isArray(obj)) {
      return fn.apply(context || obj, args);
    } else {
      // Flip key and val arguments.
      const [val, key, ...rest] = args;
      return fn.call(context || obj, key, val, ...rest);
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
    let result = deepGetProperty(val, str);
    if (isFunction(result)) {
      result = result.call(val);
    }
    return result;
  };
}

function defaultMapper(obj) {
  return obj;
}
