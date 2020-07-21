'use strict';

namespace('String', function() {

  describeStatic('range', function(range) {

    it('#toString', function() {
      assertEqual(range('a', 'z').toString(), 'a..z');
      assertEqual(range('a', null).toString(), 'Invalid Range');
    });

    it('#isValid', function() {
      assertTrue(range('a', 'z').isValid());
      assertTrue(range('z', 'a').isValid());
      assertTrue(range('a', 'a').isValid());
      assertTrue(range('🍺', '🎅').isValid());
      assertTrue(range(' ', ' ').isValid());
      assertFalse(range('a', null).isValid());
      assertFalse(range(null, 'a').isValid());
      assertFalse(range('a', '').isValid());
      assertFalse(range('', 'z').isValid());
      assertFalse(range('ab', 'yz').isValid());
      assertFalse(range('ab', 'z').isValid());
      assertFalse(range('a', 'yz').isValid());
    });

    it('#span', function() {
      assertEqual(range('a', 'z').span(), 26);
      assertEqual(range('z', 'a').span(), 26);
      assertEqual(range('a', 'a').span(), 1);
      assertNaN(range('', '').span());
    });

    it('#toArray', function() {
      assertArrayEqual(range('a', 'd').toArray(), ['a','b','c','d']);
      assertArrayEqual(range('d', 'a').toArray(), ['d','c','b','a']);
      assertArrayEqual(range('', 'd').toArray(), []);
      assertArrayEqual(range('d', '').toArray(), []);
    });

    it('#clone', function() {
      assertEqual(range('a','z').clone().toString(), 'a..z');
    });

    it('#clamp', function() {
      assertEqual(range('c','d').clamp('z'), 'd');
      assertEqual(range('c','d').clamp('a'), 'c');
      assertEqual(range('d','c').clamp('z'), 'd');
      assertEqual(range('d','c').clamp('a'), 'c');
    });

    it('#contains', function() {
      assertTrue(range('b', 'f').contains(range('b', 'd')));
      assertTrue(range('b', 'f').contains(range('b', 'b')));
      assertTrue(range('b', 'f').contains(range('f', 'f')));
      assertTrue(range('b', 'f').contains(range('f', 'e')));
      assertFalse(range('b', 'f').contains(range('g', 'h')));
      assertFalse(range('b', 'f').contains(range('a', 'b')));
      assertFalse(range('b', 'f').contains(range('a', 'c')));
      assertFalse(range('b', 'f').contains(range('c', 'a')));
      assertFalse(range('b', 'f').contains(range('d', 'g')));
      assertFalse(range('b', 'f').contains(range('g', 'd')));
      assertFalse(range('b', 'f').contains(range('a', 'g')));
    });

    it('#every', function() {
      assertArrayEqual(range('a', 'd').every(1), ['a','b','c','d']);
      assertArrayEqual(range('a', 'd').every(2), ['a','c']);
      assertArrayEqual(range('a', 'd').every(2, concatA), ['aA','cA']);
      assertArrayEqual(range('a', 'b').every(1, args), [['a',0], ['b',1]]);
    });

    it('#intersect', function() {
      assertEqual(range('b','d').intersect(range('c','g')).toString(), 'c..d');
      assertEqual(range('b','d').intersect(range('g','c')).toString(), 'c..d');
      assertEqual(range('b','d').intersect(range('a','c')).toString(), 'b..c');
      assertEqual(range('b','d').intersect(range('c','a')).toString(), 'b..c');
      assertEqual(range('d','b').intersect(range('c','g')).toString(), 'c..d');
      assertEqual(range('d','b').intersect(range('g','c')).toString(), 'c..d');
      assertEqual(range('d','b').intersect(range('a','c')).toString(), 'b..c');
      assertEqual(range('d','b').intersect(range('c','a')).toString(), 'b..c');

      assertEqual(range('a','c').intersect(range('d','f')).toString(), 'Invalid Range');
      assertEqual(range('a','c').intersect(range('','')).toString(), 'Invalid Range');
      assertEqual(range('','').intersect(range('d','f')).toString(), 'Invalid Range');
    });

    it('#union', function() {
      assertEqual(range('b','d').union(range('c','f')).toString(), 'b..f');
      assertEqual(range('b','d').union(range('f','c')).toString(), 'b..f');
      assertEqual(range('b','d').union(range('a','c')).toString(), 'a..d');
      assertEqual(range('b','d').union(range('c','a')).toString(), 'a..d');
      assertEqual(range('d','b').union(range('c','f')).toString(), 'b..f');
      assertEqual(range('d','b').union(range('f','c')).toString(), 'b..f');
      assertEqual(range('d','b').union(range('a','c')).toString(), 'a..d');
      assertEqual(range('d','b').union(range('c','a')).toString(), 'a..d');

      assertEqual(range('a','c').union(range('','')).toString(), 'Invalid Range');
      assertEqual(range('','').union(range('a','c')).toString(), 'Invalid Range');
    });

  });

  describeInstance('capitalize', function(capitalize) {

    it('should capitalize basic latin characters', function() {
      assertEqual(capitalize('wasabi'), 'Wasabi');
      assertEqual(capitalize('Wasabi'), 'Wasabi');
      assertEqual(capitalize('WASABI'), 'WASABI');
      assertEqual(capitalize('WasAbI'), 'WasAbI');
      assertEqual(capitalize('wasabi sandwich'), 'Wasabi sandwich');
      assertEqual(capitalize('WASABI SANDWICH'), 'WASABI SANDWICH');
      assertEqual(capitalize("wasabi's SANDWICH"), "Wasabi's SANDWICH");
      assertEqual(capitalize(''), '');
    });

    it('should force lower case', function() {
      assertEqual(capitalize('wasabi', true), 'Wasabi');
      assertEqual(capitalize('Wasabi', true), 'Wasabi');
      assertEqual(capitalize('WASABI', true), 'Wasabi');
      assertEqual(capitalize('WasAbI', true), 'Wasabi');
      assertEqual(capitalize('wasabi sandwich', true), 'Wasabi sandwich');
      assertEqual(capitalize('WASABI SANDWICH', true), 'Wasabi sandwich');
      assertEqual(capitalize("wasabi's SANDWICH", true), "Wasabi's sandwich");
      assertEqual(capitalize("wasabis' SANDWICH", true), "Wasabis' sandwich");
      assertEqual(capitalize('reuben sandwich', true), 'Reuben sandwich');
      assertEqual(capitalize('фыва йцук', true), 'Фыва йцук');
    });

    it('should work on all words', function() {
      assertEqual(capitalize('wasabi', false, true), 'Wasabi');
      assertEqual(capitalize('Wasabi', false, true), 'Wasabi');
      assertEqual(capitalize('WASABI', false, true), 'WASABI');
      assertEqual(capitalize('WasAbI', false, true), 'WasAbI');
      assertEqual(capitalize('wasabi sandwich', false, true), 'Wasabi Sandwich');
      assertEqual(capitalize('WASABI SANDWICH', false, true), 'WASABI SANDWICH');
      assertEqual(capitalize("wasabi's SANDWICH", false, true), "Wasabi's SANDWICH");
      assertEqual(capitalize("'you' and 'me'", false, true), "'You' And 'Me'");
    });

    it('should downcase with all words', function() {
      assertEqual(capitalize('wasabi', true, true), 'Wasabi');
      assertEqual(capitalize('Wasabi', true, true), 'Wasabi');
      assertEqual(capitalize('WASABI', true, true), 'Wasabi');
      assertEqual(capitalize('WasAbI', true, true), 'Wasabi');
      assertEqual(capitalize('wasabi sandwich', true, true), 'Wasabi Sandwich');
      assertEqual(capitalize('WASABI SANDWICH', true, true), 'Wasabi Sandwich');
      assertEqual(capitalize("wasabi's SANDWICH", true, true), "Wasabi's Sandwich");

      assertEqual(capitalize('reuben-sandwich', true, true), 'Reuben-Sandwich');
      assertEqual(capitalize('reuben(sandwich)', true, true), 'Reuben(Sandwich)');
      assertEqual(capitalize('reuben,sandwich', true, true), 'Reuben,Sandwich');
      assertEqual(capitalize('reuben;sandwich', true, true), 'Reuben;Sandwich');
      assertEqual(capitalize('reuben.sandwich', true, true), 'Reuben.Sandwich');
      assertEqual(capitalize('reuben_sandwich', true, true), 'Reuben_Sandwich');
      assertEqual(capitalize('reuben\nsandwich', true, true), 'Reuben\nSandwich');
      assertEqual(capitalize("reuben's sandwich", true, true), "Reuben's Sandwich");

      assertEqual(capitalize('фыва-йцук', true, true), 'Фыва-Йцук');
      assertEqual(capitalize('фыва,йцук', true, true), 'Фыва,Йцук');
      assertEqual(capitalize('фыва;йцук', true, true), 'Фыва;Йцук');
      assertEqual(capitalize('фыва7йцук', true, true), 'Фыва7Йцук');

      assertEqual(capitalize('what a shame of a title', true, true), 'What A Shame Of A Title');
      assertEqual(capitalize('What A Shame Of A Title', true, true), 'What A Shame Of A Title');
      assertEqual(capitalize(' what a shame of a title    ', true, true), ' What A Shame Of A Title    ');
      assertEqual(capitalize(' what a shame of\n a title    ', true, true), ' What A Shame Of\n A Title    ');
    });

  });

  describeInstance('pad', function(pad) {

    it('should pad even length string to exact length', function() {
      assertEqual(pad('wasabi', 0), 'wasabi');
      assertEqual(pad('wasabi', 1), 'wasabi');
      assertEqual(pad('wasabi', 2), 'wasabi');
      assertEqual(pad('wasabi', 3), 'wasabi');
      assertEqual(pad('wasabi', 4), 'wasabi');
      assertEqual(pad('wasabi', 5), 'wasabi');
      assertEqual(pad('wasabi', 6), 'wasabi');
      assertEqual(pad('wasabi', 7), 'wasabi');
      assertEqual(pad('wasabi', 8), ' wasabi ');
      assertEqual(pad('wasabi', 9), ' wasabi ');
      assertEqual(pad('wasabi', 10), '  wasabi  ');
      assertEqual(pad('wasabi', 12), '   wasabi   ');
      assertEqual(pad('wasabi', 20), '       wasabi       ');
    });

    it('should pad odd length string to target length + 1', function() {
      assertEqual(pad('hello', 0), 'hello');
      assertEqual(pad('hello', 1), 'hello');
      assertEqual(pad('hello', 2), 'hello');
      assertEqual(pad('hello', 3), 'hello');
      assertEqual(pad('hello', 4), 'hello');
      assertEqual(pad('hello', 5), 'hello');
      assertEqual(pad('hello', 6), 'hello');
      assertEqual(pad('hello', 7), ' hello ');
      assertEqual(pad('hello', 8), ' hello ');
      assertEqual(pad('hello', 9), '  hello  ');
      assertEqual(pad('hello', 10), '  hello  ');
      assertEqual(pad('hello', 12), '   hello   ');
      assertEqual(pad('hello', 20), '       hello       ');
    });

    it('should pad with custom string', function() {
      assertEqual(pad('wasabi', 8, '"'), '"wasabi"');
      assertEqual(pad('wasabi', 8, ''), 'wasabi');
      assertEqual(pad('wasabi', 8, 's'), 'swasabis');
      assertEqual(pad('wasabi', 8, 5), '5wasabi5');
      assertEqual(pad('wasabi', 12, '-'), '---wasabi---');
      assertEqual(pad('hello', 12, '-'), '---hello---');
    });

    it('should pad with non-standard arguments', function() {
      assertEqual(pad('wasabi'), 'wasabi');
      assertEqual(pad('wasabi', undefined), 'wasabi');
      assertEqual(pad('wasabi', null), 'wasabi');
      assertEqual(pad('wasabi', NaN), 'wasabi');

      assertEqual(pad('', false), '');
      assertEqual(pad('', true), '');
    });

    it('should not throw equivalent errors to padStart/padEnd', function() {
      assertNoError(function(){ pad('wasabi', -1); });
      assertNoError(function(){ pad('wasabi', -Infinity); });
      assertError(function(){ pad('wasabi',  Infinity); });
    });

  });

  describeInstance('truncate', function(truncate) {
    var str = 'Gotta be an entire sentence.';

    it('should truncate to a specific length', function() {
      assertEqual(truncate(str, 29), 'Gotta be an entire sentence.');
      assertEqual(truncate(str, 28), 'Gotta be an entire sentence.');
      assertEqual(truncate(str, 21), 'Gotta be an entire se...');
      assertEqual(truncate(str, 20), 'Gotta be an entire s...');
      assertEqual(truncate(str, 14), 'Gotta be an en...');
      assertEqual(truncate(str, 13), 'Gotta be an e...');
      assertEqual(truncate(str, 11), 'Gotta be an...');
      assertEqual(truncate(str, 10), 'Gotta be a...');
      assertEqual(truncate(str, 4), 'Gott...');
      assertEqual(truncate(str, 3), 'Got...');
      assertEqual(truncate(str, 2), 'Go...');
      assertEqual(truncate(str, 1), 'G...');
      assertEqual(truncate(str, 0), '...');
    });

    it('should truncate from the left', function() {
      assertEqual(truncate(str, 21, 'left'), '...e an entire sentence.');
      assertEqual(truncate(str, 11, 'left'), '...e sentence.');
      assertEqual(truncate(str, 9, 'left'), '...sentence.');
      assertEqual(truncate(str, 4, 'left'), '...nce.');
      assertEqual(truncate(str, 3, 'left'), '...ce.');
      assertEqual(truncate(str, 2, 'left'), '...e.');
      assertEqual(truncate(str, 0, 'left'), '...');
      assertEqual(truncate(str, -100, 'left'), '...');
    });

    it('should should truncate from the middle', function() {
      assertEqual(truncate(str, 21, 'middle'), 'Gotta be an... sentence.');
      assertEqual(truncate(str, 11, 'middle'), 'Gotta ...ence.');
      assertEqual(truncate(str, 4, 'middle'), 'Go...e.');
      assertEqual(truncate(str, 3, 'middle'), 'Go....');
      assertEqual(truncate(str, 2, 'middle'), 'G....');
      assertEqual(truncate(str, 0, 'middle'), '...');
      assertEqual(truncate(str, -100, 'middle'), '...');
    });

    it('should allow a custom ellipsis', function() {
      assertEqual(truncate('string to truncate', 10, 'right', '|'), 'string to |');
      assertEqual(truncate('string to truncate', 10, 'right', 0), 'string to 0');
      assertEqual(truncate(str, 28, 'left', '>>> '), 'Gotta be an entire sentence.');
      assertEqual(truncate(str, 23, 'left', '>>> '), '>>>  be an entire sentence.');
      assertEqual(truncate(str, 5, 'left', '>>> '), '>>> ence.');
      assertEqual(truncate(str, 4, 'left', '>>> '), '>>> nce.');
      assertEqual(truncate(str, 3, 'middle', '-'), 'Go-.');
      assertEqual(truncate('123456', 2, 'left'), '...56');
      assertEqual(truncate('123456', 2, 'middle'), '1...6');
      assertEqual(truncate('123456', 2), '12...');
    });

    it('should handle irregular input', function() {
      assertEqual(truncate(500, 2), '50...');
      assertEqual(truncate('short sentence', -1), '...');
      assertEqual(truncate('short sentence', 8, 'bad input'), 'short se...');
      assertEqual(truncate('short sentence', 8, 'right', 8), 'short se8');
      assertEqual(truncate('short sentence', 8, 'right', ''), 'short se');
      assertEqual(truncate('short sentence', 8, 'right', null), 'short senull');
      assertEqual(truncate('short sentence', 8, 'right', undefined), 'short se...');
      assertError(function(){ truncate('word', 'bad input'); });
    });

  });

  describeInstance('truncateOnWord', function(truncateOnWord) {
    var str = 'Gotta be an entire sentence.';

    it('should truncate to a specific length', function() {
      assertEqual(truncateOnWord(str, 100), 'Gotta be an entire sentence.');
      assertEqual(truncateOnWord(str, 28), 'Gotta be an entire sentence.');
      assertEqual(truncateOnWord(str, 27), 'Gotta be an entire...');
      assertEqual(truncateOnWord(str, 21), 'Gotta be an entire...');
      assertEqual(truncateOnWord(str, 20), 'Gotta be an entire...');
      assertEqual(truncateOnWord(str, 19), 'Gotta be an entire...');
      assertEqual(truncateOnWord(str, 18), 'Gotta be an entire...');
      assertEqual(truncateOnWord(str, 17), 'Gotta be an...');
      assertEqual(truncateOnWord(str, 14), 'Gotta be an...');
      assertEqual(truncateOnWord(str, 13), 'Gotta be an...');
      assertEqual(truncateOnWord(str, 11), 'Gotta be an...');
      assertEqual(truncateOnWord(str, 10), 'Gotta be...');
      assertEqual(truncateOnWord(str,  4), 'Gott...');
      assertEqual(truncateOnWord(str,  3), 'Got...');
      assertEqual(truncateOnWord(str,  2), 'Go...');
      assertEqual(truncateOnWord(str,  1), 'G...');
      assertEqual(truncateOnWord(str,  0), '...');
    });

    it('should truncate from left', function() {
      assertEqual(truncateOnWord(str, 21, 'left'), '...an entire sentence.');
      assertEqual(truncateOnWord(str, 20, 'left'), '...an entire sentence.');
      assertEqual(truncateOnWord(str, 19, 'left'), '...an entire sentence.');
      assertEqual(truncateOnWord(str, 18, 'left'), '...entire sentence.');
      assertEqual(truncateOnWord(str, 17, 'left'), '...entire sentence.');
      assertEqual(truncateOnWord(str, 14, 'left'), '...sentence.');
      assertEqual(truncateOnWord(str, 13, 'left'), '...sentence.');
      assertEqual(truncateOnWord(str, 11, 'left'), '...sentence.');
      assertEqual(truncateOnWord(str, 10, 'left'), '...sentence.');
      assertEqual(truncateOnWord(str,  9, 'left'), '...sentence.');
      assertEqual(truncateOnWord(str,  8, 'left'), '...entence.');
      assertEqual(truncateOnWord(str,  4, 'left'), '...nce.');
      assertEqual(truncateOnWord(str,  3, 'left'), '...ce.');
      assertEqual(truncateOnWord(str,  2, 'left'), '...e.');
      assertEqual(truncateOnWord(str,  1, 'left'), '....');
      assertEqual(truncateOnWord(str,  0, 'left'), '...');
    });

    it('should truncate from the middle', function() {
      assertEqual(truncateOnWord(str, 21, 'middle'), 'Gotta be...sentence.');
      assertEqual(truncateOnWord(str, 20, 'middle'), 'Gotta be...sentence.');
      assertEqual(truncateOnWord(str, 19, 'middle'), 'Gotta be...sentence.');
      assertEqual(truncateOnWord(str, 18, 'middle'), 'Gotta be...sentence.');
      assertEqual(truncateOnWord(str, 17, 'middle'), 'Gotta be...entence.');
      assertEqual(truncateOnWord(str, 14, 'middle'), 'Gotta...ntence.');
      assertEqual(truncateOnWord(str, 13, 'middle'), 'Gotta...tence.');
      assertEqual(truncateOnWord(str, 11, 'middle'), 'Gotta...ence.');
      assertEqual(truncateOnWord(str, 10, 'middle'), 'Gotta...ence.');
      assertEqual(truncateOnWord(str, 9, 'middle'), 'Gott...nce.');
      assertEqual(truncateOnWord(str, 8, 'middle'), 'Gott...nce.');
      assertEqual(truncateOnWord(str, 4, 'middle'), 'Go...e.');
      assertEqual(truncateOnWord(str, 3, 'middle'), 'G....');
      assertEqual(truncateOnWord(str, 2, 'middle'), 'G....');
      assertEqual(truncateOnWord(str, 1, 'middle'), '...');
      assertEqual(truncateOnWord(str, 0, 'middle'), '...');
    });

    it('should should break on non-space punctuation', function() {
      assertEqual(truncateOnWord('a,short,string', 8), 'a,short...');
      assertEqual(truncateOnWord('a|short|string', 8), 'a|short...');
      assertEqual(truncateOnWord('a?short?string', 8), 'a?short...');
      assertEqual(truncateOnWord('a]short]string', 8), 'a]short...');
      assertEqual(truncateOnWord('a¿short¿string', 8), 'a¿short...');
    });

    it('should should break on non-standard whitespace', function() {
      assertEqual(truncateOnWord('a　short　string', 8), 'a　short...');
    });

    it('should handle special cases', function() {
      assertEqual(truncateOnWord('GOTTA BE AN ENTIRE SENTENCE.', 21), 'GOTTA BE AN ENTIRE...');
      assertEqual(truncateOnWord('gotta. be. an. entire. sentence.', 17), 'gotta. be. an....');
    });

    it('should handle non-latin scripts', function() {
      assertEqual(truncateOnWord('한국어 도 이렇게 할 수 있어요?', 9), '한국어 도 이렇게...');
      assertEqual(truncateOnWord('文字列　の　全角　スペース', 12), '文字列　の　全角...');
    });

    it('should handle irregular input', function() {
      assertEqual(truncateOnWord(500, 2), '50...');
      assertEqual(truncateOnWord('short sentence', -1), '...');
      assertEqual(truncateOnWord('short sentence', 8, 'bad input'), 'short...');
      assertEqual(truncateOnWord('short sentence', 8, 'right', 8), 'short8');
      assertEqual(truncateOnWord('short sentence', 8, 'right', ''), 'short');
      assertEqual(truncateOnWord('short sentence', 8, 'right', null), 'shortnull');
      assertEqual(truncateOnWord('short sentence', 8, 'right', undefined), 'short...');
      assertError(function(){ truncateOnWord('word', '8'); });
    });

    it('should handle issues', function() {
      // #311
      assertEqual(truncateOnWord('Alpha Beta Gamma Delta Epsilon', 20, 'middle', ''), 'Alpha BetaEpsilon');
    });

  });

  describeInstance('underscore', function(underscore) {

    it('should handle basic input', function() {
      assertEqual(underscore('hopOnPop'), 'hop_on_pop');
      assertEqual(underscore('HopOnPop'), 'hop_on_pop');
      assertEqual(underscore('HOPONPOP'), 'hoponpop');
      assertEqual(underscore('HOP-ON-POP'), 'hop_on_pop');
      assertEqual(underscore('hop-on-pop'), 'hop_on_pop');
      assertEqual(underscore('watch me fail'), 'watch_me_fail');
      assertEqual(underscore('watch   me   fail'), 'watch_me_fail');
      assertEqual(underscore('watch me fail-sad-face'), 'watch_me_fail_sad_face');
      assertEqual(underscore('waTch me su-cCeed'), 'wa_tch_me_su_c_ceed');
    });

    it('should not affect existing underscores', function() {
      assertEqual(underscore('_hop_on_pop_'), '_hop_on_pop_');
    });

    it('should handle irregular input', function() {
      assertEqual(underscore(''), '');
      assertEqual(underscore(null), 'null');
      assertEqual(underscore(800), '800');
    });

  });

  describeInstance('camelize', function(camelize) {

    it('should handle basic input', function() {
      assertEqual(camelize('hop-on-pop'), 'HopOnPop');
      assertEqual(camelize('HOP-ON-POP'), 'HopOnPop');
      assertEqual(camelize('hop_on_pop'), 'HopOnPop');
      assertEqual(camelize('watch me fail'), 'WatchMeFail');
      assertEqual(camelize('watch   me   fail'), 'WatchMeFail');
      assertEqual(camelize('watch me fail-sad-face'), 'WatchMeFailSadFace');
      assertEqual(camelize('waTch me su-cCeed'), 'WaTchMeSuCCeed');
    });

    it('should downcase first letter', function() {
      assertEqual(camelize('hop-on-pop', false), 'hopOnPop');
      assertEqual(camelize('HOP-ON-POP', false), 'hopOnPop');
      assertEqual(camelize('hop_on_pop', false), 'hopOnPop');
      assertEqual(camelize('watch me fail', false), 'watchMeFail');
      assertEqual(camelize('watch me fail-sad-face', false), 'watchMeFailSadFace');
      assertEqual(camelize('waTch me su-cCeed', false), 'waTchMeSuCCeed');
    });

    it('should handle irregular input', function() {
      assertEqual(camelize(''), '');
      assertEqual(camelize(null), 'Null');
      assertEqual(camelize(800), '800');
    });

  });

  describeInstance('dasherize', function(dasherize) {

    it('should handle basic input', function() {
      assertEqual(dasherize('hop_on_pop'), 'hop-on-pop');
      assertEqual(dasherize('HOP_ON_POP'), 'hop-on-pop');
      assertEqual(dasherize('hopOnPop'), 'hop-on-pop');
      assertEqual(dasherize('watch me fail'), 'watch-me-fail');
      assertEqual(dasherize('watch me fail_sad_face'), 'watch-me-fail-sad-face');
      assertEqual(dasherize('waTch me su_cCeed'), 'wa-tch-me-su-c-ceed');
      assertEqual(dasherize('aManAPlanACanalPanama'), 'a-man-a-plan-a-canal-panama');
      assertEqual(dasherize('street'), 'street');
      assertEqual(dasherize('street_address'), 'street-address');
      assertEqual(dasherize('person_street_address'), 'person-street-address');
    });

    it('should handle irregular input', function() {
      assertEqual(dasherize(''), '');
      assertEqual(dasherize(null), 'null');
      assertEqual(dasherize(800), '800');
    });

  });

  describeInstance('titleize', function(titleize) {

    it('should handle basic input', function() {
      assertEqual(titleize('active_record'), 'Active Record');
      assertEqual(titleize('ActiveRecord'), 'Active Record');
      assertEqual(titleize('action web service'), 'Action Web Service');
      assertEqual(titleize('Action Web Service'), 'Action Web Service');
      assertEqual(titleize('Action web service'), 'Action Web Service');
      assertEqual(titleize('actionwebservice'), 'Actionwebservice');
      assertEqual(titleize('Actionwebservice'), 'Actionwebservice');
      assertEqual(titleize("david's code"), "David's Code");
      assertEqual(titleize("David's code"), "David's Code");
      assertEqual(titleize("david's Code"), "David's Code");
      assertEqual(titleize('man from the boondocks'), 'Man from the Boondocks');
      assertEqual(titleize('x-men: the last stand'), 'X Men: The Last Stand');
      assertEqual(titleize('i am a sentence. and so am i.'), 'I Am a Sentence. And so Am I.');
      assertEqual(titleize('hello! and goodbye!'), 'Hello! And Goodbye!');
      assertEqual(titleize('hello, and goodbye'), 'Hello, and Goodbye');
      assertEqual(titleize('hello; and goodbye'), 'Hello; And Goodbye');
      assertEqual(titleize("about 'you' and 'me'"), "About 'You' and 'Me'");
      assertEqual(titleize('TheManWithoutAPast'), 'The Man Without a Past');
      assertEqual(titleize('raiders_of_the_lost_ark'), 'Raiders of the Lost Ark');
    });

    it('should handle non-titleized words', function() {
      assertEqual(titleize('the day of the jackal'), 'The Day of the Jackal');
      assertEqual(titleize('what color is your parachute?'), 'What Color Is Your Parachute?');
      assertEqual(titleize('a tale of two cities'), 'A Tale of Two Cities');
      assertEqual(titleize('where am i going to'), 'Where Am I Going To');
    });

    it('should handle irregular input', function() {
      assertEqual(titleize(''), '');
      assertEqual(titleize(null), 'Null');
      assertEqual(titleize(800), '800');
    });

  });

  describeInstance('spacify', function(spacify) {

    it('should should handle basic input', function() {
      assertEqual(spacify('hopOnPop'), 'hop on pop');
      assertEqual(spacify('HopOnPop'), 'hop on pop');
      assertEqual(spacify('HOPONPOP'), 'hoponpop');
      assertEqual(spacify('HOP-ON-POP'), 'hop on pop');
      assertEqual(spacify('hop-on-pop'), 'hop on pop');
      assertEqual(spacify('watch_me_fail'), 'watch me fail');
      assertEqual(spacify('watch-meFail-sad-face'), 'watch me fail sad face');
      assertEqual(spacify('waTch me su-cCeed'), 'wa tch me su c ceed');
    });

    it('should handle irregular input', function() {
      assertEqual(spacify(''), '');
      assertEqual(spacify(null), 'null');
      assertEqual(spacify(800), '800');
    });
  });

  describeInstance('parameterize', function(parameterize) {

    it('should handle basic input', function() {
      assertEqual(parameterize('Donald E. Knuth'), 'donald-e-knuth');
      assertEqual(parameterize('Random text with *(bad)* characters'), 'random-text-with-bad-characters');
      assertEqual(parameterize('Allow_Under_Scores'), 'allow_under_scores');
      assertEqual(parameterize('Trailing bad characters!@#'), 'trailing-bad-characters');
      assertEqual(parameterize('!@#Leading bad characters'), 'leading-bad-characters');
      assertEqual(parameterize('Squeeze   separators'), 'squeeze-separators');
      assertEqual(parameterize('Test with + sign'), 'test-with-sign');
    });

    it('should allow a custom separator', function() {
      assertEqual(parameterize('Donald E. Knuth', '_'), 'donald_e_knuth');
      assertEqual(parameterize('Random text with *(bad)* characters', '_'), 'random_text_with_bad_characters');
      assertEqual(parameterize('With-some-dashes', '_'), 'with-some-dashes');
      assertEqual(parameterize('Retain_underscore', '_'), 'retain_underscore');
      assertEqual(parameterize('Trailing bad characters!@#', '_'), 'trailing_bad_characters');
      assertEqual(parameterize('!@#Leading bad characters', '_'), 'leading_bad_characters');
      assertEqual(parameterize('Squeeze   separators', '_'), 'squeeze_separators');
      assertEqual(parameterize('Test with + sign', '_'), 'test_with_sign');
    });

    it('should handle irregular input', function() {
      assertEqual(parameterize(''), '');
      assertEqual(parameterize(null), 'null');
      assertEqual(parameterize(800), '800');
      assertEqual(parameterize('Foo Bar', 8), 'foo8bar');
      assertEqual(parameterize('Foo \uDFFF Bar'), 'foo-bar');
    });
  });

  describeInstance('at', function(at) {

    it('should find basic character at positition', function() {
      assertEqual(at('foop', 0), 'f');
      assertEqual(at('foop', 1), 'o');
      assertEqual(at('foop', 2), 'o');
      assertEqual(at('foop', 3), 'p');
      assertEqual(at('foop', 4), '');
      assertEqual(at('foop', 1224), '');
      assertEqual(at('foop', -1), 'p');
      assertEqual(at('foop', -2), 'o');
      assertEqual(at('foop', -3), 'o');
      assertEqual(at('foop', -4), 'f');
      assertEqual(at('foop', -5), '');
      assertEqual(at('foop', -1224), '');
    });

    it('should allow looping from the start', function() {
      assertEqual(at('foop', 0, true), 'f');
      assertEqual(at('foop', 1, true), 'o');
      assertEqual(at('foop', 2, true), 'o');
      assertEqual(at('foop', 3, true), 'p');
      assertEqual(at('foop', 4, true), 'f');
      assertEqual(at('foop', 5, true), 'o');
      assertEqual(at('foop', 1224, true), 'f');
      assertEqual(at('foop', -1, true), 'p');
      assertEqual(at('foop', -2, true), 'o');
      assertEqual(at('foop', -3, true), 'o');
      assertEqual(at('foop', -4, true), 'f');
      assertEqual(at('foop', -5, true), 'p');
      assertEqual(at('foop', -1224, true), 'f');
    });

    it('should accept an array', function() {
      assertArrayEqual(at('wowzers', [0,2,4,6,18]), ['w','w','e','s','']);
      assertArrayEqual(at('wowzers', [0,2,4,6], true), ['w','w','e','s']);
      assertArrayEqual(at('wowzers', [0,2,4,6,18], true), ['w','w','e','s','e']);
    });

    it('should handle irregular input', function() {
      assertEqual(at('', 3), '');
      assertEqual(at(null, 0), 'n');
      assertEqual(at(8, 0), '8');
      assertError(function(){ at('foo', null); });
      assertError(function(){ at('foo', NaN); });
      assertError(function(){ at('foo', Infinity); });
      assertError(function(){ at('foo', 2.2); });
      assertError(function(){ at('foo', '0'); });
    });

  });

  describeInstance('first', function(first) {

    it('should handle basic input', function() {
      assertEqual(first('quack'), 'q');
      assertEqual(first('quack', 2), 'qu');
      assertEqual(first('quack', 3), 'qua');
      assertEqual(first('quack', 4), 'quac');
      assertEqual(first('quack', 20), 'quack');
      assertEqual(first('quack', 0), '');
      assertEqual(first('quack', -1), '');
      assertEqual(first('quack', -5), '');
      assertEqual(first('quack', -10), '');
    });

    it('should handle irregular input', function() {
      assertEqual(first('', 3), '');
      assertEqual(first(null, 2), 'nu');
      assertEqual(first(800, 2), '80');
      assertError(function(){ first('foo', null); });
      assertError(function(){ first('foo', NaN); });
      assertError(function(){ first('foo', Infinity); });
      assertError(function(){ first('foo', 2.2); });
      assertError(function(){ first('foo', '0'); });
    });

  });

  describeInstance('last', function(last) {

    it('should handle basic input', function() {
      assertEqual(last('quack'), 'k');
      assertEqual(last('quack', 2), 'ck');
      assertEqual(last('quack', 3), 'ack');
      assertEqual(last('quack', 4), 'uack');
      assertEqual(last('quack', 10), 'quack');
      assertEqual(last('quack', -1), '');
      assertEqual(last('quack', -5), '');
      assertEqual(last('quack', -10), '');
    });

    it('should handle irregular input', function() {
      assertEqual(last('', 3), '');
      assertEqual(last(null, 2), 'll');
      assertEqual(last(800, 2), '00');
      assertError(function(){ last('foo', null); });
      assertError(function(){ last('foo', NaN); });
      assertError(function(){ last('foo', Infinity); });
      assertError(function(){ last('foo', 2.2); });
      assertError(function(){ last('foo', '0'); });
    });
  });

  describeInstance('from', function(from) {

    it('should handle basic input', function() {
      assertEqual(from('quack'), 'quack');
      assertEqual(from('quack', 0), 'quack');
      assertEqual(from('quack', 2), 'ack');
      assertEqual(from('quack', 4), 'k');
      assertEqual(from('quack', -1), 'k');
      assertEqual(from('quack', -3), 'ack');
      assertEqual(from('quack', -4), 'uack');
      assertEqual(from('quack', 'q'), 'quack');
      assertEqual(from('quack', 'u'), 'uack');
      assertEqual(from('quack', 'a'), 'ack');
      assertEqual(from('quack', 'k'), 'k');
      assertEqual(from('quack', ''), 'quack');
      assertEqual(from('quack', 'ua'), 'uack');
      assertEqual(from('quack', 'uo'), '');
      assertEqual(from('quack', 'quack'), 'quack');
    });

    it('should handle irregular input', function() {
      assertEqual(from('', 3), '');
      assertEqual(from(null, 2), 'll');
      assertEqual(from(800, 2), '0');
      assertError(function(){ from('foo', null); });
      assertError(function(){ from('foo', NaN); });
      assertError(function(){ from('foo', Infinity); });
      assertError(function(){ from('foo', 2.2); });
    });
  });

  describeInstance('to', function(to) {

    it('should handle basic input', function() {
      assertEqual(to('quack'), 'quack');
      assertEqual(to('quack', 0), '');
      assertEqual(to('quack', 1), 'q');
      assertEqual(to('quack', 2), 'qu');
      assertEqual(to('quack', 4), 'quac');
      assertEqual(to('quack', -1), 'quac');
      assertEqual(to('quack', -3), 'qu');
      assertEqual(to('quack', -4), 'q');
      assertEqual(to('quack', 'q'), '');
      assertEqual(to('quack', 'u'), 'q');
      assertEqual(to('quack', 'a'), 'qu');
      assertEqual(to('quack', 'k'), 'quac');
      assertEqual(to('quack', ''), '');
      assertEqual(to('quack', 'ua'), 'q');
      assertEqual(to('quack', 'uo'), '');
      assertEqual(to('quack', 'quack'), '');
    });

    it('should handle irregular input', function() {
      assertEqual(to('', 3), '');
      assertEqual(to(null, 2), 'nu');
      assertEqual(to(800, 2), '80');
      assertError(function(){ to('foo', null); });
      assertError(function(){ to('foo', NaN); });
      assertError(function(){ to('foo', Infinity); });
      assertError(function(){ to('foo', 2.2); });
    });
  });

  describeInstance('isEmpty', function(isEmpty) {

    it('should handle basic input', function() {
      assertEqual(isEmpty(''), true);
      assertEqual(isEmpty('0'), false);
      assertEqual(isEmpty(' '), false);
      assertEqual(isEmpty('　'), false);
      assertEqual(isEmpty('\t'), false);
      assertEqual(isEmpty('\n'), false);
    });

    it('should handle irregular input', function() {
      assertEqual(isEmpty(null), false);
      assertEqual(isEmpty(undefined), false);
      assertEqual(isEmpty(8), false);
    });

  });

  describeInstance('isBlank', function(isBlank) {

    it('should handle basic input', function() {
      assertEqual(isBlank(''), true);
      assertEqual(isBlank('0'), false);
      assertEqual(isBlank('            '), true);
      assertEqual(isBlank('\n'), true);
      assertEqual(isBlank('\t\t\t\t'), true);
      assertEqual(isBlank('日本語では　「マス」'), false);
      assertEqual(isBlank('mayonnaise'), false);
    });

    it('should handle irregular input', function() {
      assertEqual(isBlank(null), false);
      assertEqual(isBlank(undefined), false);
      assertEqual(isBlank(8), false);
    });

  });

  describeInstance('compact', function(compact) {

    it('should handle basic input', function() {
      assertEqual(compact('the rain in     spain    falls mainly   on     the        plain'), 'the rain in spain falls mainly on the plain');
      assertEqual(compact('\n\n\nthe \n\n\nrain in     spain    falls mainly   on     the        plain\n\n'), 'the rain in spain falls mainly on the plain');
      assertEqual(compact('\n\n\n\n           \t\t\t\t          \n\n      \t'), '');
      assertEqual(compact('moo\tmoo'), 'moo moo', 'moo moo tab');
      assertEqual(compact('moo \tmoo'), 'moo moo', 'moo moo space tab');
      assertEqual(compact('moo \t moo'), 'moo moo', 'moo moo space tab space');
    });

    it('should handle full-width spaces', function() {
      assertEqual(compact('　　　全角　　　スペース　　　　も　'), '全角　スペース　も');
      assertEqual(compact('全角　スペース　も'), '全角　スペース　も');
      assertEqual(compact('　全角　スペース　も　'), '全角　スペース　も');
    });

    it('should handle irregular input', function() {
      assertEqual(compact(null), 'null');
      assertEqual(compact(undefined), 'undefined');
      assertEqual(compact(800), '800');
    });
  });

  describeInstance('toNumber', function(toNumber) {

    it('should handle integers', function() {
      assertEqual(toNumber('10'), 10);
      assertEqual(toNumber('10,000'), 10000);
      assertEqual(toNumber('5,322,144,444'), 5322144444);
      assertEqual(toNumber('22.5'), 22.5);
    });

    it('should handle decimals', function() {
      assertEqual(toNumber('10.532'), 10.532);
      assertEqual(toNumber('10.848'), 10.848);
      assertEqual(toNumber('95.25%'), 95.25);
      assertEqual(toNumber('77.3'), 77.3);
      assertEqual(toNumber('1.45kg'), 1.45);
      assertEqual(toNumber('.3'), 0.3);
    });

    it('should handle trailing characters', function() {
      assertEqual(toNumber('4em'), 4);
      assertEqual(toNumber('10px'), 10);
      assertEqual(toNumber('1234blue'), 1234);
    });

    it('should not convert octals', function() {
      assertEqual(toNumber('010'), 10);
      assertEqual(toNumber('0908'), 908);
      assertEqual(toNumber('077.3'), 77.3);
    });

    it('should throw away redundant decimals', function() {
      assertEqual(toNumber('22.34.5'), 22.34);
    });

    it('should handle hex strings', function() {
      assertEqual(toNumber('0xFF'), 255);
    });

    it('should handle a different base', function() {
      assertEqual(toNumber('FF', 16), 255);
    });

    it('should handle scientific notation', function() {
      assertEqual(toNumber('1e6'), 1000000);
      assertEqual(toNumber('0.1e6'), 100000);
    });

    it('should handle full-width characters', function() {
      assertEqual(toNumber('２００'), 200);
      assertEqual(toNumber('５．２３４５'), 5.2345);
    });

    it('should handle irregular input', function() {
      assertEqual(toNumber(8), 8);
      assertNaN(toNumber(null));
      assertNaN(toNumber(NaN));
      assertNaN(toNumber(''));
      assertNaN(toNumber(' \r\n\t'));
      assertEqual(toNumber('0xA'), 10);
      assertEqual(toNumber('0x77.3'), 0);
      assertNaN(toNumber('blue'), true);
      assertNaN(toNumber('........'), true);
    });

  });

  describeInstance('reverse', function(reverse) {

    it('should handle basic input', function() {
      assertEqual(reverse('spoon'), 'noops');
      assertEqual(reverse('amanaplanacanalpanama'), 'amanaplanacanalpanama');
      assertEqual(reverse(''), '');
      assertEqual(reverse('wasabi'), 'ibasaw');
    });

    it('should handle irregular input', function() {
      assertEqual(reverse(null), 'llun');
      assertEqual(reverse(undefined), 'denifednu');
      assertEqual(reverse(NaN), 'NaN');
      assertEqual(reverse(800), '008');
    });

  });

  describeInstance('encodeBase64', function(encodeBase64) {

    it('should handle ascii input', function() {
      assertEqual(encodeBase64(''), '');
      assertEqual(encodeBase64('foo'), 'Zm9v');
      assertEqual(encodeBase64('This webpage is not available'), 'VGhpcyB3ZWJwYWdlIGlzIG5vdCBhdmFpbGFibGU=');
    });

    it('should handle non-ascii input', function() {
      assertEqual(encodeBase64('✓ à la mode'), '4pyTIMOgIGxhIG1vZGU=');
      assertEqual(encodeBase64('räksmörgås'), 'csOka3Ntw7ZyZ8Olcw==');
      assertEqual(encodeBase64('rÃ¤ksmÃ¶rgÃ¥s'), 'csODwqRrc23Dg8K2cmfDg8Klcw==');
      assertEqual(encodeBase64('АБВ'), '0JDQkdCS');
      assertEqual(encodeBase64('日本語'), '5pel5pys6Kqe');
      assertEqual(encodeBase64('にほんご'), '44Gr44G744KT44GU');
      assertEqual(encodeBase64('한국어'), '7ZWc6rWt7Ja0');
    });

    it('should handle irregular input', function() {
      assertEqual(encodeBase64('\n'), 'Cg==');
      assertEqual(encodeBase64(null), 'bnVsbA==');
      assertEqual(encodeBase64(NaN), 'TmFO');
      assertEqual(encodeBase64(8), 'OA==');
    });

  });

  describeInstance('decodeBase64', function(decodeBase64) {

    it('should handle ascii input', function() {
      assertEqual(decodeBase64(''), '');
      assertEqual(decodeBase64('Zm9v'), 'foo');
      assertEqual(decodeBase64('VGhpcyB3ZWJwYWdlIGlzIG5vdCBhdmFpbGFibGU='), 'This webpage is not available');
      assertEqual(decodeBase64('L2hvd2FyZHNmaXJld29ya3MvYXBpL29yZGVyLzc1TU0lMjBNSVg='), '/howardsfireworks/api/order/75MM%20MIX')
    });

    it('should handle non-ascii input', function() {
      assertEqual(decodeBase64('4pyTIMOgIGxhIG1vZGU='), '✓ à la mode');
      assertEqual(decodeBase64('csOka3Ntw7ZyZ8Olcw=='), 'räksmörgås');
      assertEqual(decodeBase64('csODwqRrc23Dg8K2cmfDg8Klcw=='), 'rÃ¤ksmÃ¶rgÃ¥s');
      assertEqual(decodeBase64('0JDQkdCS'), 'АБВ');
      assertEqual(decodeBase64('5pel5pys6Kqe'), '日本語');
      assertEqual(decodeBase64('44Gr44G744KT44GU'), 'にほんご');
      assertEqual(decodeBase64('7ZWc6rWt7Ja0'), '한국어');
    });

    it('should handle irregular input', function() {
      assertError(function(){ decodeBase64(null); });
      assertError(function(){ decodeBase64(NaN); });
      assertError(function(){ decodeBase64(8); });
      assertError(function(){ decodeBase64('@#$^#$^#@$^'); });
    });

  });

});
