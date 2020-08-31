// TODO: remove?

import { hasOwnProperty, forEachProperty } from './helpers';

// Iterate over arrays with fallback to prevent iterating
// over all members of sparse arrays.

export function forEachSparse(arr, fn) {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (!hasOwnProperty(arr, i)) {
      return iterateOverSparseArray(arr, fn, i);
    }
    if (fn(arr[i], i, arr) === false) {
      break;
    }
  }
}

function isArrayIndex(n) {
  return n >>> 0 == n && n != 0xFFFFFFFF;
}

function iterateOverSparseArray(arr, fn, fromIndex) {
  const indexes = getSparseArrayIndexes(arr, fromIndex);
  for (let j = 0, len = indexes.length; j < len; j++) {
    const i = indexes[j];
    if (fn(arr[i], i, arr) === false) {
      break;
    }
  }
}

// It's unclear whether or not sparse arrays qualify as "simple enumerables".
// If they are not, however, the wrapping function will be deoptimized, so
// isolate here.
function getSparseArrayIndexes(arr, fromIndex) {
  var indexes = [];
  forEachProperty(arr, (key) => {
    if (isArrayIndex(key) && key >= fromIndex) {
      indexes.push(+key);
    }
  });
  indexes.sort((a, b) => {
    return a - b;
  });
  return indexes;
}

