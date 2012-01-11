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
  };


  var Irregulars = {
    'person' : 'people',
    'man'    : 'men',
    'child'  : 'children',
    'sex'    : 'sexes',
    'move'   : 'moves',
  };

  var Uncountables = [
    'equipment',
    'information',
    'rice',
    'money',
    'species',
    'series',
    'fish',
    'sheep',
    'jeans'
  ];

  var MixtureToTitleCase = {
    'active_record'       : 'Active Record',
    'ActiveRecord'        : 'Active Record',
    'action web service'  : 'Action Web Service',
    'Action Web Service'  : 'Action Web Service',
    'Action web service'  : 'Action Web Service',
    'actionwebservice'    : 'Actionwebservice',
    'Actionwebservice'    : 'Actionwebservice',
    "david's code"        : "David's Code",
    "David's code"        : "David's Code",
    "david's Code"        : "David's Code",

    // Added test cases for non-titleized words

    "the day of the jackal"        : "The Day of the Jackal",
    "what color is your parachute?": "What Color Is Your Parachute?",
    "a tale of two cities"         : "A Tale of Two Cities",
    "where am i going to"          : "Where Am I Going To"

  }

  var CamelToUnderscore = {
    "Product"               : "product",
    "SpecialGuest"          : "special_guest",
    "ApplicationController" : "application_controller",
    "Area51Controller"      : "area51_controller"
  }

  var CamelToUnderscoreWithoutReverse = {
    "HTMLTidy"              : "html_tidy",
    "HTMLTidyGenerator"     : "html_tidy_generator",
    "FreeBSD"               : "free_bsd",
    "HTML"                  : "html",
  }


  // Test pluralize plurals
  equal("plurals".pluralize(), "plurals", "String#pluralize | plurals")
  equal("Plurals".pluralize(), "Plurals", "String#pluralize | Plurals")


  // Test pluralize empty string
  equal("".pluralize(), "", 'String#pluralize | ""');


  // Test uncountability of words
  Uncountables.each(function(word) {
    equal(word.singularize(), word, 'String#singularize | uncountables');
    equal(word.pluralize(), word, 'String#pluralize | uncountables');
    equal(word.singularize(), word.pluralize(), 'String#singularize | uncountables | same as pluralize');
  });


  // Test uncountable word is not greedy
  var uncountable_word = "ors";
  var countable_word = "sponsor";

  String.inflector.uncountable(uncountable_word);

  equal(uncountable_word.singularize(), uncountable_word, 'String#singularize | uncountable | ors');
  equal(uncountable_word.pluralize(), uncountable_word, 'String#pluralize | uncountable | ors');
  equal(uncountable_word.pluralize(), uncountable_word.singularize(), 'String#singularize | uncountable | both are same');
  equal(countable_word.singularize(), 'sponsor', 'String#singularize | countable | sponsor');
  equal(countable_word.pluralize(), 'sponsors', 'String#pluralize | countable | sponsors');
  equal(countable_word.pluralize().singularize(), 'sponsor', 'String#pluralize | countable | both are same');


  // Test pluralize singular
  Object.each(SingularToPlural, function(singular, plural) {
    equal(singular.pluralize(), plural, 'String#pluralize | singular is equal to plural');
    equal(singular.capitalize().pluralize(), plural.capitalize(), 'String#pluralize | pluralize is equal to capitalized plural');
  });

  // Test singularize plural
  Object.each(SingularToPlural, function(singular, plural) {
    equal(plural.singularize(), singular, 'String#singularize | singular is equal to singular');
    equal(plural.capitalize().singularize(), singular.capitalize(), 'String#singularize | plural > capitalize > singular');
  });

  // Test pluralize plural
  Object.each(SingularToPlural, function(singular, plural) {
    equal(plural.pluralize(), plural, 'String#singularize | singular is equal to singular');
    equal(plural.capitalize().pluralize(), plural.capitalize(), 'String#singularize | plural > capitalize > pluralize');
  });


  // Test overwrite previous inflectors
  equal('series'.singularize(), 'series', 'String#singularize | series');
  String.inflector.singular('series', 'serie');
  equal('series'.singularize(), 'serie', 'String#singularize | serie');
  String.inflector.singular('series'); // Return to normal


  // Test titleize
  Object.each(MixtureToTitleCase, function(before, titleized) {
      equal(before.titleize(), titleized, 'String#titleize | mixed cases')
  });


  // Test camelize
  Object.each(CamelToUnderscore, function(camel, underscore) {
      equal(underscore.camelize(), camel, 'String#camelize | mixed cases')
  });

  // Test with lower downcases the first letter
  equal('Capital'.camelize(false), 'capital', 'String#camelize | downcases the first letter');

  // Test camelize with underscores
  equal('Camel_Case'.camelize(), 'CamelCase', 'String#camelize | handles underscores');


  // Test acronyms

  String.inflector.acronym("API");
  String.inflector.acronym("HTML");
  String.inflector.acronym("HTTP");
  String.inflector.acronym("RESTful");
  String.inflector.acronym("W3C");
  String.inflector.acronym("PhD");
  String.inflector.acronym("RoR");
  String.inflector.acronym("SSL");

  // camelize             underscore            humanize              titleize
  [
    ["API",               "api",                "API",                "API"],
    ["APIController",     "api_controller",     "API controller",     "API Controller"],

    // Ruby specific inflections don't make sense here.
    // ["Nokogiri::HTML",    "nokogiri/html",      "Nokogiri/HTML",      "Nokogiri/HTML"],
    // ["HTTP::Get",         "http/get",           "HTTP/get",           "HTTP/Get"],

    ["HTTPAPI",           "http_api",           "HTTP API",           "HTTP API"],
    ["SSLError",          "ssl_error",          "SSL error",          "SSL Error"],
    ["RESTful",           "restful",            "RESTful",            "RESTful"],
    ["RESTfulController", "restful_controller", "RESTful controller", "RESTful Controller"],
    ["IHeartW3C",         "i_heart_w3c",        "I heart W3C",        "I Heart W3C"],
    ["PhDRequired",       "phd_required",       "PhD required",       "PhD Required"],
    ["IRoRU",             "i_ror_u",            "I RoR u",            "I RoR U"],
    ["RESTfulHTTPAPI",    "restful_http_api",   "RESTful HTTP API",   "RESTful HTTP API"],

    // misdirection
    ["Capistrano",        "capistrano",         "Capistrano",       "Capistrano"],
    ["CapiController",    "capi_controller",    "Capi controller",  "Capi Controller"],
    ["HttpsApis",         "https_apis",         "Https apis",       "Https Apis"],
    ["Html5",             "html5",              "Html5",            "Html5"],
    ["Restfully",         "restfully",          "Restfully",        "Restfully"],
    // This one confounds the JS implementation, but I argue that it isn't correct anyway.
    // ["RoRails",           "ro_rails",           "Ro rails",         "Ro Rails"]
  ].each(function(set) {
    var camel = set[0], under = set[1], human = set[2], title = set[3];
    equal(under.camelize(), camel, 'String#camelize | under.camelize()')
    equal(camel.camelize(), camel, 'String#camelize | camel.camelize()')
    equal(under.underscore(), under, 'String#underscore | under.underscore()')
    equal(camel.underscore(), under, 'String#underscore | camel.underscore()')
    equal(under.titleize(), title, 'String#titleize | under.titleize()')
    equal(camel.titleize(), title, 'String#titleize | camel.titleize()')
    equal(under.humanize(), human, 'String#humanize | under.humanize()')
  });



  // Test acronym override
  String.inflector.acronym("LegacyApi")

  equal('legacyapi'.camelize(), "LegacyApi", 'String#camelize | LegacyApi')
  equal('legacy_api'.camelize(), "LegacyAPI", 'String#camelize | LegacyAPI')
  equal('some_legacyapi'.camelize(), "SomeLegacyApi", 'String#camelize | SomeLegacyApi')
  equal('nonlegacyapi'.camelize(), "Nonlegacyapi", 'String#camelize | Nonlegacyapi')


  // Test acronyms camelize lower

  equal('html_api'.camelize(false), 'htmlAPI', 'String#camelize | html_api')
  equal('htmlAPI'.camelize(false), 'htmlAPI', 'String#camelize | htmlAPI')
  equal('HTMLAPI'.camelize(false), 'htmlAPI', 'String#camelize | HTMLAPI')


  // Test underscore acronym sequence

  String.inflector.acronym("HTML5");

  equal('HTML5HTMLAPI'.underscore(), 'html5_html_api', 'String#underscore | HTML5HTMLAPI')




  // Test underscore
  Object.each(CamelToUnderscore, function(camel, underscore) {
      equal(camel.underscore(), underscore, 'String#underscore | mixed cases')
  });

  Object.each(CamelToUnderscoreWithoutReverse, function(camel, underscore) {
      equal(camel.underscore(), underscore, 'String#underscore | mixed cases')
  });


  // demodulize
  // deconstantize
  // foreign_key
  // tableize


  // PARAMETERIZE PICK UP HERE






  Object.each(Irregulars, function(singular, plural) {
    equal(plural.singularize(), singular, 'String#singularize | irregulars');
    equal(singular.pluralize(), plural, 'String#pluralize | irregulars | pluralized singular is plural');
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

  Object.each(Irregulars, function(singular, plural) {
    equal(plural.pluralize(), plural, 'String#singularize | irregulars | pluralized plural id pluralized');
    /*
    singular, plural = *irregularity
    ActiveSupport::Inflector.inflections do |inflect|
    define_method("test_pluralize_of_irregularity_#{plural}_should_be_the_same") do
    inflect.irregular(singular, plural)
    equal plural, ActiveSupport::Inflector.pluralize(plural)
    end
    end
    */
  });


































});
