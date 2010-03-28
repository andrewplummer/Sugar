
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

  var getStringArgumentsAsHash = function(args){
    var argsObj = {};
    for(var i=0; i<args.length; i++){
      argsObj[args[i]] = true;
    }
    return (i == 0) ? null : argsObj;
  }



  RegExp.escape = function(text){
    return text.replace(/([/'*+?|()\[\]{}.^$])/g,'\\$1');
  }

  extend(Number, {

    'odd': function(){
      return this % 2 != 0;
    },

    'even': function(){
      return this % 2 == 0;
    }

  });


  /* Handling accented characters */

  var accentedChars = [
    { 'char': 'à', 'base': 'a', 'accent': '`' },
    { 'char': 'ā', 'base': 'a', 'accent': '-' },
    { 'char': 'á', 'base': 'a', 'accent': '\''},
    { 'char': 'ǎ', 'base': 'a', 'accent': 'v' },
    { 'char': 'ä', 'base': 'a', 'accent': ':' },
    { 'char': 'ă', 'base': 'a', 'accent': 'u' },
    { 'char': 'â', 'base': 'a', 'accent': '^' },
    { 'char': 'å', 'base': 'a', 'accent': 'o' },
    { 'char': 'ã', 'base': 'a', 'accent': '~' },
    { 'char': 'ć', 'base': 'c', 'accent': '\''},
    { 'char': 'č', 'base': 'c', 'accent': 'v' },
    { 'char': 'ç', 'base': 'c', 'accent': ',' },
    { 'char': 'ď', 'base': 'd', 'accent': 'v' },
    { 'char': 'đ', 'base': 'd', 'accent': '-' },
    { 'char': 'è', 'base': 'e', 'accent': '`' },
    { 'char': 'ē', 'base': 'e', 'accent': '-' },
    { 'char': 'é', 'base': 'e', 'accent': '\''},
    { 'char': 'ě', 'base': 'e', 'accent': 'v' },
    { 'char': 'ë', 'base': 'e', 'accent': ':' },
    { 'char': 'ĕ', 'base': 'e', 'accent': 'u' },
    { 'char': 'ê', 'base': 'e', 'accent': '^' },
    { 'char': 'ğ', 'base': 'g', 'accent': 'u' },
    { 'char': 'ì', 'base': 'i', 'accent': '`' },
    { 'char': 'ī', 'base': 'i', 'accent': '-' },
    { 'char': 'í', 'base': 'i', 'accent': '\''},
    { 'char': 'ǐ', 'base': 'i', 'accent': 'v' },
    { 'char': 'ï', 'base': 'i', 'accent': ':' },
    { 'char': 'ĭ', 'base': 'i', 'accent': 'u' },
    { 'char': 'î', 'base': 'i', 'accent': '^' },
    { 'char': 'ĩ', 'base': 'i', 'accent': '~' },
    { 'char': 'ĺ', 'base': 'l', 'accent': '`' },
    { 'char': 'ľ', 'base': 'l', 'accent': '\''},
    { 'char': 'ł', 'base': 'l', 'accent': '/' },
    { 'char': 'ň', 'base': 'n', 'accent': 'v' },
    { 'char': 'ń', 'base': 'n', 'accent': '\''},
    { 'char': 'ñ', 'base': 'n', 'accent': '~' },
    { 'char': 'ò', 'base': 'o', 'accent': '`' },
    { 'char': 'ō', 'base': 'o', 'accent': '-' },
    { 'char': 'ó', 'base': 'o', 'accent': '\''},
    { 'char': 'ǒ', 'base': 'o', 'accent': 'v' },
    { 'char': 'ö', 'base': 'o', 'accent': ':' },
    { 'char': 'ŏ', 'base': 'o', 'accent': 'u' },
    { 'char': 'ô', 'base': 'o', 'accent': '^' },
    { 'char': 'õ', 'base': 'o', 'accent': '~' },
    { 'char': 'ø', 'base': 'o', 'accent': '/' },
    { 'char': 'ő', 'base': 'o', 'accent': '"' },
    { 'char': 'ř', 'base': 'r', 'accent': 'v' },
    { 'char': 'ŕ', 'base': 'r', 'accent': '\''},
    { 'char': 'š', 'base': 's', 'accent': 'v' },
    { 'char': 'ş', 'base': 's', 'accent': ',' },
    { 'char': 'ś', 'base': 's', 'accent': '\''},
    { 'char': 'ť', 'base': 't', 'accent': '\''},
    { 'char': 'ţ', 'base': 't', 'accent': ',' },
    { 'char': 'ù', 'base': 'u', 'accent': '`' },
    { 'char': 'ū', 'base': 'u', 'accent': '-' },
    { 'char': 'ú', 'base': 'u', 'accent': '\''},
    { 'char': 'ǔ', 'base': 'u', 'accent': 'v' },
    { 'char': 'ü', 'base': 'u', 'accent': ':' },
    { 'char': 'ŭ', 'base': 'u', 'accent': 'u' },
    { 'char': 'û', 'base': 'u', 'accent': '^' },
    { 'char': 'ů', 'base': 'u', 'accent': 'o' },
    { 'char': 'ǘ', 'base': 'u', 'accent': '\':'},
    { 'char': 'ǖ', 'base': 'u', 'accent': '-:' },
    { 'char': 'ý', 'base': 'y', 'accent': '\''},
    { 'char': 'ÿ', 'base': 'y', 'accent': ':' },
    { 'char': 'ŷ', 'base': 'y', 'accent': '^' },
    { 'char': 'ž', 'base': 'z', 'accent': 'v' },
    { 'char': 'ź', 'base': 'z', 'accent': '\''},
    { 'char': 'ż', 'base': 'z', 'accent': '.' },
    { 'char': 'þ', 'base': 'th', 'accent': '' },
    { 'char': 'ð', 'base': 'dh', 'accent': '' },
    { 'char': 'ß', 'base': 'ss', 'accent': '' },
    { 'char': 'œ', 'base': 'oe', 'accent': '' },
    { 'char': 'æ', 'base': 'ae', 'accent': '' },
    { 'char': 'µ', 'base': 'u', 'accent': '|' }
  ];


  var normalizeTable;
  var accentTable;

  var buildNormalizeTable = function(){
    normalizeTable = {};
    for(var i=0; i<accentedChars.length; i++){
      var c = accentedChars[i];
      var character = c['char'];
      var base = c.base;
      if(!normalizeTable[base]) normalizeTable[base] = '';
      normalizeTable[base] += character;
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

  buildAccentTable();
  buildNormalizeTable();



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

    'pad': function(num, padding, direction){
      num = num || 0;
      padding = padding || ' ';
      direction = direction || 'both';
      var str = this;
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

    'each': function(){
      var args = getArgumentsWithOptionalBlock(arguments);
      var reg = args.first || /./g;
      var mode = args.second || 'match';
      if(typeof reg == 'string') reg = new RegExp(RegExp.escape(reg), 'gi');
      var split = mode == 'split' ? this.split(reg) : this.match(reg);
      if(args.block){
        for(var i=0; i<split.length; i++){
          args.block.call(this, split[i], i);
        }
      }
      return split;
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
      return this.trim().each(/\n/, 'split', args.block);
    },

    'paragraphs': function(){
      var args = getArgumentsWithOptionalBlock(arguments);
      return this.trim().each(/\n{2,}/, 'split', args.block);
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

    'startsWith': function(str, caseSensitive){
      return new RegExp('^' + str , caseSensitive ? '' : 'i').test(this);
    },

    'endsWith': function(str, caseSensitive){
      return new RegExp(str + '$', caseSensitive ? '' : 'i').test(this);
    },

    'isEmpty': function(){
      return this.length === 0;
    },

    'isBlank': function(){
      return this.trim().length === 0;
    },

    'has': function(find){
      return this.search(find) !== -1;
    },

    'insert': function(str, index){
      if(index < 0) index = this.length + index + 1;
      if(index < 0 || index > this.length) return this;
      return this.substr(0, index) + str + this.substr(index);
    },

    'hanKaku': function(){
      var args = getStringArgumentsAsHash(arguments);
      args = variableWidthArguments(args);
      var text = '';
      for(var i=0; i<this.length; i++){
        var character = this[i];
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
        var character = this[i];
        if(fullWidthTable[character] && args[fullWidthTable[character]['type']]){
          text += fullWidthTable[character]['full'];
        } else {
          text += character;
        }
      }
      return text;
    },

    'hiragana': function(convertWidth){
      convertWidth = convertWidth === undefined ? true : convertWidth;
      var text = '';
      for(var i=0; i<this.length; i++){
        var character = this[i];
        if(convertWidth) character = character.zenKaku('k');
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
        var character = this[i];
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
    'toNumber': function(){
      var str = this.replace(/(^0+|,)/g, '');
      return str.match(/\./) ? parseFloat(str) : parseInt(str);
    },

    'reverse': function(){
      return this.split('').reverse().join('');
    },

    'compact': function(){
      return this.trim().replace(/\s+/g, ' ');
    },

    'at': function(index){
      if(index < 0) index = this.length + index;
      if(index < 0 || index > this.length - 1) return null;
      return this.charAt(index);
    },

    'first': function(num){
      num = num  === undefined ? 1 : num;
      return this.substr(0, num);
    },

    'last': function(num){
      num = num  === undefined ? 1 : num;
      return this.substr(this.length - num);
    },

    'from': function(num){
      num = num  === undefined ? 0 : num;
      return this.substr(num);
    },

    'to': function(num){
      num = num  === undefined ? this.length : num;
      if(num < 0) num = this.length + num;
      return this.substr(0, num + 1);
    }




  });

})();
