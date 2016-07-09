xnamespace('Date | Norwegian', function () {
  "use string";

  // TODO: Someone Norwegian please help with these (they're Swedish now) :)

  var now;

  setup(function() {
    now = new Date();
    testSetLocale('no');
  });

  method('create', function() {

    assertDateParsed('den 15 maj 2011', new Date(2011, 4, 15));
    assertDateParsed('15 maj 2011', new Date(2011, 4, 15));
    assertDateParsed('tisdag 5 januari 2012', new Date(2012, 0, 5));
    assertDateParsed('tisdag, 5 januari 2012', new Date(2012, 0, 5));
    assertDateParsed('maj 2011', new Date(2011, 4));
    assertDateParsed('15 maj', new Date(now.getFullYear(), 4, 15));
    assertDateParsed('2011', new Date(2011, 0));
    assertDateParsed('Feb 02, 2016', new Date(2016, 1, 2));

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
    assertDateParsed('for en sekund sedan', getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('for en minut sedan', getRelativeDate(0,0,0,0,-1));
    assertDateParsed('for en timme sedan', getRelativeDate(0,0,0,-1));
    assertDateParsed('for en dag sedan', getRelativeDate(0,0,-1));
    assertDateParsed('for en vecka sedan', getRelativeDate(0,0,-7));
    assertDateParsed('for en manad sedan', getRelativeDate(0,-1));
    assertDateParsed('for ett ar sedan', getRelativeDate(-1));
    assertDateParsed('ett ar sen', getRelativeDate(-1));

    assertDateParsed('om 5 manader', getRelativeDate(0,5));
    assertDateParsed('om 5 ar', getRelativeDate(5));

    assertDateParsed('i forrgar', getRelativeDateReset(0,0,-2));
    assertDateParsed('förrgår', getRelativeDateReset(0,0,-2));
    assertDateParsed('i gar', getRelativeDateReset(0,0,-1));
    assertDateParsed('igar', getRelativeDateReset(0,0,-1));
    assertDateParsed('i overmorgon', getRelativeDateReset(0,0,2));
    assertDateParsed('i over morgon', getRelativeDateReset(0,0,2));

    assertDateParsed('forra veckan', getRelativeDate(0,0,-7));
    assertDateParsed('i forra veckan', getRelativeDate(0,0,-7));
    assertDateParsed('nasta vecka', getRelativeDate(0,0,7));
    assertDateParsed('forra manaden', getRelativeDate(0,-1));
    assertDateParsed('nasta manad', getRelativeDate(0,1));
    assertDateParsed('forra aret', getRelativeDate(-1));
    assertDateParsed('nasta ar', getRelativeDate(1));

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

