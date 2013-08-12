test('Dates | German', function () {

  var now = new Date();
  var then = new Date(2011, 7, 25, 15, 45, 50);
  Date.setLocale('de');

  dateEqual(Date.create('15. Mai 2011'), new Date(2011, 4, 15), 'Date#create | basic German date');
  dateEqual(Date.create('Dienstag, 5. Januar 2012'), new Date(2012, 0, 5), 'Date#create | German | 2012-01-05');
  dateEqual(Date.create('Mai 2011'), new Date(2011, 4), 'Date#create | German | year and month');
  dateEqual(Date.create('15. Mai'), new Date(now.getFullYear(), 4, 15), 'Date#create | German | month and date');
  dateEqual(Date.create('2011'), new Date(2011, 0), 'Date#create | German | year');

  dateEqual(Date.create('Dienstag, 5. Januar 2012 3:45'), new Date(2012, 0, 5, 3, 45), 'Date#create | German | 2012-01-05 3:45');
  dateEqual(Date.create('Dienstag, 5. Januar 2012 3:45pm'), new Date(2012, 0, 5, 15, 45), 'Date#create | German | 2012-01-05 3:45pm');

  dateEqual(Date.create('Januar'), new Date(now.getFullYear(), 0), 'Date#create | German | January');
  dateEqual(Date.create('Februar'), new Date(now.getFullYear(), 1), 'Date#create | German | February');
  dateEqual(Date.create('Marz'), new Date(now.getFullYear(), 2), 'Date#create | German | March');
  dateEqual(Date.create('März'), new Date(now.getFullYear(), 2), 'Date#create | German | March');
  dateEqual(Date.create('April'), new Date(now.getFullYear(), 3), 'Date#create | German | April');
  dateEqual(Date.create('Mai'), new Date(now.getFullYear(), 4), 'Date#create | German | May');
  dateEqual(Date.create('Juni'), new Date(now.getFullYear(), 5), 'Date#create | German | June');
  dateEqual(Date.create('Juli'), new Date(now.getFullYear(), 6), 'Date#create | German | July');
  dateEqual(Date.create('August'), new Date(now.getFullYear(), 7), 'Date#create | German | August');
  dateEqual(Date.create('September'), new Date(now.getFullYear(), 8), 'Date#create | German | September');
  dateEqual(Date.create('Oktober'), new Date(now.getFullYear(), 9), 'Date#create | German | October');
  dateEqual(Date.create('November'), new Date(now.getFullYear(), 10), 'Date#create | German | November');
  dateEqual(Date.create('Dezember'), new Date(now.getFullYear(), 11), 'Date#create | German | December');


  dateEqual(Date.create('Sonntag'), getDateWithWeekdayAndOffset(0), 'Date#create | German | Sunday');
  dateEqual(Date.create('Montag'), getDateWithWeekdayAndOffset(1), 'Date#create | German | Monday');
  dateEqual(Date.create('Dienstag'), getDateWithWeekdayAndOffset(2), 'Date#create | German | Tuesday');
  dateEqual(Date.create('Mittwoch'), getDateWithWeekdayAndOffset(3), 'Date#create | German | Wednesday');
  dateEqual(Date.create('Donnerstag'), getDateWithWeekdayAndOffset(4), 'Date#create | German | Thursday');
  dateEqual(Date.create('Freitag'), getDateWithWeekdayAndOffset(5), 'Date#create | German | Friday');
  dateEqual(Date.create('Samstag'), getDateWithWeekdayAndOffset(6), 'Date#create | German | Saturday');

  dateEqual(Date.create('einer Millisekunde vorher'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | German | one millisecond ago');
  dateEqual(Date.create('eine Sekunde vorher'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | German | one second ago');
  dateEqual(Date.create('einer Minute vorher'), getRelativeDate(null, null, null, null, -1), 'Date#create | German | one minute ago');
  dateEqual(Date.create('einer Stunde vorher'), getRelativeDate(null, null, null, -1), 'Date#create | German | one hour ago');
  dateEqual(Date.create('einen Tag vorher'), getRelativeDate(null, null, -1), 'Date#create | German | one day ago');
  dateEqual(Date.create('eine Woche vorher'), getRelativeDate(null, null, -7), 'Date#create | German | one week ago');
  dateEqual(Date.create('einen Monat vorher'), getRelativeDate(null, -1), 'Date#create | German | one month ago');
  dateEqual(Date.create('ein Jahr vorher'), getRelativeDate(-1), 'Date#create | German | one year ago');

  dateEqual(Date.create('vor einer Millisekunde'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | German reversed | one millisecond ago');
  dateEqual(Date.create('vor einer Sekunde'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | German reversed | one second ago');
  dateEqual(Date.create('vor einer Minute'), getRelativeDate(null, null, null, null, -1), 'Date#create | German reversed | one minute ago');
  dateEqual(Date.create('vor einer Stunde'), getRelativeDate(null, null, null, -1), 'Date#create | German reversed | one hour ago');
  dateEqual(Date.create('vor einem Tag'), getRelativeDate(null, null, -1), 'Date#create | German reversed | one day ago');
  dateEqual(Date.create('vor einer Woche'), getRelativeDate(null, null, -7), 'Date#create | German reversed | one week ago');
  dateEqual(Date.create('vor einem Monat'), getRelativeDate(null, -1), 'Date#create | German reversed | one month ago');
  dateEqual(Date.create('vor einem Jahr'), getRelativeDate(-1), 'Date#create | German reversed | one year ago');


  dateEqual(Date.create('in 5 Millisekunden'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | German | dans | five milliseconds from now');
  dateEqual(Date.create('in 5 Sekunden'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | German | dans | five second from now');
  dateEqual(Date.create('in 5 Minuten'), getRelativeDate(null, null, null, null, 5), 'Date#create | German | dans | five minute from now');
  dateEqual(Date.create('in 5 Stunden'), getRelativeDate(null, null, null, 5), 'Date#create | German | dans | five hour from now');
  dateEqual(Date.create('in 5 Tagen'), getRelativeDate(null, null, 5), 'Date#create | German | dans | five day from now');
  dateEqual(Date.create('in 5 Wochen'), getRelativeDate(null, null, 35), 'Date#create | German | dans | five weeks from now');
  dateEqual(Date.create('in 5 Monaten'), getRelativeDate(null, 5), 'Date#create | German | dans | five months from now');
  dateEqual(Date.create('in 5 Jahren'), getRelativeDate(5), 'Date#create | German | dans | five years from now');


  dateEqual(Date.create('vorgestern'), getRelativeDate(null, null, -2).reset(), 'Date#create | German | day before yesterday');
  dateEqual(Date.create('gestern'), getRelativeDate(null, null, -1).reset(), 'Date#create | German | yesterday');
  dateEqual(Date.create('heute'), getRelativeDate(null, null, 0).reset(), 'Date#create | German | today');
  dateEqual(Date.create('morgen'), getRelativeDate(null, null, 1).reset(), 'Date#create | German | tomorrow');
  dateEqual(Date.create('übermorgen'), getRelativeDate(null, null, 2).reset(), 'Date#create | German | day after tomorrow');

  dateEqual(Date.create('letzte Woche'), getRelativeDate(null, null, -7), 'Date#create | German | Last week');
  dateEqual(Date.create('nächste Woche'), getRelativeDate(null, null, 7), 'Date#create | German | Next week');

  dateEqual(Date.create('letzter Monat'), getRelativeDate(null, -1), 'Date#create | German | last month letzter');
  dateEqual(Date.create('letzten Monat'), getRelativeDate(null, -1), 'Date#create | German | last month letzten');
  dateEqual(Date.create('nächster Monat'), getRelativeDate(null, 1), 'Date#create | German | Next month nachster');
  dateEqual(Date.create('nächsten Monat'), getRelativeDate(null, 1), 'Date#create | German | Next month nachsten');

  dateEqual(Date.create('letztes Jahr'), getRelativeDate(-1), 'Date#create | German | Last year');
  dateEqual(Date.create('nächstes Jahr'), getRelativeDate(1), 'Date#create | German | Next year');


  dateEqual(Date.create('kommenden Montag'), getDateWithWeekdayAndOffset(1, 7), 'Date#create | German | kommenden Montag');
  dateEqual(Date.create('nächster Montag'), getDateWithWeekdayAndOffset(1, 7), 'Date#create | German | next monday');
  dateEqual(Date.create('letztes Montag'), getDateWithWeekdayAndOffset(1, -7), 'Date#create | German | last monday');

  dateEqual(Date.create('letztes Montag 3:45'), getDateWithWeekdayAndOffset(1, -7).set({ hour: 3, minute: 45 }, true), 'Date#create | German | last monday 3:45');

  // no accents
  dateEqual(Date.create('ubermorgen'), getRelativeDate(null, null, 2).reset(), 'Date#create | German (no accents) | day after tomorrow');
  dateEqual(Date.create('naechster Monat'), getRelativeDate(null, 1), 'Date#create | German (no accents) | Next month nachster');
  dateEqual(Date.create('uebermorgen'), getRelativeDate(null, null, 2).reset(), 'Date#create | German | day after tomorrow');
  dateEqual(Date.create('naechster Monat'), getRelativeDate(null, 1), 'Date#create | German | Next month nachster');
  dateEqual(Date.create('naechsten Monat'), getRelativeDate(null, 1), 'Date#create | German | Next month nachsten');
  dateEqual(Date.create('naechstes Jahr'), getRelativeDate(1), 'Date#create | German | Next year');


  equal(then.format(), '25. August 2011 15:45', 'Date#create | German | format');
  equal(then.format('{dd} {Month} {yyyy}'), '25 August 2011', 'Date#create | German | format');

  // Format shortcuts
  equal(then.format('long'), '25. August 2011 15:45', 'Date#create | German | long format');
  equal(then.long(), '25. August 2011 15:45', 'Date#create | German | long shortcut');
  equal(then.format('full'), 'Donnerstag 25. August 2011 15:45:50', 'Date#create | German | full format');
  equal(then.full(), 'Donnerstag 25. August 2011 15:45:50', 'Date#create | German | full shortcut');
  equal(then.format('short'), '25. August 2011', 'Date#create | German | short format');
  equal(then.short(), '25. August 2011', 'Date#create | German | short shortcut');


  equal(Date.create('1 second ago', 'en').relative(), 'vor 1 Sekunde', 'Date#create | German | relative format past');
  equal(Date.create('1 minute ago', 'en').relative(), 'vor 1 Minute',  'Date#create | German | relative format past');
  equal(Date.create('1 hour ago', 'en').relative(),   'vor 1 Stunde',     'Date#create | German | relative format past');
  equal(Date.create('1 day ago', 'en').relative(),    'vor 1 Tag',    'Date#create | German | relative format past');
  equal(Date.create('1 week ago', 'en').relative(),   'vor 1 Woche',  'Date#create | German | relative format past');
  equal(Date.create('1 month ago', 'en').relative(),  'vor 1 Monat',   'Date#create | German | relative format past');
  equal(Date.create('1 year ago', 'en').relative(),   'vor 1 Jahr',     'Date#create | German | relative format past');

  equal(Date.create('5 seconds ago', 'en').relative(), 'vor 5 Sekunden', 'Date#create | German | relative format past');
  equal(Date.create('5 minutes ago', 'en').relative(), 'vor 5 Minuten',  'Date#create | German | relative format past');
  equal(Date.create('5 hours ago', 'en').relative(),   'vor 5 Stunden',     'Date#create | German | relative format past');
  equal(Date.create('5 days ago', 'en').relative(),    'vor 5 Tagen',    'Date#create | German | relative format past');
  equal(Date.create('5 weeks ago', 'en').relative(),   'vor 1 Monat',  'Date#create | German | relative format past');
  equal(Date.create('5 months ago', 'en').relative(),  'vor 5 Monaten',   'Date#create | German | relative format past');
  equal(Date.create('5 years ago', 'en').relative(),   'vor 5 Jahren',     'Date#create | German | relative format past');

  equal(Date.create('1 second from now', 'en').relative(), 'in 1 Sekunde', 'Date#create | German | relative format future');
  equal(Date.create('1 minute from now', 'en').relative(), 'in 1 Minute',  'Date#create | German | relative format future');
  equal(Date.create('1 hour from now', 'en').relative(),   'in 1 Stunde',     'Date#create | German | relative format future');
  equal(Date.create('1 day from now', 'en').relative(),    'in 1 Tag',    'Date#create | German | relative format future');
  equal(Date.create('1 week from now', 'en').relative(),   'in 1 Woche',  'Date#create | German | relative format future');
  equal(Date.create('1 month from now', 'en').relative(),  'in 1 Monat',   'Date#create | German | relative format future');
  equal(Date.create('1 year from now', 'en').relative(),   'in 1 Jahr',     'Date#create | German | relative format future');

  equal(Date.create('5 second from now', 'en').relative(), 'in 5 Sekunden', 'Date#create | German | relative format future');
  equal(Date.create('5 minutes from now', 'en').relative(),'in 5 Minuten',  'Date#create | German | relative format future');
  equal(Date.create('5 hour from now', 'en').relative(),   'in 5 Stunden',     'Date#create | German | relative format future');
  equal(Date.create('5 day from now', 'en').relative(),    'in 5 Tagen',    'Date#create | German | relative format future');
  equal(Date.create('5 week from now', 'en').relative(),   'in 1 Monat',  'Date#create | German | relative format future');
  equal(Date.create('5 month from now', 'en').relative(),  'in 5 Monaten',   'Date#create | German | relative format future');
  equal(Date.create('5 year from now', 'en').relative(),   'in 5 Jahren',     'Date#create | German | relative format future');

  dateEqual(Date.create('3:45 15. Mai 2011'), new Date(2011, 4, 15, 3, 45), 'Date#create | time first format');

  dateEqual(Date.create('morgen um 3:30'), getRelativeDate(null, null, 1).set({hours:3,minutes:30}, true), 'Date#create | German | tomorrow at 3:30');

  equal((5).hours().duration('de'), '5 Stunden', 'Date#create | German | simple duration');

});
