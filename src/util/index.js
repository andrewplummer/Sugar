import { isString, isArray } from './typeChecks';

export function getEntryAtIndex(obj, index, loop) {
  const len = obj.length;
  if (isArray(index)) {
    return index.map((i) => {
      return getEntry(obj, i, len, loop);
    });
  } else if (Number.isInteger(index)) {
    return getEntry(obj, index, len, loop);
  } else {
    throw new TypeError('Index must be an integer or array.');
  }
}

function getEntry(obj, index, len, loop) {
  index = getNormalizedIndex(index, len, loop)
  return isString(obj) ? obj.charAt(index) : obj[index];
}

function getNormalizedIndex(index, len, loop) {
  if (index && loop) {
    index = index % len;
  }
  if (index < 0) index = len + index;
  return index;
}
