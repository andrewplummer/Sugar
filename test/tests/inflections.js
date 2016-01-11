package('String | Inflections', function () {

  // Skipping strict mode here as testing
  // malformed utf-8 is part of these tests.

  var SingularToPlural = {
    'search'      : 'searches',
    'switch'      : 'switches',
    'fix'         : 'fixes',
    'box'         : 'boxes',
    'process'     : 'processes',
    'address'     : 'addresses',
    'case'        : 'cases',
    'stack'       : 'stacks',
    'wish'        : 'wishes',
    'fish'        : 'fish',
    'jeans'       : 'jeans',
    'funky jeans' : 'funky jeans',

    'my money'    : 'my money',

    'category'    : 'categories',
    'query'       : 'queries',
    'ability'     : 'abilities',
    'agency'      : 'agencies',
    'movie'       : 'movies',

    'archive'     : 'archives',

    'index'       : 'indexes',

    'wife'        : 'wives',
    'save'        : 'saves',
    'half'        : 'halves',

    'move'        : 'moves',

    'salesperson' : 'salespeople',
    'person'      : 'people',

    'spokesman'   : 'spokesmen',
    'man'         : 'men',
    'woman'       : 'women',

    'basis'       : 'bases',
    'diagnosis'   : 'diagnoses',
    'diagnosis_a' : 'diagnosis_as',

    'datum'       : 'data',
    'medium'      : 'media',
    'stadium'     : 'stadia',
    'analysis'    : 'analyses',

    'node_child'  : 'node_children',
    'child'       : 'children',

    'experience'  : 'experiences',
    'day'         : 'days',

    'comment'     : 'comments',
    'foobar'      : 'foobars',
    'newsletter'  : 'newsletters',

    'old_news'    : 'old_news',
    'news'        : 'news',

    'series'      : 'series',
    'species'     : 'species',

    'quiz'        : 'quizzes',

    'perspective' : 'perspectives',

    'ox'          : 'oxen',
    'photo'       : 'photos',
    'buffalo'     : 'buffaloes',
    'tomato'      : 'tomatoes',
    'dwarf'       : 'dwarves',
    'elf'         : 'elves',
    'information' : 'information',
    'equipment'   : 'equipment',
    'bus'         : 'buses',
    'status'      : 'statuses',
    'status_code' : 'status_codes',
    'mouse'       : 'mice',

    'louse'       : 'lice',
    'house'       : 'houses',
    'octopus'     : 'octopi',
    'virus'       : 'viruses',
    'alias'       : 'aliases',
    'portfolio'   : 'portfolios',

    'vertex'      : 'vertices',
    'matrix'      : 'matrices',
    'matrix_fu'   : 'matrix_fus',

    'axis'        : 'axes',
    'testis'      : 'testes',
    'crisis'      : 'crises',

    'rice'        : 'rice',
    'shoe'        : 'shoes',

    'horse'       : 'horses',
    'prize'       : 'prizes',
    'edge'        : 'edges',

    'cow'         : 'cows',
    'database'    : 'databases',

    // regression tests against improper inflection regexes
    '|ice'        : '|ices',
    '|ouse'       : '|ouses',


    // Taken from Wikipedia

    'kiss'    : 'kisses',
    'ass'     : 'asses',
    'mess'    : 'messes',
    'fuss'    : 'fusses',
    'phase'   : 'phases',
    'dish'    : 'dishes',
    'massage' : 'massages',
    'witch'   : 'witches',
    'judge'   : 'judges',

    'lap'     : 'laps',
    'cat'     : 'cats',
    'clock'   : 'clocks',
    'cuff'    : 'cuffs',
    'death'   : 'deaths',

    'boy'     : 'boys',
    'girl'    : 'girls',
    'chair'   : 'chairs',

    'hero'    : 'heroes',
    'potato'  : 'potatoes',
    'volcano' : 'volcanoes',

    'cherry'  : 'cherries',
    'lady'    : 'ladies',


    'day'     : 'days',
    'monkey'  : 'monkeys',
    'canto'   : 'cantos',
    'homo'    : 'homos',
    'photo'   : 'photos',
    'zero'    : 'zeros',
    'piano'   : 'pianos',
    'portico' : 'porticos',
    'pro'     : 'pros',
    'quarto'  : 'quartos',
    'kimono'  : 'kimonos',


    'bath'   : 'baths',
    'mouth'  : 'mouths',
    'calf'   : 'calves',
    'leaf'   : 'leaves',
    'knife'  : 'knives',
    'life'   : 'lives',
    'house'  : 'houses',
    'moth'   : 'moths',
    'proof'  : 'proofs',
    'dwarf'  : 'dwarves',
    'hoof'   : 'hooves',
    'elf'    : 'elves',
    'roof'   : 'roofs',

    'aircraft'   : 'aircraft',
    'watercraft' : 'watercraft',
    'spacecraft' : 'spacecraft',
    'hovercraft' : 'hovercraft',

    'information' : 'information',
    'ox'          : 'oxen',
    'child'       : 'children',
    'foot'        : 'feet',
    'goose'       : 'geese',
    'louse'       : 'lice',
    'man'         : 'men',
    'mouse'       : 'mice',
    'tooth'       : 'teeth',
    'woman'       : 'women',
    'alumnus'     : 'alumni',
    'census'      : 'censuses',
    'focus'       : 'foci',
    'radius'      : 'radii',
    'fungus'      : 'fungi',
    'status'      : 'statuses',
    'syllabus'    : 'syllabuses',
    'human'       : 'humans',
    'fetus'       : 'fetuses',
    'genius'      : 'geniuses',
    'cactus'      : 'cacti',
    'deer'        : 'deer',
    'aviatrix'    : 'aviatrices'

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

  var CamelToUnderscore = {
    'Product'               : 'product',
    'SpecialGuest'          : 'special_guest',
    'ApplicationController' : 'application_controller',
    'Area51Controller'      : 'area51_controller'
  }

  var UnderscoreToLowerCamel = {
    'product'                : 'product',
    'special_guest'          : 'specialGuest',
    'application_controller' : 'applicationController',
    'area51_controller'      : 'area51Controller'
  }

  var CamelToUnderscoreWithoutReverse = {
    'HTMLTidy'              : 'html_tidy',
    'HTMLTidyGenerator'     : 'html_tidy_generator',
    'FreeBSD'               : 'free_bsd',
    'HTML'                  : 'html'
  }

  var StringToParameterized = {
    'Donald E. Knuth'                     : 'donald-e-knuth',
    'Random text with *(bad)* characters' : 'random-text-with-bad-characters',
    'Allow_Under_Scores'                  : 'allow_under_scores',
    'Trailing bad characters!@#'          : 'trailing-bad-characters',
    '!@#Leading bad characters'           : 'leading-bad-characters',
    'Squeeze   separators'                : 'squeeze-separators',
    'Test with + sign'                    : 'test-with-sign',
    'Test with malformed utf8 \251'       : 'test-with-malformed-utf8'
  }

  var StringToParameterizeWithNoSeparator = {
    'Donald E. Knuth'                     : 'donaldeknuth',
    'With-some-dashes'                    : 'with-some-dashes',
    'Random text with *(bad)* characters' : 'randomtextwithbadcharacters',
    'Trailing bad characters!@#'          : 'trailingbadcharacters',
    '!@#Leading bad characters'           : 'leadingbadcharacters',
    'Squeeze   separators'                : 'squeezeseparators',
    'Test with + sign'                    : 'testwithsign',
    'Test with malformed utf8 \251'       : 'testwithmalformedutf8'
  }

  var StringToParameterizeWithUnderscore = {
    'Donald E. Knuth'                     : 'donald_e_knuth',
    'Random text with *(bad)* characters' : 'random_text_with_bad_characters',
    'With-some-dashes'                    : 'with-some-dashes',
    'Retain_underscore'                   : 'retain_underscore',
    'Trailing bad characters!@#'          : 'trailing_bad_characters',
    '!@#Leading bad characters'           : 'leading_bad_characters',
    'Squeeze   separators'                : 'squeeze_separators',
    'Test with + sign'                    : 'test_with_sign',
    'Test with malformed utf8 \251'       : 'test_with_malformed_utf8'
  }

  var StringToParameterizedAndNormalized = {
    'Malmö'                               : 'malmo',
    'Garçons'                             : 'garcons',
    'Ops\331'                             : 'opsu',
    'Ærøskøbing'                          : 'aeroskobing',
    'Aßlar'                               : 'asslar',
    'Japanese: 日本語'                    : 'japanese'
  }

  var UnderscoreToHuman = {
    'employee_salary' : 'Employee salary',
    'employee_id'     : 'Employee',
    'underground'     : 'Underground'
  }

  teardown(function() {
    Sugar.String.Inflector.reset();
  });

  method('pluralize', function() {
    // Test pluralize plurals
    test('plurals', 'plurals', 'plurals')
    test('Plurals', 'Plurals', 'Plurals')
    test('', '', 'empty string');
  });


  group('Uncountables', function() {
    // Test uncountability of words
    Uncountables.forEach(function(word) {
      equal(run(word, 'singularize'), word, 'singularize | uncountables');
      equal(run(word, 'pluralize'), word, 'pluralize | uncountables');
      equal(run(word, 'singularize'), run(word, 'pluralize'), 'singularize | uncountables | same as pluralize');
    });
  });

  method('singularize', function() {

    var uncountable = 'ors';
    var countable = 'sponsor';

    Sugar.String.Inflector.uncountable(uncountable);

    test(uncountable, uncountable, 'singularize | uncountable | ors');
    test(countable, 'sponsor', 'singularize | countable | sponsor');

    // Test singularize plural
    testIterateOverObject(SingularToPlural, function(singular, plural) {
      test(plural, singular, 'singularize | plural > singular');
    });

    // Test singularize singular
    testIterateOverObject(SingularToPlural, function(singular, plural) {
      equal(singular, singular, 'singular > singular');
    });


  });

  method('pluralize', function() {
    var uncountable = 'ors';
    var countable = 'sponsor';

    Sugar.String.Inflector.uncountable(uncountable);

    test(uncountable, run(uncountable, 'singularize'), 'singularize | uncountable | both are same');

    test(countable, 'sponsors', 'pluralize | countable | sponsors');
    equal(run(run(countable, 'pluralize'), 'singularize'), 'sponsor', 'pluralize | countable | both are same');

    // Test pluralize singular
    testIterateOverObject(SingularToPlural, function(singular, plural) {
      test(singular, plural, 'pluralize | singular > plural');
    });

    // Test pluralize plural
    testIterateOverObject(SingularToPlural, function(singular, plural) {
      test(plural, plural, 'plural > plural');
    });

  });

  group('Overwrite previous inflectors', function() {
    equal(run('series', 'singularize'), 'series', 'singularize | series');
    Sugar.String.Inflector.singular('series', 'serie');
    equal(run('series', 'singularize'), 'serie', 'singularize | serie');
    Sugar.String.Inflector.singular('series'); // Return to normal
  });

  group('Irregulars', function() {
    testIterateOverObject(Irregulars, function(singular, plural) {
      equal(run(plural, 'singularize'), singular, 'singularize | irregulars');
      equal(run(singular, 'pluralize'), plural, 'pluralize | irregulars | pluralized singular is plural');
    });

    testIterateOverObject(Irregulars, function(singular, plural) {
      equal(run(plural, 'pluralize'), plural, 'singularize | irregulars | pluralized plural id pluralized');
    });
  });

  group('Custom Irregulars', function() {
    Sugar.String.Inflector.irregular('wasabi', 'meecrab');
    equal(run('wasabi', 'pluralize'), 'meecrab', 'custom singular -> plural');
    equal(run('meecrab', 'singularize'), 'wasabi', 'custom plural -> singular');
  });

  group('Acronyms', function() {

    Sugar.String.Inflector.acronym('API');
    Sugar.String.Inflector.acronym('HTML');
    Sugar.String.Inflector.acronym('HTTP');
    Sugar.String.Inflector.acronym('RESTful');
    Sugar.String.Inflector.acronym('W3C');
    Sugar.String.Inflector.acronym('PhD');
    Sugar.String.Inflector.acronym('RoR');
    Sugar.String.Inflector.acronym('SSL');

    // camelize             underscore            humanize              titleize
    [
      ['API',               'api',                'API',                'API'],
      ['APIController',     'api_controller',     'API controller',     'API Controller'],

      // Ruby specific inflections don't make sense here.
      // ['Nokogiri::HTML',    'nokogiri/html',      'Nokogiri/HTML',      'Nokogiri/HTML'],
      // ['HTTP::Get',         'http/get',           'HTTP/get',           'HTTP/Get'],

      ['HTTPAPI',           'http_api',           'HTTP API',           'HTTP API'],
      ['SSLError',          'ssl_error',          'SSL error',          'SSL Error'],
      ['RESTful',           'restful',            'RESTful',            'RESTful'],
      ['RESTfulController', 'restful_controller', 'RESTful controller', 'RESTful Controller'],
      ['IHeartW3C',         'i_heart_w3c',        'I heart W3C',        'I Heart W3C'],
      ['PhDRequired',       'phd_required',       'PhD required',       'PhD Required'],
      ['IRoRU',             'i_ror_u',            'I RoR u',            'I RoR U'],
      ['RESTfulHTTPAPI',    'restful_http_api',   'RESTful HTTP API',   'RESTful HTTP API'],

      // misdirection
      ['Capistrano',        'capistrano',         'Capistrano',       'Capistrano'],
      ['CapiController',    'capi_controller',    'Capi controller',  'Capi Controller'],
      ['HttpsApis',         'https_apis',         'Https apis',       'Https Apis'],
      ['Html5',             'html5',              'Html5',            'Html5'],
      ['Restfully',         'restfully',          'Restfully',        'Restfully']
      // This one confounds the JS implementation, but I argue that it isn't correct anyway.
      // ['RoRails',           'ro_rails',           'Ro rails',         'Ro Rails']
    ].forEach(function(set) {
      var camel = set[0], under = set[1], human = set[2], title = set[3];
      equal(run(under, 'humanize'), human, 'humanize | under.humanize()')

      withMethod('camelize', function() {
        test(under, camel, 'camelize | under.camelize()')
        test(camel, camel, 'camelize | camel.camelize()')
      });

      withMethod('underscore', function() {
        test(under, under, 'underscore | under.underscore()')
        test(camel, under, 'underscore | camel.underscore()')
      });

      withMethod('titleize', function() {
        test(under, title, 'titleize | under.titleize()')
        test(camel, title, 'titleize | camel.titleize()')
      });

    });

    withMethod('camelize', function() {

      Sugar.String.Inflector.acronym('API');
      Sugar.String.Inflector.acronym('HTML');
      testIterateOverObject(CamelToUnderscore, function(camel, underscore) {
        test(underscore, camel, 'mixed cases')
      });
      test('Camel_Case', 'CamelCase', 'handles underscores');

      Sugar.String.Inflector.acronym('LegacyApi')
      test('legacyapi', 'LegacyApi', 'LegacyApi')
      test('legacy_api', 'LegacyAPI', 'LegacyAPI')
      test('some_legacyapi', 'SomeLegacyApi', 'SomeLegacyApi')
      test('nonlegacyapi', 'Nonlegacyapi', 'Nonlegacyapi')

      withArgs([false], function() {
        test('html_api', 'htmlAPI', 'html_api')
        test('htmlAPI', 'htmlAPI', 'htmlAPI')
        test('HTMLAPI', 'htmlAPI', 'HTMLAPI')
        testIterateOverObject(UnderscoreToLowerCamel, function(under, lowerCamel) {
          // Sugar differs from ActiveSupport here in that the first character is upcased by default
          test(under, lowerCamel, 'lower camel')
        });
        test('Capital', 'capital', 'downcases the first letter');
      });

    });

    withMethod('underscore', function() {

      // Make sure this test doesn't come before "camelize",
      // or it will affect the "html5" acronym which should not be active at that point.

      Sugar.String.Inflector.acronym('HTML5');
      Sugar.String.Inflector.acronym('API');

      test('HTML5HTMLAPI', 'html5_html_api', 'HTML5HTMLAPI')
      testIterateOverObject(CamelToUnderscore, function(camel, underscore) {
          test(camel, underscore, 'mixed cases')
      });
      testIterateOverObject(CamelToUnderscoreWithoutReverse, function(camel, underscore) {
          test(camel, underscore, 'mixed cases without reverse')
      });

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

    Sugar.String.Inflector.human('col_rpted_bugs', 'Reported bugs')

    test('col_rpted_bugs', 'Reported bugs', 'Reported bugs')
    test('COL_rpted_bugs', 'Col rpted bugs', 'Col rpted bugs')

  });

  method('pluralize', function() {

    // Testing optional number argument first.
    test('person', [0], 'people', 'person with 0');
    test('sponsor', [0], 'sponsors', 'sponsor with 0');
    test('person', [0], 'people', 'person with 0');
    test('sponsor', [0], 'sponsors', 'sponsor with 0');
    test('person', [1], 'person', 'person with 1');
    test('sponsor', [1], 'sponsor', 'sponsor with 1');
    test('person', [2], 'people', 'person with 2');
    test('sponsor', [2], 'sponsors', 'sponsor with 2');
    test('person', [999], 'people', 'person with 999');
    test('sponsor', [999], 'sponsors', 'sponsor with 999');

    // Irregulars
    test('person', [-1], 'people', 'person with -1');
    test('person', [-Infinity], 'people', 'person with Infinity');
    test('person', [Infinity], 'people', 'person with -Infinity');
    test('person', [NaN], 'people', 'person with NaN');
    test('person', [null], 'people', 'person with null');
    test('person', [undefined], 'people', 'person with undefined');

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
