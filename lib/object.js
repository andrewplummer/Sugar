'use strict';

/***
 * @module Object
 * @description Object creation, manipulation, comparison, type checking, and more.
 *
 * Much thanks to kangax for his informative aricle about how problems with
 * instanceof and constructor: http://bit.ly/1Qds27W
 *
 ***/

// Matches bracket-style query strings like user[name]
var DEEP_QUERY_STRING_REG = /^(.+?)(\[.*\])$/;

// Matches any character not allowed in a decimal number.
var NON_DECIMAL_REG = /[^\d.-]/;

// Native methods for merging by descriptor when available.
var getOwnPropertyNames      = Object.getOwnPropertyNames;
var getOwnPropertySymbols    = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Internal reference to check if an object can be serialized.
var internalToString = Object.prototype.toString;

// Basic Helpers

function isArguments(obj, className) {
  className = className || classToString(obj);
  // .callee exists on Arguments objects in < IE8
  return hasProperty(obj, 'length') && (className === '[object Arguments]' || !!obj.callee);
}

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
  forEachProperty(obj, function(val, key) {
    var fullKey;
    if (prefix && deep) {
      fullKey = prefix + '[' + key + ']';
    } else if (prefix) {
      fullKey = prefix + separator + key;
    } else {
      fullKey = key;
    }
    result.push(toQueryString(val, deep, transform, fullKey, separator));
  });
  return result.join('&');
}

function getURIComponentValue(obj, prefix, transform) {
  var value;
  if (transform) {
    value = transform(obj, prefix);
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

function parseQueryComponent(obj, key, val, deep, auto, separator, transform) {
  var match;
  if (separator) {
    key = mapQuerySeparatorToKeys(key, separator);
    deep = true;
  }
  if (deep === true && (match = key.match(DEEP_QUERY_STRING_REG))) {
    parseDeepQueryComponent(obj, match, val, deep, auto, separator, transform);
  } else {
    setQueryProperty(obj, key, val, auto, transform);
  }
}

function parseDeepQueryComponent(obj, match, val, deep, auto, separator, transform) {
  var key = match[1];
  var inner = match[2].slice(1, -1).split('][');
  forEach(inner, function(k) {
    if (!hasOwn(obj, key)) {
      obj[key] = k ? {} : [];
    }
    obj = getOwn(obj, key);
    key = k ? k : obj.length.toString();
  });
  setQueryProperty(obj, key, val, auto, transform);
}

function mapQuerySeparatorToKeys(key, separator) {
  var split = key.split(separator), result = split[0];
  for (var i = 1, len = split.length; i < len; i++) {
    result += '[' + split[i] + ']';
  }
  return result;
}

function setQueryProperty(obj, key, val, auto, transform) {
  var fnValue;
  if (transform) {
    fnValue = transform(val, key, obj);
  }
  if (isDefined(fnValue)) {
    val = fnValue;
  } else if (auto) {
    val = getQueryValueAuto(obj, key, val);
  }
  obj[key] = val;
}

function getQueryValueAuto(obj, key, val) {
  if (!val) {
    return null;
  } else if (val === 'true') {
    return true;
  } else if (val === 'false') {
    return false;
  }
  var num = +val;
  if (!isNaN(num) && stringIsDecimal(val)) {
    return num;
  }
  var existing = getOwn(obj, key);
  if (val && existing) {
    return isArray(existing) ? existing.concat(val) : [existing, val];
  }
  return val;
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
    iterateOverKeys(getOwnPropertyNames, obj, fn, hidden);
  } else {
    forEachProperty(obj, fn);
  }
  if (getOwnPropertySymbols) {
    iterateOverKeys(getOwnPropertySymbols, obj, fn, hidden);
  }
}

// "keys" may include symbols
function iterateOverKeys(getFn, obj, fn, hidden) {
  var keys = getFn(obj), desc;
  for (var i = 0, key; key = keys[i]; i++) {
    desc = getOwnPropertyDescriptor(obj, key);
    if (desc.enumerable || hidden) {
      fn(obj[key], key);
    }
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

  if (isPrimitive(target)) {
    // Will not merge into a primitive type, so simply override.
    return source;
  }

  // If the source object is a primitive
  // type then coerce it into an object.
  if (isPrimitive(source)) {
    source = coercePrimitiveToObject(source);
  }

  iterateOverProperties(hidden, source, function(val, key) {
    var sourceVal, targetVal, resolved, goDeep, result;

    sourceVal = source[key];

    // We are iterating over properties of the source, so hasOwnProperty on
    // it is guaranteed to always be true. However, the target may happen to
    // have properties in its prototype chain that should not be considered
    // as conflicts.
    targetVal = getOwn(target, key);

    if (resolveByFunction) {
      result = resolve(key, targetVal, sourceVal, target, source);
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
      mergeByPropertyDescriptor(target, source, key, sourceVal);
    } else {
      target[key] = sourceVal;
    }

  });
  return target;
}

function getNewObjectForMerge(source) {
  var klass = classToString(source);
  // Primitive types, dates, and regexes have no "empty" state. If they exist
  // at all, then they have an associated value. As we are only creating new
  // objects when they don't exist in the target, these values can come alone
  // for the ride when created.
  if (isArray(source, klass)) {
    return [];
  } else if (isPlainObject(source, klass)) {
    return {};
  } else if (isDate(source, klass)) {
    return new Date(source.getTime());
  } else if (isRegExp(source, klass)) {
    return RegExp(source.source, getRegExpFlags(source));
  } else if (isPrimitive(source && source.valueOf())) {
    return source;
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
  return getKeysWithObjectCoercion(obj).length;
}

function getKeysWithObjectCoercion(obj) {
  return getKeys(coercePrimitiveToObject(obj));
}

function getValues(obj) {
  var values = [];
  forEachProperty(obj, function(val) {
    values.push(val);
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
  forEachProperty(obj, function(val, key) {
    match = false;
    for (var i = 0; i < f.length; i++) {
      if (matchInObject(f[i], key)) {
        match = true;
      }
    }
    if (match === select) {
      result[key] = val;
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
  var matcher = getMatcher(f);
  forEachProperty(obj, function(val, key) {
    if (matcher(val, key, obj)) {
      delete obj[key];
    }
  });
  return obj;
}

function objectExclude(obj, f) {
  var result = {};
  var matcher = getMatcher(f);
  forEachProperty(obj, function(val, key) {
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
 * @method is[Type]()
 * @returns Boolean
 * @short Returns true if the object is an object of that type.
 *
 * @set
 *   isArray
 *   isBoolean
 *   isDate
 *   isError
 *   isFunction
 *   isMap
 *   isNumber
 *   isRegExp
 *   isSet
 *   isString
 *
 * @example
 *
 *   Object.isArray([3]) -> true
 *   Object.isNumber(3)  -> true
 *   Object.isString(8)  -> false
 *
 ***/
function buildClassCheckMethods() {
  var checks = [isBoolean, isNumber, isString, isDate, isRegExp, isFunction, isArray, isError, isSet, isMap];
  defineInstanceAndStaticSimilar(sugarObject, NATIVE_TYPES, function(methods, name, i) {
    methods['is' + name] = checks[i];
  });
}

defineStatic(sugarObject, {

  /***
   * @method fromQueryString(str, [options])
   * @returns Object
   * @static
   * @short Converts the query string of a URL into an object.
   * @extra Options can be passed with [options] for more control over the result.
   *
   * @options
   *
   *   deep        If the string contains "deep" syntax `foo[]`, this will
   *               be automatically converted to an array. (Default `false`)
   *
   *   auto        If `true`, booleans `"true"` and `"false"`, numbers, and arrays
   *               (repeated keys) will be automatically cast to native
   *               values. (Default `true`)
   *
   *   transform   A function of type `transformFn` whose return value becomes
   *               the final value. If the function returns `undefined`, then the
   *               original value will be used. This allows the function to
   *               intercept only certain keys or values. (Default `undefined`)
   *
   *   separator   If passed, keys will be split on this string to extract
   *               deep values. (Default `''`)
   *
   * @callback transformFn
   *
   *   key   The key component of the query string (before `=`).
   *   val   The value component of the query string (after `=`).
   *   obj   A reference to the object being built.
   *
   * @example
   *
   *   Object.fromQueryString('a=1&b=2')                 -> {a:1,b:2}
   *   Object.fromQueryString('a[]=1&a[]=2',{deep:true}) -> {a:['1','2']}
   *   Object.fromQueryString('a_b=c',{separator:'_'})   -> {a:{b:'c'}}
   *   Object.fromQueryString('id=123', {transform:idToNumber});
   *
   * @param {string} str
   * @param {QueryStringParseOptions} options
   * @callbackParam {string} key
   * @callbackParam {Property} val
   * @callbackParam {Object} obj
   * @callbackReturns {NewProperty} transformFn
   * @option {boolean} [deep]
   * @option {boolean} [auto]
   * @option {string} [separator]
   * @option {transformFn} [transform]
   *
   ***/
  'fromQueryString': function(obj, options) {
    return fromQueryStringWithOptions(obj, options);
  }

});

defineInstanceAndStatic(sugarObject, {

  /***
   * @method has(key, [inherited] = false)
   * @returns Boolean
   * @short Checks if the object has property `key`.
   * @extra Supports `deep properties`. If [inherited] is `true`,
   *        properties defined in the prototype chain will also return `true`.
   *        The default of `false` for this argument makes this method suited
   *        to working with objects as data stores by default.
   *
   * @example
   *
   *   Object.has(usersByName, 'Harry')     -> true
   *   Object.has(data, 'users[1].profile') -> true
   *   Object.has([], 'forEach')            -> false
   *   Object.has([], 'forEach', true)      -> true
   *
   * @param {string} key
   * @param {boolean} [inherited]
   *
   ***/
  'has': function(obj, key, any) {
    return deepHasProperty(obj, key, any);
  },

  /***
   * @method get(key, [inherited] = false)
   * @returns Mixed
   * @short Gets a property of the object.
   * @extra Supports `deep properties`. If [inherited] is `true`,
   *        properties defined in the prototype chain will also be returned.
   *        The default of `false` for this argument makes this method suited
   *        to working with objects as data stores by default.
   *
   * @example
   *
   *   Object.get(Harry, 'name');           -> 'Harry'
   *   Object.get(Harry, 'profile.likes');  -> Harry's likes
   *   Object.get(data, 'users[3].name')    -> User 3's name
   *   Object.get(data, 'users[1..2]')      -> Users 1 and 2
   *   Object.get(data, 'users[1..2].name') -> Names of users 1 and 2
   *   Object.get(data, 'users[-2..-1]')    -> Last 2 users
   *
   * @param {string} key
   * @param {boolean} [inherited]
   *
   ***/
  'get': function(obj, key, any) {
    return deepGetProperty(obj, key, any);
  },

  /***
   * @method set(key, val)
   * @returns Object
   * @short Sets a property on the object.
   * @extra Using a dot or square bracket in `key` is considered "deep" syntax,
   *        and will attempt to traverse into the object to set the property,
   *        creating properties that do not exist along the way. If the missing
   *        property is referenced using square brackets, an empty array will be
   *        created, otherwise an empty object. A special `[]` carries the
   *        meaning of "the last index + 1", and will effectively push `val`
   *        onto the end of the array. Lastly, a `..` separator inside the
   *        brackets is "range" notation, and will set properties on all
   *        elements in the specified range. Range members may be negative,
   *        which will be offset from the end of the array.
   *
   * @example
   *
   *   Object.set({}, 'name', 'Harry');         -> {name:'Harry'}
   *   Object.set({}, 'user.name', 'Harry');    -> {user:{name:'Harry'}}
   *   Object.set({}, 'users[].name', 'Bob')    -> {users:[{name:'Bob'}}
   *   Object.set({}, 'users[1].name','Bob')    -> {users:[undefined, {name:'Bob'}]}
   *   Object.set({}, 'users[0..1].name','Bob') -> {users:[{name:'Bob'},{name:'Bob'}]}
   *
   * @param {string} key
   * @param {Property} val
   *
   ***/
  'set': function(obj, key, val) {
    return deepSetProperty(obj, key, val);
  },

  /***
   * @method size()
   * @returns Number
   * @short Returns the number of properties in the object.
   *
   * @example
   *
   *   Object.size({foo:'bar'}) -> 1
   *
   ***/
  'size': function(obj) {
    return objectSize(obj);
  },

  /***
   * @method isEmpty()
   * @returns Boolean
   * @short Returns true if the number of properties in the object is zero.
   *
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
   * @method toQueryString([options])
   * @returns Object
   * @short Converts the object into a query string.
   * @extra Accepts deep objects and arrays. [options] can be passed for more
   *        control over the result.
   *
   * @options
   *
   *   deep        If `true`, non-standard "deep" syntax `foo[]` will be
   *               used for output. Note that `separator` will be ignored,
   *               as this option overrides shallow syntax. (Default `false`)
   *
   *   prefix      If passed, this string will be prefixed to all keys,
   *               separated by the `separator`. (Default `''`).
   *
   *   transform   A function of type `transformFn` whose return value becomes
   *               the final value in the string. (Default `undefined`)
   *
   *   separator   A string that is used to separate keys, either for deep
   *               objects, or when `prefix` is passed.(Default `_`).
   *
   * @callback transformFn
   *
   *   key   The key of the current iteration.
   *   val   The value of the current iteration.
   *   obj   A reference to the object.
   *
   * @example
   *
   *   Object.toQueryString({foo:'bar'})                  -> 'foo=bar'
   *   Object.toQueryString({foo:['a','b']})              -> 'foo=a&foo=b'
   *   Object.toQueryString({foo:['a','b']}, {deep:true}) -> 'foo[]=a&foo[]=b'
   *
   * @param {Object} obj
   * @param {QueryStringOptions} [options]
   * @callbackParam {string} key
   * @callbackParam {Property} val
   * @callbackParam {Object} obj
   * @callbackReturns {NewProperty} transformFn
   * @option {boolean} [deep]
   * @option {string} [prefix]
   * @option {string} [separator]
   * @option {transformFn} [transform]
   *
   ***/
  'toQueryString': function(obj, options) {
    return toQueryStringWithOptions(obj, options);
  },

  /***
   * @method isEqual(obj)
   * @returns Boolean
   * @short Returns `true` if `obj` is equivalent to the object.
   * @extra If both objects are built-in types, they will be considered
   *        equivalent if they are not "observably distinguishable". This means
   *        that objects that can otherwise be considered equivalent (primitives
   *        and their object counterparts, `0` and `-0`, sparse and dense arrays)
   *        will return `false`. Functions and non-built-ins like instances of
   *        user-defined classes and host objects like Element and Event are
   *        strictly compared with `===`, and will only be equivalent if they
   *        are the same reference. Plain objects as well as Arrays will be
   *        traversed into and deeply checked by their non-inherited, enumerable
   *        properties. Other allowed types include Typed Arrays, Sets, Maps,
   *        Arguments, Dates, Regexes, and Errors.
   *
   * @example
   *
   *   Object.isEqual({a:2}, {a:2})         -> true
   *   Object.isEqual({a:2}, {a:3})         -> false
   *   Object.isEqual(5, Object(5))         -> false
   *   Object.isEqual(Object(5), Object(5)) -> true
   *   Object.isEqual(NaN, NaN)             -> false
   *
   * @param {Object} obj
   *
   ***/
  'isEqual': function(obj1, obj2) {
    return isEqual(obj1, obj2);
  },

  /***
   * @method merge(source, [options])
   * @returns Object
   * @short Merges properties from `source` into the object.
   * @extra This method will modify the object! Use `add` for a non-destructive
   *        alias.
   *
   * @options
   *
   *   deep         If `true` deep properties are merged recursively.
   *                (Default `false`)
   *
   *   hidden       If `true`, non-enumerable properties will be merged as well.
   *                (Default `false`)
   *
   *   descriptor   If `true`, properties will be merged by property descriptor.
   *                Use this option to merge getters or setters, or to preserve
   *                `enumerable`, `configurable`, etc.
   *                (Default `false`)
   *
   *   resolve      Determines which property wins in the case of conflicts.
   *                If `true`, `source` wins. If `false`, the original property
   *                wins. A function of type `resolveFn` may also be passed,
   *                whose return value will decide the result. Any non-undefined
   *                return value will resolve the conflict for that property
   *                (will not continue if `deep`). Returning `undefined` will do
   *                nothing (no merge). Finally, returning the global object
   *                `Sugar` will allow Sugar to handle the merge as normal.
   *                (Default `true`)
   *
   * @callback resolveFn
   *
   *   key        The key of the current iteration.
   *   targetVal  The current value for the key in the target.
   *   sourceVal  The current value for the key in `source`.
   *   target     The target object.
   *   source     The source object.
   *
   * @example
   *
   *   Object.merge({one:1},{two:2})                 -> {one:1,two:2}
   *   Object.merge({one:1},{one:9,two:2})           -> {one:9,two:2}
   *   Object.merge({x:{a:1}},{x:{b:2}},{deep:true}) -> {x:{a:1,b:2}}
   *   Object.merge({a:1},{a:2},{resolve:mergeAdd})  -> {a:3}
   *
   * @param {Object} source
   * @param {ObjectMergeOptions} [options]
   * @callbackParam {string} key
   * @callbackParam {Property} targetVal
   * @callbackParam {Property} sourceVal
   * @callbackParam {Object} target
   * @callbackParam {Object} source
   * @callbackReturns {boolean} resolveFn
   * @option {boolean} [deep]
   * @option {boolean} [hidden]
   * @option {boolean} [descriptor]
   * @option {boolean|resolveFn} [resolve]
   *
   ***/
  'merge': function(target, source, opts) {
    return mergeWithOptions(target, source, opts);
  },

  /***
   * @method add(obj, [options])
   * @returns Object
   * @short Adds properties in `obj` and returns a new object.
   * @extra This method will not modify the original object. See `merge` for options.
   *
   * @example
   *
   *   Object.add({one:1},{two:2})                 -> {one:1,two:2}
   *   Object.add({one:1},{one:9,two:2})           -> {one:9,two:2}
   *   Object.add({x:{a:1}},{x:{b:2}},{deep:true}) -> {x:{a:1,b:2}}
   *   Object.add({a:1},{a:2},{resolve:mergeAdd})  -> {a:3}
   *
   * @param {Object} obj
   * @param {ObjectMergeOptions} [options]
   *
   ***/
  'add': function(obj1, obj2, opts) {
    return mergeWithOptions(clone(obj1), obj2, opts);
  },

  /***
   * @method mergeAll(sources, [options])
   * @returns Object
   * @short Merges properties from an array of `sources`.
   * @extra This method will modify the object! Use `addAll` for a non-destructive
   *        alias. See `merge` for options.
   *
   * @example
   *
   *   Object.mergeAll({one:1},[{two:2},{three:3}]) -> {one:1,two:2,three:3}
   *   Object.mergeAll({x:{a:1}},[{x:{b:2}},{x:{c:3}}],{deep:true}) -> {x:{a:1,b:2,c:3}}
   *
   * @param {Array<Object>} sources
   * @param {ObjectMergeOptions} [options]
   *
   ***/
  'mergeAll': function(target, sources, opts) {
    return mergeAll(target, sources, opts);
  },

  /***
   * @method addAll(sources, [options])
   * @returns Object
   * @short Adds properties from an array of `sources` and returns a new object.
   * @extra This method will not modify the object. See `merge` for options.
   *
   * @example
   *
   *   Object.addAll({one:1},[{two:2},{three:3}]) -> {one:1,two:2,three:3}
   *   Object.addAll({x:{a:1}},[{x:{b:2}},{x:{c:3}}],{deep:true}) -> {x:{a:1,b:2,c:3}}
   *
   * @param {Array<Object>} sources
   * @param {ObjectMergeOptions} [options]
   *
   ***/
  'addAll': function(obj, sources, opts) {
    return mergeAll(clone(obj), sources, opts);
  },

  /***
   * @method defaults(sources, [options])
   * @returns Object
   * @short Merges properties from one or multiple `sources` while preserving
   *        the object's defined properties.
   * @extra This method modifies the object! See `merge` for options.
   *
   * @example
   *
   *   Object.defaults({one:1},[{one:9},{two:2}])                   -> {one:1,two:2}
   *   Object.defaults({x:{a:1}},[{x:{a:9}},{x:{b:2}}],{deep:true}) -> {x:{a:1,b:2}}
   *
   * @param {Array<Object>} sources
   * @param {ObjectMergeOptions} [options]
   *
   ***/
  'defaults': function(target, sources, opts) {
    return defaults(target, sources, opts);
  },

  /***
   * @method intersect(obj)
   * @returns Object
   * @short Returns a new object whose properties are those that the object has
   *        in common both with `obj`.
   * @extra If both key and value do not match, then the property will not be included.
   *
   * @example
   *
   *   Object.intersect({a:'a'},{b:'b'}) -> {}
   *   Object.intersect({a:'a'},{a:'b'}) -> {}
   *   Object.intersect({a:'a',b:'b'},{b:'b',z:'z'}) -> {b:'b'}
   *
   * @param {Object} obj
   *
   ***/
  'intersect': function(obj1, obj2) {
    return objectIntersectOrSubtract(obj1, obj2, false);
  },

  /***
   * @method subtract(obj)
   * @returns Object
   * @short Returns a clone of the object with any properties shared with `obj` excluded.
   * @extra If both key and value do not match, then the property will not be excluded.
   *
   * @example
   *
   *   Object.subtract({a:'a',b:'b'},{b:'b'}) -> {a:'a'}
   *   Object.subtract({a:'a',b:'b'},{a:'b'}) -> {a:'a',b:'b'}
   *
   * @param {Object} obj
   *
   ***/
  'subtract': function(obj1, obj2) {
    return objectIntersectOrSubtract(obj1, obj2, true);
  },

  /***
   * @method clone([deep] = false)
   * @returns Object
   * @short Creates a clone of the object.
   * @extra Default is a shallow clone, unless [deep] is true.
   *
   * @example
   *
   *   Object.clone({foo:'bar'})       -> creates shallow clone
   *   Object.clone({foo:'bar'}, true) -> creates a deep clone
   *
   * @param {boolean} [deep]
   *
   ***/
  'clone': function(obj, deep) {
    return clone(obj, deep);
  },

  /***
   * @method values()
   * @returns Array
   * @short Returns an array containing the values in the object.
   * @extra Values are in no particular order. Does not include inherited or
   *        non-enumerable properties.
   *
   * @example
   *
   *   Object.values({a:'a',b:'b'}) -> ['a','b']
   *
   ***/
  'values': function(obj) {
    return getValues(obj);
  },

  /***
   * @method invert([multi] = false)
   * @returns Object
   * @short Creates a new object with the keys and values swapped.
   * @extra If [multi] is true, values will be an array of all keys, othewise
   *        collisions will be overwritten.
   *
   * @example
   *
   *   Object.invert({foo:'bar'})     -> {bar:'foo'}
   *   Object.invert({a:1,b:1}, true) -> {1:['a','b']}
   *
   * @param {boolean} [multi]
   *
   ***/
  'invert': function(obj, multi) {
    var result = {};
    multi = multi === true;
    forEachProperty(obj, function(val, key) {
      if (hasOwn(result, val) && multi) {
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
   * @method tap(tapFn)
   * @returns Object
   * @short Runs `tapFn` and returns the object.
   * @extra A string can also be used as a shortcut to `tapFn`. This method is
   *        designed to run an intermediary function that "taps into" a method
   *        chain. As such, it is fairly useless as a static method. However it
   *        can be quite useful when combined with chainables.
   *
   * @callback tapFn
   *
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Sugar.Array([1,4,9]).map(Math.sqrt).tap('pop') -> [1,2]
   *   Sugar.Object({a:'a'}).tap(logArgs).merge({b:'b'})  -> {a:'a',b:'b'}
   *
   * @param {tapFn} tapFn
   * @callbackParam {Object} obj
   * @callbackReturns {any} tapFn
   *
   ***/
  'tap': function(obj, arg) {
    return tap(obj, arg);
  },

  /***
   * @method isArguments()
   * @returns Boolean
   * @short Returns true if the object is an arguments object.
   *
   * @example
   *
   *   Object.isArguments([1]) -> false
   *
   ***/
  'isArguments': function(obj) {
    return isArguments(obj);
  },

  /***
   * @method isObject()
   * @returns Boolean
   * @short Returns true if the object is a "plain" object.
   * @extra Plain objects do not include instances of classes or "host" objects,
   *        such as Elements, Events, etc.
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
   * @method remove(search)
   * @returns Object
   * @short Deletes all properties in the object matching `search`.
   * @extra `search` may be any property or a function of type `searchFn`. This
   *        method will modify the object!. Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.remove({a:'a',b:'b'}, 'a');           -> {b:'b'}
   *   Object.remove({a:'a',b:'b',z:'z'}, /[a-f]/); -> {z:'z'}
   *
   * @param {Property|searchFn} search
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'remove': function(obj, f) {
    return objectRemove(obj, f);
  },

  /***
   * @method exclude(search)
   * @returns Object
   * @short Returns a new object with all properties matching `search` removed.
   * @extra `search` may be any property or a function of type `searchFn`. This
   *        is a non-destructive version of `remove` and will not modify the
   *        object. Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.exclude({a:'a',b:'b'}, 'a');           -> {b:'b'}
   *   Object.exclude({a:'a',b:'b',z:'z'}, /[a-f]/); -> {z:'z'}
   *
   * @param {Property|searchFn} search
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'exclude': function(obj, f) {
    return objectExclude(obj, f);
  },

  /***
   * @method select(find)
   * @returns Object
   * @short Builds a new object containing the keys specified in `find`.
   * @extra When `find` is a string, a single key will be selected. Arrays or
   *        objects match multiple keys, and a regex will match keys by regex.
   *
   * @example
   *
   *   Object.select({a:1,b:2}, 'a')           -> {a:1}
   *   Object.select({a:1,b:2}, ['a', 'b'])    -> {a:1,b:2}
   *   Object.select({a:1,b:2}, /[a-z]/)       -> {a:1,b:2}
   *   Object.select({a:1,b:2}, {a:'a',b:'b'}) -> {a:1,b:2}
   *
   * @param {string|RegExp|Array<string>|Object} find
   *
   ***/
  'select': function(obj, f) {
    return objectSelect(obj, f);
  },

  /***
   * @method reject(find)
   * @returns Object
   * @short Builds a new object containing all keys except those in `find`.
   * @extra When `find` is a string, a single key will be rejected. Arrays or
   *        objects match multiple keys, and a regex will match keys by regex.
   *
   * @example
   *
   *   Object.reject({a:1,b:2}, 'a')        -> {b:2}
   *   Object.reject({a:1,b:2}, /[a-z]/)    -> {}
   *   Object.reject({a:1,b:2}, {a:'a'})    -> {b:2}
   *   Object.reject({a:1,b:2}, ['a', 'b']) -> {}
   *
   * @param {string|RegExp|Array<string>|Object} find
   *
   ***/
  'reject': function(obj, f) {
    return objectReject(obj, f);
  }

});

// TODO: why is this here?
defineInstance(sugarObject, {

  /***
   * @method keys()
   * @returns Array
   * @polyfill ES5
   * @short Returns an array containing the keys of all of the non-inherited,
   *        enumerable properties of the object.
   *
   * @example
   *
   *   Object.keys({a:'a',b:'b'}) -> ['a','b']
   *
   ***/
  'keys': function(obj) {
    return getKeys(obj);
  }

});

buildClassCheckMethods();
