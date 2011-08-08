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
      module: Array.prototype,
      methods: [
        {
          name: 'find',
          condition: function() {
            var type = typeof arguments[1];
            return [type != 'number', arguments[1]];
          },
          message: 'Second argument should be a number but instead was {1}'
        }
      ]
    }
  ];


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



  var wrapMethods = function(collisions) {
    var module, collision, i, j;
    for (i = 0; i < collisions.length; i += 1) {
      module = collisions[i].module;
      for (j = 0; j < collisions[i]['methods'].length; j++) {
        wrapMethod(module, collisions[i]['methods'][j]);
      }
    }
  }

  var wrapMethod = function(module, collision) {
    var fn = module[collision.name];
    module[collision.name] = function() {
      var r = collision.condition.apply(this, arguments);
      if(r === true || (r.length && r[0] === true)) {
        warn(supplant(collision.message, r), 3, r[0]);
      }
      return fn.apply(this, arguments);
    }
  };

  function supplant(str, obj) {
    var val;
    return  str.replace(/\{(\d+?)\}/g, function(m, d) {
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
