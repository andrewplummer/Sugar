
test('Number Ranges', function () {

  var range;
  var mergedRange;
  var clonedRange;
  var stepResult;
  var count;

  range = Number.range(5, 10);

  equal(range.toString(), '5..10', 'Number | Range | toString');
  equal(range.isValid(), true, 'Number | Range | isValid');
  equal(range.size(), 5, 'Number | Range | size');
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

  stepResult = range.step(1, function() {
    count++;
  });

  equal(stepResult, [5,6,7,8,9,10], 'Number | Range | result should be an array');
  equal(count, 6, 'Number | Range | step 1');

  count = 0;

  stepResult = range.step(2, function() {
    count++;
  });

  equal(stepResult, [5,7,9], 'Number | Range step 2 | result should be an array');
  equal(count, 3, 'Number | Range step 2 | count');

  count = 0;

  stepResult = range.step(function() {
    count++;
  });

  equal(stepResult, [5,6,7,8,9,10], 'Number | Range | result should be an array');
  equal(count, 6, 'Number | Range | step 1');


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

  range = Number.range(4, 1);

  equal(range.toString(), '1..4', 'Number | Range | inverse | toString');
  equal(range.isValid(), true, 'Number | Range | inverse | isValid');

  equal(Number.range(NaN, NaN).toString(), 'Invalid range.', 'Number | Range | invalid | toString');

});
