'use strict';

/***
 * @package Enumerable
 * @dependency core
 * @description Counting, mapping, and finding methods on both arrays and objects.
 *
 ***/

// Matchers

function getMatcher(f, k) {
  if (isPrimitiveType(f)) {
    // Do nothing and fall through to the
    // default matcher below.
  } else if (isRegExp(f)) {
    // Match against a RegExp
    return regexMatcher(f);
  } else if (isDate(f)) {
    // Match against a date. isEqual below should also
    // catch this but matching directly up front for speed.
    return dateMatcher(f);
  } else if (isFunction(f)) {
    // Match against a filtering function
    if (k) {
      return invertedArgsFunctionMatcher(f);
    } else {
      return functionMatcher(f);
    }
  } else if (isPlainObject(f)) {
    // Match against a fuzzy hash or array.
    return fuzzyMatcher(f, k);
  }
  // Default is standard isEqual
  return defaultMatcher(f);
}

function defaultMatcher(f) {
  return function(el) {
    return el === f || isEqual(el, f);
  }
}

function regexMatcher(reg) {
  reg = RegExp(reg);
  return function(el) {
    return reg.test(el);
  }
}

function dateMatcher(d) {
  var ms = d.getTime();
  return function(el) {
    return !!(el && el.getTime) && el.getTime() === ms;
  }
}

function functionMatcher(fn) {
  return function(el, i, arr) {
    // Return true up front if match by reference
    return el === fn || fn.call(arr, el, i, arr);
  }
}

function invertedArgsFunctionMatcher(fn) {
  return function(value, key, obj) {
    // Return true up front if match by reference
    return value === fn || fn.call(obj, key, value, obj);
  }
}

function fuzzyMatcher(obj, k) {
  var matchers = {};
  return function(el, i, arr) {
    var key;
    if (!isObjectType(el)) {
      return false;
    }
    for(key in obj) {
      matchers[key] = matchers[key] || getMatcher(obj[key], k);
      if (matchers[key].call(arr, el[key], i, arr) === false) {
        return false;
      }
    }
    return true;
  }
}

// Class agnostic methods

function sum(obj, map, k) {
  var sum = 0;
  enumerateWithMapping(obj, map, function(val) {
    sum += val;
  }, k);
  return sum;
}

function average(obj, map, k) {
  var sum = 0, count = 0;
  enumerateWithMapping(obj, map, function(val) {
    sum += val;
    count++;
  }, k);
  // Prevent divide by 0
  return sum / (count || 1);
}

function median(obj, map, k) {
  var result = [], middle, len;
  enumerateWithMapping(obj, map, function(val, reset) {
    result.push(val);
  }, k);
  len = result.length;
  if (!len) return 0;
  result.sort(function(a, b) {
    return a - b;
  });
  middle = trunc(len / 2);
  return len % 2 ? result[middle] : (result[middle - 1] + result[middle]) / 2;
}

function getMinOrMax(obj, map, all, max, k) {
  var result = [], edge;
  enumerateWithMapping(obj, map, function(val, key) {
    if (isUndefined(val)) {
      throw new TypeError('Cannot compare with undefined');
    }
    if (val === edge) {
      result.push(key);
    } else if (isUndefined(edge) || (max && val > edge) || (!max && val < edge)) {
      result = [key];
      edge = val;
    }
  }, k);
  return getReducedMinMaxResult(result, obj, all, k);
}

function getLeastOrMost(obj, map, all, most, k) {
  var groupedByValue = {}, result, minMaxResult;
  enumerateWithMapping(obj, map, function(val, key) {
    var str = stringify(val);
    var arr = groupedByValue[str] || [];
    arr.push(key);
    groupedByValue[str] = arr;
  }, k);
  minMaxResult = getMinOrMax(groupedByValue, 'length', all, most, true);
  if (all) {
    var result = [];
    // Flatten result
    iterateOverObject(minMaxResult, function(key, val) {
      result = result.concat(val);
    });
  } else {
    result = groupedByValue[minMaxResult];
  }
  return getReducedMinMaxResult(result, obj, all, k);
}


// Support

function getReducedMinMaxResult(result, obj, all, k) {
  if (k && all) {
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

function enumerateWithMapping(obj, map, fn, k) {
  iterateOverObject(obj, function(key, val) {
    if (!k && !isArrayIndex(key)) {
      return;
    }
    var args = k ? [key, val, obj] : [val, +key, obj];
    var mapped = mapWithShortcuts(val, map, obj, args);
    fn(mapped, k ? key : val);
  });
}

/***
 * @namespace Array
 *
 ***/

// Flag allowing native array methods to be enhanced
var ARRAY_ENHANCEMENTS_FLAG = 'enhanceArray';

// Enhanced Natives
var enhancedMap       = wrapMapWithShortcuts(),
    enhancedFind      = wrapNativeWithMatcher('find'),
    enhancedSome      = wrapNativeWithMatcher('some'),
    enhancedEvery     = wrapNativeWithMatcher('every'),
    enhancedFilter    = wrapNativeWithMatcher('filter'),
    enhancedFindIndex = wrapNativeWithMatcher('findIndex');

function arrayEach(arr, fn, startIndex, loop) {
  var index, i, length = +arr.length;
  if (startIndex < 0) startIndex = max(0, arr.length + startIndex);
  i = isNaN(startIndex) ? 0 : startIndex;
  if (loop === true) {
    length += i;
  }
  while(i < length) {
    index = i % arr.length;
    if (!(index in arr)) {
      return iterateOverSparseArray(arr, fn, i, loop);
    } else if (fn.call(arr, arr[index], index, arr) === false) {
      break;
    }
    i++;
  }
  return arr;
}

function arrayFindFrom(arr, f, startIndex, loop, all, findIndex) {
  var result = [], matcher;
  if (arr.length > 0) {
    matcher = getMatcher(f);
    arrayEach(arr, function(el, i) {
      if (matcher.call(arr, el, i, arr)) {
        result.push(findIndex ? i : el);
        return all;
      }
    }, startIndex, loop);
  }
  return all ? result : result[0];
}

function arrayNone(arr, f, context, argLen) {
  return !enhancedSome(arr, f, context, argLen);
}

function arrayCount(arr, f, context) {
  if (isUndefined(f)) return arr.length;
  return enhancedFilter(arr, f).length;
}

function arrayRemove(arr, args) {
  for (var i = 0; i < args.length; i++) {
    var j = 0, matcher = getMatcher(args[i]);
    while(j < arr.length) {
      if (matcher(arr[j], j, arr)) {
        arr.splice(j, 1);
      } else {
        j++;
      }
    }
  }
  return arr;
}

// Support

function wrapMapWithShortcuts() {
  var nativeMap = Array.prototype.map;
  return function(arr, map, context) {
    var args = [];
    if (isFunction(map)) {
      args.push(map);
    } else if (map) {
      args.push(function(el, index) {
        return mapWithShortcuts(el, map, context, [el, index, arr]);
      });
    }
    args.push(context);
    return nativeMap.apply(arr, args);
  }
}

function wrapNativeWithMatcher(name) {
  var nativeFn = Array.prototype[name];
  return function(arr, f, context, argLen) {
    var args = [], matcher;
    if (argLen === 0) {
      throw new TypeError('First argument required');
    }
    if (isFunction(f)) {
      args.push(f);
    } else {
      matcher = getMatcher(f);
      args.push(function(el, index, arr) {
        return matcher(el, index, arr);
      });
    }
    args.push(context);
    return nativeFn.apply(arr, args);
  }
}

defineInstance(sugarArray, {

  /***
   * @method map(<map>, [context])
   * @returns Array
   * @short Maps the array to another array whose elements are those returned by <map>.
   * @extra [context] is the %this% object. Sugar enhances this method to accept a string for <map>, which is a shortcut for a function that gets that property (or invokes a function) on each element. This string allows `deep mapping`.
   * @polyfill es5
   * @callback
   *
   *   el  The element of the current iteration.
   *   i   The index of the current iteration.
   *   arr A reference to the array.
   *
   * @example
   *
   *   [1,2,3].map(function(n) {
   *     return n * 3;
   *   });                                  -> [3,6,9]
   *   ['one','two','three'].map(function(n) {
   *     return n.length;
   *   });                                  -> [3,3,5]
   *   ['one','two','three'].map('length')  -> [3,3,5]
   *
   ***/
  'map': fixArgumentLength(enhancedMap),

  /***
   * @method every(<f>, [context])
   * @returns Boolean
   * @short Returns true if <f> is true for all elements of the array.
   * @extra [context] is the %this% object. Sugar enhances this method with `matching shortcuts`.
   * @polyfill es5
   * @alias all
   * @example
   *
   +   ['a','a','a'].every(function(n) {
   *     return n == 'a';
   *   });
   *   ['a','a','a'].every('a')   -> true
   *   [{a:2},{a:2}].every({a:2}) -> true
   ***/
  'every': fixArgumentLength(enhancedEvery),

  /***
   * @method some(<f>, [context])
   * @returns Boolean
   * @short Returns true if <f> is true for any element in the array.
   * @extra [context] is the %this% object. Sugar enhances this method with `matching shortcuts`.
   * @polyfill es5
   * @alias any
   * @example
   *
   +   ['a','b','c'].some(function(n) {
   *     return n == 'a';
   *   });
   +   ['a','b','c'].some(function(n) {
   *     return n == 'd';
   *   });
   *   ['a','b','c'].some('a')   -> true
   *   [{a:2},{b:5}].some({a:2}) -> true
   ***/
  'some': fixArgumentLength(enhancedSome),

  /***
   * @method filter(<f>, [context])
   * @returns Array
   * @short Returns any elements in the array for which <f> is true.
   * @extra [context] is the %this% object. Sugar enhances this method with `matching shortcuts`.
   * @polyfill es5
   * @example
   *
   +   [1,2,3].filter(function(n) {
   *     return n > 1;
   *   });
   *   [1,2,2,4].filter(2) -> 2
   *
   ***/
  'filter': fixArgumentLength(enhancedFilter),

  /***
   * @method find(<f>, [context])
   * @returns Mixed
   * @short Returns the first element in the array for which <f> is true.
   * @extra [context] is the %this% object. Sugar enhances this method with `matching shortcuts`.
   * @polyfill es6
   * @example
   *
   *   [{a:1,b:2},{a:1,b:3},{a:1,b:4}].find(function(n) {
   *     return n['a'] == 1;
   *   });                                  -> {a:1,b:3}
   *   ['cuba','japan','canada'].find(/^c/) -> 'cuba'
   *
   ***/
  'find': fixArgumentLength(enhancedFind),

  /***
   * @method findIndex(<f>, [context])
   * @returns Number
   * @short Returns the index of the first element in the array for which <f> is true, or -1 if none.
   * @extra [context] is the %this% object. Sugar enhances this method with `matching shortcuts`.
   * @polyfill es6
   * @example
   *
   *   [1,2,3,4].findIndex(function(n) {
   *     return n % 2 == 0;
   *   }); -> 1
   *   [1,2,3,4].findIndex(3);               -> 2
   *   ['one','two','three'].findIndex(/t/); -> 1
   *
   ***/
  'findIndex': fixArgumentLength(enhancedFindIndex)

}, [ENHANCEMENTS_FLAG, ARRAY_ENHANCEMENTS_FLAG]);

/***
 * @method all()
 * @alias every
 *
 ***/
alias(sugarArray, 'all', 'every');

/***
 * @method any()
 * @alias some
 *
 ***/
alias(sugarArray, 'any', 'some');


defineInstance(sugarArray, {

  /***
   * @method none(<f>)
   * @returns Boolean
   * @short Returns true if none of the elements in the array match <f>.
   * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. This method implements `matching shortcuts`.
   * @example
   *
   *   [1,2,3].none(5)         -> true
   *   ['a','b','c'].none(/b/) -> false
   *   [{a:1},{b:2}].none(function(n) {
   *     return n['a'] > 1;
   *   });                     -> true
   *
   ***/
  'none': fixArgumentLength(arrayNone),

  /***
   * @method isEmpty()
   * @returns Boolean
   * @short Returns true if the array has a length of zero.
   * @example
   *
   *   [].isEmpty()    -> true
   *   ['a'].isEmpty() -> false
   *
   ***/
  'isEmpty': function(arr) {
    return arr.length === 0;
  },

  /***
   * @method findFrom(<f>, [index] = 0, [loop] = false)
   * @returns Array
   * @short Returns any element that matches <f>, beginning from [index].
   * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Will continue from index = 0 if [loop] is true. This method implements `matching shortcuts`.
   * @example
   *
   *   ['cuba','japan','canada'].findFrom(/^c/, 2) -> 'canada'
   *
   ***/
  'findFrom': function(arr, f, index, loop) {
    return arrayFindFrom(arr, f, index, loop);
  },

  /***
   * @method filterFrom(<f>, [index] = 0, [loop] = false)
   * @returns Array
   * @short Returns any elements that match <f>, beginning from [index].
   * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Will continue from index = 0 if [loop] is true. This method implements `matching shortcuts`.
   * @example
   *
   *   ['cuba','canada','chile'].filterFrom(/^c/, 2)       -> ['canada','chile']
   *   ['cuba','canada','chile'].filterFrom(/^c/, 2, true) -> ['canada','chile','cuba']
   *
   ***/
  'filterFrom': function(arr, f, index, loop) {
    return arrayFindFrom(arr, f, index, loop, true);
  },

  /***
   * @method findIndexFrom(<f>, [index] = 0, [loop] = false)
   * @returns Array
   * @short Returns the index of any element that matches <f>, beginning from [index].
   * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Will continue from index = 0 if [loop] is true. This method implements `matching shortcuts`.
   * @example
   *
   *   ['cuba','japan','canada'].findIndexFrom(/^c/, 2) -> 2
   *
   ***/
  'findIndexFrom': function(arr, f, index, loop) {
    var index = arrayFindFrom(arr, f, index, loop, false, true);
    return isUndefined(index) ? -1 : index;
  },

  /***
   * @method each(<fn>, [index] = 0, [loop] = false)
   * @returns Array
   * @short Runs <fn> against each element in the array. Enhanced version of %Array#forEach%.
   * @extra If <fn> returns %false% at any time it will break out of the loop. If [index] is passed, <fn> will begin at that index and work its way to the end. If [loop] is true, it will then start over from the beginning of the array and continue until it reaches [index] - 1.
   * @alias forEachFrom
   * @callback
   *
   *   el  The element of the current iteration.
   *   i   The index of the current iteration.
   *   arr A reference to the array.
   *
   * @example
   *
   *   [1,2,3,4].each(function(n) {
   *     // Called 4 times: 1, 2, 3, 4
   *   });
   *   [1,2,3,4].each(function(n) {
   *     // Called 4 times: 3, 4, 1, 2
   *   }, 2, true);
   *
   ***/
  'each': function(arr, fn, index, loop) {
    return arrayEach(arr, fn, index, loop);
  },

  /***
   * @method min([map], [all] = false)
   * @returns Mixed
   * @short Returns the element in the array with the lowest value.
   * @extra [map] may be a function mapping the value to be checked or a string acting as a shortcut. If [all] is true, will return all min values in an array.
   * @example
   *
   *   [1,2,3].min()                          -> 1
   *   ['fee','fo','fum'].min('length')       -> 'fo'
   *   ['fee','fo','fum'].min('length', true) -> ['fo']
   *   ['fee','fo','fum'].min(function(n) {
   *     return n.length;
   *   });                              -> ['fo']
   *   [{a:3,a:2}].min(function(n) {
   *     return n['a'];
   *   });                              -> [{a:2}]
   *
   ***/
  'min': function(arr, map, all) {
    return getMinOrMax(arr, map, all);
  },

  /***
   * @method max([map], [all] = false)
   * @returns Mixed
   * @short Returns the element in the array with the greatest value.
   * @extra [map] may be a function mapping the value to be checked or a string acting as a shortcut. If [all] is true, will return all max values in an array.
   * @example
   *
   *   [1,2,3].max()                          -> 3
   *   ['fee','fo','fum'].max('length')       -> 'fee'
   *   ['fee','fo','fum'].max('length', true) -> ['fee']
   *   [{a:3,a:2}].max(function(n) {
   *     return n['a'];
   *   });                              -> {a:3}
   *
   ***/
  'max': function(arr, map, all) {
    return getMinOrMax(arr, map, all, true);
  },

  /***
   * @method least([map], [all] = false)
   * @returns Array
   * @short Returns the elements in the array with the least commonly occuring value.
   * @extra [map] may be a function mapping the value to be checked or a string acting as a shortcut. If [all] is true, will return multiple values in an array.
   * @example
   *
   *   [3,2,2].least() -> 3
   *   ['fe','fo','fum'].least('length', true) -> ['fum']
   *   [{age:35,name:'ken'},{age:12,name:'bob'},{age:12,name:'ted'}].least(function(n) {
   *     return n.age;
   *   }, true); -> [{age:35, name:'ken'}]
   *
   ***/
  'least': function(arr, map, all) {
    return getLeastOrMost(arr, map, all);
  },

  /***
   * @method most([map], [all] = false)
   * @returns Array
   * @short Returns the elements in the array with the most commonly occuring value.
   * @extra [map] may be a function mapping the value to be checked or a string acting as a shortcut. If [all] is true, will return multiple values in an array.
   * @example
   *
   *   [3,2,2].most(2) -> 2
   *   ['fe','fo','fum'].most('length', true) -> ['fe','fo']
   *   [{age:35,name:'ken'},{age:12,name:'bob'},{age:12,name:'ted'}].most(function(n) {
   *     return n.age;
   *   }, true); -> [{age:12,name:'bob'},{age:12,name:'ted'}]
   *
   ***/
  'most': function(arr, map, all) {
    return getLeastOrMost(arr, map, all, true);
  },

  /***
   * @method count(<f>)
   * @returns Number
   * @short Counts all elements in the array that match <f>.
   * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. This method implements `matching shortcuts`.
   * @example
   *
   *   ['a','b','a'].count('a') -> 2
   *   ['a','b','c'].count(/b/) -> 1
   *   [{a:1},{b:2}].count(function(n) {
   *     return n['a'] > 1;
   *   });                      -> 0
   *
   ***/
  'count': function(arr, f) {
    return arrayCount(arr, f);
  },

  /***
   * @method sum([map])
   * @returns Number
   * @short Sums all values in the array.
   * @extra [map] may be a function mapping the value to be summed or a string acting as a shortcut.
   * @example
   *
   *   [1,2,2].sum() -> 5
   *   [{age:35},{age:13}].sum(function(n) {
   *     return n.age;
   *   }); -> 48
   *   [{age:35},{age:13}].sum('age') -> 48
   *
   ***/
  'sum': function(arr, map) {
    return sum(arr, map);
  },

  /***
   * @method average([map])
   * @returns Number
   * @short Gets the mean average for all values in the array.
   * @extra [map] may be a function mapping the value to be averaged or a string acting as a shortcut.
   * @example
   *
   *   [1,2,3].average() -> 2
   *   [{age:35},{age:11}].average(function(n) {
   *     return n.age;
   *   }); -> 23
   *   [{age:35},{age:11}].average('age') -> 23
   *
   ***/
  'average': function(arr, map) {
    return average(arr, map);
  },

  /***
   * @method median([map])
   * @returns Number
   * @short Gets the median average for all values in the array.
   * @extra [map] may be a function mapping the value to be averaged or a string acting as a shortcut.
   * @example
   *
   *   [1,2,2].median() -> 2
   *   [{a:1},{a:2},{a:2}].median('a') -> 2
   *
   ***/
  'median': function(arr, map) {
    return median(arr, map);
  }

});

/***
 * @method forEachFrom()
 * @alias each
 *
 ***/
alias(sugarArray, 'forEachFrom', 'each');



defineInstanceWithArguments(sugarArray, {

  /***
   * @method remove([f1], [f2], ...)
   * @returns Array
   * @short Removes any element in the array that matches [f1], [f2], etc.
   * @extra Will match a string, number, array, object, or alternately test against a function or regex. This method will change the array! Use %exclude% for a non-destructive alias. This method implements `matching shortcuts`.
   * @example
   *
   *   [1,2,3].remove(3)         -> [1,2]
   *   ['a','b','c'].remove(/b/) -> ['a','c']
   *   [{a:1},{b:2}].remove(function(n) {
   *     return n['a'] == 1;
   *   });                       -> [{b:2}]
   *
   ***/
  'remove': function(arr, args) {
    return arrayRemove(arr, args);
  },

  /***
   * @method exclude([f1], [f2], ...)
   * @returns Array
   * @short Removes any element in the array that matches [f1], [f2], etc.
   * @extra This is a non-destructive alias for %remove%. It will not change the original array. This method implements `matching shortcuts`.
   * @example
   *
   *   [1,2,3].exclude(3)         -> [1,2]
   *   ['a','b','c'].exclude(/b/) -> ['a','c']
   *   [{a:1},{b:2}].exclude(function(n) {
   *     return n['a'] == 1;
   *   });                       -> [{b:2}]
   *
   ***/
  'exclude': function(arr, args) {
    // TODO don't use clone
    // TODO remove multiple args
    // TODO fix docs
    return arrayRemove(arrayClone(arr), args);
  }

});


/***
 * @namespace Object
 *
 ***/


// Object matchers
var objectSome  = wrapObjectMatcher('some'),
    objectFind  = wrapObjectMatcher('find'),
    objectEvery = wrapObjectMatcher('every');


function objectSize(obj) {
  return keysWithObjectCoercion(obj).length;
}

function objectEach(obj, fn) {
  assertCallable(fn);
  iterateOverObject(obj, fn);
  return obj;
}

function objectMap(obj, map) {
  var result = {};
  iterateOverObject(obj, function(key, val) {
    result[key] = mapWithShortcuts(val, map, obj, [key, val, obj]);
  });
  return result;
}

function objectNone(obj, f) {
  return !objectSome(obj, f);
}

function objectFilter(obj, f) {
  var matcher = getMatcher(f, true), result = {};
  iterateOverObject(obj, function(key, val) {
    if (matcher(val, key, obj)) {
      result[key] = val;
    }
  });
  return result;
}

function objectCount(obj, f) {
  var matcher = getMatcher(f, true), count = 0;
  iterateOverObject(obj, function(key, val) {
    if (matcher(val, key, obj)) {
      count++;
    }
  });
  return count;
}

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

// Support

function keysWithObjectCoercion(obj) {
  return getKeys(coercePrimitiveToObject(obj));
}

function wrapObjectMatcher(name, wrap) {
  var nativeFn = Array.prototype[name];
  return function(obj, f, context) {
    var matcher = getMatcher(f, true);
    return nativeFn.call(getKeys(obj), function(key, i) {
      return matcher(obj[key], key, obj);
    });
  }
}

// Object Select/Reject

function objectSelect(obj, f) {
  return selectFromObject(obj, f, true);
}

function objectReject(obj, f) {
  return selectFromObject(obj, f, false);
}

function selectFromObject(obj, f, select) {
  var match, result = obj instanceof Hash ? new Hash : {};
  f = [].concat(f);
  iterateOverObject(obj, function(key, value) {
    match = false;
    for (var i = 0; i < f.length; i++) {
      if (matchInObject(f[i], key, value)) {
        match = true;
      }
    }
    if (match === select) {
      result[key] = value;
    }
  });
  return result;
}

function matchInObject(match, key, value) {
  if (isRegExp(match)) {
    return match.test(key);
  } else if (isObjectType(match)) {
    return key in match;
  } else {
    return key === String(match);
  }
}


defineInstanceAndStatic(sugarObject, {

  /***
   * @method Object.select(<obj>, <find>)
   * @returns Object
   * @short Builds a new object containing the keys specified in <find>.
   * @extra When <find> is a string, a single key will be selected. Arrays or objects will match multiple keys, and a regex will match keys by regex. %select% is available as an instance method on %extended objects%.
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
   * @extra When <find> is a string, a single key will be rejected. Arrays or objects will match multiple keys, and a regex will match keys by regex. %reject% is available as an instance method on %extended objects%.
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
   * @method Object.map(<obj>, <map>)
   * @returns Object
   * @short Maps the object to another object whose properties are those returned by <map>.
   * @extra <map> can also be a string, which is a shortcut for a function that gets that property (or invokes a function) on each element. This string allows `deep mapping`.
   * @callback
   *
   *   key The key of the current iteration.
   *   val The value of the current iteration.
   *   obj A reference to the object.
   *
   * @example
   *
   *   Object.map({ foo: 'bar' }, function(lhs, rhs) {
   *     return 'ha';
   *   }); -> Returns { foo: 'ha' }
   *
   ***/
  'map': function(obj, map) {
    return objectMap(obj, map);
  },

  /***
   * @method Object.each(<obj>, <fn>)
   * @returns Object
   * @short Runs <fn> against each property in the object.
   * @extra Does not iterate over inherited properties. If <fn> returns `false` at any time it will break out of the loop. Returns <obj>.
   * @callback
   *
   *   key The key of the current iteration.
   *   val The value of the current iteration.
   *   obj A reference to the object.
   *
   * @example
   *
   *   Object.each({ foo: 'bar' }, function(k, v) {
   *     console.log('key is ', k, ' and value is ', v);
   *   });
   *
   ***/
  'each': function(obj, fn) {
    return objectEach(obj, fn);
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
   * @method Object.sum(<obj>, [map])
   * @returns Number
   * @short Sums all properties in the object.
   * @extra [map] may be a function mapping the value to be summed or a string acting as a shortcut.
   * @callback
   *
   *   key The key of the current iteration.
   *   val The value of the current iteration.
   *   obj A reference to the object.
   *
   * @example
   *
   *   Object.sum({a:35,b:13}); -> 48
   *
   ***/
  'sum': function(obj, map) {
    return sum(obj, map, true);
  },

  /***
   * @method Object.average(<obj>, [map])
   * @returns Number
   * @short Gets the mean average of all properties in the object.
   * @extra [map] may be a function mapping the value to be averaged or a string acting as a shortcut.
   * @callback
   *
   *   key The key of the current iteration.
   *   val The value of the current iteration.
   *   obj A reference to the object.
   *
   * @example
   *
   *   Object.average({a:35,b:11}); -> 23
   *
   ***/
  'average': function(obj, map) {
    return average(obj, map, true);
  },

  /***
   * @method Object.median(<obj>, [map])
   * @returns Number
   * @short Gets the median average of all properties in the object.
   * @extra [map] may be a function mapping the value to be averaged or a string acting as a shortcut.
   * @callback
   *
   *   key The key of the current iteration.
   *   val The value of the current iteration.
   *   obj A reference to the object.
   *
   * @example
   *
   *   Object.median({a:1,b:2,c:2}) -> 2
   *
   ***/
  'median': function(obj, map) {
    return median(obj, map, true);
  },

  /***
   * @method Object.min(<obj>, [map], [all] = false)
   * @returns Mixed
   * @short Returns the key of the property in the object with the lowest value.
   * @extra If [all] is true, will return an object with all properties in the object with the lowest value. [map] may be a function mapping the value to be checked or a string acting as a shortcut.
   * @callback
   *
   *   key The key of the current iteration.
   *   val The value of the current iteration.
   *   obj A reference to the object.
   *
   * @example
   *
   *   Object.min({a:1,b:2,c:3})                    -> 'a'
   *   Object.min({a:'aaa',b:'bb',c:'c'}, 'length') -> 'c'
   *   Object.min({a:1,b:1,c:3}, null, true)        -> {a:1,b:1}
   *
   ***/
  'min': function(obj, map, all) {
    return getMinOrMax(obj, map, all, false, true);
  },

  /***
   * @method Object.max(<obj>, [map], [all] = false)
   * @returns Mixed
   * @short Returns the key of the property in the object with the highest value.
   * @extra If [all] is true, will return an object with all properties in the object with the highest value. [map] may be a function mapping the value to be checked or a string acting as a shortcut.
   * @callback
   *
   *   key The key of the current iteration.
   *   val The value of the current iteration.
   *   obj A reference to the object.
   *
   * @example
   *
   *   Object.max({a:1,b:2,c:3})                    -> 'c'
   *   Object.max({a:'aaa',b:'bb',c:'c'}, 'length') -> 'a'
   *   Object.max({a:1,b:3,c:3}, null, true)        -> {b:3,c:3}
   *
   ***/
  'max': function(obj, map, all) {
    return getMinOrMax(obj, map, all, true, true);
  },

  /***
   * @method Object.least(<obj>, [map], [all] = false)
   * @returns Mixed
   * @short Returns the key of the property in the object with the least commonly occuring value.
   * @extra If [all] is true, will return an object with all properties in the object with the least common value. [map] may be a function mapping the value to be checked or a string acting as a shortcut.
   * @callback
   *
   *   key The key of the current iteration.
   *   val The value of the current iteration.
   *   obj A reference to the object.
   *
   * @example
   *
   *   Object.least({a:1,b:3,c:3})                   -> 'a'
   *   Object.least({a:'aa',b:'bb',c:'c'}, 'length') -> 'c'
   *   Object.least({a:1,b:3,c:3}, null, true)       -> {a:1}
   *
   ***/
  'least': function(obj, map, all) {
    return getLeastOrMost(obj, map, all, false, true);
  },

  /***
   * @method Object.most(<obj>, [map], [all] = false)
   * @returns Mixed
   * @short Returns the key of the property in the object with the most commonly occuring value.
   * @extra If [all] is true, will return an object with all properties in the object with the most common value. [map] may be a function mapping the value to be checked or a string acting as a shortcut.
   * @callback
   *
   *   key The key of the current iteration.
   *   val The value of the current iteration.
   *   obj A reference to the object.
   *
   * @example
   *
   *   Object.most({a:1,b:3,c:3})                   -> 'b'
   *   Object.most({a:'aa',b:'bb',c:'c'}, 'length') -> 'a'
   *   Object.most({a:1,b:3,c:3}, null, true)       -> {b:3,c:3}
   *
   ***/
  'most': function(obj, map, all) {
    return getLeastOrMost(obj, map, all, true, true);
  },

  /***
   * @method Object.some(<obj>, <f>)
   * @returns Boolean
   * @short Returns true if <f> is true for any property in the object.
   * @extra This method implements `matching shortcuts`.
   * @alias any
   * @example
   *
   *   Object.some({a:1,b:2}, function(key, val) {
   *     return val == 1;
   *   }); -> true
   *   Object.some({a:1,b:2}, 1); -> true
   *
   ***/
  'some': objectSome,

  /***
   * @method Object.every(<obj>, <f>)
   * @returns Boolean
   * @short Returns true if <f> is true for all properties in the object.
   * @extra This method implements `matching shortcuts`.
   * @alias all
   * @example
   *
   *   Object.every({a:1,b:2}, function(key, val) {
   *     return val > 0;
   *   }); -> true
   *   Object.every({a:'a',b:'b'}, /[a-z]/); -> true
   *
   ***/
  'every': objectEvery,

  /***
   * @method Object.find(<obj>, <f>)
   * @returns Boolean
   * @short Returns the first key in the object for which <f> is true.
   * @extra This method implements `matching shortcuts`. Note that "first" is implementation-dependent. If order is important an array should be used instead.
   * @example
   *
   *   Object.find({a:1,b:2}, function(key, val) {
   *     return val == 2;
   *   }); -> 'b'
   *   Object.find({a:'a',b:'b'}, /[a-z]/); -> 'a'
   *
   ***/
  'find': objectFind,

  /***
   * @method Object.filter(<obj>, <f>)
   * @returns Array
   * @short Returns an object with all properties in <obj> for which <f> is true.
   * @extra This method implements `matching shortcuts`.
   * @example
   *
   *   Object.filter({a:1,b:2}, function(key, val) {
   *     return val == 1;
   *   }); -> {a:1}
   *   Object.filter({a:'a',b:'b',z:'z'}, /[a-f]/); -> {a:'a',b:'b'}
   *
   ***/
  'filter': function(obj, f) {
    return objectFilter(obj, f);
  },

  /***
   * @method Object.count(<obj>, <f>)
   * @returns Number
   * @short Counts all properties in the object that match <f>.
   * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. This method implements `matching shortcuts`.
   * @example
   *
   *   Object.count({a:'a',b:'b',c:'a'}, 'a') -> 2
   *   Object.count({a:1,b:2}].count(function(key, val) {
   *     return val > 1;
   *   }); -> 1
   *
   ***/
  'count': function(obj, f) {
    return objectCount(obj, f);
  },

  /***
   * @method Object.none(<obj>, <f>)
   * @returns Boolean
   * @short Returns true if none of the properties in the object match <f>.
   * @extra This method implements `matching shortcuts`.
   * @example
   *
   *   Object.none({a:1,b:2}, function(key, val) {
   *     return val == 1;
   *   }); -> false
   *   Object.none({a:1,b:2}, 3); -> true
   *
   ***/
  'none': function(obj, f) {
    return objectNone(obj, f);
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
  }

});

/***
 * @method Object.all()
 * @alias Object.every
 *
 ***/
alias(sugarObject, 'all', 'every');

/***
 * @method Object.any()
 * @alias Object.some
 *
 ***/
alias(sugarObject, 'any', 'some');


function buildHashEnumerable() {

  var methods = [
    'select','reject','remove','exclude','isEmpty','size','each',
    'map','some','any','every','all','none','find','filter',
    'count','sum','average','median',
    'min','max','most','least'
  ];

  forEach(methods, function(name) {
    setProperty(Hash.prototype, name, sugarObject[name].instance);
  });

}

buildHashEnumerable();
