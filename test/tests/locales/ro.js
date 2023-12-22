namespace('Date | French', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('fr');
  });

  method('create', function() {

    assertDateParsed('15 mai 2011', new Date(2011, 4, 15));
    assertDateParsed('5 ianuarie 2012', new Date(2012, 0, 5));
    assertDateParsed('mai 2011', new Date(2011, 4));
    assertDateParsed('15 mai', new Date(now.getFullYear(), 4, 15));
    assertDateParsed('2011', new Date(2011, 0));
    assertDateParsed('02 feb. 2016', new Date(2016, 1, 2));
    assertDateParsed('februarie 2016',   new Date(2016, 1));

    assertDateParsed('5 ianuarie 2012 3:45', new Date(2012, 0, 5, 3, 45));
    assertDateParsed('5 ianuarie 2012 3:45pm', new Date(2012, 0, 5, 15, 45));

    assertDateParsed('ianuarie',   new Date(now.getFullYear(), 0));
    assertDateParsed('februarie',   new Date(now.getFullYear(), 1));
    assertDateParsed('martie',      new Date(now.getFullYear(), 2));
    assertDateParsed('aprilie',     new Date(now.getFullYear(), 3));
    assertDateParsed('mai',       new Date(now.getFullYear(), 4));
    assertDateParsed('iunie',      new Date(now.getFullYear(), 5));
    assertDateParsed('iulie',   new Date(now.getFullYear(), 6));
    assertDateParsed('august',      new Date(now.getFullYear(), 7));
    assertDateParsed('septembrie', new Date(now.getFullYear(), 8));
    assertDateParsed('octobrie',   new Date(now.getFullYear(), 9));
    assertDateParsed('noiembrie',  new Date(now.getFullYear(), 10));
    assertDateParsed('decembrie',  new Date(now.getFullYear(), 11));

    assertDateParsed('duminică', testGetWeekday(0));
    assertDateParsed('luni',    testGetWeekday(1));
    assertDateParsed('marți',    testGetWeekday(2));
    assertDateParsed('miercuri', testGetWeekday(3));
    assertDateParsed('joi',    testGetWeekday(4));
    assertDateParsed('vineri', testGetWeekday(5));
    assertDateParsed('sâmbătă',   testGetWeekday(6));


    assertDateParsed('acum o milisecundă', getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('acum o secundă',      getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('acum un minut',       getRelativeDate(0,0,0,0,-1));
    assertDateParsed('acum o oră',        getRelativeDate(0,0,0,-1));
    assertDateParsed('acum o zi',          getRelativeDate(0,0,-1));
    assertDateParsed('acum o săptămână',      getRelativeDate(0,0,-7));
    assertDateParsed('acum o lună',          getRelativeDate(0,-1));
    assertDateParsed('acum un an',            getRelativeDate(-1));


    assertDateParsed('în 5 milisecunde', getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed('în 5 secunde',      getRelativeDate(0,0,0,0,0,5));
    assertDateParsed('în 5 minute',       getRelativeDate(0,0,0,0,5));
    assertDateParsed('în 5 ore',        getRelativeDate(0,0,0,5));
    assertDateParsed('în 5 zile',         getRelativeDate(0,0,5));
    assertDateParsed('în 5 săptămâni',      getRelativeDate(0,0,35));
    assertDateParsed('în 5 luni',          getRelativeDate(0,5));
    assertDateParsed('în 5 ani',           getRelativeDate(5));

    assertDateParsed('peste 5 milisecunde', getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed('peste 5 secunde',      getRelativeDate(0,0,0,0,0,5));
    assertDateParsed('peste 5 minute',       getRelativeDate(0,0,0,0,5));
    assertDateParsed('peste 5 ore',        getRelativeDate(0,0,0,5));
    assertDateParsed('peste 5 zile',         getRelativeDate(0,0,5));
    assertDateParsed('peste 5 săptămâni',      getRelativeDate(0,0,35));
    assertDateParsed('peste 5 luni',          getRelativeDate(0,5));
    assertDateParsed('peste 5 ani',           getRelativeDate(5));

    assertDateParsed('ieri',        getRelativeDateReset(0,0,-1));
    assertDateParsed("azi", getRelativeDateReset(0,0,0));
    assertDateParsed('mâine',      getRelativeDateReset(0,0,1));

    assertDateParsed('săptămâna trecută',  getRelativeDate(0,0,-7));
    assertDateParsed('săptămâna viitoare', getRelativeDate(0,0,7));

    assertDateParsed('luna trecută',  getRelativeDate(0,-1));
    assertDateParsed('luna viitoare', getRelativeDate(0,1));

    assertDateParsed("anul trecut",  getRelativeDate(-1));
    assertDateParsed("anul viitor", getRelativeDate(1));

    assertDateParsed('lunea viitoare', testGetWeekday(1, 1));
    assertDateParsed('lunea trecută',  testGetWeekday(1,-1));

    assertDateParsed('lunea trecută la 3:45', testGetWeekday(1, -1, 3, 45));

    assertDateParsed('17:32 15 mai', new Date(now.getFullYear(), 4, 15, 17, 32));
    assertDateParsed('17:32 lunea viitoare', testGetWeekday(1, 1, 17, 32));

    assertDateParsed('mâine la 3:30', testDateSet(getRelativeDateReset(0,0,1), {hour:3,minute:30}));


    // Numbers

    assertDateParsed('acum zero ani',   getRelativeDate(0));
    assertDateParsed('acum un an',      getRelativeDate(-1));
    assertDateParsed('acum doi ani',   getRelativeDate(-2));
    assertDateParsed('acum trei ani',  getRelativeDate(-3));
    assertDateParsed('acum patru ani', getRelativeDate(-4));
    assertDateParsed('acum cinci ani',   getRelativeDate(-5));
    assertDateParsed('acum șase ani',    getRelativeDate(-6));
    assertDateParsed('acum șapte ani',   getRelativeDate(-7));
    assertDateParsed('acum opt ani',   getRelativeDate(-8));
    assertDateParsed('acum nouă ani',   getRelativeDate(-9));
    assertDateParsed('acum zece ani',    getRelativeDate(-10));


  });

  method('format', function() {

    test(then, '5 ianuarie 2010 15:52', 'default format');

    assertFormatShortcut(then, 'short', '05/01/2010');
    assertFormatShortcut(then, 'medium', '5 ianuarie 2010');
    assertFormatShortcut(then, 'long', '5 ianuarie 2010 15:52');
    assertFormatShortcut(then, 'full', 'marți 5 ianuarie 2010 15:52');
    test(then, ['{time}'], '15:52', 'preferred time');
    test(then, ['{stamp}'], 'mar 5 ian 2010 15:52', 'preferred stamp');
    test(then, ['%c'], 'mar 5 ian 2010 15:52', '%c stamp');

    test(new Date('January 3, 2010'), ['{w}'], '53', 'locale week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{ww}'], '53', 'locale week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{wo}'], '53rd', 'locale week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{w}'], '1', 'locale week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{ww}'], '01', 'locale week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{wo}'], '1st', 'locale week number ordinal | Jan 4 2010');

    test(new Date(2015, 10, 8),  ['{Dow}'], 'dum', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], 'lun', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], 'mar', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], 'mier', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], 'joi', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], 'vin', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], 'sâm', 'Sat');

    test(new Date(2015, 0, 1),  ['{Mon}'], 'ian', 'Jan');
    test(new Date(2015, 1, 1),  ['{Mon}'], 'feb', 'Feb');
    test(new Date(2015, 2, 1),  ['{Mon}'], 'mar', 'Mar');
    test(new Date(2015, 3, 1),  ['{Mon}'], 'apr', 'Apr');
    test(new Date(2015, 4, 1),  ['{Mon}'], 'mai', 'May');
    test(new Date(2015, 5, 1),  ['{Mon}'], 'iun', 'Jun');
    test(new Date(2015, 6, 1),  ['{Mon}'], 'iul', 'Jul');
    test(new Date(2015, 7, 1),  ['{Mon}'], 'aug', 'Aug');
    test(new Date(2015, 8, 1),  ['{Mon}'], 'sept', 'Sep');
    test(new Date(2015, 9, 1),  ['{Mon}'], 'oct', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], 'noi', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], 'dec', 'Dec');

  });

  method('relative', function() {
    assertRelative('1 second ago', 'acum 1 secundă');
    assertRelative('1 minute ago', 'acum 1 minut');
    assertRelative('1 hour ago',   'acum 1 oră');
    assertRelative('1 day ago',    'acum 1 zi');
    assertRelative('1 week ago',   'acum 1 săptămână');
    assertRelative('1 month ago',  'acum 1 lună');
    assertRelative('1 year ago',   'acum 1 an');

    assertRelative('2 seconds ago', 'acum 2 secunde');
    assertRelative('2 minutes ago', 'acum 2 minute');
    assertRelative('2 hours ago',   'acum 2 ore');
    assertRelative('2 days ago',    'acum 2 zile');
    assertRelative('2 weeks ago',   'acum 2 săptămâni');
    assertRelative('2 months ago',  'acum 2 luni');
    assertRelative('2 years ago',   'acum 2 ani');

    assertRelative('1 second from now', 'în 1 secundă');
    assertRelative('1 minute from now', 'în 1 minut');
    assertRelative('1 hour from now',   'în 1 oră');
    assertRelative('1 day from now',    'în 1 zi');
    assertRelative('1 week from now',   'în 1 săptămână');
    assertRelative('1 year from now',   'în 1 an');

    assertRelative('5 second from now', 'în 5 secunde');
    assertRelative('5 minute from now', 'în 5 minute');
    assertRelative('5 hour from now',   'în 5 ore');
    assertRelative('5 day from now',    'în 5 zile');
    assertRelative('5 week from now',   'în 1 lună');
    assertRelative('5 year from now',   'în 5 ans');
  });

  method('beginning/end', function() {
    equal(run(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(run(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });


});

namespace('Number | Romanian', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['ro'], '5 ore', 'simple duration');
  });

});
