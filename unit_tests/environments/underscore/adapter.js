

// Don't need this for our purposes
module = function(){};
if(typeof equal != 'undefined') {
  equals = equal;
}
ok = function(actual, message) {
  equal(actual, true, message);
}

raises = function(fn, expected, message) {
  raisesError(fn, message);
};


asyncTest = function(name, delay, fn) {
  test(name, fn);
}

start = function() {
  // Just pass through...
}

notStrictEqual = function(a, b, message) {
  equal(a === b, false, message);
}

var ensureArray = function(obj) {
  if(obj === null) {
    return [];
  } else if(Object.isArray(obj) && (!obj.indexOf || !obj.lastIndexOf)) {
    return obj.concat();
  } else if(!Object.isArray(obj) && typeof obj == 'object') {
    return Array.prototype.slice.call(obj);
  } else {
    return obj;
  }
}

var CompatibleMethods = [
  {
    module: Array.prototype,
    methods: [
      {
        name: 'first',
        method: function(arr, n, guard){
          if(guard) {
            return arr[0];
          }
          return ensureArray(arr).first(n);
        }
      },
      {
        name: 'last',
        method: function(arr, n, third){
          // This is the same check that Underscore makes to hack
          // _.last to work with _.map
          if(third) n = 1;
          return ensureArray(arr).last(n);
        }
      },
      {
        name: 'rest',
        method: function(arr, n, guard){
          if(n === undefined) n = 1;
          if(guard) {
            return arr.slice(1);
          }
          return ensureArray(arr).from(n);
        }
      },
      {
        name: 'compact',
        method: function(arr){
          return ensureArray(arr).compact(true);
        }
      },
      /* Object.extend is no longer compatible as it has conflict resolution now.
      {
        name: 'extend',
        method: function(){
          return Object.SugarMethods['merge'].method.apply(this, arguments);
        }
      },
      */
      /* Array#flatten is no longer compatible as it has levels of flattening (not just deep/shallow)
      {
        name: 'flatten',
        method: function(arr){
          return ensureArray(arr).flatten();
        }
      },
      */
      {
        name: 'uniq',
        method: function(arr){
          return ensureArray(arr).unique();
        }
      },
      {
        name: 'intersection',
        method: function(arr){
          arr = ensureArray(arr);
          var args = Array.prototype.slice.call(arguments, 1);
          return Array.prototype.intersect.apply(arr, args);
        }
      },
      {
        name: 'union',
        method: function(arr, a){
          arr = ensureArray(arr);
          var args = Array.prototype.slice.call(arguments, 1);
          return Array.prototype.union.apply(arr, args);
        }
      },
      /*
      {
        name: 'difference',
        method: function(arr, a){
          arr = ensureArray(arr);
          var args = Array.prototype.slice.call(arguments, 1);
          return Array.prototype.subtract.apply(arr, args);
        }
      },
      */
      {
        name: 'indexOf',
        method: function(arr, a){
          return ensureArray(arr).indexOf(a);
        }
      },
      {
        name: 'lastIndexOf',
        method: function(arr, a){
          return ensureArray(arr).lastIndexOf(a);
        }
      },
      {
        name: 'range',
        method: function(start, stop, step){
          if(arguments.length == 1){
            stop = arguments[0];
            start = 0;
          }
          var shift = step < 0 ? 1 : -1;
          return start.upto(stop + shift, null, step);
        }
      },
      // Collections
      // _.each -> Array#forEach OR Object.each
      // _.map -> Array#map
      // _.reduce -> Array#reduce
      // _.reduceRight -> Array#reduceRight
      // _.invoke is doing some strange tapdancing for passing methods directly...
      // _.sortedIndex ... no direct equivalent
      // _.toArray ... no direct equivalent for arguments... Array.create?
      // _.size ... no direct equivalent for objects... obj.keys().length?
      {
        name: 'detect',
        method: function(arr, fn, context){
          return Array.SugarMethods['find'].method.call(arr, fn.bind(context));
        }
      },
      {
        name: 'select',
        method: function(arr, fn, context){
          return Array.SugarMethods['findAll'].method.call(arr, fn.bind(context));
        }
      },
      {
        name: 'reject',
        method: function(arr, fn, context){
          return Array.SugarMethods['exclude'].method.call(arr, fn.bind(context));
        }
      },
      {
        name: 'all',
        method: function(arr, fn, context){
          return Array.SugarMethods['all'].method.call(arr, fn.bind(context));
        }
      },
      {
        name: 'any',
        method: function(arr, fn, context){
          if(!fn) fn = function(a){ return a; };
          return Array.SugarMethods['some'].method.call(arr, fn.bind(context));
        }
      },
      /*
      {
        name: 'include',
        method: function(arr, val){
          return Array.SugarMethods['has'].method.call(arr, val);
        }
      },
      */
      {
        name: 'pluck',
        method: function(arr, prop){
          return Array.SugarMethods['map'].method.call(arr, prop);
        }
      },
      {
        name: 'max',
        method: function(arr, fn, context){
          if(!fn) fn = function(a){ return a; };
          return Array.SugarMethods['max'].method.call(arr, fn.bind(context))[0];
        }
      },
      {
        name: 'min',
        method: function(arr, fn, context){
          if(!fn) fn = function(a){ return a; };
          return Array.SugarMethods['min'].method.call(arr, fn.bind(context))[0];
        }
      },
      {
        name: 'sortBy',
        method: function(arr, fn, context){
          return Array.SugarMethods['sortBy'].method.call(arr, fn.bind(context));
        }
      },
      {
        name: 'groupBy',
        method: function(arr, fn){
          return Array.SugarMethods['groupBy'].method.call(arr, fn);
        }
      },
      // Objects
      // _.functions ... no direct equivalent
      // _.defaults ... no direct equivalent
      // _.tap ... no direct equivalent
      // _.isElement ... no direct equivalent
      // _.isArguments ... no direct equivalent
      // _.isNaN ... no direct equivalent
      // _.isNull ... no direct equivalent
      // _.isUndefined ... no direct equivalent
      {
        name: 'keys',
        method: function(){
          return Object.SugarMethods['keys'].method.apply(this, arguments);
        }
      },
      {
        name: 'values',
        method: function(){
          return Object.SugarMethods['values'].method.apply(this, arguments);
        }
      },
      {
        name: 'clone',
        method: function(){
          return Object.SugarMethods['clone'].method.apply(this, arguments);
        }
      },
      {
        name: 'isEqual',
        method: function(a, b){
          if (a && a._chain) a = a._wrapped;
          if (b && b._chain) b = b._wrapped;
          if (a && a.isEqual) return a.isEqual(b);
          if (b && b.isEqual) return b.isEqual(a);
          return Object.SugarMethods['equal'].method.apply(this, arguments);
        }
      },
      {
        name: 'isEmpty',
        method: function(){
          return Object.SugarMethods['isEmpty'].method.apply(this, arguments);
        }
      },
      {
        name: 'isArray',
        method: function(arr){
          return Array.isArray(arr);
        }
      },
      {
        name: 'isFunction',
        method: function(){
          return Object.SugarMethods['isFunction'].method.apply(this, arguments);
        }
      },
      {
        name: 'isString',
        method: function(){
          return Object.SugarMethods['isString'].method.apply(this, arguments);
        }
      },
      {
        name: 'isNumber',
        method: function(){
          if(isNaN(arguments[0])) {
            // Sugar differs here as it's trying to stay aligned with Javascript and is
            // checking types only.
            return false;
          }
          return Object.SugarMethods['isNumber'].method.apply(this, arguments);
        }
      },
      {
        name: 'isBoolean',
        method: function(){
          return Object.SugarMethods['isBoolean'].method.apply(this, arguments);
        }
      },
      {
        name: 'isDate',
        method: function(){
          return Object.SugarMethods['isDate'].method.apply(this, arguments);
        }
      },
      {
        name: 'isRegExp',
        method: function(){
          return Object.SugarMethods['isRegExp'].method.apply(this, arguments);
        }
      },
      // Functions
      // _.bindAll ... no direct equivalent (similar to bindAsEventListener??)
      // _.memoize ... no direct equivalent
      // _.debounce ... no direct equivalent
      // _.once ... no direct equivalent.. is this not similar to memoize?
      // _.wrap ... no direct equivalent..
      // _.compose ... no direct equivalent.. math stuff
      {
        name: 'bind',
        method: function(fn){
          var args = Array.prototype.slice.call(arguments, 1);
          return Function.prototype.bind.apply(fn, args);
        }
      },
      {
        name: 'after',
        method: function(num, fn){
          return Function.prototype.after.apply(fn, [num]);
        }
      },
      {
        name: 'delay',
        method: function(fn){
          var args = Array.prototype.slice.call(arguments, 1);
          return Function.prototype.delay.apply(fn, args);
        }
      },
      {
        name: 'defer',
        method: function(fn){
          var args = Array.prototype.slice.call(arguments, 1);
          return Function.prototype.delay.apply(fn, [1].concat(args));
        }
      },
      {
        name: 'throttle',
        method: function(fn, wait){
          return Function.prototype.lazy.apply(fn, [wait]);
        }
      },
      // Utility
      // _.noConflict ... no direct equivalent
      // _.identity ... no direct equivalent
      // _.mixin ... no direct equivalent
      // _.uniqueId ... no direct equivalent
      // _.template ... no direct equivalent
      // _.chain ... no direct equivalent
      // _.value ... no direct equivalent
      {
        name: 'times',
        method: function(n, fn){
          return n.times(fn);
        }
      }
    ]
  }
];

var mapMethods = function() {
  var proto;
  CompatibleMethods.forEach(function(cm) {
    cm.methods.forEach(function(m) {
      _[m.name] = m.method;
    });
  });
}

mapMethods();
