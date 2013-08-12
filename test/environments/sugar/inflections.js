test('Inflections', function () {

  /* Note that the following methods are not implemented now and may not be:
   *
   *   String#demodulize
   *   String#deconstantize
   *   String#foreign_key
   *   String#tableize
   *   String#classify
   */


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
    "save"        : "saves",
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
    "|ouse"       : "|ouses",


    // Taken from Wikipedia

    "kiss"    : "kisses",
    "ass"     : "asses",
    "mess"    : "messes",
    "fuss"    : "fusses",
    "phase"   : "phases",
    "dish"    : "dishes",
    "massage" : "massages",
    "witch"   : "witches",
    "judge"   : "judges",

    "lap"     : "laps",
    "cat"     : "cats",
    "clock"   : "clocks",
    "cuff"    : "cuffs",
    "death"   : "deaths",

    "boy"     : "boys",
    "girl"    : "girls",
    "chair"   : "chairs",

    "hero"    : "heroes",
    "potato"  : "potatoes",
    "volcano" : "volcanoes",

    "cherry"  : "cherries",
    "lady"    : "ladies",


    "day"     : "days",
    "monkey"  : "monkeys",
    "canto"   : "cantos",
    "homo"    : "homos",
    "photo"   : "photos",
    "zero"    : "zeros",
    "piano"   : "pianos",
    "portico" : "porticos",
    "pro"     : "pros",
    "quarto"  : "quartos",
    "kimono"  : "kimonos",


    "bath"   : "baths",
    "mouth"  : "mouths",
    "calf"   : "calves",
    "leaf"   : "leaves",
    "knife"  : "knives",
    "life"   : "lives",
    "house"  : "houses",
    "moth"   : "moths",
    "proof"  : "proofs",
    "dwarf"  : "dwarves",
    "hoof"   : "hooves",
    "elf"    : "elves",
    "roof"   : "roofs",

    "aircraft"   : "aircraft",
    "watercraft" : "watercraft",
    "spacecraft" : "spacecraft",
    "hovercraft" : "hovercraft",

    "information" : "information",
    "ox"          : "oxen",
    "child"       : "children",
    "foot"        : "feet",
    "goose"       : "geese",
    "louse"       : "lice",
    "man"         : "men",
    "mouse"       : "mice",
    "tooth"       : "teeth",
    "woman"       : "women",
    "alumnus"     : "alumni",
    "census"      : "censuses",
    "focus"       : "foci",
    "radius"      : "radii",
    "fungus"      : "fungi",
    "status"      : "statuses",
    "syllabus"    : "syllabuses"

  };


  var Irregulars = {
    'person' : 'people',
    'man'    : 'men',
    'child'  : 'children',
    'sex'    : 'sexes',
    'move'   : 'moves'
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
    "where am i going to"          : "Where Am I Going To",

    // From the titleize docs
    "man from the boondocks"       :  "Man from the Boondocks",
    "x-men: the last stand"        :  "X Men: The Last Stand",
    "i am a sentence. and so am i.":  "I Am a Sentence. And so Am I.",
    "hello! and goodbye!"          :  "Hello! And Goodbye!",
    "hello, and goodbye"           :  "Hello, and Goodbye",
    "hello; and goodbye"           :  "Hello; And Goodbye",
    'about "you" and "me"'         :  'About "You" and "Me"',
    "TheManWithoutAPast"           :  "The Man Without a Past",
    "raiders_of_the_lost_ark"      :  "Raiders of the Lost Ark"
  }

  var CamelToUnderscore = {
    "Product"               : "product",
    "SpecialGuest"          : "special_guest",
    "ApplicationController" : "application_controller",
    "Area51Controller"      : "area51_controller"
  }

  var UnderscoreToLowerCamel = {
    "product"                : "product",
    "special_guest"          : "specialGuest",
    "application_controller" : "applicationController",
    "area51_controller"      : "area51Controller"
  }

  var CamelToUnderscoreWithoutReverse = {
    "HTMLTidy"              : "html_tidy",
    "HTMLTidyGenerator"     : "html_tidy_generator",
    "FreeBSD"               : "free_bsd",
    "HTML"                  : "html"
  }

  var StringToParameterized = {
    "Donald E. Knuth"                     : "donald-e-knuth",
    "Random text with *(bad)* characters" : "random-text-with-bad-characters",
    "Allow_Under_Scores"                  : "allow_under_scores",
    "Trailing bad characters!@#"          : "trailing-bad-characters",
    "!@#Leading bad characters"           : "leading-bad-characters",
    "Squeeze   separators"                : "squeeze-separators",
    "Test with + sign"                    : "test-with-sign",
    "Test with malformed utf8 \251"       : "test-with-malformed-utf8"
  }

  var StringToParameterizeWithNoSeparator = {
    "Donald E. Knuth"                     : "donaldeknuth",
    "With-some-dashes"                    : "with-some-dashes",
    "Random text with *(bad)* characters" : "randomtextwithbadcharacters",
    "Trailing bad characters!@#"          : "trailingbadcharacters",
    "!@#Leading bad characters"           : "leadingbadcharacters",
    "Squeeze   separators"                : "squeezeseparators",
    "Test with + sign"                    : "testwithsign",
    "Test with malformed utf8 \251"       : "testwithmalformedutf8"
  }

  var StringToParameterizeWithUnderscore = {
    "Donald E. Knuth"                     : "donald_e_knuth",
    "Random text with *(bad)* characters" : "random_text_with_bad_characters",
    "With-some-dashes"                    : "with-some-dashes",
    "Retain_underscore"                   : "retain_underscore",
    "Trailing bad characters!@#"          : "trailing_bad_characters",
    "!@#Leading bad characters"           : "leading_bad_characters",
    "Squeeze   separators"                : "squeeze_separators",
    "Test with + sign"                    : "test_with_sign",
    "Test with malformed utf8 \251"       : "test_with_malformed_utf8"
  }

  var StringToParameterizedAndNormalized = {
    "Malmö"                               : "malmo",
    "Garçons"                             : "garcons",
    "Ops\331"                             : "opsu",
    "Ærøskøbing"                          : "aeroskobing",
    "Aßlar"                               : "asslar",
    "Japanese: 日本語"                    : "japanese"
  }

  var UnderscoreToHuman = {
    "employee_salary" : "Employee salary",
    "employee_id"     : "Employee",
    "underground"     : "Underground"
  }

  var UnderscoresToDashes = {
    "street"                : "street",
    "street_address"        : "street-address",
    "person_street_address" : "person-street-address"
  }


  // Test pluralize plurals
  equal("plurals".pluralize(), "plurals", "String#pluralize | plurals")
  equal("Plurals".pluralize(), "Plurals", "String#pluralize | Plurals")


  // Test pluralize empty string
  equal("".pluralize(), "", 'String#pluralize | ""');


  // Test uncountability of words
  Uncountables.forEach(function(word) {
    equal(word.singularize(), word, 'String#singularize | uncountables');
    equal(word.pluralize(), word, 'String#pluralize | uncountables');
    equal(word.singularize(), word.pluralize(), 'String#singularize | uncountables | same as pluralize');
  });


  // Test uncountable word is not greedy
  var uncountable_word = "ors";
  var countable_word = "sponsor";

  String.Inflector.uncountable(uncountable_word);

  equal(uncountable_word.singularize(), uncountable_word, 'String#singularize | uncountable | ors');
  equal(uncountable_word.pluralize(), uncountable_word, 'String#pluralize | uncountable | ors');
  equal(uncountable_word.pluralize(), uncountable_word.singularize(), 'String#singularize | uncountable | both are same');
  equal(countable_word.singularize(), 'sponsor', 'String#singularize | countable | sponsor');
  equal(countable_word.pluralize(), 'sponsors', 'String#pluralize | countable | sponsors');
  equal(countable_word.pluralize().singularize(), 'sponsor', 'String#pluralize | countable | both are same');


  // Test pluralize singular
  testIterateOverObject(SingularToPlural, function(singular, plural) {
    equal(singular.pluralize(), plural, 'String#pluralize | singular > plural');
    equal(singular.capitalize().pluralize(), plural.capitalize(), 'String#pluralize | singular > capitalize > plural == plural > capitalize');
  });

  // Test singularize plural
  testIterateOverObject(SingularToPlural, function(singular, plural) {
    equal(plural.singularize(), singular, 'String#singularize | plural > singular');
    equal(plural.capitalize().singularize(), singular.capitalize(), 'String#singularize | plural > capitalize > singular == singular > capitalize');
  });

  // Test singularize singular
  testIterateOverObject(SingularToPlural, function(singular, plural) {
    equal(singular.singularize(), singular, 'String#singularize | singular > singular');
    equal(singular.capitalize().singularize(), singular.capitalize(), 'String#singularize | singular > capitalize > singular == singular > capitalize');
  });

  // Test pluralize plural
  testIterateOverObject(SingularToPlural, function(singular, plural) {
    equal(plural.pluralize(), plural, 'String#pluralize | plural > plural');
    equal(plural.capitalize().pluralize(), plural.capitalize(), 'String#singularize | plural > capitalize > plural == plural > capitalize');
  });


  // Test overwrite previous inflectors
  equal('series'.singularize(), 'series', 'String#singularize | series');
  String.Inflector.singular('series', 'serie');
  equal('series'.singularize(), 'serie', 'String#singularize | serie');
  String.Inflector.singular('series'); // Return to normal


  // Test irregulars

  testIterateOverObject(Irregulars, function(singular, plural) {
    equal(plural.singularize(), singular, 'String#singularize | irregulars');
    equal(singular.pluralize(), plural, 'String#pluralize | irregulars | pluralized singular is plural');
  });

  testIterateOverObject(Irregulars, function(singular, plural) {
    equal(plural.pluralize(), plural, 'String#singularize | irregulars | pluralized plural id pluralized');
  });


  // Test titleize
  testIterateOverObject(MixtureToTitleCase, function(before, titleized) {
    equal(before.titleize(), titleized, 'String#titleize | mixed cases')
  });


  // Test camelize
  testIterateOverObject(CamelToUnderscore, function(camel, underscore) {
    equal(underscore.camelize(), camel, 'String#camelize | mixed cases')
  });

  testIterateOverObject(UnderscoreToLowerCamel, function(under, lowerCamel) {
    // Sugar differs from ActiveSupport here in that the first character is upcased by default
    equal(under.camelize(false), lowerCamel, 'String#camelize | lower camel')
  });

  // Test with lower downcases the first letter
  equal('Capital'.camelize(false), 'capital', 'String#camelize | downcases the first letter');

  // Test camelize with underscores
  equal('Camel_Case'.camelize(), 'CamelCase', 'String#camelize | handles underscores');


  // Test acronyms

  String.Inflector.acronym("API");
  String.Inflector.acronym("HTML");
  String.Inflector.acronym("HTTP");
  String.Inflector.acronym("RESTful");
  String.Inflector.acronym("W3C");
  String.Inflector.acronym("PhD");
  String.Inflector.acronym("RoR");
  String.Inflector.acronym("SSL");

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
    ["Restfully",         "restfully",          "Restfully",        "Restfully"]
    // This one confounds the JS implementation, but I argue that it isn't correct anyway.
    // ["RoRails",           "ro_rails",           "Ro rails",         "Ro Rails"]
  ].forEach(function(set) {
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
  String.Inflector.acronym("LegacyApi")

  equal('legacyapi'.camelize(), "LegacyApi", 'String#camelize | LegacyApi')
  equal('legacy_api'.camelize(), "LegacyAPI", 'String#camelize | LegacyAPI')
  equal('some_legacyapi'.camelize(), "SomeLegacyApi", 'String#camelize | SomeLegacyApi')
  equal('nonlegacyapi'.camelize(), "Nonlegacyapi", 'String#camelize | Nonlegacyapi')


  // Test acronyms camelize lower

  equal('html_api'.camelize(false), 'htmlAPI', 'String#camelize | html_api')
  equal('htmlAPI'.camelize(false), 'htmlAPI', 'String#camelize | htmlAPI')
  equal('HTMLAPI'.camelize(false), 'htmlAPI', 'String#camelize | HTMLAPI')


  // Test underscore acronym sequence

  String.Inflector.acronym("HTML5");

  equal('HTML5HTMLAPI'.underscore(), 'html5_html_api', 'String#underscore | HTML5HTMLAPI')




  // Test underscore
  testIterateOverObject(CamelToUnderscore, function(camel, underscore) {
      equal(camel.underscore(), underscore, 'String#underscore | mixed cases')
  });

  testIterateOverObject(CamelToUnderscoreWithoutReverse, function(camel, underscore) {
      equal(camel.underscore(), underscore, 'String#underscore | mixed cases')
  });


  // Test parameterize

  testIterateOverObject(StringToParameterized, function(str, parameterized) {
      equal(str.parameterize(), parameterized, 'String#parameterized')
  });

  testIterateOverObject(StringToParameterizedAndNormalized, function(str, parameterized) {
      equal(str.parameterize(), parameterized, 'String#parameterized | and normalized')
  });

  testIterateOverObject(StringToParameterizeWithUnderscore, function(str, parameterized) {
      equal(str.parameterize('_'), parameterized, 'String#parameterized | with underscore')
  });

  testIterateOverObject(StringToParameterized, function(str, parameterized) {
      equal(str.parameterize('__sep__'), parameterized.replace(/-/g, '__sep__'), 'String#parameterized | with underscore')
  });





  // Test humanize

  testIterateOverObject(UnderscoreToHuman, function(under, human) {
      equal(under.humanize(), human, 'String#humanize | underscore')
  });

  String.Inflector.human(/_cnt$/i, '_count');
  String.Inflector.human(/^prefx_/i, '')

  equal('jargon_cnt'.humanize(), 'Jargon count', 'String#humanize | Jargon count')
  equal('prefx_request'.humanize(), 'Request', 'String#humanize | Request')

  String.Inflector.human("col_rpted_bugs", "Reported bugs")

  equal('col_rpted_bugs'.humanize(), 'Reported bugs', 'String#humanize | Reported bugs')
  equal('COL_rpted_bugs'.humanize(), 'Col rpted bugs', 'String#humanize | Col rpted bugs')



  // Test dasherize
  testIterateOverObject(UnderscoresToDashes, function(under, dasherized) {
      equal(under.dasherize(), dasherized, 'String#dasherize')
  });

  testIterateOverObject(UnderscoresToDashes, function(under, dasherized) {
      equal(under.dasherize().underscore(), under, 'String#dasherize | reverse')
  });

  // More irregulars
  equal('street'.pluralize(), 'streets', 'String.Inflector | street > streets');

  // Test clearing inflectors KEEP ME AT THE BOTTOM
  equal('foo'.pluralize(), 'foos', 'String.Inflector.clear | foo is foos');
  String.Inflector.clear('plurals');
  equal('foo'.pluralize(), 'foo', 'String.Inflector.clear | clear purals');
  equal('foos'.singularize(), 'foo', 'String.Inflector.clear | singulars are not cleared');
  String.Inflector.plural(/$/, 's');
  equal('foo'.pluralize(), 'foos', 'String.Inflector.plural | re-add');
  String.Inflector.clear('all');
  equal('foo'.pluralize(), 'foo', 'String.Inflector.plural | clear all with "all"');
  String.Inflector.plural(/$/, 's');
  equal('foo'.pluralize(), 'foos', 'String.Inflector.plural | re-add again');
  String.Inflector.clear();
  equal('foo'.pluralize(), 'foo', 'String.Inflector.plural | clear all with undefined');


});
