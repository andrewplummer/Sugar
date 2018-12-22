namespace('String | Inflections', function () {

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

  var UnderscoreToHuman = {
    'employee_salary' : 'Employee salary',
    'employee_id'     : 'Employee',
    'underground'     : 'Underground'
  }

  group('Accessors', function() {
    equal(String.addAcronym, undefined, 'addAcronym should never be extended');
    equal(String.addPlural, undefined, 'addPlural should never be extended');
    equal(String.addHuman, undefined, 'addHuman should never be extended');
  });

  group('Acronyms', function() {

    Sugar.String.addAcronym('API');
    Sugar.String.addAcronym('HTML');
    Sugar.String.addAcronym('HTTP');
    Sugar.String.addAcronym('HTTPS');
    Sugar.String.addAcronym('W3C');
    Sugar.String.addAcronym('PhD');
    Sugar.String.addAcronym('RoR');
    Sugar.String.addAcronym('SSL');
    Sugar.String.addAcronym('RESTful');

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
      ['HTTPSApis',         'https_apis',         'HTTPS apis',       'HTTPS Apis'],
      ['Html5',             'html5',              'Html5',            'Html5'],
      ['Restfully',         'restfully',          'Restfully',        'Restfully']
      // This one confounds the JS implementation, but I argue that it isn't correct anyway.
      // ['RoRails',           'ro_rails',           'Ro rails',         'Ro Rails']

    ].forEach(function(set) {
      var camel = set[0], under = set[1], human = set[2], title = set[3];
      equal(run(under, 'humanize'), human, 'humanize | under')

      withMethod('camelize', function() {
        test(under, camel, 'camelize | under')
        test(camel, camel, 'camelize | camel')
      });

      withMethod('underscore', function() {
        test(under, under, 'underscore | under')
        test(camel, under, 'underscore | camel')
      });

      withMethod('titleize', function() {
        test(under, title, 'titleize | under')
        test(camel, title, 'titleize | camel')
      });

    });

    withMethod('camelize', function() {

      testIterateOverObject(CamelToUnderscore, function(camel, underscore) {
        test(underscore, camel, 'mixed cases')
      });
      test('Camel_Case', 'CamelCase', 'handles underscores');

      Sugar.String.addAcronym('LegacyApi');

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

      Sugar.String.addAcronym('HTML5');

      test('HTML5HTMLAPI', 'html5_html_api', 'HTML5HTMLAPI')
      testIterateOverObject(CamelToUnderscore, function(camel, underscore) {
          test(camel, underscore, 'mixed cases')
      });
      testIterateOverObject(CamelToUnderscoreWithoutReverse, function(camel, underscore) {
          test(camel, underscore, 'mixed cases without reverse')
      });

    });

  });

  method('humanize', function() {

    testIterateOverObject(UnderscoreToHuman, function(under, human) {
        test(under, human, 'underscore')
    });

    Sugar.String.addHuman('cnt', 'count');
    Sugar.String.addHuman('col', 'column');
    Sugar.String.addHuman(/^prefx_/i, '');

    test('jargon_cnt', 'Jargon count', 'Jargon count')
    test('prefx_request', 'Request', 'Request')

    withMethod('titleize', function() {
      test('col_cnt', 'Column Count', 'titleized')
    });

  });

  method('pluralize', function() {

    if (canTestPrimitiveScope) {
      test(null, 'nulls', 'null');
      test(undefined, 'undefineds', 'null');
    }

    test('', '', 'blank string');
    test(' ', ' s', 'space');
    test('  ', '  s', 'double space');
    test('\n', '\ns', 'newline');
    test(8, '8s', 'number');
    test(true, 'trues', 'boolean');
    test(NaN, 'NaNs', 'NaN');

    test('person', 'people', 'person');
    test('sheep', 'sheep', 'sheep');

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

    // Test pluralize "plurals"
    test('plurals', 'plurals', 'plurals')
    test('Plurals', 'Plurals', 'Plurals')
    test('', '', 'empty string');

    // Test pluralize singular
    testIterateOverObject(SingularToPlural, function(singular, plural) {
      test(singular, plural, 'pluralize | singular > plural');
    });

    // Test pluralize plural
    testIterateOverObject(SingularToPlural, function(singular, plural) {
      test(plural, plural, 'plural > plural');
    });

  });

  method('singularize', function() {

    if (canTestPrimitiveScope) {
      test(null, 'null', 'null');
      test(undefined, 'undefined', 'null');
    }

    test('', '', 'blank string');
    test(' ', ' ', 'space');
    test('  ', '  ', 'double space');
    test('\n', '\n', 'newline');
    test(8, '8', 'number');
    test(true, 'true', 'boolean');
    test(NaN, 'NaN', 'NaN');

    test('people', 'person', 'person');
    test('sheep', 'sheep', 'sheep');

    var uncountable = 'ors';
    var countable = 'sponsor';

    Sugar.String.addPlural(uncountable);

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

  group('Uncountables', function() {
    // Test uncountability of words
    Uncountables.forEach(function(word) {
      equal(run(word, 'singularize'), word, 'singularize | uncountables');
      equal(run(word, 'pluralize'), word, 'pluralize | uncountables');
      equal(run(word, 'singularize'), run(word, 'pluralize'), 'singularize | uncountables | same as pluralize');
    });

    var uncountable = 'ors';
    var countable = 'sponsor';

    Sugar.String.addPlural(uncountable);

    equal(run(run(uncountable, 'pluralize'), 'singularize'), 'ors', 'uncountable > plural > singular');

    equal(run(countable, 'pluralize'), 'sponsors', 'countable is not affected');
    equal(run(run(countable, 'pluralize'), 'singularize'), 'sponsor', 'countable > plural > singular');

  });

  group('Override previous inflectors', function() {

    equal(run('series', 'singularize'), 'series', 'singularize | series');
    Sugar.String.addPlural('serie', 'series');
    equal(run('series', 'singularize'), 'serie', 'singularize | serie');

  });

  group('Irregulars', function() {

    testIterateOverObject(Irregulars, function(singular, plural) {
      equal(run(plural, 'singularize'), singular, 'singularize | irregulars');
      equal(run(singular, 'pluralize'), plural, 'pluralize | irregulars | pluralized singular is plural');
    });

    testIterateOverObject(Irregulars, function(singular, plural) {
      equal(run(plural, 'pluralize'), plural, 'singularize | irregulars | pluralized plural id pluralized');
    });

    Sugar.String.addPlural('wasabi', 'meecrab');
    equal(run('wasabi', 'pluralize'), 'meecrab', 'custom singular -> plural');
    equal(run('meecrab', 'singularize'), 'wasabi', 'custom plural -> singular');

  });

});
