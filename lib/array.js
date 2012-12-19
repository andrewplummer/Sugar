

  /***
   * @package Array
   * @dependency core
   * @description Array manipulation and traversal, "fuzzy matching" against elements, alphanumeric sorting and collation, enumerable methods on Object.
   *
   ***/


  function multiMatch(el, match, scope, params) {
    var result = true;
    if(el === match) {
      // Match strictly equal values up front.
      return true;
    } else if(isRegExp(match) && isString(el)) {
      // Match against a regexp
      return regexp(match).test(el);
    } else if(isFunction(match)) {
      // Match against a filtering function
      return match.apply(scope, params);
    } else if(isObject(match) && isObjectPrimitive(el)) {
      // Match against a hash or array.
      iterateOverObject(match, function(key, value) {
        if(!multiMatch(el[key], match[key], scope, [el[key], el])) {
          result = false;
        }
      });
      return result;
    } else {
      return isEqual(el, match);
    }
  }

  function transformArgument(el, map, context, mapArgs) {
    if(isUndefined(map)) {
      return el;
    } else if(isFunction(map)) {
      return map.apply(context, mapArgs || []);
    } else if(isFunction(el[map])) {
      return el[map].call(el);
    } else {
      return el[map];
    }
  }

  // Basic array internal methods

  function arrayEach(arr, fn, startIndex, loop) {
    var length, index, i;
    if(startIndex < 0) startIndex = arr.length + startIndex;
    i = isNaN(startIndex) ? 0 : startIndex;
    length = loop === true ? arr.length + i : arr.length;
    while(i < length) {
      index = i % arr.length;
      if(!(index in arr)) {
        return iterateOverSparseArray(arr, fn, i, loop);
      } else if(fn.call(arr, arr[index], index, arr) === false) {
        break;
      }
      i++;
    }
  }

  function iterateOverSparseArray(arr, fn, fromIndex, loop) {
    var indexes = [], i;
    for(i in arr) {
      if(isArrayIndex(arr, i) && i >= fromIndex) {
        indexes.push(parseInt(i));
      }
    }
    indexes.sort().each(function(index) {
      return fn.call(arr, arr[index], index, arr);
    });
    return arr;
  }

  function isArrayIndex(arr, i) {
    return i in arr && toUInt32(i) == i && i != 0xffffffff;
  }

  function toUInt32(i) {
    return i >>> 0;
  }

  function arrayFind(arr, f, startIndex, loop, returnIndex) {
    var result, index;
    arrayEach(arr, function(el, i, arr) {
      if(multiMatch(el, f, arr, [el, i, arr])) {
        result = el;
        index = i;
        return false;
      }
    }, startIndex, loop);
    return returnIndex ? index : result;
  }

  function arrayUnique(arr, map) {
    var result = [], o = {}, transformed;
    arrayEach(arr, function(el, i) {
      transformed = map ? transformArgument(el, map, arr, [el, i, arr]) : el;
      if(!checkForElementInHashAndSet(o, transformed)) {
        result.push(el);
      }
    })
    return result;
  }

  function arrayIntersect(arr1, arr2, subtract) {
    var result = [], o = {};
    arr2.each(function(el) {
      checkForElementInHashAndSet(o, el);
    });
    arr1.each(function(el) {
      var stringified = stringify(el),
          isReference = !objectIsMatchedByValue(el);
      // Add the result to the array if:
      // 1. We're subtracting intersections or it doesn't already exist in the result and
      // 2. It exists in the compared array and we're adding, or it doesn't exist and we're removing.
      if(elementExistsInHash(o, stringified, el, isReference) != subtract) {
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
      if(isArray(el) && current < level) {
        result = result.concat(arrayFlatten(el, level, current + 1));
      } else {
        result.push(el);
      }
    });
    return result;
  }

  function flatArguments(args) {
    var result = [];
    multiArgs(args, function(arg) {
      result = result.concat(arg);
    });
    return result;
  }

  function elementExistsInHash(hash, key, element, isReference) {
    var exists = key in hash;
    if(isReference) {
      if(!hash[key]) {
        hash[key] = [];
      }
      exists = hash[key].indexOf(element) !== -1;
    }
    return exists;
  }

  function checkForElementInHashAndSet(hash, element) {
    var stringified = stringify(element),
        isReference = !objectIsMatchedByValue(element),
        exists = elementExistsInHash(hash, stringified, element, isReference);
    if(isReference) {
      hash[stringified].push(element);
    } else {
      hash[stringified] = element;
    }
    return exists;
  }

  function discardElementFromHash(hash, key, element, isReference) {
    var arr, i = 0;
    if(isReference) {
      arr = hash[key];
      while(i < arr.length) {
        if(arr[i] === element) {
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
    var edge,
        result = [],
        max = which === 'max',
        min = which === 'min',
        isArray = Array.isArray(obj);
    iterateOverObject(obj, function(key) {
      var el   = obj[key],
          test = transformArgument(el, map, obj, isArray ? [el, parseInt(key), obj] : []);
      if(isUndefined(test)) {
        throw new TypeError('Cannot compare with undefined');
      }
      if(test === edge) {
        result.push(el);
      } else if(isUndefined(edge) || (max && test > edge) || (min && test < edge)) {
        result = [el];
        edge = test;
      }
    });
    if(!isArray) result = arrayFlatten(result, 1);
    return all ? result : result[0];
  }


  // Alphanumeric collation helpers

  function collateStrings(a, b) {
    var aValue, bValue, aChar, bChar, aEquiv, bEquiv, index = 0, tiebreaker = 0;
    a = getCollationReadyString(a);
    b = getCollationReadyString(b);
    do {
      aChar  = getCollationCharacter(a, index);
      bChar  = getCollationCharacter(b, index);
      aValue = getCollationValue(aChar);
      bValue = getCollationValue(bChar);
      if(aValue === -1 || bValue === -1) {
        aValue = a.charCodeAt(index) || null;
        bValue = b.charCodeAt(index) || null;
      }
      aEquiv = aChar !== a.charAt(index);
      bEquiv = bChar !== b.charAt(index);
      if(aEquiv !== bEquiv && tiebreaker === 0) {
        tiebreaker = aEquiv - bEquiv;
      }
      index += 1;
    } while(aValue != null && bValue != null && aValue === bValue);
    if(aValue === bValue) return tiebreaker;
    return aValue < bValue ? -1 : 1;
  }

  function getCollationReadyString(str) {
    if(array[AlphanumericSortIgnoreCase]) {
      str = str.toLowerCase();
    }
    return str.replace(array[AlphanumericSortIgnore], '');
  }

  function getCollationCharacter(str, index) {
    var chr = str.charAt(index), eq = array[AlphanumericSortEquivalents] || {};
    return eq[chr] || chr;
  }

  function getCollationValue(chr) {
    var order = array[AlphanumericSortOrder];
    if(!chr) {
      return null;
    } else {
      return order.indexOf(chr);
    }
  }

  var AlphanumericSortOrder       = 'AlphanumericSortOrder';
  var AlphanumericSortIgnore      = 'AlphanumericSortIgnore';
  var AlphanumericSortIgnoreCase  = 'AlphanumericSortIgnoreCase';
  var AlphanumericSortEquivalents = 'AlphanumericSortEquivalents';



  function buildEnhancements() {
    var callbackCheck = function() { var a = arguments; return a.length > 0 && !isFunction(a[0]); };
    extendSimilar(array, true, callbackCheck, 'map,every,all,some,any,none,filter', function(methods, name) {
      methods[name] = function(f) {
        return this[name](function(el, index) {
          if(name === 'map') {
            return transformArgument(el, f, this, [el, index, this]);
          } else {
            return multiMatch(el, f, this, [el, index, this]);
          }
        });
      }
    });
  }

  function buildAlphanumericSort() {
    var order = 'AÁÀÂÃĄBCĆČÇDĎÐEÉÈĚÊËĘFGĞHıIÍÌİÎÏJKLŁMNŃŇÑOÓÒÔPQRŘSŚŠŞTŤUÚÙŮÛÜVWXYÝZŹŻŽÞÆŒØÕÅÄÖ';
    var equiv = 'AÁÀÂÃÄ,CÇ,EÉÈÊË,IÍÌİÎÏ,OÓÒÔÕÖ,Sß,UÚÙÛÜ';
    array[AlphanumericSortOrder] = order.split('').map(function(str) {
      return str + str.toLowerCase();
    }).join('');
    var equivalents = {};
    arrayEach(equiv.split(','), function(set) {
      var equivalent = set.charAt(0);
      arrayEach(set.slice(1).split(''), function(chr) {
        equivalents[chr] = equivalent;
        equivalents[chr.toLowerCase()] = equivalent.toLowerCase();
      });
    });
    array[AlphanumericSortIgnoreCase] = true;
    array[AlphanumericSortEquivalents] = equivalents;
  }

  extend(array, false, false, {

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
     +   Array.create(function(n) {
     *     return arguments;
     *   }('howdy', 'doody'));
     *
     ***/
    'create': function() {
      var result = [], tmp;
      multiArgs(arguments, function(a) {
        if(isObjectPrimitive(a)) {
          try {
            tmp = array.prototype.slice.call(a, 0);
            if(tmp.length > 0) {
              a = tmp;
            }
          } catch(e) {};
        }
        result = result.concat(a);
      });
      return result;
    }

  });

  extend(array, true, false, {

    /***
     * @method find(<f>, [index] = 0, [loop] = false)
     * @returns Mixed
     * @short Returns the first element that matches <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Starts at [index], and will continue once from index = 0 if [loop] is true. This method implements @array_matching.
     * @example
     *
     +   [{a:1,b:2},{a:1,b:3},{a:1,b:4}].find(function(n) {
     *     return n['a'] == 1;
     *   });                                     -> {a:1,b:3}
     *   ['cuba','japan','canada'].find(/^c/, 2) -> 'canada'
     *
     ***/
    'find': function(f, index, loop) {
      return arrayFind(this, f, index, loop);
    },

    /***
     * @method findAll(<f>, [index] = 0, [loop] = false)
     * @returns Array
     * @short Returns all elements that match <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Starts at [index], and will continue once from index = 0 if [loop] is true. This method implements @array_matching.
     * @example
     *
     +   [{a:1,b:2},{a:1,b:3},{a:2,b:4}].findAll(function(n) {
     *     return n['a'] == 1;
     *   });                                        -> [{a:1,b:3},{a:1,b:4}]
     *   ['cuba','japan','canada'].findAll(/^c/)    -> 'cuba','canada'
     *   ['cuba','japan','canada'].findAll(/^c/, 2) -> 'canada'
     *
     ***/
    'findAll': function(f, index, loop) {
      var result = [];
      arrayEach(this, function(el, i, arr) {
        if(multiMatch(el, f, arr, [el, i, arr])) {
          result.push(el);
        }
      }, index, loop);
      return result;
    },

    /***
     * @method findIndex(<f>, [startIndex] = 0, [loop] = false)
     * @returns Number
     * @short Returns the index of the first element that matches <f> or -1 if not found.
     * @extra This method has a few notable differences to native %indexOf%. Although <f> will similarly match a primitive such as a string or number, it will also match deep objects and arrays that are not equal by reference (%===%). Additionally, if a function is passed it will be run as a matching function (similar to the behavior of %Array#filter%) rather than attempting to find that function itself by reference in the array. Starts at [index], and will continue once from index = 0 if [loop] is true. This method implements @array_matching.
     * @example
     *
     +   [1,2,3,4].findIndex(3);  -> 2
     +   [1,2,3,4].findIndex(function(n) {
     *     return n % 2 == 0;
     *   }); -> 1
     +   ['one','two','three'].findIndex(/th/); -> 2
     *
     ***/
    'findIndex': function(f, startIndex, loop) {
      var index = arrayFind(this, f, startIndex, loop, true);
      return isUndefined(index) ? -1 : index;
    },

    /***
     * @method count(<f>)
     * @returns Number
     * @short Counts all elements in the array that match <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. This method implements @array_matching.
     * @example
     *
     *   [1,2,3,1].count(1)       -> 2
     *   ['a','b','c'].count(/b/) -> 1
     +   [{a:1},{b:2}].count(function(n) {
     *     return n['a'] > 1;
     *   });                      -> 0
     *
     ***/
    'count': function(f) {
      if(isUndefined(f)) return this.length;
      return this.findAll(f).length;
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
    'removeAt': function(start, end) {
      var i, len;
      if(isUndefined(start)) return this;
      if(isUndefined(end)) end = start;
      for(i = 0, len = end - start; i <= len; i++) {
        this.splice(start, 1);
      }
      return this;
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
    'include': function(el, index) {
      return this.clone().add(el, index);
    },

    /***
     * @method exclude([f1], [f2], ...)
     * @returns Array
     * @short Removes any element in the array that matches [f1], [f2], etc.
     * @extra This is a non-destructive alias for %remove%. It will not change the original array. This method implements @array_matching.
     * @example
     *
     *   [1,2,3].exclude(3)         -> [1,2]
     *   ['a','b','c'].exclude(/b/) -> ['a','c']
     +   [{a:1},{b:2}].exclude(function(n) {
     *     return n['a'] == 1;
     *   });                       -> [{b:2}]
     *
     ***/
    'exclude': function() {
      return array.prototype.remove.apply(this.clone(), arguments);
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
    'clone': function() {
      return simpleMerge([], this);
    },

    /***
     * @method unique([map] = null)
     * @returns Array
     * @short Removes all duplicate elements in the array.
     * @extra [map] may be a function mapping the value to be uniqued on or a string acting as a shortcut. This is most commonly used when you have a key that ensures the object's uniqueness, and don't need to check all fields. This method will also correctly operate on arrays of objects.
     * @example
     *
     *   [1,2,2,3].unique()                 -> [1,2,3]
     *   [{foo:'bar'},{foo:'bar'}].unique() -> [{foo:'bar'}]
     +   [{foo:'bar'},{foo:'bar'}].unique(function(obj){
     *     return obj.foo;
     *   }); -> [{foo:'bar'}]
     *   [{foo:'bar'},{foo:'bar'}].unique('foo') -> [{foo:'bar'}]
     *
     ***/
    'unique': function(map) {
      return arrayUnique(this, map);
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
    'flatten': function(limit) {
      return arrayFlatten(this, limit);
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
    'union': function() {
      return arrayUnique(this.concat(flatArguments(arguments)));
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
    'intersect': function() {
      return arrayIntersect(this, flatArguments(arguments), false);
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
    'subtract': function(a) {
      return arrayIntersect(this, flatArguments(arguments), true);
    },

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
     *   [1,2,3].at(0,1)      -> [1,2]
     *
     ***/
    'at': function() {
      return entryAtIndex(this, arguments);
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
    'first': function(num) {
      if(isUndefined(num)) return this[0];
      if(num < 0) num = 0;
      return this.slice(0, num);
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
    'last': function(num) {
      if(isUndefined(num)) return this[this.length - 1];
      var start = this.length - num < 0 ? 0 : this.length - num;
      return this.slice(start);
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
    'from': function(num) {
      return this.slice(num);
    },

    /***
     * @method to(<index>)
     * @returns Array
     * @short Returns a slice of the array up to <index>.
     * @example
     *
     *   [1,2,3].to(1)  -> [1]
     *   [1,2,3].to(2)  -> [1,2]
     *
     ***/
    'to': function(num) {
      if(isUndefined(num)) num = this.length;
      return this.slice(0, num);
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
     +   ['fee','fo','fum'].min(function(n) {
     *     return n.length;
     *   });                              -> ['fo']
     +   [{a:3,a:2}].min(function(n) {
     *     return n['a'];
     *   });                              -> [{a:2}]
     *
     ***/
    'min': function(map, all) {
      return getMinOrMax(this, map, 'min', all);
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
     +   [{a:3,a:2}].max(function(n) {
     *     return n['a'];
     *   });                              -> {a:3}
     *
     ***/
    'max': function(map, all) {
      return getMinOrMax(this, map, 'max', all);
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
     +   [{age:35,name:'ken'},{age:12,name:'bob'},{age:12,name:'ted'}].least(function(n) {
     *     return n.age;
     *   });                               -> [{age:35,name:'ken'}]
     *
     ***/
    'least': function(map, all) {
      return getMinOrMax(this.groupBy.apply(this, [map]), 'length', 'min', all);
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
     +   [{age:35,name:'ken'},{age:12,name:'bob'},{age:12,name:'ted'}].most(function(n) {
     *     return n.age;
     *   });                              -> [{age:12,name:'bob'},{age:12,name:'ted'}]
     *
     ***/
    'most': function(map, all) {
      return getMinOrMax(this.groupBy.apply(this, [map]), 'length', 'max', all);
    },

    /***
     * @method sum([map])
     * @returns Number
     * @short Sums all values in the array.
     * @extra [map] may be a function mapping the value to be summed or a string acting as a shortcut.
     * @example
     *
     *   [1,2,2].sum()                           -> 5
     +   [{age:35},{age:12},{age:12}].sum(function(n) {
     *     return n.age;
     *   });                                     -> 59
     *   [{age:35},{age:12},{age:12}].sum('age') -> 59
     *
     ***/
    'sum': function(map) {
      var arr = map ? this.map(map) : this;
      return arr.length > 0 ? arr.reduce(function(a,b) { return a + b; }) : 0;
    },

    /***
     * @method average([map])
     * @returns Number
     * @short Averages all values in the array.
     * @extra [map] may be a function mapping the value to be averaged or a string acting as a shortcut.
     * @example
     *
     *   [1,2,3].average()                           -> 2
     +   [{age:35},{age:11},{age:11}].average(function(n) {
     *     return n.age;
     *   });                                         -> 19
     *   [{age:35},{age:11},{age:11}].average('age') -> 19
     *
     ***/
    'average': function(map) {
      var arr = map ? this.map(map) : this;
      return arr.length > 0 ? arr.sum() / arr.length : 0;
    },

    /***
     * @method inGroups(<num>, [padding])
     * @returns Array
     * @short Groups the array into <num> arrays.
     * @extra [padding] specifies a value with which to pad the last array so that they are all equal length.
     * @example
     *
     *   [1,2,3,4,5,6,7].inGroups(3)         -> [ [1,2,3], [4,5,6], [7] ]
     *   [1,2,3,4,5,6,7].inGroups(3, 'none') -> [ [1,2,3], [4,5,6], [7,'none','none'] ]
     *
     ***/
    'inGroups': function(num, padding) {
      var pad = arguments.length > 1;
      var arr = this;
      var result = [];
      var divisor = ceil(this.length / num);
      getRange(0, num - 1, function(i) {
        var index = i * divisor;
        var group = arr.slice(index, index + divisor);
        if(pad && group.length < divisor) {
          getRange(1, divisor - group.length, function() {
            group = group.add(padding);
          });
        }
        result.push(group);
      });
      return result;
    },

    /***
     * @method inGroupsOf(<num>, [padding] = null)
     * @returns Array
     * @short Groups the array into arrays of <num> elements each.
     * @extra [padding] specifies a value with which to pad the last array so that they are all equal length.
     * @example
     *
     *   [1,2,3,4,5,6,7].inGroupsOf(4)         -> [ [1,2,3,4], [5,6,7] ]
     *   [1,2,3,4,5,6,7].inGroupsOf(4, 'none') -> [ [1,2,3,4], [5,6,7,'none'] ]
     *
     ***/
    'inGroupsOf': function(num, padding) {
      var result = [], len = this.length, arr = this, group;
      if(len === 0 || num === 0) return arr;
      if(isUndefined(num)) num = 1;
      if(isUndefined(padding)) padding = null;
      getRange(0, ceil(len / num) - 1, function(i) {
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
    'isEmpty': function() {
      return this.compact().length == 0;
    },

    /***
     * @method sortBy(<map>, [desc] = false)
     * @returns Array
     * @short Sorts the array by <map>.
     * @extra <map> may be a function, a string acting as a shortcut, or blank (direct comparison of array values). [desc] will sort the array in descending order. When the field being sorted on is a string, the resulting order will be determined by an internal collation algorithm that is optimized for major Western languages, but can be customized. For more information see @array_sorting.
     * @example
     *
     *   ['world','a','new'].sortBy('length')       -> ['a','new','world']
     *   ['world','a','new'].sortBy('length', true) -> ['world','new','a']
     +   [{age:72},{age:13},{age:18}].sortBy(function(n) {
     *     return n.age;
     *   });                                        -> [{age:13},{age:18},{age:72}]
     *
     ***/
    'sortBy': function(map, desc) {
      var arr = this.clone();
      arr.sort(function(a, b) {
        var aProperty, bProperty, comp;
        aProperty = transformArgument(a, map, arr, [a]);
        bProperty = transformArgument(b, map, arr, [b]);
        if(isString(aProperty) && isString(bProperty)) {
          comp = collateStrings(aProperty, bProperty);
        } else if(aProperty < bProperty) {
          comp = -1;
        } else if(aProperty > bProperty) {
          comp = 1;
        } else {
          comp = 0;
        }
        return comp * (desc ? -1 : 1);
      });
      return arr;
    },

    /***
     * @method randomize()
     * @returns Array
     * @short Returns a copy of the array with the elements randomized.
     * @extra Uses Fisher-Yates algorithm.
     * @example
     *
     *   [1,2,3,4].randomize()  -> [?,?,?,?]
     *
     ***/
    'randomize': function() {
      var arr = this.concat(), i = arr.length, j, x;
      while(i) {
        j = (math.random() * i) | 0;
        x = arr[--i];
        arr[i] = arr[j];
        arr[j] = x;
      }
      return arr;
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
    'zip': function() {
      var args = multiArgs(arguments);
      return this.map(function(el, i) {
        return [el].concat(args.map(function(k) {
          return (i in k) ? k[i] : null;
        }));
      });
    },

    /***
     * @method sample([num])
     * @returns Mixed
     * @short Returns a random element from the array.
     * @extra If [num] is passed, will return [num] samples from the array.
     * @example
     *
     *   [1,2,3,4,5].sample()  -> // Random element
     *   [1,2,3,4,5].sample(3) -> // Array of 3 random elements
     *
     ***/
    'sample': function(num) {
      var arr = this.randomize();
      return arguments.length > 0 ? arr.slice(0, num) : arr[0];
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
    'each': function(fn, index, loop) {
      arrayEach(this, fn, index, loop);
      return this;
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
    'add': function(el, index) {
      if(!isNumber(number(index)) || isNaN(index)) index = this.length;
      array.prototype.splice.apply(this, [index, 0].concat(el));
      return this;
    },

    /***
     * @method remove([f1], [f2], ...)
     * @returns Array
     * @short Removes any element in the array that matches [f1], [f2], etc.
     * @extra Will match a string, number, array, object, or alternately test against a function or regex. This method will change the array! Use %exclude% for a non-destructive alias. This method implements @array_matching.
     * @example
     *
     *   [1,2,3].remove(3)         -> [1,2]
     *   ['a','b','c'].remove(/b/) -> ['a','c']
     +   [{a:1},{b:2}].remove(function(n) {
     *     return n['a'] == 1;
     *   });                       -> [{b:2}]
     *
     ***/
    'remove': function() {
      var i, arr = this;
      multiArgs(arguments, function(f) {
        i = 0;
        while(i < arr.length) {
          if(multiMatch(arr[i], f, arr, [arr[i], i, arr])) {
            arr.splice(i, 1);
          } else {
            i++;
          }
        }
      });
      return arr;
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
     *
     ***/
    'compact': function(all) {
      var result = [];
      arrayEach(this, function(el, i) {
        if(isArray(el)) {
          result.push(el.compact());
        } else if(all && el) {
          result.push(el);
        } else if(!all && el != null && el.valueOf() === el.valueOf()) {
          result.push(el);
        }
      });
      return result;
    },

    /***
     * @method groupBy(<map>, [fn])
     * @returns Object
     * @short Groups the array by <map>.
     * @extra Will return an object with keys equal to the grouped values. <map> may be a mapping function, or a string acting as a shortcut. Optionally calls [fn] for each group.
     * @example
     *
     *   ['fee','fi','fum'].groupBy('length') -> { 2: ['fi'], 3: ['fee','fum'] }
     +   [{age:35,name:'ken'},{age:15,name:'bob'}].groupBy(function(n) {
     *     return n.age;
     *   });                                  -> { 35: [{age:35,name:'ken'}], 15: [{age:15,name:'bob'}] }
     *
     ***/
    'groupBy': function(map, fn) {
      var arr = this, result = {}, key;
      arrayEach(arr, function(el, index) {
        key = transformArgument(el, map, arr, [el, index, arr]);
        if(!result[key]) result[key] = [];
        result[key].push(el);
      });
      if(fn) {
        iterateOverObject(result, fn);
      }
      return result;
    },

    /***
     * @method none(<f>)
     * @returns Boolean
     * @short Returns true if none of the elements in the array match <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. This method implements @array_matching.
     * @example
     *
     *   [1,2,3].none(5)         -> true
     *   ['a','b','c'].none(/b/) -> false
     +   [{a:1},{b:2}].none(function(n) {
     *     return n['a'] > 1;
     *   });                     -> true
     *
     ***/
    'none': function() {
      return !this.any.apply(this, arguments);
    }


  });

  // Aliases
  extend(array, true, false, {

    /***
     * @method all()
     * @alias every
     *
     ***/
    'all': array.prototype.every,

    /*** @method any()
     * @alias some
     *
     ***/
    'any': array.prototype.some,

    /***
     * @method insert()
     * @alias add
     *
     ***/
    'insert': array.prototype.add

  });


  /***
   * Object module
   * Enumerable methods on objects
   *
   ***/

   function keysWithCoercion(obj) {
     if(obj && obj.valueOf) {
       obj = obj.valueOf();
     }
     return object.keys(obj);
   }

  /***
   * @method [enumerable](<obj>)
   * @returns Boolean
   * @short Enumerable methods in the Array package are also available to the Object class. They will perform their normal operations for every property in <obj>.
   * @extra In cases where a callback is used, instead of %element, index%, the callback will instead be passed %key, value%. Enumerable methods are also available to extended objects as instance methods.
   *
   * @set
   *   each
   *   map
   *   any
   *   all
   *   none
   *   count
   *   find
   *   findAll
   *   reduce
   *   isEmpty
   *   sum
   *   average
   *   min
   *   max
   *   least
   *   most
   *
   * @example
   *
   *   Object.any({foo:'bar'}, 'bar')            -> true
   *   Object.extended({foo:'bar'}).any('bar')   -> true
   *   Object.isEmpty({})                        -> true
   +   Object.map({ fred: { age: 52 } }, 'age'); -> { fred: 52 }
   *
   ***/

  function buildEnumerableMethods(names, mapping) {
    extendSimilar(object, false, false, names, function(methods, name) {
      methods[name] = function(obj, arg1, arg2) {
        var result, coerced = keysWithCoercion(obj);
        result = array.prototype[name].call(coerced, function(key) {
          if(mapping) {
            return transformArgument(obj[key], arg1, obj, [key, obj[key], obj]);
          } else {
            return multiMatch(obj[key], arg1, obj, [key, obj[key], obj]);
          }
        }, arg2);
        if(isArray(result)) {
          // The method has returned an array of keys so use this array
          // to build up the resulting object in the form we want it in.
          result = result.reduce(function(o, key, i) {
            o[key] = obj[key];
            return o;
          }, {});
        }
        return result;
      };
    });
    buildObjectInstanceMethods(names, Hash);
  }

  extend(object, false, false, {

    'map': function(obj, map) {
      return keysWithCoercion(obj).reduce(function(result, key) {
        result[key] = transformArgument(obj[key], map, obj, [key, obj[key], obj]);
        return result;
      }, {});
    },

    'reduce': function(obj) {
      var values = keysWithCoercion(obj).map(function(key) {
        return obj[key];
      });
      return values.reduce.apply(values, multiArgs(arguments).slice(1));
    },

    'each': function(obj, fn) {
      checkCallback(fn);
      iterateOverObject(obj, fn);
      return obj;
    },

    /***
     * @method size(<obj>)
     * @returns Number
     * @short Returns the number of properties in <obj>.
     * @extra %size% is available as an instance method on extended objects.
     * @example
     *
     *   Object.size({ foo: 'bar' }) -> 1
     *
     ***/
    'size': function (obj) {
      return keysWithCoercion(obj).length;
    }

  });

  var EnumerableFindingMethods = 'any,all,none,count,find,findAll,isEmpty'.split(',');
  var EnumerableMappingMethods = 'sum,average,min,max,least,most'.split(',');
  var EnumerableOtherMethods   = 'map,reduce,size'.split(',');
  var EnumerableMethods        = EnumerableFindingMethods.concat(EnumerableMappingMethods).concat(EnumerableOtherMethods);

  buildEnhancements();
  buildAlphanumericSort();
  buildEnumerableMethods(EnumerableFindingMethods);
  buildEnumerableMethods(EnumerableMappingMethods, true);
  buildObjectInstanceMethods(EnumerableOtherMethods, Hash);

