
test('String Ranges', function () {

  var range;
  var mergedRange;
  var clonedRange;
  var result;
  var count;

  range = String.range('k', 'o');

  equal(range.toString(), 'k..o', 'String | Range | toString');
  equal(range.isValid(), true, 'String | Range | isValid');
  equal(range.span(), 5, 'String | Range | span');
  equal(range.contains(), false, 'String | Range | contains undefined');
  equal(range.contains('j'), false, 'String | Range | contains j');
  equal(range.contains('k'), true, 'String | Range | contains k');
  equal(range.contains('l'), true, 'String | Range | contains l');
  equal(range.contains('m'), true, 'String | Range | contains m');
  equal(range.contains('n'), true, 'String | Range | contains n');
  equal(range.contains('o'), true, 'String | Range | contains o');
  equal(range.contains('p'), false, 'String | Range | contains p');


  mergedRange = range.union(String.range('h', 'm'));
  equal(mergedRange.start, 'h', 'String | h..m | k..o | start');
  equal(mergedRange.end, 'o', 'String | h..m | k..o | end');


  mergedRange = range.union(String.range('a', 'd'));
  equal(mergedRange.start, 'a', 'String | a..d | k..o | start');
  equal(mergedRange.end, 'o', 'String | a..d | a..d | end');

  mergedRange = range.union(String.range('a', 'c'));
  equal(mergedRange.start, 'a', 'String | a..c | k..o | start');
  equal(mergedRange.end, 'o', 'String | a..c | k..o | end');

  mergedRange = range.union(String.range('a', 'a'));
  equal(mergedRange.start, 'a', 'String | a..a | k..o | start');
  equal(mergedRange.end, 'o', 'String | a..a | k..o | end');

  mergedRange = range.union(String.range('a', 'z'));
  equal(mergedRange.start, 'a', 'String | a..z | k..o | start');
  equal(mergedRange.end, 'z', 'String | a..z | k..o | end');


  mergedRange = range.union(String.range('', ''));
  equal(mergedRange.isValid(), false, 'String | .. | k..o | is not valid');
  equal(mergedRange.start, '', 'String | .. | k..o | start');
  equal(mergedRange.end, 'o', 'String | .. | k..o | end');
  return;

  mergedRange = range.union(String.range(-5, 50));
  equal(mergedRange.start, -5, 'String | -5..50 | 5..10 | start');
  equal(mergedRange.end, 50, 'String | -5..50 | 5..10 | end');

  mergedRange = range.intersect(String.range(1, 5));
  equal(mergedRange.start, 5, 'String | 1..5 & 5..10 | start');
  equal(mergedRange.end, 5, 'String | 1..5 & 5..10 | end');

  mergedRange = range.intersect(String.range(7, 8));
  equal(mergedRange.start, 7, 'String | 7..8 & 5..10 | start');
  equal(mergedRange.end, 8, 'String | 7..8 & 5..10 | end');

  mergedRange = range.intersect(String.range(1, 4));
  equal(mergedRange.isValid(), false, 'String | 1..4 & 5..10 | isValid');

  mergedRange = range.intersect(String.range(1, 3));
  equal(mergedRange.isValid(), false, 'String | 1..3 & 5..10 | isValid');

  mergedRange = range.intersect(String.range(1, 1));
  equal(mergedRange.isValid(), false, 'String | 1..1 & 5..10 | isValid');

  mergedRange = range.intersect(String.range(1, 20));
  equal(mergedRange.start, 5, 'String | 1..20 & 5..10 | start');
  equal(mergedRange.end, 10, 'String | 1..20 & 5..10 | end');

  mergedRange = range.intersect(String.range(-5, 7));
  equal(mergedRange.start, 5, 'String | -5..7 & 5..10 | start');
  equal(mergedRange.end, 7, 'String | -5..7 & 5..10 | end');

  mergedRange = range.intersect(String.range(-5, 50));
  equal(mergedRange.start, 5, 'String | -5..50 & 5..10 | start');
  equal(mergedRange.end, 10, 'String | -5..50 & 5..10 | end');

  mergedRange = String.range(-5, 5).intersect(String.range(-20, 0));
  equal(mergedRange.start, -5, 'String | -5..5 & -20..0 | start');
  equal(mergedRange.end, 0, 'String | -5..5 & -20..0 | end');


  clonedRange = range.clone();

  equal(clonedRange.start, 5, 'String | Range | cloned range start');
  equal(clonedRange.end, 10, 'String | Range | cloned range end');
  equal(clonedRange === range, false, 'String | Range | cloned range should not be strictly equal');


  count = 0;

  result = range.every(1, function() {
    count++;
  });

  equal(result, [5,6,7,8,9,10], 'String | Range | result should be an array');
  equal(count, 6, 'String | Range | every 1');

  count = 0;

  result = range.every(2, function() {
    count++;
  });

  equal(result, [5,7,9], 'String | Range every 2 | result should be an array');
  equal(count, 3, 'String | Range every 2 | count');

  count = 0;

  result = range.every(function() {
    count++;
  });

  equal(result, [5,6,7,8,9,10], 'String | Range | result should be an array');
  equal(count, 6, 'String | Range | every 1');


  equal(range.clamp(25), 10, 'String | Range#clamp | 25');
  equal(range.clamp(10), 10, 'String | Range#clamp | 10');
  equal(range.clamp(9),   9, 'String | Range#clamp |  9');
  equal(range.clamp(8),   8, 'String | Range#clamp |  8');
  equal(range.clamp(7),   7, 'String | Range#clamp |  7');
  equal(range.clamp(6),   6, 'String | Range#clamp |  6');
  equal(range.clamp(5),   5, 'String | Range#clamp |  5');
  equal(range.clamp(4),   5, 'String | Range#clamp |  4');
  equal(range.clamp(1),   5, 'String | Range#clamp |  1');
  equal(range.clamp(0),   5, 'String | Range#clamp |  0');
  equal(range.clamp(-1),  5, 'String | Range#clamp | -1');

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

  range = String.range(4, 1);

  equal(range.toString(), '1..4', 'String | Range | inverse | toString');
  equal(range.isValid(), true, 'String | Range | inverse | isValid');

  equal(String.range(NaN, NaN).toString(), 'Invalid Range', 'String | Range | invalid | toString');


});
