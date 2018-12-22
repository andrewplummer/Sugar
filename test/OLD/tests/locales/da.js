namespace('Date | Danish', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('da');
  });

  method('create', function() {

    assertDateParsed('den 15. maj 2011', new Date(2011, 4, 15));
    assertDateParsed('15 maj 2011', new Date(2011, 4, 15));
    assertDateParsed('torsdag 5 januar 2012', new Date(2012, 0, 5));
    assertDateParsed('torsdag, 5 januar 2012', new Date(2012, 0, 5));
    assertDateParsed('maj 2011', new Date(2011, 4));
    assertDateParsed('15 maj', new Date(now.getFullYear(), 4, 15));
    assertDateParsed('2011', new Date(2011, 0));
    assertDateParsed('02. feb. 2016', new Date(2016, 1, 2));

    assertDateParsed('maj', new Date(now.getFullYear(), 4));
    assertDateParsed('mandag', testGetWeekday(1));
    assertDateParsed('15 maj 2011 3:45', new Date(2011, 4, 15, 3, 45));
    assertDateParsed('15 maj 2011 3:45pm', new Date(2011, 4, 15, 15, 45));

    assertDateParsed('for et millisekund siden', getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('for et sekund siden', getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('for et minut siden', getRelativeDate(0,0,0,0,-1));
    assertDateParsed('for en time siden', getRelativeDate(0,0,0,-1));
    assertDateParsed('for en dag siden', getRelativeDate(0,0,-1));
    assertDateParsed('for en uge siden', getRelativeDate(0,0,-7));
    assertDateParsed('for en måned siden', getRelativeDate(0,-1));
    assertDateParsed('for et år siden', getRelativeDate(-1));
    assertDateParsed('et år siden', getRelativeDate(-1));

    assertDateParsed('om 5 millisekunder', getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed('om 5 sekunder', getRelativeDate(0,0,0,0,0,5));
    assertDateParsed('om 5 minutter', getRelativeDate(0,0,0,0,5));
    assertDateParsed('om 5 timer', getRelativeDate(0,0,0,5));
    assertDateParsed('om 5 dage', getRelativeDate(0,0,5));
    assertDateParsed('om 5 uger', getRelativeDate(0,0,35));
    assertDateParsed('om 5 måneder', getRelativeDate(0,5));
    assertDateParsed('om 5 år', getRelativeDate(5));

    assertDateParsed('i forgårs', getRelativeDateReset(0,0,-2));
    assertDateParsed('forgårs', getRelativeDateReset(0,0,-2));
    assertDateParsed('i går', getRelativeDateReset(0,0,-1));
    assertDateParsed('i dag', getRelativeDateReset(0,0,0));
    assertDateParsed('idag', getRelativeDateReset(0,0,0));
    assertDateParsed('imorgen', getRelativeDateReset(0,0,1));
    assertDateParsed('i morgen', getRelativeDateReset(0,0,1));
    assertDateParsed('i overmorgen', getRelativeDateReset(0,0,2));
    assertDateParsed('i over morgen', getRelativeDateReset(0,0,2));

    assertDateParsed('sidste uge', getRelativeDate(0,0,-7));
    assertDateParsed('i sidste uge', getRelativeDate(0,0, -7));
    assertDateParsed('næste uge', getRelativeDate(0,0,7));
    assertDateParsed('naeste uge', getRelativeDate(0,0,7));
    assertDateParsed('sidste måned', getRelativeDate(0,-1));
    assertDateParsed('næste måned', getRelativeDate(0,1));
    assertDateParsed('sidste år', getRelativeDate(-1));
    assertDateParsed('næste år', getRelativeDate(1));
    assertDateParsed('sidste mandag', testGetWeekday(1,-1));
    assertDateParsed('næste mandag', testGetWeekday(1,1));

    assertDateParsed('i går', getRelativeDateReset(0,0,-1));
    assertDateParsed('i overmorgen', getRelativeDateReset(0,0,2));
    assertDateParsed('i over morgen', getRelativeDateReset(0,0,2));

    assertDateParsed('sidste uge', getRelativeDate(0,0,-7));
    assertDateParsed('sidste måned', getRelativeDate(0,-1));
    assertDateParsed('næste måned', getRelativeDate(0, 1));
    assertDateParsed('sidste år', getRelativeDate(-1));
    assertDateParsed('næste år', getRelativeDate(1));

    assertDateParsed('17:32 den 15. maj', new Date(now.getFullYear(), 4, 15, 17, 32));
    assertDateParsed('17:32 næste mandag', testGetWeekday(1, 1, 17, 32));

    // Numbers

    assertDateParsed('nul år siden',  getRelativeDate(0));
    assertDateParsed('et år siden',   getRelativeDate(-1));
    assertDateParsed('to år siden',   getRelativeDate(-2));
    assertDateParsed('tre år siden',  getRelativeDate(-3));
    assertDateParsed('fire år siden', getRelativeDate(-4));
    assertDateParsed('fem år siden',  getRelativeDate(-5));
    assertDateParsed('seks år siden', getRelativeDate(-6));
    assertDateParsed('syv år siden',  getRelativeDate(-7));
    assertDateParsed('otte år siden', getRelativeDate(-8));
    assertDateParsed('ni år siden',   getRelativeDate(-9));
    assertDateParsed('ti år siden',   getRelativeDate(-10));

  });

  method('format', function() {

    test(then, '5. januar 2010 15:52', 'default format');

    assertFormatShortcut(then, 'short', '05-01-2010');
    assertFormatShortcut(then, 'medium', '5. januar 2010');
    assertFormatShortcut(then, 'long', '5. januar 2010 15:52');
    assertFormatShortcut(then, 'full', 'tirsdag d. 5. januar 2010 15:52');
    test(then, ['{time}'], '15:52', 'preferred time');
    test(then, ['{stamp}'], 'tir 5 jan 2010 15:52', 'preferred stamp');
    test(then, ['%c'], 'tir 5 jan 2010 15:52', '%c stamp');

    test(new Date('January 3, 2010'), ['{w}'], '53', 'locale week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{ww}'], '53', 'locale week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{wo}'], '53rd', 'locale week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{w}'], '1', 'locale week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{ww}'], '01', 'locale week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{wo}'], '1st', 'locale week number ordinal | Jan 4 2010');

    test(new Date(2015, 10, 8), ['{Dow}'], 'søn', 'Sun');
    test(new Date(2015, 10, 9), ['{Dow}'], 'man', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], 'tir', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], 'ons', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], 'tor', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], 'fre', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], 'lør', 'Sat');
    test(new Date(2015, 0, 1), ['{Mon}'], 'jan', 'Jan');
    test(new Date(2015, 1, 1), ['{Mon}'], 'feb', 'Feb');
    test(new Date(2015, 2, 1), ['{Mon}'], 'mar', 'Mar');
    test(new Date(2015, 3, 1), ['{Mon}'], 'apr', 'Apr');
    test(new Date(2015, 4, 1), ['{Mon}'], 'maj', 'May');
    test(new Date(2015, 5, 1), ['{Mon}'], 'jun', 'Jun');
    test(new Date(2015, 6, 1), ['{Mon}'], 'jul', 'Jul');
    test(new Date(2015, 7, 1), ['{Mon}'], 'aug', 'Aug');
    test(new Date(2015, 8, 1), ['{Mon}'], 'sep', 'Sep');
    test(new Date(2015, 9, 1), ['{Mon}'], 'okt', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], 'nov', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], 'dec', 'Dec');

  });

  method('relative', function() {
    assertRelative('1 second ago', '1 sekund siden');
    assertRelative('1 minute ago', '1 minut siden');
    assertRelative('1 hour ago', '1 time siden');
    assertRelative('1 day ago', '1 dag siden');
    assertRelative('1 week ago', '1 uge siden');
    assertRelative('1 month ago', '1 måned siden');
    assertRelative('1 year ago', '1 år siden');

    assertRelative('5 seconds ago', '5 sekunder siden');
    assertRelative('5 minutes ago', '5 minutter siden');
    assertRelative('5 hours ago', '5 timer siden');
    assertRelative('5 days ago', '5 dage siden');
    assertRelative('3 weeks ago', '3 uger siden');
    assertRelative('5 weeks ago', '1 måned siden');
    assertRelative('5 months ago', '5 måneder siden');
    assertRelative('5 years ago', '5 år siden');

    assertRelative('1 second from now', 'om 1 sekund');
    assertRelative('1 minute from now', 'om 1 minut');
    assertRelative('1 hour from now', 'om 1 time');
    assertRelative('1 day from now', 'om 1 dag');
    assertRelative('1 week from now', 'om 1 uge');
    assertRelative('1 year from now', 'om 1 år');

    assertRelative('5 second from now', 'om 5 sekunder')
    assertRelative('5 minutes from now', 'om 5 minutter');
    assertRelative('5 hour from now', 'om 5 timer');
    assertRelative('5 day from now', 'om 5 dage');
    assertRelative('3 weeks from now', 'om 3 uger');
    assertRelative('5 weeks from now', 'om 1 måned');
    assertRelative('5 year from now', 'om 5 år');
  });

  method('beginning/end', function() {
    equal(run(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(run(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Danish', function () {
  method('duration', function() {
    test(run(5, 'hours'), ['da'], '5 timer', 'simple duration');
  });
});
