package('Date | Ranges', function () {

  testSetLocale('en');

  function createRange() {
    return run(Date, 'range', arguments);
  }

  group('Basics', function() {

    var range = createRange(NaN, NaN);

    equal(range.isValid(), false, 'invalid range');
    equal(typeof range.start.getTime, 'function', 'Invalid | start is not minified');
    equal(typeof range.end.getTime, 'function', 'Invalid | end is not minified');
    equal(isNaN(range.span()), true, 'Invalid | has no duration');
    equal(range.toString(), 'Invalid Range', 'Invalid | invalid toString');

    var d1 = new Date(2011,8,10,9);
    var d2 = new Date(2010,10,10,9);
    var range = createRange(d1, d2);

    equal(range.isValid(), true, 'Inverted | range');
    equal(typeof range.start.getTime, 'function', 'Inverted | start is not minified');
    equal(typeof range.end.getTime, 'function', 'Inverted | end is not minified');
    equal(range.span(), Math.abs(d2 - d1) + 1, 'Inverted | duration');
    equal(range.toString(), new Date(2011,8,10,9).toString() + '..' + new Date(2010,10,10,9).toString(), 'Inverted | toString');

    var range = createRange(new Date(2010,6,10,9), new Date(2010,8,10,9));

    tzOffset = range.end.getTimezoneOffset() - range.start.getTimezoneOffset();

    equal(range.toString(), new Date(2010,6,10,9).toString() + '..' + new Date(2010,8,10,9).toString(), 'toString');
    equal(range.span(), new Date(2010,8,10,9) - new Date(2010,6,10,9) + (tzOffset * 60 * 1000) + 1, 'duration');
    equal(range.isValid(), true, 'valid range');

    equal(range.every('year'), [new Date(2010,6,10,9)], 'Range#every | 2010-9 - 2010-11');

  });

  group('Creation', function() {

    var range = createRange(new Date(2010,6,10,9), new Date(2010,8,10,9));
    dateEqual(range.start, new Date(2010,6,10,9), 'Start has not been modified');
    dateEqual(range.end, new Date(2010,8,10,9), 'End has not been modified');

    var range = createRange(new Date(2010,3,25));
    dateEqual(range.start, new Date(2010,3,25), 'null end | start');
    dateEqual(range.end, new Date(), 'null end is current time');

    var range = createRange(null, new Date(2010,3,25));
    dateEqual(range.start, new Date(0), 'null starts at epoch');
    dateEqual(range.end, new Date(2010,3,25), 'start is reversed when null is current');

    var range = createRange();
    dateEqual(range.start, new Date(), 'both null | start');
    dateEqual(range.end, new Date(), 'both null | end');

  });


  group('Creation with extended', function() {
    if(!Sugar.Date.create) return;

    // Date ranges should be able to be created from a string

    var range = createRange('2 hours ago', 'now');
    equal(range.isValid(), true, 'Date.range | understands relative strings');

    var range = createRange('2001', '2003');
    var testStart = testCreateDate('2001');
    var testEnd   = testCreateDate('2003');
    dateEqual(range.start, testStart, 'Date.range | strings | start is equal');
    dateEqual(range.end,   testEnd, 'Date.range | strings | end is equal');

    // Issue #367 Advanced date ranges
    dateRangeEqual(createRange('monday to thursday'), createRange('monday', 'thursday'), 'advanced text ranges');
    dateRangeEqual(createRange('from monday to thursday'), createRange('monday', 'thursday'), 'advanced text ranges | from');
    dateRangeEqual(createRange('from monday until thursday'), createRange('monday', 'thursday'), 'advanced text ranges | from..until');
    dateRangeEqual(createRange('tomorrow at 3pm for 30 minutes'), createRange('3pm tomorrow', '3:30pm tomorrow'), 'advanced text ranges | for');
    dateRangeEqual(createRange('1 hour starting at 3:15 monday'), createRange('3:15 monday', '4:15 monday'), 'advanced text ranges | starting at');
    dateRangeEqual(createRange('for 1 hour starting at 3:15 monday'), createRange('3:15 monday', '4:15 monday'), 'advanced text ranges | for..starting at');
    dateRangeEqual(createRange('foobar'), createRange(), 'invalid string is the same as no arguments');

  });


  method('every', function() {
    var count = 0;
    var range = createRange(new Date(2010,6,10,9), new Date(2010,8,10,9));

    expected = [new Date(2010,6,10,9), new Date(2010,7,10,9), new Date(2010,8,10,9)]
    result = range.every('month', function(d, index) {
      dateEqual(d, expected[count], 'date is first argument');
      equal(index, count, 'index is second argument');
      count++;
    });
    equal(result, expected, '2010-9 - 2010-11 | every month');
    equal(count, 3, '2010-9 - 2010-11 | has iterated 3 times');

    equal(range.every('year'), [new Date(2010,6,10,9)], '2010-9 - 2010-11 | every year');
    equal(range.every('month'), [new Date(2010,6,10,9), new Date(2010,7,10,9), new Date(2010,8,10,9)], '2010-9 - 2010-11 | every month');

    // Discrepancies exist here because of the definition of a month
    equal(range.every(2 * 30.4375 * 24 * 60 * 60 * 1000), [new Date(2010,6,10,9), new Date(2010,8,9,6)], '2010-9 - 2010-11 | every 2 months');

    equal(range.every(10 * 24 * 60 * 60 * 1000), [new Date(2010,6,10,9), new Date(2010,6,20,9), new Date(2010,6,30,9), new Date(2010,7,9,9), new Date(2010,7,19,9), new Date(2010,7,29,9), new Date(2010,8,8,9)], '2010-9 - 2010-11 | every 10 days');

    // This version will run every month then iterate over every other
    equal(range.every('2 months'), [new Date(2010,6,10,9), new Date(2010,8,10,9)], '2010-9 - 2010-11 | every 2 months text format');

    equal(range.every('day'), [new Date(2010,6,10,9), new Date(2010,6,11,9), new Date(2010,6,12,9), new Date(2010,6,13,9), new Date(2010,6,14,9), new Date(2010,6,15,9), new Date(2010,6,16,9), new Date(2010,6,17,9), new Date(2010,6,18,9), new Date(2010,6,19,9), new Date(2010,6,20,9), new Date(2010,6,21,9), new Date(2010,6,22,9), new Date(2010,6,23,9), new Date(2010,6,24,9), new Date(2010,6,25,9), new Date(2010,6,26,9), new Date(2010,6,27,9), new Date(2010,6,28,9), new Date(2010,6,29,9), new Date(2010,6,30,9), new Date(2010,6,31,9), new Date(2010,7,1,9), new Date(2010,7,2,9), new Date(2010,7,3,9), new Date(2010,7,4,9), new Date(2010,7,5,9), new Date(2010,7,6,9), new Date(2010,7,7,9), new Date(2010,7,8,9), new Date(2010,7,9,9), new Date(2010,7,10,9), new Date(2010,7,11,9), new Date(2010,7,12,9), new Date(2010,7,13,9), new Date(2010,7,14,9), new Date(2010,7,15,9), new Date(2010,7,16,9), new Date(2010,7,17,9), new Date(2010,7,18,9), new Date(2010,7,19,9), new Date(2010,7,20,9), new Date(2010,7,21,9), new Date(2010,7,22,9), new Date(2010,7,23,9), new Date(2010,7,24,9), new Date(2010,7,25,9), new Date(2010,7,26,9), new Date(2010,7,27,9), new Date(2010,7,28,9), new Date(2010,7,29,9), new Date(2010,7,30,9), new Date(2010,7,31,9), new Date(2010,8,1,9), new Date(2010,8,2,9), new Date(2010,8,3,9), new Date(2010,8,4,9), new Date(2010,8,5,9), new Date(2010,8,6,9), new Date(2010,8,7,9), new Date(2010,8,8,9), new Date(2010,8,9,9), new Date(2010,8,10,9) ], '2010-9 - 2010 - 11 | every day');

    var range = createRange(new Date(2010,3,25,12), new Date(2010,3,25,18)); 

    equal(range.every('hour'), [new Date(2010,3,25,12),new Date(2010,3,25,13),new Date(2010,3,25,14),new Date(2010,3,25,15),new Date(2010,3,25,16),new Date(2010,3,25,17),new Date(2010,3,25,18)], 'every hour');

    equal(range.every('HOUR'), [new Date(2010,3,25,12),new Date(2010,3,25,13),new Date(2010,3,25,14),new Date(2010,3,25,15),new Date(2010,3,25,16),new Date(2010,3,25,17),new Date(2010,3,25,18)], 'every hour | capitalized');

    var range = createRange(new Date(2010,3,25,12,30), new Date(2010,3,25,12,40));

    equal(range.every('minute'), [new Date(2010,3,25,12,30),new Date(2010,3,25,12,31),new Date(2010,3,25,12,32),new Date(2010,3,25,12,33),new Date(2010,3,25,12,34),new Date(2010,3,25,12,35),new Date(2010,3,25,12,36),new Date(2010,3,25,12,37),new Date(2010,3,25,12,38),new Date(2010,3,25,12,39),new Date(2010,3,25,12,40)], 'every minute');


    var range = createRange(new Date(2010,3,25,12,30,30), new Date(2010,3,25,12,30,40));
    equal(range.every('second'), [new Date(2010,3,25,12,30,30),new Date(2010,3,25,12,30,31),new Date(2010,3,25,12,30,32),new Date(2010,3,25,12,30,33),new Date(2010,3,25,12,30,34),new Date(2010,3,25,12,30,35),new Date(2010,3,25,12,30,36),new Date(2010,3,25,12,30,37),new Date(2010,3,25,12,30,38),new Date(2010,3,25,12,30,39),new Date(2010,3,25,12,30,40)], 'every second');


    var range = createRange(new Date(2010,3,25,12,30,30,500), new Date(2010,3,25,12,30,30,505));
    equal(range.every('millisecond'), [new Date(2010,3,25,12,30,30,500),new Date(2010,3,25,12,30,30,501),new Date(2010,3,25,12,30,30,502),new Date(2010,3,25,12,30,30,503),new Date(2010,3,25,12,30,30,504),new Date(2010,3,25,12,30,30,505)], 'every millisecond');

    // Every millisecond for 2 milliseconds

    var t = 1275318000000;
    var d1 = new Date(t);
    var d2 = new Date(t + 2);
    equal(createRange(d1, d2).every(), [new Date(t), new Date(t + 1), new Date(t + 2)], 'every should work without arguments');

    // Handles inverse date ranges.
    var d1 = new Date(t);
    var d2 = new Date(t - 2);
    equal(createRange(d1, d2).every(), [new Date(t), new Date(t - 1), new Date(t - 2)], 'should increment down when inverted');

  });

  method('contains', function() {
    var range = createRange(new Date(2010,6,10,9), new Date(2010,8,10,9));
    equal(range.contains(new Date(2010, 5,  10)), false, 'before');
    equal(range.contains(new Date(2010, 7,  10)), true, 'middle');
    equal(range.contains(new Date(2010, 9, 10)), false, 'after');
    equal(range.contains(createRange(new Date(2010,6,10,9), new Date(2010,7,10,9))), true, 'contained range');
    equal(range.contains(createRange(new Date(2010,4,10), new Date(2010,7,10,9))), false, '9 hours before the start');
    equal(range.contains(createRange(new Date(2010,4,10,9), new Date(2010,6,10,10))), false, '1 minute after the end');
  });

  method('union', function() {
    var range1 = createRange(testCreateDate('2001'), testCreateDate('2003'));
    var range2 = createRange(testCreateDate('2002'), testCreateDate('2004'));
    var range = range1.union(range2);

    dateRangeEqual(range, createRange(testCreateDate('2001'), testCreateDate('2004')), 'simple merge');
    dateRangeEqual(range1, createRange(testCreateDate('2001'), testCreateDate('2003')), 'range1 has not changed');
    dateRangeEqual(range2, createRange(testCreateDate('2002'), testCreateDate('2004')), 'range2 has not changed');

    // Union of non-overlapping ranges

    var range1 = createRange(testCreateDate('2001'), testCreateDate('2003'));
    var range2 = createRange(testCreateDate('2005'), testCreateDate('2008'));
    var range = range1.union(range2);

    dateRangeEqual(range, createRange(testCreateDate('2001'), testCreateDate('2008')), 'non-overlapping includes middle');
    dateRangeEqual(range1, createRange(testCreateDate('2001'), testCreateDate('2003')), 'range1 has not changed');
    dateRangeEqual(range2, createRange(testCreateDate('2005'), testCreateDate('2008')), 'range2 has not changed');

    // Union of reversed overlapping ranges

    var range1 = createRange(testCreateDate('2002'), testCreateDate('2004'));
    var range2 = createRange(testCreateDate('2001'), testCreateDate('2003'));
    var range = range1.union(range2);

    dateRangeEqual(range, createRange(testCreateDate('2001'), testCreateDate('2004')), 'reversed | simple merge');


    // Union of reversed non-overlapping ranges

    var range1 = createRange(testCreateDate('2005'), testCreateDate('2008'));
    var range2 = createRange(testCreateDate('2001'), testCreateDate('2003'));
    var range = range1.union(range2);

    dateRangeEqual(range, createRange(testCreateDate('2001'), testCreateDate('2008')), 'reversed | includes middle');

  });

  method('intersect', function() {

    // Intersect of overlapping ranges

    var range1 = createRange(testCreateDate('2001'), testCreateDate('2003'));
    var range2 = createRange(testCreateDate('2002'), testCreateDate('2004'));
    var range = range1.intersect(range2);

    dateRangeEqual(range, createRange(testCreateDate('2002'), testCreateDate('2003')), 'simple merge');
    dateRangeEqual(range1, createRange(testCreateDate('2001'), testCreateDate('2003')), 'range1 has not changed');
    dateRangeEqual(range2, createRange(testCreateDate('2002'), testCreateDate('2004')), 'range2 has not changed');

    // Intersect of non-overlapping ranges

    var range1 = createRange(testCreateDate('2001'), testCreateDate('2003'));
    var range2 = createRange(testCreateDate('2005'), testCreateDate('2008'));
    var range = range1.intersect(range2);

    equal(range.isValid(), false, 'non-overlapping ranges are invalid');


    // Intersect of reversed overlapping ranges

    var range1 = createRange(testCreateDate('2002'), testCreateDate('2004'));
    var range2 = createRange(testCreateDate('2001'), testCreateDate('2003'));
    var range = range1.intersect(range2);

    dateRangeEqual(range, createRange(testCreateDate('2002'), testCreateDate('2003')), 'simple merge');

    // Intersect of reversed non-overlapping ranges

    var range1 = createRange(testCreateDate('2005'), testCreateDate('2008'));
    var range2 = createRange(testCreateDate('2001'), testCreateDate('2003'));
    var range = range1.intersect(range2);

    equal(range.isValid(), false, 'non-overlapping ranges are invalid');

  });

  group('Other', function() {
    // Modifying the start date of a range shouldn't affect the range.
    var d = new Date();
    var range = createRange(d);
    d.setTime(410194800000);
    equal(range.start.getTime() === 410194800000, false, 'Date.range | start time of the range should not be affected');
  });

  method('clone', function() {

    // Range cloning (Issue #230)
    var range1 = createRange(testCreateDate('2002'), testCreateDate('2004'));
    var range2 = range1.clone();

    equal(range1, range2, 'clone object is equal by value');
    equal(range1 === range2, false, 'clone is not strictly equal');

    // Deep range cloning

    var d1 = new Date(2010, 0);
    var d2 = new Date(2010, 2);

    range1 = createRange(d1, d2);

    range2 = range1.clone();

    range2.start.setFullYear(1999);
    range2.end.setFullYear(2002);

    equal(range1.start.getFullYear(), 2010, 'members should be cloned when range is cloned | start');
    equal(range1.end.getFullYear(), 2010, 'members should be cloned when range is cloned | start');

  });


  method('clamp', function() {
    var range = createRange(new Date(2010, 0), new Date(2011, 0));

    dateEqual(range.clamp(new Date(2008, 0)), new Date(2010, 0), 'low');
    dateEqual(range.clamp(new Date(2012, 0)), new Date(2011, 0), 'high');
    dateEqual(range.clamp(new Date(2010, 6)), new Date(2010, 6), 'mid');
    dateEqual(range.clamp(new Date(2010, 0)), new Date(2010, 0), 'low equal');
    dateEqual(range.clamp(new Date(2011, 0)), new Date(2011, 0), 'high equal');

    dateEqual(range.clamp(2), new Date(2010, 0), 'low number');
    dateEqual(range.clamp(new Date(2013, 5).getTime()), new Date(2011, 0), 'high number');
    equal(range.clamp(new Date(2010, 5).getTime()), new Date(2010, 5).getTime(), 'mid number');
  });

});
