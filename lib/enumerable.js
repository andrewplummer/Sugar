'use strict';

/***
 * @module Enumerable
 * @description Counting, mapping, and finding methods on both arrays and objects.
 *
 ***/

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
  enumerateWithMapping(obj, map, function(val) {
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
    result = [];
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

function arrayEach(arr, fn, fromIndex, loop) {
  var index, i, length = +arr.length;
  if (fromIndex < 0) fromIndex = max(0, arr.length + fromIndex);
  i = isNaN(fromIndex) ? 0 : fromIndex;
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

function arrayFindFrom(arr, f, fromIndex, loop, all, findIndex) {
  var result = [], matcher;
  if (arr.length > 0) {
    matcher = getMatcher(f);
    arrayEach(arr, function(el, i) {
      if (matcher.call(arr, el, i, arr)) {
        result.push(findIndex ? i : el);
        return all;
      }
    }, fromIndex, loop);
  }
  return all ? result : result[0];
}

function arrayNone(arr, f, context, argLen) {
  return !enhancedSome(arr, f, context, argLen);
}

function arrayCount(arr, f) {
  if (isUndefined(f)) return arr.length;
  return enhancedFilter(arr, f).length;
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
  };
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
  };
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
   * @method findFrom(<f>, [fromIndex] = 0, [loop] = false)
   * @returns Array
   * @short Returns any element that matches <f>, beginning from [fromIndex].
   * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Will continue from index = 0 if [loop] is true. This method implements `matching shortcuts`.
   * @example
   *
   *   ['cuba','japan','canada'].findFrom(/^c/, 2) -> 'canada'
   *
   ***/
  'findFrom': function(arr, f, fromIndex, loop) {
    return arrayFindFrom(arr, f, fromIndex, loop);
  },

  /***
   * @method filterFrom(<f>, [fromIndex] = 0, [loop] = false)
   * @returns Array
   * @short Returns any elements that match <f>, beginning from [fromIndex].
   * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Will continue from index = 0 if [loop] is true. This method implements `matching shortcuts`.
   * @example
   *
   *   ['cuba','canada','chile'].filterFrom(/^c/, 2)       -> ['canada','chile']
   *   ['cuba','canada','chile'].filterFrom(/^c/, 2, true) -> ['canada','chile','cuba']
   *
   ***/
  'filterFrom': function(arr, f, fromIndex, loop) {
    return arrayFindFrom(arr, f, fromIndex, loop, true);
  },

  /***
   * @method findIndexFrom(<f>, [fromIndex] = 0, [loop] = false)
   * @returns Array
   * @short Returns the index of any element that matches <f>, beginning from [fromIndex].
   * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Will continue from index = 0 if [loop] is true. This method implements `matching shortcuts`.
   * @example
   *
   *   ['cuba','japan','canada'].findIndexFrom(/^c/, 2) -> 2
   *
   ***/
  'findIndexFrom': function(arr, f, fromIndex, loop) {
    var index = arrayFindFrom(arr, f, fromIndex, loop, false, true);
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



/***
 * @namespace Object
 *
 ***/


// Object matchers
var objectSome  = wrapObjectMatcher('some'),
    objectFind  = wrapObjectMatcher('find'),
    objectEvery = wrapObjectMatcher('every');


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

function objectReduce(obj, fn, acc) {
  var init = isDefined(acc);
  iterateOverObject(obj, function(key, val) {
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

// Support

function wrapObjectMatcher(name) {
  var nativeFn = Array.prototype[name];
  return function(obj, f) {
    var matcher = getMatcher(f, true);
    return nativeFn.call(getKeys(obj), function(key) {
      return matcher(obj[key], key, obj);
    });
  };
}

defineInstanceAndStatic(sugarObject, {

  /***
   * @method Object.map(<obj>, <map>)
   * @returns Object
   * @short Maps the object to another object whose properties are those returned by <map>.
   * @extra <map> can also be a string, which is a shortcut for a function that gets that property (or invokes a function) on each element. This string allows `deep mapping`.
   * @callback
   *
   *   key The key of the current property.
   *   val The value of the current property.
   *   obj A reference to <obj>.
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
   * @method Object.reduce(<obj>, <fn>, [init])
   * @returns Mixed
   * @short Reduces the object to a single result.
   * @extra This operation is sometimes called "accumulation", as it takes the result of the last iteration of <fn> and passes it as the first argument to the next iteration, "accumulating" that value as it goes. The return value of this method will be the return value of the final iteration of <fn>. If [init] is passed, it will be the initial "accumulator" (the first argument). If [init] is not passed, then a property of the object will be used instead and <fn> will not be called for that property. Note that object properties have no order, and this may lead to bugs (for example if performing division or subtraction operations on a value). If order is important, use an array instead!
   *
   * @callback
   *
   *   acc The "accumulator", either [init], the result of the last iteration of <fn>, or a property of <obj>.
   *   val The value of the current property called for <fn>.
   *   key The key of the current property called for <fn>.
   *   obj A reference to <obj>.
   *
   * @example
   *
   *   Object.reduce({a:2,b:4}, function(a, b, bKey, obj) {
   *     return a * b;
   *   }); -> 8
   *
   *   Object.reduce({a:2,b:4}, function(a, b, bKey, obj) {
   *     return a * b;
   *   }, 10); -> 80
   *
   *
   ***/
  'reduce': function(obj, fn, init) {
    return objectReduce(obj, fn, init);
  },

  /***ds
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
