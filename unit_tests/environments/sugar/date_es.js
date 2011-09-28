test('Dates | Spanish', function () {

  var now = new Date();
  Date.setLanguage('es');


  dateEqual(Date.create('15 de mayo 2011'), new Date(2011, 4, 15), 'Date#create | basic Spanish date');
  dateEqual(Date.create('5 de enero de 2012'), new Date(2012, 0, 5), 'Date#create | Spanish | 2012-01-05');
  dateEqual(Date.create('mayo de 2011'), new Date(2011, 4), 'Date#create | Spanish | year and month');
  dateEqual(Date.create('15 de mayo'), new Date(now.getFullYear(), 4, 15), 'Date#create | Spanish | month and date');
  dateEqual(Date.create('2011'), new Date(2011, 0), 'Date#create | Spanish | year');
  dateEqual(Date.create('mayo'), new Date(now.getFullYear(), 4), 'Date#create | Spanish | month');
  dateEqual(Date.create('lunes'), getDateWithWeekdayAndOffset(1), 'Date#create | Spanish | Monday');


  dateEqual(Date.create('hace 1 milisegundo'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Spanish | one millisecond ago');
  dateEqual(Date.create('hace 1 segundo'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Spanish | one second ago');
  dateEqual(Date.create('hace 1 minuto'), getRelativeDate(null, null, null, null, -1), 'Date#create | Spanish | one minute ago');
  dateEqual(Date.create('hace 1 hora'), getRelativeDate(null, null, null, -1), 'Date#create | Spanish | one hour ago');
  dateEqual(Date.create('hace 1 día'), getRelativeDate(null, null, -1), 'Date#create | Spanish | one day ago');
  dateEqual(Date.create('hace 1 semana'), getRelativeDate(null, null, -7), 'Date#create | Spanish | one week');
  dateEqual(Date.create('hace 1 mes'), getRelativeDate(null, -1), 'Date#create | Spanish | one month ago');
  dateEqual(Date.create('hace 1 año'), getRelativeDate(-1), 'Date#create | Spanish | one year ago');


  dateEqual(Date.create('5 milisegundos de ahora'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | Spanish | five milliseconds from now');
  dateEqual(Date.create('5 segundos de ahora'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Spanish | five second from now');
  dateEqual(Date.create('5 minutos de ahora'), getRelativeDate(null, null, null, null, 5), 'Date#create | Spanish | five minute from now');
  dateEqual(Date.create('5 horas de ahora'), getRelativeDate(null, null, null, 5), 'Date#create | Spanish | five hour from now');
  dateEqual(Date.create('5 días de ahora'), getRelativeDate(null, null, 5), 'Date#create | Spanish | five day from now');
  dateEqual(Date.create('5 semanas de ahora'), getRelativeDate(null, null, 35), 'Date#create | Spanish | five weeks from now');
  dateEqual(Date.create('5 meses de ahora'), getRelativeDate(null, 5), 'Date#create | Spanish | five months from now');
  dateEqual(Date.create('5 años de ahora'), getRelativeDate(5), 'Date#create | Spanish | five years from now');


  dateEqual(Date.create('anteayer'), getRelativeDate(null, null, -2).resetTime(), 'Date#create | Spanish | 一昨日');
  dateEqual(Date.create('ayer'), getRelativeDate(null, null, -1).resetTime(), 'Date#create | Spanish | yesterday');
  dateEqual(Date.create('hoy'), getRelativeDate(null, null, 0).resetTime(), 'Date#create | Spanish | today');
  dateEqual(Date.create('mañana'), getRelativeDate(null, null, 1).resetTime(), 'Date#create | Spanish | tomorrow');

  dateEqual(Date.create('semana pasada'), getRelativeDate(null, null, -7), 'Date#create | Spanish | Last week');
  dateEqual(Date.create('semana próxima'), getRelativeDate(null, null, 7), 'Date#create | Spanish | Next week');

  dateEqual(Date.create('mes pasado'), getRelativeDate(null, -1), 'Date#create | Spanish | last month');
  dateEqual(Date.create('mes próximo'), getRelativeDate(null, 1), 'Date#create | Spanish | Next month');

  dateEqual(Date.create('el año pasado'), getRelativeDate(-1), 'Date#create | Spanish | Last year');
  dateEqual(Date.create('el próximo año'), getRelativeDate(1), 'Date#create | Spanish | Next year');

  equal(Date.create('2011-08-25').format('{dd} de {month} {yyyy}'), '25 de agosto 2011', 'Date#create | Spanish | format');
  equal(Date.create('5 hours ago').relative(), 'hace 5 horas', 'Date#create | Spanish | relative format past');
  equal(Date.create('5 hours from now').relative(), '5 horas de ahora', 'Date#create | Spanish | relative format future');



});
