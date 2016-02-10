'use strict';

/***
 * @module Object
 * @description Object creation, manipulation, comparison, and type checking.
 *
 * Much thanks to kangax for his informative aricle about how problems with instanceof and constructor
 * http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
 *
 ***/

// Flag allowing Object.keys to be enhanced
var OBJECT_ENHANCEMENTS_FLAG = 'enhanceObject';

var DONT_ENUM_PROPS = [
  'valueOf',
  'toString',
  'constructor',
  'isPrototypeOf',
  'hasOwnProperty',
  'toLocaleString',
  'propertyIsEnumerable'
];

// Matches bracket-style query strings like user[name]
var DEEP_QUERY_STRING_REG = /^(.+?)(\[.*\])$/;

// Matches any character not allowed in a decimal number.
var NON_DECIMAL_REG = /[^\d.-]/;

// Native methods for merging by descriptor when available.
var getOwnPropertyNames      = Object.getOwnPropertyNames;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Internal reference to check if an object can be serialized.
var internalToString = Object.prototype.toString;

// Iterate over an object with support
// for the DontEnum bug in < IE9
var iterateOverObjectSafe;

function buildSafeIterate() {
  var hasDontEnumBug = true, prop;
  for (prop in { toString: true }) hasDontEnumBug = false;
  iterateOverObjectSafe = hasDontEnumBug ? iterateOverObjectDontEnum : iterateOverObject;
}

function iterateOverObjectDontEnum(obj, fn) {
  iterateOverObject(obj, fn);
  forEach(DONT_ENUM_PROPS, function(key) {
    if (hasOwn(obj, key)) {
      fn.call(obj, key, obj[key], obj);
    }
  });
}

// Create

// Query Strings | Creating

function toQueryStringWithOptions(obj, opts) {
  opts = opts || {};
  if (isUndefined(opts.separator)) {
    opts.separator = '_';
  }
  return toQueryString(obj, opts.deep, opts.transform, opts.prefix || '', opts.separator);
}

function toQueryString(obj, deep, transform, prefix, separator) {
  if (isArray(obj)) {
    return collectArrayAsQueryString(obj, deep, transform, prefix, separator);
  } else if (isObjectType(obj) && obj.toString === internalToString) {
    return collectObjectAsQueryString(obj, deep, transform, prefix, separator);
  } else if (prefix) {
    return getURIComponentValue(obj, prefix, transform);
  }
  return '';
}

function collectArrayAsQueryString(arr, deep, transform, prefix, separator) {
  var el, qc, key, result = [];
  // Intentionally treating sparse arrays as dense here by avoiding map,
  // otherwise indexes will shift during the process of serialization.
  for (var i = 0, len = arr.length; i < len; i++) {
    el = arr[i];
    key = prefix + (prefix && deep ? '[]' : '');
    if (!key && !isObjectType(el)) {
      // If there is no key, then the values of the array should be
      // considered as null keys, so use them instead;
      qc = sanitizeURIComponent(el);
    } else {
      qc = toQueryString(el, deep, transform, key, separator);
    }
    result.push(qc);
  }
  return result.join('&');
}

function collectObjectAsQueryString(obj, deep, transform, prefix, separator) {
  var result = [];
  iterateOverObject(obj, function(key, value) {
    var fullKey;
    if (prefix && deep) {
      fullKey = prefix + '[' + key + ']';
    } else if (prefix) {
      fullKey = prefix + separator + key;
    } else {
      fullKey = key;
    }
    result.push(toQueryString(value, deep, transform, fullKey, separator));
  });
  return result.join('&');
}

function getURIComponentValue(obj, prefix, transform) {
  var value;
  if (transform) {
    value = transform(prefix, obj);
  } else if (isDate(obj)) {
    value = obj.getTime();
  } else {
    value = obj;
  }
  return sanitizeURIComponent(prefix) + '=' + sanitizeURIComponent(value);
}

function sanitizeURIComponent(obj) {
  // undefined, null, and NaN are represented as a blank string,
  // while false and 0 are stringified.
  return !obj && obj !== false && obj !== 0 ? '' : encodeURIComponent(obj);
}


// Query Strings | Parsing

function fromQueryStringWithOptions(obj, opts) {
  var str = String(obj || '').replace(/^.*?\?/, ''), result = {}, auto;
  opts = opts || {};
  if (str) {
    forEach(str.split('&'), function(p) {
      var split = p.split('=');
      var key = decodeURIComponent(split[0]);
      var val = split.length === 2 ? decodeURIComponent(split[1]) : '';
      auto = opts.auto !== false;
      parseQueryComponent(result, key, val, opts.deep, auto, opts.separator, opts.transform);
    });
  }
  return result;
}

function parseQueryComponent(obj, key, value, deep, auto, separator, transform) {
  var match;
  if (separator) {
    key = mapQuerySeparatorToKeys(key, separator);
    deep = true;
  }
  if (deep === true && (match = key.match(DEEP_QUERY_STRING_REG))) {
    parseDeepQueryComponent(obj, match, value, deep, auto, separator, transform);
  } else {
    setQueryProperty(obj, key, value, auto, transform);
  }
}

function parseDeepQueryComponent(obj, match, value, deep, auto, separator, transform) {
  var key = match[1];
  var inner = match[2].slice(1, -1).split('][');
  forEach(inner, function(k) {
    if (!hasOwn(obj, key)) {
      obj[key] = k ? {} : [];
    }
    obj = obj[key];
    key = k ? k : obj.length.toString();
  });
  setQueryProperty(obj, key, value, auto, transform);
}

function mapQuerySeparatorToKeys(key, separator) {
  var split = key.split(separator), result = split[0];
  for (var i = 1, len = split.length; i < len; i++) {
    result += '[' + split[i] + ']';
  }
  return result;
}

function setQueryProperty(obj, key, value, auto, transform) {
  var fnValue;
  if (transform) {
    fnValue = transform(key, value, obj);
  }
  if (isDefined(fnValue)) {
    value = fnValue;
  } else if (auto) {
    value = getQueryValueAuto(obj, key, value);
  }
  obj[key] = value;
}

function getQueryValueAuto(obj, key, value) {
  if (!value) {
    return null;
  } else if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  }
  var num = +value;
  if (!isNaN(num) && stringIsDecimal(value)) {
    return num;
  }
  var existing = obj[key];
  if (value && existing) {
    return isArray(existing) ? existing.concat(value) : [existing, value];
  }
  return value;
}

function stringIsDecimal(str) {
  return str !== '' && !NON_DECIMAL_REG.test(str);
}


// Object Merging

function mergeWithOptions(target, source, opts) {
  opts = opts || {};
  return objectMerge(target, source, opts.deep, opts.resolve, opts.hidden, opts.descriptor);
}

function defaults(target, sources, opts) {
  opts = opts || {};
  opts.resolve = opts.resolve || false;
  return mergeAll(target, sources, opts);
}

function mergeAll(target, sources, opts) {
  if (!isArray(sources)) {
    sources = [sources];
  }
  forEach(sources, function(source) {
    return mergeWithOptions(target, source, opts);
  });
  return target;
}

function iterateOverProperties(hidden, obj, fn) {
  if (getOwnPropertyNames && hidden) {
    iterateOverPropertyNames(obj, fn);
  } else {
    iterateOverObjectSafe(obj, fn);
  }
}

function iterateOverPropertyNames(obj, fn) {
  var names = getOwnPropertyNames(obj), name;
  for (var i = 0, len = names.length; i < len; i++) {
    name = names[i];
    fn(name, obj[name]);
  }
}

function mergeByPropertyDescriptor(target, source, prop, sourceVal) {
  var descriptor = getOwnPropertyDescriptor(source, prop);
  if (isDefined(descriptor.value)) {
    descriptor.value = sourceVal;
  }
  defineProperty(target, prop, descriptor);
}

function objectMerge(target, source, deep, resolve, hidden, descriptor) {
  var resolveByFunction = isFunction(resolve), resolveConflicts = resolve !== false;

  if (isUndefined(target)) {
    target = getNewObjectForMerge(source);
  } else if (resolveConflicts && isDate(target) && isDate(source)) {
    // A date's timestamp is a property that can only be reached through its
    // methods, so actively set it up front if both are dates.
    target.setTime(source.getTime());
  }

  if (isPrimitiveType(target)) {
    // Will not merge into a primitive type, so simply override.
    return source;
  }

  // If the source object is a primitive
  // type then coerce it into an object.
  if (isPrimitiveType(source)) {
    source = coercePrimitiveToObject(source);
  }

  iterateOverProperties(hidden, source, function(prop) {
    var sourceVal, targetVal, resolved, goDeep, result;

    sourceVal = source[prop];

    // We are iterating over properties of the source, so hasOwnProperty on
    // it is guaranteed to always be true. However, the target may happen to
    // have properties in its prototype chain that should not be considered
    // as conflicts.
    if (hasOwn(target, prop)) {
      targetVal = target[prop];
    }

    if (resolveByFunction) {
      result = resolve(prop, targetVal, sourceVal, target, source);
      if (isUndefined(result)) {
        // Result is undefined so do not merge this property.
        return;
      } else if (isDefined(result) && result !== Sugar) {
        // If the source returns anything except undefined, then the conflict
        // has been resolved, so don't continue traversing into the object. If
        // the returned value is the Sugar global object, then allowing Sugar
        // to resolve the conflict, so continue on.
        sourceVal = result;
        resolved = true;
      }
    } else if (isUndefined(sourceVal)) {
      // Will not merge undefined.
      return;
    }

    // Regex properties are read-only, so intentionally disallowing deep
    // merging for now. Instead merge by reference even if deep.
    goDeep = !resolved && deep && isObjectType(sourceVal) && !isRegExp(sourceVal);

    if (!goDeep && !resolveConflicts && isDefined(targetVal)) {
      return;
    }

    if (goDeep) {
      sourceVal = objectMerge(targetVal, sourceVal, deep, resolve, hidden, descriptor);
    }

    // getOwnPropertyNames is standing in as
    // a test for property descriptor support
    if (getOwnPropertyNames && descriptor) {
      mergeByPropertyDescriptor(target, source, prop, sourceVal);
    } else {
      target[prop] = sourceVal;
    }

  });
  return target;
}

function getNewObjectForMerge(source) {
  var klass = className(source);
  // Primitive types, dates, and regexes have no "empty" state. If they exist
  // at all, then they have an associated value. As we are only creating new
  // objects when they don't exist in the target, these values can come alone
  // for the ride when created.
  if (isPrimitiveType(source)) {
    return source;
  } else if (isDate(source, klass)) {
    return new Date(source.getTime());
  } else if (isRegExp(source, klass)) {
    return RegExp(source.source, getRegExpFlags(source));
  } else if (isArray(source, klass)) {
    return [];
  } else if (isPlainObject(source, klass)) {
    return {};
  }
  // If the object is not of a known type, then simply merging its
  // properties into a plain object will result in something different
  // (it will not respond to instanceof operator etc). Similarly we don't
  // want to call a constructor here as we can't know for sure what the
  // original constructor was called with (Events etc), so throw an
  // error here instead. Non-standard types can be handled if either they
  // already exist and simply have their properties merged, if the merge
  // is not deep so their references will simply be copied over, or if a
  // resolve function is used to assist the merge.
  throw new TypeError('Must be a basic data type');
}

function clone(source, deep) {
  var target = getNewObjectForMerge(source);
  return objectMerge(target, source, deep, true, true, true);
}


// Keys/Values

function objectSize(obj) {
  return keysWithObjectCoercion(obj).length;
}

function keysWithObjectCoercion(obj) {
  return getKeys(coercePrimitiveToObject(obj));
}

function getKeysWithCallback(obj, fn) {
  var keys = getKeys(obj);
  if (isFunction(fn)) {
    forEach(keys, function(key) {
      fn.call(obj, key, obj[key]);
    });
  }
  return keys;
}

function getValuesWithCallback(obj, fn) {
  var values = [];
  iterateOverObject(obj, function(k, v) {
    values.push(v);
    if (isFunction(fn)) {
      fn.call(obj,v);
    }
  });
  return values;
}

function tap(obj, arg) {
  var fn = arg;
  if (!isFunction(arg)) {
    fn = function() {
      if (arg) obj[arg]();
    };
  }
  fn.call(obj, obj);
  return obj;
}

// Select/Reject

function objectSelect(obj, f) {
  return selectFromObject(obj, f, true);
}

function objectReject(obj, f) {
  return selectFromObject(obj, f, false);
}

function selectFromObject(obj, f, select) {
  var match, result = {};
  f = [].concat(f);
  iterateOverObject(obj, function(key, value) {
    match = false;
    for (var i = 0; i < f.length; i++) {
      if (matchInObject(f[i], key)) {
        match = true;
      }
    }
    if (match === select) {
      result[key] = value;
    }
  });
  return result;
}

function matchInObject(match, key) {
  if (isRegExp(match)) {
    return match.test(key);
  } else if (isObjectType(match)) {
    return key in match;
  } else {
    return key === String(match);
  }
}

// Remove/Exclude

function objectRemove(obj, f) {
  var matcher = getMatcher(f, true);
  iterateOverObject(obj, function(key, val) {
    if (matcher(val, key, obj)) {
      delete obj[key];
    }
  });
  return obj;
}

function objectExclude(obj, f) {
  var result = {};
  var matcher = getMatcher(f, true);
  iterateOverObject(obj, function(key, val) {
    if (!matcher(val, key, obj)) {
      result[key] = val;
    }
  });
  return result;
}

function objectIntersectOrSubtract(obj1, obj2, subtract) {
  if (!isObjectType(obj1)) {
    return subtract ? obj1 : {};
  }
  obj2 = coercePrimitiveToObject(obj2);
  function resolve(key, val, val1) {
    var exists = key in obj2 && isEqual(val1, obj2[key]);
    if (exists !== subtract) {
      return val1;
    }
  }
  return objectMerge({}, obj1, false, resolve);
}

/***
 * @method Object.is[Type](<obj>)
 * @returns Boolean
 * @short Returns true if <obj> is an object of that type.
 * @extra %isObject% will return true only for plain objects (not for instances of classes or native browser objects). Note also that %isNaN% will ONLY return true if the object IS %NaN%. It does not mean the same as browser native %isNaN%, which returns true for anything that is "not a number".
 *
 * @set
 *   isArray
 *   isBoolean
 *   isDate
 *   isFunction
 *   isNumber
 *   isString
 *   isRegExp
 *
 * @example
 *
 *   Object.isArray([1,2,3])   -> true
 *   Object.isDate(3)          -> false
 *   Object.isRegExp(/wasabi/) -> true
 *
 ***/
function buildTypeCheckMethods() {
  var checks = [isBoolean, isNumber, isString, isArray, isDate, isRegExp, isFunction];
  defineInstanceAndStaticSimilar(sugarObject, TYPE_CHECK_NAMES, function(methods, name, i) {
    methods['is' + name] = checks[i];
  });
}


defineInstanceAndStatic(sugarObject, {

  /***
   * @method Object.keys(<obj>, [fn])
   * @returns Array
   * @short Returns an array containing the keys in <obj>. Optionally calls [fn] for each key.
   * @extra Sugar provides a polyfill for browsers that don't support this method natively. Additionally it optionally enhances it to allow the callback function [fn]. Order of returned keys is not guaranteed.
   * @example
   *
   *   Object.keys({ broken: 'wear' }) -> ['broken']
   *   Object.keys({ broken: 'wear' }, function(key, value) {
   *     // Called once for each key.
   *   });
   *
   ***/
  'keys': fixArgumentLength(getKeysWithCallback)

}, [ENHANCEMENTS_FLAG, OBJECT_ENHANCEMENTS_FLAG]);


defineStatic(sugarObject, {

  /***
   * @method Object.fromQueryString(<str>, [options])
   * @returns Object
   * @short Converts the query string of a URL into an object.
   * @extra Options can be passed with [options] for more control over the result.
   * @options
   *
   *   deep:       If the string contains "deep" syntax (`foo[]`), this will
   *               be automatically converted to an array. (Default `false`)
   *
   *   auto:       If `true`, booleans (`true`/`false`), numbers, and arrays
   *               (repeated keys) will be automatically cast to native
   *               values. (Default `true`)
   *
   *   transform:  A function whose return value becomes the final value.
   *               Receives `key` and `value` arguments. (No Default)
   *
   *   separator:  If passed, keys will be split on this string to extract
   *               deep values. (Default `null`)
   *
   * @example
   *
   *   Object.fromQueryString('foo=bar&broken=wear')          -> { foo: 'bar', broken: 'wear' }
   *   Object.fromQueryString('foo[]=1&foo[]=2')              -> { foo: ['1','2'] }
   *   Object.fromQueryString('user_foo=bar',{separator:'_'}) -> { user: { foo: 'bar' } }
   *
   ***/
  'fromQueryString': function(obj, options) {
    return fromQueryStringWithOptions(obj, options);
  }

});


defineInstanceAndStatic(sugarObject, {

  /***
   * @method Object.get(<obj>, <key>)
   * @returns Mixed
   * @short Gets a property of <obj>. <key> can be a deep property using dot or bracket notation.
   * @example
   *
   *   Object.get({a:'b'}, 'a');       -> 'b'
   *   Object.get({a:{b:'c'}}, 'a.b'); -> 'c'
   *
   ***/
  'get': function(obj, prop) {
    return deepGetProperty(obj, prop);
  },

  /***
   * @method Object.set(<obj>, <key>, <val>)
   * @returns Object
   * @short Sets a property on <obj>. <key> can be a deep property using dot or bracket notation.
   * @extra If <key> is deep and the namespace does not exist, then it will be created either as an object (dot notation) or an array (bracket notation). Returns the object.
   * @example
   *
   *   Object.set({}, 'a', 'c');    -> {a:'c'}
   *   Object.set({}, 'a.b', 'c');  -> {a:{b:'c'}}
   *   Object.set({}, 'a[0]', 'c'); -> {a:['c']}
   *
   ***/
  'set': function(obj, key, val) {
    return deepSetProperty(obj, key, val);
  },

  /***
   * @method Object.size(<obj>)
   * @returns Number
   * @short Returns the number of properties in <obj>.
   * @example
   *
   *   Object.size({foo:'bar'}) -> 1
   *
   ***/
  'size': function(obj) {
    return objectSize(obj);
  },

  /***
   * @method Object.isEmpty(<obj>)
   * @returns Boolean
   * @short Returns true if the number of properties in <obj> is zero.
   * @example
   *
   *   Object.isEmpty({})    -> true
   *   Object.isEmpty({a:1}) -> false
   *
   ***/
  'isEmpty': function(obj) {
    return objectSize(obj) === 0;
  },

  /***
   * @method Object.toQueryString(<obj>, [options])
   * @returns Object
   * @short Converts the object into a query string.
   * @extra Accepts deep objects and arrays. Options can be passed with [options] for more control over the result. For more see %query strings%.
   * @options
   *
   *   deep:       If `true`, non-standard "deep" syntax (`foo[]`) will be
   *               used for output. Note that `separator` will be ignored,
   *               as this option overrides shallow syntax. (Default `false`)
   *
   *   prefix:     If passed, this string will be prefixed to all keys,
   *               separated by the `separator`. (Default `''`).
   *
   *   transform:  A function whose return value becomes the final value
   *               in the string. Receives `key` and `value` arguments.
   *               (No Default)
   *
   *   separator:  A string that is used to separate keys, either for deep
   *               objects, or when `prefix` is passed.(Default `_`).
   *
   * @example
   *
   *   Object.toQueryString({foo:'bar'})                  -> 'foo=bar'
   *   Object.toQueryString({foo:['a','b']})              -> 'foo=a&foo=b'
   *   Object.toQueryString({foo:['a','b']}, {deep:true}) -> 'foo[]=a&foo[]=b'
   *
   ***/
  'toQueryString': function(obj, options) {
    return toQueryStringWithOptions(obj, options);
  },

  /***
   * @method Object.isEqual(<a>, <b>)
   * @returns Boolean
   * @short Returns true if <a> and <b> are equal.
   * @extra %isEqual% in Sugar is "egal", meaning the values are equal if they are "not observably distinguishable".
   * @example
   *
   *   Object.isEqual({a:2}, {a:2}) -> true
   *   Object.isEqual({a:2}, {a:3}) -> false
   *
   ***/
  'isEqual': function(a, b) {
    return isEqual(a, b);
  },

  /***
   * @method Object.merge(<target>, <source>, [options])
   * @returns Merged object
   * @short Merges properties from <source> into <target>.
   * @options
   *
   *   deep:        If `true` deep properties are merged recursively.
   *                (Default = `false`)
   *
   *   resolve:     Determines which property wins in the case of conflicts.
   *                If `true`, <source> wins. If `false`, <target> wins. If a
   *                function is passed, its return value will decide the result.
   *                Any non-undefined return value will resolve the conflict
   *                for that property (will not continue if `deep`). Returning
   *                `undefined` will do nothing (no merge). Finally, returning
   *                the global object `Sugar` will allow Sugar to handle the
   *                merge as normal. Resolve functions are passed the arguments:
   *                `key`, `targetValue`, `sourceValue`, `target`, `source`.
   *                (Default = `true`)
   *
   *   hidden:      If `true`, non-enumerable properties will be merged as well.
   *                (Default = `false`)
   *
   *   descriptor:  If `true`, properties will be merged by property descriptor.
   *                Use this option to merge getters or setters, or to preserve
   *                `enumerable`, `configurable`, etc.
   *                (Default = `false`)
   *
   * @example
   *
   *   Object.merge({one:1},{two:2})                 -> {one:1,two:2}
   *   Object.merge({one:1},{one:9,two:2})           -> {one:9,two:2}
   *   Object.merge({x:{a:1}},{x:{b:2}},{deep:true}) -> {x:{a:1,b:2}}
   +   Object.merge({one:1},{one:2},{resolve:function(key, a, b) {
   *     return a + b;
   *   }}); -> {one:3}
   *
   ***/
  'merge': function(target, source, opts) {
    return mergeWithOptions(target, source, opts);
  },

  /***
   * @method Object.mergeAll(<target>, <sources>, [options])
   * @returns Merged object
   * @short Merges properties from multiple <sources> into <target>.
   * @options
   *
   *   deep:        If `true` deep properties are merged recursively.
   *                (Default = `false`)
   *
   *   resolve:     Determines which property wins in the case of conflicts.
   *                If `true`, <source> wins. If `false`, <target> wins. If a
   *                function is passed, its return value will decide the result.
   *                Any non-undefined return value will resolve the conflict
   *                for that property (will not continue if `deep`). Returning
   *                `undefined` will do nothing (no merge). Finally, returning
   *                the global object `Sugar` will allow Sugar to handle the
   *                merge as normal. Resolve functions are passed the arguments:
   *                `key`, `targetValue`, `sourceValue`, `target`, `source`.
   *                (Default = `true`)
   *
   *   hidden:      If `true`, non-enumerable properties will be merged as well.
   *                (Default = `false`)
   *
   *   descriptor:  If `true`, properties will be merged by property descriptor.
   *                Use this option to merge getters or setters, or to preserve
   *                `enumerable`, `configurable`, etc.
   *                (Default = `false`)
   *
   * @example
   *
   *   Object.mergeAll({one:1},[{two:2},{three:3}])                 -> {one:9,two:2}
   *   Object.mergeAll({x:{a:1}},[{x:{b:2}},{x:{c:3}}],{deep:true}) -> {x:{a:1,b:2,c:3}}
   *
   ***/
  'mergeAll': function(target, sources, opts) {
    return mergeAll(target, sources, opts);
  },

  /***
   * @method Object.add(<obj1>, <obj2>, [options])
   * @returns Object
   * @short Merges properties from <obj1> and <obj2> together and returns a new object.
   * @options
   *
   *   deep:        If `true` deep properties are merged recursively.
   *                (Default = `false`)
   *
   *   resolve:     Determines which property wins in the case of conflicts.
   *                If `true`, <source> wins. If `false`, <target> wins. If a
   *                function is passed, its return value will decide the result.
   *                Any non-undefined return value will resolve the conflict
   *                for that property (will not continue if `deep`). Returning
   *                `undefined` will do nothing (no merge). Finally, returning
   *                the global object `Sugar` will allow Sugar to handle the
   *                merge as normal. Resolve functions are passed the arguments:
   *                `key`, `targetValue`, `sourceValue`, `target`, `source`.
   *                (Default = `true`)
   *
   *   hidden:      If `true`, non-enumerable properties will be merged as well.
   *                (Default = `false`)
   *
   *   descriptor:  If `true`, properties will be merged by property descriptor.
   *                Use this option to merge getters or setters, or to preserve
   *                `enumerable`, `configurable`, etc.
   *                (Default = `false`)
   *
   * @example
   *
   *   Object.add({one:1},{two:2})                 -> {one:1,two:2}
   *   Object.add({one:1},{one:9,two:2})           -> {one:9,two:2}
   *   Object.add({x:{a:1}},{x:{b:2}},{deep:true}) -> {x:{a:1,b:2}}
   +   Object.add({one:1},{one:2},{resolve:function(key, a, b) {
   *     return a + b;
   *   }}); -> {one:3}
   *
   ***/
  'add': function(obj1, obj2, opts) {
    return mergeWithOptions(clone(obj1), obj2, opts);
  },

  /***
   * @method Object.intersect(<obj1>, <obj2>)
   * @returns Object
   * @short Returns a new object whose properties are those that both <obj1> and <obj2> have in common.
   * @extra If both key and value do not match, then the property will not be included.
   * @example
   *
   *   Object.intersect({a:'a'},{b:'b'}) -> {}
   *   Object.intersect({a:'a'},{a:'b'}) -> {}
   *   Object.intersect({a:'a',b:'b'},{b:'b',z:'z'}) -> {b:'b'}
   *
   ***/
  'intersect': function(obj1, obj2) {
    return objectIntersectOrSubtract(obj1, obj2, false);
  },

  /***
   * @method Object.subtract(<obj1>, <obj2>)
   * @returns Object
   * @short Returns a clone of <obj1> with any properties shared by <obj2> excluded.
   * @extra If both key and value do not match, then the property will not be excluded.
   * @example
   *
   *   Object.subtract({a:'a',b:'b'},{b:'b'}) -> {a:'a'}
   *   Object.subtract({a:'a',b:'b'},{a:'b'}) -> {a:'a',b:'b'}
   *
   ***/
  'subtract': function(obj1, obj2) {
    return objectIntersectOrSubtract(obj1, obj2, true);
  },

  /***
   * @method Object.defaults(<target>, <sources>, [options])
   * @returns Merged object
   * @short Merges properties from one or multiple <sources> into <target> while preserving <target>'s properties.
   * @options
   *
   *   deep:        If `true` deep properties are merged recursively.
   *                (Default = `false`)
   *
   *   resolve:     Determines which property wins in the case of conflicts.
   *                If `true`, <source> wins. If `false`, <target> wins. If a
   *                function is passed, its return value will decide the result.
   *                Any non-undefined return value will resolve the conflict
   *                for that property (will not continue if `deep`). Returning
   *                `undefined` will do nothing (no merge). Finally, returning
   *                the global object `Sugar` will allow Sugar to handle the
   *                merge as normal. Resolve functions are passed the arguments:
   *                `key`, `targetValue`, `sourceValue`, `target`, `source`.
   *                (Default = `true`)
   *
   *   hidden:      If `true`, non-enumerable properties will be merged as well.
   *                (Default = `false`)
   *
   *   descriptor:  If `true`, properties will be merged by property descriptor.
   *                Use this option to merge getters or setters, or to preserve
   *                `enumerable`, `configurable`, etc.
   *                (Default = `false`)
   *
   * @example
   *
   *   Object.defaults({one:1},[{one:9},{two:2}])                   -> {one:1,two:2}
   *   Object.defaults({x:{a:1}},[{x:{a:9}},{x:{b:2}}],{deep:true}) -> {x:{a:1,b:2}}
   *
   ***/
  'defaults': function(target, sources, opts) {
    return defaults(target, sources, opts);
  },

  /***
   * @method Object.clone(<obj>, [deep] = false)
   * @returns Cloned object
   * @short Creates a clone (copy) of <obj>.
   * @extra Default is a shallow clone, unless [deep] is true.
   * @example
   *
   *   Object.clone({foo:'bar'}) -> { foo: 'bar' }
   *   Object.clone()            -> {}
   *
   ***/
  'clone': function(obj, deep) {
    return clone(obj, deep);
  },

  /***
   * @method Object.values(<obj>, [fn])
   * @returns Array
   * @short Returns an array containing the values in <obj>. Optionally calls [fn] for each value.
   * @extra Returned values are in no particular order.
   * @example
   *
   *   Object.values({ broken: 'wear' }) -> ['wear']
   *   Object.values({ broken: 'wear' }, function(value) {
   *     // Called once for each value.
   *   });
   *
   ***/
  'values': function(obj, fn) {
    return getValuesWithCallback(obj, fn);
  },

  /***
   * @method Object.invert(<obj>, [multi] = false)
   * @returns Object
   * @short Creates a new object with the keys and values of <obj> swapped.
   * @extra If [multi] is true, values will be an array of all keys, othewise collisions will be overwritten.
   * @example
   *
   *   Object.invert({foo:'bar'})     -> {bar:'foo'}
   *   Object.invert({a:1,b:1}, true) -> {1:['a','b']}
   *
   ***/
  'invert': function(obj, multi) {
    var result = {};
    multi = multi === true;
    iterateOverObject(obj, function(key, val) {
      if (result[val] && multi) {
        result[val].push(key);
      } else if (multi) {
        result[val] = [key];
      } else {
        result[val] = key;
      }
    });
    return result;
  },

  /***
   * @method Object.tap(<obj>, <fn>)
   * @returns Object
   * @short Runs <fn> and returns <obj>.
   * @extra  A string can also be used as a shortcut to a method. This method is designed to run an intermediary function that "taps into" a method chain. As such, it is fairly useless as a static method. However it can be quite useful when combined with chainables.
   * @callback
   *
   *   obj A reference to <obj>.
   *
   * @example
   *
   *   Sugar.Array([1,4,9]).map(Math.sqrt).tap('pop') -> [1,2]
   *   Sugar.Object({a:'a'}).tap(log).merge({b:'b'})  -> {a:'a',b:'b'}
   *
   ***/
  'tap': function(obj, arg) {
    return tap(obj, arg);
  },

  /***
   * @method Object.has(<obj>, <prop>)
   * @returns Boolean
   * @short Checks if <obj> has property <prop>, which may be a deep property using dot or bracket notation.
   * @extra Note that this method does not care of <prop> is a direct property of <obj> or in the prototype. To check that use `hasOwn` instead.
   * @example
   *
   *   Object.has({a:'a'}, 'a')       -> true
   *   Object.has({a:{b:'b'}}, 'a.b') -> true
   *   Object.has({a:{b:'b'}}, 'b.b') -> false
   *
   ***/
  'has': function(obj, prop) {
    return deepHasProperty(obj, prop);
  },

  /***
   * @method Object.hasOwn(<obj>, <prop>)
   * @returns Boolean
   * @short Checks if <obj> has its own property <prop> using hasOwnProperty from Object.prototype.
   * @extra This method is considered safer than %Object#hasOwnProperty% when using objects as data stores. See http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/ for more. Note that this method will *not* work with deep keys.
   * @example
   *
   *   Object.hasOwn({foo:'bar'}, 'foo') -> true
   *   Object.hasOwn({foo:'bar'}, 'baz') -> false
   *   Object.hasOwn({hasOwnProperty:true}, 'foo') -> false
   *
   ***/
  'hasOwn': function(obj, prop) {
    return hasOwn(obj, prop);
  },

  /***
   * @method Object.isArguments(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is an arguments object.
   *
   * @example
   *
   *   Object.arguments([1]) -> false
   *
   ***/
  'isArguments': function(obj) {
    return isArguments(obj);
  },

  /***
   * @method Object.isNaN(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is `NaN`.
   * @extra This is different from `isNaN`, which returns true for anything that is "not a number".
   *
   * @example
   *
   *   Object.isNaN(NaN) -> true
   *   Object.isNaN('5') -> false
   *
   ***/
  'isNaN': function(obj) {
    // Note that Object.isNaN intentionally unwraps non-primitives, but Number.isNaN
    // does not (ES6 spec). The reason for this is that certain environments (< IE9)
    // will auto-wrap instances, so opting for cross-platform consistency here.
    return isRealNaN(obj && obj.valueOf());
  },

  /***
   * @method Object.isObject(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a plain Javascript object.
   * @extra Does not include instances of classes or "host" objects, such as Elements, Events, etc.
   *
   * @example
   *
   *   Object.isObject({ broken:'wear' }) -> true
   *
   ***/
  'isObject': function(obj) {
    return isPlainObject(obj);
  },

  /***
   * @method Object.remove(<obj>, <f>)
   * @returns Object
   * @short Deletes all properties in <obj> matching <f>.
   * @extra This method implements `matching shortcuts`.
   * @example
   *
   *   Object.remove({a:'a',b:'b'}, 'a');           -> {b:'b'}
   *   Object.remove({a:'a',b:'b',z:'z'}, /[a-f]/); -> {z:'z'}
   *
   ***/
  'remove': function(obj, f) {
    return objectRemove(obj, f);
  },

  /***
   * @method Object.exclude(<obj>, <f>)
   * @returns Object
   * @short Returns a new object with all properties matching <f> removed.
   * @extra This is a non-destructive version of `remove`. This method implements `matching shortcuts`.
   * @example
   *
   *   Object.exclude({a:'a',b:'b'}, 'a');           -> {b:'b'}
   *   Object.exclude({a:'a',b:'b',z:'z'}, /[a-f]/); -> {z:'z'}
   *
   ***/
  'exclude': function(obj, f) {
    return objectExclude(obj, f);
  },

  /***
   * @method Object.select(<obj>, <find>)
   * @returns Object
   * @short Builds a new object containing the keys specified in <find>.
   * @extra When <find> is a string, a single key will be selected. Arrays or objects will match multiple keys, and a regex will match keys by regex.
   * @example
   *
   *   Object.select({a:1,b:2}, 'a')           -> {a:1}
   *   Object.select({a:1,b:2}, ['a', 'b'])    -> {a:1,b:2}
   *   Object.select({a:1,b:2}, /[a-z]/)       -> {a:1,b:2}
   *   Object.select({a:1,b:2}, {a:'a',b:'b'}) -> {a:1,b:2}
   *
   ***/
  'select': function(obj, f) {
    return objectSelect(obj, f);
  },

  /***
   * @method Object.reject(<obj>, <find>)
   * @returns Object
   * @short Builds a new object containing all keys except those in <find>.
   * @extra When <find> is a string, a single key will be rejected. Arrays or objects will match multiple keys, and a regex will match keys by regex.
   * @example
   *
   *   Object.reject({a:1,b:2}, 'a')        -> {b:2}
   *   Object.reject({a:1,b:2}, /[a-z]/)    -> {}
   *   Object.reject({a:1,b:2}, {a:'a'})    -> {b:2}
   *   Object.reject({a:1,b:2}, ['a', 'b']) -> {}
   *
   ***/
  'reject': function(obj, f) {
    return objectReject(obj, f);
  }

});

buildSafeIterate();
buildTypeCheckMethods();
