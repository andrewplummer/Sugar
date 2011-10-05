test('Dates | German', function () {

  var now = new Date();
  Date.setLanguage('de');



* 2 days after monday   = 2 Tage nach Montag
* 2 weeks from monday  = 2 Wochen von Montag
* last wednesday   = letzten Mittwoch (could be "letzter" with 'r' depending on context)
* next friday    = kommender / naechster Freitag (could be kommenden/naechsten with n depending on context)
* this week tuesday   = diese Woche Dienstag (ok when spoken, usually it is "Dienstag dieser Woche")
* monday of this week  = diesen Montag / Montag dieser Woche 
* May 25th of this year  = 25. Mai diesen Jahres
* the first day of the month  = der erste Tag des Monats
* the last day of March  = der letzte Tag des Maerz ("im" Maerz is Ok too)
* the 23rd of last month  = der 23te im letzten Monat
* the beginning of this week  = der Anfang dieser Woche
* the end of next month  = das Ende naechsten Monats





  dateEqual(Date.create('15. Mai 2011'), new Date(2011, 4, 15), 'Date#create | basic German date');
  dateEqual(Date.create('Dienstag, 5. Januar 2012'), new Date(2012, 0, 5), 'Date#create | German | 2012-01-05');
  dateEqual(Date.create('Mai 2011'), new Date(2011, 4), 'Date#create | German | year and month');
  dateEqual(Date.create('15. Mai'), new Date(now.getFullYear(), 4, 15), 'Date#create | German | month and date');
  dateEqual(Date.create('2011'), new Date(2011, 0), 'Date#create | German | year');
  dateEqual(Date.create('Mai'), new Date(now.getFullYear(), 4), 'Date#create | German | month');
  dateEqual(Date.create('Montag'), getDateWithWeekdayAndOffset(1), 'Date#create | German | Monday');


  dateEqual(Date.create('einer Millisekunde vor'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | German | one millisecond ago');
  dateEqual(Date.create('eine Sekunde vor'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | German | one second ago');
  dateEqual(Date.create('einer Minute vor'), getRelativeDate(null, null, null, null, -1), 'Date#create | German | one minute ago');
  dateEqual(Date.create('einer Stunde vor'), getRelativeDate(null, null, null, -1), 'Date#create | German | one hour ago');
  dateEqual(Date.create('einem Tag vor'), getRelativeDate(null, null, -1), 'Date#create | German | one day ago');
  dateEqual(Date.create('einer Woche vor'), getRelativeDate(null, null, -7), 'Date#create | German | one week ago');
  dateEqual(Date.create('einem Monat vor'), getRelativeDate(null, -1), 'Date#create | German | one month ago');
  dateEqual(Date.create('einem Jahr vor'), getRelativeDate(-1), 'Date#create | German | one year ago');

  dateEqual(Date.create('vor einer Millisekunde'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | German reversed | one millisecond ago');
  dateEqual(Date.create('vor eine Sekunde'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | German reversed | one second ago');
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


  dateEqual(Date.create('vorgestern'), getRelativeDate(null, null, -2).resetTime(), 'Date#create | German | day before yesterday');
  dateEqual(Date.create('gestern'), getRelativeDate(null, null, -1).resetTime(), 'Date#create | German | yesterday');
  dateEqual(Date.create('heute'), getRelativeDate(null, null, 0).resetTime(), 'Date#create | German | today');
  dateEqual(Date.create('morgen'), getRelativeDate(null, null, 1).resetTime(), 'Date#create | German | tomorrow');
  dateEqual(Date.create('übermorgen'), getRelativeDate(null, null, 2).resetTime(), 'Date#create | German | day after tomorrow');

  dateEqual(Date.create('letzte Woche'), getRelativeDate(null, null, -7), 'Date#create | German | Last week');
  dateEqual(Date.create('nächste Woche'), getRelativeDate(null, null, 7), 'Date#create | German | Next week');

  dateEqual(Date.create('letzter Monat'), getRelativeDate(null, -1), 'Date#create | German | last month letzter');
  dateEqual(Date.create('letzten Monat'), getRelativeDate(null, -1), 'Date#create | German | last month letzten');
  dateEqual(Date.create('nächster Monat'), getRelativeDate(null, 1), 'Date#create | German | Next month nachster');
  dateEqual(Date.create('nächsten Monat'), getRelativeDate(null, 1), 'Date#create | German | Next month nachsten');

  dateEqual(Date.create('letztes Jahr'), getRelativeDate(-1), 'Date#create | German | Last year');
  dateEqual(Date.create('nächsten Jahr'), getRelativeDate(1), 'Date#create | German | Next year');

  equal(Date.create('2011-08-25').format('{dd} {Month} {yyyy}'), '25 August 2011', 'Date#create | German | format');
  equal(Date.create('5 hours ago').relative(), '5 stunden vor', 'Date#create | German | relative format past');
  equal(Date.create('5 hours from now').relative(), 'in 5 stunden', 'Date#create | German | relative format future');



});
