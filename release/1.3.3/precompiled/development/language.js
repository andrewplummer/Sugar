
  /***
   *
   * @package Language
   * @dependency string
   * @description Normalizing accented characters, character width conversion, Hiragana and Katakana conversions.
   *
   ***/

  /***
   * String module
   *
   ***/



  var NormalizeMap,
      NormalizeReg = '',
      NormalizeSource;


  /***
   * @method has[Script]()
   * @returns Boolean
   * @short Returns true if the string contains any characters in that script.
   *
   * @set
   *   hasArabic
   *   hasCyrillic
   *   hasGreek
   *   hasHangul
   *   hasHan
   *   hasKanji
   *   hasHebrew
   *   hasHiragana
   *   hasKana
   *   hasKatakana
   *   hasLatin
   *   hasThai
   *   hasDevanagari
   *
   * @example
   *
   *   'أتكلم'.hasArabic()          -> true
   *   'визит'.hasCyrillic()        -> true
   *   '잘 먹겠습니다!'.hasHangul() -> true
   *   'ミックスです'.hasKatakana() -> true
   *   "l'année".hasLatin()         -> true
   *
   ***
   * @method is[Script]()
   * @returns Boolean
   * @short Returns true if the string contains only characters in that script. Whitespace is ignored.
   *
   * @set
   *   isArabic
   *   isCyrillic
   *   isGreek
   *   isHangul
   *   isHan
   *   isKanji
   *   isHebrew
   *   isHiragana
   *   isKana
   *   isKatakana
   *   isKatakana
   *   isThai
   *   isDevanagari
   *
   * @example
   *
   *   'أتكلم'.isArabic()          -> true
   *   'визит'.isCyrillic()        -> true
   *   '잘 먹겠습니다!'.isHangul() -> true
   *   'ミックスです'.isKatakana() -> false
   *   "l'année".isLatin()         -> true
   *
   ***/
  var unicodeScripts = [
    { names: ['Arabic'],      source: '\u0600-\u06FF' },
    { names: ['Cyrillic'],    source: '\u0400-\u04FF' },
    { names: ['Devanagari'],  source: '\u0900-\u097F' },
    { names: ['Greek'],       source: '\u0370-\u03FF' },
    { names: ['Hangul'],      source: '\uAC00-\uD7AF\u1100-\u11FF' },
    { names: ['Han','Kanji'], source: '\u4E00-\u9FFF\uF900-\uFAFF' },
    { names: ['Hebrew'],      source: '\u0590-\u05FF' },
    { names: ['Hiragana'],    source: '\u3040-\u309F\u30FB-\u30FC' },
    { names: ['Kana'],        source: '\u3040-\u30FF\uFF61-\uFF9F' },
    { names: ['Katakana'],    source: '\u30A0-\u30FF\uFF61-\uFF9F' },
    { names: ['Latin'],       source: '\u0001-\u007F\u0080-\u00FF\u0100-\u017F\u0180-\u024F' },
    { names: ['Thai'],        source: '\u0E00-\u0E7F' }
  ];

  function buildUnicodeScripts() {
    unicodeScripts.forEach(function(s) {
      var is = regexp('^['+s.source+'\\s]+$');
      var has = regexp('['+s.source+']');
      s.names.forEach(function(name) {
        defineProperty(string.prototype, 'is' + name, function() { return is.test(this.trim()); });
        defineProperty(string.prototype, 'has' + name, function() { return has.test(this); });
      });
    });
  }

  // Support for converting character widths and katakana to hiragana.

  var widthConversionRanges = [
    { type: 'a', shift: 65248, start: 65,  end: 90  },
    { type: 'a', shift: 65248, start: 97,  end: 122 },
    { type: 'n', shift: 65248, start: 48,  end: 57  },
    { type: 'p', shift: 65248, start: 33,  end: 47  },
    { type: 'p', shift: 65248, start: 58,  end: 64  },
    { type: 'p', shift: 65248, start: 91,  end: 96  },
    { type: 'p', shift: 65248, start: 123, end: 126 }
  ];

  var WidthConversionTable;
  var allHankaku   = /[\u0020-\u00A5]|[\uFF61-\uFF9F][ﾞﾟ]?/g;
  var allZenkaku   = /[\u3000-\u301C]|[\u301A-\u30FC]|[\uFF01-\uFF60]|[\uFFE0-\uFFE6]/g;
  var hankakuPunctuation  = '｡､｢｣¥¢£';
  var zenkakuPunctuation  = '。、「」￥￠￡';
  var voicedKatakana      = /[カキクケコサシスセソタチツテトハヒフヘホ]/;
  var semiVoicedKatakana  = /[ハヒフヘホヲ]/;
  var hankakuKatakana     = 'ｱｲｳｴｵｧｨｩｪｫｶｷｸｹｺｻｼｽｾｿﾀﾁﾂｯﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔｬﾕｭﾖｮﾗﾘﾙﾚﾛﾜｦﾝｰ･';
  var zenkakuKatakana     = 'アイウエオァィゥェォカキクケコサシスセソタチツッテトナニヌネノハヒフヘホマミムメモヤャユュヨョラリルレロワヲンー・';

  function convertCharacterWidth(str, args, reg, type) {
    if(!WidthConversionTable) {
      buildWidthConversionTables();
    }
    var mode = multiArgs(args).join(''), table = WidthConversionTable[type];
    mode = mode.replace(/all/, '').replace(/(\w)lphabet|umbers?|atakana|paces?|unctuation/g, '$1');
    return str.replace(reg, function(c) {
      if(table[c] && (!mode || mode.has(table[c].type))) {
        return table[c].to;
      } else {
        return c;
      }
    });
  }

  function buildWidthConversionTables() {
    var hankaku;
    WidthConversionTable = {
      'zenkaku': {},
      'hankaku': {}
    };
    widthConversionRanges.forEach(function(r) {
      getRange(r.start, r.end, function(n) {
        setWidthConversion(r.type, chr(n), chr(n + r.shift));
      });
    });
    zenkakuKatakana.each(function(c, i) {
      hankaku = hankakuKatakana.charAt(i);
      setWidthConversion('k', hankaku, c);
      if(c.match(voicedKatakana)) {
        setWidthConversion('k', hankaku + 'ﾞ', c.shift(1));
      }
      if(c.match(semiVoicedKatakana)) {
        setWidthConversion('k', hankaku + 'ﾟ', c.shift(2));
      }
    });
    zenkakuPunctuation.each(function(c, i) {
      setWidthConversion('p', hankakuPunctuation.charAt(i), c);
    });
    setWidthConversion('k', 'ｳﾞ', 'ヴ');
    setWidthConversion('k', 'ｦﾞ', 'ヺ');
    setWidthConversion('s', ' ', '　');
  }

  function setWidthConversion(type, half, full) {
    WidthConversionTable['zenkaku'][half] = { type: type, to: full };
    WidthConversionTable['hankaku'][full] = { type: type, to: half };
  }




  function buildNormalizeMap() {
    NormalizeMap = {};
    iterateOverObject(NormalizeSource, function(normalized, str) {
      str.split('').forEach(function(character) {
        NormalizeMap[character] = normalized;
      });
      NormalizeReg += str;
    });
    NormalizeReg = regexp('[' + NormalizeReg + ']', 'g');
  }

  NormalizeSource = {
    'A':  'AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ',
    'B':  'BⒷＢḂḄḆɃƂƁ',
    'C':  'CⒸＣĆĈĊČÇḈƇȻꜾ',
    'D':  'DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ',
    'E':  'EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ',
    'F':  'FⒻＦḞƑꝻ',
    'G':  'GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ',
    'H':  'HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ',
    'I':  'IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ',
    'J':  'JⒿＪĴɈ',
    'K':  'KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ',
    'L':  'LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ',
    'M':  'MⓂＭḾṀṂⱮƜ',
    'N':  'NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ',
    'O':  'OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ',
    'P':  'PⓅＰṔṖƤⱣꝐꝒꝔ',
    'Q':  'QⓆＱꝖꝘɊ',
    'R':  'RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ',
    'S':  'SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ',
    'T':  'TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ',
    'U':  'UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ',
    'V':  'VⓋＶṼṾƲꝞɅ',
    'W':  'WⓌＷẀẂŴẆẄẈⱲ',
    'X':  'XⓍＸẊẌ',
    'Y':  'YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ',
    'Z':  'ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ',
    'a':  'aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ',
    'b':  'bⓑｂḃḅḇƀƃɓ',
    'c':  'cⓒｃćĉċčçḉƈȼꜿↄ',
    'd':  'dⓓｄḋďḍḑḓḏđƌɖɗꝺ',
    'e':  'eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ',
    'f':  'fⓕｆḟƒꝼ',
    'g':  'gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ',
    'h':  'hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ',
    'i':  'iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı',
    'j':  'jⓙｊĵǰɉ',
    'k':  'kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ',
    'l':  'lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ',
    'm':  'mⓜｍḿṁṃɱɯ',
    'n':  'nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ',
    'o':  'oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ',
    'p':  'pⓟｐṕṗƥᵽꝑꝓꝕ',
    'q':  'qⓠｑɋꝗꝙ',
    'r':  'rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ',
    's':  'sⓢｓśṥŝṡšṧṣṩșşȿꞩꞅẛ',
    't':  'tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ',
    'u':  'uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ',
    'v':  'vⓥｖṽṿʋꝟʌ',
    'w':  'wⓦｗẁẃŵẇẅẘẉⱳ',
    'x':  'xⓧｘẋẍ',
    'y':  'yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ',
    'z':  'zⓩｚźẑżžẓẕƶȥɀⱬꝣ',
    'AA': 'Ꜳ',
    'AE': 'ÆǼǢ',
    'AO': 'Ꜵ',
    'AU': 'Ꜷ',
    'AV': 'ꜸꜺ',
    'AY': 'Ꜽ',
    'DZ': 'ǱǄ',
    'Dz': 'ǲǅ',
    'LJ': 'Ǉ',
    'Lj': 'ǈ',
    'NJ': 'Ǌ',
    'Nj': 'ǋ',
    'OI': 'Ƣ',
    'OO': 'Ꝏ',
    'OU': 'Ȣ',
    'TZ': 'Ꜩ',
    'VY': 'Ꝡ',
    'aa': 'ꜳ',
    'ae': 'æǽǣ',
    'ao': 'ꜵ',
    'au': 'ꜷ',
    'av': 'ꜹꜻ',
    'ay': 'ꜽ',
    'dz': 'ǳǆ',
    'hv': 'ƕ',
    'lj': 'ǉ',
    'nj': 'ǌ',
    'oi': 'ƣ',
    'ou': 'ȣ',
    'oo': 'ꝏ',
    'ss': 'ß',
    'tz': 'ꜩ',
    'vy': 'ꝡ'
  };

  extend(string, true, false, {
    /***
     * @method normalize()
     * @returns String
     * @short Returns the string with accented and non-standard Latin-based characters converted into ASCII approximate equivalents.
     * @example
     *
     *   'á'.normalize()                  -> 'a'
     *   'Ménage à trois'.normalize()     -> 'Menage a trois'
     *   'Volkswagen'.normalize()         -> 'Volkswagen'
     *   'ＦＵＬＬＷＩＤＴＨ'.normalize() -> 'FULLWIDTH'
     *
     ***/
    'normalize': function() {
      if(!NormalizeMap) {
        buildNormalizeMap();
      }
      return this.replace(NormalizeReg, function(character) {
        return NormalizeMap[character];
      });
    },

    /***
     * @method hankaku([mode] = 'all')
     * @returns String
     * @short Converts full-width characters (zenkaku) to half-width (hankaku).
     * @extra [mode] accepts any combination of "a" (alphabet), "n" (numbers), "k" (katakana), "s" (spaces), "p" (punctuation), or "all".
     * @example
     *
     *   'タロウ　ＹＡＭＡＤＡです！'.hankaku()                      -> 'ﾀﾛｳ YAMADAです!'
     *   'タロウ　ＹＡＭＡＤＡです！'.hankaku('a')                   -> 'タロウ　YAMADAです！'
     *   'タロウ　ＹＡＭＡＤＡです！'.hankaku('alphabet')            -> 'タロウ　YAMADAです！'
     *   'タロウです！　２５歳です！'.hankaku('katakana', 'numbers') -> 'ﾀﾛｳです！　25歳です！'
     *   'タロウです！　２５歳です！'.hankaku('k', 'n')              -> 'ﾀﾛｳです！　25歳です！'
     *   'タロウです！　２５歳です！'.hankaku('kn')                  -> 'ﾀﾛｳです！　25歳です！'
     *   'タロウです！　２５歳です！'.hankaku('sp')                  -> 'タロウです! ２５歳です!'
     *
     ***/
    'hankaku': function() {
      return convertCharacterWidth(this, arguments, allZenkaku, 'hankaku');
    },

    /***
     * @method zenkaku([mode] = 'all')
     * @returns String
     * @short Converts half-width characters (hankaku) to full-width (zenkaku).
     * @extra [mode] accepts any combination of "a" (alphabet), "n" (numbers), "k" (katakana), "s" (spaces), "p" (punctuation), or "all".
     * @example
     *
     *   'ﾀﾛｳ YAMADAです!'.zenkaku()                         -> 'タロウ　ＹＡＭＡＤＡです！'
     *   'ﾀﾛｳ YAMADAです!'.zenkaku('a')                      -> 'ﾀﾛｳ ＹＡＭＡＤＡです!'
     *   'ﾀﾛｳ YAMADAです!'.zenkaku('alphabet')               -> 'ﾀﾛｳ ＹＡＭＡＤＡです!'
     *   'ﾀﾛｳです! 25歳です!'.zenkaku('katakana', 'numbers') -> 'タロウです! ２５歳です!'
     *   'ﾀﾛｳです! 25歳です!'.zenkaku('k', 'n')              -> 'タロウです! ２５歳です!'
     *   'ﾀﾛｳです! 25歳です!'.zenkaku('kn')                  -> 'タロウです! ２５歳です!'
     *   'ﾀﾛｳです! 25歳です!'.zenkaku('sp')                  -> 'ﾀﾛｳです！　25歳です！'
     *
     ***/
    'zenkaku': function() {
      return convertCharacterWidth(this, arguments, allHankaku, 'zenkaku');
    },

    /***
     * @method hiragana([all] = true)
     * @returns String
     * @short Converts katakana into hiragana.
     * @extra If [all] is false, only full-width katakana will be converted.
     * @example
     *
     *   'カタカナ'.hiragana()   -> 'かたかな'
     *   'コンニチハ'.hiragana() -> 'こんにちは'
     *   'ｶﾀｶﾅ'.hiragana()       -> 'かたかな'
     *   'ｶﾀｶﾅ'.hiragana(false)  -> 'ｶﾀｶﾅ'
     *
     ***/
    'hiragana': function(all) {
      var str = this;
      if(all !== false) {
        str = str.zenkaku('k');
      }
      return str.replace(/[\u30A1-\u30F6]/g, function(c) {
        return c.shift(-96);
      });
    },

    /***
     * @method katakana()
     * @returns String
     * @short Converts hiragana into katakana.
     * @example
     *
     *   'かたかな'.katakana()   -> 'カタカナ'
     *   'こんにちは'.katakana() -> 'コンニチハ'
     *
     ***/
    'katakana': function() {
      return this.replace(/[\u3041-\u3096]/g, function(c) {
        return c.shift(96);
      });
    }


  });

  buildUnicodeScripts();

