'use strict';

/***
 * @module Common
 * @description Internal utility and common methods.
 ***/

// Flag allowing native methods to be enhanced
var ENHANCEMENTS_FLAG = 'enhance';

// Excludes object as this is more nuanced.
var TYPE_CHECK_NAMES = ['Boolean','Number','String','Array','Date','RegExp','Function'];

// Do strings have no keys?
var NO_KEYS_IN_STRING_OBJECTS = !('0' in Object('a'));

// Classes that can be matched by value
var MATCHED_BY_VALUE_REG = /^\[object Date|Array|String|Number|RegExp|Boolean|Arguments\]$/;

// Prefix for private properties
var PRIVATE_PROP_PREFIX = '_sugar_';

// Matches 1..2 style ranges in properties
var PROPERTY_RANGE_REG = /^(.*?)\[([-\d]*)\.\.([-\d]*)\](.*)$/;

// WhiteSpace/LineTerminator as defined in ES5.1 plus Unicode characters in the Space, Separator category.
var TRIM_CHARS = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF';

// Regex for matching a formatted string
var STRING_FORMAT_REG = /([{}])\1|\{([^}]*)\}|(%)%|(%(\w*))/g;

// Common chars
var HALF_WIDTH_ZERO = 0x30,
    FULL_WIDTH_ZERO = 0xff10,
    HALF_WIDTH_PERIOD   = '.',
    FULL_WIDTH_PERIOD   = '．',
    HALF_WIDTH_COMMA    = ',',
    OPEN_BRACE  = '{',
    CLOSE_BRACE = '}';

// Namespace aliases
var sugarObject   = Sugar.Object,
    sugarArray    = Sugar.Array,
    sugarDate     = Sugar.Date,
    sugarString   = Sugar.String,
    sugarNumber   = Sugar.Number,
    sugarFunction = Sugar.Function,
    sugarRegExp   = Sugar.RegExp;

// Core utility aliases
var hasOwn               = Sugar.util.hasOwn,
    className            = Sugar.util.className,
    setProperty          = Sugar.util.setProperty,
    defineProperty       = Sugar.util.defineProperty,
    forEachProperty      = Sugar.util.forEachProperty;
    mapNativeToChainable = Sugar.util.mapNativeToChainable;

// Class checks
var isBoolean, isNumber, isString, isArray, isDate, isRegExp, isFunction, isSet;

function buildClassChecks() {

  function buildClassCheck(klass) {
    return klass === 'Array' && Array.isArray || function(obj, cached) {
      return isClass(obj, klass, cached);
    };
  }

  function buildPrimitiveClassCheck(klass) {
    var type = klass.toLowerCase();
    return function(obj) {
      var t = typeof obj;
      return t === type || t === 'object' && isClass(obj, klass);
    };
  }

  isBoolean  = buildPrimitiveClassCheck(TYPE_CHECK_NAMES[0]);
  isNumber   = buildPrimitiveClassCheck(TYPE_CHECK_NAMES[1]);
  isString   = buildPrimitiveClassCheck(TYPE_CHECK_NAMES[2]);

  isArray    = buildClassCheck(TYPE_CHECK_NAMES[3]);
  isDate     = buildClassCheck(TYPE_CHECK_NAMES[4]);
  isRegExp   = buildClassCheck(TYPE_CHECK_NAMES[5]);
  isSet      = buildClassCheck('Set');

  // Wanted to enhance performance here by using simply "typeof"
  // but Firefox has two major issues that make this impossible,
  // one fixed, the other not, so perform a full class check here.
  //
  // 1. Regexes can be typeof "function" in FF < 3
  //    https://bugzilla.mozilla.org/show_bug.cgi?id=61911 (fixed)
  //
  // 2. HTMLEmbedElement and HTMLObjectElement are be typeof "function"
  //    https://bugzilla.mozilla.org/show_bug.cgi?id=268945 (won't fix)
  isFunction = buildClassCheck(TYPE_CHECK_NAMES[6]);

}

function isClass(obj, klass, cached) {
  var k = cached || className(obj);
  return k === '[object '+ klass +']';
}

// Wrapping the core's "define" methods to
// save a few bytes in the minified script.
function wrapNamespace(method) {
  return function(sugarNamespace, arg1, arg2) {
    sugarNamespace[method](arg1, arg2);
  };
}

// Method define aliases
var alias                       = wrapNamespace('alias'),
    defineStatic                = wrapNamespace('defineStatic'),
    defineInstance              = wrapNamespace('defineInstance'),
    defineStaticPolyfill        = wrapNamespace('defineStaticPolyfill'),
    defineInstancePolyfill      = wrapNamespace('defineInstancePolyfill'),
    defineInstanceAndStatic     = wrapNamespace('defineInstanceAndStatic'),
    defineStaticWithArguments   = wrapNamespace('defineStaticWithArguments'),
    defineInstanceWithArguments = wrapNamespace('defineInstanceWithArguments');

function defineInstanceSimilar(sugarNamespace, set, fn, flags) {
  defineInstance(sugarNamespace, collectSimilarMethods(set, fn), flags);
}

function defineInstanceAndStaticSimilar(sugarNamespace, set, fn, flags) {
  defineInstanceAndStatic(sugarNamespace, collectSimilarMethods(set, fn), flags);
}

function collectSimilarMethods(set, fn) {
  var methods = {};
  if (isString(set)) {
    set = commaSplit(set);
  }
  forEach(set, function(el, i) {
    fn(methods, el, i);
  });
  return methods;
}

// This song and dance is to fix methods to a different length
// from what they actually accept in order to stay in line with
// spec. Additinally passing argument length, as some methods
// throw assertion errors based on this (undefined check is not
// enough). Fortunately for now spec is such that passing 3
// actual arguments covers all requirements. Note that passing
// the argument length also forces the compiler to not rewrite
// length of the compiled function.
function fixArgumentLength(fn, staticOnly) {
  var staticFn = function(a) {
    var args = arguments;
    return fn(a, args[1], args[2], args.length - 1);
  };
  if (!staticOnly) {
    staticFn.instance = function(b) {
      var args = arguments;
      return fn(this, b, args[1], args.length);
    };
  }
  return staticFn;
}

function defineAccessor(namespace, name, fn) {
  setProperty(namespace, name, fn);
}

function defineOptionsAccessor(namespace, defaults) {
  var obj = simpleClone(defaults);

  function getOption(name) {
    return obj[name];
  }

  function setOption(name, val) {
    if (val === null) {
      val = defaults[name];
    }
    obj[name] = val;
  }

  defineAccessor(namespace, 'getOption', getOption);
  defineAccessor(namespace, 'setOption', setOption);
  return getOption;
}

// For methods defined directly on the prototype like Range
function defineOnPrototype(ctor, methods) {
  var proto = ctor.prototype;
  forEachProperty(methods, function(key, val) {
    proto[key] = val;
  });
}

// Argument helpers

function assertCallable(obj) {
  if (!isFunction(obj)) {
    throw new TypeError('Function is not callable');
  }
}

function assertIsArray(obj, msg) {
  if (!isArray(obj)) {
    throw new TypeError(msg);
  }
}

function assertWritable(obj) {
  if (isPrimitive(obj)) {
    // If strict mode is active then primitives will throw an
    // error when attempting to write properties. We can't be
    // sure if strict mode is available, so pre-emptively
    // throw an error here to ensure consistent behavior.
    throw new TypeError('Property cannot be written.');
  }
}

// Coerces an object to a positive integer.
// Does not allow NaN, or Infinity.
function coercePositiveInteger(n) {
  n = +n || 0;
  if (n < 0 || !isNumber(n) || !isFinite(n)) {
    throw new RangeError('Invalid number');
  }
  return trunc(n);
}


// General helpers

function isDefined(o) {
  return o !== undefined;
}

function isUndefined(o) {
  return o === undefined;
}

function privatePropertyAccessor(key) {
  var privateKey = PRIVATE_PROP_PREFIX + key;
  return function(obj, val) {
    if (arguments.length > 1) {
      setProperty(obj, privateKey, val);
      return obj;
    }
    return obj[privateKey];
  };
}

function setChainableConstructor(sugarNamespace, createFn) {
  sugarNamespace.prototype.constructor = function() {
    return createFn.apply(this, arguments);
  };
}

// Fuzzy matching helpers

function getMatcher(f, k) {
  if (!isPrimitive(f)) {
    var klass = className(f);
    if (isRegExp(f, klass)) {
      return regexMatcher(f);
    } else if (isDate(f, klass)) {
      return dateMatcher(f);
    } else if (isFunction(f, klass)) {
      // Match against a filtering function
      if (k) {
        return invertedArgsFunctionMatcher(f);
      } else {
        return functionMatcher(f);
      }
    } else if (isPlainObject(f, klass)) {
      return fuzzyMatcher(f, k);
    }
  }
  // Default is standard isEqual
  return defaultMatcher(f);
}

function fuzzyMatcher(obj, k) {
  var matchers = {};
  return function(el, i, arr) {
    var matched = true;
    if (!isObjectType(el)) {
      return false;
    }
    forEachProperty(obj, function(key, val) {
      matchers[key] = getOwn(matchers, key) || getMatcher(val, k);
      if (matchers[key].call(arr, el[key], i, arr) === false) {
        matched = false;
      }
      return matched;
    });
    return matched;
  };
}

function defaultMatcher(f) {
  return function(el) {
    return isEqual(el, f);
  };
}

function regexMatcher(reg) {
  reg = RegExp(reg);
  return function(el) {
    return reg.test(el);
  };
}

function dateMatcher(d) {
  var ms = d.getTime();
  return function(el) {
    return !!(el && el.getTime) && el.getTime() === ms;
  };
}

function functionMatcher(fn) {
  return function(el, i, arr) {
    // Return true up front if match by reference
    return el === fn || fn.call(arr, el, i, arr);
  };
}

function invertedArgsFunctionMatcher(fn) {
  return function(value, key, obj) {
    // Return true up front if match by reference
    return value === fn || fn.call(obj, key, value, obj);
  };
}

// Object helpers

function getKeys(obj) {
  return Object.keys(obj);
}

function deepHasProperty(obj, key) {
  return handleDeepProperty(obj, key, true);
}

function deepGetProperty(obj, key) {
  return handleDeepProperty(obj, key, false);
}

function deepSetProperty(obj, key, val) {
  handleDeepProperty(obj, key, false, true, false, val);
  return obj;
}

function handleDeepProperty(obj, key, has, fill, fillLast, val) {
  var ns, bs, ps, cbi, set, isLast, isPush, isIndex, nextIsIndex, exists;
  ns = obj || undefined;
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
      ps = periodSplit(ps);
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

        // Non-existent namespaces are only filled if they are intermediate
        // (not at the end) or explicitly filling the last.
        if (fill && (!isLast || fillLast) && !(key in ns)) {
          // For our purposes, last only needs to be an array.
          ns[key] = nextIsIndex || (fillLast && isLast) ? [] : {};
        }

        if (has) {
          exists = key in ns;
          if (isLast || !exists) {
            return exists;
          }
        } else if (set && isLast) {
          assertWritable(ns);
          ns[key] = val;
        }

        ns = ns && ns[key];
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

  assertIsArray(arr, 'Range syntax requires Array.');

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
      if (trailing.charAt(0) === HALF_WIDTH_PERIOD) {
        // Need to chomp the period if one is trailing after the range. We
        // can't do this at the regex level because it will be required if
        // we're setting the value as it needs to be concatentated together
        // with the array index to be set.
        trailing = trailing.slice(1);
      }
      return arr.map(function(el) {
        return handleDeepProperty(el, trailing);
      });
    }
  }
  return arr;
}

function getOwn(obj, prop) {
  if (hasOwn(obj, prop)) {
    return obj[prop];
  }
}

function getOwnKey(obj, key) {
  if (hasOwn(obj, key)) {
    return key;
  }
}

function hasProperty(obj, prop) {
  return !isPrimitive(obj) && prop in obj;
}

function isObjectType(obj, type) {
  return !!obj && (type || typeof obj) === 'object';
}

function isPrimitive(obj, type) {
  type = type || typeof obj;
  return obj == null || type === 'string' || type === 'number' || type === 'boolean';
}

function isPlainObject(obj, klass) {
  return isObjectType(obj) &&
         isClass(obj, 'Object', klass) &&
         hasValidPlainObjectPrototype(obj) &&
         hasOwnEnumeratedProperties(obj);
}

function hasValidPlainObjectPrototype(obj) {
  var hasToString = 'toString' in obj;
  var hasConstructor = 'constructor' in obj;
  // An object created with Object.create(null) has no methods in the
  // prototype chain, so check if any are missing. The additional hasToString
  // check is for false positives on some host objects in old IE which have
  // toString but no constructor. If the object has an inherited constructor,
  // then check if it is Object (the "isPrototypeOf" tapdance here is a more
  // robust way of ensuring this if the global has been hijacked). Note that
  // accessing the constructor directly (without "in" or "hasOwnProperty")
  // will throw a permissions error in IE8 on cross-domain windows.
  return (!hasConstructor && !hasToString) ||
          (hasConstructor && !hasOwn(obj, 'constructor') &&
           hasOwn(obj.constructor.prototype, 'isPrototypeOf'));
}

function hasOwnEnumeratedProperties(obj) {
  // Plain objects are generally defined as having enumerated properties
  // all their own, however in early IE environments without defineProperty,
  // there may also be enumerated methods in the prototype chain, so check
  // for both of these cases.
  var objectProto = Object.prototype;
  for (var key in obj) {
    var val = obj[key];
    if (!hasOwn(obj, key) && val !== objectProto[key]) {
      return false;
    }
  }
  return true;
}

function simpleRepeat(n, fn) {
  for (var i = 0; i < n; i++) {
    fn(i);
  }
}

function simpleClone(obj) {
  return simpleMerge({}, obj);
}

function simpleMerge(target, source) {
  forEachProperty(source, function(key) {
    target[key] = source[key];
  });
  return target;
}

// Make primtives types like strings into objects.
function coercePrimitiveToObject(obj) {
  if (isPrimitive(obj)) {
    obj = Object(obj);
  }
  if (NO_KEYS_IN_STRING_OBJECTS && isString(obj)) {
    forceStringCoercion(obj);
  }
  return obj;
}

// Force strings to have their indexes set in
// environments that don't do this automatically.
function forceStringCoercion(obj) {
  var i = 0, chr;
  while (chr = obj.charAt(i)) {
    obj[i++] = chr;
  }
}

// Equality helpers

function isEqual(a, b, stack) {
  var aClass, bClass;
  if (a === b) {
    // Return quickly up front when matched by reference,
    // but be careful about 0 !== -0.
    return a !== 0 || 1 / a === 1 / b;
  }
  aClass = className(a);
  bClass = className(b);
  if (aClass !== bClass) {
    return false;
  }

  if (isSet(a, aClass) && isSet(b, bClass)) {
    return setIsEqual(a, b);
  } else if (canCompareValue(a, aClass) && canCompareValue(b, bClass)) {
    return objectIsEqual(a, b, aClass, stack);
  }
  return false;
}

function objectIsEqual(a, b, aClass, stack) {
  var aType = typeof a, bType = typeof b, propsEqual, lenEqual, arrayLike, count;
  if (aType !== bType) {
    return false;
  }
  if (isObjectType(a.valueOf())) {
    count = 0;
    propsEqual = true;
    arrayLike = isArrayLike(a, aClass);
    iterateWithCyclicCheck(a, arrayLike, false, stack, function(key, val, cyc, stack) {
      if (!cyc && (!(key in b) || !isEqual(val, b[key], stack))) {
        propsEqual = false;
      }
      count++;
      return propsEqual;
    });
    lenEqual = arrayLike ? a.length === b.length : count === getKeys(b).length;
    if (!propsEqual || !lenEqual) {
      return false;
    }
  }
  // Stringifying the value handles NaN, wrapped primitives, and dates in one go.
  return a.valueOf().toString() === b.valueOf().toString();
}

function canCompareValue(obj, klass) {
  // Only known objects are matched by value. This is notably excluding
  // functions, DOM Elements, and instances of user-created classes. The latter
  // can arguably be matched by value, but distinguishing between these and host
  // objects -- which should never be compared by value -- is very tricky so not
  // dealing with it here.
  klass = klass || className(obj);
  return MATCHED_BY_VALUE_REG.test(klass) || isPlainObject(obj, klass);
}

function setIsEqual(s1, s2) {
  var equal = true;
  // iOS8 supports sets but has an incomplete implementation of Iterators so
  // avoiding .next syntax here. Also can't use for..of as it would be a
  // syntax error in ES5 environments.
  s1.forEach(function(v) {
    if (equal && !s2.has(v)) {
      equal = false;
    }
  });
  return equal && s1.size === s2.size;
}

function stringify(obj, stack) {
  var type = typeof obj, arrayLike, klass, value;

  // Return quickly for primitives to save cycles
  if (isPrimitive(obj, type) && !isRealNaN(obj)) {
    return type + obj;
  }

  klass = className(obj);
  arrayLike = isArrayLike(obj, klass);

  if (arrayLike || isPlainObject(obj, klass)) {
    value = stringifyDeep(obj, arrayLike, stack);
  } else if (1 / obj === -Infinity) {
    value = '-0';
  } else if (obj.valueOf) {
    value = obj.valueOf();
  }
  return type + klass + value;
}

function stringifyDeep(obj, arrayLike, stack) {
  var result = '';
  iterateWithCyclicCheck(obj, arrayLike, true, stack, function(key, val, cyc, stack) {
    result += cyc ? 'CYC' : key + stringify(val, stack);
  });
  return result;
}

function iterateWithCyclicCheck(obj, arrayLike, sortedKeys, stack, fn) {

  function next(key, val) {
    var cyc = false;

    // Allowing a step into the structure before triggering this check to save
    // cycles on standard JSON structures and also to try as hard as possible to
    // catch basic properties that may have been modified.
    if (stack.length > 1) {
      var i = stack.length;
      while (i--) {
        if (stack[i] === val) {
          cyc = true;
        }
      }
    }

    stack.push(val);
    fn(key, val, cyc, stack);
    stack.pop();
  }

  function iterateArrayLike(arr) {
    for (var i = 0; i < arr.length; i++) {
      if (i in arr) {
        next(i, arr[i]);
      }
    }
  }

  function iterateWithSortedKeys() {
    // Sorted keys is required for stringify, where object order
    // does not matter but stringified order does.
    var arr = getKeys(obj).sort(), key;
    for (var i = 0; i < arr.length; i++) {
      key = arr[i];
      next(arr[i], obj[key]);
    }
  }

  // This method for checking for cyclic structures was egregiously stolen from
  // the ingenious method by @kitcambridge from the Underscore script:
  // https://github.com/documentcloud/underscore/issues/240
  if (!stack) stack = [];

  if (arrayLike) {
    iterateArrayLike(obj);
  } else if (sortedKeys) {
    iterateWithSortedKeys();
  } else {
    forEachProperty(obj, next);
  }
}


// Array helpers

function isArrayIndex(n) {
  return n >>> 0 == n && n != 0xFFFFFFFF;
}

function isArrayLike(obj, klass) {
  return isArray(obj, klass) || isArguments(obj, klass);
}

function isArguments(obj, klass) {
  klass = klass || className(obj);
  // .callee exists on Arguments objects in < IE8
  return hasProperty(obj, 'length') && (klass === '[object Arguments]' || !!obj.callee);
}

function iterateOverSparseArray(arr, fn, fromIndex, loop) {
  var indexes = getSparseArrayIndexes(arr, fromIndex, loop), index;
  for (var i = 0, len = indexes.length; i < len; i++) {
    index = indexes[i];
    fn.call(arr, arr[index], index, arr);
  }
  return arr;
}

// It's unclear whether or not sparse arrays qualify as "simple enumerables".
// If they are not, however, the wrapping function will be deoptimized, so
// isolate here (also to share between es5 and array modules).
function getSparseArrayIndexes(arr, fromIndex, loop, fromRight) {
  var indexes = [], i;
  for (i in arr) {
    if (isArrayIndex(i) && (loop || (fromRight ? i <= fromIndex : i >= fromIndex))) {
      indexes.push(+i);
    }
  }
  indexes.sort(function(a, b) {
    var aLoop = a > fromIndex;
    var bLoop = b > fromIndex;
    if (aLoop !== bLoop) {
      return aLoop ? -1 : 1;
    }
    return a - b;
  });
  return indexes;
}

function getEntriesForIndexes(obj, find, loop, isString) {
  var result, length = obj.length;
  if (!isArray(find)) {
    return entryAtIndex(obj, find, length, loop, isString);
  }
  result = [];
  forEach(find, function(index) {
    result.push(entryAtIndex(obj, index, length, loop, isString));
  });
  return result;
}

function entryAtIndex(obj, index, length, loop, isString) {
  if (index && loop) {
    index = index % length;
  }
  if (index < 0) index = length + index;
  return isString ? obj.charAt(index) : obj[index];
}

function mapWithShortcuts(el, f, context, mapArgs) {
  if (!f) {
    return el;
  } else if (f.apply) {
    return f.apply(context, mapArgs || []);
  } else if (isArray(f)) {
    return f.map(function(m) {
      return mapWithShortcuts(el, m, context, mapArgs);
    });
  } else if (isFunction(el[f])) {
    return el[f].call(el);
  } else {
    return deepGetProperty(el, f);
  }
}

function commaSplit(arr) {
  return arr.split(HALF_WIDTH_COMMA);
}

function periodSplit(arr) {
  return arr.split(HALF_WIDTH_PERIOD);
}

function forEach(arr, fn) {
  for (var i = 0, len = arr.length; i < len; i++) {
    if (!(i in arr)) {
      return iterateOverSparseArray(arr, fn, i);
    }
    fn(arr[i], i);
  }
}

function filter(arr, fn) {
  var result = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    var el = arr[i];
    if (i in arr && fn(el, i)) {
      result.push(el);
    }
  }
  return result;
}

function some(arr, fn) {
  for (var i = 0, len = arr.length; i < len; i++) {
    if (i in arr && fn(arr[i], i)) {
      return true;
    }
  }
  return false;
}

function map(arr, fn) {
  var result = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (i in arr) {
      result.push(fn(arr[i], i));
    }
  }
  return result;
}

function indexOf(arr, el) {
  for (var i = 0, len = arr.length; i < len; i++) {
    if (i in arr && arr[i] === el) return i;
  }
  return -1;
}

// Number helpers

var trunc = Math.trunc || function(n) {
  if (n === 0 || !isFinite(n)) return n;
  return n < 0 ? ceil(n) : floor(n);
};

function isRealNaN(obj) {
  // This is only true of NaN
  return obj != null && obj !== obj;
}

function withPrecision(val, precision, fn) {
  var multiplier = pow(10, abs(precision || 0));
  fn = fn || round;
  if (precision < 0) multiplier = 1 / multiplier;
  return fn(val * multiplier) / multiplier;
}

function padNumber(num, place, sign, base, replacement) {
  var str = abs(num).toString(base || 10);
  str = repeatString(replacement || '0', place - str.replace(/\.\d+/, '').length) + str;
  if (sign || num < 0) {
    str = (num < 0 ? '-' : '+') + str;
  }
  return str;
}

function getOrdinalSuffix(num) {
  if (num >= 11 && num <= 13) {
    return 'th';
  } else {
    switch(num % 10) {
      case 1:  return 'st';
      case 2:  return 'nd';
      case 3:  return 'rd';
      default: return 'th';
    }
  }
}

// Fullwidth number helpers
var fullWidthNumberReg, fullWidthNumberMap, fullWidthNumbers;

function buildFullWidthNumber() {
  var fwp = FULL_WIDTH_PERIOD, hwp = HALF_WIDTH_PERIOD, hwc = HALF_WIDTH_COMMA, fwn = '';
  fullWidthNumberMap = {};
  for (var i = 0, digit; i <= 9; i++) {
    digit = chr(i + FULL_WIDTH_ZERO);
    fwn += digit;
    fullWidthNumberMap[digit] = chr(i + HALF_WIDTH_ZERO);
  }
  fullWidthNumberMap[hwc] = '';
  fullWidthNumberMap[fwp] = hwp;
  // Mapping this to itself to capture it easily
  // in stringToNumber to detect decimals later.
  fullWidthNumberMap[hwp] = hwp;
  fullWidthNumberReg = allCharsReg(fwn + fwp + hwc + hwp);
  fullWidthNumbers = fwn;
}

// Takes into account full-width characters, commas, and decimals.
function stringToNumber(str, base) {
  var sanitized, isDecimal;
  sanitized = str.replace(fullWidthNumberReg, function(chr) {
    var replacement = getOwn(fullWidthNumberMap, chr);
    if (replacement === HALF_WIDTH_PERIOD) {
      isDecimal = true;
    }
    return replacement;
  });
  return isDecimal ? parseFloat(sanitized) : parseInt(sanitized, base || 10);
}

// Math aliases
var abs   = Math.abs,
    pow   = Math.pow,
    min   = Math.min,
    max   = Math.max,
    ceil  = Math.ceil,
    floor = Math.floor,
    round = Math.round;


// String helpers

var chr = String.fromCharCode;

function trim(str) {
  return str.trim();
}

function repeatString(str, num) {
  var result = '';
  str = str.toString();
  while (num > 0) {
    if (num & 1) {
      result += str;
    }
    if (num >>= 1) {
      str += str;
    }
  }
  return result;
}

function simpleCapitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function createFormatMatcher(bracketMatcher, percentMatcher, precheck) {

  var reg = STRING_FORMAT_REG;
  var compiledFormats = {};

  function getToken(format, match) {
    var get, token, literal, fn;
    var bKey = match[2];
    var pLit = match[3];
    var pKey = match[5];
    if (match[4] && percentMatcher) {
      token = pKey;
      get = percentMatcher;
    } else if (bKey) {
      token = bKey;
      get = bracketMatcher;
    } else if (pLit && percentMatcher) {
      literal = pLit;
    } else {
      literal = match[1] || match[0];
    }
    if (get) {
      assertPassesPrecheck(precheck, bKey, pKey);
      fn = function(obj, opt) {
        return get(obj, token, opt);
      };
    }
    format.push(fn || getLiteral(literal));
  }

  function getSubstring(format, str, start, end) {
    if (end > start) {
      var sub = str.slice(start, end);
      assertNoUnmatched(sub, OPEN_BRACE);
      assertNoUnmatched(sub, CLOSE_BRACE);
      format.push(function() {
        return sub;
      });
    }
  }

  function getLiteral(str) {
    return function() {
      return str;
    };
  }

  function assertPassesPrecheck(precheck, bt, pt) {
    if (precheck && !precheck(bt, pt)) {
      throw new TypeError('Invalid token '+ (bt || pt) +' in format string.');
    }
  }

  function assertNoUnmatched(str, chr) {
    if (str.indexOf(chr) !== -1) {
      throw new TypeError('Unmatched '+ chr +' in format string.');
    }
  }

  function compile(str) {
    var format = [], lastIndex = 0, match;
    reg.lastIndex = 0;
    while(match = reg.exec(str)) {
      getSubstring(format, str, lastIndex, match.index);
      getToken(format, match);
      lastIndex = reg.lastIndex;
    }
    getSubstring(format, str, lastIndex, str.length);
    return compiledFormats[str] = format;
  }

  return function(str, obj, opt) {
    var format = getOwn(compiledFormats, str) || compile(str), result = '';
    for (var i = 0; i < format.length; i++) {
      result += format[i](obj, opt);
    }
    return result;
  };
}

// Inflection helper

var Inflections = {};

function getAcronym(str) {
  return Inflections.acronyms && Inflections.acronyms.find(str);
}

function getHumanWord(str) {
  return Inflections.human && Inflections.human.find(str);
}

function runHumanRules(str) {
  return Inflections.human && Inflections.human.runRules(str) || str;
}

// RegExp helpers

function allCharsReg(src) {
  return RegExp('[' + src + ']', 'g');
}

function getRegExpFlags(reg, add) {
  var flags = '';
  add = add || '';
  function checkFlag(prop, flag) {
    if (prop || add.indexOf(flag) > -1) {
      flags += flag;
    }
  }
  checkFlag(reg.global, 'g');
  checkFlag(reg.ignoreCase, 'i');
  checkFlag(reg.multiline, 'm');
  checkFlag(reg.sticky, 'y');
  return flags;
}

function escapeRegExp(str) {
  if (!isString(str)) str = String(str);
  return str.replace(/([\\\/\'*+?|()\[\]{}.^$-])/g,'\\$1');
}


// Date helpers

var _utc = privatePropertyAccessor('utc');

function callDateGet(d, method) {
  return d['get' + (_utc(d) ? 'UTC' : '') + method]();
}

function callDateSet(d, method, value) {
  if (value === callDateGet(d, method, value)) {
    // Do not set the date if the value is the same as what is currently set.
    // Setting should in theory be a noop, but causes unintentional timezone
    // shifts when in the middle of a DST fallback.
    return d.getTime();
  }
  return d['set' + (_utc(d) ? 'UTC' : '') + method](value);
}

buildClassChecks();
buildFullWidthNumber();
