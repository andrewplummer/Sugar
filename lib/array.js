
  /***
   * Array module
   *
   ***/



  extendWithNativeCondition(Array, true, true, {

    /***
     * @method forEach([fn], [scope])
     * @returns Nothing
     * @short Iterates over the array, calling [fn] on each loop.
     * @extra This method is only provided for those browsers that do not support it natively. [scope] becomes the %this% object. %each% is provided as an alias.
     * @example
     *
     *   ['a','b','c'].forEach(function(a) {
     *     // Called 3 times: 'a','b','c'
     *   });
     *
     ***/
    'forEach': function(fn, scope) {
      for(var i=0,len=this.length; i < len; i++) {
        fn.call(scope, this[i], i, this);
      }
    },

    /***
     * @method reduce([fn], [init])
     * @returns Mixed
     * @short Reduces the array to a single result.
     * @extra By default this method calls [fn] n - 1 times, where n is the length of the array. On the first call it is passed the first and second elements in the array. The result of that callback will then be passed into the next iteration until it reaches the end, where the accumulated value will be returned as the final result. If [init] is passed, it will call [fn] one extra time in the beginning passing in [init] along with the first element. This method is only provided for those browsers that do not support it natively.
     * @example
     *
     +   [1,2,3,4].reduce(function(a, b) {
     *     return a + b;
     *   });
     +   [1,2,3,4].reduce(function(a, b) {
     *     return a + b;
     *   }, 100);
     *
     ***/
    'reduce': function(fn, init) {
      var result = init === undefined ? this[0] : init;
      for(var i= init ? 0 : 1,len=this.length; i < len; i++) {
        result = fn.call(null, result, this[i], i, this);
      }
      return result;
    },

    /***
     * @method reduceRight([fn], [init])
     * @returns Mixed
     * @short Reduces the array to a single result by stepping through it from the right.
     * @extra By default this method calls [fn] n - 1 times, where n is the length of the array. On the first call it is passed the last and second to last elements in the array. The result of that callback will then be passed into the next iteration until it reaches the beginning, where the accumulated value will be returned as the final result. If [init] is passed, it will call [fn] one extra time in the beginning passing in [init] along with the last element. This method is only provided for those browsers that do not support it natively.
     * @example
     *
     +   [1,2,3,4].reduceRight(function(a, b) {
     *     return a - b;
     *   });
     *
     ***/
    'reduceRight': function(fn, init) {
      var result = init === undefined ? this[this.length - 1] : init;
      for(var i = init ? this.length - 1 : this.length - 2; i >= 0; i--) {
        result = fn.call(null, result, this[i], i, this);
      }
      return result;
    }

  });


  extendWithNativeCondition(Array, true, function(a) { return !Object.isObject(a) && !Object.isFunction(a); }, {

    /***
     * @method indexOf(<f>, [offset])
     * @returns Number
     * @short Searches the array and returns the first index where <f> occurs, or -1 if the element is not found.
     * @extra [offset] is the index from which to begin the search. In addition to providing this method for browsers that don't support it natively, this enhanced method can also perform deep finds on objects or arrays, and accept an iterating function on which to perform the search.
     * @example
     *
     *   [1,2,3].indexOf(3)           -> 1
     *   [1,2,3].indexOf(7)           -> -1
     +   [1,2,3].indexOf(function(n) {
     *     return n > 1;
     *   });
     *   [{a:4},{b:2}].indexOf({a:4}) -> 0
     *
     ***/
    'indexOf': function(f, offset) {
      if(offset < 0) offset = this.length + offset;
      else if(offset === undefined) offset = 0;
      if(offset >= this.length) return -1;
      for(var i=offset,len=this.length; i < len; i++) {
        if(multiMatch(this[i], f, this, [i, this])) return i;
      }
      return -1;
    },

    /***
     * @method lastIndexOf(<f>, [offset])
     * @returns Number
     * @short Searches the array and returns the last index where <f> occurs, or -1 if the element is not found.
     * @extra [offset] is the index from which to begin the search. In addition to providing this method for browsers that don't support it natively, this enhanced method can also perform deep finds on objects or arrays, and accept an iterating function on which to perform the search.
     * @example
     *
     *   [1,2,1].lastIndexOf(1)                 -> 2
     *   [1,2,1].lastIndexOf(7)                 -> -1
     +   [1,2,1].lastIndexOf(function(n) {
     *     return n == 1;
     *   });
     *   [{a:4},{b:2},{a:4}].lastIndexOf({a:4}) -> 2
     *
     ***/
    'lastIndexOf': function(f, offset) {
      if(offset < 0) offset = this.length + offset;
      else if(offset === undefined || offset > this.length) offset = this.length - 1;
      for(var i=offset; i >= 0; i--) {
        if(multiMatch(this[i], f, this, [i, this])) return i;
      }
      return -1;
    }

  });


  extendWithNativeCondition(Array, true, function() { return Object.isFunction(arguments[0]); }, {

    /***
     * @method every(<f>, [scope])
     * @returns Boolean
     * @short Returns true if all elements in the array match <f>.
     * @extra [scope] is the %this% object. In addition to providing this method for browsers that don't support it natively, this enhanced method also directly accepts strings, numbers, deep objects, and arrays for <f>. %all% is provided an alias.
     * @example
     *
     +   ['a','a','a'].every(function(n) {
     *     return n == 'a';
     *   });
     *   ['a','a','a'].every('a')   -> true
     *   [{a:2},{a:2}].every({a:2}) -> true
     *
     ***/
    'every': function(f, scope) {
      for(var i=0,len=this.length; i < len; i++) {
        var match = multiMatch(this[i], f, scope, [i, this]);
        if(!match) {
          return false;
        }
      }
      return true;
    },

    /***
     * @method some(<fn>, [scope])
     * @returns Boolean
     * @short Returns true if any element in the array matches <f>.
     * @extra [scope] is the %this% object. In addition to providing this method for browsers that don't support it natively, this enhanced method also directly accepts strings, numbers, deep objects, and arrays for <f>. %any% and %has% are provided as aliases.
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
     *
     ***/
    'some': function(f, scope) {
      for(var i=0,len=this.length; i < len; i++) {
        var match = multiMatch(this[i], f, scope, [i, this]);
        if(match) {
          return true;
        }
      }
      return false;
    },

    /***
     * @method filter(<f>, [scope])
     * @returns Array
     * @short Returns any elements in the array that match <f>.
     * @extra [scope] is the %this% object. In addition to providing this method for browsers that don't support it natively, this enhanced method also directly accepts strings, numbers, deep objects, and arrays for <f>.
     * @example
     *
     +   [1,2,3].filter(function(n) {
     *     return n > 1;
     *   });
     *   [1,2,2,4].filter(2) -> 2
     *
     ***/
    'filter': function(f, scope) {
      var result = [];
      for(var i=0,len=this.length; i < len; i++) {
        var match = multiMatch(this[i], f, scope, [i, this]);
        if(match) {
          result.push(this[i]);
        }
      }
      return result;
    },

    /***
     * @method map(<fn>, [scope])
     * @returns Array
     * @short Maps the array to another array containing the values that are the result of calling <fn> on each element.
     * @extra [scope] is the %this% object. In addition to providing this method for browsers that don't support it natively, this enhanced method also directly accepts a string, which is a shortcut for a function that gets that property on each element. %collect% is provided as an alias.
     * @example
     *
     +   [1,2,3].map(function(n) {
     *     return n * 3;
     *   });                                  -> [3,6,9]
     *   ['one','two','three'].map(function(n) {
     *     return n.length;
     *   });                                  -> [3,3,5]
     *   ['one','two','three'].map('length')  -> [3,3,5]
     *
     ***/
    'map': function(fn, scope) {
      var result = [];
      for(var i=0,len=this.length; i < len; i++) {
        result.push(transformArgument(this[i], fn, scope, [i, this]));
      }
      return result;
    }


  });


  extend(Array, true, {

    /***
     * @method find(<f>, [index] = 0, [loop] = false)
     * @returns Mixed
     * @short Returns the first element that matches <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Starts at [index], and will continue from index = 0 if [loop] is true.
     * @example
     *
     +   [{a:1,b:2},{a:1,b:3},{a:1,b:4}].find(function(n) {
     *     return n['a'] == 1;
     *   });                                     -> {a:1,b:3}
     *   ['cuba','japan','canada'].find(/^c/, 2) -> 'canada'
     *
     ***/
    'find': function(f, index, loop) {
      var result = this.findAll(f, index, loop);
      return result.length > 0 ? result[0] : undefined;
    },

    /***
     * @method findAll(<f>, [index] = 0, [loop] = false)
     * @returns Array
     * @short Returns all elements that match <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Starts at [index], and will continue from index = 0 if [loop] is true.
     * @example
     *
     +   [{a:1,b:2},{a:1,b:3},{a:2,b:4}].findAll(function(n) {
     *     return n['a'] == 1;
     *   });                                        -> [{a:1,b:3},{a:1,b:4}]
     *   ['cuba','japan','canada'].findAll(/^c/, 2) -> 'canada'
     *
     ***/
    'findAll': function(f, index, loop) {
      var result = [], arr = this;
      index = index || 0;
      this.eachFromIndex(index, function(el, i) {
        if(multiMatch(el, f, arr, [i, arr])) {
          result.push(el);
        }
      }, loop);
      return result;
    },

    /***
     * @method eachFromIndex(<index>, <fn>, [loop] = false)
     * @returns Array
     * @short Runs <fn> against elements in the array starting at <index>.
     * @extra Will run a full loop starting over at index = 0 if [loop] is true.
     * @example
     *
     *   [1,2,3,4].eachFromIndex(2, function(n) {
     *     // Called 2 times: 3, 4
     *   });
     *   [1,2,3,4].eachFromIndex(2, function(n) {
     *     // Called 4 times: 3, 4, 1, 2
     *   }, true);
     *
     ***/
    'eachFromIndex': function(index, fn, loop) {
      var length = loop ? this.length : this.length - index;
      for(var cur, i = 0; i < length; i++) {
        cur = (index + i) % this.length;
        fn.call(this, this[cur], cur);
      }
    },

    /***
     * @method count(<f>)
     * @returns Number
     * @short Counts all elements in the array that match <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex.
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
      if(f === undefined) return this.length;
      return this.findAll(f).length;
    },

    /***
     * @method none(<f>)
     * @returns Boolean
     * @short Returns true if none of the elements in the array match <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex.
     * @example
     *
     *   [1,2,3].none(5)         -> true
     *   ['a','b','c'].none(/b/) -> false
     +   [{a:1},{b:2}].none(function(n) {
     *     return n['a'] > 1;
     *   });                     -> true
     *
     ***/
    'none': function(f) {
      return !this.any(f);
    },

    /***
     * @method remove(<f>)
     * @returns Array
     * @short Removes any element in the array that matches <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. This method will change the array! Use %exclude% for a non-destructive alias.
     * @example
     *
     *   [1,2,3].remove(3)         -> [1,2]
     *   ['a','b','c'].remove(/b/) -> ['a','c']
     +   [{a:1},{b:2}].remove(function(n) {
     *     return n['a'] == 1;
     *   });                       -> [{b:2}]
     *
     ***/
    'remove': function(f) {
      var i = 0;
      while(f && i < this.length) {
        if(multiMatch(this[i], f, this, [i, this])) {
          this.splice(i, 1);
        } else {
          i++;
        }
      }
      return this;
    },

    /***
     * @method removeAtIndex(<start>, [end])
     * @returns Array
     * @short Removes element at <start>. If [end] is specified, removes the range between <start> and [end]. This method will change the array! If you don't intend the array to be changed use %clone% first.
     * @example
     *
     *   ['a','b','c'].removeAtIndex(0) -> ['b','c']
     *   [1,2,3,4].removeAtIndex(1, 3)  -> [1]
     *
     ***/
    'removeAtIndex': function(start, end) {
      if(start === undefined) return this;
      if(end === undefined) end = start;
      for(var i = 0; i <= (end - start); i++) {
        this.splice(start, 1);
      }
      return this;
    },

    /***
     * @method add(<el>, [index])
     * @returns Array
     * @short Adds <el> to the array.
     * @extra If [index] is specified, it will add at [index], otherwise adds to the end of the array. %add% behaves like %concat% in that if <el> is an array it will be joined, not inserted. This method will change the array! Use %include% for a non-destructive alias.
     * @example
     *
     *   [1,2,3,4].add(5)       -> [1,2,3,4,5]
     *   [1,2,3,4].add(8, 1)    -> [1,8,2,3,4]
     *   [1,2,3,4].add([5,6,7]) -> [1,2,3,4,5,6,7]
     *
     ***/
    'add': function(el, index) {
      if(!Object.isNumber(index) || isNaN(index)) index = this.length;
      Array.prototype.splice.apply(this, [index, 0].concat(el));
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
     * @method exclude(<f>)
     * @returns Array
     * @short Removes any element in the array that matches <f>.
     * @extra This is a non-destructive alias for %remove%. It will not change the original array.
     * @example
     *
     *   [1,2,3].exclude(3)         -> [1,2]
     *   ['a','b','c'].exclude(/b/) -> ['a','c']
     +   [{a:1},{b:2}].exclude(function(n){
     *     return n['a'] == 1;
     *   });                       -> [{b:2}]
     *
     ***/
    'exclude': function(f) {
      return this.clone().remove(f);
    },

    /***
     * @method clone()
     * @returns Array
     * @short Clones the array.
     * @example
     *
     *   [1,2,3].clone() -> [1,2,3]
     *
     ***/
    'clone': function() {
      return this.concat();
    },

    /***
     * @method unique()
     * @returns Array
     * @short Removes all duplicate elements in the array.
     * @example
     *
     *   [1,2,2,3].unique()                 -> [1,2,3]
     *   [{foo:'bar'},{foo:'bar'}].unique() -> [{foo:'bar'}]
     *
     ***/
    'unique': function() {
      var result = [];
      this.each(function(el) {
        if(result.indexOf(el) === -1) result.push(el);
      });
      return result;
    },

    /***
     * @method union(<a>)
     * @returns Array
     * @short Returns an array containing all elements in both arrays with duplicates removed.
     * @example
     *
     *   [1,3,5].union([5,7,9])     -> [1,3,5,7,9]
     *   ['a','b'].union(['b','c']) -> ['a','b','c']
     *
     ***/
    'union': function(a) {
      return this.concat(a).unique();
    },

    /***
     * @method intersect(<a>)
     * @returns Array
     * @short Returns an array containing the elements both arrays have in common.
     * @example
     *
     *   [1,3,5].intersect([5,7,9])   -> [5]
     *   ['a','b'].intersect('b','c') -> ['b']
     *
     ***/
    'intersect': function(a) {
      var result = [];
      if(!Object.isArray(a)) a = [a];
      this.each(function(el) {
        if(a.indexOf(el) !== -1) {
          result.push(el);
        }
      });
      return result.unique();
    },

    /***
     * @method subtract(<a>)
     * @returns Array
     * @short Returns an array containing only the elements that do not exist in <a>.
     * @example
     *
     *   [1,3,5].subtract([5,7,9])   -> [1,3,7,9]
     *   ['a','b'].subtract('b','c') -> ['a','c']
     *
     ***/
    'subtract': function(a) {
      var result = [];
      if(!Object.isArray(a)) a = [a];
      this.each(function(el) {
        if(a.indexOf(el) === -1) {
          result.push(el);
        }
      });
      return result;
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
      return getFromIndexes(this, arguments, false);
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
      if(num === undefined) return this[0];
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
      if(num === undefined) return this[this.length - 1];
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
      if(num === undefined) num = this.length;
      return this.slice(0, num);
    },

    /***
     * @method min([map])
     * @returns Array
     * @short Returns the elements in the array with the lowest value.
     * @extra [map] may be a function mapping the value to be checked or a string acting as a shortcut.
     * @example
     *
     *   [1,2,3].min()                    -> [1]
     *   ['fee','fo','fum'].min('length') -> ['fo']
     +   ['fee','fo','fum'].min(function(n) {
     *     return n.length;
     *   });                              -> ['fo']
     +   [{a:3,a:2}].min(function(n) {
     *     return n['a'];
     *   });                              -> [{a:2}]
     *
     ***/
    'min': function(map) {
      return getMinOrMax(this, 'min', map).unique();
    },

    /***
     * @method max(<map>)
     * @returns Array
     * @short Returns the elements in the array with the greatest value.
     * @extra <map> may be a function mapping the value to be checked or a string acting as a shortcut.
     * @example
     *
     *   [1,2,3].max()                    -> [3]
     *   ['fee','fo','fum'].max('length') -> ['fee','fum']
     +   [{a:3,a:2}].max(function(n) {
     *     return n['a'];
     *   });                              -> [{a:3}]
     *
     ***/
    'max': function(map) {
      return getMinOrMax(this, 'max', map).unique();
    },

    /***
     * @method least(<map>)
     * @returns Array
     * @short Returns the elements in the array with the least commonly occuring value.
     * @extra <map> may be a function mapping the value to be checked or a string acting as a shortcut.
     * @example
     *
     *   [3,2,2].least()                   -> [3]
     *   ['fe','fo','fum'].least('length') -> ['fum']
     +   [{age:35,name:'ken'},{age:12,name:'bob'},{age:12,name:'ted'}].least(function(n) {
     *     return n.age;
     *   });                               -> [{age:35,name:'ken'}]
     *
     ***/
    'least': function(map) {
      var result = getMinOrMax(this.groupBy(map), 'min', 'length').flatten();
      return result.length === this.length ? [] : result.unique();
    },

    /***
     * @method most(<map>)
     * @returns Array
     * @short Returns the elements in the array with the most commonly occuring value.
     * @extra <map> may be a function mapping the value to be checked or a string acting as a shortcut.
     * @example
     *
     *   [3,2,2].most()                   -> [2]
     *   ['fe','fo','fum'].most('length') -> ['fe','fo']
     +   [{age:35,name:'ken'},{age:12,name:'bob'},{age:12,name:'ted'}].most(function(n) {
     *     return n.age;
     *   });                              -> [{age:12,name:'bob'},{age:12,name:'ted'}]
     *
     ***/
    'most': function(map) {
      var result = getMinOrMax(this.groupBy(map), 'max', 'length').flatten();
      return result.length === this.length ? [] : result.unique();
    },

    /***
     * @method sum(<map>)
     * @returns Number
     * @short Sums all values in the array.
     * @extra <map> may be a function mapping the value to be summed or a string acting as a shortcut.
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
     * @method average(<map>)
     * @returns Number
     * @short Averages all values in the array.
     * @extra <map> may be a function mapping the value to be averaged or a string acting as a shortcut.
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
     * @method groupBy(<property>)
     * @returns Object
     * @short Groups the array by <property>.
     * @extra Will return an object with keys equal to the grouped values. <property> may be a mapping function, or a string acting as a shortcut.
     * @example
     *
     *   ['fee','fi','fum'].groupBy('length') -> { 2: ['fi'], 3: ['fee','fum'] }
     +   [{age:35,name:'ken'},{age:15,name:'bob'}].groupBy(function(n) {
     *     return n.age;
     *   });                                  -> { 'ken': [{age:35,name:'ken'}], 'bob': [{age:15,name:'bob'}] }
     *
     ***/
    'groupBy': function(map) {
      var result = {};
      this.each(function(el) {
        var key = transformArgument(el, map);
        if(!result[key]) result[key] = [];
        result[key].push(el);
      });
      return result;
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
      var divisor = Math.ceil(this.length / num);
      (0).upto(num - 1, function(i) {
        var index = i * divisor;
        var group = arr.slice(index, index + divisor);
        if(pad && group.length < divisor) {
          (divisor - group.length).times(function() {
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
      if(this.length === 0 || num === 0) return this;
      if(num === undefined) num = 1;
      if(padding === undefined) padding = null;
      var result = [];
      var group = null;
      var len = this.length;
      this.each(function(el, i) {
        if((i % num) === 0) {
          if(group) result.push(group);
          group = [];
        }
        if(el === undefined) el = padding;
        group.push(el);
      });
      if(!this.length.isMultipleOf(num)) {
        (num - (this.length % num)).times(function() {
          group.push(padding);
        });
        this.length = this.length + (num - (this.length % num));
      }
      if(group.length > 0) result.push(group);
      return result;
    },

    /***
     * @method split(<f>)
     * @returns Array
     * @short Splits the array on any element that matches <f>.
     * @extra <f> will match a string, number, array, object, or alternately test against a function or regex.
     * @example
     *
     *   [1,2,3,4,5,6].split(3) -> [[1,2], [4,5,6]]
     +   [{a:3},{a:4},{a:1}].split(function(n) {
     *     return n['a'] == 1;
     *   });                    -> [{a:3},{a:4}]
     *
     ***/
    'split': function(split) {
      var result = [], tmp = [];
      this.forEach(function(el, i, arr) {
        var match = multiMatch(el, split, arr, [i, arr]);
        if(!match) tmp.push(el);
        if(tmp.length > 0 && (match || i == arr.length - 1)) {
          result.push(tmp);
          tmp = [];
        }
      });
      return result;
    },

    /***
     * @method compact()
     * @returns Array
     * @short Removes all instances of %undefined%, %null%, and %NaN% from the array.
     * @extra Empty strings and %false% are left untouched.
     * @example
     *
     *   [1,null,2,undefined,3].compact() -> [1,2,3]
     *   [1,'',2,false,3].compact()       -> [1,'',2,false,3]
     *
     ***/
    'compact': function() {
      var result = [];
      this.each(function(el, i) {
        if(Object.isArray(el)) {
          result.push(el.compact());
        } else if(el !== undefined && el !== null && !isNaN(el)) {
          result.push(el);
        }
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
     * @method flatten()
     * @returns Array
     * @short Returns a flattened, one-dimensional copy of the array.
     * @example
     *
     *   [[1], 2, [3]].flatten()      -> [1,2,3]
     *   [['a'],[],'b','c'].flatten() -> ['a','b','c']
     *
     ***/
    'flatten': function() {
      var result = [];
      this.each(function(el) {
        if(Object.isArray(el)) {
          result = result.concat(el.flatten());
        } else {
          result.push(el);
        }
      });
      return result;
    },

    /***
     * @method sortBy(<property>, [desc] = false)
     * @returns Array
     * @short Sorts the array by <property>.
     * @extra <property> may be a function or a string acting as a shortcut. [desc] will sort the array in descending order.
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
      var arr = this;
      arr.sort(function(a, b) {
        var aProperty = transformArgument(a, map);
        var bProperty = transformArgument(b, map);
        var numeric = typeof aProperty == 'number';
        if(numeric && desc) return bProperty - aProperty;
        else if(numeric && !desc) return aProperty - bProperty;
        else if(aProperty === bProperty) return 0;
        else if(desc) return aProperty < bProperty ?  1 : -1;
        else return aProperty < bProperty ? -1 :  1;
      });
      return arr;
    },

    /***
     * @method randomize()
     * @returns Array
     * @short Randomizes the array.
     * @extra Uses Fisher-Yates algorithm. %shuffle% provided as an alias.
     * @example
     *
     *   [1,2,3,4].randomize()  -> [?,?,?,?]
     *
     ***/
    'randomize': function() {
      var a = this.concat();
      for(var j, x, i = a.length; i; j = parseInt(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x) {};
      return a;
    }

  });


  // Aliases
  extend(Array, true, {
    /***
     * @method collect()
     * @alias map
     *
     ***
     * @method shuffle()
     * @alias randomize
     *
     ***
     * @method each()
     * @alias forEach
     *
     ***
     * @method all()
     * @alias every
     *
     ***
     * @method any()
     * @alias some
     *
     ***
     * @method has()
     * @alias some
     *
     ***
     * @method insert()
     * @alias add
     *
     ***/
    'collect': Array.prototype.map,
    'shuffle': Array.prototype.randomize,
    'each': Array.prototype.forEach,
    'all': Array.prototype.every,
    'any': Array.prototype.some,
    'has': Array.prototype.some,
    'insert': Array.prototype.add
  });
