(function() {

  var plurals = [], singulars = [], uncountables = [], humans = [], acronyms = {}, acronymRegExp, inflector;

  function removeFromUncountablesAndAddTo(arr, rule, replacement) {
    if(Object.isString(rule)) {
      uncountables.remove(rule);
    }
    uncountables.remove(replacement)
    arr.unshift({ rule: rule, replacement: replacement })
  }

  inflector = {

    // Specifies a new pluralization rule and its replacement. The rule can either be a string or a regular expression.
    // The replacement should always be a string that may include references to the matched data from the rule.
    'plural': function(rule, replacement) {
      removeFromUncountablesAndAddTo(plurals, rule, replacement);
    },

    // Specifies a new singularization rule and its replacement. The rule can either be a string or a regular expression.
    // The replacement should always be a string that may include references to the matched data from the rule.
    'singular': function(rule, replacement) {
      removeFromUncountablesAndAddTo(singulars, rule, replacement);
    },

    // Specifies a new irregular that applies to both pluralization and singularization at the same time. This can only be used
    // for strings, not regular expressions. You simply pass the irregular in singular and plural form.
    //
    // Examples:
    //   irregular 'octopus', 'octopi'
    //   irregular 'person', 'people'
    'irregular': function(singular, plural) {

      var singularFirst      = singular.first(),
          singularRest       = singular.from(1),
          pluralFirst        = plural.first(),
          pluralRest         = plural.from(1),
          pluralFirstUpper   = pluralFirst.toUpperCase(),
          pluralFirstLower   = pluralFirst.toLowerCase(),
          singularFirstUpper = singularFirst.toUpperCase(),
          singularFirstLower = singularFirst.toLowerCase();

      uncountables.remove(singular)
      uncountables.remove(plural)

      if(singularFirstUpper == pluralFirstUpper) {

        inflector.plural(new RegExp('({1}){2}$'.assign(singularFirst, singularRest), 'i'), '$1' + pluralRest);
        inflector.plural(new RegExp('({1}){2}$'.assign(pluralFirst, pluralRest), 'i'), '$1' + pluralRest);
        inflector.singular(new RegExp('({1}){2}$'.assign(pluralFirst, pluralRest), 'i'), '$1' + singularRest);

        //plural(new Regexp("(#{singular.slice(0,1)})#{singular.slice(1..-1)}$", "i"), '\1' + plural.slice(1..-1))
        //plural(new Regexp("(#{plural.slice(0,1)})#{plural.slice(1..-1)}$", "i"), '\1' + plural.slice(1..-1))
        //singular(new Regexp("(#{plural.slice(0,1)})#{plural.slice(1..-1)}$", "i"), '\1' + singular.slice(1..-1))
      } else {
        inflector.plural(new RegExp('{1}{2}$'.assign(singularFirstUpper, singularRest)), pluralFirstUpper + pluralRest);
        inflector.plural(new RegExp('{1}{2}$'.assign(singularFirstLower, singularRest)), pluralFirstLower + pluralRest);
        inflector.plural(new RegExp('{1}{2}$'.assign(pluralFirstUpper, pluralRest)), pluralFirstUpper + pluralRest);
        inflector.plural(new RegExp('{1}{2}$'.assign(pluralFirstLower, pluralRest)), pluralFirstLower + pluralRest);
        inflector.singular(new RegExp('{1}{2}$'.assign(pluralFirstUpper, pluralRest)), singularFirstUpper + singularRest);
        inflector.singular(new RegExp('{1}{2}$'.assign(pluralFirstLower, pluralRest)), singularFirstLower + singularRest);

        //plural(new Regexp("#{singular.slice(0,1).toUpperCase()}(?i)#{singular.slice(1..-1)}$"), plural.slice(0,1).toUpperCase() + plural.slice(1..-1))
        //plural(new Regexp("#{singular.slice(0,1).toLowerCase()}(?i)#{singular.slice(1..-1)}$"), plural.slice(0,1).toLowerCase() + plural.slice(1..-1))
        //plural(new Regexp("#{plural.slice(0,1).toUpperCase()}(?i)#{plural.slice(1..-1)}$"), plural.slice(0,1).toUpperCase() + plural.slice(1..-1))
        //plural(new Regexp("#{plural.slice(0,1).toLowerCase()}(?i)#{plural.slice(1..-1)}$"), plural.slice(0,1).toLowerCase() + plural.slice(1..-1))
        //singular(new Regexp("#{plural.slice(0,1).toUpperCase()}(?i)#{plural.slice(1..-1)}$"), singular.slice(0,1).toUpperCase() + singular.slice(1..-1))
        //singular(new Regexp("#{plural.slice(0,1).toLowerCase()}(?i)#{plural.slice(1..-1)}$"), singular.slice(0,1).toLowerCase() + singular.slice(1..-1))
      }
    },

    // Add uncountable words that shouldn't be attempted inflected.
    //
    // Examples:
    //   uncountable "money"
    //   uncountable "money", "information"
    //   uncountable %w( money information rice )
    'uncountable': function() {
      uncountables.add(Array.create(arguments).flatten());
    },

    'acronym': function(word) {
      acronyms[word.toLowerCase()] = word;
      this.acronymRegExp = new RegExp(Object.values(acronyms).join('|'), 'g');
    },

    'acronyms': acronyms,

    'downcased': [
      'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at',
      'by', 'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over',
      'with', 'for'
    ]

  };

  inflector.plural(/$/, 's');
  inflector.plural(/s$/gi, 's');
  inflector.plural(/(ax|test)is$/gi, '$1es');
  inflector.plural(/(octop|vir)us$/gi, '$1i');
  inflector.plural(/(octop|vir)i$/gi, '$1i');
  inflector.plural(/(alias|status)$/gi, '$1es');
  inflector.plural(/(bu)s$/gi, '$1ses');
  inflector.plural(/(buffal|tomat)o$/gi, '$1oes');
  inflector.plural(/([ti])um$/gi, '$1a');
  inflector.plural(/([ti])a$/gi, '$1a');
  inflector.plural(/sis$/gi, 'ses');
  inflector.plural(/(?:([^f])fe|([lr])f)$/gi, '$1$2ves');
  inflector.plural(/(hive)$/gi, '$1s');
  inflector.plural(/([^aeiouy]|qu)y$/gi, '$1ies');
  inflector.plural(/(x|ch|ss|sh)$/gi, '$1es');
  inflector.plural(/(matr|vert|ind)(?:ix|ex)$/gi, '$1ices');
  inflector.plural(/([ml])ouse$/gi, '$1ice');
  inflector.plural(/([ml])ice$/gi, '$1ice');
  inflector.plural(/^(ox)$/gi, '$1en');
  inflector.plural(/^(oxen)$/gi, '$1');
  inflector.plural(/(quiz)$/gi, '$1zes');

  inflector.singular(/s$/gi, '');
  inflector.singular(/(n)ews$/gi, '$1ews');
  inflector.singular(/([ti])a$/gi, '$1um');
  inflector.singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/gi, '$1$2sis');
  inflector.singular(/(^analy)ses$/gi, '$1sis');
  inflector.singular(/([^f])ves$/gi, '$1fe');
  inflector.singular(/(hive)s$/gi, '$1');
  inflector.singular(/(tive)s$/gi, '$1');
  inflector.singular(/([lr])ves$/gi, '$1f');
  inflector.singular(/([^aeiouy]|qu)ies$/gi, '$1y');
  inflector.singular(/(s)eries$/gi, '$1eries');
  inflector.singular(/(m)ovies$/gi, '$1ovie');
  inflector.singular(/(x|ch|ss|sh)es$/gi, '$1');
  inflector.singular(/([ml])ice$/gi, '$1ouse');
  inflector.singular(/(bus)es$/gi, '$1');
  inflector.singular(/(o)es$/gi, '$1');
  inflector.singular(/(shoe)s$/gi, '$1');
  inflector.singular(/(cris|ax|test)es$/gi, '$1is');
  inflector.singular(/(octop|vir)i$/gi, '$1us');
  inflector.singular(/(alias|status)es$/gi, '$1');
  inflector.singular(/^(ox)en/gi, '$1');
  inflector.singular(/(vert|ind)ices$/gi, '$1ex');
  inflector.singular(/(matr)ices$/gi, '$1ix');
  inflector.singular(/(quiz)zes$/gi, '$1');
  inflector.singular(/(database)s$/gi, '$1');

  inflector.irregular('person', 'people');
  inflector.irregular('man', 'men');
  inflector.irregular('child', 'children');
  inflector.irregular('sex', 'sexes');
  inflector.irregular('move', 'moves');
  inflector.irregular('cow', 'kine');
  inflector.irregular('zombie', 'zombies');

  inflector.uncountable('equipment,information,rice,money,species,series,fish,sheep,jeans'.split(','));

  function isUncountable(word) {
    return uncountables.any(function(uncountable) {
      return new RegExp('\\b' + uncountable + '$', 'i').test(word);
    });
  }

  function inflect(word, pluralize) {
    word = Object.isString(word) ? word.toString() : '';
    if(word.isBlank() || isUncountable(word)) {
      return word;
    } else {
      return runReplacements(word, pluralize ? plurals : singulars);
    }
  }

  function runReplacements(word, table) {
    table.each(function(inflection) {
      if(word.match(inflection.rule)) {
        word = word.replace(inflection.rule, inflection.replacement);
        return false;
      }
    });
    return word;
  }

  function capitalize(word) {
    return word.first().toUpperCase() + word.from(1);
  }

  String.extend({

    'pluralize': function() {
      return inflect(this, true);
    },

    'singularize': function() {
      return inflect(this, false);
    },

    'titleize': function() {
      return this.spacify().humanize().words(function(word, index, words) {
        return index != 0 && index != words.length - 1 && inflector.downcased.any(word) ? word : capitalize(word);
      }).join(' ');
      //humanize(underscore(word)).gsub(/\b('?[a-z])/) { $1.capitalize }
    },

    // Capitalizes the first word and turns underscores into spaces and strips a
    // trailing "_id", if any. Like +titleize+, this is meant for creating pretty output.
    //
    // Examples:
    //   "employee_salary" # => "Employee salary"
    //   "author_id"       # => "Author"
    'humanize': function() {
      var result = runReplacements(this, humans);
      result = result.replace(/_id$/g, '');
      result = result.replace(/(_)?([a-z\d]*)/gi, function(match, _, word){
        return (_ ? ' ' : '') + (acronyms[word] || word.toLowerCase());
      });
      return capitalize(result);


      /*



      result = result.replace(/(_)?([a-z\d]*)/gi, function(full, underscore, word) {
        return acronyms[word] || word.toLowerCase();
      });

      return result.capitalize();
      //result.gsub(/(_)?([a-z\d]*)/i) { "#{$1 && ' '}#{inflections.acronyms[$2] || $2.downcase}" }.gsub(/^\w/) { $&.upcase }

      result = lower_case_and_underscored_word.to_s.dup
      inflections.humans.each { |(rule, replacement)| break if result.gsub!(rule, replacement) }
        result.gsub!(/_id$/, "")
      result.gsub(/(_)?([a-z\d]*)/i) { "#{$1 && ' '}#{inflections.acronyms[$2] || $2.downcase}" }.gsub(/^\w/) { $&.upcase }

      */
    }

  });

  String.inflector = inflector;

})();
