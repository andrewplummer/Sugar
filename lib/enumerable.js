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
    // IE7 will throw errors on non-numbers!
    return (a || 0) - (b || 0);
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
    var arr = getOwn(groupedByValue, str) || [];
    arr.push(key);
    groupedByValue[str] = arr;
  }, k);
  minMaxResult = getMinOrMax(groupedByValue, 'length', all, most, true);
  if (all) {
    result = [];
    // Flatten result
    forEachProperty(minMaxResult, function(key, val) {
      result = result.concat(val);
    });
  } else {
    result = getOwn(groupedByValue, minMaxResult);
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
  forEachProperty(obj, function(key, val) {
    if (!k && !isArrayIndex(key)) {
      return;
    }
    var args = k ? [key, val, obj] : [val, +key, obj];
    var mapped = mapWithShortcuts(val, map, obj, args);
    fn(mapped, k ? key : val);
  });
}

/*** @namespace Array ***/

// Flag allowing native array methods to be enhanced
var ARRAY_ENHANCEMENTS_FLAG = 'enhanceArray';

// Enhanced map function
var enhancedMap = wrapMapWithShortcuts();

// Enhanced matcher methods
var enhancedFind      = wrapNativeWithMatcher('find'),
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
   * @method find(<search>, [context])
   * @returns Mixed
   * @polyfill ES6
   * @short Returns the first element in the array that matches <search>.
   * @extra Implements `enhanced matching`.
   *
   * @callback search
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   users.find(function(user) {
   *     return user.name = 'Harry';
   *   }); -> harry!
   *
   *   users.find({ name: 'Harry' }); -> harry!
   *   users.find({ name: /^[A-H]/ });  -> First user with name starting with A-H
   *   users.find({ titles: ['Ms', 'Dr'] }); -> not harry!
   *
   *
   ***/
  'find': fixArgumentLength(enhancedFind),

  /***
   * @method map(<map>, [context])
   * @returns Array
   * @polyfill ES5
   * @short Maps the array to another array whose elements are the values
   *        returned by the <map> callback.
   * @extra [context] is the `this` object. Sugar enhances this method to accept
   *        a string for <map>, which is a shortcut for a function that gets
   *        a property or invokes a function on each element.
   *        Supports `deep properties`.
   *
   * @callback map
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
   ***/
  'map': fixArgumentLength(enhancedMap),

  /***
   * @method every(<search>, [context])
   * @returns Boolean
   * @polyfill ES5
   * @short Returns true if <search> is true for all elements of the array.
   * @extra [context] is the `this` object. Implements `enhanced matching`.
   *
   * @callback search
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
   ***/
  'every': fixArgumentLength(enhancedEvery),

  /***
   * @method some(<search>, [context])
   * @returns Boolean
   * @polyfill ES5
   * @short Returns true if <search> is true for any element in the array.
   * @extra [context] is the `this` object. Implements `enhanced matching`.
   *
   * @callback search
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
   ***/
  'some': fixArgumentLength(enhancedSome),

  /***
   * @method filter(<search>, [context])
   * @returns Array
   * @polyfill ES5
   * @short Returns any elements in the array that match <search>.
   * @extra [context] is the `this` object. Implements `enhanced matching`.
   *
   * @callback search
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
   ***/
  'filter': fixArgumentLength(enhancedFilter),

  /***
   * @method findIndex(<search>, [context])
   * @returns Number
   * @polyfill ES6
   * @short Returns the index of the first element in the array that matches
   *        <search>, or `-1` if none.
   * @extra [context] is the `this` object. Implements `enhanced matching`.
   *
   * @callback search
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
   * @method none(<search>)
   * @returns Boolean
   * @short Returns true if none of the elements in the array match <search>.
   * @extra Implements `enhanced matching`.
   *
   * @callback search
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
   ***/
  'none': fixArgumentLength(arrayNone),

  /***
   * @method findFrom(<search>, [fromIndex] = 0, [loop] = false)
   * @returns Array
   * @short Returns any element that matches <search>, beginning from [fromIndex].
   * @extra Will continue from `index = 0` if [loop] is true. Implements
   *        `enhanced matching`.
   *
   * @callback search
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   ['cuba','japan','canada'].findFrom(/^c/, 2)       -> 'canada'
   *   ['cuba','japan','canada'].findFrom(/^j/, 2, true) -> 'japan'
   *
   ***/
  'findFrom': function(arr, f, fromIndex, loop) {
    return arrayFindFrom(arr, f, fromIndex, loop);
  },

  /***
   * @method filterFrom(<search>, [fromIndex] = 0, [loop] = false)
   * @returns Array
   * @short Returns any elements that match <search>, beginning from [fromIndex].
   * @extra Will continue from `index = 0` if [loop] is true. Implements
   *        `enhanced matching`.
   *
   * @callback search
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
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
   * @method findIndexFrom(<search>, [fromIndex] = 0, [loop] = false)
   * @returns Array
   * @short Returns the index of any element that matches <search>, starting from [fromIndex].
   * @extra Will continue from `index = 0` if [loop] is true. Implements
   *        `enhanced matching`.
   *
   * @callback search
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
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
   * @method each(<fn>, [fromIndex] = 0, [loop] = false)
   * @returns Array
   * @short Enhanced `forEach`.
   * @extra If <fn> returns `false` at any time it will break out of the loop.
   *        If [fromIndex] is passed, <fn> will begin at that index and work its
   *        way to the end. If [loop] is true, it will then start over from the
   *        beginning of the array and continue until it reaches `fromIndex - 1`.
   *
   * @callback fn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3,4].each(function(n) {
   *     // Called 4 times: 1, 2, 3, 4
   *   });
   *
   *   [1,2,3,4].each(function(n) {
   *     // Called 4 times: 3, 4, 1, 2
   *   }, 2, true);
   *
   *   [1,2,3,4].each(function(n) {
   *     // Called once: 1
   *     return false;
   *   });
   *
   ***/
  'each': function(arr, fn, index, loop) {
    return arrayEach(arr, fn, index, loop);
  },

  /***
   * @method min([map], [all] = false)
   * @returns Mixed
   * @short Returns the element in the array with the lowest value.
   * @extra [map] may be a function mapping the value to be checked or a string
   *        acting as a shortcut. If [all] is true, multiple elements will be
   *        returned. Supports `deep properties`.
   *
   * @callback map
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3].min()                          -> 1
   *   ['fee','fo','fum'].min('length')       -> 'fo'
   *   ['fee','fo','fum'].min('length', true) -> ['fo']
   *   users.min('age')                       -> youngest guy!
   *
   *   ['fee','fo','fum'].min(function(n) {
   *     return n.length;
   *   }, true); -> ['fo']
   *
   *
   ***/
  'min': function(arr, map, all) {
    return getMinOrMax(arr, map, all);
  },

  /***
   * @method max([map], [all] = false)
   * @returns Mixed
   * @short Returns the element in the array with the greatest value.
   * @extra [map] may be a function mapping the value to be checked or a string
   *        acting as a shortcut. If [all] is true, multiple elements will be
   *        returned. Supports `deep properties`.
   *
   * @callback map
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3].max()                          -> 3
   *   ['fee','fo','fum'].max('length')       -> 'fee'
   *   ['fee','fo','fum'].max('length', true) -> ['fee','fum']
   *   users.max('age')                       -> oldest guy!
   *
   *   ['fee','fo','fum'].max(function(n) {
   *     return n.length;
   *   }, true); -> ['fee', 'fum']
   *
   ***/
  'max': function(arr, map, all) {
    return getMinOrMax(arr, map, all, true);
  },

  /***
   * @method least([map], [all] = false)
   * @returns Array
   * @short Returns the elements in the array with the least commonly occuring value.
   * @extra [map] may be a function mapping the value to be checked or a string
   *        acting as a shortcut. If [all] is true, will return multiple values
   *        in an array. Supports `deep properties`.
   *
   * @callback map
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [3,2,2].least() -> 3
   *   ['fe','fo','fum'].least('length', true) -> ['fum']
   *   users.least('profile.type')            -> (user with least commonly occurring type)
   *   users.least('profile.type', true)      -> (users with least commonly occurring type)
   *
   ***/
  'least': function(arr, map, all) {
    return getLeastOrMost(arr, map, all);
  },

  /***
   * @method most([map], [all] = false)
   * @returns Array
   * @short Returns the elements in the array with the most commonly occuring value.
   * @extra [map] may be a function mapping the value to be checked or a string
   *        acting as a shortcut. If [all] is true, will return multiple values
   *        in an array. Supports `deep properties`.
   *
   * @callback map
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [3,2,2].most(2) -> 2
   *   ['fe','fo','fum'].most('length', true) -> ['fe','fo']
   *   users.most('profile.type')            -> (user with most commonly occurring type)
   *   users.most('profile.type', true)      -> (users with most commonly occurring type)
   *
   ***/
  'most': function(arr, map, all) {
    return getLeastOrMost(arr, map, all, true);
  },

  /***
   * @method count(<search>)
   * @returns Number
   * @short Counts all elements in the array that match <search>.
   * @extra Implements `enhanced matching`.
   *
   * @callback search
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
   ***/
  'count': function(arr, f) {
    return arrayCount(arr, f);
  },

  /***
   * @method sum([map])
   * @returns Number
   * @short Sums all values in the array.
   * @extra [map] may be a function mapping the value to be summed or a string
   *        acting as a shortcut.
   *
   * @callback map
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
   ***/
  'sum': function(arr, map) {
    return sum(arr, map);
  },

  /***
   * @method average([map])
   * @returns Number
   * @short Gets the mean average for all values in the array.
   * @extra [map] may be a function mapping the value to be averaged or a string
   *        acting as a shortcut. Supports `deep properties`.
   *
   * @callback map
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
   ***/
  'average': function(arr, map) {
    return average(arr, map);
  },

  /***
   * @method median([map])
   * @returns Number
   * @short Gets the median average for all values in the array.
   * @extra [map] may be a function mapping the value to be averaged or a string
   *        acting as a shortcut.
   *
   * @callback map
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
   ***/
  'median': function(arr, map) {
    return median(arr, map);
  }

});

/***
 * @method forEachFrom(<fn>, [index] = 0, [loop] = false)
 * @returns Array
 * @short Runs <fn> for each value in the array.
 * @extra This method is simply a more readable alias for `each` when passing
 *        an index. If <fn> returns `false` at any time it will break out of
 *        the loop. If [index] is passed, <fn> will begin at that index and
 *        work its way to the end. If [loop] is true, it will then start over
 *        from the beginning of the array and continue until it reaches
 *        `index - 1`.
 *
 * @callback fn
 *
 *   el   The element of the current iteration.
 *   i    The index of the current iteration.
 *   arr  A reference to the array.
 *
 * @example
 *
 *   [1,2,3,4].forEachFrom(function(n) {
 *     // Called 4 times: 3, 4, 1, 2
 *   }, 2, true);
 *
 ***/
alias(sugarArray, 'forEachFrom', 'each');



/*** @namespace Object ***/

// Object matchers
var objectSome  = wrapObjectMatcher('some'),
    objectFind  = wrapObjectMatcher('find'),
    objectEvery = wrapObjectMatcher('every');

function objectEach(obj, fn) {
  assertCallable(fn);
  forEachProperty(obj, fn);
  return obj;
}

function objectMap(obj, map) {
  var result = {};
  forEachProperty(obj, function(key, val) {
    result[key] = mapWithShortcuts(val, map, obj, [key, val, obj]);
  });
  return result;
}

function objectReduce(obj, fn, acc) {
  var init = isDefined(acc);
  forEachProperty(obj, function(key, val) {
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
  forEachProperty(obj, function(key, val) {
    if (matcher(val, key, obj)) {
      result[key] = val;
    }
  });
  return result;
}

function objectCount(obj, f) {
  var matcher = getMatcher(f, true), count = 0;
  forEachProperty(obj, function(key, val) {
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
   * @method map(<obj>, <map>)
   * @returns Object
   * @short Maps the object to another object whose properties are the values
   *        returned by <map>.
   * @extra <map> can also be a string, which is a shortcut for a function that
   *        gets that property (or invokes a function) on each element.
   *        Supports `deep properties`.
   *
   * @callback map
   *
   *   key  The key of the current property.
   *   val  The value of the current property.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.map({a:'b'}, function(key, val) {
   *     return 'b';
   *   }); -> {a:'b'}
   *   Object.map(usersByName, 'age');
   *
   ***/
  'map': function(obj, map) {
    return objectMap(obj, map);
  },

  /***
   * @method reduce(<obj>, <fn>, [init])
   * @returns Mixed
   * @short Reduces the object to a single result.
   * @extra This operation is sometimes called "accumulation", as it takes the
   *        result of the last iteration of <fn> and passes it as the first
   *        argument to the next iteration, "accumulating" that value as it goes.
   *        The return value of this method will be the return value of the final
   *        iteration of <fn>. If [init] is passed, it will be the initial
   *        "accumulator" (the first argument). If [init] is not passed, then a
   *        property of the object will be used instead and <fn> will not be
   *        called for that property. Note that object properties have no order,
   *        and this may lead to bugs (for example if performing division or
   *        subtraction operations on a value). If order is important, use an
   *        array instead!
   *
   * @callback fn
   *
   *   acc  The "accumulator", either [init], the result of the last iteration
   *        of <fn>, or a property of <obj>.
   *   val  The value of the current property called for <fn>.
   *   key  The key of the current property called for <fn>.
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
   ***/
  'reduce': function(obj, fn, init) {
    return objectReduce(obj, fn, init);
  },

  /***
   * @method each(<obj>, <fn>)
   * @returns Object
   * @short Runs <fn> against each property in the object.
   * @extra Does not iterate over inherited properties. If <fn> returns `false`
   *        at any time it will break out of the loop. Returns <obj>.
   *
   * @callback fn
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.each({a:'b'}, function(key, val) {
   *     // key = a, val = 'b'
   *   });
   *
   ***/
  'each': function(obj, fn) {
    return objectEach(obj, fn);
  },

  /***
   * @method sum(<obj>, [map])
   * @returns Number
   * @short Sums all properties in the object.
   * @extra [map] may be a function mapping the value to be summed or a string
   *        acting as a shortcut.
   *
   * @callback map
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
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
   * @method average(<obj>, [map])
   * @returns Number
   * @short Gets the mean average of all properties in the object.
   * @extra [map] may be a function mapping the value to be averaged or a string
   *        acting as a shortcut.
   *
   * @callback map
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.average({a:35,b:11}); -> 23
   *   Object.average(usersByName, 'age'); -> average user age
   *   Object.average(usersByName, 'currencies.usd.balance'); -> USD mean balance
   *
   ***/
  'average': function(obj, map) {
    return average(obj, map, true);
  },

  /***
   * @method median(<obj>, [map])
   * @returns Number
   * @short Gets the median average of all properties in the object.
   * @extra [map] may be a function mapping the value to be averaged or a string
   *        acting as a shortcut.
   *
   * @callback map
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.median({a:1,b:2,c:2}) -> 2
   *   Object.median(usersByName, 'age'); -> median user age
   *   Object.median(usersByName, 'currencies.usd.balance'); -> USD median balance
   *
   ***/
  'median': function(obj, map) {
    return median(obj, map, true);
  },

  /***
   * @method min(<obj>, [map], [all] = false)
   * @returns Mixed
   * @short Returns the key of the property in the object with the lowest value.
   * @extra If [all] is true, will return an object with all properties in the
   *        object with the lowest value. [map] may be a function mapping the
   *        value to be checked or a string acting as a shortcut.
   *
   * @callback map
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
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
   * @method max(<obj>, [map], [all] = false)
   * @returns Mixed
   * @short Returns the key of the property in the object with the highest value.
   * @extra If [all] is true, will return an object with all properties in the
   *        object with the highest value. [map] may be a function mapping the
   *        value to be checked or a string acting as a shortcut.
   *
   * @callback map
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
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
   * @method least(<obj>, [map], [all] = false)
   * @returns Mixed
   * @short Returns the key of the property in the object with the least commonly
   *        occuring value.
   * @extra If [all] is true, will return an object with all properties in the
   *        object with the least common value. [map] may be a function mapping
   *        the value to be checked or a string acting as a shortcut.
   *
   * @callback map
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
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
   * @method most(<obj>, [map], [all] = false)
   * @returns Mixed
   * @short Returns the key of the property in the object with the most commonly
   *        occuring value.
   * @extra If [all] is true, will return an object with all properties in the
   *        object with the most common value. [map] may be a function mapping
   *        the value to be checked or a string acting as a shortcut.
   *
   * @callback map
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
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
   * @method some(<obj>, <search>)
   * @returns Boolean
   * @short Returns true if <search> is true for any property in the object.
   * @extra Implements `enhanced matching`.
   *
   * @callback search
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
   *
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
   * @method every(<obj>, <search>)
   * @returns Boolean
   * @short Returns true if <search> is true for all properties in the object.
   * @extra Implements `enhanced matching`.
   *
   * @callback search
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
   *
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
   * @method find(<obj>, <search>)
   * @returns Boolean
   * @short Returns the first key whose value matches <search>.
   * @extra Implements `enhanced matching`. Note that "first" is
   *        implementation-dependent. If order is important an array should be
   *        used instead.
   *
   * @callback search
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
   *
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
   * @method filter(<obj>, <search>)
   * @returns Array
   * @short Returns a new object with properties that match <search>.
   * @extra Implements `enhanced matching`.
   *
   * @callback search
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.filter({a:1,b:2}, function(key, val) {
   *     return val == 1;
   *   }); -> {a:1}
   *   Object.filter({a:'a',z:'z'}, /[a-f]/); -> {a:'a'}
   *   Object.filter(usersByName, /^H/); -> all users with names starting with H
   *
   ***/
  'filter': function(obj, f) {
    return objectFilter(obj, f);
  },

  /***
   * @method count(<obj>, <search>)
   * @returns Number
   * @short Counts all properties in the object that match <search>.
   * @extra Implements `enhanced matching`.
   *
   * @callback search
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.count({a:'a',b:'b',c:'a'}, 'a') -> 2
   *   Object.count(usersByName, function(key, user) {
   *     return user.age > 30;
   *   }); -> number of users older than 30
   *   Object.count(usersByName, { name: /^[H-Z]/ });
   *
   ***/
  'count': function(obj, f) {
    return objectCount(obj, f);
  },

  /***
   * @method none(<obj>, <search>)
   * @returns Boolean
   * @short Returns true if none of the properties in the object match <search>.
   * @extra Implements `enhanced matching`.
   *
   * @callback search
   *
   *   key  The key of the current iteration.
   *   val  The value of the current iteration.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   Object.none({a:1,b:2}, 3); -> true
   *
   *   Object.none(usersByName, function(key, user) {
   *     return user.name == 'Wolverine';
   *   }); -> probably true
   *
   ***/
  'none': function(obj, f) {
    return objectNone(obj, f);
  }

});

/***
 * @method all()
 * @alias every
 *
 ***/
alias(sugarObject, 'all', 'every');

/***
 * @method any()
 * @alias some
 *
 ***/
alias(sugarObject, 'any', 'some');
