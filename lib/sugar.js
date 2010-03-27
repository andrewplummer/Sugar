
(function(){

  var override = true;

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

  var getArgumentsWithOptionalBlock = function(args){
    var argsObj = {};
    var humanized = ['first', 'second', 'third'];
    for(var i=0; i<args.length; i++){
      if(typeof args[i] == 'function'){
        argsObj['block'] = args[i];
      } else {
        argsObj[humanized[i]] = args[i];
      }
    }
    return argsObj;
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
    },

    'trim': function(sides){
      sides = sides || 'both';
      var str = this;
      if(sides === 'left' || sides === 'leading' || sides === 'both'){
        str = str.replace(/^\s\s*/, '');
      }
      if(sides === 'right' || sides === 'trailing' || sides === 'both'){
        str = str.replace(/\s\s*$/, '');
      }
      return str;
    },

    'pad': function(num, padding){
      num = num || 0;
      padding = padding || ' ';
      var str = this;
      for(var i=0; i<num; i++){
        str = padding + str + padding;
      }
      return str;
    },

    'repeat': function(num){
      num = num || 0;
      if(num < 0) return this;
      var str = '';
      for(var i=0; i<num; i++){
        str += this;
      }
      return str;
    },

    'chars': function(){
      return this.split('');
    },

    'each': function(){
      var args = getArgumentsWithOptionalBlock(arguments);
      if(!args.block) return false;
      var reg = args.first || /./g;
      var mode = args.second || 'match';
      if(typeof reg == 'string') reg = new RegExp(reg, 'g');
      var split = mode == 'split' ? this.split(reg) : this.match(reg);
      for(var i=0; i<split.length; i++){
        args.block.call(this, split[i], i);
      }
      return true;
    },

    'eachWord': function(){
      var args = getArgumentsWithOptionalBlock(arguments);
      return this.each(/\s+/, 'split', args.block);
    },

    'eachLine': function(){
      var args = getArgumentsWithOptionalBlock(arguments);
      return this.each(/\n/, 'split', args.block);
    },

    'eachParagraph': function(){
      var args = getArgumentsWithOptionalBlock(arguments);
      return this.each(/\n{2,}/, 'split', args.block);
    }



  });

})();
