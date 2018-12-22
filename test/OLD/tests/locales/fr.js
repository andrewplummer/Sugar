namespace('Date | French', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('fr');
  });

  method('create', function() {

    assertDateParsed('Le 15 mai 2011', new Date(2011, 4, 15));
    assertDateParsed('Le 5 janvier 2012', new Date(2012, 0, 5));
    assertDateParsed('mai 2011', new Date(2011, 4));
    assertDateParsed('Le 15 mai', new Date(now.getFullYear(), 4, 15));
    assertDateParsed('2011', new Date(2011, 0));
    assertDateParsed('02 févr. 2016', new Date(2016, 1, 2));
    assertDateParsed('février 2016',   new Date(2016, 1));

    assertDateParsed('Le 5 janvier 2012 3:45', new Date(2012, 0, 5, 3, 45));
    assertDateParsed('Le 5 janvier 2012 3:45pm', new Date(2012, 0, 5, 15, 45));

    assertDateParsed('janvier',   new Date(now.getFullYear(), 0));
    assertDateParsed('février',   new Date(now.getFullYear(), 1));
    assertDateParsed('fevrier',   new Date(now.getFullYear(), 1));
    assertDateParsed('mars',      new Date(now.getFullYear(), 2));
    assertDateParsed('avril',     new Date(now.getFullYear(), 3));
    assertDateParsed('mai',       new Date(now.getFullYear(), 4));
    assertDateParsed('juin',      new Date(now.getFullYear(), 5));
    assertDateParsed('juillet',   new Date(now.getFullYear(), 6));
    assertDateParsed('août',      new Date(now.getFullYear(), 7));
    assertDateParsed('septembre', new Date(now.getFullYear(), 8));
    assertDateParsed('octobre',   new Date(now.getFullYear(), 9));
    assertDateParsed('novembre',  new Date(now.getFullYear(), 10));
    assertDateParsed('décembre',  new Date(now.getFullYear(), 11));
    assertDateParsed('decembre',  new Date(now.getFullYear(), 11));

    assertDateParsed('dimanche', testGetWeekday(0));
    assertDateParsed('lundi',    testGetWeekday(1));
    assertDateParsed('mardi',    testGetWeekday(2));
    assertDateParsed('mercredi', testGetWeekday(3));
    assertDateParsed('jeudi',    testGetWeekday(4));
    assertDateParsed('vendredi', testGetWeekday(5));
    assertDateParsed('samedi',   testGetWeekday(6));


    assertDateParsed('il y a une milliseconde', getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('il y a une seconde',      getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('il y a une minute',       getRelativeDate(0,0,0,0,-1));
    assertDateParsed('il y a une heure',        getRelativeDate(0,0,0,-1));
    assertDateParsed('il y a un jour',          getRelativeDate(0,0,-1));
    assertDateParsed('il y a une semaine',      getRelativeDate(0,0,-7));
    assertDateParsed('il y a un mois',          getRelativeDate(0,-1));
    assertDateParsed('il y a un an',            getRelativeDate(-1));


    assertDateParsed('dans 5 millisecondes', getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed('dans 5 secondes',      getRelativeDate(0,0,0,0,0,5));
    assertDateParsed('dans 5 minutes',       getRelativeDate(0,0,0,0,5));
    assertDateParsed('dans 5 heures',        getRelativeDate(0,0,0,5));
    assertDateParsed('dans 5 jours',         getRelativeDate(0,0,5));
    assertDateParsed('dans 5 semaines',      getRelativeDate(0,0,35));
    assertDateParsed('dans 5 mois',          getRelativeDate(0,5));
    assertDateParsed('dans 5 ans',           getRelativeDate(5));

    assertDateParsed("d'ici 5 millisecondes", getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed("d'ici 5 secondes",      getRelativeDate(0,0,0,0,0,5));
    assertDateParsed("d'ici 5 minutes",       getRelativeDate(0,0,0,0,5));
    assertDateParsed("d'ici 5 heures",        getRelativeDate(0,0,0,5));
    assertDateParsed("d'ici 5 jours",         getRelativeDate(0,0,5));
    assertDateParsed("d'ici 5 semaines",      getRelativeDate(0,0,35));
    assertDateParsed("d'ici 5 mois",          getRelativeDate(0,5));
    assertDateParsed("d'ici 5 ans",           getRelativeDate(5));

    assertDateParsed('hier',        getRelativeDateReset(0,0,-1));
    assertDateParsed("aujourd'hui", getRelativeDateReset(0,0,0));
    assertDateParsed('demain',      getRelativeDateReset(0,0,1));

    assertDateParsed('la semaine dernière',  getRelativeDate(0,0,-7));
    assertDateParsed('la semaine prochaine', getRelativeDate(0,0,7));

    assertDateParsed('le mois dernier',  getRelativeDate(0,-1));
    assertDateParsed('le mois prochain', getRelativeDate(0,1));

    assertDateParsed("l'année dernière",  getRelativeDate(-1));
    assertDateParsed("l'année prochaine", getRelativeDate(1));

    // no accents
    assertDateParsed('la semaine derniere', getRelativeDate(0,0,-7));
    assertDateParsed("l'annee prochaine",   getRelativeDate(1));

    assertDateParsed('lundi prochain', testGetWeekday(1, 1));
    assertDateParsed('lundi dernièr',  testGetWeekday(1,-1));

    assertDateParsed('lundi dernièr 3:45', testGetWeekday(1, -1, 3, 45));

    assertDateParsed('17:32 15 mai', new Date(now.getFullYear(), 4, 15, 17, 32));
    assertDateParsed('17:32 lundi prochain', testGetWeekday(1, 1, 17, 32));

    assertDateParsed('demain à 3:30', testDateSet(getRelativeDateReset(0,0,1), {hour:3,minute:30}));


    // Numbers

    assertDateParsed('il y a zéro ans',   getRelativeDate(0));
    assertDateParsed('il y a un an',      getRelativeDate(-1));
    assertDateParsed('il y a deux ans',   getRelativeDate(-2));
    assertDateParsed('il y a trois ans',  getRelativeDate(-3));
    assertDateParsed('il y a quatre ans', getRelativeDate(-4));
    assertDateParsed('il y a cinq ans',   getRelativeDate(-5));
    assertDateParsed('il y a six ans',    getRelativeDate(-6));
    assertDateParsed('il y a sept ans',   getRelativeDate(-7));
    assertDateParsed('il y a huit ans',   getRelativeDate(-8));
    assertDateParsed('il y a neuf ans',   getRelativeDate(-9));
    assertDateParsed('il y a dix ans',    getRelativeDate(-10));


    // Issue #249

    assertDateParsed('mardi 11 decembre 2012', 'fr', new Date(2012, 11, 11));

    equal(run(testCreateDate('today', 'en'),           'isThisWeek'), true, 'today is this week');
    equal(run(testCreateDate('1 week ago', 'en'),      'isLastWeek'), true, '1 week ago is last week');
    equal(run(testCreateDate('1 week from now', 'en'), 'isNextWeek'), true, '1 week from now is next week');

    equal(run(testCreateDate('today', 'en'),            'isThisMonth'), true, 'today is this month');
    equal(run(testCreateDate('1 month ago', 'en'),      'isLastMonth'), true, '1 month ago is last month');
    equal(run(testCreateDate('1 month from now', 'en'), 'isNextMonth'), true, '1 month from now is next month');

    equal(run(testCreateDate('today', 'en'),           'isThisYear'), true, 'today is this year');
    equal(run(testCreateDate('1 year ago', 'en'),      'isLastYear'), true, '1 year ago is last year');
    equal(run(testCreateDate('1 year from now', 'en'), 'isNextYear'), true, '1 year from now is next year');

    // Issue #548 - Ordinal 1st

    assertDateParsed('1er septembre', new Date(now.getFullYear(), 8, 1));
    assertDateParsed('2 septembre', new Date(now.getFullYear(), 8, 2));

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
    equal(run(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(run(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });


});

namespace('Number | French', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['fr'], '5 heures', 'simple duration');
  });

});

