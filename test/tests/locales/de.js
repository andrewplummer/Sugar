namespace('Date | German', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('de');
  });

  method('create', function() {
    equal(testCreateDate('15. Mai 2011'), new Date(2011, 4, 15), 'Date#create | basic German date');
    equal(testCreateDate('Dienstag, 5. Januar 2012'), new Date(2012, 0, 5), '2012-01-05');
    equal(testCreateDate('Mai 2011'), new Date(2011, 4), 'year and month');
    equal(testCreateDate('15. Mai'), new Date(now.getFullYear(), 4, 15), 'month and date');
    equal(testCreateDate('2011'), new Date(2011, 0), 'year');
    equal(testCreateDate('02. Feb. 2016'), new Date(2016, 1, 2), 'toLocaleDateString');

    equal(testCreateDate('Dienstag, 5. Januar 2012 3:45'), new Date(2012, 0, 5, 3, 45), '2012-01-05 3:45');
    equal(testCreateDate('Dienstag, 5. Januar 2012 3:45pm'), new Date(2012, 0, 5, 15, 45), '2012-01-05 3:45pm');

    equal(testCreateDate('Januar'), new Date(now.getFullYear(), 0), 'January');
    equal(testCreateDate('Februar'), new Date(now.getFullYear(), 1), 'February');
    equal(testCreateDate('Marz'), new Date(now.getFullYear(), 2), 'March');
    equal(testCreateDate('März'), new Date(now.getFullYear(), 2), 'March');
    equal(testCreateDate('April'), new Date(now.getFullYear(), 3), 'April');
    equal(testCreateDate('Mai'), new Date(now.getFullYear(), 4), 'May');
    equal(testCreateDate('Juni'), new Date(now.getFullYear(), 5), 'June');
    equal(testCreateDate('Juli'), new Date(now.getFullYear(), 6), 'July');
    equal(testCreateDate('August'), new Date(now.getFullYear(), 7), 'August');
    equal(testCreateDate('September'), new Date(now.getFullYear(), 8), 'September');
    equal(testCreateDate('Oktober'), new Date(now.getFullYear(), 9), 'October');
    equal(testCreateDate('November'), new Date(now.getFullYear(), 10), 'November');
    equal(testCreateDate('Dezember'), new Date(now.getFullYear(), 11), 'December');


    equal(testCreateDate('Sonntag'), getDateWithWeekdayAndOffset(0), 'Sunday');
    equal(testCreateDate('Montag'), getDateWithWeekdayAndOffset(1), 'Monday');
    equal(testCreateDate('Dienstag'), getDateWithWeekdayAndOffset(2), 'Tuesday');
    equal(testCreateDate('Mittwoch'), getDateWithWeekdayAndOffset(3), 'Wednesday');
    equal(testCreateDate('Donnerstag'), getDateWithWeekdayAndOffset(4), 'Thursday');
    equal(testCreateDate('Freitag'), getDateWithWeekdayAndOffset(5), 'Friday');
    equal(testCreateDate('Samstag'), getDateWithWeekdayAndOffset(6), 'Saturday');

    equal(testCreateDate('einer Millisekunde vorher'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    equal(testCreateDate('eine Sekunde vorher'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    equal(testCreateDate('einer Minute vorher'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    equal(testCreateDate('einer Stunde vorher'), getRelativeDate(null, null, null, -1), 'one hour ago');
    equal(testCreateDate('einen Tag vorher'), getRelativeDate(null, null, -1), 'one day ago');
    equal(testCreateDate('eine Woche vorher'), getRelativeDate(null, null, -7), 'one week ago');
    equal(testCreateDate('einen Monat vorher'), getRelativeDate(null, -1), 'one month ago');
    equal(testCreateDate('ein Jahr vorher'), getRelativeDate(-1), 'one year ago');

    equal(testCreateDate('vor einer Millisekunde'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    equal(testCreateDate('vor einer Sekunde'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    equal(testCreateDate('vor einer Minute'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    equal(testCreateDate('vor einer Stunde'), getRelativeDate(null, null, null, -1), 'one hour ago');
    equal(testCreateDate('vor einem Tag'), getRelativeDate(null, null, -1), 'one day ago');
    equal(testCreateDate('vor einer Woche'), getRelativeDate(null, null, -7), 'one week ago');
    equal(testCreateDate('vor einem Monat'), getRelativeDate(null, -1), 'one month ago');
    equal(testCreateDate('vor einem Jahr'), getRelativeDate(-1), 'one year ago');


    equal(testCreateDate('in 5 Millisekunden'), getRelativeDate(null, null, null, null, null, null,5), 'five milliseconds from now');
    equal(testCreateDate('in 5 Sekunden'), getRelativeDate(null, null, null, null, null, 5), 'five second from now');
    equal(testCreateDate('in 5 Minuten'), getRelativeDate(null, null, null, null, 5), 'five minute from now');
    equal(testCreateDate('in 5 Stunden'), getRelativeDate(null, null, null, 5), 'five hour from now');
    equal(testCreateDate('in 5 Tagen'), getRelativeDate(null, null, 5), 'five day from now');
    equal(testCreateDate('in 5 Wochen'), getRelativeDate(null, null, 35), 'five weeks from now');
    equal(testCreateDate('in 5 Monaten'), getRelativeDate(null, 5), 'five months from now');
    equal(testCreateDate('in 5 Jahren'), getRelativeDate(5), 'five years from now');


    equal(testCreateDate('vorgestern'), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    equal(testCreateDate('gestern'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    equal(testCreateDate('heute'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    equal(testCreateDate('morgen'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    equal(testCreateDate('übermorgen'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');

    equal(testCreateDate('letzte Woche'), getRelativeDate(null, null, -7), 'Last week');
    equal(testCreateDate('nächste Woche'), getRelativeDate(null, null, 7), 'Next week');

    equal(testCreateDate('letzter Monat'), getRelativeDate(null, -1), 'last month letzter');
    equal(testCreateDate('letzten Monat'), getRelativeDate(null, -1), 'last month letzten');
    equal(testCreateDate('nächster Monat'), getRelativeDate(null, 1), 'Next month nachster');
    equal(testCreateDate('nächsten Monat'), getRelativeDate(null, 1), 'Next month nachsten');

    equal(testCreateDate('letztes Jahr'), getRelativeDate(-1), 'Last year');
    equal(testCreateDate('nächstes Jahr'), getRelativeDate(1), 'Next year');


    equal(testCreateDate('kommenden Montag'), getDateWithWeekdayAndOffset(1, 7), 'kommenden Montag');
    equal(testCreateDate('nächster Montag'), getDateWithWeekdayAndOffset(1, 7), 'next monday');
    equal(testCreateDate('letztes Montag'), getDateWithWeekdayAndOffset(1, -7), 'last monday');

    equal(testCreateDate('letztes Montag 3:45'), run(getDateWithWeekdayAndOffset(1, -7), 'set', [{ hour: 3, minute: 45 }, true]), 'last monday 3:45');

    // no accents
    equal(testCreateDate('ubermorgen'), run(getRelativeDate(null, null, 2), 'reset'), 'no accents | day after tomorrow');
    equal(testCreateDate('naechster Monat'), getRelativeDate(null, 1), 'no accents | Next month nachster');
    equal(testCreateDate('uebermorgen'), run(getRelativeDate(null, null, 2), 'reset'), 'no accents | day after tomorrow');
    equal(testCreateDate('naechster Monat'), getRelativeDate(null, 1), 'no accents | Next month nachster');
    equal(testCreateDate('naechsten Monat'), getRelativeDate(null, 1), 'no accents | Next month nachsten');
    equal(testCreateDate('naechstes Jahr'), getRelativeDate(1), 'no accents | Next year');

    equal(testCreateDate('3:45 15. Mai 2011'), new Date(2011, 4, 15, 3, 45), 'time first format');
    equal(testCreateDate('morgen um 3:30'), run(getRelativeDate(null, null, 1), 'set', [{hours:3,minutes:30}, true]), 'tomorrow at 3:30');

    // Numbers

    equal(testCreateDate('vor null Jahre'),    getRelativeDate(0),   'zero years ago');
    equal(testCreateDate('vor einem Jahr'),    getRelativeDate(-1),  'one year ago');
    equal(testCreateDate('vor zwei Jahren'),   getRelativeDate(-2),  'two years ago');
    equal(testCreateDate('vor drei Jahren'),   getRelativeDate(-3),  'three years ago');
    equal(testCreateDate('vor vier Jahren'),   getRelativeDate(-4),  'four years ago');
    equal(testCreateDate('vor fuenf Jahren'),  getRelativeDate(-5),  'five years ago');
    equal(testCreateDate('vor sechs Jahren'),  getRelativeDate(-6),  'six years ago');
    equal(testCreateDate('vor sieben Jahren'), getRelativeDate(-7),  'seven years ago');
    equal(testCreateDate('vor acht Jahren'),   getRelativeDate(-8),  'eight years ago');
    equal(testCreateDate('vor neun Jahren'),   getRelativeDate(-9),  'nine years ago');
    equal(testCreateDate('vor zehn Jahren'),   getRelativeDate(-10), 'ten years ago');

  });


  method('format', function() {

    test(then, '5. Januar 2010 15:52', 'default format');

    assertFormatShortcut(then, 'short', '05.01.2010');
    assertFormatShortcut(then, 'medium', '5. Januar 2010');
    assertFormatShortcut(then, 'long', '5. Januar 2010 15:52');
    assertFormatShortcut(then, 'full', 'Dienstag, 5. Januar 2010 15:52');
    test(then, ['{time}'], '15:52', 'preferred time');
    test(then, ['{stamp}'], 'Di 5 Jan 2010 15:52', 'preferred stamp');
    test(then, ['%c'], 'Di 5 Jan 2010 15:52', '%c stamp');

    test(then, ['%A'], 'Dienstag', 'full weekday');

    test(new Date('January 3, 2010'), ['{w}'], '53', 'locale week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{ww}'], '53', 'locale week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{wo}'], '53rd', 'locale week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{w}'], '1', 'locale week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{ww}'], '01', 'locale week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{wo}'], '1st', 'locale week number ordinal | Jan 4 2010');

    test(new Date(2015, 10, 8),  ['{Dow}'], 'So', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], 'Mo', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], 'Di', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], 'Mi', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], 'Do', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], 'Fr', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], 'Sa', 'Sat');
    test(new Date(2015, 0, 1),  ['{Mon}'], 'Jan', 'Jan');
    test(new Date(2015, 1, 1),  ['{Mon}'], 'Feb', 'Feb');
    test(new Date(2015, 2, 1),  ['{Mon}'], 'März', 'Mar');
    test(new Date(2015, 3, 1),  ['{Mon}'], 'Apr', 'Apr');
    test(new Date(2015, 4, 1),  ['{Mon}'], 'Mai', 'May');
    test(new Date(2015, 5, 1),  ['{Mon}'], 'Juni', 'Jun');
    test(new Date(2015, 6, 1),  ['{Mon}'], 'Juli', 'Jul');
    test(new Date(2015, 7, 1),  ['{Mon}'], 'Aug', 'Aug');
    test(new Date(2015, 8, 1),  ['{Mon}'], 'Sept', 'Sep');
    test(new Date(2015, 9, 1),  ['{Mon}'], 'Okt', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], 'Nov', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], 'Dez', 'Dec');

    // Issue #489
    equal(run(then, 'format', ['{dow}']), 'di', 'dow token should be 2 characters');
    equal(run(then, 'format', ['{Dow}']), 'Di', 'Dow token should be 2 characters');
    equal(run(then, 'format', ['%a']), 'Di', 'strftime token should be 2 characters');

  });


  method('relative', function() {
    assertRelative('1 second ago', 'vor 1 Sekunde');
    assertRelative('1 minute ago', 'vor 1 Minute');
    assertRelative('1 hour ago',   'vor 1 Stunde');
    assertRelative('1 day ago',    'vor 1 Tag');
    assertRelative('1 week ago',   'vor 1 Woche');
    assertRelative('1 month ago',  'vor 1 Monat');
    assertRelative('1 year ago',   'vor 1 Jahr');

    assertRelative('5 seconds ago', 'vor 5 Sekunden');
    assertRelative('5 minutes ago', 'vor 5 Minuten');
    assertRelative('5 hours ago',   'vor 5 Stunden');
    assertRelative('5 days ago',    'vor 5 Tagen');
    assertRelative('5 weeks ago',   'vor 1 Monat');
    assertRelative('5 months ago',  'vor 5 Monaten');
    assertRelative('5 years ago',   'vor 5 Jahren');

    assertRelative('1 second from now', 'in 1 Sekunde');
    assertRelative('1 minute from now', 'in 1 Minute');
    assertRelative('1 hour from now',   'in 1 Stunde');
    assertRelative('1 day from now',    'in 1 Tag');
    assertRelative('1 week from now',   'in 1 Woche');
    assertRelative('1 year from now',   'in 1 Jahr');

    assertRelative('5 second from now', 'in 5 Sekunden');
    assertRelative('5 minutes from now','in 5 Minuten');
    assertRelative('5 hour from now',   'in 5 Stunden');
    assertRelative('5 day from now',    'in 5 Tagen');
    assertRelative('5 week from now',   'in 1 Monat');
    assertRelative('5 year from now',   'in 5 Jahren');
  });

  method('beginning/end', function() {
    equal(dateRun(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(dateRun(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | German', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['de'], '5 Stunden', 'simple duration');
  });

});

