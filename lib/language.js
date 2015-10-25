
  'use strict';

  /***
   *
   * @package Language
   * @namespace String
   * @dependency string
   * @description Detecting language by character block. Full-width <-> half-width character conversion. Hiragana and Katakana conversions.
   *
   ***/

  var HALF_WIDTH_TO_FULL_WIDTH = 65248;

  var ALL_HANKAKU              = /[\u0020-\u00A5]|[\uFF61-\uFF9F][ﾞﾟ]?/g;
  var ALL_ZENKAKU              = /[\u2212\u3000-\u301C\u301A-\u30FC\uFF01-\uFF60\uFFE0-\uFFE6]/g;
  var HANKAKU_PUNCTUATION      = '｡､｢｣¥¢£';
  var ZENKAKU_PUNCTUATION      = '。、「」￥￠￡';
  var VOICED_KATAKANA          = /[カキクケコサシスセソタチツテトハヒフヘホ]/;
  var SEMI_VOICED_KATAKANA     = /[ハヒフヘホヲ]/;
  var HANKAKU_KATAKANA         = 'ｱｲｳｴｵｧｨｩｪｫｶｷｸｹｺｻｼｽｾｿﾀﾁﾂｯﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔｬﾕｭﾖｮﾗﾘﾙﾚﾛﾜｦﾝｰ･';
  var ZENKAKU_KATAKANA         = 'アイウエオァィゥェォカキクケコサシスセソタチツッテトナニヌネノハヒフヘホマミムメモヤャユュヨョラリルレロワヲンー・';

  var UNICODE_SCRIPTS = [
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

  var WIDTH_CONVERSION_RANGES = [
    { type: 'a', start: 65,  end: 90  },
    { type: 'a', start: 97,  end: 122 },
    { type: 'n', start: 48,  end: 57  },
    { type: 'p', start: 33,  end: 47  },
    { type: 'p', start: 58,  end: 64  },
    { type: 'p', start: 91,  end: 96  },
    { type: 'p', start: 123, end: 126 }
  ];

  var widthConversionTable;

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
  function buildUnicodeScripts() {
    defineInstanceSimilar(sugarString, UNICODE_SCRIPTS, function(methods, script) {
      var is = RegExp('^['+ script.source +'\\s]+$');
      var has = RegExp('['+ script.source +']');
      forEach(script.names, function(name) {
        methods['is' + name] = function(str) {
          return is.test(trim(str));
        }
        methods['has' + name] = function(str) {
          return has.test(trim(str));
        }
      });
    });
  }

  function convertCharacterWidth(str, args, reg, type) {
    if (!widthConversionTable) {
      buildWidthConversionTables();
    }
    var mode = args.join(''), table = widthConversionTable[type];
    mode = mode.replace(/all/, '').replace(/(\w)lphabet|umbers?|atakana|paces?|unctuation/g, '$1');
    return str.replace(reg, function(c) {
      var entry = table[c], to;
      if (entry) {
        if (mode === '' && entry.all) {
          return entry.all;
        } else {
          for (var i = 0, len = mode.length; i < len; i++) {
            to = entry[mode.charAt(i)];
            if (to) {
              return to;
            }
          }
        }
      }
      return c;
    });
  }

  function buildWidthConversionTables() {
    var hankaku;
    widthConversionTable = {
      'zenkaku': {},
      'hankaku': {}
    };
    forEach(WIDTH_CONVERSION_RANGES, function(r) {
      simpleRepeat(r.end - r.start + 1, function(n) {
        n += r.start;
        setWidthConversion(r.type, chr(n), chr(n + HALF_WIDTH_TO_FULL_WIDTH));
      });
    });
    for (var i = 0; i < ZENKAKU_KATAKANA.length; i++) {
      var c = ZENKAKU_KATAKANA.charAt(i);
      hankaku = HANKAKU_KATAKANA.charAt(i);
      setWidthConversion('k', hankaku, c);
      if (c.match(VOICED_KATAKANA)) {
        setWidthConversion('k', hankaku + 'ﾞ', shiftChar(c, 1));
      }
      if (c.match(SEMI_VOICED_KATAKANA)) {
        setWidthConversion('k', hankaku + 'ﾟ', shiftChar(c, 2));
      }
    }
    for (var i = 0; i < ZENKAKU_PUNCTUATION.length; i++) {
      setWidthConversion('p', HANKAKU_PUNCTUATION.charAt(i), ZENKAKU_PUNCTUATION.charAt(i));
    }
    setWidthConversion('s', ' ', '　');
    setWidthConversion('k', 'ｳﾞ', 'ヴ');
    setWidthConversion('k', 'ｦﾞ', 'ヺ');
    setConversionTableEntry('hankaku', 'n', '−', '-');
    setConversionTableEntry('hankaku', 'n', 'ー', '-', false);
    setConversionTableEntry('zenkaku', 'n', '-', '－', false);
  }

  function setWidthConversion(type, half, full) {
    setConversionTableEntry('zenkaku', type, half, full);
    setConversionTableEntry('hankaku', type, full, half);
  }

  function setConversionTableEntry(width, type, from, to, all) {
    var obj = widthConversionTable[width][from] || {};
    if (all !== false) {
      obj.all = to;
    }
    obj[type]  = to;
    widthConversionTable[width][from] = obj;
  }

  function shiftChar(str, n) {
    return chr(str.charCodeAt(0) + n);
  }

  function zenkaku(str, args) {
    return convertCharacterWidth(str, args, ALL_HANKAKU, 'zenkaku');
  }

  defineInstanceWithArguments(sugarString, {

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
    'hankaku': function(str, args) {
      return convertCharacterWidth(str, args, ALL_ZENKAKU, 'hankaku');
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
    'zenkaku': function(str, args) {
      return zenkaku(str, args);
    }

  });

  defineInstance(sugarString, {
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
    'hiragana': function(str, all) {
      if (all !== false) {
        str = zenkaku(str, ['k']);
      }
      return str.replace(/[\u30A1-\u30F6]/g, function(c) {
        return shiftChar(c, -96);
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
    'katakana': function(str) {
      return str.replace(/[\u3041-\u3096]/g, function(c) {
        return shiftChar(c, 96);
      });
    }

  });

  buildUnicodeScripts();

