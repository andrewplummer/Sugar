package('String | Inflections', function () {

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

    "index"       : "indexes",

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
    "virus"       : "viruses",
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

    "cow"         : "cows",
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
    "syllabus"    : "syllabuses",
    "human"       : "humans",
    "fetus"       : "fetuses",
    "genius"      : "geniuses",
    "cactus"      : "cacti",
    "deer"        : "deer",
    "aviatrix"    : "aviatrices"

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

  method('pluralize', function() {
    // Test pluralize plurals
    test('plurals', 'plurals', 'plurals')
    test('Plurals', 'Plurals', 'Plurals')
    test('', '', 'empty string');
  });


  // Test uncountability of words
  Uncountables.forEach(function(word) {
    equal(run(word, 'singularize'), word, 'singularize | uncountables');
    equal(run(word, 'pluralize'), word, 'pluralize | uncountables');
    equal(run(word, 'singularize'), run(word, 'pluralize'), 'singularize | uncountables | same as pluralize');
  });


  // Test uncountable word is not greedy
  var uncountable = 'ors';
  var countable = 'sponsor';

  Sugar.String.Inflector.uncountable(uncountable);

  method('singularize', function() {
    test(uncountable, uncountable, 'singularize | uncountable | ors');
    test(countable, 'sponsor', 'singularize | countable | sponsor');

    // Test singularize plural
    testIterateOverObject(SingularToPlural, function(singular, plural) {
      test(plural, singular, 'singularize | plural > singular');
      test(run(plural, 'capitalize'), run(singular, 'capitalize'), 'singularize | plural > capitalize > singular == singular > capitalize');
    });

    // Test singularize singular
    testIterateOverObject(SingularToPlural, function(singular, plural) {
      equal(singular, singular, 'singular > singular');
      equal(run(singular, 'capitalize'), run(singular, 'capitalize'), 'singular > capitalize > singular == singular > capitalize');
    });


  });

  method('pluralize', function() {
    test(uncountable, uncountable, 'pluralize | uncountable | ors');
    test(uncountable, run(uncountable, 'singularize'), 'singularize | uncountable | both are same');

    test(countable, 'sponsors', 'pluralize | countable | sponsors');
    equal(run(run(countable, 'pluralize'), 'singularize'), 'sponsor', 'pluralize | countable | both are same');

    // Test pluralize singular
    testIterateOverObject(SingularToPlural, function(singular, plural) {
      test(singular, plural, 'pluralize | singular > plural');
      test(run(singular, 'capitalize'), run(plural, 'capitalize'), 'pluralize | singular > capitalize > plural == plural > capitalize');
    });

    // Test pluralize plural
    testIterateOverObject(SingularToPlural, function(singular, plural) {
      test(plural, plural, 'plural > plural');
      test(run(plural, 'capitalize'), run(plural, 'capitalize'), 'plural > capitalize > plural == plural > capitalize');
    });

  });



  // Test overwrite previous inflectors
  equal(run('series', 'singularize'), 'series', 'singularize | series');
  Sugar.String.Inflector.singular('series', 'serie');
  equal(run('series', 'singularize'), 'serie', 'singularize | serie');
  Sugar.String.Inflector.singular('series'); // Return to normal


  // Test irregulars

  testIterateOverObject(Irregulars, function(singular, plural) {
    equal(run(plural, 'singularize'), singular, 'singularize | irregulars');
    equal(run(singular, 'pluralize'), plural, 'pluralize | irregulars | pluralized singular is plural');
  });

  testIterateOverObject(Irregulars, function(singular, plural) {
    equal(run(plural, 'pluralize'), plural, 'singularize | irregulars | pluralized plural id pluralized');
  });

  method('titleize', function() {
    testIterateOverObject(MixtureToTitleCase, function(before, titleized) {
      test(before, titleized, 'mixed cases')
    });
  });

  method('camelize', function() {
    testIterateOverObject(CamelToUnderscore, function(camel, underscore) {
      test(underscore, camel, 'mixed cases')
    });
    test('Camel_Case', 'CamelCase', 'handles underscores');
  });

  method('camelize', [false], function() {
    testIterateOverObject(UnderscoreToLowerCamel, function(under, lowerCamel) {
      // Sugar differs from ActiveSupport here in that the first character is upcased by default
      test(under, lowerCamel, 'lower camel')
    });
    test('Capital', 'capital', 'downcases the first letter');

  });

  // Test acronyms

  Sugar.String.Inflector.acronym("API");
  Sugar.String.Inflector.acronym("HTML");
  Sugar.String.Inflector.acronym("HTTP");
  Sugar.String.Inflector.acronym("RESTful");
  Sugar.String.Inflector.acronym("W3C");
  Sugar.String.Inflector.acronym("PhD");
  Sugar.String.Inflector.acronym("RoR");
  Sugar.String.Inflector.acronym("SSL");

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
    equal(run(under, 'camelize'), camel, 'camelize | under.camelize()')
    equal(run(camel, 'camelize'), camel, 'camelize | camel.camelize()')
    equal(run(under, 'underscore'), under, 'underscore | under.underscore()')
    equal(run(camel, 'underscore'), under, 'underscore | camel.underscore()')
    equal(run(under, 'titleize'), title, 'titleize | under.titleize()')
    equal(run(camel, 'titleize'), title, 'titleize | camel.titleize()')
    equal(run(under, 'humanize'), human, 'humanize | under.humanize()')
  });


  // Test acronym override
  Sugar.String.Inflector.acronym("LegacyApi")

  method('camelize', function() {
    test('legacyapi', "LegacyApi", 'LegacyApi')
    test('legacy_api', "LegacyAPI", 'LegacyAPI')
    test('some_legacyapi', "SomeLegacyApi", 'SomeLegacyApi')
    test('nonlegacyapi', "Nonlegacyapi", 'Nonlegacyapi')
  });


  method('camelize', [false], function() {
    test('html_api', 'htmlAPI', 'html_api')
    test('htmlAPI', 'htmlAPI', 'htmlAPI')
    test('HTMLAPI', 'htmlAPI', 'HTMLAPI')
  });

  // Test underscore acronym sequence

  Sugar.String.Inflector.acronym("HTML5");


  method('underscore', function() {

    test('HTML5HTMLAPI', 'html5_html_api', 'HTML5HTMLAPI')

    testIterateOverObject(CamelToUnderscore, function(camel, underscore) {
        test(camel, underscore, 'mixed cases')
    });

    testIterateOverObject(CamelToUnderscoreWithoutReverse, function(camel, underscore) {
        test(camel, underscore, 'mixed cases without reverse')
    });
  });


  method('parameterize', function() {

    testIterateOverObject(StringToParameterized, function(str, parameterized) {
        test(str, parameterized, 'basic');
    });

    testIterateOverObject(StringToParameterizedAndNormalized, function(str, parameterized) {
        test(str, parameterized, 'normalized');
    });

    testIterateOverObject(StringToParameterizeWithUnderscore, function(str, parameterized) {
        test(str, ['_'], parameterized, 'with underscore');
    });

    testIterateOverObject(StringToParameterized, function(str, parameterized) {
        test(str, ['__sep__'], parameterized.replace(/-/g, '__sep__'), 'with separator');
    });
  });

  method('toAscii', function() {
    test('à', 'a', 'a');
    test('cañon', 'canon', 'cañon');
    test('Jørgen Kastholm', 'Jorgen Kastholm', 'Jørgen Kastholm');
    test('Bodil Kjær', 'Bodil Kjaer', 'Bodil Kjær');
  });


  method('humanize', function() {

    testIterateOverObject(UnderscoreToHuman, function(under, human) {
        test(under, human, 'underscore')
    });

    Sugar.String.Inflector.human(/_cnt$/i, '_count');
    Sugar.String.Inflector.human(/^prefx_/i, '')

    test('jargon_cnt', 'Jargon count', 'Jargon count')
    test('prefx_request', 'Request', 'Request')

    Sugar.String.Inflector.human("col_rpted_bugs", "Reported bugs")

    test('col_rpted_bugs', 'Reported bugs', 'Reported bugs')
    test('COL_rpted_bugs', 'Col rpted bugs', 'Col rpted bugs')

  });

  method('dasherize', function() {

    testIterateOverObject(UnderscoresToDashes, function(under, dasherized) {
        test(under, dasherized, 'basic')
    });

    testIterateOverObject(UnderscoresToDashes, function(under, dasherized) {
        equal(run(run(under, 'dasherize'), 'underscore'), under, 'reverse')
    });

  });

  method('pluralize', function() {

    // More irregulars
    test('street', 'streets', 'String.Inflector | street > streets');

    // Test clearing inflectors KEEP ME AT THE BOTTOM
    test('foo', 'foos', 'String.Inflector.clear | foo is foos');
    Sugar.String.Inflector.clear('plurals');
    test('foo', 'foo', 'String.Inflector.clear | clear purals');
    equal(run('foos', 'singularize'), 'foo', 'String.Inflector.clear | singulars are not cleared');
    Sugar.String.Inflector.plural(/$/, 's');
    test('foo', 'foos', 'String.Inflector.plural | re-add');
    Sugar.String.Inflector.clear('all');
    test('foo', 'foo', 'String.Inflector.plural | clear all with "all"');
    Sugar.String.Inflector.plural(/$/, 's');
    test('foo', 'foos', 'String.Inflector.plural | re-add again');
    Sugar.String.Inflector.clear();
    test('foo', 'foo', 'String.Inflector.plural | clear all with undefined');

  });

});
