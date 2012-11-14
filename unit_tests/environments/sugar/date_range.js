test('Date Ranges', function () {

  Date.setLocale('en');

  var range, expected, result, count, range1, range2, tzOffset;

  range = Date.range(new Date(2011,8,10,9), new Date(2010,10,10,9));

  equal(range.isValid(), false, 'DateRange | invalid range');
  equal(typeof range.start.getTime, 'function', 'DateRange | start is not minified');
  equal(typeof range.end.getTime, 'function', 'DateRange | end is not minified');
  equal(isNaN(range.duration()), true, 'DateRange | invalid ranges have no duration');
  equal(range.toString(), 'Invalid DateRange', 'DateRange | invalid toString');


  range = Date.range(new Date(2010,8,10,9), new Date(2010,10,10,9));
  tzOffset = range.end.getTimezoneOffset() - range.start.getTimezoneOffset();

  equal(range.toString(), 'Friday September 10, 2010 9:00:00am..Wednesday November 10, 2010 9:00:00am', 'DateRange | toString');
  equal(range.duration(), 5270400000 + (tzOffset * 60 * 1000), 'DateRange | duration');
  equal(range.isValid(), true, 'DateRange | valid range');

  equal(range.eachYear(), [new Date(2010, 0)], 'DateRange | 2010-9 - 2010-11 | eachYear');


  count = 0;
  expected = [new Date(2010, 8), new Date(2010, 9), new Date(2010, 10)]
  result = range.eachMonth(function(d, index) {
    dateEqual(d, expected[count], 'DateRange | date is first argument');
    equal(index, count, 'DateRange | index is second argument');
    count++;
  });
  equal(result, expected, 'DateRange | 2010-9 - 2010-11 | eachMonth');
  equal(count, 3, 'DateRange | 2010-9 - 2010-11 | has iterated 3 times');

  equal(range.every('year'), [new Date(2010, 0)], 'DateRange | 2010-9 - 2010-11 | eachYear');
  equal(range.every('month'), [new Date(2010, 8), new Date(2010, 9), new Date(2010, 10)], 'DateRange | 2010-9 - 2010-11 | eachMonth');

  // Discrepancies exist here because of the definition of a month
  equal(range.every((2).months()), [new Date(2010, 8, 10, 9), new Date(2010, 10, 10, 6)], 'DateRange | 2010-9 - 2010-11 | every 2 months');

  // This version will run eachMonth then iterate over every other
  equal(range.every('2 months'), [new Date(2010, 8), new Date(2010, 10)], 'DateRange | 2010-9 - 2010-11 | every 2 months text format');

  equal(range.every((10).days()), [new Date(2010, 8, 10, 9), new Date(2010, 8, 20, 9), new Date(2010, 8, 30, 9), new Date(2010, 9, 10, 9), new Date(2010, 9, 20, 9), new Date(2010, 9, 30, 9), new Date(2010, 10, 9, 9)], 'DateRange | 2010-9 - 2010-11 | every 10 days');

  equal(range.eachDay(), [new Date(2010, 8, 10), new Date(2010, 8, 11), new Date(2010, 8, 12), new Date(2010, 8, 13), new Date(2010, 8, 14), new Date(2010, 8, 15), new Date(2010, 8, 16), new Date(2010, 8, 17), new Date(2010, 8, 18), new Date(2010, 8, 19), new Date(2010, 8, 20), new Date(2010, 8, 21), new Date(2010, 8, 22), new Date(2010, 8, 23), new Date(2010, 8, 24), new Date(2010, 8, 25), new Date(2010, 8, 26), new Date(2010, 8, 27), new Date(2010, 8, 28), new Date(2010, 8, 29), new Date(2010, 8, 30), new Date(2010, 9, 1), new Date(2010, 9, 2), new Date(2010, 9, 3), new Date(2010, 9, 4), new Date(2010, 9, 5), new Date(2010, 9, 6), new Date(2010, 9, 7), new Date(2010, 9, 8), new Date(2010, 9, 9), new Date(2010, 9, 10), new Date(2010, 9, 11), new Date(2010, 9, 12), new Date(2010, 9, 13), new Date(2010, 9, 14), new Date(2010, 9, 15), new Date(2010, 9, 16), new Date(2010, 9, 17), new Date(2010, 9, 18), new Date(2010, 9, 19), new Date(2010, 9, 20), new Date(2010, 9, 21), new Date(2010, 9, 22), new Date(2010, 9, 23), new Date(2010, 9, 24), new Date(2010, 9, 25), new Date(2010, 9, 26), new Date(2010, 9, 27), new Date(2010, 9, 28), new Date(2010, 9, 29), new Date(2010, 9, 30), new Date(2010, 9, 31), new Date(2010, 10, 1), new Date(2010, 10, 2), new Date(2010, 10, 3), new Date(2010, 10, 4), new Date(2010, 10, 5), new Date(2010, 10, 6), new Date(2010, 10, 7), new Date(2010, 10, 8), new Date(2010, 10, 9), new Date(2010, 10, 10) ], 'DateRange | 2010-9 - 2010 - 11 | eachDay');

  dateEqual(range.start, new Date(2010,8,10,9), 'DateRange | Start has not been modified');
  dateEqual(range.end, new Date(2010,10,10,9), 'DateRange | End has not been modified');

  equal(range.contains(new Date(2010, 7,  10)), false, 'DateRange#contains | before');
  equal(range.contains(new Date(2010, 9,  10)), true, 'DateRange#contains | middle');
  equal(range.contains(new Date(2010, 11, 10)), false, 'DateRange#contains | after');
  equal(range.contains(Date.range(new Date(2010, 8, 10, 9), new Date(2010, 9, 10, 9))), true, 'DateRange#contains | contained range');
  equal(range.contains(Date.range(new Date(2010, 8, 10), new Date(2010, 9, 10, 9))), false, 'DateRange#contains | 9 hours before the start');
  equal(range.contains(Date.range(new Date(2010, 8, 10, 9), new Date(2010, 10, 10, 10))), false, 'DateRange#contains | 1 minute after the end');

  range = Date.range(new Date(2010,3,25,12), new Date(2010, 3, 25, 18));

  equal(range.eachHour(), [new Date(2010,3,25,12),new Date(2010,3,25,13),new Date(2010,3,25,14),new Date(2010,3,25,15),new Date(2010,3,25,16),new Date(2010,3,25,17),new Date(2010,3,25,18)], 'DateRange | eachHour');

  range = Date.range(new Date(2010,3,25,12,30), new Date(2010,3,25,12,40));

  equal(range.eachMinute(), [new Date(2010,3,25,12,30),new Date(2010,3,25,12,31),new Date(2010,3,25,12,32),new Date(2010,3,25,12,33),new Date(2010,3,25,12,34),new Date(2010,3,25,12,35),new Date(2010,3,25,12,36),new Date(2010,3,25,12,37),new Date(2010,3,25,12,38),new Date(2010,3,25,12,39),new Date(2010,3,25,12,40)], 'DateRange | eachMinute');


  range = Date.range(new Date(2010,3,25,12,30,30), new Date(2010,3,25,12,30,40));

  equal(range.eachSecond(), [new Date(2010,3,25,12,30,30),new Date(2010,3,25,12,30,31),new Date(2010,3,25,12,30,32),new Date(2010,3,25,12,30,33),new Date(2010,3,25,12,30,34),new Date(2010,3,25,12,30,35),new Date(2010,3,25,12,30,36),new Date(2010,3,25,12,30,37),new Date(2010,3,25,12,30,38),new Date(2010,3,25,12,30,39),new Date(2010,3,25,12,30,40)], 'DateRange | eachSecond');


  range = Date.range(new Date(2010,3,25,12,30,30,500), new Date(2010,3,25,12,30,30,505));

  equal(range.eachMillisecond(), [new Date(2010,3,25,12,30,30,500),new Date(2010,3,25,12,30,30,501),new Date(2010,3,25,12,30,30,502),new Date(2010,3,25,12,30,30,503),new Date(2010,3,25,12,30,30,504),new Date(2010,3,25,12,30,30,505)], 'DateRange | eachMillisecond');

  range = Date.range(new Date(2010,3,25));
  dateEqual(range.start, new Date(2010,3,25), 'DateRange | null end | start');
  equal(range.end.is(new Date(), 10), true, 'DateRange | null end is current time');

  range = Date.range(null, new Date(2010,3,25));
  equal(range.start.is(new Date(), 10), true, 'DateRange | null start is current time');
  dateEqual(range.end, new Date(2010,3,25), 'DateRange | null start | end');

  range = Date.range();
  equal(range.start.is(new Date(), 10), true, 'DateRange | both null | start');
  equal(range.end.is(new Date(), 10), true, 'DateRange | both null | end');


  // Union of overlapping ranges

  range1 = Date.range(Date.create('2001'), Date.create('2003'));
  range2 = Date.range(Date.create('2002'), Date.create('2004'));

  range = range1.union(range2);

  dateRangeEqual(range, Date.range(Date.create('2001'), Date.create('2004')), 'DateRange#union | simple merge');
  dateRangeEqual(range1, Date.range(Date.create('2001'), Date.create('2003')), 'DateRange#union | range1 has not changed');
  dateRangeEqual(range2, Date.range(Date.create('2002'), Date.create('2004')), 'DateRange#union | range2 has not changed');



  // Union of non-overlapping ranges

  range1 = Date.range(Date.create('2001'), Date.create('2003'));
  range2 = Date.range(Date.create('2005'), Date.create('2008'));

  range = range1.union(range2);

  dateRangeEqual(range, Date.range(Date.create('2001'), Date.create('2008')), 'DateRange#union | non-overlapping includes middle');
  dateRangeEqual(range1, Date.range(Date.create('2001'), Date.create('2003')), 'DateRange#union | range1 has not changed');
  dateRangeEqual(range2, Date.range(Date.create('2005'), Date.create('2008')), 'DateRange#union | range2 has not changed');


  // Union of reversed overlapping ranges

  range1 = Date.range(Date.create('2002'), Date.create('2004'));
  range2 = Date.range(Date.create('2001'), Date.create('2003'));

  range = range1.union(range2);

  dateRangeEqual(range, Date.range(Date.create('2001'), Date.create('2004')), 'DateRange#union | reversed | simple merge');


  // Union of reversed non-overlapping ranges

  range1 = Date.range(Date.create('2005'), Date.create('2008'));
  range2 = Date.range(Date.create('2001'), Date.create('2003'));

  range = range1.union(range2);

  dateRangeEqual(range, Date.range(Date.create('2001'), Date.create('2008')), 'DateRange#union | reversed | includes middle');




  // Intersect of overlapping ranges

  range1 = Date.range(Date.create('2001'), Date.create('2003'));
  range2 = Date.range(Date.create('2002'), Date.create('2004'));

  range = range1.intersect(range2);

  dateRangeEqual(range, Date.range(Date.create('2002'), Date.create('2003')), 'DateRange#intersect | simple merge');
  dateRangeEqual(range1, Date.range(Date.create('2001'), Date.create('2003')), 'DateRange#intersect | range1 has not changed');
  dateRangeEqual(range2, Date.range(Date.create('2002'), Date.create('2004')), 'DateRange#intersect | range2 has not changed');

  // Intersect of non-overlapping ranges

  range1 = Date.range(Date.create('2001'), Date.create('2003'));
  range2 = Date.range(Date.create('2005'), Date.create('2008'));

  range = range1.intersect(range2);

  equal(range.isValid(), false, 'DateRange#intersect | non-overlapping ranges are invalid');


  // Intersect of reversed overlapping ranges

  range1 = Date.range(Date.create('2002'), Date.create('2004'));
  range2 = Date.range(Date.create('2001'), Date.create('2003'));

  range = range1.intersect(range2);

  dateRangeEqual(range, Date.range(Date.create('2002'), Date.create('2003')), 'DateRange#intersect | simple merge');

  // Intersect of reversed non-overlapping ranges

  range1 = Date.range(Date.create('2005'), Date.create('2008'));
  range2 = Date.range(Date.create('2001'), Date.create('2003'));

  range = range1.intersect(range2);

  equal(range.isValid(), false, 'DateRange#intersect | non-overlapping ranges are invalid');


  // Date ranges should be able to be created from a string

  range = Date.range('2001', '2003');

  dateEqual(range.start, Date.create('2001'), 'Date.range | strings | start is equal');
  dateEqual(range.end,   Date.create('2003'), 'Date.range | strings | end is equal');


  // Modifying the start date of a range shouldn't affect the range.

  var d = new Date();

  range = Date.range(d);

  d.setTime(410194800000);

  equal(range.start.getTime() === 410194800000, false, 'Date.range | start time of the range should not be affected');



  range = Date.range('2 hours ago', 'now');
  equal(range.isValid(), true, 'Date.range | understands relative strings');

  // Range cloning (Issue #230)

  range1 = Date.range(Date.create('2002'), Date.create('2004'));
  range2 = range1.clone();

  equal(range1, range2, 'DateRange#clone | clone object is equal by value');
  equal(range1 === range2, false, 'DateRange#clone | clone is not strictly equal');

});
