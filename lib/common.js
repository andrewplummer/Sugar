  'use strict';


  /***
   * @package Common
   * @description Internal utility and common methods.
   ***/

  var sugarObject   = Sugar.Object,
      sugarArray    = Sugar.Array,
      sugarDate     = Sugar.Date,
      sugarString   = Sugar.String,
      sugarNumber   = Sugar.Number,
      sugarFunction = Sugar.Function,
      sugarRegExp   = Sugar.RegExp;

  // Are regexes type function?
  var REGEX_IS_FUNCTION = typeof RegExp() === 'function';

  // Do strings have no keys?
  var NO_KEYS_IN_STRING_OBJECTS = !('0' in new String('a'));

  // Classes that can be matched by value
  var MATCHED_BY_VALUE_REG = /^\[object Date|Array|String|Number|RegExp|Boolean|Arguments\]$/;

  // Full width number helpers

  var HALF_WIDTH_ZERO = 0x30;
  var HALF_WIDTH_NINE = 0x39;
  var FULL_WIDTH_ZERO = 0xff10;
  var FULL_WIDTH_NINE = 0xff19;

  var HALF_WIDTH_PERIOD = '.';
  var FULL_WIDTH_PERIOD = '．';
  var HALF_WIDTH_COMMA  = ',';

  // Used here and later in the Date package.
  var fullWidthDigits   = '';

  var numberNormalizeMap = {};
  var numberNormalizeReg;

  // Internal toString
  var internalToString = Object.prototype.toString;

  // Math helpers
  var abs   = Math.abs;
  var pow   = Math.pow;
  var ceil  = Math.ceil;
  var floor = Math.floor;
  var round = Math.round;
  var min   = Math.min;
  var max   = Math.max;

  // Type check methods need a way to be accessed dynamically.
  var typeChecks = {};

  var isBoolean  = buildPrimitiveClassCheck('boolean', NATIVES[0]);
  var isNumber   = buildPrimitiveClassCheck('number',  NATIVES[1]);
  var isString   = buildPrimitiveClassCheck('string',  NATIVES[2]);

  var isArray    = buildClassCheck(NATIVES[3]);
  var isDate     = buildClassCheck(NATIVES[4]);
  var isRegExp   = buildClassCheck(NATIVES[5]);

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
  var isFunction = buildClassCheck(NATIVES[6]);

  // Hash constructor
  var Hash = function(obj) {
    simpleMerge(this, coercePrimitiveToObject(obj));
  };

  Hash.prototype.constructor = Object;

  function isClass(obj, klass, cached) {
    var k = cached || className(obj);
    return k === '[object '+klass+']';
  }

  function buildClassCheck(klass) {
    var fn = (klass === 'Array' && Array.isArray) || function(obj, cached) {
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

  function defineStaticSimilar(namespace, set, fn) {
    defineSimilar(namespace, set, fn);
  }

  function defineInstanceSimilar(namespace, set, fn, flag) {
    defineSimilar(namespace, set, fn, true, false, flag);
  }

  function defineInstanceSimilarWithArguments(namespace, set, fn, flag) {
    defineSimilar(namespace, set, fn, true, true, flag);
  }

  function defineSimilar(namespace, set, fn, instance, args, flag) {
    var methods = {};
    if (isString(set)) {
      set = commaSplit(set);
    }
    set.forEach(function(name, i) {
      fn(methods, name, i);
    });
    defineMethods(namespace, methods, instance, args, flag);
  }

  // Argument helpers

  function isArgumentsObject(obj, klass) {
    klass = klass || className(obj);
    // .callee exists on Arguments objects in < IE8
    return hasProperty(obj, 'length') && (klass === '[object Arguments]' || !!obj.callee);
  }

  function checkCallable(fn) {
    if (!isFunction(fn)) {
      throw new TypeError('Function is not callable');
    }
  }


  // General helpers

  function isDefined(o) {
    return o !== undefined;
  }

  function isUndefined(o) {
    return o === undefined;
  }


  // Object helpers

  function deepGetProperty(obj, prop) {
    var ns = obj, split;
    if(prop == null) return;
    prop = String(prop);
    // indexOf is very performant for the kind of strings
    // used for object keys, so look ahead and bail early
    // if there are no dots in the string.
    if (prop.indexOf(HALF_WIDTH_PERIOD) === -1) {
      return ns ? ns[prop] : undefined;
    }
    split = periodSplit(prop);
    for (var i = 0, len = split.length; i < len; i++) {
      if (ns == null) {
        return;
      }
      ns = ns[split[i]];
    }
    return ns;
  }

  function keysWithObjectCoercion(obj) {
    return Object.keys(coercePrimitiveToObject(obj));
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
    klass = klass || className(obj);
    try {
      // Not own constructor property must be Object
      // This code was borrowed from jQuery.isPlainObject
      if (obj && obj.constructor &&
            !hasOwnProperty(obj, 'constructor') &&
            !hasOwnProperty(obj.constructor.prototype, 'isPrototypeOf')) {
        return false;
      }
    } catch (e) {
      // IE8,9 Will throw exceptions on certain host objects.
      return false;
    }
    // === on the constructor is not safe across iframes
    // 'hasOwnProperty' ensures that the object also inherits
    // from Object, which is false for DOMElements in IE.
    return !!obj && klass === '[object Object]' && 'hasOwnProperty' in obj;
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
    while(chr = obj.charAt(i)) {
      obj[i++] = chr;
    }
  }

  function stringify(thing, stack) {
    var type = typeof thing, isObject, isArrayLike, klass, value, arr, key, i, len;

    // Return quickly if string to save cycles
    if (type === 'string') return thing;

    klass       = internalToString.call(thing);
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
      arr = isArrayLike ? thing : Object.keys(thing).sort();
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
    if (a === b) {
      // Return quickly up front when matching by reference,
      // but be careful about 0 !== -0.
      return a !== 0 || 1 / a === 1 / b;
    } else if (objectIsMatchedByValue(a) && objectIsMatchedByValue(b)) {
      return stringify(a) === stringify(b);
    }
    return false;
  }

  function objectIsMatchedByValue(obj) {
    // Only known objects are matched by value. This is notably excluding functions, DOM Elements, and instances of
    // user-created classes. The latter can arguably be matched by value, but distinguishing between these and
    // host objects -- which should never be compared by value -- is very tricky so not dealing with it here.
    var klass = className(obj);
    return MATCHED_BY_VALUE_REG.test(klass) || isPlainObject(obj, klass);
  }


  // Array helpers

  function isArrayIndex(n) {
    return n >>> 0 == n && n != 0xFFFFFFFF;
  }

  function arrayClone(arr) {
    return simpleMerge([], arr);
  }

  function commaSplit(arr) {
    return arr.split(HALF_WIDTH_COMMA);
  }

  function periodSplit(arr) {
    return arr.split(HALF_WIDTH_PERIOD);
  }

  function getEntriesForIndexes(obj, args, isString) {
    var result,
        length    = obj.length,
        argsLen   = args.length,
        overshoot = args[argsLen - 1] !== false,
        multiple  = argsLen > (overshoot ? 1 : 2);
    if (!multiple) {
      return entryAtIndex(obj, length, args[0], overshoot, isString);
    }
    result = [];
    for (var i = 0; i < args.length; i++) {
      var index = args[i];
      if (!isBoolean(index)) {
        result.push(entryAtIndex(obj, length, index, overshoot, isString));
      }
    }
    return result;
  }

  function entryAtIndex(obj, length, index, overshoot, isString) {
    if (overshoot && index) {
      index = index % length;
      if (index < 0) index = length + index;
    }
    return isString ? obj.charAt(index) : obj[index];
  }

  function mapWithShortcuts(el, map, context, mapArgs) {
    if (!map) {
      return el;
    } else if (map.apply) {
      return map.apply(context, mapArgs || []);
    } else if (isArray(map)) {
      return map.map(function(m) {
        return mapWithShortcuts(el, m, context, mapArgs);
      });
    } else if (isFunction(el[map])) {
      return el[map].call(el);
    } else {
      return deepGetProperty(el, map);
    }
  }


  // Number helpers

  var trunc = Math.trunc || function(n) {
    n = +n;
    if (n === 0 || !isFinite(n)) return n;
    return n < 0 ? ceil(n) : floor(n);
  }

  function checkRepeatRange(n) {
    n = +n;
    if (n < 0 || n === Infinity) {
      throw new RangeError('Invalid number');
    }
    return n;
  }

  function withPrecision(val, precision, fn) {
    var multiplier = pow(10, abs(precision || 0));
    fn = fn || round;
    if (precision < 0) multiplier = 1 / multiplier;
    return fn(val * multiplier) / multiplier;
  }

  function codeIsNumeral(code) {
    return (code >= HALF_WIDTH_ZERO && code <= HALF_WIDTH_NINE) ||
           (code >= FULL_WIDTH_ZERO && code <= FULL_WIDTH_NINE);
  }

  function padNumber(num, place, sign, base) {
    var str = abs(num).toString(base || 10);
    str = repeatString('0', place - str.replace(/\.\d+/, '').length) + str;
    if (sign || num < 0) {
      str = (num < 0 ? '-' : '+') + str;
    }
    return str;
  }

  function getOrdinalizedSuffix(num) {
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

  function buildNumberHelpers() {
    var digit, i;
    for(i = 0; i <= 9; i++) {
      digit = chr(i + FULL_WIDTH_ZERO);
      fullWidthDigits += digit;
      numberNormalizeMap[digit] = chr(i + HALF_WIDTH_ZERO);
    }
    numberNormalizeMap[HALF_WIDTH_COMMA] = '';
    numberNormalizeMap[FULL_WIDTH_PERIOD] = HALF_WIDTH_PERIOD;
    // Mapping this to itself to easily be able to easily
    // capture it in stringToNumber to detect decimals later.
    numberNormalizeMap[HALF_WIDTH_PERIOD] = HALF_WIDTH_PERIOD;
    numberNormalizeReg = RegExp('[' + fullWidthDigits + FULL_WIDTH_PERIOD + HALF_WIDTH_COMMA + HALF_WIDTH_PERIOD + ']', 'g');
  }


  // String helpers

  function chr(num) {
    return String.fromCharCode(num);
  }

  // WhiteSpace/LineTerminator as defined in ES5.1 plus Unicode characters in the Space, Separator category.
  function getTrimmableCharacters() {
    return '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF';
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

  // Returns taking into account full-width characters, commas, and decimals.
  function stringToNumber(str, base) {
    var sanitized, isDecimal;
    sanitized = str.replace(numberNormalizeReg, function(chr) {
      var replacement = numberNormalizeMap[chr];
      if (replacement === HALF_WIDTH_PERIOD) {
        isDecimal = true;
      }
      return replacement;
    });
    return isDecimal ? parseFloat(sanitized) : parseInt(sanitized, base || 10);
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

  function callDateGet(d, method) {
    return d['get' + (d._utc ? 'UTC' : '') + method]();
  }

  function callDateSet(d, method, value) {
    return d['set' + (d._utc ? 'UTC' : '') + method](value);
  }


  buildNumberHelpers();
