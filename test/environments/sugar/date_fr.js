package('Date | French', function () {

  var now = new Date();
  testSetLocale('fr');


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
    var then = new Date(2011, 7, 25, 15, 45, 50);
    test(then, '25 août 2011 15:45', 'standard format');
    test(then, ['{dd} {month} {yyyy}'], '25 août 2011', 'format');

    // Format shortcuts
    equal(run(then, 'format', ['long']), '25 août 2011 15:45', 'long format');
    equal(run(then, 'long'), '25 août 2011 15:45', 'long shortcut');
    equal(run(then, 'format', ['full']), 'Jeudi 25 août 2011 15:45:50', 'full format');
    equal(run(then, 'full'), 'Jeudi 25 août 2011 15:45:50', 'full format');
    equal(run(then, 'format', ['short']), '25 août 2011', 'short format');
    equal(run(then, 'short'), '25 août 2011', 'short shortcut');

  });

  method('relative', function() {
    test(testCreateDate('1 second ago', 'en'), 'il y a 1 seconde');
    test(testCreateDate('1 minute ago', 'en'), 'il y a 1 minute');
    test(testCreateDate('1 hour ago', 'en'),   'il y a 1 heure');
    test(testCreateDate('1 day ago', 'en'),    'il y a 1 jour');
    test(testCreateDate('1 week ago', 'en'),   'il y a 1 semaine');
    test(testCreateDate('1 month ago', 'en'),  'il y a 1 mois');
    test(testCreateDate('1 year ago', 'en'),   'il y a 1 an');

    test(testCreateDate('2 seconds ago', 'en'), 'il y a 2 secondes');
    test(testCreateDate('2 minutes ago', 'en'), 'il y a 2 minutes');
    test(testCreateDate('2 hours ago', 'en'),   'il y a 2 heures');
    test(testCreateDate('2 days ago', 'en'),    'il y a 2 jours');
    test(testCreateDate('2 weeks ago', 'en'),   'il y a 2 semaines');
    test(testCreateDate('2 months ago', 'en'),  'il y a 2 mois');
    test(testCreateDate('2 years ago', 'en'),   'il y a 2 ans');

    test(testCreateDate('1 second from now', 'en'), 'dans 1 seconde');
    test(testCreateDate('1 minute from now', 'en'), 'dans 1 minute');
    test(testCreateDate('1 hour from now', 'en'),   'dans 1 heure');
    test(testCreateDate('1 day from now', 'en'),    'dans 1 jour');
    test(testCreateDate('1 week from now', 'en'),   'dans 1 semaine');
    testMonthsFromNow(1, 'dans 1 mois', 'dans 4 semaines');
    test(testCreateDate('1 year from now', 'en'),   'dans 1 an');

    test(testCreateDate('5 second from now', 'en'), 'dans 5 secondes');
    test(testCreateDate('5 minute from now', 'en'), 'dans 5 minutes');
    test(testCreateDate('5 hour from now', 'en'),   'dans 5 heures');
    test(testCreateDate('5 day from now', 'en'),    'dans 5 jours');
    test(testCreateDate('5 week from now', 'en'),   'dans 1 mois');
    testMonthsFromNow(5, 'dans 5 mois', 'dans 4 mois');
    test(testCreateDate('5 year from now', 'en'),   'dans 5 ans');
  });


});

package('Number | French Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['fr'], '5 heures', 'simple duration');
  });

});

