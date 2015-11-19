package('Dates Dutch', function () {
  "use strict";

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('nl');
  });


  method('create', function() {
    dateEqual(testCreateDate('15 mei 2011'), new Date(2011, 4, 15), 'basic Dutch date');
    dateEqual(testCreateDate('Dinsdag, 5 Januari 2012'), new Date(2012, 0, 5), '2012-01-05');
    dateEqual(testCreateDate('Mei 2011'), new Date(2011, 4), 'year and month');
    dateEqual(testCreateDate('15 Mei'), new Date(now.getFullYear(), 4, 15), 'month and date');
    dateEqual(testCreateDate('2011'), new Date(2011, 0), 'year');
    dateEqual(testCreateDate('Mei'), new Date(now.getFullYear(), 4), 'month');
    dateEqual(testCreateDate('maandag'), getDateWithWeekdayAndOffset(1), 'Monday');
    dateEqual(testCreateDate('Ma'), getDateWithWeekdayAndOffset(1), 'Monday abbreviated');

    dateEqual(testCreateDate('Dinsdag, 5 Januari 2012 3:45'), new Date(2012, 0, 5, 3, 45), '2012-01-05 3:45');
    equal(run(testCreateDate('Dinsdag, 5 Januari 2012 3:45pm'), 'isValid'), false, 'does not support am/pm');

    dateEqual(testCreateDate('een milliseconde geleden'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('een seconde geleden'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('een minuut geleden'), getRelativeDate(null, null, null, null, -1), 'one minuto ago');
    dateEqual(testCreateDate("een uur geleden"), getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('een dag geleden'), getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('een week geleden'), getRelativeDate(null, null, -7), 'one week ago');
    dateEqual(testCreateDate('een maand geleden'), getRelativeDate(null, -1), 'one month ago');
    dateEqual(testCreateDate('een jaar geleden'), getRelativeDate(-1), 'one year ago');


    dateEqual(testCreateDate('5 milliseconden vanaf nu'), getRelativeDate(null, null, null, null, null, null,5), 'danni | five milliseconds from now');
    dateEqual(testCreateDate('5 seconden vanaf nu'), getRelativeDate(null, null, null, null, null, 5), 'danni | five second from now');
    dateEqual(testCreateDate('5 minuten vanaf nu'), getRelativeDate(null, null, null, null, 5), 'danni | five minuto from now');
    dateEqual(testCreateDate('5 uur vanaf nu'), getRelativeDate(null, null, null, 5), 'danni | five hour from now');
    dateEqual(testCreateDate('5 dagen vanaf nu'), getRelativeDate(null, null, 5), 'danni | five day from now');
    dateEqual(testCreateDate('5 weken vanaf nu'), getRelativeDate(null, null, 35), 'danni | five weeks from now');
    dateEqual(testCreateDate('5 maanden vanaf nu'), getRelativeDate(null, 5), 'danni | five months from now');
    dateEqual(testCreateDate('5 jaar vanaf nu'), getRelativeDate(5), 'danni | five years from now');


    dateEqual(testCreateDate('gisteren'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('vandaag'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('morgen'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    dateEqual(testCreateDate('overmorgen'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');

    dateEqual(testCreateDate('laatste week'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('volgende week'), getRelativeDate(null, null, 7), 'Next week');

    dateEqual(testCreateDate('vorige maand'), getRelativeDate(null, -1), 'last month');
    dateEqual(testCreateDate('volgende maand'), getRelativeDate(null, 1), 'Next month');

    dateEqual(testCreateDate("afgelopen jaar"), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate("volgend jaar"), getRelativeDate(1), 'Next year');

    dateEqual(testCreateDate("volgende maandag"), getDateWithWeekdayAndOffset(1, 7), 'next monday');
    dateEqual(testCreateDate("afgelopen maandag"), getDateWithWeekdayAndOffset(1, -7), 'last monday');

    dateEqual(testCreateDate("afgelopen maandag 3:45"), run(getDateWithWeekdayAndOffset(1, -7), 'set', [{ hour: 3, minute: 45 }, true]), 'last monday 3:45');

    // Issue #152 Dutch should not use a variant in any format
    dateEqual(testCreateDate('15/3/2012 12:45'), new Date(2012, 2, 15, 12, 45), 'slash format with time');
    dateEqual(testCreateDate('12:45 15/3/2012'), new Date(2012, 2, 15, 12, 45), 'slash format with time front');

    // Issue #150 Fully qualified ISO codes should be allowed
    dateEqual(testCreateDate('7 januari 2012', 'nl_NL'), new Date(2012, 0, 7), 'nl_NL');
    dateEqual(testCreateDate('7 januari 2012', 'nl-NL'), new Date(2012, 0, 7), 'nl-NL');

    // Issue #150 Unrecognized locales will result in invalid dates, but will not throw an error
    // Update: Now it will fall back to the current locale.
    equal(run(testCreateDate('7 januari 2012', 'ux_UX'), 'isValid'), true, 'unknown locale code');
    equal(run(testCreateDate('2012/08/25', 'ux_UX'), 'isValid'), true, 'System intelligible formats are still parsed');

    dateEqual(testCreateDate('17:32 18 augustus'), new Date(now.getFullYear(), 7, 18, 17, 32), 'August 18, 17:32');

    dateEqual(testCreateDate('morgen \'s 3:30'), run(getRelativeDate(null, null, 1), 'set', [{hours:3,minutes:30}, true]), 'tomorrow at 3:30');

  });

  method('format', function() {

    test(then, '5 januari 2010 15:52', 'default format');

    assertFormatShortcut(then, 'short', '05-01-2010');
    assertFormatShortcut(then, 'medium', '5 januari 2010');
    assertFormatShortcut(then, 'long', '5 januari 2010 15:52');
    assertFormatShortcut(then, 'full', 'dinsdag 5 januari 2010 15:52');
    test(then, ['{time}'], '15:52', 'preferred time');
    test(then, ['{stamp}'], 'di 5 jan 2010 15:52', 'preferred stamp');
    test(then, ['%c'], 'di 5 jan 2010 15:52', '%c stamp');

    test(new Date(), ['{tt}'], '', 'am/pm token should not raise an error');

    test(new Date('January 3, 2010'), ['{w}'], '53', 'locale week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{ww}'], '53', 'locale week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{wo}'], '53rd', 'locale week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{w}'], '1', 'locale week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{ww}'], '01', 'locale week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{wo}'], '1st', 'locale week number ordinal | Jan 4 2010');

    test(new Date(2015, 10, 8),  ['{Dow}'], 'zo', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], 'ma', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], 'di', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], 'wo', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], 'do', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], 'vr', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], 'za', 'Sat');

    test(new Date(2015, 0, 1),  ['{Mon}'], 'jan', 'Jan');
    test(new Date(2015, 1, 1),  ['{Mon}'], 'feb', 'Feb');
    test(new Date(2015, 2, 1),  ['{Mon}'], 'mrt', 'Mar');
    test(new Date(2015, 3, 1),  ['{Mon}'], 'apr', 'Apr');
    test(new Date(2015, 4, 1),  ['{Mon}'], 'mei', 'May');
    test(new Date(2015, 5, 1),  ['{Mon}'], 'jun', 'Jun');
    test(new Date(2015, 6, 1),  ['{Mon}'], 'jul', 'Jul');
    test(new Date(2015, 7, 1),  ['{Mon}'], 'aug', 'Aug');
    test(new Date(2015, 8, 1),  ['{Mon}'], 'sep', 'Sep');
    test(new Date(2015, 9, 1),  ['{Mon}'], 'okt', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], 'nov', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], 'dec', 'Dec');

  });


  method('relative', function() {
    assertRelative('1 second ago', '1 seconde geleden');
    assertRelative('1 minute ago', '1 minuut geleden');
    assertRelative('1 hour ago', '1 uur geleden');
    assertRelative('1 day ago', '1 dag geleden');
    assertRelative('1 week ago', '1 week geleden');
    assertRelative('1 month ago', '1 maand geleden');
    assertRelative('1 year ago', '1 jaar geleden');

    assertRelative('2 seconds ago', '2 seconden geleden');
    assertRelative('2 minutes ago', '2 minuten geleden');
    assertRelative('2 hours ago', '2 uur geleden');
    assertRelative('2 days ago', '2 dagen geleden');
    assertRelative('2 weeks ago', '2 weken geleden');
    assertRelative('2 months ago', '2 maanden geleden');
    assertRelative('2 years ago', '2 jaar geleden');

    assertRelative('1 second from now', '1 seconde vanaf nu');
    assertRelative('1 minute from now', '1 minuut vanaf nu');
    assertRelative('1 hour from now', '1 uur vanaf nu');
    assertRelative('1 day from now', '1 dag vanaf nu');
    assertRelative('1 week from now', '1 week vanaf nu');
    assertRelative('1 year from now', '1 jaar vanaf nu');

    assertRelative('5 seconds from now', '5 seconden vanaf nu');
    assertRelative('5 minutes from now','5 minuten vanaf nu');
    assertRelative('5 hours from now', '5 uur vanaf nu');
    assertRelative('5 days from now', '5 dagen vanaf nu');
    assertRelative('5 weeks from now', '1 maand vanaf nu');
    assertRelative('5 years from now', '5 jaar vanaf nu');
  });

  method('beginning/end', function() {
    dateEqual(dateRun(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    dateEqual(dateRun(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

package('Number | Dutch Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['nl'], '5 uur', 'simple duration');
  });

});

