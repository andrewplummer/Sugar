package('Date | Dutch', function () {

  var now = new Date();
  testSetLocale('nl');


  method('create', function() {
    dateEqual(testCreateDate('15 mei 2011'), new Date(2011, 4, 15), 'Date#create | basic Dutch date');
    dateEqual(testCreateDate('Dinsdag, 5 Januari 2012'), new Date(2012, 0, 5), 'Date#create | Dutch | 2012-01-05');
    dateEqual(testCreateDate('Mei 2011'), new Date(2011, 4), 'Date#create | Dutch | year and month');
    dateEqual(testCreateDate('15 Mei'), new Date(now.getFullYear(), 4, 15), 'Date#create | Dutch | month and date');
    dateEqual(testCreateDate('2011'), new Date(2011, 0), 'Date#create | Dutch | year');
    dateEqual(testCreateDate('Mei'), new Date(now.getFullYear(), 4), 'Date#create | Dutch | month');
    dateEqual(testCreateDate('maandag'), getDateWithWeekdayAndOffset(1), 'Date#create | Dutch | Monday');
    dateEqual(testCreateDate('Ma'), getDateWithWeekdayAndOffset(1), 'Date#create | Dutch | Monday abbreviated');

    dateEqual(testCreateDate('Dinsdag, 5 Januari 2012 3:45'), new Date(2012, 0, 5, 3, 45), 'Date#create | Dutch | 2012-01-05 3:45');
    equal(run(testCreateDate('Dinsdag, 5 Januari 2012 3:45pm'), 'isValid'), false, 'Date#create | Dutch | does not support am/pm');

    dateEqual(testCreateDate('een milliseconde geleden'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Dutch | one millisecond ago');
    dateEqual(testCreateDate('een seconde geleden'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Dutch | one second ago');
    dateEqual(testCreateDate('een minuut geleden'), getRelativeDate(null, null, null, null, -1), 'Date#create | Dutch | one minuto ago');
    dateEqual(testCreateDate("een uur geleden"), getRelativeDate(null, null, null, -1), 'Date#create | Dutch | one hour ago');
    dateEqual(testCreateDate('een dag geleden'), getRelativeDate(null, null, -1), 'Date#create | Dutch | one day ago');
    dateEqual(testCreateDate('een week geleden'), getRelativeDate(null, null, -7), 'Date#create | Dutch | one week ago');
    dateEqual(testCreateDate('een maand geleden'), getRelativeDate(null, -1), 'Date#create | Dutch | one month ago');
    dateEqual(testCreateDate('een jaar geleden'), getRelativeDate(-1), 'Date#create | Dutch | one year ago');


    dateEqual(testCreateDate('5 milliseconden vanaf nu'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | Dutch | danni | five milliseconds from now');
    dateEqual(testCreateDate('5 seconden vanaf nu'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Dutch | danni | five second from now');
    dateEqual(testCreateDate('5 minuten vanaf nu'), getRelativeDate(null, null, null, null, 5), 'Date#create | Dutch | danni | five minuto from now');
    dateEqual(testCreateDate('5 uur vanaf nu'), getRelativeDate(null, null, null, 5), 'Date#create | Dutch | danni | five hour from now');
    dateEqual(testCreateDate('5 dagen vanaf nu'), getRelativeDate(null, null, 5), 'Date#create | Dutch | danni | five day from now');
    dateEqual(testCreateDate('5 weken vanaf nu'), getRelativeDate(null, null, 35), 'Date#create | Dutch | danni | five weeks from now');
    dateEqual(testCreateDate('5 maanden vanaf nu'), getRelativeDate(null, 5), 'Date#create | Dutch | danni | five months from now');
    dateEqual(testCreateDate('5 jaar vanaf nu'), getRelativeDate(5), 'Date#create | Dutch | danni | five years from now');


    dateEqual(testCreateDate('gisteren'), run(getRelativeDate(null, null, -1), 'reset'), 'Date#create | Dutch | yesterday');
    dateEqual(testCreateDate('vandaag'), run(getRelativeDate(null, null, 0), 'reset'), 'Date#create | Dutch | today');
    dateEqual(testCreateDate('morgen'), run(getRelativeDate(null, null, 1), 'reset'), 'Date#create | Dutch | tomorrow');
    dateEqual(testCreateDate('overmorgen'), run(getRelativeDate(null, null, 2), 'reset'), 'Date#create | Dutch | day after tomorrow');

    dateEqual(testCreateDate('laatste week'), getRelativeDate(null, null, -7), 'Date#create | Dutch | Last week');
    dateEqual(testCreateDate('volgende week'), getRelativeDate(null, null, 7), 'Date#create | Dutch | Next week');

    dateEqual(testCreateDate('vorige maand'), getRelativeDate(null, -1), 'Date#create | Dutch | last month');
    dateEqual(testCreateDate('volgende maand'), getRelativeDate(null, 1), 'Date#create | Dutch | Next month');

    dateEqual(testCreateDate("afgelopen jaar"), getRelativeDate(-1), 'Date#create | Dutch | Last year');
    dateEqual(testCreateDate("volgend jaar"), getRelativeDate(1), 'Date#create | Dutch | Next year');

    dateEqual(testCreateDate("volgende maandag"), getDateWithWeekdayAndOffset(1, 7), 'Date#create | Dutch | next monday');
    dateEqual(testCreateDate("afgelopen maandag"), getDateWithWeekdayAndOffset(1, -7), 'Date#create | Dutch | last monday');

    dateEqual(testCreateDate("afgelopen maandag 3:45"), run(getDateWithWeekdayAndOffset(1, -7), 'set', [{ hour: 3, minute: 45 }, true]), 'Date#create | Dutch | last monday 3:45');

    // Issue #152 Dutch should not use a variant in any format
    dateEqual(testCreateDate('15/3/2012 12:45'), new Date(2012, 2, 15, 12, 45), 'Date#create | Dutch | slash format with time');
    dateEqual(testCreateDate('12:45 15/3/2012'), new Date(2012, 2, 15, 12, 45), 'Date#create | Dutch | slash format with time front');

    // Issue #150 Fully qualified ISO codes should be allowed
    dateEqual(testCreateDate('7 januari 2012', 'nl_NL'), new Date(2012, 0, 7), 'Date#create | Dutch | nl_NL');
    dateEqual(testCreateDate('7 januari 2012', 'nl-NL'), new Date(2012, 0, 7), 'Date#create | Dutch | nl-NL');

    // Issue #150 Unrecognized locales will result in invalid dates, but will not throw an error
    // Update: Now it will fall back to the current locale.
    equal(run(testCreateDate('7 januari 2012', 'ux_UX'), 'isValid'), true, 'Date#create | Dutch | unknown locale code');
    equal(run(testCreateDate('2012/08/25', 'ux_UX'), 'isValid'), true, 'Date#create | Dutch | System intelligible formats are still parsed');

    dateEqual(testCreateDate('17:32 18 augustus'), new Date(now.getFullYear(), 7, 18, 17, 32), 'Date#create | Dutch | August 18, 17:32');

    dateEqual(testCreateDate('morgen \'s 3:30'), run(getRelativeDate(null, null, 1), 'set', [{hours:3,minutes:30}, true]), 'Date#create | Dutch | tomorrow at 3:30');

  });

  method('format', function() {
    var then = new Date(2011, 7, 25, 15, 45, 50);
    test(then, '25 Augustus 2011 15:45', 'Date#create | Dutch | format');
    test(then, ['{dd} {Month} {yyyy}'], '25 Augustus 2011', 'Date#create | Dutch | format');

    // Format shortcuts
    equal(run(then, 'format', ['long']), '25 Augustus 2011 15:45', 'Date#create | Dutch | long format');
    equal(run(then, 'long'), '25 Augustus 2011 15:45', 'Date#create | Dutch | long shortcut');
    equal(run(then, 'format', ['full']), 'Donderdag 25 Augustus 2011 15:45:50', 'Date#create | Dutch | full format');
    equal(run(then, 'full'), 'Donderdag 25 Augustus 2011 15:45:50', 'Date#create | Dutch | full shortcut');
    equal(run(then, 'format', ['short']), '25 Augustus 2011', 'Date#create | Dutch | short format');
    equal(run(then, 'short'), '25 Augustus 2011', 'Date#create | Dutch | short shortcut');

    test(new Date(), ['{tt}'], '', 'Date#format | Dutch | am/pm token should not raise an error');

  });


  method('relative', function() {
    test(testCreateDate('1 second ago', 'en'), '1 seconde geleden', 'Date#create | Dutch | relative format past');
    test(testCreateDate('1 minute ago', 'en'), '1 minuut geleden',  'Date#create | Dutch | relative format past');
    test(testCreateDate('1 hour ago', 'en'),   '1 uur geleden',     'Date#create | Dutch | relative format past');
    test(testCreateDate('1 day ago', 'en'),    '1 dag geleden',    'Date#create | Dutch | relative format past');
    test(testCreateDate('1 week ago', 'en'),   '1 week geleden',  'Date#create | Dutch | relative format past');
    test(testCreateDate('1 month ago', 'en'),  '1 maand geleden',   'Date#create | Dutch | relative format past');
    test(testCreateDate('1 year ago', 'en'),   '1 jaar geleden',     'Date#create | Dutch | relative format past');

    test(testCreateDate('2 seconds ago', 'en'), '2 seconden geleden', 'Date#create | Dutch | relative format past');
    test(testCreateDate('2 minutes ago', 'en'), '2 minuten geleden',  'Date#create | Dutch | relative format past');
    test(testCreateDate('2 hours ago', 'en'),   '2 uur geleden',     'Date#create | Dutch | relative format past');
    test(testCreateDate('2 days ago', 'en'),    '2 dagen geleden',    'Date#create | Dutch | relative format past');
    test(testCreateDate('2 weeks ago', 'en'),   '2 weken geleden',  'Date#create | Dutch | relative format past');
    test(testCreateDate('2 months ago', 'en'),  '2 maanden geleden',   'Date#create | Dutch | relative format past');
    test(testCreateDate('2 years ago', 'en'),   '2 jaar geleden',     'Date#create | Dutch | relative format past');

    test(testCreateDate('1 second from now', 'en'), '1 seconde vanaf nu', 'Date#create | Dutch | relative format future');
    test(testCreateDate('1 minute from now', 'en'), '1 minuut vanaf nu',  'Date#create | Dutch | relative format future');
    test(testCreateDate('1 hour from now', 'en'),   '1 uur vanaf nu',     'Date#create | Dutch | relative format future');
    test(testCreateDate('1 day from now', 'en'),    '1 dag vanaf nu',    'Date#create | Dutch | relative format future');
    test(testCreateDate('1 week from now', 'en'),   '1 week vanaf nu',  'Date#create | Dutch | relative format future');
    test(testCreateDate('1 month from now', 'en'),  '1 maand vanaf nu',   'Date#create | Dutch | relative format future');
    test(testCreateDate('1 year from now', 'en'),   '1 jaar vanaf nu',     'Date#create | Dutch | relative format future');

    test(testCreateDate('5 second from now', 'en'), '5 seconden vanaf nu', 'Date#create | Dutch | relative format future');
    test(testCreateDate('5 minutes from now', 'en'),'5 minuten vanaf nu',  'Date#create | Dutch | relative format future');
    test(testCreateDate('5 hour from now', 'en'),   '5 uur vanaf nu',     'Date#create | Dutch | relative format future');
    test(testCreateDate('5 day from now', 'en'),    '5 dagen vanaf nu',    'Date#create | Dutch | relative format future');
    test(testCreateDate('5 week from now', 'en'),   '1 maand vanaf nu',  'Date#create | Dutch | relative format future');
    test(testCreateDate('5 month from now', 'en'),  '5 maanden vanaf nu',   'Date#create | Dutch | relative format future');
    test(testCreateDate('5 year from now', 'en'),   '5 jaar vanaf nu',     'Date#create | Dutch | relative format future');
  });

});

package('Number | Dutch Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['nl'], '5 uur', 'Date#create | Dutch | simple duration');
  });

});

