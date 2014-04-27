package('Number | Ranges', function () {

  function getRange(from, to) {
    return run(Number, 'range', [from, to]);
  }

  function testRange(start, end, isValid, expectedCount, expectedResult, iterations) {
    var range = getRange(start, end);
    var count = 0;
    var result = range.every(iterations || 1, function() {
      count++;
    });

    equal(range.isValid(), isValid, start + ' <> ' + end + ' | is valid');
    equal(count, expectedCount, start + ' <> ' + end + ' | count');
    equal(result, expectedResult, start + ' <> ' + end + ' | result');
  }

  group('range', function() {
    var range = getRange(5, 10);

    equal(range.toString(), '5..10', 'toString');
    equal(range.isValid(), true, 'isValid');
    equal(range.span(), 6, 'span');
    equal(range.contains(), false, 'contains undefined');
    equal(range.contains(1), false, 'contains 1');
    equal(range.contains(4), false, 'contains 4');
    equal(range.contains(5), true, 'contains 5');
    equal(range.contains(6), true, 'contains 6');
    equal(range.contains(7), true, 'contains 7');
    equal(range.contains(8), true, 'contains 8');
    equal(range.contains(9), true, 'contains 9');
    equal(range.contains(10), true, 'contains 10');
    equal(range.contains(11), false, 'contains 11');

    testRange(NaN, NaN, false, 0, []);
    testRange(0, NaN, false, 0, []);
    testRange(NaN, 0, false, 0, []);
    testRange(0, -Infinity, false, 0, []);
    testRange(0,  Infinity, false, 0, []);
    testRange(-Infinity, 0, false, 0, []);
    testRange(Infinity,  0, false, 0, []);
    testRange(Infinity,   Infinity, false, 0, []);
    testRange(-Infinity,  Infinity, false, 0, []);
    testRange(Infinity,  -Infinity, false, 0, []);
    testRange(-Infinity, -Infinity, false, 0, []);

    testRange(0.1, 0.5, true, 5, [0.1,0.2,0.3,0.4,0.5], 0.1);
    testRange(-5.016, 2, true, 8, [-5.016,-4.016,-3.016,-2.016,-1.016,-0.016,0.984,1.984]);

  });

  method('union', function() {
    var range = getRange(5, 10), mergedRange;

    mergedRange = range.union(getRange(1, 5));
    equal(mergedRange.start, 1, '1..5 | 5..10 | start');
    equal(mergedRange.end, 10, '1..5 | 5..10 | end');

    mergedRange = range.union(getRange(1, 4));
    equal(mergedRange.start, 1, '1..4 | 5..10 | start');
    equal(mergedRange.end, 10, '1..4 | 5..10 | end');

    mergedRange = range.union(getRange(1, 3));
    equal(mergedRange.start, 1, '1..3 | 5..10 | start');
    equal(mergedRange.end, 10, '1..3 | 5..10 | end');

    mergedRange = range.union(getRange(1, 1));
    equal(mergedRange.start, 1, '1..1 | 5..10 | start');
    equal(mergedRange.end, 10, '1..1 | 5..10 | end');

    mergedRange = range.union(getRange(1, 20));
    equal(mergedRange.start, 1, '1..20 | 5..10 | start');
    equal(mergedRange.end, 20, '1..20 | 5..10 | end');

    mergedRange = range.union(getRange(-5, 7));
    equal(mergedRange.start, -5, '-5..7 | 5..10 | start');
    equal(mergedRange.end, 10, '-5..7 | 5..10 | end');

    mergedRange = range.union(getRange(-5, 50));
    equal(mergedRange.start, -5, '-5..50 | 5..10 | start');
    equal(mergedRange.end, 50, '-5..50 | 5..10 | end');
  });

  method('intersect', function() {
    var range = getRange(5, 10), mergedRange;

    mergedRange = range.intersect(getRange(1, 5));
    equal(mergedRange.start, 5, '1..5 & 5..10 | start');
    equal(mergedRange.end, 5, '1..5 & 5..10 | end');

    mergedRange = range.intersect(getRange(7, 8));
    equal(mergedRange.start, 7, '7..8 & 5..10 | start');
    equal(mergedRange.end, 8, '7..8 & 5..10 | end');

    mergedRange = range.intersect(getRange(1, 4));
    equal(mergedRange.isValid(), false, '1..4 & 5..10 | isValid');

    mergedRange = range.intersect(getRange(1, 3));
    equal(mergedRange.isValid(), false, '1..3 & 5..10 | isValid');

    mergedRange = range.intersect(getRange(1, 1));
    equal(mergedRange.isValid(), false, '1..1 & 5..10 | isValid');

    mergedRange = range.intersect(getRange(1, 20));
    equal(mergedRange.start, 5, '1..20 & 5..10 | start');
    equal(mergedRange.end, 10, '1..20 & 5..10 | end');

    mergedRange = range.intersect(getRange(-5, 7));
    equal(mergedRange.start, 5, '-5..7 & 5..10 | start');
    equal(mergedRange.end, 7, '-5..7 & 5..10 | end');

    mergedRange = range.intersect(getRange(-5, 50));
    equal(mergedRange.start, 5, '-5..50 & 5..10 | start');
    equal(mergedRange.end, 10, '-5..50 & 5..10 | end');

    mergedRange = getRange(-5, 5).intersect(getRange(-20, 0));
    equal(mergedRange.start, -5, '-5..5 & -20..0 | start');
    equal(mergedRange.end, 0, '-5..5 & -20..0 | end');
  });

  method('clone', function() {
    var range = getRange(5, 10);
    var clonedRange = range.clone();

    equal(clonedRange.start, 5, 'cloned range start');
    equal(clonedRange.end, 10, 'cloned range end');
    equal(clonedRange === range, false, 'cloned range should not be strictly equal');
  });


  method('every', function() {
    var count, callback, result;
    var range = getRange(5, 10);

    count = 0;
    result = range.every(1, function() {
      count++;
    });

    equal(result, [5,6,7,8,9,10], 'result should be an array');
    equal(count, 6, 'every 1');

    count = 0;

    result = range.every(2, function() {
      count++;
    });

    equal(result, [5,7,9], 'every 2 | result should be an array');
    equal(count, 3, 'every 2 | count');

    count = 0;

    result = range.every(function() {
      count++;
    });

    equal(result, [5,6,7,8,9,10], 'result should be an array');
    equal(count, 6, 'every 1');

    equal(getRange(1, 5).every(null, function(){}), [1,2,3,4,5], 'Number | 1..5 | null increment defaults to 1');

  });

  method('clamp', function() {
    var range = getRange(5, 10);

    equal(range.clamp(25), 10, '25');
    equal(range.clamp(10), 10, '10');
    equal(range.clamp(9),   9, '9');
    equal(range.clamp(8),   8, '8');
    equal(range.clamp(7),   7, '7');
    equal(range.clamp(6),   6, '6');
    equal(range.clamp(5),   5, '5');
    equal(range.clamp(4),   5, '4');
    equal(range.clamp(1),   5, '1');
    equal(range.clamp(0),   5, '0');
    equal(range.clamp(-1),  5, '-1');
  });

  method('inverse', function() {
    var range = getRange(4, 1);

    equal(range.toString(), '4..1', 'toString');
    equal(range.isValid(), true, 'isValid');
    equal(range.every(), [4,3,2,1], 'every');

    equal(getRange(NaN, NaN).toString(), 'Invalid Range', 'toString');
  });


  method('contains', function() {
    var range;

    range = getRange(1, Infinity);
    equal(range.contains(1), true, '1..Infinity | contains 1');
    equal(range.contains(10), true, '1..Infinity | contains 10');
    equal(range.contains(100), true, '1..Infinity | contains 100');
    equal(range.contains(Infinity), true, '1..Infinity | contains 100');
    equal(range.contains(0), false, '1..Infinity | contains 0');
    equal(range.contains(-1), false, '1..Infinity | contains -1');
    equal(range.contains(-10), false, '1..Infinity | contains -10');
    equal(range.contains(-100), false, '1..Infinity | contains -100');
    equal(range.contains(-Infinity), false, '1..Infinity | contains -Infinity');

    range = getRange(-Infinity, 1);
    equal(range.contains(1), true, '-Infinity..1 | contains 1');
    equal(range.contains(10), false, '-Infinity..1 | contains 10');
    equal(range.contains(100), false, '-Infinity..1 | contains 100');
    equal(range.contains(Infinity), false, '-Infinity..1 | contains 100');
    equal(range.contains(0), true, '-Infinity..1 | contains 0');
    equal(range.contains(-1), true, '-Infinity..1 | contains -1');
    equal(range.contains(-10), true, '-Infinity..1 | contains -10');
    equal(range.contains(-100), true, '-Infinity..1 | contains -100');
    equal(range.contains(-Infinity), true, '-Infinity..1 | contains -Infinity');

    range = getRange(-Infinity, Infinity);
    equal(range.contains(1), true, '-Infinity..Infinity | contains 1');
    equal(range.contains(10), true, '-Infinity..Infinity | contains 10');
    equal(range.contains(100), true, '-Infinity..Infinity | contains 100');
    equal(range.contains(Infinity), true, '-Infinity..Infinity | contains 100');
    equal(range.contains(0), true, '-Infinity..Infinity | contains 0');
    equal(range.contains(-1), true, '-Infinity..Infinity | contains -1');
    equal(range.contains(-10), true, '-Infinity..Infinity | contains -10');
    equal(range.contains(-100), true, '-Infinity..Infinity | contains -100');
    equal(range.contains(-Infinity), true, '-Infinity..Infinity | contains -Infinity');

    range = getRange(0, 0);
    equal(range.contains(-1), false, '0..0 | contains -1');
    equal(range.contains(0), true, '0..0 | contains 0');
    equal(range.contains(1), false, '0..0 | contains 1');

    range = getRange(null, null);
    equal(range.contains(-1), false, 'null..null | contains -1');
    equal(range.contains(0), true, 'null..null | contains 0');
    equal(range.contains(1), false, 'null..null | contains 1');
    equal(range.isValid(), false, 'null..null | isValid');

    range = getRange(undefined, undefined);
    equal(range.contains(-1), false, 'undefined..undefined | contains -1');
    equal(range.contains(0), false, 'undefined..undefined | contains 0');
    equal(range.contains(1), false, 'undefined..undefined | contains 1');
    equal(range.isValid(), false, 'undefined..undefined | isValid');

    equal(getRange(new Date(2010, 0).getTime(), new Date(2010, 2).getTime()).contains(new Date(2010, 0)), true, 'contains different type');
  });

  if(Sugar.Array.create) {
    equal(Sugar.Array.create(getRange(1, 5)), [1,2,3,4,5], 'Array.create | should work on number ranges');
    equal(Sugar.Array.create(getRange(5, 1)), [5,4,3,2,1], 'Array.create | should work on inverse number ranges');
  }

});

package('Number', function() {

  method('clamp', function() {
    test(25, [5, 10], 10, '25');
    test(10, [5, 10], 10, '10');
    test(9,  [5, 10], 9, '9');
    test(8,  [5, 10], 8, '8');
    test(7,  [5, 10], 7, '7');
    test(6,  [5, 10], 6, '6');
    test(5,  [5, 10], 5, '5');
    test(4,  [5, 10], 5, '4');
    test(1,  [5, 10], 5, '1');
    test(0,  [5, 10], 5, '0');
    test(-1, [5, 10], 5, '-1');

    test(25, [10, 5], 10, 'inverted | 25');
    test(10, [10, 5], 10, 'inverted | 10');
    test(9,  [10, 5], 9, 'inverted | 9');
    test(8,  [10, 5], 8, 'inverted | 8');
    test(7,  [10, 5], 7, 'inverted | 7');
    test(6,  [10, 5], 6, 'inverted | 6');
    test(5,  [10, 5], 5, 'inverted | 5');
    test(4,  [10, 5], 5, 'inverted | 4');
    test(1,  [10, 5], 5, 'inverted | 1');
    test(0,  [10, 5], 5, 'inverted | 0');
    test(-1, [10, 5], 5, 'inverted | -1');
  });

  method('cap', function() {
    test(5, [6], 5, '5 capped to 6');
    test(5, [5], 5, '5 capped to 5');
    test(5, [4], 4, '5 capped to 4');
    test(5, [1], 1, '5 capped to 1');
    test(5, [0], 0, '5 capped to 0');
    test(5, [-1], -1, '5 capped to -1');
    test(5, [-5], -5, '5 capped to -5');
    test(5, [-10], -10, '5 capped to -10');

    test(0, [6], 0, '0 capped to 6');
    test(0, [5], 0, '0 capped to 5');
    test(0, [4], 0, '0 capped to 4');
    test(0, [1], 0, '0 capped to 1');
    test(0, [0], 0, '0 capped to 0');
    test(0, [-1], -1, '0 capped to -1');
    test(0, [-5], -5, '0 capped to -5');
    test(0, [-10], -10, '0 capped to -10');

    test(-5, [6], -5, '-5 capped to 6');
    test(-5, [5], -5, '-5 capped to 5');
    test(-5, [4], -5, '-5 capped to 4');
    test(-5, [1], -5, '-5 capped to 1');
    test(-5, [0], -5, '-5 capped to 0');
    test(-5, [-1], -5, '-5 capped to -1');
    test(-5, [-5], -5, '-5 capped to -5');
    test(-5, [-10], -10, '-5 capped to -10');
  });

});
