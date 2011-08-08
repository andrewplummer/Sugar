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

  var warnings = {
    array: {
      find: {
        condition: function() {
          var type = typeof arguments[1];
          if(type != 'number'){
            warn('Second argument to find should be a number but instead found ' + type, 4);
          }
        },
        message: 'Second argument should be a number.'
      }
    }
  };


  var arrayMethods = ['find'];

  var warn = function(message, level) {
    var stack, match, file, line;
    stack = new Error().stack;
    if(stack) {
      match = stack.split('\n')[level].match(/@(.+):(\d+)$/);
      file = match[1];
      line = match[2];
      message += '\nFile: ' + file + '\nLine: ' + line;
    }
    console.warn(message);
  };



  var wrapMethods = function(klass, warnings, arr) {
    for (var i = 0; i < arr.length; i += 1) {
      (function() {
        var name = arr[i];
        var fn = klass.prototype[name];
        var w = warnings[name];
        klass.prototype[name] = function() {
          if(w && (!w.condition || w.condition.apply(this, arguments) === true)) {
            //warn(w.message);
          } else if(!w) {
            warn('"' + name + '" does not exist in Sugar!', 3);
          }
          return fn.apply(this, arguments);
        }
      })();
    };
  }



  var initialize = function() {
    wrapMethods(Array, warnings.array, arrayMethods);
  }

  initialize();


})();
