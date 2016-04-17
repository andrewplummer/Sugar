'use strict';

/***
 * @module Inflections
 * @namespace String
 * @description Pluralization similar to ActiveSupport including uncountable
 *              words and acronyms. Humanized and URL-friendly strings.
 *
 ***/

var NORMALIZE_SOURCE = {
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

// Used for all inflections
var Inflector;

// normalize
var normalizeMap, normalizeReg;

function paramMatchesType(param, type) {
  return param == type || param == 'all' || !param;
}

function toAscii(str) {
  return str.replace(normalizeReg, function(character) {
    return normalizeMap[character];
  });
}

function buildNormalize() {
  var all = '';
  normalizeMap = {};
  iterateOverObject(NORMALIZE_SOURCE, function(normalized, str) {
    forEach(str.split(''), function(character) {
      normalizeMap[character] = normalized;
    });
    all += str;
  });
  normalizeReg = allCharsReg(all);
}

function buildInflector() {

  var plural, singular, irregular, plurals, singulars, uncountables, humans, acronyms;

  function isUncountable(word) {
    return some(uncountables, function(uncountable) {
      return RegExp('\\b' + uncountable + '$', 'i').test(word);
    });
  }

  function runReplacements(word, table) {
    iterateOverObject(table, function(i, inflection) {
      if (word.match(inflection.rule)) {
        word = word.replace(inflection.rule, inflection.replacement);
        return false;
      }
    });
    return word;
  }

  function removeFromArray(arr, find) {
    var index = indexOf(arr, find);
    if (index !== -1) {
      arr.splice(index, 1);
    }
  }

  function removeFromUncountablesAndAddTo(arr, rule, replacement) {
    if (isString(rule)) {
      removeFromArray(uncountables, rule);
    }
    removeFromArray(uncountables, replacement);
    arr.unshift({ rule: rule, replacement: replacement });
  }

  Inflector = {

    /*
     * Specifies a new acronym. An acronym must be specified as it will appear
     * in a camelized string.  An underscore string that contains the acronym
     * will retain the acronym when passed to `camelize`, `humanize`, or
     * `titleize`. A camelized string that contains the acronym will maintain
     * the acronym when titleized or humanized, and will convert the acronym
     * into a non-delimited single lowercase word when passed to
     * String#underscore.
     *
     * Examples:
     *   Sugar.String.Inflector.acronym('HTML')
     *   'html'.titleize()     -> 'HTML'
     *   'html'.camelize()     -> 'HTML'
     *   'MyHTML'.underscore() -> 'my_html'
     *
     * The acronym, however, must occur as a delimited unit and not be part of
     * another word for conversions to recognize it:
     *
     *   Sugar.String.Inflector.acronym('HTTP')
     *   'my_http_delimited'.camelize() -> 'MyHTTPDelimited'
     *   'https'.camelize()             -> 'Https', not 'HTTPs'
     *   'HTTPS'.underscore()           -> 'http_s', not 'https'
     *
     *   Sugar.String.Inflector.acronym('HTTPS')
     *   'https'.camelize()   -> 'HTTPS'
     *   'HTTPS'.underscore() -> 'https'
     *
     * Note: Acronyms that are passed to `pluralize` will no longer be
     * recognized, since the acronym will not occur as a delimited unit in the
     * pluralized result. To work around this, you must specify the pluralized
     * form as an acronym as well:
     *
     *    Sugar.String.Inflector.acronym('API')
     *    'api'.pluralize().camelize() -> 'Apis'
     *
     *    Sugar.String.Inflector.acronym('APIs')
     *    'api'.pluralize().camelize() -> 'APIs'
     *
     * `acronym` may be used to specify any word that contains an acronym or
     * otherwise needs to maintain a non-standard capitalization. The only
     * restriction is that the word must begin with a capital letter.
     *
     * Examples:
     *   Sugar.String.Inflector.acronym('RESTful')
     *   'RESTful'.underscore()           -> 'restful'
     *   'RESTfulController'.underscore() -> 'restful_controller'
     *   'RESTfulController'.titleize()   -> 'RESTful Controller'
     *   'restful'.camelize()             -> 'RESTful'
     *   'restful_controller'.camelize()  -> 'RESTfulController'
     *
     *   Sugar.String.Inflector.acronym('McDonald')
     *   'McDonald'.underscore() -> 'mcdonald'
     *   'mcdonald'.camelize()   -> 'McDonald'
     */
    'acronym': function(word) {
      acronyms[word.toLowerCase()] = word;
      var all = map(getKeys(acronyms), function(key) {
        return acronyms[key];
      });
      Inflector.acronymRegExp = RegExp(all.join('|'), 'g');
    },

    //  Pluralizes or singularizes
    'inflect': function(word, pluralize) {
      word = isString(word) ? word.toString() : '';
      if (trim(word).length === 0 || isUncountable(word)) {
        return word;
      } else {
        return runReplacements(word, pluralize ? plurals : singulars);
      }
    },

    // Humanizes strings
    'humanize': function(str) {
      var acronym;
      str = runReplacements(str, humans);
      str = str.replace(/_id$/g, '');
      str = str.replace(/(_)?([a-z\d]*)/gi, function(match, _, word) {
        var lower = word.toLowerCase();
        acronym = hasOwn(acronyms, lower) ? acronyms[lower] : null;
        return (_ ? ' ' : '') + (acronym || lower);
      });
      return capitalizeWithoutDowncasing(str);
    },

    /*
     * Specifies a new pluralization rule and its replacement. The rule can
     * either be a string or a regular expression. The replacement should always
     * be a string that may include references to the matched data from the rule.
     */
    'plural': function(rule, replacement) {
      removeFromUncountablesAndAddTo(plurals, rule, replacement);
    },

    /*
     * Specifies a new singularization rule and its replacement. The rule can
     * either be a string or a regular expression. The replacement should always
     * be a string that may include references to the matched data from the rule.
     */
    'singular': function(rule, replacement) {
      removeFromUncountablesAndAddTo(singulars, rule, replacement);
    },

    /*
     * Specifies a new irregular that applies to both pluralization and
     * singularization at the same time. This can only be used for strings, not
     * regular expressions. You simply pass the irregular in singular and plural
     * form.
     *
     * Examples:
     *   Sugar.String.Inflector.irregular('octopus', 'octopi')
     *   Sugar.String.Inflector.irregular('person', 'people')
     */
    'irregular': function(s, p) {
      var singularFirst      = s.charAt(0),
          singularRest       = s.slice(1),
          pluralFirst        = p.charAt(0),
          pluralRest         = p.slice(1),
          pluralFirstUpper   = pluralFirst.toUpperCase(),
          pluralFirstLower   = pluralFirst.toLowerCase(),
          singularFirstUpper = singularFirst.toUpperCase(),
          singularFirstLower = singularFirst.toLowerCase();

      function noCapture(first, rest) {
        return first + rest + '$';
      }

      function withCapture(first, rest) {
        return '(' + first + ')' + rest + '$';
      }

      removeFromArray(uncountables, s);
      removeFromArray(uncountables, p);

      if (singularFirstUpper == pluralFirstUpper) {
        plural(RegExp(withCapture(singularFirst, singularRest), 'i'), '$1' + pluralRest);
        plural(RegExp(withCapture(pluralFirst, pluralRest), 'i'), '$1' + pluralRest);
        singular(RegExp(withCapture(pluralFirst, pluralRest), 'i'), '$1' + singularRest);
      } else {
        plural(RegExp(noCapture(singularFirstUpper, singularRest)), pluralFirstUpper + pluralRest);
        plural(RegExp(noCapture(singularFirstLower, singularRest)), pluralFirstLower + pluralRest);
        plural(RegExp(noCapture(pluralFirstUpper, pluralRest)), pluralFirstUpper + pluralRest);
        plural(RegExp(noCapture(pluralFirstLower, pluralRest)), pluralFirstLower + pluralRest);
        singular(RegExp(noCapture(pluralFirstUpper, pluralRest)), singularFirstUpper + singularRest);
        singular(RegExp(noCapture(pluralFirstLower, pluralRest)), singularFirstLower + singularRest);
      }
    },

    /*
     * Add uncountable words that shouldn't be attempted inflected.
     *
     * Examples:
     *   Sugar.String.Inflector.uncountable('money')
     *   Sugar.String.Inflector.uncountable('money', 'information')
     *   Sugar.String.Inflector.uncountable(['money', 'information', 'rice'])
     */
    'uncountable': function(first) {
      var add;
      if (isArray(first)) {
        add = first;
      } else {
        // Optimized: no leaking arguments
        var args = []; for(var $i = 0, $len = arguments.length; $i < $len; $i++) args.push(arguments[$i]);
        add = args;
      }
      uncountables = uncountables.concat(add);
    },

    /*
     * Specifies a humanized form of a string by a regular expression rule or by
     * a string mapping. * When using a regular expression based replacement,
     * the normal humanize formatting is called after the replacement. When a
     * string is used, the human form should be specified as desired.
     * (example: * 'The name', not 'the_name')
     *
     * Examples:
     *   Sugar.String.Inflector.human(/_cnt$/i, '_count')
     *   Sugar.String.Inflector.human('legacy_col_person_name', 'Name')
     */
    'human': function(rule, replacement) {
      humans.unshift({ rule: rule, replacement: replacement });
    },

    /*
     * Clears the loaded inflections within a given scope (default is 'all').
     * Options are: 'all', 'plurals', 'singulars', 'uncountables', 'humans'.
     *
     * Examples:
     *   Sugar.String.Inflector.clear('all')
     *   Sugar.String.Inflector.clear('plurals')
     */
    'clear': function(type) {
      if (paramMatchesType(type, 'singulars'))    singulars    = [];
      if (paramMatchesType(type, 'plurals'))      plurals      = [];
      if (paramMatchesType(type, 'uncountables')) uncountables = [];
      if (paramMatchesType(type, 'humans'))       humans       = [];
      if (paramMatchesType(type, 'acronyms'))     acronyms     = {};
    },

    /*
     * Resets the inflector to it's default state.
     */
    'reset': function() {

      Inflector.clear('all');

      plural(/$/, 's');
      plural(/s$/gi, 's');
      plural(/(ax|test)is$/gi, '$1es');
      plural(/(octop|fung|foc|radi|alumn|cact)(i|us)$/gi, '$1i');
      plural(/(census|alias|status|fetus|genius|virus)$/gi, '$1es');
      plural(/(bu)s$/gi, '$1ses');
      plural(/(buffal|tomat)o$/gi, '$1oes');
      plural(/([ti])um$/gi, '$1a');
      plural(/([ti])a$/gi, '$1a');
      plural(/sis$/gi, 'ses');
      plural(/f+e?$/gi, 'ves');
      plural(/(cuff|roof)$/gi, '$1s');
      plural(/([ht]ive)$/gi, '$1s');
      plural(/([^aeiouy]o)$/gi, '$1es');
      plural(/([^aeiouy]|qu)y$/gi, '$1ies');
      plural(/(x|ch|ss|sh)$/gi, '$1es');
      plural(/(tr|vert)(?:ix|ex)$/gi, '$1ices');
      plural(/([ml])ouse$/gi, '$1ice');
      plural(/([ml])ice$/gi, '$1ice');
      plural(/^(ox)$/gi, '$1en');
      plural(/^(oxen)$/gi, '$1');
      plural(/(quiz)$/gi, '$1zes');
      plural(/(phot|cant|hom|zer|pian|portic|pr|quart|kimon)o$/gi, '$1os');
      plural(/(craft)$/gi, '$1');
      plural(/([ft])[eo]{2}(th?)$/gi, '$1ee$2');

      singular(/s$/gi, '');
      singular(/([pst][aiu]s)$/gi, '$1');
      singular(/([aeiouy])ss$/gi, '$1ss');
      singular(/(n)ews$/gi, '$1ews');
      singular(/([ti])a$/gi, '$1um');
      singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/gi, '$1$2sis');
      singular(/(^analy)ses$/gi, '$1sis');
      singular(/(i)(f|ves)$/i, '$1fe');
      singular(/([aeolr]f?)(f|ves)$/i, '$1f');
      singular(/([ht]ive)s$/gi, '$1');
      singular(/([^aeiouy]|qu)ies$/gi, '$1y');
      singular(/(s)eries$/gi, '$1eries');
      singular(/(m)ovies$/gi, '$1ovie');
      singular(/(x|ch|ss|sh)es$/gi, '$1');
      singular(/([ml])(ous|ic)e$/gi, '$1ouse');
      singular(/(bus)(es)?$/gi, '$1');
      singular(/(o)es$/gi, '$1');
      singular(/(shoe)s?$/gi, '$1');
      singular(/(cris|ax|test)[ie]s$/gi, '$1is');
      singular(/(octop|fung|foc|radi|alumn|cact)(i|us)$/gi, '$1us');
      singular(/(census|alias|status|fetus|genius|virus)(es)?$/gi, '$1');
      singular(/^(ox)(en)?/gi, '$1');
      singular(/(vert)(ex|ices)$/gi, '$1ex');
      singular(/tr(ix|ices)$/gi, 'trix');
      singular(/(quiz)(zes)?$/gi, '$1');
      singular(/(database)s?$/gi, '$1');
      singular(/ee(th?)$/gi, 'oo$1');

      irregular('person', 'people');
      irregular('man', 'men');
      irregular('deer', 'deer');
      irregular('human', 'humans');
      irregular('child', 'children');
      irregular('sex', 'sexes');
      irregular('move', 'moves');
      irregular('save', 'saves');
      irregular('goose', 'geese');
      irregular('zombie', 'zombies');

      Inflector.uncountable(commaSplit('equipment,information,rice,money,species,series,fish,sheep,jeans'));

      Inflector.acronyms = acronyms;
    }

  };

  plural = Inflector.plural;
  singular = Inflector.singular;
  irregular = Inflector.irregular;

  Inflector.reset();
  sugarString['Inflector'] = Inflector;
}

defineInstance(sugarString, {

  /***
   * @method pluralize([num])
   * @returns String
   * @short Returns the plural form of the word in the string.
   * @extra If [num] is passed, the word will be singularized if equal to 1.
   *        Otherwise it will be pluralized. The `Inflector` object on
   *        `Sugar.String` can be used to customize forms.
   *
   * @example
   *
   *   'post'.pluralize()         -> 'posts'
   *   'octopus'.pluralize()      -> 'octopi'
   *   'sheep'.pluralize()        -> 'sheep'
   *   'words'.pluralize()        -> 'words'
   *   'CamelOctopus'.pluralize() -> 'CamelOctopi'
   *   'post'.pluralize(1)         -> 'post'
   *   'post'.pluralize(2)         -> 'posts'
   *   Sugar.String.Inflector.plural('platypus', 'platypuses');
   *
   ***/
  'pluralize': function(str, num) {
    return Inflector.inflect(str, num ? num !== 1 : true);
  },

  /***
   * @method singularize()
   * @returns String
   * @short Returns the singular form of a word in a string.
   * @extra The `Inflector` object on `Sugar.String` can be used to customize forms.
   *
   * @example
   *
   *   'posts'.singularize()       -> 'post'
   *   'octopi'.singularize()      -> 'octopus'
   *   'sheep'.singularize()       -> 'sheep'
   *   'word'.singularize()        -> 'word'
   *   'CamelOctopi'.singularize() -> 'CamelOctopus'
   *   Sugar.String.Inflector.singular('platypuses', 'platypus');
   *
   ***/
  'singularize': function(str) {
    return Inflector.inflect(str, false);
  },

  /***
   * @method humanize()
   * @returns String
   * @short Creates a human readable string.
   * @extra Capitalizes the first word and turns underscores into spaces and
   *        strips a trailing '_id', if any. Like String#titleize, this is meant
   *        for creating pretty output. The `Inflector` object on `Sugar.String`
   *        can be used for custom cases.
   *
   * @example
   *
   *   'employee_salary'.humanize() -> 'Employee salary'
   *   'author_id'.humanize()       -> 'Author'
   *   Sugar.String.Inflector.human('_cnt', 'Count');
   *
   ***/
  'humanize': function(str) {
    return Inflector.humanize(str);
  },

  /***
   * @method toAscii()
   * @returns String
   * @short Returns the string with accented and non-standard Latin-based
   *        characters converted into ASCII approximate equivalents.
   *
   * @example
   *
   *   'á'.toAscii()                  -> 'a'
   *   'Ménage à trois'.toAscii()     -> 'Menage a trois'
   *   'Volkswagen'.toAscii()         -> 'Volkswagen'
   *   'ＦＵＬＬＷＩＤＴＨ'.toAscii() -> 'FULLWIDTH'
   *
   ***/
  'toAscii': function(str) {
    return toAscii(str);
  }

});

buildInflector();
buildNormalize();
