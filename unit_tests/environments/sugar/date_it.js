test('Dates | Italian', function () {

  var now = new Date();
  Date.setLocale('it');


  dateEqual(Date.create('15 Maggio 2011'), new Date(2011, 4, 15), 'Date#create | basic Italian date');
  dateEqual(Date.create('Martedì, 5 Gennaio 2012'), new Date(2012, 0, 5), 'Date#create | Italian | 2012-01-05');
  dateEqual(Date.create('Maggio 2011'), new Date(2011, 4), 'Date#create | Italian | year and month');
  dateEqual(Date.create('15 Maggio'), new Date(now.getFullYear(), 4, 15), 'Date#create | Italian | month and date');
  dateEqual(Date.create('2011'), new Date(2011, 0), 'Date#create | Italian | year');
  dateEqual(Date.create('Maggio'), new Date(now.getFullYear(), 4), 'Date#create | Italian | month');
  dateEqual(Date.create('Lunedì'), getDateWithWeekdayAndOffset(1), 'Date#create | Italian | Monday');


  dateEqual(Date.create('un millisecondo fa'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Italian | one millisecond ago');
  dateEqual(Date.create('un secondo fa'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Italian | one second ago');
  dateEqual(Date.create('un minuto fa'), getRelativeDate(null, null, null, null, -1), 'Date#create | Italian | one minuto ago');
  dateEqual(Date.create("un'ora fa"), getRelativeDate(null, null, null, -1), 'Date#create | Italian | one hour ago');
  dateEqual(Date.create('un giorno fa'), getRelativeDate(null, null, -1), 'Date#create | Italian | one day ago');
  dateEqual(Date.create('una settimana fa'), getRelativeDate(null, null, -7), 'Date#create | Italian | one week ago');
  dateEqual(Date.create('un mese fa'), getRelativeDate(null, -1), 'Date#create | Italian | one month ago');
  dateEqual(Date.create('un anno fa'), getRelativeDate(-1), 'Date#create | Italian | one year ago');


  dateEqual(Date.create('5 millisecondi da adesso'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | Italian | danni | five milliseconds from now');
  dateEqual(Date.create('5 secondi da adesso'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Italian | danni | five second from now');
  dateEqual(Date.create('5 minuti da adesso'), getRelativeDate(null, null, null, null, 5), 'Date#create | Italian | danni | five minuto from now');
  dateEqual(Date.create('5 ore da adesso'), getRelativeDate(null, null, null, 5), 'Date#create | Italian | danni | five hour from now');
  dateEqual(Date.create('5 giorni da adesso'), getRelativeDate(null, null, 5), 'Date#create | Italian | danni | five day from now');
  dateEqual(Date.create('5 settimane da adesso'), getRelativeDate(null, null, 35), 'Date#create | Italian | danni | five weeks from now');
  dateEqual(Date.create('5 mesi da adesso'), getRelativeDate(null, 5), 'Date#create | Italian | danni | five months from now');
  dateEqual(Date.create('5 anni da adesso'), getRelativeDate(5), 'Date#create | Italian | danni | five years from now');


  dateEqual(Date.create('ieri'), getRelativeDate(null, null, -1).resetTime(), 'Date#create | Italian | yesterday');
  dateEqual(Date.create('oggi'), getRelativeDate(null, null, 0).resetTime(), 'Date#create | Italian | today');
  dateEqual(Date.create('domani'), getRelativeDate(null, null, 1).resetTime(), 'Date#create | Italian | tomorrow');
  dateEqual(Date.create('dopodomani'), getRelativeDate(null, null, 2).resetTime(), 'Date#create | Italian | day after tomorrow');

  dateEqual(Date.create('la settimana scorsa'), getRelativeDate(null, null, -7), 'Date#create | Italian | Last week');
  dateEqual(Date.create('la settimana prossima'), getRelativeDate(null, null, 7), 'Date#create | Italian | Next week');

  dateEqual(Date.create('il mese scorso'), getRelativeDate(null, -1), 'Date#create | Italian | last month');
  dateEqual(Date.create('il mese prossimo'), getRelativeDate(null, 1), 'Date#create | Italian | Next month');

  dateEqual(Date.create("l'anno scorso"), getRelativeDate(-1), 'Date#create | Italian | Last year');
  dateEqual(Date.create("l'anno prossimo"), getRelativeDate(1), 'Date#create | Italian | Next year');

  // No accents
  dateEqual(Date.create('Martedi, 5 Gennaio 2012'), new Date(2012, 0, 5), 'Date#create | Italian | no accents | 2012-01-05');
  dateEqual(Date.create('Lunedi'), getDateWithWeekdayAndOffset(1), 'Date#create | Italian | no accents | Monday');


  equal(Date.create('1999-11-04').format(), '4 novembre 1999', 'Date#create | Italian | format');
  equal(Date.create('2011-08-25').format('{dd} {Month} {yyyy}'), '25 Agosto 2011', 'Date#create | Italian | format');

  equal(Date.create('1 second ago').relative(), '1 secondo fa', 'Date#create | Italian | relative format past');
  equal(Date.create('1 minute ago').relative(), '1 minuto fa',  'Date#create | Italian | relative format past');
  equal(Date.create('1 hour ago').relative(),   '1 ora fa',     'Date#create | Italian | relative format past');
  equal(Date.create('1 day ago').relative(),    '1 giorno fa',    'Date#create | Italian | relative format past');
  equal(Date.create('1 week ago').relative(),   '1 settimana fa',  'Date#create | Italian | relative format past');
  equal(Date.create('1 month ago').relative(),  '1 mese fa',   'Date#create | Italian | relative format past');
  equal(Date.create('1 year ago').relative(),   '1 anno fa',     'Date#create | Italian | relative format past');

  equal(Date.create('2 seconds ago').relative(), '2 secondi fa', 'Date#create | Italian | relative format past');
  equal(Date.create('2 minutes ago').relative(), '2 minuti fa',  'Date#create | Italian | relative format past');
  equal(Date.create('2 hours ago').relative(),   '2 ore fa',     'Date#create | Italian | relative format past');
  equal(Date.create('2 days ago').relative(),    '2 giorni fa',    'Date#create | Italian | relative format past');
  equal(Date.create('2 weeks ago').relative(),   '2 settimane fa',  'Date#create | Italian | relative format past');
  equal(Date.create('2 months ago').relative(),  '2 mesi fa',   'Date#create | Italian | relative format past');
  equal(Date.create('2 years ago').relative(),   '2 anni fa',     'Date#create | Italian | relative format past');

  equal(Date.create('1 second from now').relative(), '1 secondo da adesso', 'Date#create | Italian | relative format future');
  equal(Date.create('1 minute from now').relative(), '1 minuto da adesso',  'Date#create | Italian | relative format future');
  equal(Date.create('1 hour from now').relative(),   '1 ora da adesso',     'Date#create | Italian | relative format future');
  equal(Date.create('1 day from now').relative(),    '1 giorno da adesso',    'Date#create | Italian | relative format future');
  equal(Date.create('1 week from now').relative(),   '1 settimana da adesso',  'Date#create | Italian | relative format future');
  equal(Date.create('1 month from now').relative(),  '1 mese da adesso',   'Date#create | Italian | relative format future');
  equal(Date.create('1 year from now').relative(),   '1 anno da adesso',     'Date#create | Italian | relative format future');

  equal(Date.create('5 second from now').relative(), '5 secondi da adesso', 'Date#create | Italian | relative format future');
  equal(Date.create('5 minutes from now').relative(),'5 minuti da adesso',  'Date#create | Italian | relative format future');
  equal(Date.create('5 hour from now').relative(),   '5 ore da adesso',     'Date#create | Italian | relative format future');
  equal(Date.create('5 day from now').relative(),    '5 giorni da adesso',    'Date#create | Italian | relative format future');
  equal(Date.create('5 week from now').relative(),   '1 mese da adesso',  'Date#create | Italian | relative format future');
  equal(Date.create('5 month from now').relative(),  '5 mesi da adesso',   'Date#create | Italian | relative format future');
  equal(Date.create('5 year from now').relative(),   '5 anni da adesso',     'Date#create | Italian | relative format future');



});
