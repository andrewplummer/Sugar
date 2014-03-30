package('String | Ranges', function () {

  function getRange(from, to) {
    return run(String, 'range', [from, to]);
  }

  group('basics', function() {
    var range = getRange('k', 'o');

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

    var range = getRange('o', 'k');

    equal(range.toString(), 'o..k', 'String | Range | inverse | toString');
    equal(range.isValid(), true, 'String | Range | inverse | isValid');

    equal(getRange(NaN, NaN).toString(), 'Invalid Range', 'String | Range | invalid | toString');

  });

  method('union', function() {
    var range = getRange('k', 'o');

    var mergedRange = range.union(getRange('h', 'm'));
    equal(mergedRange.start, 'h', 'String | h..m | k..o | start');
    equal(mergedRange.end, 'o', 'String | h..m | k..o | end');

    var mergedRange = range.union(getRange('a', 'd'));
    equal(mergedRange.start, 'a', 'String | a..d | k..o | start');
    equal(mergedRange.end, 'o', 'String | a..d | a..d | end');

    var mergedRange = range.union(getRange('a', 'c'));
    equal(mergedRange.start, 'a', 'String | a..c | k..o | start');
    equal(mergedRange.end, 'o', 'String | a..c | k..o | end');

    var mergedRange = range.union(getRange('a', 'a'));
    equal(mergedRange.start, 'a', 'String | a..a | k..o | start');
    equal(mergedRange.end, 'o', 'String | a..a | k..o | end');

    var mergedRange = range.union(getRange('a', 'z'));
    equal(mergedRange.start, 'a', 'String | a..z | k..o | start');
    equal(mergedRange.end, 'z', 'String | a..z | k..o | end');

    var mergedRange = range.union(getRange('', ''));
    equal(mergedRange.isValid(), false, 'String | .. | k..o | is not valid');
    equal(mergedRange.start, '', 'String | .. | k..o | start');
    equal(mergedRange.end, 'o', 'String | .. | k..o | end');
  });

  method('intersect', function() {
    var range = getRange('k', 'o');

    var mergedRange = range.intersect(getRange('a', 'd'));
    equal(mergedRange.isValid(), false, 'String | a..d | k..o | invalid');

    var mergedRange = range.intersect(getRange('c', 'l'));
    equal(mergedRange.start, 'k', 'String | c..l | k..o | start');
    equal(mergedRange.end, 'l', 'String | c..l | k..o | end');

    var mergedRange = range.intersect(getRange('l', 'n'));
    equal(mergedRange.start, 'l', 'String | l..n | k..o | start');
    equal(mergedRange.end, 'n', 'String | l..n | k..o | end');

    var mergedRange = range.intersect(getRange('n', 'q'));
    equal(mergedRange.start, 'n', 'String | n..q | k..o | start');
    equal(mergedRange.end, 'o', 'String | n..q | k..o | end');

    var mergedRange = range.intersect(getRange('s', 'z'));
    equal(mergedRange.isValid(), false, 'String | s..z | k..o | invalid');

  });

  method('clone', function() {
    var range = getRange('k', 'o');
    var clonedRange = range.clone();

    equal(clonedRange.start, 'k', 'String | Range | cloned range start');
    equal(clonedRange.end, 'o', 'String | Range | cloned range end');
    equal(clonedRange === range, false, 'String | Range | cloned range should not be strictly equal');

  });

  method('every', function() {
    var range = getRange('k', 'o');

    var count = 0;
    var result = range.every(1, function() {
      count++;
    });

    equal(result, ['k','l','m','n','o'], 'String | Range | result should be an array');
    equal(count, 5, 'String | Range | every 1');

    var count = 0;
    var result = range.every(2, function() {
      count++;
    });

    equal(result, ['k','m','o'], 'String | Range every 2 | result should be an array');
    equal(count, 3, 'String | Range every 2 | count');

    var count = 0;
    var result = range.every(function() {
      count++;
    });
    equal(result, ['k','l','m','n','o'], 'String | Range | result should be an array');
    equal(count, 5, 'String | Range | every 1');

  });

  method('clamp', function() {
    var range = getRange('k', 'o');

    equal(range.clamp('z'), 'o', 'String | Range#clamp | z');
    equal(range.clamp('j'), 'k', 'String | Range#clamp | j');
    equal(range.clamp('k'), 'k', 'String | Range#clamp | k');
    equal(range.clamp('l'), 'l', 'String | Range#clamp | l');
    equal(range.clamp('n'), 'n', 'String | Range#clamp | n');
    equal(range.clamp('o'), 'o', 'String | Range#clamp | o');
    equal(range.clamp('p'), 'o', 'String | Range#clamp | p');
    equal(range.clamp(-1), -1, 'String | Range#clamp | -1');
    equal(range.clamp(0),   0, 'String | Range#clamp | 0');
    equal(range.clamp(1),   1, 'String | Range#clamp | 1');

  });

});
