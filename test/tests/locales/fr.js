namespace('Date | French', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('fr');
  });

  method('create', function() {

    equal(testCreateDate('Le 15 mai 2011'), new Date(2011, 4, 15), 'basic French date');
    equal(testCreateDate('Le 5 janvier 2012'), new Date(2012, 0, 5), '2012-01-05');
    equal(testCreateDate('mai 2011'), new Date(2011, 4), 'year and month');
    equal(testCreateDate('Le 15 mai'), new Date(now.getFullYear(), 4, 15), 'month and date');
    equal(testCreateDate('2011'), new Date(2011, 0), 'year');
    equal(testCreateDate('02 févr. 2016'), new Date(2016, 1, 2), 'toLocaleDateString');

    equal(testCreateDate('Le 5 janvier 2012 3:45'), new Date(2012, 0, 5, 3, 45), '2012-01-05 3:45');
    equal(testCreateDate('Le 5 janvier 2012 3:45pm'), new Date(2012, 0, 5, 15, 45), '2012-01-05 3:45pm');

    equal(testCreateDate('janvier'),   new Date(now.getFullYear(), 0), 'January');
    equal(testCreateDate('février'),   new Date(now.getFullYear(), 1), 'February');
    equal(testCreateDate('fevrier'),   new Date(now.getFullYear(), 1), 'February');
    equal(testCreateDate('mars'),      new Date(now.getFullYear(), 2), 'March');
    equal(testCreateDate('avril'),     new Date(now.getFullYear(), 3), 'April');
    equal(testCreateDate('mai'),       new Date(now.getFullYear(), 4), 'May');
    equal(testCreateDate('juin'),      new Date(now.getFullYear(), 5), 'June');
    equal(testCreateDate('juillet'),   new Date(now.getFullYear(), 6), 'July');
    equal(testCreateDate('août'),      new Date(now.getFullYear(), 7), 'August');
    equal(testCreateDate('septembre'), new Date(now.getFullYear(), 8), 'September');
    equal(testCreateDate('octobre'),   new Date(now.getFullYear(), 9), 'October');
    equal(testCreateDate('novembre'),  new Date(now.getFullYear(), 10), 'November');
    equal(testCreateDate('décembre'),  new Date(now.getFullYear(), 11), 'December');
    equal(testCreateDate('decembre'),  new Date(now.getFullYear(), 11), 'December');

    equal(testCreateDate('dimanche'), testGetWeekday(0), 'Sunday');
    equal(testCreateDate('lundi'),    testGetWeekday(1), 'Monday');
    equal(testCreateDate('mardi'),    testGetWeekday(2), 'Tuesday');
    equal(testCreateDate('mercredi'), testGetWeekday(3), 'Wednesday');
    equal(testCreateDate('jeudi'),    testGetWeekday(4), 'Thursday');
    equal(testCreateDate('vendredi'), testGetWeekday(5), 'Friday');
    equal(testCreateDate('samedi'),   testGetWeekday(6), 'Saturday');


    equal(testCreateDate('il y a une milliseconde'), getRelativeDate(0,0,0,0,0,0,-1), 'one millisecond ago');
    equal(testCreateDate('il y a une seconde'),      getRelativeDate(0,0,0,0,0,-1), 'one second ago');
    equal(testCreateDate('il y a une minute'),       getRelativeDate(0,0,0,0,-1), 'one minute ago');
    equal(testCreateDate('il y a une heure'),        getRelativeDate(0,0,0,-1), 'one hour ago');
    equal(testCreateDate('il y a un jour'),          getRelativeDate(0,0,-1), 'one day ago');
    equal(testCreateDate('il y a une semaine'),      getRelativeDate(0,0,-7), 'one week');
    equal(testCreateDate('il y a un mois'),          getRelativeDate(0,-1), 'one month ago');
    equal(testCreateDate('il y a un an'),            getRelativeDate(-1), 'one year ago');


    equal(testCreateDate('dans 5 millisecondes'), getRelativeDate(0,0,0,0,0,0,5), 'dans | five milliseconds from now');
    equal(testCreateDate('dans 5 secondes'),      getRelativeDate(0,0,0,0,0,5), 'dans | five second from now');
    equal(testCreateDate('dans 5 minutes'),       getRelativeDate(0,0,0,0,5), 'dans | five minute from now');
    equal(testCreateDate('dans 5 heures'),        getRelativeDate(0,0,0,5), 'dans | five hour from now');
    equal(testCreateDate('dans 5 jours'),         getRelativeDate(0,0,5), 'dans | five day from now');
    equal(testCreateDate('dans 5 semaines'),      getRelativeDate(0,0,35), 'dans | five weeks from now');
    equal(testCreateDate('dans 5 mois'),          getRelativeDate(0,5), 'dans | five months from now');
    equal(testCreateDate('dans 5 ans'),           getRelativeDate(5), 'dans | five years from now');

    equal(testCreateDate("d'ici 5 millisecondes"), getRelativeDate(0,0,0,0,0,0,5), 'dans | five milliseconds from now');
    equal(testCreateDate("d'ici 5 secondes"),      getRelativeDate(0,0,0,0,0,5), 'dans | five second from now');
    equal(testCreateDate("d'ici 5 minutes"),       getRelativeDate(0,0,0,0,5), 'dans | five minute from now');
    equal(testCreateDate("d'ici 5 heures"),        getRelativeDate(0,0,0,5), 'dans | five hour from now');
    equal(testCreateDate("d'ici 5 jours"),         getRelativeDate(0,0,5), 'dans | five day from now');
    equal(testCreateDate("d'ici 5 semaines"),      getRelativeDate(0,0,35), 'dans | five weeks from now');
    equal(testCreateDate("d'ici 5 mois"),          getRelativeDate(0,5), 'dans | five months from now');
    equal(testCreateDate("d'ici 5 ans"),           getRelativeDate(5), 'dans | five years from now');

    equal(testCreateDate('hier'),        run(getRelativeDate(0,0,-1), 'reset'), 'yesterday');
    equal(testCreateDate("aujourd'hui"), run(getRelativeDate(0,0,0), 'reset'), 'today');
    equal(testCreateDate('demain'),      run(getRelativeDate(0,0,1), 'reset'), 'tomorrow');

    equal(testCreateDate('la semaine dernière'),  getRelativeDate(0,0,-7), 'Last week');
    equal(testCreateDate('la semaine prochaine'), getRelativeDate(0,0,7), 'Next week');

    equal(testCreateDate('le mois dernier'),  getRelativeDate(0,-1), 'last month');
    equal(testCreateDate('le mois prochain'), getRelativeDate(0,1), 'Next month');

    equal(testCreateDate("l'année dernière"),  getRelativeDate(-1), 'Last year');
    equal(testCreateDate("l'année prochaine"), getRelativeDate(1), 'Next year');

    // no accents
    equal(testCreateDate('la semaine derniere'), getRelativeDate(0,0,-7), 'Last week');
    equal(testCreateDate("l'annee prochaine"),   getRelativeDate(1), 'Next year');

    equal(testCreateDate('lundi prochain'), testGetWeekday(1, 1), 'next monday');
    equal(testCreateDate('lundi dernièr'),  testGetWeekday(1, -1), 'last monday');

    equal(testCreateDate('lundi dernièr 3:45'), run(testGetWeekday(1, -1), 'set', [{hour:3,minute:45}, true]), 'last monday 3:45');

    equal(testCreateDate('17:32 15 mai'), new Date(now.getFullYear(), 4, 15, 17, 32), '17:32 May 15');
    equal(testCreateDate('17:32 lundi prochain'), testGetWeekday(1, 1, 17, 32), '17:32 next monday');

    equal(testCreateDate('demain à 3:30'), run(getRelativeDate(0,0,1), 'set', [{hours:3,minutes:30}, true]), 'tomorrow at 3:30');


    // Numbers

    equal(testCreateDate('il y a zéro ans'),   getRelativeDate(0),   'zero years ago');
    equal(testCreateDate('il y a un an'),      getRelativeDate(-1),  'one year ago');
    equal(testCreateDate('il y a deux ans'),   getRelativeDate(-2),  'two years ago');
    equal(testCreateDate('il y a trois ans'),  getRelativeDate(-3),  'three years ago');
    equal(testCreateDate('il y a quatre ans'), getRelativeDate(-4),  'four years ago');
    equal(testCreateDate('il y a cinq ans'),   getRelativeDate(-5),  'five years ago');
    equal(testCreateDate('il y a six ans'),    getRelativeDate(-6),  'six years ago');
    equal(testCreateDate('il y a sept ans'),   getRelativeDate(-7),  'seven years ago');
    equal(testCreateDate('il y a huit ans'),   getRelativeDate(-8),  'eight years ago');
    equal(testCreateDate('il y a neuf ans'),   getRelativeDate(-9),  'nine years ago');
    equal(testCreateDate('il y a dix ans'),    getRelativeDate(-10), 'ten years ago');


    // Issue #249

    equal(testCreateDate('mardi 11 decembre 2012','fr'), new Date(2012, 11, 11), 'mardi 11 decembre 2012');

    equal(run(testCreateDate(), 'isThisWeek'), true, 'isThisWeek should be true for today in other locales');
    equal(run(testCreateDate('1 week ago', 'en'), 'isLastWeek'), true, 'isLastWeek should be true for last week in other locales');
    equal(run(testCreateDate('1 week from now', 'en'), 'isNextWeek'), true, 'isNextWeek should be true for next week in other locales');

    equal(run(testCreateDate(), 'isThisMonth'), true, 'isThisMonth should be true for today in other locales');
    equal(run(testCreateDate('1 month ago', 'en'), 'isLastMonth'), true, 'isLastMonth should be true for last month in other locales');
    equal(run(testCreateDate('1 month from now', 'en'), 'isNextMonth'), true, 'isNextMonth should be true for next month in other locales');

    equal(run(testCreateDate(), 'isThisYear'), true, 'isThisYear should be true for today in other locales');
    equal(run(testCreateDate('1 year ago', 'en'), 'isLastYear'), true, 'isLastYear should be true for last year in other locales');
    equal(run(testCreateDate('1 year from now', 'en'), 'isNextYear'), true, 'isNextYear should be true for next year in other locales');

    // Issue #548 - Ordinal 1st

    equal(testCreateDate('1er septembre'), new Date(now.getFullYear(), 8, 1), '1er septembre');
    equal(testCreateDate('2 septembre'), new Date(now.getFullYear(), 8, 2), '2 septembre');

  });

  method('format', function() {

    test(then, '5 janvier 2010 15:52', 'default format');

    assertFormatShortcut(then, 'short', '05/01/2010');
    assertFormatShortcut(then, 'medium', '5 janvier 2010');
    assertFormatShortcut(then, 'long', '5 janvier 2010 15:52');
    assertFormatShortcut(then, 'full', 'mardi 5 janvier 2010 15:52');
    test(then, ['{time}'], '15:52', 'preferred time');
    test(then, ['{stamp}'], 'mar 5 janv 2010 15:52', 'preferred stamp');
    test(then, ['%c'], 'mar 5 janv 2010 15:52', '%c stamp');

    test(new Date('January 3, 2010'), ['{w}'], '53', 'locale week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{ww}'], '53', 'locale week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{wo}'], '53rd', 'locale week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{w}'], '1', 'locale week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{ww}'], '01', 'locale week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{wo}'], '1st', 'locale week number ordinal | Jan 4 2010');

    test(new Date(2015, 10, 8),  ['{Dow}'], 'dim', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], 'lun', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], 'mar', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], 'mer', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], 'jeu', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], 'ven', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], 'sam', 'Sat');

    test(new Date(2015, 0, 1),  ['{Mon}'], 'janv', 'Jan');
    test(new Date(2015, 1, 1),  ['{Mon}'], 'févr', 'Feb');
    test(new Date(2015, 2, 1),  ['{Mon}'], 'mars', 'Mar');
    test(new Date(2015, 3, 1),  ['{Mon}'], 'avr', 'Apr');
    test(new Date(2015, 4, 1),  ['{Mon}'], 'mai', 'May');
    test(new Date(2015, 5, 1),  ['{Mon}'], 'juin', 'Jun');
    test(new Date(2015, 6, 1),  ['{Mon}'], 'juil', 'Jul');
    test(new Date(2015, 7, 1),  ['{Mon}'], 'août', 'Aug');
    test(new Date(2015, 8, 1),  ['{Mon}'], 'sept', 'Sep');
    test(new Date(2015, 9, 1),  ['{Mon}'], 'oct', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], 'nov', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], 'déc', 'Dec');

  });

  method('relative', function() {
    assertRelative('1 second ago', 'il y a 1 seconde');
    assertRelative('1 minute ago', 'il y a 1 minute');
    assertRelative('1 hour ago',   'il y a 1 heure');
    assertRelative('1 day ago',    'il y a 1 jour');
    assertRelative('1 week ago',   'il y a 1 semaine');
    assertRelative('1 month ago',  'il y a 1 mois');
    assertRelative('1 year ago',   'il y a 1 an');

    assertRelative('2 seconds ago', 'il y a 2 secondes');
    assertRelative('2 minutes ago', 'il y a 2 minutes');
    assertRelative('2 hours ago',   'il y a 2 heures');
    assertRelative('2 days ago',    'il y a 2 jours');
    assertRelative('2 weeks ago',   'il y a 2 semaines');
    assertRelative('2 months ago',  'il y a 2 mois');
    assertRelative('2 years ago',   'il y a 2 ans');

    assertRelative('1 second from now', 'dans 1 seconde');
    assertRelative('1 minute from now', 'dans 1 minute');
    assertRelative('1 hour from now',   'dans 1 heure');
    assertRelative('1 day from now',    'dans 1 jour');
    assertRelative('1 week from now',   'dans 1 semaine');
    assertRelative('1 year from now',   'dans 1 an');

    assertRelative('5 second from now', 'dans 5 secondes');
    assertRelative('5 minute from now', 'dans 5 minutes');
    assertRelative('5 hour from now',   'dans 5 heures');
    assertRelative('5 day from now',    'dans 5 jours');
    assertRelative('5 week from now',   'dans 1 mois');
    assertRelative('5 year from now',   'dans 5 ans');
  });

  method('beginning/end', function() {
    equal(dateRun(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(dateRun(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });


});

namespace('Number | French', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['fr'], '5 heures', 'simple duration');
  });

});

