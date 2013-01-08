test('Dates | French', function () {

  var now = new Date();
  var then = new Date(2011, 7, 25, 15, 45, 50);
  Date.setLocale('fr');


  dateEqual(Date.create('Le 15 mai 2011'), new Date(2011, 4, 15), 'Date#create | basic French date');
  dateEqual(Date.create('Le 5 janvier 2012'), new Date(2012, 0, 5), 'Date#create | French | 2012-01-05');
  dateEqual(Date.create('mai 2011'), new Date(2011, 4), 'Date#create | French | year and month');
  dateEqual(Date.create('Le 15 mai'), new Date(now.getFullYear(), 4, 15), 'Date#create | French | month and date');
  dateEqual(Date.create('2011'), new Date(2011, 0), 'Date#create | French | year');

  dateEqual(Date.create('Le 5 janvier 2012 3:45'), new Date(2012, 0, 5, 3, 45), 'Date#create | French | 2012-01-05 3:45');
  dateEqual(Date.create('Le 5 janvier 2012 3:45pm'), new Date(2012, 0, 5, 15, 45), 'Date#create | French | 2012-01-05 3:45pm');

  dateEqual(Date.create('janvier'), new Date(now.getFullYear(), 0), 'Date#create | French | January');
  dateEqual(Date.create('février'), new Date(now.getFullYear(), 1), 'Date#create | French | February');
  dateEqual(Date.create('fevrier'), new Date(now.getFullYear(), 1), 'Date#create | French | February');
  dateEqual(Date.create('mars'), new Date(now.getFullYear(), 2), 'Date#create | French | March');
  dateEqual(Date.create('avril'), new Date(now.getFullYear(), 3), 'Date#create | French | April');
  dateEqual(Date.create('mai'), new Date(now.getFullYear(), 4), 'Date#create | French | May');
  dateEqual(Date.create('juin'), new Date(now.getFullYear(), 5), 'Date#create | French | June');
  dateEqual(Date.create('juillet'), new Date(now.getFullYear(), 6), 'Date#create | French | July');
  dateEqual(Date.create('août'), new Date(now.getFullYear(), 7), 'Date#create | French | August');
  dateEqual(Date.create('septembre'), new Date(now.getFullYear(), 8), 'Date#create | French | September');
  dateEqual(Date.create('octobre'), new Date(now.getFullYear(), 9), 'Date#create | French | October');
  dateEqual(Date.create('novembre'), new Date(now.getFullYear(), 10), 'Date#create | French | November');
  dateEqual(Date.create('décembre'), new Date(now.getFullYear(), 11), 'Date#create | French | December');
  dateEqual(Date.create('decembre'), new Date(now.getFullYear(), 11), 'Date#create | French | December');

  dateEqual(Date.create('dimanche'), getDateWithWeekdayAndOffset(0), 'Date#create | French | Sunday');
  dateEqual(Date.create('lundi'), getDateWithWeekdayAndOffset(1), 'Date#create | French | Monday');
  dateEqual(Date.create('mardi'), getDateWithWeekdayAndOffset(2), 'Date#create | French | Tuesday');
  dateEqual(Date.create('mercredi'), getDateWithWeekdayAndOffset(3), 'Date#create | French | Wednesday');
  dateEqual(Date.create('jeudi'), getDateWithWeekdayAndOffset(4), 'Date#create | French | Thursday');
  dateEqual(Date.create('vendredi'), getDateWithWeekdayAndOffset(5), 'Date#create | French | Friday');
  dateEqual(Date.create('samedi'), getDateWithWeekdayAndOffset(6), 'Date#create | French | Saturday');


  dateEqual(Date.create('il y a une milliseconde'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | French | one millisecond ago');
  dateEqual(Date.create('il y a une seconde'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | French | one second ago');
  dateEqual(Date.create('il y a une minute'), getRelativeDate(null, null, null, null, -1), 'Date#create | French | one minute ago');
  dateEqual(Date.create('il y a une heure'), getRelativeDate(null, null, null, -1), 'Date#create | French | one hour ago');
  dateEqual(Date.create('il y a un jour'), getRelativeDate(null, null, -1), 'Date#create | French | one day ago');
  dateEqual(Date.create('il y a une semaine'), getRelativeDate(null, null, -7), 'Date#create | French | one week');
  dateEqual(Date.create('il y a un mois'), getRelativeDate(null, -1), 'Date#create | French | one month ago');
  dateEqual(Date.create('il y a un an'), getRelativeDate(-1), 'Date#create | French | one year ago');


  dateEqual(Date.create('dans 5 millisecondes'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | French | dans | five milliseconds from now');
  dateEqual(Date.create('dans 5 secondes'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | French | dans | five second from now');
  dateEqual(Date.create('dans 5 minutes'), getRelativeDate(null, null, null, null, 5), 'Date#create | French | dans | five minute from now');
  dateEqual(Date.create('dans 5 heures'), getRelativeDate(null, null, null, 5), 'Date#create | French | dans | five hour from now');
  dateEqual(Date.create('dans 5 jours'), getRelativeDate(null, null, 5), 'Date#create | French | dans | five day from now');
  dateEqual(Date.create('dans 5 semaines'), getRelativeDate(null, null, 35), 'Date#create | French | dans | five weeks from now');
  dateEqual(Date.create('dans 5 mois'), getRelativeDate(null, 5), 'Date#create | French | dans | five months from now');
  dateEqual(Date.create('dans 5 ans'), getRelativeDate(5), 'Date#create | French | dans | five years from now');

  dateEqual(Date.create("d'ici 5 millisecondes"), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | French | dans | five milliseconds from now');
  dateEqual(Date.create("d'ici 5 secondes"), getRelativeDate(null, null, null, null, null, 5), 'Date#create | French | dans | five second from now');
  dateEqual(Date.create("d'ici 5 minutes"), getRelativeDate(null, null, null, null, 5), 'Date#create | French | dans | five minute from now');
  dateEqual(Date.create("d'ici 5 heures"), getRelativeDate(null, null, null, 5), 'Date#create | French | dans | five hour from now');
  dateEqual(Date.create("d'ici 5 jours"), getRelativeDate(null, null, 5), 'Date#create | French | dans | five day from now');
  dateEqual(Date.create("d'ici 5 semaines"), getRelativeDate(null, null, 35), 'Date#create | French | dans | five weeks from now');
  dateEqual(Date.create("d'ici 5 mois"), getRelativeDate(null, 5), 'Date#create | French | dans | five months from now');
  dateEqual(Date.create("d'ici 5 ans"), getRelativeDate(5), 'Date#create | French | dans | five years from now');

  dateEqual(Date.create('hier'), getRelativeDate(null, null, -1).reset(), 'Date#create | French | yesterday');
  dateEqual(Date.create("aujourd'hui"), getRelativeDate(null, null, 0).reset(), 'Date#create | French | today');
  dateEqual(Date.create('demain'), getRelativeDate(null, null, 1).reset(), 'Date#create | French | tomorrow');

  dateEqual(Date.create('la semaine dernière'), getRelativeDate(null, null, -7), 'Date#create | French | Last week');
  dateEqual(Date.create('la semaine prochaine'), getRelativeDate(null, null, 7), 'Date#create | French | Next week');

  dateEqual(Date.create('le mois dernier'), getRelativeDate(null, -1), 'Date#create | French | last month');
  dateEqual(Date.create('le mois prochain'), getRelativeDate(null, 1), 'Date#create | French | Next month');

  dateEqual(Date.create("l'année dernière"), getRelativeDate(-1), 'Date#create | French | Last year');
  dateEqual(Date.create("l'année prochaine"), getRelativeDate(1), 'Date#create | French | Next year');

  // no accents
  dateEqual(Date.create('la semaine derniere'), getRelativeDate(null, null, -7), 'Date#create | French | Last week');
  dateEqual(Date.create("l'annee prochaine"), getRelativeDate(1), 'Date#create | French | Next year');

  dateEqual(Date.create('lundi prochain'), getDateWithWeekdayAndOffset(1, 7), 'Date#create | French | next monday');
  dateEqual(Date.create('lundi dernièr'), getDateWithWeekdayAndOffset(1, -7), 'Date#create | French | last monday');

  dateEqual(Date.create('lundi dernièr 3:45'), getDateWithWeekdayAndOffset(1, -7).set({ hour: 3, minute: 45 }, true), 'Date#create | French | last monday 3:45');

  equal(then.format(), '25 août 2011 15:45', 'Date#create | French | standard format');
  equal(then.format('{dd} {month} {yyyy}'), '25 août 2011', 'Date#create | French | format');

  // Format shortcuts
  equal(then.format('long'), '25 août 2011 15:45', 'Date#create | French | long format');
  equal(then.long(), '25 août 2011 15:45', 'Date#create | French | long shortcut');
  equal(then.format('full'), 'Jeudi 25 août 2011 15:45:50', 'Date#create | French | full format');
  equal(then.full(), 'Jeudi 25 août 2011 15:45:50', 'Date#create | French | full format');
  equal(then.format('short'), '25 août 2011', 'Date#create | French | short format');
  equal(then.short(), '25 août 2011', 'Date#create | French | short shortcut');

  equal(Date.create('1 second ago', 'en').relative(), 'il y a 1 seconde', 'Date#create | French | relative format past');
  equal(Date.create('1 minute ago', 'en').relative(), 'il y a 1 minute',  'Date#create | French | relative format past');
  equal(Date.create('1 hour ago', 'en').relative(),   'il y a 1 heure',     'Date#create | French | relative format past');
  equal(Date.create('1 day ago', 'en').relative(),    'il y a 1 jour',    'Date#create | French | relative format past');
  equal(Date.create('1 week ago', 'en').relative(),   'il y a 1 semaine',  'Date#create | French | relative format past');
  equal(Date.create('1 month ago', 'en').relative(),  'il y a 1 mois',   'Date#create | French | relative format past');
  equal(Date.create('1 year ago', 'en').relative(),   'il y a 1 an',     'Date#create | French | relative format past');

  equal(Date.create('2 seconds ago', 'en').relative(), 'il y a 2 secondes', 'Date#create | French | relative format past');
  equal(Date.create('2 minutes ago', 'en').relative(), 'il y a 2 minutes',  'Date#create | French | relative format past');
  equal(Date.create('2 hours ago', 'en').relative(),   'il y a 2 heures',     'Date#create | French | relative format past');
  equal(Date.create('2 days ago', 'en').relative(),    'il y a 2 jours',    'Date#create | French | relative format past');
  equal(Date.create('2 weeks ago', 'en').relative(),   'il y a 2 semaines',  'Date#create | French | relative format past');
  equal(Date.create('2 months ago', 'en').relative(),  'il y a 2 mois',   'Date#create | French | relative format past');
  equal(Date.create('2 years ago', 'en').relative(),   'il y a 2 ans',     'Date#create | French | relative format past');

  equal(Date.create('1 second from now', 'en').relative(), 'dans 1 seconde', 'Date#create | French | relative format future');
  equal(Date.create('1 minute from now', 'en').relative(), 'dans 1 minute',  'Date#create | French | relative format future');
  equal(Date.create('1 hour from now', 'en').relative(),   'dans 1 heure',     'Date#create | French | relative format future');
  equal(Date.create('1 day from now', 'en').relative(),    'dans 1 jour',    'Date#create | French | relative format future');
  equal(Date.create('1 week from now', 'en').relative(),   'dans 1 semaine',  'Date#create | French | relative format future');
  equal(Date.create('1 month from now', 'en').relative(),  'dans 1 mois',   'Date#create | French | relative format future');
  equal(Date.create('1 year from now', 'en').relative(),   'dans 1 an',     'Date#create | French | relative format future');

  equal(Date.create('5 second from now', 'en').relative(), 'dans 5 secondes', 'Date#create | French | relative format future');
  equal(Date.create('5 minute from now', 'en').relative(), 'dans 5 minutes',  'Date#create | French | relative format future');
  equal(Date.create('5 hour from now', 'en').relative(),   'dans 5 heures',     'Date#create | French | relative format future');
  equal(Date.create('5 day from now', 'en').relative(),    'dans 5 jours',    'Date#create | French | relative format future');
  equal(Date.create('5 week from now', 'en').relative(),   'dans 1 mois',  'Date#create | French | relative format future');
  equal(Date.create('5 month from now', 'en').relative(),  'dans 5 mois',   'Date#create | French | relative format future');
  equal(Date.create('5 year from now', 'en').relative(),   'dans 5 ans',     'Date#create | French | relative format future');

  dateEqual(Date.create('demain à 3:30'), getRelativeDate(null, null, 1).set({hours:3,minutes:30}, true), 'Date#create | French | tomorrow at 3:30');

  equal((5).hours().duration('fr'), '5 heures', 'Date#create | French | simple duration');


  // Issue #249

  dateEqual(Date.create('mardi 11 decembre 2012','fr'), new Date(2012, 11, 11), 'Date#create | French | mardi 11 decembre 2012');

});
