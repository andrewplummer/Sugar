
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

  var getArgumentsWithOptionalBlock = function(args){
    var argsObj = {};
    var humanized = ['first', 'second', 'third'];
    for(var i=0; i<args.length; i++){
      if(isFunction(args[i])){
        argsObj['block'] = args[i];
      } else {
        argsObj[humanized[i]] = args[i];
      }
    }
    return argsObj;
  }

  var getStringArgumentsAsHash = function(args){
    var argsObj = {};
    for(var i=0; i<args.length; i++){
      argsObj[args[i]] = true;
    }
    return (i == 0) ? null : argsObj;
  }

  var collectArguments = function(args){
    if(typeof args[0] === 'object') return args;
    var result = {};
    var format = Array.prototype.slice.call(arguments, 1);
    for(var i = 0; i < args.length; i++){
      result[format[i]] = args[i];
    }
    return [result];
  }

  var deepEquals = function(a,b){
    if(typeof a == 'object' && typeof b == 'object'){
      for(var key in a){
        if(!a.hasOwnProperty(key)) continue;
        if(!deepEquals(a[key], b[key])){
          return false;
        }
      }
      return true;
    } else {
      return a === b;
    }
  }

  var multiMatch = function(el, match, param){
    if(match instanceof RegExp){
      // Match against a regexp
      return match.test(el);
    } else if(isFunction(match)){
      // Match against a filtering function
      return match.call(this, el, param);
    } else if(typeof match === 'object'){
      // Match against a hash
      return deepEquals(match, el);
    } else if(match !== undefined){
      // Do a one-to-one equals
      return match === el;
    } else {
      // If undefined, match unconditionally.
      return true;
    }
  }

  var isFunction = function(obj){
    return Object.prototype.toString.call(obj) === '[object Function]';
  }

  var transformArgument = function(argument, transform){
    var type = typeof transform;
    if(type == 'function'){
      return transform(argument);
    } else if(type == 'undefined'){
      return argument;
    } else {
      return argument[transform];
    }
  }

  var getMinOrMax = function(obj, which, transform){
    var max = which === 'max', min = which === 'min';
    var edge = max ? -Infinity : Infinity;
    var result = [];
    for(var key in obj){
      if(!obj.hasOwnProperty(key)) continue;
      var entry = obj[key];
      var test = transformArgument(entry, transform);
      if(test === edge){
        result.push(entry);
      } else if((max && test > edge) || (min && test < edge)){
        result = [entry];
        edge = test;
      }
    }
    return result;
  }


  // RegExp escaping
  RegExp.escape = function(text){
    return text.replace(/([/'*+?|()\[\]{}.^$])/g,'\\$1');
  }

  extend(Number, {

    /**
     * toNumber
     *
     * @parameters PARAMS!
     * @returns The number.
     * @description No notes, fucker.
     *
     */
    'toNumber': function(){
      return parseFloat(this, 10);
    },

    /**
     * ceil
     *
     * @parameters BOOF!
     * @returns Buff!
     * @description muff?>@>
     *
     */
    'ceil': function(){
      return Math.ceil(this);
    },

    'floor': function(){
      //allow precision here???
      return Math.floor(this);
    },

    'abs': function(){
      return Math.abs(this);
    },

    'pow': function(power){
      return Math.pow(this, power);
    },

    'round': function(precision){
      precision = Math.pow(10, precision || 0);
      return Math.round(this * precision) / precision;
    },

    'chr': function(){
      return String.fromCharCode(this);
    },

    'odd': function(){
      return !this.multipleOf(2);
    },

    'even': function(){
      return this.multipleOf(2);
    },

    'multipleOf': function(num){
      return this % num === 0;
    },

    'upto': function(num, block){
      var arr = [];
      for(var i = parseInt(this); i <= num; i++){
        arr.push(i);
        if(block) block.call(this, i);
      }
      return arr;
    },

    'downto': function(num, block){
      var arr = [];
      for(var i = parseInt(this); i >= num; i--){
        arr.push(i);
        if(block) block.call(this, i);
      }
      return arr;
    },

    'times': function(block){
      for(var i = 0; i < this; i++){
        block(i);
      }
      return this.toNumber();
    },

    'ordinalize': function(){
      var suffix;
      if(this >= 11 && this <= 13){
        suffix = 'th';
      } else {
        switch(this % 10){
          case 1:  suffix = 'st'; break;
          case 2:  suffix = 'nd'; break;
          case 3:  suffix = 'rd'; break;
          default: suffix = 'th';
        }
      }
      return this.toString() + suffix;
    },

    'pad': function(num, force){
      var str  = this.toNumber() === 0 ? '' : this.toString().replace(/^-/, '');
      var sign = '';
      if(this < 0){
        force = true;
        sign = '-';
      } else {
        sign = '+';
      }
      return (force ? sign : '') + str.pad(num - str.length, '0', 'left');
    },

    'format': function(comma, period){
      comma = comma || ',';
      period = period || '.';
      var split = this.toString().split('.');
      var numeric = split[0];
      var decimal = split.length > 1 ? period + split[1] : '';
      var reg = /(\d+)(\d{3})/;
      while (reg.test(numeric)){
        numeric = numeric.replace(reg, '$1' + comma + '$2');
      }
      return numeric + decimal;
    },

    'hex': function(){
      return this.toString(16);
    },

    'blank': function(){
      return false;
    },

    'since': function(time){
      time = time || new Date();
      return new Date(time.getTime() + this);
    },

    'ago': function(time){
      time = time || new Date();
      return new Date(time.getTime() - this);
    }



  });

  // Alias
  extend(Number, {
      'fromNow': Number.prototype.since,
      'until': Number.prototype.ago
  });


  var timeAlias = function(type, multiplier){
    var baseFunc  = function(){ return this * multiplier; }
    var agoFunc   = function(time){ return this[type]().ago(time); }
    var sinceFunc = function(time){ return this[type]().since(time); }
    Number.prototype[type] = baseFunc;
    Number.prototype[type + 's'] = baseFunc;
    Number.prototype[type + 'Ago'] = agoFunc;
    Number.prototype[type + 'sAgo'] = agoFunc;
    Number.prototype[type + 'Until'] = agoFunc;
    Number.prototype[type + 'sUntil'] = agoFunc;
    Number.prototype[type + 'Since'] = sinceFunc;
    Number.prototype[type + 'sSince'] = sinceFunc;
    Number.prototype[type + 'FromNow'] = sinceFunc;
    Number.prototype[type + 'sFromNow'] = sinceFunc;
  }


  timeAlias('second', 1000);
  timeAlias('minute', 1000 * 60);
  timeAlias('hour'  , 1000 * 60 * 60);
  timeAlias('day'   , 1000 * 60 * 60 * 24);
  timeAlias('week'  , 1000 * 60 * 60 * 24 * 7);
  timeAlias('month' , 1000 * 60 * 60 * 24 * 30);
  timeAlias('year'  , 1000 * 60 * 60 * 24 * 365.25);


  /* Handling accented characters */

  var accentedChars = [
    { 'char': 'à', 'base': 'a', 'accent': '`'  },
    { 'char': 'ā', 'base': 'a', 'accent': '-'  },
    { 'char': 'á', 'base': 'a', 'accent': '\'' },
    { 'char': 'ǎ', 'base': 'a', 'accent': 'v'  },
    { 'char': 'ä', 'base': 'a', 'accent': ':'  },
    { 'char': 'ă', 'base': 'a', 'accent': 'u'  },
    { 'char': 'â', 'base': 'a', 'accent': '^'  },
    { 'char': 'å', 'base': 'a', 'accent': 'o'  },
    { 'char': 'ã', 'base': 'a', 'accent': '~'  },
    { 'char': 'ć', 'base': 'c', 'accent': '\'' },
    { 'char': 'č', 'base': 'c', 'accent': 'v'  },
    { 'char': 'ç', 'base': 'c', 'accent': ','  },
    { 'char': 'ď', 'base': 'd', 'accent': 'v'  },
    { 'char': 'đ', 'base': 'd', 'accent': '-'  },
    { 'char': 'è', 'base': 'e', 'accent': '`'  },
    { 'char': 'ē', 'base': 'e', 'accent': '-'  },
    { 'char': 'é', 'base': 'e', 'accent': '\'' },
    { 'char': 'ě', 'base': 'e', 'accent': 'v'  },
    { 'char': 'ë', 'base': 'e', 'accent': ':'  },
    { 'char': 'ĕ', 'base': 'e', 'accent': 'u'  },
    { 'char': 'ê', 'base': 'e', 'accent': '^'  },
    { 'char': 'ğ', 'base': 'g', 'accent': 'u'  },
    { 'char': 'ì', 'base': 'i', 'accent': '`'  },
    { 'char': 'ī', 'base': 'i', 'accent': '-'  },
    { 'char': 'í', 'base': 'i', 'accent': '\'' },
    { 'char': 'ǐ', 'base': 'i', 'accent': 'v'  },
    { 'char': 'ï', 'base': 'i', 'accent': ':'  },
    { 'char': 'ĭ', 'base': 'i', 'accent': 'u'  },
    { 'char': 'î', 'base': 'i', 'accent': '^'  },
    { 'char': 'ĩ', 'base': 'i', 'accent': '~'  },
    { 'char': 'ĺ', 'base': 'l', 'accent': '`'  },
    { 'char': 'ľ', 'base': 'l', 'accent': '\'' },
    { 'char': 'ł', 'base': 'l', 'accent': '/'  },
    { 'char': 'ň', 'base': 'n', 'accent': 'v'  },
    { 'char': 'ń', 'base': 'n', 'accent': '\'' },
    { 'char': 'ñ', 'base': 'n', 'accent': '~'  },
    { 'char': 'ò', 'base': 'o', 'accent': '`'  },
    { 'char': 'ō', 'base': 'o', 'accent': '-'  },
    { 'char': 'ó', 'base': 'o', 'accent': '\'' },
    { 'char': 'ǒ', 'base': 'o', 'accent': 'v'  },
    { 'char': 'ö', 'base': 'o', 'accent': ':'  },
    { 'char': 'ŏ', 'base': 'o', 'accent': 'u'  },
    { 'char': 'ô', 'base': 'o', 'accent': '^'  },
    { 'char': 'õ', 'base': 'o', 'accent': '~'  },
    { 'char': 'ø', 'base': 'o', 'accent': '/'  },
    { 'char': 'ő', 'base': 'o', 'accent': '"'  },
    { 'char': 'ř', 'base': 'r', 'accent': 'v'  },
    { 'char': 'ŕ', 'base': 'r', 'accent': '\'' },
    { 'char': 'š', 'base': 's', 'accent': 'v'  },
    { 'char': 'ş', 'base': 's', 'accent': ','  },
    { 'char': 'ś', 'base': 's', 'accent': '\'' },
    { 'char': 'ť', 'base': 't', 'accent': '\'' },
    { 'char': 'ţ', 'base': 't', 'accent': ','  },
    { 'char': 'ù', 'base': 'u', 'accent': '`'  },
    { 'char': 'ū', 'base': 'u', 'accent': '-'  },
    { 'char': 'ú', 'base': 'u', 'accent': '\'' },
    { 'char': 'ǔ', 'base': 'u', 'accent': 'v'  },
    { 'char': 'ü', 'base': 'u', 'accent': ':'  },
    { 'char': 'ŭ', 'base': 'u', 'accent': 'u'  },
    { 'char': 'û', 'base': 'u', 'accent': '^'  },
    { 'char': 'ů', 'base': 'u', 'accent': 'o'  },
    { 'char': 'ǘ', 'base': 'u', 'accent': '\':'},
    { 'char': 'ǖ', 'base': 'u', 'accent': '-:' },
    { 'char': 'ý', 'base': 'y', 'accent': '\'' },
    { 'char': 'ÿ', 'base': 'y', 'accent': ':'  },
    { 'char': 'ŷ', 'base': 'y', 'accent': '^'  },
    { 'char': 'ž', 'base': 'z', 'accent': 'v'  },
    { 'char': 'ź', 'base': 'z', 'accent': '\'' },
    { 'char': 'ż', 'base': 'z', 'accent': '.'  },
    { 'char': 'þ', 'base': 'th', 'accent': ''  },
    { 'char': 'ð', 'base': 'dh', 'accent': ''  },
    { 'char': 'ß', 'base': 'ss', 'accent': ''  },
    { 'char': 'œ', 'base': 'oe', 'accent': ''  },
    { 'char': 'æ', 'base': 'ae', 'accent': ''  },
    { 'char': 'µ', 'base': 'u', 'accent': '|'  }
  ];


  var normalizeTable;
  var accentTable;

  var buildNormalizeTable = function(){
    normalizeTable = {};
    var tempTable = {};
    for(var i=0; i<accentedChars.length; i++){
      var c = accentedChars[i];
      var character = c['char'];
      var base      = c['base'];
      if(!tempTable[base]) tempTable[base] = character;
      else tempTable[base] += character;
    }
    for(var base in tempTable){
      if(!tempTable.hasOwnProperty(base)) continue;
      var chars = tempTable[base];
      normalizeTable[base] = new RegExp('[' + chars + ']', 'g');
      normalizeTable[base.toUpperCase()] = new RegExp('[' + chars.toUpperCase() + ']', 'g');
    }
  }

  var buildAccentTable = function(){
    accentTable = {};
    for(var i=0; i<accentedChars.length; i++){
      var c = accentedChars[i];
      var character = c['char'];
      var accent = c.accent;
      var base = c.base;
      if(!accentTable[accent]) accentTable[accent] = {};
      accentTable[accent][base] = character;
      accentTable[accent][base.toUpperCase()] = character.toUpperCase();
    }
  }




  /* Handling half-width and full-width characters */


  var variableWidthChars = [

    { full:'　', half:' ',  type: 'p' },
    { full:'、', half:'､',  type: 'p' },
    { full:'。', half:'｡',  type: 'p' },
    { full:'，', half:',',  type: 'p' },
    { full:'．', half:'.',  type: 'p' },
    { full:'・', half:'･',  type: 'p' },
    { full:'：', half:':',  type: 'p' },
    { full:'；', half:';',  type: 'p' },
    { full:'？', half:'?',  type: 'p' },
    { full:'！', half:'!',  type: 'p' },
    { full:'‘',  half:'\'', type: 'p' },
    { full:'’',  half:'\'', type: 'p' },
    { full:'“',  half:'"',  type: 'p' },
    { full:'”',  half:'"',  type: 'p' },
    { full:'ー', half:'ｰ',  type: 'p' },
    { full:'～', half:'~',  type: 'p' },
    { full:'゛', half:'ﾞ',  type: 's' },
    { full:'゜', half:'ﾟ',  type: 's' },
    { full:'＾', half:'^',  type: 's' },
    { full:'‐',  half:'-',  type: 's' },
    { full:'／', half:'/',  type: 's' },
    { full:'｜', half:'|',  type: 's' },
    { full:'（', half:'(',  type: 's' },
    { full:'）', half:')',  type: 's' },
    { full:'［', half:'[',  type: 's' },
    { full:'］', half:']',  type: 's' },
    { full:'｛', half:'{',  type: 's' },
    { full:'｝', half:'}',  type: 's' },
    { full:'「', half:'｢',  type: 's' },
    { full:'」', half:'｣',  type: 's' },
    { full:'〈', half:'<',  type: 's' },
    { full:'〉', half:'>',  type: 's' },
    { full:'《', half:'«',  type: 's' },
    { full:'》', half:'»',  type: 's' },
    { full:'＋', half:'+',  type: 's' },
    { full:'－', half:'-',  type: 's' },
    { full:'＝', half:'=',  type: 's' },
    { full:'＜', half:'<',  type: 's' },
    { full:'＞', half:'>',  type: 's' },
    { full:'℃',  half:'°C', type: 's' },
    { full:'￥', half:'¥',  type: 's' },
    { full:'＄', half:'$',  type: 's' },
    { full:'￠', half:'¢',  type: 's' },
    { full:'￡', half:'£',  type: 's' },
    { full:'％', half:'%',  type: 's' },
    { full:'＃', half:'#',  type: 's' },
    { full:'＆', half:'&',  type: 's' },
    { full:'＊', half:'*',  type: 's' },
    { full:'＠', half:'@',  type: 's' },
    { full:'０', half:'0',  type: 'n' },
    { full:'１', half:'1',  type: 'n' },
    { full:'２', half:'2',  type: 'n' },
    { full:'３', half:'3',  type: 'n' },
    { full:'４', half:'4',  type: 'n' },
    { full:'５', half:'5',  type: 'n' },
    { full:'６', half:'6',  type: 'n' },
    { full:'７', half:'7',  type: 'n' },
    { full:'８', half:'8',  type: 'n' },
    { full:'９', half:'9',  type: 'n' },
    { full:'Ａ', half:'A',  type: 'a' },
    { full:'Ｂ', half:'B',  type: 'a' },
    { full:'Ｃ', half:'C',  type: 'a' },
    { full:'Ｄ', half:'D',  type: 'a' },
    { full:'Ｅ', half:'E',  type: 'a' },
    { full:'Ｆ', half:'F',  type: 'a' },
    { full:'Ｇ', half:'G',  type: 'a' },
    { full:'Ｈ', half:'H',  type: 'a' },
    { full:'Ｉ', half:'I',  type: 'a' },
    { full:'Ｊ', half:'J',  type: 'a' },
    { full:'Ｋ', half:'K',  type: 'a' },
    { full:'Ｌ', half:'L',  type: 'a' },
    { full:'Ｍ', half:'M',  type: 'a' },
    { full:'Ｎ', half:'N',  type: 'a' },
    { full:'Ｏ', half:'O',  type: 'a' },
    { full:'Ｐ', half:'P',  type: 'a' },
    { full:'Ｑ', half:'Q',  type: 'a' },
    { full:'Ｒ', half:'R',  type: 'a' },
    { full:'Ｓ', half:'S',  type: 'a' },
    { full:'Ｔ', half:'T',  type: 'a' },
    { full:'Ｕ', half:'U',  type: 'a' },
    { full:'Ｖ', half:'V',  type: 'a' },
    { full:'Ｗ', half:'W',  type: 'a' },
    { full:'Ｘ', half:'X',  type: 'a' },
    { full:'Ｙ', half:'Y',  type: 'a' },
    { full:'Ｚ', half:'Z',  type: 'a' },
    { full:'ａ', half:'a',  type: 'a' },
    { full:'ｂ', half:'b',  type: 'a' },
    { full:'ｃ', half:'c',  type: 'a' },
    { full:'ｄ', half:'d',  type: 'a' },
    { full:'ｅ', half:'e',  type: 'a' },
    { full:'ｆ', half:'f',  type: 'a' },
    { full:'ｇ', half:'g',  type: 'a' },
    { full:'ｈ', half:'h',  type: 'a' },
    { full:'ｉ', half:'i',  type: 'a' },
    { full:'ｊ', half:'j',  type: 'a' },
    { full:'ｋ', half:'k',  type: 'a' },
    { full:'ｌ', half:'l',  type: 'a' },
    { full:'ｍ', half:'m',  type: 'a' },
    { full:'ｎ', half:'n',  type: 'a' },
    { full:'ｏ', half:'o',  type: 'a' },
    { full:'ｐ', half:'p',  type: 'a' },
    { full:'ｑ', half:'q',  type: 'a' },
    { full:'ｒ', half:'r',  type: 'a' },
    { full:'ｓ', half:'s',  type: 'a' },
    { full:'ｔ', half:'t',  type: 'a' },
    { full:'ｕ', half:'u',  type: 'a' },
    { full:'ｖ', half:'v',  type: 'a' },
    { full:'ｗ', half:'w',  type: 'a' },
    { full:'ｘ', half:'x',  type: 'a' },
    { full:'ｙ', half:'y',  type: 'a' },
    { full:'ｚ', half:'z',  type: 'a' },
    { full:'ァ', half:'ｧ',  type: 'k' },
    { full:'ア', half:'ｱ',  type: 'k' },
    { full:'ィ', half:'ｨ',  type: 'k' },
    { full:'イ', half:'ｲ',  type: 'k' },
    { full:'ゥ', half:'ｩ',  type: 'k' },
    { full:'ウ', half:'ｳ',  type: 'k' },
    { full:'ェ', half:'ｪ',  type: 'k' },
    { full:'エ', half:'ｴ',  type: 'k' },
    { full:'ォ', half:'ｫ',  type: 'k' },
    { full:'オ', half:'ｵ',  type: 'k' },
    { full:'カ', half:'ｶ',  type: 'k' },
    { full:'ガ', half:'ｶﾞ', type: 'k' },
    { full:'キ', half:'ｷ',  type: 'k' },
    { full:'ギ', half:'ｷﾞ', type: 'k' },
    { full:'ク', half:'ｸ',  type: 'k' },
    { full:'グ', half:'ｸﾞ', type: 'k' },
    { full:'ケ', half:'ｹ',  type: 'k' },
    { full:'ゲ', half:'ｹﾞ', type: 'k' },
    { full:'コ', half:'ｺ',  type: 'k' },
    { full:'ゴ', half:'ｺﾞ', type: 'k' },
    { full:'サ', half:'ｻ',  type: 'k' },
    { full:'ザ', half:'ｻﾞ', type: 'k' },
    { full:'シ', half:'ｼ',  type: 'k' },
    { full:'ジ', half:'ｼﾞ', type: 'k' },
    { full:'ス', half:'ｽ',  type: 'k' },
    { full:'ズ', half:'ｽﾞ', type: 'k' },
    { full:'セ', half:'ｾ',  type: 'k' },
    { full:'ゼ', half:'ｾﾞ', type: 'k' },
    { full:'ソ', half:'ｿ',  type: 'k' },
    { full:'ゾ', half:'ｿﾞ', type: 'k' },
    { full:'タ', half:'ﾀ',  type: 'k' },
    { full:'ダ', half:'ﾀﾞ', type: 'k' },
    { full:'チ', half:'ﾁ',  type: 'k' },
    { full:'ヂ', half:'ﾁﾞ', type: 'k' },
    { full:'ッ', half:'ｯ',  type: 'k' },
    { full:'ツ', half:'ﾂ',  type: 'k' },
    { full:'ヅ', half:'ﾂﾞ', type: 'k' },
    { full:'テ', half:'ﾃ',  type: 'k' },
    { full:'デ', half:'ﾃﾞ', type: 'k' },
    { full:'ト', half:'ﾄ',  type: 'k' },
    { full:'ド', half:'ﾄﾞ', type: 'k' },
    { full:'ナ', half:'ﾅ',  type: 'k' },
    { full:'ニ', half:'ﾆ',  type: 'k' },
    { full:'ヌ', half:'ﾇ',  type: 'k' },
    { full:'ネ', half:'ﾈ',  type: 'k' },
    { full:'ノ', half:'ﾉ',  type: 'k' },
    { full:'ハ', half:'ﾊ',  type: 'k' },
    { full:'バ', half:'ﾊﾞ', type: 'k' },
    { full:'パ', half:'ﾊﾟ', type: 'k' },
    { full:'ヒ', half:'ﾋ',  type: 'k' },
    { full:'ビ', half:'ﾋﾞ', type: 'k' },
    { full:'ピ', half:'ﾋﾟ', type: 'k' },
    { full:'フ', half:'ﾌ',  type: 'k' },
    { full:'ブ', half:'ﾌﾞ', type: 'k' },
    { full:'プ', half:'ﾌﾟ', type: 'k' },
    { full:'ヘ', half:'ﾍ',  type: 'k' },
    { full:'ベ', half:'ﾍﾞ', type: 'k' },
    { full:'ペ', half:'ﾍﾟ', type: 'k' },
    { full:'ホ', half:'ﾎ',  type: 'k' },
    { full:'ボ', half:'ﾎﾞ', type: 'k' },
    { full:'ポ', half:'ﾎﾟ', type: 'k' },
    { full:'マ', half:'ﾏ',  type: 'k' },
    { full:'ミ', half:'ﾐ',  type: 'k' },
    { full:'ム', half:'ﾑ',  type: 'k' },
    { full:'メ', half:'ﾒ',  type: 'k' },
    { full:'モ', half:'ﾓ',  type: 'k' },
    { full:'ャ', half:'ｬ',  type: 'k' },
    { full:'ヤ', half:'ﾔ',  type: 'k' },
    { full:'ュ', half:'ｭ',  type: 'k' },
    { full:'ユ', half:'ﾕ',  type: 'k' },
    { full:'ョ', half:'ｮ',  type: 'k' },
    { full:'ヨ', half:'ﾖ',  type: 'k' },
    { full:'ラ', half:'ﾗ',  type: 'k' },
    { full:'リ', half:'ﾘ',  type: 'k' },
    { full:'ル', half:'ﾙ',  type: 'k' },
    { full:'レ', half:'ﾚ',  type: 'k' },
    { full:'ロ', half:'ﾛ',  type: 'k' },
    { full:'ワ', half:'ﾜ',  type: 'k' },
    { full:'ヲ', half:'ｦ',  type: 'k' },
    { full:'ン', half:'ﾝ',  type: 'k' }

  ];


  var kana = [

    { 'hira':'ぁ', 'kata':'ァ' },
    { 'hira':'あ', 'kata':'ア' },
    { 'hira':'ぃ', 'kata':'ィ' },
    { 'hira':'い', 'kata':'イ' },
    { 'hira':'ぅ', 'kata':'ゥ' },
    { 'hira':'う', 'kata':'ウ' },
    { 'hira':'ぇ', 'kata':'ェ' },
    { 'hira':'え', 'kata':'エ' },
    { 'hira':'ぉ', 'kata':'ォ' },
    { 'hira':'お', 'kata':'オ' },
    { 'hira':'か', 'kata':'カ' },
    { 'hira':'が', 'kata':'ガ' },
    { 'hira':'き', 'kata':'キ' },
    { 'hira':'ぎ', 'kata':'ギ' },
    { 'hira':'く', 'kata':'ク' },
    { 'hira':'ぐ', 'kata':'グ' },
    { 'hira':'け', 'kata':'ケ' },
    { 'hira':'げ', 'kata':'ゲ' },
    { 'hira':'こ', 'kata':'コ' },
    { 'hira':'ご', 'kata':'ゴ' },
    { 'hira':'さ', 'kata':'サ' },
    { 'hira':'ざ', 'kata':'ザ' },
    { 'hira':'し', 'kata':'シ' },
    { 'hira':'じ', 'kata':'ジ' },
    { 'hira':'す', 'kata':'ス' },
    { 'hira':'ず', 'kata':'ズ' },
    { 'hira':'せ', 'kata':'セ' },
    { 'hira':'ぜ', 'kata':'ゼ' },
    { 'hira':'そ', 'kata':'ソ' },
    { 'hira':'ぞ', 'kata':'ゾ' },
    { 'hira':'た', 'kata':'タ' },
    { 'hira':'だ', 'kata':'ダ' },
    { 'hira':'ち', 'kata':'チ' },
    { 'hira':'ぢ', 'kata':'ヂ' },
    { 'hira':'っ', 'kata':'ッ' },
    { 'hira':'つ', 'kata':'ツ' },
    { 'hira':'づ', 'kata':'ヅ' },
    { 'hira':'て', 'kata':'テ' },
    { 'hira':'で', 'kata':'デ' },
    { 'hira':'と', 'kata':'ト' },
    { 'hira':'ど', 'kata':'ド' },
    { 'hira':'な', 'kata':'ナ' },
    { 'hira':'に', 'kata':'ニ' },
    { 'hira':'ぬ', 'kata':'ヌ' },
    { 'hira':'ね', 'kata':'ネ' },
    { 'hira':'の', 'kata':'ノ' },
    { 'hira':'は', 'kata':'ハ' },
    { 'hira':'ば', 'kata':'バ' },
    { 'hira':'ぱ', 'kata':'パ' },
    { 'hira':'ひ', 'kata':'ヒ' },
    { 'hira':'び', 'kata':'ビ' },
    { 'hira':'ぴ', 'kata':'ピ' },
    { 'hira':'ふ', 'kata':'フ' },
    { 'hira':'ぶ', 'kata':'ブ' },
    { 'hira':'ぷ', 'kata':'プ' },
    { 'hira':'へ', 'kata':'ヘ' },
    { 'hira':'べ', 'kata':'ベ' },
    { 'hira':'ぺ', 'kata':'ペ' },
    { 'hira':'ほ', 'kata':'ホ' },
    { 'hira':'ぼ', 'kata':'ボ' },
    { 'hira':'ぽ', 'kata':'ポ' },
    { 'hira':'ま', 'kata':'マ' },
    { 'hira':'み', 'kata':'ミ' },
    { 'hira':'む', 'kata':'ム' },
    { 'hira':'め', 'kata':'メ' },
    { 'hira':'も', 'kata':'モ' },
    { 'hira':'ゃ', 'kata':'ャ' },
    { 'hira':'や', 'kata':'ヤ' },
    { 'hira':'ゅ', 'kata':'ュ' },
    { 'hira':'ゆ', 'kata':'ユ' },
    { 'hira':'ょ', 'kata':'ョ' },
    { 'hira':'よ', 'kata':'ヨ' },
    { 'hira':'ら', 'kata':'ラ' },
    { 'hira':'り', 'kata':'リ' },
    { 'hira':'る', 'kata':'ル' },
    { 'hira':'れ', 'kata':'レ' },
    { 'hira':'ろ', 'kata':'ロ' },
    { 'hira':'ゎ', 'kata':'ヮ' },
    { 'hira':'わ', 'kata':'ワ' },
    { 'hira':'ゐ', 'kata':'ヰ' },
    { 'hira':'ゑ', 'kata':'ヱ' },
    { 'hira':'を', 'kata':'ヲ' },
    { 'hira':'ん', 'kata':'ン' }

  ];

  var fullWidthTable;
  var halfWidthTable;

  var buildVariableWidthTables = function(){
    fullWidthTable = {};
    halfWidthTable = {};
    for(var i=0; i<variableWidthChars.length; i++){
      var c = variableWidthChars[i];
      fullWidthTable[c.half] = c;
      halfWidthTable[c.full] = c;
    }
  }

  var hiraganaTable;
  var katakanaTable;

  var buildKanaTables = function(){
    hiraganaTable = {};
    katakanaTable = {};
    for(var i=0; i<kana.length; i++){
      var k = kana[i];
      hiraganaTable[k.kata] = k;
      katakanaTable[k.hira] = k;
    }
  }

  var variableWidthArguments = function(args){
    /* hanKaku/zenKaku transposition arguments default to everything */
    if(args == null) return {'a': true,'n':true,'k':true,'s':true,'p':true };
    if(args['alphabet'])    args['a'] = true;
    if(args['numbers'])     args['n'] = true;
    if(args['katakana'])    args['k'] = true;
    if(args['special'])     args['s'] = true;
    if(args['punctuation']) args['p'] = true;
    return args;
  }

  buildVariableWidthTables();
  buildKanaTables();

  RegExp.NPCGSupport = /()??/.exec("")[1] === undefined; // NPCG: nonparticipating capturing group
  var nativeSplit = String.prototype.split;
  var nativeMatch = String.prototype.match;

  extend(String, {

    'escapeRegExp': function(){
      return RegExp.escape(this);
    },

    'capitalize': function(){
      return this.substr(0,1).toUpperCase() + this.substr(1).toLowerCase();
    },

    'trim': function(){
      return this.trimLeft().trimRight();
    },

    'trimLeft': function(){
      return this.replace(/^[\s　][\s　]*/, '');
    },

    'trimRight': function(){
      return this.replace(/[\s　][\s　]*$/, '');
    },

    'pad': function(num, padding, direction){
      num = num || 0;
      padding = padding || ' ';
      direction = direction || 'both';
      var str = this.toString();
      for(var i=0; i<num; i++){
        if(direction === 'left' || direction === 'both') str = padding + str;
        if(direction === 'right' || direction === 'both') str = str + padding;
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

    'each': function(){
      var args = getArgumentsWithOptionalBlock(arguments);
      var reg = args.first || /./g;
      var mode = args.second || 'match';
      if(typeof reg == 'string') reg = new RegExp(RegExp.escape(reg), 'gi');
      var split = mode == 'split' ? this.split(reg) : this.match(reg);
      if(!split) split = [];
      if(args.block){
        for(var i=0; i<split.length; i++){
          split[i] = args.block.call(this, split[i], i) || split[i];
        }
      }
      return split;
    },

    'bytes': function(){
      var args = getArgumentsWithOptionalBlock(arguments);
      var bytes = [];
      for(var i=0; i<this.length; i++){
        var code = this.charCodeAt(i);
        bytes.push(code);
        if(args.block){
          args.block.call(this, code, i);
        }
      }
      return bytes;
    },

    'chars': function(){
      var args = getArgumentsWithOptionalBlock(arguments);
      return this.trim().each(args.block);
    },

    'words': function(){
      /* note that a 'word' here is anything that is not whitespace,
       * as multi-lingual contexts are being considered */
      var args = getArgumentsWithOptionalBlock(arguments);
      return this.trim().each(/\S+/g, args.block);
    },

    'lines': function(){
      var args = getArgumentsWithOptionalBlock(arguments);
      return this.trim().each(/[\n\r]/g, 'split', args.block);
    },

    'paragraphs': function(){
      var args = getArgumentsWithOptionalBlock(arguments);
      return this.trim().each(/[\r\n]{2,}/, 'split', args.block);
    },

    'normalize': function(){
      var text = this;
      for(var character in normalizeTable){
        if(!normalizeTable.hasOwnProperty(character)) continue;
        var reg = normalizeTable[character];
        text = text.replace(reg, character);
      }
      return text;
    },

    'accent': function(accent){
      accent = accent || '';
      var key = this.toString()
      if(accentTable[accent] && accentTable[accent][this]){
        return accentTable[accent][key];
      } else {
        return key;
      }
    },

    'startsWith': function(str, caseSensitive){
      return new RegExp('^' + str , caseSensitive ? '' : 'i').test(this);
    },

    'endsWith': function(str, caseSensitive){
      return new RegExp(str + '$', caseSensitive ? '' : 'i').test(this);
    },

    'blank': function(){
      return this.trim().length === 0;
    },

    'has': function(find){
      return this.search(find) !== -1;
    },

    'insert': function(str, index){
      index = index || 0;
      if(index < 0) index = this.length + index + 1;
      if(index < 0 || index > this.length) return this;
      return this.substr(0, index) + str + this.substr(index);
    },

    'hanKaku': function(){
      var args = getStringArgumentsAsHash(arguments);
      args = variableWidthArguments(args);
      var text = '';
      for(var i=0; i<this.length; i++){
        var character = this.charAt(i);
        if(halfWidthTable[character] && args[halfWidthTable[character]['type']]){
          text += halfWidthTable[character]['half'];
        } else {
          text += character;
        }
      }
      return text;
    },

    'zenKaku': function(){
      var args = getStringArgumentsAsHash(arguments);
      args = variableWidthArguments(args);
      var text = '';
      for(var i=0; i<this.length; i++){
        var character = this.charAt(i);
        var nextCharacter = this.charAt(i+1);
        if(nextCharacter && fullWidthTable[character + nextCharacter]){
          text += fullWidthTable[character + nextCharacter]['full'];
          i++;
        } else if(fullWidthTable[character] && args[fullWidthTable[character]['type']]){
          text += fullWidthTable[character]['full'];
        } else {
          text += character;
        }
      }
      return text;
    },

    'hiragana': function(convertWidth){
      var str = convertWidth === false ? this : this.zenKaku('k');
      var text = '';
      for(var i=0; i<str.length; i++){
        var character = str.charAt(i);
        if(hiraganaTable[character]){
          text += hiraganaTable[character]['hira'];
        } else {
          text += character;
        }
      }
      return text;
    },

    'katakana': function(){
      var text = '';
      for(var i=0; i<this.length; i++){
        var character = this.charAt(i);
        if(katakanaTable[character]){
          text += katakanaTable[character]['kata'];
        } else {
          text += character;
        }
      }
      return text;
    },

    /* toNumber will return any value with a '.' as a floating point value, otherwise as an integer
     * Also it will throw away leading '0's. This means it will not parse non-decimal numbers correctly. */
    'toNumber': function(base){
      var str = this.replace(/,/g, '');
      return str.match(/\./) ? parseFloat(str) : parseInt(str, base || 10);
    },

    'reverse': function(){
      return this.split('').reverse().join('');
    },

    'compact': function(){
      var str = this.replace(/[\r\n]/g, ''); // remove line breaks
      return str.trim().replace(/([\s　])+/g, '$1');
    },

    'at': function(){
      var result = [];
      for(var i = 0; i < arguments.length; i++){
        var index = arguments[i];
        if(index < 0) index = this.length + index;
        result.push(this.charAt(index));
      }
      return arguments.length > 1 ? result : result.first() || '';
    },

    'first': function(num){
      num = num  === undefined ? 1 : num;
      return this.substr(0, num);
    },

    'last': function(num){
      num = num  === undefined ? 1 : num;
      var start = this.length - num < 0 ? 0 : this.length - num;
      return this.substr(start);
    },

    'from': function(num){
      num = num  === undefined ? 0 : num;
      if(num < 0) num = this.length + num;
      return this.substr(num);
    },

    'to': function(num){
      num = num  === undefined ? this.length : num;
      if(num < 0) num = this.length + num;
      return this.substr(0, num + 1);
    },

    'toDate': function(){
      // The Date class apparently only understands primitive JS strings
      return new Date(this.toString());
    },

    'dasherize': function(){
      return this.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
    },

    'underscore': function(){
      return this.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
    },

    'camelize': function(strCase){
      var split = this.dasherize().split('-');
      var text = '';
      for(var i=0; i<split.length; i++){
        if(strCase === 'lower' && i === 0) text += split[i].toLowerCase();
        else text += split[i].substr(0, 1).toUpperCase() + split[i].substr(1).toLowerCase();
      }
      return text;
    },

    'titleize': function(){
      return this.trim().words(function(s){ return s.capitalize(); }).join(' ');
    },

    'isKatakana': function(){
      return !!this.trim().match(/^[\u30A0-\u30FF\uFF61-\uFF9F\s]+$/);
    },

    'hasKatakana': function(){
      return !!this.match(/[\u30A0-\u30FF\uFF61-\uFF9F]/);
    },

    'isHiragana': function(){
      return !!this.trim().match(/^[\u3040-\u309F\u30FB-\u30FC\s]+$/);
    },

    'hasHiragana': function(){
      return !!this.match(/[\u3040-\u309F\u30FB-\u30FC]/);
    },

    'isKana': function(){
      return !!this.trim().match(/^[\u3040-\u30FF\uFF61-\uFF9F\s]+$/);
    },

    'hasKana': function(){
      return this.hasHiragana() || this.hasKatakana();
    },

    'isHan': function(){
      return !!this.trim().match(/^[\u4E00-\u9FFF\uF900-\uFAFF\s]+$/);
    },

    'hasHan': function(){
      return !!this.match(/[\u4E00-\u9FFF\uF900-\uFAFF]/);
    },

    'isHangul': function(){
      return !!this.match(/^[\uAC00-\uD7AF\s]+$/);
    },

    'hasHangul': function(){
      return !!this.match(/[\uAC00-\uD7AF\s]/);
    },

    'stripTags': function(){
      args = arguments.length > 0 ? arguments : [''];
      var str = this;
      for(var i=0; i < args.length; i++){
        var tag = args[i];
        var reg = new RegExp('<\/?' + tag.escapeRegExp() + '[^<>]*>', 'gi');
        str = str.replace(reg, '');
      }
      return str;
    },

    'removeTags': function(){
      var str = this;
      if(arguments.length == 0){
        str = str.replace(/<.+?\/>/g, '');
        str = str.replace(/<.+?>.*<\/.+?>/g, '');
      } else {
        for(var i=0; i < arguments.length; i++){
          var match = arguments[i].escapeRegExp();
          str = str.replace(new RegExp('<' + match + '[^<>]*?\/>', 'gi'), '');
          str = str.replace(new RegExp('<' + match + '[^<>]*>.*?<\/' + match + '>', 'gi'), '');
        }
      }
      return str;
    },

    /*
     * Many thanks to Steve Levithan here for a ton of inspiration and work dealing with
     * cross browser Regex splitting.  http://blog.stevenlevithan.com/archives/cross-browser-split
     */

    'split': function(separator, limit){
      // If the separator isn't a regex, just use native split
      if(!(separator instanceof RegExp)){
        return nativeSplit.apply(this, arguments);
      }
      var output = [];
      var lastLastIndex = 0;
      var flags = (separator.ignoreCase ? "i" : "") + (separator.multiline  ? "m" : "") + (separator.sticky     ? "y" : "");
      var separator = RegExp(separator.source, flags + "g"); // make `global` and avoid `lastIndex` issues by working with a copy
      var separator2, match, lastIndex, lastLength;
      if(!RegExp.NPCGSupport){
        separator2 = RegExp("^" + separator.source + "$(?!\\s)", flags); // doesn't need /g or /y, but they don't hurt
      }
      if(limit === undefined || +limit < 0){
        limit = Infinity;
      } else {
        limit = Math.floor(+limit);
        if(!limit) return [];
      }

      while (match = separator.exec(this)){
        lastIndex = match.index + match[0].length; // `separator.lastIndex` is not reliable cross-browser
        if(lastIndex > lastLastIndex){
          output.push(this.slice(lastLastIndex, match.index));
          // fix browsers whose `exec` methods don't consistently return `undefined` for nonparticipating capturing groups
          if(!RegExp.NPCGSupport && match.length > 1){
            match[0].replace(separator2, function (){
              for (var i = 1; i < arguments.length - 2; i++){
                if(arguments[i] === undefined){
                  match[i] = undefined;
                }
              }
            });
          }
          if(match.length > 1 && match.index < this.length){
            Array.prototype.push.apply(output, match.slice(1));
          }
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if(output.length >= limit){
            break;
          }
        }
        if(separator.lastIndex === match.index){
          separator.lastIndex++; // avoid an infinite loop
        }
      }
      if(lastLastIndex === this.length){
        if(lastLength || !separator.test("")) output.push("");
      } else {
        output.push(this.slice(lastLastIndex));
      }
      return output.length > limit ? output.slice(0, limit) : output;
    },

    'match': function(reg){
      if(RegExp.NPCGSupport || reg.global){
        return nativeMatch.apply(this, arguments);
      } else {
        var match = nativeMatch.apply(this, arguments);
        if(match){
          for(var i = 1; i < match.length; i++){
            if(match[i] === '') match[i] = undefined;
          }
        }
        return match;
      }
    },

    'toObject': function(sep1, sep2){
      var result = {};
      this.split(sep1 || '&').each(function(el){
        var split   = el.split(sep2 || '=');
        var key     = split[0];
        var value   = split[1];
        var numeric = parseInt(split[1]);
        if(numeric){
          value = numeric;
        } else if(value === 'true'){
          value = true;
        } else if(value === 'false'){
          value = false;
        }
        result[key] = value;
      });
      return result;
    }

  });

  // Alias
  extend(String, {
      'isKanji': String.prototype.isHan,
      'hasKanji': String.prototype.hasHan
  });


  var findInArray = function(arr, find, index){
  }


  // Array
  extend(Array, {

    'indexOf': function(find, offset){
      if(offset < 0) offset = this.length + offset;
      else if(offset === undefined) offset = 0;
      if(offset >= this.length) return -1;
      for(var i=offset,len=this.length; i < len; i++){
        if(this[i] === find) return i;
      }
      return -1;
    },

    'lastIndexOf': function(find, offset){
      if(offset < 0) offset = this.length + offset;
      else if(offset === undefined || offset > this.length) offset = this.length;
      for(var i=offset; i >= 0; i--){
        if(this[i] === find) return i;
      }
      return -1;
    },

    'every': function(block, scope){
      for(var i=0,len=this.length; i < len; i++){
        var test = block.call(scope, this[i], i, this);
        if(!test){
          return false;
        }
      }
      return true;
    },

    'some': function(block, scope){
      for(var i=0,len=this.length; i < len; i++){
        var test = block.call(scope, this[i], i, this);
        if(test){
          return true;
        }
      }
      return false;
    },

    'filter': function(block, scope){
      var result = [];
      for(var i=0,len=this.length; i < len; i++){
        var test = block.call(scope, this[i], i, this);
        if(test){
          result.push(this[i]);
        }
      }
      return result;
    },

    'forEach': function(block, scope){
      for(var i=0,len=this.length; i < len; i++){
        block.call(scope, this[i], i, this);
      }
    },

    'map': function(block, scope){
      var length = this.length;
      var result = new Array(length);
      for(var i=0; i < length; i++){
        result[i] = block.call(scope, this[i], i, this);
      }
      return result;
    },

    'reduce': function(block, init){
      var result = init === undefined ? this[0] : init;
      for(var i= init ? 0 : 1,len=this.length; i < len; i++){
        result = block.call(null, result, this[i], i, this);
      }
      return result;
    },

    'reduceRight': function(block, init){
      var result = init === undefined ? this[this.length - 1] : init;
      for(var i = init ? this.length - 1 : this.length - 2; i >= 0; i--){
        result = block.call(null, result, this[i], i, this);
      }
      return result;
    },

    'find': function(f){
      var result = this.findAllFromIndex(0, f, 1);
      return result.length > 0 ? result[0] : null;
    },

    'findAll': function(f, stop){
      return this.findAllFromIndex(0, f, stop);
    },

    'findFromIndex': function(index, f){
      var result = this.findAllFromIndex(index, f, 1);
      return result.length > 0 ? result[0] : null;
    },

    'findAllFromIndex': function(index, f, stop){
      var result = [];
      var arr = (index !== 0) ? this.slice(index).concat(this.slice(0, index)) : this;
      for(var i=0,len=arr.length; i<len; i++){
        var match = multiMatch(arr[i], f, i);
        if(match) result.push(arr[i]);
        if(stop && result.length === stop){
          return result;
        }
      }
      return result;
    },

    'count': function(f){
      return this.findAllFromIndex(0, f).length;
    },

    'any': function(f){
      if(f === undefined) return false;
      return this.find(f) !== null;
    },

    'none': function(f){
      return !this.any(f);
    },

    'all': function(f){
      if(f === undefined) return false;
      return this.findAllFromIndex(0, f).length === this.length;
    },

    'remove': function(f){
      return this.findAllFromIndex(0, function(a){ return !multiMatch(a, f); });
    },

    'removeIndex': function(start, end){
      if(start === undefined) return this;
      if(end === undefined) end = start;
      return this.findAllFromIndex(0, function(el, i){
        return i < start || i > end;
      });
    },

    'unique': function(){
      var result = [];
      this.each(function(el){
        if(result.find(el) === null) result.push(el);
      });
      return result;
    },

    'union': function(arr){
      return this.concat(arr).unique();
    },

    'intersect': function(arr){
      var result = [];
      if(!(arr instanceof Array)) arr = [arr];
      this.each(function(el){
        var match = el === null ? arr.indexOf(el) > -1 : arr.find(el) !== null;
        if(match) result.push(el);
      });
      return result.unique();
    },

    'subtract': function(arr){
      var result = [];
      if(!(arr instanceof Array)) arr = [arr];
      this.each(function(el){
        var match = el === null ? arr.indexOf(el) > -1 : arr.find(el) !== null;
        if(!match) result.push(el);
      });
      return result;
    },

    'insert': function(insert, index){
      if(index === undefined) index = this.length;
      this.splice.apply(this, [index, 0].concat(insert));
      return insert;
    },

    'at': function(){
      var args = Array.prototype.slice.call(arguments).map(function(a){
        return a < 0 ? this.length + a : a;
      }, this);
      var func = args.length > 1 ? this.findAllFromIndex : this.findFromIndex;
      return func.call(this, 0, function(el, i){
        return args.has(i);
      });
    },

    'first': function(num){
      if(num === undefined) return this[0];
      if(num < 0) num = 0;
      return this.slice(0, num);
    },

    'last': function(num){
      if(num === undefined) return this[this.length - 1];
      var start = this.length - num < 0 ? 0 : this.length - num;
      return this.slice(start);
    },

    'from': function(num){
      num = num  === undefined ? 0 : num;
      return this.slice(num);
    },

    'to': function(num){
      num = num  === undefined ? this.length - 1 : num;
      if(num < 0) num = this.length + num;
      return this.slice(0, num + 1);
    },

    'min': function(){
      var arr = this.compact();
      var args = getArgumentsWithOptionalBlock(arguments);
      var result = getMinOrMax(arr, 'min', args.block);
      return args.first === true ? result.unique() : result.first() || null;
    },

    'max': function(){
      var arr = this.compact();
      var args = getArgumentsWithOptionalBlock(arguments);
      var result = getMinOrMax(arr, 'max', args.block);
      return args.first === true ? result.unique() : result.first() || null;
    },

    'least': function(){
      var args = getArgumentsWithOptionalBlock(arguments);
      var grouped = this.groupBy(args.block);
      var result = getMinOrMax(grouped, 'min', 'length').flatten();
      if(result.length === this.length) result = [];
      return args.first === true ? result.unique() : result.first() || null;
    },

    'most': function(){
      var args = getArgumentsWithOptionalBlock(arguments);
      var grouped = this.groupBy(args.block);
      var result = getMinOrMax(grouped, 'max', 'length').flatten();
      if(result.length === this.length) result = [];
      return args.first === true ? result.unique() : result.first() || null;
    },

    // TODO SUM AND AVERAGE *MAY* be changed if we can resolve this problem with map handling strings
    // vs Firefox native methods.
    'sum': function(f){
      var arr = f ? this.map(function(a){ return transformArgument(a, f); }) : this;
      return arr.length > 0 ? arr.reduce(function(a,b){ return a + b; }) : 0;
    },

    // TODO SUM AND AVERAGE *MAY* be changed if we can resolve this problem with map handling strings
    // vs Firefox native methods.
    'average': function(f){
      var arr = f ? this.map(function(a){ return transformArgument(a, f); }) : this;
      return arr.length > 0 ? arr.sum() / arr.length : 0;
    },

    'groupBy': function(property){
      var result = {};
      this.each(function(el){
        var key = transformArgument(el, property);
        if(!result[key]) result[key] = [];
        result[key].push(el);
      });
      return result;
    },

    'inGroups': function(num, padding){
      var pad = arguments.length > 1;
      var arr = this;
      var result = [];
      var divisor = Math.ceil(this.length / num);
      (0).upto(num - 1, function(i){
        var index = i * divisor;
        var group = arr.slice(index, index + divisor);
        if(pad && group.length < divisor){
          group = group.add(new Array(divisor - group.length).map(function(){ return padding; }));
        }
        result.push(group);
      });
      return result;
    },

    'inGroupsOf': function(num, pad){
      if(this.length === 0 || num === 0) return this;
      if(num === undefined) num = 1;
      var result = [];
      var group = null;
      var len = this.length;
      if(pad !== undefined && !this.length.multipleOf(num)){
        this.length = this.length + (num - (this.length % num));
      }
      this.each(function(el, i){
        if((i % num) === 0){
          if(group) result.push(group);
          group = [];
        }
        if(el === undefined) el = pad;
        group.push(el);
      });
      if(group.length > 0) result.push(group);
      return result;
    },

    'split': function(split){
      var result = [];
      var lastIndex = 0;
      this.each(function(el, i, arr){
          var performSplit = isFunction(split) ? split(el) : el === split;
          if(performSplit){
            var slice = arr.slice(lastIndex, i);
            if(slice.length > 0) result.push(slice);
            lastIndex = i + 1;
          }
      });
      if(lastIndex < this.length) result.push(this.slice(lastIndex, this.length));
      return result;
    },

    'compact': function(){
      return this.filter(function(el){ return el !== undefined && el !== null; });
    },

    'blank': function(){
      return this.compact().length == 0;
    },

    'flatten': function(){
      var result = [];
      this.each(function(el){
        if(el instanceof Array){
          result = result.concat(el.flatten());
        } else {
          result.push(el);
        }
      });
      return result;
    },

    'sortBy': function(property, desc){
      var arr = this;
      arr.sort(function(a, b){
        var aProperty = transformArgument(a, property);
        var bProperty = transformArgument(b, property);
        var numeric = typeof aProperty == 'number';
        if(numeric && desc) return bProperty - aProperty;
        else if(numeric && !desc) return aProperty - bProperty;
        else if(aProperty === bProperty) return 0;
        else if(desc) return aProperty < bProperty ?  1 : -1;
        else return aProperty < bProperty ? -1 :  1;
      });
      return arr;
    },

    /* Fisher-Yates based randomization */
    'randomize': function(){
      var a = this.concat();
      for(var j, x, i = a.length; i; j = parseInt(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x);
      return a;
    }

  });


  // Alias
  extend(Array, {
      'each': Array.prototype.forEach,
      'collect': Array.prototype.map,
      'has': Array.prototype.any,
      'shuffle': Array.prototype.randomize,
      'add': Array.prototype.concat
  });


  var months      = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  var weekdays    = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  var textNumbers = ['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
  var abbreviatedMonths = months.map(function(m){ return m.to(2); });
  var abbreviatedWeekdays = weekdays.map(function(m){ return m.to(2); });
  var monthReg      = new RegExp(months.map(function(m){ return m.to(2)+'(?:\\.|'+m.from(3)+')?'; }).join('|'), 'i');
  var weekdayReg    = new RegExp(weekdays.map(function(m){ return m.to(2)+'(?:\\.|'+m.from(3)+')?'; }).join('|'), 'i');
  var textNumberReg = new RegExp(textNumbers.join('|'), 'i');

  var dateFormats = [
    // @date_format 2010
    { reg: /^(\d{4})/, to: ['year'] },
    // @date_format 2010-05
    // @date_format 2010.05
    { reg: /^(\d{4})[-\/.](\d{1,2})/, to: ['year','month'] },
    // @date_format 2010-05-25 (ISO8601)
    // @date_format 2010-05-25T12:30:40.299Z (ISO8601)
    // @date_format 2010-05-25T12:30:40.299+01:00 (ISO8601)
    // @date_format 2010.05.25
    // @date_format 2010/05/25
    { reg: /^([+-])?(\d{4})[-\/.]?(\d{1,2})[-\/.]?(\d{1,2})/, to: ['year_sign','year','month','date'] },
    // @date_format 10-05-25 (ISO8601)
    { reg: /^(\d{2})-?(\d{2})-?(\d{2})/, to: ['year','month','date'] },
    // @date_format 05-25
    // @date_format 05/25
    // @date_format 05.25
    { reg: /^(\d{1,2})[-\/.](\d{1,2})/, to: ['month','date'], variant: true },
    // @date_format 05-25-2010
    // @date_format 05/25/2010
    // @date_format 05.25.2010
    { reg: /^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})/, to: ['month','date','year'], variant: true },
    // @date_format May 2010
    { reg: new RegExp('^('+monthReg.source+')[\\s\\-.](\\d{4})'), to: ['month','year'] },
    // @date_format Tuesday May 25th, 2010
    { reg: new RegExp('^(?:'+weekdayReg.source+')?\\s*('+monthReg.source+')[\\s\\-.]?(?:(\\d{1,2})(?:st|nd|rd|th)?)?,?[\\s\\-.]?(\\d{2,4})?'), to: ['month','date','year'] },
    // @date_format 25 May 2010
    { reg: new RegExp('^(\\d{1,2}) ('+monthReg.source+'),? (\\d{4})'), to: ['date','month','year'] },
    // @date_format the day after tomorrow
    // @date_format one day before yesterday
    // @date_format 2 days after monday
    // @date_format 2 weeks/months/years from monday
    { reg: new RegExp('^(?:(the|a|'+textNumberReg.source+'|\\d+) (day|week|month|year)s? (before|after|from)\\s+)?(today|tomorrow|yesterday|'+weekdayReg.source+')'), to: ['modifier_amount','modifier_unit','modifier_sign','fuzzy_day'] },
    // @date_format a second ago
    // @date_format two days from now
    // @date_format 25 minutes/hours/days/weeks/months/years from now
    { reg: new RegExp('^(a|'+textNumberReg.source+'|\\d+) (milliseconds?|seconds?|minutes?|hours?|day|week|month|year)s? (from now|ago)'), to: ['modifier_amount','modifier_unit','modifier_sign'], relative: true },
    // @date_format last wednesday
    // @date_format next friday
    // @date_format this week tuesday
    { reg: new RegExp('^(this|next|last)?\\s*(?:week\\s*)?('+weekdayReg.source+')'), to: ['modifier_sign','fuzzy_day'] },
    // @date_format monday of this/next/last week
    { reg: new RegExp('^('+weekdayReg.source+') (?:of\\s*)?(this|next|last) week'), to: ['fuzzy_day','modifier_sign'] },
    // @date_format May 25th of this/next/last year
    { reg: new RegExp('^('+monthReg.source+')(?: (\\d{1,2})(?:st|nd|rd|th)?)? of (this|next|last) (year)'), to: ['month','date','modifier_sign','modifier_unit'] },
    // @date_format the first day of the month
    // @date_format the last day of March
    // @date_format the 23rd of last month
    { reg: new RegExp('^(?:the\\s)?(first day|last day)?(\\d{1,2}(?:st|nd|rd|th))? of (?:(the|this|next|last) (month)|('+monthReg.source+'))'), to: ['modifier_edge', 'date','modifier_sign','modifier_unit','month'] },
    // @date_format the beginning of this week/month/year
    // @date_format the end of next month
    { reg: new RegExp('^(?:the\\s)?(beginning|end|first day|last day) of (?:(the|this|next|last) (week|month|year)|(\\d{4})|('+monthReg.source+'))'), to: ['modifier_edge','modifier_sign','modifier_unit','year','month'] },
    // @date_format this week
    // @date_format last month
    // @date_format next year
    { reg: /^(this|next|last) (week|month|year)/, to: ['modifier_sign','modifier_unit'], relative: true },
    // @date_format noon
    // @date_format midnight tonight
    { reg: /(midnight|noon)(?: (tonight|today|tomorrow|yesterday))?/, to: ['hours','fuzzy_day'], timeIncluded: true },
    // @date_format 12pm
    // @date_format 12:30pm
    // @date_format 12:30:40
    // @date_format 12:30:40.299
    // @date_format 12:30:40.299+01:00
    { reg: /^(?=\s*.+)/, to: [], today: true, timeOnly: true }
  ];

  var timeReg = /(?:(?:\s+|t)(\d{1,2}):?(\d{2})?:?(\d{2})?(\.\d{1,6})?(am|pm)?(?:(Z)|(?:([+-])(\d{2})(?::?(\d{2}))?)?)?)?$/;

  dateFormats.each(function(m){
    var date = m.reg.source;
    var time = timeReg.source;
    if(m.timeOnly){
      time = time.replace(/\(\?:\\s\+\|t\)/, '');
    }
    if(m.timeIncluded){
      m.reg = new RegExp(date, 'i');
    } else {
      m.reg = new RegExp(date + time, 'i');
      m.to = m.to.concat(['hours','minutes','seconds','milliseconds','meridian','utc','offset_sign','offset_hours','offset_minutes']);
    }
  });


  var setupTextDates = function(){
  }

  var getFormatMatch = function(match, arr){
    var obj = {};
    arr.each(function(key, i){
      var value = match[i + 1];
      if(typeof value === 'string') value = value.toLowerCase();
      obj[key] = value;
    });
    return obj;
  }

  var getDateFormat = function(str, variant){
    str = str.trim().replace(/\.+$/,'').replace(/^now$/, '');
    var match, format;
    var d = new Date();
    var set = {};
    var utc = false;
    dateFormats.each(function(f){
      if(match) return;
      match = str.match(f.reg);
      if(match){
        format = f;
        var m = getFormatMatch(match, format.to);

        if(variant && format.variant){
          // If there's a European variant, swap the month and day.
          var tmp = m.month;
          m.month = m.date;
          m.date = tmp;
        }

        if(m.year){
          if(!m.modifier_unit){
            m.modifier_unit = 'year';
          }
          if(m.year.length === 2){
            m.year = getYearFromAbbreviation(m.year.toNumber());
          }
        }
        if(m.month){
          var num = m.month.toNumber();
          if(isNaN(num)){
            // If the month is not a number, find it in the array of text months.
            m.month = abbreviatedMonths.indexOf(m.month.to(2));
          } else {
            // Otherwise decrement by 1.
            m.month = num - 1;
          }
        }
        if(m.hours === 'noon' || m.hours === 'midnight'){
          m.hours = m.hours === 'noon' ? 12 : 24;
          if(!set.date && !m.fuzzy_day) m.fuzzy_day = 'today';
        }
        if(m.fuzzy_day){
          // Fuzzy day can be today, tomorrow, yesterday, or a day of the week.
          // This resolves to an offset of the current date.
          var dayOffset = 0;
          var fuzzy = m.fuzzy_day;
          var weekday;
          if(fuzzy === 'yesterday'){
            dayOffset = -1;
          } else if(fuzzy === 'tomorrow'){
            dayOffset = 1;
          } else if((weekday = abbreviatedWeekdays.indexOf(fuzzy.to(2))) !== -1){
            d.setDay(weekday);
            dayOffset = 0;
            if(m.modifier_sign && !m.modifier_unit && !m.modifier_amount){
              m.modifier_unit = 'week';
            }
          }
          set.year  = d.getFullYear();
          set.month = d.getMonth();
          set.date  = d.getDate() + dayOffset;
        }
        if(m.milliseconds){
          // Round the milliseconds out to 4 digits
          m.milliseconds = (parseFloat(m.milliseconds, 10) * 1000).round();
        }

        // Now turn this into actual numbers
        ['year','month','date','day','hours','minutes','seconds','milliseconds'].each(function(unit){
          if(m[unit] !== undefined){
            set[unit] = m[unit].toNumber();
          }
        });

        if(m.meridian){
          // If the time is after 1pm-11pm advance the time by 12 hours.
          if(m.meridian === 'pm' && m.hours < 12) set.hours  += 12;
        }
        if(m.utc || m.offset_hours || m.offset_minutes){
          utc = true;
          // Adjust for timezone offset
          var offset = 0;
          if(m.offset_hours){
            offset += m.offset_hours.toNumber() * 60;
          }
          if(m.offset_minutes){
            offset += m.offset_minutes.toNumber();
          }
          if(m.offset_sign && m.offset_sign === '-'){
            offset *= -1;
          }
          set.minutes -= offset;
        }
        if(m.modifier_unit && m.modifier_sign){
          var amt = m.modifier_amount || 1;
          var textNumIndex;
          if(amt === 'the' || amt === 'a'){
            amt = 1;
          } else if((textNumIndex = textNumbers.indexOf(amt)) !== -1){
            amt = textNumIndex;
          } else {
            amt = amt.toNumber();
          }
          if(m.modifier_sign === 'before' || m.modifier_sign === 'ago' || m.modifier_sign === 'last'){
            amt *= -1;
          } else if(m.modifier_sign === 'this' || m.modifier_sign === 'the'){
            amt = 0;
          }
          if(m.modifier_unit === 'day'){
            m.modifier_unit = 'date';
          } else if(m.modifier_unit === 'week'){
            amt *= 7;
            set.date = format.relative ? amt : d.getDate() + amt;
          } else if(m.modifier_unit === 'month' && !format.relative){
            set.month = d.getMonth();
          } else if(m.modifier_unit === 'year' && !format.relative){
            set.year = d.getFullYear();
          }
          if(set[m.modifier_unit] === undefined){
            set[m.modifier_unit] = 0;
          }
          set[m.modifier_unit] += amt;
        }
        if(m.modifier_edge){
          var edge = m.modifier_edge;
          if(edge === 'beginning' || edge === 'first' || edge === 'first day'){
            if(m.modifier_unit === 'week'){
              set.month = d.getMonth();
              set.day = 0;
            } else if(m.modifier_unit === 'month' || m.month){
              set.date = 1;
            }
          } else if(edge === 'end' || edge === 'last' || edge === 'last day'){
            if(m.modifier_unit === 'week'){
              set.month = d.getMonth();
              set.day = 6;
            } else if(m.modifier_unit === 'month' || m.month){
              set.date = 32 - new Date(d.getFullYear(), set.month, 32).getDate();
            } else if(m.modifier_unit === 'year'){
              set.month = 11;
              set.date  = 31;
            }
            if(!edge.match(/day/)){
              set.hours        = 23;
              set.minutes      = 59;
              set.seconds      = 59;
              set.milliseconds = 999;
            }
          }

        }
        if(m.year_sign && m.year_sign === '-'){
          set.year *= -1;
        }
        if(format.today){
          set.year  = d.getFullYear();
          set.month = d.getMonth();
          set.date  = d.getDate();
        }
      }
    });
    if(!match){
      // The Date constructor does something tricky like checking the number
      // of arguments so simply passing in undefined won't work.
      d = str ? new Date(str) : new Date();
    } else if(format.relative){
      d.advance(set);
    } else if(utc){
      d.setUTC(set, true);
    } else {
      d.set(set, true);
    }
    return {
      format: format,
      date: d,
      set: set
    }
  }

  Date.create = function(str, variant){
    if(str === undefined) return new Date();
    return getDateFormat(str, variant).date;
  }


  var dateMethods = [
    { unit: 'year',        method: 'FullYear'               },
    { unit: 'month',       method: 'Month',        reset: 0 },
    { unit: 'date',        method: 'Date',         reset: 1 },
    { unit: 'day',         method: 'Day'                    },
    { unit: 'hour',        method: 'Hours',        reset: 0 },
    { unit: 'minute',      method: 'Minutes',      reset: 0 },
    { unit: 'second',      method: 'Seconds',      reset: 0 },
    { unit: 'millisecond', method: 'Milliseconds', reset: 0 }
  ];

  var updateDate = function(date, params, reset, utc, advance){
    utc = utc === true ? 'UTC' : '';
    dateMethods.each(function(m, i){
      if(advance && m.unit === 'day') return;
      var value = params[m.unit];
      if(value === undefined) value = params[m.unit + 's'];
      if(value === undefined && reset) value = m.reset;
      if(value !== undefined){
        if(advance){
          value = (value * advance) + callDateMethod(date, 'get', '', m.method);
        }
        callDateMethod(date, 'set', utc, m.method, value);
      }
    });
    return date;
  }

  var callDateMethod = function(d, g, utc, method, param){
    method = method.first().toUpperCase() + method.from(1);
    return d[g + utc.toUpperCase() + method].call(d, param);
  }

  extend(Date, {

    'set': function(){
      var args = collectArguments(arguments,'year','month','date','hours','minutes','seconds','milliseconds');
      return updateDate(this, args[0], args[1])
    },

    'setUTC': function(){
      var args = collectArguments(arguments,'year','month','date','hours','minutes','seconds','milliseconds');
      return updateDate(this, args[0], args[1], true)
    },

    'setDay': function(dow){
      this.setDate(this.getDate() + dow - this.getDay());
    },

    'setUTCDay': function(dow){
      this.setUTCDate(this.getDate() + dow - this.getDay());
    },

    'getUTCOffset': function(colon){
      var offset = this.getTimezoneOffset();
      colon = colon === true ? ':' : '';
      return offset ? Math.round(-offset / 60).pad(2, true) + colon + (offset % 60).pad(2) : '';
    },

    'advance': function(params){
      var args = collectArguments(arguments,'year','month','date','hours','minutes','seconds','milliseconds');
      return updateDate(this, args[0], false, false, 1);
    },

    'rewind': function(params){
      var args = collectArguments(arguments,'year','month','date','hours','minutes','seconds','milliseconds');
      return updateDate(this, args[0], false, false, -1);
    },

    'isValid': function(){
      return !isNaN(this.getTime());
    },

    'leapYear': function(){
      var year = this.getFullYear();
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    },

    'daysInMonth': function(){
      return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
    },

    'format': function(str, utc){
      var d = this;
      utc = utc === true ? 'UTC' : '';
      if(Date[str]) str = Date[str];
      if(!str) return this.toString();
      dateOutputFormats.each(function(f){
        if(!str) return;
        str = str.replace(new RegExp('{('+f.token+')(?: (pad))?}'), function(m,t,p){
          var value = f.format.call(null, d, utc);
          if(f.pad && (t.length === 2 || p === 'pad')){
            value = value.pad(2);
          }
          if(f.weekdays){
            var l = t.toLowerCase();
            var short = l === 'dow' || l === 'weekday short';
            value = short ? abbreviatedWeekdays[value] : weekdays[value];
            if(t.first().toUpperCase() === t.first()) value = value.capitalize();
          }
          if(f.months){
            var l = t.toLowerCase();
            var short = l === 'mon' || l === 'month short';
            value = short ? abbreviatedMonths[value] : months[value];
            if(t.first().toUpperCase() === t.first()) value = value.capitalize();
          }
          if(f.meridian){
            if(t.length === 1) value = value.to(0);
            if(t.toUpperCase() === t) value = value.toUpperCase();
          }
          return value;
        });
      });
      return str;
    },

    'is': function(str, buffer){
      var month, weekday, accuracy;
      if(str === 'weekday'){
        var day = this.getDay();
        return !(day === 0 || day === 6);
      } else if(str === 'weekend'){
        return day === 0 || day === 6;
      } else if(weekday = getWeekday(str)){
        return this.getDay() === weekday;
      } else if(month = getMonth(str)){
        return this.getMonth() === month;
      } else {
        var p = getDateFormat(str);
        dateUnits.each(function(u){
          if(p.set[u.unit] && !accuracy){
            accuracy = u.accuracy(p.date);
          }
        });
        buffer = buffer || (accuracy ? 0 : 5);
        accuracy = accuracy || 0;
        var t   = this.getTime();
        var min = p.date.getTime();
        var max = min + accuracy;
        return t >= (min - buffer) && t < (max + buffer);
      }
    }


  });

  var getShortHour = function(d, utc){
    var hours = callDateMethod(d, 'get', utc, 'hours');
    return hours === 0 ? 12 : hours - (Math.floor(hours / 13) * 12);
  }

  var getMonth = function(s){
    var match = s.match(new RegExp('^('+monthReg.source+')$', 'i'));
    if(!match) return null;
    var index = abbreviatedMonths.indexOf(match[0].toLowerCase().to(2));
    return index === -1 ? null : index;
  }

  var getWeekday = function(s){
    var match = s.match(new RegExp('^('+weekdayReg.source+')$', 'i'));
    if(!match) return null;
    var index = abbreviatedWeekdays.indexOf(match[0].toLowerCase().to(2));
    return index === -1 ? null : index;
  }

  // If the year is two digits, add the most appropriate century prefix.
  var getYearFromAbbreviation = function(year){
    return new Date().getFullYear().round(-2) - year.round(-2) + year;
  }

  var getMeridian = function(d, utc){
    var hours = callDateMethod(d, 'get', utc, 'hours');
    return hours < 12 ? 'am' : 'pm';
  }

  var dateUnits = [
    {
      unit: 'milliseconds',
      accuracy: function(d){
        return 1;
      }
    },
    {
      unit: 'seconds',
      accuracy: function(d){
        return 1000;
      }
    },
    {
      unit: 'minutes',
      accuracy: function(d){
        return 60 * 1000;
      }
    },
    {
      unit: 'hours',
      accuracy: function(d){
        return 60 * 60 * 1000;
      }
    },
    {
      unit: 'date',
      accuracy: function(d){
        return 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'day',
      accuracy: function(d){
        return 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'month',
      accuracy: function(d){
        return d.daysInMonth() * 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'year',
      accuracy: function(d){
        return (365 + (d.leapYear() ? 1 : 0)) * 24 * 60 * 60 * 1000;
      }
    }
  ];

  var dateOutputFormats = [
    {
      token: 'millisec(?:onds?)?|ms(?:ms)?',
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'milliseconds');
      }
    },
    {
      token: 's(?:s|ec(?:onds?)?)?',
      pad: true,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'seconds'); 
      }
    },
    {
      token: 'm(?:m|in(?:utes?)?)?',
      pad: true,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'minutes');
      }
    },
    {
      token: 'h(?:h|(?:ours?))?|24hr',
      pad: true,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'hours');
      }
    },
    {
      token: '12hr',
      pad: true,
      format: function(d, utc){
        return getShortHour(d, utc);
      }
    },
    {
      token: 'd(?:d|(?:ays?))?',
      pad: true,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'date');
      }
    },
    {
      token: '[Dd]ow|[Ww]eekday(?: short)?',
      weekdays: true,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'day');
      }
    },
    {
      token: 'MM?',
      pad: true,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'month') + 1;
      }
    },
    {
      token: '[Mm]on(th)?(?: short)?',
      months: true,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'month');
      }
    },
    {
      token: 'yy',
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'fullYear').toString().from(2);
      }
    },
    {
      token: 'yyyy',
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'fullYear');
      }
    },
    {
      token: '[Tt]{1,2}',
      meridian: true,
      format: function(d, utc){
        return getMeridian(d, utc);
      }
    },
    {
      token: 'tz|timezone',
      format: function(d, utc){
        return utc ? '' : d.getUTCOffset();
      }
    },
    {
      token: 'iso(tz|timezone)',
      format: function(d, utc){
        return utc ? 'Z' : d.getUTCOffset(true) || 'Z';
      }
    },
    {
      token: 'ord',
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'date').ordinalize(); 
      }
    }
  ];

  Date.AMERICAN_DATE      = '{M}/{d}/{yyyy}';
  Date.AMERICAN_DATETIME  = '{M}/{d}/{yyyy} {h}:{mm}{tt}';
  Date.EUROPEAN_DATE      = '{d}/{M}/{yyyy}';
  Date.INTERNATIONAL_TIME = '{h}:{mm}:{ss}';
  Date.RFC1123            = '{Dow}, {dd} {Mon} {yyyy} {hh}:{mm}:{ss} GMT{tz}';
  Date.RFC1036            = '{Weekday}, {dd}-{Mon}-{yy} {hh}:{mm}:{ss} GMT{tz}';
  Date.ISO8601_DATE       = '{yyyy}-{MM}-{dd}';
  Date.ISO8601_DATETIME   = '{yyyy}-{MM}-{dd}T{hh}:{mm}:{ss}{isotz}';
  Date.ISO8601            = Date.ISO8601_DATETIME;



  function buildWindowParams(){
    if(typeof window === 'undefined') return;
    window.location.params = window.location.search.replace(/^\?/, '').toObject();
  }

  function initialize(){
    buildAccentTable();
    buildNormalizeTable();
    buildWindowParams();
    setupTextDates();
  }

  initialize();

})();
