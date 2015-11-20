
  'use strict';

  /***
   *
   * @package Inflections
   * @dependency string
   * @description Pluralization similar to ActiveSupport including uncountable words and acronyms. Humanized and URL-friendly strings.
   *
   ***/

  /***
   * @namespace String
   *
   ***/

  var DOWNCASED_WORDS = [
    'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at',
    'by', 'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over',
    'with', 'for'
  ];

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

  var plurals      = [],
      singulars    = [],
      uncountables = [],
      humans       = [],
      acronyms     = {},
      normalizeReg,
      normalizeMap,
      Inflector;

  function removeFromArray(arr, find) {
    var index = indexOf(arr, find);
    if (index > -1) {
      arr.splice(index, 1);
    }
  }

  function removeFromUncountablesAndAddTo(arr, rule, replacement) {
    if (isString(rule)) {
      removeFromArray(uncountables, rule);
    }
    removeFromArray(uncountables, replacement);
    arr.unshift({ rule: rule, replacement: replacement })
  }

  function paramMatchesType(param, type) {
    return param == type || param == 'all' || !param;
  }

  function isUncountable(word) {
    return some(uncountables, function(uncountable) {
      return RegExp('\\b' + uncountable + '$', 'i').test(word);
    });
  }

  function inflect(word, pluralize) {
    word = isString(word) ? word.toString() : '';
    if (isBlank(word) || isUncountable(word)) {
      return word;
    } else {
      return runReplacements(word, pluralize ? plurals : singulars);
    }
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

  function capitalizeWithoutDowncasing(word) {
    return word.replace(/^\W*[a-z]/, function(w){
      return w.toUpperCase();
    });
  }

  function humanize(str) {
    var str = runReplacements(str, humans), acronym;
    str = str.replace(/_id$/g, '');
    str = str.replace(/(_)?([a-z\d]*)/gi, function(match, _, word){
      var lower = word.toLowerCase();
      acronym = hasOwnProperty(acronyms, lower) ? acronyms[lower] : null;
      return (_ ? ' ' : '') + (acronym || lower);
    });
    return capitalizeWithoutDowncasing(str);
  }

  function toAscii(str) {
    return str.replace(normalizeReg, function(character) {
      return normalizeMap[character];
    });
  }

  function buildNormalizeMap() {
    var all = '';
    normalizeMap = {};
    iterateOverObject(NORMALIZE_SOURCE, function(normalized, str) {
      forEach(str.split(''), function(character) {
        normalizeMap[character] = normalized;
      });
      all += str;
    });
    normalizeReg = RegExp('[' + all + ']', 'g');
  }


  Inflector = {

    /*
     * Specifies a new acronym. An acronym must be specified as it will appear in a camelized string.  An underscore
     * string that contains the acronym will retain the acronym when passed to %camelize%, %humanize%, or %titleize%.
     * A camelized string that contains the acronym will maintain the acronym when titleized or humanized, and will
     * convert the acronym into a non-delimited single lowercase word when passed to String#underscore.
     *
     * Examples:
     *   String.Inflector.acronym('HTML')
     *   'html'.titleize()     -> 'HTML'
     *   'html'.camelize()     -> 'HTML'
     *   'MyHTML'.underscore() -> 'my_html'
     *
     * The acronym, however, must occur as a delimited unit and not be part of another word for conversions to recognize it:
     *
     *   String.Inflector.acronym('HTTP')
     *   'my_http_delimited'.camelize() -> 'MyHTTPDelimited'
     *   'https'.camelize()             -> 'Https', not 'HTTPs'
     *   'HTTPS'.underscore()           -> 'http_s', not 'https'
     *
     *   String.Inflector.acronym('HTTPS')
     *   'https'.camelize()   -> 'HTTPS'
     *   'HTTPS'.underscore() -> 'https'
     *
     * Note: Acronyms that are passed to %pluralize% will no longer be recognized, since the acronym will not occur as
     * a delimited unit in the pluralized result. To work around this, you must specify the pluralized form as an
     * acronym as well:
     *
     *    String.Inflector.acronym('API')
     *    'api'.pluralize().camelize() -> 'Apis'
     *
     *    String.Inflector.acronym('APIs')
     *    'api'.pluralize().camelize() -> 'APIs'
     *
     * %acronym% may be used to specify any word that contains an acronym or otherwise needs to maintain a non-standard
     * capitalization. The only restriction is that the word must begin with a capital letter.
     *
     * Examples:
     *   String.Inflector.acronym('RESTful')
     *   'RESTful'.underscore()           -> 'restful'
     *   'RESTfulController'.underscore() -> 'restful_controller'
     *   'RESTfulController'.titleize()   -> 'RESTful Controller'
     *   'restful'.camelize()             -> 'RESTful'
     *   'restful_controller'.camelize()  -> 'RESTfulController'
     *
     *   String.Inflector.acronym('McDonald')
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

    /*
     * The stored acronyms hash.
     */
    'acronyms': acronyms,

    /*
     * Specifies a new pluralization rule and its replacement. The rule can either be a string or a regular expression.
     * The replacement should always be a string that may include references to the matched data from the rule.
     */
    'plural': function(rule, replacement) {
      removeFromUncountablesAndAddTo(plurals, rule, replacement);
    },

    /*
     * Specifies a new singularization rule and its replacement. The rule can either be a string or a regular expression.
     * The replacement should always be a string that may include references to the matched data from the rule.
     */
    'singular': function(rule, replacement) {
      removeFromUncountablesAndAddTo(singulars, rule, replacement);
    },

    /*
     * Specifies a new irregular that applies to both pluralization and singularization at the same time. This can only be used
     * for strings, not regular expressions. You simply pass the irregular in singular and plural form.
     *
     * Examples:
     *   String.Inflector.irregular('octopus', 'octopi')
     *   String.Inflector.irregular('person', 'people')
     */
    'irregular': function(singular, plural) {
      var singularFirst      = singular.charAt(0),
          singularRest       = singular.slice(1),
          pluralFirst        = plural.charAt(0),
          pluralRest         = plural.slice(1),
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

      removeFromArray(uncountables, singular);
      removeFromArray(uncountables, plural);
      if (singularFirstUpper == pluralFirstUpper) {
        Inflector.plural(RegExp(withCapture(singularFirst, singularRest), 'i'), '$1' + pluralRest);
        Inflector.plural(RegExp(withCapture(pluralFirst, pluralRest), 'i'), '$1' + pluralRest);
        Inflector.singular(RegExp(withCapture(pluralFirst, pluralRest), 'i'), '$1' + singularRest);
      } else {
        Inflector.plural(RegExp(noCapture(singularFirstUpper, singularRest)), pluralFirstUpper + pluralRest);
        Inflector.plural(RegExp(noCapture(singularFirstLower, singularRest)), pluralFirstLower + pluralRest);
        Inflector.plural(RegExp(noCapture(pluralFirstUpper, pluralRest)), pluralFirstUpper + pluralRest);
        Inflector.plural(RegExp(noCapture(pluralFirstLower, pluralRest)), pluralFirstLower + pluralRest);
        Inflector.singular(RegExp(noCapture(pluralFirstUpper, pluralRest)), singularFirstUpper + singularRest);
        Inflector.singular(RegExp(noCapture(pluralFirstLower, pluralRest)), singularFirstLower + singularRest);
      }
    },

    /*
     * Add uncountable words that shouldn't be attempted inflected.
     *
     * Examples:
     *   String.Inflector.uncountable('money')
     *   String.Inflector.uncountable('money', 'information')
     *   String.Inflector.uncountable(['money', 'information', 'rice'])
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
     * Specifies a humanized form of a string by a regular expression rule or by a string mapping.
     * When using a regular expression based replacement, the normal humanize formatting is called after the replacement.
     * When a string is used, the human form should be specified as desired (example: 'The name', not 'the_name')
     *
     * Examples:
     *   String.Inflector.human(/_cnt$/i, '_count')
     *   String.Inflector.human('legacy_col_person_name', 'Name')
     */
    'human': function(rule, replacement) {
      humans.unshift({ rule: rule, replacement: replacement })
    },


    /*
     * Clears the loaded inflections within a given scope (default is 'all').
     * Options are: 'all', 'plurals', 'singulars', 'uncountables', 'humans'.
     *
     * Examples:
     *   String.Inflector.clear('all')
     *   String.Inflector.clear('plurals')
     */
    'clear': function(type) {
      if (paramMatchesType(type, 'singulars'))    singulars    = [];
      if (paramMatchesType(type, 'plurals'))      plurals      = [];
      if (paramMatchesType(type, 'uncountables')) uncountables = [];
      if (paramMatchesType(type, 'humans'))       humans       = [];
      if (paramMatchesType(type, 'acronyms'))     acronyms     = {};
    }

  };

  Inflector.plural(/$/, 's');
  Inflector.plural(/s$/gi, 's');
  Inflector.plural(/(ax|test)is$/gi, '$1es');
  Inflector.plural(/(octop|fung|foc|radi|alumn|cact)(i|us)$/gi, '$1i');
  Inflector.plural(/(census|alias|status|fetus|genius|virus)$/gi, '$1es');
  Inflector.plural(/(bu)s$/gi, '$1ses');
  Inflector.plural(/(buffal|tomat)o$/gi, '$1oes');
  Inflector.plural(/([ti])um$/gi, '$1a');
  Inflector.plural(/([ti])a$/gi, '$1a');
  Inflector.plural(/sis$/gi, 'ses');
  Inflector.plural(/f+e?$/gi, 'ves');
  Inflector.plural(/(cuff|roof)$/gi, '$1s');
  Inflector.plural(/([ht]ive)$/gi, '$1s');
  Inflector.plural(/([^aeiouy]o)$/gi, '$1es');
  Inflector.plural(/([^aeiouy]|qu)y$/gi, '$1ies');
  Inflector.plural(/(x|ch|ss|sh)$/gi, '$1es');
  Inflector.plural(/(tr|vert)(?:ix|ex)$/gi, '$1ices');
  Inflector.plural(/([ml])ouse$/gi, '$1ice');
  Inflector.plural(/([ml])ice$/gi, '$1ice');
  Inflector.plural(/^(ox)$/gi, '$1en');
  Inflector.plural(/^(oxen)$/gi, '$1');
  Inflector.plural(/(quiz)$/gi, '$1zes');
  Inflector.plural(/(phot|cant|hom|zer|pian|portic|pr|quart|kimon)o$/gi, '$1os');
  Inflector.plural(/(craft)$/gi, '$1');
  Inflector.plural(/([ft])[eo]{2}(th?)$/gi, '$1ee$2');

  Inflector.singular(/s$/gi, '');
  Inflector.singular(/([pst][aiu]s)$/gi, '$1');
  Inflector.singular(/([aeiouy])ss$/gi, '$1ss');
  Inflector.singular(/(n)ews$/gi, '$1ews');
  Inflector.singular(/([ti])a$/gi, '$1um');
  Inflector.singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/gi, '$1$2sis');
  Inflector.singular(/(^analy)ses$/gi, '$1sis');
  Inflector.singular(/(i)(f|ves)$/i, '$1fe');
  Inflector.singular(/([aeolr]f?)(f|ves)$/i, '$1f');
  Inflector.singular(/([ht]ive)s$/gi, '$1');
  Inflector.singular(/([^aeiouy]|qu)ies$/gi, '$1y');
  Inflector.singular(/(s)eries$/gi, '$1eries');
  Inflector.singular(/(m)ovies$/gi, '$1ovie');
  Inflector.singular(/(x|ch|ss|sh)es$/gi, '$1');
  Inflector.singular(/([ml])(ous|ic)e$/gi, '$1ouse');
  Inflector.singular(/(bus)(es)?$/gi, '$1');
  Inflector.singular(/(o)es$/gi, '$1');
  Inflector.singular(/(shoe)s?$/gi, '$1');
  Inflector.singular(/(cris|ax|test)[ie]s$/gi, '$1is');
  Inflector.singular(/(octop|fung|foc|radi|alumn|cact)(i|us)$/gi, '$1us');
  Inflector.singular(/(census|alias|status|fetus|genius|virus)(es)?$/gi, '$1');
  Inflector.singular(/^(ox)(en)?/gi, '$1');
  Inflector.singular(/(vert)(ex|ices)$/gi, '$1ex');
  Inflector.singular(/tr(ix|ices)$/gi, 'trix');
  Inflector.singular(/(quiz)(zes)?$/gi, '$1');
  Inflector.singular(/(database)s?$/gi, '$1');
  Inflector.singular(/ee(th?)$/gi, 'oo$1');

  Inflector.irregular('person', 'people');
  Inflector.irregular('man', 'men');
  Inflector.irregular('deer', 'deer');
  Inflector.irregular('human', 'humans');
  Inflector.irregular('child', 'children');
  Inflector.irregular('sex', 'sexes');
  Inflector.irregular('move', 'moves');
  Inflector.irregular('save', 'saves');
  Inflector.irregular('goose', 'geese');
  Inflector.irregular('zombie', 'zombies');

  Inflector.uncountable(commaSplit('equipment,information,rice,money,species,series,fish,sheep,jeans'));


  defineInstance(sugarString, {

    /***
     * @method pluralize([num])
     * @returns String
     * @short Returns the plural form of the word in the string.
     * @extra If [num] is passed, the word will be singularized if equal to 1. Otherwise it will be pluralized.
     * @example
     *
     *   'post'.pluralize()         -> 'posts'
     *   'octopus'.pluralize()      -> 'octopi'
     *   'sheep'.pluralize()        -> 'sheep'
     *   'words'.pluralize()        -> 'words'
     *   'CamelOctopus'.pluralize() -> 'CamelOctopi'
     *   'post'.pluralize(1)         -> 'post'
     *   'post'.pluralize(2)         -> 'posts'
     *
     ***/
    'pluralize': function(str, num) {
      return inflect(str, num ? num !== 1 : true);
    },

    /***
     * @method singularize()
     * @returns String
     * @short The reverse of String#pluralize. Returns the singular form of a word in a string.
     * @example
     *
     *   'posts'.singularize()       -> 'post'
     *   'octopi'.singularize()      -> 'octopus'
     *   'sheep'.singularize()       -> 'sheep'
     *   'word'.singularize()        -> 'word'
     *   'CamelOctopi'.singularize() -> 'CamelOctopus'
     *
     ***/
    'singularize': function(str) {
      return inflect(str, false);
    },

    /***
     * @method humanize()
     * @returns String
     * @short Creates a human readable string.
     * @extra Capitalizes the first word and turns underscores into spaces and strips a trailing '_id', if any. Like String#titleize, this is meant for creating pretty output.
     * @example
     *
     *   'employee_salary'.humanize() -> 'Employee salary'
     *   'author_id'.humanize()       -> 'Author'
     *
     ***/
    'humanize': function(str) {
      return humanize(str);
    },

    /***
     * @method titleize()
     * @returns String
     * @short Creates a title version of the string.
     * @extra Capitalizes all the words and replaces some characters in the string to create a nicer looking title. String#titleize is meant for creating pretty output.
     * @example
     *
     *   'man from the boondocks'.titleize() -> 'Man from the Boondocks'
     *   'x-men: the last stand'.titleize() -> 'X Men: The Last Stand'
     *   'TheManWithoutAPast'.titleize() -> 'The Man Without a Past'
     *   'raiders_of_the_lost_ark'.titleize() -> 'Raiders of the Lost Ark'
     *
     ***/
    'titleize': function(str) {
      var fullStopPunctuation = /[.:;!]$/, hasPunctuation, lastHadPunctuation, isFirstOrLast;
      var str = humanize(spacify(str));
      return eachWord(str, function(word, index, words) {
        hasPunctuation = fullStopPunctuation.test(word);
        isFirstOrLast = index == 0 || index == words.length - 1 || hasPunctuation || lastHadPunctuation;
        lastHadPunctuation = hasPunctuation;
        if (isFirstOrLast || indexOf(DOWNCASED_WORDS, word) === -1) {
          return capitalizeWithoutDowncasing(word, true);
        } else {
          return word;
        }
      }).join(' ');
    },

    /***
     * @method parameterize()
     * @returns String
     * @short Replaces special characters in a string so that it may be used as part of a pretty URL.
     * @example
     *
     *   'hell, no!'.parameterize() -> 'hell-no'
     *
     ***/
    'parameterize': function(str, separator) {
      var str = toAscii(str);
      if (separator === undefined) separator = '-';
      str = str.replace(/[^a-z0-9\-_]+/gi, separator)
      if (separator) {
        str = str.replace(RegExp('^{s}+|{s}+$|({s}){s}+'.split('{s}').join(escapeRegExp(separator)), 'g'), '$1');
      }
      return encodeURI(str.toLowerCase());
    },

    /***
     * @method toAscii()
     * @returns String
     * @short Returns the string with accented and non-standard Latin-based characters converted into ASCII approximate equivalents.
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

  buildNormalizeMap();
  sugarString['Inflector'] = Inflector;
