'use strict';

/***
 * @module Array
 * @description Array manipulation and traversal, alphanumeric sorting and collation.
 *
 ***/

var HALF_WIDTH_NINE = 0x39;
var FULL_WIDTH_NINE = 0xff19;

// Undefined array elements in < IE8 will not be visited by concat
// and so will not be copied. This means that non-sparse arrays will
// become sparse, so detect for this here.
var HAS_CONCAT_BUG = !('0' in [].concat(undefined).concat());

var ARRAY_OPTIONS = {
  'sortIgnore':      null,
  'sortNatural':     true,
  'sortIgnoreCase':  true,
  'sortOrder':       getSortOrder(),
  'sortCollate':     collateStrings,
  'sortEquivalents': getSortEquivalents()
};

/***
 * @method getOption(name)
 * @returns Mixed
 * @accessor
 * @short Gets an option used internally by Array.
 * @extra Options listed below. Current options are for sorting strings with
 *        `sortBy`.
 *
 * @example
 *
 *   Sugar.Array.getOption('sortNatural')
 *
 * @param {string} name
 *
 ***
 * @method setOption(name, value)
 * @accessor
 * @short Sets an option used internally by Array.
 * @extra Options listed below. Current options are for sorting strings with
 *        `sortBy`. If `value` is `null`, the default value will be restored.
 *
 * @options
 *
 *   sortIgnore        A regex to ignore when sorting. An example usage of this
 *                     option would be to ignore numbers in a list to instead
 *                     sort by the first text that appears. Default is `null`.
 *
 *   sortIgnoreCase    A boolean that ignores case when sorting.
 *                     Default is `true`.
 *
 *   sortNatural       A boolean that turns on natural sorting. "Natural" means
 *                     that numerals like "10" will be sorted after "9" instead
 *                     of after "1". Default is `true`.
 *
 *   sortOrder         A string of characters to use as the base sort order. The
 *                     default is an order natural to most major world languages.
 *
 *   sortEquivalents   A table of equivalent characters used when sorting. The
 *                     default produces a natural sort order for most world
 *                     languages, however can be modified for others. For
 *                     example, setting "ä" and "ö" to `null` in the table would
 *                     produce a Scandanavian sort order. Note that setting this
 *                     option to `null` will restore the default table, but any
 *                     mutations made to that table will persist.
 *
 *   sortCollate       The collation function used when sorting strings. The
 *                     default function produces a natural sort order that can
 *                     be customized with the other "sort" options. Overriding
 *                     the function directly here will also override these
 *                     options.
 *
 * @example
 *
 *   Sugar.Array.setOption('sortIgnore', /^\d+\./)
 *   Sugar.Array.setOption('sortIgnoreCase', false)
 *
 * @signature setOption(options)
 * @param {ArrayOptions} options
 * @param {string} name
 * @param {any} value
 * @option {RegExp} [sortIgnore]
 * @option {boolean} [sortIgnoreCase]
 * @option {boolean} [sortNatural]
 * @option {string} [sortOrder]
 * @option {Object} [sortEquivalents]
 * @option {Function} [sortCollate]
 *
 ***/
var _arrayOptions = defineOptionsAccessor(sugarArray, ARRAY_OPTIONS);


function setArrayChainableConstructor() {
  setChainableConstructor(sugarArray, arrayCreate);
}

function isArrayOrInherited(obj) {
  return obj && obj.constructor && isArray(obj.constructor.prototype);
}

function arrayCreate(obj, clone) {
  var arr;
  if (isArrayOrInherited(obj)) {
    arr = clone ? arrayClone(obj) : obj;
  } else if (isObjectType(obj) || isString(obj)) {
    arr = Array.from(obj);
  } else if (isDefined(obj)) {
    arr = [obj];
  }
  return arr || [];
}

function arrayClone(arr) {
  var clone = new Array(arr.length);
  forEach(arr, function(el, i) {
    clone[i] = el;
  });
  return clone;
}

function arrayConcat(arr1, arr2) {
  // istanbul ignore if
  if (HAS_CONCAT_BUG) {
    return arraySafeConcat(arr1, arr2);
  }
  return arr1.concat(arr2);
}

// Avoids issues with [undefined] in < IE9
function arrayWrap(obj) {
  var arr = [];
  arr.push(obj);
  return arr;
}

// Avoids issues with concat in < IE8
// istanbul ignore next
function arraySafeConcat(arr, arg) {
  var result = arrayClone(arr), len = result.length, arr2;
  arr2 = isArray(arg) ? arg : [arg];
  result.length += arr2.length;
  forEach(arr2, function(el, i) {
    result[len + i] = el;
  });
  return result;
}


function arrayAppend(arr, el, index) {
  var spliceArgs;
  index = +index;
  if (isNaN(index)) {
    index = arr.length;
  }
  spliceArgs = [index, 0];
  if (isDefined(el)) {
    spliceArgs = spliceArgs.concat(el);
  }
  arr.splice.apply(arr, spliceArgs);
  return arr;
}

function arrayRemove(arr, f) {
  var matcher = getMatcher(f), i = 0;
  while(i < arr.length) {
    if (matcher(arr[i], i, arr)) {
      arr.splice(i, 1);
    } else {
      i++;
    }
  }
  return arr;
}

function arrayExclude(arr, f) {
  var result = [], matcher = getMatcher(f);
  for (var i = 0; i < arr.length; i++) {
    if (!matcher(arr[i], i, arr)) {
      result.push(arr[i]);
    }
  }
  return result;
}

function arrayUnique(arr, map) {
  var result = [], obj = {}, refs = [];
  forEach(arr, function(el, i) {
    var transformed = map ? mapWithShortcuts(el, map, arr, [el, i, arr]) : el;
    var key = serializeInternal(transformed, refs);
    if (!hasOwn(obj, key)) {
      result.push(el);
      obj[key] = true;
    }
  });
  return result;
}

function arrayFlatten(arr, level, current) {
  var result = [];
  level = level || Infinity;
  current = current || 0;
  forEach(arr, function(el) {
    if (isArray(el) && current < level) {
      result = result.concat(arrayFlatten(el, level, current + 1));
    } else {
      result.push(el);
    }
  });
  return result;
}

function arrayCompact(arr, all) {
  return filter(arr, function(el) {
    return el || (!all && el != null && el.valueOf() === el.valueOf());
  });
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

function arrayGroupBy(arr, map, fn) {
  var result = {}, key;
  forEach(arr, function(el, i) {
    key = mapWithShortcuts(el, map, arr, [el, i, arr]);
    if (!hasOwn(result, key)) {
      result[key] = [];
    }
    result[key].push(el);
  });
  if (fn) {
    forEachProperty(result, fn);
  }
  return result;
}

function arrayIntersectOrSubtract(arr1, arr2, subtract) {
  var result = [], obj = {}, refs = [];
  if (!isArray(arr2)) {
    arr2 = arrayWrap(arr2);
  }
  forEach(arr2, function(el) {
    obj[serializeInternal(el, refs)] = true;
  });
  forEach(arr1, function(el) {
    var key = serializeInternal(el, refs);
    if (hasOwn(obj, key) !== subtract) {
      delete obj[key];
      result.push(el);
    }
  });
  return result;
}

// Collation helpers

function compareValue(aVal, bVal) {
  var cmp, i, collate;
  if (isString(aVal) && isString(bVal)) {
    collate = _arrayOptions('sortCollate');
    return collate(aVal, bVal);
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
  }
  return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
}

function codeIsNumeral(code) {
  return (code >= HALF_WIDTH_ZERO && code <= HALF_WIDTH_NINE) ||
         (code >= FULL_WIDTH_ZERO && code <= FULL_WIDTH_NINE);
}

function collateStrings(a, b) {
  var aValue, bValue, aChar, bChar, aEquiv, bEquiv, index = 0, tiebreaker = 0;

  var sortOrder       = _arrayOptions('sortOrder');
  var sortIgnore      = _arrayOptions('sortIgnore');
  var sortNatural     = _arrayOptions('sortNatural');
  var sortIgnoreCase  = _arrayOptions('sortIgnoreCase');
  var sortEquivalents = _arrayOptions('sortEquivalents');

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
      if (sortNatural && codeIsNumeral(aValue) && codeIsNumeral(bValue)) {
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
  return getOwn(sortEquivalents, chr) || chr;
}

function getSortOrderIndex(chr, sortOrder) {
  if (!chr) {
    return null;
  } else {
    return sortOrder.indexOf(chr);
  }
}

function getSortOrder() {
  var order = 'AÁÀÂÃĄBCĆČÇDĎÐEÉÈĚÊËĘFGĞHıIÍÌİÎÏJKLŁMNŃŇÑOÓÒÔPQRŘSŚŠŞTŤUÚÙŮÛÜVWXYÝZŹŻŽÞÆŒØÕÅÄÖ';
  return map(order.split(''), function(str) {
    return str + str.toLowerCase();
  }).join('');
}

function getSortEquivalents() {
  var equivalents = {};
  forEach(spaceSplit('AÁÀÂÃÄ CÇ EÉÈÊË IÍÌİÎÏ OÓÒÔÕÖ Sß UÚÙÛÜ'), function(set) {
    var first = set.charAt(0);
    forEach(set.slice(1).split(''), function(chr) {
      equivalents[chr] = first;
      equivalents[chr.toLowerCase()] = first.toLowerCase();
    });
  });
  return equivalents;
}

defineStatic(sugarArray, {

  /***
   *
   * @method create([obj], [clone] = false)
   * @returns Array
   * @static
   * @short Creates an array from an unknown object.
   * @extra This method is similar to native `Array.from` but is faster when
   *        `obj` is already an array. When [clone] is true, the array will be
   *        shallow cloned. Additionally, it will not fail on `undefined`,
   *        `null`, or numbers, producing an empty array in the case of
   *        `undefined` and wrapping `obj` otherwise.
   *
   * @example
   *
   *   Array.create()          -> []
   *   Array.create(8)         -> [8]
   *   Array.create('abc')     -> ['a','b','c']
   *   Array.create([1,2,3])   -> [1, 2, 3]
   *   Array.create(undefined) -> []
   *
   * @param {number|ArrayLike<T>} [obj]
   * @param {boolean} [clone]
   *
   ***/
  'create': function(obj, clone) {
    return arrayCreate(obj, clone);
  },

  /***
   *
   * @method construct(n, indexMapFn)
   * @returns Array
   * @static
   * @short Constructs an array of `n` length from the values of `indexMapFn`.
   * @extra This function is essentially a shortcut for using `Array.from` with
   *        `new Array(n)`.
   *
   * @callback indexMapFn
   *
   *   i   The index of the current iteration.
   *
   * @example
   *
   *   Array.construct(4, function(i) {
   *     return i * i;
   *   }); -> [0, 1, 4]
   *
   * @param {number} n
   * @param {indexMapFn} indexMapFn
   * @callbackParam {number} i
   * @callbackReturns {ArrayElement} indexMapFn
   *
   ***/
  'construct': function(n, indexMapFn) {
    n = coercePositiveInteger(n);
    return Array.from(new Array(n), function(el, i) {
      return indexMapFn && indexMapFn(i);
    });
  }

});

defineInstance(sugarArray, {

  /***
   * @method isEmpty()
   * @returns Boolean
   * @short Returns true if the array has a length of zero.
   *
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
   * @method isEqual(arr)
   * @returns Boolean
   * @short Returns true if the array is equal to `arr`.
   * @extra Objects in the array are considered equal if they are not observably
   *        distinguishable. This method is an instance alias for
   *        `Object.isEqual()`.
   *
   * @example
   *
   *   ['a','b'].isEqual(['a','b']) -> true
   *   ['a','b'].isEqual(['a','c']) -> false
   *   [{a:'a'}].isEqual([{a:'a'}]) -> true
   *   [5].isEqual([Object(5)])     -> false
   *
   * @param {Array} arr
   *
   ***/
  'isEqual': function(a, b) {
    return isEqual(a, b);
  },

  /***
   * @method clone()
   * @returns Array
   * @short Creates a shallow clone of the array.
   *
   * @example
   *
   *   [1,2,3].clone() -> [1,2,3]
   *
   ***/
  'clone': function(arr) {
    return arrayClone(arr);
  },

  /***
   * @method at(index, [loop] = false)
   * @returns ArrayElement
   * @short Gets the element(s) at `index`.
   * @extra When [loop] is true, overshooting the end of the array will begin
   *        counting from the other end. `index` can be negative. If `index` is
   *        an array, multiple elements will be returned.
   *
   * @example
   *
   *   [1,2,3].at(0)       -> 1
   *   [1,2,3].at(2)       -> 3
   *   [1,2,3].at(4)       -> undefined
   *   [1,2,3].at(4, true) -> 2
   *   [1,2,3].at(-1)      -> 3
   *   [1,2,3].at([0, 1])  -> [1, 2]
   *
   * @param {number|number[]} index
   * @param {boolean} [loop]
   *
   ***/
  'at': function(arr, index, loop) {
    return getEntriesForIndexes(arr, index, loop);
  },

  /***
   * @method add(item, [index])
   * @returns Array
   * @short Adds `item` to the array and returns the result as a new array.
   * @extra If `item` is also an array, it will be concatenated instead of
   *        inserted. [index] will control where `item` is added. Use `append`
   *        to modify the original array.
   *
   * @example
   *
   *   [1,2,3,4].add(5)       -> [1,2,3,4,5]
   *   [1,2,3,4].add(8, 1)    -> [1,8,2,3,4]
   *   [1,2,3,4].add([5,6,7]) -> [1,2,3,4,5,6,7]
   *
   * @param {ArrayElement|Array} item
   * @param {number} [index]
   *
   ***/
  'add': function(arr, item, index) {
    return arrayAppend(arrayClone(arr), item, index);
  },

  /***
   * @method subtract(item)
   * @returns Array
   * @short Subtracts `item` from the array and returns the result as a new array.
   * @extra If `item` is also an array, all elements in it will be removed. In
   *        addition to primitives, this method will also deep-check objects for
   *        equality.
   *
   * @example
   *
   *   [1,3,5].subtract([5,7,9])     -> [1,3]
   *   ['a','b'].subtract(['b','c']) -> ['a']
   *   [1,2,3].subtract(2)           -> [1,3]
   *
   * @param {ArrayElement|Array} item
   *
   ***/
  'subtract': function(arr, item) {
    return arrayIntersectOrSubtract(arr, item, true);
  },

  /***
   * @method append(item, [index])
   * @returns Array
   * @short Appends `item` to the array.
   * @extra If `item` is also an array, it will be concatenated instead of
   *        inserted. This method modifies the array! Use `add` to create a new
   *        array. Additionally, `insert` is provided as an alias that reads
   *        better when using an index.
   *
   * @example
   *
   *   [1,2,3,4].append(5)       -> [1,2,3,4,5]
   *   [1,2,3,4].append([5,6,7]) -> [1,2,3,4,5,6,7]
   *   [1,2,3,4].append(8, 1)    -> [1,8,2,3,4]
   *
   * @param {ArrayElement|Array} item
   * @param {number} index
   *
   ***/
  'append': function(arr, item, index) {
    return arrayAppend(arr, item, index);
  },

  /***
   * @method removeAt(start, [end])
   * @returns Array
   * @short Removes element at `start`. If [end] is specified, removes the range
   *        between `start` and [end]. This method will modify the array!
   *
   * @example
   *
   *   ['a','b','c'].removeAt(0) -> ['b','c']
   *   [1,2,3,4].removeAt(1, 2)  -> [1, 4]
   *
   * @param {number} start
   * @param {number} [end]
   *
   ***/
  'removeAt': function(arr, start, end) {
    if (isUndefined(start)) return arr;
    if (isUndefined(end))   end = start;
    arr.splice(start, end - start + 1);
    return arr;
  },

  /***
   * @method unique([map])
   * @returns Array
   * @short Removes all duplicate elements in the array.
   * @extra [map] can be a string or callback type `mapFn` that returns the value
   *        to be uniqued or a string acting as a shortcut. This is most commonly
   *        used when you only need to check a single field that can ensure the
   *        object's uniqueness (such as an `id` field). If [map] is not passed,
   *        then objects will be deep checked for equality.
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
   *   [1,2,2,3].unique()            -> [1,2,3]
   *   [{a:'a'},{a:'a'}].unique()    -> [{a:'a'}]
   *
   *   users.unique(function(user) {
   *     return user.id;
   *   }); -> users array uniqued by id
   *
   *   users.unique('id')            -> users array uniqued by id
   *
   * @param {string|mapFn} map
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {NewArrayElement} mapFn
   *
   ***/
  'unique': function(arr, map) {
    return arrayUnique(arr, map);
  },

  /***
   * @method flatten([limit] = Infinity)
   * @returns Array
   * @short Returns a flattened, one-dimensional copy of the array.
   * @extra You can optionally specify a [limit], which will only flatten to
   *        that depth.
   *
   * @example
   *
   *   [[1], 2, [3]].flatten() -> [1,2,3]
   *   [[1],[],2,3].flatten()  -> [1,2,3]
   *
   * @param {number} [limit]
   *
   ***/
  'flatten': function(arr, limit) {
    return arrayFlatten(arr, limit);
  },

  /***
   * @method first([num] = 1)
   * @returns Mixed
   * @short Returns the first element(s) in the array.
   * @extra When `num` is passed, returns the first `num` elements in the array.
   *
   * @example
   *
   *   [1,2,3].first()  -> 1
   *   [1,2,3].first(2) -> [1,2]
   *
   * @param {number} [num]
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
   * @extra When `num` is passed, returns the last `num` elements in the array.
   *
   * @example
   *
   *   [1,2,3].last()  -> 3
   *   [1,2,3].last(2) -> [2,3]
   *
   * @param {number} [num]
   *
   ***/
  'last': function(arr, num) {
    if (isUndefined(num)) return arr[arr.length - 1];
    var start = arr.length - num < 0 ? 0 : arr.length - num;
    return arr.slice(start);
  },

  /***
   * @method from(index)
   * @returns Array
   * @short Returns a slice of the array from `index`.
   *
   * @example
   *
   *   ['a','b','c'].from(1) -> ['b','c']
   *   ['a','b','c'].from(2) -> ['c']
   *
   * @param {number} [index]
   *
   ***/
  'from': function(arr, num) {
    return arr.slice(num);
  },

  /***
   * @method to(index)
   * @returns Array
   * @short Returns a slice of the array up to `index`.
   *
   * @example
   *
   *   ['a','b','c'].to(1) -> ['a']
   *   ['a','b','c'].to(2) -> ['a','b']
   *
   * @param {number} [index]
   *
   ***/
  'to': function(arr, num) {
    if (isUndefined(num)) num = arr.length;
    return arr.slice(0, num);
  },

  /***
   * @method compact([all] = false)
   * @returns Array
   * @short Removes all instances of `undefined`, `null`, and `NaN` from the array.
   * @extra If [all] is `true`, all "falsy" elements will be removed. This
   *        includes empty strings, `0`, and `false`.
   *
   * @example
   *
   *   [1,null,2,undefined,3].compact() -> [1,2,3]
   *   [1,'',2,false,3].compact()       -> [1,'',2,false,3]
   *   [1,'',2,false,3].compact(true)   -> [1,2,3]
   *   [null, [null, 'bye']].compact()  -> ['hi', [null, 'bye']]
   *
   * @param {boolean} [all]
   *
   ***/
  'compact': function(arr, all) {
    return arrayCompact(arr, all);
  },

  /***
   * @method groupBy(map, [groupFn])
   * @returns Object
   * @short Groups the array by `map`.
   * @extra Will return an object whose keys are the mapped from `map`, which
   *        can be a callback of type `mapFn`, or a string acting as a shortcut.
   *        `map` supports `deep properties`. Optionally calls [groupFn] for each group.
   *
   * @callback mapFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @callback groupFn
   *
   *   arr  The current group as an array.
   *   key  The unique key of the current group.
   *   obj  A reference to the object.
   *
   * @example
   *
   *   ['a','aa','aaa'].groupBy('length') -> { 1: ['a'], 2: ['aa'], 3: ['aaa'] }
   *
   *   users.groupBy(function(n) {
   *     return n.age;
   *   }); -> users array grouped by age
   *
   *   users.groupBy('age', function(age, users) {
   *     // iterates each grouping
   *   });
   *
   * @param {string|mapFn} map
   * @param {groupFn} groupFn
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackParam {string} key
   * @callbackParam {Object} obj
   * @callbackReturns {NewArrayElement} mapFn
   *
   ***/
  'groupBy': function(arr, map, groupFn) {
    return arrayGroupBy(arr, map, groupFn);
  },

  /***
   * @method inGroups(num, [padding])
   * @returns Array
   * @short Groups the array into `num` arrays.
   * @extra If specified, [padding] will be added to the last array to be of
   *        equal length.
   *
   * @example
   *
   *   [1,2,3,4,5,6,7].inGroups(3)    -> [[1,2,3],[4,5,6],[7]]
   *   [1,2,3,4,5,6,7].inGroups(3, 0) -> [[1,2,3],[4,5,6],[7,0,0]]
   *
   * @param {number} num
   * @param {any} [padding]
   *
   ***/
  'inGroups': function(arr, num, padding) {
    var pad = isDefined(padding);
    var result = new Array(num);
    var divisor = ceil(arr.length / num);
    simpleRepeat(num, function(i) {
      var index = i * divisor;
      var group = arr.slice(index, index + divisor);
      if (pad && group.length < divisor) {
        simpleRepeat(divisor - group.length, function() {
          group.push(padding);
        });
      }
      result[i] = group;
    });
    return result;
  },

  /***
   * @method inGroupsOf(num, [padding] = null)
   * @returns Array
   * @short Groups the array into arrays of `num` elements each.
   * @extra [padding] will be added to the last array to be of equal length.
   *
   * @example
   *
   *   [1,2,3,4,5,6,7].inGroupsOf(4)    -> [ [1,2,3,4], [5,6,7] ]
   *   [1,2,3,4,5,6,7].inGroupsOf(4, 0) -> [ [1,2,3,4], [5,6,7,0] ]
   *
   * @param {number} num
   * @param {any} [padding]
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
   * @method shuffle()
   * @returns Array
   * @short Returns a copy of the array with the elements randomized.
   * @extra Uses Fisher-Yates algorithm.
   *
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
   * @extra If [num] is passed, will return an array of [num] elements. If
   *        [remove] is true, sampled elements will also be removed from the
   *        array. [remove] can also be passed in place of [num].
   *
   * @example
   *
   *   [1,2,3,4,5].sample()  -> // Random element
   *   [1,2,3,4,5].sample(1) -> // Array of 1 random element
   *   [1,2,3,4,5].sample(3) -> // Array of 3 random elements
   *
   * @param {number} [num]
   * @param {boolean} [remove]
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
   * @method sortBy([map], [desc] = false)
   * @returns Array
   * @short Enhanced sorting function that will sort the array by `map`.
   * @extra `map` can be a function of type `sortMapFn`, a string acting as a
   *        shortcut, an array (comparison by multiple values), or blank (direct
   *        comparison of array values). `map` supports `deep properties`.
   *        [desc] will sort the array in descending order. When the field being
   *        sorted on is a string, the resulting order will be determined by an
   *        internal collation algorithm that is optimized for major Western
   *        languages, but can be customized using sorting accessors such as
   *        `sortIgnore`. This method will modify the array!
   *
   * @callback sortMapFn
   *
   *   el   An array element.
   *
   * @example
   *
   *   ['world','a','new'].sortBy('length')       -> ['a','new','world']
   *   ['world','a','new'].sortBy('length', true) -> ['world','new','a']
   *   users.sortBy(function(n) {
   *     return n.age;
   *   }); -> users array sorted by age
   *   users.sortBy('age') -> users array sorted by age
   *
   * @param {string|sortMapFn} [map]
   * @param {boolean} [desc]
   * @callbackParam {ArrayElement} el
   * @callbackReturns {NewArrayElement} sortMapFn
   *
   ***/
  'sortBy': function(arr, map, desc) {
    arr.sort(function(a, b) {
      var aProperty = mapWithShortcuts(a, map, arr, [a]);
      var bProperty = mapWithShortcuts(b, map, arr, [b]);
      return compareValue(aProperty, bProperty) * (desc ? -1 : 1);
    });
    return arr;
  },

  /***
   * @method remove(search)
   * @returns Array
   * @short Removes any element in the array that matches `search`.
   * @extra `search` can be an array element or a function of type `searchFn`.
   *        This method will modify the array! Use `exclude` for a
   *        non-destructive alias. This method implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3].remove(3)         -> [1,2]
   *   ['a','b','c'].remove(/b/) -> ['a','c']
   *   [{a:1},{b:2}].remove(function(n) {
   *     return n['a'] == 1;
   *   }); -> [{b:2}]
   *
   * @param {ArrayElement|searchFn} search
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'remove': function(arr, f) {
    return arrayRemove(arr, f);
  },

  /***
   * @method exclude(search)
   * @returns Array
   * @short Returns a new array with every element that does not match `search`.
   * @extra `search` can be an array element or a function of type `searchFn`.
   *        This method can be thought of as the inverse of `Array#filter`. It
   *        will not modify the original array, Use `remove` to modify the
   *        array in place. Implements `enhanced matching`.
   *
   * @callback searchFn
   *
   *   el   The element of the current iteration.
   *   i    The index of the current iteration.
   *   arr  A reference to the array.
   *
   * @example
   *
   *   [1,2,3].exclude(3)         -> [1,2]
   *   ['a','b','c'].exclude(/b/) -> ['a','c']
   *   [{a:1},{b:2}].exclude(function(n) {
   *     return n['a'] == 1;
   *   }); -> [{b:2}]
   *
   * @param {ArrayElement|searchFn} search
   * @callbackParam {ArrayElement} el
   * @callbackParam {number} i
   * @callbackParam {Array} arr
   * @callbackReturns {boolean} searchFn
   *
   ***/
  'exclude': function(arr, f) {
    return arrayExclude(arr, f);
  },

  /***
   * @method union(arr)
   * @returns Array
   * @short Returns a new array containing elements in both arrays with
   *        duplicates removed.
   * @extra In addition to primitives, this method will also deep-check objects
   *        for equality.
   *
   * @example
   *
   *   [1,3,5].union([5,7,9])     -> [1,3,5,7,9]
   *   ['a','b'].union(['b','c']) -> ['a','b','c']
   *
   * @param {Array} arr
   *
   ***/
  'union': function(arr1, arr2) {
    return arrayUnique(arrayConcat(arr1, arr2));
  },

  /***
   * @method intersect(arr)
   * @returns Array
   * @short Returns a new array containing any elements that both arrays have in
   *        common.
   * @extra In addition to primitives, this method will also deep-check objects
   *        for equality.
   *
   * @example
   *
   *   [1,3,5].intersect([5,7,9])     -> [5]
   *   ['a','b'].intersect(['b','c']) -> ['b']
   *
   * @param {Array} arr
   *
   ***/
  'intersect': function(arr1, arr2) {
    return arrayIntersectOrSubtract(arr1, arr2, false);
  }

});

defineInstanceWithArguments(sugarArray, {

  /***
   * @method zip([arr1], [arr2], ...)
   * @returns Array
   * @short Merges multiple arrays together.
   * @extra This method "zips up" smaller arrays into one large whose elements
   *        are "all elements at index 0", "all elements at index 1", etc.
   *        Useful when you have associated data that is split over separated
   *        arrays. If the arrays passed have more elements than the original
   *        array, they will be discarded. If they have fewer elements, the
   *        missing elements will filled with `null`.
   *
   * @example
   *
   *   [1,2,3].zip([4,5,6]) -> [[1,2], [3,4], [5,6]]
   *
   * @param {Array} arr1
   * @param {Array} arr2
   *
   ***/
  'zip': function(arr, args) {
    return map(arr, function(el, i) {
      return [el].concat(map(args, function(k) {
        return (i in k) ? k[i] : null;
      }));
    });
  }

});

/***
 * @method insert(item, [index])
 * @returns Array
 * @short Appends `item` to the array at [index].
 * @extra This method is simply a more readable alias for `append` when passing
 *        an index. If `el` is an array it will be joined. This method modifies
 *        the array! Use `add` as a non-destructive alias.
 *
 * @example
 *
 *   [1,3,4,5].insert(2, 1)     -> [1,2,3,4,5]
 *   [1,4,5,6].insert([2,3], 1) -> [1,2,3,4,5,6]
 *
 * @param {ArrayElement|Array} item
 * @param {number} [index]
 *
 ***/
alias(sugarArray, 'insert', 'append');

setArrayChainableConstructor();
