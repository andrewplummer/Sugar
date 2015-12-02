  'use strict';


  /***
   * @package Common
   * @description Internal utility and common methods.
   ***/

  // Flag allowing native methods to be enhanced
  var ENHANCEMENTS_FLAG = 'enhance';

  // Excludes object as this is more nuanced.
  var TYPE_CHECK_NAMES = ['Boolean','Number','String','Array','Date','RegExp','Function'];

  // Are regexes type function?
  var REGEX_IS_FUNCTION = typeof RegExp() === 'function';

  // Do strings have no keys?
  var NO_KEYS_IN_STRING_OBJECTS = !('0' in Object('a'));

  // Classes that can be matched by value
  var MATCHED_BY_VALUE_REG = /^\[object Date|Array|String|Number|RegExp|Boolean|Arguments\]$/;

  // Prefix for private properties
  var PRIVATE_PROP_PREFIX = '_sugar_';

  // Matches 1..2 style ranges in properties
  var PROPERTY_RANGE_REG = /^(.*?)\[([-\d]*)\.\.([-\d]*)\](.*)$/;

  var TO_STRING       = 'toString';
  var CONSTRUCTOR     = 'constructor';
  var IS_PROTOTYPE_OF = 'isPrototypeOf';
  var OBJECT_CLASS    = '[object Object]';

  var HALF_WIDTH_ZERO = 0x30;
  var FULL_WIDTH_ZERO = 0xff10;

  var HALF_WIDTH_PERIOD   = '.';
  var FULL_WIDTH_PERIOD   = '．';
  var HALF_WIDTH_COMMA    = ',';

  // Namespace shortcuts
  var sugarObject   = Sugar.Object,
      sugarArray    = Sugar.Array,
      sugarDate     = Sugar.Date,
      sugarString   = Sugar.String,
      sugarNumber   = Sugar.Number,
      sugarFunction = Sugar.Function,
      sugarRegExp   = Sugar.RegExp;

  // Internal toString
  var internalToString = Object.prototype.toString;

  // Type check methods need a way to be accessed dynamically.
  var typeChecks = {};

  var isBoolean  = buildPrimitiveClassCheck('boolean', TYPE_CHECK_NAMES[0]);
  var isNumber   = buildPrimitiveClassCheck('number',  TYPE_CHECK_NAMES[1]);
  var isString   = buildPrimitiveClassCheck('string',  TYPE_CHECK_NAMES[2]);

  var isArray    = buildClassCheck(TYPE_CHECK_NAMES[3]);
  var isDate     = buildClassCheck(TYPE_CHECK_NAMES[4]);
  var isRegExp   = buildClassCheck(TYPE_CHECK_NAMES[5]);

  // Wanted to enhance performance here by using simply "typeof"
  // but Firefox has two major issues that make this impossible,
  // one fixed, the other not. Despite being typeof "function"
  // the objects below still report in as [object Function], so
  // we need to perform a full class check here.
  //
  // 1. Regexes can be typeof "function" in FF < 3
  //    https://bugzilla.mozilla.org/show_bug.cgi?id=61911 (fixed)
  //
  // 2. HTMLEmbedElement and HTMLObjectElement are be typeof "function"
  //    https://bugzilla.mozilla.org/show_bug.cgi?id=268945 (won't fix)
  //
  var isFunction = buildClassCheck(TYPE_CHECK_NAMES[6]);

  var isSet = buildClassCheck('Set');

  function isClass(obj, klass, cached) {
    var k = cached || className(obj);
    return k === '[object '+ klass +']';
  }

  function buildClassCheck(klass) {
    var fn = klass === 'Array' && Array.isArray || function(obj, cached) {
      return isClass(obj, klass, cached);
    };
    typeChecks[klass] = fn;
    return fn;
  }

  function buildPrimitiveClassCheck(type, klass) {
    var fn = function(obj) {
      if (isObjectType(obj)) {
        return isClass(obj, klass);
      }
      return typeof obj === type;
    }
    typeChecks[klass] = fn;
    return fn;
  }

  function className(obj) {
    return internalToString.call(obj);
  }

  // Defining Methods. This saves us a few bytes in the minified script.

  function alias(sugarNamespace, toName, fromName) {
    sugarNamespace.alias(toName, fromName);
  }

  function defineStatic(sugarNamespace, methods, flags) {
    sugarNamespace.defineStatic(methods, flags);
  }

  function defineStaticWithArguments(sugarNamespace, methods, flags) {
    sugarNamespace.defineStaticWithArguments(methods, flags);
  }

  function defineInstance(sugarNamespace, methods, flags) {
    sugarNamespace.defineInstance(methods, flags);
  }

  function defineInstanceWithArguments(sugarNamespace, methods, flags) {
    sugarNamespace.defineInstanceWithArguments(methods, flags);
  }

  function defineInstanceSimilar(sugarNamespace, set, fn, flags) {
    sugarNamespace.defineInstance(collectMethods(set, fn), flags);
  }

  function defineStaticPolyfill(sugarNamespace, methods) {
    sugarNamespace.defineStaticPolyfill(methods);
  }

  function defineInstancePolyfill(sugarNamespace, methods) {
    sugarNamespace.defineInstancePolyfill(methods);
  }

  function defineStaticProperties(sugarNamespace, props) {
    iterateOverObject(props, function(name, prop) {
      setProperty(sugarNamespace, name, prop, true);
    });
  }

  function collectMethods(set, fn) {
    var methods = {};
    if (isString(set)) {
      set = commaSplit(set);
    }
    forEach(set, function(name, i) {
      fn(methods, name, i);
    });
    return methods;
  }

  function defineAccessor(namespace, name, global) {
    var local, accessor;
    accessor = function(val) {
      if (arguments.length > 0) {
        local = val;
      }
      return local != null ? local : global;
    }
    defineStatic(namespace, name, accessor);
    return accessor;
  }

  // Argument helpers

  function isArgumentsObject(obj, klass) {
    klass = klass || className(obj);
    // .callee exists on Arguments objects in < IE8
    return hasProperty(obj, 'length') && (klass === '[object Arguments]' || !!obj.callee);
  }

  function assertCallable(fn) {
    if (!isFunction(fn)) {
      throw new TypeError('Function is not callable');
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
    }
  }

  // Object helpers

  var getKeys = Object.keys;

  function deepGetProperty(obj, key) {
    return handleDeepProperty(obj, key);
  }

  function deepSetProperty(obj, key, val) {
    handleDeepProperty(obj, key, true, false, val);
    return obj;
  }

  function handleDeepProperty(obj, key, fill, fillLast, val) {
    var prop = obj || undefined, bs, ps, cbi, set, isLast, isPush, isIndex, nextIsIndex;
    if(key == null) return;
    key = String(key);

    // Bail early here to save a few cycles as objects can often be
    // inadvertently passed as keys, and happen to have a bracket syntax.
    if (key === OBJECT_CLASS) {
      return prop[key];
    }

    if (key.indexOf('..') !== -1) {
      return handleArrayIndexRange(obj, key, val);
    }
    bs = key.split('[');
    set = isDefined(val);

    for (var i = 0, blen = bs.length; i < blen; i++) {
      ps = periodSplit(bs[i]);

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
          key = prop.length;
        } else if (isIndex) {
          // Remove the closing ]
          key = key.slice(0, -1);
        }

        // If the array index is less than 0, then
        // add its length to allow negative indexes.
        if (isIndex && key < 0) {
          key = +key + prop.length;
        }

        // Bracket keys may look like users[5] or just [5], so the leading
        // characters are optional. We can enter the namespace if this is the
        // 2nd part, if there is only 1 part, or if there is an explicit key.
        if (i || key || blen === 1) {

          // Non-existent namespaces are only filled if they are intermediate
          // (not at the end) or explicitly filling the last.
          if (fill && (!isLast || fillLast) && !(key in prop)) {
            // For our purposes, last only needs to be an array.
            prop[key] = nextIsIndex || (fillLast && isLast) ? [] : {};
          }

          if (set && isLast) {
            if (isPrimitiveType(prop)) {
              // If strict mode is active then primitives will throw an
              // error when attempting to write properties. We can't be
              // sure if strict mode is available, so pre-emptively
              // throw an error here to ensure consistent behavior.
              throw new TypeError('Property cannot be written.');
            }
            prop[key] = val;
          }

          prop = prop && prop[key];
        }

      }
    }
    return prop;
  }

  // Get object property with support for 0..1 style range notation.
  function handleArrayIndexRange(obj, key, val) {
    var match, start, end, leading, trailing, set;
    set = isDefined(val);
    match = key.match(PROPERTY_RANGE_REG);
    if (!match) {
      return;
    }
    leading  = match[1];
    trailing = match[4];
    start    = match[2] ? +match[2] : 0;
    end      = match[3] ? +match[3] : obj.length;

    // A range of 0..1 is inclusive, so we need to add 1 to the end. If this
    // pushes the index from -1 to 0, then set it to the full length of the
    // array, otherwise it will return nothing.
    end = end === -1 ? obj.length : end + 1;

    if (leading) {
      obj = handleDeepProperty(obj, leading, set ? true : false, true);
    }

    if (set) {
      for (var i = start; i < end; i++) {
        handleDeepProperty(obj, i + trailing, true, false, val);
      }
    } else {
      obj = obj.slice(start, end);

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
        return obj.map(function(el) {
          return mapWithShortcuts(el, trailing);
        });
      }
    }
    return obj;
  }

  function keysWithObjectCoercion(obj) {
    return getKeys(coercePrimitiveToObject(obj));
  }

  function hasProperty(obj, prop) {
    return !isPrimitiveType(obj) && prop in obj;
  }

  function isObjectType(obj) {
    // 1. Check for null
    // 2. Check for regexes in environments where they are "functions".
    return !!obj && (typeof obj === 'object' || (REGEX_IS_FUNCTION && isRegExp(obj)));
  }

  function isPrimitiveType(obj) {
    var type = typeof obj;
    return obj == null || type === 'string' || type === 'number' || type === 'boolean';
  }

  function isPlainObject(obj, klass) {
    if (!isObjectType(obj) || !isClass(obj, 'Object', klass) || !hasValidPlainObjectPrototype(obj)) {
      return false;
    }
    // Allowing internally defined Hash to report back as a plain object as well.
    return allOwnEnumerable(obj) || obj instanceof Hash;
  }

  function hasValidPlainObjectPrototype(obj) {
    var hasToString = TO_STRING in obj;
    var hasConstructor = CONSTRUCTOR in obj;
    // An object created with Object.create(null) has no methods in the
    // prototype chain, so check if any are missing. The additional hasToString
    // check is for false positives on some host objects in old IE which have
    // toString but no constructor. If the object has an inherited constructor,
    // then check if it is Object (the "isPrototypeOf" tapdance here is a more
    // robust way of ensuring this if the global has been hijacked). Note that
    // accessing the constructor directly (without "in" or "hasOwnProperty")
    // will throw a permissions error in IE8 on cross-domain windows.
    return (!hasConstructor && !hasToString) ||
           (hasConstructor && !hasOwnProperty(obj, CONSTRUCTOR) && hasOwnProperty(obj.constructor.prototype, IS_PROTOTYPE_OF));
  }

  function allOwnEnumerable(obj) {
    // An object's "own" properties are enumerated first,
    // so save some cycles here by only checking the last.
    for (var key in obj) {};
    return key === undefined || hasOwnProperty(obj, key);
  }

  function simpleRepeat(n, fn) {
    for(var i = 0; i < n; i++) {
      fn(i);
    }
  }

  function simpleClone(obj) {
    return simpleMerge({}, obj);
  }

  function simpleMerge(target, source) {
    iterateOverObject(source, function(key) {
      target[key] = source[key];
    });
    return target;
  }

  // Make primtives types like strings into objects.
  function coercePrimitiveToObject(obj) {
    if (isPrimitiveType(obj)) {
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

  function stringify(thing, stack) {
    var type = typeof thing, isObject, isArrayLike, klass, value, arr, key, i, len;

    // Return quickly if string to save cycles
    if (type === 'string') return thing;

    klass       = className(thing);
    isObject    = isPlainObject(thing, klass);
    isArrayLike = isArray(thing, klass) || isArgumentsObject(thing, klass);

    if (thing != null && isObject || isArrayLike) {
      // This method for checking for cyclic structures was egregiously stolen from
      // the ingenious method by @kitcambridge from the Underscore script:
      // https://github.com/documentcloud/underscore/issues/240
      if (!stack) stack = [];
      // Allowing a step into the structure before triggering this
      // script to save cycles on standard JSON structures and also to
      // try as hard as possible to catch basic properties that may have
      // been modified.
      if (stack.length > 1) {
        i = stack.length;
        while (i--) {
          if (stack[i] === thing) {
            return 'CYC';
          }
        }
      }
      stack.push(thing);
      value = thing.valueOf() + String(thing.constructor);
      // Keys need to be sorted to ensure the same result.
      arr = isArrayLike ? thing : getKeys(thing).sort();
      for(i = 0, len = arr.length; i < len; i++) {
        key = isArrayLike ? i : arr[i];
        value += key + stringify(thing[key], stack);
      }
      stack.pop();
    } else if (1 / thing === -Infinity) {
      value = '-0';
    } else {
      value = String(thing && thing.valueOf ? thing.valueOf() : thing);
    }
    return type + klass + value;
  }

  function isEqual(a, b) {
    var aClass, bClass;
    if (a === b) {
      // Return quickly up front when matching by reference,
      // but be careful about 0 !== -0.
      return a !== 0 || 1 / a === 1 / b;
    }
    aClass = className(a);
    bClass = className(b);
    if (objectIsMatchedByValue(a, aClass) && objectIsMatchedByValue(b, bClass)) {
      return stringify(a) === stringify(b);
    } else if (isSet(a, aClass) && isSet(b, bClass)) {
      return setIsEqual(a, b);
    }
    return false;
  }

  function objectIsMatchedByValue(obj, klass) {
    // Only known objects are matched by value. This is notably excluding functions, DOM Elements, and instances of
    // user-created classes. The latter can arguably be matched by value, but distinguishing between these and
    // host objects -- which should never be compared by value -- is very tricky so not dealing with it here.
    klass = klass || className(obj);
    return MATCHED_BY_VALUE_REG.test(klass) || isPlainObject(obj, klass);
  }

  function setIsEqual(s1, s2) {
    var equal = true;
    // iOS 8 supports sets but has an incomplete implementation of Iterators so
    // avoiding .next syntax here. Also can't use for..of as it would be a
    // syntax error. Fortunately forEach is supported.
    s1.forEach(function(v) {
      if (equal && !s2.has(v)) {
        equal = false;
      }
    });
    return equal && s1.size === s2.size;
  }


  // Array helpers

  function isArrayIndex(n) {
    return n >>> 0 == n && n != 0xFFFFFFFF;
  }

  // It's unclear whether or not sparse arrays qualify as "simple enumerables".
  // If they are not, however, the wrapping function will be deoptimized, so
  // isolate here (also to share between es5 and array packages).
  function getSparseArrayIndexes(arr, startIndex, fromRight) {
    var indexes = [], i;
    for(i in arr) {
      if (isArrayIndex(i) && (fromRight ? i <= startIndex : i >= startIndex)) {
        indexes.push(+i);
      }
    }
    return indexes;
  }

  function commaSplit(arr) {
    return arr.split(HALF_WIDTH_COMMA);
  }

  function periodSplit(arr) {
    return arr.split(HALF_WIDTH_PERIOD);
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
    if (index && loop !== false) {
      index = index % length;
      if (index < 0) index = length + index;
    }
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

  // These are very simplified forms of ES5 methods that don't have to handle
  // edge cases and can be minified to save a few bytes in the build. These
  // methods have very simplistic handling of sparse arrays by skipping over
  // undefined keys, as they should never be called on user input.

  function forEach(arr, fn) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (i in arr) {
        fn(arr[i], i);
      }
    }
  }

  function filter(arr, fn) {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      var el = arr[i];
      if (i in arr && fn(el, i)) {
        result.push(el);
      };
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

  // Used here and later in the Date package.
  var fullWidthNumberReg;
  var fullWidthNumberMap = {};
  var fullWidthNumbers = '';

  function buildFullWidthNumber() {
    var digit, i;
    for(i = 0; i <= 9; i++) {
      digit = chr(i + FULL_WIDTH_ZERO);
      fullWidthNumbers += digit;
      fullWidthNumberMap[digit] = chr(i + HALF_WIDTH_ZERO);
    }
    fullWidthNumberMap[HALF_WIDTH_COMMA] = '';
    fullWidthNumberMap[FULL_WIDTH_PERIOD] = HALF_WIDTH_PERIOD;
    // Mapping this to itself to capture it easily
    // in stringToNumber to detect decimals later.
    fullWidthNumberMap[HALF_WIDTH_PERIOD] = HALF_WIDTH_PERIOD;
    fullWidthNumberReg = RegExp('[' + fullWidthNumbers + FULL_WIDTH_PERIOD + HALF_WIDTH_COMMA + HALF_WIDTH_PERIOD + ']', 'g');
  }

  // Takes into account full-width characters, commas, and decimals.
  function stringToNumber(str, base) {
    var sanitized, isDecimal;
    sanitized = str.replace(fullWidthNumberReg, function(chr) {
      var replacement = fullWidthNumberMap[chr];
      if (replacement === HALF_WIDTH_PERIOD) {
        isDecimal = true;
      }
      return replacement;
    });
    return isDecimal ? parseFloat(sanitized) : parseInt(sanitized, base || 10);
  }


  // Math helpers

  var abs    = Math.abs;
  var pow    = Math.pow;
  var min    = Math.min;
  var max    = Math.max;
  var ceil   = Math.ceil;
  var floor  = Math.floor;
  var round  = Math.round;


  // String helpers

  var chr = String.fromCharCode;

  // WhiteSpace/LineTerminator as defined in ES5.1 plus Unicode characters in the Space, Separator category.
  var TRIM_CHARS = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF';
  var TRIM_REG = RegExp('^[' + TRIM_CHARS + ']+|['+ TRIM_CHARS +']+$', 'g')

  // Simplified trim that assumes a string (String#trim included in the polyfills).
  function trim(str) {
    return str.replace(TRIM_REG, '');
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


  // RegExp helpers

  function getRegExpFlags(reg, add) {
    var flags = '';
    add = add || '';
    function checkFlag(prop, flag) {
      if (prop || add.indexOf(flag) > -1) {
        flags += flag;
      }
    }
    checkFlag(reg.multiline, 'm');
    checkFlag(reg.ignoreCase, 'i');
    checkFlag(reg.global, 'g');
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
    return d['set' + (_utc(d) ? 'UTC' : '') + method](value);
  }


  // Hash definition

  function Hash(obj) {
    simpleMerge(this, coercePrimitiveToObject(obj));
  }

  Hash.prototype.constructor = Object;


  // Build

  buildFullWidthNumber();
