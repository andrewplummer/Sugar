
  'use strict';

  /***
   * @package Array
   * @dependency core
   * @description Array manipulation and traversal, "fuzzy matching" against elements, alphanumeric sorting and collation, enumerable methods on Object.
   *
   ***/

  var SORT             = 'AlphanumericSort';
  var SORT_ORDER       = 'AlphanumericSortOrder';
  var SORT_IGNORE      = 'AlphanumericSortIgnore';
  var SORT_IGNORE_CASE = 'AlphanumericSortIgnoreCase';
  var SORT_EQUIVALENTS = 'AlphanumericSortEquivalents';
  var SORT_NATURAL     = 'AlphanumericSortNatural';

  // Flag allowing native array methods to be enhanced
  var ARRAY_ENHANCEMENTS_FLAG = 'enhanceArray';

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
      return el === fn || fn.call(this, el, i, arr);
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

  function compareValue(aVal, bVal) {
    var cmp, i;
    if (isString(aVal) && isString(bVal)) {
      return collateStrings(aVal, bVal);
    } else if (isArray(aVal) && isArray(bVal)) {
      if (aVal.length < bVal.length) {
        return -1;
      } else if (aVal.length > bVal.length) {
        return 1;
      } else {
        for(i = 0; i < aVal.length; i++) {
          cmp = compareValue(aVal[i], bVal[i]);
          if (cmp !== 0) {
            return cmp;
          }
        }
        return 0;
      }
    } else if (aVal < bVal) {
      return -1;
    } else if (aVal > bVal) {
      return 1;
    } else {
      return 0;
    }

  }

  // Basic array internal methods

  function arrayEach(arr, fn, startIndex, loop) {
    var index, i, length = +arr.length;
    if (startIndex < 0) startIndex = arr.length + startIndex;
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

  function iterateOverSparseArray(arr, fn, fromIndex, loop) {
    var indexes = [], i;
    for(i in arr) {
      if (isArrayIndex(i) && i in arr && i >= fromIndex) {
        indexes.push(+i);
      }
    }
    arrayEach(indexes.sort(), function(index) {
      return fn.call(arr, arr[index], index, arr);
    });
    return arr;
  }

  function arrayFind(arr, f, startIndex, loop, returnIndex, context) {
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

  function arrayAdd(arr, el, index) {
    if (!isNumber(+index) || isNaN(index)) index = arr.length;
    arr.splice.apply(arr, [index, 0].concat(el));
    return arr;
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

  function arrayUnique(arr, map) {
    var result = [], o = {}, transformed;
    arrayEach(arr, function(el, i) {
      transformed = map ? mapWithShortcuts(el, map, arr, [el, i, arr]) : el;
      if (!checkForElementInHashAndSet(o, transformed)) {
        result.push(el);
      }
    })
    return result;
  }

  function arrayIntersect(arr, args) {
    return arrayIntersectOrSubtract(arr, args, false);
  }

  function arrayIntersectOrSubtract(arr1, args, subtract) {
    var result = [], o = {}, arr2 = [].concat.apply([], args);
    arrayEach(arr2, function(el) {
      checkForElementInHashAndSet(o, el);
    });
    arrayEach(arr1, function(el) {
      var stringified = stringify(el),
          isReference = !objectIsMatchedByValue(el);
      // Add the result to the array if:
      // 1. We're subtracting intersections or it doesn't already exist in the result and
      // 2. It exists in the compared array and we're adding, or it doesn't exist and we're removing.
      if (elementExistsInHash(o, stringified, el, isReference) !== subtract) {
        discardElementFromHash(o, stringified, el, isReference);
        result.push(el);
      }
    });
    return result;
  }

  function arrayFlatten(arr, level, current) {
    level = level || Infinity;
    current = current || 0;
    var result = [];
    arrayEach(arr, function(el) {
      if (isArray(el) && current < level) {
        result = result.concat(arrayFlatten(el, level, current + 1));
      } else {
        result.push(el);
      }
    });
    return result;
  }

  function arrayGroupBy(arr, map, fn) {
    var result = {}, key;
    arrayEach(arr, function(el, index) {
      key = mapWithShortcuts(el, map, arr, [el, index, arr]);
      if (!result[key]) result[key] = [];
      result[key].push(el);
    });
    if (fn) {
      iterateOverObject(result, fn);
    }
    return result;
  }

  function arraySum(arr, map) {
    if (map) {
      arr = sugarArray.map(arr, map);
    }
    return arr.length > 0 ? arr.reduce(function(a,b) { return a + b; }) : 0;
  }

  function arrayCompact(arr, all) {
    var result = [];
    arrayEach(arr, function(el, i) {
      if (all && el) {
        result.push(el);
      } else if (!all && el != null && el.valueOf() === el.valueOf()) {
        result.push(el);
      }
    });
    return result;
  }

  function arrayShuffle(arr) {
    arr = arrayClone(arr);
    var i = arr.length, j, x;
    while(i) {
      j = (Math.random() * i) | 0;
      x = arr[--i];
      arr[i] = arr[j];
      arr[j] = x;
    }
    return arr;
  }

  function isArrayLike(obj) {
    return hasProperty(obj, 'length') && !isString(obj) && !isPlainObject(obj);
  }

  function elementExistsInHash(hash, key, element, isReference) {
    var exists = hasOwnProperty(hash, key);
    if (isReference) {
      if (!hash[key]) {
        hash[key] = [];
      }
      exists = hash[key].indexOf(element) !== -1;
    }
    return exists;
  }

  function checkForElementInHashAndSet(hash, element) {
    var stringified = stringify(element),
        isReference = !objectIsMatchedByValue(element),
        exists      = elementExistsInHash(hash, stringified, element, isReference);
    if (isReference) {
      hash[stringified].push(element);
    } else {
      hash[stringified] = element;
    }
    return exists;
  }

  function discardElementFromHash(hash, key, element, isReference) {
    var arr, i = 0;
    if (isReference) {
      arr = hash[key];
      while(i < arr.length) {
        if (arr[i] === element) {
          arr.splice(i, 1);
        } else {
          i += 1;
        }
      }
    } else {
      delete hash[key];
    }
  }

  // Support methods

  function getMinOrMax(obj, map, which, all) {
    var el,
        key,
        edge,
        test,
        result = [],
        max = which === 'max',
        min = which === 'min',
        thingIsArray = isArray(obj);
    for(key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      el   = obj[key];
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
    }
    if (!thingIsArray) result = arrayFlatten(result, 1);
    return all ? result : result[0];
  }

  // Alphanumeric collation helpers

  function collateStrings(a, b) {
    var aValue, bValue, aChar, bChar, aEquiv, bEquiv, index = 0, tiebreaker = 0;

    var sortIgnore      = sugarArray[SORT_IGNORE];
    var sortIgnoreCase  = sugarArray[SORT_IGNORE_CASE];
    var sortEquivalents = sugarArray[SORT_EQUIVALENTS];
    var sortOrder       = sugarArray[SORT_ORDER];
    var naturalSort     = sugarArray[SORT_NATURAL];

    a = getCollationReadyString(a, sortIgnore, sortIgnoreCase);
    b = getCollationReadyString(b, sortIgnore, sortIgnoreCase);

    do {

      aChar  = getCollationCharacter(a, index, sortEquivalents);
      bChar  = getCollationCharacter(b, index, sortEquivalents);
      aValue = getSortOrderIndex(aChar, sortOrder);
      bValue = getSortOrderIndex(bChar, sortOrder);

      if (aValue === -1 || bValue === -1) {
        aValue = a.charCodeAt(index) || null;
        bValue = b.charCodeAt(index) || null;
        if (naturalSort && codeIsNumeral(aValue) && codeIsNumeral(bValue)) {
          aValue = stringToNumber(a.slice(index));
          bValue = stringToNumber(b.slice(index));
        }
      } else {
        aEquiv = aChar !== a.charAt(index);
        bEquiv = bChar !== b.charAt(index);
        if (aEquiv !== bEquiv && tiebreaker === 0) {
          tiebreaker = aEquiv - bEquiv;
        }
      }
      index += 1;
    } while(aValue != null && bValue != null && aValue === bValue);
    if (aValue === bValue) return tiebreaker;
    return aValue - bValue;
  }

  function getCollationReadyString(str, sortIgnore, sortIgnoreCase) {
    if (!isString(str)) str = String(str);
    if (sortIgnoreCase) {
      str = str.toLowerCase();
    }
    if (sortIgnore) {
      str = str.replace(sortIgnore, '');
    }
    return str;
  }

  function getCollationCharacter(str, index, sortEquivalents) {
    var chr = str.charAt(index);
    return sortEquivalents[chr] || chr;
  }

  function getSortOrderIndex(chr, sortOrder) {
    if (!chr) {
      return null;
    } else {
      return sortOrder.indexOf(chr);
    }
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

  function callNativeMapWithTransform(nativeFn, arr, f, context) {
    var args = [];
    if (isFunction(f)) {
      args.push(f);
    } else if (f) {
      args.push(function(el, index) {
        return mapWithShortcuts(el, f, context, [el, index, arr]);
      });
    }
    args.push(context);
    return nativeFn.apply(arr, args);
  }

  function buildArrayEnhancements() {
    defineInstanceSimilar(sugarArray, 'every,some,filter,find,findIndex', function(methods, name) {
      var nativeFn = Array.prototype[name];
      if (!nativeFn) {
        // find and findIndex are part of ES6 which still may not be fully
        // supported here. Sugar provides polyfills to these methods in the
        // default build, however they may be removed with custom builds, so
        // don't create the enhanced function if the native doesn't exist.
        return;
      }
      var withMatcher = function(arr, f, context) {
        return callNativeWithMatcher(nativeFn, arr, f, context, arguments.length - 1);
      }
      // The instance method is custom here because it's checking argument length
      // in order to throw an error that creates parity with the native methods,
      // however we don't want to go so far as to actually collect the arguments.
      // Also these methods should maintain their length of 1 as per the spec.
      withMatcher.instance = function(f) {
        return callNativeWithMatcher(nativeFn, this, f, arguments[1], arguments.length);
      }
      methods[name] = withMatcher;
    }, [ENHANCEMENTS_FLAG, ARRAY_ENHANCEMENTS_FLAG]);
    buildEnhancedMap();
    buildNone();
  }

  function buildEnhancedMap() {
    var nativeFn = Array.prototype.map;
    defineInstance(sugarArray, {
      'map': function(arr, f, context) {
        return callNativeMapWithTransform(nativeFn, arr, f, context);
      }
    }, [ENHANCEMENTS_FLAG, ARRAY_ENHANCEMENTS_FLAG]);
  }

  function buildNone() {
    var nativeFn = Array.prototype.some;
    // None needs to be built because it also throws errors based on
    // argument length to create parity with other similar native methods.
    var none = function(arr, f, context) {
      return !callNativeWithMatcher(nativeFn, arr, f, context, arguments.length - 1);
    }
    none.instance = function(f) {
      return !callNativeWithMatcher(nativeFn, this, f, arguments[1], arguments.length);
    }
    defineInstance(sugarArray, {

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
      'none': none
    });
  }

  function buildAlphanumericSort() {
    var order = 'AÁÀÂÃĄBCĆČÇDĎÐEÉÈĚÊËĘFGĞHıIÍÌİÎÏJKLŁMNŃŇÑOÓÒÔPQRŘSŚŠŞTŤUÚÙŮÛÜVWXYÝZŹŻŽÞÆŒØÕÅÄÖ';
    var equiv = 'AÁÀÂÃÄ,CÇ,EÉÈÊË,IÍÌİÎÏ,OÓÒÔÕÖ,Sß,UÚÙÛÜ';
    var props = {};
    var collate = function(a, b) {
      return collateStrings(a, b);
    };
    props[SORT_ORDER] = order.split('').map(function(str) {
      return str + str.toLowerCase();
    }).join('');
    var equivalents = {};
    arrayEach(commaSplit(equiv), function(set) {
      var equivalent = set.charAt(0);
      arrayEach(set.slice(1).split(''), function(chr) {
        equivalents[chr] = equivalent;
        equivalents[chr.toLowerCase()] = equivalent.toLowerCase();
      });
    });
    props[SORT_NATURAL] = true;
    props[SORT_IGNORE_CASE] = true;
    props[SORT_EQUIVALENTS] = equivalents;
    props[SORT] = collate;
    defineStaticProperties(sugarArray, props);
  }


  defineStatic(sugarArray, {

    /***
     *
     * @method Array.create(<obj1>, <obj2>, ...)
     * @returns Array
     * @short Alternate array constructor.
     * @extra This method will create a single array by calling %concat% on all arguments passed. In addition to ensuring that an unknown variable is in a single, flat array (the standard constructor will create nested arrays, this one will not), it is also a useful shorthand to convert a function's arguments object into a standard array.
     * @example
     *
     *   Array.create('one', true, 3)   -> ['one', true, 3]
     *   Array.create(['one', true, 3]) -> ['one', true, 3]
     *   Array.create(function(n) {
     *     return arguments;
     *   }('howdy', 'doody'));
     *
     ***/
    'create': function() {
      // Optimized: no leaking arguments
      var result = [];
      for (var i = 0; i < arguments.length; i++) {
        var a = arguments[i];
        if (isArgumentsObject(a) || isArrayLike(a)) {
          for (var j = 0; j < a.length; j++) {
            result.push(a[j]);
          }
          continue;
        }
        result = result.concat(a);
      }
      return result;
    }

  });


  defineInstance(sugarArray, {

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
      return arrayFind(arr, f, index, loop);
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
      var index = arrayFind(arr, f, index, loop, true);
      return isUndefined(index) ? -1 : index;
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
     * @method count(<f>)
     * @returns Number
     * @short Counts all elements in the array that match <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. This method implements %array_matching%.
     * @example
     *
     *   [1,2,3,1].count(1)       -> 2
     *   ['a','b','c'].count(/b/) -> 1
     *   [{a:1},{b:2}].count(function(n) {
     *     return n['a'] > 1;
     *   });                      -> 0
     *
     ***/
    'count': function(arr, f) {
      if (isUndefined(f)) return arr.length;
      return arrayFindAll(arr, f).length;
    },

    /***
     * @method removeAt(<start>, [end])
     * @returns Array
     * @short Removes element at <start>. If [end] is specified, removes the range between <start> and [end]. This method will change the array! If you don't intend the array to be changed use %clone% first.
     * @example
     *
     *   ['a','b','c'].removeAt(0) -> ['b','c']
     *   [1,2,3,4].removeAt(1, 3)  -> [1]
     *
     ***/
    'removeAt': function(arr, start, end) {
      if (isUndefined(start)) return arr;
      if (isUndefined(end))   end = start;
      arr.splice(start, end - start + 1);
      return arr;
    },

    /***
     * @method include(<el>, [index])
     * @returns Array
     * @short Adds <el> to the array.
     * @extra This is a non-destructive alias for %add%. It will not change the original array.
     * @example
     *
     *   [1,2,3,4].include(5)       -> [1,2,3,4,5]
     *   [1,2,3,4].include(8, 1)    -> [1,8,2,3,4]
     *   [1,2,3,4].include([5,6,7]) -> [1,2,3,4,5,6,7]
     *
     ***/
    'include': function(arr, el, index) {
      return arrayAdd(arrayClone(arr), el, index);
    },

    /***
     * @method clone()
     * @returns Array
     * @short Makes a shallow clone of the array.
     * @example
     *
     *   [1,2,3].clone() -> [1,2,3]
     *
     ***/
    'clone': function(arr) {
      return arrayClone(arr);
    },

    /***
     * @method unique([map])
     * @returns Array
     * @short Removes all duplicate elements in the array.
     * @extra [map] may be a function mapping the value to be uniqued on or a string acting as a shortcut. This is most commonly used when you have a key that ensures the object's uniqueness, and don't need to check all fields. This method will also correctly operate on arrays of objects.
     * @example
     *
     *   [1,2,2,3].unique()                 -> [1,2,3]
     *   [{foo:'bar'},{foo:'bar'}].unique() -> [{foo:'bar'}]
     *   [{foo:'bar'},{foo:'bar'}].unique(function(obj){
     *     return obj.foo;
     *   }); -> [{foo:'bar'}]
     *   [{foo:'bar'},{foo:'bar'}].unique('foo') -> [{foo:'bar'}]
     *
     ***/
    'unique': function(arr, map) {
      return arrayUnique(arr, map);
    },

    /***
     * @method flatten([limit] = Infinity)
     * @returns Array
     * @short Returns a flattened, one-dimensional copy of the array.
     * @extra You can optionally specify a [limit], which will only flatten that depth.
     * @example
     *
     *   [[1], 2, [3]].flatten()      -> [1,2,3]
     *   [['a'],[],'b','c'].flatten() -> ['a','b','c']
     *
     ***/
    'flatten': function(arr, limit) {
      return arrayFlatten(arr, limit);
    },

    /***
     * @method first([num] = 1)
     * @returns Mixed
     * @short Returns the first element(s) in the array.
     * @extra When <num> is passed, returns the first <num> elements in the array.
     * @example
     *
     *   [1,2,3].first()        -> 1
     *   [1,2,3].first(2)       -> [1,2]
     *
     ***/
    'first': function(arr, num) {
      if (isUndefined(num)) return arr[0];
      if (num < 0) num = 0;
      return arr.slice(0, num);
    },

    /***
     * @method last([num] = 1)
     * @returns Mixed
     * @short Returns the last element(s) in the array.
     * @extra When <num> is passed, returns the last <num> elements in the array.
     * @example
     *
     *   [1,2,3].last()        -> 3
     *   [1,2,3].last(2)       -> [2,3]
     *
     ***/
    'last': function(arr, num) {
      if (isUndefined(num)) return arr[arr.length - 1];
      var start = arr.length - num < 0 ? 0 : arr.length - num;
      return arr.slice(start);
    },

    /***
     * @method from(<index>)
     * @returns Array
     * @short Returns a slice of the array from <index>.
     * @example
     *
     *   [1,2,3].from(1)  -> [2,3]
     *   [1,2,3].from(2)  -> [3]
     *
     ***/
    'from': function(arr, num) {
      return arr.slice(num);
    },

    /***
     * @method to(<index>)
     * @returns Array
     * @short Returns a slice of the array up to <index>.
     * @example
     *
     *   [1,3,5].to(1)  -> [1]
     *   [1,3,5].to(2)  -> [1,3]
     *
     ***/
    'to': function(arr, num) {
      if (isUndefined(num)) num = arr.length;
      return arr.slice(0, num);
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
      return getMinOrMax(arr, map, 'min', all);
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
      return getMinOrMax(arr, map, 'max', all);
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
      return getMinOrMax(arrayGroupBy(arr, map), 'length', 'min', all);
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
      return getMinOrMax(arrayGroupBy(arr, map), 'length', 'max', all);
    },

    /***
     * @method sum([map])
     * @returns Number
     * @short Sums all values in the array.
     * @extra [map] may be a function mapping the value to be summed or a string acting as a shortcut.
     * @example
     *
     *   [1,2,2].sum()                           -> 5
     *   [{age:35},{age:12},{age:12}].sum(function(n) {
     *     return n.age;
     *   });                                     -> 59
     *   [{age:35},{age:12},{age:12}].sum('age') -> 59
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
     *   [1,2,3].average()                           -> 2
     *   [{age:35},{age:11},{age:11}].average(function(n) {
     *     return n.age;
     *   });                                         -> 19
     *   [{age:35},{age:11},{age:11}].average('age') -> 19
     *
     ***/
    'average': function(arr, map) {
      return arr.length > 0 ? arraySum(arr, map) / arr.length : 0;
    },

    /***
     * @method inGroups(<num>, [padding] = None)
     * @returns Array
     * @short Groups the array into <num> arrays.
     * @extra [padding] specifies a value with which to pad the last array so that they are all equal length.
     * @example
     *
     *   [1,2,3,4,5,6,7].inGroups(3)         -> [ [1,2,3], [4,5,6], [7] ]
     *   [1,2,3,4,5,6,7].inGroups(3, 'none') -> [ [1,2,3], [4,5,6], [7,'none','none'] ]
     *
     ***/
    'inGroups': function(arr, num, padding) {
      var pad = isDefined(padding);
      var result = [];
      var divisor = ceil(arr.length / num);
      simpleRepeat(num, function(i) {
        var index = i * divisor;
        var group = arr.slice(index, index + divisor);
        if (pad && group.length < divisor) {
          simpleRepeat(divisor - group.length, function() {
            group.push(padding);
          });
        }
        result.push(group);
      });
      return result;
    },

    /***
     * @method inGroupsOf(<num>, [padding] = None)
     * @returns Array
     * @short Groups the array into arrays of <num> elements each.
     * @extra [padding] specifies a value with which to pad the last array so that they are all equal length.
     * @example
     *
     *   [1,2,3,4,5,6,7].inGroupsOf(4)         -> [ [1,2,3,4], [5,6,7] ]
     *   [1,2,3,4,5,6,7].inGroupsOf(4, 'none') -> [ [1,2,3,4], [5,6,7,'none'] ]
     *
     ***/
    'inGroupsOf': function(arr, num, padding) {
      var result = [], len = arr.length, group;
      if (len === 0 || num === 0) return arr;
      if (isUndefined(num)) num = 1;
      if (isUndefined(padding)) padding = null;
      simpleRepeat(ceil(len / num), function(i) {
        group = arr.slice(num * i, num * i + num);
        while(group.length < num) {
          group.push(padding);
        }
        result.push(group);
      });
      return result;
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
      return arrayCompact(arr).length == 0;
    },

    /***
     * @method sortBy(<map>, [desc] = false)
     * @returns Array
     * @short Returns a copy of the array sorted by <map>.
     * @extra <map> may be a function, a string acting as a shortcut, an array (comparison by multiple values), or blank (direct comparison of array values). [desc] will sort the array in descending order. When the field being sorted on is a string, the resulting order will be determined by an internal collation algorithm that is optimized for major Western languages, but can be customized. For more information see %array_sorting%.
     * @example
     *
     *   ['world','a','new'].sortBy('length')       -> ['a','new','world']
     *   ['world','a','new'].sortBy('length', true) -> ['world','new','a']
     *   [{age:72},{age:13},{age:18}].sortBy(function(n) {
     *     return n.age;
     *   });                                        -> [{age:13},{age:18},{age:72}]
     *
     ***/
    'sortBy': function(arr, map, desc) {
      var newArray = arrayClone(arr);
      newArray.sort(function(a, b) {
        var aProperty = mapWithShortcuts(a, map, newArray, [a]);
        var bProperty = mapWithShortcuts(b, map, newArray, [b]);
        return compareValue(aProperty, bProperty) * (desc ? -1 : 1);
      });
      return newArray;
    },

    /***
     * @method shuffle()
     * @returns Array
     * @short Returns a copy of the array with the elements randomized.
     * @extra Uses Fisher-Yates algorithm.
     * @example
     *
     *   [1,2,3,4].shuffle()  -> [?,?,?,?]
     *
     ***/
    'shuffle': function(arr) {
      return arrayShuffle(arr);
    },

    /***
     * @method sample([num] = 1, [remove] = false)
     * @returns Mixed
     * @short Returns a random element from the array.
     * @extra If [num] is passed, will return an array of [num] elements. If [remove] is true, sampled elements will also be removed from the array. [remove] can also be passed in place of [num].
     * @example
     *
     *   [1,2,3,4,5].sample()  -> // Random element
     *   [1,2,3,4,5].sample(3) -> // Array of 3 random elements
     *
     ***/
    'sample': function(arr, arg1, arg2) {
      var result = [], num, remove, single;
      if (isBoolean(arg1)) {
        remove = arg1;
      } else {
        num = arg1;
        remove = arg2;
      }
      if (isUndefined(num)) {
        num = 1;
        single = true;
      }
      if (!remove) {
        arr = arrayClone(arr);
      }
      num = min(num, arr.length);
      for (var i = 0, index; i < num; i++) {
        index = trunc(Math.random() * arr.length);
        result.push(arr[index]);
        arr.splice(index, 1);
      }
      return single ? result[0] : result;
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
     * @method add(<el>, [index])
     * @returns Array
     * @short Adds <el> to the array.
     * @extra If [index] is specified, it will add at [index], otherwise adds to the end of the array. %add% behaves like %concat% in that if <el> is an array it will be joined, not inserted. This method will change the array! Use %include% for a non-destructive alias. Also, %insert% is provided as an alias that reads better when using an index.
     * @example
     *
     *   [1,2,3,4].add(5)       -> [1,2,3,4,5]
     *   [1,2,3,4].add([5,6,7]) -> [1,2,3,4,5,6,7]
     *   [1,2,3,4].insert(8, 1) -> [1,8,2,3,4]
     *
     ***/
    'add': function(arr, el, index) {
      return arrayAdd(arr, el, index);
    },

    /***
     * @method compact([all] = false)
     * @returns Array
     * @short Removes all instances of %undefined%, %null%, and %NaN% from the array.
     * @extra If [all] is %true%, all "falsy" elements will be removed. This includes empty strings, 0, and false.
     * @example
     *
     *   [1,null,2,undefined,3].compact() -> [1,2,3]
     *   [1,'',2,false,3].compact()       -> [1,'',2,false,3]
     *   [1,'',2,false,3].compact(true)   -> [1,2,3]
     *   [null, [null, 'bye']].compact()  -> ['hi', [null, 'bye']]
     *
     ***/
    'compact': function(arr, all) {
      return arrayCompact(arr, all);
    },

    /***
     * @method groupBy(<map>, [fn])
     * @returns Object
     * @short Groups the array by <map>.
     * @extra Will return an object with keys equal to the grouped values. <map> may be a mapping function, or a string acting as a shortcut. Optionally calls [fn] for each group.
     * @example
     *
     *   ['fee','fi','fum'].groupBy('length') -> { 2: ['fi'], 3: ['fee','fum'] }
     *   [{age:35,name:'ken'},{age:15,name:'bob'}].groupBy(function(n) {
     *     return n.age;
     *   });                                  -> { 35: [{age:35,name:'ken'}], 15: [{age:15,name:'bob'}] }
     *
     ***/
    'groupBy': function(arr, map, fn) {
      return arrayGroupBy(arr, map, fn);
    }

  });


  defineInstanceWithArguments(sugarArray, {

    /***
     * @method at(<index>, [loop] = true)
     * @returns Mixed
     * @short Gets the element(s) at a given index.
     * @extra When [loop] is true, overshooting the end of the array (or the beginning) will begin counting from the other end. As an alternate syntax, passing multiple indexes will get the elements at those indexes.
     * @example
     *
     *   [1,2,3].at(0)        -> 1
     *   [1,2,3].at(2)        -> 3
     *   [1,2,3].at(4)        -> 2
     *   [1,2,3].at(4, false) -> null
     *   [1,2,3].at(-1)       -> 3
     *   [1,2,3].at(0, 1)     -> [1,2]
     *
     ***/
    'at': function(arr, args) {
      return getEntriesForIndexes(arr, args);
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
    },

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
     * @method union([a1], [a2], ...)
     * @returns Array
     * @short Returns an array containing all elements in all arrays with duplicates removed.
     * @extra This method will also correctly operate on arrays of objects.
     * @example
     *
     *   [1,3,5].union([5,7,9])     -> [1,3,5,7,9]
     *   ['a','b'].union(['b','c']) -> ['a','b','c']
     *
     ***/
    'union': function(arr, args) {
      return arrayUnique([].concat.apply(arr, args));
    },

    /***
     * @method intersect([a1], [a2], ...)
     * @returns Array
     * @short Returns an array containing the elements all arrays have in common.
     * @extra This method will also correctly operate on arrays of objects.
     * @example
     *
     *   [1,3,5].intersect([5,7,9])   -> [5]
     *   ['a','b'].intersect('b','c') -> ['b']
     *
     ***/
    'intersect': function(arr, args) {
      return arrayIntersect(arr, args);
    },

    /***
     * @method subtract([a1], [a2], ...)
     * @returns Array
     * @short Subtracts from the array all elements in [a1], [a2], etc.
     * @extra This method will also correctly operate on arrays of objects.
     * @example
     *
     *   [1,3,5].subtract([5,7,9])   -> [1,3]
     *   [1,3,5].subtract([3],[5])   -> [1]
     *   ['a','b'].subtract('b','c') -> ['a']
     *
     ***/
    'subtract': function(arr, args) {
      return arrayIntersectOrSubtract(arr, args, true);
    },

    /***
     * @method zip([arr1], [arr2], ...)
     * @returns Array
     * @short Merges multiple arrays together.
     * @extra This method "zips up" smaller arrays into one large whose elements are "all elements at index 0", "all elements at index 1", etc. Useful when you have associated data that is split over separated arrays. If the arrays passed have more elements than the original array, they will be discarded. If they have fewer elements, the missing elements will filled with %null%.
     * @example
     *
     *   [1,2,3].zip([4,5,6])                                       -> [[1,2], [3,4], [5,6]]
     *   ['Martin','John'].zip(['Luther','F.'], ['King','Kennedy']) -> [['Martin','Luther','King'], ['John','F.','Kennedy']]
     *
     ***/
    'zip': function(arr, args) {
      return arr.map(function(el, i) {
        return [el].concat(args.map(function(k) {
          return (i in k) ? k[i] : null;
        }));
      });
    }

  });


  function buildAliases() {
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

    /***
     * @method insert()
     * @alias add
     *
     ***/
    alias(sugarArray, 'insert', 'add');
  }


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
  function defineEnumerable(names, mapping) {
    defineInstanceSimilar(sugarObject, names, function(methods, name) {
      var sugarFn = sugarArray[name], fn;
      if (!sugarFn) {
        // find and findIndex may not exist here
        return;
      }
      fn = function(obj, arg1, arg2) {
        var result, coerced = keysWithObjectCoercion(obj), matcher;
        if (!mapping) {
          matcher = getMatcher(arg1, true);
        }
        result = sugarFn(coerced, function(key) {
          var value = obj[key];
          if (mapping) {
            return mapWithShortcuts(value, arg1, obj, [key, value, obj]);
          } else {
            return matcher(value, key, obj);
          }
        }, arg2);
        if (isArray(result)) {
          // The method has returned an array of keys so use this array
          // to build up the resulting object in the form we want it in.
          result = result.reduce(function(o, key, i) {
            o[key] = obj[key];
            return o;
          }, {});
        }
        return result;
      };
      methods[name] = fn;
      setProperty(fn, 'static', true);
    });
    // Need to iterate twice as the instance methods are not
    // prepared yet until defineInstanceSimilar finishes.
    names.forEach(function(name) {
      var fn = sugarObject[name];
      if (fn) {
        setProperty(Hash.prototype, name, fn.instance);
      }
    });
  }

  function buildEnumerable() {
    defineEnumerable(commaSplit('sum,average,min,max,least,most'), true);
    defineEnumerable(commaSplit('any,all,none,count,find,findAll,isEmpty'));
  }

  buildArrayEnhancements();
  buildAliases();
  buildEnumerable();
  buildAlphanumericSort();
