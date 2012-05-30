test('Date Ranges', function () {

  var start, end;


  start = new Date(2010, 8, 10, 9);
  end   = new Date(2010, 10, 10, 9);

  equal(Date.range(start, end).eachYear()), [new Date(2010, 0, 1)]);
  equal(Date.range(start, end).eachMonth()), [new Date(2010, 8), new Date(2010, 9), new Date(2010, 10)]);
  equal(Date.range(start, end).eachDay()), [
        new Date(2010, 8, 10),
        new Date(2010, 8, 11),
        new Date(2010, 8, 12),
        new Date(2010, 8, 13),
        new Date(2010, 8, 14),
        new Date(2010, 8, 15),
        new Date(2010, 8, 16),
        new Date(2010, 8, 17),
        new Date(2010, 8, 18),
        new Date(2010, 8, 19),
        new Date(2010, 8, 20),
        new Date(2010, 8, 21),
        new Date(2010, 8, 22),
        new Date(2010, 8, 23),
        new Date(2010, 8, 24),
        new Date(2010, 8, 25),
        new Date(2010, 8, 26),
        new Date(2010, 8, 27),
        new Date(2010, 8, 28),
        new Date(2010, 8, 29),
        new Date(2010, 8, 30),
        new Date(2010, 8, 31),
        new Date(2010, 9, 1),
        new Date(2010, 9, 2),
        new Date(2010, 9, 3),
        new Date(2010, 9, 4),
        new Date(2010, 9, 5),
        new Date(2010, 9, 6),
        new Date(2010, 9, 7),
        new Date(2010, 9, 8),
        new Date(2010, 9, 9),
        new Date(2010, 9, 10)
  ]);

});
