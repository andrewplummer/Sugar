test('Date Ranges', function () {

  if(Date.setLocale) {
    Date.setLocale('en');
  }

  var d1, d2;
  var range, expected, result, count, range1, range2, tzOffset;

  range = Date.range(NaN, NaN);

  equal(range.isValid(), false, 'Date Range | invalid range');
  equal(typeof range.start.getTime, 'function', 'Date Range | Invalid | start is not minified');
  equal(typeof range.end.getTime, 'function', 'Date Range | Invalid | end is not minified');
  equal(isNaN(range.span()), true, 'Date Range | Invalid | has no duration');
  equal(range.toString(), 'Invalid Range', 'Date Range | Invalid | invalid toString');

  d1 = new Date(2011,8,10,9);
  d2 = new Date(2010,10,10,9)
  range = Date.range(d1, d2);

  equal(range.isValid(), true, 'Date Range | Inverted | range');
  equal(typeof range.start.getTime, 'function', 'Date Range | Inverted | start is not minified');
  equal(typeof range.end.getTime, 'function', 'Date Range | Inverted | end is not minified');
  equal(range.span(), Math.abs(d2 - d1) + 1, 'Date Range | Inverted | duration');
  equal(range.toString(), new Date(2011,8,10,9).toString() + '..' + new Date(2010,10,10,9).toString(), 'Date Range | Inverted | toString');

  range = Date.range(new Date(2010,6,10,9), new Date(2010,8,10,9));

  tzOffset = range.end.getTimezoneOffset() - range.start.getTimezoneOffset();

  equal(range.toString(), new Date(2010,6,10,9).toString() + '..' + new Date(2010,8,10,9).toString(), 'Date Range | toString');
  equal(range.span(), new Date(2010,8,10,9) - new Date(2010,6,10,9) + (tzOffset * 60 * 1000) + 1, 'Date Range | duration');
  equal(range.isValid(), true, 'Date Range | valid range');

  equal(range.every('year'), [new Date(2010,6,10,9)], 'Range#every | 2010-9 - 2010-11');


  count = 0;
  expected = [new Date(2010,6,10,9), new Date(2010,7,10,9), new Date(2010,8,10,9)]
  result = range.every('month', function(d, index) {
    dateEqual(d, expected[count], 'Date Range | date is first argument');
    equal(index, count, 'Date Range | index is second argument');
    count++;
  });
  equal(result, expected, 'Date Range | 2010-9 - 2010-11 | every month');
  equal(count, 3, 'Date Range | 2010-9 - 2010-11 | has iterated 3 times');

  equal(range.every('year'), [new Date(2010,6,10,9)], 'Date Range | 2010-9 - 2010-11 | every year');
  equal(range.every('month'), [new Date(2010,6,10,9), new Date(2010,7,10,9), new Date(2010,8,10,9)], 'Date Range | 2010-9 - 2010-11 | every month');

  // Discrepancies exist here because of the definition of a month
  equal(range.every((2).months()), [new Date(2010,6,10,9), new Date(2010,8,9,6)], 'Date Range | 2010-9 - 2010-11 | every 2 months');

  // This version will run every month then iterate over every other
  equal(range.every('2 months'), [new Date(2010,6,10,9), new Date(2010,8,10,9)], 'Date Range | 2010-9 - 2010-11 | every 2 months text format');

  equal(range.every((10).days()), [new Date(2010,6,10,9), new Date(2010,6,20,9), new Date(2010,6,30,9), new Date(2010,7,9,9), new Date(2010,7,19,9), new Date(2010,7,29,9), new Date(2010,8,8,9)], 'Date Range | 2010-9 - 2010-11 | every 10 days');

  equal(range.every('day'), [new Date(2010,6,10,9), new Date(2010,6,11,9), new Date(2010,6,12,9), new Date(2010,6,13,9), new Date(2010,6,14,9), new Date(2010,6,15,9), new Date(2010,6,16,9), new Date(2010,6,17,9), new Date(2010,6,18,9), new Date(2010,6,19,9), new Date(2010,6,20,9), new Date(2010,6,21,9), new Date(2010,6,22,9), new Date(2010,6,23,9), new Date(2010,6,24,9), new Date(2010,6,25,9), new Date(2010,6,26,9), new Date(2010,6,27,9), new Date(2010,6,28,9), new Date(2010,6,29,9), new Date(2010,6,30,9), new Date(2010,6,31,9), new Date(2010,7,1,9), new Date(2010,7,2,9), new Date(2010,7,3,9), new Date(2010,7,4,9), new Date(2010,7,5,9), new Date(2010,7,6,9), new Date(2010,7,7,9), new Date(2010,7,8,9), new Date(2010,7,9,9), new Date(2010,7,10,9), new Date(2010,7,11,9), new Date(2010,7,12,9), new Date(2010,7,13,9), new Date(2010,7,14,9), new Date(2010,7,15,9), new Date(2010,7,16,9), new Date(2010,7,17,9), new Date(2010,7,18,9), new Date(2010,7,19,9), new Date(2010,7,20,9), new Date(2010,7,21,9), new Date(2010,7,22,9), new Date(2010,7,23,9), new Date(2010,7,24,9), new Date(2010,7,25,9), new Date(2010,7,26,9), new Date(2010,7,27,9), new Date(2010,7,28,9), new Date(2010,7,29,9), new Date(2010,7,30,9), new Date(2010,7,31,9), new Date(2010,8,1,9), new Date(2010,8,2,9), new Date(2010,8,3,9), new Date(2010,8,4,9), new Date(2010,8,5,9), new Date(2010,8,6,9), new Date(2010,8,7,9), new Date(2010,8,8,9), new Date(2010,8,9,9), new Date(2010,8,10,9) ], 'Date Range | 2010-9 - 2010 - 11 | every day');

  dateEqual(range.start, new Date(2010,6,10,9), 'Date Range | Start has not been modified');
  dateEqual(range.end, new Date(2010,8,10,9), 'Date Range | End has not been modified');

  equal(range.contains(new Date(2010, 5,  10)), false, 'Date Range#contains | before');
  equal(range.contains(new Date(2010, 7,  10)), true, 'Date Range#contains | middle');
  equal(range.contains(new Date(2010, 9, 10)), false, 'Date Range#contains | after');
  equal(range.contains(Date.range(new Date(2010,6,10,9), new Date(2010,7,10,9))), true, 'Date Range#contains | contained range');
  equal(range.contains(Date.range(new Date(2010,4,10), new Date(2010,7,10,9))), false, 'Date Range#contains | 9 hours before the start');
  equal(range.contains(Date.range(new Date(2010,4,10,9), new Date(2010,6,10,10))), false, 'Date Range#contains | 1 minute after the end');

  range = Date.range(new Date(2010,3,25,12), new Date(2010,3,25,18));

  equal(range.every('hour'), [new Date(2010,3,25,12),new Date(2010,3,25,13),new Date(2010,3,25,14),new Date(2010,3,25,15),new Date(2010,3,25,16),new Date(2010,3,25,17),new Date(2010,3,25,18)], 'Date Range | every hour');

  range = Date.range(new Date(2010,3,25,12,30), new Date(2010,3,25,12,40));

  equal(range.every('minute'), [new Date(2010,3,25,12,30),new Date(2010,3,25,12,31),new Date(2010,3,25,12,32),new Date(2010,3,25,12,33),new Date(2010,3,25,12,34),new Date(2010,3,25,12,35),new Date(2010,3,25,12,36),new Date(2010,3,25,12,37),new Date(2010,3,25,12,38),new Date(2010,3,25,12,39),new Date(2010,3,25,12,40)], 'Date Range | every minute');


  range = Date.range(new Date(2010,3,25,12,30,30), new Date(2010,3,25,12,30,40));

  equal(range.every('second'), [new Date(2010,3,25,12,30,30),new Date(2010,3,25,12,30,31),new Date(2010,3,25,12,30,32),new Date(2010,3,25,12,30,33),new Date(2010,3,25,12,30,34),new Date(2010,3,25,12,30,35),new Date(2010,3,25,12,30,36),new Date(2010,3,25,12,30,37),new Date(2010,3,25,12,30,38),new Date(2010,3,25,12,30,39),new Date(2010,3,25,12,30,40)], 'Date Range | every second');


  range = Date.range(new Date(2010,3,25,12,30,30,500), new Date(2010,3,25,12,30,30,505));

  equal(range.every('millisecond'), [new Date(2010,3,25,12,30,30,500),new Date(2010,3,25,12,30,30,501),new Date(2010,3,25,12,30,30,502),new Date(2010,3,25,12,30,30,503),new Date(2010,3,25,12,30,30,504),new Date(2010,3,25,12,30,30,505)], 'Date Range | every millisecond');

  range = Date.range(new Date(2010,3,25));
  dateEqual(range.start, new Date(2010,3,25), 'Date Range | null end | start');
  equal(range.end.is(new Date(), 10), true, 'Date Range | null end is current time');

  range = Date.range(null, new Date(2010,3,25));
  equal(range.start.is(new Date(), 10), true, 'Date Range | null defaults to current time');
  dateEqual(range.end, new Date(2010,3,25), 'Date Range | start is reversed when null is current');

  range = Date.range();
  equal(range.start.is(new Date(), 10), true, 'Date Range | both null | start');
  equal(range.end.is(new Date(), 10), true, 'Date Range | both null | end');


  // Union of overlapping ranges

  range1 = Date.range(Date.create('2001'), Date.create('2003'));
  range2 = Date.range(Date.create('2002'), Date.create('2004'));

  range = range1.union(range2);

  dateRangeEqual(range, Date.range(Date.create('2001'), Date.create('2004')), 'Date Range#union | simple merge');
  dateRangeEqual(range1, Date.range(Date.create('2001'), Date.create('2003')), 'Date Range#union | range1 has not changed');
  dateRangeEqual(range2, Date.range(Date.create('2002'), Date.create('2004')), 'Date Range#union | range2 has not changed');



  // Union of non-overlapping ranges

  range1 = Date.range(Date.create('2001'), Date.create('2003'));
  range2 = Date.range(Date.create('2005'), Date.create('2008'));

  range = range1.union(range2);

  dateRangeEqual(range, Date.range(Date.create('2001'), Date.create('2008')), 'Date Range#union | non-overlapping includes middle');
  dateRangeEqual(range1, Date.range(Date.create('2001'), Date.create('2003')), 'Date Range#union | range1 has not changed');
  dateRangeEqual(range2, Date.range(Date.create('2005'), Date.create('2008')), 'Date Range#union | range2 has not changed');


  // Union of reversed overlapping ranges

  range1 = Date.range(Date.create('2002'), Date.create('2004'));
  range2 = Date.range(Date.create('2001'), Date.create('2003'));

  range = range1.union(range2);

  dateRangeEqual(range, Date.range(Date.create('2001'), Date.create('2004')), 'Date Range#union | reversed | simple merge');


  // Union of reversed non-overlapping ranges

  range1 = Date.range(Date.create('2005'), Date.create('2008'));
  range2 = Date.range(Date.create('2001'), Date.create('2003'));

  range = range1.union(range2);

  dateRangeEqual(range, Date.range(Date.create('2001'), Date.create('2008')), 'Date Range#union | reversed | includes middle');




  // Intersect of overlapping ranges

  range1 = Date.range(Date.create('2001'), Date.create('2003'));
  range2 = Date.range(Date.create('2002'), Date.create('2004'));

  range = range1.intersect(range2);

  dateRangeEqual(range, Date.range(Date.create('2002'), Date.create('2003')), 'Date Range#intersect | simple merge');
  dateRangeEqual(range1, Date.range(Date.create('2001'), Date.create('2003')), 'Date Range#intersect | range1 has not changed');
  dateRangeEqual(range2, Date.range(Date.create('2002'), Date.create('2004')), 'Date Range#intersect | range2 has not changed');

  // Intersect of non-overlapping ranges

  range1 = Date.range(Date.create('2001'), Date.create('2003'));
  range2 = Date.range(Date.create('2005'), Date.create('2008'));

  range = range1.intersect(range2);

  equal(range.isValid(), false, 'Date Range#intersect | non-overlapping ranges are invalid');


  // Intersect of reversed overlapping ranges

  range1 = Date.range(Date.create('2002'), Date.create('2004'));
  range2 = Date.range(Date.create('2001'), Date.create('2003'));

  range = range1.intersect(range2);

  dateRangeEqual(range, Date.range(Date.create('2002'), Date.create('2003')), 'Date Range#intersect | simple merge');

  // Intersect of reversed non-overlapping ranges

  range1 = Date.range(Date.create('2005'), Date.create('2008'));
  range2 = Date.range(Date.create('2001'), Date.create('2003'));

  range = range1.intersect(range2);

  equal(range.isValid(), false, 'Date Range#intersect | non-overlapping ranges are invalid');


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

  equal(range1, range2, 'Date Range#clone | clone object is equal by value');
  equal(range1 === range2, false, 'Date Range#clone | clone is not strictly equal');



  // Range clamping

  range = Date.range(new Date(2010, 0), new Date(2011, 0));

  dateEqual(range.clamp(new Date(2008, 0)), new Date(2010, 0), 'Date Range#clamp | low');
  dateEqual(range.clamp(new Date(2012, 0)), new Date(2011, 0), 'Date Range#clamp | high');
  dateEqual(range.clamp(new Date(2010, 6)), new Date(2010, 6), 'Date Range#clamp | mid');
  dateEqual(range.clamp(new Date(2010, 0)), new Date(2010, 0), 'Date Range#clamp | low equal');
  dateEqual(range.clamp(new Date(2011, 0)), new Date(2011, 0), 'Date Range#clamp | high equal');

  dateEqual(range.clamp(2), new Date(2010, 0), 'Date Range#clamp | low number');
  dateEqual(range.clamp(new Date(2013, 5).getTime()), new Date(2011, 0), 'Date Range#clamp | high number');
  equal(range.clamp(new Date(2010, 5).getTime()), new Date(2010, 5).getTime(), 'Date Range#clamp | mid number');



  // Deep range cloning

  var d1 = new Date(2010, 0);
  var d2 = new Date(2010, 2);

  range1 = Date.range(d1, d2);

  range2 = range1.clone();

  range2.start.setFullYear(1999);
  range2.end.setFullYear(2002);

  equal(range1.start.getFullYear(), 2010, 'Date Range | members should be cloned when range is cloned | start');
  equal(range1.end.getFullYear(), 2010, 'Date Range | members should be cloned when range is cloned | start');


  // every()

  var t = 1275318000000;
  var d1 = new Date(t);
  var d2 = new Date(t + 2);

  equal(Date.range(d1, d2).every(), [new Date(t), new Date(t + 1), new Date(t + 2)], 'Date Range | every should work without arguments');

});
