
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


  RegExp.escape = function(text){
    return text.replace(/([/'*+?|()\[\]{}])/g,'\\$1');
  }

  extend(Number, {

    'odd': function(){
      return this % 2 != 0;
    },

    'even': function(){
      return this % 2 == 0;
    }

  });

    var accentedChars = {
      'à': { 'base': 'a', 'accent': '`' },
      'ā': { 'base': 'a', 'accent': '-' },
      'á': { 'base': 'a', 'accent': '\''},
      'ǎ': { 'base': 'a', 'accent': 'v' },
      'ä': { 'base': 'a', 'accent': ':' },
      'ă': { 'base': 'a', 'accent': 'u' },
      'â': { 'base': 'a', 'accent': '^' },
      'å': { 'base': 'a', 'accent': 'o' },
      'ã': { 'base': 'a', 'accent': '~' },
      'ć': { 'base': 'c', 'accent': '\''},
      'č': { 'base': 'c', 'accent': 'v' },
      'ç': { 'base': 'c', 'accent': ',' },
      'ď': { 'base': 'd', 'accent': 'v' },
      'đ': { 'base': 'd', 'accent': '-' },
      'è': { 'base': 'e', 'accent': '`' },
      'ē': { 'base': 'e', 'accent': '-' },
      'é': { 'base': 'e', 'accent': '\''},
      'ě': { 'base': 'e', 'accent': 'v' },
      'ë': { 'base': 'e', 'accent': ':' },
      'ĕ': { 'base': 'e', 'accent': 'u' },
      'ê': { 'base': 'e', 'accent': '^' },
      'ğ': { 'base': 'g', 'accent': 'u' },
      'ì': { 'base': 'i', 'accent': '`' },
      'ī': { 'base': 'i', 'accent': '-' },
      'í': { 'base': 'i', 'accent': '\''},
      'ǐ': { 'base': 'i', 'accent': 'v' },
      'ï': { 'base': 'i', 'accent': ':' },
      'ĭ': { 'base': 'i', 'accent': 'u' },
      'î': { 'base': 'i', 'accent': '^' },
      'ĩ': { 'base': 'i', 'accent': '~' },
      'ĺ': { 'base': 'l', 'accent': '`' },
      'ľ': { 'base': 'l', 'accent': '\''},
      'ł': { 'base': 'l', 'accent': '/' },
      'ň': { 'base': 'n', 'accent': 'v' },
      'ń': { 'base': 'n', 'accent': '\''},
      'ñ': { 'base': 'n', 'accent': '~' },
      'ò': { 'base': 'o', 'accent': '`' },
      'ō': { 'base': 'o', 'accent': '-' },
      'ó': { 'base': 'o', 'accent': '\''},
      'ǒ': { 'base': 'o', 'accent': 'v' },
      'ö': { 'base': 'o', 'accent': ':' },
      'ŏ': { 'base': 'o', 'accent': 'u' },
      'ô': { 'base': 'o', 'accent': '^' },
      'õ': { 'base': 'o', 'accent': '~' },
      'ø': { 'base': 'o', 'accent': '/' },
      'ő': { 'base': 'o', 'accent': '"' },
      'ř': { 'base': 'r', 'accent': 'v' },
      'ŕ': { 'base': 'r', 'accent': '\''},
      'š': { 'base': 's', 'accent': 'v' },
      'ş': { 'base': 's', 'accent': ',' },
      'ś': { 'base': 's', 'accent': '\''},
      'ť': { 'base': 't', 'accent': '\''},
      'ţ': { 'base': 't', 'accent': ',' },
      'ù': { 'base': 'u', 'accent': '`' },
      'ū': { 'base': 'u', 'accent': '-' },
      'ú': { 'base': 'u', 'accent': '\''},
      'ǔ': { 'base': 'u', 'accent': 'v' },
      'ü': { 'base': 'u', 'accent': ':' },
      'ŭ': { 'base': 'u', 'accent': 'u' },
      'û': { 'base': 'u', 'accent': '^' },
      'ů': { 'base': 'u', 'accent': 'o' },
      'ǘ': { 'base': 'u', 'accent': '\':'},
      'ǖ': { 'base': 'u', 'accent': '-:' },
      'ý': { 'base': 'y', 'accent': '\''},
      'ÿ': { 'base': 'y', 'accent': ':' },
      'ŷ': { 'base': 'y', 'accent': '^' },
      'ž': { 'base': 'z', 'accent': 'v' },
      'ź': { 'base': 'z', 'accent': '\''},
      'ż': { 'base': 'z', 'accent': '.' },
      'þ': { 'base': 'th', 'accent': '' },
      'ð': { 'base': 'dh', 'accent': '' },
      'ß': { 'base': 'ss', 'accent': '' },
      'œ': { 'base': 'oe', 'accent': '' },
      'æ': { 'base': 'ae', 'accent': '' },
      'µ': { 'base': 'u', 'accent': '|' }
    }


    var normalizeTable;
    var accentTable;

    var buildNormalizeTable = function(){
      normalizeTable = {};
      for(var character in accentedChars){
        if(accentedChars.hasOwnProperty(character)){
            var base = accentedChars[character].base;
            if(!normalizeTable[base]) normalizeTable[base] = '';
            normalizeTable[base] += character;
        }
      }
      for(var base in normalizeTable){
        if(normalizeTable.hasOwnProperty(base)){
            var chars = normalizeTable[base];
            normalizeTable[base] = new RegExp('[' + chars + ']', 'g');
            normalizeTable[base.toUpperCase()] = new RegExp('[' + chars.toUpperCase() + ']', 'g');
        }
      }
    }

    var buildAccentTable = function(){
      accentTable = {};
      for(var character in accentedChars){
        if(accentedChars.hasOwnProperty(character)){
            var accent = accentedChars[character].accent;
            var base = accentedChars[character].base;
            if(!accentTable[accent]) accentTable[accent] = {};
            accentTable[accent][base] = character;
            accentTable[accent][base.toUpperCase()] = character.toUpperCase();
        }
      }
    }

    buildAccentTable();
    buildNormalizeTable();


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
      if(typeof reg == 'string') reg = new RegExp(RegExp.escape(reg), 'gi');
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
    },

    'normalize': function(){
      var text = this;
      for(var character in normalizeTable){
        if(normalizeTable.hasOwnProperty(character)){
          var reg = normalizeTable[character];
          text = text.replace(reg, character);
        }
      }
      return text;
    },

    'accent': function(accent){
      accent = accent || '';
      if(accentTable[accent] && accentTable[accent][this]){
        return accentTable[accent][this]
      } else {
        return this;
      }
    },

    'startsWith': function(str){
      return new RegExp('^' + str, 'i').test(this);
    },

    'endsWith': function(str){
      return new RegExp(str + '$', 'i').test(this);
    }






  });

})();
