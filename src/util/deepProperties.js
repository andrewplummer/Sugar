import { isArray, isObject } from './typeChecks';
import { hasOwnProperty } from './helpers';

export function deepHasProperty(obj, path) {
  const { has } = traverseNestedPath(obj, path);
  return has;
}

export function deepGetProperty(obj, path) {
  const { val } = traverseNestedPath(obj, path);
  return val;
}

export function deepSetProperty(obj, path, val) {
  traverseNestedPath(obj, path, (inner, key) => {
    inner[key] = val;
  });
}

function traverseNestedPath(obj, path, setter) {
  if (isArray(path)) {
    path = arrayToPath(path);
  } else {
    path = stringToPath(String(path));
  }
  let val;
  let has = false;
  if (obj) {
    while (path.length) {
      let { key, arr } = path.shift();
      const split = key.split('..');
      // Handle range syntax 0..1
      if (split.length > 1) {
        if (isArray(obj)) {
          const start = Math.max(0, getArrayIndex(split[0] || 0, obj));
          const end = getArrayIndex(split[1] || obj.length - 1, obj);
          val = getArrayRange(obj, start, end);
          has = true;
          // If there is still a path to resolve then traverse into the slice
          // of the array, mapping values. Otherwise, if attempting to set array
          // elements then call the setter for index of the range.
          if (path.length) {
            val = val.map((el) => {
              return traverseNestedPath(el, path, setter)?.val;
            });
          } else if (setter) {
            return forEachInRange(obj, start, end, setter);
          }
          break;
        } else {
          throw new TypeError('Range syntax not valid for objects');
        }
      }
      if (isArray(obj)) {
        if (!isNaN(key)) {
          if (key !== '') {
            key = getArrayIndex(key, obj);
          }
          if (setter) {
            // Ensure the index is valid when setting on an array.
            // Default to the array length to allow pushing to the
            // end of the array for empty bracket syntax. (arr[]);
            key = Math.max(0, key === '' ? obj.length : key);
          }
        }
      }
      has = hasOwnProperty(obj, key);
      val = has ? obj[key] : undefined;
      if (!has) {
        if (setter) {
          const ns = arr ? [] : {};
          val = obj[key] = ns;
          has = true;
        } else {
          break;
        }
      }
      if (path.length) {
        obj = val;
      } else if (setter) {
        // Apply the setter if the edge of the path has been reached.
        setter(obj, key);
      }
    }
  }
  return {
    val,
    has,
    inner: obj,
  }
}

// Creates an array path from a string shortcut. Bracket syntax is identical
// to dot syntax with the exception that it initializes namespaces as arrays
// when they do not exist. Valid syntax includes:
// 1. a.b.c.d
// 2. a[b][c][d]
// 3. a[1][2][3]
// 4. a[0..1][-1..1]
// 5. a[]
function stringToPath(str) {
  const path = [];

  let key = '';
  let arr = false;

  function flush() {
    path.push({
      key,
      arr,
    });
    key = '';
  }

  if (str === '') {
    flush();
  } else {
    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i);
      const next = str.charAt(i + 1);
      if (char === '.') {
        if (next === '.') {
          key += '..';
          i += 1;
        } else {
          arr = false;
          flush();
          if (i === str.length - 1) {
            flush();
          }
        }
      } else if (char === '[') {
        arr = true;
        if (key) {
          flush();
        }
      } else if (char === ']') {
        if (next === '.') {
          arr = false;
          i++;
        }
        flush();
      } else {
        key += char;
      }
    }
    if (key) {
      flush();
    }
  }
  return path;
}

// Normalizes an array of keys to be compatible with
// string shortcuts that retain references syntax types.
// May be already normalized.
function arrayToPath(arr) {
  return arr.map((el) => {
    if (!isObject(el)) {
      el = {
        key: String(el),
        arr: false,
      }
    }
    return el;
  });
}

// Similar to arr.slice but uses inclusive indexes
// [0..0] has one element, [0..1] has two, etc.
// and wraps from beginning when spanning edges.
function getArrayRange(arr, start, end) {
  if (end >= 0 && end < start) {
    return [...arr.slice(start), ...arr.slice(0, end + 1)];
  } else {
    return arr.slice(start, end + 1);
  }
}

// Calls a function using inclusive range index,
// wrapping from beginning when spanning edges.
function forEachInRange(arr, start, end, fn) {
  let loop = false;
  if (end >= 0 && end < start) {
    end += arr.length;
    loop = true;
  }
  for (let i = start; i <= end; i++) {
    let idx = i;
    if (loop) {
      idx %= arr.length;
    }
    fn(arr, idx);
  }
}

// Ensures a valid array index > 0 while still
// allowing for negative indexes.
function getArrayIndex(str, arr) {
  let idx = +str;
  if (idx < 0) {
    idx += arr.length;
  }
  return idx;
}
