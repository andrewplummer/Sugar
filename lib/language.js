'use strict';

/***
 * @module Language
 * @namespace String
 * @description Script detection, full/half-width character as well as
 *              Hiragana-Katakana conversion.
 *
 ***/

var FULL_WIDTH_OFFSET = 65248;

var HANKAKU_PUNCTUATION = '｡､｢｣¥¢£';
var ZENKAKU_PUNCTUATION = '。、「」￥￠￡';
var HANKAKU_KATAKANA    = 'ｱｲｳｴｵｧｨｩｪｫｶｷｸｹｺｻｼｽｾｿﾀﾁﾂｯﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔｬﾕｭﾖｮﾗﾘﾙﾚﾛﾜｦﾝｰ･';
var ZENKAKU_KATAKANA    = 'アイウエオァィゥェォカキクケコサシスセソタチツッテトナニヌネノハヒフヘホマミムメモヤャユュヨョラリルレロワヲンー・';

var ALL_HANKAKU_REG          = /[\u0020-\u00A5]|[\uFF61-\uFF9F][ﾞﾟ]?/g;
var ALL_ZENKAKU_REG          = /[\u2212\u3000-\u301C\u301A-\u30FC\uFF01-\uFF60\uFFE0-\uFFE6]/g;
var VOICED_KATAKANA_REG      = /[カキクケコサシスセソタチツテトハヒフヘホ]/;
var SEMI_VOICED_KATAKANA_REG = /[ハヒフヘホヲ]/;

var UNICODE_SCRIPTS = [
  { name: 'Arabic',     src: '\u0600-\u06FF' },
  { name: 'Cyrillic',   src: '\u0400-\u04FF' },
  { name: 'Devanagari', src: '\u0900-\u097F' },
  { name: 'Greek',      src: '\u0370-\u03FF' },
  { name: 'Hangul',     src: '\uAC00-\uD7AF\u1100-\u11FF' },
  { name: 'Han Kanji',  src: '\u4E00-\u9FFF\uF900-\uFAFF' },
  { name: 'Hebrew',     src: '\u0590-\u05FF' },
  { name: 'Hiragana',   src: '\u3040-\u309F\u30FB-\u30FC' },
  { name: 'Kana',       src: '\u3040-\u30FF\uFF61-\uFF9F' },
  { name: 'Katakana',   src: '\u30A0-\u30FF\uFF61-\uFF9F' },
  { name: 'Latin',      src: '\u0001-\u007F\u0080-\u00FF\u0100-\u017F\u0180-\u024F' },
  { name: 'Thai',       src: '\u0E00-\u0E7F' }
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

function shiftChar(str, n) {
  return chr(str.charCodeAt(0) + n);
}

function zenkaku(str, mode) {
  return convertCharacterWidth(str, mode, ALL_HANKAKU_REG, 'zenkaku');
}

function convertCharacterWidth(str, mode, reg, type) {
  var table = widthConversionTable[type];
  mode = (mode || '').replace(/all/, '').replace(/(\w)lphabet|umbers?|atakana|paces?|unctuation/g, '$1');
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
 * @short Returns true if the string contains only characters in that script.
 *        Whitespace is ignored.
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
 *   isLatin
 *   isThai
 *   isDevanagari
 *
 * @example
 *
 *   'أتكلم'.isArabic()          -> true
 *   'визит'.isCyrillic()        -> true
 *   '잘 먹겠습니다'.isHangul()  -> true
 *   'ミックスです'.isKatakana() -> false
 *   "l'année".isLatin()         -> true
 *
 ***/
function buildUnicodeScripts() {
  defineInstanceSimilar(sugarString, UNICODE_SCRIPTS, function(methods, script) {
    var is = RegExp('^['+ script.src +'\\s]+$');
    var has = RegExp('['+ script.src +']');
    forEach(spaceSplit(script.name), function(name) {
      methods['is' + name] = function(str) {
        return is.test(trim(str));
      };
      methods['has' + name] = function(str) {
        return has.test(trim(str));
      };
    });
  });
}

function buildWidthConversion() {
  var hankaku;

  widthConversionTable = {
    'zenkaku': {},
    'hankaku': {}
  };

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

  function setKatakanaConversion() {
    for (var i = 0; i < ZENKAKU_KATAKANA.length; i++) {
      var c = ZENKAKU_KATAKANA.charAt(i);
      hankaku = HANKAKU_KATAKANA.charAt(i);
      setWidthConversion('k', hankaku, c);
      if (c.match(VOICED_KATAKANA_REG)) {
        setWidthConversion('k', hankaku + 'ﾞ', shiftChar(c, 1));
      }
      if (c.match(SEMI_VOICED_KATAKANA_REG)) {
        setWidthConversion('k', hankaku + 'ﾟ', shiftChar(c, 2));
      }
    }
  }

  function setPunctuationConversion() {
    for (var i = 0; i < ZENKAKU_PUNCTUATION.length; i++) {
      setWidthConversion('p', HANKAKU_PUNCTUATION.charAt(i), ZENKAKU_PUNCTUATION.charAt(i));
    }
  }

  forEach(WIDTH_CONVERSION_RANGES, function(r) {
    simpleRepeat(r.end - r.start + 1, function(n) {
      n += r.start;
      setWidthConversion(r.type, chr(n), chr(n + FULL_WIDTH_OFFSET));
    });
  });

  setKatakanaConversion();
  setPunctuationConversion();

  setWidthConversion('s', ' ', '　');
  setWidthConversion('k', 'ｳﾞ', 'ヴ');
  setWidthConversion('k', 'ｦﾞ', 'ヺ');
  setConversionTableEntry('hankaku', 'n', '−', '-');
  setConversionTableEntry('hankaku', 'n', 'ー', '-', false);
  setConversionTableEntry('zenkaku', 'n', '-', '－', false);
}

defineInstance(sugarString, {

  /***
   * @method hankaku([mode] = 'all')
   * @returns String
   * @short Converts full-width characters (zenkaku) to half-width (hankaku).
   * @extra [mode] accepts `all`, `alphabet`, `numbers`, `katakana`, `spaces`,
   *        `punctuation`, or any combination of `a`, `n`, `k`, `s`, `p`,
   *        respectively.
   *
   * @example
   *
   *   'タロウ　ＹＡＭＡＤＡです！'.hankaku()           -> 'ﾀﾛｳ YAMADAです!'
   *   'タロウ　ＹＡＭＡＤＡです！'.hankaku('a')        -> 'タロウ　YAMADAです！'
   *   'タロウ　ＹＡＭＡＤＡです！'.hankaku('alphabet') -> 'タロウ　YAMADAです！'
   *   'タロウです！　２５歳です！'.hankaku('katakana') -> 'ﾀﾛｳです！　２５歳です！'
   *   'タロウです！　２５歳です！'.hankaku('kn')       -> 'ﾀﾛｳです！　25歳です！'
   *   'タロウです！　２５歳です！'.hankaku('sp')       -> 'タロウです! ２５歳です!'
   *
   * @param {string} mode
   *
   ***/
  'hankaku': function(str, mode) {
    return convertCharacterWidth(str, mode, ALL_ZENKAKU_REG, 'hankaku');
  },


  /***
   * @method zenkaku([mode] = 'all')
   * @returns String
   * @short Converts half-width characters (hankaku) to full-width (zenkaku).
   * @extra [mode] accepts `all`, `alphabet`, `numbers`, `katakana`, `spaces`,
   *        `punctuation`, or any combination of `a`, `n`, `k`, `s`, or `p`,
   *        respectively.
   *
   * @example
   *
   *   'ﾀﾛｳ YAMADAです!'.zenkaku()              -> 'タロウ　ＹＡＭＡＤＡです！'
   *   'ﾀﾛｳ YAMADAです!'.zenkaku('a')           -> 'ﾀﾛｳ ＹＡＭＡＤＡです!'
   *   'ﾀﾛｳ YAMADAです!'.zenkaku('alphabet')    -> 'ﾀﾛｳ ＹＡＭＡＤＡです!'
   *   'ﾀﾛｳです! 25歳です!'.zenkaku('katakana') -> 'タロウです! 25歳です!'
   *   'ﾀﾛｳです! 25歳です!'.zenkaku('kn')       -> 'タロウです! ２５歳です!'
   *   'ﾀﾛｳです! 25歳です!'.zenkaku('sp')       -> 'ﾀﾛｳです！　25歳です！'
   *
   * @param {string} mode
   *
   ***/
  'zenkaku': function(str, args) {
    return zenkaku(str, args);
  },

  /***
   * @method hiragana([all] = true)
   * @returns String
   * @short Converts katakana into hiragana.
   * @extra If [all] is false, only full-width katakana will be converted.
   *
   * @example
   *
   *   'カタカナ'.hiragana()   -> 'かたかな'
   *   'コンニチハ'.hiragana() -> 'こんにちは'
   *   'ｶﾀｶﾅ'.hiragana()       -> 'かたかな'
   *   'ｶﾀｶﾅ'.hiragana(false)  -> 'ｶﾀｶﾅ'
   *
   * @param {boolean} all
   *
   ***/
  'hiragana': function(str, all) {
    if (all !== false) {
      str = zenkaku(str, 'k');
    }
    return str.replace(/[\u30A1-\u30F6]/g, function(c) {
      return shiftChar(c, -96);
    });
  },

  /***
   * @method katakana()
   * @returns String
   * @short Converts hiragana into katakana.
   *
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
buildWidthConversion();
