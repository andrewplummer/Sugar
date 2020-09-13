import { isObject, isSet, isMap } from './typeChecks';
import { isSerializable, iterateWithCyclicCheck } from './object';
import { getClassTag } from './class';

export function isEqual(a, b, stack = []) {

  if (a === b) {
    // Return quickly up front when matched by reference,
    // but be careful about 0 !== -0.
    return a !== 0 || 1 / a === 1 / b;
  }

  if (isObject(a) && isObject(b)) {
    const aTag = getClassTag(a);
    const bTag = getClassTag(b);

    if (aTag !== bTag) {
      return false;
    }

    if (isSerializable(a, aTag) && isSerializable(b, bTag)) {
      return objectIsEqual(a, b, stack);
    }
  }

  // Handle NaN
  if (a !== a && b !== b) {
    return true;
  }

  return false;
}

function objectIsEqual(a, b, stack) {

  if (isSet(a)) {
    return isSet(b) && objectIsEqual(Array.from(a), Array.from(b), stack);
  } else if (isMap(a)) {
    return isMap(b) && objectIsEqual(Array.from(a), Array.from(b), stack);
  } else if (isObject(a.valueOf())) {

    if (a.length !== b.length) {
      // perf: Quickly returning up front for arrays.
      return false;
    }

    let count = 0;
    let propsEqual = true;

    try {
      iterateWithCyclicCheck(a, stack, (key, val) => {
        if (!(key in b) || !isEqual(val, b[key], stack)) {
          propsEqual = false;
        }
        count++;
        return propsEqual;
      });
    } catch(err) {
      propsEqual = false;
    }

    if (!propsEqual || count !== Object.keys(b).length) {
      return false;
    }
  }

  // Stringifying the value handles NaN, wrapped primitives, dates, and errors in one go.
  return a.valueOf().toString() === b.valueOf().toString();
}
