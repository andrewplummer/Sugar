'use strict';

/***
 * @module Enumerable
 * @description Counting, mapping, and finding methods on both arrays and objects.
 *
 ***/

function sum(obj, map) {
  var sum = 0;
  enumerateWithMapping(obj, map, function(val) {
    sum += val;
  });
  return sum;
}

function average(obj, map) {
  var sum = 0, count = 0;
  enumerateWithMapping(obj, map, function(val) {
    sum += val;
    count++;
  });
  // Prevent divide by 0
  return sum / (count || 1);
}

function median(obj, map) {
  var result = [], middle, len;
  enumerateWithMapping(obj, map, function(val) {
    result.push(val);
  });
  len = result.length;
  if (!len) return 0;
  result.sort(function(a, b) {
    // IE7 will throw errors on non-numbers!
    return (a || 0) - (b || 0);
  });
  middle = trunc(len / 2);
  return len % 2 ? result[middle] : (result[middle - 1] + result[middle]) / 2;
}

function getMinOrMax(obj, arg1, arg2, max, asObject) {
  var result = [], pushVal, edge, all, map;
  if (isBoolean(arg1)) {
    all = arg1;
    map = arg2;
  } else {
    map = arg1;
  }
  enumerateWithMapping(obj, map, function(val, key) {
    if (isUndefined(val)) {
      throw new TypeError('Cannot compare with undefined');
    }
    pushVal = asObject ? key : obj[key];
    if (val === edge) {
      result.push(pushVal);
    } else if (isUndefined(edge) || (max && val > edge) || (!max && val < edge)) {
      result = [pushVal];
      edge = val;
    }
  });
  return getReducedMinMaxResult(result, obj, all, asObject);
}

function getLeastOrMost(obj, arg1, arg2, most, asObject) {
  var group = {}, refs = [], minMaxResult, result, all, map;
  if (isBoolean(arg1)) {
    all = arg1;
    map = arg2;
  } else {
    map = arg1;
  }
  enumerateWithMapping(obj, map, function(val, key) {
    var groupKey = serializeInternal(val, refs);
    var arr = getOwn(group, groupKey) || [];
    arr.push(asObject ? key : obj[key]);
    group[groupKey] = arr;
  });
  minMaxResult = getMinOrMax(group, !!all, 'length', most, true);
  if (all) {
    result = [];
    // Flatten result
    forEachProperty(minMaxResult, function(val) {
      result = result.concat(val);
    });
  } else {
    result = getOwn(group, minMaxResult);
  }
  return getReducedMinMaxResult(result, obj, all, asObject);
}


// Support

function getReducedMinMaxResult(result, obj, all, asObject) {
  if (asObject && all) {
    // The method has returned an array of keys so use this array
    // to build up the resulting object in the form we want it in.
    return result.reduce(function(o, key) {
      o[key] = obj[key];
      return o;
    }, {});
  } else if (result && !all) {
    result = result[0];
  }
  return result;
}

function enumerateWithMapping(obj, map, fn) {
  var arrayIndexes = isArray(obj);
  forEachProperty(obj, function(val, key) {
    if (arrayIndexes) {
      if (!isArrayIndex(key)) {
        return;
      }
      key = +key;
    }
    var mapped = mapWithShortcuts(val, map, obj, [val, key, obj]);
    fn(mapped, key);
  });
}

/*** @namespace Array ***/

// Flag allowing native array methods to be enhanced
var ARRAY_ENHANCEMENTS_FLAG = 'enhanceArray';

// Enhanced map function
var enhancedMap = buildEnhancedMapping('map');

// Enhanced matcher methods
var enhancedFind      = buildEnhancedMatching('find'),
    enhancedSome      = buildEnhancedMatching('some'),
    enhancedEvery     = buildEnhancedMatching('every'),
    enhancedFilter    = buildEnhancedMatching('filter'),
    enhancedFindIndex = buildEnhancedMatching('findIndex');

function arrayNone() {
  return !enhancedSome.apply(this, arguments);
}

function arrayCount(arr, f) {
  if (isUndefined(f)) {
    return arr.length;
  }
  return enhancedFilter.apply(this, arguments).length;
}

// Enhanced methods

function buildEnhancedMapping(name) {
  return wrapNativeArrayMethod(name, enhancedMapping);
}


function buildEnhancedMatching(name) {
  return wrapNativeArrayMethod(name, enhancedMatching);
}

function enhancedMapping(map, context) {
  if (isFunction(map)) {
    return map;
  } else if (map) {
    return function(el, i, arr) {
      return mapWithShortcuts(el, map, context, [el, i, arr]);
    };
  }
}

function enhancedMatching(f) {
  var matcher;
  if (isFunction(f)) {
    return f;
  }
  matcher = getMatcher(f);
  return function(el, i, arr) {
    return matcher(el, i, arr);
  };
}

function wrapNativeArrayMethod(methodName, wrapper) {
  var nativeFn = Array.prototype[methodName];
  return function(arr, f, context, argsLen) {
    var args = new Array(2);
    assertArgument(argsLen > 0);
    args[0] = wrapper(f, context);
    args[1] = context;
    return nativeFn.apply(arr, args);
  };
}


/***
 * @method [fn]FromIndex(startIndex, [loop], ...)
 * @returns Mixed
 * @short Runs native array functions beginning from `startIndex`.
 * @extra If [loop] is `true`, once the end of the array has been reached,
 *        iteration will continue from the start of the array up to
 *        `startIndex - 1`. If [loop] is false it can be omitted. Standard
 *        arguments are then passed which will be forwarded to the native
 *        methods. When available, methods are always `enhanced`. This includes
 *        `deep properties` for `map`, and `enhanced matching` for `some`,
 *        `every`, `filter`, `find`, and `findIndex`. Note also that
 *        `forEachFromIndex` is optimized for sparse arrays and may be faster
 *        than native `forEach`.
 *
 * @set
 *   mapFromIndex
 *   forEachFromIndex
 *   filterFromIndex
 *   someFromIndex
 *   everyFromIndex
 *   reduceFromIndex
 *   reduceRightFromIndex
 *   findFromIndex
 *   findIndexFromIndex
 *
 * @example
 *
 *   users.mapFromIndex(2, 'name');
 *   users.mapFromIndex(2, true, 'name');
 *   names.forEachFromIndex(10, log);
 *   names.everyFromIndex(15, /^[A-F]/);
 *
 * @signature [fn]FromIndex(startIndex, ...)
 * @param {number} startIndex
 * @param {boolean} loop
 *
 ***/
function buildFromIndexMethods() {

  var methods = {
    'forEach': {
      base: forEachAsNative
    },
    'map': {
      wrapper: enhancedMapping
    },
    'some every': {
      wrapper: enhancedMatching
    },
    'findIndex': {
      wrapper: enhancedMatching,
      result: indexResult
    },
    'reduce': {
      apply: applyReduce
    },
    'filter find': {
      wrapper: enhancedMatching
    },
    'reduceRight': {
      apply: applyReduce,
      slice: sliceArrayFromRight,
      clamp: clampStartIndexFromRight
    }
  };

  forEachProperty(methods, function(opts, key) {
    forEach(spaceSplit(key), function(baseName) {
      var methodName = baseName + 'FromIndex';
      var fn = createFromIndexWithOptions(baseName, opts);
      defineInstanceWithArguments(sugarArray, methodName, fn);
    });
  });

  function forEachAsNative(fn) {
    forEach(this, fn);
  }

  // Methods like filter and find have a direct association between the value
  // returned by the callback and the element of the current iteration. This
  // means that when looping, array elements must match the actual index for
  // which they are being called, so the array must be sliced. This is not the
  // case for methods like forEach and map, which either do not use return
  // values or use them in a way that simply getting the element at a shifted
  // index will not affect the final return value. However, these methods will
  // still fail on sparse arrays, so always slicing them here. For example, if
  // "forEachFromIndex" were to be called on [1,,2] from index 1, although the
  // actual index 1 would itself would be skipped, when the array loops back to
  // index 0, shifting it by adding 1 would result in the element for that
  // iteration being undefined. For shifting to work, all gaps in the array
  // between the actual index and the shifted index would have to be accounted
  // for. This is infeasible and is easily solved by simply slicing the actual
  // array instead so that gaps align. Note also that in the case of forEach,
  // we are using the internal function which handles sparse arrays in a way
  // that does not increment the index, and so is highly optimized compared to
  // the others here, which are simply going through the native implementation.
  function sliceArrayFromLeft(arr, startIndex, loop) {
    var result = arr;
    if (startIndex) {
      result = arr.slice(startIndex);
      if (loop) {
        result = result.concat(arr.slice(0, startIndex));
      }
    }
    return result;
  }

  // When iterating from the right, indexes are effectively shifted by 1.
  // For example, iterating from the right from index 2 in an array of 3
  // should also include the last element in the array. This matches the
  // "lastIndexOf" method which also iterates from the right.
  function sliceArrayFromRight(arr, startIndex, loop) {
    if (!loop) {
      startIndex += 1;
      arr = arr.slice(0, max(0, startIndex));
    }
    return arr;
  }

  function clampStartIndex(startIndex, len) {
    return min(len, max(0, startIndex));
  }

  // As indexes are shifted by 1 when starting from the right, clamping has to
  // go down to -1 to accommodate the full range of the sliced array.
  function clampStartIndexFromRight(startIndex, len) {
    return min(len, max(-1, startIndex));
  }

  function applyReduce(arr, startIndex, fn, context, len, loop) {
    return function(acc, val, i) {
      i = getNormalizedIndex(i + startIndex, len, loop);
      return fn.call(arr, acc, val, i, arr);
    };
  }

  function applyEach(arr, startIndex, fn, context, len, loop) {
    return function(el, i) {
      i = getNormalizedIndex(i + startIndex, len, loop);
      return fn.call(context, arr[i], i, arr);
    };
  }

  function indexResult(result, startIndex, len) {
    if (result !== -1) {
      result = (result + startIndex) % len;
    }
    return result;
  }

  function createFromIndexWithOptions(methodName, opts) {

    var baseFn = opts.base || Array.prototype[methodName],
        applyCallback = opts.apply || applyEach,
        sliceArray = opts.slice || sliceArrayFromLeft,
        clampIndex = opts.clamp || clampStartIndex,
        getResult = opts.result,
        wrapper = opts.wrapper;

    return function(arr, startIndex, args) {
      var callArgs = [], argIndex = 0, lastArg, result, len, loop, fn;
      len = arr.length;
      if (isBoolean(args[0])) {
        loop = args[argIndex++];
      }
      fn = args[argIndex++];
      lastArg = args[argIndex];
      if (startIndex < 0) {
        startIndex += len;
      }
      startIndex = clampIndex(startIndex, len);
      assertArgument(args.length);
      fn = wrapper ? wrapper(fn, lastArg) : fn;
      callArgs.push(applyCallback(arr, startIndex, fn, lastArg, len, loop));
      if (lastArg) {
        callArgs.push(lastArg);
      }
      result = baseFn.apply(sliceArray(arr, startIndex, loop), callArgs);
      if (getResult) {
        result = getResult(result, startIndex, len);
      }
      return result;
    };
  }
}

defineInstance(sugarArray, {

  /***
   * @method map(map, [context])
   * @returns New Array
   * @polyfill ES5
   * @short Maps the array to another array whose elements are the values
   *        returned by `map`.
   * @extra [context] is the `this` object. Sugar enhances this method to accept
   *        a string for `map`, which is a shortcut for a function that gets
   *        a property or invokes a function on each element.
   *        Supports `deep properties`.
   *
   * @callback mapFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3].map(function(n) {
   *     return n * 3;
   *   }); -> [3,6,9]
   *
   *   ['a','aa','aaa'].map('length') -> [1,2,3]
   *   ['A','B','C'].map('toLowerCase') -> ['a','b','c']
   *   users.map('name') -> array of user names
   *
   * @param {string|mapFn} map
   * @param {any} context
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {NewArrayElement} mapFn
   *
   ***/
  'map': fixArgumentLength(enhancedMap),

  /***
   * @method some(search, [context])
   * @returns Boolean
   * @polyfill ES5
   * @short Returns true if `search` is true for any element in the array.
   * @extra `search` can be an array element or a function of type `searchFn`.
   *        [context] is the `this` object. Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   ['a','b','c'].some(function(n) {
   *     return n == 'a';
   *   });
   *   ['a','b','c'].some(function(n) {
   *     return n == 'd';
   *   });
   *   ['a','b','c'].some('a')    -> true
   *   [{a:2},{b:5}].some({a:2})  -> true
   *   users.some({ name: /^H/ }) -> true if any have a name starting with H
   *
   * @param {ArrayElement|searchFn} search
   * @param {any} context
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'some': fixArgumentLength(enhancedSome),

  /***
   * @method every(search, [context])
   * @returns Boolean
   * @polyfill ES5
   * @short Returns true if `search` is true for all elements of the array.
   * @extra `search` can be an array element or a function of type `searchFn`.
   *        [context] is the `this` object. Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   ['a','a','a'].every(function(n) {
   *     return n == 'a';
   *   });
   *   ['a','a','a'].every('a')   -> true
   *   [{a:2},{a:2}].every({a:2}) -> true
   *   users.every({ name: /^H/ }) -> true if all have a name starting with H
   *
   * @param {ArrayElement|searchFn} search
   * @param {any} context
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'every': fixArgumentLength(enhancedEvery),

  /***
   * @method filter(search, [context])
   * @returns Array
   * @polyfill ES5
   * @short Returns any elements in the array that match `search`.
   * @extra `search` can be an array element or a function of type `searchFn`.
   *        [context] is the `this` object. Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3].filter(function(n) {
   *     return n > 1;
   *   });
   *   [1,2,2,4].filter(2) -> 2
   *   users.filter({ name: /^H/ }) -> all users with a name starting with H
   *
   * @param {ArrayElement|searchFn} search
   * @param {any} context
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'filter': fixArgumentLength(enhancedFilter),

  /***
   * @method find(search, [context])
   * @returns Mixed
   * @polyfill ES6
   * @short Returns the first element in the array that matches `search`.
   * @extra `search` can be an array element or a function of type `searchFn`.
   *        Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   users.find(function(user) {
   *     return user.name === 'Harry';
   *   }); -> harry!
   *
   *   users.find({ name: 'Harry' }); -> harry!
   *   users.find({ name: /^[A-H]/ });  -> First user with name starting with A-H
   *   users.find({ titles: ['Ms', 'Dr'] }); -> not harry!
   *
   * @param {ArrayElement|searchFn} search
   * @param {any} context
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'find': fixArgumentLength(enhancedFind),

  /***
   * @method findIndex(search, [context])
   * @returns Number
   * @polyfill ES6
   * @short Returns the index of the first element in the array that matches
   *        `search`, or `-1` if none.
   * @extra `search` can be an array element or a function of type `searchFn`.
   *        [context] is the `this` object. Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3,4].findIndex(function(n) {
   *     return n % 2 == 0;
   *   }); -> 1
   *   ['a','b','c'].findIndex('c');        -> 2
   *   ['cuba','japan','canada'].find(/^c/) -> 0
   *
   * @param {ArrayElement|searchFn} search
   * @param {any} context
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'findIndex': fixArgumentLength(enhancedFindIndex)

}, [ENHANCEMENTS_FLAG, ARRAY_ENHANCEMENTS_FLAG]);


defineInstance(sugarArray, {

  /***
   * @method none(search, [context])
   *
   * @returns Boolean
   * @short Returns true if none of the elements in the array match `search`.
   * @extra `search` can be an array element or a function of type `searchFn`.
   *        [context] is the `this` object. Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3].none(5)         -> true
   *   ['a','b','c'].none(/b/) -> false
   *   users.none(function(user) {
   *     return user.name == 'Wolverine';
   *   }); -> probably true
   *   users.none({ name: 'Wolverine' }); -> same as above
   *
   * @param {ArrayElement|searchFn} search
   * @param {any} context
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'none': fixArgumentLength(arrayNone),

  /***
   * @method count(search, [context])
   * @returns Number
   * @short Counts all elements in the array that match `search`.
   * @extra `search` can be an element or a function of type `searchFn`.
   *        Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   ['a','b','a'].count('a') -> 2
   *   ['a','b','c'].count(/b/) -> 1
   *   users.count(function(user) {
   *     return user.age > 30;
   *   }); -> number of users older than 30
   *
   * @param {ArrayElement|searchFn} search
   * @param {any} context
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'count': fixArgumentLength(arrayCount),

  /***
   * @method min([all] = false, [map])
   * @returns Mixed
   * @short Returns the element in the array with the lowest value.
   * @extra [map] can be passed in place of [all], and is a function of type
   *        `mapFn` that maps the value to be checked or a string acting as a
   *        shortcut. If [all] is true, multiple elements will be returned.
   *        Supports `deep properties`.
   *
   * @callback mapFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3].min()                          -> 1
   *   ['fee','fo','fum'].min('length')       -> 'fo'
   *   ['fee','fo','fum'].min(true, 'length') -> ['fo']
   *   users.min('age')                       -> youngest guy!
   *
   *   ['fee','fo','fum'].min(true, function(n) {
   *     return n.length;
   *   }); -> ['fo']
   *
   * @signature min([map])
   * @param {string|mapFn} map
   * @param {boolean} all
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {NewArrayElement} mapFn
   *
   ***/
  'min': function(arr, all, map) {
    return getMinOrMax(arr, all, map);
  },

  /***
   * @method max([all] = false, [map])
   * @returns Mixed
   * @short Returns the element in the array with the greatest value.
   * @extra [map] can be passed in place of [all], and is a function of type
   *        `mapFn` that maps the value to be checked or a string acting as a
   *        shortcut. If [all] is true, multiple elements will be returned.
   *        Supports `deep properties`.
   *
   * @callback mapFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3].max()                          -> 3
   *   ['fee','fo','fum'].max('length')       -> 'fee'
   *   ['fee','fo','fum'].max(true, 'length') -> ['fee','fum']
   *   users.max('age')                       -> oldest guy!
   *
   *   ['fee','fo','fum'].max(true, function(n) {
   *     return n.length;
   *   }); -> ['fee', 'fum']
   *
   * @signature max([map])
   * @param {string|mapFn} map
   * @param {boolean} all
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {NewArrayElement} mapFn
   *
   ***/
  'max': function(arr, all, map) {
    return getMinOrMax(arr, all, map, true);
  },

  /***
   * @method least([all] = false, [map])
   * @returns Array
   * @short Returns the elements in the array with the least commonly occuring value.
   * @extra [map] can be passed in place of [all], and is a function of type
   *        `mapFn` that maps the value to be checked or a string acting as a
   *        shortcut. If [all] is true, will return multiple values in an array.
   *        Supports `deep properties`.
   *
   * @callback mapFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [3,2,2].least() -> 3
   *   ['fe','fo','fum'].least(true, 'length') -> ['fum']
   *   users.least('profile.type')             -> (user with least commonly occurring type)
   *   users.least(true, 'profile.type')       -> (users with least commonly occurring type)
   *
   * @signature least([map])
   * @param {string|mapFn} map
   * @param {boolean} all
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {NewArrayElement} mapFn
   *
   ***/
  'least': function(arr, all, map) {
    return getLeastOrMost(arr, all, map);
  },

  /***
   * @method most([all] = false, [map])
   * @returns Array
   * @short Returns the elements in the array with the most commonly occuring value.
   * @extra [map] can be passed in place of [all], and is a function of type
   *        `mapFn` that maps the value to be checked or a string acting as a
   *        shortcut. If [all] is true, will return multiple values in an array.
   *        Supports `deep properties`.
   *
   * @callback mapFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [3,2,2].most(2) -> 2
   *   ['fe','fo','fum'].most(true, 'length') -> ['fe','fo']
   *   users.most('profile.type')             -> (user with most commonly occurring type)
   *   users.most(true, 'profile.type')       -> (users with most commonly occurring type)
   *
   * @signature most([map])
   * @param {string|mapFn} map
   * @param {boolean} all
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {NewArrayElement} mapFn
   *
   ***/
  'most': function(arr, all, map) {
    return getLeastOrMost(arr, all, map, true);
  },

  /***
   * @method sum([map])
   * @returns Number
   * @short Sums all values in the array.
   * @extra [map] can be a function of type `mapFn` that maps the value to be
   *        summed or a string acting as a shortcut.
   *
   * @callback mapFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,2].sum() -> 5
   *   users.sum(function(user) {
   *     return user.votes;
   *   }); -> total votes!
   *   users.sum('votes') -> total votes!
   *
   * @param {string|mapFn} map
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {NewArrayElement} mapFn
   *
   ***/
  'sum': function(arr, map) {
    return sum(arr, map);
  },

  /***
   * @method average([map])
   * @returns Number
   * @short Gets the mean average for all values in the array.
   * @extra [map] can be a function of type `mapFn` that maps the value to be
   *        averaged or a string acting as a shortcut. Supports `deep properties`.
   *
   * @callback mapFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3,4].average() -> 2
   *   users.average(function(user) {
   *     return user.age;
   *   }); -> average user age
   *   users.average('age') -> average user age
   *   users.average('currencies.usd.balance') -> average USD balance
   *
   * @param {string|mapFn} map
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {NewArrayElement} mapFn
   *
   ***/
  'average': function(arr, map) {
    return average(arr, map);
  },

  /***
   * @method median([map])
   * @returns Number
   * @short Gets the median average for all values in the array.
   * @extra [map] can be a function of type `mapFn` that maps the value to be
   *        averaged or a string acting as a shortcut.
   *
   * @callback mapFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,2].median() -> 2
   *   [{a:1},{a:2},{a:2}].median('a') -> 2
   *   users.median('age') -> median user age
   *   users.median('currencies.usd.balance') -> median USD balance
   *
   * @param {string|mapFn} map
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {NewArrayElement} mapFn
   *
   ***/
  'median': function(arr, map) {
    return median(arr, map);
  }

});


/*** @namespace Object ***/

// Object matchers
var objectSome  = wrapObjectMatcher('some'),
    objectFind  = wrapObjectMatcher('find'),
    objectEvery = wrapObjectMatcher('every');

function objectForEach(obj, fn) {
  assertCallable(fn);
  forEachProperty(obj, function(val, key) {
    fn(val, key, obj);
  });
  return obj;
}

function objectMap(obj, map) {
  var result = {};
  forEachProperty(obj, function(val, key) {
    result[key] = mapWithShortcuts(val, map, obj, [val, key, obj]);
  });
  return result;
}

function objectReduce(obj, fn, acc) {
  var init = isDefined(acc);
  forEachProperty(obj, function(val, key) {
    if (!init) {
      acc = val;
      init = true;
      return;
    }
    acc = fn(acc, val, key, obj);
  });
  return acc;
}

function objectNone(obj, f) {
  return !objectSome(obj, f);
}

function objectFilter(obj, f) {
  var matcher = getMatcher(f), result = {};
  forEachProperty(obj, function(val, key) {
    if (matcher(val, key, obj)) {
      result[key] = val;
    }
  });
  return result;
}

function objectCount(obj, f) {
  var matcher = getMatcher(f), count = 0;
  forEachProperty(obj, function(val, key) {
    if (matcher(val, key, obj)) {
      count++;
    }
  });
  return count;
}

// Support

function wrapObjectMatcher(name) {
  var nativeFn = Array.prototype[name];
  return function(obj, f) {
    var matcher = getMatcher(f);
    return nativeFn.call(getKeys(obj), function(key) {
      return matcher(obj[key], key, obj);
    });
  };
}

defineInstanceAndStatic(sugarObject, {

  /***
   * @method forEach(eachFn)
   * @returns Object
   * @short Runs `eachFn` against each property in the object.
   * @extra Does not iterate over inherited or non-enumerable properties.
   *
   * @callback eachFn
   *
   *   val  The value of the current iteration.
   *   key  The key of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.forEach({a:'b'}, function(val, key) {
   *     // val = 'b', key = a
   *   });
   *
   * @param {eachFn} eachFn
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   *
   ***/
  'forEach': function(obj, eachFn) {
    return objectForEach(obj, eachFn);
  },

  /***
   * @method map(map)
   * @returns Object
   * @short Maps the object to another object whose properties are the values
   *        returned by `map`.
   * @extra `map` can be a function of type `mapFn` or a string that acts as a
   *        shortcut and gets a property or invokes a function on each element.
   *        Supports `deep properties`.
   *
   * @callback mapFn
   *
   *   val  The value of the current property.
   *   key  The key of the current property.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   data.map(function(val, key) {
   *     return key;
   *   }); -> {a:'b'}
   *   users.map('age');
   *
   * @param {string|mapFn} map
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {NewProperty} mapFn
   *
   ***/
  'map': function(obj, map) {
    return objectMap(obj, map);
  },

  /***
   * @method some(search)
   * @returns Boolean
   * @short Returns true if `search` is true for any property in the object.
   * @extra `search` can be any property or a function of type `searchFn`.
   *        Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   val  The value of the current iteration.
   *   key  The key of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.some({a:1,b:2}, function(val) {
   *     return val == 1;
   *   }); -> true
   *   Object.some({a:1,b:2}, 1); -> true
   *
   * @param {Property|searchFn} search
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'some': objectSome,

  /***
   * @method every(search)
   * @returns Boolean
   * @short Returns true if `search` is true for all properties in the object.
   * @extra `search` can be any property or a function of type `searchFn`.
   *        Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   val  The value of the current iteration.
   *   key  The key of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.every({a:1,b:2}, function(val) {
   *     return val > 0;
   *   }); -> true
   *   Object.every({a:'a',b:'b'}, /[a-z]/); -> true
   *
   * @param {Property|searchFn} search
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'every': objectEvery,

  /***
   * @method filter(search)
   * @returns Array
   * @short Returns a new object with properties that match `search`.
   * @extra `search` can be any property or a function of type `searchFn`.
   *        Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   val  The value of the current iteration.
   *   key  The key of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.filter({a:1,b:2}, function(val) {
   *     return val == 1;
   *   }); -> {a:1}
   *   Object.filter({a:'a',z:'z'}, /[a-f]/); -> {a:'a'}
   *   Object.filter(usersByName, /^H/); -> all users with names starting with H
   *
   * @param {Property|searchFn} search
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'filter': function(obj, f) {
    return objectFilter(obj, f);
  },

  /***
   * @method reduce(reduceFn, [init])
   * @returns Mixed
   * @short Reduces the object to a single result.
   * @extra This operation is sometimes called "accumulation", as it takes the
   *        result of the last iteration of `fn` and passes it as the first
   *        argument to the next iteration, "accumulating" that value as it goes.
   *        The return value of this method will be the return value of the final
   *        iteration of `fn`. If [init] is passed, it will be the initial
   *        "accumulator" (the first argument). If [init] is not passed, then a
   *        property of the object will be used instead and `fn` will not be
   *        called for that property. Note that object properties have no order,
   *        and this may lead to bugs (for example if performing division or
   *        subtraction operations on a value). If order is important, use an
   *        array instead!
   *
   * @callback reduceFn
   *
   *   acc  The "accumulator", either [init], the result of the last iteration
   *        of `fn`, or a property of `obj`.
   *   val  The value of the current property called for `fn`.
   *   key  The key of the current property called for `fn`.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.reduce({a:2,b:4}, function(a, b) {
   *     return a * b;
   *   }); -> 8
   *
   *   Object.reduce({a:2,b:4}, function(a, b) {
   *     return a * b;
   *   }, 10); -> 80
   *
   *
   * @param {reduceFn} reduceFn
   * @param {any} [init]
   * @callbackParam {Property} acc
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   *
   ***/
  'reduce': function(obj, fn, init) {
    return objectReduce(obj, fn, init);
  },

  /***
   * @method find(search)
   * @returns Boolean
   * @short Returns the first key whose value matches `search`.
   * @extra `search` can be any property or a function of type `searchFn`.
   *        Implements `enhanced matching`. Note that "first" is
   *        implementation-dependent. If order is important an array should be
   *        used instead.
   *
   * @callback searchFn
   *
   *   val  The value of the current iteration.
   *   key  The key of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.find({a:1,b:2}, function(val) {
   *     return val == 2;
   *   }); -> 'b'
   *   Object.find({a:'a',b:'b'}, /[a-z]/); -> 'a'
   *
   * @param {Property|searchFn} search
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'find': objectFind,

  /***
   * @method count(search)
   * @returns Number
   * @short Counts all properties in the object that match `search`.
   * @extra `search` can be any property or a function of type `searchFn`.
   *        Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   val  The value of the current iteration.
   *   key  The key of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.count({a:'a',b:'b',c:'a'}, 'a') -> 2
   *   Object.count(usersByName, function(user) {
   *     return user.age > 30;
   *   }); -> number of users older than 30
   *   Object.count(usersByName, { name: /^[H-Z]/ });
   *
   * @param {Property|searchFn} search
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'count': function(obj, f) {
    return objectCount(obj, f);
  },

  /***
   * @method none(search)
   * @returns Boolean
   * @short Returns true if none of the properties in the object match `search`.
   * @extra `search` can be any property or a function of type `searchFn`.
   *        Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   val  The value of the current iteration.
   *   key  The key of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.none({a:1,b:2}, 3); -> true
   *   Object.none(usersByName, function(user) {
   *     return user.name == 'Wolverine';
   *   }); -> probably true
   *
   * @param {Property|searchFn} search
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'none': function(obj, f) {
    return objectNone(obj, f);
  },

  /***
   * @method sum([map])
   * @returns Number
   * @short Sums all properties in the object.
   * @extra [map] can be a function of type `mapFn` that maps the value to be
   *        summed or a string acting as a shortcut.
   *
   * @callback mapFn
   *
   *   val  The value of the current iteration.
   *   key  The key of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.sum({a:35,b:13}); -> 48
   *   Object.sum(usersByName, function(user) {
   *     return user.votes;
   *   }); -> total user votes
   *
   * @param {string|mapFn} map
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {NewProperty} mapFn
   *
   ***/
  'sum': function(obj, map) {
    return sum(obj, map);
  },

  /***
   * @method average([map])
   * @returns Number
   * @short Gets the mean average of all properties in the object.
   * @extra [map] can be a function of type `mapFn` that maps the value to be
   *        averaged or a string acting as a shortcut.
   *
   * @callback mapFn
   *
   *   val  The value of the current iteration.
   *   key  The key of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.average({a:35,b:11}); -> 23
   *   Object.average(usersByName, 'age'); -> average user age
   *   Object.average(usersByName, 'currencies.usd.balance'); -> USD mean balance
   *
   * @param {string|mapFn} map
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {NewProperty} mapFn
   *
   ***/
  'average': function(obj, map) {
    return average(obj, map);
  },

  /***
   * @method median([map])
   * @returns Number
   * @short Gets the median average of all properties in the object.
   * @extra [map] can be a function of type `mapFn` that maps the value to be
   *        averaged or a string acting as a shortcut.
   *
   * @callback mapFn
   *
   *   val  The value of the current iteration.
   *   key  The key of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.median({a:1,b:2,c:2}) -> 2
   *   Object.median(usersByName, 'age'); -> median user age
   *   Object.median(usersByName, 'currencies.usd.balance'); -> USD median balance
   *
   * @param {string|mapFn} map
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {NewProperty} mapFn
   *
   ***/
  'median': function(obj, map) {
    return median(obj, map);
  },

  /***
   * @method min([all] = false, [map])
   * @returns Mixed
   * @short Returns the key of the property in the object with the lowest value.
   * @extra If [all] is true, will return an object with all properties in the
   *        object with the lowest value. [map] can be passed in place of [all]
   *        and is a function of type `mapFn` that maps the value to be checked
   *        or a string acting as a shortcut.
   *
   * @callback mapFn
   *
   *   val  The value of the current iteration.
   *   key  The key of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.min({a:1,b:2,c:3})                    -> 'a'
   *   Object.min({a:'aaa',b:'bb',c:'c'}, 'length') -> 'c'
   *   Object.min({a:1,b:1,c:3}, true)              -> {a:1,b:1}
   *
   * @signature min([map])
   * @param {string|mapFn} map
   * @param {boolean} [all]
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {NewProperty} mapFn
   *
   ***/
  'min': function(obj, all, map) {
    return getMinOrMax(obj, all, map, false, true);
  },

  /***
   * @method max([all] = false, [map])
   * @returns Mixed
   * @short Returns the key of the property in the object with the highest value.
   * @extra If [all] is true, will return an object with all properties in the
   *        object with the highest value. [map] can be passed in place of [all]
   *        and is a function of type `mapFn` that maps the value to be checked
   *        or a string acting as a shortcut.
   *
   * @callback mapFn
   *
   *   val  The value of the current iteration.
   *   key  The key of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.max({a:1,b:2,c:3})                    -> 'c'
   *   Object.max({a:'aaa',b:'bb',c:'c'}, 'length') -> 'a'
   *   Object.max({a:1,b:3,c:3}, true)              -> {b:3,c:3}
   *
   * @signature max([map])
   * @param {string|mapFn} map
   * @param {boolean} [all]
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {NewProperty} mapFn
   *
   ***/
  'max': function(obj, all, map) {
    return getMinOrMax(obj, all, map, true, true);
  },

  /***
   * @method least([all] = false, [map])
   * @returns Mixed
   * @short Returns the key of the property in the object with the least commonly
   *        occuring value.
   * @extra If [all] is true, will return an object with all properties in the
   *        object with the least common value. [map] can be passed in place of
   *        [all] and is a function of type `mapFn` that maps the value to be
   *        checked or a string acting as a shortcut.
   *
   * @callback mapFn
   *
   *   val  The value of the current iteration.
   *   key  The key of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.least({a:1,b:3,c:3})                   -> 'a'
   *   Object.least({a:'aa',b:'bb',c:'c'}, 'length') -> 'c'
   *   Object.least({a:1,b:3,c:3}, true)             -> {a:1}
   *
   * @signature least([map])
   * @param {string|mapFn} map
   * @param {boolean} [all]
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {NewProperty} mapFn
   *
   ***/
  'least': function(obj, all, map) {
    return getLeastOrMost(obj, all, map, false, true);
  },

  /***
   * @method most([all] = false, [map])
   * @returns Mixed
   * @short Returns the key of the property in the object with the most commonly
   *        occuring value.
   * @extra If [all] is true, will return an object with all properties in the
   *        object with the most common value. [map] can be passed in place of
   *        [all] and is a function of type `mapFn` that maps the value to be
   *        checked or a string acting as a shortcut.
   *
   * @callback mapFn
   *
   *   val  The value of the current iteration.
   *   key  The key of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.most({a:1,b:3,c:3})                   -> 'b'
   *   Object.most({a:'aa',b:'bb',c:'c'}, 'length') -> 'a'
   *   Object.most({a:1,b:3,c:3}, true)             -> {b:3,c:3}
   *
   * @signature most([map])
   * @param {string|mapFn} map
   * @param {boolean} [all]
   * @callbackParam {Property} val
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {NewProperty} mapFn
   *
   ***/
  'most': function(obj, all, map) {
    return getLeastOrMost(obj, all, map, true, true);
  }

});


buildFromIndexMethods();
