'use strict';

/***
 * @package Array
 * @dependency core
 * @description Array manipulation and traversal, alphanumeric sorting and collation.
 *
 ***/

var HALF_WIDTH_NINE = 0x39;
var FULL_WIDTH_NINE = 0xff19;


function arrayClone(arr) {
  var clone = [], i = arr.length;
  while(i--) {
    if (i in arr) {
      clone[i] = arr[i];
    }
  }
  return clone;
}

function arrayAppend(arr, el, index) {
  index = +index;
  if (isNaN(index)) {
    index = arr.length;
  }
  arr.splice.apply(arr, [index, 0].concat(el));
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
  var result = [], o = {}, transformed;
  forEach(arr, function(el, i) {
    transformed = map ? mapWithShortcuts(el, map, arr, [el, i, arr]) : el;
    if (!checkForElementInHashAndSet(o, transformed)) {
      result.push(el);
    }
  })
  return result;
}

function arrayFlatten(arr, level, current) {
  level = level || Infinity;
  current = current || 0;
  var result = [];
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
  var result = [];
  forEach(arr, function(el, i) {
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

function arrayGroupBy(arr, map, fn) {
  var result = {}, key;
  forEach(arr, function(el, index) {
    key = mapWithShortcuts(el, map, arr, [el, index, arr]);
    if (!result[key]) result[key] = [];
    result[key].push(el);
  });
  if (fn) {
    iterateOverObject(result, fn);
  }
  return result;
}

function arrayIntersectOrSubtract(arr1, args, subtract) {
  var result = [], o = {}, arr2 = [].concat.apply([], args);
  forEach(arr2, function(el) {
    checkForElementInHashAndSet(o, el);
  });
  forEach(arr1, function(el) {
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

// Array diff helpers

function elementExistsInHash(hash, key, element, isReference) {
  var exists;
  if (isReference) {
    if (!hash[key]) {
      hash[key] = [];
    }
    exists = indexOf(hash[key], element) !== -1;
  } else {
    exists = hasOwn(hash, key);
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

// Collation helpers

function compareValue(aVal, bVal) {
  var cmp, i, collate;
  if (isString(aVal) && isString(bVal)) {
    collate = _sortCollate();
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
  } else if (aVal < bVal) {
    return -1;
  } else if (aVal > bVal) {
    return 1;
  } else {
    return 0;
  }

}

function codeIsNumeral(code) {
  return (code >= HALF_WIDTH_ZERO && code <= HALF_WIDTH_NINE) ||
         (code >= FULL_WIDTH_ZERO && code <= FULL_WIDTH_NINE);
}

function collateStrings(a, b) {
  var aValue, bValue, aChar, bChar, aEquiv, bEquiv, index = 0, tiebreaker = 0;

  var sortOrder       = _sortOrder();
  var sortIgnore      = _sortIgnore();
  var naturalSort     = _sortNatural();
  var sortIgnoreCase  = _sortIgnoreCase();
  var sortEquivalents = _sortEquivalents();

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

function getSortOrder() {
  var order = 'AÁÀÂÃĄBCĆČÇDĎÐEÉÈĚÊËĘFGĞHıIÍÌİÎÏJKLŁMNŃŇÑOÓÒÔPQRŘSŚŠŞTŤUÚÙŮÛÜVWXYÝZŹŻŽÞÆŒØÕÅÄÖ';
  return map(order.split(''), function(str) {
    return str + str.toLowerCase();
  }).join('');
}

function getSortEquivalents() {
  var equivalents = {};
  forEach(commaSplit('AÁÀÂÃÄ,CÇ,EÉÈÊË,IÍÌİÎÏ,OÓÒÔÕÖ,Sß,UÚÙÛÜ'), function(set) {
    var first = set.charAt(0);
    forEach(set.slice(1).split(''), function(chr) {
      equivalents[chr] = first;
      equivalents[chr.toLowerCase()] = first.toLowerCase();
    });
  });
  return equivalents;
}


/***
 * @method Array.sortIgnore([reg])
 * @returns Mixed
 * @short Gets or sets a regex that will ignore matches when sorting (for example punctuation).
 * @extra Used by `Array#sortBy`. (Default is `null`)
 *
 ***
 * @method Array.sortIgnoreCase([bool])
 * @returns Mixed
 * @short Gets or sets a boolean that converts strings to lowercase when sorting.
 * @extra Used by `Array#sortBy`. (Default is `true`);
 *
 ***
 * @method Array.sortNatural([bool])
 * @returns Mixed
 * @short Gets or sets a boolean that turns on natural sort mode.
 * @extra Used by `Array#sortBy`. "Natural sort" means that numerals like "10" will be sorted naturally after "9" instead of after "1". (Default is `true`)
 *
 ***
 * @method Array.sortCollate([fn])
 * @returns Mixed
 * @short Gets or sets the collation function used when sorting strings.
 * @extra Used by `Array#sortBy`. The default is a natural string sort based on other `sort` options. Setting the collation function directly here will override all these options. Setting to `null` restores the default.
 *
 ***
 * @method Array.sortOrder([str])
 * @returns Mixed
 * @short Gets or sets the base order as a string of characters to apply when sorting.
 * @extra Used by `Array#sortBy`. The default is an order natural to most major world languages, but can be modified as needed. Setting to `null` restores the default.
 *
 ***
 * @method Array.sortEquivalents([obj])
 * @returns Mixed
 * @short Gets or sets a table of characters that should be considered equivalent when sorting (for example "é" and "e").
 * @extra Used by `Array#sortBy`. The default table produces a natural sort order for most world languages, however can be modified for others. For example, setting "ä" and "ö" to `null` in the table would produce a perfect Scandanavian sort order. Setting [obj] to `null` restores the default, however if the table is mutated changes will persist.
 *
 ***/

var _sortIgnore      = defineAccessor(sugarArray, 'sortIgnore');
var _sortNatural     = defineAccessor(sugarArray, 'sortNatural', true);
var _sortIgnoreCase  = defineAccessor(sugarArray, 'sortIgnoreCase', true);

var _sortOrder       = defineAccessor(sugarArray, 'sortOrder', getSortOrder());
var _sortCollate     = defineAccessor(sugarArray, 'sortCollate', collateStrings);
var _sortEquivalents = defineAccessor(sugarArray, 'sortEquivalents', getSortEquivalents());


defineStatic(sugarArray, {

  /***
   *
   * @method Array.construct(<n>, <fn>)
   * @returns Array
   * @short Constructs an array of <n> length from the values of <fn>, which is passed a single index argument.
   * @example
   *
   *   Array.construct(3, parseInt) -> [0, 1, 2]
   *   Array.construct(3, function(i) {
   *     return i * i;
   *   }); -> [0, 1, 4]
   *
   ***/
  'construct': function(n, fn) {
    return Array.from(new Array(+n), function(el, i) {
      return fn && fn(i);
    });
  }

});

defineInstance(sugarArray, {

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
   * @method at(<index>, [loop] = true)
   * @returns Mixed
   * @short Gets the element(s) at a given index.
   * @extra When [loop] is true, overshooting the end of the array (or the beginning) will begin counting from the other end. If <index> is an array, multiple elements will be returned.
   * @example
   *
   *   [1,2,3].at(0)        -> 1
   *   [1,2,3].at(2)        -> 3
   *   [1,2,3].at(4)        -> 2
   *   [1,2,3].at(4, false) -> null
   *   [1,2,3].at(-1)       -> 3
   *   [1,2,3].at([0, 1])   -> [1, 2]
   *
   ***/
  'at': function(arr, index, loop) {
    return getEntriesForIndexes(arr, index, loop);
  },

  /***
   * @method append(<item>, [index])
   * @returns Array
   * @short Appends <item> to the array.
   * @extra If [index] is specified, it will append at [index], otherwise appends to the end of the array. `append` behaves like `concat` in that if <el> is an array it will be joined, not inserted. This method will change the array! Use `add` for a non-destructive alias. Also, `insert` is provided as an alias that reads better when using an index.
   * @example
   *
   *   [1,2,3,4].append(5)       -> [1,2,3,4,5]
   *   [1,2,3,4].append([5,6,7]) -> [1,2,3,4,5,6,7]
   *   [1,2,3,4].insert(8, 1) -> [1,8,2,3,4]
   *
   ***/
  'append': function(arr, item, index) {
    return arrayAppend(arr, item, index);
  },

  /***
   * @method add(<item>, [index])
   * @returns Array
   * @short Adds <item> to the array and returns the result as a new array.
   * @extra If <item> is also an array, it will be joined to the array instead of inserted, making this essentially a more readable alias for `concat` with the added ability to specify the index to add at.
   * @example
   *
   *   [1,2,3,4].add(5)       -> [1,2,3,4,5]
   *   [1,2,3,4].add(8, 1)    -> [1,8,2,3,4]
   *   [1,2,3,4].add([5,6,7]) -> [1,2,3,4,5,6,7]
   *
   ***/
  'add': function(arr, item, index) {
    return arrayAppend(arrayClone(arr), item, index);
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
   * @method sortBy(<map>, [desc] = false)
   * @returns Array
   * @short Returns a copy of the array sorted by <map>.
   * @extra <map> may be a function, a string acting as a shortcut, an array (comparison by multiple values), or blank (direct comparison of array values). [desc] will sort the array in descending order. When the field being sorted on is a string, the resulting order will be determined by an internal collation algorithm that is optimized for major Western languages, but can be customized. For more information see %array_sorting%.
   * @example
   *
   *   ['world','a','new'].sortBy('length')       -> ['a','new','world']
   *   ['world','a','new'].sortBy('length', true) -> ['world','new','a']
   *   [{age:72},{age:13}].sortBy(function(n) {
   *     return n.age;
   *   }); -> [{age:13},{age:72}]
   *
   ***/
  'sortBy': function(arr, map, desc) {
    var arr = arrayClone(arr);
    arr.sort(function(a, b) {
      var aProperty = mapWithShortcuts(a, map, arr, [a]);
      var bProperty = mapWithShortcuts(b, map, arr, [b]);
      return compareValue(aProperty, bProperty) * (desc ? -1 : 1);
    });
    return arr;
  },

  /***
   * @method remove(<f>)
   * @returns Array
   * @short Removes any element in the array that matches <f>.
   * @extra This method will change the array! Use `exclude` for a non-destructive alias. This method implements `matching shortcuts`.
   * @example
   *
   *   [1,2,3].remove(3)         -> [1,2]
   *   ['a','b','c'].remove(/b/) -> ['a','c']
   *   [{a:1},{b:2}].remove(function(n) {
   *     return n['a'] == 1;
   *   }); -> [{b:2}]
   *
   ***/
  'remove': function(arr, f) {
    return arrayRemove(arr, f);
  },

  /***
   * @method exclude(<f>)
   * @returns Array
   * @short Returns a new array with every element matching <f> removed.
   * @extra This is a non-destructive alias for `remove`. It will not change the original array. This method implements `matching shortcuts`.
   * @example
   *
   *   [1,2,3].exclude(3)         -> [1,2]
   *   ['a','b','c'].exclude(/b/) -> ['a','c']
   *   [{a:1},{b:2}].exclude(function(n) {
   *     return n['a'] == 1;
   *   }); -> [{b:2}]
   *
   ***/
  'exclude': function(arr, f) {
    return arrayExclude(arr, f);
  }

});


defineInstanceWithArguments(sugarArray, {

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
    return arrayIntersectOrSubtract(arr, args, false);
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
      return [el].concat(map(args, function(k) {
        return (i in k) ? k[i] : null;
      }));
    });
  }

});

/***
 * @method insert()
 * @alias append
 *
 ***/
alias(sugarArray, 'insert', 'append');
