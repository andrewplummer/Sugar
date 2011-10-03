test('Dates | Italian', function () {

  var now = new Date();
  Date.setLanguage('it');


  dateEqual(Date.create('15 Maggio 2011'), new Date(2011, 4, 15), 'Date#create | basic Italian date');
  dateEqual(Date.create('Martedì, 5 Gennaio 2012'), new Date(2012, 0, 5), 'Date#create | Italian | 2012-01-05');
  dateEqual(Date.create('Maggio 2011'), new Date(2011, 4), 'Date#create | Italian | year and month');
  dateEqual(Date.create('15 Maggio'), new Date(now.getFullYear(), 4, 15), 'Date#create | Italian | month and date');
  dateEqual(Date.create('2011'), new Date(2011, 0), 'Date#create | Italian | year');
  dateEqual(Date.create('Maggio'), new Date(now.getFullYear(), 4), 'Date#create | Italian | month');
  dateEqual(Date.create('Lunedì'), getDateWithWeekdayAndOffset(1), 'Date#create | Italian | Monday');


  dateEqual(Date.create('un millisecondo fa'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Italian | one millisecond ago');
  dateEqual(Date.create('un secondo fa'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Italian | one second ago');
  dateEqual(Date.create('un minuto fa'), getRelativeDate(null, null, null, null, -1), 'Date#create | Italian | one minute ago');
  dateEqual(Date.create('uno ora fa'), getRelativeDate(null, null, null, -1), 'Date#create | Italian | one hour ago');
  dateEqual(Date.create('un giorno fa'), getRelativeDate(null, null, -1), 'Date#create | Italian | one day ago');
  dateEqual(Date.create('una settimana fa'), getRelativeDate(null, null, -7), 'Date#create | Italian | one week ago');
  dateEqual(Date.create('un mese fa'), getRelativeDate(null, -1), 'Date#create | Italian | one month ago');
  dateEqual(Date.create('un anno fa'), getRelativeDate(-1), 'Date#create | Italian | one year ago');


  dateEqual(Date.create('5 millisecondi da adesso'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | Italian | dans | five milliseconds from now');
  dateEqual(Date.create('5 secondi da adesso'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Italian | dans | five second from now');
  dateEqual(Date.create('5 minuti da adesso'), getRelativeDate(null, null, null, null, 5), 'Date#create | Italian | dans | five minute from now');
  dateEqual(Date.create('5 ore da adesso'), getRelativeDate(null, null, null, 5), 'Date#create | Italian | dans | five hour from now');
  dateEqual(Date.create('5 giorni da adesso'), getRelativeDate(null, null, 5), 'Date#create | Italian | dans | five day from now');
  dateEqual(Date.create('5 settimane da adesso'), getRelativeDate(null, null, 35), 'Date#create | Italian | dans | five weeks from now');
  dateEqual(Date.create('5 mesi da adesso'), getRelativeDate(null, 5), 'Date#create | Italian | dans | five months from now');
  dateEqual(Date.create('5 anni da adesso'), getRelativeDate(5), 'Date#create | Italian | dans | five years from now');


  dateEqual(Date.create('ieri'), getRelativeDate(null, null, -1).resetTime(), 'Date#create | Italian | yesterday');
  dateEqual(Date.create('oggi'), getRelativeDate(null, null, 0).resetTime(), 'Date#create | Italian | today');
  dateEqual(Date.create('domani'), getRelativeDate(null, null, 1).resetTime(), 'Date#create | Italian | tomorrow');
  dateEqual(Date.create('dopodomani'), getRelativeDate(null, null, 2).resetTime(), 'Date#create | Italian | day after tomorrow');

  dateEqual(Date.create('la scorsa settimana'), getRelativeDate(null, null, -7), 'Date#create | Italian | Last week');
  dateEqual(Date.create('la prossima settimana'), getRelativeDate(null, null, 7), 'Date#create | Italian | Next week');

  dateEqual(Date.create('il mese scorso'), getRelativeDate(null, -1), 'Date#create | Italian | last month');
  dateEqual(Date.create('il prossimo mese'), getRelativeDate(null, 1), 'Date#create | Italian | Next month');

  dateEqual(Date.create("l'anno scorso"), getRelativeDate(-1), 'Date#create | Italian | Last year');
  dateEqual(Date.create("l'anno prossimo"), getRelativeDate(1), 'Date#create | Italian | Next year');

  equal(Date.create('2011-08-25').format('{dd} {Month} {yyyy}'), '25 Agosto 2011', 'Date#create | Italian | format');
  equal(Date.create('5 hours ago').relative(), '5 ore fa', 'Date#create | Italian | relative format past');
  equal(Date.create('5 hours from now').relative(), '5 ore da adesso', 'Date#create | Italian | relative format future');



});
