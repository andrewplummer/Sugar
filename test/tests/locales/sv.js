namespace('Date | Swedish', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('sv');
  });

  method('create', function() {

    equal(testCreateDate('den 15 maj 2011'), new Date(2011, 4, 15), 'basic Swedish date');
    equal(testCreateDate('15 maj 2011'), new Date(2011, 4, 15), 'basic Swedish date');
    equal(testCreateDate('tisdag 5 januari 2012'), new Date(2012, 0, 5), '2012-01-05');
    equal(testCreateDate('tisdag, 5 januari 2012'), new Date(2012, 0, 5), '2012-01-05');
    equal(testCreateDate('maj 2011'), new Date(2011, 4), 'year and month');
    equal(testCreateDate('15 maj'), new Date(now.getFullYear(), 4, 15), 'month and date');
    equal(testCreateDate('2011'), new Date(2011, 0), 'year');
    equal(testCreateDate('02 feb. 2016'), new Date(2016, 1, 2), 'toLocaleDateString');

    equal(testCreateDate('maj'), new Date(now.getFullYear(), 4), 'month');
    equal(testCreateDate('måndag'), testGetWeekday(1), 'Monday');

    equal(testCreateDate('15 maj 2011 3:45'), new Date(2011, 4, 15, 3, 45), 'basic Swedish date 3:45');
    equal(testCreateDate('15 maj 2011 3:45pm'), new Date(2011, 4, 15, 15, 45), 'basic Swedish date 3:45pm');

    equal(testCreateDate('för en millisekund sedan'), getRelativeDate(0,0,0,0,0,0,-1), 'one millisecond ago');
    equal(testCreateDate('för en sekund sedan'),      getRelativeDate(0,0,0,0,0,-1), 'one second ago');
    equal(testCreateDate('för en minut sedan'),       getRelativeDate(0,0,0,0,-1), 'one minute ago');
    equal(testCreateDate('för en timme sedan'),       getRelativeDate(0,0,0,-1), 'one hour ago');
    equal(testCreateDate('för en dag sedan'),         getRelativeDate(0,0,-1), 'one day ago');
    equal(testCreateDate('för en vecka sedan'),       getRelativeDate(0,0,-7), 'one week ago');
    equal(testCreateDate('för en månad sedan'),       getRelativeDate(0,-1), 'one month ago');
    equal(testCreateDate('för ett år sedan'),         getRelativeDate(-1), 'one year ago');
    equal(testCreateDate('ett år sen'),               getRelativeDate(-1), 'one year ago');
    equal(testCreateDate('ett ar sen'),               getRelativeDate(-1), 'one year ago');

    equal(testCreateDate('om 5 millisekunder'), getRelativeDate(0,0,0,0,0,0,5), 'dans | five milliseconds from now');
    equal(testCreateDate('om 5 sekunder'),      getRelativeDate(0,0,0,0,0,5), 'dans | five second from now');
    equal(testCreateDate('om 5 minuter'),       getRelativeDate(0,0,0,0,5), 'dans | five minute from now');
    equal(testCreateDate('om 5 timmar'),        getRelativeDate(0,0,0,5), 'dans | five hour from now');
    equal(testCreateDate('om 5 dagar'),         getRelativeDate(0,0,5), 'dans | five day from now');
    equal(testCreateDate('om 5 veckor'),        getRelativeDate(0,0,35), 'dans | five weeks from now');
    equal(testCreateDate('om 5 månader'),       getRelativeDate(0,5), 'dans | five months from now');
    equal(testCreateDate('om 5 år'),            getRelativeDate(5), 'dans | five years from now');


    equal(testCreateDate('i förrgår'),     run(getRelativeDate(0,0,-2), 'reset'), 'day before yesterday');
    equal(testCreateDate('förrgår'),       run(getRelativeDate(0,0,-2), 'reset'), 'day before yesterday');
    equal(testCreateDate('i går'),         run(getRelativeDate(0,0,-1), 'reset'), 'yesterday');
    equal(testCreateDate('igår'),          run(getRelativeDate(0,0,-1), 'reset'), 'yesterday');
    equal(testCreateDate('i dag'),         run(getRelativeDate(0,0,0), 'reset'), 'today');
    equal(testCreateDate('idag'),          run(getRelativeDate(0,0,0), 'reset'), 'today');
    equal(testCreateDate('imorgon'),       run(getRelativeDate(0,0,1), 'reset'), 'tomorrow');
    equal(testCreateDate('i morgon'),      run(getRelativeDate(0,0,1), 'reset'), 'tomorrow');
    equal(testCreateDate('i övermorgon'),  run(getRelativeDate(0,0,2), 'reset'), 'day after tomorrow');
    equal(testCreateDate('i över morgon'), run(getRelativeDate(0,0,2), 'reset'), 'day after tomorrow');

    equal(testCreateDate('förra veckan'),   getRelativeDate(0,0,-7), 'Last week');
    equal(testCreateDate('i förra veckan'), getRelativeDate(0,0,-7), 'Last week');
    equal(testCreateDate('nästa vecka'),    getRelativeDate(0,0,7), 'Next week');
    equal(testCreateDate('nasta vecka'),    getRelativeDate(0,0,7), 'Next week');

    equal(testCreateDate('förra månaden'), getRelativeDate(0,-1), 'last month');
    equal(testCreateDate('nästa månad'),   getRelativeDate(0,1), 'Next month');

    equal(testCreateDate('förra året'), getRelativeDate(-1), 'Last year');
    equal(testCreateDate('nästa år'),   getRelativeDate(1), 'Next year');

    equal(testCreateDate('förra måndagen'), testGetWeekday(1,-1), 'last monday');
    equal(testCreateDate('nästa måndag'),   testGetWeekday(1,1), 'next monday');


    // no accents
    equal(testCreateDate('mandag'), testGetWeekday(1), 'Monday');

    equal(testCreateDate('for en millisekund sedan'), getRelativeDate(0,0,0,0,0,0,-1), 'one millisecond ago');
    equal(testCreateDate('for en sekund sedan'),      getRelativeDate(0,0,0,0,0,-1), 'one second ago');
    equal(testCreateDate('for en minut sedan'),       getRelativeDate(0,0,0,0,-1), 'one minute ago');
    equal(testCreateDate('for en timme sedan'),       getRelativeDate(0,0,0,-1), 'one hour ago');
    equal(testCreateDate('for en dag sedan'),         getRelativeDate(0,0,-1), 'one day ago');
    equal(testCreateDate('for en vecka sedan'),       getRelativeDate(0,0,-7), 'one week ago');
    equal(testCreateDate('for en manad sedan'),       getRelativeDate(0,-1), 'one month ago');
    equal(testCreateDate('for ett ar sedan'),         getRelativeDate(-1), 'one year ago');
    equal(testCreateDate('ett ar sen'),               getRelativeDate(-1), 'one year ago');

    equal(testCreateDate('om 5 manader'), getRelativeDate(0,5), 'dans | five months from now');
    equal(testCreateDate('om 5 ar'),      getRelativeDate(5), 'dans | five years from now');

    equal(testCreateDate('i forrgar'),     run(getRelativeDate(0,0,-2), 'reset'), 'day before yesterday');
    equal(testCreateDate('förrgår'),       run(getRelativeDate(0,0,-2), 'reset'), 'day before yesterday');
    equal(testCreateDate('i gar'),         run(getRelativeDate(0,0,-1), 'reset'), 'yesterday');
    equal(testCreateDate('igar'),          run(getRelativeDate(0,0,-1), 'reset'), 'yesterday');
    equal(testCreateDate('i overmorgon'),  run(getRelativeDate(0,0,2), 'reset'), 'day after tomorrow');
    equal(testCreateDate('i over morgon'), run(getRelativeDate(0,0,2), 'reset'), 'day after tomorrow');

    equal(testCreateDate('forra veckan'),   getRelativeDate(0,0,-7), 'Last week');
    equal(testCreateDate('i forra veckan'), getRelativeDate(0,0,-7), 'Last week');
    equal(testCreateDate('nasta vecka'),    getRelativeDate(0,0,7), 'Next week');
    equal(testCreateDate('forra manaden'),  getRelativeDate(0,-1), 'last month');
    equal(testCreateDate('nasta manad'),    getRelativeDate(0,1), 'Next month');
    equal(testCreateDate('forra aret'),     getRelativeDate(-1), 'Last year');
    equal(testCreateDate('nasta ar'),       getRelativeDate(1), 'Next year');

    equal(testCreateDate('17:32 den 15 maj'), new Date(now.getFullYear(), 4, 15, 17, 32), '17:32 May 15');
    equal(testCreateDate('17:32 nästa måndag'), testGetWeekday(1, 1, 17, 32), '17:32 next monday');

    // Numbers

    equal(testCreateDate('noll år sedan'), getRelativeDate(0),   'zero years ago');
    equal(testCreateDate('ett år sedan'),  getRelativeDate(-1),  'one year ago');
    equal(testCreateDate('två år sedan'),  getRelativeDate(-2),  'two years ago');
    equal(testCreateDate('tre år sedan'),  getRelativeDate(-3),  'three years ago');
    equal(testCreateDate('fyra år sedan'), getRelativeDate(-4),  'four years ago');
    equal(testCreateDate('fem år sedan'),  getRelativeDate(-5),  'five years ago');
    equal(testCreateDate('sex år sedan'),  getRelativeDate(-6),  'six years ago');
    equal(testCreateDate('sju år sedan'),  getRelativeDate(-7),  'seven years ago');
    equal(testCreateDate('åtta år sedan'), getRelativeDate(-8),  'eight years ago');
    equal(testCreateDate('nio år sedan'),  getRelativeDate(-9),  'nine years ago');
    equal(testCreateDate('tio år sedan'),  getRelativeDate(-10), 'ten years ago');

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
    equal(dateRun(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(dateRun(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Swedish', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['sv'], '5 timmar', 'simple duration');
  });

});

