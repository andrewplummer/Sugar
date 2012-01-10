test('Inflectors', function () {

  var SingularToPlural = {
    "search"      : "searches",
    "switch"      : "switches",
    "fix"         : "fixes",
    "box"         : "boxes",
    "process"     : "processes",
    "address"     : "addresses",
    "case"        : "cases",
    "stack"       : "stacks",
    "wish"        : "wishes",
    "fish"        : "fish",
    "jeans"       : "jeans",
    "funky jeans" : "funky jeans",
    "my money"    : "my money",

    "category"    : "categories",
    "query"       : "queries",
    "ability"     : "abilities",
    "agency"      : "agencies",
    "movie"       : "movies",

    "archive"     : "archives",

    "index"       : "indices",

    "wife"        : "wives",
    "safe"        : "saves",
    "half"        : "halves",

    "move"        : "moves",

    "salesperson" : "salespeople",
    "person"      : "people",

    "spokesman"   : "spokesmen",
    "man"         : "men",
    "woman"       : "women",

    "basis"       : "bases",
    "diagnosis"   : "diagnoses",
    "diagnosis_a" : "diagnosis_as",

    "datum"       : "data",
    "medium"      : "media",
    "stadium"     : "stadia",
    "analysis"    : "analyses",

    "node_child"  : "node_children",
    "child"       : "children",

    "experience"  : "experiences",
    "day"         : "days",

    "comment"     : "comments",
    "foobar"      : "foobars",
    "newsletter"  : "newsletters",

    "old_news"    : "old_news",
    "news"        : "news",

    "series"      : "series",
    "species"     : "species",

    "quiz"        : "quizzes",

    "perspective" : "perspectives",

    "ox"          : "oxen",
    "photo"       : "photos",
    "buffalo"     : "buffaloes",
    "tomato"      : "tomatoes",
    "dwarf"       : "dwarves",
    "elf"         : "elves",
    "information" : "information",
    "equipment"   : "equipment",
    "bus"         : "buses",
    "status"      : "statuses",
    "status_code" : "status_codes",
    "mouse"       : "mice",

    "louse"       : "lice",
    "house"       : "houses",
    "octopus"     : "octopi",
    "virus"       : "viri",
    "alias"       : "aliases",
    "portfolio"   : "portfolios",

    "vertex"      : "vertices",
    "matrix"      : "matrices",
    "matrix_fu"   : "matrix_fus",

    "axis"        : "axes",
    "testis"      : "testes",
    "crisis"      : "crises",

    "rice"        : "rice",
    "shoe"        : "shoes",

    "horse"       : "horses",
    "prize"       : "prizes",
    "edge"        : "edges",

    "cow"         : "kine",
    "database"    : "databases",

    // regression tests against improper inflection regexes
    "|ice"        : "|ices",
    "|ouse"       : "|ouses"
  }


  var Irregularities = {
    'person' : 'people',
    'man'    : 'men',
    'child'  : 'children',
    'sex'    : 'sexes',
    'move'   : 'moves',
  }

  equal("plurals".pluralize(), "plurals", "String#pluralize | plurals")
  equal("Plurals".pluralize(), "Plurals", "String#pluralize | Plurals")

  equal("".pluralize(), "", 'String#pluralize | ""');

  /*
  Object.each('UNCOUTNABLEHERE', function() {
    equal word, ActiveSupport::Inflector.singularize(word)
    equal word, ActiveSupport::Inflector.pluralize(word)
    equal ActiveSupport::Inflector.pluralize(word), ActiveSupport::Inflector.singularize(word)
  });


  // test_uncountable_word_is_not_greedy

  var uncountable_word = "ors";
  var countable_word = "sponsor";

  //cached_uncountables = ActiveSupport::Inflector.inflections.uncountables

  //ActiveSupport::Inflector.inflections.uncountable << uncountable_word

  equal(uncountable_word, uncountable_word.singularize());
  equal(uncountable_word, uncountable_word.pluralize());
  equal(uncountable_word.pluralize(), uncountable_word.singularize());
  equal("sponsor", countable_word.singularize());
  equal("sponsors", countable_word.pluralize());
  equal("sponsor", countable_word.singularize().pluralize());


  */



  Object.each(SingularToPlural, function(singular, plural) {
    equal(singular.pluralize(), plural, 'String#pluralize | singular is equal to plural');
    equal(singular.capitalize().pluralize(), plural.capitalize(), 'String#pluralize | pluralize is equal to capitalized plural');
  });
  return;

  Object.each(SingularToPlural, function(singular, plural) {
    equal(singular, plural.singularize(), 'String#singularize | singular is equal to singular');
    equal(singular.capitalize, plural.capitalize().singularize(), 'String#singularize | plural > capitalize > singular');
  });

  Object.each(SingularToPlural, function(singular, plural) {
    equal(plural, plural.pluralize(), 'String#singularize | singular is equal to singular');
    equal(plural.capitalize, plural.capitalize().pluralize(), 'String#singularize | plural > capitalize > pluralize');
  });

  equal("series", "series".singularize());
  //? ActiveSupport::Inflector.inflections.singular "series", "serie"
  equal("serie", "series".singularize())
  //? ActiveSupport::Inflector.inflections.uncountable "series" # Return to normal

  Object.each(Irregularities, function(irregularity) {
/*
    singular, plural = *irregularity
    ActiveSupport::Inflector.inflections do |inflect|
      define_method("test_irregularity_between_#{singular}_and_#{plural}") do
        inflect.irregular(singular, plural)
        equal singular, ActiveSupport::Inflector.singularize(plural)
        equal plural, ActiveSupport::Inflector.pluralize(singular)
      end
    end
*/
  });

  /*
  Object.each(Irregularities, function(irregularity) {
    singular, plural = *irregularity
    ActiveSupport::Inflector.inflections do |inflect|
    define_method("test_pluralize_of_irregularity_#{plural}_should_be_the_same") do
    inflect.irregular(singular, plural)
    equal plural, ActiveSupport::Inflector.pluralize(plural)
    end
    end
  });
  */

});
