package('Date', function () {
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

    dateEqual(testCreateDate('tiistai 5. tammikuuta 2012 klo 3.45'),    new Date(2012, 0, 5,  3, 45), '2012-01-05 3:45');
    dateEqual(testCreateDate('tiistaina 5. tammikuuta 2012 klo 3.45'),  new Date(2012, 0, 5,  3, 45), '2012-01-05 3:45 (na)');
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
    test(testCreateDate('a second ago',  'en'), 'sekunti sitten');
    test(testCreateDate('1 second ago',  'en'), '1 sekunti sitten');
    test(testCreateDate('a minute ago',  'en'), 'minuutti sitten');
    test(testCreateDate('1 minute ago',  'en'), '1 minuutti sitten');
    test(testCreateDate('an hour ago',   'en'), 'tunti sitten');
    test(testCreateDate('1 hour ago',    'en'), '1 tunti sitten');
    test(testCreateDate('a day ago',     'en'), 'päivä sitten');
    test(testCreateDate('1 day ago',     'en'), '1 päivä sitten');
    test(testCreateDate('a week ago',    'en'), 'viikko sitten');
    test(testCreateDate('1 week ago',    'en'), '1 viikko sitten');
    test(testCreateDate('a month ago',   'en'), 'kuukausi sitten');
    test(testCreateDate('1 month ago',   'en'), '1 kuukausi sitten');
    test(testCreateDate('a year ago',    'en'), 'vuosi sitten');
    test(testCreateDate('1 year ago',    'en'), '1 vuosi sitten');
    test(testCreateDate('5 seconds ago', 'en'), '5 sekuntia sitten');
    test(testCreateDate('5 minutes ago', 'en'), '5 minuuttia sitten');
    test(testCreateDate('5 hours ago',   'en'), '5 tuntia sitten');
    test(testCreateDate('5 days ago',    'en'), '5 päivää sitten');
    test(testCreateDate('5 weeks ago',   'en'), '5 viikkoa sitten');
    test(testCreateDate('5 months ago',  'en'), '5 kuukautta sitten');
    test(testCreateDate('5 years ago',   'en'), '5 vuotta sitten');

    test(testCreateDate('a second from now',  'en'), 'sekunnin päästä');
    test(testCreateDate('1 second from now',  'en'), '1 sekunnin päästä');
    test(testCreateDate('a minute from now',  'en'), 'minuutin päästä');
    test(testCreateDate('1 minute from now',  'en'), '1 minuutin päästä');
    test(testCreateDate('an hour from now',   'en'), 'tunnin päästä');
    test(testCreateDate('1 hour from now',    'en'), '1 tunnin päästä');
    test(testCreateDate('a day from now',     'en'), 'päivän päästä');
    test(testCreateDate('1 day from now',     'en'), '1 päivän päästä');
    test(testCreateDate('a week from now',    'en'), 'viikon päästä');
    test(testCreateDate('1 week from now',    'en'), '1 viikon päästä');
    test(testCreateDate('a month from now',   'en'), 'kuukauden päästä');
    test(testCreateDate('1 month from now',   'en'), '1 kuukauden päästä');
    test(testCreateDate('a year from now',    'en'), 'vuoden päästä');
    test(testCreateDate('1 year from now',    'en'), '1 vuoden päästä');
    test(testCreateDate('5 seconds from now', 'en'), '5 sekunnin päästä');
    test(testCreateDate('5 minutes from now', 'en'), '5 minuutin päästä');
    test(testCreateDate('5 hours from now',   'en'), '5 tunnin päästä');
    test(testCreateDate('5 days from now',    'en'), '5 päivän päästä');
    test(testCreateDate('5 weeks from now',   'en'), '5 viikon päästä');
    test(testCreateDate('5 years from now',   'en'), '5 vuoden päästä');
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
