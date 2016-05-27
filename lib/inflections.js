'use strict';

/***
 * @module Inflections
 * @namespace String
 * @description Pluralization and support for acronyms and humanized strings in
 *              string inflecting methods.
 *
 ***/

var InflectionSet;

function buildInflections() {

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
      return this.map[str];
    },

    runRules: function(str) {
      some(this.rules, function(r) {
        if (r.rule.test(str)) {
          str = str.replace(r.rule, r.replacement);
          return true;
        }
      });
      return str;
    }

  };

  addHuman(/_id$/g, '');

  addPlural(/$/, 's');
  addPlural(/s$/gi, 's');
  addPlural(/(ax|test)is$/gi, '$1es');
  addPlural(/(octop|fung|foc|radi|alumn|cact)(i|us)$/gi, '$1i');
  addPlural(/(census|alias|status|fetus|genius|virus)$/gi, '$1es');
  addPlural(/(bu)s$/gi, '$1ses');
  addPlural(/(buffal|tomat)o$/gi, '$1oes');
  addPlural(/([ti])um$/gi, '$1a');
  addPlural(/([ti])a$/gi, '$1a');
  addPlural(/sis$/gi, 'ses');
  addPlural(/f+e?$/gi, 'ves');
  addPlural(/(cuff|roof)$/gi, '$1s');
  addPlural(/([ht]ive)$/gi, '$1s');
  addPlural(/([^aeiouy]o)$/gi, '$1es');
  addPlural(/([^aeiouy]|qu)y$/gi, '$1ies');
  addPlural(/(x|ch|ss|sh)$/gi, '$1es');
  addPlural(/(tr|vert)(?:ix|ex)$/gi, '$1ices');
  addPlural(/([ml])ouse$/gi, '$1ice');
  addPlural(/([ml])ice$/gi, '$1ice');
  addPlural(/^(ox)$/gi, '$1en');
  addPlural(/^(oxen)$/gi, '$1');
  addPlural(/(quiz)$/gi, '$1zes');
  addPlural(/(phot|cant|hom|zer|pian|portic|pr|quart|kimon)o$/gi, '$1os');
  addPlural(/(craft)$/gi, '$1');
  addPlural(/([ft])[eo]{2}(th?)$/gi, '$1ee$2');

  addSingular(/s$/gi, '');
  addSingular(/([pst][aiu]s)$/gi, '$1');
  addSingular(/([aeiouy])ss$/gi, '$1ss');
  addSingular(/(n)ews$/gi, '$1ews');
  addSingular(/([ti])a$/gi, '$1um');
  addSingular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/gi, '$1$2sis');
  addSingular(/(^analy)ses$/gi, '$1sis');
  addSingular(/(i)(f|ves)$/i, '$1fe');
  addSingular(/([aeolr]f?)(f|ves)$/i, '$1f');
  addSingular(/([ht]ive)s$/gi, '$1');
  addSingular(/([^aeiouy]|qu)ies$/gi, '$1y');
  addSingular(/(s)eries$/gi, '$1eries');
  addSingular(/(m)ovies$/gi, '$1ovie');
  addSingular(/(x|ch|ss|sh)es$/gi, '$1');
  addSingular(/([ml])(ous|ic)e$/gi, '$1ouse');
  addSingular(/(bus)(es)?$/gi, '$1');
  addSingular(/(o)es$/gi, '$1');
  addSingular(/(shoe)s?$/gi, '$1');
  addSingular(/(cris|ax|test)[ie]s$/gi, '$1is');
  addSingular(/(octop|fung|foc|radi|alumn|cact)(i|us)$/gi, '$1us');
  addSingular(/(census|alias|status|fetus|genius|virus)(es)?$/gi, '$1');
  addSingular(/^(ox)(en)?/gi, '$1');
  addSingular(/(vert)(ex|ices)$/gi, '$1ex');
  addSingular(/tr(ix|ices)$/gi, 'trix');
  addSingular(/(quiz)(zes)?$/gi, '$1');
  addSingular(/(database)s?$/gi, '$1');
  addSingular(/ee(th?)$/gi, 'oo$1');

  addIrregular('person', 'people');
  addIrregular('man', 'men');
  addIrregular('human', 'humans');
  addIrregular('child', 'children');
  addIrregular('sex', 'sexes');
  addIrregular('move', 'moves');
  addIrregular('save', 'saves');
  addIrregular('goose', 'geese');
  addIrregular('zombie', 'zombies');

  addUncountable('equipment,information,rice,money,species,series,fish,deer,sheep,jeans');

}

function inflect(type, str) {
  return Inflections[type] && Inflections[type].inflect(str) || str;
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
  addPlural(RegExp(singular + '$'), plural);
  addPlural(RegExp(plural + '$'), plural);
  addSingular(RegExp(plural + '$'), singular);
  addSingular(RegExp(singular + '$'), singular);
}

function addUncountable(set) {
  forEach(commaSplit(set), function(str) {
    addPlural(str);
  });
}

function addHuman(str, humanized) {
  addInflection('human', str, humanized);
}

function addAcronym(str) {
  addInflection('acronyms', str, str);
  addInflection('acronyms', str.toLowerCase(), str);
  buildAcronymReg();
}

function buildAcronymReg() {
  var tokens = [];
  iterateOverObject(Inflections.acronyms.map, function(key, val) {
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

defineStatic(sugarString, {

  /***
   * @method addAcronym(str)
   * @short Adds a new acronym that will be recognized when inflecting strings.
   * @extra Acronyms are recognized by `camelize`, `underscore`, `dasherize`,
   *        `titleize`, `humanize`, and `spacify`. [str] must be passed as it
   *        will appear in a camelized string. Acronyms may contain lower case
   *        letters but must begin with an upper case letter. Note that to use
   *        acronyms in conjuction with `pluralize`, the pluralized form of the
   *        acronym must also be added.
   *
   * @example
   *
   *   String.addAcronym('HTML');
   *   String.addAcronym('API');
   *   String.addAcronym('APIs');
   *
   ***/
  'addAcronym': function(str) {
    return addAcronym(str);
  },

  /***
   * @method addPlural(singular, plural = singular)
   * @short Adds a new pluralization rule.
   * @extra Rules are used by `pluralize` and `singularize`. If [singular] is
   *        a string, then the reciprocal will also be added for singularization.
   *        If it is a regular expression, capturing groups are allowed for
   *        [plural]. [plural] defaults to the same as [singular] to allow
   *        uncountable words.
   *
   * @example
   *
   *   String.addPlural('hashtag', 'hashtaggies');
   *   String.addPlural(/(tag)$/, '$1gies');
   *   String.addPlural('advice');
   *
   ***/
  'addPlural': function(singular, plural) {
    return addPlural(singular, plural);
  },

  /***
   * @method addHuman(str, human)
   * @short Adds a new humanization rule.
   * @extra Rules are used by `humanize` and `titleize`. [str] can be either a
   *        string or a regular expression, in which case [human] can contain
   *        refences to capturing groups.
   *
   * @example
   *
   *   String.addHuman('src', 'source');
   *   String.addHuman(/_ref/, 'reference');
   *
   ***/
  'addHuman': function(str, humanized) {
    return addHuman(str, humanized);
  }


});

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
   ***/
  'pluralize': function(str, num) {
    str = String(str);
    // Reminder that this pretty much holds true only for English.
    return num === 1 || str.length === 0 ? str : inflect('plural', str);
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
    return inflect('singular', String(str));
  },

  /***
   * @method humanize()
   * @returns String
   * @short Creates a human readable string.
   * @extra Capitalizes the first word and turns underscores into spaces and
   *        strips a trailing '_id', if any. Like String#titleize, this is meant
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
    str = runHumanRules(str);
    str = str.replace(/(_)?([a-z\d]*)/gi, function(match, _, word) {
      word = getHumanWord(word) || word;
      word = getAcronym(word) || word.toLowerCase();
      return (_ ? ' ' : '') + word;
    });
    return simpleCapitalize(str);
  }

});

buildInflections();
