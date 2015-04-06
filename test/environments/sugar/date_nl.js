package('Date | Dutch', function () {

  var now = new Date();
  testSetLocale('nl');


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
    var then = new Date(2011, 7, 25, 15, 45, 50);
    test(then, '25 Augustus 2011 15:45', 'format');
    test(then, ['{dd} {Month} {yyyy}'], '25 Augustus 2011', 'format');

    // Format shortcuts
    equal(run(then, 'format', ['long']), '25 Augustus 2011 15:45', 'long format');
    equal(run(then, 'long'), '25 Augustus 2011 15:45', 'long shortcut');
    equal(run(then, 'format', ['full']), 'Donderdag 25 Augustus 2011 15:45:50', 'full format');
    equal(run(then, 'full'), 'Donderdag 25 Augustus 2011 15:45:50', 'full shortcut');
    equal(run(then, 'format', ['short']), '25 Augustus 2011', 'short format');
    equal(run(then, 'short'), '25 Augustus 2011', 'short shortcut');

    test(new Date(), ['{tt}'], '', 'am/pm token should not raise an error');

  });


  method('relative', function() {
    test(testCreateDate('1 second ago', 'en'), '1 seconde geleden', '1 second ago');
    test(testCreateDate('1 minute ago', 'en'), '1 minuut geleden', '1 minute ago');
    test(testCreateDate('1 hour ago', 'en'), '1 uur geleden', '1 hour ago');
    test(testCreateDate('1 day ago', 'en'), '1 dag geleden', '1 day ago');
    test(testCreateDate('1 week ago', 'en'), '1 week geleden', '1 week ago');
    test(testCreateDate('1 month ago', 'en'), '1 maand geleden', '1 month ago');
    test(testCreateDate('1 year ago', 'en'), '1 jaar geleden', '1 year ago');

    test(testCreateDate('2 seconds ago', 'en'), '2 seconden geleden', '2 seconds ago');
    test(testCreateDate('2 minutes ago', 'en'), '2 minuten geleden', '2 minutes ago');
    test(testCreateDate('2 hours ago', 'en'), '2 uur geleden', '2 hours ago');
    test(testCreateDate('2 days ago', 'en'), '2 dagen geleden', '2 days ago');
    test(testCreateDate('2 weeks ago', 'en'), '2 weken geleden', '2 weeks ago');
    test(testCreateDate('2 months ago', 'en'), '2 maanden geleden', '2 months ago');
    test(testCreateDate('2 years ago', 'en'), '2 jaar geleden', '2 years ago');

    test(testCreateDate('1 second from now', 'en'), '1 seconde vanaf nu', '1 second ago');
    test(testCreateDate('1 minute from now', 'en'), '1 minuut vanaf nu', '1 minute ago');
    test(testCreateDate('1 hour from now', 'en'), '1 uur vanaf nu', '1 hour ago');
    test(testCreateDate('1 day from now', 'en'), '1 dag vanaf nu', '1 day ago');
    test(testCreateDate('1 week from now', 'en'), '1 week vanaf nu', '1 week ago');
    testMonthsFromNow(1, '1 maand vanaf nu', '4 weken vanaf nu');
    test(testCreateDate('1 year from now', 'en'), '1 jaar vanaf nu', '1 year ago');

    test(testCreateDate('5 seconds from now', 'en'), '5 seconden vanaf nu', '5 seconds ago');
    test(testCreateDate('5 minutes from now', 'en'),'5 minuten vanaf nu', '5 minutes ago');
    test(testCreateDate('5 hours from now', 'en'), '5 uur vanaf nu', '5 hours ago');
    test(testCreateDate('5 days from now', 'en'), '5 dagen vanaf nu', '5 days ago');
    test(testCreateDate('5 weeks from now', 'en'), '1 maand vanaf nu', '5 weeks ago');
    testMonthsFromNow(5, '5 maanden vanaf nu', '4 maanden vanaf nu');
    test(testCreateDate('5 years from now', 'en'), '5 jaar vanaf nu', '5 years ago');
  });

});

package('Number | Dutch Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['nl'], '5 uur', 'simple duration');
  });

});

