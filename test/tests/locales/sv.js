package('Dates Swedish', function () {
  "use strict";

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('sv');
  });

  method('create', function() {

    dateEqual(testCreateDate('den 15 maj 2011'), new Date(2011, 4, 15), 'basic Swedish date');
    dateEqual(testCreateDate('15 maj 2011'), new Date(2011, 4, 15), 'basic Swedish date');
    dateEqual(testCreateDate('tisdag 5 januari 2012'), new Date(2012, 0, 5), '2012-01-05');
    dateEqual(testCreateDate('tisdag, 5 januari 2012'), new Date(2012, 0, 5), '2012-01-05');
    dateEqual(testCreateDate('maj 2011'), new Date(2011, 4), 'year and month');
    dateEqual(testCreateDate('15 maj'), new Date(now.getFullYear(), 4, 15), 'month and date');
    dateEqual(testCreateDate('2011'), new Date(2011, 0), 'year');
    dateEqual(testCreateDate('maj'), new Date(now.getFullYear(), 4), 'month');
    dateEqual(testCreateDate('måndag'), getDateWithWeekdayAndOffset(1), 'Monday');

    dateEqual(testCreateDate('15 maj 2011 3:45'), new Date(2011, 4, 15, 3, 45), 'basic Swedish date 3:45');
    dateEqual(testCreateDate('15 maj 2011 3:45pm'), new Date(2011, 4, 15, 15, 45), 'basic Swedish date 3:45pm');

    dateEqual(testCreateDate('för en millisekund sedan'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('för en sekund sedan'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('för en minut sedan'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    dateEqual(testCreateDate('för en timme sedan'), getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('för en dag sedan'), getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('för en vecka sedan'), getRelativeDate(null, null, -7), 'one week ago');
    dateEqual(testCreateDate('för en månad sedan'), getRelativeDate(null, -1), 'one month ago');
    dateEqual(testCreateDate('för ett år sedan'), getRelativeDate(-1), 'one year ago');
    dateEqual(testCreateDate('ett år sen'), getRelativeDate(-1), 'one year ago');

    dateEqual(testCreateDate('ett ar sen'), getRelativeDate(-1), 'one year ago');

    dateEqual(testCreateDate('om 5 millisekunder'), getRelativeDate(null, null, null, null, null, null,5), 'dans | five milliseconds from now');
    dateEqual(testCreateDate('om 5 sekunder'), getRelativeDate(null, null, null, null, null, 5), 'dans | five second from now');
    dateEqual(testCreateDate('om 5 minuter'), getRelativeDate(null, null, null, null, 5), 'dans | five minute from now');
    dateEqual(testCreateDate('om 5 timmar'), getRelativeDate(null, null, null, 5), 'dans | five hour from now');
    dateEqual(testCreateDate('om 5 dagar'), getRelativeDate(null, null, 5), 'dans | five day from now');
    dateEqual(testCreateDate('om 5 veckor'), getRelativeDate(null, null, 35), 'dans | five weeks from now');
    dateEqual(testCreateDate('om 5 månader'), getRelativeDate(null, 5), 'dans | five months from now');
    dateEqual(testCreateDate('om 5 år'), getRelativeDate(5), 'dans | five years from now');


    dateEqual(testCreateDate('i förrgår'), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    dateEqual(testCreateDate('förrgår'), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    dateEqual(testCreateDate('i går'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('igår'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('i dag'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('idag'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('imorgon'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    dateEqual(testCreateDate('i morgon'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    dateEqual(testCreateDate('i övermorgon'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');
    dateEqual(testCreateDate('i över morgon'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');

    dateEqual(testCreateDate('förra veckan'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('i förra veckan'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('nästa vecka'), getRelativeDate(null, null, 7), 'Next week');
    dateEqual(testCreateDate('nasta vecka'), getRelativeDate(null, null, 7), 'Next week');

    dateEqual(testCreateDate('förra månaden'), getRelativeDate(null, -1), 'last month');
    dateEqual(testCreateDate('nästa månad'), getRelativeDate(null, 1), 'Next month');

    dateEqual(testCreateDate('förra året'), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate('nästa år'), getRelativeDate(1), 'Next year');

    dateEqual(testCreateDate('förra måndagen'), getDateWithWeekdayAndOffset(1,  -7), 'last monday');
    dateEqual(testCreateDate('nästa måndag'), getDateWithWeekdayAndOffset(1, 7), 'next monday');


    // no accents
    dateEqual(testCreateDate('mandag'), getDateWithWeekdayAndOffset(1), 'Monday');
    dateEqual(testCreateDate('for en millisekund sedan'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('for en sekund sedan'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('for en minut sedan'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    dateEqual(testCreateDate('for en timme sedan'), getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('for en dag sedan'), getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('for en vecka sedan'), getRelativeDate(null, null, -7), 'one week ago');
    dateEqual(testCreateDate('for en manad sedan'), getRelativeDate(null, -1), 'one month ago');
    dateEqual(testCreateDate('for ett ar sedan'), getRelativeDate(-1), 'one year ago');
    dateEqual(testCreateDate('ett ar sen'), getRelativeDate(-1), 'one year ago');

    dateEqual(testCreateDate('om 5 manader'), getRelativeDate(null, 5), 'dans | five months from now');
    dateEqual(testCreateDate('om 5 ar'), getRelativeDate(5), 'dans | five years from now');

    dateEqual(testCreateDate('i forrgar'), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    dateEqual(testCreateDate('förrgår'), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    dateEqual(testCreateDate('i gar'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('igar'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('i overmorgon'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');
    dateEqual(testCreateDate('i over morgon'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');

    dateEqual(testCreateDate('forra veckan'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('i forra veckan'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('nasta vecka'), getRelativeDate(null, null, 7), 'Next week');
    dateEqual(testCreateDate('forra manaden'), getRelativeDate(null, -1), 'last month');
    dateEqual(testCreateDate('nasta manad'), getRelativeDate(null, 1), 'Next month');
    dateEqual(testCreateDate('forra aret'), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate('nasta ar'), getRelativeDate(1), 'Next year');

  });

  method('format', function() {

    test(then, '5 januari 2010 15:52', 'default format');

    assertFormatShortcut(then, 'short', '2010-01-05');
    assertFormatShortcut(then, 'medium', '5 januari 2010');
    assertFormatShortcut(then, 'long', '5 januari 2010 15:52');
    assertFormatShortcut(then, 'full', 'tisdag 5 januari 2010 15:52');
    test(then, ['{time}'], '15:52', 'preferred time');
    test(then, ['{stamp}'], 'tis 5 jan 2010 15:52', 'preferred stamp');
    test(then, ['%c'], 'tis 5 jan 2010 15:52', '%c stamp');

    test(new Date('January 3, 2010'), ['{w}'], '53', 'locale week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{ww}'], '53', 'locale week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{wo}'], '53rd', 'locale week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{w}'], '1', 'locale week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{ww}'], '01', 'locale week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{wo}'], '1st', 'locale week number ordinal | Jan 4 2010');

    test(new Date(2015, 10, 8),  ['{Dow}'], 'sön', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], 'mån', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], 'tis', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], 'ons', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], 'tor', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], 'fre', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], 'lör', 'Sat');

    test(new Date(2015, 0, 1),  ['{Mon}'], 'jan', 'Jan');
    test(new Date(2015, 1, 1),  ['{Mon}'], 'feb', 'Feb');
    test(new Date(2015, 2, 1),  ['{Mon}'], 'mar', 'Mar');
    test(new Date(2015, 3, 1),  ['{Mon}'], 'apr', 'Apr');
    test(new Date(2015, 4, 1),  ['{Mon}'], 'maj', 'May');
    test(new Date(2015, 5, 1),  ['{Mon}'], 'jun', 'Jun');
    test(new Date(2015, 6, 1),  ['{Mon}'], 'jul', 'Jul');
    test(new Date(2015, 7, 1),  ['{Mon}'], 'aug', 'Aug');
    test(new Date(2015, 8, 1),  ['{Mon}'], 'sep', 'Sep');
    test(new Date(2015, 9, 1),  ['{Mon}'], 'okt', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], 'nov', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], 'dec', 'Dec');

  });


  method('relative', function() {
    assertRelative('1 second ago', '1 sekund sedan');
    assertRelative('1 minute ago', '1 minut sedan');
    assertRelative('1 hour ago',   '1 timme sedan');
    assertRelative('1 day ago',    '1 dag sedan');
    assertRelative('1 week ago',   '1 vecka sedan');
    assertRelative('1 month ago',  '1 månad sedan');
    assertRelative('1 year ago',   '1 år sedan');

    assertRelative('5 seconds ago', '5 sekunder sedan');
    assertRelative('5 minutes ago', '5 minuter sedan');
    assertRelative('5 hours ago',   '5 timmar sedan');
    assertRelative('5 days ago',    '5 dagar sedan');
    assertRelative('3 weeks ago',   '3 veckor sedan');
    assertRelative('5 weeks ago',   '1 månad sedan');
    assertRelative('5 months ago',  '5 månader sedan');
    assertRelative('5 years ago',   '5 år sedan');

    assertRelative('1 second from now', 'om 1 sekund');
    assertRelative('1 minute from now', 'om 1 minut');
    assertRelative('1 hour from now',   'om 1 timme');
    assertRelative('1 day from now',    'om 1 dag');
    assertRelative('1 week from now',   'om 1 vecka');
    assertRelative('1 year from now',   'om 1 år');

    assertRelative('5 seconds from now', 'om 5 sekunder');
    assertRelative('5 minutes from now', 'om 5 minuter');
    assertRelative('5 hours from now',   'om 5 timmar');
    assertRelative('5 days from now',    'om 5 dagar');
    assertRelative('3 weeks from now',   'om 3 veckor');
    assertRelative('5 weeks from now',   'om 1 månad');
    assertRelative('5 year from now',    'om 5 år');
  });

  method('beginning/end', function() {
    dateEqual(dateRun(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    dateEqual(dateRun(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

package('Number | Swedish Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['sv'], '5 timmar', 'simple duration');
  });

});

