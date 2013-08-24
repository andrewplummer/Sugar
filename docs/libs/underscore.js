//  Compatibility index:
//
//  0 - Does not exist.
//  1 - Exists but does not support all functionality.
//  2 - Exists and supports all functionality.
//  3 - Exists and supports all functionality plus more.

var SugarUnderscoreMethods = [
  {
  type: 'class',
  namespace: '_',
  methods: [
    {
    name: 'each',
    description: 'Iterates over an enumerable collection.',
    sugar_compatibility: 3,
    sugar_notes: '_.each exists natively on arrays in modern browsing engines as Array#forEach. Sugar provides this method when it is not supported. It also provides Array#each, which can break out of the loop, start from a given index, loop from the beginning, and intelligently handle sparse arrays. Sugar also provides Object.each for iterating over objects.',
    original_code: '_.each([1,2,3], function(element, index, array){})',
    sugar_code: '[1,2,3].forEach(function(element, index, array){})',
    ref: 'Array/each'
  },
  {
    name: 'map',
    description: 'Creates a new array by using the return value of a mapping function on each element.',
    sugar_compatibility: 3,
    sugar_notes: '_.map exists natively in modern browsing engines as Array#map. Sugar provides this method when it is not supported, and additionally augments it to allow passing a string as a shortcut.',
    original_code: '_.map([1,2,3], function(a){ return a * 2; })',
    sugar_code: '[1,2,3].map(function(a){ return a * 2; })',
    ref: 'Array/map'
  },
  {
    name: 'reduce',
    description: 'Boils down a list of values to a single value, optionally with a starting value.',
    sugar_compatibility: 2,
    sugar_notes: '_.reduce exists natively in modern browsing engines as Array#reduce. Sugar provides this method when it is not supported.',
    original_code: '_.reduce([1,2,3], function(m, a){ return m + a; })',
    sugar_code: '[1,2,3].reduce(function(m, a){ return m + a; })',
    ref: 'Array/reduce'
  },
  {
    name: 'reduceRight',
    description: 'Boils down a list of values to a single value starting from the last entry (the right), optionally with a starting value.',
    sugar_compatibility: 2,
    sugar_notes: '_.reduceRight exists natively in modern browsing engines as Array#reduceRight. Sugar provides this method when it is not supported.',
    original_code: '_.reduceRight([1,2,3], function(m, a){ return m + a; })',
    sugar_code: '[1,2,3].reduceRight(function(m, a){ return m + a; })',
    ref: 'Array/reduceRight'
  },
  {
    name: 'find',
    description: 'Finds the first value in the list for which the iterator returns true.',
    sugar_compatibility: 3,
    sugar_notes: '_.find exists in Sugar as Array#find, and additionally allows searching on primitives, deep objects, and testing against regexes.',
    original_code: '_.find([1,2,3], function(a){ return a == 1; })',
    sugar_code: '[1,2,3].find(1)',
    bind_context: true,
    ref: 'Array/find'
  },
  {
    name: 'filter',
    description: 'Finds all values in the list for which the iterator returns true.',
    sugar_compatibility: 3,
    sugar_notes: '_.filter exists natively in modern browsing engines as Array#filter. Sugar provides this method when it is not supported, and additionally augments it to allow search on primitives, deep objects, or against a regex. Sugar also provides Array#findAll which can start from a given index, loop from the beginning, and intelligently handles sparse arrays.',
    original_code: '_.filter([1,2,3], function(a){ return a % 2 == 0; })',
    sugar_code: '[1,2,3].reduceRight(function(a){ return a % 2 == 0; })',
    ref: 'Array/filter'
  },
  {
    name: 'reject',
    description: 'Returns all elements in the list for which the iterator does not return true. Opposite of filter.',
    sugar_compatibility: 3,
    sugar_notes: '_.reject exists in Sugar as Array#exclude. It additionally allows searching on primitives, deep objects, or against a regex. This method is non-destructive with a destructive reciprocal method: Array#remove.',
    original_code: '_.reject([1,2,3,4,5,6], function(a){ return a % 2 == 0; })',
    sugar_code: '[1,2,3,4,5,6].exclude(function(a){ return a % 2 == 0; })',
    ref: 'Array/exclude'
  },
  {
    name: 'all',
    description: 'Returns true if the iterator returns true for all elements in the list, false otherwise.',
    sugar_compatibility: 3,
    sugar_notes: '_.all exists natively in modern browsing engines as Array#every. Sugar provides this method when it is not supported, and addtionally augments it to search on primitives, deep objects, or against a regex. Sugar also has its own alias Array#all.',
    original_code: '_.all([1,2,3], function(a){ return a == 2; })',
    sugar_code: '[1,2,3].all(function(a){ return a % 2 == 0; })',
    ref: 'Array/all'
  },
  {
    name: 'any',
    description: 'Returns true if the iterator returns true for any elements in the list, false otherwise.',
    sugar_compatibility: 3,
    sugar_notes: '_.any exists natively in modern browsing engines as Array#some. Sugar provides this method when it is not supported, and addtionally augments it to search on primitives, deep objects, or against a regex. Sugar also has its own alias Array#any.',
    original_code: '_.any([1,2,3], function(a){ return a % 2 == 0; })',
    sugar_code: '[1,2,3].any(function(a){ return a % 2 == 0; })',
    ref: 'Array/any'
  },
  {
    name: 'include',
    description: 'Returns true if the value is present in the list.',
    sugar_compatibility: 3,
    sugar_notes: '_.include exists in Sugar as browser native Array#some, which it augments to search on primitive types, deep objects, or against regexes. Sugar also has its own alias Array#any, which has identical functionality.',
    original_code: '_.include([1,2,3], 3)',
    sugar_code: '[1,2,3].any(3)',
    ref: 'Array/any'
  },
  {
    name: 'invoke',
    description: 'Calls the passed method name for each value in the list.',
    sugar_compatibility: 2,
    sugar_notes: '_.invoke does not exist in Sugar. In most cases, invoking functions through standard methods is more readable. Array#map effectively provides an alias for this, however.',
    original_code: "_.invoke([5,1,7],[3,2,1], 'sort')",
    sugar_code: "[[5,1,7],[3,2,1]].map('sort')",
    ref: 'Array/map'
  },
  {
    name: 'pluck',
    description: 'Returns the property for each value in the list.',
    sugar_compatibility: 2,
    sugar_notes: '_.pluck exists in Sugar as browser native Array#map, which it augments to accept a string as a shortcut.',
    original_code: "_.pluck([{name:'moe'},{name:'larry'},{name:'curly'}], 'name')",
    sugar_code: "[{name:'moe'},{name:'larry'},{name:'curly'}].map('name')",
    ref: 'Array/map'
  },
  {
    name: 'max',
    description: 'Returns the maximum value in the list.',
    sugar_compatibility: 2,
    sugar_notes: '_.max exists in Sugar as Array#max, and can additionally return an array when more than one max values exist.',
    original_code: '_.max([1,2,3])',
    sugar_code: '[1,2,3].max()',
    ref: 'Array/max'
  },
  {
    name: 'min',
    description: 'Returns the minimum value in the list.',
    sugar_compatibility: 2,
    sugar_notes: '_.min exists in Sugar as Array#min, and can additionally return an array when more than one max values exist.',
    original_code: '_.min([1,2,3])',
    sugar_code: '[1,2,3].min()',
    ref: 'Array/min'
  },
  {
    name: 'sortBy',
    description: 'Returns a copy of the list sorted by the result of the iterator.',
    sugar_compatibility: 2,
    sugar_notes: '_.sortBy exists in Sugar as Array#sortBy. In addition to an iterating function, it will also accept a string as a shortcut to the property to sort by.',
    original_code: '_.sortBy([1,2,3], Math.sin)',
    sugar_code: '[1,2,3].sortBy(Math.sin)',
    ref: 'Array/sortBy'
  },
  {
    name: 'groupBy',
    description: 'Splits a collection into sets, grouping them by the result of running each value through the iterator.',
    sugar_compatibility: 3,
    sugar_notes: '_.groupBy exists in Sugar as Array#groupBy. It allows passing a string as a shortcut to a property and additionally allows an optional callback to be called for each group.',
    original_code: '_.groupBy([1,2,3,4], function(n){ return n > 2; })',
    sugar_code: '[1,2,3,4].groupBy(function(n){ return n > 2; })',
    ref: 'Array/groupBy'
  },
  {
    name: 'sortedIndex',
    description: 'Determine the index at which the value should be inserted into the list in order to maintain the sorted order.',
    sugar_compatibility: 0,
    sugar_notes: '_.sortedIndex does not exist in Sugar. Clever use of Array#reduce can achieve something similar, depending on the case.',
    original_code: '_.sortedIndex([1,2,3,5], 4)',
    sugar_code: '[1,2,3,5].reduce(function(a, b, i){ if(b > 4) return i - 1; })',
    ref: 'Array/reduce'
  },
  {
    name: 'shuffle',
    description: 'Returns a randomized copy of the list.',
    sugar_compatibility: 2,
    sugar_notes: '_.shuffle exists in Sugar as Array#randomize. Sugar also uses a Fisher-Yates algorithm.',
    original_code: '_.shuffle([1,2,3,4])',
    sugar_code: '[1,2,3,4].randomize()',
    ref: 'Array/randomize'
  },
  {
    name: 'toArray',
    description: 'Converts any enumerable object into an array.',
    sugar_compatibility: 3,
    sugar_notes: '_.toArray exists in Sugar as Array.create, which can accept multiple arguments.',
    original_code: '_.toArray(arguments)',
    sugar_code: 'Array.create(arguments)',
    ref: 'Array/create'
  },
  {
    name: 'size',
    description: 'Returns the number of values in the list.',
    sugar_compatibility: 0,
    sugar_notes: "_.size does not exist in Sugar. If you need to know the \"size\" of a hash, you can get the length of Object.keys, although in that case it's likely that you should be using an array in any case.",
    original_code: '_.size(obj)',
    sugar_code: 'Object.keys(obj).length',
    ref: 'Object/keys'
  },
  {
    name: 'first',
    description: 'Returns the first element(s) of the array.',
    sugar_compatibility: 2,
    sugar_notes: '_.first exists in Sugar as Array#first, and is identical.',
    original_code: '_.first([1,2,3])',
    sugar_code: '[1,2,3].first()',
    ref: 'Array/first'
  },
  {
    name: 'initial',
    description: 'Returns all but the last n entries of the array.',
    sugar_compatibility: 2,
    sugar_notes: '_.initial does not exist in Sugar. Use a negative value for Array#to for the same effect.',
    original_code: '_.initial([1,2,3], 2)',
    sugar_code: '[1,2,3].to(-2)',
    ref: 'Array/to'
  },
  {
    name: 'last',
    description: 'Returns the last n entries of the array.',
    sugar_compatibility: 2,
    sugar_notes: '_.last exists in Sugar as Array#last, and is identical.',
    original_code: '_.last([1,2,3])',
    sugar_code: '[1,2,3].last()',
    ref: 'Array/last'
  },
  {
    name: 'rest',
    description: 'Returns the rest of the entries from a given index.',
    sugar_compatibility: 2,
    sugar_notes: '_.rest exists in Sugar as Array#from.',
    original_code: '_.rest([1,2,3], 2)',
    sugar_code: '[1,2,3].from(2)',
    ref: 'Array/from'
  },
  {
    name: 'compact',
    description: 'Returns a copy of the array with all falsy values removed.',
    sugar_compatibility: 3,
    sugar_notes: '_.compact exists in Sugar as Array#compact. Note that only undefined, null, and NaN are removed by default. To remove all falsy values, pass true as the first argument.',
    original_code: '_.compact([1,0,3,null])',
    sugar_code: '[1,0,3,null].compact(true)',
    ref: 'Array/compact'
  },
  {
    name: 'flatten',
    description: 'Flattens a nested array.',
    sugar_compatibility: 3,
    sugar_notes: '_.flatten exists in Sugar as Array#flatten. Sugar can additionally flatten to any level of depth, specified in the first argument (all levels by default).',
    original_code: '_.flatten([1,[2,3]])',
    sugar_code: '[1,[2,3]].flatten()',
    ref: 'Array/flatten'
  },
  {
    name: 'without',
    description: 'Returns a copy of the array with all instances of the values passed removed.',
    sugar_compatibility: 3,
    sugar_notes: '_.without exists in Sugar as Array#exclude, and is identical.',
    original_code: '_.without([1,2,3], 1)',
    sugar_code: '[1,2,3].exclude(1)',
    ref: 'Array/exclude'
  },
  {
    name: 'union',
    description: 'Computes the union of the arrays, or the unique items present in all arrays.',
    sugar_compatibility: 2,
    sugar_notes: '_.union exists in Sugar as Array#union, and is identical.',
    original_code: '_.union([1,2,3], [3,4,5])',
    sugar_code: '[1,2,3].union([3,4,5])',
    ref: 'Array/union'
  },
  {
    name: 'intersection',
    description: 'Computes the intersection of the arrays, or the values that are common to all arrays.',
    sugar_compatibility: 2,
    sugar_notes: '_.intersection exists in Sugar as Array#intersect, and is identical.',
    original_code: '_.intersect([1,2,3], [3,4,5])',
    sugar_code: '[1,2,3].intersect([3,4,5])',
    ref: 'Array/intersect'
  },
  {
    name: 'difference',
    description: 'Returns the values in the array that are not present in the others.',
    sugar_compatibility: 2,
    sugar_notes: '_.difference exists in Sugar as Array#subtract, which can subtract an indefinite number of arrays.',
    original_code: '_.difference([1,2,3], [3,4,5])',
    sugar_code: '[1,2,3].subtract([3,4,5])',
    ref: 'Array/subtract'
  },
  {
    name: 'uniq',
    description: 'Returns a duplicate-free version of the array.',
    sugar_compatibility: 3,
    sugar_notes: '_.uniq exists in Sugar as Array#unique. In addition to accepting a function to transform (map) the property on which to unique, Sugar will also accept a string that is a shortcut to this function. This would most commonly be the unique key of a JSON object, etc.',
    original_code: '_.uniq([1,2,1,3,1,4])',
    sugar_code: '[1,2,1,3,1,4].unique()',
    ref: 'Array/unique'
  },
  {
    name: 'zip',
    description: 'Merges together multiple arrays, creating a multi-dimensional array as the result.',
    sugar_compatibility: 2,
    sugar_notes: '_.zip exists in Sugar as Array#zip and is identical.',
    original_code: '_.zip(arr1, arr2)',
    sugar_code: 'arr1.zip(arr2)',
    ref: 'Array/zip'
  },
  {
    name: 'indexOf',
    description: 'Returns the index of the first value that matches in the array or -1 if not present.',
    sugar_compatibility: 2,
    sugar_notes: '_.indexOf exists natively in modern browsing engines as Array#indexOf. Sugar provides this method when it is not supported. Sugar also provides Array#findIndex for more complex index finding operations.',
    original_code: '_.indexOf([1,2,3], 1)',
    sugar_code: '[1,2,3].indexOf(1)',
    ref: 'Array/indexOf'
  },
  {
    name: 'lastIndexOf',
    description: 'Returns the index of the last value that matches in the array or -1 if not present.',
    sugar_compatibility: 2,
    sugar_notes: '_.lastIndexOf exists natively in modern browsing engines as Array#lastIndexOf. Sugar provides this method when it is not supported. Sugar also provides Array#findIndex for more complex index finding operations.',
    original_code: '_.lastIndexOf([1,2,3], 1)',
    sugar_code: '[1,2,3].lastIndexOf(1)',
    ref: 'Array/lastIndexOf'
  },
  {
    name: 'range',
    description: 'Shortcut to quickly create lists of integers.',
    sugar_compatibility: 3,
    sugar_notes: 'Ranges exist in Sugar and are created with Number.range. They can then be iterated over with the method "every".',
    original_code: '_.range(0, 30, 5)',
    sugar_code: 'Number.range(0, 30)',
    ref: 'Number/upto'
  },
  {
    name: 'bind',
    description: 'Binds an object to a function, making that object its "this" argument when called.',
    sugar_compatibility: 2,
    sugar_notes: '_.bind exists natively in modern browsing engines as Function#bind. Sugar provides this method when it is not supported.',
    original_code: '_.bind(fn, obj, 1)',
    sugar_code: 'fn.bind(obj, 1)',
    ref: 'Function/bind'
  },
  {
    name: 'bindAll',
    description: 'Binds a number of methods on the object.',
    sugar_compatibility: 0,
    sugar_notes: '_.bindAll does not exist in Sugar. However, the same functionality can be achieved through a workaround.',
    original_code: '_.bindAll(obj)',
    sugar_code: 'Object.each(obj, function(key, val){ if(Object.isFunction(val)) obj[key] = val.bind(obj); })',
    ref: 'Function/bind'
  },
  {
    name: 'memoize',
    description: 'Memoizes a given function by caching the computed result. Useful for speeding up slow-running computations.',
    sugar_compatibility: 1,
    sugar_notes: '_.memoize exists in Sugar as Function#once. It does not have the optional [hashFunction] parameter.',
    original_code: '_.memoize(fn)',
    sugar_code: 'fn.once()',
    ref: 'Function/once'
  },
  {
    name: 'delay',
    description: 'Invokes the function after n milliseconds.',
    sugar_compatibility: 2,
    sugar_notes: '_.delay exists in Sugar as Function#delay, and is identical.',
    original_code: '_.delay(fn, 1000, 1)',
    sugar_code: 'fn.delay(1000, 1)',
    ref: 'Function/delay'
  },
  {
    name: 'defer',
    description: 'Invokes the function after the current stack has cleared.',
    sugar_compatibility: 2,
    sugar_notes: '_.defer exists in Sugar as Function#delay, called with no arguments.',
    original_code: '_.defer(fn)',
    sugar_code: 'fn.delay()',
    ref: 'Function/delay'
  },
  {
    name: 'throttle',
    description: 'Creates a throttled version of the function that when invoked will only call the function at most once per n milliseconds. Useful for rate-limiting events.',
    sugar_compatibility: 3,
    sugar_notes: '_.throttle exists in Sugar as Function#throttle. In addition, Function#lazy has other options like accepting an upper limit to the queue of functions waiting to execute or execute the first time immediately.',
    original_code: '_.throttle(fn, 100)',
    sugar_code: 'fn.throttle(100)',
    ref: 'Function/lazy'
  },
  {
    name: 'debounce',
    description: 'Returns a "debounced" version of the function that will only execute once after n milliseconds have passed.',
    sugar_compatibility: 3,
    sugar_notes: '_.debounce exists in Sugar as Function#debounce.',
    original_code: '_.debounce(fn, 100)',
    sugar_code: 'fn.debounce(100)',
    ref: 'Function/debounce'
  },
  {
    name: 'once',
    description: 'Returns a version of the function that will return the value of the original call if called repeated times.',
    sugar_compatibility: 2,
    sugar_notes: '_.once exists in Sugar as Function#once. In Sugar it is identical to the functionality of _.memoize.',
    original_code: '_.once(fn)',
    sugar_code: 'fn.once()',
    ref: 'Function/once'
  },
  {
    name: 'after',
    description: 'Returns a version of the function that will only be run after being called n times.',
    sugar_compatibility: 2,
    sugar_notes: '_.after exists in Sugar as Function#after. The final callback will be passed an array of all argument objects collected (converted to proper arrays).',
    original_code: '_.after(5, fn)',
    sugar_code: 'fn.after(5)',
    ref: 'Function/after'
  },
  {
    name: 'wrap',
    description: 'Wraps the first function inside of the wrapper function, passing it as the first argument.',
    sugar_compatibility: 0,
    sugar_notes: '_.wrap does not exist in Sugar. However, Function#bind can be used to achieve the same effect in a pinch.',
    original_code: "_.wrap(fn, function(fn){ return fn() + 3; })",
    sugar_code: "(function(fn){ return fn() + 3; }).bind(null, fn)",
    ref: 'Function/bind'
  },
  {
    name: 'compose',
    description: 'Returns the composition of a list of functions.',
    sugar_compatibility: 0,
    sugar_notes: '_.compose does not exist in Sugar. However, Function#bind can help to achieve the same effect in a pinch.',
    original_code: "_.compose(fn1, fn2, *)",
    sugar_code: "Array.prototype.compose = function(){ var i = 0, fn; while(i < arguments.length){ fn = (function(){ return this.apply(this, arguments); }).bind(arguments[i]); i++;  } return fn; } fn1.compose(fn2)",
    ref: 'Function/bind'
  },
  {
    name: 'keys',
    description: "Retrieves all the names of an object's properties.",
    sugar_compatibility: 3,
    sugar_notes: '_.keys exists natively in modern browsing engines as Object.keys. Sugar provides this method when it is not supported, and additionally allows a callback to be run against each key. Sugar can also create extended objects which have this method available as an instance method.',
    original_code: '_.keys(obj)',
    sugar_code: 'Object.keys(obj)',
    ref: 'Object/keys'
  },
  {
    name: 'values',
    description: "Retrieves all the values of an object's properties.",
    sugar_compatibility: 3,
    sugar_notes: '_.values exists in Sugar as Object.values, which can also accept a callback. Sugar can also create extended objects which have this method available as an instance method.',
    original_code: '_.values(obj)',
    sugar_code: 'Object.values(obj)',
    ref: 'Object/values'
  },
  {
    name: 'functions',
    description: 'Returns a sorted list of every method in the object.',
    sugar_compatibility: 0,
    sugar_notes: '_.functions does not exist in Sugar. However, Sugar makes it easy to reproduce the result.',
    original_code: '_.functions(obj)',
    sugar_code: 'Object.keys(obj).filter(function(key){ return Object.isFunction(obj[key]); })'
  },
  {
    name: 'extend',
    description: 'Copies all of the properties of the source object to the destination.',
    sugar_compatibility: 3,
    sugar_notes: "_.extend exists in Sugar as Object.merge. In the place of the ability to merge an unlimited number of objects, Sugar instead includes a parameter to determine how property conflicts should be resolved. However, extended objects can chain for the same effect.",
    original_code: '_.extend(obj1, obj2, obj3)',
    sugar_code: 'Object.extended(obj1).merge(obj2).merge(obj3)',
    ref: 'Object/merge'
  },
  {
    name: 'defaults',
    description: 'Fills in missing properties in the object with default values.',
    sugar_compatibility: 3,
    sugar_notes: "_.defaults can be achieved in Sugar by passing false as the last argument to Object.merge. This will indicate that conflicts should preserve the target object's properties. The third parameter is to indicate a shallow merge.",
    original_code: '_.defaults(obj, defaultProperties)',
    sugar_code: 'Object.merge(obj, defaultProperties, false, false)',
    ref: 'Object/merge'
  },
  {
    name: 'clone',
    description: 'Creates a shallow clone of the object.',
    sugar_compatibility: 3,
    sugar_notes: '_.clone exists in Sugar as Object.clone. Cloning is shallow by default but there is an option for deep cloning as well.',
    original_code: '_.clone(obj)',
    sugar_code: 'Object.clone(obj)',
    ref: 'Object/clone'
  },
  {
    name: 'tap',
    description: 'Invokes interceptor with the object, and then returns object. The primary purpose of this method is to "tap into" a method chain, in order to perform operations on intermediate results within the chain.',
    sugar_compatibility: 2,
    sugar_notes: '_.tap exists in Sugar as Object.tap. This method is mostly only useful when using extended objects or modifying the Object.prototype with Object.extend().',
    original_code: '_.tap(obj)',
    sugar_code: 'Object.tap(obj)',
    ref: 'Object/tap'
  },
  {
    name: 'isEqual',
    description: 'Performs a deep comparison between two objects to determine if they are equal.',
    sugar_compatibility: 2,
    sugar_notes: '_.isEqual exists in Sugar as Object.equal. Note also that in its instance method form the naming changes to "equals" for better readability.',
    original_code: '_.isEqual(obj1, obj2)',
    sugar_code: 'Object.equal(obj1, obj2)',
    ref: 'Object/equal'
  },
  {
    name: 'isElement',
    description: 'Returns true if the object is a DOM element.',
    sugar_compatibility: 0,
    sugar_notes: "_.isElement does not exist in Sugar, as it has no direct association with the DOM. However this functionality can be easily replicated (taken from Underscore's own implementation).",
    original_code: '_.isElement(obj1)',
    sugar_code: 'Object.isElement = function(obj){ return !!(obj && obj.nodeType == 1); }'
  },
  {
    name: 'isArray',
    description: 'Returns true if the object is an array.',
    sugar_compatibility: 2,
    sugar_notes: "_.isArray exists natively in modern browsing engines as Array.isArray. Sugar provides this when it is not supported and also implements it as Object.isArray to maintain a parallel with other type checking methods.",
    original_code: '_.isArray(obj)',
    sugar_code: 'Array.isArray(obj)',
    ref: 'Array/isArray'
  },
  {
    name: 'isArguments',
    description: 'Returns true if the object is an Arguments object.',
    sugar_compatibility: 2,
    sugar_notes: '_.isArguments does not exist in Sugar. A simple check of the "callee" parameter may be enough to simulate this (and is also cross-browser). Note that Sugar does have Array.create(), which will convert an arguments object into a standard array.',
    original_code: 'if(_.isArguments(obj))',
    sugar_code: 'if(obj.callee)'
  },
  {
    name: 'isFunction',
    description: 'Returns true if the object is a function.',
    sugar_compatibility: 2,
    sugar_notes: '_.isFunction exists as Object.isFunction and is identical.',
    original_code: '_.isFunction(obj)',
    sugar_code: 'Object.isFunction(obj)',
    ref: 'Object/isFunction'
  },
  {
    name: 'isString',
    description: 'Returns true if the object is a string.',
    sugar_compatibility: 2,
    sugar_notes: '_.isString exists as Object.isString and is identical.',
    original_code: '_.isString(obj)',
    sugar_code: 'Object.isString(obj)',
    ref: 'Object/isString'
  },
  {
    name: 'isNumber',
    description: 'Returns true if the object is a number or NaN.',
    sugar_compatibility: 2,
    sugar_notes: '_.isNumber exists as Object.isNumber and is identical.',
    original_code: '_.isNumber(obj)',
    sugar_code: 'Object.isNumber(obj)',
    ref: 'Object/isNumber'
  },
  {
    name: 'isBoolean',
    description: 'Returns true if the object is a boolean.',
    sugar_compatibility: 2,
    sugar_notes: '_.isBoolean exists as Object.isBoolean and is identical.',
    original_code: '_.isBoolean(obj)',
    sugar_code: 'Object.isBoolean(obj)',
    ref: 'Object/isBoolean'
  },
  {
    name: 'isDate',
    description: 'Returns true if the object is a date.',
    sugar_compatibility: 2,
    sugar_notes: '_.isDate exists as Object.isDate and is identical.',
    original_code: '_.isDate(obj)',
    sugar_code: 'Object.isDate(obj)',
    ref: 'Object/isDate'
  },
  {
    name: 'isRegExp',
    description: 'Returns true if the object is a RegExp.',
    sugar_compatibility: 2,
    sugar_notes: '_.isRegExp exists as Object.isRegExp and is identical.',
    original_code: '_.isRegExp(obj)',
    sugar_code: 'Object.isRegExp(obj)',
    ref: 'Object/isRegExp'
  },
  {
    name: 'isNaN',
    description: 'Returns true if the object is NaN.',
    sugar_compatibility: 2,
    sugar_notes: '_.isNaN exists as Object.isNaN and is identical.',
    original_code: '_.isNaN(obj)',
    sugar_code: 'Object.isNaN(obj)',
    ref: 'Object/isNaN'
  },
  {
    name: 'isNull',
    description: 'Returns true if the object is null.',
    sugar_compatibility: 0,
    sugar_notes: '_.isNull does not exist in Sugar. Just use a straight equality comparison.',
    original_code: '_.isNull(obj)',
    sugar_code: 'obj === null'
  },
  {
    name: 'isUndefined',
    description: 'Returns true if the object is undefined.',
    sugar_compatibility: 0,
    sugar_notes: '_.isUndefined does not exist in Sugar. Just use a straight equality comparison.',
    original_code: '_.isUndefined(obj)',
    sugar_code: 'obj === undefined'
  },
  {
    name: 'times',
    description: 'Invokes the passed iterator n times.',
    sugar_compatibility: 2,
    sugar_notes: '_.times exists in Sugar as Number#times and is identical.',
    original_code: '_.times(3, fn)',
    sugar_code: '(3).times(fn)',
    ref: 'Number/times'
  },
  {
    name: 'template',
    description: 'Compiles Javascript templates into functions that can be evaluated for rendering.',
    sugar_compatibility: 1,
    sugar_notes: '_.template exists in Sugar as String#assign with slightly different syntax. Although it does not have the complex "eval" functionality of Underscore, it can be useful for quickly assigning a value inside a string. String#assign will also accept numbers for arguments passed.',
    original_code: "_.template('hello: <%= name %>')({ name: 'joe' })",
    sugar_code: "'hello: {name}'.assign({ name: 'joe' })",
    ref: 'String/assign'
  }
  ]
}
];

