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
          message: 'Object.clone was called on a deep (nested) object. Be aware that Sugar will make DEEP copies of such objects. This is different from Prototype, which makes shallow copies. Additionally, Prototype will clone properties in the prototype chain which Sugar does not do.'
        },
      ]
    },
    {
      module: 'Array',
      instance_methods: [
        {
          name: 'find',
          condition: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          message: 'Second argument to .find should be a number but instead was {1}',
          recommend_before: "['a','b','c'].find(function(){}, 'context');",
          recommend_after: "['a','b','c'].find(function(){}.bind('context'));"
        },
        {
          name: 'findAll',
          condition: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          message: 'Second argument to .findAll should be a number but instead was {1}',
          recommend_before: "['a','b','c'].findAll(function(){}, 'context');",
          recommend_after: "['a','b','c'].findAll(function(){}.bind('context'));"
        },
        {
          name: 'each',
          condition: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          message: 'Second argument to .each should be a number but instead was {1}',
          recommend_before: "['a','b','c'].each(function(){}, 'context');",
          recommend_after: "['a','b','c'].each(function(){}.bind('context'));",
          one_time_warning: 'Caution: If a callback passed to Array#each returns false, it will break out of the loop.'
        },
        {
          name: 'compact',
          condition: function() {
            for(var i = 0; i < this.length; i++){
              if(isNaN(this[i])) return true;
            }
            return false;
          },
          message: '.compact was called on an array that contains NaN values. Sugar will remove these from the array while Prototype leaves them alone.'
        },
        {
          name: 'include',
          condition: function(f) {
            return typeof f !== 'object' && arguments.length == 1;
          },
          message: 'Array#include in Protype detects if an element is in the array and returns true/false.\nIn Sugar this method includes the argument passed into the array.\nIt is a reciprocal of Array#remove, and a non-destructive mirror method of Array#add.'
        },
        {
          name: 'min',
          condition: function(f) {
            return arguments.length > 0;
          },
          message: 'Use caution when using Array#min:\n\n(1) Sugar will return an array of minimum values (as there can be more than one), where Prototype only returns the first value.\n(2) When using iterators, Prototype will return the value compared, where Sugar will return the actual array element itself.\n(3) Finally, Sugar does not allow a context to be passed.',
          recommend_before: "[{ a: 5 },{ a: 10 }].min(function(el){ return el['a']; }, 'context');",
          recommend_after: "[{ a: 5 },{ a: 10 }].min(function(el){ return el['a']; }.bind('context')).first().a;"
        },
        {
          name: 'max',
          condition: function(f) {
            return arguments.length > 0;
          },
          message: 'Use caution when using Array#max:\n\n(1) Sugar will return an array of maximum values (as there can be more than one), where Prototype only returns the first value.\n(2) When using iterators, Prototype will return the value compared, where Sugar will return the actual array element itself.\n(3) Finally, Sugar does not allow a context to be passed.',
          recommend_before: "[{ a: 5 },{ a: 10 }].max(function(el){ return el['a']; }, 'context');",
          recommend_after: "[{ a: 5 },{ a: 10 }].max(function(el){ return el['a']; }.bind('context')).first().a;"
        },
        {
          name: 'sortBy',
          condition: function(f, scope) {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'boolean', arguments[1]];
          },
          message: 'Second argument to .sortBy should be a boolean but instead was {1}',
          recommend_before: "[{ a: 5 },{ a: 10 }].sortBy(function(el){ return el['a']; });",
          recommend_after: "[{ a: 5 },{ a: 10 }].sortBy(function(el){ return el['a']; }.bind('context'));"
        },
        {
          name: 'collect',
          alternate: 'map'
        },
        {
          name: 'detect',
          alternate: 'find'
        }
      ]
    }
  ];


  var warn = function(message, level, skipMeta, docs) {
    var stack, match, file, line;
    stack = new Error().stack;
    if(stack) {
      match = stack.split('\n')[level].match(/@(.+):(\d+)$/);
      file = match[1];
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
    var m = instance ? window[module].prototype : window[module];
    var fn = m[collision.name], message = collision.message;
    m[collision.name] = function() {
      var r = collision.condition ? collision.condition.apply(this, arguments) : true;
      if(collision.alternate){
        message = module + '#' + collision.name + ' does not exist in Sugar. Use ' + module + '#' + collision.alternate + ' instead.';
      }
      if(r === true || (r.length && r[0] === true)) {
        message = supplant(message, r);
        if(collision.recommend_before){
          message += '\n\nSugar equivalent:\n';
          message += '\nthis:          ' + collision.recommend_before;
          message += '\nbecomes:       ' + collision.recommend_after;
          message += '\n\n';
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
    if(typeof Prototype != 'undefined') {
      wrapMethods(PrototypeCollisions);
    } else if(typeof Mootools != 'undefined') {
      wrapMethods(MootoolsCollisions);
    }
  }

  initialize();


})();
