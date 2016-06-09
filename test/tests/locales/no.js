xnamespace('Date | Norwegian', function () {
  "use string";

  // TODO: Someone Norwegian please help with these (they're Swedish now) :)

  var now;

  setup(function() {
    now = new Date();
    testSetLocale('no');
  });

  method('create', function() {

    equal(testCreateDate('den 15 maj 2011'), new Date(2011, 4, 15), 'basic Norwegian date');
    equal(testCreateDate('15 maj 2011'), new Date(2011, 4, 15), 'basic Norwegian date');
    equal(testCreateDate('tisdag 5 januari 2012'), new Date(2012, 0, 5), '2012-01-05');
    equal(testCreateDate('tisdag, 5 januari 2012'), new Date(2012, 0, 5), '2012-01-05');
    equal(testCreateDate('maj 2011'), new Date(2011, 4), 'year and month');
    equal(testCreateDate('15 maj'), new Date(now.getFullYear(), 4, 15), 'month and date');
    equal(testCreateDate('2011'), new Date(2011, 0), 'year');
    equal(testCreateDate('Feb 02, 2016'), new Date(2016, 1, 2), 'toLocaleDateString');

    equal(testCreateDate('maj'), new Date(now.getFullYear(), 4), 'month');
    equal(testCreateDate('måndag'), testGetWeekday(1), 'Monday');

    equal(testCreateDate('15 maj 2011 3:45'), new Date(2011, 4, 15, 3, 45), 'basic Norwegian date 3:45');
    equal(testCreateDate('15 maj 2011 3:45pm'), new Date(2011, 4, 15, 15, 45), 'basic Norwegian date 3:45pm');

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
    equal(testCreateDate('for en sekund sedan'), getRelativeDate(0,0,0,0,0,-1), 'one second ago');
    equal(testCreateDate('for en minut sedan'), getRelativeDate(0,0,0,0,-1), 'one minute ago');
    equal(testCreateDate('for en timme sedan'), getRelativeDate(0,0,0,-1), 'one hour ago');
    equal(testCreateDate('for en dag sedan'), getRelativeDate(0,0,-1), 'one day ago');
    equal(testCreateDate('for en vecka sedan'), getRelativeDate(0,0,-7), 'one week ago');
    equal(testCreateDate('for en manad sedan'), getRelativeDate(0,-1), 'one month ago');
    equal(testCreateDate('for ett ar sedan'), getRelativeDate(-1), 'one year ago');
    equal(testCreateDate('ett ar sen'), getRelativeDate(-1), 'one year ago');

    equal(testCreateDate('om 5 manader'), getRelativeDate(0,5), 'dans | five months from now');
    equal(testCreateDate('om 5 ar'), getRelativeDate(5), 'dans | five years from now');

    equal(testCreateDate('i forrgar'), run(getRelativeDate(0,0,-2), 'reset'), 'day before yesterday');
    equal(testCreateDate('förrgår'), run(getRelativeDate(0,0,-2), 'reset'), 'day before yesterday');
    equal(testCreateDate('i gar'), run(getRelativeDate(0,0,-1), 'reset'), 'yesterday');
    equal(testCreateDate('igar'), run(getRelativeDate(0,0,-1), 'reset'), 'yesterday');
    equal(testCreateDate('i overmorgon'), run(getRelativeDate(0,0,2), 'reset'), 'day after tomorrow');
    equal(testCreateDate('i over morgon'), run(getRelativeDate(0,0,2), 'reset'), 'day after tomorrow');

    equal(testCreateDate('forra veckan'), getRelativeDate(0,0,-7), 'Last week');
    equal(testCreateDate('i forra veckan'), getRelativeDate(0,0,-7), 'Last week');
    equal(testCreateDate('nasta vecka'), getRelativeDate(0,0,7), 'Next week');
    equal(testCreateDate('forra manaden'), getRelativeDate(0,-1), 'last month');
    equal(testCreateDate('nasta manad'), getRelativeDate(0,1), 'Next month');
    equal(testCreateDate('forra aret'), getRelativeDate(-1), 'Last year');
    equal(testCreateDate('nasta ar'), getRelativeDate(1), 'Next year');

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
    test(testCreateDate('1 month from now', 'en'),  'om 1 månad');
    test(testCreateDate('1 year from now', 'en'),   'om 1 år');

    test(testCreateDate('5 seconds from now', 'en'), 'om 5 sekunder');
    test(testCreateDate('5 minutes from now', 'en'), 'om 5 minuter');
    test(testCreateDate('5 hours from now', 'en'),   'om 5 timmar');
    test(testCreateDate('5 days from now', 'en'),    'om 5 dagar');
    test(testCreateDate('3 weeks from now', 'en'),   'om 3 veckor');
    test(testCreateDate('5 weeks from now', 'en'),   'om 1 månad');
    test(testCreateDate('5 months from now', 'en'),  'om 5 månader');
    test(testCreateDate('5 year from now', 'en'),    'om 5 år');
  });

});

xnamespace('Number | Norwegian', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['sv'], '5 timmar', 'simple duration');
  });

});

