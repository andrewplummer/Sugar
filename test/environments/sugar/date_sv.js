package('Date | Swedish', function () {

  var now = new Date();
  testSetLocale('sv');

  method('create', function() {

    dateEqual(testCreateDate('den 15 maj 2011'), new Date(2011, 4, 15), 'basic Swedish date');
    dateEqual(testCreateDate('15 maj 2011'), new Date(2011, 4, 15), 'basic Swedish date');
    dateEqual(testCreateDate('tisdag 5 januari 2012'), new Date(2012, 0, 5), '2012-01-05');
    dateEqual(testCreateDate('tisdag, 5 januari 2012'), new Date(2012, 0, 5), '2012-01-05');
    dateEqual(testCreateDate('maj 2011'), new Date(2011, 4), 'year and month');
    dateEqual(testCreateDate('15 maj'), new Date(now.getFullYear(), 4, 15), 'month and date');
    dateEqual(testCreateDate('2011'), new Date(2011, 0), 'year');
    dateEqual(testCreateDate('maj'), new Date(now.getFullYear(), 4), 'month');
    dateEqual(testCreateDate('måndag'), getDateWithWeekdayAndOffset(1), 'Monday');

    dateEqual(testCreateDate('15 maj 2011 3:45'), new Date(2011, 4, 15, 3, 45), 'basic Swedish date 3:45');
    dateEqual(testCreateDate('15 maj 2011 3:45pm'), new Date(2011, 4, 15, 15, 45), 'basic Swedish date 3:45pm');

    dateEqual(testCreateDate('för en millisekund sedan'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('för en sekund sedan'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('för en minut sedan'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    dateEqual(testCreateDate('för en timme sedan'), getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('för en dag sedan'), getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('för en vecka sedan'), getRelativeDate(null, null, -7), 'one week ago');
    dateEqual(testCreateDate('för en månad sedan'), getRelativeDate(null, -1), 'one month ago');
    dateEqual(testCreateDate('för ett år sedan'), getRelativeDate(-1), 'one year ago');
    dateEqual(testCreateDate('ett år sen'), getRelativeDate(-1), 'one year ago');

    dateEqual(testCreateDate('ett ar sen'), getRelativeDate(-1), 'one year ago');

    dateEqual(testCreateDate('om 5 millisekunder'), getRelativeDate(null, null, null, null, null, null,5), 'dans | five milliseconds from now');
    dateEqual(testCreateDate('om 5 sekunder'), getRelativeDate(null, null, null, null, null, 5), 'dans | five second from now');
    dateEqual(testCreateDate('om 5 minuter'), getRelativeDate(null, null, null, null, 5), 'dans | five minute from now');
    dateEqual(testCreateDate('om 5 timmar'), getRelativeDate(null, null, null, 5), 'dans | five hour from now');
    dateEqual(testCreateDate('om 5 dagar'), getRelativeDate(null, null, 5), 'dans | five day from now');
    dateEqual(testCreateDate('om 5 veckor'), getRelativeDate(null, null, 35), 'dans | five weeks from now');
    dateEqual(testCreateDate('om 5 månader'), getRelativeDate(null, 5), 'dans | five months from now');
    dateEqual(testCreateDate('om 5 år'), getRelativeDate(5), 'dans | five years from now');


    dateEqual(testCreateDate('i förrgår'), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    dateEqual(testCreateDate('förrgår'), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    dateEqual(testCreateDate('i går'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('igår'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('i dag'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('idag'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('imorgon'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    dateEqual(testCreateDate('i morgon'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    dateEqual(testCreateDate('i övermorgon'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');
    dateEqual(testCreateDate('i över morgon'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');

    dateEqual(testCreateDate('förra veckan'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('i förra veckan'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('nästa vecka'), getRelativeDate(null, null, 7), 'Next week');
    dateEqual(testCreateDate('nasta vecka'), getRelativeDate(null, null, 7), 'Next week');

    dateEqual(testCreateDate('förra månaden'), getRelativeDate(null, -1), 'last month');
    dateEqual(testCreateDate('nästa månad'), getRelativeDate(null, 1), 'Next month');

    dateEqual(testCreateDate('förra året'), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate('nästa år'), getRelativeDate(1), 'Next year');

    dateEqual(testCreateDate('förra måndagen'), getDateWithWeekdayAndOffset(1,  -7), 'last monday');
    dateEqual(testCreateDate('nästa måndag'), getDateWithWeekdayAndOffset(1, 7), 'next monday');


    // no accents
    dateEqual(testCreateDate('mandag'), getDateWithWeekdayAndOffset(1), 'Monday');
    dateEqual(testCreateDate('for en millisekund sedan'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('for en sekund sedan'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('for en minut sedan'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    dateEqual(testCreateDate('for en timme sedan'), getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('for en dag sedan'), getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('for en vecka sedan'), getRelativeDate(null, null, -7), 'one week ago');
    dateEqual(testCreateDate('for en manad sedan'), getRelativeDate(null, -1), 'one month ago');
    dateEqual(testCreateDate('for ett ar sedan'), getRelativeDate(-1), 'one year ago');
    dateEqual(testCreateDate('ett ar sen'), getRelativeDate(-1), 'one year ago');

    dateEqual(testCreateDate('om 5 manader'), getRelativeDate(null, 5), 'dans | five months from now');
    dateEqual(testCreateDate('om 5 ar'), getRelativeDate(5), 'dans | five years from now');

    dateEqual(testCreateDate('i forrgar'), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    dateEqual(testCreateDate('förrgår'), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    dateEqual(testCreateDate('i gar'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('igar'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('i overmorgon'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');
    dateEqual(testCreateDate('i over morgon'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');

    dateEqual(testCreateDate('forra veckan'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('i forra veckan'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('nasta vecka'), getRelativeDate(null, null, 7), 'Next week');
    dateEqual(testCreateDate('forra manaden'), getRelativeDate(null, -1), 'last month');
    dateEqual(testCreateDate('nasta manad'), getRelativeDate(null, 1), 'Next month');
    dateEqual(testCreateDate('forra aret'), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate('nasta ar'), getRelativeDate(1), 'Next year');

  });

  method('format', function() {
    test(testCreateDate('2001-06-14 3:45pm'), 'den 14 juni 2001 15:45', 'default format');
    test(testCreateDate('2011-08-25'), ['{dd} {month} {yyyy}'], '25 augusti 2011', 'dd month yyyy format');
  });


  method('relative', function() {
    test(testCreateDate('1 second ago', 'en'), '1 sekund sedan');
    test(testCreateDate('1 minute ago', 'en'), '1 minut sedan');
    test(testCreateDate('1 hour ago', 'en'),   '1 timme sedan');
    test(testCreateDate('1 day ago', 'en'),    '1 dag sedan');
    test(testCreateDate('1 week ago', 'en'),   '1 vecka sedan');
    test(testCreateDate('1 month ago', 'en'),  '1 månad sedan');
    test(testCreateDate('1 year ago', 'en'),   '1 år sedan');

    test(testCreateDate('5 seconds ago', 'en'), '5 sekunder sedan');
    test(testCreateDate('5 minutes ago', 'en'), '5 minuter sedan');
    test(testCreateDate('5 hours ago', 'en'),   '5 timmar sedan');
    test(testCreateDate('5 days ago', 'en'),    '5 dagar sedan');
    test(testCreateDate('3 weeks ago', 'en'),   '3 veckor sedan');
    test(testCreateDate('5 weeks ago', 'en'),   '1 månad sedan');
    test(testCreateDate('5 months ago', 'en'),  '5 månader sedan');
    test(testCreateDate('5 years ago', 'en'),   '5 år sedan');

    test(testCreateDate('1 second from now', 'en'), 'om 1 sekund');
    test(testCreateDate('1 minute from now', 'en'), 'om 1 minut');
    test(testCreateDate('1 hour from now', 'en'),   'om 1 timme');
    test(testCreateDate('1 day from now', 'en'),    'om 1 dag');
    test(testCreateDate('1 week from now', 'en'),   'om 1 vecka');
    testMonthsFromNow(1, 'om 1 månad',              'om 4 veckor');
    test(testCreateDate('1 year from now', 'en'),   'om 1 år');

    test(testCreateDate('5 seconds from now', 'en'), 'om 5 sekunder');
    test(testCreateDate('5 minutes from now', 'en'), 'om 5 minuter');
    test(testCreateDate('5 hours from now', 'en'),   'om 5 timmar');
    test(testCreateDate('5 days from now', 'en'),    'om 5 dagar');
    test(testCreateDate('3 weeks from now', 'en'),   'om 3 veckor');
    test(testCreateDate('5 weeks from now', 'en'),   'om 1 månad');
    testMonthsFromNow(5, 'om 5 månader',             'om 4 månader');
    test(testCreateDate('5 year from now', 'en'),    'om 5 år');
  });

});

package('Number | Swedish Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['sv'], '5 timmar', 'simple duration');
  });

});

