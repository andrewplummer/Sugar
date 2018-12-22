namespace('Date Ranges', function () {
  'use strict';

  function getRange() {
    return Sugar.Date.range.apply(null, testGetArgs(arguments));
  }

  function assertDateArrayIsSequential(arr, amt) {
    var sequential = true;
    for (var i = 1; i < arr.length; i++) {
      var d1 = arr[i - 1];
      var d2 = arr[i];
      if (d2 - d1 !== amt) {
        sequential = false;
      }
    }
    equal(sequential, true, 'sequence should be sequential');
  }

  setup(function() {
    testSetLocale('en');
  });

  group('Basics', function() {

    var range = getRange(NaN, NaN);

    equal(range.isValid(), false, 'invalid range');
    equal(typeof range.start.getTime, 'function', 'Invalid | start is not minified');
    equal(typeof range.end.getTime, 'function', 'Invalid | end is not minified');
    equal(isNaN(range.span()), true, 'Invalid | has no duration');
    equal(range.toString(), 'Invalid Range', 'Invalid | invalid toString');

    var d1 = new Date(2011,8,10,9);
    var d2 = new Date(2010,10,10,9);
    var range = getRange(d1, d2);

    equal(range.isValid(), true, 'Inverted | range');
    equal(typeof range.start.getTime, 'function', 'Inverted | start is not minified');
    equal(typeof range.end.getTime, 'function', 'Inverted | end is not minified');
    equal(range.span(), Math.abs(d2 - d1) + 1, 'Inverted | duration');
    equal(range.toString(), new Date(2011,8,10,9).toString() + '..' + new Date(2010,10,10,9).toString(), 'Inverted | toString');

    var range = getRange(new Date(2010,6,10,9), new Date(2010,8,10,9));

    var tzOffset = range.end.getTimezoneOffset() - range.start.getTimezoneOffset();

    equal(range.toString(), new Date(2010,6,10,9).toString() + '..' + new Date(2010,8,10,9).toString(), 'toString');
    equal(range.span(), new Date(2010,8,10,9) - new Date(2010,6,10,9) + 1, 'duration');
    equal(range.isValid(), true, 'valid range');

    equal(range.every('year'), [new Date(2010,6,10,9)], 'Range#every | 2010-9 - 2010-11');

    // Testing without Sugar.Date.create

    var capturedCreate = Sugar.Date.create;
    delete Sugar.Date.create;

    var d1 = new Date(2011,8,10,9), d2 = new Date(2010,10,10,9);
    var range = getRange(d1.getTime(), d2.getTime());
    equal(range.isValid(), true, 'Range created from native constructor is valid');
    equal(range.span(), Math.abs(d2 - d1) + 1, 'Range created from native constructor has correct span');

    Sugar.Date.create = capturedCreate;

  });

  group('Creation', function() {

    var range = getRange(new Date(2010,6,10,9), new Date(2010,8,10,9));
    equal(range.start, new Date(2010,6,10,9), 'Start has not been modified');
    equal(range.end, new Date(2010,8,10,9), 'End has not been modified');

    var range = getRange(new Date(2010,3,25));
    equal(range.start, new Date(2010,3,25), 'undefined end | start');
    equal(range.end, new Date(), 'undefined end is current time');

    var range = getRange(null, new Date(2010,3,25));
    equal(range.start, new Date(), 'null should be the same as undefined');
    equal(range.end, new Date(2010,3,25), 'start is reversed when undefined is current');

    var range = getRange();
    equal(range.start, new Date(), 'both undefined | start');
    equal(range.end, new Date(), 'both undefined | end');

  });


  group('Creation with Date.create support', function() {

    if(!Sugar.Date.create) return;

    // Date ranges should be able to be created from a string

    var range = getRange('2 hours ago', 'now');
    equal(range.isValid(), true, 'Date.range | understands relative strings');

    var range = getRange('2001', '2003');
    var testStart = new Date(2001, 0);
    var testEnd   = new Date(2003, 0);
    equal(range.start, testStart, 'Date.range | strings | start is equal');
    equal(range.end,   testEnd, 'Date.range | strings | end is equal');

    // Issue #367 Advanced date ranges
    assertRangeEqual(getRange('monday to thursday'), getRange('monday', 'thursday'), 'advanced text ranges');
    assertRangeEqual(getRange('from monday to thursday'), getRange('monday', 'thursday'), 'advanced text ranges | from');
    assertRangeEqual(getRange('from monday until thursday'), getRange('monday', 'thursday'), 'advanced text ranges | from..until');
    assertRangeEqual(getRange('tomorrow at 3pm for 30 minutes'), getRange('3pm tomorrow', '3:30pm tomorrow'), 'advanced text ranges | for');
    assertRangeEqual(getRange('tomorrow from 3pm to 5pm'), getRange('3pm tomorrow', '5pm tomorrow'), 'advanced text ranges | from');
    assertRangeEqual(getRange('monday 3pm to saturday 5pm'), getRange('3pm monday', '5pm saturday'), 'advanced text ranges | from different days');
    assertRangeEqual(getRange('1 hour starting at 3:15 monday'), getRange('3:15 monday', '4:15 monday'), 'advanced text ranges | starting at');
    assertRangeEqual(getRange('1 hour starting at 3:15 on monday'), getRange('3:15 monday', '4:15 monday'), 'advanced text ranges | starting at..on');
    assertRangeEqual(getRange('for 1 hour starting at 3:15 monday'), getRange('3:15 monday', '4:15 monday'), 'advanced text ranges | for..starting at');
    assertRangeEqual(getRange('for 5 days starting Tuesday'), getRange('Tuesday', 'next Sunday'), 'advanced text ranges | for..starting');

    assertRangeEqual(getRange('monday'), getRange('monday', new Date()), 'advanced text ranges | single date');
    assertRangeEqual(getRange('foobar'), getRange(NaN, new Date()), 'invalid string is the same as no arguments');

  });

  method('every', function() {
    var count = 0;
    var range = getRange(new Date(2010,6,10,9), new Date(2010,8,10,9));

    var expected = [new Date(2010,6,10,9), new Date(2010,7,10,9), new Date(2010,8,10,9)];
    var result = range.every('month', function(d, index, r) {
      equal(d, expected[count], 'The first argument is the date.');
      equal(index, count, 'The second argument is the index.');
      equal(r, range, 'The third argument is the range.');
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

    var range = getRange(new Date(2010,3,25,12), new Date(2010,3,25,18)); 

    equal(range.every('hour'), [new Date(2010,3,25,12),new Date(2010,3,25,13),new Date(2010,3,25,14),new Date(2010,3,25,15),new Date(2010,3,25,16),new Date(2010,3,25,17),new Date(2010,3,25,18)], 'every hour');

    equal(range.every('HOUR'), [new Date(2010,3,25,12),new Date(2010,3,25,13),new Date(2010,3,25,14),new Date(2010,3,25,15),new Date(2010,3,25,16),new Date(2010,3,25,17),new Date(2010,3,25,18)], 'every hour | capitalized');

    var range = getRange(new Date(2010,3,25,12,30), new Date(2010,3,25,12,40));

    equal(range.every('minute'), [new Date(2010,3,25,12,30),new Date(2010,3,25,12,31),new Date(2010,3,25,12,32),new Date(2010,3,25,12,33),new Date(2010,3,25,12,34),new Date(2010,3,25,12,35),new Date(2010,3,25,12,36),new Date(2010,3,25,12,37),new Date(2010,3,25,12,38),new Date(2010,3,25,12,39),new Date(2010,3,25,12,40)], 'every minute');


    var range = getRange(new Date(2010,3,25,12,30,30), new Date(2010,3,25,12,30,40));
    equal(range.every('second'), [new Date(2010,3,25,12,30,30),new Date(2010,3,25,12,30,31),new Date(2010,3,25,12,30,32),new Date(2010,3,25,12,30,33),new Date(2010,3,25,12,30,34),new Date(2010,3,25,12,30,35),new Date(2010,3,25,12,30,36),new Date(2010,3,25,12,30,37),new Date(2010,3,25,12,30,38),new Date(2010,3,25,12,30,39),new Date(2010,3,25,12,30,40)], 'every second');


    var range = getRange(new Date(2010,3,25,12,30,30,500), new Date(2010,3,25,12,30,30,505));
    equal(range.every('millisecond'), [new Date(2010,3,25,12,30,30,500),new Date(2010,3,25,12,30,30,501),new Date(2010,3,25,12,30,30,502),new Date(2010,3,25,12,30,30,503),new Date(2010,3,25,12,30,30,504),new Date(2010,3,25,12,30,30,505)], 'every millisecond');

    // Every millisecond for 2 milliseconds

    var t = 1275318000000;
    var d1 = new Date(t);
    var d2 = new Date(t + 2);
    equal(getRange(d1, d2).every(), [new Date(t), new Date(t + 1), new Date(t + 2)], 'every should work without arguments');

    // Handles inverse date ranges.
    var d1 = new Date(t);
    var d2 = new Date(t - 2);
    equal(getRange(d1, d2).every(), [new Date(t), new Date(t - 1), new Date(t - 2)], 'should increment down when inverted');

  });

  group('Every: Weeks', function() {
    // Week
    var range = getRange(new Date(2010,6,10), new Date(2010,6,28));
    equal(range.every('week'), [new Date(2010,6,10), new Date(2010,6,17), new Date(2010,6,24)], '2010-07-10 - 2010-07-28 | every week');
    equal(range.every('2 weeks'), [new Date(2010,6,10), new Date(2010,6,24)], '2010-07-10 - 2010-07-28 | every week');
  });


  method('contains', function() {
    var range = getRange(new Date(2010,6,10,9), new Date(2010,8,10,9));
    equal(range.contains(new Date(2010, 5,  10)), false, 'before');
    equal(range.contains(new Date(2010, 7,  10)), true, 'middle');
    equal(range.contains(new Date(2010, 9, 10)), false, 'after');
    equal(range.contains(getRange(new Date(2010,6,10,9), new Date(2010,7,10,9))), true, 'contained range');
    equal(range.contains(getRange(new Date(2010,4,10), new Date(2010,7,10,9))), false, '9 hours before the start');
    equal(range.contains(getRange(new Date(2010,4,10,9), new Date(2010,6,10,10))), false, '1 minute after the end');
  });

  method('union', function() {
    var range1 = getRange(new Date(2001, 0), new Date(2003, 0));
    var range2 = getRange(new Date(2002, 0), new Date(2004, 0));
    var range = range1.union(range2);

    assertRangeEqual(range, getRange(new Date(2001, 0), new Date(2004, 0)), 'simple merge');
    assertRangeEqual(range1, getRange(new Date(2001, 0), new Date(2003, 0)), 'range1 has not changed');
    assertRangeEqual(range2, getRange(new Date(2002, 0), new Date(2004, 0)), 'range2 has not changed');

    // Union of non-overlapping ranges

    var range1 = getRange(new Date(2001, 0), new Date(2003, 0));
    var range2 = getRange(new Date(2005, 0), new Date(2008, 0));
    var range = range1.union(range2);

    assertRangeEqual(range, getRange(new Date(2001, 0), new Date(2008, 0)), 'non-overlapping includes middle');
    assertRangeEqual(range1, getRange(new Date(2001, 0), new Date(2003, 0)), 'range1 has not changed');
    assertRangeEqual(range2, getRange(new Date(2005, 0), new Date(2008, 0)), 'range2 has not changed');

    // Union of reversed overlapping ranges

    var range1 = getRange(new Date(2002, 0), new Date(2004, 0));
    var range2 = getRange(new Date(2001, 0), new Date(2003, 0));
    var range = range1.union(range2);

    assertRangeEqual(range, getRange(new Date(2001, 0), new Date(2004, 0)), 'reversed | simple merge');


    // Union of reversed non-overlapping ranges

    var range1 = getRange(new Date(2005, 0), new Date(2008, 0));
    var range2 = getRange(new Date(2001, 0), new Date(2003, 0));
    var range = range1.union(range2);

    assertRangeEqual(range, getRange(new Date(2001, 0), new Date(2008, 0)), 'reversed | includes middle');

  });

  method('intersect', function() {

    // Intersect of overlapping ranges

    var range1 = getRange(new Date(2001, 0), new Date(2003, 0));
    var range2 = getRange(new Date(2002, 0), new Date(2004, 0));
    var range = range1.intersect(range2);

    assertRangeEqual(range, getRange(new Date(2002, 0), new Date(2003, 0)), 'simple merge');
    assertRangeEqual(range1, getRange(new Date(2001, 0), new Date(2003, 0)), 'range1 has not changed');
    assertRangeEqual(range2, getRange(new Date(2002, 0), new Date(2004, 0)), 'range2 has not changed');

    // Intersect of non-overlapping ranges

    var range1 = getRange(new Date(2001, 0), new Date(2003, 0));
    var range2 = getRange(new Date(2005, 0), new Date(2008, 0));
    var range = range1.intersect(range2);

    equal(range.isValid(), false, 'non-overlapping ranges are invalid');


    // Intersect of reversed overlapping ranges

    var range1 = getRange(new Date(2002, 0), new Date(2004, 0));
    var range2 = getRange(new Date(2001, 0), new Date(2003, 0));
    var range = range1.intersect(range2);

    assertRangeEqual(range, getRange(new Date(2002, 0), new Date(2003, 0)), 'simple merge');

    // Intersect of reversed non-overlapping ranges

    var range1 = getRange(new Date(2005, 0), new Date(2008, 0));
    var range2 = getRange(new Date(2001, 0), new Date(2003, 0));
    var range = range1.intersect(range2);

    equal(range.isValid(), false, 'non-overlapping ranges are invalid');

  });

  group('Other', function() {
    // Modifying the start date of a range shouldn't affect the range.
    var d = new Date();
    var range = getRange(d);
    d.setTime(410194800000);
    equal(range.start.getTime() === 410194800000, false, 'Date.range | start time of the range should not be affected');
  });

  method('clone', function() {

    // Range cloning (Issue #230)
    var range1 = getRange(new Date(2002, 0), new Date(2004, 0));
    var range2 = range1.clone();

    equal(range1, range2, 'clone object is equal by value');
    equal(range1 === range2, false, 'clone is not strictly equal');

    // Deep range cloning

    var d1 = new Date(2010, 0);
    var d2 = new Date(2010, 2);

    range1 = getRange(d1, d2);

    range2 = range1.clone();

    range2.start.setFullYear(1999);
    range2.end.setFullYear(2002);

    equal(range1.start.getFullYear(), 2010, 'members should be cloned when range is cloned | start');
    equal(range1.end.getFullYear(), 2010, 'members should be cloned when range is cloned | start');

  });

  method('clamp', function() {
    var range = getRange(new Date(2010, 0), new Date(2011, 0));

    equal(range.clamp(new Date(2008, 0)), new Date(2010, 0), 'low');
    equal(range.clamp(new Date(2012, 0)), new Date(2011, 0), 'high');
    equal(range.clamp(new Date(2010, 6)), new Date(2010, 6), 'mid');
    equal(range.clamp(new Date(2010, 0)), new Date(2010, 0), 'low equal');
    equal(range.clamp(new Date(2011, 0)), new Date(2011, 0), 'high equal');

    equal(range.clamp(2), new Date(2010, 0), 'low number');
    equal(range.clamp(new Date(2013, 5).getTime()), new Date(2011, 0), 'high number');
    equal(range.clamp(new Date(2010, 5).getTime()), new Date(2010, 5).getTime(), 'mid number');
  });

  group('DST', function() {

    // Issue #468

    var fifteenMinutes = 15 * 60 * 1000;

    var d1 = new Date(2015, 2, 8, 0);
    var d2 = new Date(2015, 2, 8, 2);
    var range = getRange(d1, d2);
    var dt = d2 - d1;
    var arr = range.every('15 minutes');
    equal(range.span(), dt + 1, 'span should be numerically equal');
    equal(arr.length, Math.floor(dt / fifteenMinutes) + 1, 'span should be numerically equal');
    assertDateArrayIsSequential(arr, fifteenMinutes);

    var d1 = new Date(2015, 10, 1, 0);
    var d2 = new Date(2015, 10, 1, 3);
    var range = getRange(d1, d2);
    var dt = d2 - d1;
    var arr = range.every('15 minutes');
    equal(range.span(), dt + 1, 'span should be numerically equal');
    equal(arr.length, Math.floor(dt / fifteenMinutes) + 1, 'span should be numerically equal');
    assertDateArrayIsSequential(arr, fifteenMinutes);

  });

  method('toArray', function() {
    var start = new Date(2015, 9, 10, 15, 0, 1, 0);
    var end   = new Date(2015, 9, 10, 15, 0, 1, 5);
    var forwardExpected = [
      new Date(2015, 9, 10, 15, 0, 1, 0),
      new Date(2015, 9, 10, 15, 0, 1, 1),
      new Date(2015, 9, 10, 15, 0, 1, 2),
      new Date(2015, 9, 10, 15, 0, 1, 3),
      new Date(2015, 9, 10, 15, 0, 1, 4),
      new Date(2015, 9, 10, 15, 0, 1, 5)
    ];
    var reverseExpected = testClone(forwardExpected).reverse();
    equal(getRange(start, end).toArray(), forwardExpected, 'should work on date ranges');
    equal(getRange(end, start).toArray(), reverseExpected, 'should work on inverse date ranges');
  });

  group('Date Units', function() {

    equal(getRange(new Date(2001, 0), new Date(2004, 0)).years(), 3, '5 year range');
    equal(getRange(new Date(2001, 0), new Date(2001, 2)).months(), 2, 'January to March in months');
    equal(getRange(new Date(2001, 0), new Date(2001, 2)).days(), 59, 'January to March in days');

    var range = getRange(new Date(2001, 0), new Date(2001, 2))
    var tzShift = (range.end.getTimezoneOffset() - range.start.getTimezoneOffset());

    equal(range.hours(), 1416 + tzShift / 60, 'January to March in hours');
    equal(range.minutes(), 84960 + tzShift, 'January to March in minutes');
    equal(range.seconds(), 5097600 + tzShift * 60, 'January to March in seconds');
    equal(range.milliseconds(), 5097600000 + tzShift * 60 * 1000, 'January to March in ms');

    equal(getRange(1, 2001).seconds(), 2, 'Number ranges are taken as milliseconds');
    equal(getRange('a', 'f').seconds(), NaN, 'String ranges return NaN for date units');

    equal(getRange(new Date(NaN), new Date(NaN)).days(), NaN, 'Invalid ranges should return undefined');

  });

});
