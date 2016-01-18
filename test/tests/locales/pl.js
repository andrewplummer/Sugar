namespace('Dates Polish', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('pl');
  });

  method('create', function() {

    // TODO: Write these and uncommment!

    //equal(testCreateDate(''), new Date(2011, 4, 15), 'basic Polish date');
    //equal(testCreateDate(''), new Date(2012, 0, 5), '2012-01-05');
    //equal(testCreateDate(''), new Date(2012, 0, 5), '2012-01-05 (na)');
    //equal(testCreateDate(''), new Date(2011, 4), 'year and month');
    //equal(testCreateDate(''), new Date(now.getFullYear(), 4, 15), 'month and date');
    //equal(testCreateDate(''), new Date(2011, 0), 'year');

    //equal(testCreateDate(''), new Date(2012, 0, 5,  3, 45), '2012-01-05 3.45');
    //equal(testCreateDate(''), new Date(2012, 0, 5,  3, 45), '2012-01-05 3.45 (na)');
    //equal(testCreateDate(''), new Date(2012, 0, 5,  3, 45, 19), '2012-01-05 3.45.19');

    //equal(testCreateDate(''), new Date(2012, 0, 5, 15, 45), '2012-01-05 3:45pm');
    //equal(testCreateDate(''), new Date(2012, 0, 5, 15, 45), '2012-01-05 3:45pm (na)');

    //equal(testCreateDate(''), new Date(2012, 0, 5, 15, 45), 'also accepts "kello"');

    //equal(testCreateDate(''), new Date(now.getFullYear(),  0), 'January');
    //equal(testCreateDate(''), new Date(now.getFullYear(),  1), 'February');
    //equal(testCreateDate(''), new Date(now.getFullYear(),  2), 'March');
    //equal(testCreateDate(''), new Date(now.getFullYear(),  3), 'April');
    //equal(testCreateDate(''), new Date(now.getFullYear(),  4), 'May');
    //equal(testCreateDate(''), new Date(now.getFullYear(),  5), 'June');
    //equal(testCreateDate(''), new Date(now.getFullYear(),  6), 'July');
    //equal(testCreateDate(''), new Date(now.getFullYear(),  7), 'August');
    //equal(testCreateDate(''), new Date(now.getFullYear(),  8), 'September');
    //equal(testCreateDate(''), new Date(now.getFullYear(),  9), 'October');
    //equal(testCreateDate(''), new Date(now.getFullYear(), 10), 'November');
    //equal(testCreateDate(''), new Date(now.getFullYear(), 11), 'December');

    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(0), 'Sunday');
    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(1), 'Monday');
    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(2), 'Tuesday');
    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(3), 'Wednesday');
    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(4), 'Thursday');
    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(5), 'Friday');
    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(6), 'Saturday');

    //equal(testCreateDate(''), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    //equal(testCreateDate(''), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    //equal(testCreateDate(''), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    //equal(testCreateDate(''), getRelativeDate(null, null, null, -1), 'one hour ago');
    //equal(testCreateDate(''), getRelativeDate(null, null, -1), 'one day ago');
    //equal(testCreateDate(''), getRelativeDate(null, null, -7), 'one week ago');
    //equal(testCreateDate(''), getRelativeDate(null, -1), 'one month ago');
    //equal(testCreateDate(''), getRelativeDate(-1), 'one year ago');
    //equal(testCreateDate(''), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    //equal(testCreateDate(''), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    //equal(testCreateDate(''), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    //equal(testCreateDate(''), getRelativeDate(null, null, null, -1), 'one hour ago');
    //equal(testCreateDate(''), getRelativeDate(null, null, -1), 'one day ago');
    //equal(testCreateDate(''), getRelativeDate(null, null, -7), 'one week ago');
    //equal(testCreateDate(''), getRelativeDate(null, -1), 'one month ago');
    //equal(testCreateDate(''), getRelativeDate(-1), 'one year ago');

    //equal(testCreateDate(''), getRelativeDate(null, null, null, null, null, null,5), 'five milliseconds from now');
    //equal(testCreateDate(''), getRelativeDate(null, null, null, null, null, 5), 'five second from now');
    //equal(testCreateDate(''), getRelativeDate(null, null, null, null, 5), 'five minute from now');
    //equal(testCreateDate(''), getRelativeDate(null, null, null, 5), 'five hour from now');
    //equal(testCreateDate(''), getRelativeDate(null, null, 5), 'five day from now');
    //equal(testCreateDate(''), getRelativeDate(null, null, 35), 'five weeks from now');
    //equal(testCreateDate(''), getRelativeDate(null, 5), 'five months from now');
    //equal(testCreateDate(''), getRelativeDate(5), 'five years from now');

    //equal(testCreateDate(''), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    //equal(testCreateDate(''), getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    //equal(testCreateDate(''), getRelativeDate(null, null,  0), 'reset'), 'today');
    //equal(testCreateDate(''), run(getRelativeDate(null, null,  1), 'reset'), 'tomorrow');
    //equal(testCreateDate(''), run(getRelativeDate(null, null,  2), 'reset'), 'day after tomorrow');

    //equal(testCreateDate(''), getRelativeDate(null, null, -7), 'Last week');
    //equal(testCreateDate(''), getRelativeDate(null, null,  7), 'Next week');

    //equal(testCreateDate(''), getRelativeDate(null, -1), 'last month (viime)');
    //equal(testCreateDate(''), getRelativeDate(null, -1), 'last month (edellinen)');
    //equal(testCreateDate(''), getRelativeDate(null,  1), 'Next month (seuraava)');
    //equal(testCreateDate(''), getRelativeDate(null,  1), 'Next month (ensi)');

    //equal(testCreateDate(''), getRelativeDate(-1), 'Last year');
    //equal(testCreateDate(''), getRelativeDate(1),  'Next year');

    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(1, 7), 'next monday');
    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(1, -7), 'last monday');

    //equal(testCreateDate(''), run(getDateWithWeekdayAndOffset(1, -7), 'set', [{ hour: 3, minute: 45 }, true]), 'last monday 3:45');
    //equal(testCreateDate(''), run(getDateWithWeekdayAndOffset(1, -7), 'set', [{ hour: 3, minute: 45 }, true]), 'last monday 3:45 (na)');
    //equal(testCreateDate(''), run(getRelativeDate(null, null, 1), 'set', [{hours:3,minutes:30}, true]), 'tomorrow at 3:30');


    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(0, -7), 'last sunday');
    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(1, -7), 'last monday');
    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(2, -7), 'last tuesday');
    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(3, -7), 'last wednesday');
    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(4, -7), 'last thursday');
    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(5, -7), 'last friday');
    //equal(testCreateDate(''), getDateWithWeekdayAndOffset(6, -7), 'last saturday');


    // Numbers

    equal(testCreateDate('zero lat temu'),      getRelativeDate(0),   'zero years ago');
    equal(testCreateDate('jeden rok temu'),     getRelativeDate(-1),  'one year ago');
    equal(testCreateDate('dwa lata temu'),      getRelativeDate(-2),  'two years ago');
    equal(testCreateDate('trzy lata temu'),     getRelativeDate(-3),  'three years ago');
    equal(testCreateDate('cztery lata temu'),   getRelativeDate(-4),  'four years ago');
    equal(testCreateDate('pięć lata temu'),     getRelativeDate(-5),  'five years ago');
    equal(testCreateDate('sześć lata temu'),    getRelativeDate(-6),  'six years ago');
    equal(testCreateDate('siedem lata temu'),   getRelativeDate(-7),  'seven years ago');
    equal(testCreateDate('osiem lata temu'),    getRelativeDate(-8),  'eight years ago');
    equal(testCreateDate('dziewięć lata temu'), getRelativeDate(-9),  'nine years ago');
    equal(testCreateDate('dziesięć lata temu'), getRelativeDate(-10), 'ten years ago');

  });

  method('format', function() {

    test(then, '5 stycznia 2010 15:52', 'default format');

    assertFormatShortcut(then, 'short', '05.01.2010');
    assertFormatShortcut(then, 'medium', '5 stycznia 2010');
    assertFormatShortcut(then, 'long', '5 stycznia 2010 15:52');
    assertFormatShortcut(then, 'full', 'wtorek, 5 stycznia 2010 15:52');
    test(then, ['{time}'], '15:52', 'preferred time');
    test(then, ['{stamp}'], 'wt 5 sty 2010 15:52', 'preferred stamp');
    test(then, ['%c'], 'wt 5 sty 2010 15:52', '%c stamp');

    test(new Date(2011,  0, 25), ['{d} {month} {yyyy}'], '25 stycznia 2011',     'January');
    test(new Date(2011,  1, 25), ['{d} {month} {yyyy}'], '25 lutego 2011',       'February');
    test(new Date(2011,  2, 25), ['{d} {month} {yyyy}'], '25 marca 2011',        'March');
    test(new Date(2011,  3, 25), ['{d} {month} {yyyy}'], '25 kwietnia 2011',     'April');
    test(new Date(2011,  4, 25), ['{d} {month} {yyyy}'], '25 maja 2011',         'May');
    test(new Date(2011,  5, 25), ['{d} {month} {yyyy}'], '25 czerwca 2011',      'June');
    test(new Date(2011,  6, 25), ['{d} {month} {yyyy}'], '25 lipca 2011',        'July');
    test(new Date(2011,  7, 25), ['{d} {month} {yyyy}'], '25 sierpnia 2011',     'August');
    test(new Date(2011,  8, 25), ['{d} {month} {yyyy}'], '25 września 2011',     'September');
    test(new Date(2011,  9, 25), ['{d} {month} {yyyy}'], '25 października 2011', 'October');
    test(new Date(2011, 10, 25), ['{d} {month} {yyyy}'], '25 listopada 2011',    'November');
    test(new Date(2011, 11, 25), ['{d} {month} {yyyy}'], '25 grudnia 2011',      'December');

    test(new Date('January 3, 2010'), ['{w}'], '53', 'locale week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{ww}'], '53', 'locale week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{wo}'], '53rd', 'locale week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{w}'], '1', 'locale week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{ww}'], '01', 'locale week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{wo}'], '1st', 'locale week number ordinal | Jan 4 2010');

    test(new Date(2015, 10, 8),  ['{Dow}'], 'nie', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], 'pon', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], 'wt', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], 'śr', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], 'czw', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], 'pt', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], 'sb', 'Sat');

    test(new Date(2015, 0, 1),  ['{Mon}'], 'sty', 'Jan');
    test(new Date(2015, 1, 1),  ['{Mon}'], 'lut', 'Feb');
    test(new Date(2015, 2, 1),  ['{Mon}'], 'mar', 'Mar');
    test(new Date(2015, 3, 1),  ['{Mon}'], 'kwi', 'Apr');
    test(new Date(2015, 4, 1),  ['{Mon}'], 'maj', 'May');
    test(new Date(2015, 5, 1),  ['{Mon}'], 'cze', 'Jun');
    test(new Date(2015, 6, 1),  ['{Mon}'], 'lip', 'Jul');
    test(new Date(2015, 7, 1),  ['{Mon}'], 'sie', 'Aug');
    test(new Date(2015, 8, 1),  ['{Mon}'], 'wrz', 'Sep');
    test(new Date(2015, 9, 1),  ['{Mon}'], 'paź', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], 'lis', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], 'gru', 'Dec');

  });

  method('relative', function() {

    assertRelative('1 second ago', '1 sekundę temu');
    assertRelative('1 minute ago', '1 minutę temu');
    assertRelative('1 hour ago', '1 godzinę temu');
    //assertRelative('1 day ago', '1 dzień temu');
    assertRelative('1 week ago', '1 tydzień temu');
    assertRelative('1 month ago', '1 miesiąc temu');
    assertRelative('1 year ago', '1 rok temu');

    //assertRelative('3 seconds ago', '3 minuty temu');
    assertRelative('3 minutes ago', '3 minuty temu');
    assertRelative('3 hours ago', '3 godziny temu');
    assertRelative('3 days ago', '3 dni temu');
    //assertRelative('3 weeks ago', '3 godziny temu');
    assertRelative('3 months ago', '3 miesiące temu');
    assertRelative('3 years ago', '3 lata temu');

    assertRelative('5 seconds ago', '5 sekund temu');
    assertRelative('5 minutes ago', '5 minut temu');
    assertRelative('5 hours ago', '5 godzin temu');
    assertRelative('5 days ago', '5 dni temu');
    assertRelative('5 months ago', '5 miesięcy temu');
    assertRelative('5 years ago', '5 lat temu');

    assertRelative('1 second from now', 'za 1 sekundę');
    assertRelative('1 minute from now', 'za 1 minutę');
    assertRelative('1 hour from now', 'za 1 godzinę');
    //assertRelative('1 day from now', 'za 1 dzień');
    assertRelative('1 week from now', 'za 1 tydzień');
    assertRelative('1 month from now', 'za 1 miesiąc');
    assertRelative('1 year from now', 'za 1 rok');

    assertRelative('3 seconds from now', 'za 3 sekundy');
    assertRelative('3 minutes from now', 'za 3 minuty');
    assertRelative('3 hours from now', 'za 3 godziny');
    assertRelative('3 days from now', 'za 3 dni');
    assertRelative('3 weeks from now', 'za 3 tygodnie');
    assertRelative('3 months from now', 'za 3 miesiące');
    assertRelative('3 years from now', 'za 3 lata');

    assertRelative('5 seconds from now', 'za 5 sekund');
    assertRelative('5 minutes from now', 'za 5 minut');
    assertRelative('5 hours from now', 'za 5 godzin');
    assertRelative('5 days from now', 'za 5 dni');
    assertRelative('5 months from now', 'za 5 miesięcy');
    assertRelative('5 years from now', 'za 5 lat');

  });

  method('beginning/end', function() {
    equal(dateRun(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(dateRun(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });


});

namespace('Number | Polish Dates', function () {

  method('duration', function() {
    testSetLocale('pl');

    test(run(0, 'milliseconds'), '0 milisekund',  '0 milliseconds');

    test(run(1, 'second'), '1 sekunda',  '1 second');
    test(run(1, 'minute'), '1 minuta',   '1 minute');
    // test(run(1, 'hour'),   '1 godziny',  '1 hour');
    test(run(1, 'day'),    '1 dzień',    '1 day');
    test(run(1, 'week'),   '1 tydzień',  '1 week');
    //test(run(1, 'month'),  '1 miesięcy', '1 month');
    //test(run(1, 'year'),   '1 roku',     '1 year');

    test(run(3, 'seconds'), '3 sekundy',  '3 seconds');
    test(run(3, 'minutes'), '3 minuty',   '3 minutes');
    test(run(3, 'hours'),   '3 godziny',  '3 hours');
    test(run(3, 'days'),    '3 dni',      '3 days');
    test(run(3, 'weeks'),   '3 tygodnie', '3 weeks');
    test(run(3, 'months'),  '3 miesiące', '3 months');
    test(run(3, 'years'),   '3 lata',     '3 years');

    test(run(5, 'seconds'), '5 sekund',   '5 seconds');
    test(run(5, 'minutes'), '5 minut',    '5 minutes');
    //test(run(5, 'hours'),   '5 godziny',  '5 hours');
    test(run(5, 'days'),    '5 dni',      '5 days');
    test(run(5, 'months'),  '5 miesięcy', '5 weeks');
    test(run(5, 'years'),   '5 lat',      '5 months');

    test(run(10, 'seconds'), '10 sekund',   '10 seconds');
    test(run(10, 'minutes'), '10 minut',    '10 minutes');
    test(run(10, 'hours'),   '10 godzin',   '10 hours');
    //test(run(10, 'days'),    '10 dni',      '10 days');
    test(run(10, 'months'),  '10 miesięcy', '10 months');
    test(run(10, 'years'),   '10 lat',      '10 years');

  });

});

