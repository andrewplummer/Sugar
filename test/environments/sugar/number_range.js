
test('Number Ranges', function () {

  var range;
  var mergedRange;
  var clonedRange;
  var result;
  var count;

  range = Number.range(5, 10);

  equal(range.toString(), '5..10', 'Number | Range | toString');
  equal(range.isValid(), true, 'Number | Range | isValid');
  equal(range.span(), 6, 'Number | Range | span');
  equal(range.contains(), false, 'Number | Range | contains undefined');
  equal(range.contains(1), false, 'Number | Range | contains 1');
  equal(range.contains(4), false, 'Number | Range | contains 4');
  equal(range.contains(5), true, 'Number | Range | contains 5');
  equal(range.contains(6), true, 'Number | Range | contains 6');
  equal(range.contains(7), true, 'Number | Range | contains 7');
  equal(range.contains(8), true, 'Number | Range | contains 8');
  equal(range.contains(9), true, 'Number | Range | contains 9');
  equal(range.contains(10), true, 'Number | Range | contains 10');
  equal(range.contains(11), false, 'Number | Range | contains 11');

  mergedRange = range.union(Number.range(1, 5));
  equal(mergedRange.start, 1, 'Number | 1..5 | 5..10 | start');
  equal(mergedRange.end, 10, 'Number | 1..5 | 5..10 | end');

  mergedRange = range.union(Number.range(1, 4));
  equal(mergedRange.start, 1, 'Number | 1..4 | 5..10 | start');
  equal(mergedRange.end, 10, 'Number | 1..4 | 5..10 | end');

  mergedRange = range.union(Number.range(1, 3));
  equal(mergedRange.start, 1, 'Number | 1..3 | 5..10 | start');
  equal(mergedRange.end, 10, 'Number | 1..3 | 5..10 | end');

  mergedRange = range.union(Number.range(1, 1));
  equal(mergedRange.start, 1, 'Number | 1..1 | 5..10 | start');
  equal(mergedRange.end, 10, 'Number | 1..1 | 5..10 | end');

  mergedRange = range.union(Number.range(1, 20));
  equal(mergedRange.start, 1, 'Number | 1..20 | 5..10 | start');
  equal(mergedRange.end, 20, 'Number | 1..20 | 5..10 | end');

  mergedRange = range.union(Number.range(-5, 7));
  equal(mergedRange.start, -5, 'Number | -5..7 | 5..10 | start');
  equal(mergedRange.end, 10, 'Number | -5..7 | 5..10 | end');

  mergedRange = range.union(Number.range(-5, 50));
  equal(mergedRange.start, -5, 'Number | -5..50 | 5..10 | start');
  equal(mergedRange.end, 50, 'Number | -5..50 | 5..10 | end');

  mergedRange = range.intersect(Number.range(1, 5));
  equal(mergedRange.start, 5, 'Number | 1..5 & 5..10 | start');
  equal(mergedRange.end, 5, 'Number | 1..5 & 5..10 | end');

  mergedRange = range.intersect(Number.range(7, 8));
  equal(mergedRange.start, 7, 'Number | 7..8 & 5..10 | start');
  equal(mergedRange.end, 8, 'Number | 7..8 & 5..10 | end');

  mergedRange = range.intersect(Number.range(1, 4));
  equal(mergedRange.isValid(), false, 'Number | 1..4 & 5..10 | isValid');

  mergedRange = range.intersect(Number.range(1, 3));
  equal(mergedRange.isValid(), false, 'Number | 1..3 & 5..10 | isValid');

  mergedRange = range.intersect(Number.range(1, 1));
  equal(mergedRange.isValid(), false, 'Number | 1..1 & 5..10 | isValid');

  mergedRange = range.intersect(Number.range(1, 20));
  equal(mergedRange.start, 5, 'Number | 1..20 & 5..10 | start');
  equal(mergedRange.end, 10, 'Number | 1..20 & 5..10 | end');

  mergedRange = range.intersect(Number.range(-5, 7));
  equal(mergedRange.start, 5, 'Number | -5..7 & 5..10 | start');
  equal(mergedRange.end, 7, 'Number | -5..7 & 5..10 | end');

  mergedRange = range.intersect(Number.range(-5, 50));
  equal(mergedRange.start, 5, 'Number | -5..50 & 5..10 | start');
  equal(mergedRange.end, 10, 'Number | -5..50 & 5..10 | end');

  mergedRange = Number.range(-5, 5).intersect(Number.range(-20, 0));
  equal(mergedRange.start, -5, 'Number | -5..5 & -20..0 | start');
  equal(mergedRange.end, 0, 'Number | -5..5 & -20..0 | end');


  clonedRange = range.clone();

  equal(clonedRange.start, 5, 'Number | Range | cloned range start');
  equal(clonedRange.end, 10, 'Number | Range | cloned range end');
  equal(clonedRange === range, false, 'Number | Range | cloned range should not be strictly equal');


  count = 0;

  result = range.every(1, function() {
    count++;
  });

  equal(result, [5,6,7,8,9,10], 'Number | Range | result should be an array');
  equal(count, 6, 'Number | Range | every 1');

  count = 0;

  result = range.every(2, function() {
    count++;
  });

  equal(result, [5,7,9], 'Number | Range every 2 | result should be an array');
  equal(count, 3, 'Number | Range every 2 | count');

  count = 0;

  result = range.every(function() {
    count++;
  });

  equal(result, [5,6,7,8,9,10], 'Number | Range | result should be an array');
  equal(count, 6, 'Number | Range | every 1');


  equal(range.clamp(25), 10, 'Number | Range#clamp | 25');
  equal(range.clamp(10), 10, 'Number | Range#clamp | 10');
  equal(range.clamp(9),   9, 'Number | Range#clamp |  9');
  equal(range.clamp(8),   8, 'Number | Range#clamp |  8');
  equal(range.clamp(7),   7, 'Number | Range#clamp |  7');
  equal(range.clamp(6),   6, 'Number | Range#clamp |  6');
  equal(range.clamp(5),   5, 'Number | Range#clamp |  5');
  equal(range.clamp(4),   5, 'Number | Range#clamp |  4');
  equal(range.clamp(1),   5, 'Number | Range#clamp |  1');
  equal(range.clamp(0),   5, 'Number | Range#clamp |  0');
  equal(range.clamp(-1),  5, 'Number | Range#clamp | -1');

  equal((25).clamp(5, 10), 10, 'Number#clamp | 25');
  equal((10).clamp(5, 10), 10, 'Number#clamp | 10');
  equal((9).clamp(5, 10), 9, 'Number#clamp | 9');
  equal((8).clamp(5, 10), 8, 'Number#clamp | 8');
  equal((7).clamp(5, 10), 7, 'Number#clamp | 7');
  equal((6).clamp(5, 10), 6, 'Number#clamp | 6');
  equal((5).clamp(5, 10), 5, 'Number#clamp | 5');
  equal((4).clamp(5, 10), 5, 'Number#clamp | 4');
  equal((1).clamp(5, 10), 5, 'Number#clamp | 1');
  equal((0).clamp(5, 10), 5, 'Number#clamp | 0');
  equal((-1).clamp(5, 10), 5, 'Number#clamp | -1');

  equal((25).clamp(10, 5), 10, 'Number#clamp | inverted | 25');
  equal((10).clamp(10, 5), 10, 'Number#clamp | inverted | 10');
  equal((9).clamp(10, 5), 9, 'Number#clamp | inverted | 9');
  equal((8).clamp(10, 5), 8, 'Number#clamp | inverted | 8');
  equal((7).clamp(10, 5), 7, 'Number#clamp | inverted | 7');
  equal((6).clamp(10, 5), 6, 'Number#clamp | inverted | 6');
  equal((5).clamp(10, 5), 5, 'Number#clamp | inverted | 5');
  equal((4).clamp(10, 5), 5, 'Number#clamp | inverted | 4');
  equal((1).clamp(10, 5), 5, 'Number#clamp | inverted | 1');
  equal((0).clamp(10, 5), 5, 'Number#clamp | inverted | 0');
  equal((-1).clamp(10, 5), 5, 'Number#clamp | inverted | -1');

  equal((5).cap(6), 5, 'Number#cap | 5 capped to 6');
  equal((5).cap(5), 5, 'Number#cap | 5 capped to 5');
  equal((5).cap(4), 4, 'Number#cap | 5 capped to 4');
  equal((5).cap(1), 1, 'Number#cap | 5 capped to 1');
  equal((5).cap(0), 0, 'Number#cap | 5 capped to 0');
  equal((5).cap(-1), -1, 'Number#cap | 5 capped to -1');
  equal((5).cap(-5), -5, 'Number#cap | 5 capped to -5');
  equal((5).cap(-10), -10, 'Number#cap | 5 capped to -10');

  equal((0).cap(6), 0, 'Number#cap | 0 capped to 6');
  equal((0).cap(5), 0, 'Number#cap | 0 capped to 5');
  equal((0).cap(4), 0, 'Number#cap | 0 capped to 4');
  equal((0).cap(1), 0, 'Number#cap | 0 capped to 1');
  equal((0).cap(0), 0, 'Number#cap | 0 capped to 0');
  equal((0).cap(-1), -1, 'Number#cap | 0 capped to -1');
  equal((0).cap(-5), -5, 'Number#cap | 0 capped to -5');
  equal((0).cap(-10), -10, 'Number#cap | 0 capped to -10');

  equal((-5).cap(6), -5, 'Number#cap | -5 capped to 6');
  equal((-5).cap(5), -5, 'Number#cap | -5 capped to 5');
  equal((-5).cap(4), -5, 'Number#cap | -5 capped to 4');
  equal((-5).cap(1), -5, 'Number#cap | -5 capped to 1');
  equal((-5).cap(0), -5, 'Number#cap | -5 capped to 0');
  equal((-5).cap(-1), -5, 'Number#cap | -5 capped to -1');
  equal((-5).cap(-5), -5, 'Number#cap | -5 capped to -5');
  equal((-5).cap(-10), -10, 'Number#cap | -5 capped to -10');

  range = Number.range(4, 1);

  equal(range.toString(), '4..1', 'Number | Range | inverse | toString');
  equal(range.isValid(), true, 'Number | Range | inverse | isValid');
  equal(range.every(), [4,3,2,1], 'Number | Range | inverse | every');

  equal(Number.range(NaN, NaN).toString(), 'Invalid Range', 'Number | Range | invalid | toString');


  range = Number.range(1, Infinity);
  equal(range.contains(1), true, 'Number | 1..Infinity | contains 1');
  equal(range.contains(10), true, 'Number | 1..Infinity | contains 10');
  equal(range.contains(100), true, 'Number | 1..Infinity | contains 100');
  equal(range.contains(Infinity), true, 'Number | 1..Infinity | contains 100');
  equal(range.contains(0), false, 'Number | 1..Infinity | contains 0');
  equal(range.contains(-1), false, 'Number | 1..Infinity | contains -1');
  equal(range.contains(-10), false, 'Number | 1..Infinity | contains -10');
  equal(range.contains(-100), false, 'Number | 1..Infinity | contains -100');
  equal(range.contains(-Infinity), false, 'Number | 1..Infinity | contains -Infinity');

  range = Number.range(-Infinity, 1);
  equal(range.contains(1), true, 'Number | -Infinity..1 | contains 1');
  equal(range.contains(10), false, 'Number | -Infinity..1 | contains 10');
  equal(range.contains(100), false, 'Number | -Infinity..1 | contains 100');
  equal(range.contains(Infinity), false, 'Number | -Infinity..1 | contains 100');
  equal(range.contains(0), true, 'Number | -Infinity..1 | contains 0');
  equal(range.contains(-1), true, 'Number | -Infinity..1 | contains -1');
  equal(range.contains(-10), true, 'Number | -Infinity..1 | contains -10');
  equal(range.contains(-100), true, 'Number | -Infinity..1 | contains -100');
  equal(range.contains(-Infinity), true, 'Number | -Infinity..1 | contains -Infinity');

  range = Number.range(-Infinity, Infinity);
  equal(range.contains(1), true, 'Number | -Infinity..Infinity | contains 1');
  equal(range.contains(10), true, 'Number | -Infinity..Infinity | contains 10');
  equal(range.contains(100), true, 'Number | -Infinity..Infinity | contains 100');
  equal(range.contains(Infinity), true, 'Number | -Infinity..Infinity | contains 100');
  equal(range.contains(0), true, 'Number | -Infinity..Infinity | contains 0');
  equal(range.contains(-1), true, 'Number | -Infinity..Infinity | contains -1');
  equal(range.contains(-10), true, 'Number | -Infinity..Infinity | contains -10');
  equal(range.contains(-100), true, 'Number | -Infinity..Infinity | contains -100');
  equal(range.contains(-Infinity), true, 'Number | -Infinity..Infinity | contains -Infinity');

  range = Number.range(0, 0);
  equal(range.contains(-1), false, 'Number | 0..0 | contains -1');
  equal(range.contains(0), true, 'Number | 0..0 | contains 0');
  equal(range.contains(1), false, 'Number | 0..0 | contains 1');


  range = Number.range(null, null);
  equal(range.contains(-1), false, 'Number | null..null | contains -1');
  equal(range.contains(0), true, 'Number | null..null | contains 0');
  equal(range.contains(1), false, 'Number | null..null | contains 1');
  equal(range.isValid(), false, 'Number | null..null | isValid');


  range = Number.range(undefined, undefined);
  equal(range.contains(-1), false, 'Number | undefined..undefined | contains -1');
  equal(range.contains(0), false, 'Number | undefined..undefined | contains 0');
  equal(range.contains(1), false, 'Number | undefined..undefined | contains 1');
  equal(range.isValid(), false, 'Number | undefined..undefined | isValid');

  equal(Number.range(new Date(2010, 0).getTime(), new Date(2010, 2).getTime()).contains(new Date(2010, 0)), true, 'Number | range | contains different type');


  equal(Number.range(1, 5).every(null, function(){}), [1,2,3,4,5], 'Number | 1..5 | null increment defaults to 1');

  if(Array.create) {
    equal(Array.create(Number.range(1, 5)), [1,2,3,4,5], 'Array.create | should work on number ranges');
    equal(Array.create(Number.range(5, 1)), [5,4,3,2,1], 'Array.create | should work on inverse number ranges');
  }

});
