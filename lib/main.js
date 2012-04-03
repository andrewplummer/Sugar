if(typeof window === 'undefined') {

  require('./core');
  require('./dates');
  require('./inflections');

  function eachClass(fn) {
    [String, Number, Array, Date, Object, Function, RegExp].forEach(fn);
  }

  function eachMethod(klass, fn) {
    var name, obj;
    for(name in klass.SugarMethods) {
      if(!klass.SugarMethods.hasOwnProperty(name)) continue;
      obj = klass.SugarMethods[name];
      fn(name, obj.instance, obj.method, obj.original);
    }
  }

  function exportMethods() {
    eachClass(function(klass) {
      var subClass = function() {};
      subClass.prototype = new klass();
      eachMethod(klass, function(name, instance, method) {
        var target = instance ? subClass.prototype : subClass;
        target[name] = method;
      });
      module.exports[klass.name] = subClass;
    });
  }

  module.exports = {
    noConflict: function() {
      eachClass(function(klass) {
        eachMethod(klass, function(name, instance, method, original) {
          var source = instance ? klass.prototype : klass;
          // Remove the method if Sugar put it there.
          if(source[name] === method) {
            if(original) {
              source[name] = original;
            } else {
              delete source[name];
            }
          }
        });
      });
    }
  }

  exportMethods();

}
