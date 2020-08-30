import { isString, isObjectType } from './typeChecks';
import { isDefined, hasOwnProperty } from './helpers';
import { assertArray, assertWritable } from './assertions';

export function deepHasProperty(obj, key) {
  return handleDeepProperty(obj, key, true);
}

export function deepGetProperty(obj, key) {
  return handleDeepProperty(obj, key, false);
}

export function deepSetProperty(obj, key, val) {
  handleDeepProperty(obj, key, false, true, false, val);
  return obj;
}

// Matches 1..2 style ranges in properties.
const PROPERTY_RANGE_REG = /^(.*?)\[([-\d]*)\.\.([-\d]*)\](.*)$/;

function handleDeepProperty(obj, key, has, fill, fillLast, val) {
  var ns, bs, ps, cbi, set, isLast, isPush, isIndex, nextIsIndex, exists;
  ns = obj;
  if (key == null) return;

  if (isObjectType(key)) {
    // Allow array and array-like accessors
    bs = [key];
  } else {
    key = String(key);
    if (key.indexOf('..') !== -1) {
      return handleArrayIndexRange(obj, key, val);
    }
    bs = key.split('[');
  }

  set = isDefined(val);

  for (var i = 0, blen = bs.length; i < blen; i++) {
    ps = bs[i];

    if (isString(ps)) {
      ps = ps.split('.');
    }

    for (var j = 0, plen = ps.length; j < plen; j++) {
      key = ps[j];

      // Is this the last key?
      isLast = i === blen - 1 && j === plen - 1;

      // Index of the closing ]
      cbi = key.indexOf(']');

      // Is the key an array index?
      isIndex = cbi !== -1;

      // Is this array push syntax "[]"?
      isPush = set && cbi === 0;

      // If the bracket split was successful and this is the last element
      // in the dot split, then we know the next key will be an array index.
      nextIsIndex = blen > 1 && j === plen - 1;

      if (isPush) {
        // Set the index to the end of the array
        key = ns.length;
      } else if (isIndex) {
        // Remove the closing ]
        key = key.slice(0, -1);
      }

      // If the array index is less than 0, then
      // add its length to allow negative indexes.
      if (isIndex && key < 0) {
        key = +key + ns.length;
      }

      // Bracket keys may look like users[5] or just [5], so the leading
      // characters are optional. We can enter the namespace if this is the
      // 2nd part, if there is only 1 part, or if there is an explicit key.
      if (i || key || blen === 1) {

        exists = hasOwnProperty(ns, key);

        // Non-existent namespaces are only filled if they are intermediate
        // (not at the end) or explicitly filling the last.
        if (fill && (!isLast || fillLast) && !exists) {
          // For our purposes, last only needs to be an array.
          ns = ns[key] = nextIsIndex || (fillLast && isLast) ? [] : {};
          continue;
        }

        if (has) {
          if (isLast || !exists) {
            return exists;
          }
        } else if (set && isLast) {
          assertWritable(ns);
          ns[key] = val;
        }

        ns = exists ? ns[key] : undefined;
      }

    }
  }
  return ns;
}

// Get object property with support for 0..1 style range notation.
function handleArrayIndexRange(obj, key, val) {
  var match, start, end, leading, trailing, arr, set;
  match = key.match(PROPERTY_RANGE_REG);
  if (!match) {
    return;
  }

  set = isDefined(val);
  leading = match[1];

  if (leading) {
    arr = handleDeepProperty(obj, leading, false, set ? true : false, true);
  } else {
    arr = obj;
  }

  assertArray(arr);

  trailing = match[4];
  start    = match[2] ? +match[2] : 0;
  end      = match[3] ? +match[3] : arr.length;

  // A range of 0..1 is inclusive, so we need to add 1 to the end. If this
  // pushes the index from -1 to 0, then set it to the full length of the
  // array, otherwise it will return nothing.
  end = end === -1 ? arr.length : end + 1;

  if (set) {
    for (var i = start; i < end; i++) {
      handleDeepProperty(arr, i + trailing, false, true, false, val);
    }
  } else {
    arr = arr.slice(start, end);

    // If there are trailing properties, then they need to be mapped for each
    // element in the array.
    if (trailing) {
      if (trailing.charAt(0) === '.') {
        // Need to chomp the period if one is trailing after the range. We
        // can't do this at the regex level because it will be required if
        // we're setting the value as it needs to be concatentated together
        // with the array index to be set.
        trailing = trailing.slice(1);
      }
      return arr.map((el) => {
        return handleDeepProperty(el, trailing);
      });
    }
  }
  return arr;
}
