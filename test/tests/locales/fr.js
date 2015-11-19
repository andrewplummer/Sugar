package('Dates French', function () {
  "use strict";

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('fr');
  });

  method('create', function() {

    dateEqual(testCreateDate('Le 15 mai 2011'), new Date(2011, 4, 15), 'basic French date');
    dateEqual(testCreateDate('Le 5 janvier 2012'), new Date(2012, 0, 5), '2012-01-05');
    dateEqual(testCreateDate('mai 2011'), new Date(2011, 4), 'year and month');
    dateEqual(testCreateDate('Le 15 mai'), new Date(now.getFullYear(), 4, 15), 'month and date');
    dateEqual(testCreateDate('2011'), new Date(2011, 0), 'year');

    dateEqual(testCreateDate('Le 5 janvier 2012 3:45'), new Date(2012, 0, 5, 3, 45), '2012-01-05 3:45');
    dateEqual(testCreateDate('Le 5 janvier 2012 3:45pm'), new Date(2012, 0, 5, 15, 45), '2012-01-05 3:45pm');

    dateEqual(testCreateDate('janvier'), new Date(now.getFullYear(), 0), 'January');
    dateEqual(testCreateDate('février'), new Date(now.getFullYear(), 1), 'February');
    dateEqual(testCreateDate('fevrier'), new Date(now.getFullYear(), 1), 'February');
    dateEqual(testCreateDate('mars'), new Date(now.getFullYear(), 2), 'March');
    dateEqual(testCreateDate('avril'), new Date(now.getFullYear(), 3), 'April');
    dateEqual(testCreateDate('mai'), new Date(now.getFullYear(), 4), 'May');
    dateEqual(testCreateDate('juin'), new Date(now.getFullYear(), 5), 'June');
    dateEqual(testCreateDate('juillet'), new Date(now.getFullYear(), 6), 'July');
    dateEqual(testCreateDate('août'), new Date(now.getFullYear(), 7), 'August');
    dateEqual(testCreateDate('septembre'), new Date(now.getFullYear(), 8), 'September');
    dateEqual(testCreateDate('octobre'), new Date(now.getFullYear(), 9), 'October');
    dateEqual(testCreateDate('novembre'), new Date(now.getFullYear(), 10), 'November');
    dateEqual(testCreateDate('décembre'), new Date(now.getFullYear(), 11), 'December');
    dateEqual(testCreateDate('decembre'), new Date(now.getFullYear(), 11), 'December');

    dateEqual(testCreateDate('dimanche'), getDateWithWeekdayAndOffset(0), 'Sunday');
    dateEqual(testCreateDate('lundi'), getDateWithWeekdayAndOffset(1), 'Monday');
    dateEqual(testCreateDate('mardi'), getDateWithWeekdayAndOffset(2), 'Tuesday');
    dateEqual(testCreateDate('mercredi'), getDateWithWeekdayAndOffset(3), 'Wednesday');
    dateEqual(testCreateDate('jeudi'), getDateWithWeekdayAndOffset(4), 'Thursday');
    dateEqual(testCreateDate('vendredi'), getDateWithWeekdayAndOffset(5), 'Friday');
    dateEqual(testCreateDate('samedi'), getDateWithWeekdayAndOffset(6), 'Saturday');


    dateEqual(testCreateDate('il y a une milliseconde'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('il y a une seconde'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('il y a une minute'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    dateEqual(testCreateDate('il y a une heure'), getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('il y a un jour'), getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('il y a une semaine'), getRelativeDate(null, null, -7), 'one week');
    dateEqual(testCreateDate('il y a un mois'), getRelativeDate(null, -1), 'one month ago');
    dateEqual(testCreateDate('il y a un an'), getRelativeDate(-1), 'one year ago');


    dateEqual(testCreateDate('dans 5 millisecondes'), getRelativeDate(null, null, null, null, null, null,5), 'dans | five milliseconds from now');
    dateEqual(testCreateDate('dans 5 secondes'), getRelativeDate(null, null, null, null, null, 5), 'dans | five second from now');
    dateEqual(testCreateDate('dans 5 minutes'), getRelativeDate(null, null, null, null, 5), 'dans | five minute from now');
    dateEqual(testCreateDate('dans 5 heures'), getRelativeDate(null, null, null, 5), 'dans | five hour from now');
    dateEqual(testCreateDate('dans 5 jours'), getRelativeDate(null, null, 5), 'dans | five day from now');
    dateEqual(testCreateDate('dans 5 semaines'), getRelativeDate(null, null, 35), 'dans | five weeks from now');
    dateEqual(testCreateDate('dans 5 mois'), getRelativeDate(null, 5), 'dans | five months from now');
    dateEqual(testCreateDate('dans 5 ans'), getRelativeDate(5), 'dans | five years from now');

    dateEqual(testCreateDate("d'ici 5 millisecondes"), getRelativeDate(null, null, null, null, null, null,5), 'dans | five milliseconds from now');
    dateEqual(testCreateDate("d'ici 5 secondes"), getRelativeDate(null, null, null, null, null, 5), 'dans | five second from now');
    dateEqual(testCreateDate("d'ici 5 minutes"), getRelativeDate(null, null, null, null, 5), 'dans | five minute from now');
    dateEqual(testCreateDate("d'ici 5 heures"), getRelativeDate(null, null, null, 5), 'dans | five hour from now');
    dateEqual(testCreateDate("d'ici 5 jours"), getRelativeDate(null, null, 5), 'dans | five day from now');
    dateEqual(testCreateDate("d'ici 5 semaines"), getRelativeDate(null, null, 35), 'dans | five weeks from now');
    dateEqual(testCreateDate("d'ici 5 mois"), getRelativeDate(null, 5), 'dans | five months from now');
    dateEqual(testCreateDate("d'ici 5 ans"), getRelativeDate(5), 'dans | five years from now');

    dateEqual(testCreateDate('hier'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate("aujourd'hui"), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('demain'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');

    dateEqual(testCreateDate('la semaine dernière'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('la semaine prochaine'), getRelativeDate(null, null, 7), 'Next week');

    dateEqual(testCreateDate('le mois dernier'), getRelativeDate(null, -1), 'last month');
    dateEqual(testCreateDate('le mois prochain'), getRelativeDate(null, 1), 'Next month');

    dateEqual(testCreateDate("l'année dernière"), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate("l'année prochaine"), getRelativeDate(1), 'Next year');

    // no accents
    dateEqual(testCreateDate('la semaine derniere'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate("l'annee prochaine"), getRelativeDate(1), 'Next year');

    dateEqual(testCreateDate('lundi prochain'), getDateWithWeekdayAndOffset(1, 7), 'next monday');
    dateEqual(testCreateDate('lundi dernièr'), getDateWithWeekdayAndOffset(1, -7), 'last monday');

    dateEqual(testCreateDate('lundi dernièr 3:45'), run(getDateWithWeekdayAndOffset(1, -7), 'set', [{ hour: 3, minute: 45 }, true]), 'last monday 3:45');

    dateEqual(testCreateDate('demain à 3:30'), run(getRelativeDate(null, null, 1), 'set', [{hours:3,minutes:30}, true]), 'tomorrow at 3:30');

    // Issue #249

    dateEqual(testCreateDate('mardi 11 decembre 2012','fr'), new Date(2012, 11, 11), 'mardi 11 decembre 2012');

    equal(run(testCreateDate(), 'isThisWeek'), true, 'isThisWeek should be true for today in other locales');
    equal(run(testCreateDate('1 week ago', 'en'), 'isLastWeek'), true, 'isLastWeek should be true for last week in other locales');
    equal(run(testCreateDate('1 week from now', 'en'), 'isNextWeek'), true, 'isNextWeek should be true for next week in other locales');

    equal(run(testCreateDate(), 'isThisMonth'), true, 'isThisMonth should be true for today in other locales');
    equal(run(testCreateDate('1 month ago', 'en'), 'isLastMonth'), true, 'isLastMonth should be true for last month in other locales');
    equal(run(testCreateDate('1 month from now', 'en'), 'isNextMonth'), true, 'isNextMonth should be true for next month in other locales');

    equal(run(testCreateDate(), 'isThisYear'), true, 'isThisYear should be true for today in other locales');
    equal(run(testCreateDate('1 year ago', 'en'), 'isLastYear'), true, 'isLastYear should be true for last year in other locales');
    equal(run(testCreateDate('1 year from now', 'en'), 'isNextYear'), true, 'isNextYear should be true for next year in other locales');


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
    dateEqual(dateRun(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    dateEqual(dateRun(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });


});

package('Number | French Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['fr'], '5 heures', 'simple duration');
  });

});

