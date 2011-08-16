(function() {

  var defineProperty = function(target, name, method) {
    // defineProperty exists in IE8 but will error when trying to define a property on
    // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
    if(Object.defineProperty && Object.defineProperties){
      Object.defineProperty(target, name, { value: method, configurable: true, enumerable: false, writeable: true });
    } else {
      target[name] = method;
    }
  };

  var stored = {};

  var PrototypeCollisions = [
    {
      module: 'window',
      instance_methods: [
        {
          name: '$A',
          message: '$A casts objects into arrays. It does not exist in Sugar, but Object#merge can achieve something similar:',
          recommend_before: "$A({ 0: 'a', 1: 'b', 2: 'c' })",
          recommend_after: "Object.merge([], { 0: 'a', 1: 'b', 2: 'c' })",
        },
        {
          name: '$H',
          message: '$H exists in Sugar as Object.extended.\nThis will return an extended object with instance methods on it similar to hashes in Prototype.\nKeep in mind, however, that the instance methods available to extended objects in Sugar do not 100% match those of Prototype.',
          recommend_before: "$H({ 0: 'a', 1: 'b', 2: 'c' })",
          recommend_after: "Object.extended({ 0: 'a', 1: 'b', 2: 'c' })",
        }
      ]
    },
    {
      module: 'Hash',
      instance_methods: [
        {
          name: 'each',
          condition: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          message: 'Second argument to .each should be a number but instead was {1}. If you need to bind context, use Function#bind instead:',
          recommend_before: "new Hash().each(function(){}, 'context')",
          recommend_after: "Object.extended().each(function(){}.bind('context'))",
        },
        {
          name: 'get',
          message: 'Sugar extended objects do not have a "get" method.\nSimply access the property as you would a normal object literal.',
          recommend_before: "var h = new Hash({ foo: 'bar' }); h.get('foo')",
          recommend_after: "var h = Object.extended({ foo: 'bar' }); h['foo']",
        },
        {
          name: 'index',
          message: 'Sugar extended objects do not have an "index" method.\nTo find a key in an extended object, you will have to iterate over it manually.',
          recommend_before: "var key = new Hash({ foo: 'bar' }).index('bar')",
          recommend_after: "Object.extended({ foo: 'bar' }).each(function(k, v){ if(v == 'bar') var key = k; })",
        },
        {
          name: 'inspect',
          message: 'Sugar extended objects do not have an "inspect" method.\nConsider using JSON.stringify() instead.\nThe JSON global does not exist in all implementations but should be enough to get you through a debug session:',
          recommend_before: "new Hash({ foo: 'bar' }).inspect()",
          recommend_after: "JSON.stringify(Object.extended({ foo: 'bar' }))"
        },
        {
          name: 'merge',
          message: 'Sugar extended have a "merge" method, however they merge the incoming object onto the original and modify it.\nIf you need to create a clone, use the "clone" method first.',
          recommend_before: "new Hash({ foo: 'bar' }).merge({ moo: 'car' })",
          recommend_after: "Object.extended({ foo: 'bar' }).clone().merge({ moo: 'car' })"
        },
        {
          name: 'set',
          message: 'Sugar extended objects do not have a "set" method.\nSimply set the property as you would a normal object literal.',
          recommend_before: "var h = new Hash({ foo: 'bar' }); h.set('moo', 'car')",
          recommend_after: "var h = Object.extended({ foo: 'bar' }); h['moo'] = 'car'",
        },
        {
          name: 'toJSON',
          message: 'Sugar extended objects do not have a "toJSON" method. \nJSON.stringify may work as an alternative, but it is not available in all browsers.\nIf you absolutely require JSON support, consider adding in a separate library such as:\nhttps://github.com/douglascrockford/JSON-js',
          recommend_before: "Object.toJSON(obj)",
          recommend_after: "JSON.stringify(obj)"
        },
        {
          name: 'toObject',
          message: 'Sugar extended objects do not have a "toObject" method, as they already behave like vanilla objects.'
        },
        {
          name: 'unset',
          message: 'Sugar extended objects do not have an "unset" method.\nSimply delete the property as you would a normal object literal.',
          recommend_before: "var h = new Hash({ foo: 'bar' }); h.unset('foo')",
          recommend_after: "var h = Object.extended({ foo: 'bar' }); delete h.foo",
        },
        {
          name: 'update',
          message: 'Sugar extended objects do not have an "update" method.\nAs this merges objects into the hash in place, simply use the "merge" method instead.',
          recommend_before: "new Hash({ foo: 'bar' }).merge({ moo: 'car' })",
          recommend_after: "Object.extended({ foo: 'bar' }).merge({ moo: 'car' })"
        },
        /***
         *
         * Hash#clone exists and is identical
         * Hash#keys exists and is identical
         * Hash#values exists and is identical
         *
         * Hash#toQueryString is for DOM
         * Hash#toTemplateReplacements is for DOM
         *
         **/
      ]
    },
    {
      module: 'Object',
      class_methods: [
        {
          name: 'clone',
          condition: function(obj) {
            var deep = false;
            for(var key in obj){
              if(!obj.hasOwnProperty(key)) continue;
              if(typeof obj[key] == 'object'){
                deep = true;
              }
            }
            return deep;
          },
          message: 'Object.clone was called on a deep (nested) object. Be aware that Sugar will make DEEP copies of such objects. This is different from Prototype, which makes shallow copies. Additionally, Prototype will clone properties in the prototype chain which Sugar will not do.'
        },
        {
          name: 'extend',
          message: 'Object.extend does not exist in Sugar. Use Object.merge instead:',
          recommend_before: "Object.extend( { a: 1 }, { b: 2 })",
          recommend_after: "Object.merge( { a: 1 }, { b: 2 })",
        },
        {
          name: 'inspect',
          message: 'Object.inspect does not exist in Sugar. Consider using JSON.stringify(object) instead.\nThe JSON global does not exist in all implementations but should be enough to get you through a debug session:',
          recommend_before: "Object.inspect([1,2,3])",
          recommend_after: "JSON.stringify([1,2,3])"
        },
        {
          name: 'isHash',
          message: 'Object.isHash does not exist in Sugar. Use Object.isObject instead:',
          recommend_before: "Object.isHash({ a: 1 })",
          recommend_after: "Object.isObject({ a: 1 })"
        },
        {
          name: 'isUndefined',
          message: 'Object.isUndefined does not exist in Sugar. Use straight Javascript instead:',
          recommend_before: "Object.isUndefined(obj)",
          recommend_after: "obj === undefined"
        },
        {
          name: 'toJSON',
          message: 'Object.toJSON does not exist in Sugar.\nJSON.stringify may work as an alternative, but it is not available in all browsers.\nIf you absolutely require JSON support, consider adding in a separate library such as:\nhttps://github.com/douglascrockford/JSON-js',
          recommend_before: "Object.toJSON(obj)",
          recommend_after: "JSON.stringify(obj)"
        },
        /***
         *
         * Object.isArray exists and is identical
         * Object.isDate exists and is identical
         * Object.isFunction exists and is identical
         * Object.isNumber exists and is identical
         * Object.isString exists and is identical
         * Object.keys exists and is identical
         * Object.values exists and is identical
         *
         * Object.isElement is for DOM
         * Object.toHTML is for DOM
         * Object.toQueryString is for DOM
         *
         **/
      ]
    },
    {
      module: 'Array',
      class_methods: [
        {
          name: 'from',
          message: 'Array.from does not exist in Sugar. Object.merge can accomplish similar functionality:',
          recommend_before: "Array.from({ 0: 'a', 1: 'b', 2: 'c' })",
          recommend_after: "Object.merge([], { 0: 'a', 1: 'b', 2: 'c' })",
        }
      ],
      instance_methods: [
        {
          name: 'collect',
          message: 'Enumerable#collect does not exist in Sugar. Use Array#map instead:',
          recommend_before: "[1,2,3].collect(function(n){ return n * 2; })",
          recommend_after: "[1,2,3].map(function(n){ return n * 2; })",
        },
        {
          name: 'detect',
          message: 'Enumerable#detect does not exist in Sugar. Use Array#find instead:',
          recommend_before: "[1,2,3].detect(function(n){ return n > 1; })",
          recommend_after: "[1,2,3].find(function(n){ return n > 1; })",
        },
        {
          name: 'each',
          condition: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          message: 'Second argument to .each should be a number but instead was {1}. If you need to bind context, use Function#bind instead:',
          recommend_before: "['a','b','c'].each(function(){}, 'context')",
          recommend_after: "['a','b','c'].each(function(){}.bind('context'))",
          one_time_warning: 'Caution: If a callback passed to Array#each returns false, it will break out of the loop.'
        },
        {
          name: 'eachSlice',
          message: 'Enumerable#eachSlice does not exist in Sugar. Use Array#inGroupsOf instead:',
          recommend_before: "[1,2,3,4].eachSlice(2, function(){})",
          recommend_after: "[1,2,3,4].inGroupsOf(2).each(function(){})"
        },
        {
          name: 'entries',
          message: 'Enumerable#entries does not exist in Sugar. Use Array#clone instead:',
          recommend_before: "[1,2,3].entries()",
          recommend_after: "[1,2,3].clone()"
        },
        {
          name: 'find',
          condition: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          message: 'Second argument to Array#find should be a number but instead was {1}. If you need to bind context, use Function#bind instead:',
          recommend_before: "['a','b','c'].find(function(){}, 'context')",
          recommend_after: "['a','b','c'].find(function(){}.bind('context'))"
        },
        {
          name: 'findAll',
          condition: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          message: 'Second argument to Array#findAll should be a number but instead was {1}. If you need to bind context, use Function#bind instead:',
          recommend_before: "['a','b','c'].findAll(function(){}, 'context')",
          recommend_after: "['a','b','c'].findAll(function(){}.bind('context'))"
        },
        {
          name: 'grep',
          message: 'Enumerable#grep does not exist in Sugar. Use Array#findAll instead:',
          recommend_before: "['a','b','c'].grep(/[ab]/)",
          recommend_after: "['a','b','c'].findAll(/[ab]/)"
        },
        {
          name: 'include',
          condition: function(f) {
            return typeof f !== 'object' && arguments.length == 1;
          },
          message: 'Enumerable#include in Protype detects if an element is in the array and returns true/false.\nIn Sugar this method instead adds the argument passed to the array without modifying it.\nArray#include is a reciprocal of Array#exclude, and a non-destructive version of Array#add.\nUse Array#has instead for equivalent functionality.',
          recommend_before: "[1,2,3].include(1)",
          recommend_after: "[1,2,3].has(1)"
        },
        {
          name: 'inject',
          message: 'Enumerable#inject does not exist in Sugar. Use Javascript native Array#reduce to achieve the same effect:',
          recommend_before: '[1,2,3,4].inject(100, function(a, b){ return a + b; });',
          recommend_after: '[1,2,3,4].reduce(function(a, b){ return a + b; }, 100);'
        },
        {
          name: 'invoke',
          message: 'Enumerable#invoke does not exist in Sugar. Use Array#map to achieve the same effect:',
          recommend_before: "['hello','world'].invoke('toUpperCase')",
          recommend_after: "['hello','world'].map('toUpperCase')"
        },
        {
          name: 'max',
          condition: function(f) {
            return arguments.length > 0;
          },
          message: 'Use caution when using Enumerable#max:\n\n(1) Sugar will return an array of maximum values (as there can be more than one), where Prototype only returns the first value.\n(2) When using iterators, Prototype will return the value compared, where Sugar will return the actual array element itself.\n(3) Finally, Sugar does not allow a context to be passed.',
          recommend_before: "[{ a: 5 },{ a: 10 }].max(function(el){ return el['a']; }, 'context')",
          recommend_after: "[{ a: 5 },{ a: 10 }].max(function(el){ return el['a']; }.bind('context')).first().a"
        },
        {
          name: 'member',
          message: 'Enumerable#member does not exist in Sugar. Use Array#has instead:',
          recommend_before: "[1,2,3].member(1)",
          recommend_after: "[1,2,3].has(1)"
        },
        {
          name: 'min',
          condition: function(f) {
            return arguments.length > 0;
          },
          message: 'Use caution when using Enumerable#min:\n\n(1) Sugar will return an array of minimum values (as there can be more than one), where Prototype only returns the first value.\n(2) When using iterators, Prototype will return the value compared, where Sugar will return the actual array element itself.\n(3) Finally, Sugar does not allow a context to be passed.',
          recommend_before: "[{ a: 5 },{ a: 10 }].min(function(el){ return el['a']; }, 'context')",
          recommend_after: "[{ a: 5 },{ a: 10 }].min(function(el){ return el['a']; }.bind('context')).first().a"
        },
        {
          name: 'partition',
          message: "Enumerable#partition does not exist in Sugar.\nArray#group however has similar functionality, and may be a suitable alternative.\nIt will create a hash with keys based on the return values of the iterator, with each grouping as the value.\nInstead of accessing the split array, you can access the hash by these keys.\nThis method has the added advantage that it can also split into more than two groups.",
          recommend_before: "[1,2,3,4,5,6].partition(function(n){ return n % 2 === 0; })",
          recommend_after: "[1,2,3,4,5,6].group(function(n){ return n % 2 === 0 ? 'even' : 'odd'; })"
        },
        {
          name: 'pluck',
          message: 'Enumerable#pluck does not exist in Sugar. Use Array#map instead:',
          recommend_before: "['hello','world'].pluck('length')",
          recommend_after: "['hello','world'].map('length')"
        },
        {
          name: 'reject',
          message: "Enumerable#reject does not exist in Sugar. Its equivalent is Array#exclude.\nThis is a non-destructive way to remove elements from an array.\nIf you want a destructive version, use Array#remove instead.\nAlso note these methods' reciprocals: Array#include and Array#add.",
          recommend_before: "[1,2,3].reject(function(n){ n < 3; })",
          recommend_after: "[1,2,3].exclude(function(n){ n < 3; })"
        },
        {
          name: 'select',
          message: 'Enumerable#select does not exist in Sugar. Use Array#findAll instead:',
          recommend_before: "[1,2,3].select(function(n){ n < 3; })",
          recommend_after: "[1,2,3].findAll(function(n){ n < 3; })"
        },
        {
          name: 'sortBy',
          condition: function(f, scope) {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'boolean', arguments[1]];
          },
          message: 'Second argument to .sortBy should be a boolean but instead was {1}. If you need to bind context, use Function#bind instead:',
          recommend_before: "[{ a: 5 },{ a: 10 }].sortBy(function(el){ return el['a']; })",
          recommend_after: "[{ a: 5 },{ a: 10 }].sortBy(function(el){ return el['a']; }.bind('context'))"
        },
        {
          name: 'size',
          message: 'Enumerable#size does not exist in Sugar. Just use array.length!',
          recommend_before: "[1,2,3].size()",
          recommend_after: "[1,2,3].length"
        },
        {
          name: 'toArray',
          message: 'Enumerable#toArray does not exist in Sugar. Use Array#clone instead:',
          recommend_before: "[1,2,3].toArray()",
          recommend_after: "[1,2,3].clone()"
        },
        {
          name: 'zip',
          message: 'Enumerable#zip does not exist in Sugar. Array#map can easily achieve the same functionality, however:',
          recommend_before: "firstNames.zip(lastNames)",
          recommend_after: "firstNames.map(function(name, index){ return [name, lastNames[index]]; })"
        },
        {
          name: 'compact',
          condition: function() {
            for(var i = 0; i < this.length; i++){
              if(isNaN(this[i])) return true;
            }
            return false;
          },
          message: 'Caution: Array#compact was called on an array that contains NaN values. Sugar will remove these from the array while Prototype leaves them alone:'
        },
        {
          name: 'clear',
          message: 'Array#clear does not exist in Sugar. Use array = [] instead:',
          recommend_before: "f.clear()",
          recommend_after: "f = []"
        },
        {
          name: 'inspect',
          message: 'Array#inspect does not exist in Sugar. Consider using JSON.stringify(array) instead.\nThe JSON global does not exist in all implementations but should be enough to get you through a debug session:',
          recommend_before: "[1,2,3].inspect()",
          recommend_after: "JSON.stringify([1,2,3])"
        },
        {
          name: 'reverse',
          condition: function(inline) {
            return inline === false;
          },
          message: 'Array#reverse exists in native Javascript, but is destructive. Try cloning the array first:',
          recommend_before: "array.reverse(false)",
          recommend_after: "array.clone().reverse()"
        },
        {
          name: 'uniq',
          message: 'Array#uniq exists in Sugar as Array#unique:',
          recommend_before: "[1,1,1].uniq()",
          recommend_after: "[1,1,1].unique()"
        },
        {
          name: 'without',
          message: 'Array#without exists in Sugar as Array#exclude:',
          recommend_before: "[1,2,3].without(3)",
          recommend_after: "[1,2,3].exclude(3)"
        }
        /***
         *
         * Enumerable#all exists and is identical
         * Enumerable#any exists and is identical
         * Enumerable#every exists and is identical
         * Enumerable#filter exists and is identical
         * Enumerable#inGroupsOf exists and is identical
         * Enumerable#inspect is the same as Array#inspect here
         * Enumerable#map exists and is identical
         * Enumerable#size is the same as Array#size here
         * Enumerable#some exists and is identical
         * Enumerable#toArray is the same as Array#toArray here
         *
         * Array#clone exists and is identical
         * Array#compact also removes NaN
         * Array#first exists and will work with no arguments
         * Array#flatten exists and is identical
         * Array#indexOf polyfill exists and is identical
         * Array#intersect exists and will work with 1 argument
         * Array#last exists and will work with no arguments
         * Array#lastIndexOf polyfill exists and is identical
         *
         **/
      ]
    }
  ];


  var warn = function(message, level, skipMeta, docs) {
    var stack, match, file, line;
    stack = new Error().stack;
    if(stack) {
      match = stack.split('\n')[level].match(/@(.+):(\d+)$/);
      file = match[1];
      if(file.match(/prototype[^/]+$/)) {
        // Assumed to be internally called method, so don't display warnings in this case.
        return;
      }
      line = match[2];
      if(!skipMeta) {
        message += '\n\n----------- File: ' + file + ' ---------\n----------- Line: ' + line + ' --------------';
        if(docs){
          message += '\n----------- Docs: ' + docs + ' ---------';
        }
      }
    }
    console.warn(message);
  };



  var wrapMethods = function(collisions) {
    for (var i = 0; i < collisions.length; i += 1) {
      wrapModule(collisions[i].module, collisions[i]['class_methods']);
      wrapModule(collisions[i].module, collisions[i]['instance_methods'], true);
    }
  }

  var wrapModule = function(name, methods, instance){
    if(!methods) return;
    for (var i = 0; i < methods.length; i++) {
      wrapMethod(name, methods[i], instance);
    }
  }

  var wrapMethod = function(module, collision, instance) {
    var m;
    if(module == 'window') {
      m = window;
    } else {
      m = instance ? window[module].prototype : window[module];
    }
    var fn = m[collision.name], message = collision.message;
    m[collision.name] = function() {
      var r = collision.condition ? collision.condition.apply(this, arguments) : true;
      if(r === true || (r.length && r[0] === true)) {
        message = supplant(message, r);
        if(collision.recommend_before){
          //message += '\n\nSugar equivalent...\n';
          message += '\n\n';
          message += '\nPrototype:    ' + collision.recommend_before;
          message += '\nSugar:        ' + collision.recommend_after;
          message += '\n';
        }
        var ref = 'http://sugarjs.com/api/#!/' + module + '#' + (collision.alternate || collision.name);
        warn(message, 3, false, ref);
      }
      if(collision.one_time_warning && !collision.warned) {
        warn(collision.one_time_warning, 3, true);
        collision.warned = true;
      }
      return fn.apply(this, arguments);
    }
  };

  function supplant(str, obj) {
    var val;
    return  str.replace(/\{(.+?)\}/g, function(m, d) {
      val = obj[d];
      return val !== undefined ? val : m;
    });
  }



  var initialize = function() {
    var welcome =
    '### Welcome to the Sugar analyzer script! ###\n\n' +
    'As your program calls various methods, it will warn you about incompatibilities with Sugar, and give suggestions\n' +
    'about how to refactor. You can run this before refactoring to get a general idea about what needs to change,\n' +
    'or you can flip out Prototype for Sugar, let breakages happen, and fix as you go!\n\n';
    console.info(welcome);
    if(typeof Prototype != 'undefined') {
      wrapMethods(PrototypeCollisions);
    } else if(typeof Mootools != 'undefined') {
      wrapMethods(MootoolsCollisions);
    }
  }

  initialize();


})();
