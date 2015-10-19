package('Dates Italian', function () {
  "use strict";

  var now;
  var then;

  setup(function() {
    now = new Date();
    then = new Date(2011, 7, 25, 15, 45, 50);
    testSetLocale('it');
  });

  method('create', function() {

    dateEqual(testCreateDate('15 Maggio 2011'), new Date(2011, 4, 15), 'Date#create | basic Italian date');
    dateEqual(testCreateDate('Martedì, 5 Gennaio 2012'), new Date(2012, 0, 5), '2012-01-05');
    dateEqual(testCreateDate('Maggio 2011'), new Date(2011, 4), 'year and month');
    dateEqual(testCreateDate('15 Maggio'), new Date(now.getFullYear(), 4, 15), 'month and date');
    dateEqual(testCreateDate('2011'), new Date(2011, 0), 'year');
    dateEqual(testCreateDate('Maggio'), new Date(now.getFullYear(), 4), 'month');
    dateEqual(testCreateDate('Lunedì'), getDateWithWeekdayAndOffset(1), 'Monday');
    dateEqual(testCreateDate('Lun'), getDateWithWeekdayAndOffset(1), 'Monday abbreviated');

    dateEqual(testCreateDate('Martedì, 5 Gennaio 2012 3:45'), new Date(2012, 0, 5, 3, 45), '2012-01-05 3:45');
    dateEqual(testCreateDate('Martedì, 5 Gennaio 2012 3:45pm'), new Date(2012, 0, 5, 15, 45), '2012-01-05 3:45pm');

    dateEqual(testCreateDate('un millisecondo fa'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('un secondo fa'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('un minuto fa'), getRelativeDate(null, null, null, null, -1), 'one minuto ago');
    dateEqual(testCreateDate("un'ora fa"), getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('un giorno fa'), getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('una settimana fa'), getRelativeDate(null, null, -7), 'one week ago');
    dateEqual(testCreateDate('un mese fa'), getRelativeDate(null, -1), 'one month ago');
    dateEqual(testCreateDate('un anno fa'), getRelativeDate(-1), 'one year ago');


    dateEqual(testCreateDate('5 millisecondi da adesso'), getRelativeDate(null, null, null, null, null, null,5), 'danni | five milliseconds from now');
    dateEqual(testCreateDate('5 secondi da adesso'), getRelativeDate(null, null, null, null, null, 5), 'danni | five second from now');
    dateEqual(testCreateDate('5 minuti da adesso'), getRelativeDate(null, null, null, null, 5), 'danni | five minuto from now');
    dateEqual(testCreateDate('5 ore da adesso'), getRelativeDate(null, null, null, 5), 'danni | five hour from now');
    dateEqual(testCreateDate('5 giorni da adesso'), getRelativeDate(null, null, 5), 'danni | five day from now');
    dateEqual(testCreateDate('5 settimane da adesso'), getRelativeDate(null, null, 35), 'danni | five weeks from now');
    dateEqual(testCreateDate('5 mesi da adesso'), getRelativeDate(null, 5), 'danni | five months from now');
    dateEqual(testCreateDate('5 anni da adesso'), getRelativeDate(5), 'danni | five years from now');


    dateEqual(testCreateDate('ieri'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('oggi'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('domani'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    dateEqual(testCreateDate('dopodomani'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');

    dateEqual(testCreateDate('la settimana scorsa'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('la settimana prossima'), getRelativeDate(null, null, 7), 'Next week');

    dateEqual(testCreateDate('il mese scorso'), getRelativeDate(null, -1), 'last month');
    dateEqual(testCreateDate('il mese prossimo'), getRelativeDate(null, 1), 'Next month');

    dateEqual(testCreateDate("l'anno scorso"), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate("l'anno prossimo"), getRelativeDate(1), 'Next year');

    dateEqual(testCreateDate("prossimo lunedì"), getDateWithWeekdayAndOffset(1, 7), 'next monday');
    dateEqual(testCreateDate("scorsa lunedì"), getDateWithWeekdayAndOffset(1, -7), 'last monday');

    dateEqual(testCreateDate("scorsa lunedì 3:45"), run(getDateWithWeekdayAndOffset(1, -7), 'set', [{ hour: 3, minute: 45 }, true]), 'last monday 3:45');

    // No accents
    dateEqual(testCreateDate('Martedi, 5 Gennaio 2012'), new Date(2012, 0, 5), 'no accents | 2012-01-05');
    dateEqual(testCreateDate('Lunedi'), getDateWithWeekdayAndOffset(1), 'no accents | Monday');

    // Issue #152 Italian should not use a variant in any format
    dateEqual(testCreateDate('15/3/2012 12:45'), new Date(2012, 2, 15, 12, 45), 'slash format with time');
    dateEqual(testCreateDate('12:45 15/3/2012'), new Date(2012, 2, 15, 12, 45), 'slash format with time front');

    // Issue #150 Fully qualified ISO codes should be allowed
    dateEqual(testCreateDate('7 gennaio 2012', 'it_IT'), new Date(2012, 0, 7), 'it_IT');
    dateEqual(testCreateDate('7 gennaio 2012', 'it-IT'), new Date(2012, 0, 7), 'it-IT');

    // Issue #150 Unrecognized locales will result in invalid dates, but will not throw an error
    // Update: Now it will fall back to the current locale.
    equal(run(testCreateDate('7 gennaio 2012', 'ux_UX'), 'isValid'), true, 'unknown locale code');
    equal(run(testCreateDate('2012/08/25', 'ux_UX'), 'isValid'), true, 'System intelligible formats are still parsed');

    dateEqual(testCreateDate('17:32 18 agosto'), new Date(now.getFullYear(), 7, 18, 17, 32), 'August 18, 17:32');

    dateEqual(testCreateDate('domani alle 3:30'), run(getRelativeDate(null, null, 1), 'set', [{hours:3,minutes:30}, true]), 'tomorrow at 3:30');


  });


  method('format', function() {
    test(then, '25 Agosto 2011 15:45', 'format');
    test(then, ['{dd} {Month} {yyyy}'], '25 Agosto 2011', 'format');

    // Format shortcuts
    equal(run(then, 'format', ['long']), '25 Agosto 2011 15:45', 'long format');
    equal(run(then, 'long'), '25 Agosto 2011 15:45', 'long shortcut');
    equal(run(then, 'format', ['full']), 'Giovedì 25 Agosto 2011 15:45:50', 'full format');
    equal(run(then, 'full'), 'Giovedì 25 Agosto 2011 15:45:50', 'full shortcut');
    equal(run(then, 'format', ['short']), '25 Agosto 2011', 'short format');
    equal(run(then, 'short'), '25 Agosto 2011', 'short shortcut');
  });


  method('relative', function() {
    assertRelative('1 second ago', '1 secondo fa');
    assertRelative('1 minute ago', '1 minuto fa');
    assertRelative('1 hour ago',   '1 ora fa');
    assertRelative('1 day ago',    '1 giorno fa');
    assertRelative('1 week ago',   '1 settimana fa');
    assertRelative('1 month ago',  '1 mese fa');
    assertRelative('1 year ago',   '1 anno fa');

    assertRelative('2 seconds ago', '2 secondi fa');
    assertRelative('2 minutes ago', '2 minuti fa');
    assertRelative('2 hours ago',   '2 ore fa');
    assertRelative('2 days ago',    '2 giorni fa');
    assertRelative('2 weeks ago',   '2 settimane fa');
    assertRelative('2 months ago',  '2 mesi fa');
    assertRelative('2 years ago',   '2 anni fa');

    assertRelative('1 second from now', '1 secondo da adesso');
    assertRelative('1 minute from now', '1 minuto da adesso');
    assertRelative('1 hour from now',   '1 ora da adesso');
    assertRelative('1 day from now',    '1 giorno da adesso');
    assertRelative('1 week from now',   '1 settimana da adesso');
    assertRelative('1 year from now',   '1 anno da adesso');

    assertRelative('5 second from now', '5 secondi da adesso');
    assertRelative('5 minutes from now','5 minuti da adesso');
    assertRelative('5 hour from now',   '5 ore da adesso');
    assertRelative('5 day from now',    '5 giorni da adesso');
    assertRelative('5 week from now',   '1 mese da adesso');
    assertRelative('5 year from now',   '5 anni da adesso');
  });

});

package('Number | Italian Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['it'], '5 ore', 'simple duration');
  });

});

