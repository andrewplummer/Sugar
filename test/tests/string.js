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

    it('should pad even length string to exact length', () => {
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

    it('should pad odd length string to target length + 1', () => {
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

    it('should pad with custom string', () => {
      assertEqual(pad('wasabi', 8, '"'), '"wasabi"');
      assertEqual(pad('wasabi', 8, ''), 'wasabi');
      assertEqual(pad('wasabi', 8, 's'), 'swasabis');
      assertEqual(pad('wasabi', 8, 5), '5wasabi5');
      assertEqual(pad('wasabi', 12, '-'), '---wasabi---');
      assertEqual(pad('hello', 12, '-'), '---hello---');
    });

    it('should pad with non-standard arguments', () => {
      assertEqual(pad('wasabi'), 'wasabi');
      assertEqual(pad('wasabi', undefined), 'wasabi');
      assertEqual(pad('wasabi', null), 'wasabi');
      assertEqual(pad('wasabi', NaN), 'wasabi');

      assertEqual(pad('', false), '');
      assertEqual(pad('', true), '');
    });

    it('should not throw equivalent errors to padStart/padEnd', () => {
      assertNoError(function(){ pad('wasabi', -1); });
      assertNoError(function(){ pad('wasabi', -Infinity); });
      assertError(function(){ pad('wasabi',  Infinity); });
    });

  });

});
