'use strict';

namespace('String', function() {

  staticMethod('range', function(range) {

    // toString
    assertEqual(range('a', 'z').toString(), 'a..z');
    assertEqual(range('a', null).toString(), 'Invalid Range');

    // isValid
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

    // span
    assertEqual(range('a', 'z').span(), 26);
    assertEqual(range('z', 'a').span(), 26);
    assertEqual(range('a', 'a').span(), 1);
    assertNaN(range('', '').span());

    // toArray
    assertArrayEqual(range('a', 'd').toArray(), ['a','b','c','d']);
    assertArrayEqual(range('d', 'a').toArray(), ['d','c','b','a']);
    assertArrayEqual(range('', 'd').toArray(), []);
    assertArrayEqual(range('d', '').toArray(), []);

    // clone
    assertEqual(range('a','z').clone().toString(), 'a..z');

    // clamp
    assertEqual(range('c','d').clamp('z'), 'd');
    assertEqual(range('c','d').clamp('a'), 'c');
    assertEqual(range('d','c').clamp('z'), 'd');
    assertEqual(range('d','c').clamp('a'), 'c');

    // contains
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

    // every
    assertArrayEqual(range('a', 'd').every(1), ['a','b','c','d']);
    assertArrayEqual(range('a', 'd').every(2), ['a','c']);
    assertArrayEqual(range('a', 'd').every(2, concatA), ['aA','cA']);
    assertArrayEqual(range('a', 'b').every(1, args), [['a',0], ['b',1]]);

    // intersect
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

    // union
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
