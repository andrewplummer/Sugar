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

  function fuzzyMatcher(obj, isObject) {
    var matchers = {};
    return function(el, i, arr) {
      var key;
      if (!isObjectType(el)) {
        return false;
      }
      for(key in obj) {
        matchers[key] = matchers[key] || getMatcher(obj[key], isObject);
        if (matchers[key].call(arr, el[key], i, arr) === false) {
          return false;
        }
      }
      return true;
    }
  }

  function defaultMatcher(f) {
    return function(el) {
      return el === f || isEqual(el, f);
    }
  }

  function getMatcher(f, isObject) {
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
      if (isObject) {
        return invertedArgsFunctionMatcher(f);
      } else {
        return functionMatcher(f);
      }
    } else if (isPlainObject(f)) {
      // Match against a fuzzy hash or array.
      return fuzzyMatcher(f, isObject);
    }
    // Default is standard isEqual
    return defaultMatcher(f);
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

  function arrayFindAll(arr, f, index, loop) {
    var result = [], matcher;
    if (arr.length > 0) {
      matcher = getMatcher(f);
      arrayEach(arr, function(el, i, arr) {
        if (matcher(el, i, arr)) {
          result.push(el);
        }
      }, index, loop);
    }
    return result;
  }

  function arrayIsEmpty(arr) {
    return arr.length === 0;
  }

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

  // Support methods

  function getMinOrMax(obj, map, which, all) {
    var edge,
        test,
        result = [],
        max = which === 'max',
        min = which === 'min',
        thingIsArray = isArray(obj);
    iterateOverObject(obj, function(key, el) {
      test = mapWithShortcuts(el, map, obj, thingIsArray ? [el, +key, obj] : []);
      if (isUndefined(test)) {
        throw new TypeError('Cannot compare with undefined');
      }
      if (test === edge) {
        result.push(el);
      } else if (isUndefined(edge) || (max && test > edge) || (min && test < edge)) {
        result = [el];
        edge = test;
      }
    });
    if (!thingIsArray) result = simpleFlatten(result);
    return all ? result : result[0];
  }

  function simpleFlatten(arr) {
    return arr.concat.apply([], arr);
  }

  // A simplified version of reduce that doesn't deal with
  // type checks and saves a few bytes in the build. Always
  // uses an initial value.

  function reduce(arr, fn, init) {
    var result = init;
    for (var i = 0, len = arr.length; i < len; i++) {
      result = fn(result, arr[i]);
    }
    return result;
  }

  // Flag allowing native array methods to be enhanced
  var ARRAY_ENHANCEMENTS_FLAG = 'enhanceArray';

  function callMapWithTransform(arr, f, context) {
    var args = [];
    if (isFunction(f)) {
      args.push(f);
    } else if (f) {
      args.push(function(el, index) {
        return mapWithShortcuts(el, f, context, [el, index, arr]);
      });
    }
    args.push(context);
    return nativeMap.apply(arr, args);
  }

  function callNativeWithMatcher(nativeFn, arr, f, context, argLen) {
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

  function wrapNativeWithMatcher(name) {
    var nativeFn = Array.prototype[name];
    return function(arr, f, context, argLen) {
      return callNativeWithMatcher(nativeFn, arr, f, context, argLen);
    }
  }

  var nativeMap  = Array.prototype.map;
  var nativeSome = Array.prototype.some;

  // Enhanced Natives
  var enhancedFind      = wrapNativeWithMatcher('find'),
      enhancedSome      = wrapNativeWithMatcher('some'),
      enhancedEvery     = wrapNativeWithMatcher('every'),
      enhancedFilter    = wrapNativeWithMatcher('filter'),
      enhancedFindIndex = wrapNativeWithMatcher('findIndex');


  var enhancedByName = {
    'some': enhancedSome,
    'find': enhancedFind,
    'every': enhancedEvery,
    'filter': enhancedFilter,
    'findIndex': enhancedFindIndex,
    'map': callMapWithTransform
  };

  function arrayNone(arr, f, context, argLen) {
    return !callNativeWithMatcher(nativeSome, arr, f, context, argLen);
  }

  function arrayCount(arr, f) {
    if (isUndefined(f)) return arr.length;
    return arrayFindAll(arr, f).length;
  }

  function buildArrayEnhanced() {

    defineInstanceSimilar(sugarArray, 'map,every,some,filter,find,findIndex', function(methods, name) {
      methods[name] = fixArgumentLength(enhancedByName[name]);
    }, [ENHANCEMENTS_FLAG, ARRAY_ENHANCEMENTS_FLAG]);

    /***
     * @method all()
     * @alias every
     *
     ***/
    alias(sugarArray, 'all', 'every');

    /*** @method any()
     * @alias some
     *
     ***/
    alias(sugarArray, 'any', 'some');

  }

  function arraySum(arr, m) {
    var sum = 0, el;
    for (var i = 0, len = arr.length; i < len; i++) {
      el = arr[i];
      sum += m ? mapWithShortcuts(el, m, arr, [el, i, arr]) : el;
    }
    return sum;
  }

  function arrayAverage(arr, map) {
    return arr.length > 0 ? arraySum(arr, map) / arr.length : 0;
  }

  function arrayMedian(arr, map) {
    var len = arr.length, middle;
    if (!len) return;
    arr = map ? callMapWithTransform(arr, map) : arrayClone(arr);
    arr.sort(function(a, b) {
      return a - b;
    });
    middle = trunc(len / 2);
    return len % 2 ? arr[middle] : (arr[middle - 1] + arr[middle]) / 2;
  }

  function arrayMin(arr, map, all) {
    return getMinOrMax(arr, map, 'min', all);
  }

  function arrayMax(arr, map, all) {
    return getMinOrMax(arr, map, 'max', all);
  }

  function arrayLeast(arr, map, all) {
    return getMinOrMax(arrayGroupBy(arr, map), 'length', 'min', all);
  }

  function arrayMost(arr, map, all) {
    return getMinOrMax(arrayGroupBy(arr, map), 'length', 'max', all);
  }

  function arrayFindFrom(arr, f, startIndex, loop, returnIndex, context) {
    var result, index, matcher;
    if (arr.length > 0) {
      matcher = getMatcher(f);
      arrayEach(arr, function(el, i) {
        if (matcher.call(context, el, i, arr)) {
          result = el;
          index = i;
          return false;
        }
      }, startIndex, loop);
    }
    return returnIndex ? index : result;
  }

  defineInstance(sugarArray, {

    /***
     * @method isEqual(<arr>)
     * @returns Boolean
     * @short Returns true if the array equal to <arr>.
     * @extra %isEqual% in Sugar is "egal", meaning the values are equal if they are "not observably distinguishable". This method is identical to, and a shortcut for `Object.isEqual()`.
     * @example
     *
     *   ['a','b'].isEqual(['a','b'])           -> true
     *   ['a','b'].isEqual(['a','c'])           -> false
     *   [{user:'Dave'}].isEqual({user:'Dave'}) -> true
     *
     ***/
    'isEqual': function(a, b) {
      return isEqual(a, b);
    },

    /***
     * @method findFrom(<f>, [index] = 0, [loop] = false)
     * @returns Array
     * @short Returns any element that matches <f>, beginning from [index].
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Will continue from index = 0 if [loop] is true. This method implements %array_matching%.
     * @example
     *
     *   ['cuba','japan','canada'].findFrom(/^c/, 2) -> 'canada'
     *
     ***/
    'findFrom': function(arr, f, index, loop) {
      return arrayFindFrom(arr, f, index, loop);
    },

    /***
     * @method findIndexFrom(<f>, [index] = 0, [loop] = false)
     * @returns Array
     * @short Returns the index of any element that matches <f>, beginning from [index].
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Will continue from index = 0 if [loop] is true. This method implements %array_matching%.
     * @example
     *
     *   ['cuba','japan','canada'].findIndexFrom(/^c/, 2) -> 2
     *
     ***/
    'findIndexFrom': function(arr, f, index, loop) {
      var index = arrayFindFrom(arr, f, index, loop, true);
      return isUndefined(index) ? -1 : index;
    },

    /***
     * @method isEmpty()
     * @returns Boolean
     * @short Returns true if the array is empty.
     * @extra This is true if the array has a length of zero, or contains only %undefined%, %null%, or %NaN%.
     * @example
     *
     *   [].isEmpty()               -> true
     *   [null,undefined].isEmpty() -> true
     *
     ***/
    'isEmpty': function(arr) {
      return arrayIsEmpty(arr);
    },

    /***
     * @method findAll(<f>, [index] = 0, [loop] = false)
     * @returns Array
     * @short Returns all elements that match <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Starts at [index], and will continue once from index = 0 if [loop] is true. This method implements %array_matching%.
     * @example
     *
     *   [{a:1,b:2},{a:1,b:3},{a:2,b:4}].findAll(function(n) {
     *     return n['a'] == 1;
     *   });                                        -> [{a:1,b:3},{a:1,b:4}]
     *   ['cuba','japan','canada'].findAll(/^c/)    -> 'cuba','canada'
     *   ['cuba','japan','canada'].findAll(/^c/, 2) -> 'canada'
     *
     ***/
    'findAll': function(arr, f, index, loop) {
      return arrayFindAll(arr, f, index, loop);
    },

    /***
     * @method each(<fn>, [index] = 0, [loop] = false)
     * @returns Array
     * @short Runs <fn> against each element in the array. Enhanced version of %Array#forEach%.
     * @extra Parameters passed to <fn> are identical to %forEach%, ie. the first parameter is the current element, second parameter is the current index, and third parameter is the array itself. If <fn> returns %false% at any time it will break out of the loop. Once %each% finishes, it will return the array. If [index] is passed, <fn> will begin at that index and work its way to the end. If [loop] is true, it will then start over from the beginning of the array and continue until it reaches [index] - 1.
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
     * @method count(<f>)
     * @returns Number
     * @short Counts all elements in the array that match <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. This method implements %array_matching%.
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
     * @method none(<f>)
     * @returns Boolean
     * @short Returns true if none of the elements in the array match <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. This method implements %array_matching%.
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
      return arrayMin(arr, map, all);
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
      return arrayMax(arr, map, all);
    },

    /***
     * @method least([map])
     * @returns Array
     * @short Returns the elements in the array with the least commonly occuring value.
     * @extra [map] may be a function mapping the value to be checked or a string acting as a shortcut.
     * @example
     *
     *   [3,2,2].least()                   -> [3]
     *   ['fe','fo','fum'].least('length') -> ['fum']
     *   [{age:35,name:'ken'},{age:12,name:'bob'},{age:12,name:'ted'}].least(function(n) {
     *     return n.age;
     *   });                               -> [{age:35,name:'ken'}]
     *
     ***/
    'least': function(arr, map, all) {
      return arrayLeast(arr, map, all);
    },

    /***
     * @method most([map])
     * @returns Array
     * @short Returns the elements in the array with the most commonly occuring value.
     * @extra [map] may be a function mapping the value to be checked or a string acting as a shortcut.
     * @example
     *
     *   [3,2,2].most()                   -> [2]
     *   ['fe','fo','fum'].most('length') -> ['fe','fo']
     *   [{age:35,name:'ken'},{age:12,name:'bob'},{age:12,name:'ted'}].most(function(n) {
     *     return n.age;
     *   });                              -> [{age:12,name:'bob'},{age:12,name:'ted'}]
     *
     ***/
    'most': function(arr, map, all) {
      return arrayMost(arr, map, all);
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
     *   }); -> 24
     *   [{age:35},{age:13}].sum('age') -> 24
     *
     ***/
    'sum': function(arr, map) {
      return arraySum(arr, map);
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
      return arrayAverage(arr, map);
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
      return arrayMedian(arr, map);
    }


  });


  defineInstanceWithArguments(sugarArray, {

    /***
     * @method remove([f1], [f2], ...)
     * @returns Array
     * @short Removes any element in the array that matches [f1], [f2], etc.
     * @extra Will match a string, number, array, object, or alternately test against a function or regex. This method will change the array! Use %exclude% for a non-destructive alias. This method implements %array_matching%.
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
     * @extra This is a non-destructive alias for %remove%. It will not change the original array. This method implements %array_matching%.
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
      return arrayRemove(arrayClone(arr), args);
    }

  });


  /***
   * @namespace Object
   *
   ***/

  /***
   * @method Object.[enumerable](<obj>)
   * @returns Boolean
   * @short Enumerable methods in the Array package are also available to the Object class. They will perform their normal operations for every property in <obj>.
   * @extra In cases where a callback is used, instead of %element, index%, the callback will instead be passed %key, value%. Enumerable methods are also available to %extended objects% as instance methods.
   *
   * @set
   *   all
   *   any
   *   average
   *   count
   *   find
   *   findAll
   *   isEmpty
   *   least
   *   max
   *   min
   *   most
   *   none
   *   sum
   *
   * @example
   *
   *   Object.any({foo:'bar'}, 'bar')            -> true
   *   Object.extended({foo:'bar'}).any('bar')   -> true
   *   Object.isEmpty({})                        -> true
   *   Object.map({ fred: { age: 52 } }, 'age'); -> { fred: 52 }
   *
   ***/
  function buildObjectEnumerable() {

    var methodsByName = {
      'any':     enhancedSome,
      'all':     enhancedEvery,
      'sum':     arraySum,
      'min':     arrayMin,
      'max':     arrayMax,
      'none':    arrayNone,
      'most':    arrayMost,
      'least':   arrayLeast,
      'count':   arrayCount,
      'average': arrayAverage,
      'findAll': arrayFindAll,
      'isEmpty': arrayIsEmpty
    };

    function createStaticAndHash(methods, name, fn) {
      methods[name] = fn;
      setProperty(Hash.prototype, name, wrapInstanceMethod(fn));
    }

    function callEnumerableForObject(baseFn, obj, arg2, fn) {
      var result = baseFn(keysWithObjectCoercion(obj), fn, arg2);
      if (isArray(result)) {
        // The method has returned an array of keys so use this array
        // to build up the resulting object in the form we want it in.
        result = reduce(result, function(o, key) {
          o[key] = obj[key];
          return o;
        }, {});
      }
      return result;
    }

    defineInstanceAndStaticSimilar(sugarObject, 'sum,average,min,max,least,most', function(methods, name) {
      var fn = methodsByName[name];
      createStaticAndHash(methods, name, function(obj, arg1, arg2) {
        return callEnumerableForObject(fn, obj, arg2, function(key) {
          var value = obj[key];
          return mapWithShortcuts(value, arg1, obj, [key, value, obj]);
        });
      });
    });

    defineInstanceAndStaticSimilar(sugarObject, 'any,all,none,count,find,findAll,isEmpty', function(methods, name) {
      var fn = methodsByName[name] || enhancedByName[name];
      createStaticAndHash(methods, name, function(obj, arg1, arg2) {
        var matcher = getMatcher(arg1, true);
        return callEnumerableForObject(fn, obj, arg2, function(key) {
          return matcher(obj[key], key, obj);
        });
      });
    });

  }

  // The order of these build functions is important as aliases are pointing
  // to enhanced functions, and object mappings are referencing aliases.
  buildArrayEnhanced();
  buildObjectEnumerable();
