namespace('Date | Swedish', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('sv');
  });

  method('create', function() {

    assertDateParsed('den 15 maj 2011', new Date(2011, 4, 15));
    assertDateParsed('15 maj 2011', new Date(2011, 4, 15));
    assertDateParsed('torsdag 5 januari 2012', new Date(2012, 0, 5));
    assertDateParsed('torsdag, 5 januari 2012', new Date(2012, 0, 5));
    assertDateParsed('maj 2011', new Date(2011, 4));
    assertDateParsed('15 maj', new Date(now.getFullYear(), 4, 15));
    assertDateParsed('2011', new Date(2011, 0));
    assertDateParsed('02 feb. 2016', new Date(2016, 1, 2));

    assertDateParsed('maj', new Date(now.getFullYear(), 4));
    assertDateParsed('måndag', testGetWeekday(1));

    assertDateParsed('15 maj 2011 3:45', new Date(2011, 4, 15, 3, 45));
    assertDateParsed('15 maj 2011 3:45pm', new Date(2011, 4, 15, 15, 45));

    assertDateParsed('för en millisekund sedan', getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('för en sekund sedan',      getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('för en minut sedan',       getRelativeDate(0,0,0,0,-1));
    assertDateParsed('för en timme sedan',       getRelativeDate(0,0,0,-1));
    assertDateParsed('för en dag sedan',         getRelativeDate(0,0,-1));
    assertDateParsed('för en vecka sedan',       getRelativeDate(0,0,-7));
    assertDateParsed('för en månad sedan',       getRelativeDate(0,-1));
    assertDateParsed('för ett år sedan',         getRelativeDate(-1));
    assertDateParsed('ett år sen',               getRelativeDate(-1));
    assertDateParsed('ett ar sen',               getRelativeDate(-1));

    assertDateParsed('om 5 millisekunder', getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed('om 5 sekunder',      getRelativeDate(0,0,0,0,0,5));
    assertDateParsed('om 5 minuter',       getRelativeDate(0,0,0,0,5));
    assertDateParsed('om 5 timmar',        getRelativeDate(0,0,0,5));
    assertDateParsed('om 5 dagar',         getRelativeDate(0,0,5));
    assertDateParsed('om 5 veckor',        getRelativeDate(0,0,35));
    assertDateParsed('om 5 månader',       getRelativeDate(0,5));
    assertDateParsed('om 5 år',            getRelativeDate(5));


    assertDateParsed('i förrgår',     getRelativeDateReset(0,0,-2));
    assertDateParsed('förrgår',       getRelativeDateReset(0,0,-2));
    assertDateParsed('i går',         getRelativeDateReset(0,0,-1));
    assertDateParsed('igår',          getRelativeDateReset(0,0,-1));
    assertDateParsed('i dag',         getRelativeDateReset(0,0,0));
    assertDateParsed('idag',          getRelativeDateReset(0,0,0));
    assertDateParsed('imorgon',       getRelativeDateReset(0,0,1));
    assertDateParsed('i morgon',      getRelativeDateReset(0,0,1));
    assertDateParsed('i övermorgon',  getRelativeDateReset(0,0,2));
    assertDateParsed('i över morgon', getRelativeDateReset(0,0,2));

    assertDateParsed('förra veckan',   getRelativeDate(0,0,-7));
    assertDateParsed('i förra veckan', getRelativeDate(0,0,-7));
    assertDateParsed('nästa vecka',    getRelativeDate(0,0,7));
    assertDateParsed('nasta vecka',    getRelativeDate(0,0,7));

    assertDateParsed('förra månaden', getRelativeDate(0,-1));
    assertDateParsed('nästa månad',   getRelativeDate(0,1));

    assertDateParsed('förra året', getRelativeDate(-1));
    assertDateParsed('nästa år',   getRelativeDate(1));

    assertDateParsed('förra måndagen', testGetWeekday(1,-1));
    assertDateParsed('nästa måndag',   testGetWeekday(1,1));


    // no accents
    assertDateParsed('mandag', testGetWeekday(1));

    assertDateParsed('for en millisekund sedan', getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('for en sekund sedan',      getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('for en minut sedan',       getRelativeDate(0,0,0,0,-1));
    assertDateParsed('for en timme sedan',       getRelativeDate(0,0,0,-1));
    assertDateParsed('for en dag sedan',         getRelativeDate(0,0,-1));
    assertDateParsed('for en vecka sedan',       getRelativeDate(0,0,-7));
    assertDateParsed('for en manad sedan',       getRelativeDate(0,-1));
    assertDateParsed('for ett ar sedan',         getRelativeDate(-1));
    assertDateParsed('ett ar sen',               getRelativeDate(-1));

    assertDateParsed('om 5 manader', getRelativeDate(0,5));
    assertDateParsed('om 5 ar',      getRelativeDate(5));

    assertDateParsed('i forrgar',     getRelativeDateReset(0,0,-2));
    assertDateParsed('förrgår',       getRelativeDateReset(0,0,-2));
    assertDateParsed('i gar',         getRelativeDateReset(0,0,-1));
    assertDateParsed('igar',          getRelativeDateReset(0,0,-1));
    assertDateParsed('i overmorgon',  getRelativeDateReset(0,0,2));
    assertDateParsed('i over morgon', getRelativeDateReset(0,0,2));

    assertDateParsed('forra veckan',   getRelativeDate(0,0,-7));
    assertDateParsed('i forra veckan', getRelativeDate(0,0,-7));
    assertDateParsed('nasta vecka',    getRelativeDate(0,0,7));
    assertDateParsed('forra manaden',  getRelativeDate(0,-1));
    assertDateParsed('nasta manad',    getRelativeDate(0,1));
    assertDateParsed('forra aret',     getRelativeDate(-1));
    assertDateParsed('nasta ar',       getRelativeDate(1));

    assertDateParsed('17:32 den 15 maj', new Date(now.getFullYear(), 4, 15, 17, 32));
    assertDateParsed('17:32 nästa måndag', testGetWeekday(1, 1, 17, 32));

    // Numbers

    assertDateParsed('noll år sedan', getRelativeDate(0));
    assertDateParsed('ett år sedan',  getRelativeDate(-1));
    assertDateParsed('två år sedan',  getRelativeDate(-2));
    assertDateParsed('tre år sedan',  getRelativeDate(-3));
    assertDateParsed('fyra år sedan', getRelativeDate(-4));
    assertDateParsed('fem år sedan',  getRelativeDate(-5));
    assertDateParsed('sex år sedan',  getRelativeDate(-6));
    assertDateParsed('sju år sedan',  getRelativeDate(-7));
    assertDateParsed('åtta år sedan', getRelativeDate(-8));
    assertDateParsed('nio år sedan',  getRelativeDate(-9));
    assertDateParsed('tio år sedan',  getRelativeDate(-10));

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
    equal(run(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(run(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Swedish', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['sv'], '5 timmar', 'simple duration');
  });

});
