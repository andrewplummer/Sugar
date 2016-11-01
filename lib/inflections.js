'use strict';

/***
 * @module Inflections
 * @namespace String
 * @description Pluralization and support for acronyms and humanized strings in
 *              string inflecting methods.
 *
 ***/

// Inflection Sets

var InflectionSet;

/***
 * @method addAcronym(src)
 * @accessor
 * @short Adds a new acronym that will be recognized when inflecting strings.
 * @extra Acronyms are recognized by `camelize`, `underscore`, `dasherize`,
 *        `titleize`, `humanize`, and `spacify`. `src` must be passed as it
 *        will appear in a camelized string. Acronyms may contain lower case
 *        letters but must begin with an upper case letter. Note that to use
 *        acronyms in conjuction with `pluralize`, the pluralized form of the
 *        acronym must also be added.
 *
 * @example
 *
 *   Sugar.String.addAcronym('HTML');
 *   Sugar.String.addAcronym('API');
 *   Sugar.String.addAcronym('APIs');
 *
 * @param {string} src
 *
 ***
 * @method addPlural(singular, [plural] = singular)
 * @short Adds a new pluralization rule.
 * @accessor
 * @extra Rules are used by `pluralize` and `singularize`. If [singular] is
 *        a string, then the reciprocal will also be added for singularization.
 *        If it is a regular expression, capturing groups are allowed for
 *        [plural]. [plural] defaults to the same as [singular] to allow
 *        uncountable words.
 *
 * @example
 *
 *   Sugar.String.addPlural('hashtag', 'hashtaggies');
 *   Sugar.String.addPlural(/(tag)$/, '$1gies');
 *   Sugar.String.addPlural('advice');
 *
 * @param {string} singular
 * @param {string} [plural]
 *
 ***
 * @method addHuman(src, human)
 * @short Adds a new humanization rule.
 * @accessor
 * @extra Rules are used by `humanize` and `titleize`. [str] can be either a
 *        string or a regular expression, in which case [human] can contain
 *        refences to capturing groups.
 *
 * @example
 *
 *   Sugar.String.addHuman('src', 'source');
 *   Sugar.String.addHuman(/_ref/, 'reference');
 *
 * @param {string|RegExp} src
 * @param {string} human
 *
 ***/
function buildInflectionAccessors() {
  defineAccessor(sugarString, 'addAcronym', addAcronym);
  defineAccessor(sugarString, 'addPlural', addPlural);
  defineAccessor(sugarString, 'addHuman', addHuman);
}

function buildInflectionSet() {

  InflectionSet = function() {
    this.map = {};
    this.rules = [];
  };

  InflectionSet.prototype = {

    add: function(rule, replacement) {
      if (isString(rule)) {
        this.map[rule] = replacement;
      } else {
        this.rules.unshift({
          rule: rule,
          replacement: replacement
        });
      }
    },

    inflect: function(str) {
      var arr, idx, word;

      arr = str.split(' ');
      idx = arr.length - 1;
      word = arr[idx];

      arr[idx] = this.find(word) || this.runRules(word);
      return arr.join(' ');
    },

    find: function(str) {
      return getOwn(this.map, str);
    },

    runRules: function(str) {
      for (var i = 0, r; r = this.rules[i]; i++) {
        if (r.rule.test(str)) {
          str = str.replace(r.rule, r.replacement);
          break;
        }
      }
      return str;
    }

  };

}

// Inflection Bundles

// Global inflection runners. Allowing the build functions below to define
// these functions so that common inflections will also be bundled together
// when these methods are modularized.
var inflectPlurals;
var inflectHumans;

function buildCommonPlurals() {

  inflectPlurals = function(type, str) {
    return Inflections[type] && Inflections[type].inflect(str) || str;
  };

  addPlural(/$/, 's');
  addPlural(/s$/i, 's');
  addPlural(/(ax|test)is$/i, '$1es');
  addPlural(/(octop|fung|foc|radi|alumn|cact)(i|us)$/i, '$1i');
  addPlural(/(census|alias|status|fetus|genius|virus)$/i, '$1es');
  addPlural(/(bu)s$/i, '$1ses');
  addPlural(/(buffal|tomat)o$/i, '$1oes');
  addPlural(/([ti])um$/i, '$1a');
  addPlural(/([ti])a$/i, '$1a');
  addPlural(/sis$/i, 'ses');
  addPlural(/f+e?$/i, 'ves');
  addPlural(/(cuff|roof)$/i, '$1s');
  addPlural(/([ht]ive)$/i, '$1s');
  addPlural(/([^aeiouy]o)$/i, '$1es');
  addPlural(/([^aeiouy]|qu)y$/i, '$1ies');
  addPlural(/(x|ch|ss|sh)$/i, '$1es');
  addPlural(/(tr|vert)(?:ix|ex)$/i, '$1ices');
  addPlural(/([ml])ouse$/i, '$1ice');
  addPlural(/([ml])ice$/i, '$1ice');
  addPlural(/^(ox)$/i, '$1en');
  addPlural(/^(oxen)$/i, '$1');
  addPlural(/(quiz)$/i, '$1zes');
  addPlural(/(phot|cant|hom|zer|pian|portic|pr|quart|kimon)o$/i, '$1os');
  addPlural(/(craft)$/i, '$1');
  addPlural(/([ft])[eo]{2}(th?)$/i, '$1ee$2');

  addSingular(/s$/i, '');
  addSingular(/([pst][aiu]s)$/i, '$1');
  addSingular(/([aeiouy])ss$/i, '$1ss');
  addSingular(/(n)ews$/i, '$1ews');
  addSingular(/([ti])a$/i, '$1um');
  addSingular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, '$1$2sis');
  addSingular(/(^analy)ses$/i, '$1sis');
  addSingular(/(i)(f|ves)$/i, '$1fe');
  addSingular(/([aeolr]f?)(f|ves)$/i, '$1f');
  addSingular(/([ht]ive)s$/i, '$1');
  addSingular(/([^aeiouy]|qu)ies$/i, '$1y');
  addSingular(/(s)eries$/i, '$1eries');
  addSingular(/(m)ovies$/i, '$1ovie');
  addSingular(/(x|ch|ss|sh)es$/i, '$1');
  addSingular(/([ml])(ous|ic)e$/i, '$1ouse');
  addSingular(/(bus)(es)?$/i, '$1');
  addSingular(/(o)es$/i, '$1');
  addSingular(/(shoe)s?$/i, '$1');
  addSingular(/(cris|ax|test)[ie]s$/i, '$1is');
  addSingular(/(octop|fung|foc|radi|alumn|cact)(i|us)$/i, '$1us');
  addSingular(/(census|alias|status|fetus|genius|virus)(es)?$/i, '$1');
  addSingular(/^(ox)(en)?/i, '$1');
  addSingular(/(vert)(ex|ices)$/i, '$1ex');
  addSingular(/tr(ix|ices)$/i, 'trix');
  addSingular(/(quiz)(zes)?$/i, '$1');
  addSingular(/(database)s?$/i, '$1');
  addSingular(/ee(th?)$/i, 'oo$1');

  addIrregular('person', 'people');
  addIrregular('man', 'men');
  addIrregular('human', 'humans');
  addIrregular('child', 'children');
  addIrregular('sex', 'sexes');
  addIrregular('move', 'moves');
  addIrregular('save', 'saves');
  addIrregular('goose', 'geese');
  addIrregular('zombie', 'zombies');

  addUncountable('equipment information rice money species series fish deer sheep jeans');

}

function buildCommonHumans() {

  inflectHumans = runHumanRules;

  addHuman(/_id$/g, '');
}

function addPlural(singular, plural) {
  plural = plural || singular;
  addInflection('plural', singular, plural);
  if (isString(singular)) {
    addSingular(plural, singular);
  }
}

function addSingular(plural, singular) {
  addInflection('singular', plural, singular);
}

function addIrregular(singular, plural) {
  var sReg = RegExp(singular + '$', 'i');
  var pReg = RegExp(plural + '$', 'i');
  addPlural(sReg, plural);
  addPlural(pReg, plural);
  addSingular(pReg, singular);
  addSingular(sReg, singular);
}

function addUncountable(set) {
  forEach(spaceSplit(set), function(str) {
    addPlural(str);
  });
}

function addHuman(src, humanized) {
  addInflection('human', src, humanized);
}

function addAcronym(str) {
  addInflection('acronyms', str, str);
  addInflection('acronyms', str.toLowerCase(), str);
  buildAcronymReg();
}

function buildAcronymReg() {
  var tokens = [];
  forEachProperty(Inflections.acronyms.map, function(val, key) {
    if (key === val) {
      tokens.push(val);
    }
  });
  // Sort by length to ensure that tokens
  // like HTTPS take precedence over HTTP.
  tokens.sort(function(a, b) {
    return b.length - a.length;
  });
  Inflections.acronyms.reg = RegExp('\\b' + tokens.join('|') + '\\b', 'g');
}

function addInflection(type, rule, replacement) {
  if (!Inflections[type]) {
    Inflections[type] = new InflectionSet;
  }
  Inflections[type].add(rule, replacement);
}

defineInstance(sugarString, {

  /***
   * @method pluralize([num])
   * @returns String
   * @short Returns the plural form of the last word in the string.
   * @extra If [num] is passed, the word will be singularized if equal to 1.
   *        Otherwise it will be pluralized. Custom pluralization rules can be
   *        added using `addPlural`.
   *
   * @example
   *
   *   'post'.pluralize()    -> 'posts'
   *   'post'.pluralize(1)   -> 'post'
   *   'post'.pluralize(2)   -> 'posts'
   *   'octopus'.pluralize() -> 'octopi'
   *   'sheep'.pluralize()   -> 'sheep'
   *
   * @param {number} [num]
   *
   ***/
  'pluralize': function(str, num) {
    str = String(str);
    // Reminder that this pretty much holds true only for English.
    return num === 1 || str.length === 0 ? str : inflectPlurals('plural', str);
  },

  /***
   * @method singularize()
   * @returns String
   * @short Returns the singular form of the last word in the string.
   *
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
    return inflectPlurals('singular', String(str));
  },

  /***
   * @method humanize()
   * @returns String
   * @short Creates a human readable string.
   * @extra Capitalizes the first word and turns underscores into spaces and
   *        strips a trailing '_id', if any. Like `titleize`, this is meant
   *        for creating pretty output. Rules for special cases can be added
   *        using `addHuman`.
   *
   * @example
   *
   *   'employee_salary'.humanize() -> 'Employee salary'
   *   'author_id'.humanize()       -> 'Author'
   *
   ***/
  'humanize': function(str) {
    str = inflectHumans(str);
    str = str.replace(/(_)?([a-z\d]*)/gi, function(match, _, word) {
      word = getHumanWord(word) || word;
      word = getAcronym(word) || word.toLowerCase();
      return (_ ? ' ' : '') + word;
    });
    return simpleCapitalize(str);
  }

});

buildInflectionAccessors();
buildInflectionSet();
buildCommonPlurals();
buildCommonHumans();
