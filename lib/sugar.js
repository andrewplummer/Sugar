(function(){

  var extend = function(klass, name, func){
    if(klass.prototype && !klass.prototype[name]){
      klass.prototype[name] = func;
    }
  }

  var alias = function(klass, name, alias){
    if(klass.prototype && klass.prototype[name]){
      klass.prototype[alias] = klass.prototype[name];
    }
  }

  extend(Number, 'odd', function(){
    return this % 2 != 0;
  });

  extend(Number, 'even', function(){
    return this % 2 == 0;
  });

})();
