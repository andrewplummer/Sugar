test('Date Ranges', function () {

  var start, end, range;


  start = new Date(2010, 8, 10, 9);
  end   = new Date(2010, 10, 10, 9);

  range = Date.range(start, end);

  // Discrepancies exist here because of the definition of a month

  equal(range.eachYear(), [new Date(2010, 0)], 'DateRange | 2010-9 - 2010-11 | eachYear');
  equal(range.eachMonth(), [new Date(2010, 8), new Date(2010, 9), new Date(2010, 10)], 'DateRange | 2010-9 - 2010-11 | eachMonth');

  equal(range.every('year'), [new Date(2010, 0)], 'DateRange | 2010-9 - 2010-11 | eachYear');
  equal(range.every('month'), [new Date(2010, 8), new Date(2010, 9), new Date(2010, 10)], 'DateRange | 2010-9 - 2010-11 | eachMonth');

  equal(range.every((2).months()), [new Date(2010, 8, 10, 9), new Date(2010, 10, 10, 6)], 'DateRange | 2010-9 - 2010-11 | every 2 months');
  equal(range.every((10).days()), [new Date(2010, 8, 10, 9), new Date(2010, 8, 20, 9), new Date(2010, 8, 30, 9), new Date(2010, 9, 10, 9), new Date(2010, 9, 20, 9), new Date(2010, 9, 30, 9), new Date(2010, 10, 9, 9)], 'DateRange | 2010-9 - 2010-11 | every 10 days');

  equal(range.eachDay(), [new Date(2010, 8, 10), new Date(2010, 8, 11), new Date(2010, 8, 12), new Date(2010, 8, 13), new Date(2010, 8, 14), new Date(2010, 8, 15), new Date(2010, 8, 16), new Date(2010, 8, 17), new Date(2010, 8, 18), new Date(2010, 8, 19), new Date(2010, 8, 20), new Date(2010, 8, 21), new Date(2010, 8, 22), new Date(2010, 8, 23), new Date(2010, 8, 24), new Date(2010, 8, 25), new Date(2010, 8, 26), new Date(2010, 8, 27), new Date(2010, 8, 28), new Date(2010, 8, 29), new Date(2010, 8, 30), new Date(2010, 9, 1), new Date(2010, 9, 2), new Date(2010, 9, 3), new Date(2010, 9, 4), new Date(2010, 9, 5), new Date(2010, 9, 6), new Date(2010, 9, 7), new Date(2010, 9, 8), new Date(2010, 9, 9), new Date(2010, 9, 10), new Date(2010, 9, 11), new Date(2010, 9, 12), new Date(2010, 9, 13), new Date(2010, 9, 14), new Date(2010, 9, 15), new Date(2010, 9, 16), new Date(2010, 9, 17), new Date(2010, 9, 18), new Date(2010, 9, 19), new Date(2010, 9, 20), new Date(2010, 9, 21), new Date(2010, 9, 22), new Date(2010, 9, 23), new Date(2010, 9, 24), new Date(2010, 9, 25), new Date(2010, 9, 26), new Date(2010, 9, 27), new Date(2010, 9, 28), new Date(2010, 9, 29), new Date(2010, 9, 30), new Date(2010, 9, 31), new Date(2010, 10, 1), new Date(2010, 10, 2), new Date(2010, 10, 3), new Date(2010, 10, 4), new Date(2010, 10, 5), new Date(2010, 10, 6), new Date(2010, 10, 7), new Date(2010, 10, 8), new Date(2010, 10, 9), new Date(2010, 10, 10) ], 'DateRange | 2010-9 - 2010 - 11 | eachDay');

  dateEqual(range.start, start, 'DateRange | Start has not been modified');
  dateEqual(range.end, end, 'DateRange | End has not been modified');

  equal(range.contains(new Date(2010, 7,  10)), false, 'DateRange#contains | before');
  equal(range.contains(new Date(2010, 9,  10)), true, 'DateRange#contains | middle');
  equal(range.contains(new Date(2010, 11, 10)), false, 'DateRange#contains | after');

});
