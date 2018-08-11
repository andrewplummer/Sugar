namespace('Date | Finnish', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('fi');
  });

  method('create', function() {

    assertDateParsed('15. toukokuuta 2011', new Date(2011, 4, 15));
    assertDateParsed('torstai 5. tammikuuta 2012', new Date(2012, 0, 5));
    assertDateParsed('torstaina 5. tammikuuta 2012', new Date(2012, 0, 5));
    assertDateParsed('toukokuu 2011', new Date(2011, 4));
    assertDateParsed('15. toukokuuta', new Date(now.getFullYear(), 4, 15));
    assertDateParsed('2011', new Date(2011, 0));
    assertDateParsed('02. helmikuuta 2016', new Date(2016, 1, 2));

    assertDateParsed('torstai 5. tammikuuta 2012 klo 3.45', new Date(2012, 0, 5,  3, 45));
    assertDateParsed('torstaina 5. tammikuuta 2012 klo 3.45', new Date(2012, 0, 5,  3, 45));
    assertDateParsed('torstaina 5. tammikuuta 2012 klo 3.45.19', new Date(2012, 0, 5,  3, 45, 19));
    assertDateParsed('torstaina 5. tammikuuta 2012 klo 3.45.19,30', new Date(2012, 0, 5,  3, 45, 19, 300));

    assertDateParsed('torstai 5. tammikuuta 2012 klo 15:45', new Date(2012, 0, 5, 15, 45));
    assertDateParsed('torstaina 5. tammikuuta 2012 klo 15:45', new Date(2012, 0, 5, 15, 45));

    assertDateParsed('torstaina 5. tammikuuta 2012 kello 15:45', new Date(2012, 0, 5, 15, 45));

    // Standalone time format.
    assertDateParsed('3.45', new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 45));


    assertDateParsed('tammikuu',  new Date(now.getFullYear(),  0));
    assertDateParsed('helmikuu',  new Date(now.getFullYear(),  1));
    assertDateParsed('maaliskuu', new Date(now.getFullYear(),  2));
    assertDateParsed('huhtikuu',  new Date(now.getFullYear(),  3));
    assertDateParsed('toukokuu',  new Date(now.getFullYear(),  4));
    assertDateParsed('kesäkuu',   new Date(now.getFullYear(),  5));
    assertDateParsed('heinäkuu',  new Date(now.getFullYear(),  6));
    assertDateParsed('elokuu',    new Date(now.getFullYear(),  7));
    assertDateParsed('syyskuu',   new Date(now.getFullYear(),  8));
    assertDateParsed('lokakuu',   new Date(now.getFullYear(),  9));
    assertDateParsed('marraskuu', new Date(now.getFullYear(), 10));
    assertDateParsed('joulukuu',  new Date(now.getFullYear(), 11));

    assertDateParsed('sunnuntai',   testGetWeekday(0));    // su
    assertDateParsed('maanantai',   testGetWeekday(1));    // ma
    assertDateParsed('tiistai',     testGetWeekday(2));   // ti
    assertDateParsed('keskiviikko', testGetWeekday(3)); // ke
    assertDateParsed('torstai',     testGetWeekday(4));  // to
    assertDateParsed('perjantai',   testGetWeekday(5));    // pe
    assertDateParsed('lauantai',    testGetWeekday(6));  // la

    assertDateParsed('yksi millisekunti sitten', getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('yksi sekunti sitten',      getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('yksi minuutti sitten',     getRelativeDate(0,0,0,0,-1));
    assertDateParsed('yksi tunti sitten',        getRelativeDate(0,0,0,-1));
    assertDateParsed('yksi päivä sitten',        getRelativeDate(0,0,-1));
    assertDateParsed('yksi viikko sitten',       getRelativeDate(0,0,-7));
    assertDateParsed('yksi kuukausi sitten',     getRelativeDate(0,-1));
    assertDateParsed('yksi vuosi sitten',        getRelativeDate(-1));
    assertDateParsed('millisekunti sitten',      getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('sekunti sitten',           getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('minuutti sitten',          getRelativeDate(0,0,0,0,-1));
    assertDateParsed('tunti sitten',             getRelativeDate(0,0,0,-1));
    assertDateParsed('päivä sitten',             getRelativeDate(0,0,-1));
    assertDateParsed('viikko sitten',            getRelativeDate(0,0,-7));
    assertDateParsed('kuukausi sitten',          getRelativeDate(0,-1));
    assertDateParsed('vuosi sitten',             getRelativeDate(-1));

    assertDateParsed('5 millisekunnin päästä',   getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed('5 sekunnin päästä',        getRelativeDate(0,0,0,0,0,5));
    assertDateParsed('5 minuutin päästä',        getRelativeDate(0,0,0,0,5));
    assertDateParsed('5 tunnin päästä',          getRelativeDate(0,0,0,5));
    assertDateParsed('5 päivän päästä',          getRelativeDate(0,0,5));
    assertDateParsed('5 viikon päästä',          getRelativeDate(0,0,35));
    assertDateParsed('5 kuukauden päästä',       getRelativeDate(0,5));
    assertDateParsed('5 vuoden päästä',          getRelativeDate(5));

    assertDateParsed('toissa päivänä', getRelativeDateReset(0,0,-2));
    assertDateParsed('eilen',          getRelativeDateReset(0,0,-1));
    assertDateParsed('tänään',         getRelativeDateReset(0,0, 0));
    assertDateParsed('huomenna',       getRelativeDateReset(0,0, 1));
    assertDateParsed('ylihuomenna',    getRelativeDateReset(0,0, 2));

    assertDateParsed('viime viikko',   getRelativeDate(0,0,-7));
    assertDateParsed('viime viikolla', getRelativeDate(0,0,-7));
    assertDateParsed('ensi viikko',    getRelativeDate(0,0, 7));
    assertDateParsed('ensi viikolla',  getRelativeDate(0,0, 7));
    assertDateParsed('tällä viikolla', getRelativeDate(0,0, 0));
    assertDateParsed('tämä viikko',    getRelativeDate(0,0, 0));


    assertDateParsed('tässä kuussa',       getRelativeDate(0, 0));
    assertDateParsed('viime kuussa',       getRelativeDate(0,-1));
    assertDateParsed('edellinen kuukausi', getRelativeDate(0,-1));
    assertDateParsed('seuraava kuukausi',  getRelativeDate(0, 1));
    assertDateParsed('ensi kuussa',        getRelativeDate(0, 1));

    assertDateParsed('viime vuosi',  getRelativeDate(-1));
    assertDateParsed('viime vuonna', getRelativeDate(-1));
    assertDateParsed('ensi vuosi',   getRelativeDate(1));
    assertDateParsed('ensi vuonna',  getRelativeDate(1));
    assertDateParsed('tämä vuosi',   getRelativeDate(0));
    assertDateParsed('tänä vuonna',  getRelativeDate(0));

    assertDateParsed('ensi maanantai',  testGetWeekday(1, 1));
    assertDateParsed('viime maanantai', testGetWeekday(1,-1));

    assertDateParsed('ensi maanantaina',  testGetWeekday(1, 1));
    assertDateParsed('viime maanantaina', testGetWeekday(1, -1));

    assertDateParsed('viime maanantaina klo 3.45', testGetWeekday(1,-1,3,45));
    assertDateParsed('viime maanantai klo 3.45',   testGetWeekday(1,-1,3,45));
    assertDateParsed('huomenna klo 3.30',          testDateSet(getRelativeDateReset(0,0,1), {hour:3,minute:30}));

    assertDateParsed('viime sunnuntaina',   testGetWeekday(0,-1));
    assertDateParsed('viime maanantaina',   testGetWeekday(1,-1));
    assertDateParsed('viime tiistaina',     testGetWeekday(2,-1));
    assertDateParsed('viime keskiviikkona', testGetWeekday(3,-1));
    assertDateParsed('viime torstaina',     testGetWeekday(4,-1));
    assertDateParsed('viime perjantaina',   testGetWeekday(5,-1));
    assertDateParsed('viime lauantaina',    testGetWeekday(6,-1));

    assertDateParsed('17:32 15. toukokuuta', new Date(now.getFullYear(), 4, 15, 17, 32));
    assertDateParsed('17:32 ensi maanantai', testGetWeekday(1,1,17,32));


    // Numbers

    assertDateParsed('nolla vuotta sitten',     getRelativeDate(0));
    assertDateParsed('yksi vuosi sitten',       getRelativeDate(-1));
    assertDateParsed('kaksi vuotta sitten',     getRelativeDate(-2));
    assertDateParsed('kolme vuotta sitten',     getRelativeDate(-3));
    assertDateParsed('neljä vuotta sitten',     getRelativeDate(-4));
    assertDateParsed('viisi vuotta sitten',     getRelativeDate(-5));
    assertDateParsed('kuusi vuotta sitten',     getRelativeDate(-6));
    assertDateParsed('seitsemän vuotta sitten', getRelativeDate(-7));
    assertDateParsed('kahdeksan vuotta sitten', getRelativeDate(-8));
    assertDateParsed('yhdeksän vuotta sitten',  getRelativeDate(-9));

  });

  method('format', function() {

    test(then, '5. tammikuuta 2010 klo 15.52', 'default format');

    assertFormatShortcut(then, 'short', '5.1.2010');
    assertFormatShortcut(then, 'medium', '5. tammikuuta 2010');
    assertFormatShortcut(then, 'long', '5. tammikuuta 2010 klo 15.52');
    assertFormatShortcut(then, 'full', 'tiistai 5. tammikuuta 2010 klo 15.52');

    test(then, ['{time}'], '15.52', 'preferred time');
    test(then, ['{stamp}'], 'ti 5 tammi 2010 15.52', 'preferred stamp');
    test(then, ['%c'], 'ti 5 tammi 2010 15.52', '%c stamp');

    test(new Date(2011, 0, 25), ['{d}. {month} {yyyy}'], '25. tammikuuta 2011', 'Jan');
    test(new Date(2011, 1, 25), ['{d}. {month} {yyyy}'], '25. helmikuuta 2011', 'Feb');
    test(new Date(2011, 2, 25), ['{d}. {month} {yyyy}'], '25. maaliskuuta 2011', 'Mar');
    test(new Date(2011, 3, 25), ['{d}. {month} {yyyy}'], '25. huhtikuuta 2011', 'Apr');
    test(new Date(2011, 4, 25), ['{d}. {month} {yyyy}'], '25. toukokuuta 2011', 'May');
    test(new Date(2011, 5, 25), ['{d}. {month} {yyyy}'], '25. kesäkuuta 2011', 'Jun');
    test(new Date(2011, 6, 25), ['{d}. {month} {yyyy}'], '25. heinäkuuta 2011', 'Jul');
    test(new Date(2011, 7, 25), ['{d}. {month} {yyyy}'], '25. elokuuta 2011', 'Aug');
    test(new Date(2011, 8, 25), ['{d}. {month} {yyyy}'], '25. syyskuuta 2011', 'Sep');
    test(new Date(2011, 9, 25), ['{d}. {month} {yyyy}'], '25. lokakuuta 2011', 'Oct');
    test(new Date(2011,10, 25), ['{d}. {month} {yyyy}'], '25. marraskuuta 2011', 'Nov');
    test(new Date(2011,11, 25), ['{d}. {month} {yyyy}'], '25. joulukuuta 2011', 'Dec');

    test(new Date(2011, 11, 5), ['{weekday}'], 'maanantai', 'Mon');
    test(new Date(2011, 11, 6), ['{weekday}'], 'tiistai', 'Tue');
    test(new Date(2011, 11, 7), ['{weekday}'], 'keskiviikko', 'Wed');
    test(new Date(2011, 11, 8), ['{weekday}'], 'torstai', 'Thu');
    test(new Date(2011, 11, 9), ['{weekday}'], 'perjantai', 'Fri');
    test(new Date(2011, 11,10), ['{weekday}'], 'lauantai', 'Sat');
    test(new Date(2011, 11,11), ['{weekday}'], 'sunnuntai', 'Sun');

    test(new Date('January 3, 2010'), ['{w}'], '53',   'locale week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{ww}'], '53',  'locale week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{wo}'], '53.', 'locale week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{w}'], '1',    'locale week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{ww}'], '01',  'locale week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{wo}'], '1.',  'locale week number ordinal | Jan 4 2010');

    test(new Date(2015, 10, 8),  ['{Dow}'], 'su', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], 'ma', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], 'ti', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], 'ke', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], 'to', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], 'pe', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], 'la', 'Sat');

    test(new Date(2015, 0, 1),  ['{Mon}'], 'tammi', 'Jan');
    test(new Date(2015, 1, 1),  ['{Mon}'], 'helmi', 'Feb');
    test(new Date(2015, 2, 1),  ['{Mon}'], 'maalis', 'Mar');
    test(new Date(2015, 3, 1),  ['{Mon}'], 'huhti', 'Apr');
    test(new Date(2015, 4, 1),  ['{Mon}'], 'touko', 'May');
    test(new Date(2015, 5, 1),  ['{Mon}'], 'kesä', 'Jun');
    test(new Date(2015, 6, 1),  ['{Mon}'], 'heinä', 'Jul');
    test(new Date(2015, 7, 1),  ['{Mon}'], 'elo', 'Aug');
    test(new Date(2015, 8, 1),  ['{Mon}'], 'syys', 'Sep');
    test(new Date(2015, 9, 1),  ['{Mon}'], 'loka', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], 'marras', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], 'joulu', 'Dec');

  });

  method('relative', function() {

    assertRelative('1 second ago', '1 sekunti sitten');
    assertRelative('1 minute ago', '1 minuutti sitten');
    assertRelative('1 hour ago',   '1 tunti sitten');
    assertRelative('1 day ago',    '1 päivä sitten');
    assertRelative('1 week ago',   '1 viikko sitten');
    assertRelative('1 month ago',  '1 kuukausi sitten');
    assertRelative('1 year ago',   '1 vuosi sitten');

    assertRelative('3 seconds ago', '3 sekuntia sitten');
    assertRelative('3 minutes ago', '3 minuuttia sitten');
    assertRelative('3 hours ago',   '3 tuntia sitten');
    assertRelative('3 days ago',    '3 päivää sitten');
    assertRelative('3 weeks ago',   '3 viikkoa sitten');
    assertRelative('3 months ago',  '3 kuukautta sitten');
    assertRelative('3 years ago',   '3 vuotta sitten');

    assertRelative('5 seconds ago', '5 sekuntia sitten');
    assertRelative('5 minutes ago', '5 minuuttia sitten');
    assertRelative('5 hours ago',   '5 tuntia sitten');
    assertRelative('5 days ago',    '5 päivää sitten');
    assertRelative('5 weeks ago',   '1 kuukausi sitten');
    assertRelative('5 months ago',  '5 kuukautta sitten');
    assertRelative('5 years ago',   '5 vuotta sitten');

    assertRelative('1 second from now', '1 sekunnin kuluttua');
    assertRelative('1 minute from now', '1 minuutin kuluttua');
    assertRelative('1 hour from now',   '1 tunnin kuluttua');
    assertRelative('1 day from now',    '1 päivän kuluttua');
    assertRelative('1 week from now',   '1 viikon kuluttua');
    assertRelative('1 month from now',  '1 kuukauden kuluttua');
    assertRelative('1 year from now',   '1 vuoden kuluttua');

    assertRelative('3 seconds from now', '3 sekunnin kuluttua');
    assertRelative('3 minutes from now', '3 minuutin kuluttua');
    assertRelative('3 hours from now',   '3 tunnin kuluttua');
    assertRelative('3 days from now',    '3 päivän kuluttua');
    assertRelative('3 weeks from now',   '3 viikon kuluttua');
    assertRelative('3 months from now',  '3 kuukauden kuluttua');
    assertRelative('3 years from now',   '3 vuoden kuluttua');

    assertRelative('5 seconds from now', '5 sekunnin kuluttua');
    assertRelative('5 minutes from now', '5 minuutin kuluttua');
    assertRelative('5 hours from now',   '5 tunnin kuluttua');
    assertRelative('5 days from now',    '5 päivän kuluttua');
    assertRelative('5 weeks from now',   '1 kuukauden kuluttua');
    assertRelative('5 months from now',  '5 kuukauden kuluttua');
    assertRelative('5 years from now',   '5 vuoden kuluttua');

  });

  method('beginning/end', function() {
    equal(run(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(run(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Finnish', function () {

  method('duration', function() {
    testSetLocale('fi');

    test(run(0, 'milliseconds'), '0 millisekuntia',  '0 milliseconds');

    test(run(1, 'second'), '1 sekunti',  '1 second');
    test(run(1, 'minute'), '1 minuutti', '1 minute');
    test(run(1, 'hour'),   '1 tunti',    '1 hour');
    test(run(1, 'day'),    '1 päivä',    '1 day');
    test(run(1, 'week'),   '1 viikko',   '1 week');
    test(run(1, 'month'),  '1 kuukausi', '1 month');
    test(run(1, 'year'),   '1 vuosi',    '1 year');

    test(run(3, 'seconds'), '3 sekuntia',  '3 seconds');
    test(run(3, 'minutes'), '3 minuuttia', '3 minutes');
    test(run(3, 'hours'),   '3 tuntia',    '3 hours');
    test(run(3, 'days'),    '3 päivää',    '3 days');
    test(run(3, 'weeks'),   '3 viikkoa',   '3 weeks');
    test(run(3, 'months'),  '3 kuukautta', '3 months');
    test(run(3, 'years'),   '3 vuotta',    '3 years');

    test(run(10, 'seconds'), '10 sekuntia',  '10 seconds');
    test(run(10, 'minutes'), '10 minuuttia', '10 minutes');
    test(run(10, 'hours'),   '10 tuntia',    '10 hours');
    test(run(10, 'months'),  '10 kuukautta', '10 months');
    test(run(10, 'years'),   '10 vuotta',    '10 years');

  });

});
