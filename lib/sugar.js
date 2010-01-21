
(function(){

  var override = false;

  //var override = false;
  var extend = function(klass, extend){
    for(var name in extend){
      if(extend.hasOwnProperty(name) && (!klass.prototype[name] || override)){
        klass.prototype[name] = extend[name];
      }
    }
    if(override){
      klass.prototype.sugarOverride = true;
    }
  }

  var alias = function(klass, name, alias){
    if(klass.prototype && klass.prototype[name]){
      klass.prototype[alias] = klass.prototype[name];
    }
  }

  extend(Number, {

    'odd': function(){
      return this % 2 != 0;
    },

    'even': function(){
      return this % 2 == 0;
    }

  });

  extend(String, {

    'capitalize': function(){
      return this.substr(0,1).toUpperCase() + this.substr(1).toLowerCase();
    }

  });

})();
