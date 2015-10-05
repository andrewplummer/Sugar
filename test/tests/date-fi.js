package('Dates Finnish', function () {
  "use strict";

  var now;

  setup(function() {
    now = new Date();
    testSetLocale('fi');
  });

  method('create', function() {
    dateEqual(testCreateDate('15. toukokuuta 2011'),          new Date(2011, 4, 15),              'Date#create | basic Finnish date');
    dateEqual(testCreateDate('tiistai 5. tammikuuta 2012'),   new Date(2012, 0, 5),               '2012-01-05');
    dateEqual(testCreateDate('tiistaina 5. tammikuuta 2012'), new Date(2012, 0, 5),               '2012-01-05 (na)');
    dateEqual(testCreateDate('toukokuu 2011'),                new Date(2011, 4),                  'year and month');
    dateEqual(testCreateDate('15. toukokuuta'),               new Date(now.getFullYear(), 4, 15), 'month and date');
    dateEqual(testCreateDate('2011'),                         new Date(2011, 0),                  'year');

    dateEqual(testCreateDate('tiistai 5. tammikuuta 2012 klo 3.45'),    new Date(2012, 0, 5,  3, 45), '2012-01-05 3.45');
    dateEqual(testCreateDate('tiistaina 5. tammikuuta 2012 klo 3.45'),  new Date(2012, 0, 5,  3, 45), '2012-01-05 3.45 (na)');
    dateEqual(testCreateDate('tiistai 5. tammikuuta 2012 klo 15:45'),   new Date(2012, 0, 5, 15, 45), '2012-01-05 3:45pm');
    dateEqual(testCreateDate('tiistaina 5. tammikuuta 2012 klo 15:45'), new Date(2012, 0, 5, 15, 45), '2012-01-05 3:45pm (na)');

    dateEqual(testCreateDate('tammikuu'),  new Date(now.getFullYear(),  0), 'January');
    dateEqual(testCreateDate('helmikuu'),  new Date(now.getFullYear(),  1), 'February');
    dateEqual(testCreateDate('maaliskuu'), new Date(now.getFullYear(),  2), 'March');
    dateEqual(testCreateDate('huhtikuu'),  new Date(now.getFullYear(),  3), 'April');
    dateEqual(testCreateDate('toukokuu'),  new Date(now.getFullYear(),  4), 'May');
    dateEqual(testCreateDate('kesäkuu'),   new Date(now.getFullYear(),  5), 'June');
    dateEqual(testCreateDate('heinäkuu'),  new Date(now.getFullYear(),  6), 'July');
    dateEqual(testCreateDate('elokuu'),    new Date(now.getFullYear(),  7), 'August');
    dateEqual(testCreateDate('syyskuu'),   new Date(now.getFullYear(),  8), 'September');
    dateEqual(testCreateDate('lokakuu'),   new Date(now.getFullYear(),  9), 'October');
    dateEqual(testCreateDate('marraskuu'), new Date(now.getFullYear(), 10), 'November');
    dateEqual(testCreateDate('joulukuu'),  new Date(now.getFullYear(), 11), 'December');

    dateEqual(testCreateDate('sunnuntai'),   getDateWithWeekdayAndOffset(0), 'Sunday');    // su
    dateEqual(testCreateDate('maanantai'),   getDateWithWeekdayAndOffset(1), 'Monday');    // ma
    dateEqual(testCreateDate('tiistai'),     getDateWithWeekdayAndOffset(2), 'Tuesday');   // ti
    dateEqual(testCreateDate('keskiviikko'), getDateWithWeekdayAndOffset(3), 'Wednesday'); // ke
    dateEqual(testCreateDate('torstai'),     getDateWithWeekdayAndOffset(4), 'Thursday');  // to
    dateEqual(testCreateDate('perjantai'),   getDateWithWeekdayAndOffset(5), 'Friday');    // pe
    dateEqual(testCreateDate('lauantai'),    getDateWithWeekdayAndOffset(6), 'Saturday');  // la

    dateEqual(testCreateDate('yksi millisekunti sitten'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('yksi sekunti sitten'),      getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('yksi minuutti sitten'),     getRelativeDate(null, null, null, null, -1), 'one minute ago');
    dateEqual(testCreateDate('yksi tunti sitten'),        getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('yksi päivä sitten'),        getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('yksi viikko sitten'),       getRelativeDate(null, null, -7), 'one week ago');
    dateEqual(testCreateDate('yksi kuukausi sitten'),     getRelativeDate(null, -1), 'one month ago');
    dateEqual(testCreateDate('yksi vuosi sitten'),        getRelativeDate(-1), 'one year ago');
    dateEqual(testCreateDate('millisekunti sitten'),      getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('sekunti sitten'),           getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('minuutti sitten'),          getRelativeDate(null, null, null, null, -1), 'one minute ago');
    dateEqual(testCreateDate('tunti sitten'),             getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('päivä sitten'),             getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('viikko sitten'),            getRelativeDate(null, null, -7), 'one week ago');
    dateEqual(testCreateDate('kuukausi sitten'),          getRelativeDate(null, -1), 'one month ago');
    dateEqual(testCreateDate('vuosi sitten'),             getRelativeDate(-1), 'one year ago');

    dateEqual(testCreateDate('5 millisekunnin päästä'),   getRelativeDate(null, null, null, null, null, null,5), 'five milliseconds from now');
    dateEqual(testCreateDate('5 sekunnin päästä'),        getRelativeDate(null, null, null, null, null, 5), 'five second from now');
    dateEqual(testCreateDate('5 minuutin päästä'),        getRelativeDate(null, null, null, null, 5), 'five minute from now');
    dateEqual(testCreateDate('5 tunnin päästä'),          getRelativeDate(null, null, null, 5), 'five hour from now');
    dateEqual(testCreateDate('5 päivän päästä'),          getRelativeDate(null, null, 5), 'five day from now');
    dateEqual(testCreateDate('5 viikon päästä'),          getRelativeDate(null, null, 35), 'five weeks from now');
    dateEqual(testCreateDate('5 kuukauden päästä'),       getRelativeDate(null, 5), 'five months from now');
    dateEqual(testCreateDate('5 vuoden päästä'),          getRelativeDate(5), 'five years from now');

    dateEqual(testCreateDate('toissapäivänä'), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    dateEqual(testCreateDate('eilen'),         run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('tänään'),        run(getRelativeDate(null, null,  0), 'reset'), 'today');
    dateEqual(testCreateDate('huomenna'),      run(getRelativeDate(null, null,  1), 'reset'), 'tomorrow');
    dateEqual(testCreateDate('ylihuomenna'),   run(getRelativeDate(null, null,  2), 'reset'), 'day after tomorrow');

    dateEqual(testCreateDate('viime viikko'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('ensi viikko'),  getRelativeDate(null, null,  7), 'Next week');

    dateEqual(testCreateDate('viime kuussa'),       getRelativeDate(null, -1), 'last month (viime)');
    dateEqual(testCreateDate('edellinen kuukausi'), getRelativeDate(null, -1), 'last month (edellinen)');
    dateEqual(testCreateDate('seuraava kuukausi'),  getRelativeDate(null,  1), 'Next month (seuraava)');
    dateEqual(testCreateDate('ensi kuussa'),        getRelativeDate(null,  1), 'Next month (ensi)');

    dateEqual(testCreateDate('viime vuosi'), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate('ensi vuosi'),  getRelativeDate(1),  'Next year');

    dateEqual(testCreateDate('ensi maanantai'), getDateWithWeekdayAndOffset(1, 7), 'next monday');
    dateEqual(testCreateDate('viime maanantai'), getDateWithWeekdayAndOffset(1, -7), 'last monday');

    dateEqual(testCreateDate('viime maanantaina klo 3.45'), run(getDateWithWeekdayAndOffset(1, -7), 'set', [{ hour: 3, minute: 45 }, true]), 'last monday 3:45');
    dateEqual(testCreateDate('viime maanantai klo 3.45'),   run(getDateWithWeekdayAndOffset(1, -7), 'set', [{ hour: 3, minute: 45 }, true]), 'last monday 3:45 (na)');
    dateEqual(testCreateDate('huomenna klo 3.30'), run(getRelativeDate(null, null, 1), 'set', [{hours:3,minutes:30}, true]), 'tomorrow at 3:30');
  });

  method('format', function() {
    var then = new Date(2011, 7, 25, 15, 45, 50);

    equal(run(then, 'format'),                          '25. elokuuta 2011 klo 15.45', 'format');
    equal(run(then, 'format', ['{dd} {Month} {yyyy}']), '25. elokuuta 2011',           'format');

    // Format shortcuts
    equal(run(then, 'format', ['long']),  '25. elokuuta 2011 klo 15.45',            'long format');
    equal(run(then, 'long'),              '25. elokuuta 2011 klo 15.45',            'long shortcut');
    equal(run(then, 'format', ['full']),  'torstai 25. elokuuta 2011 klo 15.45.50', 'full format');
    equal(run(then, 'full'),              'torstai 25. elokuuta 2011 klo 15.45.50', 'full shortcut');
    equal(run(then, 'format', ['short']), '25. elokuuta 2011',                      'short format');
    equal(run(then, 'short'),             '25. elokuuta 2011',                      'short shortcut');
  });

  method('relative', function() {
    assertRelative('1 second ago', '1 sekunti sitten');
    assertRelative('1 minute ago', '1 minuutti sitten');
    assertRelative('1 hour ago', '1 tunti sitten');
    assertRelative('1 day ago', '1 päivä sitten');
    assertRelative('1 week ago', '1 viikko sitten');
    assertRelative('1 month ago', '1 kuukausi sitten');
    assertRelative('1 year ago', '1 vuosi sitten');
    assertRelative('5 seconds ago', '5 sekuntia sitten');
    assertRelative('5 minutes ago', '5 minuuttia sitten');
    assertRelative('5 hours ago', '5 tuntia sitten');
    assertRelative('5 days ago', '5 päivää sitten');
    assertRelative('5 weeks ago', '5 viikkoa sitten');
    assertRelative('5 months ago', '5 kuukautta sitten');
    assertRelative('5 years ago', '5 vuotta sitten');

    assertRelative('1 second from now', '1 sekunnin päästä');
    assertRelative('1 minute from now', '1 minuutin päästä');
    assertRelative('1 hour from now', '1 tunnin päästä');
    assertRelative('1 day from now', '1 päivän päästä');
    assertRelative('1 week from now', '1 viikon päästä');
    assertRelative('1 month from now', '1 kuukauden päästä');
    assertRelative('1 year from now', '1 vuoden päästä');
    assertRelative('5 seconds from now', '5 sekunnin päästä');
    assertRelative('5 minutes from now', '5 minuutin päästä');
    assertRelative('5 hours from now', '5 tunnin päästä');
    assertRelative('5 days from now', '5 päivän päästä');
    assertRelative('5 weeks from now', '5 viikon päästä');
    assertRelative('5 years from now', '5 vuoden päästä');
  });
});

package('Number | Finnish Dates', function () {
  method('duration', function() {
    test(run(1,     'year'), ['fi'], 'vuoden',           'a year');
    test(run(1,     'year'), ['fi'], '1 vuoden',         '1 year');
    test(run(10,   'years'), ['fi'], '10 vuotta',      '10 years');
    test(run(1,    'month'), ['fi'], 'kuukauden',       'a month');
    test(run(1,    'month'), ['fi'], '1 kuukauden',     '1 month');
    test(run(10,  'months'), ['fi'], '10 kuukautta',  '10 months');
    test(run(1,     'week'), ['fi'], 'viikon',           'a week');
    test(run(1,     'week'), ['fi'], '1 viikon',         '1 week');
    test(run(3,    'weeks'), ['fi'], '3 viikkoa',       '3 weeks');
    test(run(1,      'day'), ['fi'], 'päivän',            'a day');
    test(run(1,      'day'), ['fi'], '1 päivän',          '1 day');
    test(run(3,     'days'), ['fi'], '3 päivää',         '3 days');
    test(run(1,     'hour'), ['fi'], 'tunnin',          'an hour');
    test(run(1,     'hour'), ['fi'], '1 tunnin',         '1 hour');
    test(run(10,   'hours'), ['fi'], '10 tuntia',      '10 hours');
    test(run(1,   'minute'), ['fi'], 'minuutin',       'a minute');
    test(run(1,   'minute'), ['fi'], '1 minuutin',     '1 minute');
    test(run(10, 'minutes'), ['fi'], '10 minuuttia', '10 minutes');
    test(run(1,   'second'), ['fi'], 'sekunnin',       'a second');
    test(run(1,   'second'), ['fi'], '1 sekunnin',     '1 second');
    test(run(10, 'seconds'), ['fi'], '10 sekuntia',  '10 seconds');
  });
});
